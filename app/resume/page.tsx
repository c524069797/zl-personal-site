import { ThemeToggle } from "@/components/ThemeToggle";
import { ResumeTemplateSelector } from "@/components/ResumeTemplateSelector";
import { LinkTransition } from "@/lib/link-transition";
import {
  SiVuedotjs,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiAntdesign,
  SiTailwindcss,
  SiVite,
  SiWebpack,
  SiEslint,
  SiVitest,
  SiGitlab,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiRedis,
  SiSelenium,
} from "react-icons/si";

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="resume-section-title group relative mb-4 mt-6 flex items-center gap-3 text-lg font-bold tracking-wide text-gray-900 dark:text-white">
      <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-cyan-500 to-indigo-500" />
      <span>{children}</span>
    </h2>
  );
}

function SkillTag({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-cyan-50 to-blue-50 px-2.5 py-1 text-xs font-medium text-cyan-700 ring-1 ring-inset ring-cyan-600/20 dark:from-cyan-950/30 dark:to-blue-950/30 dark:text-cyan-300 dark:ring-cyan-400/20">
      {icon}
      {children}
    </span>
  );
}

export default function ResumePage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white">
      {/* 科技感动态背景装饰 */}
      <div className="resume-tech-bg print:hidden">
        <div className="tech-light-strip tech-light-strip-left" />
        <div className="tech-light-strip tech-light-strip-left-2" />
        <div className="tech-light-strip tech-light-strip-right" />
        <div className="tech-light-strip tech-light-strip-right-2" />
        <div className="tech-corner-dot tech-corner-dot-tl" />
        <div className="tech-corner-dot tech-corner-dot-tr" />
        <div className="tech-corner-dot tech-corner-dot-bl" />
        <div className="tech-corner-dot tech-corner-dot-br" />
        <div className="tech-hex tech-hex-1" />
        <div className="tech-hex tech-hex-2" />
        <div className="tech-hex tech-hex-3" />
        <div className="tech-line tech-line-1" />
        <div className="tech-line tech-line-2" />
        <div className="tech-line tech-line-3" />
      </div>

      <div className="absolute top-4 right-4 z-10 print:hidden">
        <ThemeToggle />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 print:max-w-full print:p-0 print:py-4">
        <div className="mb-8 print:hidden">
          <LinkTransition
            href="/"
            className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            ← 返回首页
          </LinkTransition>
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              个人简历
            </h1>
            <ResumeTemplateSelector />
          </div>
        </div>
        <div
          className="resume-paper mx-auto rounded-xl bg-white p-8 text-gray-900 shadow-lg print:rounded-none print:p-0 print:shadow-none md:p-10 dark:bg-gray-800/50 dark:shadow-cyan-500/5"
          style={{ maxWidth: "210mm", minHeight: "297mm" }}
        >
          {/* Header */}
          <header className="mb-6 border-b border-gray-200 pb-6 dark:border-white/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="mb-1 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400">
                  陈子龙
                </h1>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  前端开发工程师（具备 AI 全栈开发经验）
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  本科｜近 5 年前端经验｜广州
                </p>
              </div>
              <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 sm:text-right">
                <p className="flex items-center gap-2 sm:justify-end">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <span>158-7444-2813</span>
                </p>
                <p className="flex items-center gap-2 sm:justify-end">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <a href="mailto:chenzhuo995@gmail.com" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    chenzhuo995@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2 sm:justify-end">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </span>
                  <a href="https://github.com/c524069797" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    github.com/c524069797
                  </a>
                </p>
                <p className="flex items-center gap-2 sm:justify-end">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  </span>
                  <a href="https://www.clczl.asia" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    clczl.asia
                  </a>
                </p>
              </div>
            </div>
          </header>

          {/* Education */}
          <section className="mb-4">
            <SectionTitle>教育经历 / 语言能力</SectionTitle>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div className="rounded-lg bg-gray-50/50 p-3 dark:bg-gray-800/80">
                <div className="font-semibold text-gray-800 dark:text-gray-200">
                  吉首大学｜软件工程（本科）
                </div>
                <div className="text-gray-500 dark:text-gray-300">2017.09 – 2021.06</div>
              </div>
              <div className="space-y-1.5 text-gray-800 dark:text-gray-200 md:text-right">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <SkillTag>CET-6</SkillTag>
                  <SkillTag>软件设计师（中级）</SkillTag>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  英文技术文档阅读通畅，具备日语听读能力
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-4">
            <SectionTitle>专业技能</SectionTitle>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-3 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">前端开发</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <SkillTag icon={<SiVuedotjs size={12} />}>Vue 2/3</SkillTag>
                  <SkillTag icon={<SiReact size={12} />}>React</SkillTag>
                  <SkillTag icon={<SiNextdotjs size={12} />}>Next.js</SkillTag>
                  <SkillTag icon={<SiTypescript size={12} />}>TypeScript</SkillTag>
                  <SkillTag icon={<SiAntdesign size={12} />}>Ant Design</SkillTag>
                  <SkillTag>ECharts</SkillTag>
                  <SkillTag icon={<SiTailwindcss size={12} />}>Tailwind CSS</SkillTag>
                  <SkillTag>WebSocket</SkillTag>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-3 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">工程化与质量</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <SkillTag icon={<SiVite size={12} />}>Vite</SkillTag>
                  <SkillTag icon={<SiWebpack size={12} />}>Webpack</SkillTag>
                  <SkillTag>Monorepo</SkillTag>
                  <SkillTag icon={<SiEslint size={12} />}>ESLint</SkillTag>
                  <SkillTag icon={<SiVitest size={12} />}>Vitest</SkillTag>
                  <SkillTag icon={<SiGitlab size={12} />}>GitLab CI/CD</SkillTag>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-3 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 8.5v.01"/><path d="M12 16v.01"/></svg>
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">AI 应用与全栈协作</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <SkillTag>LangGraph</SkillTag>
                  <SkillTag>Mastra</SkillTag>
                  <SkillTag>RAG</SkillTag>
                  <SkillTag icon={<SiNodedotjs size={12} />}>Node.js</SkillTag>
                  <SkillTag icon={<SiPython size={12} />}>Python / FastAPI</SkillTag>
                  <SkillTag>Java</SkillTag>
                  <SkillTag icon={<SiPostgresql size={12} />}>PostgreSQL</SkillTag>
                  <SkillTag icon={<SiRedis size={12} />}>Redis</SkillTag>
                  <SkillTag>向量存储</SkillTag>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-3 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">自动化测试</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <SkillTag icon={<SiSelenium size={12} />}>Selenium</SkillTag>
                  <SkillTag>Robot Framework</SkillTag>
                  <SkillTag>回归测试</SkillTag>
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-4">
            <SectionTitle>工作经历</SectionTitle>
            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-indigo-500 to-transparent dark:from-cyan-400 dark:via-indigo-400" />

              <div className="ml-5 space-y-1">
                <div className="relative">
                  <div className="absolute -left-5 top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500 ring-2 ring-white dark:bg-cyan-400 dark:ring-gray-800" />
                  <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">广州鼎甲计算机科技有限公司</h3>
                    <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">2021.07 – 至今</span>
                  </div>
                  <div className="mb-2 text-sm italic text-gray-600 dark:text-gray-300">前端开发工程师｜核心业务组</div>
                  <p className="mb-3 text-xs leading-relaxed text-gray-500 dark:text-gray-300">
                    负责企业级备份软件（迪备）、许可证与内部综合管理系统等核心业务模块前端，长期服务复杂流程型场景。
                  </p>
                  <ul className="ml-1 space-y-2 text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                      <span><strong className="text-gray-900 dark:text-white">业务建模：</strong>主导许可证生成、导入校验、续期升级、套餐/功能映射等前端设计与实现，推动审批、出货与归档流程由表格/钉钉记录转向系统化闭环，支撑 <strong>50+ 种许可套餐</strong>动态组合，将重复配置时间降低 <strong>80% 以上</strong>。</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                      <span><strong className="text-gray-900 dark:text-white">性能优化：</strong>围绕任务监控与日志展示引入 <strong>增量更新</strong>、<strong>虚拟滚动</strong> 与页面拆分，优化首屏与长列表体验，<strong>TTI 下降约 30%</strong>。</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                      <span><strong className="text-gray-900 dark:text-white">AI 业务落地：</strong>主导 <strong>scutech-licenser 客服 Agent</strong> 从需求调研到上线运营的全流程，构建基于业务数据的 RAG 诊断与问答能力，已接入客服团队日常使用；持续推进 <strong>Agent Harness Engineering</strong> 与知识库扩展。</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="mb-4">
            <SectionTitle>项目经历</SectionTitle>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">迪备备份恢复系统</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-300">Vue 2/3 / 工厂模式 / Context / Proxy / WebSocket</span>
                </div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-300">企业级备份软件（迪备）· 核心备份/恢复流程前端</p>
                <ul className="ml-1 space-y-1.5 text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span><strong>存储模块：</strong>主导备份/恢复向导前端设计与实现。为解决多资源类型流程重复开发问题，设计 <strong>通用向导框架</strong>，基于 <strong>工厂模式 + Context + Proxy</strong> 支撑 <strong>50+ 资源类型</strong>（文件、数据库、虚拟机、对象存储等）动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>通过 Proxy 拦截步骤间状态流转，统一处理步骤校验、数据缓存、回滚与恢复，降低业务组件 60% 以上的心智负担；结合 WebSocket 推送、缓冲队列与重连机制，保障任务状态秒级同步。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span><strong>许可证模块：</strong>独立负责许可证生成、导入校验、续期升级、套餐/功能映射等全流程前端设计与实现，推动审批、出货与归档流程由表格/钉钉记录转向系统化闭环，支撑多条产品线与 <strong>50+ 种许可套餐</strong>动态组合，将重复配置时间降低 <strong>80% 以上</strong>。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>围绕任务监控与日志展示引入 <strong>增量更新</strong>、<strong>虚拟滚动</strong> 与页面拆分，优化首屏与长列表体验，<strong>TTI 下降约 30%</strong>。</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">scutech-licenser 智能客服 Agent</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-300">Vue 3 / Python / Flask / LLM API / RAG / PostgreSQL</span>
                </div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-300">企业内部产品｜已接入客服团队日常使用</p>
                <ul className="ml-1 space-y-1.5 text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>将产品文档、审批流程说明、历史工单处理方案构建为结构化知识库，结合 RAG 技术实现精准检索与上下文增强。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>打通 approval、request、audit_logs 等核心业务数据，使 Agent 能够基于用户实际订单状态进行 <strong>实时审批解释、报错智能诊断与进度追踪</strong>。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>Agent <strong>已正式接入客服团队日常工作流</strong>，覆盖 80% 以上常见咨询场景，平均响应时间从分钟级缩短至秒级，减少重复工单约 <strong>30%</strong>。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>围绕 Runtime / Tool / RAG / Prompt / Guardrail / Observability / Eval / Cost / Deployment 共 <strong>9 类工程脚手架</strong>推进落地。</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">迪备数据可视化监控大屏</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-300">Vue 3 / grid-layout-plus / WebSocket / ECharts</span>
                </div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-300">企业级备份软件（迪备）· 数据可视化监控大屏子系统</p>
                <ul className="ml-1 space-y-1.5 text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>基于 <strong>grid-layout-plus</strong> 实现可编辑驾驶舱系统，支持模块自由增删、拖拽布局、行列配置、预览保存与主题背景切换，是产品化大屏平台而非一次性展示页。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>解决大屏整体缩放后拖拽坐标不准问题，通过 <strong>transform-scale</strong> 将外层缩放系统与布局引擎坐标系对齐，保证拖拽和 resize 在任意缩放比下精准落点。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>实现新增模块自动放置逻辑，通过 <strong>LayoutTracker</strong> 维护网格占用状态并计算最大空白可用区域，避免新增模块与已有模块冲突。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>设计面向 <strong>7×24 运行</strong> 的心跳检测与优雅降级机制：先探测服务状态再刷新数据，异常时按 <strong>递增退避策略</strong>（0/1/2/5/10/30/60s）重试，避免请求风暴并支持降级展示。</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-4 dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">AI 投资助手</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-300">Next.js 16 / React 19 / TypeScript / Mastra / PostgreSQL</span>
                </div>
                <a href="https://aiold.clczl.asia/" target="_blank" rel="noopener noreferrer" className="mb-2 inline-flex items-center gap-1 text-xs text-cyan-600 hover:underline dark:text-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  aiold.clczl.asia
                </a>
                <ul className="ml-1 space-y-1.5 text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>围绕{'"'}我的自选股{'"'}重构产品首页，拆分桌面端 dashboard 与移动端卡片化布局，抽象 App Shell、BottomNav 与断点适配方案。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>基于 <strong>Next.js + Mastra</strong> 搭建投资分析多 Agent 系统，拆分为行情查询、技术指标、新闻摘要与投资组合诊断 Agent。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>对接实时行情、K 线形态、支撑压力位与近 7 日财经新闻等多源数据；接入 <strong>OpenClaw</strong> 工作流自动抓取公众号/大 V 观点并生成摘要。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    <span>使用 Server-Sent Events 实现流式回答、支持推理过程可视化与答案高亮；通过 PostgreSQL 持久化用户对话与自选股数据。</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Other Works */}
          <section className="mb-4">
            <SectionTitle>其他个人作品</SectionTitle>
            <div className="space-y-2 text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
              <p className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                <span>
                  <strong>SportOracle 体育预测平台</strong>：AI 驱动的体育预测产品。{" "}
                  <a href="https://nba.clczl.asia/" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline dark:text-cyan-400">nba.clczl.asia</a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                <span>
                  <strong>织趣社区</strong>：面向钩织爱好者的社区产品。{" "}
                  <a href="https://zhiqu.clczl.asia/" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline dark:text-cyan-400">zhiqu.clczl.asia</a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                <span>
                  <strong>Sports Hub 浏览器插件</strong>：聚合 NBA、足球、电竞赛事信息的 Chrome Extension。{" "}
                  <a href="https://github.com/c524069797/sports-hub-extension" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline dark:text-cyan-400">GitHub</a>
                </span>
              </p>
            </div>
          </section>

          {/* Personal Advantages */}
          <section>
            <SectionTitle>个人优势</SectionTitle>
            <ul className="ml-1 space-y-2 text-[13px] leading-relaxed text-gray-800 dark:text-gray-200">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span><strong className="text-gray-900 dark:text-white">前端主导能力明确：</strong>长期负责企业级中后台、复杂流程与可视化页面建设，覆盖备份、许可证、监控大屏等高复杂度业务场景。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span><strong className="text-gray-900 dark:text-white">具备 AI 全栈开发能力：</strong>能够基于 Next.js / Python / PostgreSQL 结合 Agent 与工作流完成产品原型、功能联调与上线落地。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span><strong className="text-gray-900 dark:text-white">有真实线上作品：</strong>已上线个人作品集、AI 投资助手、体育预测平台、垂直社区等多个可访问项目。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span><strong className="text-gray-900 dark:text-white">AI 信息敏感度高：</strong>善于获取 AI 前沿信息，是多个 AI 学习社区的长期用户，持续跟踪大模型、Agent、RAG 等领域的最新动态与实践。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span><strong className="text-gray-900 dark:text-white">业务学习能力强：</strong>乐于学习业务和不同行业的精髓，能快速理解领域知识并转化为技术实现。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span><strong className="text-gray-900 dark:text-white">学习与专业基础扎实：</strong>持有软件设计师（中级）认证，英语六级，具备日语听读能力。</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
