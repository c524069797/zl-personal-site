---
title: 主流数据库架构深度解析（上）：关系型数据库核心原理
date: 2026-02-15
description: 系统梳理 MySQL、PostgreSQL、Oracle 的核心架构、存储引擎、事务实现、MVCC 机制与面试高频考点。
category: backend
tags: [数据库, MySQL, PostgreSQL, Oracle, 架构, 面试, 后端]
slug: database-architecture-relational-deep-dive
---

# 主流数据库架构深度解析（上）：关系型数据库核心原理

关系型数据库是企业系统的数据底座。MySQL、PostgreSQL、Oracle 虽然都是关系型，但底层架构差异很大。这篇文章系统梳理三者的核心架构、存储引擎、事务实现、MVCC 机制，以及面试高频考点。

## MySQL：互联网 OLTP 标配

### 核心架构

```text
客户端连接层
    ↓
SQL 接口 + 解析器 + 优化器 + 执行器（服务层）
    ↓
InnoDB 存储引擎（默认）
    ├── Buffer Pool（数据页缓存）
    ├── Change Buffer（写缓冲）
    ├── Adaptive Hash Index
    ├── Log Buffer（Redo Log 缓冲）
    └── 表空间文件（.ibd / 系统表空间）
```

### 三大日志

| 日志 | 位置 | 作用 | 特点 |
|------|------|------|------|
| **Redo Log** | 存储引擎层 | 崩溃恢复 | 物理日志，记录"某页某偏移量改了什么值" |
| **Undo Log** | 存储引擎层 | 事务回滚 + MVCC | 逻辑日志，记录修改前的值 |
| **Binlog** | 服务层 | 复制 + 恢复 | 逻辑日志，记录 SQL 语句或行变更 |

### 为什么 Redo Log 是顺序写

磁盘顺序写性能远高于随机写。把随机页刷盘转化为顺序日志追加，大幅提升事务吞吐量。崩溃恢复时，用 Redo Log 重放未刷盘的数据页变更即可。

### 两阶段提交

Binlog 和 Redo Log 的一致性通过两阶段提交保证：

1. **Prepare 阶段**：写 Redo Log，标记为 prepare 状态
2. **Commit 阶段**：写 Binlog，然后标记 Redo Log 为 commit 状态

崩溃恢复时根据两者状态决定回滚还是提交：
- 如果 Redo 是 prepare 且 Binlog 完整 -> 提交
- 如果 Redo 是 prepare 但 Binlog 不完整 -> 回滚

### MVCC 实现

InnoDB 的 MVCC 依赖 Undo Log 链 + Read View：
- 每行数据有隐藏字段 `DB_TRX_ID` 和 `DB_ROLL_PTR`
- 修改时生成 Undo 记录，形成版本链
- 读操作根据 Read View 判断哪个版本可见

### Buffer Pool

InnoDB 核心缓存，通常占内存 50%~75%：
- 按页（默认 16KB）管理
- 使用 LRU 变体算法，防止全表扫描刷掉热点页
- 脏页由后台线程异步刷盘

## PostgreSQL：高级特性最丰富的开源关系型

### 核心架构

```text
客户端连接
    ↓
Postmaster（主进程）
    ├── Backend Process（每个连接一个）
    ├── WAL Writer
    ├── Background Writer
    ├── AutoVacuum Launcher
    ├── Checkpointer
    └── Stats Collector
```

### WAL（Write-Ahead Log）

所有修改先写 WAL 再刷数据页，崩溃恢复靠重放 WAL。WAL 比 MySQL Redo Log 更通用：
- 既记录物理页变化
- 也记录逻辑操作
- 同时支撑流复制和逻辑复制

### MVCC 实现

PostgreSQL 的 MVCC 与 MySQL 完全不同：
- 每行数据自带 `xmin`（插入事务 ID）和 `xmax`（删除事务 ID）
- 没有 Undo 段的概念，旧版本与当前版本共存于数据页中
- 读操作通过可见性规则判断版本，不需要回表查 Undo

| 维度 | MySQL InnoDB | PostgreSQL |
|------|-------------|------------|
| 实现方式 | Undo Log 链 | 行内多版本（xmin/xmax） |
| 旧版本存储 | 集中存放在 Undo 表空间 | 与数据行一起存储在数据页中 |
| 清理机制 | Purge 后台线程异步清理 | Vacuum 进程清理 Dead Tuples |
| 索引扫描 | 二级索引通过回表 + Undo 链查旧版本 | 索引条目也带版本信息，无需回表 |
| 事务 ID 回卷 | 不涉及 | 需要 Vacuum 防止 Transaction ID Wraparound |

