---
title: "RAG系统开发的十二个踩坑实录与LangGraph架构实践"
summary: "整理从零搭建企业级客服Agent RAG系统过程中踩过的12个坑，涵盖第三方API限制、Python环境、中文NLP、LLM输出容错、向量库设计等。同时分享LangGraph显式状态机架构的设计思路，以及三种RAG方案的选型决策树。"
date: "2026-04-20"
tags: ["RAG", "LangGraph", "LLM", "向量检索", "Agent"]
category: "tech"
---

## 一、RAG不是向量TopK那么简单

很多人把RAG理解为"文档切块做embedding，查询时取TopK"。demo够用，生产环境会暴露很多问题。

更稳的标准链路：

```
Query规范化 → Metadata filter → 稀疏召回(BM25) → 稠密召回(向量)
  → 合并去重 → Rerank精排 → Chunk expansion → TopN进模型
```

**核心原则**：稀疏召回保关键词，稠密召回保语义，reranker决定最终顺序。

纯向量TopK在实体词、时间词、数字编号、政策条款、专有名词场景容易翻车。

---

## 二、十二个踩坑实录

### 坑1：第三方Plugin没有REST API

Redmine原生REST API只覆盖Issues/Wiki/Projects等核心模块。Questions是第三方plugin，作者没实现REST端点。带API Key直接返回403，HTML页面强制要求session cookie。

**解法**：先curl测目标端点；404或403就认清现实，别浪费时间找"怎么带API Key"。

### 坑2：macOS自带SQLite不支持loadable extensions

Python的sqlite3模块链接系统SQLite，Apple编译时禁用了loadable-extension。

**解法**：两行代码替换：

```python
import pysqlite3, sys
sys.modules["sqlite3"] = pysqlite3
```

### 坑3：OPENAI_API_KEY未配置时报错位置很诡异

错误发生在查询时而不是启动时，用户半天搞不清问题在哪。

**解法**：启动时验证，快速失败：

```python
assert os.getenv("OPENAI_API_KEY"), "请先 export OPENAI_API_KEY"
```

### 坑4：rank_bm25对中文必须先分词

BM25Okapi默认用`split()`切token，中文没有空格，整个文档变成一个巨大token，分数永远是0。

**解法**：

```python
import jieba
corpus_tokens = [list(jieba.cut(d)) for d in corpus]
bm25 = BM25Okapi(corpus_tokens)
```

### 坑5：BM25Okapi对象pickle失败

内部有numpy array，某些pickle协议+numpy版本组合下兼容有问题。

**解法**：只pickle `corpus_tokens`，加载时重建BM25Okapi。Pickle是脆弱的，能重建就别pickle整个对象。

### 坑6：python-louvain包名和import名不一致

- PyPI包名：`python-louvain`
- Python模块名：`community`

**解法**：`pip install python-louvain`，代码里`from community import community_louvain`。

### 坑7：LLM返回JSON被markdown代码块包裹

GPT-4o-mini/DeepSeek经常忽略Prompt里"不要markdown"的要求。

**解法**：写兜底解析：

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

**经验**：永远假设LLM会输出脏JSON。或者用OpenAI的`response_format={"type": "json_object"}`。

### 坑8：sqlite-vec虚拟表的维度写死

vec0 schema固定维度，1024维向量插到1536维表里直接报错。

**解法**：提前确定维度锁死schema。换模型必须`DROP TABLE`+重建+重新ingest。

**经验**：Embedding维度是架构级决策，早定晚不改。

### 坑9：GraphRAG社区聚类质量不稳定

同样32条chunks，两次跑社区数量从5个变成9个。LLM实体抽取有随机性，Louvain对初始化敏感。

**解法**：固定LLM `temperature=0`；Gleaning多跑几次取并集；合并小于3个nodes的小社区。

### 坑10：中文URL编码问题

Requests库默认行为在不同版本+服务器组合下不一致。

**解法**：显式编码：

```python
from urllib.parse import quote
slug = quote("重置超级管理员密码", safe="")
```

### 坑11：LangGraph State字段遗漏导致节点报错

TypedDict声明了字段不代表运行时存在。访问`state["kb_chunks"]`时如果没有会KeyError。

**解法**：初始化时填齐所有字段：

```python
await graph.ainvoke({
    "message": req.message,
    "context": {},
    "intent": "",
    "kb_chunks": [],
    "tool_result": {},
    "answer": "",
    "history": [],
})
```

### 坑12：Sentence-Transformers首次下载慢

Reranker模型约550MB，首次下载慢。jieba首次import加载dict也慢，属于正常，提前下载即可。

---

## 三、LangGraph架构：把Agent的思考从Prompt搬到代码

