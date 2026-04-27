'use client'

import { useState } from "react";

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
      {children}
    </span>
  );
}

export default function ResumePrintPage() {
  const [showOtherWorks, setShowOtherWorks] = useState(true);
  const [showAdvantages, setShowAdvantages] = useState(true);

  return (
    <div className="bg-white text-gray-900">
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
            <a
              href="/resume"
              className="text-sm text-cyan-600 hover:underline"
            >
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
      </div>

      <div
        className="mx-auto box-border bg-white p-8"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        {/* Header */}
        <header className="mb-4 border-b-2 border-gray-800 pb-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">陈子龙</h1>
          <p className="text-sm font-medium text-gray-700">前端开发工程师（具备 AI 全栈开发经验）</p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-600">
            <span>158-7444-2813</span>
            <span>chenzhuo995@gmail.com</span>
            <span>github.com/c524069797</span>
            <span>clczl.asia</span>
          </div>
        </header>

        {/* Education */}
        <section className="mb-3">
          <h2 className="mb-1.5 border-b border-gray-300 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-900">
            教育经历 / 语言能力
          </h2>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium">吉首大学 · 软件工程（本科）</span>
            <span className="text-gray-500">2017.09 – 2021.06</span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            <SkillTag>CET-6</SkillTag>
            <SkillTag>软件设计师（中级）</SkillTag>
          </div>
          <p className="mt-0.5 text-[11px] text-gray-500">英文技术文档阅读通畅，具备日语听读能力</p>
        </section>

        {/* Skills */}
        <section className="mb-3">
          <h2 className="mb-1.5 border-b border-gray-300 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-900">
            专业技能
          </h2>
          <div className="space-y-1 text-xs">
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">前端开发：</span>
              <span className="text-gray-600">Vue 2/3, React, Next.js, TypeScript, Ant Design, ECharts, Tailwind CSS</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">工程化：</span>
              <span className="text-gray-600">Vite, Webpack, Monorepo, ESLint, Vitest, GitLab CI/CD, WebSocket</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">AI 全栈：</span>
              <span className="text-gray-600">LangGraph, Mastra, RAG, Node.js, Python / FastAPI, Java, PostgreSQL, Redis, 向量存储</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 font-medium text-gray-700">自动化测试：</span>
              <span className="text-gray-600">Selenium, Robot Framework, 回归测试</span>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-3">
          <h2 className="mb-1.5 border-b border-gray-300 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-900">
            工作经历
          </h2>

          <div className="mb-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-gray-900">广州鼎甲计算机科技有限公司</h3>
              <span className="text-xs text-gray-500">2021.07 – 至今</span>
            </div>
            <p className="text-xs italic text-gray-600">前端开发工程师 · 核心业务组</p>
            <p className="mt-0.5 text-[11px] text-gray-500">
              负责企业级备份软件（迪备）、许可证与内部综合管理系统等核心业务模块前端，长期服务复杂流程型场景。
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
              <li><strong>业务建模：</strong>主导许可证生成、导入校验、续期升级等前端设计，支撑 50+ 种许可套餐动态组合，重复配置时间降低 80% 以上。</li>
              <li><strong>性能优化：</strong>引入增量更新、虚拟滚动与页面拆分，TTI 下降约 30%。</li>
              <li><strong>AI 落地：</strong>主导 scutech-licenser 客服 Agent 全流程，构建 RAG 诊断与问答能力，已接入客服团队日常使用。</li>
            </ul>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-3">
          <h2 className="mb-1.5 border-b border-gray-300 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-900">
            项目经历
          </h2>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">迪备备份恢复系统</h4>
              <span className="text-[10px] text-gray-500">Vue 2/3 / 工厂模式 / Context / Proxy / WebSocket</span>
            </div>
            <p className="text-[10px] text-gray-500">企业级备份软件（迪备）· 核心备份/恢复流程前端</p>
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
              <li><strong>存储模块：</strong>主导备份/恢复向导前端设计与实现。为解决多资源类型流程重复开发问题，设计通用向导框架，基于工厂模式 + Context + Proxy 支撑 50+ 资源类型（文件、数据库、虚拟机、对象存储等）动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。</li>
              <li>通过 Proxy 拦截步骤间状态流转，统一处理步骤校验、数据缓存、回滚与恢复，降低业务组件 60% 以上的心智负担；结合 WebSocket 推送、缓冲队列与重连机制，保障任务状态秒级同步。</li>
              <li><strong>许可证模块：</strong>独立负责许可证生成、导入校验、续期升级、套餐/功能映射等全流程前端设计与实现，推动审批、出货与归档流程由表格/钉钉记录转向系统化闭环，支撑 50+ 种许可套餐动态组合，将重复配置时间降低 80% 以上。</li>
              <li>围绕任务监控与日志展示引入增量更新、虚拟滚动与页面拆分，优化首屏与长列表体验，TTI 下降约 30%。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">scutech-licenser 智能客服 Agent</h4>
              <span className="text-[10px] text-gray-500">Vue 3 / Python / Flask / LLM API / RAG / PostgreSQL</span>
            </div>
            <p className="text-[10px] text-gray-500">企业内部产品 · 已接入客服团队日常使用</p>
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
              <li>将产品文档、审批流程说明、历史工单构建为结构化知识库，结合 RAG 实现精准检索。</li>
              <li>打通 approval、request、audit_logs 等核心业务数据，Agent 基于用户实际订单状态进行实时审批解释与报错诊断。</li>
              <li>已正式接入客服团队日常工作流，覆盖 80% 以上常见咨询场景，减少重复工单约 30%。</li>
            </ul>
          </div>

          <div className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">迪备数据可视化监控大屏</h4>
              <span className="text-[10px] text-gray-500">Vue 3 / grid-layout-plus / WebSocket / ECharts</span>
            </div>
            <p className="text-[10px] text-gray-500">企业级备份软件（迪备）· 数据可视化监控大屏子系统</p>
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
              <li>基于 grid-layout-plus 实现可编辑驾驶舱系统，支持模块自由增删、拖拽布局、行列配置、预览保存与主题背景切换。</li>
              <li>解决大屏整体缩放后拖拽坐标不准问题，通过 transform-scale 将外层缩放系统与布局引擎坐标系对齐。</li>
              <li>实现新增模块自动放置逻辑，通过 LayoutTracker 维护网格占用状态并计算最大空白可用区域。</li>
              <li>设计面向 7×24 运行的心跳检测与优雅降级机制，异常时按递增退避策略（0/1/2/5/10/30/60s）重试，避免请求风暴。</li>
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h4 className="text-xs font-bold text-gray-900">AI 投资助手</h4>
              <span className="text-[10px] text-gray-500">Next.js 16 / React 19 / TypeScript / Mastra / PostgreSQL</span>
            </div>
            <p className="text-[10px] text-gray-500">aiold.clczl.asia</p>
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
              <li>围绕{'"'}我的自选股{'"'}重构产品首页，拆分桌面端 dashboard 与移动端卡片化布局。</li>
              <li>基于 Next.js + Mastra 搭建投资分析多 Agent 系统，拆分为行情查询、技术指标、新闻摘要与投资组合诊断 Agent。</li>
              <li>对接实时行情、K 线形态、支撑压力位与近 7 日财经新闻等多源数据。</li>
              <li>使用 SSE 实现流式回答，支持推理过程可视化与答案高亮；PostgreSQL 持久化用户数据。</li>
            </ul>
          </div>
        </section>

        {/* Other Works */}
        {showOtherWorks && (
          <section className="mb-3">
            <h2 className="mb-1.5 border-b border-gray-300 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-900">
              其他个人作品
            </h2>
            <div className="space-y-0.5 text-[11px] leading-relaxed text-gray-800">
              <p><strong>SportOracle</strong>：AI 驱动的体育预测产品（nba.clczl.asia）</p>
              <p><strong>织趣社区</strong>：面向钩织爱好者的社区产品（zhiqu.clczl.asia）</p>
              <p><strong>Sports Hub</strong>：聚合 NBA、足球、电竞赛事信息的 Chrome Extension</p>
            </div>
          </section>
        )}

        {/* Personal Advantages */}
        {showAdvantages && (
          <section>
            <h2 className="mb-1.5 border-b border-gray-300 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-900">
              个人优势
            </h2>
            <ul className="list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800">
              <li><strong>前端主导能力明确：</strong>长期负责企业级中后台、复杂流程与可视化页面建设。</li>
              <li><strong>具备 AI 全栈开发能力：</strong>能够基于 Next.js / Python / PostgreSQL 结合 Agent 完成产品原型到上线落地。</li>
              <li><strong>有真实线上作品：</strong>已上线个人作品集、AI 投资助手、体育预测平台、垂直社区等多个项目。</li>
              <li><strong>AI 信息敏感度高：</strong>善于获取 AI 前沿信息，是多个 AI 学习社区的长期用户，持续跟踪大模型、Agent、RAG 等领域的最新动态与实践。</li>
              <li><strong>业务学习能力强：</strong>乐于学习业务和不同行业的精髓，能快速理解领域知识并转化为技术实现。</li>
              <li><strong>学习与专业基础扎实：</strong>持有软件设计师（中级）认证，英语六级，具备日语听读能力。</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
