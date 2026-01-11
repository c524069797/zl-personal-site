# CI/CD 快速开始指南

## 🚀 5分钟快速配置

### 步骤 1: 获取 Vercel 凭证

```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录 Vercel
vercel login

# 在项目目录中链接项目
cd /Users/chenzilong/Documents/personal-site
vercel link

# 这会生成 .vercel/project.json，包含项目信息
cat .vercel/project.json
```

**输出示例：**
```json
{
  "projectId": "prj_xxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxx"
}
```

### 步骤 2: 获取 Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 输入名称（如：`github-actions`）
4. 选择过期时间（建议：`No expiration`）
5. 点击 "Create Token"
6. **复制 Token**（只显示一次！）

### 步骤 3: 配置 GitHub Secrets

1. 访问你的 GitHub 仓库
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 secrets：

| Secret 名称 | 值 | 说明 |
|-----------|-----|------|
| `VERCEL_TOKEN` | 从步骤2获取的Token | Vercel API Token |
| `VERCEL_ORG_ID` | 从步骤1的 `orgId` | Vercel 组织ID |
| `VERCEL_PROJECT_ID` | 从步骤1的 `projectId` | Vercel 项目ID |
| `DATABASE_URL` | 你的数据库连接字符串 | PostgreSQL 连接字符串 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.clczl.asia` | 网站URL |
| `SLACK_WEBHOOK_URL` | （可选）Slack Webhook URL | 用于通知 |
| `DINGTALK_WEBHOOK_URL` | （可选）钉钉 Webhook URL | 用于通知 |

### 步骤 4: 验证配置

1. 创建一个测试 PR 或推送到 main 分支
2. 访问 GitHub Actions 页面查看运行状态
3. 如果成功，你会看到：
   - ✅ PR 检查通过
   - ✅ 预览部署链接（PR中）
   - ✅ 生产部署成功（main分支）

---

## 📋 Workflow 说明

### PR 检查 Workflow (`.github/workflows/pr-check.yml`)

**触发时机：**
- 创建或更新 Pull Request
- 手动触发

**执行内容：**
1. ✅ ESLint 检查
2. ✅ TypeScript 类型检查
3. ✅ 构建验证
4. ✅ 自动部署到 Vercel Preview
5. ✅ 在 PR 中评论预览链接

### 生产部署 Workflow (`.github/workflows/deploy-production.yml`)

**触发时机：**
- 推送到 main/master 分支
- 手动触发

**执行内容：**
1. ✅ ESLint 检查
2. ✅ TypeScript 类型检查
3. ✅ 生成 Prisma Client
4. ✅ 构建项目
5. ✅ 部署到 Vercel 生产环境
6. ✅ 执行数据库迁移（Prisma migrations）
7. ✅ **自动执行博客文章迁移**（同步 content/posts 到数据库）
8. ✅ 健康检查
9. ✅ 发送通知

---

## 🔍 故障排查

### 问题 1: Vercel 部署失败

**错误信息：** `Error: Vercel authentication error`

**解决方案：**
1. 检查 `VERCEL_TOKEN` 是否正确
2. 检查 Token 是否过期
3. 重新生成 Token 并更新 Secret

### 问题 2: 数据库迁移失败

**错误信息：** `Prisma migrate deploy failed`

**解决方案：**
1. 检查 `DATABASE_URL` 是否正确
2. 检查数据库是否允许外部连接
3. 检查网络连接

### 问题 3: 构建失败

**错误信息：** `Build failed`

**解决方案：**
1. 查看 GitHub Actions 日志
2. 检查环境变量是否配置完整
3. 本地运行 `npm run build` 验证

### 问题 4: PR 检查不触发

**解决方案：**
1. 确认 PR 目标分支是 `main` 或 `master`
2. 检查 `.github/workflows/pr-check.yml` 文件是否存在
3. 确认文件格式正确（YAML 语法）

---

## 🎯 使用建议

### 开发流程

1. **创建功能分支**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **开发并提交**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   git push origin feature/new-feature
   ```

3. **创建 PR**
   - 在 GitHub 创建 Pull Request
   - CI 会自动运行检查
   - 等待检查通过后合并

4. **合并到 main**
   - 合并 PR 后自动触发生产部署
   - 部署完成后自动执行数据库迁移

### 跳过 CI（不推荐）

如果确实需要跳过 CI（如文档更新），在提交信息中添加：

```bash
git commit -m "docs: 更新文档 [skip ci]"
```

---

## 📊 监控部署状态

### GitHub Actions

访问：`https://github.com/你的用户名/你的仓库/actions`

### Vercel Dashboard

访问：`https://vercel.com/dashboard`

### 部署通知

如果配置了 Slack 或钉钉，部署状态会自动发送通知。

---

## 🔄 回滚部署

### 方法 1: Vercel Dashboard

1. 访问 Vercel Dashboard
2. 进入项目 → Deployments
3. 找到之前的成功部署
4. 点击 "..." → "Promote to Production"

### 方法 2: Vercel CLI

```bash
vercel rollback [deployment-url]
```

---

## ✅ 检查清单

部署前确认：

- [ ] Vercel Token 已配置
- [ ] Vercel 项目信息已配置
- [ ] 数据库连接字符串已配置
- [ ] 所有环境变量已配置
- [ ] 代码已通过本地测试
- [ ] PR 检查已通过

---

## 🎉 完成！

配置完成后，你的 CI/CD 流程将自动运行：

- ✅ 每次 PR 自动检查代码质量
- ✅ 每次 PR 自动生成预览环境
- ✅ 每次合并到 main 自动部署生产环境
- ✅ 自动执行数据库迁移
- ✅ 自动发送部署通知

享受自动化的快乐！🚀

