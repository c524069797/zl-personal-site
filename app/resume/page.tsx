'use client';

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Code2,
  Github,
  Globe2,
  Link as LinkIcon,
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
import { fetchCurrentUser, getToken } from "@/lib/client-auth";
import { LinkTransition } from "@/lib/link-transition";
import {
  SiAntdesign,
  SiGitlab,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSelenium,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVuedotjs,
  SiWebpack,
} from "react-icons/si";

type TemplateKey = "showcase" | "tech" | "navy";
type ResumeVersion = "general" | "ai";

const templateOptions: Array<{ value: TemplateKey; label: string }> = [
  { value: "showcase", label: "展示版" },
  { value: "tech", label: "科技青" },
  { value: "navy", label: "商务蓝" },
];

const resumeVersionOptions: Array<{ value: ResumeVersion; label: string }> = [
  { value: "general", label: "综合版" },
  { value: "ai", label: "AI 应用开发版" },
];

const skillGroups: Array<{
  title: string;
  icon: ReactNode;
  skills: Array<{ label: string; icon?: ReactNode }>;
}> = [
  {
    title: "前端技能",
    icon: <Code2 size={14} />,
    skills: [
      { label: "Vue", icon: <SiVuedotjs size={12} /> },
      { label: "React", icon: <SiReact size={12} /> },
      { label: "Next.js", icon: <SiNextdotjs size={12} /> },
      { label: "TypeScript", icon: <SiTypescript size={12} /> },
      { label: "Ant Design", icon: <SiAntdesign size={12} /> },
      { label: "Tailwind CSS", icon: <SiTailwindcss size={12} /> },
      { label: "WebSocket" },
    ],
  },
  {
    title: "移动端技能",
    icon: <Monitor size={14} />,
    skills: [
      { label: "React Native" },
      { label: "iOS / Android" },
      { label: "uni-app" },
      { label: "微信小程序" },
      { label: "真机调试" },
    ],
  },
  {
    title: "工程化 / 测试",
    icon: <Monitor size={14} />,
    skills: [
      { label: "Vite", icon: <SiVite size={12} /> },
      { label: "Webpack", icon: <SiWebpack size={12} /> },
      { label: "Monorepo" },
      { label: "Playwright" },
      { label: "Selenium", icon: <SiSelenium size={12} /> },
      { label: "Robot Framework" },
      { label: "GitLab CI/CD", icon: <SiGitlab size={12} /> },
    ],
  },
  {
    title: "全栈 / AI 技能",
    icon: <BrainCircuit size={14} />,
    skills: [
      { label: "Node.js", icon: <SiNodedotjs size={12} /> },
      { label: "Python / FastAPI", icon: <SiPython size={12} /> },
      { label: "PostgreSQL", icon: <SiPostgresql size={12} /> },
      { label: "Redis", icon: <SiRedis size={12} /> },
      { label: "LangGraph" },
      { label: "RAG" },
      { label: "向量检索" },
    ],
  },
];

const aiSkillGroups: Array<{
  title: string;
  icon: ReactNode;
  skills: Array<{ label: string; icon?: ReactNode }>;
}> = [
  {
    title: "前端技能",
    icon: <Code2 size={14} />,
    skills: [
      { label: "Next.js", icon: <SiNextdotjs size={12} /> },
      { label: "React", icon: <SiReact size={12} /> },
      { label: "TypeScript", icon: <SiTypescript size={12} /> },
      { label: "Ant Design", icon: <SiAntdesign size={12} /> },
      { label: "Tailwind CSS", icon: <SiTailwindcss size={12} /> },
      { label: "SSE 流式交互" },
    ],
  },
  {
    title: "后端 / 数据技能",
    icon: <Monitor size={14} />,
    skills: [
      { label: "Node.js", icon: <SiNodedotjs size={12} /> },
      { label: "Python / FastAPI", icon: <SiPython size={12} /> },
      { label: "PostgreSQL", icon: <SiPostgresql size={12} /> },
      { label: "Redis", icon: <SiRedis size={12} /> },
      { label: "向量检索" },
      { label: "sqlite-vec" },
      { label: "GitLab CI/CD", icon: <SiGitlab size={12} /> },
    ],
  },
  {
    title: "AI 技能",
    icon: <BrainCircuit size={14} />,
    skills: [
      { label: "LangGraph 工作流编排" },
      { label: "RAG 检索链路设计" },
      { label: "Hybrid Retrieval" },
      { label: "Metadata Filtering" },
      { label: "Parent-Child Retrieval" },
      { label: "Tool Calling" },
      { label: "Prompt Engineering" },
      { label: "Guardrail / Eval / Observability" },
    ],
  },
];

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

