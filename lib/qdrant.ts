// Qdrant向量数据库客户端

import { QdrantClient } from '@qdrant/js-client-rest'

const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333'
const qdrantApiKey = process.env.QDRANT_API_KEY

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
})

// 集合名称
export const COLLECTION_NAME = 'blog_posts'

// 向量维度（text-embedding-3-large 是 3072 维）
export const VECTOR_SIZE = 3072

// 初始化集合
export async function initCollection() {
  try {
    // 检查集合是否存在
    const collections = await qdrantClient.getCollections()
    const collectionExists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    )

    if (!collectionExists) {
      // 创建集合
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      })
      console.log(`✅ Qdrant collection "${COLLECTION_NAME}" created`)
    } else {
      console.log(`ℹ️  Qdrant collection "${COLLECTION_NAME}" already exists`)
    }
  } catch (error) {
    console.error('❌ Failed to initialize Qdrant collection:', error)
    throw error
  }
}

// 添加向量到集合
export async function upsertVector(
  id: number | string,
  vector: number[],
  payload: {
    postId: string
    slug: string
    title: string
    content: string
    chunkIndex?: number
  }
) {
  try {
    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: id,
          vector: vector,
          payload: payload,
        },
      ],
    })
  } catch (error) {
    console.error('❌ Failed to upsert vector:', error)
    throw error
  }
}

// 搜索相似向量
export async function searchVectors(
  queryVector: number[],
  limit: number = 5,
  scoreThreshold: number = 0.7
) {
  try {
    const results = await qdrantClient.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: limit,
      score_threshold: scoreThreshold,
      with_payload: true,
      timeout: 10, // 10秒超时
    })

    return results
  } catch (error: any) {
    console.error('❌ Failed to search vectors:', error)

    // 提供更友好的错误信息
    if (error.message?.includes('ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      throw new Error('Qdrant服务连接失败，请确保Qdrant服务正在运行（docker run -p 6333:6333 qdrant/qdrant）')
    }

    throw error
  }
}

// 删除文章的所有向量
export async function deletePostVectors(postId: string) {
  try {
    await qdrantClient.delete(COLLECTION_NAME, {
      wait: true,
      filter: {
        must: [
          {
            key: 'postId',
            match: {
              value: postId,
            },
          },
        ],
      },
    })
  } catch (error) {
    console.error('❌ Failed to delete vectors:', error)
    throw error
  }
}

