# 部署和运维文档

## 概述

本项目支持多种部署方式，从简单的 Vercel 托管到复杂的自托管服务器。本文档提供完整的部署、运维和监控指南。

## 技术栈要求

### 系统要求
- **Node.js**: 18.0 或更高版本
- **数据库**: PostgreSQL 15+
- **向量数据库**: Qdrant (可选，用于 AI 搜索)
- **内存**: 至少 512MB RAM
- **存储**: 至少 1GB 可用空间

### 网络要求
- **出站连接**: 访问外部 AI API (OpenAI, DeepSeek)
- **数据库连接**: 稳定的数据库网络连接
- **域名**: 可选，用于自定义域名访问

## 部署方案对比

| 方案 | 难度 | 成本 | 维护 | 性能 | 推荐度 |
|------|------|------|------|------|--------|
| Vercel | ⭐⭐⭐ | 💰💰 | 🔧 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Railway | ⭐⭐⭐ | 💰💰 | 🔧 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 腾讯云服务器 | ⭐⭐ | 💰💰💰 | 🔧🔧🔧 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Docker | ⭐⭐ | 💰 | 🔧🔧 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Serverless | ⭐ | 💰 | 🔧 | ⭐⭐⭐ | ⭐⭐ |

## 快速部署 (推荐方案)

### 使用 Vercel + Supabase

#### 1. 准备工作
```bash
# 确保代码已提交
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. 创建 Supabase 数据库
1. 访问 [supabase.com](https://supabase.com) 注册账号
2. 创建新项目
3. 在项目设置 → Database → Connection string 获取连接信息
4. 记录 `DATABASE_URL`

#### 3. 部署到 Vercel
1. 访问 [vercel.com](https://vercel.com) 注册账号
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量：
   ```
   DATABASE_URL=postgresql://postgres:[密码]@db.[项目ID].supabase.co:5432/postgres
   NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
   JWT_SECRET=your-super-secret-key
   ```
5. 点击 "Deploy"

#### 4. 配置自定义域名
1. 在 Vercel 项目设置中添加域名
2. 在域名提供商处配置 DNS：
   ```
   类型: CNAME
   名称: @
   值: cname.vercel-dns.com
   ```

#### 5. 运行数据库迁移
在 Vercel 项目设置中修改构建命令：
```json
{
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && npm run build"
}
```

## 传统部署方案

### Docker 部署

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# 安装系统依赖
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产镜像
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 创建用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=base --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/personal_site
      - NEXT_PUBLIC_SITE_URL=http://localhost:3000
      - JWT_SECRET=your-secret-key
    depends_on:
      - db
      - qdrant
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=personal_site
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  qdrant:
    image: qdrant/qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    restart: unless-stopped

volumes:
  postgres_data:
  qdrant_data:
```

#### 部署命令
```bash
# 构建和启动
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

### 腾讯云服务器部署

#### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install -y curl wget git htop ufw

# 配置防火墙
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

#### 2. 安装 Node.js
```bash
# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### 3. 安装 PM2
```bash
sudo npm install -g pm2

# 配置 PM2 启动脚本
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

#### 4. 部署应用
```bash
# 克隆代码
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# 安装依赖
npm ci

# 创建环境变量文件
nano .env
```

添加环境变量：
```env
DATABASE_URL=postgresql://user:password@db-host:5432/personal_site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
JWT_SECRET=your-super-secret-key
NODE_ENV=production
```

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# 构建应用
npm run build

# 启动应用
pm2 start npm --name "personal-site" -- start
pm2 save
```

#### 5. 配置 Nginx
```bash
# 安装 Nginx
sudo apt install -y nginx

# 创建配置
sudo nano /etc/nginx/sites-available/personal-site
```

添加配置：
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态文件缓存
    location /_next/static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/personal-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. 配置 SSL 证书
```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 设置自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

## 数据库部署和配置

### PostgreSQL 配置优化

#### 生产环境配置
```sql
-- 连接配置
ALTER SYSTEM SET max_connections = '100';
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = '0.9';
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = '100';

-- 重新加载配置
SELECT pg_reload_conf();
```

#### 备份策略
```bash
# 创建备份脚本
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/personal_site_$DATE.sql"

mkdir -p $BACKUP_DIR

pg_dump -h localhost -U user -d personal_site > $BACKUP_FILE

