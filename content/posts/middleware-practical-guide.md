---
title: 常用中间件接入实践：从消息队列到搜索引擎
date: 2026-03-20
description: 基于订单系统实战场景，梳理 Kafka、RocketMQ、ZooKeeper、Nacos、Elasticsearch 的接入方式、核心概念和常见踩坑点。
category: backend
tags: [中间件, Kafka, RocketMQ, ZooKeeper, Nacos, Elasticsearch, 微服务]
slug: middleware-practical-guide
---

# 常用中间件接入实践：从消息队列到搜索引擎

企业级系统从单体演进到分布式后，中间件成了基础设施的核心组成部分。这篇文章以订单系统为实战背景，梳理 5 个最常用的中间件：Kafka、RocketMQ、ZooKeeper、Nacos、Elasticsearch。每个中间件都讲清楚它解决什么问题、核心概念是什么、怎么接入、以及最容易踩的坑。

## Kafka：订单事件总线

### Kafka 在这个场景里做什么

Kafka 负责把"订单已创建"这类业务事实广播出去，让多个下游服务异步消费。核心作用：传播事件、解耦上下游、支撑多服务异步消费、保留事件日志支持重放。

典型链路：

```text
创建订单成功
  -> 保存订单
  -> 发布 OrderCreatedEvent 到 Kafka
  -> 通知服务消费
  -> 搜索服务消费
  -> 积分服务消费
```

### 核心概念

| 概念 | 作用 |
|------|------|
| Topic | 主题，类似事件分类，如 `order-created` |
| Producer | 生产者，负责发消息 |
| Consumer | 消费者，负责收消息 |
| Consumer Group | 同一组内一条消息只会被一个实例消费，不同组各自消费一遍 |
| Partition | 分区，提高吞吐，保证同一 key 的局部有序 |

订单场景通常用 `orderId` 或 `userId` 作为 key，让同一订单相关事件尽量落在同一分区。

### Spring Boot 接入

引入依赖：

```xml
<dependency>
  <groupId>org.springframework.kafka</groupId>
  <artifactId>spring-kafka</artifactId>
</dependency>
```

配置：

```yaml
spring:
  kafka:
    bootstrap-servers: 127.0.0.1:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

生产者封装：

```java
@Service
public class OrderKafkaProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendOrderCreated(OrderCreatedMessage message) {
        kafkaTemplate.send("order-created", String.valueOf(message.getOrderId()), message);
    }
}
```

消费者示例：

```java
@KafkaListener(topics = "order-created", groupId = "notification-group")
public void onOrderCreated(OrderCreatedMessage message) {
    // 发短信、站内信、邮件
}
```

### 最容易踩的坑

1. **只写库不保消息**：数据库成功了但 Kafka 没发出去。解决方向是 Outbox 模式或本地消息表 + 定时投递。
2. **重复消费**：Kafka 默认至少一次投递语义下，消费者可能重复收到。消费者必须做幂等。
3. **顺序误判**：Kafka 只能保证单分区内有序。如果订单事件要求顺序，必须设计好 key 让同一订单事件落到同一分区。

## RocketMQ：可靠异步通知

### RocketMQ 在这个场景里做什么

RocketMQ 更适合承担"明确业务命令型消息"和"通知、延迟、重试"这类场景。相比 Kafka 的偏事件广播，RocketMQ 更偏业务任务投递。

典型分工：
- **Kafka**：偏事件总线，谁都可以订阅，广播业务事实
- **RocketMQ**：偏业务任务投递，更适合通知、延迟、重试

### 典型场景

1. **订单创建后发通知**：把通知动作从订单主流程拆出去
2. **延迟取消未支付订单**：创建成功后发延迟消息，30 分钟后检查状态
3. **失败重试**：第三方通知失败后自动重试

### 接入方式

引入依赖：

```xml
<dependency>
  <groupId>org.apache.rocketmq</groupId>
  <artifactId>rocketmq-spring-boot-starter</artifactId>
  <version>2.2.3</version>