### Vacuum

PG 的 Vacuum 是多用途后台进程：
- **清理死元组**：删除旧版本行，回收空间
- **防止事务 ID 回卷**：冻结旧事务 ID
- **更新统计信息**：为查询优化器提供准确数据分布

> 为什么 PG 几乎没有锁读？MVCC 天然支持读写不阻塞，读操作读取历史快照，不需要加共享锁。

## Oracle：企业级核心交易之王

### 核心架构

```text
实例（Instance）
    ├── SGA（系统全局区）
    │   ├── Database Buffer Cache
    │   ├── Shared Pool（库缓存 + 字典缓存）
    │   ├── Redo Log Buffer
    │   └── Large Pool / Java Pool
    └── 后台进程
        ├── DBWn（数据写入）
        ├── LGWR（日志写入）
        ├── CKPT（检查点）
        ├── SMON（系统监控）
        ├── PMON（进程监控）
        └── ARCn（归档）

数据库（Database）
    ├── 数据文件
    ├── 控制文件
    ├── 重做日志文件
    └── 归档日志
```

### SCN（System Change Number）

Oracle 的全局单调递增逻辑时钟，用于标识数据库的精确状态点：
- 崩溃恢复时靠 SCN 对齐
- 分布式事务协调
- Data Guard 同步点确认

### Undo 表空间

统一管理回滚段，比 MySQL 的 Undo Log 更体系化：
- 支撑闪回查询（Flashback Query）
- 支撑闪回表、闪回事务
- 企业级 Undo 管理策略

### RAC（Real Application Clusters）

多节点共享存储的集群架构：
- 通过 Cache Fusion 实现节点间内存同步
- 强一致性，应用无感知故障切换
- 适合核心交易、ERP、金融场景

| 维度 | Oracle RAC | MySQL 主从复制 |
|------|-----------|---------------|
| 架构 | 共享存储的多活集群 | 独立实例的数据复制 |
| 一致性 | 强一致 | 异步复制下最终一致 |
| 扩展性 | 垂直扩展为主，2~4 节点 | 读可水平扩展，写单点 |
| 故障切换 | 自动，应用无感知 | 需手动或借助工具切换 |
| 适用场景 | 核心交易、ERP、金融 | 互联网读多写少 |

## 事务 ACID 实现对比

### 原子性（Atomicity）

- **MySQL**：Undo Log 记录修改前数据，失败时回滚
- **PostgreSQL**：利用 MVCC 多版本，失败时旧版本仍然可见
- **Oracle**：Undo 表空间统一管理回滚，闪回能力更强

### 隔离性（Isolation）

三者都支持标准隔离级别，但实现不同：
- **MySQL**：MVCC + Next-Key Lock 解决幻读
- **PostgreSQL**：MVCC 天然避免脏读，Serializable 使用 Serializable Snapshot Isolation
- **Oracle**：MVCC + 锁机制，默认 Read Committed

### 持久性（Durability）

- **MySQL**：Redo Log WAL + Binlog 两阶段提交
- **PostgreSQL**：WAL 先写日志
- **Oracle**：Redo Log Buffer -> LGWR 写盘 -> 检查点刷数据文件

## 面试高频问答

### Q1：MySQL 的 Repeatable Read 为什么还会出现幻读？InnoDB 是怎么解决的？

标准定义下，RR 级别无法完全避免幻读。InnoDB 通过 **Next-Key Lock** 解决：
- 行锁 + 间隙锁的组合，锁定一个范围（左开右闭）
- 快照读（普通 SELECT）MVCC 已避免幻读
- 当前读（SELECT ... FOR UPDATE）需要 Next-Key Lock 配合

### Q2：PostgreSQL 的 WAL 和 MySQL Redo Log 有什么异同？

本质都是先写日志再写数据。但 PG WAL 更通用，既记录物理页变化也记录逻辑操作，同时支撑流复制和逻辑复制。MySQL Redo 更偏向物理页修改，Binlog 负责逻辑复制。

### Q3：Oracle 为什么适合超大规模核心交易？

架构成熟：RAC 高可用、Data Guard 灾备、分区表、并行执行。Undo/Redo 体系完善，SCN 全局一致性强。经过几十年企业级验证。

## 一句话总结

MySQL 胜在生态成熟、简单易用；PostgreSQL 胜在功能丰富、扩展性强；Oracle 胜在企业级成熟度、RAC 高可用。选型时不存在绝对优劣，关键看业务场景对一致性、扩展性、成本的权衡。
