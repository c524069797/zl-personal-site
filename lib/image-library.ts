/**
 * 前端技术图片白名单库
 * 包含常见前端技术的图片映射
 */

export interface ImageMapping {
  keywords: string[]
  imageUrl: string
  description: string
  isIcon?: boolean // 是否为图标（需要特殊处理）
  backgroundColor?: string // 图标背景色
}

/**
 * 图片白名单映射表
 * 根据关键词匹配对应的图片
 */
export const imageLibrary: ImageMapping[] = [
  // React 相关 - 使用React图标
  {
    keywords: ['react', 'reactjs', 'react.js', 'react hooks', 'react组件', 'react总结', 'react 总结'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    description: 'React 技术栈',
    isIcon: true,
    backgroundColor: '#61dafb',
  },
  {
    keywords: ['redux', 'zustand', 'mobx', '状态管理'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&auto=format',
    description: '状态管理',
  },

  // Vue 相关 - 使用Vue图标
  {
    keywords: ['vue', 'vuejs', 'vue.js', 'vue3', 'vue2', '组合式api', 'vue项目', 'vue开发', 'vue踩坑'],
    imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    description: 'Vue.js 框架',
    isIcon: true,
    backgroundColor: '#4fc08d',
  },

  // 构建工具
  {
    keywords: ['vite'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format',
    description: 'Vite 构建工具',
  },
  {
    keywords: ['webpack', 'webpack5', 'webpack配置'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format',
    description: 'Webpack 打包工具',
  },
  {
    keywords: ['rollup', 'parcel', '构建工具', '打包工具'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&auto=format',
    description: '构建工具',
  },

  // 基础技术
  {
    keywords: ['javascript', 'js', 'es6', 'es7', 'es8', '原生js'],
    imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop&auto=format',
    description: 'JavaScript',
  },
  {
    keywords: ['typescript', 'ts'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format',
    description: 'TypeScript',
  },
  {
    keywords: ['css', 'css3', 'scss', 'sass', 'less', 'stylus', '样式', '样式表'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
    description: 'CSS 样式',
  },
  {
    keywords: ['html', 'html5', '语义化'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format',
    description: 'HTML 标记语言',
  },

  // Next.js
  {
    keywords: ['nextjs', 'next.js', 'next', '服务端渲染', 'ssr'],
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop&auto=format',
    description: 'Next.js 框架',
  },

  // Node.js
  {
    keywords: ['nodejs', 'node.js', 'node', '后端', 'server'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format',
    description: 'Node.js 后端',
  },

  // 数据库
  {
    keywords: ['数据库', 'database', 'mysql', 'postgresql', 'mongodb', 'prisma'],
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop&auto=format',
    description: '数据库',
  },

  // 测试
  {
    keywords: ['测试', 'test', 'jest', 'vitest', '单元测试', 'e2e'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&auto=format',
    description: '测试',
  },

  // 性能优化
  {
    keywords: ['性能', '优化', 'performance', '性能优化', '性能调优'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format',
    description: '性能优化',
  },

  // 算法
  {
    keywords: ['算法', 'algorithm', '数据结构', 'leetcode'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&auto=format',
    description: '算法与数据结构',
  },

  // 设计模式
  {
    keywords: ['设计模式', 'design pattern', '模式'],
    imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=400&fit=crop&auto=format',
    description: '设计模式',
  },

  // Git
  {
    keywords: ['git', 'github', '版本控制', 'gitlab'],
    imageUrl: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?w=800&h=400&fit=crop&auto=format',
    description: 'Git 版本控制',
  },

  // Docker
  {
    keywords: ['docker', '容器', 'container', 'kubernetes', 'k8s'],
    imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=400&fit=crop&auto=format',
    description: 'Docker 容器',
  },

  // API
  {
    keywords: ['api', 'rest', 'graphql', '接口', '接口设计'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format',
    description: 'API 接口',
  },

  // 安全
  {
    keywords: ['安全', 'security', 'xss', 'csrf', '加密'],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop&auto=format',
    description: '安全',
  },

  // 移动端
  {
    keywords: ['移动端', 'mobile', '响应式', 'responsive', '小程序'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop&auto=format',
    description: '移动端开发',
  },

  // 前端工程化
  {
    keywords: ['工程化', '工程', '工具链', 'ci/cd', 'devops'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&auto=format',
    description: '前端工程化',
  },

  // 博客相关
  {
    keywords: ['博客', 'blog', '文章', '欢迎', '开始'],
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&auto=format',
    description: '博客文章',
  },

  // 表达和沟通相关 - 开会交流图片
  {
    keywords: ['表达', '表达能力', '沟通', '沟通框架', '沟通技巧', '会议', '交流', '团队协作', '协作', '说话', '演讲', '汇报', '沟通', '表达'],
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&auto=format',
    description: '会议交流',
  },

  // 个人成长和习惯
  {
    keywords: ['习惯', '提升', '成长', '自我管理', '效率', '行动', '改变', '日常', '门槛', '法则'],
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop&auto=format',
    description: '个人成长',
  },
]

/**
 * 从文本中提取关键词（用于匹配）
 */
function extractKeywordsFromText(text: string): string[] {
  const lowerText = text.toLowerCase()
  const keywords: string[] = []

  // 提取英文单词
  const englishWords = lowerText.match(/[a-z]+/g) || []
  keywords.push(...englishWords)

  // 提取中文关键词（移除常见停用词）
  const stopWords = ['的', '了', '和', '是', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '在', '有', '他', '她', '它', '我', '我们', '你们', '他们', '这个', '那个', '什么', '怎么', '为什么', '如何']
  const chineseWords = lowerText
    .replace(/[，。！？、；：""''（）【】《》\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0 && !stopWords.includes(word))

  keywords.push(...chineseWords)

  return keywords
}

/**
 * 在白名单中查找匹配的图片
 * @param title 文章标题
 * @param summary 文章摘要（可选）
 * @returns 匹配的图片映射对象，如果没有匹配则返回null
 */
export function findImageInLibrary(title: string, summary?: string): ImageMapping | null {
  const searchText = summary ? `${title} ${summary}` : title
  const lowerSearchText = searchText.toLowerCase()
  const keywords = extractKeywordsFromText(searchText)

  // 优先精确匹配标题中的关键词
  for (const mapping of imageLibrary) {
    for (const keyword of mapping.keywords) {
      const lowerKeyword = keyword.toLowerCase()
      // 检查标题或摘要中是否包含关键词
      if (lowerSearchText.includes(lowerKeyword)) {
        return mapping
      }
    }
  }

  // 如果没有精确匹配，尝试部分匹配
  for (const mapping of imageLibrary) {
    for (const keyword of keywords) {
      if (mapping.keywords.some(k => {
        const lowerK = k.toLowerCase()
        return keyword.includes(lowerK) || lowerK.includes(keyword)
      })) {
        return mapping
      }
    }
  }

  return null
}

/**
 * 获取所有可用的图片映射
 */
export function getAllImageMappings(): ImageMapping[] {
  return imageLibrary
}

