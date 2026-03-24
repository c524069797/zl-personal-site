# 后台接口文档

## 概述

本项目使用 Next.js API Routes 构建 RESTful API，提供博客系统、用户认证、评论管理、AI功能等服务。所有 API 都遵循 REST 设计原则，返回 JSON 格式的响应。

## 技术栈

### 后端框架
- **Next.js API Routes** - 服务端 API 路由
- **Prisma** - 数据库 ORM
- **PostgreSQL** - 主数据库
- **Qdrant** - 向量数据库

### 外部服务集成
- **OpenAI API** - AI 功能（摘要生成、内容审核、问答）
- **JWT** - 用户认证令牌

## API 基础信息

### 基础 URL
```
https://yourdomain.com/api
```

### 请求格式
- **Content-Type**: `application/json`
- **认证**: JWT Bearer Token (管理接口需要)

### 响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "error": "错误信息"
}
```

### 错误处理
- **200**: 成功
- **400**: 请求参数错误
- **401**: 未认证
- **403**: 权限不足
- **404**: 资源不存在
- **500**: 服务器错误

## 认证相关 API

### 用户注册

**接口**: `POST /api/auth/register`

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

**响应**:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "用户名",
    "role": "author"
  },
  "token": "jwt_token",
  "message": "注册成功"
}
```

### 用户登录

**接口**: `POST /api/auth/login`

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "用户名",
    "role": "author"
  },
  "token": "jwt_token",
  "message": "登录成功"
}
```

### 获取当前用户信息

**接口**: `GET /api/auth/me`

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**响应**:
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "用户名",
    "role": "author"
  }
}
```

## 文章相关 API

### 获取文章列表

**接口**: `GET /api/posts`

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `tag`: 标签筛选
- `search`: 搜索关键词
- `category`: 分类筛选 (tech/life)

