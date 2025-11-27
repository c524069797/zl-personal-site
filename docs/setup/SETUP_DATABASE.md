# 数据库设置指南

## 📋 已完成的工作

✅ 已安装 Prisma 和 @prisma/client
✅ 已创建数据库模型（Post, Tag, User, Comment）
✅ 已创建数据库连接文件 `lib/prisma.ts`
✅ 已创建 API 路由 `/api/posts`
✅ 已更新 `lib/posts.ts` 支持数据库查询（带文件系统后备）
✅ 已更新所有页面组件支持 async/await

## 🚀 下一步操作

### 1. 配置数据库连接

创建 `.env` 文件（如果还没有）：

```bash
# 在项目根目录创建 .env 文件
touch .env
```

在 `.env` 文件中添加数据库连接字符串：

```env
# PostgreSQL 连接字符串
# 格式: postgresql://用户名:密码@主机:端口/数据库名?schema=public
DATABASE_URL="postgresql://postgres:password123@localhost:5432/personal_site?schema=public"

# Site URL (用于 RSS feed 等)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 2. 安装和配置 PostgreSQL

#### 选项 A：本地安装 PostgreSQL

**macOS:**
```bash
# 使用 Homebrew
brew install postgresql@15
brew services start postgresql@15

# 创建数据库
createdb personal_site
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# 创建数据库
sudo -u postgres createdb personal_site
```

**Windows:**
下载并安装 [PostgreSQL](https://www.postgresql.org/download/windows/)

#### 选项 B：使用云数据库服务（推荐用于生产环境）

**Vercel Postgres:**
- 在 Vercel 项目中添加 Postgres 数据库
- 会自动配置 `DATABASE_URL` 环境变量

**Supabase:**
- 注册 [Supabase](https://supabase.com/)
- 创建新项目
- 在项目设置中获取连接字符串

**Railway:**
- 注册 [Railway](https://railway.app/)
- 创建 PostgreSQL 服务
- 复制连接字符串

**其他云服务:**
- AWS RDS
- Google Cloud SQL
- Azure Database for PostgreSQL
- 阿里云 RDS PostgreSQL
- 腾讯云 PostgreSQL

### 3. 运行数据库迁移

配置好数据库连接后，运行以下命令创建数据库表：

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表（会创建迁移文件）
npx prisma migrate dev --name init

# 或者直接推送到数据库（不创建迁移文件，适合开发环境）
npx prisma db push
```

### 4. 迁移现有文章数据（可选）

如果你有现有的 markdown 文章文件，可以创建一个迁移脚本将它们导入数据库。

创建 `scripts/migrate-posts.ts`:

```typescript
import { prisma } from '../lib/prisma'
import { getAllPosts as getFilePosts } from '../lib/posts-fs' // 需要创建一个临时函数

async function migrate() {
  // 首先创建一个默认用户（如果没有）
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: 'changeme', // 记得修改密码！
      role: 'admin',
    },
  })

  // 从文件系统读取文章
  const filePosts = getFilePosts()

  for (const post of filePosts) {
    // 创建或查找标签
    const tagConnections = await Promise.all(
      post.tags.map(async (tagName: string) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-'),
          },
        })
        return { id: tag.id }
      })
    )

    // 创建文章
    await prisma.post.create({
      data: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        summary: post.summary,
        date: new Date(post.date),
        published: !post.draft,
        authorId: user.id,
        tags: {
          create: tagConnections.map(tag => ({
            tag: { connect: { id: tag.id } }
          }))
        },
      },
    })
  }

  console.log('Migration completed!')
}

migrate()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 5. 验证设置

启动开发服务器：

```bash
npm run dev
```

访问以下页面验证：
- http://localhost:3000/blog - 应该显示文章列表
- http://localhost:3000/api/posts - 应该返回 JSON 格式的文章列表

### 6. 使用 Prisma Studio 管理数据（可选）

Prisma Studio 是一个可视化数据库管理工具：

```bash
npx prisma studio
```

这会打开一个网页界面，你可以在浏览器中查看和编辑数据库数据。

## 📝 注意事项

1. **环境变量**: `.env` 文件不会被提交到 Git（已在 `.gitignore` 中）
2. **数据库连接**: 确保数据库服务正在运行
3. **迁移策略**: 当前代码支持数据库和文件系统双重读取，数据库优先
4. **生产环境**: 在生产环境中，建议只使用数据库，移除文件系统后备代码

## 🔧 故障排除

### 问题：`DATABASE_URL` 未设置
**解决**: 确保 `.env` 文件存在且包含正确的 `DATABASE_URL`

### 问题：连接数据库失败
**解决**:
- 检查 PostgreSQL 服务是否运行
- 验证连接字符串格式是否正确
- 检查数据库用户权限

### 问题：表已存在错误
**解决**:
- 使用 `npx prisma migrate reset` 重置数据库（会删除所有数据）
- 或使用 `npx prisma db push --force-reset` 强制推送

### 问题：Prisma Client 未生成
**解决**: 运行 `npx prisma generate`

## 📚 相关资源

- [Prisma 文档](https://www.prisma.io/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Next.js 环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