### LangGraph vs LangChain AgentExecutor

| 特性 | LangChain AgentExecutor | LangGraph |
|---|---|---|
| 控制流 | 黑盒ReAct loop | 显式StateGraph |
| 可视化 | 弱 | 强（能画状态机图） |
| 调试 | 难 | 每节点可breakpoint |
| 自定义流程 | 硬 | 简单（加节点+edges） |
| 回滚 | 不支持 | 支持checkpoint |

### 核心概念

**State**：Python TypedDict，在图中流转。关键字段用`Annotated[list, operator.add]`告诉LangGraph这个字段累加合并而不是覆盖。

**Node**：`State → dict`的纯函数。只返回要修改的字段，LangGraph自动合并。

**Edge**：固定边`add_edge(A, B)`；条件边`add_conditional_edges(A, router, {...})`根据state决定下一站。

### 极简架构示例

```python
class AgentState(TypedDict):
    message: str
    intent: str
    kb_chunks: list
    answer: str

builder = StateGraph(AgentState)
builder.add_node("_intent", node_intent)      # 意图识别
builder.add_node("retrieve", node_retrieve)   # RAG检索+工具调用
builder.add_node("compose", node_compose)     # 组装答案

builder.set_entry_point("_intent")
builder.add_conditional_edges("_intent", router, {
    "retrieve": "retrieve",
    END: END,
})
builder.add_edge("retrieve", "compose")
builder.add_edge("compose", END)

graph = builder.compile()
```

3节点+1条件路由，覆盖完整Agent生命周期。

### 意图识别的两层策略

- **规则层**（快）：关键词命中直接返回，覆盖80%常见情况
- **LLM层**（慢，精准）：规则未中时调LLM分类，兜底边缘case

### 答案组装的固定四段式Prompt

结论 / 证据 / 原因 / 建议。强制结构化输出，避免LLM自由发挥。

### Retriever策略切换

通过环境变量一行切换：

```bash
RETRIEVER_STRATEGY=plain    # baseline
RETRIEVER_STRATEGY=hybrid   # 优化
RETRIEVER_STRATEGY=graph    # 跨文档查询
```

优雅之处：懒import（模块没装时不崩）、失败自动fallback到plain、同一套Agent代码评估三种RAG。

---

## 四、三种RAG方案选型

| 维度 | Plain RAG | Hybrid RAG | GraphRAG |
|---|---|---|---|
| 原理 | 向量相似度单路 | BM25+向量+RRF+Rerank | LLM抽实体/关系+社区发现+summary |
| 查询延迟 | 100-200ms | 150-250ms | 300-600ms |
| 单点事实召回 | 较好 | 很好 | 一般 |
| 跨文档推理 | 差 | 一般 | 很好 |
| 全局摘要 | 不支持 | 不支持 | 很好 |
| 实现复杂度 | 低（50行） | 中（200行） | 高（700行） |

**选型决策树**：

- 单点事实+数据<100k → **Plain RAG**
- 单点事实+数据>100k+有专名/错误码 → **Hybrid RAG**
- 跨文档关联推理+数据>1000 chunks → **GraphRAG**
- 全局性概括 → **GraphRAG Global Search**（唯一选择）
- 混合型查询 → **Hybrid RAG兜底+关键场景上GraphRAG**

**工程箴言**：不要premature optimization。Plain打底，瓶颈出现再升级。

---

## 五、Prompt / Context / Harness的区分

- **Prompt Engineering**：研究怎么把一次任务说清楚
- **Context Engineering**：研究给模型什么信息，怎么组织上下文
- **Harness Engineering**：研究怎么给模型搭一个可控、可验证、可恢复、可持续优化的运行环境

一句话：**Prompt是一次输入，Context是信息供给，Harness是整套控制系统。**

### 怎么降低幻觉

"请不要胡说"不能解决幻觉。有效治理分三层：

1. **限制生成边界**：明确只能基于给定材料作答，不知道就说不知道
2. **增强证据供给**：RAG、BM25、向量召回、重排、来源引用
3. **做结果校验**：结构校验、来源校验、自检、人工兜底

幻觉不是单一Prompt问题，而是证据不足、召回不准、约束不强、后处理缺失共同导致的工程问题。

---

## 六、经验汇总

1. **外部依赖启动时验证**：API Key、模型文件、扩展加载等
2. **LLM输出永远不可信**：写容错解析、做后校验
3. **维度、包名、URL编码这些细节**都能吞掉几小时
4. **评估集是金标准**：自动化结果一定要用评估集打分
5. **踩坑文档本身是最值钱的交付物之一**，比代码更难复刻
