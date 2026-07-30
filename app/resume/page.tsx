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
  SiGitlab,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
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
      { label: "Java / Spring" },
      { label: "PostgreSQL", icon: <SiPostgresql size={12} /> },
      { label: "Redis", icon: <SiRedis size={12} /> },
      { label: "Qdrant / sqlite-vec / pgvector" },
      { label: "GitLab CI/CD", icon: <SiGitlab size={12} /> },
    ],
  },
  {
    title: "AI Agent 技能",
    icon: <BrainCircuit size={14} />,
    skills: [
      { label: "Planning & Reasoning (CoT/ReAct)" },
      { label: "Memory Management (Short/Long-term)" },
      { label: "Multi-Agent Coordination" },
      { label: "Tool Calling & Action Execution" },
      { label: "LangGraph 工作流编排" },
      { label: "HITL 人工审批（Checkpointer 中断恢复）" },
      { label: "RAG 检索链路设计" },
      { label: "Hybrid Retrieval / GraphRAG" },
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
      a.download = `陈子龙-AI全栈工程师-简历-${new Date().getFullYear()}.pdf`;
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
                {isGenerating ? "生成中..." : "下载简历"}
              </Button>
            </div>
          </div>
        </div>

        <Paper className="resume-paper" size="a4">
          <header className="resume-header">
            <div className="resume-header-main">
              <div>
                <h1 className="resume-name">陈子龙</h1>
                <p className="resume-role">AI Agent 开发 / AI 全栈工程师</p>
                <p className="resume-meta">本科｜近 5 年业务系统研发经验｜AI Agent 落地实践</p>
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
              具备近 5 年业务系统研发与 AI 应用落地经验，能够围绕真实业务场景完成需求拆解、知识库建设、RAG 检索、Agent 工作流编排、前后端联调与上线验证。既有企业级复杂流程系统建设经验，也有智能客服 Agent、备份智能体、AI 助手等落地案例，能够将 AI 能力产品化为稳定、可评估、可持续迭代的业务系统。
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
                <div className="resume-entry-role">Web 软件工程师（兼 AI Agent 开发）</div>
                <p className="resume-entry-desc">
                  负责企业级备份软件、许可证与内部综合管理系统等核心业务模块建设，同时主导 AI Agent 与 RAG 能力在真实业务中的落地，覆盖需求分析、系统设计、前后端实现与上线运营。
                </p>
                <MetricList
                  items={[
                    <>
                      <strong>企业 Agent 落地：</strong>主导内部管理系统智能客服 Agent 从需求调研、知识库整理、RAG 检索、对话界面到上线运营的完整闭环，已接入售后、技术支持团队日常使用，覆盖审批解释、报错诊断、进度追踪等高频场景。
                    </>,
                    <>
                      <strong>RAG 工程化：</strong>将产品文档、历史工单、Wiki、SOP 拆分为可检索知识单元，设计 metadata 过滤、来源溯源、父子检索与阈值控制，把“能回答”推进到“可追踪、可评估、可维护”。
                    </>,
                    <>
                      <strong>复杂业务系统：</strong>长期负责企业级复杂流程系统建设，覆盖备份恢复、许可证管理、审批与监控等场景，具备将复杂业务规则抽象为可复用能力的经验。
                    </>,
                    <>
                      <strong>AI 产品开发：</strong>独立建设 AI 投资助手，完成多 Agent 编排、行情/新闻/指标数据接入、SSE 流式回答、推理过程展示与用户数据持久化。
                    </>,
                    <>
                      <strong>AI 开发规范：</strong>在团队内沉淀 <strong>Skill / OpenSpec 配置化</strong> 标准与 AI Code Review 预检查流程，减少低级问题和重复沟通。
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
                  <h4>
                    <a href="https://github.com/c524069797/enterprise-agent-platform" target="_blank" rel="noopener noreferrer">
                      企业 Agent 智能支持平台（ArcFlow）
                    </a>
                  </h4>
                  <span>FastAPI / LangGraph / Qdrant / GraphRAG / React 18 / Playwright</span>
                </div>
                <p className="resume-project-desc">公司落地版已接入团队日常使用｜个人平台化完整版可离线演示（HITL 审批 / 岗位 Agent / RBAC 审计）</p>
                <a className="resume-project-link" href="https://github.com/c524069797/enterprise-agent-platform" target="_blank" rel="noopener noreferrer">
                  <Github size={12} />
                  github.com/c524069797/enterprise-agent-platform
                </a>
                <MetricList
                  items={[
                    <>
                      <strong>项目概述：</strong>面向企业内部客服与技术支持场景的智能支持平台，打通申请、合同、工单、审计等核心业务数据，实现实时审批解释、报错智能诊断与进度追踪；企业落地版已接入售后、技术支持团队日常工作流。
                    </>,
                    <>
                      <strong>Agent 编排：</strong>LangGraph 四节点状态机（意图识别 → RAG 检索+工具调用 → 人工审批门 → 回答组装），checkpointer 按 thread 持久化会话状态，审批恢复时条件入口跳过前置节点继续执行；9 类业务意图规则 O(1) 先行 + LLM 兜底，高频路径零 LLM 开销。
                    </>,
                    <>
                      <strong>HITL 审批硬闸门：</strong>数据导出、发送邮件、越权动作等敏感操作在图内暂停并生成待审批载荷，人工决策后按 thread 恢复执行——状态机层面的硬中断，审批前动作真实不会执行。
                    </>,
                    <>
                      <strong>检索链路：</strong>Qdrant 向量检索 + 关键词混合检索 → GraphRAG 关系扩展，支持 metadata 分类过滤、来源溯源与父子检索；检索证据写入审计日志，每条回答可追溯到证据来源。
                    </>,
                    <>
                      <strong>权限与审计：</strong>RBAC 角色派生 agent:* 能力范围，5 类岗位 Agent 按登录者权限可见可用，每次对话、表格操作与 Agent 运行全量审计（操作者/对象/结果/风险级/耗时）。
                    </>,
                    <>
                      <strong>工程化落地：</strong>FastAPI 封装 RESTful API + React 18 对话工作台，Docker Compose 容器化 + Nginx 反向代理部署；LLM / Embedding / 业务系统 / 工单 / 邮件五类外部依赖均可降级本地替身，零外部依赖离线演示。
                    </>,
                    <>
                      <strong>项目成效：</strong>企业落地版覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%；敏感操作 100% 经人工审批后执行，审批前零副作用。
                    </>,
                    <>
                      <strong>工程质量：</strong>9 条 Playwright E2E 用例守护 OpenAPI 契约、布局信息架构与 Python / Java 双后端输出一致性，保障持续迭代不回归。
                    </>,
                  ]}
                />
              </Card>

              <Card className="resume-project-card">
                <div className="resume-project-heading">
                  <h4>BackupPilot 智能备份 Agent</h4>
                  <span>Python / LangGraph / Pydantic v2 / MCP / SQLite / zstd / Typer</span>
                </div>
                <p className="resume-project-desc">个人项目｜自然语言驱动的备份 / 恢复与企业运维智能体，已接入企业备份平台，纯本地可离线完整演示</p>
                <MetricList
                  items={[
                    <>
                      <strong>Agent 编排 + HITL：</strong>LangGraph 八节点状态机（意图识别 → 规划 → 策略决策 → 执行 → 校验汇报）；恢复等破坏性操作用 interrupt() 中断等待人工确认，不确认绝不落盘——备份场景误覆盖数据是最致命事故，HITL 是硬约束。
                    </>,
                    <>
                      <strong>双引擎架构：</strong>统一 BackupEngine 抽象接口，local 自研引擎（sha256 内容寻址去重 + zstd 压缩 + mtime 增量 + 原子写）与企业备份平台 REST 适配器（Bearer 认证，创建任务 → 轮询到终态）实现同一抽象；一个环境变量切换引擎，状态图一行不改。
                    </>,
                    <>
                      <strong>MCP 工具暴露：</strong>MCP Server（Claude Desktop 可直接接入）与 langchain @tool 双 adapter 同源；破坏性 restore 带 confirm 二次门控，LLM / 外部客户端也无法误覆盖数据。
                    </>,
                    <>
                      <strong>企业运维 Agent：</strong>基于平台数据实现多机巡检、失败诊断、容量预测、策略合规检查与四合一运维报告；ops 意图复用既有状态图零改动接入，命令行与自然语言双入口。
                    </>,
                    <>
                      <strong>回测强化与诊断 RAG：</strong>scrub 全仓健康检查（损坏注入必检出并定位受影响恢复点）+ 恢复演练例行化（run-due 挂接定期 drill）+ 特殊文件边界矩阵逐字节比对，把「备份可恢复」变成例行机制；12 篇运维 SOP 知识库 + BM25 混合检索与置信度控制，失败诊断升级为「规则兜底 + RAG 增强」。
                    </>,
                    <>
                      <strong>数据安全：</strong>恢复逐文件校验拒写坏数据、路径穿越防护；备份仓库信封加密（scrypt + AES-GCM + HMAC 对象名防指纹泄露），改口令 O(1) 无需重加密。
                    </>,
                    <>
                      <strong>项目成效：</strong>253 项测试全绿（端到端真实启动模拟平台后端走 HTTP 全链路）；GB 级基准实测：1GB 首备 84 MB/s、去重压缩 4.8x、修改 1% 后增量 0.7s、加密开销约 5%；解决内网代理劫持 502 等真实部署问题。
                    </>,
                  ]}
                />
              </Card>

              <Card className="resume-project-card">
                <div className="resume-project-heading">
                  <h4>
                    <a href="https://aiold.clczl.asia/" target="_blank" rel="noopener noreferrer">
                      AI 投资助手
                    </a>
                  </h4>
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
                      <strong>多 Agent 编排：</strong>拆分行情、指标、新闻与组合诊断等多个分析角色，通过工作流路由、上下文组装、工具调用与结果汇总实现复杂问题分步分析和结构化输出。
                    </>,
                    <>
                      <strong>数据与交互闭环：</strong>打通实时行情、技术形态、财经新闻与外部观点摘要，支持流式回答、推理过程展示、重点结论高亮和会话持久化。
                    </>,
                    <>
                      <strong>质量保障：</strong>补齐 Agent 工具调用与向量检索测试（46 → 83 用例），覆盖多 Agent 编排链路与检索能力，保障持续迭代不回归。
                    </>,
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
                  <strong>
                    <a className="resume-title-link" href="https://www.clczl.asia" target="_blank" rel="noopener noreferrer">
                      个人网站 / 博客系统
                    </a>
                  </strong>
                  ：Next.js 16 全栈站点，含博客、AI 问答与 React Three Fiber 3D 交互首屏。{" "}
                  <a className="resume-link" href="https://www.clczl.asia" target="_blank" rel="noopener noreferrer">
                    clczl.asia
                  </a>
                </span>
              </p>
              <p>
                <span className="resume-work-dot" />
                <span>
                  <strong>
                    <a className="resume-title-link" href="https://nba.clczl.asia/" target="_blank" rel="noopener noreferrer">
                      SportOracle 体育预测平台
                    </a>
                  </strong>
                  ：AI 驱动的体育预测产品。{" "}
                  <a className="resume-link" href="https://nba.clczl.asia/" target="_blank" rel="noopener noreferrer">
                    nba.clczl.asia
                  </a>
                </span>
              </p>
              <p>
                <span className="resume-work-dot" />
                <span>
                  <strong>
                    <a className="resume-title-link" href="https://github.com/c524069797/sports-hub-extension" target="_blank" rel="noopener noreferrer">
                      Sports Hub 浏览器插件
                    </a>
                  </strong>
                  ：聚合 NBA、足球、电竞赛事信息的 Chrome Extension。{" "}
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
                  <strong>持续关注 AI 前沿并快速转化实践：</strong>长期关注大模型、Agent、RAG 与 AI 开发工具的新进展，是多个 AI 交流社区的深度参与者；能够将新方向快速转化为可验证方案，并沉淀为可落地的功能与方法。
                </>,
                <>
                  <strong>技术广度完整，具备 AI Agent 与全栈经验：</strong>覆盖前端、后端、数据库、发布部署、测试质量、移动端与小程序等实践经验，能够从产品、研发到交付全链路理解并推进业务系统落地。
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
