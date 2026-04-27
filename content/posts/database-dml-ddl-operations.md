---
title: 数据库 DML 与 DDL 操作实战：以 PostgreSQL 为例
date: 2026-04-15
description: 系统梳理数据库的 CRUD 操作、表结构设计、索引优化、事务管理和查询调优，覆盖日常开发最常用的 SQL 技能。
category: backend
tags: [数据库, SQL, PostgreSQL, DML, DDL, 索引, 事务]
slug: database-dml-ddl-operations
---

# 数据库 DML 与 DDL 操作实战：以 PostgreSQL 为例

数据库是后端系统的数据底座。无论是设计表结构、编写查询、还是排查性能问题，SQL 能力都是基本功。这篇文章以 PostgreSQL 为例，系统梳理 DML 数据操作、DDL 结构定义、索引优化、事务管理和查询调优，覆盖日常开发最常用的数据库技能。

## 数据库与表的基础操作

### 创建数据库和表

```sql
-- 创建数据库
CREATE DATABASE mydb
  WITH ENCODING 'UTF8'
  OWNER postgres;

-- 创建表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(36) UNIQUE NOT NULL,
    firstname VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 修改表结构

```sql
-- 添加列
ALTER TABLE users ADD COLUMN age INTEGER;

-- 修改列类型
ALTER TABLE users ALTER COLUMN age TYPE SMALLINT;

-- 删除列
ALTER TABLE users DROP COLUMN age;

-- 添加注释
COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.uid IS '用户唯一标识符';
```

## DML：数据操作

### CRUD 基础

```sql
-- 插入单条
INSERT INTO users (uid, firstname, email)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'John', 'john@example.com');

-- 批量插入
INSERT INTO users (uid, firstname, email) VALUES
('id1', 'Alice', 'alice@example.com'),
('id2', 'Bob', 'bob@example.com');

-- 查询
SELECT * FROM users;
SELECT uid, firstname, email FROM users WHERE disabled = FALSE;

-- 更新
UPDATE users
SET firstname = 'Jonathan', updated_at = CURRENT_TIMESTAMP
WHERE uid = 'id1';

-- 删除
DELETE FROM users WHERE uid = 'id1';
```

### WHERE 条件过滤

```sql
-- 基本比较
SELECT * FROM users WHERE age > 18;
SELECT * FROM users WHERE email IS NULL;

-- IN 和 BETWEEN
SELECT * FROM users WHERE uid IN ('id1', 'id2', 'id3');
SELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- LIKE 模糊查询
SELECT * FROM users WHERE email LIKE '%@example.com';
SELECT * FROM users WHERE firstname LIKE 'Jo%';

-- 逻辑操作符
SELECT * FROM users WHERE (firstname = 'John' OR firstname = 'Jane') AND disabled = FALSE;
```

### 排序和分组

```sql
-- ORDER BY 排序
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- GROUP BY 分组
SELECT auth_type, COUNT(*) as count FROM users GROUP BY auth_type;

-- HAVING 分组后过滤
SELECT auth_type, COUNT(*) as count
FROM users
GROUP BY auth_type
HAVING COUNT(*) > 5;

-- 聚合函数
SELECT
    COUNT(*) as total,
    COUNT(DISTINCT auth_type) as auth_types,
    MIN(created_at) as first_user,
    MAX(created_at) as last_user
FROM users;
```

### 多表联接 JOIN

```sql
-- INNER JOIN：只返回两边都匹配的数据
SELECT u.uid, u.firstname, r.role_name
FROM users u
INNER JOIN user_roles ur ON u.id = ur.user_id
INNER JOIN roles r ON ur.role_id = r.id;

-- LEFT JOIN：保留左表全部数据
SELECT u.uid, u.firstname, r.role_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE r.role_name IS NULL;  -- 没有分配角色的用户