# 压缩备份
gzip $BACKUP_FILE

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

#### 定时备份
```bash
# 添加到 crontab
crontab -e
# 每天凌晨2点备份
0 2 * * * /path/to/backup-script.sh
```

### Qdrant 向量数据库配置

#### Docker 配置
```yaml
version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:v1.7.4
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant_data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__SERVICE__GRPC_PORT=6334
    restart: unless-stopped
```

#### 性能优化
```bash
# 增加内存限制
docker run -m 2g qdrant/qdrant

# 配置持久化存储
-v /opt/qdrant_data:/qdrant/storage
```

## 监控和日志

### 应用监控

#### PM2 监控
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs personal-site

# 监控资源使用
pm2 monit

# 重启应用
pm2 restart personal-site
```

#### Vercel 监控
- 实时日志查看
- 性能指标监控
- 错误追踪
- 自动告警

### 数据库监控

#### PostgreSQL 监控
```sql
-- 活跃连接数
SELECT count(*) FROM pg_stat_activity;

-- 慢查询
SELECT query, total_time, calls
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- 表大小统计
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### 监控脚本
```bash
#!/bin/bash
# 健康检查脚本

# 检查应用是否运行
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 应用正常"
else
    echo "❌ 应用异常"
    # 发送告警
fi

# 检查数据库连接
if psql -h localhost -U user -d personal_site -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ 数据库正常"
else
    echo "❌ 数据库异常"
    # 发送告警
fi
```

### 日志聚合

#### 日志轮转配置
```bash
# 配置 logrotate
sudo nano /etc/logrotate.d/personal-site

/var/log/personal-site/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

#### 集中日志 (ELK Stack)
```yaml
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: logstash:8.11.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

## 性能优化

### 应用层优化

#### Next.js 优化配置
```typescript
// next.config.ts
export default {
  // 启用 SWC 编译器
  swcMinify: true,

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 实验性功能
  experimental: {
    // 优化包大小
    optimizePackageImports: ['antd', '@ant-design/icons'],
    // 优化字体
    optimizeFonts: true,
  },

  // 压缩
  compress: true,

  // 性能预算
  performance: {
    hints: 'warning',
  },
}
```

#### 缓存策略
```typescript
// API 路由缓存
export const revalidate = 3600 // 1小时

// 页面缓存
export const revalidate = 86400 // 24小时
```

### 数据库优化

#### 索引优化
```sql
-- 创建复合索引
CREATE INDEX CONCURRENTLY idx_posts_published_date
ON posts(published, date DESC);

CREATE INDEX CONCURRENTLY idx_posts_category_published
ON posts(category, published);

-- 全文搜索索引
CREATE INDEX CONCURRENTLY idx_posts_content_fts
ON posts USING gin(to_tsvector('chinese', content));
```

#### 查询优化
```typescript
// 使用 select 限制字段
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    date: true,
  },
  where: { published: true },
  take: 10,
})

// 分页优化
const posts = await prisma.post.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { date: 'desc' },
})
```

### 前端优化

#### Bundle 分析
```bash
# 安装分析工具
npm install --save-dev @next/bundle-analyzer

# 添加脚本
"analyze": "ANALYZE=true npm run build"
```

#### 代码分割
```typescript
// 动态导入组件
const AdminPanel = dynamic(() => import('../components/AdminPanel'), {
  loading: () => <div>加载中...</div>,
})

// 路由级分割
const BlogPage = dynamic(() => import('../pages/blog'), {
  loading: () => <div>加载中...</div>,
})
```

## 安全配置

### 网络安全

#### 防火墙配置
```bash
# UFW 配置
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

#### SSL/TLS 配置
```nginx
# Nginx SSL 配置
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### 应用安全

#### 环境变量安全
```bash
# 不要提交敏感信息
echo ".env*" >> .gitignore

# 使用强密码
JWT_SECRET="$(openssl rand -hex 32)"
```

#### API 安全
```typescript
// API 密钥验证
export async function requireApiKey(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }
}
```

## 备份和恢复

### 自动化备份

#### 数据库备份脚本
```bash
#!/bin/bash
# 数据库备份脚本

BACKUP_DIR="/var/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="personal_site"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$DATE.sql"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump -h localhost -U user -d $DB_NAME > $BACKUP_FILE

# 压缩
gzip $BACKUP_FILE

# 上传到云存储 (可选)
# aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/

# 清理旧备份 (保留7天)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

#### 文件备份
```bash
#!/bin/bash
# 文件备份脚本

