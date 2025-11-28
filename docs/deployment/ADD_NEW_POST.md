# 新增文章部署数据库流程

本文档说明如何将新的博客文章添加到数据库中。

## 📋 前置条件

1. 确保数据库连接正常（`.env` 文件中的 `DATABASE_URL` 已配置）
2. 确保已安装项目依赖：`npm install`
3. 确保 Prisma Client 已生成：`npx prisma generate`

## 🚀 快速开始

### 方法一：使用脚本（推荐）

1. **准备你的 Markdown 文件**
   - 确保文件包含正确的 frontmatter（标题、日期、摘要、标签等）
   - 文件格式示例：
   ```markdown
   ---
   title: "文章标题"
   date: "2025-01-20"
   summary: "文章摘要"
   tags: ["标签1", "标签2"]
   draft: false
   ---

   # 文章内容
   ...
   ```

2. **运行脚本**
   ```bash
   npx tsx scripts/add-new-post.ts <文件路径>
   ```

   例如：
   ```bash
   npx tsx scripts/add-new-post.ts ~/Desktop/my-article.md
   ```

3. **按提示操作**
   - 脚本会自动复制文件到 `content/posts/` 目录
   - 询问博客分类（技术博客/生活记录）
   - 自动导入到数据库

### 方法二：手动操作

1. **复制文件到 content/posts 目录**
   ```bash
   cp your-article.md content/posts/
   ```

2. **运行迁移脚本**
   ```bash
   npx tsx scripts/migrate-posts.ts
   ```

## 📝 文章 Frontmatter 格式

文章必须包含以下 frontmatter 信息：

```yaml
---
title: "文章标题"           # 必需
date: "2025-01-20"          # 必需，格式：YYYY-MM-DD
summary: "文章摘要"         # 可选，但推荐填写
tags: ["标签1", "标签2"]    # 可选
draft: false                # 可选，false=已发布，true=草稿
---
```

### Frontmatter 说明

- **title**: 文章标题（必需）
- **date**: 发布日期（必需），格式：`YYYY-MM-DD`
- **summary**: 文章摘要（可选），用于列表页显示
- **tags**: 标签数组（可选），用于分类和搜索
- **draft**: 是否草稿（可选），`false` 表示已发布，`true` 表示草稿

## 🏷️ 博客分类

博客文章会自动分类为以下两种：

- **技术博客 (tech)**: 包含技术相关关键词的文章
- **生活记录 (life)**: 包含生活、成长、表达等关键词的文章

分类会根据标题和摘要自动判断，也可以通过脚本手动选择。

### 自动分类规则

**技术博客关键词：**
- React、Next.js、Vue、MCP、n8n
- JavaScript、TypeScript、前端、后端、开发、编程
- 框架、库、工具、API、接口、数据库
- 性能、优化、安全、部署、CI/CD、DevOps

**生活记录关键词：**
- 表达、沟通、习惯、成长、自我管理
- 效率、行动、改变、日常、生活
- 工作、职场、团队、协作
- 学习、读书、阅读、笔记

## 🔧 脚本功能

`scripts/add-new-post.ts` 脚本提供以下功能：

1. **文件复制**: 自动将文件复制到 `content/posts/` 目录
2. **分类选择**: 交互式询问博客分类
3. **数据库导入**: 自动导入文章到数据库
4. **标签处理**: 自动创建或关联标签
5. **错误处理**: 友好的错误提示和统计信息

## 📊 导入结果

脚本运行后会显示：

- ✅ 成功导入的文章列表
- ⏭️ 跳过的文章（已存在）
- ❌ 失败的文章及错误信息

## ⚠️ 注意事项

1. **文件命名**: 建议使用英文和连字符，例如：`my-article.md`
2. **Slug 生成**: 如果文章已存在（相同 slug），会跳过导入
3. **标签创建**: 标签会自动创建，无需预先创建
4. **作者信息**: 使用默认作者（admin@example.com）
5. **日期格式**: 确保日期格式正确，否则会使用当前日期

## 🐛 故障排除

### 问题：数据库连接失败

**解决方案：**
1. 检查 `.env` 文件中的 `DATABASE_URL` 是否正确
2. 确保数据库服务正在运行
3. 运行 `npx prisma generate` 重新生成客户端

### 问题：文件已存在

**解决方案：**
- 如果文章已存在，脚本会跳过导入
- 如需更新已存在的文章，请使用 `scripts/migrate-posts-force.ts`

### 问题：分类不正确

**解决方案：**
- 脚本会询问分类，可以手动选择
- 或者修改文章的 frontmatter，添加 `category: "tech"` 或 `category: "life"`

## 📚 相关文档

- [数据库设置指南](../setup/SETUP_DATABASE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [Vercel 部署指南](./DEPLOY_VERCEL.md)

## 💡 示例

### 示例 1：添加技术博客

```bash
# 1. 准备文件 my-react-article.md
---
title: "React Hooks 最佳实践"
date: "2025-01-20"
summary: "深入探讨 React Hooks 的使用技巧和最佳实践"
tags: ["React", "前端", "Hooks"]
draft: false
---

# React Hooks 最佳实践
...

# 2. 运行脚本
npx tsx scripts/add-new-post.ts my-react-article.md

# 3. 选择分类：技术博客 (tech)
```

### 示例 2：添加生活记录

```bash
# 1. 准备文件 daily-thoughts.md
---
title: "提升表达能力的三个技巧"
date: "2025-01-20"
summary: "分享提升表达能力的实用方法和技巧"
tags: ["表达能力", "沟通技巧", "个人成长"]
draft: false
---

# 提升表达能力的三个技巧
...

# 2. 运行脚本
npx tsx scripts/add-new-post.ts daily-thoughts.md

# 3. 选择分类：生活记录 (life)
```

## ✅ 检查清单

在运行脚本前，请确认：

- [ ] Markdown 文件包含正确的 frontmatter
- [ ] 文件路径正确
- [ ] 数据库连接正常
- [ ] 已安装项目依赖
- [ ] Prisma Client 已生成

完成以上步骤后，即可使用脚本快速添加新文章！

