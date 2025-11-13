# 全栈改造方案

## 📋 目录
1. [技术选型](#技术选型)
2. [数据库设计](#数据库设计)
3. [API 设计](#api-设计)
4. [项目结构](#项目结构)
5. [实施步骤](#实施步骤)
6. [代码示例](#代码示例)

---

## 🛠 技术选型

### 关系型数据库对比：PostgreSQL vs MySQL

#### PostgreSQL 的优势
1. **标准 SQL 支持更好**
   - 更严格遵循 SQL 标准
   - 支持更多高级 SQL 特性（窗口函数、CTE、JSON 查询等）

2. **数据类型更丰富**
   - 原生支持 JSON/JSONB（可以直接查询 JSON 字段）
   - 支持数组类型
   - 支持全文搜索（tsvector/tsquery）
   - 支持 UUID、网络地址类型等

3. **并发控制更先进**
   - MVCC（多版本并发控制）实现更好
   - 读写性能在高并发场景下更稳定

4. **扩展性强**
   - 支持自定义函数、操作符、数据类型
   - 丰富的扩展生态（PostGIS、pg_trgm 等）

5. **开源且社区活跃**
   - 完全开源，无商业版本限制
   - 社区驱动，功能更新快

#### MySQL 的优势
1. **生态成熟**
   - 使用广泛，资料和教程多
   - 第三方工具支持好（phpMyAdmin、Navicat 等）
   - 中文社区资源丰富

2. **简单易用**
   - 配置相对简单
   - 学习曲线平缓
   - 运维经验积累多

3. **性能优化成熟**
   - 在简单查询场景下性能优秀
   - 针对 Web 应用优化多
   - 主从复制方案成熟

4. **云服务支持好**
   - 阿里云、腾讯云等国内云服务商支持完善
   - 托管服务（RDS）成熟稳定

5. **存储引擎选择**
   - InnoDB（事务支持）
   - MyISAM（读多写少场景）

#### 对于个人博客项目的建议

**选择 PostgreSQL 的理由：**
- ✅ 博客内容可能包含 JSON 数据（标签、元数据等），PostgreSQL 的 JSONB 支持更好
- ✅ 未来可能需要全文搜索功能，PostgreSQL 的全文搜索更强大
- ✅ 与 Prisma 集成更顺畅，类型支持更完善
- ✅ 如果使用 Vercel、Railway 等平台，PostgreSQL 支持更好
- ✅ 代码示例和文档中 PostgreSQL 更常见

**选择 MySQL 的理由：**
- ✅ 如果你更熟悉 MySQL
- ✅ 使用国内云服务（阿里云、腾讯云），MySQL RDS 更成熟
- ✅ 团队已有 MySQL 运维经验
- ✅ 项目简单，不需要 PostgreSQL 的高级特性

**结论：两者都可以，根据你的情况选择！**

---

### 方案一：PostgreSQL + Prisma（推荐）
**优点：**
- Prisma 提供类型安全的 ORM
- 优秀的开发体验和自动补全
- 支持迁移管理
- 适合关系型数据（文章、标签、用户等）
- JSON 类型支持好，适合存储文章元数据

**安装：**
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

**Prisma Schema 配置：**
```prisma
datasource db {
  provider = "postgresql"  // 或 "mysql"
  url      = env("DATABASE_URL")
}
```

### 方案一（变体）：MySQL + Prisma
**优点：**
- 与 PostgreSQL 方案相同，只是数据库不同
- 如果更熟悉 MySQL，可以无缝切换
- Prisma 对 MySQL 支持同样完善

**安装：**
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

**Prisma Schema 配置：**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**注意：** MySQL 8.0+ 推荐使用，对 JSON 类型支持更好。

### 方案二：MongoDB + Mongoose
**优点：**
- 灵活的文档结构
- 适合非结构化数据
- 易于扩展

**安装：**
```bash
npm install mongoose
```

### 方案三：Supabase（快速上手）
**优点：**
- 开箱即用的 PostgreSQL
- 内置认证系统
- 实时订阅功能
- 免费额度充足

**安装：**
```bash
npm install @supabase/supabase-js
```

### 方案四：PlanetScale（MySQL 云服务）
**优点：**
- 基于 MySQL 的 Serverless 数据库
- 无服务器架构，自动扩缩容
- 分支功能（类似 Git 分支）
- 免费额度充足

**安装：**
```bash
npm install @planetscale/database
```

---

## 🗄 数据库设计

### 数据模型（使用 Prisma Schema）

**注意：** 以下 Schema 同时适用于 PostgreSQL 和 MySQL。只需要修改 `datasource db` 中的 `provider` 即可。

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

// PostgreSQL 配置
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 或者 MySQL 配置（二选一）
// datasource db {
//   provider = "mysql"
//   url      = env("DATABASE_URL")
// }

// 文章表
model Post {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  content   String   @db.Text
  summary   String?
  date      DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)

  // 关系
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]
  comments  Comment[]

  @@index([slug])
  @@index([date])
  @@index([published])
}

// 标签表
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  posts     Post[]

  @@index([slug])
}

// 文章-标签关联表（多对多）
model PostTag {
  id     String @id @default(cuid())
  postId String
  tagId  String

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([postId, tagId])
}

// 用户表（用于管理后台）
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // 加密后的密码
  role      String   @default("author") // author, admin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

// 评论表（可选）
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  author    String
  email     String?
  website   String?
  createdAt DateTime @default(now())
  approved  Boolean  @default(false)

  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([approved])
}
```

---

## 🔌 API 设计

### API 路由结构

```
app/
├── api/
│   ├── posts/
│   │   ├── route.ts          # GET /api/posts (获取所有文章)
│   │   └── [slug]/
│   │       └── route.ts      # GET /api/posts/[slug] (获取单篇文章)
│   ├── admin/
│   │   ├── posts/
│   │   │   ├── route.ts      # GET, POST /api/admin/posts
│   │   │   └── [id]/
│   │   │       └── route.ts  # GET, PUT, DELETE /api/admin/posts/[id]
│   │   └── auth/
│   │       └── route.ts      # POST /api/admin/auth (登录)
│   └── tags/
│       └── route.ts          # GET /api/tags
```

### API 端点设计

#### 1. 获取文章列表
```
GET /api/posts
Query Parameters:
  - page: number (分页)
  - limit: number (每页数量)
  - tag: string (按标签筛选)
  - search: string (搜索关键词)

Response:
{
  posts: Post[],
  total: number,
  page: number,
  totalPages: number
}
```

#### 2. 获取单篇文章
```
GET /api/posts/[slug]

Response:
{
  id: string,
  slug: string,
  title: string,
  content: string,
  summary: string,
  date: string,
  tags: Tag[],
  author: User
}
```

#### 3. 创建文章（需要认证）
```
POST /api/admin/posts
Headers:
  Authorization: Bearer <token>

Body:
{
  title: string,
  content: string,
  summary?: string,
  slug?: string,
  tags: string[],
  published: boolean
}
```

#### 4. 更新文章（需要认证）
```
PUT /api/admin/posts/[id]
Headers:
  Authorization: Bearer <token>

Body: (同创建)
```

#### 5. 删除文章（需要认证）
```
DELETE /api/admin/posts/[id]
Headers:
  Authorization: Bearer <token>
```

---

## 📁 项目结构

```
personal-site/
├── prisma/
│   ├── schema.prisma         # 数据库模型定义
│   └── migrations/           # 数据库迁移文件
├── lib/
│   ├── db.ts                 # 数据库连接
│   ├── prisma.ts             # Prisma Client 实例
│   └── auth.ts               # 认证工具函数
├── app/
│   ├── api/                  # API 路由
│   │   ├── posts/
│   │   ├── admin/
│   │   └── tags/
│   ├── admin/                # 管理后台页面
│   │   ├── login/
│   │   ├── posts/
│   │   └── layout.tsx
│   └── blog/                 # 博客页面（保持不变）
└── components/
    └── admin/                # 管理后台组件
```

---

## 🚀 实施步骤

### 第一步：安装依赖和初始化数据库

```bash
# 安装 Prisma
npm install @prisma/client
npm install -D prisma

# 初始化 Prisma
npx prisma init

# 配置环境变量
# .env

# PostgreSQL 连接字符串
DATABASE_URL="postgresql://user:password@localhost:5432/personal_site?schema=public"

# 或者 MySQL 连接字符串（二选一）
# DATABASE_URL="mysql://user:password@localhost:3306/personal_site"
```

**MySQL 连接字符串格式说明：**
- `mysql://用户名:密码@主机:端口/数据库名`
- 默认端口：3306
- 示例：`mysql://root:password123@localhost:3306/personal_site`

**PostgreSQL 连接字符串格式说明：**
- `postgresql://用户名:密码@主机:端口/数据库名?schema=public`
- 默认端口：5432
- 示例：`postgresql://postgres:password123@localhost:5432/personal_site?schema=public`

### 第二步：创建数据库模型

创建 `prisma/schema.prisma` 文件（参考上面的数据模型）

### 第三步：运行数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma migrate dev --name init

# 或者推送到数据库（不创建迁移文件）
npx prisma db push
```

### 第四步：创建数据库连接文件

创建 `lib/prisma.ts` 和 `lib/db.ts`

### 第五步：创建 API 路由

创建 `app/api/posts/route.ts` 等 API 端点

### 第六步：修改现有代码

将 `lib/posts.ts` 中的文件系统读取改为数据库查询

### 第七步：创建管理后台（可选）

创建 `app/admin/` 目录和相关页面

---

## 💻 代码示例

### 1. 数据库连接 (lib/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. API 路由示例 (app/api/posts/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const where: any = {
      published: true,
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
```

### 3. 修改 lib/posts.ts

```typescript
import { prisma } from './prisma'

export interface Post {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  tags: Array<{ name: string; slug: string }>
  draft?: boolean
  content: string
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      tags: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date.toISOString(),
    summary: post.summary || '',
    tags: post.tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    content: post.content,
  }))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      tags: true,
    },
  })

  if (!post) return null

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date.toISOString(),
    summary: post.summary || '',
    tags: post.tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    content: post.content,
  }
}
```

### 4. 管理后台 API (app/api/admin/posts/route.ts)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // 验证认证
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = await prisma.post.findMany({
    include: {
      tags: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  // 验证认证
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, summary, slug, tags, published } = body

  // 创建或查找标签
  const tagConnections = await Promise.all(
    tags.map(async (tagName: string) => {
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

  const post = await prisma.post.create({
    data: {
      title,
      content,
      summary,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      published: published || false,
      authorId: 'your-user-id', // 从 token 中获取
      tags: {
        connect: tagConnections,
      },
    },
    include: {
      tags: true,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
```

---

## 🔐 认证方案

### 方案一：JWT Token（简单）

```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}
```

### 方案二：NextAuth.js（推荐）

```bash
npm install next-auth
```

更安全、功能更完整的认证解决方案。

---

## 📝 数据迁移策略

### 从文件系统迁移到数据库

创建迁移脚本 `scripts/migrate-posts.ts`:

```typescript
import { prisma } from '../lib/prisma'
import { getAllPosts as getFilePosts } from '../lib/posts-fs' // 旧的函数

async function migrate() {
  const filePosts = getFilePosts() // 从文件系统读取

  for (const post of filePosts) {
    // 创建或查找标签
    const tagConnections = await Promise.all(
      post.tags.map(async (tagName) => {
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
        authorId: 'your-user-id',
        tags: {
          connect: tagConnections,
        },
      },
    })
  }
}

migrate()
```

---

## 🎯 推荐实施顺序

1. **阶段一：基础数据库**
   - 安装 Prisma
   - 创建数据库模型
   - 创建数据库连接
   - 迁移现有文章数据

2. **阶段二：API 开发**
   - 创建文章查询 API
   - 修改前端代码使用 API
   - 测试数据流

3. **阶段三：管理后台**
   - 实现认证系统
   - 创建文章管理 API
   - 开发管理后台 UI

4. **阶段四：增强功能**
   - 添加评论功能
   - 添加搜索功能
   - 添加统计功能

---

## 💡 额外建议

1. **使用环境变量**：数据库连接字符串等敏感信息
2. **添加缓存**：使用 Redis 或 Next.js 缓存提升性能
3. **图片存储**：考虑使用云存储（如 Vercel Blob、Cloudinary）
4. **SEO 优化**：保持现有的静态生成优势
5. **备份策略**：定期备份数据库

---

## 📚 参考资源

- [Prisma 文档](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [NextAuth.js](https://next-auth.js.org/)
- [Supabase](https://supabase.com/docs)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)

---

## 🎯 快速选择指南

### 如果你不确定选哪个，按以下问题判断：

1. **你更熟悉哪个数据库？**
   - 熟悉 MySQL → 选 MySQL
   - 熟悉 PostgreSQL → 选 PostgreSQL
   - 都不熟悉 → 推荐 PostgreSQL（功能更强大）

2. **你使用哪个云服务商？**
   - 阿里云/腾讯云 → MySQL RDS 更成熟
   - Vercel/Railway → PostgreSQL 支持更好
   - 自建服务器 → 两者都可以

3. **项目复杂度如何？**
   - 简单博客 → MySQL 足够
   - 需要 JSON 查询、全文搜索 → PostgreSQL
   - 未来可能扩展 → PostgreSQL

4. **团队情况？**
   - 团队熟悉 MySQL → 选 MySQL
   - 新项目/个人项目 → 推荐 PostgreSQL

### 最终建议

**对于个人博客项目：**
- ✅ **推荐 PostgreSQL**：功能更强大，未来扩展性好，与 Prisma 集成更顺畅
- ✅ **MySQL 也可以**：如果你更熟悉，或者使用国内云服务，MySQL 完全够用

**重要提示：** Prisma 对两种数据库的支持都很好，代码几乎完全一样，只是连接字符串和 Schema 中的 `provider` 不同。你可以随时切换！


