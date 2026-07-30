import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  title: "个人简历 | AI Agent / AI 全栈工程师",
  description:
    "AI Agent / AI 全栈工程师简历，聚焦 Agent 编排、RAG 工程化与企业级业务系统落地。",
  keywords: [
    "AI Agent",
    "AI 全栈",
    "LangGraph",
    "RAG",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "软件设计师",
    "简历",
  ],
  openGraph: {
    title: "个人简历 | AI Agent / AI 全栈工程师",
    description: "AI Agent / AI 全栈工程师简历 | Agent 编排 | RAG 工程化 | 企业级业务系统",
    type: "profile",
    url: `${siteUrl}/resume`,
    siteName: "个人简历",
  },
  twitter: {
    card: "summary",
    title: "个人简历 | AI Agent / AI 全栈工程师",
    description: "AI Agent / AI 全栈工程师简历 - LangGraph/RAG/Next.js/Python",
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
