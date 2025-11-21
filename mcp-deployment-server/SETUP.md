# MCP 部署服务器配置指南

## 环境变量配置

`.env` 文件已创建，包含以下配置：

```bash
VERCEL_DEPLOY_HOOK=your-vercel-deploy-hook-url
MIGRATION_URL=https://www.clczl.asia/api/admin/migrate-category-field
```

### 获取 Vercel Deploy Hook

1. 登录 Vercel 控制台
2. 进入你的项目设置
3. 导航到 **Settings** → **Git** → **Deploy Hooks**
4. 创建一个新的 Deploy Hook（如果还没有）
5. 复制 Hook URL，替换 `.env` 文件中的 `your-vercel-deploy-hook-url`

## 配置 Cursor 使用 MCP 服务器

在 Cursor 设置中添加 MCP 服务器配置。配置文件位置：

- **macOS**: `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Windows**: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- **Linux**: `~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

添加以下配置：

```json
{
  "mcpServers": {
    "deployment-server": {
      "command": "node",
      "args": ["/Users/chenzilong/personal-site/mcp-deployment-server/dist/server.js"],
      "env": {
        "VERCEL_DEPLOY_HOOK": "your-vercel-deploy-hook-url",
        "MIGRATION_URL": "https://www.clczl.asia/api/admin/migrate-category-field"
      }
    }
  }
}
```

**注意**：将路径 `/Users/chenzilong/personal-site/mcp-deployment-server/dist/server.js` 替换为你的实际路径。

## 测试 MCP 服务器

在 Cursor 中，你可以使用以下命令测试 MCP 服务器：

```
请运行 lint 检查
```

```
请执行自动化部署流程，包括推送代码和部署到 Vercel
```

## 可用工具

1. **run_lint** - 运行代码 lint 检查
2. **git_push** - 推送代码到远程仓库
3. **deploy_vercel** - 触发 Vercel 部署
4. **run_migration** - 执行数据库迁移
5. **auto_deploy** - 完整的自动化部署流程

## 故障排除

如果 MCP 服务器无法启动：

1. 确保已安装所有依赖：`npm install`
2. 确保已构建项目：`npm run build`
3. 检查 `.env` 文件中的环境变量是否正确
4. 检查 Cursor 配置中的路径是否正确
5. 查看 Cursor 的日志输出以获取错误信息

