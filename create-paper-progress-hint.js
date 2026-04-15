import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcstbausmqbtkudwkcjp.supabase.co';
const supabaseAnonKey = 'sb_publishable_adMDxgqReOKYwRHlp9BHpQ_N5ggmYGQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTableViaRPC() {
  console.log('=== 尝试通过 RPC 创建表 ===\n');

  // Supabase 不支持直接执行 DDL 的 RPC，需要改用其他方式
  // 方案：使用 SQL 执行 API（需要 service_role key）

  console.log('❌ 无法通过 anon key 执行 DDL 语句');
  console.log('\n请手动执行以下 SQL：\n');
  console.log(`
-- 论文闯关进度表
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

CREATE INDEX IF NOT EXISTS idx_paper_progress_user ON paper_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_progress_status ON paper_progress(user_id, status);

ALTER TABLE paper_progress ENABLE ROW LEVEL SECURITY;

-- 简单策略：允许所有操作
CREATE POLICY "Allow all for paper_progress" ON paper_progress
    FOR ALL USING (true) WITH CHECK (true);
  `);

  console.log('\n执行方式：');
  console.log('1. 打开 Supabase 控制台: https://bcstbausmqbtkudwkcjp.supabase.co');
  console.log('2. 进入 SQL Editor');
  console.log('3. 粘贴上面的 SQL 并执行');
}

createTableViaRPC();
