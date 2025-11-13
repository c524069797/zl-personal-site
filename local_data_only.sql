--
-- PostgreSQL database dump
--

\restrict QOnwggtp6FLYOa0GvUzhnlFzv3WgeBOSfJ2tQMcWGSRnd0TdaMgmJgV9pHcplU0

-- Dumped from database version 15.14 (Homebrew)
-- Dumped by pg_dump version 15.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('a9cc2e34-bc9c-4eae-8f3f-be6147cfaa49', '69e68ab73cacd62bdd0d8fa735ff545cfd8bcc02b8573e62a5ecc4ef284fa34a', '2025-11-12 13:46:54.079438+08', '20251112054654_init', NULL, NULL, '2025-11-12 13:46:54.065667+08', 1);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

INSERT INTO public.users (id, email, name, password, role, "createdAt", "updatedAt") VALUES ('cmhvkw1ul0000z5bqgkwxt51k', 'admin@example.com', 'Admin', 'changeme123', 'admin', '2025-11-12 05:47:28.989', '2025-11-12 05:47:28.989');
INSERT INTO public.users (id, email, name, password, role, "createdAt", "updatedAt") VALUES ('cmhvpc0710000z5hv7ki71wze', 'chenzhuo995@gmail.com', '陈子龙', 'b0e2384787e87556dd45de56ec8e2664b5775c528b2355658ba2aee3e8a6334c', 'author', '2025-11-12 07:51:51.805', '2025-11-12 07:51:51.805');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

