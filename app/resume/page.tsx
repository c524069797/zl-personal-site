import { ThemeToggle } from "@/components/ThemeToggle";
import { DownloadPDFButton } from "@/components/DownloadPDFButton";
import { LinkTransition } from "@/lib/link-transition";

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  title: "简历 | 陈灼 - 高级前端工程师",
  description: "陈灼(Zhuo Chen) - 4.5年前端开发经验，精通Vue 2/3与TypeScript，擅长企业级SaaS后台与复杂数据流管理。具备全栈视野 (Node.js/PostgreSQL)。",
  keywords: [
    "前端开发",
    "Vue.js",
    "Vue 3",
    "React",
    "TypeScript",
    "PostgreSQL",
    "SaaS",
    "性能优化",
    "高级前端工程师",
    "简历",
  ],
  openGraph: {
    title: "简历 | 陈灼 - 高级前端工程师",
    description: "4.5年前端经验 | Vue 2/3 专家 | 擅长复杂业务建模与性能优化",
    type: "profile",
    url: `${siteUrl}/resume`,
    siteName: "陈灼的个人主页",
  },
  twitter: {
    card: "summary",
    title: "简历 | 陈灼",
    description: "高级前端工程师简历 - Vue/React/TS",
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

        {/* 简历主体 - A4纸质感 */}
        <div
          className="resume-paper bg-white text-gray-900 shadow-lg print:shadow-none p-8 md:p-12 print:p-0 mx-auto"
          style={{ maxWidth: '210mm', minHeight: '297mm' }}
        >
          {/* Header Section */}
          <header className="pb-6 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">陈灼</h1>
              <p className="text-lg font-medium text-gray-600">高级前端开发工程师 (Senior Frontend Engineer)</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <p>
                <a href="mailto:chenzhuo995@gmail.com" className="hover:underline">chenzhuo995@gmail.com</a>
                <span className="mx-2">|</span>
                <span>4.5年经验</span>
              </p>
              <p>
                <span>131-XXXX-XXXX</span>
                <span className="mx-2">|</span>
                <span>广州</span>
              </p>
              {/* 可选：添加GitHub或个人网站链接 */}
              <p>
                <a href="https://github.com/chenzhuo995" target="_blank" rel="noopener noreferrer" className="hover:underline">github.com/chenzhuo995</a>
              </p>
            </div>
          </header>

          {/* Professional Summary */}
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide">
              个人总结
            </h2>
            <p className="text-sm leading-relaxed text-gray-800 text-justify">
              拥有4.5年前端开发经验，核心精通 <strong>Vue 2/Vue 3</strong> 与 <strong>React</strong> 生态，具备深厚的组件化架构设计与性能优化能力。
              在企业级备份软件与OA系统中，主导过从复杂业务逻辑到通用组件库的沉淀，成功将页面交互TTI降低30%。
              熟练使用 <strong>uni-app</strong> 进行跨端开发，具备微信小程序全流程部署经验。
              具备全栈能力，掌握 <strong>Python/Flask</strong> 后端开发及 <strong>PostgreSQL</strong> 数据库设计，善于利用工程化手段（CI/CD、自动化脚本）解决团队痛点。
            </p>
          </section>

          {/* Skills Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide">
              技术栈
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="col-span-4 md:col-span-1 font-bold text-gray-700">前端核心 (Expert)</div>
              <div className="col-span-4 md:col-span-3">
                <span className="font-semibold">Vue 2 / Vue 3 (Composition API):</span> 深入理解响应式原理，熟练掌握 Vuex/Pinia 状态管理。
                <br />
                <span className="font-semibold">React:</span> 熟练使用 Hooks (useEffect, useMemo) 及 Next.js 框架进行 SSR 开发。
                <br />
                <span className="font-semibold">TypeScript:</span> 熟练使用泛型与类型推断，保障大型项目代码健壮性。
                <br />
                HTML5 / CSS3 / JavaScript (ES6+)
              </div>

              <div className="col-span-4 md:col-span-1 font-bold text-gray-700">后端 & 全栈</div>
              <div className="col-span-4 md:col-span-3">
                <span className="font-semibold">Python / Flask:</span> 基于 Blueprint 模块化架构开发企业级后台，熟练运用装饰器模式实现审计日志自动记录。
                <br />
                <span className="font-semibold">Node.js:</span> 熟悉 Express/Koa 后端开发，具备 RESTful API 设计能力。
                <br />
                <span className="font-semibold">数据库:</span> PostgreSQL JSONB/数组类型、psycopg2 连接池、SQL 查询优化 (JOIN, Indexing)。
              </div>

              <div className="col-span-4 md:col-span-1 font-bold text-gray-700">工程化 & 工具</div>
              <div className="col-span-4 md:col-span-3">
                Vite / Webpack 构建优化, CI/CD 自动化部署, Jest 单元测试, Git 工作流, 浏览器插件开发。
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide">
              工作经历
            </h2>

            {/* Job 1 */}
            <div className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold">广州某软件公司</h3>
                <span className="text-sm font-medium text-gray-600">2021.07 – 至今</span>
              </div>
              <div className="text-md italic text-gray-700 mb-2">
                前端开发工程师 | 核心业务组
              </div>

              {/* Project 1.1 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-1">
                  项目：主力企业级备份软件 (Vue 3, TypeScript, 自研组件库)
                </h4>
                <p className="text-xs text-gray-500 mb-2">负责存储策略配置、资源监控 Dashboard、许可证管理系统的全生命周期开发，以及核心组件库与中后台基础框架的架构升级与维护。</p>
                <div className="mb-2">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Vue 3</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Vite</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Bootstrap 5 (Sass)</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Vitest</span>
                </div>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
                  <li>
                    <strong>备份恢复界面设计</strong>：负责核心备份/恢复功能的前端架构设计与开发，基于 Vue 3 Composition API 实现复杂表单状态管理，支持文件、数据库、虚拟机等多种资源类型的配置向导。
                  </li>
                  <li>
                    <strong>许可证与存储池模块</strong>：设计并开发许可证管理模块，优化前端状态机逻辑与 API 交互，将签发耗时从 <strong>3-5分钟降低至10秒级</strong>；开发存储池管理模块，实现存储资源的可视化配置与容量监控，支持多种存储后端（本地磁盘、NFS、S3）的统一接入。
                  </li>
                  <li>
                    <strong>性能优化</strong>：深入剖析海量数据渲染瓶颈，引入虚拟滚动与 Web Worker 并行计算机制，将万级日志列表的渲染帧率稳定在 60FPS，彻底解决主线程阻塞导致的交互卡顿。
                  </li>
                  <li>
                    <strong>通用组件库建设</strong>：主导自研 UI 组件库架构设计，采用源码级集成 Bootstrap 5 策略，建立语义化的 Design Token 系统。封装 SmartUnitInput、WizardWrap 等 <strong>20+ 高阶业务组件</strong>，支撑多条业务线高效开发，减少约 <strong>1-2小时/人天</strong> 的重复开发工时。
                  </li>
                  <li>
                    <strong>工程化与 CI/CD 建设</strong>：升级 ESLint 9 (Flat Config) 体系，落地 Vitest 单元测试（覆盖率 80%+）；搭建 GitLab CI/CD 流水线，实现代码质量检查、自动化构建与多环境部署，制定严格的 Code Review 标准。
                  </li>
                </ul>
              </div>

              {/* Project 1.2 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-1">
                  项目：企业内部综合管理系统 (Vue 3, Python/Flask)
                </h4>
                <div className="mb-2">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Vue 3</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Python</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Flask</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">PostgreSQL</span>
                </div>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
                  <li>
                    <strong>全栈开发</strong>：基于 Flask Blueprint 架构开发 20+ 业务模块，采用装饰器模式实现审计日志自动记录；前端使用 Vue 3 构建响应式界面，实现许可证全生命周期管理。
                  </li>
                  <li>
                    <strong>复杂业务建模</strong>：主导&quot;按套餐售卖&quot;功能的各端打通（内管、商务、供应链），设计高灵活度的权限配置方案，支持 <strong>50+ 种许可套餐</strong> 的动态组合。
                  </li>
                  <li>
                    <strong>数据库设计</strong>：使用 PostgreSQL JSONB/数组类型优化灵活配置存储，设计 UUID 松耦合关联策略；基于 APScheduler 实现定时数据归档，保障大数据量下的查询性能。
                  </li>
                  <li>
                    <strong>流程数字化</strong>：将原本依赖人工Excel记录的供应链流程系统化，<strong>减少跨部门沟通工单 30%</strong>，通过自动化校验逻辑减少人工录入错误。
                  </li>
                </ul>
              </div>

              {/* Project 1.3 - Monitor Center */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-1">
                  项目：数据可视化监控大屏 (Vue 3, DataV)
                </h4>
                <div className="mb-2">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">Vue 3</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">grid-layout-plus</span>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">DataV</span>
                </div>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
                  <li>
                    <strong>可视化布局编辑器</strong>：基于 grid-layout-plus 实现拖拽式布局系统，支持行列动态配置、模块自由拖拽与碰撞检测，设计 LayoutTracker 类追踪布局变化并计算最大空白区域实现智能模块插入。
                  </li>
                  <li>
                    <strong>服务降级重试机制</strong>：实现心跳检测与优雅降级策略，当后端服务掉线时自动按指数退避（1s → 2s → 5s → 30s → 60s）重连，避免无效请求风暴，保障大屏 7x24 小时稳定运行。
                  </li>
                  <li>
                    <strong>多主题动态切换</strong>：支持运行时主题切换（含毛玻璃效果），通过 CSS 变量注入与动态 link 标签实现无刷新换肤，配合用户配置持久化到后端。
                  </li>
                </ul>
              </div>
              <div className="mb-2">
                <h4 className="font-semibold text-gray-800 mb-1">
                  项目：研发效能提升工具 (JavaScript, Chrome Extension)
                </h4>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
                  <li>
                    <strong>自动化脚本开发</strong>：开发 Chrome 扩展程序，集成 GitLab API 实现代码 Review 一键辅助与分支状态监控，团队内部每周节省 <strong>2-3 小时</strong> 人工检查时间。
                  </li>
                  <li>
                    <strong>流程优化</strong>：实现内部系统自动登录与验证码识别功能，提升日常操作效率 40%。
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Social / Side Projects - Optional but shows passion */}
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide">
              个人项目与技能拓展
            </h2>
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800 text-sm">
                全栈博客平台 (Next.js 15, React 19, PostgreSQL, Prisma)
              </h4>
              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
                <li>
                  独立开发基于 <strong>Next.js 15 (App Router)</strong> 的全栈应用，集成 <strong>PostgreSQL</strong> 数据库与 Prisma ORM。
                </li>
                <li>
                  实现 AI 文章摘要功能（OpenAI API + RAG 向量检索），探索最新的 React Server Components (RSC) 架构与性能最佳实践。
                </li>
              </ul>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide">
              教育经历
            </h2>
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="font-bold text-lg">吉首大学</span>
                <span className="mx-2">|</span>
                <span>软件工程 (本科)</span>
              </div>
              <span className="font-medium">2017.09 – 2021.06</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
