--
-- PostgreSQL database dump
--

\restrict MxW8R5lpw2absTuVbN7Lg76eOOVdWR4AWIXR9shV49kSJvRDyEVFmjCV3bvtiBk

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: chenzilong
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO chenzilong;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: chenzilong
--

CREATE TABLE public.comments (
    id text NOT NULL,
    content text NOT NULL,
    author text NOT NULL,
    email text,
    website text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    "postId" text NOT NULL
);


ALTER TABLE public.comments OWNER TO chenzilong;

--
-- Name: post_tags; Type: TABLE; Schema: public; Owner: chenzilong
--

CREATE TABLE public.post_tags (
    id text NOT NULL,
    "postId" text NOT NULL,
    "tagId" text NOT NULL
);


ALTER TABLE public.post_tags OWNER TO chenzilong;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: chenzilong
--

CREATE TABLE public.posts (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    summary text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    published boolean DEFAULT false NOT NULL,
    "authorId" text NOT NULL
);


ALTER TABLE public.posts OWNER TO chenzilong;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: chenzilong
--

CREATE TABLE public.tags (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tags OWNER TO chenzilong;

--
-- Name: users; Type: TABLE; Schema: public; Owner: chenzilong
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    role text DEFAULT 'author'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO chenzilong;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a9cc2e34-bc9c-4eae-8f3f-be6147cfaa49	69e68ab73cacd62bdd0d8fa735ff545cfd8bcc02b8573e62a5ecc4ef284fa34a	2025-11-12 13:46:54.079438+08	20251112054654_init	\N	\N	2025-11-12 13:46:54.065667+08	1
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

COPY public.comments (id, content, author, email, website, "createdAt", approved, "postId") FROM stdin;
cmhvqpgs70001z5iqnckxysgh	真好	cl	\N	\N	2025-11-12 08:30:19.447	t	cmhvkw1vn0005z5bq103z3n1y
cmhvqxegg0003z5iqaqw7zm9x	11	1	\N	\N	2025-11-12 08:36:29.681	t	cmhvkw1vn0005z5bq103z3n1y
\.


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

COPY public.post_tags (id, "postId", "tagId") FROM stdin;
cmhvkw1vn0007z5bqxd68mcrb	cmhvkw1vn0005z5bq103z3n1y	cmhvkw1v20001z5bqc8e7zm32
cmhvkw1vn0008z5bqrsggfshk	cmhvkw1vn0005z5bq103z3n1y	cmhvkw1vi0002z5bqm1cg6d9x
cmhvkw1vn0009z5bq1ivvovi8	cmhvkw1vn0005z5bq103z3n1y	cmhvkw1vi0003z5bqpuxfhp8v
cmhvkw1vy000fz5bqk85i84pn	cmhvkw1vy000dz5bq0799tv8p	cmhvkw1vv000az5bqv0u535zw
cmhvkw1vy000gz5bqijtuxl1k	cmhvkw1vy000dz5bq0799tv8p	cmhvkw1vv000bz5bqxkwgtypv
cmhvkw1wo000oz5bq2dny959e	cmhvkw1wo000mz5bq7fersden	cmhvkw1w6000hz5bqlo45aovh
cmhvkw1wo000pz5bql0zc4ukz	cmhvkw1wo000mz5bq7fersden	cmhvkw1w6000iz5bqaw3nmu9k
cmhvkw1wo000qz5bq0rsrw92m	cmhvkw1wo000mz5bq7fersden	cmhvkw1wk000kz5bqy1yy3xyo
cmhvkw1wo000rz5bqmdardbx3	cmhvkw1wo000mz5bq7fersden	cmhvkw1vi0003z5bqpuxfhp8v
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

COPY public.posts (id, slug, title, content, summary, date, "createdAt", "updatedAt", published, "authorId") FROM stdin;
cmhvkw1vn0005z5bq103z3n1y	getting-started	开始使用 Next.js	\n# 开始使用 Next.js\n\nNext.js 是一个强大的 React 框架，提供了许多开箱即用的功能。\n\n## 为什么选择 Next.js？\n\n- **服务端渲染（SSR）**：提升 SEO 和首屏加载速度\n- **静态站点生成（SSG）**：预渲染页面，提供最佳性能\n- **API 路由**：可以创建 API 端点\n- **文件系统路由**：基于文件结构的路由系统\n\n## 安装\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\n\\`\\`\\`\n\n## 基本概念\n\n### 页面路由\n\n在 `app` 目录下创建文件即可自动生成路由：\n\n- `app/page.tsx` → `/`\n- `app/about/page.tsx` → `/about`\n- `app/blog/[slug]/page.tsx` → `/blog/:slug`\n\n### 数据获取\n\nNext.js 支持多种数据获取方式：\n\n\\`\\`\\`typescript\n// 服务端组件\nasync function getData() {\n  const res = await fetch('https://api.example.com/data');\n  return res.json();\n}\n\nexport default async function Page() {\n  const data = await getData();\n  return <div>{data.title}</div>;\n}\n\\`\\`\\`\n\n## 总结\n\nNext.js 是一个功能强大且易于使用的框架，适合构建各种类型的 Web 应用。\n\n	学习如何使用 Next.js 构建现代化的 Web 应用。	2024-01-15 00:00:00	2025-11-12 05:47:29.027	2025-11-12 05:47:29.027	t	cmhvkw1ul0000z5bqgkwxt51k
cmhvkw1vy000dz5bq0799tv8p	hello-world	欢迎来到我的博客	\n# 欢迎来到我的博客\n\n这是我的第一篇博客文章！这个个人网站使用 Next.js 和 TypeScript 构建，具有以下特点：\n\n## 功能特性\n\n- **博客系统**：支持 Markdown 格式的文章，带有语法高亮\n- **简历展示**：清晰的简历页面，支持 PDF 导出\n- **主题切换**：支持暗色和亮色主题\n- **响应式设计**：在移动设备和桌面设备上都有良好的体验\n\n## 技术栈\n\n- Next.js 16\n- TypeScript\n- Tailwind CSS\n- React Markdown\n\n## 代码示例\n\n这里是一个简单的 JavaScript 代码示例：\n\n\\`\\`\\`javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n\\`\\`\\`\n\n## 下一步\n\n我会继续分享更多有趣的内容，包括：\n\n1. 技术文章\n2. 项目经验\n3. 学习心得\n\n感谢您的访问！\n\n	这是我的第一篇博客文章，介绍这个个人网站的功能和特点。	2024-01-01 00:00:00	2025-11-12 05:47:29.038	2025-11-12 05:47:29.038	t	cmhvkw1ul0000z5bqgkwxt51k
cmhvkw1wo000mz5bq7fersden	react-summary	React 总结	\n# React 总结\n\nReact 是一个用于构建用户界面的 JavaScript 库，它采用组件化开发模式，让前端开发更加高效和可维护。\n\n## Redux 状态管理\n\nRedux 是一个可预测的状态管理库，主要用于管理应用的状态。下面是 Redux 的使用步骤：\n\n### Redux 使用步骤\n\n1. **定义一个 reducer 函数（根据当前想要做的修改返回一个新的状态）**\n2. **使用 createStore 方法传入 reducer 函数生成一个 store 实例对象**\n3. **使用 store 实例的 subscribe 方法订阅数据的变化（数据一旦变化，可以得到通知）**\n4. **使用 store 实例的 dispatch 方法提交 action 对象触发数据变化（告诉 reducer 你想怎么改数据）**\n5. **使用 store 实例的 getState 方法获取最新的状态数据更新到视图中**\n\n### Redux 记录\n\n![redux记录](/redux-record.png)\n\n*Redux 状态管理流程图*\n\n### Redux 核心概念\n\n#### 1. Reducer 函数\n\nReducer 是一个纯函数，它接收当前状态和 action 对象，返回新的状态。\n\n\\`\\`\\`javascript\n// 1. 定义 reducer 函数\n// 作用: 根据不同的 action 对象, 返回不同的新的 state\n// state: 管理的数据初始状态\n// action: 对象 type 标记当前想要做什么样的修改\nfunction reducer(state = { count: 0 }, action) {\n  switch (action.type) {\n    case 'INCREMENT':\n      return { count: state.count + 1 };\n    case 'DECREMENT':\n      return { count: state.count - 1 };\n    default:\n      return state;\n  }\n}\n\\`\\`\\`\n\n#### 2. Store 实例\n\nStore 是 Redux 的核心，它保存了应用的状态，并提供了访问状态、更新状态和监听状态变化的方法。\n\n\\`\\`\\`javascript\n// 2. 使用 createStore 方法传入 reducer 函数生成一个 store 实例对象\nimport { createStore } from 'redux';\nconst store = createStore(reducer);\n\\`\\`\\`\n\n#### 3. 订阅状态变化\n\n\\`\\`\\`javascript\n// 3. 使用 store 实例的 subscribe 方法订阅数据的变化\nstore.subscribe(() => {\n  console.log('状态已更新:', store.getState());\n});\n\\`\\`\\`\n\n#### 4. 派发 Action\n\n\\`\\`\\`javascript\n// 4. 使用 store 实例的 dispatch 方法提交 action 对象触发数据变化\nstore.dispatch({ type: 'INCREMENT' });\nstore.dispatch({ type: 'DECREMENT' });\n\\`\\`\\`\n\n#### 5. 获取状态\n\n\\`\\`\\`javascript\n// 5. 使用 store 实例的 getState 方法获取最新的状态数据\nconst currentState = store.getState();\nconsole.log('当前状态:', currentState);\n\\`\\`\\`\n\n## React Hooks\n\nReact Hooks 是 React 16.8 引入的新特性，它允许你在函数组件中使用状态和其他 React 特性。\n\n### useState\n\n\\`\\`\\`javascript\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>计数: {count}</p>\n      <button onClick={() => setCount(count + 1)}>增加</button>\n    </div>\n  );\n}\n\\`\\`\\`\n\n### useEffect\n\n\\`\\`\\`javascript\nimport { useEffect, useState } from 'react';\n\nfunction DataFetcher() {\n  const [data, setData] = useState(null);\n\n  useEffect(() => {\n    fetch('/api/data')\n      .then(res => res.json())\n      .then(data => setData(data));\n  }, []);\n\n  return <div>{data ? JSON.stringify(data) : '加载中...'}</div>;\n}\n\\`\\`\\`\n\n## 总结\n\nReact 和 Redux 是现代前端开发中非常重要的技术栈。掌握它们可以帮助我们构建更加复杂和可维护的 Web 应用。\n\n	React 框架的学习总结，包括 Redux 状态管理的使用方法和核心概念。	2024-12-11 00:00:00	2025-11-12 05:47:29.064	2025-11-12 05:47:29.064	t	cmhvkw1ul0000z5bqgkwxt51k
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

COPY public.tags (id, name, slug, "createdAt") FROM stdin;
cmhvkw1v20001z5bqc8e7zm32	Next.js	next.js	2025-11-12 05:47:29.007
cmhvkw1vi0003z5bqpuxfhp8v	前端	前端	2025-11-12 05:47:29.007
cmhvkw1vi0002z5bqm1cg6d9x	教程	教程	2025-11-12 05:47:29.007
cmhvkw1vv000bz5bqxkwgtypv	介绍	介绍	2025-11-12 05:47:29.036
cmhvkw1vv000az5bqv0u535zw	博客	博客	2025-11-12 05:47:29.036
cmhvkw1w6000hz5bqlo45aovh	React	react	2025-11-12 05:47:29.046
cmhvkw1w6000iz5bqaw3nmu9k	Redux	redux	2025-11-12 05:47:29.046
cmhvkw1wk000kz5bqy1yy3xyo	状态管理	状态管理	2025-11-12 05:47:29.046
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: chenzilong
--

COPY public.users (id, email, name, password, role, "createdAt", "updatedAt") FROM stdin;
cmhvkw1ul0000z5bqgkwxt51k	admin@example.com	Admin	changeme123	admin	2025-11-12 05:47:28.989	2025-11-12 05:47:28.989
cmhvpc0710000z5hv7ki71wze	chenzhuo995@gmail.com	陈子龙	b0e2384787e87556dd45de56ec8e2664b5775c528b2355658ba2aee3e8a6334c	author	2025-11-12 07:51:51.805	2025-11-12 07:51:51.805
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: post_tags post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments_approved_idx; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE INDEX comments_approved_idx ON public.comments USING btree (approved);


--
-- Name: comments_postId_idx; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE INDEX "comments_postId_idx" ON public.comments USING btree ("postId");


--
-- Name: post_tags_postId_tagId_key; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE UNIQUE INDEX "post_tags_postId_tagId_key" ON public.post_tags USING btree ("postId", "tagId");


--
-- Name: posts_date_idx; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE INDEX posts_date_idx ON public.posts USING btree (date);


--
-- Name: posts_published_idx; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE INDEX posts_published_idx ON public.posts USING btree (published);


--
-- Name: posts_slug_idx; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE INDEX posts_slug_idx ON public.posts USING btree (slug);


--
-- Name: posts_slug_key; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE UNIQUE INDEX posts_slug_key ON public.posts USING btree (slug);


--
-- Name: tags_name_key; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE UNIQUE INDEX tags_name_key ON public.tags USING btree (name);


--
-- Name: tags_slug_idx; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE INDEX tags_slug_idx ON public.tags USING btree (slug);


--
-- Name: tags_slug_key; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE UNIQUE INDEX tags_slug_key ON public.tags USING btree (slug);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: chenzilong
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: comments comments_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_tags post_tags_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES public.posts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: post_tags post_tags_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: posts posts_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chenzilong
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict MxW8R5lpw2absTuVbN7Lg76eOOVdWR4AWIXR9shV49kSJvRDyEVFmjCV3bvtiBk