-- FULL OUTER JOIN：保留两边全部数据
SELECT u.uid, ur.role_id
FROM users u
FULL OUTER JOIN user_roles ur ON u.id = ur.user_id;
```

## 数据类型选择

| 类型 | 用途 | 示例 |
|------|------|------|
| `SERIAL` / `BIGSERIAL` | 自增主键 | `id SERIAL PRIMARY KEY` |
| `VARCHAR(n)` | 可变长字符串 | `name VARCHAR(100)` |
| `TEXT` | 无限长文本 | `description TEXT` |
| `NUMERIC(p,s)` | 精确数值 | `price NUMERIC(10, 2)` |
| `TIMESTAMP` | 日期+时间 | `created_at TIMESTAMP` |
| `BOOLEAN` | 布尔值 | `is_active BOOLEAN` |
| `UUID` | 全局唯一标识 | `unique_id UUID DEFAULT gen_random_uuid()` |
| `JSONB` | JSON 二进制存储，可索引 | `metadata JSONB` |
| 数组 `TYPE[]` | 单列存多个同类型值 | `tags TEXT[] DEFAULT '{}'` |

### JSONB 使用示例

```sql
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入 JSON
INSERT INTO logs (data) VALUES ('{"user_id": 123, "action": "login"}');

-- JSON 查询
SELECT * FROM logs WHERE data @> '{"action": "login"}';

-- JSON 提取
SELECT data->>'user_id' as user_id FROM logs;

-- 更新 JSON
UPDATE logs SET data = jsonb_set(data, '{action}', '"logout"') WHERE id = 1;
```

## 表设计与规范化

### 三范式

**第一范式（1NF）**：每个字段必须是原子值。

不要用一个字段存逗号分隔值，要拆成独立表或数组。

**第二范式（2NF）**：所有非主键字段必须完全依赖主键。

不要把只依赖部分主键的字段放在组合主键的表里。

**第三范式（3NF）**：所有字段不能依赖非主键字段。

如果字段 A 依赖字段 B，字段 B 又依赖主键，要把 A 拆出去。

### 外键约束

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    company_id INTEGER NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

### 检查约束

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price NUMERIC(10, 2),
    quantity INTEGER,
    CONSTRAINT price_positive CHECK (price > 0),
    CONSTRAINT quantity_non_negative CHECK (quantity >= 0)
);
```

## 索引优化

### 创建索引

```sql
-- 单列索引
CREATE INDEX idx_users_email ON users(email);

-- 复合索引
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- 唯一索引
CREATE UNIQUE INDEX idx_users_uid ON users(uid);

-- 部分索引（只索引满足条件的行）
CREATE INDEX idx_active_users ON users(email) WHERE disabled = FALSE;

-- 表达式索引
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- 全文搜索索引
CREATE INDEX idx_articles_search ON articles USING GIN (to_tsvector('english', content));
```

### 索引类型选择

| 类型 | 适用场景 |
|------|---------|
| B-tree | 默认最常用，范围查询和排序 |
| Hash | 等值查询优化 |
| GiST | 几何数据、全文搜索 |
| GIN | 数组、JSONB |
| BRIN | 大块级索引，适合大表 |

### 索引维护

```sql
-- 查看索引大小
SELECT indexname, pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_indexes
JOIN pg_class ON pg_class.relname = indexname;

-- 重建索引
REINDEX INDEX idx_users_email;

-- 删除索引
DROP INDEX idx_users_email;
```

## 事务与并发控制

### 事务基础

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- 或 ROLLBACK;
```

### 隔离级别

| 隔离级别 | 特点 |
|---------|------|
| READ UNCOMMITTED | 性能最好，可能读到未提交数据 |
| READ COMMITTED | PostgreSQL 默认，避免脏读 |
| REPEATABLE READ | 避免脏读和不可重复读 |
| SERIALIZABLE | 最安全但性能最低 |

```sql
-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

### 锁控制

```sql
-- 显式行级排他锁
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- 共享锁
SELECT * FROM accounts WHERE id = 1 FOR SHARE;

-- 跳过已锁定行
SELECT * FROM accounts FOR UPDATE SKIP LOCKED;
```

### 死锁避免

