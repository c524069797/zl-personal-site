# 部署指南

## 📋 部署前准备

### 1. 确保代码已提交到 Git

```bash
git add .
git commit -m "准备部署"
git push origin main
```

### 2. 准备环境变量

确保以下环境变量已准备好：
- `DATABASE_URL` - 数据库连接字符串
- `NEXT_PUBLIC_SITE_URL` - 网站 URL（部署后更新）

---

## 🚀 部署方案选择

### 方案一：Vercel（推荐，最简单）⭐

**优点：**
- 零配置部署
- 自动 HTTPS
- 全球 CDN
- 与 Next.js 完美集成
- 免费额度充足

**缺点：**
- 国内访问可能较慢
- 使用自定义域名需要备案（如果域名在国内）

#### 部署步骤：

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置环境变量**
   - 在项目设置中添加环境变量：
     ```
     DATABASE_URL=你的数据库连接字符串
     NEXT_PUBLIC_SITE_URL=https://你的域名.com
     ```

4. **配置数据库**
   - 推荐使用 Vercel Postgres（在 Vercel 项目中添加）
   - 或使用其他云数据库（见下方数据库部署部分）

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成

6. **配置自定义域名**
   - 在项目设置 → Domains 中添加你的腾讯云域名
   - 按照提示配置 DNS 记录：
     ```
     类型: CNAME
     名称: @ 或 www
     值: cname.vercel-dns.com
     ```
   - 在腾讯云 DNS 解析中添加该记录

7. **SSL 证书**
   - Vercel 会自动为你的域名配置 SSL 证书

---

### 方案二：Railway（推荐，支持自定义域名）⭐

**优点：**
- 简单易用
- 支持自定义域名
- 内置 PostgreSQL
- 免费额度充足

**缺点：**
- 国内访问可能较慢

#### 部署步骤：

1. **注册 Railway 账号**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库

3. **配置环境变量**
   - 在项目设置中添加：
     ```
     DATABASE_URL=你的数据库连接字符串
     NEXT_PUBLIC_SITE_URL=https://你的域名.com
     ```

4. **添加 PostgreSQL 数据库（可选）**
   - 在项目中点击 "New" → "Database" → "Add PostgreSQL"
   - Railway 会自动创建并配置 `DATABASE_URL`

5. **配置自定义域名**
   - 在项目设置 → Settings → Networking
   - 点击 "Generate Domain" 生成临时域名
   - 或添加自定义域名：
     - 点击 "Custom Domain"
     - 输入你的域名
     - 按照提示配置 DNS：
       ```
       类型: CNAME
       名称: @ 或 www
       值: 提供的 CNAME 值
       ```

6. **部署**
   - Railway 会自动检测并部署
   - 查看部署日志确认成功

---

### 方案三：腾讯云服务器（适合已备案域名）

**优点：**
- 国内访问速度快
- 完全控制
- 适合已备案域名

**缺点：**
- 需要自己配置服务器
- 需要维护和更新

#### 部署步骤：

1. **购买腾讯云服务器**
   - 推荐配置：2核4G，Ubuntu 22.04
   - 购买后获取公网 IP

2. **连接服务器**
   ```bash
   ssh root@你的服务器IP
   ```

3. **安装 Node.js 和 PM2**
   ```bash
   # 安装 Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # 安装 PM2
   sudo npm install -g pm2

   # 安装 Nginx
   sudo apt-get update
   sudo apt-get install -y nginx
   ```

4. **克隆项目**
   ```bash
   # 安装 Git
   sudo apt-get install -y git

   # 克隆项目
   git clone https://github.com/你的用户名/你的仓库.git
   cd 你的仓库名

   # 安装依赖
   npm install
   ```

5. **配置环境变量**
   ```bash
   # 创建 .env 文件
   nano .env
   ```
   添加：
   ```
   DATABASE_URL=你的数据库连接字符串
   NEXT_PUBLIC_SITE_URL=https://你的域名.com
   NODE_ENV=production
   ```

