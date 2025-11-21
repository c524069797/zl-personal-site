/**
 * 博客分类工具
 * 根据标题和内容自动判断博客分类
 */

export type BlogCategory = 'tech' | 'life'

export interface CategoryInfo {
  category: BlogCategory
  label: string
  color: string
}

// 生活记录相关关键词
const LIFE_KEYWORDS = [
  '表达', '表达能力', '沟通', '沟通框架', '沟通技巧',
  '习惯', '提升', '成长', '自我管理', '效率', '行动', '改变', '日常',
  '生活', '记录', '思考', '感悟', '心得', '经验', '分享',
  '工作', '职场', '团队', '协作', '会议', '交流',
  '学习', '读书', '阅读', '笔记',
]

// 核心技术关键词（React、Next.js、Vue、MCP、n8n等，这些必须分类为技术博客）
const CORE_TECH_KEYWORDS = [
  'vue', 'vuejs', 'vue.js', 'vue2', 'vue3',
  'react', 'reactjs', 'react.js',
  'nextjs', 'next.js', 'next',
  'mcp', 'model context protocol',
  'n8n',
]

// 其他技术关键词
const OTHER_TECH_KEYWORDS = [
  'javascript', 'typescript', 'js', 'ts',
  '前端', '后端', '开发', '编程', '代码', '技术',
  '框架', '库', '工具', 'api', '接口', '数据库',
  '性能', '优化', '安全', 'xss', 'csrf',
  'webpack', 'vite', 'node', 'docker', 'git',
  '算法', '数据结构', '设计模式',
  '自动化', '工作流', '部署', 'ci/cd', 'devops',
  'vercel',
]

/**
 * 根据标题判断博客分类
 */
export function categorizeBlog(title: string, summary?: string): CategoryInfo {
  const searchText = summary ? `${title} ${summary}` : title
  const lowerText = searchText.toLowerCase()

  // 优先检查核心技术关键词（React、Next.js、Vue、MCP、n8n等）
  const hasCoreTechKeyword = CORE_TECH_KEYWORDS.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  )

  // 检查是否包含生活记录关键词
  const hasLifeKeyword = LIFE_KEYWORDS.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  )

  // 检查其他技术关键词（用于日志或调试，但当前逻辑不直接使用）
  const hasOtherTechKeyword = OTHER_TECH_KEYWORDS.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  )

  // 分类逻辑：
  // 1. 如果包含核心技术关键词（React、Next.js、Vue、MCP、n8n等），必须分类为技术博客
  // 2. 如果包含生活关键词（表达、沟通、习惯等），分类为生活记录
  // 3. 如果包含其他技术关键词，分类为技术博客
  // 4. 否则默认为技术博客
  if (hasCoreTechKeyword || hasOtherTechKeyword) {
    return {
      category: 'tech',
      label: '技术博客',
      color: '#1890ff', // 蓝色
    }
  }

  if (hasLifeKeyword) {
    return {
      category: 'life',
      label: '生活记录',
      color: '#52c41a', // 绿色
    }
  }

  return {
    category: 'tech',
    label: '技术博客',
    color: '#1890ff', // 蓝色
  }
}

/**
 * 获取分类信息
 */
export function getCategoryInfo(category: BlogCategory): CategoryInfo {
  if (category === 'life') {
    return {
      category: 'life',
      label: '生活记录',
      color: '#52c41a',
    }
  }
  return {
    category: 'tech',
    label: '技术博客',
    color: '#1890ff',
  }
}

