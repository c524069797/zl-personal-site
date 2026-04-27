---
title: Web3 预测市场实战：Polymarket 接口与智能下注策略
date: 2026-03-01
description: 基于 Sport Oracle 项目实战，梳理 Polymarket 预测市场交易接口、Gamma API 数据层、智能下注策略和 Web3 钱包集成方案。
category: web3
tags: [Web3, Polymarket, 预测市场, 区块链, 智能合约, NBA, 体育预测]
slug: web3-prediction-market-polymarket
---

# Web3 预测市场实战：Polymarket 接口与智能下注策略

Web3 预测市场把"预测"这件事从纯娱乐变成了真金白银的博弈。这篇文章基于 Sport Oracle 项目的实战经验，梳理 Polymarket 预测市场的核心概念、API 对接、智能下注策略，以及前端如何集成 Web3 钱包完成链上交易。

## 什么是预测市场

预测市场的核心逻辑是：让市场参与者用真金白银对事件结果下注，市场价格反映的是"集体智慧"对事件发生概率的估计。

相比传统博彩，预测市场的特点：
- 价格由供需决定，更接近真实概率
- 可以随时买卖持仓，不是一锤子买卖
- 结果由客观事实结算，争议少

Polymarket 是目前全球最大的去中心化预测市场之一，基于 Polygon 链运行。

## 系统架构

Sport Oracle 项目的整体架构：

```text
前端（Next.js + Mantine）
  -> /api/* API Routes
    -> NBA 数据服务（FastAPI，ssh81 部署）
    -> AI 分析（Grok API）
    -> Polymarket 交易接口
      -> Gamma API（事件与市场数据）
      -> CLOB API（订单簿与交易）
      -> Polygon 链上合约（结算）
```

各模块职责：
- **前端**：页面展示、用户交互、钱包连接、API 统一代理
- **NBA 数据服务**：赛程、球队、球员、战绩等基础数据
- **AI 分析**：基于比赛数据生成胜负和大小分预测
- **Polymarket 接口**：市场数据获取、下单、持仓管理

## Polymarket 双 API 体系

Polymarket 提供了两套核心 API，分工明确：

### Gamma API：事件与市场数据

负责提供"有什么市场在交易"：
- 事件列表和详情
- 市场（Market）和结果（Outcome）定义
- 分类、标签、到期时间

典型用法：

```http
GET https://gamma-api.polymarket.com/events
GET https://gamma-api.polymarket.com/markets/{marketId}
```

### CLOB API：订单簿与交易

负责"怎么交易"：
- 订单簿深度
- 下单（Buy / Sell）
- 取消订单
- 查询持仓

核心接口：

```http
GET https://clob.polymarket.com/markets/{conditionId}/orderbook
POST https://clob.polymarket.com/order
```

### 两套 API 的关系

| API | 负责内容 | 是否需要签名 |
|-----|---------|-------------|
| Gamma API | 市场元数据、事件信息 | 不需要 |
| CLOB API | 下单、撤单、持仓查询 | 需要 Polygon 私钥签名 |

获取市场数据的流程通常走 Gamma API，执行交易走 CLOB API。

## 智能下注策略

### Kelly 准则

Kelly 准则是一种根据赔率和胜率来计算最优下注比例的方法。核心思想是：在已知胜率和赔率的情况下，找到一个长期收益最大化的下注比例。

简化公式：

```text
f* = (bp - q) / b

f* = 最优下注比例（占总资金的百分比）
b = 赔率（净赔率，不含本金）
p = 胜率估计
q = 失败概率 = 1 - p
```

实际应用中的调整：
- 全 Kelly 波动太大，通常使用 Fractional Kelly（如 Half Kelly）
- 胜率估计来自 AI 模型输出，赔率来自 Polymarket 市场价格

### 策略流程

```text
AI 分析比赛
  -> 输出胜率估计（如 Lakers 65% 赢）
  -> 查询 Polymarket 对应市场的当前价格
  -> 计算隐含概率（价格是 0.62 美元 -> 隐含概率 62%）
  -> 如果 AI 胜率 > 市场隐含概率 + 安全边际
       -> Kelly 准则计算最优下注额
       -> 执行买入
  -> 持续监控价格变化，适时调整持仓
```

### 核心判断逻辑

下注的前提不是"我觉得会赢"，而是"我认为的真实概率 > 市场价格隐含的概率"。这个差值就是"边缘"（Edge），是长期盈利的基础。

## Web3 钱包集成

### 钱包连接

前端通过 WalletConnect 或 MetaMask 等钱包提供商实现用户连接：

```env
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

### 交易签名

CLOB API 的下单需要 Polygon 私钥签名交易：

```env
POLYMARKET_PRIVATE_KEY=0x...
```

交易流程：
1. 用户在前端确认下注
2. 前端调用后端 API
3. 后端用私钥构造并签名交易
4. 提交到 CLOB API
5. CLOB 将订单放入订单簿或立即撮合

### 链上结算

预测市场到期后，结果由 UMA 或acles 提供，Polygon 链上合约自动结算：
- 预测正确的持仓获得 1 美元/份额
- 预测错误的持仓归零

## 部署与运维

### NBA 数据服务部署

```bash
# ssh81 服务器
/opt/sport-oracle/nba-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
systemctl restart nba-service
```

systemd 配置：

```ini
[Unit]
Description=NBA Data Service
After=network.target

[Service]
Type=simple
ExecStart=/opt/sport-oracle/nba-service/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### Nginx 反向代理

```nginx
location /nba-service/ {
    proxy_pass http://127.0.0.1:8000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_read_timeout 3600;
}
```

### Vercel 环境变量

前端需要配置：

```env
NBA_SERVICE_URL=http://81.71.39.211/nba-service
AI_API_KEY=...
AI_BASE_URL=https://freeapi.dgbmc.top
AI_MODEL=grok-4.20-beta
POLYMARKET_API_URL=https://clob.polymarket.com
POLYMARKET_GAMMA_URL=https://gamma-api.polymarket.com
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
```

## 风险与注意事项

1. **模型胜率不是真实胜率**：AI 预测有偏差，Kelly 准则需要保守估计
2. **市场流动性**：小众比赛的市场深度不足，大额交易会显著影响价格
3. **Gas 费波动**：Polygon 虽便宜，但频繁交易仍有成本
4. **智能合约风险**：预测市场依赖 oracle 提供结果，oracle 故障可能导致结算争议
5. **监管不确定性**：不同地区对预测市场的法律态度不同

## 一句话总结

预测市场的核心不是"猜对结果"，而是"找到市场价格和你估计概率之间的差异"。AI 提供概率估计，Polymarket 提供市场定价，Kelly 准则提供下注纪律，三者结合才能在这个零和博弈中寻找长期优势。
