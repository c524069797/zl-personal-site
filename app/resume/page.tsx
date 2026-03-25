import { ThemeToggle } from "@/components/ThemeToggle";
import { DownloadPDFButton } from "@/components/DownloadPDFButton";
import { LinkTransition } from "@/lib/link-transition";

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  title: "个人简历 | 前端开发工程师",
  description:
    "前端开发工程师简历，聚焦企业级中后台、复杂业务流程与 AI 全栈开发协作。",
  keywords: [
    "前端开发",
    "Vue.js",
    "Vue 3",
    "React",
    "TypeScript",
    "企业级中后台",
    "AI 全栈",
    "软件设计师",
    "CET-6",
    "简历",
  ],
  openGraph: {
    title: "个人简历 | 前端开发工程师",
    description: "前端开发工程师简历 | 企业级后台 | 复杂业务建模 | AI 全栈开发",
    type: "profile",
    url: `${siteUrl}/resume`,
    siteName: "个人简历",
  },
  twitter: {
    card: "summary",
    title: "个人简历 | 前端开发工程师",
    description: "前端开发工程师简历 - Vue/React/TS/AI 全栈开发",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${siteUrl}/resume`,
  },
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white">
      <div className="absolute top-4 right-4 print:hidden">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-16 print:max-w-full print:p-0 print:py-4">
        <div className="mb-8 print:hidden">
          <LinkTransition
            href="/"
            className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← 返回首页
          </LinkTransition>
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              个人简历
            </h1>
            <DownloadPDFButton />
          </div>
        </div>
        <div
          className="resume-paper mx-auto bg-white p-8 text-gray-900 shadow-lg print:p-0 print:shadow-none md:p-10"
          style={{ maxWidth: "210mm", minHeight: "297mm" }}
        >
          <header className="mb-4 border-b border-gray-300 pb-4">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="mb-1 text-4xl font-bold tracking-tight">
                  陈子龙
                </h1>
                <p className="text-lg font-medium text-gray-700">
                  前端开发工程师（具备 AI 全栈开发经验）
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  本科｜近 5 年前端经验｜广州
                </p>
              </div>
              <div className="space-y-1 text-right text-sm text-gray-700">
                <p>
                  <span>158-7444-2813</span>
                  <span className="mx-2">|</span>
                  <a
                    href="mailto:chenzhuo995@gmail.com"
                    className="hover:underline"
                  >
                    chenzhuo995@gmail.com
                  </a>
                </p>
                <p>
                  <a
                    href="https://github.com/c524069797"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    github.com/c524069797
                  </a>
                </p>
                <p>
                  <a
                    href="https://www.clczl.asia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    作品集：https://www.clczl.asia
                  </a>
                </p>
              </div>
            </div>
          </header>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              教育经历 / 语言能力
            </h2>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              <div>
                <div className="font-medium text-gray-800">
                  吉首大学｜软件工程（本科）
                </div>
                <div className="text-gray-600">2017.09 – 2021.06</div>
              </div>
              <div className="space-y-1 text-gray-800 md:text-right">
                <div>
                  <strong>英语：</strong>CET-6，英文技术文档与社区内容阅读通畅
                </div>
                <div>
                  <strong>日语：</strong>
                  具备听读能力，可阅读常见资料并理解基础交流内容
                </div>
                <div>
                  <strong>证书：</strong>软件设计师（中级）
                </div>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              专业技能
            </h2>
            <div className="space-y-2 text-[13px] leading-relaxed text-gray-800">
              <div>
                <span className="font-semibold text-gray-900">
                  前端开发技术：
                </span>
                Vue 2 / Vue 3 / React / Next.js /
                TypeScript，能够独立完成企业级中后台页面、复杂表单、向导流程、组件抽象、可视化大屏与双端适配开发；熟悉
                Ant Design、ECharts、DataV。
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  工程化与质量：
                </span>
                Vite / Webpack / Monorepo / ESLint / Vitest / GitLab
                CI/CD，具备性能优化、模块拆分、代码规范建设、虚拟列表、WebSocket
                实时链路与线上问题排查经验。
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  AI 应用与全栈协作：
                </span>
                具备 Next.js API / Node.js、Python / Flask 实践，能够结合
                Mastra、OpenClaw、Agent
                工作流完成问答、诊断、结构化输出与工具联动，具备 AI
                全栈开发能力；了解 Java / Spring 与常见后台中间件用法，对
                PostgreSQL / MySQL / Redis 等数据库与缓存有学习和了解。
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              工作经历
            </h2>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <h3 className="text-lg font-bold">
                  广州鼎甲计算机科技有限公司
                </h3>
                <span className="font-medium text-gray-600">
                  2021.07 – 至今
                </span>
              </div>
              <div className="mb-1 text-sm italic text-gray-700">
                前端开发工程师｜核心业务组
              </div>
              <p className="mb-2 text-xs text-gray-500">
                负责产品：企业级备份软件、许可证与内部综合管理系统、数据可视化监控大屏等核心业务模块，长期服务复杂流程型场景，支撑
                50+ 资源类型接入与多条产品线业务协同。
              </p>
              <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                <li>
                  <strong>架构设计：</strong>为解决多资源类型备份 /
                  恢复流程重复开发问题，设计通用向导框架，基于{" "}
                  <strong>工厂模式 + Context + Proxy</strong> 支撑{" "}
                  <strong>50+ 资源类型</strong>
                  动态注入与跨步骤状态共享，减少同类功能重复实现。
                </li>
                <li>
                  <strong>业务建模：</strong>
                  主导许可证生成、导入校验、续期升级、套餐 /
                  功能映射等前端设计与实现，推动审批、出货与归档流程由表格 /
                  钉钉记录转向系统化闭环，支撑多条产品线与{" "}
                  <strong>
                    50+ 种许可套餐
                  </strong>动态组合，将重复配置时间降低{" "}
                  <strong>80% 以上</strong>。
                </li>
                <li>
                  <strong>可视化与实时链路：</strong>基于{" "}
                  <strong>grid-layout-plus</strong> 实现拖拽式大屏布局系统，支持{" "}
                  <strong>12 × 12</strong>{" "}
                  网格、碰撞检测、自动放置与布局持久化；结合{" "}
                  <strong>WebSocket</strong>{" "}
                  推送、缓冲队列与重连机制，保障任务状态秒级同步与长时间稳定运行。
                </li>
                <li>
                  <strong>性能与问题排查：</strong>围绕任务监控与日志展示引入{" "}
                  <strong>增量更新</strong>、<strong>虚拟滚动</strong>{" "}
                  与页面拆分，优化首屏与长列表体验，
                  <strong>TTI 下降约 30%</strong>
                  ；同时长期承担线上问题定位、状态链路追踪与复杂交互故障排查工作。
                </li>
                <li>
                  <strong>AI 业务落地：</strong>补充{" "}
                  <strong>scutech-licenser 客服 Agent</strong> MVP，串联
                  approval、request、audit_logs
                  等业务数据用于报错诊断、审批解释与进度追踪，体现从前端到 AI
                  全栈协作的落地能力。
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              项目经历
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="mb-1 text-sm font-semibold text-gray-800">
                  AI 投资助手（Next.js 16、React
                  19、TypeScript、Mastra、PostgreSQL、OpenClaw）
                </h4>
                <p className="mb-1 text-xs text-gray-500">
                  在线访问：
                  <a
                    href="https://aiold.clczl.asia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    https://aiold.clczl.asia/
                  </a>
                </p>
                <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                  <li>
                    <strong>前端产品化：</strong>
                    围绕“我的自选股”重构产品首页，拆分桌面端 dashboard
                    与移动端卡片化布局，抽象 App Shell、BottomNav
                    与断点适配方案，统一双端体验并降低后续迭代成本。
                  </li>
                  <li>
                    <strong>AI 应用开发：</strong>基于{" "}
                    <strong>Next.js + Mastra</strong> 实现投资顾问
                    Agent，对接行情、技术指标、关键位、近 7
                    日新闻等多源数据，形成“用户问题 → 工具调用 →
                    结构化输出”的完整链路。
                  </li>
                  <li>
                    <strong>工作流联动：</strong>接入公众号 / 大 V 内容分析与{" "}
                    <strong>OpenClaw</strong>{" "}
                    工作流，自动抓取、摘要与同步观点信息，为个股分析补充消息面参考，也体现了从前端到
                    AI 后端编排的全栈落地能力。
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-1 text-sm font-semibold text-gray-800">
                  个人网站 / 博客系统（Next.js 16、React 19、TypeScript、Ant
                  Design、PostgreSQL、Prisma）
                </h4>
                <p className="mb-1 text-xs text-gray-500">
                  在线访问：
                  <a
                    href="https://www.clczl.asia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    https://www.clczl.asia
                  </a>
                </p>
                <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                  <li>
                    <strong>完整产品搭建：</strong>
                    独立实现博客、简历、评论、文章管理等能力，支持 Markdown
                    内容渲染、暗黑模式、RSS、PDF
                    导出与响应式页面，作为个人作品集长期对外展示。
                  </li>
                  <li>
                    <strong>内容型前端能力：</strong>
                    围绕内容展示与阅读体验完成信息架构、页面设计与组件抽象，并结合
                    SSR / SEO 优化提升站点可访问性与展示效果。
                  </li>
                  <li>
                    <strong>AI 增强：</strong>接入 AI
                    文章摘要、关键词提取与站内问答能力，将内容产品与 AI
                    功能结合，形成更完整的个人技术展示载体。
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              其他个人作品
            </h2>
            <div className="space-y-1 text-[13px] text-gray-800">
              <p>
                更多项目可见作品集：
                <a
                  href="https://www.clczl.asia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  https://www.clczl.asia
                </a>
              </p>
              <p>
                1. <strong>SportOracle 体育预测平台</strong>：AI
                驱动的体育预测产品，支持比赛分析与预测信息展示。 在线地址：
                <a
                  href="https://nba.clczl.asia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  https://nba.clczl.asia/
                </a>
              </p>
              <p>
                2. <strong>织趣社区</strong>
                ：面向钩织爱好者的社区产品，包含产品库、教程资源与讨论区。
                在线地址：
                <a
                  href="https://zhiqu.clczl.asia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  https://zhiqu.clczl.asia/
                </a>
              </p>
              <p>
                3. <strong>Sports Hub 浏览器插件</strong>：聚合
                NBA、足球、电竞赛事信息的 Chrome Extension。 GitHub：
                <a
                  href="https://github.com/c524069797/sports-hub-extension"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  github.com/c524069797/sports-hub-extension
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              个人优势
            </h2>
            <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
              <li>
                <strong>前端主导能力明确：</strong>
                长期负责企业级中后台、复杂流程与可视化页面建设，覆盖备份、许可证、监控大屏等高复杂度业务场景。
              </li>
              <li>
                <strong>具备 AI 全栈开发能力：</strong>能够基于 Next.js / Python
                / PostgreSQL 结合 Agent
                与工作流完成产品原型、功能联调与上线落地。
              </li>
              <li>
                <strong>有真实线上作品：</strong>已上线个人作品集、AI
                投资助手、体育预测平台、垂直社区等多个可访问项目，具备独立开发与部署意识。
              </li>
              <li>
                <strong>学习与专业基础扎实：</strong>
                持有软件设计师（中级）认证，英语六级，具备日语听读能力，可直接阅读英文技术文档与部分日文资料。
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
