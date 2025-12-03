import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  title: "博客",
  description: "浏览所有技术文章，包括前端开发、后端架构、AI应用等主题的技术分享和编程经验。",
  openGraph: {
    title: "博客 | 陈灼的网络日志",
    description: "浏览所有技术文章，包括前端开发、后端架构、AI应用等主题的技术分享和编程经验。",
    type: "website",
    url: `${siteUrl}/blog`,
    siteName: "陈灼的网络日志",
  },
  twitter: {
    card: "summary_large_image",
    title: "博客 | 陈灼的网络日志",
    description: "浏览所有技术文章，包括前端开发、后端架构、AI应用等主题的技术分享和编程经验。",
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}





