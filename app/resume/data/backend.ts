import type { ResumeData } from "./types";
import { EMPLOYMENT_DATE, OTHER_WORKS } from "./shared";

/** AI Agent 后端版：投 Agent 后端 / LLM 应用后端 / Java 后端（AI 方向） */
export const backendResume: ResumeData = {
  tabLabel: "AI 后端",
  role: "AI Agent 后端工程师（Java · Python 双栈）",
  meta: "本科｜近 5 年企业级业务系统 + AI 应用后端经验",
  summary:
    "近 5 年企业级业务系统研发与 AI 应用后端落地经验，Java 与 Python 双栈均有生产实践。后端业务母题（审批状态机、幂等设计、缓存一致性、MQ 事件解耦、定时对账、分布式限流、熔断降级）全部有真实系统支撑，并将这套工程化视角带入 Agent 开发——关注状态持久化、审批闸门、权限边界与失败降级，目标是能长期运行、可审计、可维护的系统。",

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
      title: "前端",
      iconKey: "frontend",
      skills: [
        "React",
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
          text: "主导内部管理系统智能客服 Agent 从需求调研到上线运营的全流程，构建基于业务数据的 RAG 诊断与问答能力，已接入售后、技术支持团队日常使用；持续推进工具调用、检索阈值、引用溯源、评估测试集与日志观测等工程治理能力，并将历史工单 / Wiki / SOP 系统化批量入库至向量库。",
        },
        {
          label: "业务系统后端设计",
          text: "主导许可证生成、导入校验、续期升级、套餐/功能映射等全流程设计与实现，围绕许可证生命周期设计审批状态机（枚举转移表 + 乐观锁防并发错乱），以申请单号做幂等键（唯一索引 + Redis 防重锁），支撑 50+ 种许可套餐动态组合，重复配置时间降低 80% 以上。",
        },
        {
          label: "消息驱动与一致性",
          text: "审批通过经 RabbitMQ 事件解耦证书生成与钉钉/邮件通知（本地消息表补偿 + 消费幂等），出货与生成记录每日定时对账兜底一致性；套餐配置走 Redis Cache-Aside 缓存降低热点查询压力。",
        },
        {
          label: "权限与审计",
          text: "Spring Security + JWT 实现 RBAC 角色权限校验，AOP 切面统一记录操作审计（操作者/对象/前后变更），线程池异步落库不阻塞主流程，保障多角色协作下的数据一致性与可追溯。",
        },
        {
          label: "C++ 引擎侧协作",
          text: "参与备份引擎 C++ 侧问题排查与小功能开发（任务状态上报、错误码与日志梳理、文件扫描过滤规则），理解引擎多线程任务队列与 RAII 资源管理，能从引擎视角定位备份/恢复链路问题。",
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
      title: "ArcFlow LLM Gateway 模型接入网关",
      href: "https://github.com/c524069797/llm-gateway-java",
      stack: "Java 21（虚拟线程）/ Spring Boot 3.5 / Resilience4j / Redis",
      desc: "ArcFlow 平台的模型接入层｜对业务暴露 OpenAI 兼容接口，业务侧改一个 base_url 即接入，换模型改配置不改代码",
      bullets: [
        {
          label: "路由打分与熔断透明降级",
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
          label: "账单对账（最终一致 + 对账兜底）",
          text: "请求流水与账本双侧记录，计费事件经 Redis Stream consumer group + ACK 异步投递，requestId 唯一约束保证消费幂等，对账任务抓漏账 / 孤账并补偿重发。",
        },
        {
          label: "项目成效",
          text: "25 项 P0 测试全绿；一键脚本零外部依赖自动演示「故障注入 → 熔断 → 降级 → 恢复 → 限流 → 缓存命中 → 丢事件对账归平」完整故事线，故障注入与混沌演练能力内建。",
        },
      ],
    },
    {
      title: "企业 Agent 智能支持平台（ArcFlow）",
      href: "https://github.com/c524069797/enterprise-agent-platform",
      stack: "FastAPI / LangGraph / Qdrant / GraphRAG / Java 21 / Spring Boot 3 / Spring AI（双后端）",
      desc: "公司落地版已接入团队日常使用｜个人平台化完整版可离线演示",
      bullets: [
        {
          label: "Agent 编排",
          text: "LangGraph 六节点状态机（意图识别 → RAG 检索 + 工具调用 → 检索质量评估 → 低置信查询改写 → 人工审批门 → 回答组装），checkpointer 按 thread 持久化会话状态，审批恢复时条件入口直接跳过前置节点继续执行；9 类业务意图关键词规则先行、LLM 兜底，高频路径零 LLM 开销。",
        },
        {
          label: "Agent Harness 建设",
          text: "Agent 骨架层的主要工作量在编排之外：Corrective RAG 自纠循环、3 类业务工具统一错误分类与降级返回、SSE 流式输出、会话状态持久化与中断恢复、五类外部依赖本地替身；136 项 pytest + 10 条 Playwright E2E 覆盖各分支，保证换模型、换后端、断依赖都不改状态图。",
        },
        {
          label: "HITL 审批硬闸门",
          text: "数据导出、发送邮件、越权动作等敏感操作在图内暂停并生成待审批载荷，人工决策后按 thread 恢复执行——状态机层面的硬中断，审批前动作真实不会执行。",
        },
        {
          label: "检索链路与权限审计",
          text: "Qdrant 向量检索 + 关键词混合检索 → GraphRAG 关系扩展，支持 metadata 过滤、来源溯源与父子检索；RBAC 角色映射 Agent 调用权限，对话、表格操作与 Agent 运行全量审计，检索证据一并入库可追溯。",
        },
        {
          label: "双后端同契约与成效",
          text: "后端提供 FastAPI（Python）与 Spring AI（Java）同一 OpenAPI 契约的两套实现，输出一致性由 E2E 用例守护；企业落地版覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%。",
        },
      ],
    },
    {
      title: "内部综合管理系统（许可证 / 审批 / 出货全流程）",
      stack: "Java Spring Boot / MySQL / Redis / RabbitMQ / Mastra / React / Nginx",
      desc: "公司内部核心业务系统｜个人独立完成前后端设计、开发与部署的全栈项目",
      bullets: [
        {
          label: "业务闭环",
          text: "覆盖许可证生成、导入校验、续期升级、套餐/功能映射与审批、出货、归档全流程，把表格 + 钉钉的记录方式收敛为系统化闭环，支撑 50+ 种许可套餐动态组合，将重复配置时间降低 80% 以上。",
        },
        {
          label: "状态机与幂等",
          text: "围绕许可证生命周期设计审批状态机（枚举转移表 + 乐观锁防并发错乱）；许可证生成以申请单号做幂等键（数据库唯一索引 + Redis 防重锁），许可证内容经 RSA 私钥签名防伪造。",
        },
        {
          label: "缓存与消息",
          text: "套餐配置走 Redis Cache-Aside 缓存；审批通过经 RabbitMQ 事件解耦证书生成与钉钉/邮件通知（本地消息表补偿 + 消费幂等），出货与生成记录每日定时对账兜底一致性。",
        },
        {
          label: "权限与审计",
          text: "Spring Security + JWT 实现 RBAC 角色权限校验，AOP 切面统一记录操作审计（操作者/对象/前后变更），线程池异步落库不阻塞主流程。",
        },
        {
          label: "AI 能力载体",
          text: "主系统暴露受控只读聚合 API（服务间认证）向 Python Agent 服务开放业务数据，并基于 Mastra（TypeScript Agent 框架）实现系统内多 Agent 编排、SSE 流式问答与会话持久化入口；后续在此之上落地智能客服 Agent 并平台化为 ArcFlow。",
        },
      ],
    },
    {
      title: "BackupPilot 智能备份 Agent",
      stack: "Python / LangGraph / Pydantic v2 / MCP / httpx / SQLite / zstd / Typer",
      desc: "个人项目｜自然语言驱动的备份 / 恢复与企业运维智能体，已接入企业备份平台，纯本地可离线完整演示",
      bullets: [
        {
          label: "Agent 编排 + HITL",
          text: "LangGraph 八节点状态机（意图识别 → 规划 → 策略决策 → 执行 → 校验汇报）；恢复等破坏性操作用 interrupt() 中断等待人工确认，不确认绝不落盘——备份场景误覆盖数据是最致命事故，HITL 是硬约束。",
        },
        {
          label: "Agent Harness 建设",
          text: "LLM 结构化输出（Pydantic schema 约束）优先、规则解析兜底保证离线可用；能力封装成协议无关工具函数，由 MCP Server 与 langchain @tool 两个薄 adapter 同源暴露，换接入方式不改业务逻辑；破坏性操作 confirm 二次门控。",
        },
        {
          label: "双引擎架构（换引擎不换大脑）",
          text: "统一 BackupEngine 接口，local 自研引擎（sha256 内容寻址去重 + zstd 压缩 + mtime 增量 + 原子写）与企业备份平台适配器实现同一抽象；适配层把接口方法翻译成平台 REST 调用（Bearer 认证，备份走「创建任务 → 轮询到终态」异步任务模型），一个环境变量切换引擎，状态图一行不改。",
        },
        {
          label: "数据安全",
          text: "恢复逐文件校验拒写坏数据、路径穿越防护、SQLite 并发安全；备份仓库信封加密（scrypt 派生密钥 + AES-GCM + HMAC 对象名防指纹泄露），改口令 O(1) 无需重加密。",
        },
        {
          label: "项目成效",
          text: "253 项测试全绿，E2E 拉起模拟平台后端走 HTTP 全链路；GB 级基准实测：1GB 首备 84 MB/s、去重压缩 4.8x、修改 1% 后增量 0.7s、加密开销约 5%；已接入企业备份平台跑通备份 / 恢复 / 巡检闭环。",
        },
      ],
    },
    {
      title: "迪备备份恢复系统",
      stack: "Vue 3 / TypeScript / WebSocket / C++",
      desc: "企业级备份软件核心业务系统，负责业务流程抽象、实时链路与引擎侧协作",
      bullets: [
        {
          label: "流程抽象",
          text: "主导备份/恢复向导框架设计与实现，工厂模式 + Context + Proxy 支撑 50+ 资源类型动态注入与跨步骤状态共享，将新增资源类型的开发周期从 2 周缩短到 2 天。",
        },
        {
          label: "实时链路",
          text: "WebSocket 推送结合缓冲队列与重连机制，保障任务状态秒级同步与长时间稳定运行；配合增量更新与虚拟滚动优化万级任务列表。",
        },
        {
          label: "引擎侧排查",
          text: "参与备份引擎 C++ 侧问题排查与小功能开发，理解多线程任务队列与 RAII 资源管理，能跨前后端与引擎定位完整链路问题。",
        },
      ],
    },
  ],

  otherWorks: OTHER_WORKS,

  advantages: [
    {
      label: "AI 信息敏感，想法直接做成 MVP",
      text: "长期跟踪大模型、Agent 与 AI 工具链的进展，习惯第一时间判断新方向能不能落到业务上；判断完不停在讨论，直接搭 MVP 跑通验证——ArcFlow、BackupPilot、LLM Gateway 都是这么从一个判断做成可运行、可演示的系统。",
    },
    {
      label: "有已上线的企业级 Agent 后端落地经验",
      text: "从 0 到 1 主导客服 Agent 上线运营，覆盖 80% 以上高频咨询场景，平均响应从分钟级降至秒级，减少重复工单约 30%；并将该经验平台化为完整企业 Agent 系统（LangGraph 状态机 + RAG + HITL 审批 + RBAC + 全量审计）。",
    },
    {
      label: "后端业务母题全部有真实落地",
      text: "审批状态机、幂等设计、缓存一致性、MQ 事件解耦与消费幂等、定时对账兜底、分布式限流、熔断降级——不是背概念，每一条都能指到具体系统和代码。",
    },
    {
      label: "Java + Python 双栈可查证",
      text: "LLM Gateway 是 Java 21 + Spring Boot 3 独立服务（GitHub 可查），ArcFlow 提供 FastAPI 与 Spring AI 同契约双后端实现，两条技术栈都有可运行代码和测试。",
    },
    {
      label: "工程化视角做 AI",
      text: "关注状态持久化、审批闸门、权限边界、失败降级、评估与审计，目标是能长期运行、可审计、可维护的系统，不做 prompt 玩具。",
    },
    {
      label: "能独立交付全链路",
      text: "具备前端生产经验，可独立完成「数据接入 → Agent 编排 → 工具调用 → 接口设计 → 前端交付 → E2E 验收」，小团队即插即用。",
    },
  ],
};
