# AI功能使用说明

## 功能概述

本项目实现了三个AI相关功能：

1. **RAG智能问答** - 基于向量数据库的智能问答系统
2. **AI摘要与阅读助手** - 自动生成文章摘要和关键词
3. **AI评论审核** - 自动检测垃圾信息和攻击性内容

## 环境配置

### 1. 环境变量

在项目根目录创建 `.env.local` 文件（已创建，请确认API Key）：

```env
# OpenAI API Key（请替换为你的实际API Key）
OPENAI_API_KEY=your-openai-api-key-here

# DeepSeek API Key（通过SiliconFlow代理）
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_MODEL=deepseek-ai/DeepSeek-R1-0528-Qwen3-8B

# Qdrant Configuration
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# AI Configuration
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
```

### 2. 安装Qdrant

#### 使用Docker（推荐）

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

#### 或使用本地安装

访问 [Qdrant官网](https://qdrant.tech/documentation/guides/installation/) 查看安装说明。

## 数据库迁移

运行数据库迁移以添加AI相关字段：

```bash
npm run db:migrate
```

## 初始化向量数据库

首次使用前，需要初始化Qdrant集合并向量化现有文章：

```bash
# 使用tsx运行脚本
npx tsx scripts/vectorize-posts.ts
```

## 功能说明

### 1. RAG智能问答

**位置：** 右下角浮动按钮 "问博客"

**功能：**
- 访客可以输入自然语言问题
- 系统自动检索相关文章内容
- 基于检索结果生成答案
- 显示答案来源文章链接

**使用示例：**
- "你的 Next.js SEO 实践怎么做？"
- "如何配置 Prisma 的关系模型？"

**API端点：** `POST /api/rag/ask`

### 2. AI摘要与阅读助手

**位置：** 博客详情页右侧侧边栏

**功能：**
- 自动生成文章摘要（100-150字）
- 提取3-5个关键词
- 支持手动重新生成
- 摘要缓存7天

**API端点：** `POST /api/ai/summarize`

### 3. AI评论审核

**功能：**
- 自动检测垃圾信息（spam）
- 检测攻击性内容
- 自动生成感谢回复（可选）
- 符合条件的评论自动通过审核

**审核规则：**
- `spamScore < 0.3` 且 `toxicScore < 0.3` 的评论自动通过
- 其他评论需要手动审核

**集成位置：** 评论创建API自动调用

## 文章向量化

### 自动向量化

文章发布或更新时，如果文章已发布，系统会自动异步向量化。

### 手动向量化

运行批量向量化脚本：

```bash
npx tsx scripts/vectorize-posts.ts
```

## 技术架构

### 向量数据库
- **Qdrant** - 高性能向量数据库
- **集合名称：** `blog_posts`
- **向量维度：** 3072（text-embedding-3-large）
- **距离度量：** Cosine

### AI模型
- **LLM：** GPT-4o-mini（可配置）
- **Embedding：** text-embedding-3-large（3072维）

### 数据流程

1. **文章向量化：**
   - 文章发布 → 内容分块 → 生成向量 → 存储到Qdrant

2. **RAG问答：**
   - 用户问题 → 生成向量 → 搜索相似内容 → LLM生成答案

3. **AI摘要：**
   - 文章内容 → LLM生成摘要和关键词 → 缓存到数据库

4. **评论审核：**
   - 评论提交 → LLM审核 → 自动通过/待审核

## 注意事项

1. **Qdrant服务**：确保Qdrant服务正在运行
2. **API配额**：注意OpenAI API的使用配额
3. **向量化时间**：大量文章向量化可能需要较长时间
4. **成本控制**：建议设置API使用限制和监控

## 故障排查

### Qdrant连接失败
- 检查Qdrant服务是否运行：`curl http://localhost:6333/health`
- 检查环境变量 `QDRANT_URL` 是否正确

### OpenAI API错误
- 检查API Key是否正确
- 检查API配额是否充足
- 查看服务器日志获取详细错误信息

### 向量化失败
- 检查文章内容是否为空
- 检查网络连接
- 查看控制台错误日志

