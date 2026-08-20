import type { ResumeData } from "./types";
import { EMPLOYMENT_DATE, OTHER_WORKS } from "./shared";

/** AI 全栈版：投 AI Agent / AI 全栈 / 小团队一人多岗 */
export const fullstackResume: ResumeData = {
  tabLabel: "AI 全栈",
  role: "AI Agent 开发 / AI 全栈工程师",
  meta: "本科｜近 5 年业务系统研发经验｜AI Agent 落地实践",
  summary:
    "具备近 5 年业务系统研发与 AI 应用落地经验，能够围绕真实业务场景完成需求拆解、知识库建设、RAG 检索、Agent 工作流编排、前后端联调与上线验证。既有企业级复杂流程系统建设经验，也有智能客服 Agent、备份智能体、AI 助手等落地案例，能够将 AI 能力产品化为稳定、可评估、可持续迭代的业务系统。",

  skillGroups: [
    {
      title: "AI Agent 技能",
      iconKey: "agent",
      skills: [
        "Planning & Reasoning (CoT/ReAct)",
        "Memory Management (Short/Long-term)",
        "Multi-Agent Coordination",
        "Tool Calling & Action Execution",
        "LangGraph 工作流编排",
        "HITL 人工审批（Checkpointer 中断恢复）",
        "RAG 检索链路设计",
        "Hybrid Retrieval / GraphRAG",
        "Guardrail / Eval / Observability",
      ],
    },
    {
      title: "后端 / 数据技能",
      iconKey: "backend",
      skills: [
        "Java / Spring Boot",
        "Python / FastAPI",
        "Node.js",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "RabbitMQ",
        "Qdrant / sqlite-vec / pgvector",
        "GitLab CI/CD",
      ],
    },
    {
      title: "前端技能",
      iconKey: "frontend",
      skills: [
        "Next.js",
        "React",
        "TypeScript",
        "Vue 2 / Vue 3",
        "Ant Design",
        "Tailwind CSS",
        "SSE 流式交互",
        "Playwright",
      ],
    },
  ],

  experience: [
    {
      company: "广州鼎甲计算机科技有限公司",
      date: EMPLOYMENT_DATE,
      role: "Web 软件工程师（兼 AI Agent 开发）",
      desc: "负责企业级备份软件、许可证与内部综合管理系统等核心业务模块建设，同时主导 AI Agent 与 RAG 能力在真实业务中的落地，覆盖需求分析、系统设计、前后端实现与上线运营。",
      bullets: [
        {
          label: "企业 Agent 落地",
          text: "主导内部管理系统智能客服 Agent 从需求调研、知识库整理、RAG 检索、对话界面到上线运营的完整闭环，已接入售后、技术支持团队日常使用，覆盖审批解释、报错诊断、进度追踪等高频场景。",
        },
        {
          label: "RAG 工程化",
          text: "将产品文档、历史工单、Wiki、SOP 拆分为可检索知识单元，设计 metadata 过滤、来源溯源、父子检索与阈值控制，把「能回答」推进到「可追踪、可评估、可维护」。",
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
      title: "企业 Agent 智能支持平台（ArcFlow）",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "FastAPI / LangGraph / Qdrant / GraphRAG / Java Spring AI / React 18 / Playwright",
      desc: "公司落地版已接入团队日常使用｜个人平台化完整版可离线演示（HITL 审批 / 岗位 Agent / RBAC 审计）",
      bullets: [
        {
          label: "项目概述",
          text: "面向企业内部客服与技术支持场景的智能支持平台，打通申请、合同、工单、审计等核心业务数据，实现实时审批解释、报错智能诊断与进度追踪；企业落地版已接入售后、技术支持团队日常工作流。",
        },
        {
          label: "Agent 编排",
          text: "LangGraph 四节点状态机（意图识别 → RAG 检索+工具调用 → 人工审批门 → 回答组装），checkpointer 按 thread 持久化会话状态，审批恢复时条件入口跳过前置节点继续执行；9 类业务意图规则 O(1) 先行 + LLM 兜底，高频路径零 LLM 开销。",
        },
        {
          label: "HITL 审批硬闸门",
          text: "数据导出、发送邮件、越权动作等敏感操作在图内暂停并生成待审批载荷，人工决策后按 thread 恢复执行——状态机层面的硬中断，审批前动作真实不会执行。",
        },
        {
          label: "检索链路",
          text: "Qdrant 向量检索 + 关键词混合检索 → GraphRAG 关系扩展，支持 metadata 分类过滤、来源溯源与父子检索；检索证据写入审计日志，每条回答可追溯到证据来源。",
        },
        {
          label: "权限与审计",
          text: "RBAC 角色映射 Agent 调用权限，5 类岗位 Agent 按登录者权限可见可用，每次对话、表格操作与 Agent 运行全量审计（操作者/对象/结果/风险级/耗时）。",
        },
        {
          label: "工程化落地",
          text: "FastAPI 封装 RESTful API + React 18 对话工作台，Docker Compose 容器化 + Nginx 反向代理部署；LLM / Embedding / 业务系统 / 工单 / 邮件五类外部依赖均可降级本地替身，零外部依赖离线演示。",
        },
        {
          label: "项目成效",
          text: "企业落地版覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%；敏感操作 100% 经人工审批后执行，审批前零副作用。",
        },
        {
          label: "工程质量",
          text: "后端提供 FastAPI（Python）与 Spring AI（Java）同一 OpenAPI 契约的两套实现，9 条 Playwright E2E 用例守护契约、布局信息架构与双后端输出一致性，保障持续迭代不回归。",
        },
      ],
    },
    {
      title: "ArcFlow LLM Gateway 统一模型接入层",
      href: "https://github.com/c524069797/llm-gateway-java",
      stack: "Java 21（虚拟线程）/ Spring Boot 3.5 / Resilience4j / Redis",
      desc: "个人项目｜对业务暴露 OpenAI 兼容接口，换模型改配置不改代码，模拟供应商模式零外部依赖一键演示",
      bullets: [
        {
          label: "路由与透明降级",
          text: "多因子打分（熔断器状态定健康 + 成本 + 近期延迟）选主，供应商级熔断开闸零成本跳过，主选失败沿降级链切换、客户端全程无感；SSE 流式取到首个 chunk 才承诺供应商，此前失败仍可降级。",
        },
        {
          label: "鉴权与双维度限流",
          text: "API key 鉴权（401 OpenAI 风格错误），RPM 令牌桶 + TPM 分钟窗口双限流（429 + Retry-After）；Redis Lua 脚本把「补充—判断—扣减」做成单步原子操作，内存 / Redis 双实现启动探测自动降级——单实例零依赖，多实例即分布式。",
        },
        {
          label: "语义缓存",
          text: "归一化精确匹配 + 相似度匹配 + TTL / LRU 双淘汰，命中不调上游、不计费；实测命中耗时 35ms → 2.8ms。",
        },
        {
          label: "账单对账",
          text: "请求流水与账本双侧记录，计费事件经 Redis Stream consumer group + ACK 异步投递，requestId 唯一约束保证消费幂等，对账任务抓漏账 / 孤账并补偿重发。",
        },
        {
          label: "项目成效",
          text: "25 项 P0 测试全绿；一键脚本零外部依赖自动演示「故障注入 → 熔断 → 降级 → 恢复 → 限流 → 缓存命中 → 丢事件对账归平」完整故事线。",
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
          label: "双引擎架构",
          text: "统一 BackupEngine 抽象接口，local 自研引擎（sha256 内容寻址去重 + zstd 压缩 + mtime 增量 + 原子写）与企业备份平台 REST 适配器（Bearer 认证，创建任务 → 轮询到终态）实现同一抽象；一个环境变量切换引擎，状态图一行不改。",
        },
        {
          label: "MCP 工具暴露",
          text: "MCP Server（Claude Desktop 可直接接入）与 langchain @tool 双 adapter 同源；破坏性 restore 带 confirm 二次门控，LLM / 外部客户端也无法误覆盖数据。",
        },
        {
          label: "企业运维 Agent",
          text: "基于平台数据实现多机巡检、失败诊断、容量预测、策略合规检查与四合一运维报告；ops 意图复用既有状态图零改动接入，命令行与自然语言双入口。",
        },
        {
          label: "回测强化与诊断 RAG",
          text: "scrub 全仓健康检查（损坏注入必检出并定位受影响恢复点）+ 恢复演练例行化（run-due 挂接定期 drill）+ 特殊文件边界矩阵逐字节比对，把「备份可恢复」变成例行机制；12 篇运维 SOP 知识库 + BM25 混合检索与置信度控制，失败诊断升级为「规则兜底 + RAG 增强」。",
        },
        {
          label: "数据安全",
          text: "恢复逐文件校验拒写坏数据、路径穿越防护；备份仓库信封加密（scrypt + AES-GCM + HMAC 对象名防指纹泄露），改口令 O(1) 无需重加密。",
        },
        {
          label: "项目成效",
          text: "253 项测试全绿，E2E 拉起模拟平台后端走 HTTP 全链路；GB 级基准实测：1GB 首备 84 MB/s、去重压缩 4.8x、修改 1% 后增量 0.7s、加密开销约 5%；接入企业备份平台时定位并解决内网代理劫持 502（私网地址默认直连）。",
        },
      ],
    },
    {
      title: "内部综合管理系统（许可证 / 审批 / 出货全流程）",
      stack: "React / Java Spring Boot / Mastra / MySQL / Redis / RabbitMQ / Nginx",
      desc: "公司内部核心业务系统｜个人独立完成前后端设计、开发与部署的全栈项目",
      bullets: [
        {
          label: "全栈独立交付",
          text: "独立完成 React 前端、Java Spring Boot 后端、数据库设计到部署上线的完整链路，长期独立维护与迭代，支撑多条产品线与多部门日常协作。",
        },
        {
          label: "业务闭环",
          text: "覆盖许可证生成、导入校验、续期升级、套餐/功能映射与审批、出货、归档全流程，把表格 + 钉钉的记录方式收敛为系统化闭环，支撑 50+ 种许可套餐动态组合，将重复配置时间降低 80% 以上。",
        },
        {
          label: "后端设计",
          text: "围绕许可证生命周期设计审批状态机（枚举转移表 + 乐观锁防并发错乱），许可证生成以申请单号做幂等键（唯一索引 + Redis 防重锁）并经 RSA 私钥签名防伪造；套餐配置走 Redis Cache-Aside，审批通过经 RabbitMQ 事件解耦证书生成与通知（本地消息表补偿 + 消费幂等），出货与生成记录每日定时对账兜底一致性。",
        },
        {
          label: "权限与审计",
          text: "Spring Security + JWT 实现 RBAC 角色权限校验，AOP 切面统一记录操作审计（操作者/对象/前后变更），线程池异步落库不阻塞主流程。",
        },
        {
          label: "AI 能力载体",
          text: "基于 Mastra（TypeScript Agent 框架）实现系统内多 Agent 编排与 SSE 流式问答入口，后续落地智能客服 Agent 并平台化为 ArcFlow（见上），成为公司内部 AI 能力落地的业务载体。",
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
          text: "围绕任务监控、长列表和日志展示持续做性能优化，结合增量更新、虚拟滚动和页面拆分，显著改善复杂页面的交互体验与响应效率。",
        },
      ],
    },
  ],

  otherWorks: OTHER_WORKS,

  advantages: [
    {
      label: "有已上线的企业级 Agent 落地经验",
      text: "从 0 到 1 主导客服 Agent 上线运营，覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%；并将该经验平台化为完整的企业 Agent 系统（LangGraph + RAG + HITL 审批 + RBAC + 审计）。",
    },
    {
      label: "AI 全栈闭环能力",
      text: "React/Next.js 前端 + Java/Spring Boot 与 FastAPI/Python 双栈服务 + MySQL/PostgreSQL/向量库，能独立完成「数据接入 → Agent 编排 → 工具调用 → 前端交付 → Playwright 验收」的完整链路，不停留在模型调用层。",
    },
    {
      label: "复杂业务系统架构底座",
      text: "长期负责企业级备份系统、许可证系统等复杂流程型产品，主导 50+ 资源类型统一流程抽象与可编辑监控大屏，具备把碎片化业务收敛成可扩展架构的能力。",
    },
    {
      label: "持续关注 AI 前沿并快速转化实践",
      text: "长期关注大模型、Agent、RAG 与 AI 开发工具的新进展，是多个 AI 交流社区的深度参与者；能够将新方向快速转化为可验证方案，并沉淀为可落地的功能与方法。",
    },
    {
      label: "学习主动性强，重视实践验证",
      text: "面对新方向不止停留在概念理解，而是倾向于主动搭建 Demo、验证可行性并结合真实业务持续迭代，形成从学习、实践到复用的方法沉淀。",
    },
  ],
};
