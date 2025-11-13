# 后台服务架构说明

## 🏗️ 当前架构

### 技术栈

你的项目使用的是 **Next.js 全栈架构**，前后端都在同一个 Next.js 应用中：

1. **前端**：Next.js React 组件（SSR/SSG）
2. **后端 API**：Next.js API Routes（内置在 Next.js 中）
3. **数据库**：PostgreSQL + Prisma ORM
4. **部署**：可以部署到 Vercel、腾讯云等平台

### 架构图

```
┌─────────────────────────────────────┐
│         Next.js 应用                 │
│  ┌─────────────┐  ┌──────────────┐  │
│  │   前端页面   │  │   API Routes │  │
│  │  (React)    │  │  (后端API)   │  │
│  └─────────────┘  └──────────────┘  │
│         │                │           │
└─────────┼────────────────┼───────────┘
          │                │
          │                ▼
          │        ┌──────────────┐
          │        │   Prisma     │
          │        │     ORM      │
          │        └──────────────┘
          │                │
          └────────────────┼───────────┐
                           ▼           │
                    ┌──────────────┐   │
                    │  PostgreSQL  │   │
                    │   数据库      │   │
                    └──────────────┘   │
                                       │
                    ┌──────────────────┘
                    │
                    ▼
            (部署到云平台)
```

### 当前 API 端点

**公开 API（无需认证）：**
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/[slug]` - 获取单篇文章

**管理后台 API（计划中，未实现）：**
- `POST /api/admin/auth` - 登录
- `GET /api/admin/posts` - 获取所有文章（需认证）
- `POST /api/admin/posts` - 创建文章（需认证）
- `PUT /api/admin/posts/[id]` - 更新文章（需认证）
- `DELETE /api/admin/posts/[id]` - 删除文章（需认证）

---

## 📦 模块说明

### 1. Next.js API Routes

**位置**：`app/api/`

**特点**：
- Next.js 内置的 API 路由系统
- 无需单独的后端服务器
- 自动处理路由、请求、响应
- 支持 Serverless 部署

**示例**：
```typescript
// app/api/posts/route.ts
export async function GET(request: NextRequest) {
  // 处理 GET 请求
  return NextResponse.json({ data: '...' })
}
```

### 2. Prisma ORM

**位置**：`lib/prisma.ts`

**作用**：
- 数据库连接管理
- 类型安全的数据库查询
- 自动生成 TypeScript 类型

### 3. 数据库模型

**位置**：`prisma/schema.prisma`

**包含的表**：
- `users` - 用户表
- `posts` - 文章表
- `tags` - 标签表
- `post_tags` - 文章-标签关联表
- `comments` - 评论表

---

## 🚀 部署方案

### 方案一：Vercel（推荐）⭐

**优点**：
- Next.js 官方推荐平台
- 零配置部署
- 自动 HTTPS
- 全球 CDN
- 免费额度充足
- 支持 Serverless Functions（API Routes）

**架构**：
```
Vercel 平台
├── Next.js 应用（前端 + API Routes）
│   ├── 静态页面（SSG）
│   ├── 服务端渲染（SSR）
│   └── API Routes（Serverless Functions）
└── 外部数据库（Supabase/Vercel Postgres/其他）
```

#### 部署步骤

1. **准备数据库（云数据库）**
   - 推荐：Supabase、Vercel Postgres、Railway Postgres
   - 获取数据库连接字符串

2. **部署到 Vercel**
   ```bash
   # 方式一：通过网页
   # 1. 访问 https://vercel.com
   # 2. 导入 GitHub 仓库
   # 3. 配置环境变量
   # 4. 部署

   # 方式二：通过 CLI
   npm i -g vercel
   vercel login
   vercel
   ```

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   DATABASE_URL=你的数据库连接字符串
   NEXT_PUBLIC_SITE_URL=https://你的域名.com
   ```

4. **配置构建命令**
   Vercel 会自动检测 Next.js，但确保 `vercel.json` 包含：
   ```json
   {
     "buildCommand": "npx prisma generate && npm run build"
   }
   ```

5. **运行数据库迁移**
   - 在 Vercel 部署后，需要运行迁移
   - 可以在构建命令中添加：`npx prisma migrate deploy`
   - 或使用 Vercel 的 Post Deploy Hook

---

### 方案二：腾讯云 Serverless（云函数）

**优点**：
- 国内访问速度快
- 按量付费
- 自动扩缩容

**架构**：
```
腾讯云 Serverless
├── API Gateway（API 网关）
├── SCF（云函数）- Next.js API Routes
└── 外部数据库（腾讯云 PostgreSQL/MySQL）
```

