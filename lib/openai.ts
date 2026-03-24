// OpenAI/DeepSeek客户端配置

import OpenAI from 'openai'

export type AIProvider = 'chatgpt' | 'deepseek'

interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
}

interface SummaryResult {
  summary?: string
  keywords?: string[]
}

interface ModerateCommentResult {
  isSpam?: boolean
  isToxic?: boolean
  spamScore?: number
  toxicScore?: number
  autoReply?: string
}

interface AskQuestionResult {
  answer?: string
  sources?: Array<{ title: string; slug: string }>
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return ''
}

const getErrorCode = (error: unknown) => {
  if (typeof error === 'object' && error && 'code' in error && typeof error.code === 'string') {
    return error.code
  }
  return ''
}

const getErrorStatus = (error: unknown) => {
  if (typeof error === 'object' && error && 'status' in error && typeof error.status === 'number') {
    return error.status
  }
  return 0
}

const parseJsonResponse = <T>(responseContent: string, actionName: string) => {
  try {
    return JSON.parse(responseContent) as T
  } catch (parseError: unknown) {
    const parseErrorMessage = getErrorMessage(parseError)

    console.error(`❌ ${actionName} JSON解析失败，原始内容:`, responseContent)
    console.error('❌ 解析错误:', parseError)

    const jsonMatch = responseContent.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T
      } catch {
        throw new Error(`${actionName}失败: JSON解析错误 - ${parseErrorMessage}`)
      }
    }

    throw new Error(`${actionName}失败: JSON解析错误 - ${parseErrorMessage}`)
  }
}

function getAIConfig(provider: AIProvider = 'deepseek'): AIConfig {
  if (provider === 'deepseek') {
    const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-fgvzeqpbrcacynlszrwidzgjhwwmiorqdbxgbvmtbmylfgrf'
    const baseURL = 'https://api.siliconflow.cn'
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'

    return {
      apiKey,
      baseURL,
      model,
    }
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables. Please add it to your .env file.')
  }

  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'

  return {
    apiKey,
    baseURL: 'https://api.openai.com/v1',
    model,
  }
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
export const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'
export const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large'

export function getAIClient(provider: AIProvider = 'deepseek') {
  const config = getAIConfig(provider)

  if (provider === 'deepseek') {
    console.log(`[getAIClient] Using DeepSeek - baseURL: ${config.baseURL}, model: ${config.model}, apiKey: ${config.apiKey.substring(0, 10)}...`)
    return new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    })
  }

  console.log(`[getAIClient] Using ChatGPT - baseURL: ${config.baseURL}, model: ${config.model}`)
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  })
}

export function getAIModel(provider: AIProvider = 'deepseek') {
  return getAIConfig(provider).model
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const openaiConfig = getAIConfig('chatgpt')
    const openaiClient = new OpenAI({
      apiKey: openaiConfig.apiKey,
      baseURL: openaiConfig.baseURL,
    })

    const response = await openaiClient.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    }, {
      timeout: 30000,
    })

    return response.data[0].embedding
  } catch (error: unknown) {
    console.error('❌ Failed to generate embedding:', error)

    const errorMessage = getErrorMessage(error)
    const errorCode = getErrorCode(error)

    if (errorMessage.includes('timeout') || errorCode === 'ETIMEDOUT') {
      throw new Error('OpenAI API请求超时，请检查网络连接或稍后重试')
    }

    throw error
  }
}

export async function generateSummary(
  title: string,
  content: string,
  provider: AIProvider = 'deepseek'
): Promise<{ summary: string; keywords: string[] }> {
  try {
    const client = getAIClient(provider)
    const model = getAIModel(provider)
    const config = getAIConfig(provider)

    console.log(`[generateSummary] Provider: ${provider}, Model: ${model}, baseURL: ${config.baseURL}, apiKey: ${config.apiKey.substring(0, 10)}...`)

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
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }, {
      timeout: 30000,
    })

    let responseContent = response.choices[0].message.content || '{}'

    responseContent = responseContent.trim()
    responseContent = responseContent.replace(/^```(?:json)?\s*/i, '')
    responseContent = responseContent.replace(/\s*```$/i, '')
    responseContent = responseContent.trim()

    const result = parseJsonResponse<SummaryResult>(responseContent, '生成摘要')

    return {
      summary: result.summary || '',
      keywords: result.keywords || [],
    }
  } catch (error: unknown) {
    console.error('❌ Failed to generate summary:', error)

    const errorMessage = getErrorMessage(error)
    const errorCode = getErrorCode(error)
    const errorStatus = getErrorStatus(error)

    if (errorMessage.includes('timeout') || errorCode === 'ETIMEDOUT') {
      throw new Error('OpenAI API请求超时，请检查网络连接或稍后重试')
    }

    if (errorStatus === 401 || errorMessage.includes('API key')) {
      throw new Error('OpenAI API密钥无效，请检查环境变量配置')
    }

    if (errorStatus === 429 || errorMessage.includes('rate limit')) {
      throw new Error('OpenAI API请求频率过高，请稍后重试')
    }

    throw new Error(`生成摘要失败: ${errorMessage || '未知错误'}`)
  }
}

export async function moderateComment(
  content: string,
  provider: AIProvider = 'deepseek'
): Promise<{
  isSpam: boolean
  isToxic: boolean
  spamScore: number
  toxicScore: number
  autoReply?: string
}> {
  try {
    const client = getAIClient(provider)
    const model = getAIModel(provider)

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
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }, {
      timeout: 30000,
    })

    let responseContent = response.choices[0].message.content || '{}'

    responseContent = responseContent.trim()
    responseContent = responseContent.replace(/^```(?:json)?\s*/i, '')
    responseContent = responseContent.replace(/\s*```$/i, '')
    responseContent = responseContent.trim()

    const result = parseJsonResponse<ModerateCommentResult>(responseContent, '审核评论')

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

export async function askQuestion(
  question: string,
  context: Array<{ title: string; content: string; slug: string }>,
  provider: AIProvider = 'deepseek'
): Promise<{ answer: string; sources: Array<{ title: string; slug: string }> }> {
  try {
    const client = getAIClient(provider)
    const model = getAIModel(provider)
    const uniqueSources = Array.from(new Map(context.map(item => [item.slug, item])).values())

    const contextText = uniqueSources
      .map((item, idx) => `[来源${idx + 1}] ${item.title}\n${item.content.substring(0, 500)}...`)
      .join('\n\n')

    const prompt = `基于以下博客文章内容回答用户的问题。如果内容中没有相关信息，请诚实地说不知道。

用户问题：${question}

相关文章内容：
${contextText}

请以JSON格式返回：
{
  "answer": "回答内容",
  "sources": [
    {"title": "文章标题", "slug": "文章slug"}
  ]
}`

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的博客助手，能够基于提供的文章内容准确回答用户问题。请只返回JSON格式，不要包含任何markdown代码块标记。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }, {
      timeout: 30000,
    })

    let responseContent = response.choices[0].message.content || '{}'

    responseContent = responseContent.trim()
    responseContent = responseContent.replace(/^```(?:json)?\s*/i, '')
    responseContent = responseContent.replace(/\s*```$/i, '')
    responseContent = responseContent.trim()

    const result = parseJsonResponse<AskQuestionResult>(responseContent, '回答问题')

    return {
      answer: result.answer || '抱歉，我无法回答这个问题。',
      sources: result.sources || uniqueSources.map(source => ({ title: source.title, slug: source.slug })),
    }
  } catch (error) {
    console.error('❌ Failed to answer question:', error)
    throw error
  }
}
