# 项目代码地图 — 陈灼个人网站

> 每次读到这个文件就能快速定位要修改的代码，不需要大量探索。

## 技术栈

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** + **Ant Design 5**（组件库）
- **Framer Motion**（动画）
- **Prisma** + PostgreSQL（数据库）
- **next-themes**（暗色/亮色主题）
- **next-intl** 风格的 i18n（自建）
- **OpenAI**（AI 摘要/聊天）+ **Qdrant**（向量搜索）
- 部署：Vercel

## 常用命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 构建
pnpm lint:fix     # Lint 修复
pnpm db:studio    # Prisma Studio（本地数据库）
pnpm db:migrate   # 数据库迁移
```

## Pre-commit Hooks

项目使用 husky + lint-staged，提交时自动运行：
- ESLint（`--max-warnings=0`，零警告策略）
- Prettier 格式化
- 注意：有 `react-hooks/immutability` 插件，**禁止在 hooks 回调中直接 mutate ref 值**，canvas 动画代码需放在 `useEffect` 内部用局部变量

---

## 目录结构速查

```
app/                    → 页面和 API 路由（Next.js App Router）
components/             → React 组件
components/home/        → 首页专用组件（粒子背景、卡片、按钮）
components/admin/       → 后台管理组件
lib/                    → 工具函数、服务端逻辑
lib/i18n/               → 多语言翻译文件
hooks/                  → 自定义 React Hooks
prisma/                 → 数据库 Schema 和迁移
public/                 → 静态资源
public/projects/        → 项目截图图片
content/                → Markdown 内容（简历等）
scripts/                → 脚本工具（发布文章、向量化等）
```

---

## 页面 → 文件对照

| 页面 URL | 页面文件 | 核心组件 |
|----------|---------|---------|
| `/` | `app/page.tsx` | `components/HomePage.tsx` |
| `/blog` | `app/blog/page.tsx` | `components/BlogListNew.tsx`, `BlogSidebar.tsx` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | `MarkdownContent.tsx`, `CommentSection.tsx`, `ArticleHeader.tsx` |
| `/ai-chat` | `app/ai-chat/page.tsx` | `components/AIChatBot.tsx` |
| `/resume` | `app/resume/page.tsx` | 直接渲染，简历内容在 `content/resume.md` |
| `/admin` | `app/admin/page.tsx` | `components/admin/PostManagement.tsx`, `CommentManagement.tsx` |
| `/login` | `app/login/page.tsx` | `components/AdminLogin.tsx` |
| `/register` | `app/register/page.tsx` | 注册页 |
| `/profile` | `app/profile/page.tsx` | 用户资料页 |

---

## 功能模块 → 要改哪些文件

### 1. 首页（Hero + 精选作品 + 文章 + Footer）

| 改什么 | 改哪里 |
|-------|-------|
| 首页整体布局、区块排列 | `components/HomePage.tsx`（~705 行） |
| 精选作品数据（标题/描述/链接） | `components/HomePage.tsx` → `featuredProjects` 数组 |
| 作品卡片样式 | `components/home/ProjectCard.tsx` |
| 粒子+流星动画背景 | `components/home/ParticleBackground.tsx` |
| 发光卡片效果 | `components/home/GlowCard.tsx` |
| 磁吸按钮效果 | `components/home/MagneticButton.tsx` |
| 首页 CTA 按钮 | `HomePage.tsx` 搜索 `MagneticButton` |
| 项目截图图片 | `public/projects/` 目录 |

### 2. 导航栏

| 改什么 | 改哪里 |
|-------|-------|
| 导航链接/菜单项 | `components/Navigation.tsx` → `navItems` 数组 |
| 导航栏样式（暗色/透明） | `app/globals.css` → `.nav-header`, `.dark .nav-header` |
| 移动端 Drawer 菜单 | `components/Navigation.tsx` → `<Drawer>` 部分 |
| 面包屑导航 | `components/BreadcrumbNav.tsx` |

### 3. 全局样式 & 主题

| 改什么 | 改哪里 |
|-------|-------|
| CSS 变量（颜色/字体） | `app/globals.css` → `:root` 和 `.dark` |
| Ant Design 组件暗色覆盖 | `app/globals.css` → `.dark .ant-*` 各节 |
| Tailwind 配置 | `tailwind.config.ts` |
| 主题切换逻辑 | `components/ThemeProvider.tsx`（next-themes 封装）|
| 主题切换按钮 | `components/ThemeToggle.tsx` |
| 根 Layout / 字体 / meta | `app/layout.tsx` |

### 4. 博客列表页

| 改什么 | 改哪里 |
|-------|-------|
| 文章列表 UI（搜索/筛选/分页） | `components/BlogListNew.tsx`（~583 行） |
| 侧边栏（分类/标签/归档） | `components/BlogSidebar.tsx` |
| 旧版列表（已弃用） | `components/BlogList.tsx` |
| 文章分类逻辑 | `lib/blog-category.ts` |
| 封面图生成 | `components/PostCoverImage.tsx` |

### 5. 博客详情页

| 改什么 | 改哪里 |
|-------|-------|
| 文章详情页面 | `app/blog/[slug]/page.tsx` |
| Markdown 渲染 | `components/MarkdownContent.tsx` |
| 文章头部（标题/日期/标签） | `components/ArticleHeader.tsx` |
| 评论区 | `components/CommentSection.tsx` |
| 分享/复制/下载按钮 | `components/ArticleActions.tsx`, `CopyLinkButton.tsx`, `DownloadPDFButton.tsx` |
| 文章内容 Tab 切换 | `components/PostTabs.tsx` |

### 6. AI 聊天

| 改什么 | 改哪里 |
|-------|-------|
| AI 聊天界面 | `components/AIChatBot.tsx` |
| AI 聊天 API | `app/api/ai-chat/route.ts` |
| AI 摘要生成 | `app/api/ai/summarize/route.ts` |
| AI 图片分析 | `app/api/ai/analyze-image/route.ts` |
| RAG 问答 | `app/api/rag/ask/route.ts` |
| OpenAI 客户端配置 | `lib/openai.ts` |
| AI 设置管理 | `app/api/ai-settings/route.ts` |

### 7. 简历页

| 改什么 | 改哪里 |
|-------|-------|
| 简历页面布局 | `app/resume/page.tsx` |
| 简历内容 | `content/resume.md` |
| 简历 PDF 导出 | `app/api/resume/pdf/route.ts` |
| 打印样式 | `app/globals.css` → `@media print` 节 |

### 8. 后台管理

| 改什么 | 改哪里 |
|-------|-------|
| 管理页面入口 | `app/admin/page.tsx` |
| 文章管理 CRUD | `components/admin/PostManagement.tsx` |
| 评论管理 | `components/admin/CommentManagement.tsx` |
| 管理 API（文章） | `app/api/admin/posts/route.ts`, `[id]/route.ts` |
| 管理 API（评论） | `app/api/admin/comments/route.ts`, `[id]/route.ts` |
| 迁移脚本 | `app/api/admin/migrate-posts/route.ts` |

### 9. 认证系统

| 改什么 | 改哪里 |
|-------|-------|
| 登录页面 | `app/login/page.tsx`, `components/AdminLogin.tsx` |
| 注册页面 | `app/register/page.tsx` |
| 登录 API | `app/api/auth/login/route.ts` |
| 注册 API | `app/api/auth/register/route.ts` |
| 当前用户 API | `app/api/auth/me/route.ts` |
| JWT 工具 | `lib/auth.ts` |
| 客户端 Auth 辅助 | `lib/client-auth.ts` |

### 10. 国际化（i18n）

| 改什么 | 改哪里 |
|-------|-------|
| 翻译文案 | `lib/i18n/zh-CN.ts`（中文）, `en.ts`（英文）, `zh-TW.ts`, `es.ts` |
| i18n 配置入口 | `lib/i18n/index.ts` |
| 翻译 Hook | `hooks/useTranslation.ts` |
| 语言切换器 UI | `components/LanguageSwitcher.tsx` |

### 11. SEO & Feed

| 改什么 | 改哪里 |
|-------|-------|
| 全局 metadata（title/description） | `app/layout.tsx` |
| 结构化数据（JSON-LD） | `components/StructuredData.tsx` |
| sitemap | `app/sitemap.ts` |
| robots.txt | `app/robots.ts` |
| RSS Feed | `app/feed.xml/` |

### 12. 页脚

| 改什么 | 改哪里 |
|-------|-------|
| 页脚内容/链接 | `components/Footer.tsx`（~98 行） |
| 页脚样式 | `app/globals.css` → `.site-footer`, `.dark .site-footer` |

---

## 数据库 Schema（Prisma）

文件：`prisma/schema.prisma`

| Model | 表名 | 用途 |
|-------|------|------|
| `User` | users | 用户账号（作者/管理员） |
| `Post` | posts | 博客文章（含 AI 摘要、向量化标记） |
| `Tag` | tags | 标签 |
| `PostTag` | post_tags | 文章-标签多对多关联 |
| `Comment` | comments | 评论（含 AI 审核评分） |
| `AISetting` | ai_settings | AI 接口配置（baseUrl/apiKey） |

---

## API 路由速查

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/posts` | GET | 文章列表 |
| `/api/posts/latest` | GET | 最新文章（limit 参数） |
| `/api/posts/hot` | GET | 热门文章 |
| `/api/posts/[slug]` | GET | 文章详情 |
| `/api/posts/[slug]/comments` | GET/POST | 评论读写 |
| `/api/posts/image` | GET | 文章封面图生成 |
| `/api/categories` | GET | 分类列表 |
| `/api/tags` | GET | 标签列表 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/me` | GET | 当前用户信息 |
| `/api/ai-chat` | POST | AI 对话 |
| `/api/ai/summarize` | POST | AI 文章摘要 |
| `/api/ai/analyze-image` | POST | AI 图片分析 |
| `/api/ai-settings` | GET/POST | AI 配置管理 |
| `/api/ai-settings/models` | GET | 可用模型列表 |
| `/api/rag/ask` | POST | RAG 知识问答 |
| `/api/resume/pdf` | GET | 简历 PDF 导出 |
| `/api/admin/posts` | GET/POST | 管理文章 |
| `/api/admin/posts/[id]` | PUT/DELETE | 编辑/删除文章 |
| `/api/admin/comments` | GET/DELETE | 管理评论 |
| `/api/admin/comments/[id]` | PUT/DELETE | 编辑/删除评论 |
| `/api/test-db` | GET | 数据库连接测试 |

---

## 工具库速查（lib/）

| 文件 | 功能 |
|------|------|
| `lib/prisma.ts` | Prisma 单例客户端 |
| `lib/openai.ts` | OpenAI API 客户端封装 |
| `lib/qdrant.ts` | Qdrant 向量数据库客户端 |
| `lib/vectorize.ts` | 文章向量化（embedding 生成） |
| `lib/posts.ts` | 文章数据读取/解析 |
| `lib/auth.ts` | JWT 签发/验证 |
| `lib/client-auth.ts` | 客户端 Token 管理 |
| `lib/blog-category.ts` | 文章自动分类逻辑 |
| `lib/utils.ts` | 通用工具函数（formatDate 等） |
| `lib/image-utils.ts` | 图片处理辅助 |
| `lib/image-library.ts` | 图片素材库 |
| `lib/link-transition.tsx` | 页面切换过渡动画组件 |
| `lib/link-animation.ts` | 链接动画辅助 |
| `lib/middleware.ts` | 中间件工具 |

---

## 静态资源（public/）

| 文件 | 用途 |
|------|------|
| `public/my-profile.png` | 头像照片 |
| `public/projects/sports-hub.png` | Sports Hub 插件截图 |
| `public/projects/nba-predict.png` | SportOracle 网站截图 |
| `public/projects/zhiqu-crochet.png` | 织趣社区网站截图 |

---

## 关键样式段落索引（globals.css ~1368 行）

避免全文读取，按需跳到对应行段：

| 行段 | 内容 |
|------|------|
| 1-8 | Tailwind 导入 + theme 变量 |
| 10-44 | CSS 变量（`:root` 亮色, `.dark` 暗色） |
| 46-63 | html/body 基础背景 |
| 64-78 | Ant Design Layout 暗色覆盖 |
| 85-133 | Ant Design Card/Tag 暗色 |
| 135-270 | Ant Design Tabs/List/Button/Input 暗色 |
| 276-299 | Ant Design Modal 暗色 |
| 300-348 | Ant Design Table 暗色 |
| 380-411 | 面包屑暗色 |
| 457-506 | Hero Section 响应式 |
| 508-706 | Hero 动画背景（流星/星空/闪烁 keyframes） |
| 732-772 | 导航栏移动端修复 |
| 774-929 | 打印样式（简历 A4） |
| 931-1003 | Markdown 内容渲染样式 |
| 1005-1037 | 首页动画（glowSpin/pulseSlow） |
| 1041-1084 | 导航栏暗色主题 |
| 1086-1133 | 分页器暗色 |
| 1135-1157 | Drawer 暗色 |
| 1158-1208 | 博客页面布局暗色 |
| 1210-1228 | Skeleton 加载暗色 |
| 1243-1353 | Footer 样式（亮色+暗色） |
| 1355-1368 | line-clamp 工具类 |
