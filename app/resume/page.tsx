'use client';

import type { ReactNode } from "react";
import { Fragment, useState } from "react";
import {
  BrainCircuit,
  Code2,
  Github,
  Globe2,
  Mail,
  Monitor,
  Phone,
} from "lucide-react";
import {
  BulletList,
  Button,
  Card,
  IconBadge,
  Paper,
  SectionHeading,
  SegmentedControl,
  Tag,
  Timeline,
  TimelineItem,
} from "czl-personal-ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LinkTransition } from "@/lib/link-transition";
import {
  SiAntdesign,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { RESUME_VERSIONS, resumeDataMap } from "./data";
import type { Bullet, ResumeVersion, SkillIconKey } from "./data";

type TemplateKey = "showcase" | "tech" | "navy";

const templateOptions: Array<{ value: TemplateKey; label: string }> = [
  { value: "showcase", label: "展示版" },
  { value: "tech", label: "科技青" },
  { value: "navy", label: "商务蓝" },
];

const versionOptions = RESUME_VERSIONS.map((value) => ({
  value,
  label: resumeDataMap[value].tabLabel,
}));

/** 技能分组标题左侧的图标 */
const groupIcons: Record<SkillIconKey, ReactNode> = {
  frontend: <Code2 size={14} />,
  backend: <Monitor size={14} />,
  agent: <BrainCircuit size={14} />,
};

/** 技能名 → 图标。查不到的技能不显示图标，新增技能不会崩 */
const skillIcons: Record<string, ReactNode> = {
  "Next.js": <SiNextdotjs size={12} />,
  React: <SiReact size={12} />,
  TypeScript: <SiTypescript size={12} />,
  "Ant Design": <SiAntdesign size={12} />,
  "Tailwind CSS": <SiTailwindcss size={12} />,
  "Node.js": <SiNodedotjs size={12} />,
  Python: <SiPython size={12} />,
  PostgreSQL: <SiPostgresql size={12} />,
  Redis: <SiRedis size={12} />,
};

const CONTACTS = {
  phone: "158-7444-2813",
  email: "chenzhuo995@gmail.com",
  github: "github.com/c524069797",
  githubUrl: "https://github.com/c524069797",
  site: "clczl.asia",
  siteUrl: "https://www.clczl.asia",
};

function ResumeBackground() {
  return (
    <div className="resume-tech-bg print:hidden" aria-hidden="true">
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
  );
}

function ResumeSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="resume-section">
      <SectionHeading className="resume-section-title">{title}</SectionHeading>
      {children}
    </section>
  );
}

function SkillTag({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <Tag icon={icon} size="sm">
      {children}
    </Tag>
  );
}

function ContactItem({
  children,
  href,
  icon,
}: {
  children: ReactNode;
  href?: string;
  icon: ReactNode;
}) {
  const content = href ? (
    <a className="resume-link" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );

  return (
    <p className="resume-contact-item">
      <IconBadge size="sm">{icon}</IconBadge>
      {content}
    </p>
  );
}

/** 把「标签：描述」条目渲染成加粗标签 + 正文 */
function renderBullets(bullets: Bullet[]) {
  return bullets.map((bullet) => (
    <Fragment key={bullet.label}>
      <strong>{bullet.label}：</strong>
      {bullet.text}
    </Fragment>
  ));
}

function MetricList({ items }: { items: ReactNode[] }) {
  return <BulletList className="resume-metric-list" items={items} />;
}

