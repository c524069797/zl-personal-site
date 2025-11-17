// 文章向量化工具

import { prisma } from './prisma'
import { upsertVector, deletePostVectors } from './qdrant'
import { generateEmbedding } from './openai'

// 简单的字符串hash函数，生成数字ID
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// 将文章内容分块（每块约500字）
function chunkText(text: string, chunkSize: number = 500): string[] {
  const chunks: string[] = []
  const sentences = text.split(/[。！？\n]/).filter((s) => s.trim().length > 0)

  let currentChunk = ''
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence + '。'
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

// 向量化单篇文章
export async function vectorizePost(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!post || !post.published) {
      throw new Error('Post not found or not published')
    }

    // 删除旧的向量
    await deletePostVectors(postId)

    // 准备文本内容
    const fullText = `${post.title}\n\n${post.content}`
    const chunks = chunkText(fullText)

    // 为每个块生成向量并存储
    // 使用简单的hash生成数字ID（Qdrant需要数字ID）
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const embedding = await generateEmbedding(chunk)

      // 生成数字ID：使用postId的hash + chunkIndex
      const vectorId = hashString(`${postId}_${i}`)
      await upsertVector(vectorId, embedding, {
        postId: post.id,
        slug: post.slug,
        title: post.title,
        content: chunk,
        chunkIndex: i,
      })
    }

    // 更新文章状态
    await prisma.post.update({
      where: { id: postId },
      data: { vectorized: true },
    })

    console.log(`✅ Post ${postId} vectorized successfully`)
  } catch (error) {
    console.error(`❌ Failed to vectorize post ${postId}:`, error)
    throw error
  }
}

// 批量向量化所有已发布文章
export async function vectorizeAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { id: true },
    })

    console.log(`📝 Found ${posts.length} posts to vectorize`)

    for (const post of posts) {
      try {
        await vectorizePost(post.id)
      } catch (error) {
        console.error(`Failed to vectorize post ${post.id}:`, error)
      }
    }

    console.log(`✅ Vectorization completed`)
  } catch (error) {
    console.error('❌ Failed to vectorize all posts:', error)
    throw error
  }
}

