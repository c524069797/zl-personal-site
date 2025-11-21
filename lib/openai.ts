// OpenAI/DeepSeek客户端配置

import OpenAI from 'openai'

// AI提供商类型
export type AIProvider = 'chatgpt' | 'deepseek'

// 获取API配置
function getAIConfig(provider: AIProvider = 'deepseek') {
  if (provider === 'deepseek') {
    // DeepSeek API配置 - 使用SiliconFlow代理
    const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-fgvzeqpbrcacynlszrwidzgjhwwmiorqdbxgbvmtbmylfgrf'
    // DeepSeek通过SiliconFlow API调用，baseURL应该是 https://api.siliconflow.cn（不带/v1，因为OpenAI SDK会自动添加）
    const baseURL = 'https://api.siliconflow.cn'
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'
    return {
      apiKey,
      baseURL,
      model,
    }
  } else {
    // OpenAI API配置
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
}

// 注意：不再预创建客户端，改为在getAIClient中动态创建
// 这样可以确保每次调用时都使用正确的API key和配置，避免混用

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
export const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B'
export const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large'

// 获取当前使用的客户端和模型（默认使用DeepSeek）
export function getAIClient(provider: AIProvider = 'deepseek') {
  const config = getAIConfig(provider)

  if (provider === 'deepseek') {
    // DeepSeek：每次调用时重新创建，确保使用DeepSeek的API key和配置
    console.log(`[getAIClient] Using DeepSeek - baseURL: ${config.baseURL}, model: ${config.model}, apiKey: ${config.apiKey.substring(0, 10)}...`)
    return new OpenAI({
      apiKey: config.apiKey, // 使用DeepSeek的API key
      baseURL: config.baseURL, // 使用SiliconFlow的baseURL
    })
  } else {
    // ChatGPT：使用OpenAI的API key和配置
    console.log(`[getAIClient] Using ChatGPT - baseURL: ${config.baseURL}, model: ${config.model}`)
    return new OpenAI({
      apiKey: config.apiKey, // 使用OpenAI的API key
      baseURL: config.baseURL, // 使用OpenAI的baseURL
    })
  }
}

export function getAIModel(provider: AIProvider = 'deepseek') {
  const config = getAIConfig(provider)
  return config.model // 直接从配置中获取，确保不会混用
}

// 生成文本嵌入（仅支持OpenAI，因为DeepSeek可能不支持embeddings API）
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // 嵌入功能只使用OpenAI
    const openaiConfig = getAIConfig('chatgpt')
    const openaiClient = new OpenAI({
      apiKey: openaiConfig.apiKey,
      baseURL: openaiConfig.baseURL,
    })

    const response = await openaiClient.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    }, {
      timeout: 30000, // 30秒超时
    })

    return response.data[0].embedding
  } catch (error: any) {
    console.error('❌ Failed to generate embedding:', error)

    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      throw new Error('OpenAI API请求超时，请检查网络连接或稍后重试')
    }

    throw error
  }
}

