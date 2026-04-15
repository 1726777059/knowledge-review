# 知识库导入项目记录

## 项目概况

- **目标**：构建系统架构设计师知识库，包含100条核心知识点 + 24篇论文资料
- **数据库**：Supabase PostgreSQL
- **主表**：`knowledge_points`（知识点表）

---

## 数据来源与导入状态

### 1. 100条核心知识点

| 项目 | 详情 |
|------|------|
| **来源** | 2026年上半年系统架构设计师重要知识点100条（学员版） |
| **脚本** | `import_100_knowledge_points.sql` |
| **状态** | ✅ 已完成导入（2026-04-13） |
| **记录数** | 100条 |
| **标题范围** | `1、信息系统的分类` ~ `100、知识产权分类` |
| **标签** | `资料:2026上半年100条` + 章节分类标签 |
| **重要警告** | ❗ **严禁重新执行**此脚本，会重复插入100条记录 |

---

### 2. 24篇论文知识点

| 项目 | 详情 |
|------|------|
| **来源** | `01_架构师_论文` 目录下的24篇论文 |
| **脚本** | `import_papers.sql` |
| **状态** | ⏳ 待导入 |
| **记录数** | 195条（24篇论文拆分为多个知识点） |
| **标签** | `资料:论文24篇` + 论文编号 + 章节标签 |
| **安全机制** | ✅ 使用 `WHERE NOT EXISTS` 防重复插入，可重复执行 |

---

## 标签规范

### 资料类型标签（互斥）

| 标签名 | 说明 | 对应数据 |
|--------|------|----------|
| `资料:2026上半年100条` | 100条核心知识点 | 100条 |
| `资料:论文24篇` | 24篇论文资料 | 195条 |

**注意**：这两个标签区分不同批次的数据源，不可混用。

---

## 关键操作流程

### 步骤1：为100条旧数据添加标签

**脚本**：`update_100_knowledge_points_tags.sql`

**作用**：给已导入的100条记录添加新标签 `资料:2026上半年100条`

**原理**：
```sql
UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '1、信息系统的分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];
```

**特点**：
- ✅ 通过 `title` 精确匹配已存在的记录
- ✅ `WHERE NOT tags @> ...` 防止重复添加标签
- ✅ **不影响** `user_progress` 等已编辑字段
- ✅ 可重复执行（幂等性）

---

### 步骤2：导入195条论文数据

**脚本**：`import_papers.sql`

**安全机制**：
```sql
INSERT INTO knowledge_points (title, content, tags, images, source_file)
SELECT '论文:01_xxx', 'content', ARRAY[...], '[]', 'file'
WHERE NOT EXISTS (
  SELECT 1 FROM knowledge_points WHERE title = '论文:01_xxx'
);
```

**特点**：
- ✅ 通过 `title` 去重，防止重复插入
- ✅ 可重复执行（幂等性）
- ✅ 标签已修正为 `资料:论文24篇`

---

## 生成脚本说明

### `extract_paper_knowledge.py`

- **路径**：`scripts/extract_paper_knowledge.py`
- **功能**：从 `01_架构师_论文` 目录提取论文知识点，生成 `import_papers.sql`
- **标签配置**：`tags = [f"论文:{paper_num}_{paper_title}", f"结构:{section['type']}", "资料:论文24篇"]`

---

## 重要注意事项

### 严禁操作

1. ❌ **不要重新执行** `import_100_knowledge_points.sql`
   - 会插入100条重复记录
   - 会导致 `title` 冲突（如果加了唯一约束）或数据冗余
   - 你已编辑的 `user_progress` 数据将无法关联到新记录

2. ❌ **不要删除后重新导入** 100条数据
   - 会丢失所有已编辑的掌握程度数据

### 推荐操作顺序

```bash
# 1. 为旧数据添加标签（只执行一次）
# Supabase SQL Editor 中执行：
\i update_100_knowledge_points_tags.sql

# 2. 导入新论文数据（可重复执行，直到全部导入）
\i import_papers.sql
```

