'use client';

import type { ReactNode } from "react";
import { useState } from "react";
import {
  BrainCircuit,
  Code2,
  Github,
  Globe2,
  Link as LinkIcon,
  Mail,
  Monitor,
  Phone,
  TestTube2,
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
  SiEslint,
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
  SiVitest,
  SiVuedotjs,
  SiWebpack,
} from "react-icons/si";

type TemplateKey = "showcase" | "tech" | "navy";

const templateOptions: Array<{ value: TemplateKey; label: string }> = [
  { value: "showcase", label: "展示版" },
  { value: "tech", label: "科技青" },
  { value: "navy", label: "商务蓝" },
];

const skillGroups: Array<{
  title: string;
  icon: ReactNode;
  skills: Array<{ label: string; icon?: ReactNode }>;
}> = [
  {
    title: "前端开发",
    icon: <Code2 size={14} />,
    skills: [
      { label: "Vue 2/3", icon: <SiVuedotjs size={12} /> },
      { label: "React", icon: <SiReact size={12} /> },
      { label: "Next.js", icon: <SiNextdotjs size={12} /> },
      { label: "TypeScript", icon: <SiTypescript size={12} /> },
      { label: "Ant Design", icon: <SiAntdesign size={12} /> },
      { label: "ECharts" },
      { label: "Tailwind CSS", icon: <SiTailwindcss size={12} /> },
      { label: "WebSocket" },
    ],
  },
  {
    title: "工程化与质量",
    icon: <Monitor size={14} />,
    skills: [
      { label: "Vite", icon: <SiVite size={12} /> },
      { label: "Webpack", icon: <SiWebpack size={12} /> },
      { label: "Monorepo" },
      { label: "ESLint", icon: <SiEslint size={12} /> },
      { label: "Vitest", icon: <SiVitest size={12} /> },
      { label: "GitLab CI/CD", icon: <SiGitlab size={12} /> },
    ],
  },
  {
    title: "AI 应用与全栈协作",
    icon: <BrainCircuit size={14} />,
    skills: [
      { label: "LangGraph" },
      { label: "Mastra" },
      { label: "RAG" },
      { label: "Node.js", icon: <SiNodedotjs size={12} /> },
      { label: "Python / FastAPI", icon: <SiPython size={12} /> },
      { label: "Java" },
      { label: "PostgreSQL", icon: <SiPostgresql size={12} /> },
      { label: "Redis", icon: <SiRedis size={12} /> },
      { label: "向量存储" },
    ],
  },
  {
    title: "自动化测试",
    icon: <TestTube2 size={14} />,
    skills: [
      { label: "Selenium", icon: <SiSelenium size={12} /> },
      { label: "Robot Framework" },
      { label: "回归测试" },
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/resume/pdf?template=${template}`);
      if (!response.ok) throw new Error("生成 PDF 失败");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `陈子龙-前端开发工程师-简历-${template}-${new Date().getFullYear()}.pdf`;
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
            <h1 className="resume-page-title">个人简历</h1>
            <div className="resume-actions">
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
                {isGenerating ? "生成中..." : "下载当前模板"}
              </Button>
            </div>
          </div>
        </div>

        <Paper className="resume-paper" size="a4">
          <header className="resume-header">
            <div className="resume-header-main">
              <div>
                <h1 className="resume-name">陈子龙</h1>
                <p className="resume-role">前端开发工程师（具备 AI 全栈开发经验）</p>
                <p className="resume-meta">本科｜近 5 年前端经验｜广州</p>
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
              {skillGroups.map((group) => (
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
                <div className="resume-entry-role">前端开发工程师｜核心业务组</div>
                <p className="resume-entry-desc">
                  负责企业级备份软件（迪备）、许可证与内部综合管理系统等核心业务模块前端，长期服务复杂流程型场景。
                </p>
                <MetricList
                  items={[
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
                      <strong>AI 业务落地：</strong>主导 <strong>scutech-licenser 客服 Agent</strong> 从需求调研到上线运营的全流程，构建基于业务数据的 RAG 诊断与问答能力，已接入客服团队日常使用；持续推进 <strong>Agent Harness Engineering</strong> 与知识库扩展。
                    </>,
                    <>
                      <strong>AI 代码规范：</strong>在前端团队建立 AI 介入开发流程的标准规范，沉淀 <strong>Skill / OpenSpec 配置化</strong> 标准（Prompt 与工程约束抽象为可复用 YAML），定义 AI 使用边界与工程化检查清单；引入 AI Code Review 预检查流程，MR 环节自动拦截低级错误，Review 效率提升 <strong>40%</strong>，设计稿落地时间从 2-3 天缩短到 <strong>4-6 小时</strong>。
                    </>,
                  ]}
                />
              </TimelineItem>
            </Timeline>
          </ResumeSection>

          <ResumeSection title="项目经历">
            <div className="resume-project-stack">
              <Card className="resume-project-card">
                <div className="resume-project-heading">
                  <h4>迪备备份恢复系统</h4>
                  <span>Vue 2/3 / 工厂模式 / Context / Proxy / WebSocket</span>
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
                  <span>React / Python / Flask / LLM API / RAG / PostgreSQL</span>
                </div>
                <p className="resume-project-desc">企业内部产品｜已接入客服团队日常使用</p>
                <MetricList
                  items={[
                    "将产品文档、审批流程说明、历史工单处理方案构建为结构化知识库，结合 RAG 技术实现精准检索与上下文增强。",
                    <>
                      打通 申请，审批，审计 等核心业务数据，使 Agent 能够基于用户实际申请表单或者工单状态进行 <strong>实时审批解释、报错智能诊断与进度追踪</strong>。
                    </>,
                    <>
                      Agent <strong>已正式接入客服团队日常工作流</strong>，覆盖 80% 以上常见咨询场景，平均响应时间从分钟级缩短至秒级，减少重复工单约 <strong>30%</strong>。
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
                  <span>Vue 3 / grid-layout-plus / WebSocket / ECharts</span>
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
                    <>
                      实现新增模块自动放置逻辑，通过 <strong>LayoutTracker</strong> 维护网格占用状态并计算最大空白可用区域，避免新增模块与已有模块冲突。
                    </>,
                    <>
                      设计面向 <strong>7×24 运行</strong> 的心跳检测与优雅降级机制：先探测服务状态再刷新数据，异常时按 <strong>递增退避策略</strong>（0/1/2/5/10/30/60s）重试，避免请求风暴并支持降级展示。
                    </>,
                  ]}
                />
              </Card>

              <Card className="resume-project-card">
                <div className="resume-project-heading">
                  <h4>AI 投资助手</h4>
                  <span>Next.js 16 / React 19 / TypeScript / Mastra / PostgreSQL</span>
                </div>
                <a className="resume-project-link" href="https://aiold.clczl.asia/" target="_blank" rel="noopener noreferrer">
                  <LinkIcon size={12} />
                  aiold.clczl.asia
                </a>
                <MetricList
                  items={[
                    <>
                      <strong>组件化设计：</strong>基于 <strong>Frontend Design Skill</strong> 与 <strong>Stitch（Google）</strong> 设计规范，对产品首页进行系统化组件化拆分，抽象 App Shell、BottomNav、Dashboard、卡片化布局等通用组件体系，覆盖桌面端与移动端断点适配，形成可复用的设计资产。
                    </>,
                    <>
                      <strong>系统开发与文档：</strong>通过 <strong>OpenSpec</strong> 分析系统架构并驱动开发流程，同步输出系统文档、接口手册与开发规范，实现设计到代码到文档的一致性闭环。
                    </>,
                    <>
                      基于 <strong>Next.js + Mastra</strong> 搭建投资分析多 Agent 系统，拆分为行情查询、技术指标、新闻摘要与投资组合诊断 Agent。
                    </>,
                    <>
                      对接实时行情、K 线形态、支撑压力位与近 7 日财经新闻等多源数据；接入 <strong>OpenClaw</strong> 工作流自动抓取公众号/大 V 观点并生成摘要。
                    </>,
                    "使用 Server-Sent Events 实现流式回答、支持推理过程可视化与答案高亮；通过 PostgreSQL 持久化用户对话与自选股数据。",
                  ]}
                />
              </Card>
            </div>
          </ResumeSection>

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
                  <strong>织趣社区</strong>：面向钩织爱好者的社区产品。{" "}
                  <a className="resume-link" href="https://zhiqu.clczl.asia/" target="_blank" rel="noopener noreferrer">
                    zhiqu.clczl.asia
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

          <ResumeSection title="个人优势">
            <MetricList
              items={[
                <>
                  <strong>前端主导能力明确：</strong>长期负责企业级中后台、复杂流程与可视化页面建设，覆盖备份、许可证、监控大屏等高复杂度业务场景。
                </>,
                <>
                  <strong>具备 AI 全栈开发与流程建设能力：</strong>能够基于 Next.js / Python / PostgreSQL 结合 Agent 与工作流完成产品原型、功能联调与上线落地；同时在前端团队建立 AI 代码开发规范（Skill / OpenSpec 配置化、AI Code Review 预检查），将 AI 从个人工具升级为团队标准流程。
                </>,
                <>
                  <strong>有真实线上作品：</strong>已上线个人作品集、AI 投资助手、体育预测平台、垂直社区等多个可访问项目。
                </>,
                <>
                  <strong>AI 信息敏感度高：</strong>善于获取 AI 前沿信息，是多个 AI 学习社区的长期用户，持续跟踪大模型、Agent、RAG 等领域的最新动态与实践。
                </>,
                <>
                  <strong>业务学习能力强：</strong>乐于学习业务和不同行业的精髓，能快速理解领域知识并转化为技术实现。
                </>,
                <>
                  <strong>学习与专业基础扎实：</strong>持有软件设计师（中级）认证，英语六级，具备日语听读能力。
                </>,
              ]}
            />
          </ResumeSection>
        </Paper>
      </div>
    </main>
  );
}