死锁四条件：互斥、请求与保持、不可剥夺、循环等待。

避免方法：
1. 总是按相同的顺序更新表
2. 设置合理的超时时间：`SET lock_timeout = '10s'`
3. 定期监控死锁情况

## 查询优化

### EXPLAIN 分析

```sql
-- 显示执行计划
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 详细分析（含实际执行统计）
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### 常见性能问题

**N+1 查询问题**

不好：循环里逐条查询。

好：一次 JOIN 查询全部数据。

**全表扫描**

不好：`SELECT * FROM users WHERE email = 'test@example.com'` 没有索引。

好：为 WHERE 字段添加索引。

**不必要的 DISTINCT**

不好：`SELECT DISTINCT u.* FROM users u JOIN orders o ON u.id = o.user_id`

好：`SELECT u.* FROM users u WHERE EXISTS (SELECT 1 FROM orders WHERE user_id = u.id)`

### 优化技巧

1. **只查需要的列**：不要 `SELECT *`，明确列出需要的字段
2. **使用 LIMIT**：`SELECT * FROM orders ORDER BY created_at DESC LIMIT 10`
3. **避免在 WHERE 中使用函数**：会导致索引失效
4. **分页优化**：大数据量时用条件分页代替 OFFSET
5. **批量操作**：一条 INSERT 插入多行，不要逐条执行
6. **定期维护**：`VACUUM ANALYZE users` 释放空间并更新统计信息

## 高级特性

### 视图

```sql
-- 创建视图
CREATE VIEW active_users_view AS
SELECT id, uid, firstname, lastname, email
FROM users WHERE disabled = FALSE;

-- 物化视图（缓存预计算结果）
CREATE MATERIALIZED VIEW user_stats AS
SELECT auth_type, COUNT(*) as total_users, MAX(created_at) as latest_user
FROM users GROUP BY auth_type;

-- 刷新物化视图
REFRESH MATERIALIZED VIEW user_stats;
```

### 存储过程和函数

```sql
-- 创建函数
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM users);
END;
$$ LANGUAGE plpgsql;

-- 调用
SELECT get_user_count();

-- 带参数的函数
CREATE OR REPLACE FUNCTION get_users_by_role(role_name VARCHAR)
RETURNS TABLE(id INTEGER, uid VARCHAR, firstname VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.uid, u.firstname
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = role_name;
END;
$$ LANGUAGE plpgsql;
```

### 触发器

```sql
-- 自动更新时间戳
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

### 递归查询 CTE

```sql
-- 查询员工层级关系
WITH RECURSIVE employee_hierarchy AS (
    SELECT id, name, manager_id, 0 as level
    FROM employees WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, h.level + 1
    FROM employees e
    JOIN employee_hierarchy h ON e.manager_id = h.id
)
SELECT * FROM employee_hierarchy ORDER BY level, name;
```

## 备份和恢复

### 逻辑备份

```bash
# 备份整个数据库
pg_dump mydb > mydb_backup.sql

# 备份特定表
pg_dump mydb -t users > users_backup.sql

# 备份为自定义格式
pg_dump -F c mydb > mydb_backup.dump
```

### 恢复

```bash
# 从 SQL 文件恢复
psql mydb < mydb_backup.sql

# 从自定义格式恢复
pg_restore -d mydb mydb_backup.dump
```

## 最佳实践总结

| 概念 | 最佳实践 |
|------|---------|
| 索引 | 为 WHERE、JOIN 字段添加索引；避免过多索引 |
| 规范化 | 遵循 3NF；使用外键；保持数据一致性 |
| 性能 | 使用 EXPLAIN；避免 N+1 查询；定期 VACUUM/ANALYZE |
| 事务 | 保持事务简短；使用适当的隔离级别 |
| 备份 | 定期备份；测试恢复过程 |
| 监控 | 跟踪慢查询；监控连接数 |

数据库操作的核心不是背 SQL 语法，而是理解数据怎么存、怎么查最快、怎么保证一致性、以及怎么在业务增长时持续保持性能。
