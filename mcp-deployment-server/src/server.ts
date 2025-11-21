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
          description: '运行代码 lint 检查，确保代码质量',
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
              commitMessage: {
                type: 'string',
                description: '提交信息',
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
              commitMessage: {
                type: 'string',
                description: 'Git 提交信息',
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
            return await this.gitPush(
              args?.branch || 'main',
              args?.commitMessage
            );
          case 'deploy_vercel':
            return await this.deployVercel(args?.environment || 'production');
          case 'run_migration':
            return await this.runMigration(args?.migrationUrl);
          case 'auto_deploy':
            return await this.autoDeploy(
              args?.branch || 'main',
              args?.runMigration || false,
              args?.commitMessage
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

  private async runLint(): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const { stdout, stderr } = await execAsync('npm run lint');
      if (stderr && !stdout.includes('✔') && !stdout.includes('✓')) {
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
    } catch (error) {
      const execError = error as { code?: number; stdout?: string; stderr?: string; message?: string };
      if (execError.code === 1) {
        throw new Error(`Lint 检查失败: ${execError.stdout || execError.stderr || execError.message || '未知错误'}`);
      }
      throw new Error(`Lint 检查失败: ${execError.message || '未知错误'}`);
    }
  }

  private async gitPush(branch: string, commitMessage?: string): Promise<{ content: Array<{ type: string; text: string }> }> {
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
      const message = commitMessage || `chore: 自动提交 - ${new Date().toISOString()}`;
      await execAsync(`git commit -m "${message}"`);

      // 推送到远程
      const { stdout, stderr } = await execAsync(`git push origin ${branch}`);
      if (stderr && !stderr.includes('To') && !stderr.includes('Enumerating')) {
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
    } catch (error) {
      const execError = error as { message?: string };
      throw new Error(`Git 推送失败: ${execError.message || '未知错误'}`);
    }
  }

  private async deployVercel(environment: string): Promise<{ content: Array<{ type: string; text: string }> }> {
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

      const data = await response.json() as { url?: string };
      return {
        content: [
          {
            type: 'text',
            text: `✅ Vercel 部署已触发 (${environment})\n\n部署 URL: ${data.url || '待定'}`,
          },
        ],
      };
    } catch (error) {
      const fetchError = error as { message?: string };
      throw new Error(`Vercel 部署失败: ${fetchError.message || '未知错误'}`);
    }
  }

  private async runMigration(migrationUrl?: string): Promise<{ content: Array<{ type: string; text: string }> }> {
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
    } catch (error) {
      const fetchError = error as { message?: string };
      throw new Error(`数据库迁移失败: ${fetchError.message || '未知错误'}`);
    }
  }

  private async autoDeploy(
    branch: string,
    runMigration: boolean,
    commitMessage?: string
  ): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
    const steps: string[] = [];
    const errors: string[] = [];

    try {
      // 步骤 1: 运行 lint
      steps.push('1. 运行 lint 检查...');
      await this.runLint();
      steps.push('   ✅ Lint 检查通过');

      // 步骤 2: 推送到远程
      steps.push('2. 推送代码到远程...');
      await this.gitPush(branch, commitMessage);
      steps.push('   ✅ 代码已推送');

      // 步骤 3: 触发 Vercel 部署
      steps.push('3. 触发 Vercel 部署...');
      await this.deployVercel('production');
      steps.push('   ✅ Vercel 部署已触发');

      // 步骤 4: 执行数据库迁移（如果需要）
      if (runMigration) {
        steps.push('4. 执行数据库迁移...');
        await this.runMigration();
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
    } catch (error) {
      const deployError = error as { message?: string };
      errors.push(`❌ ${deployError.message || '未知错误'}`);
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

