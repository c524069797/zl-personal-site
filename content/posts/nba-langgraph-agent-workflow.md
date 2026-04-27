---
title: LangGraph 工作流实战：构建 NBA 赛前分析 Agent
date: 2026-03-15
description: 基于 NBA 赛前分析 Agent 项目，详解 LangGraph 工作流设计、多角色 Prompt 工程、ESPN 数据接入和前后端分离架构。
category: ai
tags: [LangGraph, Agent, LLM, NBA, FastAPI, Next.js, AI工作流]
slug: nba-langgraph-agent-workflow
---

# LangGraph 工作流实战：构建 NBA 赛前分析 Agent

体育赛事分析是一个典型的"多步骤、多角色、需要外部数据"的场景，非常适合用 Agent 工作流来解决。这篇文章基于 NBA 赛前分析 Agent 项目，梳理 LangGraph 工作流设计、多角色 Prompt 工程、ESPN 真实数据接入，以及前后端分离的完整架构。

## 项目定位

这是一个用于演示体育赛事赛前分析工作流的 Agent Demo。核心目标是：给定一场 NBA 比赛，自动收集数据、多角度分析、生成专业赛前报告。

技术栈：LangGraph + FastAPI + Next.js

## 系统架构

```text
浏览器页面
  -> Next.js 前端（3000）
    -> Next.js Route Handler /api/*
      -> FastAPI 后端（8015）
        -> LangGraph Agent 工作流
          -> ESPN NBA API（真实数据）
          -> OpenAI 兼容 LLM（分析推理）
```

前后端分离的原因：
- LangGraph 工作流在 Python 生态中更成熟
- FastAPI 提供清晰的 REST 接口
- Next.js 负责页面渲染和 API 代理

## LangGraph 工作流设计

### 核心节点

| 节点 | 职责 |
|------|------|
| `load_fixture` | 加载比赛基础信息 |
| `analyze_team_form` | 分析两队近期战绩和状态 |
| `analyze_injuries` | 分析伤病情况和影响 |
| `analyze_matchup` | | 分析历史交锋和对位 |
| `bullish_analyst` | 乐观视角：主队为什么能赢 |
| `cautious_analyst` | 谨慎视角：风险和客队机会 |
| `synthesize_report` | 综合多视角生成报告 |
| `review_report` | 质量审查，决定是否通过 |
| `finalize` | 输出最终报告 |

### 工作流结构

```text
START
  -> load_fixture
  -> analyze_team_form
  -> analyze_injuries
  -> analyze_matchup
  -> bullish_analyst（乐观分析）
  -> cautious_analyst（谨慎分析）
  -> synthesize_report（报告生成）
  -> review_report（质量审查）
       -> 通过 -> finalize
       -> 不通过 -> synthesize_report（最多重试 1 次）
  -> END
```

设计思路：
- 前四个节点是信息收集，顺序执行
- `bullish_analyst` 和 `cautious_analyst` 并行执行，提供对立视角
- `synthesize_report` 合并多视角输出
- `review_report` 做质量把关，不通过可以打回重写

## 多角色 Prompt 工程

每个分析节点对应一个独立角色，Prompt 设计遵循几个原则：

1. **一个节点一个角色**：乐观分析师只负责找主队赢的理由
2. **一个节点只做一件事**：不跨职责，降低复杂度
3. **结构化输入输出**：用 JSON 或 Markdown 表格传递数据
4. **不允许凭空编造**：所有结论必须有数据支撑
5. **Reviewer 独立于 Writer**：审查者和写作者不是同一个 Prompt

### 乐观分析师 Prompt 示例

```
你是一位专业的 NBA 赛前分析师，专注于从主队有利角度分析比赛。

输入数据：
- 主队近期战绩
- 主队主客场表现
- 关键球员状态
- 伤病恢复情况

输出要求：
1. 列出主队赢球的 3-5 个核心理由
2. 每个理由必须有具体数据支撑
3. 给出主队获胜概率估计
4. 不允许编造不存在的数据
```

### 谨慎分析师 Prompt 示例

```
你是一位风险控制专家，专注于识别比赛中的不确定因素和客队机会。

输入数据：同上

输出要求：
1. 列出可能让主队失利的 3-5 个风险点
2. 分析客队的反击机会
3. 给出比赛悬念程度评估
4. 识别任何数据中的异常或矛盾
```

