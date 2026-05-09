---
title: "React + Next.js 项目规范：用 OpenSpec 统一团队代码风格"
date: "2025-05-09"
summary: "介绍如何使用 OpenSpec 标准为 React + Next.js 项目建立统一的代码规范，涵盖项目结构、TypeScript、组件设计、样式方案、错误处理等核心方面。"
tags: ["React", "Next.js", "OpenSpec", "项目规范", "TypeScript", "最佳实践"]
category: "tech"
draft: false
---

# React + Next.js 项目规范：用 OpenSpec 统一团队代码风格

当一个 React + Next.js 项目规模逐渐增大，团队成员各自按照自己的习惯写代码，项目结构、命名方式、组件设计会越来越混乱。OpenSpec 提供了一套经过验证的规范标准，帮助团队在项目初期就建立统一的代码风格。

## 什么是 OpenSpec

OpenSpec 是一套开放的项目规范标准，核心理念：

- **约定优于配置** — 通过目录结构和文件命名约定减少决策成本
- **单向依赖流** — `shared → features → app`，代码依赖方向清晰
- **Feature 内聚** — 每个业务模块自带组件、hooks、类型定义
- **类型安全** — TypeScript 严格模式，端到端类型推导

## 项目结构

### 推荐目录组织

```
app/                  # Next.js App Router 路由
├── error.tsx         # 全局错误边界
├── loading.tsx       # 全局加载态
└── not-found.tsx     # 全局 404

components/           # 共享组件
├── ui/               # 基础 UI 组件
└── layout/           # 布局组件

features/             # 功能模块
├── blog/
│   ├── components/   # 博客专属组件
│   ├── hooks/        # 博客专属 hooks
│   └── types.ts      # 博客类型定义
└── auth/
    └── types.ts

hooks/                # 共享 hooks
lib/                  # 第三方库封装
types/                # 全局类型定义
utils/                # 工具函数
```

### 关键原则

**单向依赖流**：共享层可以被任何地方引用，feature 层只能引用共享层，app 层可以引用 feature 和共享层。禁止 feature 之间直接导入。

```
shared (components, hooks, utils, types)
  ↓
features (blog, auth, ai)
  ↓
app (routes, pages)
```

这个约束可以用 ESLint 的 `import/no-restricted-paths` 规则强制执行。

## Server vs Client Component

Next.js App Router 默认所有组件都是 Server Component。只在需要时添加 `'use client'`。

### 需要 `'use client'` 的场景

- 使用 `useState`、`useEffect`、`useRef` 等 hooks
- 使用浏览器 API（`window`、`document`、`localStorage`）
- 使用事件处理器（`onClick`、`onChange`）
- 使用第三方客户端库（antd、framer-motion）

### 最佳实践

将 `'use client'` 推到组件树的叶子节点。一个页面中，尽量让外层容器保持为 Server Component，只在真正需要交互的子组件上加 `'use client'`。

```tsx
// app/blog/page.tsx — Server Component（默认）
import { getPosts } from '@/lib/posts'
import { PostList } from '@/components/PostList'

export default async function BlogPage() {
  const posts = await getPosts()  // 服务端直接获取数据
  return <PostList posts={posts} />
}

// components/PostList.tsx — Client Component
'use client'
import { useState } from 'react'

export const PostList = ({ posts }) => {
  const [filter, setFilter] = useState('')
  // 客户端交互逻辑...
}
```

## TypeScript 规范

### 严格模式配置

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 类型定义原则

- 优先 `interface` 定义对象类型，`type` 用于联合类型
- Props 接口命名为 `组件名Props`
- 避免 `any`，用 `unknown` 替代
- API 响应类型放在 feature 内的 `types.ts` 或全局 `types/` 目录

```tsx
// 推荐
interface NavigationProps {
  breadcrumbItems?: Array<{ title: string; href?: string }>
}

const Navigation = ({ breadcrumbItems }: NavigationProps) => {}

// 不推荐
const Navigation = ({ breadcrumbItems }: any) => {}
```

## 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `Navigation.tsx`、`BlogList.tsx` |
| 工具/hook 文件 | camelCase | `useTranslation.ts`、`formatDate.ts` |
| 变量/函数 | camelCase | `navItems`、`handleClick` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 布尔变量 | `is/has/can` 前缀 | `isVisible`、`hasData` |

### 函数命名语义

| 前缀 | 含义 | 示例 |
|------|------|------|
| `get` | 获取数据 | `getPosts`、`getUserById` |
| `create` | 创建实体 | `createPost` |
| `handle` | 事件处理 | `handleClick`、`handleSubmit` |
| `format` | 格式化 | `formatDate`、`formatPrice` |
| `is/has/can` | 布尔判断 | `isAdmin`、`hasPermission` |

## 样式方案

### 优先级

1. **Tailwind CSS** — 布局、间距、响应式
2. **CSS Variables** — 主题色、设计 token
3. **globals.css** — 复杂样式、第三方组件覆盖

### 避免内联 style

```tsx
// 不推荐
<div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

// 推荐
<div className="flex items-center gap-6">
```

### 暗色模式

使用 CSS 变量 + `next-themes`：

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
}
.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

## 错误处理

每个 Next.js 项目根目录必须有这三个文件：

- `app/error.tsx` — 全局错误边界（必须 `'use client'`）
- `app/loading.tsx` — 全局加载态
- `app/not-found.tsx` — 全局 404

各路由目录下可选配 `error.tsx` 和 `loading.tsx`。

```tsx
// app/error.tsx
'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>出错了</h2>
      <button onClick={reset}>重试</button>
    </div>
  )
}
```

## 导入路径

始终使用 `@/` 绝对导入，禁止 `../../../` 相对路径：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

```tsx
// 推荐
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

// 不推荐
import { Button } from '../../../components/ui/Button'
```

## 总结

OpenSpec 规范的核心价值不在于限制开发者，而在于减少团队的决策成本。当所有人都按照同一套约定写代码，代码审查变得更高效，新人上手更快，项目维护成本更低。

规范不是一成不变的，根据项目实际情况灵活调整，但一旦确定就要严格执行。配合 ESLint、Prettier、Husky 等工具，在提交时自动检查，确保规范落地。