// 生成AI摘要（默认使用DeepSeek）
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
      model: model,
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
      timeout: 30000, // 30秒超时
    })

    // 提取并清理响应内容
    let responseContent = response.choices[0].message.content || '{}'

    // 移除可能的markdown代码块标记
    responseContent = responseContent.trim()
    // 移除开头的 ```json 或 ``` 标记
    responseContent = responseContent.replace(/^```(?:json)?\s*/i, '')
    // 移除结尾的 ``` 标记
    responseContent = responseContent.replace(/\s*```$/i, '')
    responseContent = responseContent.trim()

    // 尝试解析JSON
    let result
    try {
      result = JSON.parse(responseContent)
    } catch (parseError: any) {
      console.error('❌ JSON解析失败，原始内容:', responseContent)
      console.error('❌ 解析错误:', parseError)
      // 尝试提取JSON对象
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0])
        } catch (e) {
          throw new Error(`生成摘要失败: JSON解析错误 - ${parseError.message}`)
        }
      } else {
        throw new Error(`生成摘要失败: JSON解析错误 - ${parseError.message}`)
      }
    }

    return {
      summary: result.summary || '',
      keywords: result.keywords || [],
    }
  } catch (error: any) {
    console.error('❌ Failed to generate summary:', error)

    // 提供更详细的错误信息
    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      throw new Error('OpenAI API请求超时，请检查网络连接或稍后重试')
    }

    if (error.status === 401 || error.message?.includes('API key')) {
      throw new Error('OpenAI API密钥无效，请检查环境变量配置')
    }

    if (error.status === 429 || error.message?.includes('rate limit')) {
      throw new Error('OpenAI API请求频率过高，请稍后重试')
    }

    throw new Error(`生成摘要失败: ${error.message || '未知错误'}`)
  }
}

// 审核评论内容（默认使用DeepSeek）
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
      model: model,
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
      timeout: 30000, // 30秒超时
    })

    // 提取并清理响应内容
    let responseContent = response.choices[0].message.content || '{}'

    // 移除可能的markdown代码块标记
    responseContent = responseContent.trim()
    // 移除开头的 ```json 或 ``` 标记
    responseContent = responseContent.replace(/^```(?:json)?\s*/i, '')
    // 移除结尾的 ``` 标记
    responseContent = responseContent.replace(/\s*```$/i, '')
    responseContent = responseContent.trim()

    // 尝试解析JSON
    let result
    try {
      result = JSON.parse(responseContent)
    } catch (parseError: any) {
      console.error('❌ JSON解析失败，原始内容:', responseContent)
      console.error('❌ 解析错误:', parseError)
      // 尝试提取JSON对象
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0])
        } catch (e) {
          throw new Error(`审核评论失败: JSON解析错误 - ${parseError.message}`)
        }
      } else {
        throw new Error(`审核评论失败: JSON解析错误 - ${parseError.message}`)
      }
    }
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

// RAG问答（默认使用DeepSeek）
export async function askQuestion(
  question: string,
  context: Array<{ title: string; content: string; slug: string }>,
  provider: AIProvider = 'deepseek'
): Promise<{ answer: string; sources: Array<{ title: string; slug: string }> }> {
  try {
    const client = getAIClient(provider)
    const model = getAIModel(provider)

    // 去重sources
    const uniqueSources = Array.from(
      new Map(context.map((c) => [c.slug, c])).values()
    )

    const contextText = uniqueSources
      .map((c, idx) => `[来源${idx + 1}] ${c.title}\n${c.content.substring(0, 500)}...`)
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
      model: model,
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
      timeout: 30000, // 30秒超时
    })

    // 提取并清理响应内容
    let responseContent = response.choices[0].message.content || '{}'

    // 移除可能的markdown代码块标记
    responseContent = responseContent.trim()
    // 移除开头的 ```json 或 ``` 标记
    responseContent = responseContent.replace(/^```(?:json)?\s*/i, '')
    // 移除结尾的 ``` 标记
    responseContent = responseContent.replace(/\s*```$/i, '')
    responseContent = responseContent.trim()

    // 尝试解析JSON
    let result
    try {
      result = JSON.parse(responseContent)
    } catch (parseError: any) {
      console.error('❌ JSON解析失败，原始内容:', responseContent)
      console.error('❌ 解析错误:', parseError)
      // 尝试提取JSON对象
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0])
        } catch (e) {
          throw new Error(`回答问题失败: JSON解析错误 - ${parseError.message}`)
        }
      } else {
        throw new Error(`回答问题失败: JSON解析错误 - ${parseError.message}`)
      }
    }
    return {
      answer: result.answer || '抱歉，我无法回答这个问题。',
      sources: result.sources || uniqueSources.map((s) => ({ title: s.title, slug: s.slug })),
    }
  } catch (error) {
    console.error('❌ Failed to answer question:', error)
    throw error
  }
}

