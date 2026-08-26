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
      title: "Web 开发",
      iconKey: "frontend",
      skills: [
        "React",
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
      title: "企业 Agent 智能支持平台",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "FastAPI / LangGraph / Qdrant / GraphRAG / Java Spring AI / React 18 / Playwright",
      desc: "公司落地版已接入团队日常使用｜个人平台化完整版可离线演示（HITL 审批 / 岗位 Agent / RBAC 审计）",
      bullets: [
        {
          label: "Agent 编排",
          text: "LangGraph 六节点状态机负责意图识别、RAG 检索、工具调用、检索质量评估、查询改写、人工审批与回答组装；checkpointer 按 thread 持久化会话状态，审批恢复时从条件入口继续执行，无需重复经过前置节点。9 类业务意图优先使用关键词规则，未命中时再由 LLM 兜底，高频路径无需调用 LLM。",
        },
        {
          label: "Agent 工程骨架",
          text: "围绕 LangGraph 搭建可长期运行的 Agent 工程骨架，覆盖 Corrective RAG 自纠循环、3 类业务工具的统一错误分类与降级返回、SSE 流式输出、会话状态持久化与中断恢复，以及五类外部依赖的本地替代实现；136 项 pytest 与 10 条 Playwright E2E 覆盖关键分支，降低持续迭代的回归风险。",
        },
        {
          label: "HITL 审批硬闸门",
          text: "数据导出、发送邮件、越权动作等敏感操作在图内暂停并生成待审批载荷，人工决策后按 thread 恢复执行；审批前不会执行实际操作，避免敏感动作产生副作用。",
        },
        {
          label: "检索链路",
          text: "Qdrant 向量检索 + 关键词混合检索 → GraphRAG 关系扩展，支持 metadata 分类过滤、来源溯源与父子检索；检索证据写入审计日志，每条回答可追溯到证据来源。",
        },
        {
          label: "权限与审计",
          text: "根据登录者权限控制 5 类岗位 Agent 的可见范围与可调用能力，并对每次对话、表格操作和 Agent 运行记录完整审计信息（操作者、对象、结果、风险级别与耗时）。",
        },
        {
          label: "项目成效",
          text: "企业落地版覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%；后端提供 FastAPI 与 Spring AI 同一 OpenAPI 契约的两套实现，双后端输出一致性由 E2E 用例守护。",
        },
      ],
    },
    {
      title: "LLM Gateway 模型接入网关",
      href: "https://github.com/c524069797/llm-gateway-java",
      stack: "Java 21（虚拟线程）/ Spring Boot 3.5 / Resilience4j / Redis",
      desc: "统一模型接入层｜对业务暴露 OpenAI 兼容接口，业务侧改一个 base_url 即接入，换模型改配置不改代码",
      bullets: [
        {
          label: "路由与透明降级",
          text: "将熔断器状态、成本与近期延迟纳入评分后选择主供应商；供应商处于熔断状态时直接跳过，主选失败则沿降级链切换，客户端无需感知。SSE 请求在收到首个 chunk 后才确认供应商归属，首包前失败仍可继续降级。",
        },
        {
          label: "鉴权与双维度限流",
          text: "提供 API key 鉴权与 OpenAI 风格错误响应；使用 RPM 令牌桶和 TPM 分钟窗口实现双维度限流，并通过 Redis Lua 脚本保证「补充—判断—扣减」的原子性。限流组件提供内存与 Redis 两种实现，启动时探测 Redis 可用性后自动选择，兼顾单实例零依赖与多实例分布式场景。",
        },
        {
          label: "语义缓存",
          text: "归一化精确匹配 + 相似度匹配 + TTL / LRU 双淘汰，命中不调上游、不计费；实测命中耗时 35ms → 2.8ms。",
        },
        {
          label: "账单对账",
          text: "请求流水与账本双侧记录，通过 Redis Stream consumer group + ACK 异步投递计费事件；使用 requestId 唯一约束保证消费幂等，对账任务识别漏账与孤账后补偿重发。",
        },
        {
          label: "项目成效",
          text: "25 项 P0 测试全绿；一键脚本在零外部依赖条件下验证故障注入、熔断、降级、恢复、限流、缓存命中，以及事件丢失后的对账补偿流程。",
        },
      ],
    },
    {
      title: "BackupPilot 智能备份 Agent",
      stack: "Python / LangGraph / Pydantic v2 / MCP / SQLite / zstd / Typer",
      desc: "个人项目｜自然语言驱动的备份 / 恢复与企业运维智能体，已接入企业备份平台，纯本地可离线完整演示",
      bullets: [
        {
          label: "Agent 编排 + HITL",
          text: "LangGraph 八节点状态机（意图识别 → 规划 → 策略决策 → 执行 → 校验汇报）；恢复等破坏性操作用 interrupt() 中断等待人工确认，不确认绝不落盘——备份场景误覆盖数据是最致命事故，HITL 是硬约束。",
        },
        {
          label: "Agent 工程骨架",
          text: "优先使用 Pydantic schema 约束 LLM 结构化输出，离线场景使用规则解析兜底；将能力封装为与协议无关的工具函数，由 MCP Server 和 langchain @tool 两个薄适配层复用；恢复等破坏性操作增加 confirm 二次门控。",
        },
        {
          label: "双引擎架构",
          text: "统一 BackupEngine 抽象接口，local 自研引擎（sha256 内容寻址去重、zstd 压缩、mtime 增量与原子写）与企业备份平台 REST 适配器实现同一抽象；通过环境变量切换引擎，无需修改 Agent 状态图。基于平台数据还实现了多机巡检、失败诊断与容量预测。",
        },
        {
          label: "数据安全与恢复验证",
          text: "恢复时逐文件校验并拒绝写入损坏数据，同时做好路径穿越防护；备份仓库采用信封加密（scrypt + AES-GCM），更换口令为 O(1) 操作，无需重加密；通过 scrub 全仓健康检查与定期恢复演练，将备份可恢复性纳入日常验证。",
        },
        {
          label: "项目成效",
          text: "253 项测试全绿，E2E 通过模拟平台后端验证 HTTP 全链路；GB 级基准实测：1GB 首备吞吐 84 MB/s、去重压缩 4.8x、修改 1% 后增量备份 0.7s、加密开销约 5%；已接入企业备份平台跑通备份、恢复与巡检闭环。",
        },
      ],
    },
    {
      title: "内部综合管理系统（许可证 / 审批 / 出货全流程）",
      stack: "React / Java Spring Boot / Mastra / MySQL / Redis / RabbitMQ / Nginx",
      desc: "公司内部核心业务系统｜个人独立完成 Web 应用与后端设计、开发与部署的全栈项目",
      bullets: [
        {
          label: "全栈独立交付",
          text: "独立完成 React Web 应用、Java Spring Boot 后端、数据库设计到部署上线的完整链路，长期独立维护与迭代，支撑多条产品线与多部门日常协作。",
        },
        {
          label: "业务闭环",
          text: "覆盖许可证生成、导入校验、续期升级、套餐/功能映射与审批、出货、归档全流程，把表格 + 钉钉的记录方式收敛为系统化闭环，支撑 50+ 种许可套餐动态组合，将重复配置时间降低 80% 以上。",
        },
        {
          label: "后端设计",
          text: "围绕许可证生命周期设计审批状态机，以枚举转移表约束状态流转并通过乐观锁防止并发错乱；许可证生成以申请单号作为幂等键，结合数据库唯一索引与 Redis 防重锁避免重复生成，并使用 RSA 私钥签名防伪造。套餐配置采用 Redis Cache-Aside，审批通过后通过 RabbitMQ 解耦证书生成与通知，配合本地消息表补偿、消费幂等和每日对账保障最终一致性。",
        },
        {
          label: "权限与审计",
          text: "使用 Spring Security + JWT 实现 RBAC 角色权限校验，通过 AOP 切面统一记录操作者、对象及变更前后数据，并使用线程池异步写入审计日志，避免阻塞主流程。",
        },
        {
          label: "AI 能力载体",
          text: "基于 Mastra（TypeScript Agent 框架）实现系统内多 Agent 编排与 SSE 流式问答入口，后续在此基础上落地智能客服 Agent，并沉淀为企业 Agent 平台（见上），承接公司内部 AI 能力的业务落地。",
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
          text: "主导企业级 Vue 3 组件库与通用能力建设，沉淀 Components / Forms / Layout / Plugins 等 40+ 组件，支撑多条产品线复用。",
        },
        {
          label: "流程抽象",
          text: "主导备份/恢复向导框架设计与实现，基于工厂模式 + Context + Proxy 支撑 50+ 资源类型动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。",
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
    "有 **AI 嗅觉**，熟悉从模型选型到 Agent 上线的完整流程；**多年 Web 开发经验**，有设计审美，能将 AI 能力落地为可用、可交付、可持续迭代的产品。",
};