6. **构建项目**
   ```bash
   npm run build
   ```

7. **使用 PM2 启动**
   ```bash
   pm2 start npm --name "personal-site" -- start
   pm2 save
   pm2 startup
   ```

8. **配置 Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/personal-site
   ```
   添加配置：
   ```nginx
   server {
       listen 80;
       server_name 你的域名.com www.你的域名.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   启用配置：
   ```bash
   sudo ln -s /etc/nginx/sites-available/personal-site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **配置 SSL 证书（使用 Let's Encrypt）**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d 你的域名.com -d www.你的域名.com
   ```

10. **配置域名 DNS**
    - 在腾讯云 DNS 解析中添加 A 记录：
      ```
      类型: A
      名称: @
      值: 你的服务器IP
      ```
    - 添加 www 记录：
      ```
      类型: A
      名称: www
      值: 你的服务器IP
      ```

---

### 方案四：腾讯云 Serverless（云函数 + API 网关）

**优点：**
- 按量付费
- 自动扩缩容
- 适合小流量网站

**缺点：**
- 配置较复杂
- 冷启动可能较慢

#### 部署步骤：

1. **安装 Serverless Framework**
   ```bash
   npm install -g serverless
   ```

2. **配置 serverless.yml**
   创建 `serverless.yml` 文件（需要根据腾讯云文档配置）

3. **部署**
   ```bash
   serverless deploy
   ```

---

## 🗄 数据库部署

### 选项一：Vercel Postgres（如果使用 Vercel）

1. 在 Vercel 项目中点击 "Storage"
2. 选择 "Create Database" → "Postgres"
3. 自动配置 `DATABASE_URL` 环境变量

### 选项二：Supabase（推荐，免费额度大）

1. 注册 https://supabase.com
2. 创建新项目
3. 在项目设置 → Database → Connection string 获取连接字符串
4. 格式：`postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 选项三：Railway Postgres（如果使用 Railway）

1. 在 Railway 项目中添加 PostgreSQL 数据库
2. 自动配置 `DATABASE_URL`

### 选项四：腾讯云数据库 PostgreSQL

1. 登录腾讯云控制台
2. 进入 "云数据库 PostgreSQL"
3. 创建实例
4. 获取连接信息：
   ```
   DATABASE_URL=postgresql://用户名:密码@主机:端口/数据库名?sslmode=require
   ```

### 选项五：其他云数据库

- **AWS RDS**
- **Google Cloud SQL**
- **Azure Database**
- **阿里云 RDS**

---

## 🔧 部署后配置

### 1. 运行数据库迁移

如果使用云数据库，需要在部署后运行迁移：

**Vercel:**
- 在项目设置中添加构建命令：
  ```json
  {
    "buildCommand": "npx prisma generate && npx prisma migrate deploy && npm run build"
  }
  ```

**Railway:**
- 在项目设置中添加启动命令：
  ```
  npx prisma migrate deploy && npm start
  ```

**服务器:**
```bash
cd /path/to/your/project
npx prisma migrate deploy
```

### 2. 迁移现有数据

如果要从文件系统迁移数据到数据库，可以创建一个迁移脚本：

```typescript
// scripts/migrate-posts.ts
import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

async function migrate() {
  // 创建默认用户
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: 'changeme', // 记得修改！
      role: 'admin',
    },
  })

  // 读取 markdown 文件
  const postsDir = path.join(process.cwd(), 'content/posts')
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))

  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { data, content: body } = matter(content)
    const slug = file.replace(/\.md$/, '')

    // 创建或查找标签
    const tagConnections = await Promise.all(
      (data.tags || []).map(async (tagName: string) => {
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
    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: data.title,
        content: body,
        summary: data.summary || '',
        date: new Date(data.date),
        published: !data.draft,
        authorId: user.id,
        tags: {
          create: tagConnections.map(tag => ({
            tagId: tag.id,
          })),
        },
      },
    })
  }

  console.log('Migration completed!')
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