**响应**:
```json
{
  "posts": [
    {
      "id": "post_id",
      "slug": "article-slug",
      "title": "文章标题",
      "date": "2024-01-01T00:00:00.000Z",
      "summary": "文章摘要",
      "category": "tech",
      "tags": [
        {
          "name": "React",
          "slug": "react"
        }
      ],
      "content": "文章内容",
      "author": {
        "id": "author_id",
        "name": "作者名",
        "email": "author@example.com"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

### 获取单篇文章

**接口**: `GET /api/posts/[slug]`

**响应**:
```json
{
  "post": {
    "id": "post_id",
    "slug": "article-slug",
    "title": "文章标题",
    "content": "文章内容",
    "summary": "文章摘要",
    "date": "2024-01-01T00:00:00.000Z",
    "category": "tech",
    "tags": [
      {
        "name": "React",
        "slug": "react"
      }
    ],
    "author": {
      "id": "author_id",
      "name": "作者名"
    }
  }
}
```

### 获取热门文章

**接口**: `GET /api/posts/hot`

**查询参数**:
- `limit`: 返回数量 (默认: 5)

**响应**:
```json
{
  "posts": [
    {
      "id": "post_id",
      "title": "热门文章标题",
      "slug": "article-slug",
      "summary": "文章摘要",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 获取最新文章

**接口**: `GET /api/posts/latest`

**查询参数**:
- `limit`: 返回数量 (默认: 5)

**响应**:
```json
{
  "posts": [
    {
      "id": "post_id",
      "title": "最新文章标题",
      "slug": "article-slug",
      "summary": "文章摘要",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 评论相关 API

### 获取文章评论

**接口**: `GET /api/posts/[slug]/comments`

**响应**:
```json
{
  "comments": [
    {
      "id": "comment_id",
      "author": "评论者",
      "email": "commenter@example.com",
      "website": "https://example.com",
      "content": "评论内容",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "approved": true
    }
  ]
}
```

### 提交评论

**接口**: `POST /api/posts/[slug]/comments`

**请求体**:
```json
{
  "author": "评论者姓名",
  "email": "commenter@example.com",
  "website": "https://example.com",
  "content": "评论内容"
}
```

**响应**:
```json
{
  "comment": {
    "id": "comment_id",
    "author": "评论者姓名",
    "content": "评论内容",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "评论已提交，等待审核"
}
```

## 管理后台 API

### 获取评论管理列表

**接口**: `GET /api/admin/comments`

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `approved`: 审核状态筛选 (true/false)

**响应**:
```json
{
  "comments": [
    {
      "id": "comment_id",
      "author": "评论者",
      "content": "评论内容",
      "approved": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "post": {
        "id": "post_id",
        "slug": "article-slug",
        "title": "文章标题"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

### 审核评论

**接口**: `PUT /api/admin/comments/[id]`

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**请求体**:
```json
{
  "approved": true
}
```

**响应**:
```json
{
  "comment": {
    "id": "comment_id",
    "approved": true
  },
  "message": "评论审核成功"
}
```

### 删除评论

**接口**: `DELETE /api/admin/comments/[id]`

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**响应**:
```json
{
  "message": "评论删除成功"
}
```

### 获取文章管理列表

**接口**: `GET /api/admin/posts`

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `published`: 发布状态筛选 (true/false)

**响应**:
```json
{
  "posts": [
    {
      "id": "post_id",
      "title": "文章标题",
      "slug": "article-slug",
      "published": true,
      "date": "2024-01-01T00:00:00.000Z",
      "category": "tech",
      "author": {
        "name": "作者名"
      }
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

### 创建文章

**接口**: `POST /api/admin/posts`

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "content": "文章内容",
  "summary": "文章摘要",
  "category": "tech",
  "tags": ["React", "JavaScript"],
  "published": true
}
```

**响应**:
```json
{
  "post": {
    "id": "post_id",
    "title": "文章标题",
    "slug": "article-slug",
    "published": true
  },
  "message": "文章创建成功"
}
```

### 更新文章

**接口**: `PUT /api/admin/posts/[id]`

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "title": "更新的文章标题",
  "content": "更新的文章内容",
  "published": true
}
```

**响应**:
```json
{
  "post": {
    "id": "post_id",
    "title": "更新的文章标题"
  },
  "message": "文章更新成功"
}
```

### 删除文章

**接口**: `DELETE /api/admin/posts/[id]`

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**响应**:
```json
{
  "message": "文章删除成功"
}
```

## 标签和分类 API

### 获取所有标签

**接口**: `GET /api/tags`

**响应**:
```json
{
  "tags": [
    {
      "id": "tag_id",
      "name": "React",
      "slug": "react",
      "count": 5
    }
  ]
}
```

### 获取分类统计

**接口**: `GET /api/categories`

**响应**:
```json
{
  "categories": [
    {
      "name": "tech",
      "label": "技术博客",
      "count": 15
    },
    {
      "name": "life",
      "label": "生活记录",
      "count": 8
    }
  ]
}
```

## AI 功能 API

### 生成文章摘要

**接口**: `POST /api/ai/summarize`

**请求体**:
```json
{
  "postId": "post_id",
  "force": false,
  "provider": "deepseek"
}
```

**响应**:
```json
{
  "summary": "文章摘要内容",
  "keywords": ["关键词1", "关键词2"]
}
```

### 智能问答 (RAG)

**接口**: `POST /api/rag/ask`

**请求体**:
```json
{
  "question": "用户问题",
  "provider": "deepseek"
}
```

**响应**:
```json
{
  "answer": "AI生成的答案",
  "sources": [
    {
      "title": "相关文章标题",
      "slug": "article-slug"
    }
  ]
}
```

### 图片类型分析

**接口**: `POST /api/ai/analyze-image`

**请求体**:
```json
{
  "title": "文章标题",
  "summary": "文章摘要"
}
```

**响应**:
```json
{
  "imageType": "react",
  "title": "文章标题"
}
```

## 数据迁移 API

### 迁移文章数据

**接口**: `POST /api/admin/migrate-posts`

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**响应**:
```json
{
  "message": "文章迁移完成",
  "migratedCount": 10
}
```

### 迁移分类字段

**接口**: `POST /api/admin/migrate-category-field`

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**响应**:
```json
{
  "message": "分类字段迁移完成",
  "updatedCount": 15
}
```

### 迁移AI字段

**接口**: `POST /api/admin/migrate-ai-fields`

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**响应**:
```json
{
  "message": "AI字段迁移完成",
  "updatedCount": 20
}
```

## 工具 API

### 数据库连接测试

**接口**: `GET /api/test-db`

**响应**:
```json
{
  "message": "数据库连接成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 生成文章封面图片

**接口**: `POST /api/posts/image`

**请求体**:
```json
{
  "title": "文章标题",
  "type": "react"
}
```

**响应**:
```json
{
  "imageUrl": "https://example.com/generated-image.png"
}
```

## 认证中间件

### 管理员权限验证
```typescript
// 在需要管理员权限的API中使用
const authResult = await requireAdmin(request)
if (authResult.error) {
  return authResult.error
}
```

### JWT验证流程
1. 从请求头获取 `Authorization: Bearer <token>`
2. 验证token有效性
3. 检查用户角色权限
4. 返回用户信息或错误响应

## 错误处理

### 统一错误响应格式
```json
{
  "error": "错误描述",
  "details": "详细错误信息（仅开发环境）",
  "code": "ERROR_CODE"
}
```

### 常见错误码
- `INVALID_TOKEN`: Token无效或过期
- `PERMISSION_DENIED`: 权限不足
- `VALIDATION_ERROR`: 参数验证失败
- `DATABASE_ERROR`: 数据库操作失败
- `EXTERNAL_API_ERROR`: 外部API调用失败

## 性能优化

### 缓存策略
- **数据库查询缓存**: 使用Prisma查询缓存
- **API响应缓存**: Next.js内置缓存
- **静态资源缓存**: CDN缓存策略

### 超时控制
- **AI接口**: 60秒超时
- **数据库查询**: 30秒超时
- **外部API调用**: 50秒超时

### 并发控制
- **Promise.race**: 防止长时间运行的请求
- **连接池**: Prisma连接池管理
- **资源限制**: 限制并发请求数量

## 安全措施

### 身份验证
- JWT Token认证
- 密码加密存储（bcrypt）
- 会话管理

### 输入验证
- 请求参数验证
- SQL注入防护
- XSS防护

### AI内容审核
- 评论自动审核
- 垃圾信息检测
- 攻击性内容过滤

## 监控和日志

### 日志记录
- **API调用日志**: 请求/响应记录
- **错误日志**: 异常情况记录
- **性能日志**: 响应时间监控

### 健康检查
- **数据库连接检查**
- **外部服务状态检查**
- **API响应时间监控**

## 部署配置

### 环境变量
```env
# 数据库
DATABASE_URL=postgresql://...

# AI服务
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...

# 向量数据库
QDRANT_URL=http://localhost:6333

# JWT
JWT_SECRET=your_secret_key

# 站点配置
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### CORS配置
```typescript
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ]
  },
}
```

## API 版本控制

### 当前版本
- **v1**: 基础API功能
- **路径**: `/api/v1/*` (计划中)

### 向后兼容
- 保持现有API接口不变
- 新功能使用新版本路径
- 逐步迁移旧版本API

## 开发和测试

### API测试
```bash
# 运行API测试
npm run test:api

# 单独测试某个接口
curl -X GET "http://localhost:3000/api/posts" \
  -H "Content-Type: application/json"
```

### 文档更新
- API变更时同步更新文档
- 维护API变更日志
- 提供API演练示例