### Report Writer Prompt

```
你是一位资深体育撰稿人，需要综合多位分析师的观点生成一份专业赛前报告。

输入：
- 乐观分析师观点
- 谨慎分析师观点
- 基础比赛数据

输出结构：
1. 比赛概览
2. 主队有利路径
3. 风险与客队机会
4. 关键胜负手
5. 最终预测
```

## 数据源设计

### 双数据源并存

| 数据源 | 用途 | 稳定性 |
|--------|------|--------|
| Mock 数据 | 演示稳定、Prompt 测试 | 高 |
| ESPN 真实数据 | 实际分析、生产环境 | 依赖网络 |

### ESPN API 接入

已接入的 ESPN 公共 NBA API 能力：
- 未来几天赛程
- 单场比赛 summary
- 球队战绩
- 最近五场表现
- 基础统计
- 伤病报告
- 交锋历史
- 主要球员 leader 信息

数据归一化：ESPN 返回的原始数据需要经过一层映射，转换为统一的分析格式。

### 当前限制

- 高阶进攻/防守效率不是 ESPN 直接提供的 advanced stats
- 分析更多集中在基础统计映射和赛前摘要归一化
- 适合 demo 展示，还不是专业分析平台级数据

## 后端架构

### 核心文件

| 文件 | 职责 |
|------|------|
| `app/agent.py` | LangGraph 主工作流定义 |
| `app/main.py` | FastAPI 接口入口 |
| `app/espn_api.py` | ESPN NBA 数据接入层 |
| `app/llm.py` | OpenAI 兼容模型接入 |
| `app/schemas.py` | 请求与响应结构 |
| `app/cli.py` | CLI 命令行入口 |

### 运行模式

**Rule-based 模式**
- 不需要 API Key
- 直接按规则生成结果
- 保证 demo 随时可运行

**LLM 模式**
- 需要配置环境变量：
  ```bash
  export OPENAI_API_KEY=...
  export OPENAI_MODEL=gpt-4.1-mini
  export OPENAI_BASE_URL=https://兼容网关/v1
  ```
- 影响节点：`bullish_analyst`、`cautious_analyst`、`synthesize_report`

### API 接口

```http
GET /api/matches        # 获取比赛列表
POST /api/analyze       # 执行赛前分析
```

## 前端架构

### 核心文件

| 文件 | 职责 |
|------|------|
| `frontend/app/page.tsx` | 主页面 |
| `frontend/app/components/page-client.tsx` | 客户端交互逻辑 |
| `frontend/app/components/report-section.tsx` | 报告渲染组件 |
| `frontend/app/api/matches/route.ts` | 代理后端比赛列表 |
| `frontend/app/api/analyze/route.ts` | 代理后端分析接口 |

### 前端能力

- 选择比赛（样例 + ESPN 真实数据）
- 选择输出风格（简洁 / 专业 / 口语化）
- 输入补充关注点
- 展示最终报告（ReactMarkdown 渲染）
- 展示主队有利路径
- 展示风险与客队机会
- 展示关键胜负手
- 展示风险标记

### UI 设计要点

早期遇到深色背景阅读体验差的问题，调整后：
- 浅色主阅读区
- 深色正文文字
- 卡片式布局
- 更适合长时间阅读

## 启动方式

### 后端

```bash
cd /Users/chenzilong/nba-langgraph-agent-demo
uv sync --extra dev
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8015
```

### 前端

```bash
cd /Users/chenzilong/nba-langgraph-agent-demo/frontend
cp .env.local.example .env.local
npm install
npm run dev -- --hostname 127.0.0.1
```

访问地址：
- 前端：`http://127.0.0.1:3000`
- 后端：`http://127.0.0.1:8015`

## 一句话总结

这个项目是一个 **LangGraph 工作流 + FastAPI 后端 + Next.js 前端 + mock/ESPN 双数据源** 的 NBA 赛前分析 Agent Demo。LangGraph 的价值在于把"赛前分析"这个复杂任务拆成可编排、可审查、可重试的工作流，每个节点只负责一件事，最终通过多角色视角合成一份专业报告。
