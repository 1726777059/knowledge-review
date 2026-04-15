-- 论文闯关进度表
-- 用于记录用户在论文场景闯关中的学习进度

CREATE TABLE IF NOT EXISTS paper_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  level_id INTEGER NOT NULL CHECK (level_id >= 1 AND level_id <= 24),
  status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'completed', 'forgotten')),
  wrong_count INTEGER DEFAULT 0,
  last_attempt TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

-- 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_paper_progress_user ON paper_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_progress_status ON paper_progress(user_id, status);

-- RLS 策略
ALTER TABLE paper_progress ENABLE ROW LEVEL SECURITY;

-- 简单策略：允许所有操作（单用户模式）
CREATE POLICY "Allow all for paper_progress" ON paper_progress
    FOR ALL USING (true) WITH CHECK (true);
