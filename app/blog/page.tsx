import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "博客",
  description: "我的博客文章列表",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
          >
            ← 返回首页
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
            博客
          </h1>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-gray-600 dark:text-white">暂无文章</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg dark:border-white"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="mb-2 text-2xl font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-white">
                    {post.title}
                  </h2>
                </Link>
                <p className="mb-3 text-sm text-gray-500 dark:text-white">
                  {formatDate(post.date)}
                </p>
                <p className="mb-4 text-gray-600 dark:text-white">
                  {post.summary}
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
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

