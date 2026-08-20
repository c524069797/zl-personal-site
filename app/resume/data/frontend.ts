import type { ResumeData } from "./types";
import { EMPLOYMENT_DATE, OTHER_WORKS } from "./shared";

/** AI 应用前端版：投前端开发工程师 / 资深前端（AI 方向） */
export const frontendResume: ResumeData = {
  tabLabel: "AI 前端",
  role: "前端开发工程师（React / Next.js，AI 应用方向）",
  meta: "本科｜近 5 年前端与全栈研发经验｜AI 产品前端落地实践",
  summary:
    "近 5 年前端与全栈研发经验，覆盖企业级中后台、复杂表单向导、可视化大屏、内容型站点与跨端移动应用等多种形态。做过真实上线的 AI Agent 对话产品前端（流式输出、引用溯源、HITL 审批交互、一键转人工），同时理解 Agent 与 RAG 底层链路，能与算法、后端高效协作并独立完成 AI 功能的前端交付。",

  skillGroups: [
    {
      title: "前端框架与工程化",
      iconKey: "frontend",
      skills: [
        "React 18/19",
        "Next.js（App Router / RSC / SSR / SSG）",
        "Vue 2 / Vue 3",
        "TypeScript",
        "Vite",
        "Webpack",
        "Monorepo",
        "ESLint 9",
        "Vitest",
        "Playwright",
      ],
    },
    {
      title: "UI / 性能 / 交互",
      iconKey: "agent",
      skills: [
        "Ant Design",
        "Tailwind CSS",
        "ECharts / DataV",
        "首屏优化与代码分割",
        "虚拟滚动与增量更新",
        "SSR / SEO（sitemap、JSON-LD、RSS）",
        "暗色主题体系",
        "React Three Fiber 3D",
        "Framer Motion",
        "WebSocket 实时链路",
      ],
    },
    {
      title: "AI 应用前端与后端协作",
      iconKey: "backend",
      skills: [
        "SSE 流式对话界面",
        "流式 Markdown 渲染",
        "引用来源高亮与转人工",
        "LangGraph / RAG 链路理解",
        "Java / Spring Boot",
        "Python / FastAPI",
        "PostgreSQL / Prisma",
        "React Native / uni-app",
      ],
    },
  ],

  experience: [
    {
      company: "广州鼎甲计算机科技有限公司",
      date: EMPLOYMENT_DATE,
      role: "Web 软件工程师（前端方向）",
      desc: "负责企业级备份软件、许可证与内部综合管理系统、数据可视化监控大屏等核心产品的前端架构与开发，支撑 50+ 资源类型接入与多条产品线协同。",
      bullets: [
        {
          label: "通用向导框架",
          text: "为解决多资源类型备份/恢复流程重复开发问题，设计基于工厂模式 + Context + Proxy 的通用向导框架，支撑 50+ 资源类型动态注入与跨步骤状态共享，新增资源类型的开发周期从 2 周缩短到 2 天。",
        },
        {
          label: "组件库建设",
          text: "主导企业级 Vue 3 组件库与通用能力建设，沉淀 Components / Forms / Layout / Plugins 等 40+ 组件，支撑多条产品线复用。",
        },
        {
          label: "可视化大屏系统",
          text: "基于 grid-layout-plus 实现拖拽式大屏布局，支持 12 × 12 网格、碰撞检测、自动放置与布局持久化；VScaleScreen / transform-scale 解决缩放坐标对齐；WebSocket 推送 + 缓冲队列 + 重连机制保障任务状态秒级同步与长时间稳定运行。",
        },
        {
          label: "性能优化",
          text: "任务监控与日志场景引入增量更新、虚拟滚动、页面拆分，解决万级长列表卡顿与首屏加载问题；长期承担线上问题定位与复杂交互故障排查。",
        },
        {
          label: "AI 产品前端",
          text: "主导内部智能客服 Agent 从 0 到 1 上线，独立设计并开发对话式前端（多轮对话、上下文记忆、引用来源高亮、一键转人工），已接入售后与技术支持团队日常使用；并基于 Mastra（TypeScript Agent 框架）实践多 Agent 编排与 SSE 流式问答前端链路。",
        },
        {
          label: "移动端与跨端",
          text: "React Native iOS / Android 双端业务开发，覆盖导航、状态管理、登录态保持、权限与设备适配，熟悉从调试到打包发布链路。",
        },
      ],
    },
  ],

  projects: [
    {
      title: "个人网站 / 博客系统",
      href: "https://www.clczl.asia",
      stack: "Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 / Ant Design / Framer Motion / React Three Fiber / Prisma / PostgreSQL",
      desc: "个人重点项目｜独立完成设计、开发、部署与长期迭代的完整产品，在线可访问",
      bullets: [
        {
          label: "现代前端架构",
          text: "基于 Next.js App Router 组织路由与 Server/Client 组件边界，SSR + 静态生成兼顾首屏性能与 SEO（sitemap、robots、JSON-LD 结构化数据、RSS Feed）；按 feature 划分模块，组件、Hooks、类型分层清晰。",
        },
        {
          label: "3D 交互首屏",
          text: "React Three Fiber 实现 3D 模型 Hero 首屏，处理模型加载策略、渲染性能与低端设备降级方案；配合 Canvas 粒子/流星动画背景、Framer Motion 过渡动效与磁吸按钮等微交互，形成差异化视觉入口。",
        },
        {
          label: "主题与国际化体系",
          text: "next-themes 暗色/亮色双主题，CSS 变量 + Ant Design 组件级暗色覆盖统一视觉；自建 i18n 方案支持中/英/繁/西四语言切换。",
        },
        {
          label: "AI 功能前端",
          text: "实现 AI 对话（流式输出）、文章 AI 摘要、RAG 站内问答（Qdrant 向量检索）完整链路，前端覆盖流式 Markdown 渲染、加载与错误态、会话交互设计——把 AI 能力做成可用的产品功能。",
        },
        {
          label: "内容系统与后台",
          text: "博客（搜索/分类/标签/归档/分页）、评论（含 AI 审核评分）、文章管理后台（JWT + RBAC 鉴权）、简历页 PDF 导出与 A4 打印样式；Prisma + PostgreSQL 建模，Vercel 部署。",
        },
        {
          label: "工程化质量",
          text: "husky + lint-staged 提交门禁（ESLint 零警告策略 + Prettier）、Playwright 截图验证，保持长期迭代不劣化。",
        },
      ],
    },
    {
      title: "企业 Agent 智能支持平台（ArcFlow）",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "React 18 / Ant Design 6 / Playwright ＋ FastAPI / LangGraph / Qdrant（后端）",
      desc: "AI 产品前端 + 全栈｜企业落地版已接入团队日常使用",
      bullets: [
        {
          label: "Agent 对话工作台",
          text: "React 18 实现企业级 Agent 对话前端——流式回答、检索证据与来源溯源展示、敏感操作审批交互（HITL 人工审批门）、多岗位 Agent 按 RBAC 权限可见可用。",
        },
        {
          label: "契约测试守护",
          text: "9 条 Playwright E2E 用例守护 API 契约、页面信息架构与双后端（Python/Java）输出一致性，保障持续迭代不回归。",
        },
        {
          label: "AI 链路理解",
          text: "后端 LangGraph 四节点状态机（意图识别 → RAG 检索 + 工具调用 → 人工审批 → 回答组装）同样由本人实现，具备与算法/后端「说同一种语言」的协作能力。",
        },
        {
          label: "落地成效",
          text: "企业落地版接入售后、技术支持团队日常工作流，覆盖 80%+ 高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%。",
        },
      ],
    },
    {
      title: "迪备备份恢复系统（企业级中后台前端）",
      stack: "Vue 3 / TypeScript / WebSocket / grid-layout-plus / ECharts",
      desc: "企业级备份软件核心业务系统，长期负责前端架构、通用能力沉淀与复杂业务交互建设",
      bullets: [
        {
          label: "流程抽象",
          text: "主导备份/恢复向导框架设计与实现，工厂模式 + Context + Proxy 支撑 50+ 资源类型动态注入与跨步骤状态共享，新资源接入从「复制改造整套页面」降为「注册配置 + 差异步骤」，开发周期 2 周 → 2 天。",
        },
        {
          label: "组件体系",
          text: "沉淀 Components / Forms / Layout / Plugins 等 40+ 通用组件，支撑多条产品线复用，统一交互规范与视觉一致性。",
        },
        {
          label: "可视化大屏",
          text: "拖拽式大屏布局系统，12 × 12 网格 + 碰撞检测 + 自动放置 + 布局持久化，缩放坐标对齐与 WebSocket 实时数据推送保障长时间稳定运行。",
        },
        {
          label: "性能优化",
          text: "围绕任务监控、长列表与日志展示做增量更新、虚拟滚动与页面拆分，显著改善复杂页面的交互体验与响应效率。",
        },
      ],
    },
    {
      title: "内部综合管理系统（React 前端 + Java 全栈独立交付）",
      stack: "React / Java Spring Boot / MySQL / Redis / RabbitMQ / Nginx",
      desc: "公司内部核心业务系统｜个人独立完成前后端设计、开发与部署",
      bullets: [
        {
          label: "复杂流程前端",
          text: "React 实现许可证全流程（生成、导入校验、续期升级、套餐/功能映射、审批、出货、归档）的复杂表单与流程页面，支撑 50+ 种许可套餐动态组合，重复配置时间降低 80% 以上。",
        },
        {
          label: "全栈兜底能力",
          text: "独立完成 Spring Boot 后端（审批状态机、幂等设计、RBAC + 审计、Redis 缓存、RabbitMQ 事件解耦），具备前后端联调中「看穿接口背后逻辑」的排查效率。",
        },
      ],
    },
    {
      title: "跨端移动应用 / 小程序项目",
      stack: "React Native / iOS / Android / uni-app / 微信云开发",
      desc: "双端业务开发与发布链路实践，关注移动端体验细节",
      bullets: [
        {
          label: "React Native 跨端",
          text: "开发 iOS / Android 双端业务页面，处理导航、表单、列表、接口联调、全局状态、登录态保持与异常提示，保证同一套业务逻辑在双端一致交付；熟悉工程配置、真机调试、权限声明与打包发布流程。",
        },
        {
          label: "小程序与体验优化",
          text: "uni-app + 微信云开发实现 AI 改善计划小程序（云函数、离线优先数据同步、移动端交互适配）；关注弱网、触控热区、键盘遮挡、长列表滚动与空/加载态等移动端体验细节。",
        },
      ],
    },
  ],

  otherWorks: OTHER_WORKS,

  advantages: [
    {
      label: "前端深度 + 线上作品",
      text: "从企业级中后台（50+ 资源类型向导框架、40+ 组件库、拖拽大屏）到内容型站点（Next.js SSR/SEO、3D 首屏），多形态前端均有完整交付；作品集、预测平台、Chrome 插件均在线可访问。",
    },
    {
      label: "AI 应用前端稀缺经验",
      text: "做过真实上线的 Agent 对话产品前端（流式输出、引用溯源、HITL 审批交互、转人工），且理解 Agent/RAG 底层链路，是「会做 AI 产品的前端」。",
    },
    {
      label: "工程化与质量意识",
      text: "ESLint 零警告门禁、Playwright E2E 契约测试、CI/CD 交付门禁的长期实践者，代码可长期迭代不劣化。",
    },
    {
      label: "全栈兜底能力",
      text: "Java / Python 后端均有生产实践，能独立完成 BFF 与全栈交付，联调排查效率高，不依赖后端排期。",
    },
  ],
};