---

## 数据验证

### 验证100条旧数据标签

```sql
-- 检查有多少条有 '资料:2026上半年100条' 标签
SELECT COUNT(*) as count
FROM knowledge_points
WHERE tags @> ARRAY['资料:2026上半年100条'];

-- 预期结果：100
```

### 验证195条论文数据

```sql
-- 检查论文标签
SELECT COUNT(*) as count
FROM knowledge_points
WHERE tags @> ARRAY['资料:论文24篇'];

-- 预期结果：195
```

### 检查是否有重复标题

```sql
-- 检查重复的 title（应该为0）
SELECT title, COUNT(*) as cnt
FROM knowledge_points
GROUP BY title
HAVING COUNT(*) > 1;
```

---

## 文件名对照表

| 文件名 | 类型 | 用途 | 是否可重复执行 |
|--------|------|------|----------------|
| `import_100_knowledge_points.sql` | INSERT | 原始100条导入（首次使用） | ❌ 否（会重复插入） |
| `update_100_knowledge_points_tags.sql` | UPDATE | 为100条旧数据加标签 | ✅ 是（幂等） |
| `import_papers.sql` | INSERT | 导入195条论文数据 | ✅ 是（防重复） |
| `extract_paper_knowledge.py` | Python脚本 | 生成 `import_papers.sql` | - |

---

## 技术细节

### 数组去重判断

```sql
-- 判断 tags 是否包含某个标签
WHERE tags @> ARRAY['资料:2026上半年100条']

-- 含义：tags 数组包含（包含于）这个数组中的所有元素
```

### 数组追加

```sql
-- 追加标签（如果不存在）
SET tags = array_append(tags, '资料:2026上半年100条')
```

### 幂等性保证

通过 `WHERE NOT tags @> ...` 条件，确保：
- 第一次执行：标签不存在 → 执行 `UPDATE` → 添加标签
- 第二次执行：标签已存在 → `WHERE` 条件不满足 → 跳过（影响行数 = 0）

---

## 生成时间

- **100条标签更新脚本**：2026-04-15
- **论文导入脚本**：2026-04-15（标签已修正）

---

## 问题记录

### 问题1：标签不一致

- **现象**：`import_papers.sql` 中标签为 `资料:论文笔记`，应为 `资料:论文24篇`
- **解决**：修改 `extract_paper_knowledge.py` 第173行，重新生成脚本
- **状态**：✅ 已修复

---

## 下一步计划

- [ ] 执行 `update_100_knowledge_points_tags.sql`
- [ ] 执行 `import_papers.sql` 导入论文数据
- [ ] 验证数据完整性（总数 = 295，100 + 195）
- [ ] 验证标签正确性（`资料:2026上半年100条` 100条，`资料:论文24篇` 195条）
- [ ] 检查无重复记录

---

## Git 推送配置

**重要**：推送时使用 SSH URL，避免 HTTPS 端口 443 连接问题。

**SSH 远程地址**：`git@github.com:1726777059/knowledge-review.git`

**推送命令**：
```bash
git push git@github.com:1726777059/knowledge-review.git main
```

---

## 部署配置

**问题**：启用 `output: 'export'` 静态导出后，动态页面 `/knowledge/[id]` 无法在构建时预生成（环境变量不可用），导致 404。

**解决方案**：
1. 移除 `output: 'export'` 配置
2. 使用 Next.js 默认的 SSR 模式
3. GitHub Actions 构建时会注入 `secrets`，动态路由正常工作

**当前配置** (`next.config.ts`)：
```ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: '/knowledge-review',
  // 不使用 output: 'export'
};
```

**部署状态**：GitHub Pages (https://1726777059.github.io/knowledge-review/)

---

**最后更新**：2026-04-15
**维护人**：系统架构师知识库项目组