#### 部署步骤

1. **安装 Serverless Framework**
   ```bash
   npm install -g serverless
   ```

2. **配置 serverless.yml**
   创建 `serverless.yml`：
   ```yaml
   service: personal-site

   provider:
     name: tencent
     runtime: nodejs18
     region: ap-guangzhou
     credentials: ~/.tencent/credentials

   functions:
     api:
       handler: index.handler
       events:
         - apigw:
             path: /{proxy+}
             method: ANY
   ```

3. **创建入口文件**
   需要适配 Next.js 到云函数格式

4. **部署**
   ```bash
   serverless deploy
   ```

**注意**：Next.js 部署到云函数需要特殊配置，比较复杂。

---

### 方案三：腾讯云服务器（CVM）

**优点**：
- 完全控制
- 适合已备案域名
- 国内访问快

**架构**：
```
腾讯云 CVM
├── Nginx（反向代理）
├── Node.js 进程（PM2）
│   └── Next.js 应用（前端 + API）
└── 本地/云数据库（PostgreSQL）
```

#### 部署步骤

1. **购买服务器**
   - 推荐配置：2核4G，Ubuntu 22.04

2. **安装 Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **安装 PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/仓库.git
   cd 仓库名
   npm install
   ```

5. **配置环境变量**
   ```bash
   nano .env
   # 添加 DATABASE_URL 等
   ```

6. **构建项目**
   ```bash
   npm run build
   ```

7. **启动应用**
   ```bash
   pm2 start npm --name "personal-site" -- start
   pm2 save
   pm2 startup
   ```

8. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name 你的域名.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **配置 SSL**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d 你的域名.com
   ```

---

## 🗄️ 数据库部署

### 选项一：Vercel Postgres（如果使用 Vercel）

1. 在 Vercel 项目中添加 Postgres 数据库
2. 自动配置 `DATABASE_URL`
3. 免费额度：256MB 存储，60 小时计算时间

### 选项二：Supabase（推荐）

1. 注册 https://supabase.com
2. 创建项目
3. 获取连接字符串：
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```
4. 免费额度：500MB 数据库，2GB 带宽

### 选项三：腾讯云数据库 PostgreSQL

1. 登录腾讯云控制台
2. 创建 PostgreSQL 实例
3. 配置白名单（允许 Vercel IP 访问）
4. 获取连接字符串

### 选项四：Railway Postgres

1. 注册 https://railway.app
2. 创建 PostgreSQL 服务
3. 自动配置连接字符串
4. 免费额度：$5/月

---

## 🔧 部署配置

### Vercel 配置（vercel.json）

```json
{
  "version": 2,
  "buildCommand": "npx prisma generate && npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

### 环境变量配置

**开发环境（.env.local）**：
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/personal_site?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**生产环境（Vercel/腾讯云）**：
```env
DATABASE_URL="postgresql://user:pass@云数据库地址:5432/personal_site?schema=public&sslmode=require"
NEXT_PUBLIC_SITE_URL="https://你的域名.com"
```

---

## 📋 部署检查清单

### Vercel 部署

- [ ] 代码已推送到 GitHub
- [ ] 在 Vercel 导入项目
- [ ] 配置环境变量（DATABASE_URL, NEXT_PUBLIC_SITE_URL）
- [ ] 配置数据库（Vercel Postgres 或外部数据库）
- [ ] 运行数据库迁移
- [ ] 配置自定义域名
- [ ] 测试 API 端点
- [ ] 测试网站功能

### 腾讯云服务器部署

- [ ] 购买服务器
- [ ] 安装 Node.js 和 PM2
- [ ] 克隆项目
- [ ] 配置环境变量
- [ ] 构建项目
- [ ] 启动应用
- [ ] 配置 Nginx
- [ ] 配置 SSL 证书
- [ ] 配置域名 DNS
- [ ] 测试网站功能

---

## 🎯 推荐方案

### 对于个人博客项目

**推荐：Vercel + Supabase**

**理由**：
1. ✅ 部署最简单，零配置
2. ✅ 免费额度充足
3. ✅ 自动 HTTPS 和 CDN
4. ✅ 全球访问速度快
5. ✅ 支持自定义域名
6. ✅ 自动部署（Git push 触发）

**步骤**：
1. 在 Supabase 创建数据库
2. 在 Vercel 导入 GitHub 仓库
3. 配置环境变量
4. 部署完成！

---

## 📚 相关文档

- `DEPLOYMENT_GUIDE.md` - 详细部署指南
- `DEPLOY_CHECKLIST.md` - 部署检查清单
- `SETUP_DATABASE.md` - 数据库设置指南

