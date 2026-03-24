# 前端文档

## 概述

这是一个基于 Next.js 16 + TypeScript + Ant Design + Tailwind CSS 构建的现代化个人网站前端应用。网站包含博客系统、简历展示、管理后台和AI助手功能。

## 技术栈

### 核心框架
- **Next.js 16** - React 全栈框架，使用 App Router
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### UI 组件库
- **Ant Design 5** - 企业级 UI 组件库
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **@ant-design/nextjs-registry** - Next.js 与 Ant Design 的集成

### 功能增强
- **next-themes** - 主题切换功能
- **next-intl** - 国际化支持
- **react-markdown** - Markdown 渲染
- **highlight.js** - 代码语法高亮
- **html2canvas & jspdf** - PDF 生成

## 项目结构

```
personal-site/
├── app/                    # Next.js App Router 页面
│   ├── admin/             # 管理后台页面
│   ├── api/               # API 路由（后端接口）
│   ├── blog/              # 博客相关页面
│   │   ├── [slug]/        # 博客详情页
│   │   └── page.tsx       # 博客列表页
│   ├── login/             # 登录页面
│   ├── profile/           # 用户资料页面
│   ├── register/          # 注册页面
│   ├── resume/            # 简历页面
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   └── favicon.ico        # 网站图标
├── components/            # React 组件
│   ├── admin/             # 管理后台组件
│   ├── AIChatBot.tsx      # AI 聊天机器人
│   ├── AISummary.tsx      # AI 摘要组件
│   ├── ArticleActions.tsx # 文章操作组件
│   ├── ArticleHeader.tsx  # 文章头部组件
│   ├── BlogList.tsx       # 博客列表组件
│   ├── BlogSidebar.tsx    # 博客侧边栏
│   ├── BreadcrumbNav.tsx  # 面包屑导航
│   ├── CommentSection.tsx # 评论区组件
│   ├── Footer.tsx         # 页脚组件
│   ├── HomePage.tsx       # 首页组件
│   ├── LanguageSwitcher.tsx # 语言切换器
│   ├── LoadingBar.tsx     # 加载进度条
│   ├── MarkdownContent.tsx # Markdown 内容渲染
│   ├── Navigation.tsx     # 导航栏组件
│   ├── PostCoverImage.tsx # 文章封面图片
│   ├── PostTabs.tsx       # 文章标签页
│   ├── ThemeProvider.tsx  # 主题提供者
│   └── ThemeToggle.tsx    # 主题切换按钮
├── hooks/                 # 自定义 React Hooks
│   └── useTranslation.ts  # 翻译 Hook
├── lib/                   # 工具函数库
│   ├── auth.ts            # 认证相关
│   ├── client-auth.ts     # 客户端认证
│   ├── i18n/              # 国际化配置
│   ├── image-utils.ts     # 图片处理工具
│   ├── link-animation.ts  # 链接动画
│   ├── link-transition.tsx # 链接过渡
│   ├── middleware.ts      # 中间件
│   ├── openai.ts          # OpenAI 集成
│   ├── posts.ts           # 文章处理
│   ├── prisma.ts          # 数据库客户端
│   ├── qdrant.ts          # 向量数据库
│   ├── utils.ts           # 通用工具
│   └── vectorize.ts       # 向量化工具
└── content/               # 内容文件
    ├── posts/             # Markdown 博客文章
    └── resume.md          # 简历内容
```

## 页面架构

### 公共页面

#### 首页 (`/`)
- **文件**: `app/page.tsx`
- **组件**: `HomePage.tsx`
- **功能**: 网站首页，展示网站简介和导航

#### 博客列表页 (`/blog`)
- **文件**: `app/blog/page.tsx`
- **组件**: `BlogList.tsx`, `BlogListNew.tsx`
- **功能**: 展示所有已发布的博客文章列表

#### 博客详情页 (`/blog/[slug]`)
- **文件**: `app/blog/[slug]/page.tsx`
- **组件**: `ArticleHeader.tsx`, `MarkdownContent.tsx`, `CommentSection.tsx`
- **功能**: 展示单篇文章内容、评论区

#### 简历页面 (`/resume`)
- **文件**: `app/resume/page.tsx`
- **组件**: 简历内容展示组件
- **功能**: 展示个人简历，支持 PDF 导出

### 认证页面

#### 登录页面 (`/login`)
- **文件**: `app/login/page.tsx`
- **功能**: 用户登录表单

#### 注册页面 (`/register`)
- **文件**: `app/register/page.tsx`
- **功能**: 用户注册表单

#### 用户资料页面 (`/profile`)
- **文件**: `app/profile/page.tsx`
- **功能**: 用户资料查看和编辑

### 管理后台页面