BACKUP_DIR="/var/backups/files"
SOURCE_DIR="/var/www/personal-site"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/files_$DATE.tar.gz"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份文件
tar -czf $BACKUP_FILE -C $SOURCE_DIR .

# 清理旧备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "File backup completed: $BACKUP_FILE"
```

### 灾难恢复

#### 数据库恢复
```bash
# 停止应用
pm2 stop personal-site

# 创建新数据库 (如果需要)
createdb -U user new_personal_site

# 恢复数据
gunzip -c backup.sql.gz | psql -U user -d new_personal_site

# 重启应用
pm2 start personal-site
```

#### 应用回滚
```bash
# Git 回滚
git log --oneline -10
git reset --hard <commit-hash>
git push --force

# PM2 回滚
pm2 revert personal-site
```

## 扩展和高可用

### 水平扩展

#### 负载均衡
```nginx
upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

#### 数据库读写分离
```typescript
// 读写分离配置
const readPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_READ },
  },
})

const writePrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_WRITE },
  },
})
```

### 垂直扩展

#### 缓存层 (Redis)
```typescript
// Redis 配置
import { Redis } from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL)

// 缓存装饰器
export function cache(ttl: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const key = `${propertyKey}:${JSON.stringify(args)}`
      const cached = await redis.get(key)
      if (cached) return JSON.parse(cached)

      const result = await method.apply(this, args)
      await redis.setex(key, ttl, JSON.stringify(result))
      return result
    }
  }
}
```

#### CDN 配置
```typescript
// next.config.ts
export default {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-account/',
  },
}
```

## 运维自动化

### CI/CD 流水线

#### GitHub Actions
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

### 基础设施即代码

#### Terraform 配置
```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-12345678"
  instance_type = "t3.micro"

  tags = {
    Name = "Personal-Site"
  }
}
```

### 监控告警

#### Prometheus 配置
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'personal-site'
    static_configs:
      - targets: ['localhost:3000']
```

#### Grafana 仪表板
- 应用性能指标
- 数据库性能指标
- 系统资源使用
- 错误率统计

## 故障排除

### 常见问题

#### 应用无法启动
```bash
# 检查日志
pm2 logs personal-site

# 检查端口占用
netstat -tulpn | grep :3000

# 检查环境变量
printenv | grep DATABASE_URL

# 检查磁盘空间
df -h
```

#### 数据库连接失败
```bash
# 测试连接
psql -h localhost -U user -d personal_site -c "SELECT 1;"

# 检查 PostgreSQL 服务
sudo systemctl status postgresql

# 检查连接数限制
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

#### 性能问题
```bash
# CPU 使用率
top -p $(pgrep -f "next")

# 内存使用
pm2 monit

# 磁盘 I/O
iotop

# 网络连接
netstat -antp | grep :3000 | wc -l
```

#### 内存泄漏
```bash
# 使用 heapdump
npm install heapdump
# 在代码中添加
require('heapdump').writeSnapshot()
```

### 应急响应

#### 快速回滚
```bash
# Git 回滚
git reset --hard HEAD~1
pm2 restart personal-site

# 数据库回滚
psql -d personal_site -f backup.sql
```

#### 流量限制
```nginx
# Nginx 限流
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
}
```

## 成本优化

### 云资源优化

#### 自动扩缩容
```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: personal-site-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: personal-site
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

#### 预留实例
- 选择合适的实例类型
- 使用竞价实例处理非关键负载
- 配置自动停止闲置实例

### 应用优化

#### 代码分割
```typescript
// 按路由分割
const BlogPage = dynamic(() => import('../pages/blog'))
const AdminPage = dynamic(() => import('../pages/admin'))
```

#### 资源压缩
```typescript
// next.config.ts
export default {
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

## 总结

本部署和运维文档提供了从简单部署到复杂生产环境的完整指南。根据项目规模和需求选择合适的部署方案：

- **小型项目**: Vercel + Supabase
- **中型项目**: Railway 或腾讯云服务器
- **大型项目**: Docker + Kubernetes + 云数据库

定期进行性能监控、备份和安全更新，确保应用稳定运行。




