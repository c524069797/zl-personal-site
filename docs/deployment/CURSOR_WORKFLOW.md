# Cursor 工作流配置指南

本文档说明如何在 Cursor 中配置和使用文章自动发布工作流。

## 📋 概述

Cursor 工作流允许你在新增或修改文章后，自动执行发布流程，无需手动运行命令。

## 🚀 快速开始

### 1. 工作流已配置

项目已包含以下文件：
- `.cursorrules` - Cursor 工作流规则文件
- `scripts/auto-publish-post.ts` - 自动发布脚本（非交互式）

### 2. 使用方式

#### 方式一：手动触发（推荐）

当你创建或修改了 `content/posts/` 目录下的文章后：

1. **在 Cursor 中打开终端**（快捷键：Ctrl/Cmd + `）
2. **运行发布命令**：
   ```bash
   npx tsx scripts/auto-publish-post.ts
   ```

#### 方式二：使用 Cursor Composer

1. **在 Cursor Composer 中输入**：
   ```
   我新增了一篇文章，请帮我自动发布
   ```
2. **Cursor 会自动识别并执行发布流程**

#### 方式三：发布单个文件

```bash
npx tsx scripts/auto-publish-post.ts content/posts/your-article.md
```

## 📝 文章格式要求

### Frontmatter 必需字段

```yaml
---
title: "文章标题"           # 必需
date: "2025-01-20"          # 必需，格式：YYYY-MM-DD
summary: "文章摘要"         # 可选，但推荐填写
tags: ["标签1", "标签2"]    # 可选
category: "tech"            # 可选：tech 或 life，不指定则自动分类
draft: false                # 可选，false=已发布，true=草稿
---
```

### 示例文章

```markdown
---
title: "React Hooks 最佳实践"
date: "2025-01-20"
summary: "深入探讨 React Hooks 的使用技巧和最佳实践"
tags: ["React", "前端", "Hooks"]
category: "tech"
draft: false
---

# React Hooks 最佳实践

文章内容...
```

## 🔧 脚本选项

### 基本用法

```bash
# 发布 content/posts 目录下的所有新文章
npx tsx scripts/auto-publish-post.ts

# 发布单个文件
npx tsx scripts/auto-publish-post.ts content/posts/my-article.md

# 发布指定目录
npx tsx scripts/auto-publish-post.ts --dir content/posts
```

### 高级选项

```bash
# 自动发布（忽略 draft 标记，强制发布）
npx tsx scripts/auto-publish-post.ts --auto-publish

# 强制更新已存在的文章
npx tsx scripts/auto-publish-post.ts --force

# 组合使用
npx tsx scripts/auto-publish-post.ts --auto-publish --force
```

## 🤖 Cursor AI 集成

### 触发词

当你在 Cursor Composer 中使用以下触发词时，AI 会自动执行发布流程：

- "新增了文章"
- "添加了新文章"
- "发布了文章"
- "文章已创建"
- "需要发布文章"
- "帮我发布文章"

### 示例对话

**你**：我刚刚在 `content/posts/` 目录下新增了一篇文章 `my-new-post.md`，请帮我自动发布。

**Cursor AI**：好的，我来帮你自动发布这篇文章。
```bash
npx tsx scripts/auto-publish-post.ts content/posts/my-new-post.md
```

## 📊 工作流程

```
创建/修改文章文件
    ↓
填写 frontmatter（title, date 必需）
    ↓
运行发布脚本
    ↓
自动分类（tech/life）
    ↓
创建/更新标签
    ↓
导入数据库
    ↓
显示发布结果
```

## 🏷️ 自动分类规则

### 技术博客 (tech)

包含以下关键词的文章会被自动分类为技术博客：
- React、Next.js、Vue、MCP、n8n
- JavaScript、TypeScript、前端、后端
- 开发、编程、框架、库、工具
- API、接口、数据库、性能、优化
- 安全、部署、CI/CD、DevOps

### 生活记录 (life)

包含以下关键词的文章会被自动分类为生活记录：
- 表达、沟通、习惯、成长
- 自我管理、效率、行动、改变
- 日常、生活、思考、感悟
- 工作、职场、团队、协作
- 学习、读书、阅读、笔记

## ⚙️ 配置说明

### .cursorrules 文件

`.cursorrules` 文件告诉 Cursor AI：
- 如何识别文章发布任务
- 应该执行哪些命令
- 文章格式要求
- 分类规则

### auto-publish-post.ts 脚本

`scripts/auto-publish-post.ts` 是核心发布脚本，功能包括：
- ✅ 自动读取 frontmatter
- ✅ 自动分类（tech/life）
- ✅ 自动创建/更新标签
- ✅ 自动导入数据库
- ✅ 跳过已存在的文章（可选）
- ✅ 支持批量处理
- ✅ 详细的错误处理和日志

## 🐛 故障排除

### 问题：文章没有发布

**检查清单**：
1. ✅ 确保 frontmatter 包含 `title` 和 `date` 字段
2. ✅ 检查数据库连接（`.env` 中的 `DATABASE_URL`）
3. ✅ 确保文件在 `content/posts/` 目录下
4. ✅ 检查文件扩展名（必须是 `.md` 或 `.mdx`）

### 问题：分类不正确

**解决方案**：
- 在 frontmatter 中明确指定 `category: "tech"` 或 `category: "life"`
- 或者调整标题/摘要，包含更明确的关键词

### 问题：文章已存在但想更新

**解决方案**：
```bash
npx tsx scripts/auto-publish-post.ts --force
```

### 问题：想发布草稿文章

**解决方案**：
```bash
npx tsx scripts/auto-publish-post.ts --auto-publish
```

## 📚 相关文档

- [新增文章部署流程](./ADD_NEW_POST.md)
- [数据库设置指南](../setup/SETUP_DATABASE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)

## 💡 最佳实践

1. **创建文章时**：
   - 使用有意义的文件名（会作为 slug）
   - 填写完整的 frontmatter
   - 添加合适的标签

2. **发布前**：
   - 检查 frontmatter 格式
   - 确认分类是否正确
   - 预览文章内容

3. **发布后**：
   - 检查控制台输出
   - 验证文章是否成功发布
   - 在网站上查看效果

## ✅ 检查清单

发布文章前，请确认：

- [ ] 文章文件在 `content/posts/` 目录下
- [ ] Frontmatter 包含 `title` 和 `date` 字段
- [ ] 文件扩展名为 `.md` 或 `.mdx`
- [ ] 数据库连接正常
- [ ] 已安装项目依赖（`npm install`）
- [ ] Prisma Client 已生成（`npx prisma generate`）

完成以上步骤后，即可使用工作流自动发布文章！





