/**
 * 简历内容数据层类型定义。
 *
 * 网站简历原本把内容硬编码在 JSX 里，三个版本会变成多处重复。
 * 这里把「内容」与「渲染」分离：数据只描述文字，图标/组件/样式留给页面。
 */

export type ResumeVersion = "fullstack" | "frontend" | "backend";

/** 技能分组的图标键，页面侧按此映射到具体 icon 组件 */
export type SkillIconKey = "frontend" | "backend" | "agent";

/** 简历条目统一为「标签：描述」结构，渲染时标签加粗 */
export interface Bullet {
  label: string;
  text: string;
}

export interface SkillGroup {
  title: string;
  iconKey: SkillIconKey;
  /** 技能名，页面按名字查图标，查不到则不显示图标 */
  skills: string[];
}

export interface ExperienceEntry {
  company: string;
  date: string;
  role: string;
  desc: string;
  bullets: Bullet[];
}

export interface ProjectEntry {
  title: string;
  /** 有 href 时标题渲染为链接，并额外显示一行 GitHub 地址 */
  href?: string;
  stack: string;
  desc: string;
  bullets: Bullet[];
}

export interface OtherWork {
  title: string;
  href: string;
  desc: string;
  linkLabel: string;
}

export interface ResumeData {
  /** 版本 Tab 上显示的名字 */
  tabLabel: string;
  /** 简历头部的职位口径 */
  role: string;
  /** 简历头部的一行摘要 */
  meta: string;
  summary: string;
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  otherWorks: OtherWork[];
  advantages: Bullet[];
}
