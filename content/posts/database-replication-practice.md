---
title: 主流数据库架构深度解析（下）：复制原理、延迟排查与生产实践
date: 2026-02-25
description: 详解数据库主从复制原理、同步方式、延迟排查手段，以及复制选型与生产优化实践。
category: backend
tags: [数据库, 复制, 主从, 高可用, MySQL, PostgreSQL, Redis, 面试]
slug: database-replication-practice
---

# 主流数据库架构深度解析（下）：复制原理、延迟排查与生产实践

数据库复制是高可用和读写分离的基础能力。这篇文章从复制分类讲起，深入 MySQL、PostgreSQL、Redis 的复制原理，再到延迟排查手段和生产优化实践。

## 复制的分类

### 按同步方式

| 方式 | 机制 | 一致性 | 延迟 | 适用场景 |
|------|------|--------|------|---------|
| **同步复制** | 主库等待从库确认后才返回 | 最强 | 最大 | 金融核心交易 |
| **异步复制** | 主库写完本地日志即返回 | 最终一致 | 无 | 互联网读多写少 |
| **半同步复制** | 至少等待一个从库确认 | 较强 | 较小 | 兼顾一致性和性能 |

### 按日志格式

| 格式 | 机制 | 代表 |
|------|------|------|
| **物理复制** | 复制磁盘页的物理变更 | PostgreSQL WAL Streaming |
| **逻辑复制** | 复制 SQL 语句或行变更 | MySQL Binlog、MongoDB Oplog |

### 按拓扑结构

| 结构 | 特点 |
|------|------|
| **主从（一主多从）** | 最常用，读写分离 |
| **级联复制** | 从库再带从库，减轻主库压力 |
| **多主复制** | 多个节点同时接受写 |
| **环形/链式** | 较早拓扑，故障排查复杂，现已少用 |

## MySQL 主从复制原理

### 复制流程

```text
Master
    ├── 事务提交 → 写 Binlog（Dump Thread 推送）
    └── 等待 Slave ACK（半同步）

Slave
    ├── I/O Thread：接收 Binlog → 写 Relay Log
    ├── SQL Thread：重放 Relay Log → 应用到本地库
    └── 多线程并行复制（5.6+）：按库并行 / 按事务组并行
```

### 关键参数

| 参数 | 作用 |
|------|------|
| **GTID** | 全局事务 ID，用于自动定位复制断点，简化主从切换 |
| **Relay Log** | 从库本地缓存的 Binlog 副本 |
| **Seconds_Behind_Master** | 从库延迟的近似值 |
| **slave_parallel_workers** | 并行复制线程数（MySQL 5.7+） |

### 并行复制演进

- **5.6**：按库并行，不同库的事务可并行重放
- **5.7**：按组提交并行，同一组内事务可并行
- **8.0**：基于 Write Set 的依赖并行，粒度更细

### Binlog 格式

| 格式 | 内容 | 优点 | 缺点 |
|------|------|------|------|
| **STATEMENT** | 记录 SQL 语句 | 日志量小 | 某些语句在主从不同环境下结果不一致 |
| **ROW** | 记录每行变更 | 最精确 | 日志量大 |
| **MIXED** | 混合模式 | 平衡 | 复杂度较高 |

推荐生产环境使用 **ROW 格式**，精确度高，避免主从数据不一致。

## PostgreSQL 流复制

### 物理复制

```text
Primary
    ├── WAL Writer 持续产生 WAL 记录
    └── WAL Sender 进程向 Standby 推送 WAL

Standby
    └── WAL Receiver 接收 WAL → 直接重放
```

### 同步复制级别

| 级别 | 说明 |
|------|------|
| `remote_apply` | 从库应用后才返回，一致性最强 |
| `remote_write` | 写到从库磁盘即返回 |
| `on` | 收到即返回，最弱 |

### 逻辑复制

基于 Publication/Subscription 机制：
- **Publication**：主库端定义要复制的表
- **Subscription**：从库端订阅 Publication
- 支持表级复制、跨版本、跨平台

逻辑复制与物理复制的区别：

| 维度 | 物理复制 | 逻辑复制 |
|------|---------|---------|
| 复制内容 | 磁盘页变更 | 行级变更 |
| 粒度 | 整个实例 | 可选表级 |
| 跨版本 | 不支持 | 支持 |
| DDL | 自动复制 | 不自动复制 |
| 用途 | 高可用、备份 | 数据分发、ETL |

