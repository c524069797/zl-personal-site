# MCP 服务器测试指南

## MCP 服务器工作原理

MCP（Model Context Protocol）服务器通过 **stdio**（标准输入输出）与客户端通信。这意味着：

1. **不是直接终端命令**：你不能直接在终端输入 "请运行 lint 检查"
2. **通过 Cursor 使用**：MCP 服务器需要由 Cursor 等 MCP 客户端启动和管理
3. **JSON-RPC 协议**：客户端和服务器通过 JSON-RPC 协议通信

## 如何在 Cursor 中使用

### 方法 1：在 Cursor 聊天中直接使用

在 Cursor 的聊天界面中，你可以直接说：

```
请运行 lint 检查
```

Cursor 会自动调用 MCP 服务器中的 `run_lint` 工具。

### 方法 2：通过 MCP 工具调用

Cursor 会显示可用的 MCP 工具，你可以选择：
- `run_lint` - 运行代码 lint 检查
- `git_push` - 推送代码到远程仓库
- `deploy_vercel` - 触发 Vercel 部署
- `run_migration` - 执行数据库迁移
- `auto_deploy` - 完整的自动化部署流程

## 在终端测试 MCP 服务器（手动测试）

如果你想在终端测试 MCP 服务器，需要手动发送 JSON-RPC 请求：

### 1. 启动服务器（监听 stdio）

```bash
cd /Users/chenzilong/personal-site/mcp-deployment-server
node dist/server.js
```

### 2. 发送 JSON-RPC 请求

服务器启动后，通过 stdin 发送请求：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

### 3. 调用工具

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "run_lint",
    "arguments": {}
  }
}
```

## 直接运行 lint（不使用 MCP）

如果你想直接在终端运行 lint，可以使用：

```bash
cd /Users/chenzilong/personal-site
npm run lint
```

## 推荐使用方式

**最佳实践**：在 Cursor 中直接使用自然语言命令，Cursor 会自动调用 MCP 服务器。

例如：
- "请运行 lint 检查"
- "请推送代码到 main 分支"
- "请执行自动化部署流程"

