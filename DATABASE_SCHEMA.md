# 数据库设计文档

## 概述

本项目使用 PostgreSQL 作为主数据库，Prisma 作为 ORM，同时集成 Qdrant 向量数据库用于 AI 搜索功能。数据库设计遵循关系型数据库规范化原则，支持博客系统、用户管理、评论系统和 AI 功能。

## 技术栈

### 数据库系统
- **PostgreSQL 15+**: 主数据库
- **Prisma**: 数据库 ORM 和迁移工具
- **Qdrant**: 向量数据库 (用于 AI 搜索)

### 连接配置
```env
DATABASE_URL="postgresql://username:password@localhost:5432/personal_site?schema=public"
QDRANT_URL="http://localhost:6333"
```

## 数据模型

### 用户表 (User)

```sql
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // 加密后的密码
  role      String   @default("author") // author, admin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]

  @@map("users")
}
```

**字段说明**:
- `id`: 全局唯一标识符 (CUID)
- `email`: 用户邮箱，唯一
- `name`: 用户昵称，可选
- `password`: bcrypt 加密后的密码
- `role`: 用户角色 (author: 作者, admin: 管理员)
- `createdAt/updatedAt`: 创建和更新时间戳

**索引**:
- 主键索引: `id`
- 唯一索引: `email`

### 文章表 (Post)

```sql
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
  category  String?  @default("tech") // tech(技术博客) 或 life(生活记录)

  // AI相关字段
  aiSummary      String?   @db.Text // AI生成的摘要
  aiKeywords     String?   // AI提取的关键词，逗号分隔
  aiSummaryAt    DateTime? // 摘要生成时间
  vectorized     Boolean   @default(false) // 是否已向量化

  // 关系
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags      PostTag[]
  comments  Comment[]

  @@index([slug])
  @@index([date])
  @@index([published])
  @@index([vectorized])
  @@index([category])
  @@map("posts")
}
```

**字段说明**:
- `id`: 全局唯一标识符
- `slug`: URL友好的唯一标识符
- `title`: 文章标题
- `content`: 文章内容 (长文本)
- `summary`: 文章摘要
- `date`: 发布日期
- `published`: 发布状态
- `category`: 分类 (tech/life)

**AI字段**:
- `aiSummary`: AI 生成的摘要
- `aiKeywords`: AI 提取的关键词
- `aiSummaryAt`: 摘要生成时间
- `vectorized`: 向量化状态

**索引**:
- 唯一索引: `slug`
- 普通索引: `date`, `published`, `vectorized`, `category`

### 标签表 (Tag)

```sql
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  posts     PostTag[]

  @@index([slug])
  @@map("tags")
}
```

**字段说明**:
- `id`: 全局唯一标识符
- `name`: 标签名称，唯一
- `slug`: URL友好的标识符，唯一

**索引**:
- 唯一索引: `name`, `slug`

### 文章-标签关联表 (PostTag)

```sql
model PostTag {
  id     String @id @default(cuid())
  postId String
  tagId  String

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([postId, tagId])
  @@map("post_tags")
}
```

**字段说明**:
- `postId`: 文章ID
- `tagId`: 标签ID

**约束**:
- 复合唯一约束: `(postId, tagId)` - 防止重复关联

### 评论表 (Comment)

```sql
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  author    String
  email     String?
  website   String?
  createdAt DateTime @default(now())
  approved  Boolean  @default(false)

  // AI审核相关字段
  aiChecked     Boolean   @default(false) // 是否已AI审核
  aiSpamScore   Float?    // 垃圾信息评分 (0-1)
  aiToxicScore  Float?    // 攻击性内容评分 (0-1)
  aiAutoReply   String?   @db.Text // AI生成的自动回复
  aiCheckedAt   DateTime? // AI审核时间

  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([approved])
  @@index([aiChecked])
  @@map("comments")
}
```

**字段说明**:
- `content`: 评论内容
- `author`: 评论者姓名
- `email`: 评论者邮箱
- `website`: 评论者网站
- `approved`: 审核状态

**AI审核字段**:
- `aiChecked`: 是否已审核
- `aiSpamScore`: 垃圾信息评分
- `aiToxicScore`: 攻击性内容评分
- `aiAutoReply`: AI自动回复
- `aiCheckedAt`: 审核时间

**索引**:
- 普通索引: `postId`, `approved`, `aiChecked`

## 数据库关系图

```
User (1) ──── (N) Post
  │                │
  │                ├── (1:N) Comment
  │                └── (N:N) Tag (通过 PostTag)
  │
  └── 管理权限控制
```

### 关系说明

1. **User → Post**: 一对多关系
   - 一个用户可以发表多篇文章
   - 删除用户时级联删除其所有文章

2. **Post → Comment**: 一对多关系
   - 一篇文章可以有多个评论
   - 删除文章时级联删除其所有评论

3. **Post ↔ Tag**: 多对多关系
   - 通过 `PostTag` 中间表关联
   - 一篇文章可以有多个标签
   - 一个标签可以属于多篇文章

## 向量数据库设计 (Qdrant)

### 集合结构

```typescript
interface VectorDocument {
  id: string
  vector: number[] // OpenAI embedding 向量 (1536维)
  payload: {
    postId: string      // 关联的文章ID
    content: string     // 文章块内容
    chunkIndex: number  // 块索引
    totalChunks: number // 总块数
  }
}
```

