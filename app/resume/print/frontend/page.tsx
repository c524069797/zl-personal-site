'use client'

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SkillTag({ children, template }: { children: React.ReactNode; template: string }) {
  const styles: Record<string, string> = {
    tech: "rounded border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] text-cyan-700",
    card: "rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700 shadow-sm",
    navy: "rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700",
  };
  return (
    <span className={styles[template] || styles.tech}>
      {children}
    </span>
  );
}

function ResumeContent({ template }: { template: string }) {
  const [showOtherWorks, setShowOtherWorks] = useState(true);
  const [showAdvantages, setShowAdvantages] = useState(true);

  const isCard = template === "card";
  const isNavy = template === "navy";

  const pageBg = "bg-white";
  const textMain = isNavy ? "text-gray-800" : "text-gray-900";

  const headerWrapper = isNavy
    ? "bg-[#1e3a5f] text-white p-6 -mx-8 -mt-8 mb-5"
    : isCard
    ? "mb-4 rounded-xl bg-gray-50 p-5 border border-gray-100"
    : "mb-4 border-l-[6px] border-cyan-500 pl-4 py-2";
  const headerName = isNavy
    ? "text-3xl font-bold tracking-tight text-white"
    : "text-2xl font-bold tracking-tight text-gray-900";
  const headerSub = isNavy
    ? "text-sm font-medium text-cyan-100 mt-1"
    : "text-sm font-medium text-gray-600 mt-1";
  const headerMeta = isNavy
    ? "mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-cyan-100/80"
    : "mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500";

  const sectionTitle = isNavy
    ? "mb-2 border-b-2 border-indigo-100 pb-1 text-sm font-bold uppercase tracking-wider text-[#1e3a5f]"
    : isCard
    ? "mb-2 flex items-center gap-2 text-sm font-bold text-gray-900"
    : "mb-2 border-b border-cyan-200 pb-0.5 text-sm font-bold uppercase tracking-wider text-cyan-700";

  const sectionDot = isCard ? (
    <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" />
  ) : null;

  const expTitle = `text-sm font-bold ${textMain}`;
  const expDate = isNavy ? "text-xs text-indigo-400 font-medium" : "text-xs text-gray-400";
  const expRole = isNavy ? "text-xs italic text-indigo-500" : "text-xs italic text-gray-500";
  const expDesc = "text-[11px] text-gray-500 mt-0.5";
  const expList = "mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800";
  const techStack = isNavy ? "text-[10px] text-indigo-400 font-semibold" : "text-[10px] text-gray-400 font-semibold";

  return (
    <div className={`${pageBg} ${textMain}`}>
      {/* 工具栏：打印时隐藏 */}
      <div className="print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">显示控制：</span>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showOtherWorks}
                onChange={(e) => setShowOtherWorks(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              其他作品
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showAdvantages}
                onChange={(e) => setShowAdvantages(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              个人优势
            </label>
          </div>
          <div className="flex items-center gap-3">
            <a href={`/resume/print?template=${template}`} className="text-sm text-cyan-600 hover:underline">
              切换到全栈版
            </a>
            <a href="/resume" className="text-sm text-cyan-600 hover:underline">
              ← 返回展示版
            </a>
            <button
              onClick={() => window.print()}
              className="rounded-md bg-gray-900 px-4 py-1.5 text-sm text-white hover:bg-gray-800"
            >
              打印 / 另存为 PDF
            </button>
          </div>
        </div>

        {/* 模板切换栏 */}
        <div className="mx-auto max-w-4xl px-6 py-3 border-b border-gray-100 bg-white">
          <span className="text-sm font-medium text-gray-700 mr-3">选择模板：</span>
          {[
            { key: "tech", label: "科技青" },
            { key: "card", label: "卡片白" },
            { key: "navy", label: "商务蓝" },
          ].map((t) => (
            <a
              key={t.key}
              href={`/resume/print/frontend?template=${t.key}`}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs mr-2 transition-colors ${
                template === t.key
                  ? "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>

      <div
        className="mx-auto box-border p-8"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        {/* Header */}
        <header className={headerWrapper}>
          <h1 className={headerName}>陈子龙</h1>
          <p className={headerSub}>前端开发工程师（React / Next.js，AI 应用方向）</p>
          <div className={headerMeta}>
            <span>158-7444-2813</span>
            <span>chenzhuo995@gmail.com</span>
            <span>github.com/c524069797</span>
            <span>clczl.asia</span>
          </div>
        </header>

        {/* Education */}
        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            教育经历 / 语言能力
          </h2>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium">吉首大学 · 软件工程（本科）</span>
            <span className={isNavy ? "text-indigo-400" : "text-gray-400"}>2017.09 – 2021.06</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <SkillTag template={template}>CET-6</SkillTag>
            <SkillTag template={template}>软件设计师（中级）</SkillTag>
          </div>
          <p className={expDesc}>英文技术文档阅读通畅，具备日语听读能力</p>
        </section>

        {/* Skills */}
        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            专业技能
          </h2>
          <div className="space-y-1 text-xs">
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">前端框架：</span>
              <span className="text-gray-600">React 18/19, Next.js（App Router / RSC / SSR / SSG）, Vue 2 / Vue 3, TypeScript, 企业中后台 / 复杂表单向导 / 内容型站点 / 可视化大屏</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">组件与样式：</span>
              <span className="text-gray-600">Ant Design, Tailwind CSS 4, ECharts / DataV, 组件抽象与复用（向导框架支撑 50+ 资源类型）, Hooks 设计</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">工程化：</span>
              <span className="text-gray-600">Vite / Webpack / Monorepo, ESLint 9 / Prettier / husky + lint-staged, Vitest, Playwright（E2E + 布局契约测试）, GitLab CI/CD</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">性能体验：</span>
              <span className="text-gray-600">首屏优化, 虚拟滚动, 增量更新, SSR / SEO, 暗色主题体系, WebSocket 实时链路, React Three Fiber 3D / Framer Motion 动效</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">AI 应用前端：</span>
              <span className="text-gray-600">SSE 流式对话, 引用来源高亮, 流式 Markdown 渲染, 转人工交接; 理解 Agent / RAG 链路（LangGraph / 向量检索）</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">跨端与后端：</span>
              <span className="text-gray-600">React Native iOS / Android, uni-app / 微信小程序; Java / Spring Boot 与 Python / FastAPI 生产实践, PostgreSQL / Redis / Prisma</span>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            工作经历
          </h2>

          <div className="mb-2">
            <div className="flex items-baseline justify-between">
              <h3 className={expTitle}>广州鼎甲计算机科技有限公司</h3>
              <span className={expDate}>2021.07 – 至今</span>
            </div>
            <p className={expRole}>Web 软件工程师（前端方向）· 核心业务组</p>
            <p className={expDesc}>
              负责企业级备份软件、许可证与内部综合管理系统、数据可视化监控大屏等核心产品的前端架构与开发，支撑 50+ 资源类型接入与多条产品线协同。
            </p>
            <ul className={expList}>
              <li><strong>通用向导框架（前端架构）：</strong>基于 <strong>工厂模式 + Context + Proxy</strong> 设计通用向导框架，支撑 <strong>50+ 资源类型</strong>动态注入与跨步骤状态共享，新资源接入从复制改造整套页面降为注册配置 + 差异步骤，新增资源开发周期从 2 周缩短到 2 天。</li>
              <li><strong>可视化大屏系统：</strong>基于 grid-layout-plus 实现拖拽式大屏布局（12 × 12 网格、碰撞检测、自动放置、布局持久化），transform-scale 解决缩放坐标对齐，WebSocket 推送 + 缓冲队列 + 重连机制保障任务状态秒级同步。</li>
              <li><strong>性能优化：</strong>任务监控与日志场景引入增量更新、虚拟滚动与页面拆分，解决万级长列表卡顿与首屏加载问题；长期承担线上问题定位与复杂交互故障排查。</li>
              <li><strong>组件库建设：</strong>主导企业级 Vue 3 组件库与通用能力建设，沉淀 <strong>40+</strong> 组件支撑多条产品线复用。</li>
              <li><strong>AI 产品前端落地：</strong>主导内部智能客服 Agent 从 0 到 1 上线，独立设计开发对话式前端（多轮对话、上下文记忆、引用来源高亮、一键转人工），已接入售后与技术支持团队日常使用；基于 Mastra 实践多 Agent 编排与 SSE 流式问答前端链路。</li>
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            项目经历
          </h2>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">个人网站 / 博客系统（重点项目）</h4>
              <span className={techStack}>Next.js 16 / React 19 / TypeScript / Tailwind 4 / R3F / Prisma / PostgreSQL / Qdrant</span>
            </div>
            <p className="text-[10px] text-gray-400">在线访问 clczl.asia｜独立完成设计、开发、部署与长期迭代的完整产品</p>
            <ul className={expList}>
              <li><strong>现代前端架构：</strong>Next.js App Router 组织路由与 Server/Client 组件边界，SSR + 静态生成兼顾首屏性能与 SEO（sitemap / JSON-LD 结构化数据 / RSS）；按 feature 划分模块，组件、Hooks、类型分层清晰。</li>
              <li><strong>3D 交互首屏：</strong>React Three Fiber 实现 3D 模型 Hero 首屏，处理模型加载策略、渲染性能与低端设备降级；配合 Canvas 粒子动画、Framer Motion 过渡动效与磁吸按钮等微交互。</li>
              <li><strong>主题与国际化：</strong>next-themes 暗色/亮色双主题（CSS 变量 + Ant Design 组件级暗色覆盖），自建 i18n 支持中/英/繁/西四语言切换。</li>
              <li><strong>AI 功能前端：</strong>实现 AI 流式对话、文章 AI 摘要、RAG 站内问答（Qdrant 向量检索）完整链路，覆盖流式 Markdown 渲染、加载与错误态、会话交互设计。</li>
              <li><strong>内容系统与工程化：</strong>博客（搜索/分类/标签/归档）、评论（含 AI 审核）、管理后台（JWT + RBAC）、简历 PDF 导出与 A4 打印样式；husky + lint-staged 提交门禁（ESLint 零警告策略）。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">ArcFlow 企业 Agent 智能支持平台（AI 产品前端 + 全栈）</h4>
              <span className={techStack}>React 18 / Ant Design 6 / Playwright / FastAPI / LangGraph / Qdrant</span>
            </div>
            <p className="text-[10px] text-gray-400">github.com/c524069797/enterprise-agent-platform｜企业客服 Agent 已接入团队日常使用</p>
            <ul className={expList}>
              <li><strong>Agent 对话工作台：</strong>React 18 实现企业级 Agent 对话前端——流式回答、检索证据与来源溯源展示、敏感操作审批交互（HITL 人工审批门）、多岗位 Agent 按 RBAC 权限可见可用。</li>
              <li><strong>契约测试守护：</strong>9 条 Playwright E2E 用例守护 API 契约、页面信息架构与双后端（Python / Java）输出一致性，保障持续迭代不回归。</li>
              <li><strong>AI 链路理解：</strong>后端 LangGraph 状态机（意图识别 → RAG 检索 + 工具调用 → 人工审批 → 回答组装）同样由本人实现，具备与算法/后端协作时「说同一种语言」的能力。</li>
              <li><strong>落地成效：</strong>企业落地版覆盖 80%+ 高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">内部综合管理系统（React 前端 + Java 全栈独立交付）</h4>
              <span className={techStack}>React / Java Spring Boot / MySQL / Redis / RabbitMQ</span>
            </div>
            <p className="text-[10px] text-gray-400">公司内部核心业务系统｜个人独立完成前后端设计、开发与部署</p>
            <ul className={expList}>
              <li><strong>前端：</strong>React 实现许可证全流程（生成、导入校验、续期升级、套餐/功能映射、审批、出货、归档）的复杂表单与流程页面，支撑 <strong>50+ 种许可套餐</strong>动态组合，重复配置时间降低 <strong>80%+</strong>。</li>
              <li><strong>全栈能力：</strong>独立完成 Spring Boot 后端（审批状态机、幂等设计、RBAC + 审计、Redis 缓存、RabbitMQ 事件解耦），前后端联调排查效率高，不依赖后端排期。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">跨端移动应用 / 小程序项目</h4>
              <span className={techStack}>React Native / iOS / Android / uni-app / 微信云开发</span>
            </div>
            <ul className={expList}>
              <li><strong>双端交付：</strong>React Native iOS / Android 双端业务开发（导航、状态管理、登录态保持、权限与设备适配），熟悉真机调试到打包发布链路；uni-app + 微信云开发实现 AI 改善计划小程序。</li>
              <li><strong>移动体验：</strong>关注弱网、触控热区、键盘遮挡、长列表滚动、空/加载态等移动端体验细节。</li>
            </ul>
          </div>
        </section>

        {/* Other Works */}
        {showOtherWorks && (
          <section className="mb-3">
            <h2 className={sectionTitle}>
              {sectionDot}
              其他个人作品
            </h2>
            <div className="space-y-0.5 text-[11px] leading-relaxed text-gray-800">
              <p><strong>SportOracle</strong>：AI 驱动的体育预测产品（nba.clczl.asia）</p>
              <p><strong>Sports Hub</strong>：聚合 NBA、足球、电竞赛事信息的 Chrome Extension</p>
            </div>
          </section>
        )}

        {/* Personal Advantages */}
        {showAdvantages && (
          <section>
            <h2 className={sectionTitle}>
              {sectionDot}
              个人优势
            </h2>
            <ul className="list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
              <li><strong>前端深度 + 线上作品：</strong>从企业级中后台（50+ 资源类型向导框架、拖拽大屏）到内容型站点（Next.js SSR/SEO、3D 首屏），多形态前端均有完整交付；作品集、预测平台、Chrome 插件均在线可访问。</li>
              <li><strong>AI 应用前端稀缺经验：</strong>做过真实上线的 Agent 对话产品前端（流式输出、引用溯源、HITL 审批交互、转人工），且理解 Agent / RAG 底层链路，是「会做 AI 产品的前端」。</li>
              <li><strong>工程化与质量意识：</strong>ESLint 零警告门禁、Playwright E2E 契约测试、CI/CD 交付门禁的长期实践者，代码可长期迭代不劣化。</li>
              <li><strong>全栈兜底能力：</strong>Java / Python 后端均有生产实践，能独立完成 BFF 与全栈交付，联调排查效率高。</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function ResumePrintFrontendPageInner() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "tech";
  return <ResumeContent template={template} />;
}

export default function ResumePrintFrontendPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">加载中...</div>}>
      <ResumePrintFrontendPageInner />
    </Suspense>
  );
}
