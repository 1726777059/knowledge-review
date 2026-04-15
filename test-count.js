import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcstbausmqbtkudwkcjp.supabase.co';
const supabaseAnonKey = 'sb_publishable_adMDxgqReOKYwRHlp9BHpQ_N5ggmYGQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function countAll() {
  console.log('=== 统计数据量 ===\n');

  const { count: pointsCount, error: pointsError } = await supabase
    .from('knowledge_points')
    .select('*', { count: 'exact', head: true });

  console.log(`knowledge_points 总条数: ${pointsCount || 0}`);

  if (pointsError) {
    console.error('查询失败:', pointsError.message);
  }

  const { count: progressCount, error: progressError } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true });

  console.log(`user_progress 总条数: ${progressCount || 0}`);

  if (progressError) {
    console.error('查询失败:', progressError.message);
  }

  // 列出所有 titles
  const { data: allPoints } = await supabase
    .from('knowledge_points')
    .select('id, title')
    .order('created_at', { ascending: true });

  console.log('\n所有知识点标题:');
  allPoints?.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));
}

countAll();
