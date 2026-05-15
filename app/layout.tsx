import type { Metadata } from "next";
import "czl-personal-ui/styles.css";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { LoadingBar } from "@/components/LoadingBar";
import { PageTransition } from "@/components/PageTransition";
import { GlobalLoadingMask } from "@/components/GlobalLoadingMask";
import { WebSiteStructuredData } from "@/components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
const siteName = "陈灼的网络日志";
const siteDescription = "个人技术博客，分享编程经验、技术思考和开发实践。专注于前端开发、后端架构、AI Agent 等领域。";
const authorName = "陈灼";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "技术博客",
    "编程",
    "前端开发",
    "后端开发",
    "全栈开发",
    "React",
    "Next.js",
    "TypeScript",
    "AI Agent",
    "软件开发",
    "编程教程",
    "技术分享",
  ],
  authors: [{ name: authorName }],
  creator: authorName,
  publisher: authorName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/favicon.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/favicon.png`],
  },
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
  verification: {
    // 如果需要验证，可以添加
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <WebSiteStructuredData
          siteName={siteName}
          siteUrl={siteUrl}
          description={siteDescription}
        />
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorBgContainer: 'var(--background)',
                colorText: 'var(--foreground)',
                colorBorder: 'var(--border)',
              },
            }}
          >
            <App>
              <ThemeProvider>
                <LoadingBar />
                <GlobalLoadingMask />
                <PageTransition>
                  {children}
                </PageTransition>
              </ThemeProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
