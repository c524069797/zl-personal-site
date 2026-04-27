---
title: 主流数据库架构深度解析（中）：NoSQL 与分布式数据库全景
date: 2026-02-20
description: 系统梳理 Redis、MongoDB、HBase、Elasticsearch、TiDB、ClickHouse 的核心架构、适用场景与核心短板。
category: backend
tags: [数据库, Redis, MongoDB, Elasticsearch, TiDB, ClickHouse, NoSQL, 分布式]
slug: database-architecture-nosql-distributed
---

# 主流数据库架构深度解析（中）：NoSQL 与分布式数据库全景

关系型数据库不是唯一选择。当数据规模、访问模式或一致性要求超出单机关系型的能力边界时，NoSQL 和分布式数据库提供了不同的解题思路。这篇文章系统梳理 6 个主流非关系型数据库的核心架构、适用场景和核心短板。

## Redis：内存缓存与实时数据

### 核心架构

```text
客户端
    ↓
单线程事件循环（Reactor 模型）
    ├── 网络 IO 多路复用（epoll/kqueue）
    ├── 命令解析与执行
    ├── 数据结构操作
    └── AOF / RDB 持久化子进程
```

### 为什么快

- **纯内存操作**：数据全部在内存，无磁盘 IO
- **单线程无锁**：避免锁竞争，配合内存操作达到 10w+ QPS
- **高效数据结构**：String、Hash、List、Set、ZSet、Bitmap、HyperLogLog、Geo、Stream
- **IO 多路复用**：一个线程管理大量连接

> Redis 6.0+ 网络 IO 已引入多线程，但命令执行仍是单线程。

### 持久化

| 方式 | 机制 | 优点 | 缺点 |
|------|------|------|------|
| **RDB** | fork 子进程做全量快照 | 恢复速度快、文件紧凑 | 可能丢最后一次快照后的数据 |
| **AOF** | 追加写命令日志 | 数据更完整 | 文件大、恢复慢 |
| **混合（4.0+）** | AOF 前半部分 RDB + 后半部分增量命令 | 兼顾速度和完整性 | 推荐线上配置 |

线上推荐：同时开启 AOF（everysec）+ RDB（定期 bgsave），开启混合持久化。

### 缓存问题与解决

| 问题 | 现象 | 解决 |
|------|------|------|
| **缓存穿透** | 查询不存在的数据，每次都打到数据库 | 布隆过滤器、缓存空值、参数校验 |
| **缓存击穿** | 热点 key 失效瞬间大量请求打到数据库 | 热点 key 永不过期、互斥锁、逻辑过期 |
| **缓存雪崩** | 大量 key 同时失效 | 过期时间加随机值、多级缓存、限流降级 |

## MongoDB：文档型敏捷开发首选

### 核心架构

```text
Replica Set（副本集）
    ├── Primary（读写）
    ├── Secondary（读/备份）
    └── Arbiter（投票，不存数据）

Sharded Cluster（分片集群）
    ├── Mongos（路由层）
    ├── Config Servers（元数据）
    └── Shard（数据分片，每个 Shard 是一个 Replica Set）
```

### 关键概念

| 概念 | 说明 |
|------|------|
| **BSON** | 二进制 JSON，支持更丰富的数据类型（Date、ObjectId、Binary） |
| **WiredTiger** | 默认存储引擎，支持文档级并发控制、压缩、快照事务 |
| **Oplog** | Capped Collection 形式的操作日志，用于副本集同步 |
| **Chunk** | 分片后数据的逻辑块，默认 64MB，由 Balancer 自动迁移 |

### 什么时候适合用

- 数据结构多变，需要频繁调整 schema
- 需要嵌套文档，避免多表 JOIN
- 高写入吞吐量
- 地理位置查询

### 事务支持

4.0 支持副本集事务，4.2+ 支持分片集群事务。但性能不如关系型数据库，不适合长事务。

## HBase：海量数据随机读写

### 核心架构

```text
HMaster（元数据管理、Region 分配）
RegionServer（数据读写服务）
    ├── WAL（HLog）
    ├── BlockCache（读缓存）
    └── Region（数据分片）
        └── Store（列族）
            ├── MemStore（写缓存）
            └── HFile（磁盘文件）

底层依赖：HDFS（存储）+ ZooKeeper（协调）
```

### LSM-Tree 存储模型

写操作先进 MemStore + HLog，刷盘后生成 HFile，定期 Compaction 合并：
- **写快**：顺序追加，无随机写
- **读可能慢**：需要查 MemStore + BlockCache + 多个 HFile
- **Compaction 不及时时读性能下降**

### RowKey 设计原则

1. **散列性**：避免单调递增前缀导致 Region 热点
2. **查询模式匹配**：常用查询维度放前面
3. **长度尽量短**：RowKey 会重复存储
4. **唯一性**：表内必须唯一

经典方案：`MD5(用户ID)前4位 + 用户ID + 时间戳`

## Elasticsearch：搜索与分析引擎

### 核心架构

```text
Cluster
    ├── Master Node（集群管理、索引元数据）
    ├── Data Node（数据存储与查询）
    ├── Coordinating Node（请求路由与聚合）
    └── Ingest Node（预处理）

Index（逻辑索引）
    └── Shard（主分片 + 副本分片）
        └── Segment（不可变的倒排索引段）
```

