---
title: "MCP 实操：构建自动化部署流程"
date: "2025-01-15"
summary: "详细介绍如何使用 Model Context Protocol (MCP) 构建自动化部署流程，实现代码 lint 检查通过后自动推送到远程并部署到 Vercel。"
tags: ["MCP", "自动化", "部署", "CI/CD", "DevOps", "Vercel"]
draft: false
---

# MCP 实操：构建自动化部署流程

Model Context Protocol (MCP) 是一个用于 AI 应用与外部系统交互的协议。本文将详细介绍如何使用 MCP 构建自动化部署流程，实现代码 lint 检查通过后自动推送到远程并部署到 Vercel。

## 什么是 MCP？

MCP（Model Context Protocol）是一个开放协议，允许 AI 应用通过标准化的方式与外部系统交互。MCP 服务器可以提供工具（Tools）、资源（Resources）和提示（Prompts），使 AI 应用能够执行复杂的操作。

### MCP 的核心概念

- **MCP Server**：提供工具和资源的服务器
- **MCP Client**：使用 MCP Server 的客户端（如 Cursor、Claude Desktop）
- **Tools**：可执行的操作，如运行命令、调用 API
- **Resources**：可访问的数据，如文件、数据库
- **Prompts**：预定义的提示模板

## 项目需求

我们的目标是构建一个 MCP 服务器，实现以下功能：

1. **代码检查**：运行 lint 检查，确保代码质量
2. **自动推送**：如果 lint 通过，自动推送到远程仓库
3. **自动部署**：触发 Vercel 部署
4. **数据库迁移**：如果需要，执行数据库迁移

## 实现 MCP 服务器

### 1. 项目结构

首先创建 MCP 服务器项目：

```bash
mkdir mcp-deployment-server
cd mcp-deployment-server
npm init -y
npm install @modelcontextprotocol/sdk dotenv
npm install -D typescript @types/node tsx
```

### 2. 创建 MCP 服务器

创建 `src/server.ts`：

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

class DeploymentServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'deployment-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'run_lint',
          description: '运行代码 lint 检查',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'git_push',
          description: '推送代码到远程仓库',
          inputSchema: {
            type: 'object',
            properties: {
              branch: {
                type: 'string',
                description: '要推送的分支名称',
                default: 'main',
              },
            },
          },
        },
        {
          name: 'deploy_vercel',
          description: '触发 Vercel 部署',
          inputSchema: {
            type: 'object',
            properties: {
              environment: {
                type: 'string',
                description: '部署环境',
                enum: ['production', 'preview'],
                default: 'production',
              },
            },
          },
        },
        {
          name: 'run_migration',
          description: '执行数据库迁移',
          inputSchema: {
            type: 'object',
            properties: {
              migrationUrl: {
                type: 'string',
                description: '迁移 API URL',
              },
            },
          },
        },
        {
          name: 'auto_deploy',
          description: '自动化部署流程：lint → push → deploy → migrate',
          inputSchema: {
            type: 'object',
            properties: {
              branch: {
                type: 'string',
                description: '要推送的分支名称',
                default: 'main',
              },
              runMigration: {
                type: 'boolean',
                description: '是否执行数据库迁移',
                default: false,
              },
            },
          },
        },
      ],
    }));

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'run_lint':
            return await this.runLint();
          case 'git_push':
            return await this.gitPush(args?.branch || 'main');
          case 'deploy_vercel':
            return await this.deployVercel(args?.environment || 'production');
          case 'run_migration':
            return await this.runMigration(args?.migrationUrl);
          case 'auto_deploy':
            return await this.autoDeploy(
              args?.branch || 'main',
              args?.runMigration || false
            );
          default:
            throw new Error(`未知工具: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async runLint(): Promise<any> {
    try {
      const { stdout, stderr } = await execAsync('npm run lint');
      if (stderr && !stdout.includes('✔')) {
        throw new Error(`Lint 检查失败: ${stderr}`);
      }
      return {
        content: [
          {
            type: 'text',
            text: `✅ Lint 检查通过\n\n${stdout}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Lint 检查失败: ${error.message}`);
    }
  }

  private async gitPush(branch: string): Promise<any> {
    try {
      // 检查是否有未提交的更改
      const { stdout: status } = await execAsync('git status --porcelain');
      if (!status.trim()) {
        return {
          content: [
            {
              type: 'text',
              text: '没有需要推送的更改',
            },
          ],
        };
      }

      // 添加所有更改
      await execAsync('git add -A');

      // 提交更改
      const commitMessage = `chore: 自动提交 - ${new Date().toISOString()}`;
      await execAsync(`git commit -m "${commitMessage}"`);

      // 推送到远程
      const { stdout, stderr } = await execAsync(`git push origin ${branch}`);
      if (stderr && !stderr.includes('To')) {
        throw new Error(`推送失败: ${stderr}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `✅ 代码已推送到 ${branch} 分支\n\n${stdout}${stderr}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Git 推送失败: ${error.message}`);
    }
  }

  private async deployVercel(environment: string): Promise<any> {
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;
    if (!deployHook) {
      throw new Error('未配置 VERCEL_DEPLOY_HOOK 环境变量');
    }

    try {
      const response = await fetch(`https://api.vercel.com/v1/integrations/deploy/${deployHook}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environment,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vercel 部署失败: ${errorText}`);
      }

      const data = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `✅ Vercel 部署已触发 (${environment})\n\n部署 URL: ${data.url || '待定'}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Vercel 部署失败: ${error.message}`);
    }
  }

  private async runMigration(migrationUrl?: string): Promise<any> {
    const url = migrationUrl || process.env.MIGRATION_URL || 'https://www.clczl.asia/api/admin/migrate-category-field';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`数据库迁移失败: ${errorText}`);
      }

      const data = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `✅ 数据库迁移完成\n\n${JSON.stringify(data, null, 2)}`,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`数据库迁移失败: ${error.message}`);
    }
  }

  private async autoDeploy(branch: string, runMigration: boolean): Promise<any> {
    const steps: string[] = [];
    const errors: string[] = [];

    try {
      // 步骤 1: 运行 lint
      steps.push('1. 运行 lint 检查...');
      const lintResult = await this.runLint();
      steps.push('   ✅ Lint 检查通过');

      // 步骤 2: 推送到远程
      steps.push('2. 推送代码到远程...');
      const pushResult = await this.gitPush(branch);
      steps.push('   ✅ 代码已推送');

      // 步骤 3: 触发 Vercel 部署
      steps.push('3. 触发 Vercel 部署...');
      const deployResult = await this.deployVercel('production');
      steps.push('   ✅ Vercel 部署已触发');

      // 步骤 4: 执行数据库迁移（如果需要）
      if (runMigration) {
        steps.push('4. 执行数据库迁移...');
        const migrationResult = await this.runMigration();
        steps.push('   ✅ 数据库迁移完成');
      }

      return {
        content: [
          {
            type: 'text',
            text: `✅ 自动化部署流程完成\n\n${steps.join('\n')}\n\n${errors.length > 0 ? `警告:\n${errors.join('\n')}` : ''}`,
          },
        ],
      };
    } catch (error: any) {
      errors.push(`❌ ${error.message}`);
      return {
        content: [
          {
            type: 'text',
            text: `❌ 自动化部署流程失败\n\n${steps.join('\n')}\n\n错误:\n${errors.join('\n')}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP 部署服务器已启动');
  }
}

const server = new DeploymentServer();
server.run().catch(console.error);
```

### 3. 配置文件

创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

创建 `.env.example`：

```bash
VERCEL_DEPLOY_HOOK=your-vercel-deploy-hook-url
MIGRATION_URL=https://www.clczl.asia/api/admin/migrate-category-field
```

创建 `package.json` 脚本：

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx src/server.ts"
  }
}
```

### 4. 配置 Cursor 使用 MCP 服务器

在 Cursor 设置中添加 MCP 服务器配置：

```json
{
  "mcpServers": {
    "deployment-server": {
      "command": "node",
      "args": ["/path/to/mcp-deployment-server/dist/server.js"],
      "env": {
        "VERCEL_DEPLOY_HOOK": "your-vercel-deploy-hook-url",
        "MIGRATION_URL": "https://www.clczl.asia/api/admin/migrate-category-field"
      }
    }
  }
}
```

## 使用 MCP 服务器

配置完成后，你可以在 Cursor 中直接使用 MCP 工具：

### 示例 1：运行 Lint 检查

```
请运行 lint 检查
```

MCP 服务器会自动执行 `npm run lint` 并返回结果。

### 示例 2：自动化部署

```
请执行自动化部署流程，包括推送代码和部署到 Vercel，并执行数据库迁移
```

MCP 服务器会依次执行：
1. Lint 检查
2. Git 推送
3. Vercel 部署
4. 数据库迁移

## 高级功能

### 1. 添加 GitHub Actions 集成

可以扩展 MCP 服务器，添加 GitHub Actions 触发功能：

```typescript
{
  name: 'trigger_github_actions',
  description: '触发 GitHub Actions 工作流',
  inputSchema: {
    type: 'object',
    properties: {
      workflow: {
        type: 'string',
        description: '工作流文件名',
      },
      ref: {
        type: 'string',
        description: '分支或标签',
        default: 'main',
      },
    },
  },
}
```

### 2. 添加通知功能

集成 Slack 或 Email 通知：

```typescript
{
  name: 'send_notification',
  description: '发送部署通知',
  inputSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: '通知消息',
      },
      channel: {
        type: 'string',
        description: '通知渠道',
        enum: ['slack', 'email'],
      },
    },
  },
}
```

### 3. 添加回滚功能

如果部署失败，自动回滚：

```typescript
{
  name: 'rollback',
  description: '回滚到上一个版本',
  inputSchema: {
    type: 'object',
    properties: {
      version: {
        type: 'string',
        description: '要回滚的版本',
      },
    },
  },
}
```

## 最佳实践

### 1. 错误处理

确保每个工具都有完善的错误处理机制，提供清晰的错误信息。

### 2. 日志记录

记录所有操作的日志，便于调试和审计。

### 3. 安全性

- 使用环境变量存储敏感信息
- 验证输入参数
- 限制可执行的操作范围

### 4. 测试

为每个工具编写测试，确保功能正常。

## 总结

通过 MCP 协议，我们可以构建强大的自动化部署流程，将代码检查、推送、部署和数据库迁移整合到一个统一的流程中。这不仅提高了开发效率，还确保了部署的一致性和可靠性。

在实际使用中，建议：
- 从简单的工具开始，逐步增加复杂度
- 充分利用 MCP 的标准化接口，提高可维护性
- 做好错误处理和日志记录，确保流程的稳定性
- 定期审查和优化流程，保持其高效和可靠

希望这篇文章能帮助你更好地使用 MCP 构建自动化部署流程。

