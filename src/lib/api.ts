import { supabase, DEFAULT_USER_ID } from './supabase';
import type { KnowledgePoint, UserProgress, KnowledgePointWithProgress, ReviewStrategy } from './types';

export async function getAllKnowledgePoints(): Promise<KnowledgePointWithProgress[]> {
  const { data: points, error } = await supabase
    .from('knowledge_points')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', DEFAULT_USER_ID);

  return (points || []).map(point => ({
    ...point,
    user_progress: progress?.find(p => p.knowledge_id === point.id) || null
  }));
}

export async function getKnowledgePoint(id: string): Promise<KnowledgePointWithProgress | null> {
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

  return { ...point, user_progress: progress || null };
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
  const { data } = await supabase
    .from('knowledge_points')
    .select('tags');

  const tagSet = new Set<string>();
  data?.forEach(point => {
    (point.tags || []).forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
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