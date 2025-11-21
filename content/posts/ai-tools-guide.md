---
title: "我所使用的好的工具类 AI"
date: "2025-01-15"
summary: "分享我在日常工作中使用的优秀 AI 工具，包括生图工具、AI CLI 工具和设计工具，详细介绍它们的使用方式和特点。"
tags: ["AI工具", "生图", "CLI工具", "设计工具", "Gemini", "Figma", "Pixso"]
draft: false
---

# 我所使用的好的工具类 AI

在日常开发和学习中，AI 工具已经成为不可或缺的助手。本文将分享我使用的一些优秀的 AI 工具，包括生图工具、AI CLI 工具和设计工具，希望能帮助大家提高工作效率。

## 生图工具

### Google AI Studio - Gemini 3 Pro Image Preview

Google AI Studio 提供了强大的图像生成功能，特别是 Gemini 3 Pro Image Preview 模型，可以生成高质量的图像。

#### 使用方法

1. **访问 Google AI Studio**
   - 打开 [Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=models%2Fgemini-3-pro-image-preview)
   - 使用 Google 账号登录

2. **生成图像**
   - 在提示框中输入图像描述
   - 例如：`Generate an image of a banana wearing a costume`
   - 点击生成，等待结果

3. **特点**
   - 免费使用（有一定额度限制）
   - 支持中文提示词
   - 生成速度快
   - 图像质量高

#### 使用示例

```
提示词：Generate an image of a banana wearing a costume
结果：生成一个穿着服装的香蕉图像
```

### Google Nano Banana

Nano Banana 是由 Google 开发的 AI 图像生成与编辑工具，能够根据用户输入的提示生成和编辑图像。其强大的编辑能力和独特的 3D 公仔风格在社交媒体上引发了热潮。

#### 特点

- **图像生成**：根据文本提示生成高质量图像
- **图像编辑**：支持对现有图像进行编辑和修改
- **3D 风格**：独特的 3D 公仔风格，适合创意设计
- **易于使用**：简单的界面，快速上手

#### 使用场景

- 创意图像生成
- 社交媒体内容制作
- 3D 风格设计
- 快速原型设计

#### 使用方法

1. 访问 Google Nano Banana 官网
2. 输入图像描述或上传图片
3. 选择编辑选项（如果需要）
4. 生成或编辑图像
5. 下载结果

## AI CLI 工具

### Codex / GitHub Copilot

Codex 是 OpenAI 开发的代码生成工具，基于 GPT 模型，专门针对编程任务优化。GitHub Copilot 是基于 Codex 的 IDE 插件，是目前最流行的 AI 代码助手。

#### 安装和使用

**GitHub Copilot（推荐）**：
1. 在 VS Code、Cursor、JetBrains IDE 等编辑器中安装 GitHub Copilot 扩展
2. 登录 GitHub 账号并订阅 Copilot（个人版 $10/月）
3. 在代码中输入注释或函数名，Copilot 会自动生成代码
4. 按 `Tab` 接受建议，按 `Esc` 拒绝

**使用示例**：
```javascript
// 注释：创建一个 React 组件，显示用户列表
// Copilot 会自动生成完整的组件代码
```

**Codex API**：
```bash
# 使用 OpenAI API 调用 Codex
curl https://api.openai.com/v1/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "code-davinci-002",
    "prompt": "创建一个 React 组件，显示用户列表",
    "max_tokens": 200
  }'
```

#### 特点

- **代码生成能力强**：专门针对编程任务训练，理解代码上下文
- **支持多种语言**：Python、JavaScript、TypeScript、Go、Rust、C++ 等
- **上下文理解**：能够理解整个文件甚至项目的上下文
- **IDE 集成**：无缝集成到编辑器中，实时代码补全
- **多行代码生成**：可以生成完整的函数、类甚至文件

#### 适用场景

- 快速生成代码模板和样板代码
- 代码补全和重构
- 代码解释和文档生成
- 单元测试生成
- 代码翻译（不同编程语言之间）
- 代码优化和性能改进

### Claude

Claude 是 Anthropic 开发的 AI 助手，以其强大的推理能力和安全性著称。

#### 安装和使用

```bash
# 安装 Claude CLI
npm install -g @anthropic-ai/claude-cli

# 使用 Claude
claude ask "解释一下 React Hooks 的工作原理"
```

#### 特点

- **强大的推理能力**：能够进行复杂的逻辑推理
- **安全性高**：注重 AI 安全性，避免有害输出
- **长上下文**：支持超长上下文（100K+ tokens）
- **多模态支持**：支持文本、图像等多种输入

#### 适用场景

- 复杂问题分析
- 长文档处理
- 代码审查
- 技术文档编写

### Trae / Cursor / MCP Tools

Trae 是一个开源的 AI CLI 工具，支持多种 AI 模型。Cursor 是基于 AI 的代码编辑器，MCP (Model Context Protocol) 工具提供了标准化的 AI 工具接口。

