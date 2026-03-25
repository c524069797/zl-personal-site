import { ThemeToggle } from "@/components/ThemeToggle";
import { DownloadPDFButton } from "@/components/DownloadPDFButton";
import { LinkTransition } from "@/lib/link-transition";

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  title: "个人简历 | 前端开发工程师",
  description: "前端开发工程师简历，聚焦企业级中后台、复杂业务流程与 AI Agent 落地。",
  keywords: [
    "前端开发",
    "Vue.js",
    "Vue 3",
    "React",
    "TypeScript",
    "AI Agent",
    "Mastra",
    "PostgreSQL",
    "性能优化",
    "简历",
  ],
  openGraph: {
    title: "个人简历 | 前端开发工程师",
    description: "前端开发工程师简历 | 企业级后台 | 复杂业务建模 | AI Agent 落地",
    type: "profile",
    url: `${siteUrl}/resume`,
    siteName: "个人简历",
  },
  twitter: {
    card: "summary",
    title: "个人简历 | 前端开发工程师",
    description: "前端开发工程师简历 - Vue/React/TS/AI Agent",
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
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
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
          <header className="mb-4 flex items-start justify-between border-b border-gray-300 pb-4">
            <div>
              <h1 className="mb-1 text-4xl font-bold uppercase tracking-tight">陈子龙</h1>
              <p className="text-lg font-medium text-gray-600">前端开发工程师 / 企业应用方向</p>
            </div>
            <div className="space-y-1 text-right text-sm">
              <p>
                <a href="mailto:chenzhuo995@gmail.com" className="hover:underline">chenzhuo995@gmail.com</a>
                <span className="mx-2">|</span>
                <span>近5年经验</span>
              </p>
              <p>
                <span>158-7444-2813</span>
                <span className="mx-2">|</span>
                <span>广州</span>
              </p>
              <p>
                <a href="https://www.clczl.asia" target="_blank" rel="noopener noreferrer" className="hover:underline">clczl.asia</a>
              </p>
            </div>
          </header>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              教育 / 语言
            </h2>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              <div>
                <div className="font-medium text-gray-800">吉首大学｜软件工程（本科）</div>
                <div className="text-gray-600">2017.09 – 2021.06</div>
              </div>
              <div className="text-gray-800 md:text-right">
                <div><strong>英语：</strong>英语六级，英文技术文档与英文内容阅读通畅</div>
                <div><strong>日语：</strong>日语内容阅读通畅</div>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              个人总结
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-800 text-justify">
              拥有近5年前端开发经验，长期聚焦 <strong>企业级中后台</strong>、<strong>复杂业务流程建模</strong> 与 <strong>配置化系统建设</strong>。
              熟练使用 <strong>Vue 2 / Vue 3</strong>、<strong>React</strong>、<strong>TypeScript</strong>，可独立推进复杂表单、向导流程、可视化页面、组件抽象与性能优化。
              近一年重点将 <strong>Mastra / OpenClaw / AI Agent</strong> 用于真实业务与个人产品落地，关注工具调用链、工作流联动、结构化输出与用户可持续追问体验。
              在备份、许可证、监控大屏等项目中持续承担核心模块设计与落地，并具备与 <strong>Java / Spring</strong>、<strong>Python / Flask</strong> 后端团队协作联调的经验，以及应用 <strong>AI</strong> 辅助此类后端开发的能力。
            </p>
          </section>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              核心技能
            </h2>
            <div className="grid grid-cols-1 gap-2 text-[13px] md:grid-cols-4">
              <div className="col-span-4 font-bold text-gray-700 md:col-span-1">前端核心</div>
              <div className="col-span-4 md:col-span-3">
                <span className="font-semibold">Vue 2 / Vue 3：</span>复杂表单、向导流程、中后台页面与业务组件抽象。
                <br />
                <span className="font-semibold">React / Next.js：</span>Hooks、App Router、SSR / SSG、页面开发与接口联调。
                <br />
                <span className="font-semibold">TypeScript：</span>类型建模、泛型抽象与边界约束。
                <br />
                HTML5 / CSS3 / JavaScript（ES6+）/ Ant Design / ECharts / DataV
              </div>

              <div className="col-span-4 font-bold text-gray-700 md:col-span-1">AI 工程</div>
              <div className="col-span-4 md:col-span-3">
                熟悉 Mastra Agent、工具调用链、OpenClaw 工作流联动，能够围绕真实场景实现问答、诊断、内容分析与结构化输出；了解 AI Design、Claude Cowork、Prompt / Harness 工程。
              </div>

              <div className="col-span-4 font-bold text-gray-700 md:col-span-1">工程化与质量</div>
              <div className="col-span-4 md:col-span-3">
                Vite / Webpack / Monorepo / ESLint / Vitest / GitLab CI/CD，可推进代码规范统一、组件沉淀与自动化构建落地。
              </div>

              <div className="col-span-4 font-bold text-gray-700 md:col-span-1">后端与协作</div>
              <div className="col-span-4 md:col-span-3">
                具备与 Java / Spring、Python / Flask 后端团队协作联调经验，能够完成接口对接、链路排查与基础数据建模；并可应用 AI 辅助此类后端的接口开发、代码生成与问题排查。熟悉 Node.js / Next.js API Routes、PostgreSQL / MySQL / Prisma 的常见用法。
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              工作经历
            </h2>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <h3 className="text-lg font-bold">广州鼎甲计算机科技有限公司</h3>
                <span className="font-medium text-gray-600">2021.07 – 至今</span>
              </div>
              <div className="mb-2 text-sm italic text-gray-700">前端开发工程师 | 核心业务组</div>

              <div className="mb-3">
                <h4 className="mb-1 font-semibold text-gray-800 text-sm">
                  项目：主力企业级备份软件（Vue 3、TypeScript、自研组件库）
                </h4>
                <p className="mb-1 text-xs text-gray-500">
                  面向企业级备份与存储场景，负责备份向导、资源接入、存储池、许可证与基础组件体系建设。
                </p>
                <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                  <li>
                    <strong>流程抽象：</strong>设计通用备份向导框架，基于 <strong>工厂模式 + Context + Proxy</strong> 支撑多类资源类型的动态注入与跨步骤状态共享，显著减少同类页面重复开发。
                  </li>
                  <li>
                    <strong>核心业务建设：</strong>负责许可证与存储池模块设计实现，优化前端状态机与接口链路，显著缩短许可证签发等待时间；统一本地磁盘、NFS、S3 等多种存储后端接入体验。
                  </li>
                  <li>
                    <strong>性能与工程化：</strong>围绕日志流式展示引入 <strong>虚拟滚动 + WebSocket 缓冲 + 增量更新</strong>；同步沉淀 SmartUnitInput、WizardWrap 等高阶业务组件，并升级 ESLint 9、Vitest 与 GitLab CI/CD。
                  </li>
                </ul>
              </div>

              <div className="mb-3">
                <h4 className="mb-1 font-semibold text-gray-800 text-sm">
                  项目：企业内部综合管理系统（Vue 3、Python / Flask、PostgreSQL、AI Agent）
                </h4>
                <p className="mb-1 text-xs text-gray-500">
                  面向许可证、合同、维保、出货、归档等内部核心流程，负责业务系统建设、流程抽象与 AI 能力落地。
                </p>
                <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                  <li>
                    <strong>业务系统建设：</strong>围绕许可证、合同、维保、出货、归档等核心流程推进前后端协同建设，推动原先分散在 Excel / 钉钉中的流程逐步系统化，并沉淀统一的表单、审批与归档交互模式。
                  </li>
                  <li>
                    <strong>复杂业务建模：</strong>主导“按套餐售卖”能力的多系统打通，设计高灵活度套餐映射与权限方案，<strong>用套餐全面替代旧的申请模式</strong>，将重复配置时间减少 <strong>80%-90% 以上</strong>，并支撑多种许可套餐的动态组合与审批流转。
                  </li>
                  <li>
                    <strong>AI 能力落地：</strong>落地 <strong>scutech-licenser 客服 Agent</strong> MVP，用于系统报错诊断、审批原因解释、申请去向追踪，串联 approval、request、audit_logs 等线索，帮助一线支持更快定位问题。
                  </li>
                  <li>
                    <strong>流程与数据治理：</strong>结合 PostgreSQL JSONB、UUID 松耦合关联与 APScheduler 归档策略，支撑灵活配置、状态追踪与历史数据维护，降低跨部门沟通与人工排查成本。
                  </li>
                </ul>
              </div>

              <div className="mb-3">
                <h4 className="mb-1 font-semibold text-gray-800 text-sm">
                  项目：数据可视化监控大屏（Vue 3、grid-layout-plus、DataV）
                </h4>
                <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                  <li>
                    <strong>布局编辑器：</strong>基于 grid-layout-plus 实现拖拽式布局系统，支持行列动态配置、模块碰撞检测、自动放置与布局持久化，满足多种大屏编排需求。
                  </li>
                  <li>
                    <strong>稳定性与体验：</strong>实现心跳检测与指数退避重连机制，保障大屏长时间稳定运行；支持运行时主题切换与无刷新换肤。
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-1 font-semibold text-gray-800 text-sm">
                  项目：研发效能提升工具（JavaScript、Chrome Extension）
                </h4>
                <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                  <li>
                    <strong>流程自动化：</strong>开发 Chrome 扩展并集成 GitLab API，实现代码 Review 一键辅助、分支状态监控、自动登录与验证码识别，减少日常重复检查与手工操作。
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold uppercase tracking-wide">
              个人项目
            </h2>
            <div>
              <h4 className="mb-1 font-semibold text-gray-800 text-sm">
                AI 投资助手（Next.js 16、React 19、TypeScript、Mastra、PostgreSQL、OpenClaw）
                <span className="ml-2 text-xs font-normal text-gray-500">项目地址：https://aiold.clczl.asia/</span>
              </h4>
              <p className="mb-1 text-xs text-gray-500">
                面向家人使用的 AI 投资分析工具，重点服务中老年用户，围绕“我的自选股”提供更低门槛的行情跟踪、新闻汇总、技术位判断与问答陪伴。
              </p>
              <ul className="ml-5 list-disc space-y-1 text-[13px] text-gray-800">
                <li>
                  <strong>Agent 框架：</strong>基于 <strong>TypeScript + Mastra</strong> 实现投资顾问对话框架，抽象 Agent 指令、人设约束、流式会话与工具调用链，形成“业务意图 → 工具调用 → 结构化输出”的完整链路。
                </li>
                <li>
                  <strong>大 V 内容联动：</strong>接入公众号 / 大 V 内容分析能力，自动解析近三个月观点、标签与摘要，并与 <strong>OpenClaw</strong> 工作流联动完成抓取、更新与同步，为个股分析补充消息面与观点面参考。
                </li>
                <li>
                  <strong>多源聚合分析：</strong>围绕单只股票聚合实时行情、技术指标、量能、关键位、近 7 日新闻、龙虎榜、概念板块等多维信息，并结合历史会话形成更连续的 AI 分析体验。
                </li>
                <li>
                  <strong>产品重构：</strong>将首页从泛行情展示重构为“自选股 AI 决策台”，围绕持仓与关注股票组织更易理解的信号、新闻与问答入口，提升非专业用户的使用友好度。
                </li>
                <li>
                  <strong>双端样式重构：</strong>基于统一的 <strong>App Shell（AppHeader + BottomNav）</strong>、<strong>useBreakpoint</strong> 与桌面 / 移动双布局拆分，重构首页、聊天、自选股与分析卡样式；将桌面端 dashboard 栅格与移动端卡片化布局分离，并抽象公共样式类和关键区域适配，统一双端体验并降低后续迭代成本。
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
