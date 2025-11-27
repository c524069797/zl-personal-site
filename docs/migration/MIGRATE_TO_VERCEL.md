# 本地 PostgreSQL 数据库迁移到 Vercel 指南

本指南将帮助你将本地 PostgreSQL 数据库完整迁移到 Vercel 的数据库服务。

## 📋 迁移前准备

### 1. 确认本地数据库信息

检查你的本地数据库连接信息（通常在 `.env` 文件中）：

```bash
# 查看本地数据库 URL
cat .env | grep DATABASE_URL
```

示例格式：
```
DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"
```

### 2. 确认本地数据库有数据

```bash
# 使用 Prisma Studio 查看数据
npm run studio
```

或者使用 psql：
```bash
psql postgresql://chenzilong@localhost:5432/personal_site -c "SELECT COUNT(*) FROM users;"
psql postgresql://chenzilong@localhost:5432/personal_site -c "SELECT COUNT(*) FROM posts;"
psql postgresql://chenzilong@localhost:5432/personal_site -c "SELECT COUNT(*) FROM comments;"
```

---

## 🚀 迁移步骤

### 方案一：使用 Vercel Postgres（推荐）

#### 步骤 1：在 Vercel 创建 Postgres 数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Storage** 标签页
4. 点击 **Create Database** → 选择 **Postgres**
5. 选择区域（推荐：`Hong Kong (hkg1)` 或 `Singapore (sin1)`）
6. 点击 **Create**
7. 等待数据库创建完成（约 1-2 分钟）

#### 步骤 2：获取 Vercel Postgres 连接字符串

1. 在 Storage 页面，点击创建的 Postgres 数据库
2. 进入 **.env.local** 标签页
3. 复制 `POSTGRES_URL` 或 `DATABASE_URL` 的值
4. 格式类似：
   ```
   postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb
   ```

#### 步骤 3：在 Vercel 项目设置环境变量

1. 进入项目 **Settings** → **Environment Variables**
2. 添加环境变量：
   - **Name**: `DATABASE_URL`
   - **Value**: 粘贴步骤 2 复制的连接字符串
   - **Environment**: 勾选 Production, Preview, Development
3. 点击 **Save**

#### 步骤 4：导出本地数据库数据

**方法 A：使用导出脚本（推荐）**

```bash
# 使用项目提供的导出脚本（自动查找 pg_dump）
./scripts/export-db.sh local_data.sql
```

**方法 B：手动使用 `pg_dump`**

```bash
# 导出完整数据库（包括 schema 和数据）
pg_dump postgresql://chenzilong@localhost:5432/personal_site > local_dump.sql

# 或者只导出数据（不包含 CREATE TABLE 语句）
pg_dump --data-only --column-inserts postgresql://chenzilong@localhost:5432/personal_site > local_data.sql
```

**如果找不到 `pg_dump` 命令**：

```bash
# macOS (Homebrew) - 使用完整路径
/opt/homebrew/opt/postgresql@15/bin/pg_dump --data-only --column-inserts postgresql://chenzilong@localhost:5432/personal_site > local_data.sql

# 或者临时添加到 PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
pg_dump --data-only --column-inserts postgresql://chenzilong@localhost:5432/personal_site > local_data.sql

# 或者永久添加到 PATH（在 ~/.zshrc 中添加）
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### 步骤 5：在 Vercel 数据库运行 Prisma 迁移

首先，在本地使用 Vercel 的数据库 URL 运行迁移：

```bash
# 临时设置 Vercel 数据库 URL（从步骤 2 获取）
export DATABASE_URL="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb"

# 运行 Prisma 迁移（创建表结构）
npx prisma migrate deploy

