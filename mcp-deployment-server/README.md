# MCP 部署服务器

这是一个基于 Model Context Protocol (MCP) 的自动化部署服务器，用于实现代码 lint 检查、Git 推送、Vercel 部署和数据库迁移的自动化流程。

## 功能特性

- ✅ **代码检查**：运行 lint 检查，确保代码质量
- ✅ **自动推送**：如果 lint 通过，自动推送到远程仓库
- ✅ **自动部署**：触发 Vercel 部署
- ✅ **数据库迁移**：执行数据库迁移脚本

## 安装

```bash
cd mcp-deployment-server
npm install
```

## 配置

1. 复制 `.env.example` 为 `.env`
2. 配置环境变量：

```bash
VERCEL_DEPLOY_HOOK=your-vercel-deploy-hook-url
MIGRATION_URL=https://www.clczl.asia/api/admin/migrate-category-field
```

## 构建

```bash
npm run build
```

## 运行

```bash
npm start
```

开发模式：

```bash
npm run dev
```

## 配置 Cursor 使用 MCP 服务器

在 Cursor 设置中添加 MCP 服务器配置：

```json
{
  "mcpServers": {
    "deployment-server": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-deployment-server/dist/server.js"],
      "env": {
        "VERCEL_DEPLOY_HOOK": "your-vercel-deploy-hook-url",
        "MIGRATION_URL": "https://www.clczl.asia/api/admin/migrate-category-field"
      }
    }
  }
}
```

## 可用工具

### 1. run_lint
运行代码 lint 检查

### 2. git_push
推送代码到远程仓库
- `branch`: 要推送的分支名称（默认: main）
- `commitMessage`: 提交信息（可选）

### 3. deploy_vercel
触发 Vercel 部署
- `environment`: 部署环境（production 或 preview）

### 4. run_migration
执行数据库迁移
- `migrationUrl`: 迁移 API URL（可选）

### 5. auto_deploy
自动化部署流程（lint → push → deploy → migrate）
- `branch`: 要推送的分支名称（默认: main）
- `runMigration`: 是否执行数据库迁移（默认: false）
- `commitMessage`: Git 提交信息（可选）

## 使用示例

在 Cursor 中，你可以直接使用自然语言调用这些工具：

```
请运行 lint 检查
```

```
请执行自动化部署流程，包括推送代码和部署到 Vercel，并执行数据库迁移
```

## 许可证

MIT

