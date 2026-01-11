# CI/CD 完整方案指南

## 📋 当前状态分析

### 已有配置
- ✅ GitHub Actions workflows (`.github/workflows/`)
- ✅ Vercel 自动部署配置 (`vercel.json`)
- ✅ Husky + lint-staged (pre-commit hooks)
- ✅ 基础部署流程

### 需要改进的地方
- ⚠️ 缺少 PR 检查流程
- ⚠️ 缺少类型检查步骤
- ⚠️ 缺少测试流程（如果未来添加测试）
- ⚠️ 缺少多环境支持
- ⚠️ 缺少部署回滚机制

---

## 🎯 CI/CD 方案设计

### 方案一：GitHub Actions + Vercel（推荐）⭐

**架构图：**
```
代码推送 → GitHub Actions (CI) → Vercel (CD) → 生产环境
    ↓
  PR检查 → Lint/TypeCheck/Build → 预览部署
```

**优点：**
- 与现有 Vercel 部署完美集成
- GitHub Actions 免费额度充足
- 支持预览部署
- 自动 HTTPS 和 CDN

**工作流程：**

1. **Pull Request 流程**
   ```
   PR创建 → 代码检查 → 预览部署 → PR评论显示预览链接
   ```

2. **Main 分支流程**
   ```
   代码推送 → 完整检查 → 生产部署 → 数据库迁移 → 通知
   ```

---

## 🔧 实现方案

### 1. PR 检查 Workflow

**功能：**
- 代码 Lint 检查
- TypeScript 类型检查
- 构建验证
- 预览部署到 Vercel

**触发条件：**
- PR 创建/更新
- 手动触发

### 2. 生产部署 Workflow

**功能：**
- 完整代码检查
- 生产环境构建
- 部署到 Vercel 生产环境
- 数据库迁移
- 部署通知

**触发条件：**
- 推送到 main 分支
- 手动触发

### 3. 多环境支持（可选）

**环境：**
- `development` - 开发环境
- `preview` - 预览环境（PR）
- `production` - 生产环境

---

## 📝 详细配置

### 环境变量配置

在 GitHub Secrets 中配置：

```
# Vercel 相关
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx

# 数据库（用于迁移）
DATABASE_URL=xxx

# 通知（可选）
SLACK_WEBHOOK_URL=xxx
DINGTALK_WEBHOOK_URL=xxx

# 其他
NEXT_PUBLIC_SITE_URL=https://www.clczl.asia
```

### Workflow 文件结构

```
.github/workflows/
├── pr-check.yml          # PR 检查
├── deploy-production.yml # 生产部署
└── deploy-preview.yml    # 预览部署（可选）
```

---

## 🚀 快速开始

### 步骤 1：获取 Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 创建新的 Token
3. 复制 Token 到 GitHub Secrets

### 步骤 2：获取 Vercel 项目信息

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目目录中链接项目
vercel link

# 这会生成 .vercel/project.json，包含：
# - projectId
# - orgId
```

### 步骤 3：配置 GitHub Secrets

在 GitHub 仓库设置中添加：
- Settings → Secrets and variables → Actions

添加以下 secrets：
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DATABASE_URL`
- `SLACK_WEBHOOK_URL` (可选)

### 步骤 4：使用优化后的 Workflows

使用我们提供的优化后的 workflow 文件替换现有配置。

---

## 📊 Workflow 详细说明

### PR 检查 Workflow

**执行步骤：**
1. ✅ 检出代码
2. ✅ 设置 Node.js 环境
3. ✅ 安装依赖
4. ✅ 运行 ESLint
5. ✅ TypeScript 类型检查
6. ✅ 构建项目（验证构建成功）
7. ✅ 部署到 Vercel Preview
8. ✅ 在 PR 中评论预览链接

**优势：**
- 在合并前发现问题
- 自动生成预览环境
- 减少生产环境错误

### 生产部署 Workflow

**执行步骤：**
1. ✅ 检出代码
2. ✅ 设置 Node.js 环境
3. ✅ 安装依赖
4. ✅ 运行 ESLint
5. ✅ TypeScript 类型检查
6. ✅ 生成 Prisma Client
7. ✅ 构建项目
8. ✅ 部署到 Vercel 生产环境
9. ✅ 运行数据库迁移（Prisma migrations）
10. ✅ **自动执行博客文章迁移**（同步 content/posts 到数据库）
11. ✅ 健康检查
12. ✅ 发送部署通知