### 索引配置

```yaml
# Qdrant 集合配置
collection_name: posts_chunks
vector_size: 1536
distance: Cosine  # 余弦相似度
```

### 分块策略

1. **文本预处理**: 移除Markdown格式，保留纯文本
2. **分块大小**: 500字符/块，重叠50字符
3. **向量化**: 使用 OpenAI text-embedding-ada-002
4. **存储**: 每个块独立存储，包含元数据

## 数据库迁移

### Prisma 迁移文件结构

```
prisma/migrations/
├── 20241112054654_init/          # 初始迁移
│   └── migration.sql
├── 20241117083304_add_ai_fields/ # AI字段迁移
│   └── migration.sql
└── migration_lock.toml
```

### 迁移命令

```bash
# 生成迁移
npx prisma migrate dev --name add_ai_fields

# 应用迁移
npx prisma migrate deploy

# 重置数据库
npx prisma migrate reset
```

## 数据访问层

### Prisma 客户端配置

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 查询示例

```typescript
// 获取已发布的文章
const posts = await prisma.post.findMany({
  where: { published: true },
  include: {
    author: true,
    tags: {
      include: { tag: true }
    }
  },
  orderBy: { date: 'desc' }
})

// 创建新文章
const post = await prisma.post.create({
  data: {
    title: '文章标题',
    content: '文章内容',
    authorId: userId,
    tags: {
      create: [
        { tag: { connect: { slug: 'react' } } }
      ]
    }
  }
})
```

## 性能优化

### 数据库索引策略

1. **查询优化索引**:
   - `posts(slug)`: 文章详情页查询
   - `posts(date)`: 文章列表排序
   - `posts(published)`: 已发布文章筛选
   - `posts(category)`: 分类筛选

2. **关联查询索引**:
   - `comments(postId)`: 文章评论查询
   - `post_tags(postId, tagId)`: 标签关联查询

### 查询优化技巧

```typescript
// 使用 select 限制字段
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    date: true,
    summary: true,
  },
  where: { published: true }
})

// 分页查询优化
const posts = await prisma.post.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { date: 'desc' }
})
```

## 数据完整性

### 外键约束

- **Cascade 删除**: 删除用户时自动删除其文章和相关评论
- **Restrict 更新**: 防止破坏引用完整性

### 数据验证

```typescript
// 应用层验证
if (!email || !password) {
  throw new Error('邮箱和密码不能为空')
}

if (password.length < 6) {
  throw new Error('密码长度至少为6位')
}
```

## 备份和恢复

### 数据库备份

```bash
# PostgreSQL 备份
pg_dump personal_site > backup.sql

# Prisma 备份
npx prisma db push --preview-feature
```

### 向量数据库备份

```bash
# Qdrant 快照
curl -X POST "http://localhost:6333/collections/posts_chunks/snapshots"
```

## 监控和维护

### 数据库监控

```sql
-- 查询慢查询
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- 表大小统计
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 定期维护

```sql
-- 清理过期数据
DELETE FROM comments
WHERE created_at < NOW() - INTERVAL '1 year'
  AND approved = false;

-- 重新索引
REINDEX TABLE posts;
REINDEX TABLE comments;
```

## 开发环境设置

### 本地数据库初始化

```bash
# 安装 PostgreSQL
brew install postgresql

# 启动服务
brew services start postgresql

# 创建数据库
createdb personal_site

# 运行迁移
npx prisma migrate dev

# 生成 Prisma 客户端
npx prisma generate
```

### Qdrant 初始化

```bash
# Docker 启动 Qdrant
docker run -p 6333:6333 qdrant/qdrant

# 创建集合
curl -X PUT "http://localhost:6333/collections/posts_chunks" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    }
  }'
```

## 安全考虑

### 数据加密

- **密码加密**: 使用 bcrypt 哈希
- **敏感数据**: 不明文存储敏感信息

### 访问控制

```sql
-- 创建只读用户
CREATE USER readonly_user WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE personal_site TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### SQL注入防护

- **参数化查询**: Prisma 自动处理
- **输入验证**: 应用层验证所有输入
- **最小权限原则**: API只授予必要权限

## 扩展性考虑

### 分表策略

```sql
-- 按年份分表 (如果文章量很大)
CREATE TABLE posts_2024 PARTITION OF posts
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE posts_2025 PARTITION OF posts
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 读写分离

```typescript
// 读写分离配置
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_READ, // 读库
    },
  },
})

// 写操作使用写库
const writePrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_WRITE, // 写库
    },
  },
})
```

### 缓存层

- **Redis缓存**: 热门文章和标签缓存
- **CDN缓存**: 静态资源缓存
- **应用缓存**: API响应缓存

## 故障排除

### 常见问题

1. **连接超时**
   ```bash
   # 检查数据库状态
   pg_isready -h localhost -p 5432 -U username

   # 检查连接池
   npx prisma studio
   ```

2. **迁移失败**
   ```bash
   # 重置迁移
   npx prisma migrate reset --force

   # 手动修复
   npx prisma db push --force-reset
   ```

3. **向量搜索失败**
   ```bash
   # 检查 Qdrant 状态
   curl http://localhost:6333/health

   # 重新创建集合
   curl -X DELETE "http://localhost:6333/collections/posts_chunks"
   ```




