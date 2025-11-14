import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostSlugs, getPostWithAuthorBySlug } from "@/lib/posts";
import { formatDate, formatDateISO } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleActions from "@/components/ArticleActions";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import MarkdownContent from "@/components/MarkdownContent";

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
        {/* 面包屑导航 */}
        <BreadcrumbNav
          items={[
            {
              title: post.title,
            },
          ]}
        />

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
            <MarkdownContent content={post.content} />
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
