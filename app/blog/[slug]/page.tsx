import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { formatDate, formatDateISO } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="mb-3 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold text-gray-900 dark:text-white">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="mb-4 leading-7 text-gray-700 dark:text-white">
      {children}
    </p>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-blue-600 hover:underline dark:text-white dark:border-white"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }: any) => (
    <ul className="mb-4 ml-6 list-disc text-gray-700 dark:text-white">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="mb-4 ml-6 list-decimal text-gray-700 dark:text-white">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="mb-2 text-gray-700 dark:text-white">{children}</li>
  ),
  code: ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800 dark:text-white">
        <code className={`${className} dark:text-white`} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code
        className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800 dark:text-white"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: ({ children }: any) => (
    <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-white dark:text-white">
      {children}
    </blockquote>
  ),
};

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <article className="mx-auto max-w-3xl px-4 py-16">
        <Link
          href="/blog"
            className="mb-8 inline-block text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
        >
          ← 返回博客列表
        </Link>

        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <p className="mb-4 text-sm text-gray-500 dark:text-white">
            {formatDate(post.date)}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-white">
          <CopyLinkButton />
        </div>
      </article>
    </div>
  );
}

