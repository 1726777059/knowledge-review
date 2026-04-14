export interface KnowledgePoint {
  id: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  source_file: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  knowledge_id: string;
  mastery_level: number;
  importance_level: number;
  last_reviewed_at: string | null;
  review_count: number;
  next_review_at: string | null;
  user_id: string;
  created_at: string;
}

export interface KnowledgePointWithProgress extends KnowledgePoint {
  user_progress: UserProgress | null;
}

export type ReviewStrategy = 
  | 'importance'      // 按重要程度
  | 'forgetting-curve' // 按遗忘曲线
  | 'ebbinghaus'       // 艾宾浩斯
  | 'hybrid';          // 混合策略

export interface ReviewFilter {
  strategy: ReviewStrategy;
  minMastery?: number;
  maxMastery?: number;
  tags?: string[];
  searchQuery?: string;
}