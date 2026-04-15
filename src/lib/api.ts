import { supabase, DEFAULT_USER_ID } from './supabase';
import type { KnowledgePoint, UserProgress, KnowledgePointWithProgress, ReviewStrategy } from './types';

// 多层缓存系统
interface CacheStore {
  allPoints: KnowledgePointWithProgress[] | null;
  allPointsTime: number;
  pointById: Map<string, KnowledgePointWithProgress>;
  tags: string[] | null;
  tagsTime: number;
}

const cache: CacheStore = {
  allPoints: null,
  allPointsTime: 0,
  pointById: new Map(),
  tags: null,
  tagsTime: 0,
};

const CACHE_TTL = 30000; // 30秒缓存
const POINT_CACHE_TTL = 60000; // 单条记录缓存60秒
const TAGS_CACHE_TTL = 120000; // 标签缓存120秒

export async function getAllKnowledgePoints(): Promise<KnowledgePointWithProgress[]> {
  // 检查缓存
  if (cache.allPoints && Date.now() - cache.allPointsTime < CACHE_TTL) {
    return cache.allPoints;
  }

  const { data: points, error } = await supabase
    .from('knowledge_points')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID);

  const result = (points || []).map(point => {
    const withProgress = {
      ...point,
      user_progress: progress?.find(p => p.knowledge_id === point.id) || null
    };
    // 同时缓存单条记录
    cache.pointById.set(point.id, withProgress);
    return withProgress;
  });

  // 缓存标签列表
  const tagSet = new Set<string>();
  result.forEach(point => {
    (point.tags || []).forEach((tag: string) => tagSet.add(tag));
  });
  cache.tags = Array.from(tagSet).sort();
  cache.tagsTime = Date.now();

  // 更新缓存
  cache.allPoints = result;
  cache.allPointsTime = Date.now();

  return result;
}

// 清除缓存（数据更新后调用）
export function clearCache() {
  cache.allPoints = null;
  cache.allPointsTime = 0;
  cache.pointById.clear();
  cache.tags = null;
}

// 可选：手动预热缓存
export async function warmupCache(): Promise<void> {
  await getAllKnowledgePoints();
}

export async function getKnowledgePoint(id: string): Promise<KnowledgePointWithProgress | null> {
  // 检查单条缓存
  const cached = cache.pointById.get(id);
  if (cached && Date.now() - cache.allPointsTime < POINT_CACHE_TTL) {
    return cached;
  }

  // 检查全量缓存
  if (cache.allPoints && Date.now() - cache.allPointsTime < CACHE_TTL) {
    return cache.allPoints.find(p => p.id === id) || null;
  }

  // 缓存未命中，从数据库查询
  const { data: point, error } = await supabase
    .from('knowledge_points')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('knowledge_id', id)
    .eq('user_id', DEFAULT_USER_ID)
    .single();

  const result = { ...point, user_progress: progress || null };
  
  // 缓存结果
  cache.pointById.set(id, result);
  
  return result;
}

export async function updateKnowledgePoint(
  id: string, 
  updates: Partial<Pick<KnowledgePoint, 'title' | 'content' | 'images' | 'tags'>>
): Promise<KnowledgePoint> {
  const { data, error } = await supabase
    .from('knowledge_points')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upsertProgress(
  knowledgeId: string,
  updates: Partial<Pick<UserProgress, 'mastery_level' | 'importance_level' | 'last_reviewed_at' | 'review_count' | 'next_review_at'>>
): Promise<UserProgress> {
  const existing = await supabase
    .from('user_progress')
    .select('*')
    .eq('knowledge_id', knowledgeId)
    .eq('user_id', DEFAULT_USER_ID)
    .single();

  if (existing.data) {
    const { data, error } = await supabase
      .from('user_progress')
      .update({ ...updates, last_reviewed_at: new Date().toISOString() })
      .eq('id', existing.data.id)
      .select()
      .single();
    if (error) throw error;
    clearCache(); // 清除缓存
    return data;
  } else {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        knowledge_id: knowledgeId,
        user_id: DEFAULT_USER_ID,
        ...updates,
        last_reviewed_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    clearCache(); // 清除缓存
    return data;
  }
}

export async function getReviewQueue(strategy: ReviewStrategy): Promise<KnowledgePointWithProgress[]> {
  const all = await getAllKnowledgePoints();
  
  switch (strategy) {
    case 'importance':
      return all.sort((a, b) => {
        const impA = a.user_progress?.importance_level ?? 3;
        const impB = b.user_progress?.importance_level ?? 3;
        if (impB !== impA) return impB - impA;
        const masteryA = a.user_progress?.mastery_level ?? 0;
        const masteryB = b.user_progress?.mastery_level ?? 0;
        return masteryA - masteryB;
      });

    case 'forgetting-curve':
      return all
        .filter(k => k.user_progress)
        .sort((a, b) => {
          const lastA = a.user_progress?.last_reviewed_at || '1970-01-01';
          const lastB = b.user_progress?.last_reviewed_at || '1970-01-01';
          return lastA.localeCompare(lastB);
        });

    case 'ebbinghaus':
      return all.filter(k => {
        const next = k.user_progress?.next_review_at;
        if (!next) return true;
        return new Date(next) <= new Date();
      });

    case 'hybrid':
    default:
      return all.sort((a, b) => {
        const impA = (a.user_progress?.importance_level ?? 3) * 0.3;
        const impB = (b.user_progress?.importance_level ?? 3) * 0.3;
        const masteryA = ((a.user_progress?.mastery_level ?? 0) / 5) * 0.4;
        const masteryB = ((b.user_progress?.mastery_level ?? 0) / 5) * 0.4;
        const lastA = new Date(a.user_progress?.last_reviewed_at || '1970-01-01').getTime();
        const lastB = new Date(b.user_progress?.last_reviewed_at || '1970-01-01').getTime();
        const decayA = (Date.now() - lastA) / (1000 * 60 * 60 * 24) * 0.3;
        const decayB = (Date.now() - lastB) / (1000 * 60 * 60 * 24) * 0.3;
        return (impA + masteryA + decayA) - (impB + masteryB + decayB);
      });
  }
}

export async function recordReview(knowledgeId: string, masteryLevel: number): Promise<void> {
  const progress = await supabase
    .from('user_progress')
    .select('*')
    .eq('knowledge_id', knowledgeId)
    .eq('user_id', DEFAULT_USER_ID)
    .single();

  const count = (progress.data?.review_count || 0) + 1;
  const baseInterval = 1;
  const intervalDays = baseInterval * Math.pow(1.5, count - 1);
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + Math.min(intervalDays, 30));

  await upsertProgress(knowledgeId, {
    mastery_level: masteryLevel,
    review_count: count,
    next_review_at: nextReview.toISOString()
  });
}

