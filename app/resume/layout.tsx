import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  title: "个人简历 | 前端开发工程师",
  description:
    "前端开发工程师简历，聚焦企业级中后台、复杂业务流程与 AI 全栈开发协作。",
  keywords: [
    "前端开发",
    "Vue.js",
    "Vue 3",
    "React",
    "TypeScript",
    "企业级中后台",
    "AI 全栈",
    "软件设计师",
    "CET-6",
    "简历",
  ],
  openGraph: {
    title: "个人简历 | 前端开发工程师",
    description: "前端开发工程师简历 | 企业级后台 | 复杂业务建模 | AI 全栈开发",
    type: "profile",
    url: `${siteUrl}/resume`,
    siteName: "个人简历",
  },
  twitter: {
    card: "summary",
    title: "个人简历 | 前端开发工程师",
    description: "前端开发工程师简历 - Vue/React/TS/AI 全栈开发",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${siteUrl}/resume`,
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
