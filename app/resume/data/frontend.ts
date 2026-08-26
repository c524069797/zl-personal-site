import type { ResumeData } from "./types";
import { EMPLOYMENT_DATE, OTHER_WORKS } from "./shared";

/** AI 应用 Web 版：投 Web 开发工程师（AI 方向） */
export const frontendResume: ResumeData = {
  tabLabel: "AI Web 开发",
  role: "Web 开发工程师（React / Next.js，AI 应用方向）",
  meta: "本科｜近 5 年 Web 开发经验｜AI 产品落地实践",
  summary:
    "近 5 年 Web 开发经验，覆盖企业级中后台、复杂表单向导、可视化大屏、内容型站点与跨端移动应用等多种形态。参与真实上线的 AI Agent 产品建设，负责流式输出、引用溯源、HITL 审批交互和一键转人工等产品能力，同时理解 Agent 与 RAG 底层链路，能够与算法、后端协作，独立完成 AI 功能从交互设计到产品上线的交付。",

  skillGroups: [
    {
      title: "Web 开发",
      iconKey: "frontend",
      skills: [
        "React",
        "Next.js",
        "Vue 3",
        "TypeScript",
        "Ant Design",
        "Tailwind CSS",
        "ECharts",
        "Vite",
        "Webpack",
        "Vitest",
        "Playwright",
        "性能优化",
        "企业级中后台",
        "复杂表单与流程",
        "组件抽象与设计系统",
        "WebSocket 实时链路",
        "长列表与日志优化",
        "SSR / SEO",
        "React Three Fiber",
        "Framer Motion",
        "React Native",
      ],
    },
    {
      title: "AI 技能",
      iconKey: "agent",
      skills: [
        "SSE 流式对话",
        "LangGraph",
        "RAG",
        "Tool Calling",
        "HITL 人工审批",
      ],
    },
    {
      title: "后端",
      iconKey: "backend",
      skills: [
        "Java",
        "Spring Boot",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "Redis",
        "WebSocket",
      ],
    },
  ],

  experience: [
    {
      company: "广州鼎甲计算机科技有限公司",
      date: EMPLOYMENT_DATE,
      role: "Web 软件工程师",
      desc: "负责企业级备份软件、许可证与内部综合管理系统、数据可视化监控大屏等核心产品的 Web 架构与开发，支撑 50+ 资源类型接入与多条产品线协同。",
      bullets: [
        {
          label: "通用向导框架",
          text: "为解决多资源类型备份/恢复流程重复开发问题，设计基于工厂模式 + Context + Proxy 的通用向导框架，支持 50+ 资源类型动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。",
        },
        {
          label: "组件库建设",
          text: "主导企业级 Vue 3 组件库与通用能力建设，沉淀 Components / Forms / Layout / Plugins 等 40+ 组件，支撑多条产品线复用。",
        },
        {
          label: "可视化大屏系统",
          text: "基于 grid-layout-plus 实现拖拽式大屏布局，支持 12 × 12 网格、碰撞检测、自动放置与布局持久化；通过 VScaleScreen / transform-scale 解决缩放后的坐标对齐问题；结合 WebSocket 推送、缓冲队列与重连机制，保障任务状态秒级同步和长时间稳定运行。",
        },
        {
          label: "性能优化",
          text: "针对任务监控与日志场景引入增量更新、分段加载与页面拆分，解决万级长列表卡顿和首屏加载问题；长期承担线上问题定位与复杂交互故障排查。",
        },
        {
          label: "AI 产品交付",
          text: "主导内部智能客服 Agent 从 0 到 1 上线，独立设计并开发对话式产品，支持多轮对话、上下文记忆、引用来源高亮和一键转人工，已接入售后与技术支持团队日常使用；同时基于 Mastra（TypeScript Agent 框架）实践多 Agent 编排与 SSE 流式问答链路。",
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
      title: "企业 Agent 智能支持平台",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "React 18 / Ant Design 6 / Playwright ＋ FastAPI / LangGraph / Qdrant（后端）",
      desc: "AI 产品开发 + 全栈协作｜企业落地版已接入团队日常使用",
      bullets: [
        {
          label: "Agent 对话工作台",
          text: "React 18 实现企业级 Agent 对话工作台——流式回答、检索证据与来源溯源展示、敏感操作审批交互（HITL 人工审批门）、多岗位 Agent 按 RBAC 权限可见可用。",
        },
        {
          label: "契约测试守护",
          text: "10 条 Playwright E2E 用例守护 API 契约、页面信息架构与双后端（Python/Java）输出一致性，保障持续迭代不回归。",
        },
        {
          label: "AI 链路理解",
          text: "理解后端 LangGraph 六节点状态机（意图识别 → RAG 检索 + 工具调用 → 检索质量评估 → 查询改写 → 人工审批 → 回答组装）与 Agent 工程骨架（工具封装、错误降级、SSE 流式、会话持久化），能够与算法和后端围绕状态流转、接口契约及异常处理高效协作。",
        },
        {
          label: "落地成效",
          text: "企业落地版已接入售后、技术支持团队的日常工作流，覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%。",
        },
      ],
    },
    {
      title: "备份恢复系统（企业级 Web 应用）",
      stack: "Vue 3 / TypeScript / WebSocket / grid-layout-plus / ECharts",
      desc: "企业级备份软件核心业务系统，长期负责 Web 架构、通用能力沉淀与复杂业务交互建设",
      bullets: [
        {
          label: "流程抽象",
          text: "主导备份/恢复向导框架设计与实现，基于工厂模式 + Context + Proxy 支持 50+ 资源类型动态注入与跨步骤状态共享；新资源接入从「复制改造整套页面」简化为「注册配置 + 差异步骤」，开发周期从 2 周缩短到 2 天。",
        },
        {
          label: "组件体系",
          text: "沉淀 Components / Forms / Layout / Plugins 等 40+ 通用组件，支撑多条产品线复用，统一交互规范与视觉一致性。",
        },
        {
          label: "可视化大屏",
          text: "建设拖拽式大屏布局系统，支持 12 × 12 网格、碰撞检测、自动放置和布局持久化；通过缩放坐标对齐与 WebSocket 实时数据推送，保障长时间稳定运行。",
        },
        {
          label: "性能优化",
          text: "围绕任务监控、长列表与日志展示采用增量更新、分段加载和页面拆分，改善复杂页面的交互体验与响应效率。",
        },
      ],
    },
    {
      title: "内部综合管理系统（React + Java 全栈独立交付）",
      stack: "React / Java Spring Boot / MySQL / Redis / RabbitMQ / Nginx",
      desc: "公司内部核心业务系统｜个人独立完成 Web 应用与后端设计、开发与部署",
      bullets: [
        {
          label: "复杂业务 Web 应用",
          text: "使用 React 实现许可证生成、导入校验、续期升级、套餐/功能映射、审批、出货和归档等流程页面，支撑 50+ 种许可套餐动态组合，将重复配置时间降低 80% 以上。",
        },
        {
          label: "全栈兜底能力",
          text: "独立完成 Spring Boot 后端的审批状态机、幂等设计、RBAC、审计、Redis 缓存和 RabbitMQ 事件解耦，能够在 Web 应用与服务联调中快速定位接口背后的业务逻辑问题。",
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

  advantage:
    "**多年 Web 开发经验**，有设计经验与审美判断；有 **AI 嗅觉**，熟悉 Agent 与 RAG 流程，能将 AI 能力落地为可用、可交付、可持续迭代的产品。",
};
