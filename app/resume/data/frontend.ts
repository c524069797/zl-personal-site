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
      title: "Web 与跨端开发",
      iconKey: "frontend",
      skills: [
        "React",
        "Flutter",
        "Electron",
        "Taro",
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
      title: "内部综合管理系统（业务管理与智能客服）",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "React / Java Spring Boot / Python FastAPI / LangGraph / RAG / MySQL / Redis / RabbitMQ",
      desc: "公司内部系统覆盖许可证、审批与售后支持，智能客服已接入日常工作；Agent 审批、GraphRAG 与双后端为个人扩展实现",
      bullets: [
        {
          label: "业务管理与对话工作台",
          text: "使用 React 实现许可证配置、审批、出货及智能客服页面；对话界面支持流式回答、来源引用、业务状态查询与转人工，重复配置时间降低 80% 以上。",
        },
        {
          label: "知识与业务数据接入",
          text: "将产品文档、历史工单、Wiki 与 SOP 构建为可检索知识库；主系统通过只读聚合 API 提供申请、审批和工单状态，支持审批解释、报错诊断与进度查询。",
        },
        {
          label: "Agent 能力扩展（个人项目）",
          text: "在个人扩展平台中实现岗位 Agent 可见范围、人工审批交互与检索证据展示，通过 Playwright 验证页面和 API 契约；后端基于 LangGraph 编排检索与工具调用。",
        },
        {
          label: "落地成效",
          text: "内部智能客服已接入售后、技术支持团队日常工作，覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，重复工单减少约 30%。",
        },
      ],
    },
    {
      title: "liveshop-ai 直播电商 AI 助播平台",
      stack: "Java Spring Boot / React / Flutter / Redis / RabbitMQ / RAG",
      desc: "个人练手项目｜同一后端服务支持主播中控台与观众 Web、Flutter App",
      bullets: [
        {
          label: "交易与直播间交互",
          text: "使用 Redis Lua 扣减秒杀库存，RabbitMQ 异步落单并释放超时未支付订单；通过 STOMP 推送弹幕，React 实现主播中控台和观众页面，Flutter 实现观众 App。",
        },
        {
          label: "AI 助播",
          text: "将弹幕攒批做意图分类；商品资料经本地向量化后用于 RAG 问答，通过 SSE 输出商品回答与讲品话术。",
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
          text: "主导备份/恢复向导框架设计与实现，基于工厂模式 + Context + Proxy 支持 多种资源类型动态注入与跨步骤状态共享；新资源接入从「复制改造整套页面」简化为「注册配置 + 差异步骤」，开发周期从 2 周缩短到 2 天。",
        },
        {
          label: "组件体系",
          text: "沉淀 Components / Forms / Layout / Plugins 等模块，供多条产品线复用，统一交互与视觉规范。",
        },
        {
          label: "可视化大屏",
          text: "建设拖拽式大屏布局系统，支持网格布局、碰撞检测、自动放置和布局持久化；通过缩放坐标对齐与 WebSocket 推送更新任务状态。",
        },
        {
          label: "性能优化",
          text: "围绕任务监控、长列表与日志展示采用增量更新、分段加载和页面拆分，改善复杂页面的交互体验与响应效率。",
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
    "长期开发企业 Web 应用，负责复杂流程、组件与数据展示；参与智能客服 Agent 的对话交互、来源引用和业务数据接入。",
};