#### Cursor（推荐）

**安装和使用**：
1. 下载并安装 Cursor 编辑器
2. 登录账号并配置 API Key
3. 在编辑器中直接使用 AI 功能

**特点**：
- **AI 代码补全**：基于上下文的智能补全
- **AI 聊天**：在编辑器中直接与 AI 对话
- **代码重构**：AI 辅助代码重构和优化
- **多模型支持**：支持 GPT-4、Claude 等模型

#### MCP Tools

**安装和使用**：
```bash
# MCP 是一个协议，不是单一工具
# 可以在 Cursor、Claude Desktop 等客户端中使用
# 配置 MCP 服务器后，可以在客户端中使用各种工具
```

**特点**：
- **标准化接口**：统一的工具接口标准
- **可扩展**：可以创建自定义 MCP 服务器
- **工具丰富**：支持文件操作、代码执行、API 调用等
- **跨平台**：支持多种客户端

#### Trae（CLI 工具）

```bash
# 安装 Trae
npm install -g trae

# 配置 API Key
trae config set api-key YOUR_API_KEY

# 使用 Trae
trae ask "如何使用 TypeScript 实现单例模式？"
```

**特点**：
- **多模型支持**：支持 OpenAI、Anthropic、Google 等多种模型
- **统一接口**：提供统一的命令行接口
- **可扩展**：支持自定义模型和插件
- **开源免费**：完全开源，可自由使用和修改

#### 适用场景

- **Cursor**：日常代码编辑和开发
- **MCP Tools**：构建自定义 AI 工作流
- **Trae**：命令行批量处理和脚本自动化

### 工具对比

| 工具 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **Codex** | 代码生成能力强，专门针对编程优化 | 主要支持代码相关任务 | 代码生成、重构、测试 |
| **Claude** | 推理能力强，安全性高，长上下文 | 响应速度相对较慢 | 复杂分析、文档处理 |
| **Trae** | 多模型支持，可扩展，开源 | 需要自行配置和集成 | 多模型对比、自定义工作流 |

## 设计工具

### Figma

Figma 是一款强大的在线设计工具，支持 UI/UX 设计和原型制作。

#### 特点

- **实时协作**：多人同时编辑，实时同步
- **组件系统**：强大的组件和样式系统
- **原型功能**：支持交互式原型制作
- **插件生态**：丰富的插件市场
- **跨平台**：支持 Web、Mac、Windows

#### 使用场景

- UI/UX 设计
- 原型制作
- 设计系统构建
- 团队协作设计

#### 使用技巧

1. **组件变体**：使用组件变体管理不同状态
2. **自动布局**：使用 Auto Layout 实现响应式设计
3. **设计令牌**：使用 Design Tokens 统一设计规范
4. **插件使用**：安装常用插件提高效率

### Pixso

Pixso 是国产的设计协作工具，功能强大且符合国内用户习惯。

#### 特点

- **中文环境**：完全中文界面，易于使用
- **Figma 兼容**：支持导入 Figma 文件
- **本土化**：针对国内团队优化
- **免费使用**：个人用户免费使用
- **实时协作**：支持多人实时协作

#### 访问方式

- 官网：https://pixso.cn/
- 在线使用：无需下载，浏览器直接使用
- 客户端：支持 Mac、Windows 客户端

#### 使用场景

- UI/UX 设计
- 原型设计
- 设计协作
- 设计交付

#### 与 Figma 的对比

| 特性 | Figma | Pixso |
|------|-------|-------|
| **语言** | 英文为主 | 完全中文 |
| **价格** | 免费版有限制 | 个人免费 |
| **Figma 兼容** | 原生 | 支持导入 |
| **本土化** | 一般 | 深度优化 |
| **协作** | 支持 | 支持 |
| **社区** | 全球社区 | 国内社区 |

## 工具选择建议

### 生图工具

- **Google AI Studio**：适合快速生成图像，免费使用
- **Midjourney**：适合高质量艺术图像
- **DALL-E**：适合创意图像生成

### AI CLI 工具

- **Codex**：适合代码相关任务
- **Claude**：适合复杂分析和文档处理
- **Trae**：适合多模型对比和自定义需求

### 设计工具

- **Figma**：适合国际化团队，功能强大
- **Pixso**：适合国内团队，中文环境友好
- **Sketch**：适合 Mac 用户，本地设计

## 总结

选择合适的 AI 工具可以大大提高工作效率。建议：

1. **根据需求选择**：不同工具适合不同场景
2. **多工具组合**：可以组合使用多个工具
3. **持续学习**：AI 工具更新快，需要持续学习
4. **实践应用**：多实践，找到最适合自己的工作流

希望这些工具能帮助你提高工作效率，如果你有其他好用的 AI 工具，欢迎分享！

