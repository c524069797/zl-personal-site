# 生产环境部署指南

## 📋 部署前准备

### 1. 确保代码已提交

```bash
git add .
git commit -m "准备部署到生产环境"
git push origin main
```

### 2. 准备数据库

选择一个云数据库服务（推荐 Supabase 或 Vercel Postgres）

---

## 🚀 方案一：部署到 Vercel（推荐，最简单）

### 第一步：准备云数据库

#### 选项 A：使用 Supabase（推荐）

1. **注册 Supabase**
   - 访问 https://supabase.com
   - 使用 GitHub 账号登录

2. **创建项目**
   - 点击 "New Project"
   - 填写项目名称
   - 选择区域（推荐：Southeast Asia (Singapore)）
   - 设置数据库密码（记住这个密码！）
   - 点击 "Create new project"

3. **获取数据库连接字符串**
   - 等待项目创建完成（约 2 分钟）
   - 进入项目 → Settings → Database
   - 找到 "Connection string" → "URI"
   - 复制连接字符串，格式如下：
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
     ```
   - 将 `[YOUR-PASSWORD]` 替换为你设置的密码

#### 选项 B：使用 Vercel Postgres

1. 在 Vercel 项目中添加 Postgres（见下方步骤）

### 第二步：部署到 Vercel

#### 方式一：通过网页部署（推荐）

1. **访问 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Next.js（自动检测）
   - Root Directory: `./`（默认）
   - Build Command: `npx prisma generate && npm run build`（已配置在 vercel.json）
   - Output Directory: `.next`（默认）
   - Install Command: `npm install`（默认）

4. **配置环境变量**
   点击 "Environment Variables"，添加：

   ```
   名称: DATABASE_URL
   值: 你的 Supabase 连接字符串
   环境: Production, Preview, Development（全选）
   ```

   ```
   名称: NEXT_PUBLIC_SITE_URL
   值: https://你的域名.com（或先使用 Vercel 提供的域名）
   环境: Production, Preview, Development（全选）
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-5 分钟）

6. **运行数据库迁移**

   部署完成后，需要运行数据库迁移。有两种方式：

   **方式一：在 Vercel 的部署日志中运行**
   - 在 Vercel 项目页面，点击 "Deployments"
   - 点击最新的部署
   - 点击 "Functions" 标签
   - 在终端中运行：
     ```bash
     npx prisma migrate deploy
     ```

   **方式二：使用 Vercel CLI（推荐）**
   ```bash
   # 安装 Vercel CLI
   npm i -g vercel

   # 登录
   vercel login

   # 链接项目
   vercel link

   # 运行迁移（使用生产环境变量）
   vercel env pull .env.production
   export $(cat .env.production | xargs)
   npx prisma migrate deploy
   ```

   **方式三：在本地运行（需要数据库允许外部连接）**
   ```bash
   # 设置环境变量
   export DATABASE_URL="你的 Supabase 连接字符串"

   # 运行迁移
   npx prisma migrate deploy
   ```

#### 方式二：通过 CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

### 第三步：配置自定义域名

1. **在 Vercel 添加域名**
   - 进入项目 → Settings → Domains
   - 点击 "Add Domain"
   - 输入你的域名（如：example.com）
   - 点击 "Add"

2. **配置 DNS 记录**
   - Vercel 会显示需要配置的 DNS 记录
   - 登录腾讯云控制台 → 云解析 DNS
   - 找到你的域名
   - 添加 CNAME 记录：
     ```
     类型: CNAME
     主机记录: @
     记录值: cname.vercel-dns.com（Vercel 会提供具体值）
     TTL: 600
     ```
   - 添加 www 记录（可选）：
     ```
     类型: CNAME
     主机记录: www
     记录值: cname.vercel-dns.com
     TTL: 600
     ```

3. **等待 DNS 生效**
   - 通常需要 5-30 分钟
   - 使用 `nslookup 你的域名.com` 检查

4. **SSL 证书**
   - Vercel 会自动为你的域名配置 SSL 证书
   - 等待几分钟后，访问 https://你的域名.com

### 第四步：验证部署

1. **访问网站**
   - 首页：https://你的域名.com
   - 博客：https://你的域名.com/blog
   - API：https://你的域名.com/api/posts

2. **检查功能**
   - [ ] 页面正常显示
   - [ ] 文章列表正常
   - [ ] 文章详情正常
   - [ ] API 返回数据
   - [ ] HTTPS 证书正常

---

## 🏢 方案二：部署到腾讯云服务器

### 第一步：购买服务器

1. **登录腾讯云控制台**
   - 访问 https://console.cloud.tencent.com

2. **购买 CVM 实例**
   - 进入 "云服务器 CVM"
   - 点击 "新建"
   - 选择配置：
     - 地域：选择离你最近的地域
     - 机型：标准型 S5（2核4G 足够）
     - 镜像：Ubuntu 22.04 LTS
     - 系统盘：50GB SSD
   - 配置网络和安全组（开放 80、443、22 端口）
   - 设置密码或 SSH 密钥
   - 购买

