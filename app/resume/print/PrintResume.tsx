'use client';

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RESUME_VERSIONS, resumeDataMap } from "../data";
import type { Bullet, ResumeData, ResumeVersion } from "../data";

/**
 * 打印版简历渲染器（PDF 的数据源）。
 *
 * 三个版本（全栈 / 前端 / 后端）共用这一份渲染逻辑，内容全部来自 app/resume/data，
 * 与在线简历页同源——改数据层，网站和 PDF 一起变。
 */

const CONTACTS = ["158-7444-2813", "chenzhuo995@gmail.com", "github.com/c524069797", "clczl.asia"];

const VERSION_LABELS: Record<ResumeVersion, string> = {
  fullstack: "AI 全栈",
  frontend: "AI 前端",
  backend: "AI 后端",
};

const TEMPLATES = [
  { key: "tech", label: "科技青" },
  { key: "card", label: "卡片白" },
  { key: "navy", label: "商务蓝" },
];

function SkillTag({ children, template }: { children: React.ReactNode; template: string }) {
  const styles: Record<string, string> = {
    tech: "rounded border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] text-cyan-700",
    card: "rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700 shadow-sm",
    navy: "rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700",
  };
  return <span className={styles[template] || styles.tech}>{children}</span>;
}

function BulletItems({ bullets, className }: { bullets: Bullet[]; className: string }) {
  return (
    <ul className={className}>
      {bullets.map((b) => (
        <li key={b.label}>
          <strong>{b.label}：</strong>
          {b.text}
        </li>
      ))}
    </ul>
  );
}

function ResumeContent({ data, template, version }: { data: ResumeData; template: string; version: ResumeVersion }) {
  const [showOtherWorks, setShowOtherWorks] = useState(true);
  const [showAdvantages, setShowAdvantages] = useState(true);

  const isCard = template === "card";
  const isNavy = template === "navy";

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

  const sectionDot = isCard ? <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" /> : null;

  const expTitle = `text-sm font-bold ${textMain}`;
  const expDate = isNavy ? "text-xs text-indigo-400 font-medium" : "text-xs text-gray-400";
  const expRole = isNavy ? "text-xs italic text-indigo-500" : "text-xs italic text-gray-500";
  const expDesc = "text-[11px] text-gray-500 mt-0.5";
  const expList = "mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-gray-800";
  const techStack = isNavy ? "text-[10px] text-indigo-400 font-semibold" : "text-[10px] text-gray-400 font-semibold";

  return (
    <div className={`bg-white ${textMain}`}>
      {/* 工具栏：打印时隐藏 */}
      <div className="print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">显示控制：</span>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showOtherWorks}
                onChange={(e) => setShowOtherWorks(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              其他作品
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
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

        {/* 版本切换 */}
        <div className="mx-auto max-w-4xl border-b border-gray-100 bg-white px-6 py-3">
          <span className="mr-3 text-sm font-medium text-gray-700">简历版本：</span>
          {RESUME_VERSIONS.map((v) => (
            <a
              key={v}
              href={`${v === "fullstack" ? "/resume/print" : `/resume/print/${v}`}?template=${template}`}
              className={`mr-2 inline-flex items-center rounded-full px-3 py-1 text-xs transition-colors ${
                version === v ? "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {VERSION_LABELS[v]}
            </a>
          ))}
        </div>

        {/* 模板切换 */}
        <div className="mx-auto max-w-4xl border-b border-gray-100 bg-white px-6 py-3">
          <span className="mr-3 text-sm font-medium text-gray-700">选择模板：</span>
          {TEMPLATES.map((t) => (
            <a
              key={t.key}
              href={`${version === "fullstack" ? "/resume/print" : `/resume/print/${version}`}?template=${t.key}`}
              className={`mr-2 inline-flex items-center rounded-full px-3 py-1 text-xs transition-colors ${
                template === t.key ? "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto box-border p-8" style={{ width: "210mm", minHeight: "297mm" }}>
        <header className={headerWrapper}>
          <h1 className={headerName}>陈子龙</h1>
          <p className={headerSub}>{data.role}</p>
          <div className={headerMeta}>
            {CONTACTS.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </header>

        {showAdvantages && (
          <section className="mb-3">
            <h2 className={sectionTitle}>
              {sectionDot}
              个人优势
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-800">{data.advantage}</p>
          </section>
        )}

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

        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            专业技能
          </h2>
          <div className="space-y-1 text-xs">
            {data.skillGroups.map((g) => (
              <div className="flex gap-2" key={g.title}>
                <span className="w-14 shrink-0 font-medium text-gray-700">{g.title}：</span>
                <span className="text-gray-600">{g.skills.join("、")}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            工作经历
          </h2>
          {data.experience.map((exp) => (
            <div className="mb-2" key={exp.company}>
              <div className="flex items-baseline justify-between">
                <h3 className={expTitle}>{exp.company}</h3>
                <span className={expDate}>{exp.date}</span>
              </div>
              <p className={expRole}>{exp.role}</p>
              <p className={expDesc}>{exp.desc}</p>
              <BulletItems bullets={exp.bullets} className={expList} />
            </div>
          ))}
        </section>

        <section className="mb-3">
          <h2 className={sectionTitle}>
            {sectionDot}
            项目经历
          </h2>
          {data.projects.map((p) => (
            <div className="mb-1.5" key={p.title}>
              <div className="flex items-baseline justify-between">
                <h4 className="text-xs font-bold text-gray-900">{p.title}</h4>
                <span className={techStack}>{p.stack}</span>
              </div>
              <p className="text-[10px] text-gray-400">{p.desc}</p>
              <BulletItems bullets={p.bullets} className={expList} />
            </div>
          ))}
        </section>

        {showOtherWorks && data.otherWorks.length > 0 && (
          <section>
            <h2 className={sectionTitle}>
              {sectionDot}
              其他个人作品
            </h2>
            <div className="space-y-0.5 text-[11px] leading-relaxed text-gray-800">
              {data.otherWorks.map((w) => (
                <p key={w.title}>
                  <strong>{w.title}</strong>：{w.desc}（{w.linkLabel}）
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function PrintInner({ version }: { version: ResumeVersion }) {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") || "tech";
  return <ResumeContent data={resumeDataMap[version]} template={template} version={version} />;
}

export function PrintResume({ version }: { version: ResumeVersion }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">加载中...</div>}>
      <PrintInner version={version} />
    </Suspense>
  );
}
