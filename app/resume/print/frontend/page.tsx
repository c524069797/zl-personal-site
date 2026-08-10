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
            <span className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">吉首大学 · 软件工程（本科）</span>
              <SkillTag template={template}>CET-6</SkillTag>
              <SkillTag template={template}>软件设计师（中级）</SkillTag>
              <span className="text-gray-500">日语听读</span>
            </span>
            <span className={isNavy ? "text-indigo-400" : "text-gray-400"}>2017.09 – 2021.06</span>
          </div>
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
              <span className="text-gray-600">React 18/19, Next.js, Vue 2 / Vue 3, TypeScript</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">组件与样式：</span>
              <span className="text-gray-600">Ant Design, Tailwind CSS, ECharts, DataV</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">工程化：</span>
              <span className="text-gray-600">Vite, Webpack, Monorepo, ESLint, Vitest, Playwright, GitLab CI/CD</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">性能体验：</span>
              <span className="text-gray-600">首屏优化, 虚拟滚动, 增量更新, SSR / SEO, WebSocket, React Three Fiber</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">AI 应用前端：</span>
              <span className="text-gray-600">SSE 流式交互, LangGraph, RAG, MCP, Prompt Engineering</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">跨端与后端：</span>
              <span className="text-gray-600">React Native, uni-app, 微信小程序, Java / Spring Boot, Python / FastAPI, PostgreSQL, Redis</span>
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
              <h4 className="text-sm font-bold text-gray-900">迪备备份恢复系统</h4>
              <span className={techStack}>Vue / TypeScript / WebSocket / C++</span>
            </div>
            <p className="text-[10px] text-gray-400">企业级备份软件核心业务系统｜长期负责前端架构与核心模块</p>
            <ul className={expList}>
              <li><strong>通用向导框架：</strong>为解决多资源类型备份/恢复流程重复开发问题，基于 <strong>工厂模式 + Context + Proxy</strong> 设计通用向导框架，支撑 <strong>50+ 资源类型</strong>动态注入与跨步骤状态共享，新增资源类型的开发周期从 <strong>2 周缩短到 2 天</strong>，同类功能重复代码减少 <strong>70%+</strong>。</li>
              <li><strong>组件库建设：</strong>主导企业级 Vue 3 组件库与通用能力建设，沉淀 <strong>40+ 组件</strong>支撑多条产品线复用，统一交互规范与视觉标准，降低跨团队协作成本。</li>
              <li><strong>可视化大屏：</strong>基于 grid-layout-plus 实现拖拽式大屏布局系统，支持 <strong>12 × 12 网格</strong>、碰撞检测、自动放置与布局持久化；用 VScaleScreen / transform-scale 解决缩放场景下的坐标对齐问题。</li>
              <li><strong>实时链路：</strong>WebSocket 推送 + 缓冲队列 + 断线重连机制，保障任务状态<strong>秒级同步</strong>与 <strong>7×24 小时</strong>长时间稳定运行，消息峰值场景不丢帧不卡顿。</li>
              <li><strong>性能优化：</strong>任务监控与日志场景引入增量更新、虚拟滚动与页面拆分，<strong>万级长列表</strong>滚动流畅，首屏加载显著提速；长期承担线上问题定位与复杂交互故障排查。</li>
              <li><strong>C++ 引擎协作：</strong>参与备份引擎 C++ 侧问题排查与小功能开发（任务状态上报、错误码梳理），能从引擎视角定位备份/恢复全链路问题，前后端联调排查不设边界。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-bold text-gray-900">内部管理系统智能客服 Agent</h4>
              <span className={techStack}>React / Python / FastAPI / LangGraph / RAG / sqlite-vec</span>
            </div>
            <p className="text-[10px] text-gray-400">企业内部产品｜从 0 到 1 主导，已接入售后、技术支持团队日常使用</p>
            <ul className={expList}>
              <li><strong>业务背景：</strong>内部管理系统业务逻辑复杂，客服团队每日需处理大量重复咨询（审批进度、报错诊断、套餐解释），人工响应慢、知识传递成本高；主导从需求调研、知识库建设、Agent 编排到前端交付的完整闭环。</li>
              <li><strong>对话前端：</strong>独立设计并开发对话式交互页面，实现 <strong>SSE 流式输出</strong>与流式 Markdown 渲染、多轮对话与上下文记忆、<strong>引用来源高亮</strong>与一键转人工，复杂问题可平滑交接，降低客服使用门槛。</li>
              <li><strong>RAG 工程化：</strong>设计多粒度 Chunk 策略（工单摘要 / 讨论 / Wiki 整页 / 按标题拆分），富化 metadata 支持过滤、来源溯源与父子检索；历史工单与 Wiki 系统化批量入库 <strong>sqlite-vec（float[1536]）</strong>，知识库从 <strong>8 条 seed 扩展至 30+ 结构化 chunks</strong>。</li>
              <li><strong>业务数据联动：</strong>打通申请、审批、审计等核心业务数据，实现实时审批解释、报错智能诊断与进度追踪，从通用问答升级为业务感知型助手。</li>
              <li><strong>落地成效：</strong>覆盖 <strong>80%+ 高频咨询场景</strong>，平均响应从<strong>分钟级降至秒级</strong>，减少重复工单约 <strong>30%</strong>；后续平台化为 ArcFlow 企业 Agent 平台（GitHub 可查证），补齐 HITL 审批门与 <strong>9 条 Playwright E2E</strong> 契约测试。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-bold text-gray-900">智能备份助手（BackupPilot）</h4>
              <span className={techStack}>Python / LangGraph / Pydantic / MCP / SQLite / zstd</span>
            </div>
            <p className="text-[10px] text-gray-400">个人项目｜自然语言驱动的备份/恢复与运维智能体，已接入企业备份平台</p>
            <ul className={expList}>
              <li><strong>Agent 编排 + HITL：</strong>LangGraph <strong>八节点状态机</strong>（意图识别 → 规划 → 策略决策 → 执行 → 校验汇报），恢复等破坏性操作 interrupt() 中断等待人工确认，不确认绝不落盘，破坏性操作 <strong>100%</strong> 经确认后执行。</li>
              <li><strong>双引擎架构：</strong>统一 BackupEngine 抽象，本地自研引擎（sha256 内容寻址去重 + zstd 压缩 + mtime 增量）与企业备份平台 REST 适配器实现同一抽象，<strong>一个环境变量</strong>切换引擎、状态图零改动。</li>
              <li><strong>MCP 工具暴露：</strong>能力封装为协议无关工具函数，MCP Server（Claude Desktop 可直接接入）与 langchain @tool 双 adapter 同源，破坏性操作带 confirm 二次门控。</li>
              <li><strong>项目成效：</strong><strong>253 项测试全绿</strong>；GB 级实测首备吞吐 <strong>84 MB/s</strong>、去重压缩 <strong>4.8x</strong>、修改 1% 后增量备份 <strong>0.7s</strong>、仓库加密开销约 <strong>5%</strong>；已接入企业备份平台跑通备份/恢复/巡检闭环。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-bold text-gray-900">内部综合管理系统</h4>
              <span className={techStack}>React / Java Spring Boot / MySQL / Redis / RabbitMQ / Nginx</span>
            </div>
            <p className="text-[10px] text-gray-400">公司内部核心业务系统｜个人独立完成前后端设计、开发与部署的全栈项目</p>
            <ul className={expList}>
              <li><strong>前端交付：</strong>React 实现许可证全流程（生成、导入校验、续期升级、套餐/功能映射、审批、出货、归档）的复杂表单与流程页面，把表格 + 钉钉的记录方式收敛为系统化闭环，支撑 <strong>50+ 种许可套餐</strong>动态组合，重复配置时间降低 <strong>80%+</strong>。</li>
              <li><strong>后端设计：</strong>独立完成 Spring Boot 后端——审批状态机（枚举转移表 + 乐观锁）、申请单号幂等键（唯一索引 + Redis 防重锁）、Redis Cache-Aside 缓存、RabbitMQ 事件解耦通知（本地消息表补偿 + 消费幂等）、每日定时对账兜底一致性。</li>
              <li><strong>权限与审计：</strong>Spring Security + JWT 实现 RBAC 权限校验，AOP 切面统一记录操作审计，线程池异步落库不阻塞主流程。</li>
              <li><strong>AI 能力载体：</strong>基于 <strong>Mastra</strong>（TypeScript Agent 框架）实现系统内多 Agent 编排与 SSE 流式问答入口，成为公司内部 AI 能力落地的业务载体。</li>
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
              <p><strong>个人网站 / 博客系统</strong>：Next.js 16 全栈站点，含博客、AI 问答与 React Three Fiber 3D 交互首屏（clczl.asia）</p>
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
              <li><strong>前端深度 + 线上作品：</strong>从企业级中后台（<strong>50+</strong> 资源类型向导框架、拖拽大屏）到内容型站点（Next.js SSR/SEO、3D 首屏），多形态前端均有完整交付；作品集、预测平台、Chrome 插件均在线可访问。</li>
              <li><strong>AI 应用前端稀缺经验：</strong>做过真实上线的 Agent 对话产品前端（流式输出、引用溯源、HITL 审批交互、转人工），且理解 Agent / RAG 底层链路，是「会做 AI 产品的前端」。</li>
              <li><strong>工程化与质量意识：</strong>ESLint 零警告门禁、Playwright E2E 契约测试、CI/CD 交付门禁的长期实践者，代码可长期迭代不劣化。</li>
              <li><strong>全栈兜底能力：</strong>Java / Python 后端均有生产实践，能独立完成 BFF 与全栈交付，联调排查效率高。</li>
              <li><strong>乐于了解行业发展新趋势：</strong>持续跟踪前端框架演进（React RSC、Vue 3 生态）与大模型、Agent、AI Coding 等方向的新进展，习惯把新能力快速验证并转化为可交付的功能。</li>
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