### 第二步：连接服务器

```bash
# 使用 SSH 连接
ssh root@你的服务器IP

# 或使用密码
ssh root@你的服务器IP
# 输入密码
```

### 第三步：安装 Node.js

```bash
# 更新系统
sudo apt-get update

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 第四步：安装 PM2

```bash
sudo npm install -g pm2
```

### 第五步：安装 Nginx

```bash
sudo apt-get install -y nginx
```

### 第六步：克隆项目

```bash
# 安装 Git
sudo apt-get install -y git

# 克隆项目
cd /var/www
sudo git clone https://github.com/你的用户名/你的仓库.git
sudo chown -R $USER:$USER 你的仓库名
cd 你的仓库名
```

### 第七步：安装依赖和构建

```bash
# 安装依赖
npm install

# 创建 .env 文件
nano .env
```

在 `.env` 文件中添加：
```env
DATABASE_URL="你的数据库连接字符串"
NEXT_PUBLIC_SITE_URL="https://你的域名.com"
NODE_ENV=production
```

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# 构建项目
npm run build
```

### 第八步：启动应用

```bash
# 使用 PM2 启动
pm2 start npm --name "personal-site" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 运行输出的命令（通常是 sudo env PATH=...）
```

### 第九步：配置 Nginx

```bash
# 创建 Nginx 配置
sudo nano /etc/nginx/sites-available/personal-site
```

添加以下内容：
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

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/personal-site /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 第十步：配置 SSL 证书

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d 你的域名.com -d www.你的域名.com

# 自动续期（已自动配置）
sudo certbot renew --dry-run
```

### 第十一步：配置域名 DNS

在腾讯云 DNS 解析中添加 A 记录：

```
类型: A
主机记录: @
记录值: 你的服务器IP
TTL: 600

类型: A
主机记录: www
记录值: 你的服务器IP
TTL: 600
```

### 第十二步：配置数据库

#### 选项 A：使用腾讯云数据库 PostgreSQL

1. **创建数据库实例**
   - 登录腾讯云控制台
   - 进入 "云数据库 PostgreSQL"
   - 创建实例
   - 配置白名单（添加你的服务器 IP）

2. **获取连接字符串**
   ```
   postgresql://用户名:密码@主机:端口/数据库名?sslmode=require
   ```

#### 选项 B：在服务器上安装 PostgreSQL

```bash
# 安装 PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 创建数据库
sudo -u postgres createdb personal_site

# 创建用户
sudo -u postgres psql
CREATE USER youruser WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE personal_site TO youruser;
\q
```

---

## 🗄️ 数据库部署选项对比

| 选项 | 优点 | 缺点 | 价格 |
|------|------|------|------|
| **Supabase** | 免费额度大、简单易用 | 国外服务 | 免费（500MB） |
| **Vercel Postgres** | 与 Vercel 集成好 | 免费额度较小 | 免费（256MB） |
| **Railway** | 简单、支持分支 | 国外服务 | $5/月免费额度 |
| **腾讯云 PostgreSQL** | 国内访问快 | 需要付费 | 约 ¥50/月起 |
| **自建 PostgreSQL** | 完全控制 | 需要维护 | 服务器成本 |

---

## 🔄 持续部署（CI/CD）

### 使用 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

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
        continue-on-error: true

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**配置 Secrets**：
- 在 GitHub 仓库 → Settings → Secrets and variables → Actions
- 添加：
  - `DATABASE_URL`
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

---

## 📊 部署后验证

### 检查清单

- [ ] 网站可以访问
- [ ] HTTPS 证书正常
- [ ] 博客列表正常显示
- [ ] 文章详情正常显示
- [ ] API 端点返回数据
- [ ] 数据库连接正常
- [ ] 暗黑模式正常
- [ ] 移动端显示正常

### 测试 API

```bash
# 测试文章列表 API
curl https://你的域名.com/api/posts

# 测试单篇文章 API
curl https://你的域名.com/api/posts/hello-world
```

---

## 🐛 常见问题

### 问题 1：数据库连接失败

**原因**：数据库不允许外部连接

**解决**：
- Supabase：检查 IP 白名单设置
- 腾讯云：在安全组中添加白名单
- 自建：检查 PostgreSQL 的 `pg_hba.conf` 配置

### 问题 2：构建失败

**原因**：环境变量未配置

**解决**：
- 检查 Vercel 环境变量配置
- 确保 `DATABASE_URL` 正确

### 问题 3：迁移失败

**原因**：数据库表已存在

**解决**：
```bash
# 重置数据库（会删除所有数据）
npx prisma migrate reset

# 或使用 db push（不创建迁移文件）
npx prisma db push
```

### 问题 4：域名无法访问

**原因**：DNS 未生效或配置错误

**解决**：
- 检查 DNS 记录是否正确
- 等待 DNS 生效（最多 48 小时）
- 使用 `nslookup` 检查解析

---

## 📚 相关文档

- `BACKEND_ARCHITECTURE.md` - 后台架构说明
- `DEPLOYMENT_GUIDE.md` - 部署指南