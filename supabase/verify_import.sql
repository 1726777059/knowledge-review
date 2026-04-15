-- ============================================================
-- 知识库数据验证脚本
-- 用于检查导入是否成功
-- 生成时间: 2026-04-15
-- ============================================================

-- ========== 验证1: 检查总记录数 ==========

SELECT
  COUNT(*) as total_count
FROM knowledge_points;

-- 预期：295 (100 + 195)


-- ========== 验证2: 检查100条旧数据的标签 ==========

SELECT
  COUNT(*) as count_100
FROM knowledge_points
WHERE tags @> ARRAY['资料:2026上半年100条'];

-- 预期：100


-- ========== 验证3: 检查195条论文数据的标签 ==========

SELECT
  COUNT(*) as count_papers
FROM knowledge_points
WHERE tags @> ARRAY['资料:论文24篇'];

-- 预期：195


-- ========== 验证4: 检查是否有重复标题 ==========

SELECT
  title,
  COUNT(*) as duplicate_count
FROM knowledge_points
GROUP BY title
HAVING COUNT(*) > 1;

-- 预期：0行（无重复）


-- ========== 验证5: 列出100条旧数据（样本） ==========

SELECT id, title, tags, user_progress
FROM knowledge_points
WHERE tags @> ARRAY['资料:2026上半年100条']
ORDER BY title
LIMIT 5;

-- 应该看到5条记录，tags包含'资料:2026上半年100条'


-- ========== 验证6: 列出论文数据（样本） ==========

SELECT id, title, tags, user_progress
FROM knowledge_points
WHERE tags @> ARRAY['资料:论文24篇']
ORDER BY title
LIMIT 5;

-- 应该看到5条记录，tags包含'资料:论文24篇'


-- ========== 验证7: 检查标签分布 ==========

SELECT
  unnest(tags) as tag,
  COUNT(*) as count
FROM knowledge_points
GROUP BY tag
ORDER BY count DESC;

-- 查看所有标签及其计数


-- ========== 验证8: 检查user_progress是否有数据 ==========

SELECT
  COUNT(*) as with_progress
FROM knowledge_points
WHERE user_progress IS NOT NULL
  AND user_progress != '{}'::jsonb;

-- 应该看到100条（旧数据有掌握程度）


-- ========== 验证9: 检查是否有遗漏的数据 ==========

-- 检查100条旧数据中哪些没有标签
SELECT id, title
FROM knowledge_points
WHERE title IN (
  '1、信息系统的分类',
  '2、专家系统【ES】',
  '3、电子政务',
  '4、企业集成分类',
  '5、WBS分解的基本要求',
  '6、软件工具分类',
  '7、结构化开发方法',
  '8、原型法开发方法',
  '9、面向对象方法',
  '10、面向服务的方法'
  -- ... 简写，实际应列出全部100条
)
AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- 预期：0行（全部都有标签）


-- ============================================================
-- 执行说明
-- ============================================================
-- 1. 依次执行以上查询
-- 2. 对比预期结果
-- 3. 如有异常，检查对应问题
-- ============================================================
