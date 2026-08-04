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
              href={`/resume/print?template=${t.key}`}
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
          <p className={headerSub}>AI Agent 开发 / AI 全栈工程师</p>
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
              <span className="w-20 shrink-0 font-medium text-gray-700">AI Agent：</span>
              <span className="text-gray-600">LangGraph（状态机 / HITL / Checkpointer）, RAG, Hybrid Retrieval, GraphRAG, Tool Calling, MCP, Mastra, Prompt / Guardrail, SSE 流式输出</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">前端产品：</span>
              <span className="text-gray-600">Next.js, React, TypeScript, Ant Design, 对话式交互, 响应式布局, 数据可视化</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">后端数据：</span>
              <span className="text-gray-600">Node.js, Python / FastAPI, Java / Spring, PostgreSQL, Redis, Qdrant / sqlite-vec / pgvector</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">工程质量：</span>
              <span className="text-gray-600">Playwright, pytest, OpenSpec, Skill 配置化, AI Code Review, 评估测试集, 日志观测, GitLab CI/CD</span>
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
            <p className={expRole}>Web 软件工程师（兼 AI Agent 开发）· 核心业务组</p>
            <p className={expDesc}>
              负责企业级备份软件、许可证与内部综合管理系统等核心业务模块建设，同时主导 AI Agent 与 RAG 能力在真实业务中的落地。
            </p>
            <ul className={expList}>
              <li><strong>企业 Agent 落地：</strong>主导内部管理系统智能客服 Agent 从需求调研、知识库整理、RAG 检索、对话界面到上线运营的完整闭环，已接入售后、技术支持团队日常使用，覆盖审批解释、报错诊断、进度追踪等高频场景。</li>
              <li><strong>RAG 工程化：</strong>将产品文档、历史工单、Wiki、SOP 拆分为可检索知识单元，设计 metadata 过滤、来源溯源、父子检索与阈值控制，把回答链路推进到可追踪、可评估、可维护。</li>
              <li><strong>复杂业务系统：</strong>主导许可证生成、导入校验、续期升级、套餐/功能映射等模块设计与实现，支撑 <strong>50+ 种许可套餐</strong>动态组合，将重复配置时间降低 <strong>80% 以上</strong>。</li>
              <li><strong>AI 开发规范：</strong>在团队内沉淀 <strong>Skill / OpenSpec 配置化</strong>标准与 AI Code Review 预检查流程，减少低级问题和重复沟通。</li>
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
              <h4 className="text-xs font-bold text-gray-900">企业 Agent 智能支持平台（ArcFlow）</h4>
              <span className={techStack}>FastAPI / LangGraph / Qdrant / GraphRAG / React 18 / Playwright</span>
            </div>
            <p className="text-[10px] text-gray-400">企业客服 Agent 已接入团队日常使用｜个人平台化完整版可离线演示</p>
            <ul className={expList}>
              <li><strong>项目概述：</strong>面向企业内部客服与技术支持场景的智能支持平台，打通申请、合同、工单、审计业务数据实现<strong>实时审批解释、报错智能诊断与进度追踪</strong>；企业落地版已接入售后、技术支持团队日常工作流。</li>
              <li><strong>Agent 编排：</strong>LangGraph 四节点状态机（意图识别 → RAG 检索+工具调用 → 人工审批门 → 回答组装）；checkpointer 按 thread 保存状态，审批恢复时条件入口跳过前置节点继续执行；9 类业务意图规则 O(1) 先行 + LLM 兜底。</li>
              <li><strong>HITL 审批硬闸门：</strong>敏感操作（数据导出、发送邮件、越权动作）在图内暂停并生成待审批载荷，人工决策后恢复——状态机层面的硬中断，审批前动作真实不会执行。</li>
              <li><strong>检索链路：</strong>Qdrant 向量检索 + 关键词混合检索 → GraphRAG 关系扩展，metadata 分类过滤、来源溯源与父子检索，检索证据写入审计日志形成可追溯回答链路。</li>
              <li><strong>权限与审计：</strong>RBAC 角色派生 agent:* 能力范围，5 类岗位 Agent 按登录者权限可见可用，每次对话与 Agent 运行全量审计（操作者/对象/结果/风险级/耗时）。</li>
              <li><strong>项目成效：</strong>企业落地版覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%；五类外部依赖可降级本地替身离线演示，9 条 Playwright 用例守护 OpenAPI 契约与 Python/Java 双后端一致性。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">BackupPilot 智能备份 Agent</h4>
              <span className={techStack}>Python / LangGraph / Pydantic v2 / MCP / SQLite / zstd</span>
            </div>
            <p className="text-[10px] text-gray-400">个人项目｜自然语言驱动的备份/恢复与企业运维智能体，已接入企业备份平台，可离线完整演示</p>
            <ul className={expList}>
              <li><strong>Agent 编排 + HITL：</strong>LangGraph 八节点状态机（意图识别 → 规划 → 策略决策 → 执行 → 校验汇报）；恢复等破坏性操作 interrupt() 中断等待人工确认，不确认绝不落盘——备份场景误覆盖数据是最致命事故。</li>
              <li><strong>双引擎架构：</strong>统一 BackupEngine 抽象，local 自研引擎（sha256 内容寻址去重 + zstd 压缩 + mtime 增量 + 原子写）与企业备份平台 REST 适配器实现同一抽象；一个环境变量切换引擎，状态图一行不改。</li>
              <li><strong>MCP 工具 + 运维 Agent：</strong>MCP Server（Claude Desktop 可接）与 langchain @tool 双 adapter 同源，破坏性 restore 带 confirm 二次门控；基于平台数据实现多机巡检、失败诊断、容量预测与四合一运维报告。</li>
              <li><strong>回测强化与诊断 RAG：</strong>scrub 全仓健康检查（损坏注入必检出）+ 恢复演练例行化 + 边界矩阵逐字节比对；12 篇运维 SOP 知识库 + BM25 检索与置信度控制，失败诊断升级为规则兜底 + RAG 增强。</li>
              <li><strong>项目成效：</strong>253 项测试全绿（端到端真起模拟平台后端走 HTTP）；GB 级实测 1GB 首备 84 MB/s、去重压缩 4.8x、加密开销约 5%；信封加密（scrypt + AES-GCM）改口令 O(1) 不重加密；解决内网代理劫持 502 等真实部署问题。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">迪备备份恢复系统</h4>
              <span className={techStack}>Vue / TypeScript / WebSocket / C++</span>
            </div>
            <p className="text-[10px] text-gray-400">企业级备份软件核心业务系统</p>
            <ul className={expList}>
              <li><strong>流程抽象：</strong>主导备份/恢复向导框架设计与实现，支撑 <strong>50+ 资源类型</strong>动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。</li>
              <li><strong>组件能力：</strong>主导企业级 Vue 3 组件库与通用能力建设，沉淀 <strong>40+</strong> 组件支撑多条产品线复用；结合 WebSocket 推送、缓冲队列与重连机制保障任务状态秒级同步。</li>
              <li><strong>性能优化：</strong>围绕任务监控与日志展示引入增量更新、虚拟滚动与页面拆分，优化首屏与长列表交互体验。</li>
              <li><strong>C++ 服务协作：</strong>参与备份引擎 C++ 侧问题排查与小功能开发（任务状态上报、错误码与日志梳理、文件扫描过滤规则），理解引擎多线程任务队列与 RAII 资源管理，能从引擎视角定位备份/恢复链路问题。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">内部综合管理系统（许可证 / 审批 / 出货全流程）</h4>
              <span className={techStack}>React / Java Spring Boot / Mastra / MySQL / Redis / RabbitMQ / Nginx</span>
            </div>
            <p className="text-[10px] text-gray-400">公司内部核心业务系统｜个人独立完成前后端设计、开发与部署的全栈项目</p>
            <ul className={expList}>
              <li><strong>全栈独立交付：</strong>独立完成 React 前端、Java Spring Boot 后端、数据库设计到部署上线的完整链路，长期独立维护与迭代，支撑多条产品线与多部门日常协作。</li>
              <li><strong>业务闭环：</strong>覆盖许可证生成、导入校验、续期升级、套餐/功能映射与审批、出货、归档全流程，支撑 <strong>50+ 种许可套餐</strong>动态组合，将重复配置时间降低 <strong>80% 以上</strong>；Spring Boot RESTful API 围绕审批状态机与幂等键建模，RabbitMQ 事件解耦通知，实现 RBAC 权限校验与操作审计。</li>
              <li><strong>AI 能力载体：</strong>基于 Mastra（TypeScript Agent 框架）实现系统内多 Agent 编排与 SSE 流式问答入口，后续落地智能客服 Agent 并平台化为 ArcFlow，成为公司内部 AI 能力落地的业务载体。</li>
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
              <li><strong>AI Agent 闭环能力：</strong>能从业务问题出发，完成需求拆解、知识库建设、Agent 编排、前端对话体验、后端工具接入和上线验证。</li>
              <li><strong>全栈与 AI 工程并重：</strong>既能把 AI 能力做成稳定可用的产品界面，也能处理 RAG、Tool、Runtime、Eval、Trace 等工程细节。</li>
              <li><strong>有真实落地案例：</strong>企业 Agent 客服已进入客服团队日常工作流，并平台化为可离线演示的 ArcFlow 完整版（HITL 审批、岗位 Agent、RBAC 审计）。</li>
              <li><strong>学习和迭代速度快：</strong>持续跟踪大模型、Agent、RAG、AI Coding 与工作流工具，将新能力快速转化为可交付功能。</li>
              <li><strong>业务理解能力强：</strong>能快速理解不同行业业务流程，把领域知识转化为可检索、可调用、可评估的 AI Agent 能力。</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function ResumePrintPageInner() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "tech";
  return <ResumeContent template={template} />;
}

export default function ResumePrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">加载中...</div>}>
      <ResumePrintPageInner />
    </Suspense>
  );
}
