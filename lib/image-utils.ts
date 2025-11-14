/**
 * 根据文章标题生成图片URL
 * 使用多种策略来获取合适的图片
 * 1. 优先从白名单库中匹配
 * 2. 如果没有匹配，使用自动生成
 */

import { findImageInLibrary } from './image-library'

/**
 * 从标题中提取关键词（简化版，可以后续用AI优化）
 */
export function extractKeywords(title: string): string {
  // 移除常见的中文停用词和标点
  const stopWords = ['的', '了', '和', '是', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']

  let keywords = title
    .replace(/[，。！？、；：""''（）【】《》]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0 && !stopWords.includes(word))
    .slice(0, 3) // 取前3个关键词
    .join(' ')

  // 如果没有提取到关键词，使用原标题（截取前10个字符）
  if (!keywords || keywords.trim().length === 0) {
    keywords = title.substring(0, 10).trim()
  }

  return keywords || 'technology'
}

/**
 * 使用Unsplash API获取图片（免费，无需API key，但有限制）
 * 如果Unsplash不可用，可以使用其他服务
 */
export function getUnsplashImageUrl(keywords: string, width: number = 800, height: number = 600): string {
  // Unsplash Source API（无需API key，但有限制）
  // 格式：https://source.unsplash.com/{width}x{height}/?{keywords}
  const encodedKeywords = encodeURIComponent(keywords)
  return `https://source.unsplash.com/${width}x${height}/?${encodedKeywords}&sig=${Math.random()}`
}

/**
 * 使用Picsum（占位图服务，但根据seed生成不同图片）
 * 基于标题生成seed，确保相同标题总是得到相同图片
 */
export function getPicsumImageUrl(title: string, width: number = 800, height: number = 600): string {
  // 将标题转换为数字seed
  let seed = 0
  for (let i = 0; i < title.length; i++) {
    seed = ((seed << 5) - seed) + title.charCodeAt(i)
    seed = seed & seed // 转换为32位整数
  }
  seed = Math.abs(seed)

  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

/**
 * 使用Lorem Picsum的随机图片（基于标题的hash）
 */
export function getImageUrl(title: string, width: number = 800, height: number = 600): string {
  // 优先使用Picsum，因为它基于seed，相同标题会得到相同图片
  // 如果需要更相关的图片，可以切换到Unsplash
  return getPicsumImageUrl(title, width, height)

  // 如果需要使用Unsplash（需要处理可能的限制）
  // return getUnsplashImageUrl(extractKeywords(title), width, height)
}

/**
 * 生成文章封面图片URL
 * 优先从白名单库中匹配，如果没有匹配则使用自动生成
 */
export function getPostCoverImage(title: string, summary?: string): string {
  // 1. 优先从白名单库中查找匹配的图片
  const libraryImage = findImageInLibrary(title, summary)
  if (libraryImage) {
    return libraryImage
  }

  // 2. 如果没有匹配，使用自动生成的图片
  const searchText = summary ? `${title} ${summary.substring(0, 20)}` : title
  return getImageUrl(searchText, 800, 400)
}

