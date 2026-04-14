# Knowledge Review - 项目记忆

> 自动生成时间：2026-04-14
> 关联会话：GitHub Pages 静态部署调试

---

## 📋 项目概述

**项目名称**：Knowledge Review（知识库复习系统）
**项目类型**：Next.js 16 + TypeScript + Supabase
**部署目标**：GitHub Pages（静态导出）
**访问地址**：https://1726777059.github.io/knowledge-review/

---

## 🎯 核心功能

- 知识点列表展示（支持标签筛选）
- 知识点详情页（Markdown 渲染）
- 掌握程度滑块（记录复习进度）
- 重要性星级评分
- 知识点编辑功能
- Supabase 数据库持久化

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.2.3 | React 框架（App Router） |
| React | 19.2.4 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 样式系统 |
| Supabase | ^2.103.0 | 后端服务（数据库 + API） |
| React Markdown | 10.1.0 | Markdown 渲染 |
| Turbopack | 内置 | 开发/构建优化 |

---

## 📦 项目结构

```
knowledge-review/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页（知识点列表）
│   │   └── knowledge/
│   │       └── [id]/
│   │           ├── page.tsx              # Server 组件
│   │           └── KnowledgeDetailClient.tsx  # Client 组件
│   ├── components/
│   │   ├── MarkdownRenderer.tsx # Markdown 渲染器
│   │   ├── RatingComponents.tsx # 评分组件（滑块/星级）
│   │   └── SearchAndFilter.tsx  # 搜索过滤组件
│   └── lib/
│       ├── api.ts              # Supabase API 函数
│       ├── supabase.ts         # Supabase 客户端初始化
│       └── types.ts            # TypeScript 类型定义
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── next.config.ts              # Next.js 配置
├── supabase/
│   └── import_100_knowledge_points.sql  # 数据导入脚本
└── package.json
```

---

## 🔗 外部服务

### Supabase 配置
- **项目 URL**：https://bcstbausmqbtkudwkcjp.supabase.co
- **环境变量**：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### GitHub 仓库
- **仓库地址**：https://github.com/1726777059/knowledge-review
- **分支**：main
- **Secrets**：已配置 Supabase 环境变量

---

## 🚀 部署配置

### GitHub Pages + 静态导出

**模式**：`output: 'export'`（生成静态 HTML）
**优势**：
- 免费托管（GitHub Pages）
- 无需服务器成本
- 全球 CDN 加速

**限制**：
- 必须预生成所有页面
- 动态路由需实现 `generateStaticParams()`
- Client 组件无法在 build 阶段访问环境变量

---

## 🐛 问题记录与解决方案

### 问题 1：动态路由缺少 `generateStaticParams()`

**错误信息**：
```
Error: Page "/knowledge/[id]" is missing "generateStaticParams()"
so it cannot be used with "output: export" config.
```

**原因**：Next.js 静态导出模式下，动态路由需要预先知道所有可能的 URL。

**解决方案**：
在 `src/app/knowledge/[id]/page.tsx` 添加：
- `generateStaticParams()` 函数（Server Component）
- `export const dynamicParams = false`

---

### 问题 2：`'use client'` 组件不能使用 `generateStaticParams()`

**错误信息**：
```
Error: Page "/knowledge/[id]" is missing "generateStaticParams()"
```

**原因**：`'use client'` 组件不能导出 `generateStaticParams()`（仅在 Server Component 中有效）。

**解决方案**：
分离组件架构：
- **Server Component**：`page.tsx` → 导出 `generateStaticParams()` 和默认 `<KnowledgeDetailClient />`
- **Client Component**：`KnowledgeDetailClient.tsx` → 处理所有交互逻辑

---

### 问题 3：构建时报错 `supabaseUrl is required`

**错误信息**：
```
Error: supabaseUrl is required.
    at .next/server/chunks/ssr/src_app_knowledge_[id]_059mz_e._.js
```

**原因**：
- `generateStaticParams()` 在构建时（build time）运行
- 需要访问 `NEXT_PUBLIC_SUPABASE_URL` 环境变量
- GitHub Actions 默认不向 build 步骤注入 Secrets

**解决方案**：

1. **`page.tsx` 添加环境检查**：
```typescript
export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase URL 未配置，跳过静态生成');
    return [];
  }
  // ...
}
```

2. **`.github/workflows/deploy.yml` 注入环境变量**：
```yaml
- name: Build
  run: |
    NEXT_PUBLIC_SUPABASE_URL="${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}" \
    npm run build
```

---

## 📝 重要文件变更记录

| 文件 | 变更 | 提交哈希 |
|------|------|----------|
| `next.config.ts` | 添加 `output: 'export'` 和 `trailingSlash: true` | 42becba |
| `src/app/knowledge/[id]/page.tsx` | 分离 Server/Client 组件，添加 `generateStaticParams()` | a8b9fbf → bcc60cd |
| `src/app/knowledge/[id]/KnowledgeDetailClient.tsx` | 新建 Client 组件（原页面逻辑） | a8b9fbf |
| `.github/workflows/deploy.yml` | build 步骤注入环境变量 | bcc60cd |

---

## 🔐 环境变量清单

### 本地开发（`.env.local`）
```bash
NEXT_PUBLIC_SUPABASE_URL=https://bcstbausmqbtkudwkcjp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_adMDxgqReOKYwRHlp9BHpQ_N5ggmYGQ
```

### GitHub Actions Secrets
| Secret 名称 | 值 | 状态 |
|-------------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bcstbausmqbtkudwkcjp.supabase.co` | ✅ 已配置 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_adMDxgqReOKYwRHlp9BHpQ_N5ggmYGQ` | ✅ 已配置 |

---

## ✅ 最终成果

- ✅ 静态导出配置完成
- ✅ 动态路由问题解决
- ✅ Server/Client 组件分离
- ✅ 构建环境变量注入
- ✅ GitHub Pages 成功部署

**访问地址**：https://1726777059.github.io/knowledge-review/

---

## 📚 相关文档

- [Next.js 静态导出文档](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [generateStaticParams API](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-and-client-components)

---

## 🔄 后续优化建议

1. **增量静态再生（ISR）**：如果需要频繁更新数据，考虑迁移到 Vercel 并使用 `revalidate` 参数
2. **缓存策略**：为 API 请求添加缓存以减少 Supabase 查询
3. **离线支持**：添加 Service Worker 实现 PWA
4. **错误边界**：为动态路由添加 404 页面和错误处理

---

> **最后更新**：2026-04-14
> **版本**：v0.1.0
> **状态**：✅ 已部署成功
