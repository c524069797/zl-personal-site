import type { ResumeData } from "./types";
import { EMPLOYMENT_DATE, OTHER_WORKS } from "./shared";

/** AI 全栈版：投 AI Agent / AI 全栈 / 小团队一人多岗 */
export const fullstackResume: ResumeData = {
  tabLabel: "AI 全栈",
  role: "AI Agent 开发 / AI 全栈工程师",
  meta: "本科｜近 5 年 Web 开发经验｜AI Agent 落地实践",
  summary:
    "具备近 5 年 Web 开发与 AI 应用落地经验，能够围绕真实业务场景完成需求拆解、知识库建设、RAG 检索、Agent 工作流编排、Web 应用与后端服务联调及上线验证。长期参与企业级复杂流程系统建设，也有智能客服 Agent、备份智能体、AI 助手等落地案例，能够将 AI 能力落地为稳定、可评估、可持续迭代的业务系统。",

  skillGroups: [
    {
      title: "AI 技能",
      iconKey: "agent",
      skills: [
        "LangGraph",
        "Multi-Agent 编排",
        "Tool Calling",
        "HITL 人工审批",
        "RAG",
        "Hybrid Retrieval",
        "GraphRAG",
        "MCP",
      ],
    },
    {
      title: "后端",
      iconKey: "backend",
      skills: [
        "Java",
        "Spring Boot",
        "Python",
        "FastAPI",
        "Node.js",
        "MySQL",
        "PostgreSQL",
        "Redis",
        "RabbitMQ",
        "Qdrant",
        "Docker",
      ],
    },
    {
      title: "Web 与跨端开发",
      iconKey: "frontend",
      skills: [
        "React",
        "Flutter",
        "Electron",
        "Taro",
        "Next.js",
        "TypeScript",
        "Vue 3",
        "Ant Design",
        "Tailwind CSS",
        "Playwright",
      ],
    },
  ],

  experience: [
    {
      company: "广州鼎甲计算机科技有限公司",
      date: EMPLOYMENT_DATE,
      role: "Web 软件工程师（兼 AI Agent 开发）",
      desc: "负责企业级备份软件、许可证与内部综合管理系统等核心业务模块建设，同时主导 AI Agent 与 RAG 能力在真实业务中的落地，覆盖需求分析、系统设计、Web 应用与服务实现及上线运营。",
      bullets: [
        {
          label: "企业 Agent 落地",
          text: "主导内部管理系统智能客服 Agent 从需求调研、知识库整理、RAG 检索、对话产品设计到上线运营的完整闭环，已接入售后、技术支持团队日常使用，覆盖审批解释、报错诊断、进度追踪等高频场景。",
        },
        {
          label: "RAG 工程化",
          text: "将产品文档、历史工单、Wiki、SOP 拆分为可检索知识单元，设计 metadata 过滤、来源溯源、父子检索与阈值控制，完善回答链路的追踪、评估与维护能力。",
        },
        {
          label: "复杂业务系统",
          text: "长期负责企业级复杂流程系统建设，覆盖备份恢复、许可证管理、审批与监控等场景，具备将复杂业务规则抽象为可复用能力的经验。",
        },
        {
          label: "AI 产品开发",
          text: "在内部管理系统中基于 Mastra（TypeScript Agent 框架）实现多 Agent 编排、SSE 流式回答、推理过程展示与会话数据持久化。",
        },
        {
          label: "AI 开发规范",
          text: "在团队内沉淀 Skill / OpenSpec 配置化标准与 AI Code Review 预检查流程，减少低级问题和重复沟通。",
        },
      ],
    },
  ],

  projects: [
    {
      title: "内部综合管理系统（业务管理与智能客服）",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "React / Java Spring Boot / Python FastAPI / LangGraph / RAG / MySQL / Redis / RabbitMQ / Qdrant",
      desc: "公司内部系统覆盖许可证、审批与售后支持，智能客服已接入日常工作；Agent 审批、GraphRAG 与双后端为个人扩展实现",
      bullets: [
        {
          label: "业务流程与后端设计",
          text: "实现许可证生成、导入校验、续期升级及套餐配置；使用审批状态机和乐观锁管理状态流转，以申请单号、数据库唯一索引与 Redis 锁处理生成幂等。审批通过后通过 RabbitMQ 投递证书生成与通知事件，结合本地消息表、消费幂等及每日对账处理异常记录，重复配置时间降低 80% 以上。",
        },
        {
          label: "智能客服接入",
          text: "主系统通过只读聚合 API 提供申请、审批和工单状态；将产品文档、历史工单、Wiki 与 SOP 入库，结合 RAG 检索提供审批解释、报错诊断与进度查询，支持引用来源展示和转人工。",
        },
        {
          label: "Agent 能力扩展（个人项目）",
          text: "基于 LangGraph 编排意图识别、检索与工具调用，使用 checkpointer 保存会话；在个人扩展平台中实现人工审批、岗位权限、GraphRAG 检索及审计，并以同一 API 契约接入 FastAPI 与 Spring AI 后端。",
        },
        {
          label: "落地成效",
          text: "内部智能客服已接入售后、技术支持团队日常工作，覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，重复工单减少约 30%。",
        },
      ],
    },
    {
      title: "liveshop-ai 直播电商 AI 助播平台",
      stack: "Java Spring Boot / React / Flutter / Redis / RabbitMQ / RAG",
      desc: "个人练手项目｜同一后端服务支持主播中控台与观众 Web、Flutter App",
      bullets: [
        {
          label: "交易与直播间交互",
          text: "使用 Redis Lua 扣减秒杀库存，RabbitMQ 异步落单并释放超时未支付订单；通过 STOMP 推送弹幕，React 实现主播中控台和观众页面，Flutter 实现观众 App。",
        },
        {
          label: "AI 助播",
          text: "将弹幕攒批做意图分类；商品资料经本地向量化后用于 RAG 问答，通过 SSE 输出商品回答与讲品话术。",
        },
      ],
    },
    {
      title: "LLM Gateway 模型接入网关",
      href: "https://github.com/c524069797/llm-gateway-java",
      stack: "Java 21（虚拟线程）/ Spring Boot 3.5 / Resilience4j / Redis",
      desc: "统一模型接入层｜对业务暴露 OpenAI 兼容接口，业务侧改一个 base_url 即接入，通过配置切换模型",
      bullets: [
        {
          label: "模型路由与缓存",
          text: "根据熔断状态、成本和近期延迟选择供应商，请求失败时沿降级链切换；SSE 请求以首个 chunk 确认供应商，首包前失败继续降级。语义缓存结合归一化精确匹配与相似度匹配，使用 TTL / LRU 淘汰，命中后直接返回缓存响应。",
        },
        {
          label: "鉴权与限流",
          text: "通过 API key 鉴权，使用 RPM 令牌桶与 TPM 分钟窗口限流；Redis Lua 脚本原子执行额度补充、判断和扣减。限流组件提供内存与 Redis 实现，启动时根据 Redis 可用性选择。",
        },
        {
          label: "计费与对账",
          text: "请求流水与账本分别记录，通过 Redis Stream consumer group 与 ACK 异步投递计费事件；以 requestId 唯一约束实现消费幂等，对账任务识别漏账与孤账后补偿重发。",
        },
        {
          label: "性能与验证",
          text: "缓存命中耗时从 35ms 降至 2.8ms，降低 92%；通过自动化脚本验证熔断、降级、恢复、限流、缓存命中与计费事件补偿。",
        },
      ],
    },
    {
      title: "BackupPilot 智能备份 Agent",
      stack: "Python / LangGraph / Pydantic v2 / MCP / SQLite / zstd / Typer",
      desc: "个人项目｜自然语言驱动的备份 / 恢复与企业运维智能体，已接入企业备份平台，支持本地离线运行",
      bullets: [
        {
          label: "Agent 编排与工具接入",
          text: "基于 LangGraph 编排意图识别、规划、执行与结果校验，使用 Pydantic schema 约束 LLM 结构化输出，离线场景使用规则解析。工具函数通过 MCP Server 和 langchain @tool 适配复用；恢复操作调用 interrupt() 暂停，人工确认后恢复执行，工具层通过 confirm 参数校验确认状态。",
        },
        {
          label: "备份引擎与平台接入",
          text: "通过 BackupEngine 接口接入本地引擎与企业备份平台，使用环境变量切换实现。本地引擎采用 sha256 内容寻址去重、zstd 压缩、mtime 增量与原子写；平台适配器通过 REST 创建任务并轮询结果，结合平台数据实现多机巡检、失败诊断与容量预测。",
        },
        {
          label: "恢复校验与诊断",
          text: "恢复时逐文件校验内容完整性与目标路径，仓库采用信封加密，并通过 scrub 检查与恢复演练验证数据。运维 SOP 结合 BM25 检索与规则匹配生成诊断结果，低置信度时返回静态字典结果。",
        },
        {
          label: "性能与验证",
          text: "1GB 数据首备吞吐 84 MB/s、去重压缩 4.8x，修改 1% 数据后增量备份耗时 0.7s，加密开销约 5%；通过平台后端的 HTTP 接口验证备份、恢复与巡检流程。",
        },
      ],
    },

    {
      title: "迪备备份恢复系统",
      stack: "Vue 3 / TypeScript / WebSocket / C++",
      desc: "企业级备份软件核心业务系统，长期负责备份恢复流程、通用能力沉淀与复杂业务交互建设。",
      bullets: [
        {
          label: "组件能力",
          text: "主导企业级 Vue 3 组件库建设，沉淀 Components / Forms / Layout / Plugins 等模块，供多条产品线复用。",
        },
        {
          label: "流程抽象",
          text: "主导备份/恢复向导框架设计与实现，基于工厂模式 + Context + Proxy 支持资源类型动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。",
        },
        {
          label: "C++ 服务协作",
          text: "参与备份引擎 C++ 侧问题排查与小功能开发（任务状态上报、错误码与日志梳理、文件扫描过滤规则），理解引擎多线程任务队列与 RAII 资源管理，能从引擎视角定位备份/恢复链路问题。",
        },
        {
          label: "性能优化",
          text: "围绕任务监控、长列表和日志展示持续做性能优化，结合增量更新、分段加载和页面拆分，显著改善复杂页面的交互体验与响应效率。",
        },
      ],
    },
  ],

  otherWorks: OTHER_WORKS,

  advantage:
    "参与智能客服 Agent 上线，具备 RAG 检索、业务数据接入和 Web 产品交付经验；长期负责企业业务系统的流程设计、开发与维护。",
};
