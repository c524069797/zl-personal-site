// Qdrant向量数据库客户端

import { QdrantClient } from '@qdrant/js-client-rest'

const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333'
const qdrantApiKey = process.env.QDRANT_API_KEY

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
})

export const COLLECTION_NAME = 'blog_posts'
export const VECTOR_SIZE = 3072

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

export async function initCollection() {
  try {
    const collections = await qdrantClient.getCollections()
    const collectionExists = collections.collections.some(collection => collection.name === COLLECTION_NAME)

    if (!collectionExists) {
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
          id,
          vector,
          payload,
        },
      ],
    })
  } catch (error) {
    console.error('❌ Failed to upsert vector:', error)
    throw error
  }
}

export async function searchVectors(
  queryVector: number[],
  limit: number = 5,
  scoreThreshold: number = 0.7
) {
  try {
    return await qdrantClient.search(COLLECTION_NAME, {
      vector: queryVector,
      limit,
      score_threshold: scoreThreshold,
      with_payload: true,
      timeout: 10,
    })
  } catch (error: unknown) {
    console.error('❌ Failed to search vectors:', error)

    const errorMessage = getErrorMessage(error)
    const errorCode = getErrorCode(error)

    if (errorMessage.includes('ECONNREFUSED') || errorCode === 'ECONNREFUSED') {
      throw new Error('Qdrant服务连接失败，请确保Qdrant服务正在运行（docker run -p 6333:6333 qdrant/qdrant）')
    }

    throw error
  }
}

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
