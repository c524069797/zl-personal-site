/**
 * 从数据层导出三份简历 Markdown。
 *
 * 数据层（app/resume/data）是简历的唯一事实来源：网站、PDF、Markdown 全部由它生成。
 * 手工维护多份副本必然漂移——之前离职日期就是只改了 md、网站没变。
 *
 * 用法：pnpm resume:md [输出目录]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RESUME_VERSIONS, resumeDataMap } from "../app/resume/data";
import type { Bullet, ResumeData, ResumeVersion } from "../app/resume/data";

const FILE_NAMES: Record<ResumeVersion, string> = {
  fullstack: "陈子龙-简历-AI全栈.md",
  frontend: "陈子龙-简历-AI前端.md",
  backend: "陈子龙-简历-AI后端.md",
};

const CONTACTS = [
  ["手机", "15874442813"],
  ["邮箱", "chenzhuo995@gmail.com"],
  ["期望城市", "广州 / 深圳 / 上海"],
  ["GitHub", "https://github.com/c524069797"],
  ["作品集", "https://www.clczl.asia"],
];

const bulletLines = (bullets: Bullet[]) =>
  bullets.map((b) => `- **${b.label}**：${b.text}`).join("\n");

function toMarkdown(data: ResumeData): string {
  const parts: string[] = [];

  parts.push(`# 陈子龙 - 简历（${data.tabLabel}）`);
  parts.push("");
  parts.push(`> 由 \`app/resume/data\` 自动生成，请勿直接编辑本文件。改内容请改数据层后重新导出。`);
  parts.push("");

  parts.push("## 基本信息");
  parts.push("");
  parts.push(`- **求职方向**：${data.role}`);
  CONTACTS.forEach(([k, v]) => parts.push(`- **${k}**：${v}`));
  parts.push(`- **概况**：${data.meta}`);
  parts.push("");

  parts.push("## 个人概览");
  parts.push("");
  parts.push(data.advantage);
  parts.push("");
  parts.push(data.summary);
  parts.push("");
  parts.push("**教育**：吉首大学｜软件工程（本科）｜2017.09 – 2021.06｜CET-6、软件设计师（中级）；英文技术文档阅读通畅，具备日语听读能力");
  parts.push("");
  data.skillGroups.forEach((g) => parts.push(`**${g.title}**：${g.skills.join("、")}`));
  parts.push("");

  parts.push("## 工作经历");
  parts.push("");
  data.experience.forEach((e) => {
    parts.push(`### ${e.company}｜${e.role}｜${e.date}`);
    parts.push("");
    parts.push(e.desc);
    parts.push("");
    parts.push(bulletLines(e.bullets));
    parts.push("");
  });

  parts.push("## 项目经历");
  parts.push("");
  data.projects.forEach((p) => {
    parts.push(`### ${p.title}`);
    parts.push("");
    parts.push(`**技术栈**：${p.stack}`);
    parts.push("");
    parts.push(p.desc);
    if (p.href) {
      parts.push("");
      parts.push(`GitHub：${p.href}`);
    }
    parts.push("");
    parts.push(bulletLines(p.bullets));
    parts.push("");
  });

  if (data.otherWorks.length > 0) {
    parts.push("## 其他个人作品");
    parts.push("");
    data.otherWorks.forEach((w) => parts.push(`- **${w.title}**：${w.desc}${w.href}`));
    parts.push("");
  }

  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

const outDir = process.argv[2] || join(process.cwd(), "content", "resume-export");
mkdirSync(outDir, { recursive: true });

RESUME_VERSIONS.forEach((version) => {
  const file = join(outDir, FILE_NAMES[version]);
  writeFileSync(file, toMarkdown(resumeDataMap[version]), "utf-8");
  console.log(`✅ ${FILE_NAMES[version]}`);
});

console.log(`\n📁 Markdown 输出目录：${outDir}`);