export async function getAllTags(): Promise<string[]> {
  // 使用缓存的标签列表（随全量数据一起缓存）
  if (cache.tags && Date.now() - cache.tagsTime < TAGS_CACHE_TTL) {
    return cache.tags;
  }
  
  // 缓存未命中，从数据库获取
  const { data } = await supabase
    .from('knowledge_points')
    .select('tags');

  const tagSet = new Set<string>();
  data?.forEach(point => {
    (point.tags || []).forEach((tag: string) => tagSet.add(tag));
  });
  
  cache.tags = Array.from(tagSet).sort();
  cache.tagsTime = Date.now();
  
  return cache.tags;
}

export async function getStatistics(): Promise<{
  total: number;
  mastered: number;
  learning: number;
  notStarted: number;
  dueReview: number;
}> {
  const all = await getAllKnowledgePoints();
  const mastered = all.filter(k => (k.user_progress?.mastery_level || 0) >= 4).length;
  const learning = all.filter(k => (k.user_progress?.mastery_level || 0) > 0 && (k.user_progress?.mastery_level || 0) < 4).length;
  const notStarted = all.filter(k => !k.user_progress || k.user_progress.mastery_level === 0).length;
  const dueReview = all.filter(k => {
    const next = k.user_progress?.next_review_at;
    if (!next) return false;
    return new Date(next) <= new Date();
  }).length;

  return { total: all.length, mastered, learning, notStarted, dueReview };
}

// ==================== 论文闯关进度 API ====================

export interface PaperProgress {
  id: string;
  user_id: string;
  level_id: number;
  status: 'not_started' | 'completed' | 'forgotten';
  wrong_count: number;
  last_attempt: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaperStatistics {
  total: number;
  completed: number;
  weakCount: number;
}

// 论文闯关数据缓存
interface PaperCacheStore {
  progress: PaperProgress[] | null;
  progressTime: number;
}

const paperCache: PaperCacheStore = {
  progress: null,
  progressTime: 0,
};

const PAPER_CACHE_TTL = 30000; // 30秒缓存

export async function getPaperProgress(): Promise<PaperProgress[]> {
  if (paperCache.progress && Date.now() - paperCache.progressTime < PAPER_CACHE_TTL) {
    return paperCache.progress;
  }

  const { data, error } = await supabase
    .from('paper_progress')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID)
    .order('level_id', { ascending: true });

  if (error) throw error;

  paperCache.progress = data || [];
  paperCache.progressTime = Date.now();

  return paperCache.progress;
}

export async function getPaperStatistics(): Promise<PaperStatistics> {
  const progress = await getPaperProgress();
  const completed = progress.filter(p => p.status === 'completed').length;
  const weakCount = progress.filter(p => p.status === 'forgotten').length;

  return {
    total: 24,
    completed,
    weakCount,
  };
}

export async function updatePaperProgress(
  levelId: number,
  updates: Partial<Pick<PaperProgress, 'status' | 'wrong_count'>>
): Promise<PaperProgress> {
  const existing = await supabase
    .from('paper_progress')
    .select('*')
    .eq('level_id', levelId)
    .eq('user_id', DEFAULT_USER_ID)
    .single();

  const now = new Date().toISOString();
  const isCompleted = updates.status === 'completed';

  if (existing.data) {
    const { data, error } = await supabase
      .from('paper_progress')
      .update({
        ...updates,
        last_attempt: now,
        completed_at: isCompleted ? now : existing.data.completed_at,
        updated_at: now,
      })
      .eq('id', existing.data.id)
      .select()
      .single();

    if (error) throw error;
    clearPaperCache();
    return data;
  } else {
    const { data, error } = await supabase
      .from('paper_progress')
      .insert({
        level_id: levelId,
        user_id: DEFAULT_USER_ID,
        ...updates,
        last_attempt: now,
        completed_at: isCompleted ? now : null,
      })
      .select()
      .single();

    if (error) throw error;
    clearPaperCache();
    return data;
  }
}

export function clearPaperCache() {
  paperCache.progress = null;
  paperCache.progressTime = 0;
}