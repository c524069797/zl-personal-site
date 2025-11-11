import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
          您的姓名
        </h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-white">
          写作与项目分享
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/blog"
            className="rounded-lg border-2 border-gray-900 bg-gray-900 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800 dark:border-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            博客
          </Link>
          <Link
            href="/resume"
            className="rounded-lg border-2 border-gray-900 px-8 py-4 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
          >
            简历
          </Link>
        </div>
      </main>
    </div>
  );
}
