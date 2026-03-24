import { ThemeToggle } from '@/components/ThemeToggle'
import { DownloadPDFButton } from '@/components/DownloadPDFButton'
import { LinkTransition } from '@/lib/link-transition'

export const metadata = {
  title: '简历',
  description: '陈灼的个人简历',
}

const sectionClassName = 'rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none'
const headingClassName = 'mb-4 text-2xl font-bold text-black'

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,transparent_320px)] dark:bg-none">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 print:max-w-none print:px-0 print:py-0">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <LinkTransition
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
          >
            ← 返回首页
          </LinkTransition>
          <div className="flex items-center gap-3">
            <DownloadPDFButton />
            <ThemeToggle />
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-gray-200 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-gray-700 dark:bg-gray-800 print:hidden md:px-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-blue-600">Frontend Resume</p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">陈灼</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
                近 5 年前端经验，专注企业级后台与备份/存储场景，擅长复杂业务流程设计、组件沉淀、体验优化与效率提升，并持续探索 AI Agent、Prompt 与 Harness 工程在业务中的落地。
              </p>
            </div>
            <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>方向：前端开发 / 企业应用</span>
              <span>技术栈：Vue / React / Next.js / TypeScript / Java Spring</span>
              <span>邮箱：chenzhuo995@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="resume-content space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] print:rounded-none print:border-0 print:p-0 print:shadow-none md:p-8" style={{ backgroundColor: 'white', color: 'black' }}>
          <section className={sectionClassName}>
            <h2 className={headingClassName}>基本信息</h2>
            <div className="grid gap-4 text-black md:grid-cols-2">
              <p>
                <strong>姓名：</strong>陈灼
              </p>
              <p>
                <strong>邮箱：</strong>
                <a href="mailto:chenzhuo995@gmail.com" className="underline">
                  chenzhuo995@gmail.com
                </a>
              </p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>教育经历</h2>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-semibold text-black">吉首大学 ｜ 软件工程 ｜ 本科</h3>
              <span className="text-sm text-black">2017.09 – 2021.06</span>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>个人概述</h2>
            <p className="leading-8 text-black">
              近 5 年前端经验，专注企业级后台与备份/存储场景。擅长复杂流程建模、组件化沉淀与界面性能优化，具备一定 Java Spring 架构协作经验，并持续探索 AI Design、Prompt / Harness 工程与 Agent 在业务中的落地。
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>核心技能</h2>
            <ul className="ml-6 list-disc space-y-2 text-black">
              <li>Web 基础：HTML5 / CSS3 / JavaScript / TypeScript</li>
              <li>框架组件：Vue / React / Next.js / Ant Design / ECharts</li>
              <li>数据库：MySQL / PostgreSQL</li>
              <li>工程化：Vite / Webpack / NPM / Monorepo / 代码规范与单元测试</li>
              <li>协作与质量：RESTful API、异常与埋点规范、性能分析、自动化部署(CI/CD)</li>
              <li>全栈协作：了解 Java Spring 架构，可配合后端完成接口设计、联调与链路排查</li>
              <li>微信小程序开发部署</li>
              <li>uni-app 开发与部署</li>
              <li>AI 工程与协作：了解 AI Design、Prompt / Harness 工程、Claude Cowork 等协作式开发方式，可结合业务场景落地 Agent 与效率工具</li>
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className={headingClassName}>工作经历</h2>
            <div className="space-y-6 text-black">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-xl font-semibold">广州某软件公司 ｜ 前端开发工程师</h3>
                <span className="text-sm">2021.07 – 至今</span>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 print:border-0 print:p-0">
                <h4 className="mb-3 text-lg font-bold">主力备份软件</h4>
                <p className="mb-3 text-sm text-black/70">技术栈：Vue3</p>
                <ul className="ml-6 list-disc space-y-2 leading-7">
                  <li>负责存储池配置、容量/配额/策略等核心页面与交互；抽象通用备份/恢复流程态机与表单/向导组件，适配文件/数据库/虚机等多资源类型。</li>
                  <li><strong>监控大屏（Monitor Center）</strong>：实现可编辑驾驶舱（拖拽布局、模块增删、主题/背景/比例配置、预览与保存）；解决大屏缩放后拖拽不准问题（将 `v-scale-screen` 计算出的缩放比同步给 `grid-layout-plus transform-scale`）；实现“新增模块自动放置”（占用矩阵 + 单调栈求最大空矩形）；设计心跳探测 + 递增重试的 7x24 刷新容错机制。</li>
                  <li><strong>许可证模块（模块负责人）</strong>：主导信息架构、交互与实现，覆盖许可证生成、导入校验、续期/升级、套餐/功能映射、设备绑定与异常处理；打通内管/商务/供应链流程，支持按套餐售卖。签发耗时【3-5 分钟 → 10 秒】；错误/退单率【&lt; 20%】；覆盖【2 条产品线 / 100+ 种套餐】</li>
                  <li><strong>结果</strong>：复用减少重复实现【Web组人均任务工时下降1到2小时】；首屏渲染优化【TTI ↓30%】；上线版本缺陷密度极大程度的减少。</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 print:border-0 print:p-0">
                <h4 className="mb-3 text-lg font-bold">公司内部管理系统（核心办公系统）</h4>
                <ul className="ml-6 list-disc space-y-2 leading-7">
                  <li>负责许可证、合同/维保、出货/归档等模块前端架构与开发；对接商务与供应链系统（单点登录/统一权限/流程状态与日志），实施“按套餐售卖”的功能分层与配置化。</li>
                  <li><strong>许可证模块（项目负责人/前端开发，后台设计）</strong>：主导信息架构、交互与实现，覆盖许可证生成、导入校验、续期/升级、套餐/功能映射、TOTP 设备绑定与异常处理，合同/出货系统；打通内管/商务/供应链流程，支持按套餐售卖。</li>
                  <li><strong>客服 Agent（许可证问题诊断）</strong>：基于许可证业务场景设计并落地问题归因型客服 Agent MVP，聚焦“系统报错诊断 / 审批原因解释 / 申请去向追踪”三类高频问题；抽象 explain-approval、trace-request、diagnose-error 三类后端聚合能力，串联 approval、log、request_*、audit_logs 与日志线索，并补齐前端最小入口、RBAC 权限与测试。</li>
                  <li><strong>结果</strong>：签发耗时从钉钉审批化为系统化，从天级的审批流程与人工记录转为小时级别的系统记录；减少了供应链档案人员的 50%-60% 工作量，错误/退单率减少百分之五十以上，作为前线支持的系统；覆盖【3 条产品线 / 50+ 种许可套餐】；上线后支撑【2000+ 笔合同 / 500+ 客户】</li>
                  <li><strong>结果</strong>：合同→出货平均周期【↓50%】；跨部门沟通工单【↓30%】；套餐化上线后销售额【↑30%】</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 print:border-0 print:p-0">
                <h4 className="mb-3 text-lg font-bold">个人网站项目</h4>
                <p className="mb-3 text-sm text-black/70">技术栈：Next.js 15、React 19、TypeScript、Ant Design、PostgreSQL、Prisma</p>
                <ul className="ml-6 list-disc space-y-2 leading-7">
                  <li>功能：博客系统（文章发布、分类、标签）、评论系统（游客评论、审核机制）、用户认证（注册/登录）、文章管理（CRUD）、简历展示、PDF 导出</li>
                  <li>特点：响应式设计、暗黑模式支持、SEO 优化、RSS 订阅、最新/最热文章展示</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