</dependency>
```

配置：

```yaml
rocketmq:
  name-server: 127.0.0.1:9876
  producer:
    group: order-producer-group
```

生产者：

```java
@Service
public class OrderNotifyProducer {
    private final RocketMQTemplate rocketMQTemplate;

    public void sendOrderCreated(NotifyOrderCreatedMessage message) {
        rocketMQTemplate.convertAndSend("notify-order-created", message);
    }
}
```

消费者：

```java
@Component
@RocketMQMessageListener(topic = "notify-order-created", consumerGroup = "notify-consumer-group")
public class NotifyOrderCreatedConsumer implements RocketMQListener<NotifyOrderCreatedMessage> {
    @Override
    public void onMessage(NotifyOrderCreatedMessage message) {
        // 执行发送通知逻辑
    }
}
```

### 延迟消息

RocketMQ 很适合"订单超时未支付自动取消"场景。到时间后消费端先查数据库，只取消仍未支付的订单，而不是到时间直接改状态。

### 最容易踩的坑

1. **把 MQ 当事务本身**：MQ 不能替代数据库事务。订单入库是主事务，消息是后续异步动作，两者之间要考虑最终一致性。
2. **消费端不幂等**：通知消息很可能重复投递。消费端要做去重，比如以 `orderId + channel` 去重或通知记录表唯一约束。

## ZooKeeper：分布式锁与协调

### ZooKeeper 在这个场景里做什么

ZooKeeper 负责协调，而不是负责业务数据本身。在订单系统里，典型用途是：
- 基于 `userId + clientOrderNo` 做分布式锁
- 在多实例下防止重复下单
- 做 leader 选举，确保定时任务只有一个实例执行

### 核心概念

- **ZNode**：类似层级节点，如 `/locks/order/create/u1/co-1`
- **临时节点**：会话断开后自动删除，适合做分布式锁，服务宕机后锁不会永久残留
- **顺序节点**：自动带序号，常用于公平锁和 leader 选举

### 接入方式

更常见的做法是用 Curator 而不是手写原生 API。

```xml
<dependency>
  <groupId>org.apache.curator</groupId>
  <artifactId>curator-recipes</artifactId>
  <version>5.5.0</version>
</dependency>
```

用 `InterProcessMutex` 做锁：

```java
InterProcessMutex lock = new InterProcessMutex(client, "/locks/order/create/u1/co-1");
try {
    if (lock.acquire(3, TimeUnit.SECONDS)) {
        // 查库 + 写库
    }
} finally {
    if (lock.isAcquiredInThisProcess()) {
        lock.release();
    }
}
```

### 演进后的下单逻辑

```text
createOrder(command)
  -> lock(order:create:userId:clientOrderNo)
  -> findByUserIdAndClientOrderNo(...)
  -> if exists return
  -> save(order)
  -> publish event
  -> unlock
```

### 最容易踩的坑

1. **锁粒度太大**：给整个下单接口只用一个全局锁会导致吞吐急剧下降。正确方式是按业务主键加细粒度锁。
2. **只靠锁不做唯一约束**：一旦锁配置错误或会话异常，仍可能重复写库。数据库唯一索引必须保留作为兜底。
3. **锁时间太长**：持锁期间不要做远程调用或慢 IO，锁内只做查重和写库这些最关键步骤。

> ZooKeeper 锁不是数据库唯一约束的替代品，而是补充。生产里一般是双保险：应用层分布式锁 + 数据层唯一索引。

## Nacos：服务发现与配置中心

### Nacos 在这个场景里承担两类角色

**服务发现（Discovery）**
- 让调用方按服务名找到目标服务实例
- 让服务扩容后继续通过统一名称调用
- 避免把目标服务地址写死在代码里

**配置中心（Config）**
- 把业务规则从代码和打包流程中拆出来
- 支持修改配置后动态生效
- 减少因规则调整带来的重启和发版

### 服务发现接入

两个服务都要有服务名：

```yaml
spring:
  application:
    name: order-service