INSERT INTO public.posts (id, slug, title, content, summary, date, "createdAt", "updatedAt", published, "authorId") VALUES ('cmhvkw1vn0005z5bq103z3n1y', 'getting-started', '开始使用 Next.js', '
# 开始使用 Next.js

Next.js 是一个强大的 React 框架，提供了许多开箱即用的功能。

## 为什么选择 Next.js？

- **服务端渲染（SSR）**：提升 SEO 和首屏加载速度
- **静态站点生成（SSG）**：预渲染页面，提供最佳性能
- **API 路由**：可以创建 API 端点
- **文件系统路由**：基于文件结构的路由系统

## 安装

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

## 基本概念

### 页面路由

在 `app` 目录下创建文件即可自动生成路由：

- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/blog/[slug]/page.tsx` → `/blog/:slug`

### 数据获取

Next.js 支持多种数据获取方式：

\`\`\`typescript
// 服务端组件
async function getData() {
  const res = await fetch(''https://api.example.com/data'');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
\`\`\`

## 总结

Next.js 是一个功能强大且易于使用的框架，适合构建各种类型的 Web 应用。

', '学习如何使用 Next.js 构建现代化的 Web 应用。', '2024-01-15 00:00:00', '2025-11-12 05:47:29.027', '2025-11-12 05:47:29.027', true, 'cmhvkw1ul0000z5bqgkwxt51k');
INSERT INTO public.posts (id, slug, title, content, summary, date, "createdAt", "updatedAt", published, "authorId") VALUES ('cmhvkw1vy000dz5bq0799tv8p', 'hello-world', '欢迎来到我的博客', '
# 欢迎来到我的博客

这是我的第一篇博客文章！这个个人网站使用 Next.js 和 TypeScript 构建，具有以下特点：

## 功能特性

- **博客系统**：支持 Markdown 格式的文章，带有语法高亮
- **简历展示**：清晰的简历页面，支持 PDF 导出
- **主题切换**：支持暗色和亮色主题
- **响应式设计**：在移动设备和桌面设备上都有良好的体验

## 技术栈

- Next.js 16
- TypeScript
- Tailwind CSS
- React Markdown

## 代码示例

这里是一个简单的 JavaScript 代码示例：

\`\`\`javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("World"));
\`\`\`

## 下一步

我会继续分享更多有趣的内容，包括：

1. 技术文章
2. 项目经验
3. 学习心得

感谢您的访问！

', '这是我的第一篇博客文章，介绍这个个人网站的功能和特点。', '2024-01-01 00:00:00', '2025-11-12 05:47:29.038', '2025-11-12 05:47:29.038', true, 'cmhvkw1ul0000z5bqgkwxt51k');
INSERT INTO public.posts (id, slug, title, content, summary, date, "createdAt", "updatedAt", published, "authorId") VALUES ('cmhvkw1wo000mz5bq7fersden', 'react-summary', 'React 总结', '
# React 总结

React 是一个用于构建用户界面的 JavaScript 库，它采用组件化开发模式，让前端开发更加高效和可维护。

## Redux 状态管理

Redux 是一个可预测的状态管理库，主要用于管理应用的状态。下面是 Redux 的使用步骤：

### Redux 使用步骤

1. **定义一个 reducer 函数（根据当前想要做的修改返回一个新的状态）**
2. **使用 createStore 方法传入 reducer 函数生成一个 store 实例对象**
3. **使用 store 实例的 subscribe 方法订阅数据的变化（数据一旦变化，可以得到通知）**
4. **使用 store 实例的 dispatch 方法提交 action 对象触发数据变化（告诉 reducer 你想怎么改数据）**
5. **使用 store 实例的 getState 方法获取最新的状态数据更新到视图中**

### Redux 记录

![redux记录](/redux-record.png)

*Redux 状态管理流程图*

### Redux 核心概念

#### 1. Reducer 函数

Reducer 是一个纯函数，它接收当前状态和 action 对象，返回新的状态。

\`\`\`javascript
// 1. 定义 reducer 函数
// 作用: 根据不同的 action 对象, 返回不同的新的 state
// state: 管理的数据初始状态
// action: 对象 type 标记当前想要做什么样的修改
function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case ''INCREMENT'':
      return { count: state.count + 1 };
    case ''DECREMENT'':
      return { count: state.count - 1 };
    default:
      return state;
  }
}
\`\`\`

#### 2. Store 实例

Store 是 Redux 的核心，它保存了应用的状态，并提供了访问状态、更新状态和监听状态变化的方法。

\`\`\`javascript
// 2. 使用 createStore 方法传入 reducer 函数生成一个 store 实例对象
import { createStore } from ''redux'';
const store = createStore(reducer);
\`\`\`

#### 3. 订阅状态变化

\`\`\`javascript
// 3. 使用 store 实例的 subscribe 方法订阅数据的变化
store.subscribe(() => {
  console.log(''状态已更新:'', store.getState());
});
\`\`\`

#### 4. 派发 Action

\`\`\`javascript
// 4. 使用 store 实例的 dispatch 方法提交 action 对象触发数据变化
store.dispatch({ type: ''INCREMENT'' });
store.dispatch({ type: ''DECREMENT'' });
\`\`\`

#### 5. 获取状态

\`\`\`javascript
// 5. 使用 store 实例的 getState 方法获取最新的状态数据
const currentState = store.getState();
console.log(''当前状态:'', currentState);
\`\`\`

## React Hooks

React Hooks 是 React 16.8 引入的新特性，它允许你在函数组件中使用状态和其他 React 特性。

### useState

\`\`\`javascript
import { useState } from ''react'';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
\`\`\`

### useEffect

\`\`\`javascript
import { useEffect, useState } from ''react'';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(''/api/data'')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return <div>{data ? JSON.stringify(data) : ''加载中...''}</div>;
}
\`\`\`

## 总结

React 和 Redux 是现代前端开发中非常重要的技术栈。掌握它们可以帮助我们构建更加复杂和可维护的 Web 应用。

', 'React 框架的学习总结，包括 Redux 状态管理的使用方法和核心概念。', '2024-12-11 00:00:00', '2025-11-12 05:47:29.064', '2025-11-12 05:47:29.064', true, 'cmhvkw1ul0000z5bqgkwxt51k');


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

INSERT INTO public.comments (id, content, author, email, website, "createdAt", approved, "postId") VALUES ('cmhvqpgs70001z5iqnckxysgh', '真好', 'cl', NULL, NULL, '2025-11-12 08:30:19.447', true, 'cmhvkw1vn0005z5bq103z3n1y');
INSERT INTO public.comments (id, content, author, email, website, "createdAt", approved, "postId") VALUES ('cmhvqxegg0003z5iqaqw7zm9x', '11', '1', NULL, NULL, '2025-11-12 08:36:29.681', true, 'cmhvkw1vn0005z5bq103z3n1y');


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1v20001z5bqc8e7zm32', 'Next.js', 'next.js', '2025-11-12 05:47:29.007');
INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1vi0003z5bqpuxfhp8v', '前端', '前端', '2025-11-12 05:47:29.007');
INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1vi0002z5bqm1cg6d9x', '教程', '教程', '2025-11-12 05:47:29.007');
INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1vv000bz5bqxkwgtypv', '介绍', '介绍', '2025-11-12 05:47:29.036');
INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1vv000az5bqv0u535zw', '博客', '博客', '2025-11-12 05:47:29.036');
INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1w6000hz5bqlo45aovh', 'React', 'react', '2025-11-12 05:47:29.046');
INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1w6000iz5bqaw3nmu9k', 'Redux', 'redux', '2025-11-12 05:47:29.046');
INSERT INTO public.tags (id, name, slug, "createdAt") VALUES ('cmhvkw1wk000kz5bqy1yy3xyo', '状态管理', '状态管理', '2025-11-12 05:47:29.046');


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1vn0007z5bqxd68mcrb', 'cmhvkw1vn0005z5bq103z3n1y', 'cmhvkw1v20001z5bqc8e7zm32');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1vn0008z5bqrsggfshk', 'cmhvkw1vn0005z5bq103z3n1y', 'cmhvkw1vi0002z5bqm1cg6d9x');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1vn0009z5bq1ivvovi8', 'cmhvkw1vn0005z5bq103z3n1y', 'cmhvkw1vi0003z5bqpuxfhp8v');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1vy000fz5bqk85i84pn', 'cmhvkw1vy000dz5bq0799tv8p', 'cmhvkw1vv000az5bqv0u535zw');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1vy000gz5bqijtuxl1k', 'cmhvkw1vy000dz5bq0799tv8p', 'cmhvkw1vv000bz5bqxkwgtypv');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1wo000oz5bq2dny959e', 'cmhvkw1wo000mz5bq7fersden', 'cmhvkw1w6000hz5bqlo45aovh');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1wo000pz5bql0zc4ukz', 'cmhvkw1wo000mz5bq7fersden', 'cmhvkw1w6000iz5bqaw3nmu9k');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1wo000qz5bq0rsrw92m', 'cmhvkw1wo000mz5bq7fersden', 'cmhvkw1wk000kz5bqy1yy3xyo');
INSERT INTO public.post_tags (id, "postId", "tagId") VALUES ('cmhvkw1wo000rz5bqmdardbx3', 'cmhvkw1wo000mz5bq7fersden', 'cmhvkw1vi0003z5bqpuxfhp8v');


--
-- PostgreSQL database dump complete
--

\unrestrict QOnwggtp6FLYOa0GvUzhnlFzv3WgeBOSfJ2tQMcWGSRnd0TdaMgmJgV9pHcplU0

