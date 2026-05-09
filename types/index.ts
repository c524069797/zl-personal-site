export interface Post {
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
  tags: Tag[]
  aiSummary?: string
  views?: number
}

export interface Tag {
  id: string
  name: string
}

export interface Comment {
  id: string
  content: string
  authorName: string
  authorEmail?: string
  postId: string
  parentId?: string
  createdAt: string
  aiScore?: number
  replies?: Comment[]
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
}

export interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
