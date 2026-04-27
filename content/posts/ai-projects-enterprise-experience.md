---
title: "从客服Agent到AI工作流：企业级AI项目落地经验"
summary: "记录我参与和主导的三个AI项目落地经验：客服Agent RAG系统、DeerFlow AI工作流平台、Page Agent页面智能化工具。涵盖架构设计、AI接入开发、以及从前端工程到AI应用的技术成长路径。"
date: "2026-04-25"
tags: ["AI Agent", "LangGraph", "企业落地", "前端开发", "RAG"]
category: "tech"
---

## 一、项目一：客服Agent RAG系统

### 项目背景

在企业级数据保护产品团队中，我负责系统级界面的前端开发，并深度参与了AI接入开发。核心项目是将大语言模型能力集成到客服系统中，构建基于RAG的智能客服Agent。

### 系统架构

采用LangGraph显式状态机架构，把Agent的思考从Prompt黑盒搬到代码白盒：

```
用户提问 -> 意图识别（规则+LLM兜底）-> RAG检索+工具调用 -> 答案组装 -> 返回
```

**关键代码结构**：

```python
class AgentState(TypedDict):
    message: str
    intent: str
    kb_chunks: list
    tool_result: dict
    answer: str

builder = StateGraph(AgentState)
builder.add_node("_intent", node_intent)
builder.add_node("retrieve", node_retrieve)
builder.add_node("compose", node_compose)

builder.set_entry_point("_intent")
builder.add_conditional_edges("_intent", router, {
    "retrieve": "retrieve",
    END: END,
})
builder.add_edge("retrieve", "compose")
builder.add_edge("compose", END)
graph = builder.compile()
```

- **意图识别**：规则层关键词命中直接返回（覆盖80%常见情况）；LLM层兜底边缘case
- **RAG检索**：支持Plain / Hybrid / GraphRAG三种策略，环境变量一行切换
- **工具调用**：按意图分派，如explain_approval、trace_request、diagnose_error
- **答案组装**：固定四段式Prompt（结论/证据/原因/建议）

### 关键技术决策

**Embedding选型**：默认OpenAI text-embedding-3-small（1536维）。维度一旦确定就不改，改则全量重建。

**向量库选型**：sqlite-vec。轻量、无需额外服务。

**检索策略**：Hybrid RAG（BM25+jieba分词 + 向量召回 + BGE Reranker）在客服场景综合最优。

### 踩坑精选

1. **第三方Plugin无REST API**：Redmine Questions plugin未实现REST端点，API Key无效。决策：跳过Questions类抓取，32条seed已覆盖主要知识面。

2. **LLM返回JSON被markdown包裹**：GPT-4o-mini经常忽略Prompt约束。兜底解析：

```python
def safe_parse_json(text):
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        m = re.search(r"(\[[\s\S]*\]|\{[\s\S]*\})", text)
        if m:
            return json.loads(m.group(1))
    return []
```

3. **LangGraph State字段遗漏**：TypedDict声明不代表运行时存在。解决：初始化时填齐所有字段，哪怕是空值。

---

## 二、项目二：DeerFlow AI工作流平台

### 项目定位

DeerFlow 2.0是面向复杂任务的super agent harness / agent runtime。核心能力：

- Lead agent + sub-agents协作
- Sandbox执行环境
- Skills注入 + MCP扩展
- 长期记忆
- Web/文件/Bash/图像等工具链
- IM渠道接入
- 前后端完整界面

### 与同类工具的对比

| 维度 | DeerFlow | Superpowers | OpenSpec | DDD |
|---|---|---|---|---|
| 本质定位 | Agent运行底座 | 编码代理工作流插件 | Spec-driven协作框架 | 领域建模方法论 |
| 关注重点 | 执行、调度、工具、记忆、UI | 编码流程纪律、TDD | 需求/规格/设计沉淀 | 业务边界、领域语言 |
| 自带运行时 | 强 | 弱 | 弱 | 否 |

一句话：它们解决的问题层面不同。DeerFlow偏运行时系统，Superpowers偏编码工作流，OpenSpec偏规格协作，DDD偏业务建模。

### 架构拆解

- **LangGraph Server**：承载主agent图和线程执行
- **Gateway API**：models、memory、skills、MCP等周边能力
- **Frontend**：Next.js界面
- **Nginx**：统一入口

### 扩展点

- **Skills**：把领域经验注入系统提示词或执行流程
- **MCP**：接入外部系统能力
- **Community tools**：Tavily、Jina、Firecrawl等
- **IM channels**：Telegram/Slack/Feishu接入

---

## 三、项目三：Page Agent页面智能化

### 项目简介

阿里巴巴开源的页面级Agent工具，让AI理解和操作网页界面。已在本地完成部署验证。

### 核心价值

Page Agent把AI能看懂网页这件事产品化了。相比传统RPA（机械执行预设流程），它能根据自然语言指令自主理解页面结构、定位元素、执行操作。对前端开发者来说，可以把重复的页面测试、数据录入、巡检等工作交给Agent完成。

---

## 四、AI Agent开发学习路径（五步走）

### 第一步：Python基础

- Python编程环境、基本语法、异步编程
- 目标：能看懂和编写基础代码

### 第二步：模型调用

- API对接（OpenAI、Claude、国内中转站）
- 模型选型（gpt-4o-mini性价比最高）
- 私有化部署（Ollama、vLLM）
- 目标：先把模型接起来

### 第三步：Agent核心

- 设计模式：ReAct（推理+行动）、Reflection（反思修正）
- 开发框架：LangChain（单智能体）、LangGraph（复杂工作流+多智能体）
- 目标：掌握Agent核心实现

### 第四步：平台化开发

- Dify：开源LLMOps平台，快速搭建
- Coze（扣子）：字节低代码Agent平台
- 目标：提升商业落地速度

### 第五步：知识库增强

- RAG：检索增强生成
- 向量数据库：Qdrant、Milvus、sqlite-vec
- 知识图谱：GraphRAG、Neo4j
- 目标：提升Agent对企业知识的利用能力

---

## 五、实战成长四阶段

### 第一阶段：初阶（10天）

- 理解Agent架构、调教Prompt、代码衔接业务
- 目标：做出基础可用的Agent应用

### 第二阶段：高阶（30天）

- 实战RAG系统、搭建ChatPDF等应用
- 掌握Hybrid Retrieval、Rerank、GraphRAG
- 目标：进入知识增强和复杂应用开发

### 第三阶段：训练（30天）

- 模型微调（LoRA、QLoRA）
- Transformer结构理解
- 目标：理解模型能力扩展与底层机制

### 第四阶段：商业（20天）

- 算力选型、私有化部署、合规备案、项目闭环
- 目标：完成从技术到商业落地的闭环

---

## 六、AI赋能学习的方法论

借助AI工具快速掌握新技术，将前沿技术转化为解决实际问题的能力。

核心做法：

- **先规划清楚，再和AI对话**。自己review确保方向不出错。
- **先形成task list和验收标准，再让AI按规划执行**。

具体做法上，用sub-agents和collab两个特性：

- sub-agents：分3-5个topic，每个topic做测试任务
- collab：让AI自己跑、自己给自己加油，形成自动化工作流

---

## 七、经验总结

1. **外部依赖启动时验证**：API Key、模型文件、扩展加载等
2. **LLM输出永远不可信**：写容错解析、做后校验
3. **评估集是金标准**：自动化结果一定要用评估集打分
4. **踩坑文档本身是最值钱的交付物之一**，比代码更难复刻
5. **技术不仅是工具，更是推动创新的核心动力**