运行迁移：
```bash
npx tsx scripts/migrate-posts.ts
```

---

## 🌐 域名配置（腾讯云）

### 1. 在腾讯云 DNS 解析中添加记录

登录腾讯云控制台 → 云解析 DNS → 找到你的域名

#### 如果使用 Vercel:
```
类型: CNAME
主机记录: @
记录值: cname.vercel-dns.com
TTL: 600

类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com
TTL: 600
```

#### 如果使用 Railway:
```
类型: CNAME
主机记录: @
记录值: [Railway 提供的 CNAME 值]
TTL: 600
```

#### 如果使用自己的服务器:
```
类型: A
主机记录: @
记录值: [你的服务器IP]
TTL: 600

类型: A
主机记录: www
记录值: [你的服务器IP]
TTL: 600
```

### 2. 等待 DNS 生效

DNS 记录通常需要几分钟到几小时生效，可以使用以下命令检查：

```bash
# 检查 DNS 解析
nslookup 你的域名.com
# 或
dig 你的域名.com
```

### 3. 验证 HTTPS

部署平台通常会自动配置 SSL 证书，等待几分钟后访问 `https://你的域名.com` 验证。

---

## 🔄 持续部署（CI/CD）

### GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
```

---

## 📊 监控和日志

### Vercel
- 自动提供访问日志和错误日志
- 在项目 Dashboard 中查看

### Railway
- 在项目 Dashboard 中查看日志
- 可以设置告警

### 服务器
```bash
# 查看 PM2 日志
pm2 logs personal-site

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 常见问题

### 1. 数据库连接失败
- 检查 `DATABASE_URL` 环境变量是否正确
- 检查数据库是否允许外部连接
- 检查防火墙设置

### 2. 域名无法访问
- 检查 DNS 解析是否正确
- 等待 DNS 生效（可能需要几小时）
- 检查服务器防火墙是否开放 80/443 端口

### 3. 构建失败
- 检查环境变量是否配置完整
- 查看构建日志定位错误
- 确保所有依赖都已安装

### 4. 网站显示空白
- 检查浏览器控制台错误
- 检查服务器日志
- 验证 API 路由是否正常

---

## 📚 推荐部署流程

1. **开发环境测试**
   - 本地测试所有功能
   - 确保数据库连接正常

2. **选择部署平台**
   - 推荐：Vercel（最简单）或 Railway（支持自定义域名）

3. **配置数据库**
   - 使用云数据库（Supabase、Vercel Postgres 等）

4. **部署应用**
   - 连接 GitHub 仓库
   - 配置环境变量
   - 部署

5. **配置域名**
   - 在部署平台添加自定义域名
   - 在腾讯云 DNS 配置解析

6. **运行迁移**
   - 执行数据库迁移
   - 导入现有数据（如有）

7. **验证**
   - 访问网站验证功能
   - 检查 HTTPS 证书
   - 测试所有页面

---

## 💡 最佳实践

1. **使用环境变量管理敏感信息**
2. **定期备份数据库**
3. **设置监控和告警**
4. **使用 CDN 加速静态资源**
5. **启用 HTTPS**
6. **配置错误追踪（如 Sentry）**

---

## 🎯 快速开始（推荐方案）

**最简单的方式：Vercel + Supabase**

1. 在 Supabase 创建数据库，获取连接字符串
2. 在 Vercel 导入 GitHub 仓库
3. 配置环境变量（`DATABASE_URL` 和 `NEXT_PUBLIC_SITE_URL`）
4. 部署
5. 在 Vercel 添加自定义域名
6. 在腾讯云 DNS 配置 CNAME 记录
7. 完成！

---

需要我帮你配置具体的部署方案吗？

