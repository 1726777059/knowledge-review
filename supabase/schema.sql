-- 知识点主表
CREATE TABLE IF NOT EXISTS knowledge_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    images JSONB DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    source_file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户进度表
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    knowledge_id UUID NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
    importance_level INTEGER DEFAULT 3 CHECK (importance_level >= 1 AND importance_level <= 5),
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0,
    next_review_at TIMESTAMP WITH TIME ZONE,
    user_id TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(knowledge_id, user_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_knowledge_tags ON knowledge_points USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_created ON knowledge_points(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_next_review ON user_progress(next_review_at) WHERE next_review_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_progress_knowledge ON user_progress(knowledge_id);

-- 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_knowledge_points_updated_at
    BEFORE UPDATE ON knowledge_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS 策略（单用户模式，设置为完全开放）
ALTER TABLE knowledge_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 对于单用户使用，我们可以禁用 RLS 或者创建一个简单策略
CREATE POLICY "Allow all for knowledge_points" ON knowledge_points
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for user_progress" ON user_progress
    FOR ALL USING (true) WITH CHECK (true);