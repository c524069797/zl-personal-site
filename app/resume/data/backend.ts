import type { ResumeData } from "./types";
import { EMPLOYMENT_DATE, OTHER_WORKS } from "./shared";

/** AI Agent 后端版：投 Agent 后端 / LLM 应用后端 / Java 后端（AI 方向） */
export const backendResume: ResumeData = {
  tabLabel: "AI 后端",
  role: "AI Agent 后端工程师（Java · Python 双栈）",
  meta: "本科｜近 5 年企业级业务系统 + AI 应用后端经验",
  summary:
    "具备近 5 年企业级业务系统研发与 AI 应用后端落地经验，Java 与 Python 双栈均有实践。审批状态机、幂等设计、缓存一致性、MQ 事件解耦、定时对账、分布式限流与熔断降级等后端核心问题，均有真实系统或项目实践支撑；在 Agent 开发中重点关注状态持久化、人工审批、权限边界与失败降级，致力于构建可长期运行、可审计、可维护的系统。",

  skillGroups: [
    {
      title: "后端",
      iconKey: "backend",
      skills: [
        "Java",
        "Spring Boot",
        "Spring Security",
        "Spring AI",
        "MyBatis-Plus",
        "Python",
        "FastAPI",
        "MySQL",
        "PostgreSQL",
        "Redis",
        "RabbitMQ",
        "Docker",
        "Nginx",
        "状态机",
        "幂等设计",
        "缓存一致性",
        "限流熔断",
        "RBAC 权限",
        "审计日志",
      ],
    },
    {
      title: "AI 技能",
      iconKey: "agent",
      skills: [
        "LangGraph",
        "HITL 人工审批",
        "Tool Calling",
        "MCP",
        "RAG",
        "Hybrid Retrieval",
        "GraphRAG",
        "Qdrant",
        "pgvector",
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
        "OpenAPI",
        "JUnit",
        "Pytest",
        "CI/CD",
      ],
    },
  ],

  experience: [
    {
      company: "广州鼎甲计算机科技有限公司",
      date: EMPLOYMENT_DATE,
      role: "Web 软件工程师（业务后端 + AI Agent 开发）",
      desc: "负责企业级备份软件、许可证与内部综合管理系统等核心业务模块的后端设计与实现，后期主导 AI Agent 与 RAG 能力在真实业务中的落地。",
      bullets: [
        {
          label: "AI Agent 业务落地",
          text: "主导内部管理系统智能客服 Agent 从需求调研到上线运营的全流程，构建基于业务数据的 RAG 诊断与问答能力，已接入售后、技术支持团队日常使用；持续完善工具调用、检索阈值、引用溯源、评估测试集与日志观测，并将历史工单、Wiki、SOP 系统化批量入库至向量库。",
        },
        {
          label: "业务系统后端设计",
          text: "主导许可证生成、导入校验、续期升级、套餐/功能映射等流程设计与实现；围绕许可证生命周期设计审批状态机，以枚举转移表约束状态流转并通过乐观锁控制并发更新；以申请单号作为幂等键，结合数据库唯一索引与 Redis 防重锁实现幂等生成，支撑 50+ 种许可套餐动态组合，将重复配置时间降低 80% 以上。",
        },
        {
          label: "消息驱动与一致性",
          text: "审批通过后通过 RabbitMQ 解耦证书生成与钉钉、邮件通知，配合本地消息表补偿与消费幂等保障消息可靠处理；套餐配置采用 Redis Cache-Aside，降低热点查询压力；出货与生成记录通过每日定时对账校验最终一致性。",
        },
        {
          label: "权限与审计",
          text: "使用 Spring Security + JWT 实现 RBAC 角色权限校验，通过 AOP 切面统一记录操作者、对象及变更前后数据，并使用线程池异步写入审计日志。",
        },
        {
          label: "C++ 引擎侧协作",
          text: "参与备份引擎 C++ 侧问题排查与功能开发，涉及任务状态上报、错误码与日志梳理、文件扫描过滤规则等内容；理解引擎多线程任务队列与 RAII 资源管理，能够从 Web 层、服务与引擎协同定位备份/恢复链路问题。",
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
      title: "鼎甲迪备备份恢复系统",
      stack: "Vue 3 / TypeScript / WebSocket / C++",
      desc: "企业级备份软件核心业务系统，负责业务流程抽象、实时链路与引擎侧协作",
      bullets: [
        {
          label: "流程抽象",
          text: "主导备份/恢复向导框架设计与实现，工厂模式 + Context + Proxy 支持资源类型动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。",
        },
        {
          label: "实时链路",
          text: "WebSocket 推送结合缓冲队列与重连机制，保障任务状态秒级同步与长时间稳定运行；配合增量更新与分段加载优化万级任务列表。",
        },
        {
          label: "引擎侧排查",
          text: "参与备份引擎 C++ 侧问题排查与小功能开发，理解多线程任务队列与 RAII 资源管理，能跨 Web 层、服务与引擎定位完整链路问题。",
        },
      ],
    },
    {
      title: "内部管理系统（业务管理与智能客服）",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "React / Java Spring Boot / Python FastAPI / LangGraph / RAG / MySQL / Redis / RabbitMQ / Qdrant",
      desc: "公司内部系统覆盖许可证、审批与售后支持，智能客服已接入日常工作；Agent 审批、GraphRAG 与双后端为个人扩展实现",
      bullets: [
        {
          label: "状态机与消息处理",
          text: "使用审批状态机与乐观锁管理许可证流程，以申请单号、数据库唯一索引和 Redis 锁处理生成幂等；RabbitMQ 解耦证书生成与通知，结合本地消息表、消费幂等及每日对账处理异常记录，重复配置时间降低 80% 以上。",
        },
        {
          label: "业务数据与知识检索",
          text: "通过主系统只读聚合 API 提供申请、审批及工单状态；将历史工单、Wiki 和 SOP 入库，结合 RAG 检索提供审批解释、报错诊断与进度查询，并记录回答来源。",
        },
        {
          label: "Agent 能力扩展（个人项目）",
          text: "基于 LangGraph 编排检索与工具调用，通过 checkpointer 保存会话；在个人扩展平台中实现人工审批、RBAC、GraphRAG 与审计，FastAPI 和 Spring AI 后端遵循同一 API 契约。",
        },
        {
          label: "落地成效",
          text: "内部智能客服已接入售后、技术支持团队日常工作，覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，重复工单减少约 30%。",
        },
      ],
    },
    {
      title: "BackupPilot 智能备份助手",
      stack: "Python / LangGraph / Pydantic v2 / MCP / httpx / SQLite / zstd / Typer",
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
  ],

  otherWorks: OTHER_WORKS,

  advantage:
    "参与智能客服 Agent 上线和企业业务系统开发，实践了 RAG 检索、审批状态机、消息处理与接口联调。",
};
