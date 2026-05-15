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

function ResumeContent({ template, version }: { template: string; version: string }) {
  const [showOtherWorks, setShowOtherWorks] = useState(true);
  const [showAdvantages, setShowAdvantages] = useState(true);
  const isAiVersion = version === "ai";

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
              href={`/resume/print?template=${t.key}&version=${version}`}
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
          <p className={headerSub}>
            {isAiVersion ? "AI Agent 开发工程师（Agent / RAG / 全栈）" : "前端开发工程师（具备 AI Agent 开发经验）"}
          </p>
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
            {isAiVersion ? (
              <>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">AI Agent：</span>
                  <span className="text-gray-600">LangGraph, Mastra, OpenClaw, RAG, Agent Workflow, Tool Calling, Prompt / Guardrail, SSE 流式输出</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">前端产品：</span>
                  <span className="text-gray-600">Next.js, React, TypeScript, Ant Design, 对话式交互, 响应式布局, 数据可视化</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">后端数据：</span>
                  <span className="text-gray-600">Node.js, Python / FastAPI, Flask, Java / Spring, PostgreSQL, Redis, sqlite-vec / pgvector</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">工程质量：</span>
                  <span className="text-gray-600">OpenSpec, Skill 配置化, AI Code Review, 评估测试集, 日志观测, GitLab CI/CD</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">前端开发：</span>
                  <span className="text-gray-600">Vue 2/3, React, Next.js, TypeScript, Ant Design, ECharts, grid-layout-plus, Tailwind CSS, WebSocket</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">移动跨端：</span>
                  <span className="text-gray-600">React Native, iOS / Android, uni-app, 微信小程序, 离线缓存, 真机调试</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">工程化：</span>
                  <span className="text-gray-600">Vite, Webpack, Monorepo, ESLint 9, Vitest, Playwright, OpenSpec, GitLab CI/CD</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">后端协作：</span>
                  <span className="text-gray-600">Node.js, Python / FastAPI, Flask, Java / Spring, PostgreSQL, Redis, sqlite-vec</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">AI Agent：</span>
                  <span className="text-gray-600">LangGraph, Mastra, RAG 工程化, Hybrid Retrieval, Reranker, Eval, Observability</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 shrink-0 font-medium text-gray-700">自动化测试：</span>
                  <span className="text-gray-600">Selenium, Robot Framework, pytest, Playwright, UI 自动化</span>
                </div>
              </>
            )}
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
            <p className={expRole}>前端开发工程师 · 核心业务组</p>
            <p className={expDesc}>
              负责企业级备份软件（迪备）、许可证与内部综合管理系统等核心业务模块前端，长期服务复杂流程型场景。
            </p>
            <ul className={expList}>
              <li><strong>业务建模：</strong>主导许可证生成、导入校验、续期升级、套餐/功能映射等前端设计与实现，推动审批、出货与归档流程由表格/钉钉记录转向系统化闭环，支撑 <strong>50+ 种许可套餐</strong>动态组合，将重复配置时间降低 <strong>80% 以上</strong>。</li>
              <li><strong>跨端项目经验：</strong>参与 iOS / Android 与 <strong>React Native</strong> 项目建设，处理业务页面、接口联调、登录态保持、权限与设备适配，具备从真机调试到打包发布的完整链路经验。</li>
              <li><strong>性能优化：</strong>围绕任务监控与日志展示引入 <strong>增量更新</strong>、<strong>虚拟滚动</strong> 与页面拆分，优化首屏与长列表交互体验。</li>
              <li><strong>AI 业务落地：</strong>主导内部管理系统智能客服 Agent 从需求调研到上线运营的全流程，构建基于业务数据的 RAG 诊断与问答能力，已接入售后、技术支持团队日常使用；持续推进工具调用、检索链路、评估测试集与日志观测。</li>
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            项目经历
          </h2>

          {isAiVersion ? (
            <>
              <div className="mb-1.5">
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xs font-bold text-gray-900">AI 投资助手</h4>
                  <span className={techStack}>Next.js 16 / React 19 / TypeScript / Mastra / PostgreSQL / SSE</span>
                </div>
                <p className="text-[10px] text-gray-400">aiold.clczl.asia</p>
                <ul className={expList}>
                  <li><strong>产品定位：</strong>面向个人投资研究场景，构建“自选股管理 + 多源数据聚合 + AI 分析问答”的投资助手，覆盖桌面端 Dashboard 与移动端卡片化体验。</li>
                  <li><strong>多 Agent 编排：</strong>基于 <strong>Next.js + Mastra</strong> 拆分行情查询、技术指标、新闻摘要与投资组合诊断等角色，通过工作流路由、上下文组装、工具调用与结果汇总实现复杂问题分步分析和结构化输出。</li>
                  <li><strong>数据闭环：</strong>接入实时行情、K 线形态、支撑压力位与近 7 日财经新闻；结合 <strong>OpenClaw</strong> 自动抓取公众号 / 大 V 观点并生成摘要，补齐消息面上下文。</li>
                  <li><strong>交互体验：</strong>使用 <strong>Server-Sent Events</strong> 实现流式回答，支持推理过程可视化、重点结论高亮与对话上下文保留；通过 PostgreSQL 持久化用户对话、自选股与个性化配置。</li>
                  <li><strong>工程化：</strong>用 OpenSpec 梳理系统边界、接口契约与任务拆分，同步沉淀系统文档、接口手册和开发规范，形成“需求 - 设计 - 开发 - 文档”闭环。</li>
                </ul>
              </div>

              <div className="mb-1.5">
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xs font-bold text-gray-900">企业 Agent 客服项目</h4>
                  <span className={techStack}>React / Python / FastAPI / LangGraph / RAG / sqlite-vec / PostgreSQL</span>
                </div>
                <p className="text-[10px] text-gray-400">企业内部产品｜已接入客服团队日常使用</p>
                <ul className={expList}>
                  <li><strong>业务背景：</strong>内部管理系统业务逻辑复杂，客服团队需高频处理审批进度查询、报错诊断、套餐功能解释等重复问题，人工响应慢且知识传递成本高。</li>
                  <li><strong>RAG 知识库：</strong>将产品文档、审批流程、历史工单、Wiki、SOP 和常见报错排查指南构建为结构化知识库，设计多粒度 Chunk、metadata 富化、来源溯源和父子检索策略。</li>
                  <li><strong>业务数据联动：</strong>打通申请、审批、审计等核心业务数据，使 Agent 能基于真实申请单与工单状态进行 <strong>实时审批解释、报错智能诊断与进度追踪</strong>。</li>
                  <li><strong>前端对话体验：</strong>开发对话式工作台，支持多轮上下文、引用来源高亮、诊断步骤展示与一键转人工，降低客服使用门槛并保留复杂问题交接路径。</li>
                  <li><strong>落地效果：</strong>Agent 已接入售后、技术支持团队日常工作流，覆盖审批解释、报错诊断、进度追踪等高频咨询场景，减少重复沟通并提升一线团队处理效率。</li>
                  <li><strong>工程治理：</strong>推进 LangGraph Checkpointer、StructuredTool + ToolNode、检索阈值 / Hybrid Search / Reranker、Eval 测试集与 Trace 观测能力，把 AI 助手升级为“可观测、可评估、可回滚”。</li>
                </ul>
              </div>
            </>
          ) : (
            <>
          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">迪备备份恢复系统</h4>
              <span className={techStack}>Vue 2/3 / 工厂模式 / Context / Proxy / WebSocket</span>
            </div>
            <p className="text-[10px] text-gray-400">企业级备份软件（迪备）· 核心备份/恢复流程前端</p>
            <ul className={expList}>
              <li><strong>通用模块：</strong>主导备份/恢复向导前端设计与实现。为解决多资源类型流程重复开发问题，设计 <strong>通用向导框架</strong>，基于 <strong>工厂模式 + Context + Proxy</strong> 支撑 <strong>50+ 资源类型</strong>（文件、数据库、虚拟机、对象存储等）动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。</li>
              <li>通过 Proxy 拦截步骤间状态流转，统一处理步骤校验、数据缓存、回滚与恢复，减少业务组件中的重复状态同步逻辑；结合 WebSocket 推送、缓冲队列与重连机制，保障任务状态秒级同步。</li>
              <li><strong>许可证模块：</strong>独立负责许可证生成、导入校验、续期升级、套餐/功能映射等全流程前端设计与实现，推动审批、出货与归档流程由表格/钉钉记录转向系统化闭环，支撑多条产品线与 <strong>50+ 种许可套餐</strong>动态组合，将重复配置时间降低 <strong>80% 以上</strong>。</li>
              <li>围绕任务监控与日志展示引入 <strong>增量更新</strong>、<strong>虚拟滚动</strong> 与页面拆分，优化首屏与长列表交互体验。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">内部管理系统智能客服 Agent</h4>
              <span className={techStack}>React / Python / Flask / LLM API / RAG / PostgreSQL</span>
            </div>
            <p className="text-[10px] text-gray-400">企业内部产品｜已接入客服团队日常使用</p>
            <ul className={expList}>
              <li>将产品文档、审批流程说明、历史工单处理方案构建为结构化知识库，结合 RAG 技术实现精准检索与上下文增强。</li>
              <li>打通申请，审批，审计 等核心业务数据，使 Agent 能够基于用户实际申请表单或者工单状态进行 <strong>实时审批解释、报错智能诊断与进度追踪</strong>。</li>
              <li>Agent <strong>已正式接入售后、技术支持团队日常工作流</strong>，覆盖审批解释、报错诊断、进度追踪等高频咨询场景，减少重复沟通并提升一线团队处理效率。</li>
              <li>围绕会话状态、工具调用、检索链路、Prompt、权限边界、评估测试集与日志观测推进工程治理。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">迪备数据可视化监控大屏</h4>
              <span className={techStack}>Vue 3 / grid-layout-plus / WebSocket / ECharts</span>
            </div>
            <p className="text-[10px] text-gray-400">企业级备份软件（迪备）· 数据可视化监控大屏子系统</p>
            <ul className={expList}>
              <li>基于 <strong>grid-layout-plus</strong> 实现可编辑驾驶舱系统，支持模块自由增删、拖拽布局、行列配置、预览保存与主题背景切换，是产品化大屏平台而非一次性展示页。</li>
              <li>解决大屏整体缩放后拖拽坐标不准问题，通过 <strong>transform-scale</strong> 将外层缩放系统与布局引擎坐标系对齐，保证拖拽和 resize 在任意缩放比下精准落点。</li>
              <li>实现新增模块自动放置逻辑，通过 <strong>LayoutTracker</strong> 维护网格占用状态并计算最大空白可用区域，避免新增模块与已有模块冲突。</li>
              <li>设计面向 <strong>7×24 运行</strong> 的心跳检测与优雅降级机制：先探测服务状态再刷新数据，异常时按 <strong>递增退避策略</strong>（0/1/2/5/10/30/60s）重试，避免请求风暴并支持降级展示。</li>
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">AI 投资助手</h4>
              <span className={techStack}>Next.js 16 / React 19 / TypeScript / Mastra / PostgreSQL / SWR</span>
            </div>
            <p className="text-[10px] text-gray-400">aiold.clczl.asia</p>
            <ul className={expList}>
              <li>围绕{'"'}我的自选股{'"'}重构产品首页，拆分桌面端 dashboard 与移动端卡片化布局，抽象 App Shell、BottomNav 与断点适配方案。</li>
              <li>基于 <strong>Next.js + Mastra</strong> 实现投资分析多 Agent 编排，拆分为行情查询、技术指标、新闻摘要与投资组合诊断等角色。</li>
              <li>对接实时行情、K 线形态、支撑压力位与近 7 日财经新闻等多源数据；接入 <strong>OpenClaw</strong> 工作流自动抓取公众号/大 V 观点并生成摘要。</li>
              <li><strong>历史上下文复用：</strong>围绕用户画像、自选理由、持仓逻辑和复盘结论持久化分析记录，区分{'"'}用户记录{'"'}和{'"'}市场事实{'"'}两类数据，提升跨会话分析连续性。</li>
              <li>使用 Server-Sent Events 实现流式回答，支持推理过程可视化与答案高亮；通过 PostgreSQL 持久化用户对话与自选股数据。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">跨端移动应用 / 小程序项目</h4>
              <span className={techStack}>React Native / iOS / Android / uni-app / 微信云开发</span>
            </div>
            <p className="text-[10px] text-gray-400">移动端业务页面、跨端交付与小程序实践</p>
            <ul className={expList}>
              <li><strong>跨端开发：</strong>开发 iOS / Android 双端业务页面，处理导航、表单、列表、接口联调、全局状态、登录态保持与异常提示等常见移动端能力。</li>
              <li><strong>原生链路：</strong>熟悉 iOS / Android 工程配置、真机调试、权限声明、环境区分与打包发布流程，能够定位常见构建、依赖与设备适配问题。</li>
              <li><strong>小程序实践：</strong>基于 <strong>uni-app + 微信云开发</strong> 实现 AI 改善计划小程序，覆盖云函数、数据库、用户登录、离线优先数据同步与移动端交互适配。</li>
              <li><strong>体验优化：</strong>关注弱网、键盘遮挡、长列表滚动、空状态 / 加载态和移动端布局密度，能把 Web 端工程经验迁移到 App 与小程序场景。</li>
            </ul>
          </div>
            </>
          )}
        </section>

        {/* Other Works */}
        {showOtherWorks && !isAiVersion && (
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
            {isAiVersion ? (
              <ul className="list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
                <li><strong>AI Agent 闭环能力：</strong>能从业务问题出发，完成需求拆解、知识库建设、Agent 编排、前端对话体验、后端工具接入和上线验证。</li>
                <li><strong>懂前端也懂 AI 工程：</strong>既能把 AI 能力做成稳定可用的产品界面，也能处理 RAG、Tool、Runtime、Eval、Trace 等工程细节。</li>
                <li><strong>有真实落地案例：</strong>企业 Agent 客服项目已进入客服团队日常工作流，AI 投资助手可公开访问并持续迭代。</li>
                <li><strong>学习和迭代速度快：</strong>持续跟踪大模型、Agent、RAG、AI Coding 与工作流工具，将新能力快速转化为可交付功能。</li>
                <li><strong>业务理解能力强：</strong>能快速理解不同行业业务流程，把领域知识转化为可检索、可调用、可评估的 AI Agent 能力。</li>
              </ul>
            ) : (
              <ul className="list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
                <li><strong>前端主导能力明确：</strong>长期负责企业级中后台、复杂流程与可视化页面建设，覆盖备份、许可证、监控大屏等高复杂度业务场景。</li>
                <li><strong>覆盖 Web 与移动端：</strong>除 Web 中后台和内容产品外，也做过 iOS / Android、React Native、uni-app 与小程序项目，能在多端产品里保持工程一致性和体验稳定性。</li>
                <li><strong>具备 AI Agent 开发能力：</strong>能够基于 Next.js / Python / PostgreSQL 结合 Agent 与工作流完成产品原型到上线落地。</li>
                <li><strong>技术视野完整：</strong>除前端实现外，也长期补充 RAG 工程化、评测门禁、数据库架构、自动化测试和发布流程等技术主题，能从系统全链路理解问题。</li>
                <li><strong>有真实线上作品：</strong>已上线个人作品集、AI 投资助手、体育预测平台等多个可访问项目。</li>
                <li><strong>持续跟踪 AI 前沿并快速转化：</strong>长期关注大模型、Agent、RAG 与 AI 工具链的新进展，能快速理解业务领域知识并将新方向转化为可落地的技术方案。</li>
                <li><strong>学习与专业基础扎实：</strong>持有软件设计师（中级）认证，英语六级，具备日语听读能力。</li>
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function ResumePrintPageInner() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "tech";
  const version = searchParams.get("version") === "ai" ? "ai" : "general";
  return <ResumeContent template={template} version={version} />;
}

export default function ResumePrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">加载中...</div>}>
      <ResumePrintPageInner />
    </Suspense>
  );
}
