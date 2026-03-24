# Vercel 数据库配置指南

## 问题诊断

如果线上出现 500 错误，特别是评论功能无法使用，很可能是数据库连接配置问题。

## 解决步骤

### 1. 检查 Vercel 环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 确保以下环境变量已配置：

#### 必需的环境变量

```
DATABASE_URL=postgresql://用户名:密码@主机:端口/数据库名?schema=public
```

**示例（Supabase）：**
```
DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres?schema=public
```

**示例（Vercel Postgres）：**
```
DATABASE_URL=postgres://default:xxxxx@xxxxx.xxxxx.vercel-storage.com:5432/verceldb
```

#### 其他环境变量

```
JWT_SECRET=your-secret-key-change-in-production
PASSWORD_SECRET=password-secret-key
NEXT_PUBLIC_SITE_URL=https://www.clczl.asia
```

### 2. 确保环境变量应用到所有环境

在 Vercel 环境变量设置中，确保：
- ✅ Production
- ✅ Preview
- ✅ Development

都勾选了相应的环境。

### 3. 运行数据库迁移

在 Vercel 部署时，需要运行 Prisma 迁移。检查 `vercel.json` 配置：

```json
{
  "buildCommand": "npx prisma generate && npm run build"
}
```

如果需要运行迁移，可以：

#### 方法 1：在构建时运行迁移（推荐）

修改 `vercel.json`：
```json
{
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && npm run build"
}
```

#### 方法 2：手动运行迁移

在本地或通过 Vercel CLI：
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### 4. 检查 Prisma Schema

确保 `prisma/schema.prisma` 中的数据库连接配置正确：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. 验证数据库连接

#### 在 Vercel 函数日志中查看错误

1. 进入 Vercel Dashboard
2. 选择项目 → **Deployments**
3. 点击最新的部署
4. 查看 **Functions** 标签页
5. 查看函数日志，寻找数据库连接错误

#### 常见错误

- `P1001: Can't reach database server` - 数据库服务器不可达
- `P1000: Authentication failed` - 认证失败（用户名/密码错误）
- `P1003: Database does not exist` - 数据库不存在
- `Environment variable not found: DATABASE_URL` - 环境变量未设置

### 6. 推荐的数据库服务

#### Vercel Postgres（推荐）
- 与 Vercel 集成良好
- 自动配置环境变量
- 免费额度：512 MB

#### Supabase
- 免费额度：500 MB
- 提供完整的 PostgreSQL 数据库
- 需要手动配置连接字符串

#### Railway
- 免费额度：$5/月
- 简单易用
- 自动提供连接字符串

### 7. 测试数据库连接

创建一个测试 API 路由来验证连接：

```typescript
// app/api/test-db/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    return NextResponse.json({
      success: true,
      message: '数据库连接成功',
      hasDatabaseUrl: !!process.env.DATABASE_URL
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
```

访问 `https://www.clczl.asia/api/test-db` 来测试连接。

### 8. 重新部署

配置完环境变量后：
1. 进入 Vercel Dashboard
2. 选择项目 → **Deployments**
3. 点击最新部署的 "..." 菜单
4. 选择 **Redeploy**

或者推送一个空提交：
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

## 快速检查清单

- [ ] DATABASE_URL 环境变量已设置
- [ ] 环境变量应用到 Production 环境
- [ ] 数据库服务正在运行
- [ ] 数据库连接字符串格式正确
- [ ] Prisma migrations 已运行
- [ ] 重新部署了应用

## 获取帮助

如果问题仍然存在：
1. 查看 Vercel 函数日志
2. 检查数据库服务状态
3. 验证网络连接（防火墙、IP 白名单等）