**优势：**
- 完整的质量检查
- 自动化部署流程
- 自动数据库迁移
- 部署状态通知

---

## 🔄 部署流程优化

### 当前流程
```
代码推送 → 手动部署 → 手动迁移 → 验证
```

### 优化后流程
```
代码推送 → 自动检查 → 自动部署 → 自动迁移 → 自动通知
```

### 回滚机制

**Vercel 自动回滚：**
- Vercel 会自动保留之前的部署版本
- 如果新部署失败，会自动回滚到上一个版本
- 可以在 Vercel Dashboard 手动回滚

**手动回滚步骤：**
1. 访问 Vercel Dashboard
2. 进入 Deployments
3. 找到之前的成功部署
4. 点击 "..." → "Promote to Production"

---

## 🛡️ 质量保证

### 代码检查

1. **ESLint**
   - 代码风格检查
   - 潜在错误检测
   - 自动修复（部分）

2. **TypeScript**
   - 类型检查
   - 编译错误检测

3. **构建验证**
   - 确保代码可以成功构建
   - 检测构建时错误

### 部署前检查清单

- [ ] 代码已通过 Lint 检查
- [ ] TypeScript 类型检查通过
- [ ] 构建成功
- [ ] 环境变量已配置
- [ ] 数据库迁移脚本已准备

---

## 📈 监控和通知

### 部署通知

**支持的通知渠道：**
- Slack
- 钉钉
- 邮件（GitHub Actions 默认）
- Discord（可选）

### 监控指标

**建议监控：**
- 部署成功率
- 构建时间
- 部署时间
- 错误率

---

## 🔐 安全最佳实践

1. **Secrets 管理**
   - ✅ 使用 GitHub Secrets 存储敏感信息
   - ❌ 不要在代码中硬编码密钥

2. **权限控制**
   - ✅ 限制 Vercel Token 权限
   - ✅ 使用最小权限原则

3. **代码审查**
   - ✅ 所有代码变更通过 PR
   - ✅ 至少一人审查后才能合并

---

## 🎯 进阶优化（可选）

### 1. 添加测试

如果未来添加测试：

```yaml
- name: Run tests
  run: npm test
```

### 2. 性能监控

- 集成 Lighthouse CI
- 性能预算检查
- Bundle 大小监控

### 3. 多环境部署

- `staging` 环境用于预发布测试
- `production` 环境用于生产

### 4. 数据库备份

在部署前自动备份数据库：

```yaml
- name: Backup database
  run: |
    # 备份脚本
```

### 5. 健康检查

部署后自动运行健康检查：

```yaml
- name: Health check
  run: |
    curl -f https://www.clczl.asia/api/health || exit 1
```

---

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel 部署文档](https://vercel.com/docs)
- [Prisma 迁移文档](https://www.prisma.io/docs/guides/migrate)

---

## ❓ 常见问题

### Q: 如何跳过 CI/CD？

**A:** 在提交信息中添加 `[skip ci]`：
```bash
git commit -m "docs: 更新文档 [skip ci]"
```

### Q: 如何手动触发部署？

**A:** 在 GitHub Actions 页面点击 "Run workflow"

### Q: 部署失败怎么办？

**A:** 
1. 查看 GitHub Actions 日志
2. 查看 Vercel 部署日志
3. 检查环境变量配置
4. 验证数据库连接

### Q: 如何回滚？

**A:** 在 Vercel Dashboard 中手动回滚到之前的部署

---

## 🎉 总结

通过实施这个 CI/CD 方案，你将获得：

✅ **自动化部署** - 代码推送后自动部署  
✅ **质量保证** - 自动代码检查和构建验证  
✅ **预览环境** - PR 自动生成预览链接  
✅ **快速反馈** - 部署状态实时通知  
✅ **减少错误** - 部署前自动检查  
✅ **节省时间** - 无需手动部署步骤  

---

需要我帮你实现具体的 workflow 配置吗？

