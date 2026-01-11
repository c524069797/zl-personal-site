# 自动博客文章迁移

## 📋 功能说明

CI/CD 流程已配置为自动执行博客文章迁移。每次部署到生产环境后，系统会自动：

1. ✅ 扫描 `content/posts/` 目录下的所有 Markdown 文件
2. ✅ 将新文章同步到数据库
3. ✅ 更新已存在文章的内容
4. ✅ 自动创建和关联标签
5. ✅ 自动分类文章（tech/life）

## 🔄 工作流程

```
代码推送 → 部署到 Vercel → 自动执行博客迁移 → 完成
```

### 详细步骤

1. **代码推送**
   - 推送到 `main` 或 `master` 分支
   - 或创建 PR 并合并

2. **GitHub Actions 触发**
   - 自动运行 `deploy-production.yml` workflow
   - 执行代码检查、构建、部署

3. **Vercel 部署**
   - 部署完成后，等待 10 秒确保服务就绪

4. **自动执行迁移**
   - 调用 `/api/admin/migrate-posts` API
   - 自动同步所有博客文章到数据库

5. **完成通知**
   - 迁移结果会显示在 GitHub Actions 日志中
   - 如果配置了通知，会发送部署状态

## 📊 迁移内容

### 自动处理

- ✅ **新文章**：自动创建到数据库
- ✅ **已存在文章**：自动更新内容、标签、分类
- ✅ **标签**：自动创建和关联标签
- ✅ **分类**：根据标题和摘要自动分类（tech/life）

### 迁移规则

1. **文章识别**：使用文件名（slug）识别文章
2. **跳过逻辑**：如果文章已存在，会更新而不是跳过
3. **标签处理**：自动创建新标签，关联已有标签
4. **分类逻辑**：优先使用 frontmatter 中的 `category`，否则自动分类

## 🔍 查看迁移结果

### GitHub Actions 日志

1. 访问 GitHub 仓库
2. 进入 **Actions** 标签页
3. 找到最新的部署 workflow
4. 展开 **执行博客文章迁移** 步骤
5. 查看迁移响应和统计信息

### 迁移响应示例

```json
{
  "success": true,
  "message": "博客迁移完成！创建 2 篇，更新 10 篇",
  "created": 2,
  "updated": 10,
  "errors": 0,
  "createdFiles": ["new-post-1.md", "new-post-2.md"],
  "updatedFiles": ["existing-post-1.md", "existing-post-2.md"]
}
```

## 🛠️ 手动执行迁移

如果需要手动执行迁移，可以使用以下方法：

### 方法 1: 通过 API（推荐）

```bash
curl -X POST https://www.clczl.asia/api/admin/migrate-posts
```

### 方法 2: 本地运行脚本

```bash
# 设置环境变量
export DATABASE_URL="your-database-url"

# 运行迁移脚本
npm run migrate:posts
# 或
npx tsx scripts/migrate-posts.ts
```

### 方法 3: 强制更新（更新已存在文章）

```bash
npm run migrate:posts-force
# 或
npx tsx scripts/migrate-posts-force.ts
```

## ⚙️ 配置说明

### Workflow 配置

迁移步骤在以下 workflow 文件中：

- `.github/workflows/deploy-production.yml`
- `.github/workflows/auto-deploy.yml`

### 关键配置

```yaml
- name: 执行博客文章迁移
  if: success()
  run: |
    echo "🚀 开始执行博客文章迁移..."
    sleep 5
    response=$(curl -s -X POST https://www.clczl.asia/api/admin/migrate-posts)
    # ... 处理响应
  continue-on-error: true
```

**说明：**
- `if: success()` - 只在部署成功时执行
- `sleep 5` - 等待部署完成
- `continue-on-error: true` - 迁移失败不影响部署状态

## 🔐 安全说明

### API 路由

`/api/admin/migrate-posts` 路由：
- ✅ 可以安全地多次执行（幂等性）
- ✅ 不会删除已存在的文章
- ✅ 自动跳过不存在的文件
- ✅ 错误处理完善

### 注意事项

1. **默认用户**：迁移会创建或使用 `admin@example.com` 用户
2. **密码安全**：生产环境建议修改默认密码
3. **文件权限**：确保 `content/posts/` 目录可读

## 🐛 故障排查

### 问题 1: 迁移失败

**症状：** GitHub Actions 日志显示迁移失败

**解决方案：**
1. 检查 API 是否可访问：`curl https://www.clczl.asia/api/admin/migrate-posts`
2. 检查 Vercel 部署日志
3. 检查数据库连接是否正常
4. 手动执行迁移脚本验证

### 问题 2: 部分文章未迁移

**症状：** 迁移成功但某些文章未出现在数据库中

**可能原因：**
- 文件格式错误（frontmatter 格式不正确）
- 文件名包含特殊字符
- 文件编码问题

**解决方案：**
1. 检查文件格式是否正确
2. 查看迁移响应中的 `errorFiles` 字段
3. 手动检查问题文件

### 问题 3: 标签未创建

**症状：** 文章迁移成功但标签缺失

**解决方案：**
1. 检查 frontmatter 中的 `tags` 字段格式
2. 确保标签是数组格式：`tags: ["tag1", "tag2"]`
3. 重新执行迁移

## 📈 最佳实践

### 1. 提交新文章

```bash
# 1. 在 content/posts/ 创建新文章
vim content/posts/my-new-post.md

# 2. 提交并推送
git add content/posts/my-new-post.md
git commit -m "feat: 添加新文章"
git push origin main

# 3. CI/CD 会自动执行迁移
```

### 2. 更新已存在文章

```bash
# 1. 编辑文章
vim content/posts/existing-post.md

# 2. 提交并推送
git add content/posts/existing-post.md
git commit -m "docs: 更新文章内容"
git push origin main

# 3. CI/CD 会自动更新数据库中的文章
```

### 3. 批量迁移

如果需要批量迁移大量文章：

1. 将所有 Markdown 文件添加到 `content/posts/`
2. 提交并推送到 GitHub
3. CI/CD 会自动处理所有文件

## ✅ 检查清单

部署前确认：

- [ ] 新文章已添加到 `content/posts/` 目录
- [ ] 文章 frontmatter 格式正确
- [ ] 文件编码为 UTF-8
- [ ] 标签格式正确（数组格式）

部署后验证：

- [ ] 检查 GitHub Actions 日志确认迁移成功
- [ ] 访问网站验证新文章是否显示
- [ ] 检查标签是否正确关联
- [ ] 验证分类是否正确

## 🎉 总结

通过配置自动博客迁移，你可以：

✅ **自动化同步** - 代码推送后自动同步文章到数据库  
✅ **减少手动操作** - 无需手动执行迁移脚本  
✅ **保持一致性** - 确保文件系统和数据库保持一致  
✅ **快速部署** - 新文章可以立即上线  

享受自动化的便利！🚀