### 倒排索引

全文搜索的核心结构：

```text
词项（Term） → 文档 ID 列表（Posting List）
```

建索引时对文档内容分词，建立"词 -> 文档"的映射。搜索时直接命中词项，无需扫描全表。

### 为什么搜索比 MySQL LIKE 快

MySQL 的 `LIKE '%keyword%'` 无法使用 B+ 树索引，只能全表扫描。ES 的倒排索引 + BM25 评分 + 跳表合并，在全文搜索场景下效率相差甚远。

### 不适合做主数据库的原因

- 写放大高：每次更新实际是标记删除 + 重建 Segment
- 事务支持弱：无 ACID 事务
- 更新成本高：异步 Merge
- 一致性模型：最终一致

### 深分页问题

`from + size` 过大时节点可能 OOM。解决方案：
- `search_after`：基于排序值翻页
- `scroll` API：适合批量导出

## TiDB：分布式 NewSQL

### 核心架构

```text
TiDB Server（SQL 层，无状态，可水平扩展）
    ↓
PD（Placement Driver，元数据调度、TSO 全局时间戳）
    ↓
TiKV（分布式 KV 存储，基于 RocksDB + Raft）
    └── Region：Raft Group，默认 96MB
```

### 关键特性

| 特性 | 说明 |
|------|------|
| **HTAP** | Hybrid Transactional/Analytical Processing，行存（TiKV）+ 列存（TiFlash）兼顾 OLTP 和 OLAP |
| **Raft** | 每个 Region 是一个 Raft Group，默认 3 副本，强一致 |
| **TSO** | PD 分配的全局单调递增时间戳，用于事务排序和 Snapshot Read |
| **Region 分裂/调度** | PD 自动根据负载和数据量做 Region 分裂、Leader 迁移、副本均衡 |

### 分布式事务

采用 **Percolator 模型**：
1. **Prewrite 阶段**：在涉及的每个 Region 上预写数据，加主锁
2. **Commit 阶段**：向 PD 申请 TSO 事务版本号，提交主锁，异步清理二级锁
3. **TSO 分配**：PD 作为全局时间源，保证 Snapshot Isolation

### TiDB vs MySQL

TiDB 兼容 MySQL 协议但底层完全分布式。计算层（TiDB Server）和存储层（TiKV）分离，数据按 Region 分片，支持动态分裂和调度。

## ClickHouse：OLAP 分析利器

### 核心架构

```text
分布式表（Distributed Engine）
    ↓
本地表（MergeTree Family）
    ├── Part（数据分片，按主键排序的列式存储）
    └── 后台 Merge（小 Part 合并成大 Part）
```

### 为什么 OLAP 快

- **列式存储**：同一列数据连续存放，压缩率高
- **向量化执行**：数据按列批处理，利用 SIMD 指令
- **高效压缩**：同类型数据压缩效果好
- **分区裁剪**：按分区键快速过滤
- **稀疏索引**：主键排序后建立稀疏索引

### 核心短板

- 不支持高频小事务
- UPDATE/DELETE 成本高（异步 Mutation）
- 不擅长大规模 JOIN
- 最终一致性，写入后异步合并

## 数据库选型速查

| 场景特征 | 推荐选型 |
|----------|---------|
| 强事务、强一致性、复杂查询、多表 JOIN | 关系型（MySQL / PostgreSQL / Oracle） |
| 数据结构多变、高写入、嵌套文档、快速迭代 | 文档型 NoSQL（MongoDB） |
| 超大规模日志、时序数据、海量键值查询 | 宽列存储（HBase / Cassandra） |
| 缓存、排行榜、会话、实时计数 | 内存型 KV（Redis） |
| 全文搜索、日志分析、APM 链路追踪 | 搜索引擎（Elasticsearch） |
| HTAP、分布式强一致 SQL | NewSQL（TiDB / CockroachDB） |
| OLAP、海量数据聚合分析 | 列式数据库（ClickHouse / Doris / StarRocks） |

## 一句话记忆

| 数据库 | 一句话定位 | 核心优势 | 核心短板 |
|--------|-----------|---------|---------|
| **Redis** | 内存缓存 / 实时数据 | 极快、数据结构丰富 | 内存贵、持久化有限 |
| **MongoDB** | 文档型敏捷开发首选 | 灵活 schema、高写入 | 事务弱、JOIN 差 |
| **HBase** | 海量数据随机读写 | 水平扩展、LSM-Tree 写快 | 读延迟高、运维重 |
| **Elasticsearch** | 搜索与分析引擎 | 全文搜索、聚合快 | 一致性弱、更新贵 |
| **TiDB** | 分布式 NewSQL | HTAP、水平扩展、强一致 | 延迟比单机高 |
| **ClickHouse** | OLAP 分析利器 | 列存、向量化、聚合极快 | 不支持高频更新 |

## 一句话总结

NoSQL 和分布式数据库不是来取代关系型的，而是解决关系型在特定场景下的能力边界问题。选型的核心不是技术偏好，而是业务场景对一致性、扩展性、查询模式和成本的综合权衡。
