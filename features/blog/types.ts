export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  summary?: string
  category?: string
  coverImage?: string
  published: boolean
  createdAt: string
  updatedAt: string
  tags: BlogTag[]
  aiSummary?: string
  views?: number
}

export interface BlogTag {
  id: string
  name: string
}

export interface BlogComment {
  id: string
  content: string
  authorName: string
  authorEmail?: string
  postId: string
  parentId?: string
  createdAt: string
  aiScore?: number
  replies?: BlogComment[]
}

export interface BlogListProps {
  posts: BlogPost[]
  loading?: boolean
  onSearch?: (query: string) => void
  onCategoryChange?: (category: string) => void
  onTagChange?: (tag: string) => void
}

export interface BlogSidebarProps {
  categories: { name: string; count: number }[]
  tags: { name: string; count: number }[]
  archives: { month: string; count: number }[]
  selectedCategory?: string
  selectedTag?: string
  onCategorySelect?: (category: string) => void
  onTagSelect?: (tag: string) => void
}
