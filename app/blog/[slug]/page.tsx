import { notFound } from 'next/navigation'
import { getAllPostSlugs, getPostWithAuthorBySlug } from '@/lib/posts'
import { formatDateISO } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import BlogSidebar from '@/components/BlogSidebar'
import Footer from '@/components/Footer'
import CommentSection from '@/components/CommentSection'
import ArticleHeader from '@/components/ArticleHeader'
import ArticleActions from '@/components/ArticleActions'
import MarkdownContent from '@/components/MarkdownContent'
import AISummary from '@/components/AISummary'
import AIChatBot from '@/components/AIChatBot'

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()

  return slugs.map(slug => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostWithAuthorBySlug(slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: formatDateISO(post.date),
      tags: post.tags?.map(tag => tag.name) || [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostWithAuthorBySlug(slug)

  if (!post) {
    notFound()
  }

  const readingTime = Math.ceil(post.content?.length / 200 || 0)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--background)',
    }}>
      <Navigation
        breadcrumbItems={[
          {
            title: post.title,
          },
        ]}
      />
      <div
        style={{
          display: 'flex',
          padding: '32px 5%',
          flex: 1,
          gap: '32px',
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%',
          flexDirection: 'column',
        }}
        className="blog-detail-container"
      >
        <div style={{ flex: 1 }}>
          <ArticleHeader
            title={post.title}
            date={post.date}
            tags={post.tags}
            author={post.author}
            readingTime={readingTime}
          />
          <div
            style={{
              marginBottom: '48px',
              color: 'var(--foreground)',
            }}
          >
            <MarkdownContent content={post.content} />
          </div>
          <ArticleActions />
          <CommentSection postSlug={slug} />
        </div>
        <aside style={{ width: '100%', flexShrink: 0 }} className="blog-sidebar">
          <AISummary postId={post.id} />
          <BlogSidebar author={post.author} excludeSlug={slug} />
        </aside>
      </div>
      <Footer />
      <AIChatBot />
    </div>
  )
}