function MetricList({ items }: { items: ReactNode[] }) {
  return <BulletList className="resume-metric-list" items={items} />;
}

export default function ResumePage() {
  const [template, setTemplate] = useState<TemplateKey>("showcase");
  const [resumeVersion, setResumeVersion] = useState<ResumeVersion>("general");
  const [canViewAiResume, setCanViewAiResume] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser().then((user) => {
      if (cancelled) return;
      const isAdminUser = user?.role === "admin";
      setCanViewAiResume(isAdminUser);
      if (!isAdminUser) {
        setResumeVersion("general");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async () => {
    if (resumeVersion === "ai" && !canViewAiResume) {
      alert("AI 应用开发版简历仅管理员可下载");
      return;
    }

    setIsGenerating(true);
    try {
      const token = getToken();
      const response = await fetch(`/api/resume/pdf?template=${template}&version=${resumeVersion}`, {
        headers: resumeVersion === "ai" && token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) throw new Error("生成 PDF 失败");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `陈子龙-${resumeVersion === "ai" ? "AI应用开发工程师" : "前端开发工程师"}-简历-${template}-${new Date().getFullYear()}.pdf`;
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

  const activeSkillGroups = resumeVersion === "ai" ? aiSkillGroups : skillGroups;

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
              {!canViewAiResume ? (
                <p className="resume-version-note">当前展示综合版；AI 应用开发版仅管理员可见。</p>
              ) : null}
            </div>
            <div className="resume-actions">
              {canViewAiResume ? (
                <SegmentedControl<ResumeVersion>
                  ariaLabel="选择简历版本"
                  options={resumeVersionOptions}
                  value={resumeVersion}
                  onChange={setResumeVersion}
                />
              ) : null}
              <SegmentedControl<TemplateKey>
                ariaLabel="选择简历模板"
                options={templateOptions}
                value={template}
                onChange={setTemplate}
              />
              <Button
                className="resume-download-button"
                loading={isGenerating}
                onClick={handleDownload}
                size="sm"
              >
                {isGenerating ? "生成中..." : resumeVersion === "ai" ? "下载 AI 版" : "下载综合版"}
              </Button>
            </div>
          </div>
        </div>

        <Paper className="resume-paper" size="a4">
          <header className="resume-header">
            <div className="resume-header-main">
              <div>
                <h1 className="resume-name">陈子龙</h1>
                <p className="resume-role">
                  {resumeVersion === "ai" ? "AI 应用开发工程师" : "前端开发工程师 / AI Agent 开发工程师"}
                </p>
                <p className="resume-meta">
                  {resumeVersion === "ai" ? "本科｜近 5 年前端与业务系统开发经验｜AI 应用落地实践｜广州" : "本科｜近 5 年前端与业务系统开发经验｜广州"}
                </p>
              </div>

              <div className="resume-contact-list">
                <ContactItem icon={<Phone size={12} />}>158-7444-2813</ContactItem>
                <ContactItem href="mailto:chenzhuo995@gmail.com" icon={<Mail size={12} />}>
                  chenzhuo995@gmail.com
                </ContactItem>
                <ContactItem href="https://github.com/c524069797" icon={<Github size={12} />}>
                  github.com/c524069797
                </ContactItem>
                <ContactItem href="https://www.clczl.asia" icon={<Globe2 size={12} />}>
                  clczl.asia
                </ContactItem>
              </div>
            </div>
          </header>

          <ResumeSection title="个人简介">
            <p className="resume-entry-desc">
              {resumeVersion === "ai"
                ? "具备近 5 年前端与业务系统开发经验，拥有 AI 应用落地实践，能够围绕真实业务场景完成需求拆解、知识库建设、RAG 检索、工作流编排、前后端联调与上线验证。既有企业级复杂流程系统建设经验，也有智能客服、AI 助手等项目落地案例，能够将 AI 能力产品化为稳定、可评估、可持续迭代的业务系统。"
                : "求职意向为前端开发工程师、AI Agent 开发工程师。具备近 5 年前端与业务系统开发经验，长期负责企业级中后台、复杂流程系统与数据可视化项目建设，覆盖备份恢复、许可证、内部管理系统等高复杂度业务场景。除 Web 中后台外，也具备 React Native、uni-app、小程序与 AI 应用落地实践，能够围绕真实业务完成产品实现、前后端协作与上线交付。"}
            </p>
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
              {activeSkillGroups.map((group) => (
                <Card className="resume-skill-card" key={group.title} padding="sm">
                  <div className="resume-card-title">
                    <IconBadge>{group.icon}</IconBadge>
                    <span>{group.title}</span>
                  </div>
                  <div className="resume-tag-row">
                    {group.skills.map((skill) => (
                      <SkillTag icon={skill.icon} key={skill.label}>
                        {skill.label}
                      </SkillTag>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="工作经历">
            <Timeline className="resume-timeline">
              <TimelineItem>
                <div className="resume-entry-heading">
                  <h3>广州鼎甲计算机科技有限公司</h3>
                  <span className="resume-date-pill">2021.07 - 至今</span>
                </div>
                <div className="resume-entry-role">
                  {resumeVersion === "ai" ? "前端开发工程师（兼 AI 应用开发）" : "前端开发工程师"}
                </div>
                <p className="resume-entry-desc">
                  {resumeVersion === "ai"
                    ? "负责企业级备份软件、许可证与内部综合管理系统等核心业务模块建设，同时主导 AI Agent 与 RAG 能力在真实业务中的落地，覆盖需求分析、系统设计、前端实现、后端联调与上线运营。"
                    : "负责企业级备份软件（迪备）、许可证与内部综合管理系统等核心业务模块前端，长期服务复杂流程型场景。"}
                </p>
                <MetricList
                  items={
                    resumeVersion === "ai"
                      ? [
                          <>
                            <strong>企业 Agent 落地：</strong>主导内部管理系统智能客服 Agent 从需求调研、知识库整理、RAG 检索、对话界面到上线运营的完整闭环，已接入售后、技术支持团队日常使用，覆盖审批解释、报错诊断、进度追踪等高频场景。
                          </>,
                          <>
                            <strong>RAG 工程化：</strong>将产品文档、历史工单、Wiki、SOP 拆分为可检索知识单元，设计 metadata 过滤、来源溯源、父子检索与阈值控制，把“能回答”推进到“可追踪、可评估、可维护”。
                          </>,
                          <>
                            <strong>复杂业务系统：</strong>长期负责企业级复杂流程系统建设，覆盖备份恢复、许可证管理、审批与监控等场景，具备将复杂业务规则抽象为可复用前端能力的经验。
                          </>,
                          <>
                            <strong>AI 产品开发：</strong>独立建设 AI 投资助手，完成多 Agent 编排、行情/新闻/指标数据接入、SSE 流式回答、推理过程展示与用户数据持久化。
                          </>,
                          <>
                            <strong>AI 开发规范：</strong>在团队内沉淀 <strong>Skill / OpenSpec 配置化</strong> 标准与 AI Code Review 预检查流程，MR 环节自动拦截低级错误，Review 效率提升 <strong>40%</strong>。
                          </>,
                        ]
                      : [
                          <>
                            <strong>组件库建设：</strong>主导企业级 Vue 3 组件库（
                            <code className="resume-code-token">@scutech/dbackup-admin</code>）设计与开发，涵盖 Components / Forms / Layout / Plugins 四大类 <strong>40+</strong> 组件，以 ES Module 发布并支撑迪备、许可证等多产品线复用。核心设计 <strong>WizardWrap 向导框架</strong>，支持步骤导航、验证与动态注入，成为 <strong>50+ 资源类型</strong> 备份恢复流程的统一骨架。
                          </>,
                          <>
                            <strong>业务建模：</strong>主导许可证生成、导入校验、续期升级、套餐/功能映射等前端设计与实现，推动审批、出货与归档流程由表格/钉钉记录转向系统化闭环，支撑 <strong>50+ 种许可套餐</strong> 动态组合，将重复配置时间降低 <strong>80% 以上</strong>。
                          </>,
                          <>
                            <strong>性能优化：</strong>围绕任务监控与日志展示引入 <strong>增量更新</strong>、<strong>虚拟滚动</strong> 与页面拆分，优化首屏与长列表体验，<strong>TTI 下降约 30%</strong>。
                          </>,
                          <>
                            <strong>跨端项目经验：</strong>参与 iOS / Android 与 <strong>React Native</strong> 项目建设，处理业务页面、接口联调、登录态保持、权限与设备适配，具备从真机调试到打包发布的完整链路经验。
                          </>,
                          <>
                            <strong>AI 业务落地：</strong>主导内部管理系统智能客服 Agent 从需求调研到上线运营的全流程，构建基于业务数据的 RAG 诊断与问答能力，已接入售后、技术支持团队日常使用。
                          </>,
                          <>
                            <strong>AI 代码规范：</strong>在前端团队建立 AI 介入开发流程的标准规范，沉淀 <strong>Skill / OpenSpec 配置化</strong> 标准，定义 AI 使用边界与工程化检查清单；引入 AI Code Review 预检查流程，MR 环节自动拦截低级错误，Review 效率提升 <strong>40%</strong>，设计稿落地时间从 2-3 天缩短到 <strong>4-6 小时</strong>。
                          </>,
                        ]
                  }
                />
              </TimelineItem>
            </Timeline>
          </ResumeSection>

          <ResumeSection title="项目经历">
            <div className="resume-project-stack">
              {resumeVersion === "ai" ? (
	                <>
	                  <Card className="resume-project-card">
	                    <div className="resume-project-heading">
	                      <h4>迪备备份恢复系统</h4>
	                      <span>Vue / TypeScript / WebSocket</span>
	                    </div>
	                    <p className="resume-project-desc">企业级备份软件核心业务系统，长期负责备份恢复流程、通用能力沉淀与复杂业务交互建设。</p>
	                    <MetricList
	                      items={[
	                        <>
	                          <strong>组件能力：</strong>主导企业级 Vue 3 组件库与通用能力建设，沉淀 Components / Forms / Layout / Plugins 等 <strong>40+</strong> 组件，支撑多条产品线复用。
	                        </>,
	                        <>
	                          <strong>流程抽象：</strong>主导备份/恢复向导框架设计与实现，支撑 <strong>50+ 资源类型</strong>动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。
	                        </>,
	                        <>
	                          <strong>许可证模块：</strong>独立负责许可证生成、导入校验、续期升级、套餐/功能映射等核心模块，支撑 <strong>50+ 种许可套餐</strong>动态组合，将重复配置时间降低 <strong>80% 以上</strong>。
	                        </>,
	                        <>
	                          <strong>性能优化：</strong>围绕任务监控、长列表和日志展示持续做性能优化，结合增量更新、虚拟滚动和页面拆分，显著改善复杂页面的交互体验与响应效率。
	                        </>,
	                      ]}
	                    />
                  </Card>

                  <Card className="resume-project-card">
	                    <div className="resume-project-heading">
	                      <h4>企业 Agent 客服项目</h4>
	                      <span>React / Python / FastAPI / LangGraph / RAG / sqlite-vec / PostgreSQL</span>
	                    </div>
	                    <p className="resume-project-desc">公司落地项目｜已接入售后、技术支持团队日常使用</p>
	                    <MetricList
                      items={[
                        <>
                          <strong>业务背景：</strong>内部管理系统业务逻辑复杂，客服团队需高频处理审批进度查询、报错诊断、套餐功能解释等重复问题，人工响应慢且知识传递成本高。
                        </>,
                        <>
                          <strong>RAG 知识库：</strong>将产品文档、审批流程、历史工单、Wiki、SOP 和常见报错排查指南构建为结构化知识库，设计多粒度 Chunk、metadata 富化、来源溯源和父子检索策略。
                        </>,
                        <>
                          <strong>业务数据联动：</strong>打通申请、审批、审计等核心业务数据，使 Agent 能基于真实申请单与工单状态进行 <strong>实时审批解释、报错智能诊断与进度追踪</strong>。
                        </>,
                        <>
                          <strong>前端对话体验：</strong>开发对话式工作台，支持多轮上下文、引用来源高亮、诊断步骤展示与一键转人工，降低客服使用门槛并保留复杂问题交接路径。
	                        </>,
	                        <>
	                          <strong>落地效果：</strong>Agent 已接入售后、技术支持团队日常工作流，覆盖 80% 以上常见咨询场景，平均响应从分钟级缩短至秒级，减少重复工单约 <strong>30%</strong>。
	                        </>,
                        <>
                          <strong>工程治理：</strong>推进 LangGraph Checkpointer、StructuredTool + ToolNode、检索阈值 / Hybrid Search / Reranker、Eval 测试集与 Trace 观测能力，把 AI 助手从“能跑”升级为“可观测、可评估、可回滚”。
                        </>,
                      ]}
	                    />
	                  </Card>

	                  <Card className="resume-project-card">
	                    <div className="resume-project-heading">
	                      <h4>AI 投资助手</h4>
	                      <span>Next.js 16 / React 19 / TypeScript / Mastra / PostgreSQL / SSE / OpenClaw</span>
	                    </div>
	                    <p className="resume-project-desc">个人项目｜面向个人投资研究场景的 AI 驱动产品</p>
	                    <a className="resume-project-link" href="https://aiold.clczl.asia/" target="_blank" rel="noopener noreferrer">
	                      <LinkIcon size={12} />
	                      aiold.clczl.asia
	                    </a>
	                    <MetricList
	                      items={[
	                        <>
	                          <strong>产品闭环：</strong>围绕个人投资研究场景设计“数据聚合 + 分析问答 + 个性化追踪”的产品闭环，覆盖桌面端与移动端体验。
	                        </>,
		                        <>
		                          <strong>多 Agent 编排：</strong>拆分行情、指标、新闻与组合诊断等多个分析角色，通过工作流编排实现复杂问题分步推理与结构化输出。
		                        </>,
		                        <>
		                          <strong>数据与交互闭环：</strong>打通实时行情、技术形态、财经新闻与外部观点摘要，支持流式回答、推理过程展示、重点结论高亮和会话持久化。
		                        </>,
		                      ]}
		                    />
	                  </Card>
	                </>
              ) : (
                <>
	              <Card className="resume-project-card">
	                <div className="resume-project-heading">
	                  <h4>迪备备份恢复系统</h4>
	                  <span>Vue / TypeScript / WebSocket</span>
	                </div>
                <p className="resume-project-desc">企业级备份软件（迪备）· 核心备份/恢复流程前端</p>
                <MetricList
                  items={[
                    <>
                      <strong>组件库建设：</strong>主导企业级 Vue 3 组件库 <code className="resume-code-token">@scutech/dbackup-admin</code> 设计与开发，涵盖 Components / Forms / Layout / Plugins 四大类 <strong>40+</strong> 组件，以 ES Module 方式发布。建立组件文档、示例与主题系统，覆盖公司多条产品线复用，减少重复开发成本。
                    </>,
                    <>
                      <strong>通用模块：</strong>主导备份/恢复向导前端设计与实现。为解决多资源类型流程重复开发问题，设计 <strong>通用向导框架</strong>，基于 <strong>工厂模式 + Context + Proxy</strong> 支撑 <strong>50+ 资源类型</strong>（文件、数据库、虚拟机、对象存储等）动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。核心 <strong>WizardWrap</strong> 组件支持步骤导航、验证、动态注入与隐藏，成为全平台备份恢复流程的统一骨架。
                    </>,
                    <>
                      通过 Proxy 拦截步骤间状态流转，统一处理步骤校验、数据缓存、回滚与恢复，降低业务组件 60% 以上的心智负担；结合 WebSocket 推送、缓冲队列与重连机制，保障任务状态秒级同步。
                    </>,
                    <>
                      <strong>许可证模块：</strong>独立负责许可证生成、导入校验、续期升级、套餐/功能映射等全流程前端设计与实现，推动审批、出货与归档流程由表格/钉钉记录转向系统化闭环，支撑多条产品线与 <strong>50+ 种许可套餐</strong> 动态组合，将重复配置时间降低 <strong>80% 以上</strong>。
                    </>,
                    <>
                      围绕任务监控与日志展示引入 <strong>增量更新</strong>、<strong>虚拟滚动</strong> 与页面拆分，优化首屏与长列表体验，<strong>TTI 下降约 30%</strong>。
                    </>,
                  ]}
                />
              </Card>

	              <Card className="resume-project-card">
	                <div className="resume-project-heading">
	                  <h4>内部管理系统智能客服 Agent</h4>
	                  <span>React / Python / FastAPI / LangGraph / RAG / sqlite-vec / PostgreSQL</span>
	                </div>
	                <p className="resume-project-desc">公司落地项目｜已接入售后、技术支持团队日常使用</p>
                <MetricList
                  items={[
                    "将产品文档、审批流程说明、历史工单处理方案构建为结构化知识库，结合 RAG 技术实现精准检索与上下文增强。",
                    <>
                      打通 申请，审批，审计 等核心业务数据，使 Agent 能够基于用户实际申请表单或者工单状态进行 <strong>实时审批解释、报错智能诊断与进度追踪</strong>。
                    </>,
	                    <>
	                      Agent <strong>已正式接入售后、技术支持团队日常工作流</strong>，覆盖 80% 以上常见咨询场景，平均响应时间从分钟级缩短至秒级，减少重复工单约 <strong>30%</strong>。
	                    </>,
                    <>
                      围绕 Runtime / Tool / RAG / Prompt / Guardrail / Observability / Eval / Cost / Deployment 共 <strong>9 类工程脚手架</strong> 推进落地。
                    </>,
                  ]}
                />
              </Card>

              <Card className="resume-project-card">
                <div className="resume-project-heading">
                  <h4>迪备数据可视化监控大屏</h4>
	                  <span>Vue / grid-layout-plus / WebSocket / ECharts</span>
                </div>
                <p className="resume-project-desc">企业级备份软件（迪备）· 数据可视化监控大屏子系统</p>
                <MetricList
                  items={[
                    <>
                      基于 <strong>grid-layout-plus</strong> 实现可编辑驾驶舱系统，支持模块自由增删、拖拽布局、行列配置、预览保存与主题背景切换，是产品化大屏平台而非一次性展示页。
                    </>,
	                    <>
	                      解决大屏整体缩放后拖拽坐标不准问题，通过 <strong>transform-scale</strong> 将外层缩放系统与布局引擎坐标系对齐，保证拖拽和 resize 在任意缩放比下精准落点。
	                    </>,
	                  ]}
	                />
	              </Card>

	              <Card className="resume-project-card">
	                <div className="resume-project-heading">
	                  <h4>AI 投资助手</h4>
	                  <span>Next.js 16 / React 19 / TypeScript / Mastra / PostgreSQL / SSE / OpenClaw</span>
	                </div>
	                <p className="resume-project-desc">个人项目｜面向个人投资研究场景的 AI 驱动产品</p>
	                <a className="resume-project-link" href="https://aiold.clczl.asia/" target="_blank" rel="noopener noreferrer">
                  <LinkIcon size={12} />
                  aiold.clczl.asia
                </a>
                <MetricList
                  items={[
	                    <>
	                      基于 <strong>Next.js + Mastra</strong> 搭建投资分析多 Agent 系统，拆分为行情查询、技术指标、新闻摘要与投资组合诊断 Agent。
	                    </>,
                    <>
                      对接实时行情、K 线形态、支撑压力位与近 7 日财经新闻等多源数据；接入 <strong>OpenClaw</strong> 工作流自动抓取公众号/大 V 观点并生成摘要。
                    </>,
                    <>
                      <strong>长期记忆与数据分层：</strong>围绕用户画像、自选理由、持仓逻辑和复盘结论设计长期记忆层，区分“用户记忆”和“市场事实”两类数据，提升跨会话分析连续性。
                    </>,
	                    "使用 Server-Sent Events 实现流式回答、支持推理过程可视化与答案高亮；通过 PostgreSQL 持久化用户对话与自选股数据。",
	                  ]}
	                />
	              </Card>
                </>
              )}
            </div>
          </ResumeSection>

          {resumeVersion === "general" ? (
          <ResumeSection title="其他个人作品">
            <div className="resume-work-list">
              <p>
                <span className="resume-work-dot" />
                <span>
                  <strong>SportOracle 体育预测平台</strong>：AI 驱动的体育预测产品。{" "}
                  <a className="resume-link" href="https://nba.clczl.asia/" target="_blank" rel="noopener noreferrer">
                    nba.clczl.asia
                  </a>
                </span>
              </p>
              <p>
                <span className="resume-work-dot" />
                <span>
                  <strong>Sports Hub 浏览器插件</strong>：聚合 NBA、足球、电竞赛事信息的 Chrome Extension。{" "}
                  <a className="resume-link" href="https://github.com/c524069797/sports-hub-extension" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </span>
              </p>
            </div>
          </ResumeSection>
          ) : null}

          <ResumeSection title="个人优势">
            <MetricList
              items={[
                <>
                  <strong>持续关注 AI 前沿并快速转化实践：</strong>长期关注大模型、Agent、RAG 与 AI 开发工具的新进展，是多个 AI 交流社区的深度参与者；能够将新方向快速转化为可验证方案，并沉淀为可落地的功能与方法。
                </>,
                <>
                  <strong>技术广度完整，具备全栈与多端经验：</strong>除前端工程外，也具备后端协作、数据库、发布部署、测试质量、移动端与小程序等实践经验，能够从产品、研发到交付全链路理解并推进业务系统落地。
                </>,
                <>
                  <strong>学习主动性强，重视实践验证：</strong>面对新方向不止停留在概念理解，而是倾向于主动搭建 Demo、验证可行性并结合真实业务持续迭代，形成从学习、实践到复用的方法沉淀。
                </>,
              ]}
            />
          </ResumeSection>
        </Paper>
      </div>
    </main>
  );
}
