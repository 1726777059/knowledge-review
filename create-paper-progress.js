import pg from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@bcstbausmqbtkudwkcjp.supabase.co:5432/postgres',
});

async function execSQL() {
  const client = await pool.connect();
  try {
    console.log('=== 执行 create_paper_progress.sql ===\n');

    const sql = `
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
    `;

    await client.query(sql);
    console.log('✅ paper_progress 表创建成功！');

    // 验证
    const { rows } = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'paper_progress'");
    console.log('验证结果:', rows.length > 0 ? '✅ 表已存在' : '❌ 表不存在');
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

execSQL();
