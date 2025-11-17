// 批量向量化所有已发布文章的脚本

import { initCollection } from '../lib/qdrant'
import { vectorizeAllPosts } from '../lib/vectorize'
import { prisma } from '../lib/prisma'

async function main() {
  try {
    console.log('🚀 Starting vectorization process...')

    // 初始化Qdrant集合
    await initCollection()

    // 向量化所有文章
    await vectorizeAllPosts()

    console.log('✅ Vectorization completed successfully')
  } catch (error) {
    console.error('❌ Vectorization failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