```

打开 Nacos Discovery：

```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
```

给 `RestTemplate` 加 `@LoadBalanced`，这样可以通过服务名调用：

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

调用时请求 `http://notification-service/api/notify/order-created`，Spring Cloud 会自动向 Nacos 获取实例列表并完成负载均衡。

### 配置中心接入

开启 Nacos Config：

```yaml
spring:
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.1:8848
        file-extension: yaml
```

用 `@ConfigurationProperties` 绑定配置：

```java
@ConfigurationProperties(prefix = "order.rules")
public class OrderRuleProperties {
    private Boolean autoApprove;
    private BigDecimal discountRate;
}
```

需要动态刷新时加 `@RefreshScope`，这样 Nacos 配置变更后新请求会读取到新规则。

### 最容易踩的坑

1. **只配了 discovery，没配 `@LoadBalanced`**：结果服务名无法解析。
2. **改了 Nacos 配置，但代码没加 `@RefreshScope`**：配置中心改了，应用侧对象不刷新。
3. **Data ID 写错**：服务名和配置的 Data ID 不匹配，导致服务能注册但规则读不到。

## Elasticsearch：订单搜索与索引

### ES 在这个场景里做什么

ES 负责把订单数据变成可搜索的索引，不负责替代主数据库做交易写入。

数据库最适合做：订单创建、订单更新、强一致状态保存。
ES 更适合做：订单列表搜索、按用户/状态/商品关键词过滤、全文检索、聚合统计。

推荐链路：

```text
订单服务写 MySQL/PostgreSQL
  -> 发布订单事件
  -> 搜索服务或索引消费者异步写 ES
  -> 搜索页查 ES
```

不要直接把 ES 当主库。

### 索引设计

定义搜索文档模型：

```java
public class OrderDocument {
    private Long orderId;
    private String userId;
    private String itemName;
    private BigDecimal amount;
    private String status;
    private Instant createdAt;
}
```

索引命名建议直接用 `orders`，文档主键用 `orderId`，重复写入时天然幂等。

### 索引时机

推荐异步更新：
- `OrderCreatedEvent` -> 写入 ES
- `OrderStatusChangedEvent` -> 更新 ES

### Spring Boot 接入

配置连接：

```yaml
spring:
  elasticsearch:
    uris: http://127.0.0.1:9200
```

搜索接口示例：

```http
GET /api/orders/search?q=apple&status=PAID&userId=u1&page=1&size=20
```

### 最容易踩的坑

1. **把 ES 当唯一真实数据源**：ES 更适合查询，不适合做强事务主库。
2. **忘记处理索引延迟**：刚创建完订单立刻搜索可能短暂查不到，这是最终一致性，不是 bug。
3. **更新状态只改数据库不改索引**：详情页是最新状态，搜索页还是旧状态。必须补一条 `OrderStatusChangedEvent -> update ES`。

## 一句话记忆

| 中间件 | 核心价值 |
|--------|---------|
| Kafka | 把下单后的多个后置动作变成可广播、可扩展、可重放的事件流 |
| RocketMQ | 承接通知、延迟、重试这类业务任务型异步链路 |
| ZooKeeper | 为多实例下的幂等与协调提供分布式锁能力 |
| Nacos | 把服务地址和业务规则都从代码里抽出来，让系统更容易扩容和治理 |
| Elasticsearch | 把订单系统从"只能按库表查"升级成"支持搜索、过滤、聚合的读侧索引系统" |

中间件不是"上了就更高级"，本质上是拿一致性和复杂度换解耦、削峰和扩展能力。选型的前提是先判断链路是否真的需要异步化，以及当前阶段能不能承受引入后的治理成本。