## Redis 主从 + Sentinel + Cluster

### 主从复制

```text
Slave 向 Master 发送 SYNC/PSYNC
    -> 全量 RDB 快照
    -> 增量命令复制
```

- **SYNC**：全量同步，首次连接或复制中断后使用
- **PSYNC**：增量同步，基于复制偏移量继续

### Sentinel

监控主从节点，自动故障转移：
- 监控：定期检查主从节点健康
- 通知：节点异常时通知管理员
- 自动故障转移：主节点宕机时选举新主节点
- 配置提供者：客户端通过 Sentinel 获取当前主节点地址

### Cluster

数据分片 + 高可用：
- 16384 个 Slot，每个 Slot 对应一个主从结构
- 支持水平扩展
- 不支持跨 Slot 事务

| 模式 | 数据分片 | 自动故障转移 | 适用场景 |
|------|---------|-------------|---------|
| **主从** | 不支持 | 不支持 | 简单读写分离 |
| **Sentinel** | 不支持 | 支持 | 高可用 |
| **Cluster** | 支持 | 支持 | 大规模、高可用 |

## 主从延迟：原因与排查

### 常见原因

1. **主库写入吞吐量过高**：从库单线程重放跟不上
2. **大事务**：如 DELETE 千万级数据，阻塞后续重放
3. **从库配置低**：硬件差于主库，或同时承担大量读查询
4. **网络抖动**：日志传输慢

### 排查手段

**MySQL：**

```sql
SHOW SLAVE STATUS;
-- 关注：Seconds_Behind_Master、Slave_IO_Running、Slave_SQL_Running
```

**PostgreSQL：**

```sql
SELECT * FROM pg_stat_replication;
-- 关注：replay_lag、flush_lag
```

**Redis：**

```bash
INFO replication
# 关注：master_repl_offset 和 slave_repl_offset 差值
```

### 优化手段

1. **开启并行复制**：MySQL 5.7+ 的 `slave_parallel_workers`
2. **拆分大事务**：把批量操作拆成多个小事务
3. **从库独立部署**：不混布其他重负载服务
4. **半同步降级为异步**：避免主库被慢从库拖住
5. **增加从库数量**：分散读压力
6. **优化网络**：确保主从之间网络带宽充足

## 复制选型的生产实践

### MySQL 生产配置建议

```ini
# 主库
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
gtid-mode = ON
enforce-gtid-consistency = ON

# 从库
server-id = 2
relay-log = mysql-relay-bin
read-only = ON
slave-parallel-workers = 4
slave-parallel-type = LOGICAL_CLOCK
```

### PostgreSQL 生产配置建议

```ini
# 主库
wal_level = replica
max_wal_senders = 10
wal_keep_size = 1GB

# 同步复制（可选）
synchronous_commit = remote_apply
synchronous_standby_names = 'standby1,standby2'
```

### Redis 生产配置建议

```bash
# 同时开启 AOF + RDB
appendonly yes
appendfsync everysec
save 900 1
save 300 10
save 60 10000

# 混合持久化
aof-use-rdb-preamble yes
```

## 面试高频问答

### Q1：MySQL 主从延迟怎么排查和优化？

排查：`SHOW SLAVE STATUS` 看 `Seconds_Behind_Master`、`Slave_SQL_Running_State`。如果 SQL 线程忙，看是否卡在特定表或事务。

优化：开并行复制、拆大事务、从库独立部署、考虑半同步降级。

### Q2：PostgreSQL 物理复制和逻辑复制怎么选？

物理复制用于高可用和备份，逻辑复制用于数据分发和 ETL。两者可以并存。

### Q3：Redis Cluster 为什么不支持跨 Slot 事务？

数据分布在不同节点上，没有分布式事务协议支持。如果需要事务，确保相关 key 落在同一 Slot（Hash Tag）。

### Q4：数据库复制中，同步复制和异步复制各有什么风险？

同步复制：主库被慢从库拖住，写入延迟增大，可用性降低。
异步复制：主从延迟期间，从库可能读到旧数据，主库宕机时可能丢数据。

## 一句话总结

复制不是"配完就完事"，它的核心挑战是**一致性和可用性之间的权衡**。同步复制保证数据不丢但可能拖垮主库，异步复制性能好但面临延迟和数据丢失风险。生产环境的复制方案需要根据业务对 RPO（恢复点目标）和 RTO（恢复时间目标）的要求来设计。
