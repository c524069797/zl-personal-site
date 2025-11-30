import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostWithAuthorBySlug } from "@/lib/posts";
import { formatDateISO } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import BlogSidebar from "@/components/BlogSidebar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleActions from "@/components/ArticleActions";
import MarkdownContent from "@/components/MarkdownContent";
import AISummary from "@/components/AISummary";
import AIChatBot from "@/components/AIChatBot";
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/StructuredData";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostWithAuthorBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const siteName = "陈灼的网络日志";

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  const postUrl = `${siteUrl}/blog/${slug}`;
  const postImage = `${siteUrl}/favicon.png`; // 可以后续添加文章封面图
  const authorName = post.author?.name || "陈灼";

  return {
    title: post.title,
    description: post.summary || `${post.title} - ${siteName}`,
    keywords: post.tags?.map((t) => t.name) || [],
    authors: [{ name: authorName }],
    openGraph: {
      title: post.title,
      description: post.summary || `${post.title} - ${siteName}`,
      type: "article",
      url: postUrl,
      siteName: siteName,
      publishedTime: formatDateISO(post.date),
      modifiedTime: formatDateISO(post.date), // 如果有修改时间可以更新
      authors: [authorName],
      tags: post.tags?.map((t) => t.name) || [],
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || `${post.title} - ${siteName}`,
      images: [postImage],
      creator: authorName,
    },
    alternates: {
      canonical: postUrl,
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--background)',
    }}>
      {/* 结构化数据 */}
      <ArticleStructuredData
        post={{
          title: post.title,
          description: post.summary,
          date: post.date,
          author: post.author ? {
            name: post.author.name || "陈灼",
            email: post.author.email,
          } : undefined,
          tags: post.tags,
          slug: post.slug,
        }}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "首页", url: siteUrl },
          { name: "博客", url: `${siteUrl}/blog` },
          { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
        ]}
      />

      <Navigation
        breadcrumbItems={[
          {
            title: post.title,
          },
        ]}
      />

      {/* 主体内容区域 */}
      <div style={{
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
          <AISummary postId={post.id} postSlug={slug} />
          <BlogSidebar author={post.author} excludeSlug={slug} />
        </aside>
      </div>

      {/* 页脚 */}
      <Footer />

      {/* AI聊天机器人 */}
      <AIChatBot />
    </div>
  );
}
