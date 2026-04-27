---
title: 微服务演进与高可用实践：从拆分到双机部署
date: 2026-04-01
description: 以订单系统为例，梳理微服务拆分思路、服务发现、配置中心，以及 nginx + keepalived 双机高可用的完整实验。
category: backend
tags: [微服务, 高可用, Spring Cloud, Nacos, nginx, 架构]
slug: microservices-and-high-availability
---

# 微服务演进与高可用实践：从拆分到双机部署

系统从小变大后，单体架构的瓶颈会逐渐显现。这篇文章以订单系统为实战背景，把"微服务拆分"和"高可用部署"两条线串在一起讲：为什么拆、怎么拆、拆完后怎么保证服务之间的协同，以及入口层怎么做双机高可用。

## 微服务拆分：先解决"为什么拆"

### 拆分的三个动机

微服务不是目的，而是解决特定问题的手段。在订单系统里，把通知服务拆分出来，主要解决三件事：

1. **职责分离**：订单服务负责订单生命周期，通知服务负责对外消息（短信、站内信、推送等）
2. **变更隔离**：通知通道、频控、重试策略变化时，不影响订单主链路
3. **独立扩容**：大促时通知量大，可以只扩容通知服务

### 服务边界怎么划

拆分的核心原则是"边界清晰"。在这个练习项目里，边界划分如下：

| 服务 | 职责 | 不承担的职责 |
|------|------|-------------|
| 订单服务 | 创建订单、应用规则、发布"订单创建"事件 | 不直接发通知 |
| 通知服务 | 接收订单事件、执行通知、记录审计 | 不参与订单业务逻辑 |

### HTTP 契约

拆分后服务之间通过 HTTP 交互，最小可用的契约设计：

```http
POST /api/notify/order-created
Header: Idempotency-Key: <orderId>
Body: { orderId: number, userId: string, payableAmount: number }
```

幂等键用 `orderId`，真实场景可以通过落库或缓存实现去重。

### 实现链路

订单服务在订单创建成功后，异步回调通知服务：

```text
订单服务
  -> OrderCreatedEventHandler 监听事件
  -> NotificationClient 封装 HTTP 调用，携带幂等 Header
  -> 通知服务接收请求并记录
```

通知服务侧实现：
- `POST /api/notify/order-created`：接收并记录请求
- `GET /api/notify/last`：返回最近一条记录，便于验证链路

### 演进思考

当前版本是 HTTP 同步调用 + 简单 try/catch + 日志。生产环境通常需要：
- 超时、重试、告警、死信队列
- HTTP 同步 -> 消息队列异步（Kafka / RocketMQ）
- 本地事务 + 事务外发（outbox）保证最终一致性
- 增加链路追踪（TraceId）和审计日志

## 服务发现：拆完后怎么找到彼此

服务拆分后，第一个要解决的问题是"调用方怎么找到目标服务"。

### Nacos 承担的角色

Nacos 在这个架构里同时做两件事：
- **服务发现**：让订单服务通过服务名调用通知服务，避免写死 IP
- **配置中心**：把折扣、自动审核等业务规则外置出来，动态生效

### 接入方式

服务名配置：

```yaml
spring:
  application:
    name: order-service
```

开启服务发现：

```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
```

给 `RestTemplate` 加 `@LoadBalanced`：

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

这样调用 `http://notification-service/api/notify/order-created` 时，Spring Cloud 会自动向 Nacos 获取实例列表并完成负载均衡。

### 配置中心

把业务规则从代码里抽出来：

```yaml
order:
  rules:
    auto-approve: true
    discount-rate: 0.85
```

用 `@ConfigurationProperties` 绑定到代码对象，`@RefreshScope` 实现动态刷新。Nacos 配置变更后，新请求会读取到新规则。

## 高可用：入口层怎么做双机

### 为什么需要高可用

服务拆成多实例后，如果入口层只有单点，整个系统仍然是脆弱的。所以需要：
- 入口有冗余
- 单点故障时能自动切换
- 切换过程对用户透明

### 实验架构

```text
浏览器 / curl
        |
        v
    VIP(keepalived)
        |
        v
nginx-1(MASTER) / nginx-2(BACKUP)
        |
        v
order-service-1(primary) ----- H2 file DB(本地学习版)
        |
        +---- order-service-2(backup)
        |
        v
   Nacos 服务发现
        |
        v
notification-service-1(active) ---+
                                    +--- Redis
notification-service-2(active) ---+
```

### 各组件职责

| 组件 | 作用 |
|------|------|
| keepalived | VIP 漂移，解决"入口 IP 由谁持有" |
| nginx | 反向代理和流量转发，解决"请求转给哪个后端" |
| Nacos | 服务注册发现 |
| Redis | 通知服务双实例共享状态（幂等控制、最近通知记录） |

### keepalived + nginx 的分工

- **keepalived**：负责 VIP 漂移。主 nginx 故障时，备 nginx 接管入口地址
- **nginx**：负责七层转发。根据域名、路径、Header 做更细粒度控制

如果只有 nginx 没有 keepalived，那 nginx 自己还是单点。如果只有 keepalived 没有 nginx，那只是 IP 能漂移，没有七层转发能力。两者通常搭配使用。

### 验证顺序

1. **验证入口层可用**：`curl http://127.0.0.1:18080/api/system/instance`
2. **验证订单主链路**：创建订单，确认正常返回
3. **验证通知服务**：查询通知记录，确认收到请求
4. **验证主备切换**：停掉 order-service-1，看流量是否切到 order-service-2
5. **验证幂等**：重复提交同一个订单号，确认不会重复处理
6. **验证 VIP 漂移**（需两台 Linux 机器）：停掉主 nginx，确认 VIP 漂移到备机

### 这套实验的简化点

| 简化项 | 实际情况 |
|--------|---------|
| H2 file DB | 真实部署应换成 MySQL 或 PostgreSQL |
| Redis 单节点 | 生产应使用 Sentinel 或 Cluster |
| nginx primary + backup | 生产更常见 active-active + 健康检查 |

## 从 0 到 1 的推进顺序

如果把这套架构从零搭建，建议按这个顺序：

1. 先保持单体，把业务逻辑跑通
2. 把通知能力抽成独立服务，用 HTTP 直连验证链路
3. 引入 Nacos 做服务发现，把直连改为服务名调用
4. 通知服务做多实例，验证负载均衡
5. 引入 Redis 做共享状态和幂等
6. 订单服务做多实例，nginx 做入口代理
7. keepalived 做 VIP 漂移，完成入口层高可用
8. 逐步把 HTTP 同步演进为 MQ 异步
9. H2 换成 MySQL，Redis 升级 Sentinel
10. 补监控、告警、压测、回滚方案

## 一句话总结

微服务拆分的本质是"用边界清晰换独立演进"，高可用的本质是"用冗余和自动切换换持续服务"。两者都引入了新复杂度，所以判断标准始终是：当前阶段是否真的需要拆、是否真的需要高可用、团队是否能承受引入后的治理成本。