# 或者使用 Prisma db push（开发环境）
npx prisma db push
```

#### 步骤 6：导入数据到 Vercel 数据库

使用 `psql` 导入数据：

```bash
# 使用 Vercel 数据库 URL 导入数据
psql "postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb" < local_dump.sql
```

**如果导入时遇到错误**（比如表已存在），可以：

1. **只导入数据**（推荐）：
   ```bash
   # 先导出纯数据
   pg_dump --data-only --column-inserts postgresql://chenzilong@localhost:5432/personal_site > local_data.sql

   # 导入数据
   psql "postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb" < local_data.sql
   ```

2. **或者手动编辑 SQL 文件**，移除 `CREATE TABLE` 语句，只保留 `INSERT` 语句

#### 步骤 7：验证数据迁移

创建一个临时测试脚本：

```bash
# 创建测试脚本
cat > test_vercel_db.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function test() {
  try {
    const usersCount = await prisma.user.count()
    const postsCount = await prisma.post.count()
    const commentsCount = await prisma.comment.count()

    console.log('✅ 数据迁移成功！')
    console.log(`用户数: ${usersCount}`)
    console.log(`文章数: ${postsCount}`)
    console.log(`评论数: ${commentsCount}`)
  } catch (error) {
    console.error('❌ 验证失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
EOF

# 运行测试
DATABASE_URL="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb" npx tsx test_vercel_db.ts
```

#### 步骤 8：重新部署 Vercel 项目

```bash
# 推送一个空提交触发重新部署
git commit --allow-empty -m "chore: 迁移数据库到 Vercel Postgres"
git push origin main
```

或者：
1. 进入 Vercel Dashboard
2. 选择项目 → **Deployments**
3. 点击最新部署的 **"..."** 菜单
4. 选择 **Redeploy**

---

### 方案二：使用 Supabase（备选方案）

#### 步骤 1：创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 使用 GitHub 账号登录
3. 点击 **New Project**
4. 填写项目信息：
   - **Name**: personal-site
   - **Database Password**: 设置一个强密码（记住它！）
   - **Region**: Southeast Asia (Singapore)
5. 点击 **Create new project**
6. 等待项目创建完成（约 2 分钟）

#### 步骤 2：获取 Supabase 连接字符串

1. 进入项目 → **Settings** → **Database**
2. 找到 **Connection string** → **URI**
3. 复制连接字符串，格式：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. 将 `[YOUR-PASSWORD]` 替换为你设置的密码

#### 步骤 3：在 Vercel 配置环境变量

1. 进入 Vercel 项目 **Settings** → **Environment Variables**
2. 添加：
   - **Name**: `DATABASE_URL`
   - **Value**: Supabase 连接字符串（已替换密码）
   - **Environment**: 全部勾选
3. 点击 **Save**

#### 步骤 4-8：同方案一的步骤 4-8

使用 Supabase 的连接字符串替换 Vercel Postgres 的连接字符串即可。

---

## 🔧 使用 Prisma 迁移（推荐方法）

如果你使用 Prisma 管理数据库 schema，推荐使用 Prisma 迁移而不是直接导入 SQL：

### 方法 A：使用 Prisma Migrate

```bash
# 1. 确保本地有迁移文件
ls prisma/migrations/

# 2. 使用 Vercel 数据库 URL 运行迁移
export DATABASE_URL="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb"
npx prisma migrate deploy

# 3. 使用 Prisma 的 seed 功能导入数据（如果有 seed.ts）
npx prisma db seed
```

### 方法 B：使用 Prisma db push + 数据导入

```bash
# 1. 推送 schema 到 Vercel 数据库
export DATABASE_URL="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb"
npx prisma db push

# 2. 导入数据（使用 pg_dump 导出的数据）
psql "postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb" < local_data.sql
```

---

## 📝 使用数据导出脚本

项目已包含导出脚本 `scripts/export-db.sh`，它会自动：
- 从 `.env` 文件读取 `DATABASE_URL`
- 自动查找 `pg_dump` 命令（支持 macOS Homebrew 安装）
- 导出纯数据（不包含 CREATE TABLE 语句）

使用：
```bash
# 使用默认文件名（带时间戳）
./scripts/export-db.sh

# 或指定输出文件名
./scripts/export-db.sh local_data.sql
```

---

## 🔍 常见问题

### 1. pg_dump 命令未找到

**解决方案**：
```bash
# macOS
brew install postgresql@15
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# 或者使用完整路径
/opt/homebrew/opt/postgresql@15/bin/pg_dump ...
```

### 2. 导入时出现外键约束错误

**解决方案**：
```bash
# 临时禁用外键检查（PostgreSQL 不支持，需要按顺序导入）
# 或者编辑 SQL 文件，确保按依赖顺序导入：
# 1. users
# 2. tags
# 3. posts
# 4. post_tags
# 5. comments
```

### 3. 数据导入后 ID 不匹配

**解决方案**：
- 如果使用 `cuid()` 作为 ID，导入时会自动生成新的 ID
- 如果需要保持原 ID，确保 SQL 导出包含 ID 字段：
  ```bash
  pg_dump --data-only --column-inserts --inserts "$DATABASE_URL" > backup.sql
  ```

### 4. Vercel 数据库连接超时

**解决方案**：
- 检查 Vercel 数据库是否在运行
- 确认连接字符串格式正确
- 检查网络连接（某些地区可能需要 VPN）

### 5. 迁移后数据不一致

**验证步骤**：
```bash
# 比较本地和远程数据数量
echo "本地数据："
psql "$LOCAL_DATABASE_URL" -c "SELECT 'users' as table, COUNT(*) FROM users UNION ALL SELECT 'posts', COUNT(*) FROM posts UNION ALL SELECT 'comments', COUNT(*) FROM comments;"

echo "远程数据："
psql "$VERCEL_DATABASE_URL" -c "SELECT 'users' as table, COUNT(*) FROM users UNION ALL SELECT 'posts', COUNT(*) FROM posts UNION ALL SELECT 'comments', COUNT(*) FROM comments;"
```

---

## ✅ 迁移检查清单

- [ ] 本地数据库已备份
- [ ] Vercel Postgres 或 Supabase 数据库已创建
- [ ] 环境变量 `DATABASE_URL` 已在 Vercel 配置
- [ ] 使用 Prisma 迁移创建了表结构
- [ ] 数据已成功导入到 Vercel 数据库
- [ ] 验证了数据完整性（记录数、关键数据）
- [ ] 测试了 API 端点（如 `/api/test-db`）
- [ ] 测试了评论功能
- [ ] Vercel 项目已重新部署
- [ ] 线上环境功能正常

---

## 🎯 快速迁移命令总结

```bash
# 1. 导出本地数据
pg_dump --data-only --column-inserts postgresql://chenzilong@localhost:5432/personal_site > backup.sql

# 2. 设置 Vercel 数据库 URL（替换为你的实际 URL）
export VERCEL_DB_URL="postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb"

# 3. 运行 Prisma 迁移
DATABASE_URL="$VERCEL_DB_URL" npx prisma migrate deploy

# 4. 导入数据
psql "$VERCEL_DB_URL" < backup.sql

# 5. 验证数据
DATABASE_URL="$VERCEL_DB_URL" npx prisma studio
```

---

## 📚 相关文档

- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase 文档](https://supabase.com/docs)
- [Prisma 迁移文档](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL pg_dump 文档](https://www.postgresql.org/docs/current/app-pgdump.html)

