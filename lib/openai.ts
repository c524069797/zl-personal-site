// AI客户端配置 - 统一使用中转URL

import OpenAI from 'openai'

// AI配置接口
interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
}

// 获取AI配置（从环境变量读取）
function getAIConfig(): AIConfig {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    throw new Error('AI_API_KEY is not set in environment variables. Please add it to your .env file.')
  }

  const baseURL = process.env.AI_BASE_URL
  if (!baseURL) {
    throw new Error('AI_BASE_URL is not set in environment variables. Please add it to your .env file.')
  }

  const model = process.env.AI_MODEL
  if (!model) {
    throw new Error('AI_MODEL is not set in environment variables. Please add it to your .env file.')
  }

  return { apiKey, baseURL, model }
}

// 获取Embedding配置（用于向量搜索，需要OpenAI）
function getEmbeddingConfig(): AIConfig {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set for embeddings. Please add it to your .env file.')
  }

  return {
    apiKey,
    baseURL: 'https://api.openai.com/v1',
    model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large',
  }
}

// 导出模型常量（用于向后兼容）
export const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large'

// 获取AI客户端
export function getAIClient() {
  const config = getAIConfig()

  console.log(`[getAIClient] baseURL: ${config.baseURL}, model: ${config.model}`)
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  })
}

// 获取当前配置的模型
export function getAIModel() {
  return getAIConfig().model
}

// 生成文本嵌入（使用OpenAI，因为需要embedding模型）
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const config = getEmbeddingConfig()
    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    })

    const response = await client.embeddings.create({
      model: config.model,
      input: text,
    }, {
      timeout: 30000,
    })

    return response.data[0].embedding
  } catch (error: unknown) {
    console.error('❌ Failed to generate embedding:', error)

    const err = error as { message?: string; code?: string }
    if (err.message?.includes('timeout') || err.code === 'ETIMEDOUT') {
      throw new Error('Embedding API请求超时，请检查网络连接或稍后重试')
    }

    throw error
  }
}

// 清理AI响应内容（移除markdown代码块标记）
function cleanResponseContent(content: string): string {
  let cleaned = content.trim()

  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '')
  cleaned = cleaned.replace(/\s*```$/i, '')
  return cleaned.trim()
}

// 解析JSON响应
function parseJSONResponse(content: string, errorPrefix: string): unknown {
  const cleaned = cleanResponseContent(content)

  try {
    return JSON.parse(cleaned)
  } catch (parseError: unknown) {
    console.error('❌ JSON解析失败，原始内容:', cleaned)

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        const msg = parseError instanceof Error ? parseError.message : String(parseError)
        throw new Error(`${errorPrefix}: JSON解析错误 - ${msg}`)
      }
    }

    const msg = parseError instanceof Error ? parseError.message : String(parseError)
    throw new Error(`${errorPrefix}: JSON解析错误 - ${msg}`)
  }
}

// 生成AI摘要
export async function generateSummary(
  title: string,
  content: string
): Promise<{ summary: string; keywords: string[] }> {
  try {
    const client = getAIClient()
    const model = getAIModel()

    const prompt = `请为以下博客文章生成一个简洁的摘要（100-150字）和1-2个关键词。

文章标题：${title}

文章内容：
${content.substring(0, 3000)}${content.length > 3000 ? '...' : ''}

请以JSON格式返回：
{
  "summary": "文章摘要",
  "keywords": ["关键词1", "关键词2"]
}`

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的博客内容分析助手，擅长生成简洁准确的摘要和提取关键词。请只返回JSON格式，不要包含任何markdown代码块标记。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }, {
      timeout: 30000,
    })

    const result = parseJSONResponse(
      response.choices[0].message.content || '{}',
      '生成摘要失败'
    ) as { summary?: string; keywords?: string[] }

    return {
      summary: result.summary || '',
      keywords: result.keywords || [],
    }
  } catch (error: unknown) {
    console.error('❌ Failed to generate summary:', error)

    const err = error as { message?: string; code?: string; status?: number }

    if (err.message?.includes('timeout') || err.code === 'ETIMEDOUT') {
      throw new Error('AI API请求超时，请检查网络连接或稍后重试')
    }

    if (err.status === 401 || err.message?.includes('API key')) {
      throw new Error('AI API密钥无效，请检查环境变量配置')
    }

    if (err.status === 429 || err.message?.includes('rate limit')) {
      throw new Error('AI API请求频率过高，请稍后重试')
    }

    throw new Error(`生成摘要失败: ${err.message || '未知错误'}`)
  }
}

// 审核评论内容
export async function moderateComment(content: string): Promise<{
  isSpam: boolean
  isToxic: boolean
  spamScore: number
  toxicScore: number
  autoReply?: string
}> {
  try {
    const client = getAIClient()
    const model = getAIModel()

    const prompt = `请审核以下评论内容，判断是否为垃圾信息或包含攻击性内容。

评论内容：${content}

请以JSON格式返回：
{
  "isSpam": true/false,
  "isToxic": true/false,
  "spamScore": 0.0-1.0,
  "toxicScore": 0.0-1.0,
  "autoReply": "如果是正常评论，生成一个简短的感谢回复（可选）"
}`

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的内容审核助手，能够准确识别垃圾信息和攻击性内容。请只返回JSON格式，不要包含任何markdown代码块标记。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    }, {
      timeout: 30000,
    })

    const result = parseJSONResponse(
      response.choices[0].message.content || '{}',
      '审核评论失败'
    ) as { isSpam?: boolean; isToxic?: boolean; spamScore?: number; toxicScore?: number; autoReply?: string }

    return {
      isSpam: result.isSpam || false,
      isToxic: result.isToxic || false,
      spamScore: result.spamScore || 0,
      toxicScore: result.toxicScore || 0,
      autoReply: result.autoReply,
    }
  } catch (error) {
    console.error('❌ Failed to moderate comment:', error)
    throw error
  }
}

// RAG问答
export async function askQuestion(
  question: string,
  context: Array<{ title: string; content: string; slug: string }>
): Promise<{ answer: string; sources: Array<{ title: string; slug: string }> }> {
  try {
    const client = getAIClient()
    const model = getAIModel()

    const uniqueSources = Array.from(
      new Map(context.map(c => [c.slug, c])).values()
    )

    // 构建文章列表
    const articleList = uniqueSources
      .map((c, idx) => `${idx + 1}. 《${c.title}》`)
      .join('\n')

    const contextText = uniqueSources
      .map((c) => `【${c.title}】\n${c.content}`)
      .join('\n\n---\n\n')

    const prompt = `你是一个博客助手。我会提供博客数据库中搜索到的相关文章，请你基于这些文章内容回答用户的问题。

用户问题：${question}

📚 从博客数据库中搜索到以下相关文章：
${articleList}

---
以下是文章的具体内容：

${contextText}

---

请按以下格式回答（不要使用JSON，直接用文本格式）：

📖 相关博客：
（列出你参考的博客名称）

💡 回答：
（基于上述博客内容，回答用户的问题。如果博客中没有相关信息，请诚实地说"在现有博客中没有找到相关内容"）`

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的博客助手，负责从博客数据库中搜索相关文章并回答用户问题。回答时请先列出参考的博客名称，再给出答案。直接用文本格式回复，不要用JSON。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }, {
      timeout: 30000,
    })

    const answer = response.choices[0].message.content || '抱歉，我无法回答这个问题。'

    return {
      answer,
      sources: uniqueSources.map(s => ({ title: s.title, slug: s.slug })),
    }
  } catch (error) {
    console.error('❌ Failed to answer question:', error)
    throw error
  }
}
