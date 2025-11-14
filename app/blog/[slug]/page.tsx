import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostSlugs, getPostWithAuthorBySlug } from "@/lib/posts";
import { formatDate, formatDateISO } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleActions from "@/components/ArticleActions";

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 style={{
      fontSize: '1.875rem',
      fontWeight: 'bold',
      margin: '2rem 0 1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid var(--border)',
      color: 'var(--foreground)',
    }}>
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 style={{
      fontSize: '1.5rem',
      fontWeight: '600',
      margin: '2rem 0 1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid var(--border)',
      color: 'var(--foreground)',
    }}>
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 style={{
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: '1.5rem 0 1rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p style={{
      marginBottom: '1.5rem',
      lineHeight: '1.6',
      color: 'var(--foreground)',
    }}>
      {children}
    </p>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      style={{
        color: '#1890ff',
        textDecoration: 'none',
      }}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none';
      }}
    >
      {children}
    </a>
  ),
  ul: ({ children }: any) => (
    <ul style={{
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol style={{
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li style={{
      marginBottom: '0.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </li>
  ),
  code: ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre style={{
        background: '#2d2d2d',
        color: '#f8f8f2',
        padding: '1rem',
        borderRadius: '4px',
        margin: '1.5rem 0',
        overflow: 'auto',
      }}>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code
        style={{
          background: 'var(--background-light)',
          padding: '0.125rem 0.375rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: 'var(--foreground)',
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: ({ children }: any) => (
    <blockquote style={{
      borderLeft: '3px solid #1890ff',
      padding: '1rem 1.5rem',
      background: 'var(--background-light)',
      margin: '1.5rem 0',
      color: 'var(--text-secondary)',
      fontStyle: 'italic',
    }}>
      {children}
    </blockquote>
  ),
  img: ({ src, alt }: any) => (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: '100%',
        borderRadius: '4px',
        margin: '1rem 0',
      }}
    />
  ),
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostWithAuthorBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: formatDateISO(post.date),
      tags: post.tags?.map((t) => t.name) || [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostWithAuthorBySlug(slug);

  if (!post) {
    notFound();
  }

  // 计算阅读时间（假设每分钟200字）
  const readingTime = Math.ceil(post.content?.length / 200 || 0);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--background)',
    }}>
      <Navigation />

      {/* 主体内容区域 */}
      <div style={{
        display: 'flex',
        padding: '32px 5%',
        flex: 1,
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        flexDirection: 'column',
      }}
      className="blog-detail-container"
      >
        {/* 文章主体部分 */}
        <div style={{ flex: 1 }}>
          {/* 文章头部 */}
          <ArticleHeader
            title={post.title}
            date={post.date}
            tags={post.tags}
            author={post.author}
            readingTime={readingTime}
          />


          {/* 文章内容 */}
          <div style={{
            marginBottom: '48px',
            color: 'var(--foreground)',
          }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 文章操作区 */}
          <ArticleActions />

          {/* 评论区 */}
          <CommentSection postSlug={slug} />
        </div>

        {/* 侧边栏 */}
        <aside style={{ width: '100%', flexShrink: 0 }} className="blog-sidebar">
          <BlogSidebar author={post.author} excludeSlug={slug} />
        </aside>
      </div>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}
