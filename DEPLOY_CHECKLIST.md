# 部署检查清单 ✅

## 📋 部署前检查

### 代码准备
- [ ] 代码已提交到 Git
- [ ] 代码已推送到 GitHub/GitLab
- [ ] 所有功能在本地测试通过
- [ ] 环境变量已整理好

### 数据库准备
- [ ] 已选择数据库服务（Supabase/Vercel Postgres/腾讯云等）
- [ ] 已创建数据库实例
- [ ] 已获取数据库连接字符串
- [ ] 已测试数据库连接

---

## 🚀 部署步骤（Vercel 推荐）

### 第一步：准备 Vercel 账号
- [ ] 注册 Vercel 账号（https://vercel.com）
- [ ] 使用 GitHub 账号登录

### 第二步：导入项目
- [ ] 在 Vercel 点击 "New Project"
- [ ] 选择你的 GitHub 仓库
- [ ] 确认项目设置

### 第三步：配置环境变量
在 Vercel 项目设置 → Environment Variables 中添加：

- [ ] `DATABASE_URL` = 你的数据库连接字符串
- [ ] `NEXT_PUBLIC_SITE_URL` = https://你的域名.com
- [ ] `NODE_ENV` = production（可选，Vercel 自动设置）

### 第四步：配置数据库
- [ ] 如果使用 Vercel Postgres：
  - [ ] 在项目中添加 Postgres 数据库
  - [ ] 自动配置 `DATABASE_URL`
- [ ] 如果使用外部数据库：
  - [ ] 确保数据库允许外部连接
  - [ ] 测试连接字符串

### 第五步：部署
- [ ] 点击 "Deploy" 按钮
- [ ] 等待构建完成
- [ ] 检查部署日志，确认无错误

### 第六步：运行数据库迁移
- [ ] 在 Vercel 项目设置 → Settings → General
- [ ] 找到 "Build & Development Settings"
- [ ] 确认 Build Command 包含：`npx prisma generate && npm run build`
- [ ] 如果需要手动运行迁移：
  ```bash
  npx prisma migrate deploy
  ```

### 第七步：配置自定义域名
- [ ] 在 Vercel 项目设置 → Domains
- [ ] 点击 "Add Domain"
- [ ] 输入你的腾讯云域名（如：example.com）
- [ ] 按照提示配置 DNS

### 第八步：配置腾讯云 DNS
登录腾讯云控制台 → 云解析 DNS：

- [ ] 找到你的域名
- [ ] 添加 CNAME 记录：
  - 类型：CNAME
  - 主机记录：@
  - 记录值：cname.vercel-dns.com（Vercel 会提供）
  - TTL：600
- [ ] 添加 www 记录（可选）：
  - 类型：CNAME
  - 主机记录：www
  - 记录值：cname.vercel-dns.com
  - TTL：600

### 第九步：等待 DNS 生效
- [ ] 等待 5-30 分钟让 DNS 生效
- [ ] 使用 `nslookup 你的域名.com` 检查解析
- [ ] 访问 https://你的域名.com 验证

### 第十步：验证部署
- [ ] 访问首页，确认正常显示
- [ ] 访问 /blog 页面，确认文章列表正常
- [ ] 访问单篇文章页面，确认内容正常
- [ ] 检查 HTTPS 证书是否生效
- [ ] 测试暗黑模式切换
- [ ] 检查 API 路由：/api/posts

---

## 🗄 数据库迁移（如果有现有文章）

### 迁移现有 Markdown 文章到数据库

- [ ] 创建迁移脚本（参考 SETUP_DATABASE.md）
- [ ] 在本地测试迁移脚本
- [ ] 连接到生产数据库
- [ ] 运行迁移脚本
- [ ] 验证数据已正确导入

---

## 🔧 部署后优化

### 性能优化
- [ ] 检查网站加载速度
- [ ] 启用 Vercel Analytics（可选）
- [ ] 配置图片优化（如果使用 Next.js Image）

### 监控设置
- [ ] 设置错误监控（如 Sentry，可选）
- [ ] 配置访问统计（如 Google Analytics，可选）
- [ ] 设置告警通知（可选）

### 备份
- [ ] 设置数据库自动备份
- [ ] 定期导出数据库备份
- [ ] 保存环境变量配置

---

## 🐛 故障排查

如果遇到问题，检查：

- [ ] 环境变量是否正确配置
- [ ] 数据库连接是否正常
- [ ] DNS 解析是否正确
- [ ] 构建日志是否有错误
- [ ] 浏览器控制台是否有错误

---

## 📝 常用命令

### 本地测试生产构建
```bash
npm run build
npm start
```

### 检查数据库连接
```bash
npx prisma studio
```

### 运行数据库迁移
```bash
npx prisma migrate deploy
```

### 检查 DNS 解析
```bash
nslookup 你的域名.com
dig 你的域名.com
```

---

## 🎯 快速部署命令（参考）

```bash
# 1. 提交代码
git add .
git commit -m "准备部署"
git push origin main

# 2. 在 Vercel 导入项目（通过网页操作）

# 3. 配置环境变量（通过 Vercel 网页操作）

# 4. 部署（Vercel 自动部署）

# 5. 配置域名（通过 Vercel 和腾讯云网页操作）
```

---

## ✅ 部署完成检查

部署完成后，确认以下内容：

- [ ] 网站可以正常访问
- [ ] HTTPS 证书已生效
- [ ] 所有页面正常显示
- [ ] 数据库连接正常
- [ ] API 路由正常工作
- [ ] 移动端显示正常
- [ ] 暗黑模式正常工作

---

**部署完成后，你的网站就可以通过 https://你的域名.com 访问了！** 🎉