#### 管理后台首页 (`/admin`)
- **文件**: `app/admin/page.tsx`
- **组件**: `CommentManagement.tsx`, `PostManagement.tsx`
- **功能**: 管理后台主页面，包含评论管理和文章管理

## 核心组件

### 导航组件 (`Navigation.tsx`)
```typescript
interface NavigationProps {
  breadcrumbItems?: Array<{
    title: string
    href?: string
  }>
}
```

**功能特性**:
- 响应式导航栏
- 面包屑导航支持
- 主题切换集成
- 语言切换集成
- 链接过渡动画

### 博客列表组件 (`BlogList.tsx`)
```typescript
interface BlogListProps {
  posts: Array<{
    slug: string
    title: string
    date: string
    summary: string
    tags: string[]
  }>
}
```

**功能特性**:
- 文章列表展示
- 标签系统
- 日期格式化
- 响应式卡片布局

### AI 聊天机器人 (`AIChatBot.tsx`)

**功能特性**:
- 浮动按钮触发
- 实时对话界面
- 基于 RAG 的智能问答
- 相关文章引用
- 多语言支持

### 主题系统

#### 主题提供者 (`ThemeProvider.tsx`)
- 基于 `next-themes` 实现
- 支持系统主题检测
- 持久化主题设置

#### 主题切换按钮 (`ThemeToggle.tsx`)
- 图标切换动画
- 无障碍访问支持

### 国际化系统

#### 语言配置
```
lib/i18n/
├── index.ts          # 国际化配置入口
├── zh-CN.ts          # 中文简体翻译
├── zh-TW.ts          # 中文繁体翻译
├── en.ts             # 英文翻译
└── es.ts             # 西班牙文翻译
```

#### 翻译 Hook (`useTranslation.ts`)
```typescript
const { t } = useTranslation()
// 使用示例: t('nav.blog')
```

## 数据流和状态管理

### 客户端认证 (`client-auth.ts`)
```typescript
// 用户认证状态管理
export const isAuthenticated: () => boolean
export const isAdmin: () => boolean
export const getCurrentUser: () => User | null
export const fetchCurrentUser: () => Promise<User | null>
```

### 文章数据处理 (`posts.ts`)
```typescript
// 文章相关工具函数
export const getPosts: (filters?: PostFilters) => Promise<Post[]>
export const getPostBySlug: (slug: string) => Promise<Post | null>
export const getAllTags: () => Promise<Tag[]>
```

## 样式系统

### CSS 变量系统
```css
/* 全局 CSS 变量 */
:root {
  --background: #ffffff;
  --foreground: #000000;
  --border: #e5e7eb;
  /* ... */
}
```

### Tailwind 配置 (`tailwind.config.ts`)
- 自定义颜色变量
- 响应式断点配置
- 字体配置

### Ant Design 主题集成
```typescript
<ConfigProvider
  theme={{
    token: {
      colorBgContainer: 'var(--background)',
      colorText: 'var(--foreground)',
      colorBorder: 'var(--border)',
    },
  }}
>
```

## 性能优化

### Next.js 优化特性
- **静态生成 (SSG)**: 博客文章预渲染
- **图片优化**: 使用 `next/image` 组件
- **代码分割**: 按路由自动分割
- **字体优化**: 使用 `next/font` 加载

### 自定义优化
- **懒加载**: 组件和图片懒加载
- **缓存策略**: API 响应缓存
- **压缩**: CSS 和 JS 压缩

## 响应式设计

### 断点系统
- **手机**: < 768px
- **平板**: 768px - 1024px
- **桌面**: > 1024px

### 布局适配
- 流式布局
- 弹性盒子 (Flexbox)
- 网格布局 (Grid)
- 媒体查询

## 无障碍访问 (Accessibility)

### ARIA 支持
- 语义化 HTML
- ARIA 标签和属性
- 键盘导航支持

### 功能特性
- 高对比度主题
- 屏幕阅读器支持
- 焦点管理

## 开发和部署

### 开发环境
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 环境变量
```env
# 必需的环境变量
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
OPENAI_API_KEY=sk-...
QDRANT_URL=http://localhost:6333

# 可选的环境变量
NODE_ENV=production
NEXT_PUBLIC_ANALYTICS_ID=...
```

### 构建优化
- **Tree Shaking**: 移除未使用的代码
- **代码分割**: 按路由分割
- **压缩混淆**: 生产环境代码压缩
- **图片优化**: WebP 格式和响应式图片

## 测试和质量保证

### 代码质量
- **TypeScript**: 类型检查
- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **Husky**: Git 钩子

### 性能监控
- **Lighthouse**: 性能评分
- **Core Web Vitals**: 核心网页指标
- **Bundle Analyzer**: 包大小分析

## 浏览器支持

### 支持的浏览器
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 功能检测
- CSS 变量支持检测
- JavaScript 模块支持
- 渐进增强策略