export default function ResumePage() {
  const [template, setTemplate] = useState<TemplateKey>("showcase");
  const [version, setVersion] = useState<ResumeVersion>("fullstack");
  const [isGenerating, setIsGenerating] = useState(false);

  const data = resumeDataMap[version];

  // PDF 与页面同源：导出的永远是当前选中的版本
  const downloadPdf = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/resume/pdf?template=${template}&version=${version}`);
      if (!response.ok) throw new Error("生成 PDF 失败");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `陈子龙-${data.tabLabel}-简历-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("下载 PDF 失败:", error);
      alert("下载 PDF 失败，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <main className="resume-page" data-resume-theme={template}>
      <ResumeBackground />

      <div className="resume-theme-toggle print:hidden">
        <ThemeToggle />
      </div>

      <div className="resume-shell">
        <div className="resume-toolbar print:hidden">
          <LinkTransition href="/" className="resume-back-link">
            返回首页
          </LinkTransition>

          <div className="resume-toolbar-row">
            <div>
              <h1 className="resume-page-title">个人简历</h1>
            </div>
            <div className="resume-actions">
              <div className="resume-switcher-stack">
                <div className="resume-switcher">
                  <span className="resume-switcher-label">简历版本</span>
                  <SegmentedControl<ResumeVersion>
                    ariaLabel="选择简历版本"
                    options={versionOptions}
                    value={version}
                    onChange={setVersion}
                  />
                </div>
                <div className="resume-switcher">
                  <span className="resume-switcher-label">配色模板</span>
                  <SegmentedControl<TemplateKey>
                    ariaLabel="选择简历模板"
                    options={templateOptions}
                    value={template}
                    onChange={setTemplate}
                  />
                </div>
              </div>
              <Button
                className="resume-download-button"
                loading={isGenerating}
                onClick={downloadPdf}
                size="sm"
              >
                {isGenerating ? "生成中..." : `下载 ${data.tabLabel} PDF`}
              </Button>
            </div>
          </div>
        </div>

        <Paper className="resume-paper resume-paper-swap" key={version} size="a4">
          <header className="resume-header">
            <div className="resume-header-main">
              <div>
                <h1 className="resume-name">陈子龙</h1>
                <p className="resume-role">{data.role}</p>
                <p className="resume-meta">{data.meta}</p>
              </div>

              <div className="resume-contact-list">
                <ContactItem icon={<Phone size={12} />}>{CONTACTS.phone}</ContactItem>
                <ContactItem href={`mailto:${CONTACTS.email}`} icon={<Mail size={12} />}>
                  {CONTACTS.email}
                </ContactItem>
                <ContactItem href={CONTACTS.githubUrl} icon={<Github size={12} />}>
                  {CONTACTS.github}
                </ContactItem>
                <ContactItem href={CONTACTS.siteUrl} icon={<Globe2 size={12} />}>
                  {CONTACTS.site}
                </ContactItem>
              </div>
            </div>
          </header>

          <ResumeSection title="个人优势">
            <p className="resume-entry-desc">{data.advantage}</p>
          </ResumeSection>

          <ResumeSection title="个人简介">
            <p className="resume-entry-desc">{data.summary}</p>
          </ResumeSection>

          <ResumeSection title="教育经历 / 语言能力">
            <div className="resume-education-grid">
              <Card className="resume-info-card" padding="sm">
                <div className="resume-info-title">吉首大学｜软件工程（本科）</div>
                <div className="resume-muted">2017.09 - 2021.06</div>
              </Card>

              <div className="resume-education-aside">
                <div className="resume-tag-row resume-tag-row--end">
                  <SkillTag>CET-6</SkillTag>
                  <SkillTag>软件设计师（中级）</SkillTag>
                </div>
                <div className="resume-muted">英文技术文档阅读通畅，具备日语听读能力</div>
              </div>
            </div>
          </ResumeSection>

          <ResumeSection title="专业技能">
            <div className="resume-card-grid">
              {data.skillGroups.map((group) => (
                <Card className="resume-skill-card" key={group.title} padding="sm">
                  <div className="resume-skill-line">
                    <div className="resume-card-title">
                      <IconBadge>{groupIcons[group.iconKey]}</IconBadge>
                      <span>{group.title}：</span>
                    </div>
                    {group.skills.map((skill) => (
                      <SkillTag icon={skillIcons[skill]} key={skill}>
                        {skill}
                      </SkillTag>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="工作经历">
            <Timeline className="resume-timeline">
              {data.experience.map((entry) => (
                <TimelineItem key={entry.company}>
                  <div className="resume-entry-heading">
                    <h3>{entry.company}</h3>
                    <span className="resume-date-pill">{entry.date}</span>
                  </div>
                  <div className="resume-entry-role">{entry.role}</div>
                  <p className="resume-entry-desc">{entry.desc}</p>
                  <MetricList items={renderBullets(entry.bullets)} />
                </TimelineItem>
              ))}
            </Timeline>
          </ResumeSection>

          <ResumeSection title="项目经历">
            <div className="resume-project-stack">
              {data.projects.map((project) => (
                <Card className="resume-project-card" key={project.title}>
                  <div className="resume-project-heading">
                    <h4>
                      {project.href ? (
                        <a href={project.href} target="_blank" rel="noopener noreferrer">
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h4>
                    <span>{project.stack}</span>
                  </div>
                  <p className="resume-project-desc">{project.desc}</p>
                  {project.href ? (
                    <a
                      className="resume-project-link"
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={12} />
                      {project.href.replace("https://", "")}
                    </a>
                  ) : null}
                  <MetricList items={renderBullets(project.bullets)} />
                </Card>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="其他个人作品">
            <div className="resume-work-list">
              {data.otherWorks.map((work) => (
                <p key={work.title}>
                  <span className="resume-work-dot" />
                  <span>
                    <strong>
                      <a className="resume-title-link" href={work.href} target="_blank" rel="noopener noreferrer">
                        {work.title}
                      </a>
                    </strong>
                    ：{work.desc}{" "}
                    <a className="resume-link" href={work.href} target="_blank" rel="noopener noreferrer">
                      {work.linkLabel}
                    </a>
                  </span>
                </p>
              ))}
            </div>
          </ResumeSection>

        </Paper>
      </div>
    </main>
  );
}
