import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcstbausmqbtkudwkcjp.supabase.co';
const supabaseAnonKey = 'sb_publishable_adMDxgqReOKYwRHlp9BHpQ_N5ggmYGQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('=== 测试 Supabase 连接 ===\n');

  // 测试 knowledge_points 表
  try {
    const { data: points, error: pointsError } = await supabase
      .from('knowledge_points')
      .select('*')
      .limit(5);

    console.log('✅ knowledge_points 查询成功:');
    console.log(`   总条数: ${points?.length || 0}`);
    console.log(`   前5条:`, points?.map(p => ({ id: p.id, title: p.title })) || []);
    if (pointsError) throw pointsError;
  } catch (error) {
    console.error('❌ knowledge_points 查询失败:', error.message);
  }

  console.log('\n---\n');

  // 测试 user_progress 表
  try {
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', 'default')
      .limit(5);

    console.log('✅ user_progress 查询成功:');
    console.log(`   总条数: ${progress?.length || 0}`);
    console.log(`   前5条:`, progress?.map(p => ({ id: p.id, knowledge_id: p.knowledge_id })) || []);
    if (progressError) throw progressError;
  } catch (error) {
    console.error('❌ user_progress 查询失败:', error.message);
  }
}

test().then(() => console.log('\n✅ 测试完成'));
