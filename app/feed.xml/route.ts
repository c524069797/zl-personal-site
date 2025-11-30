import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const posts = (await getAllPosts()).slice(0, 10);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>陈灼的网络日志</title>
    <link>${baseUrl}</link>
    <description>个人技术博客，分享编程经验、技术思考和开发实践。专注于前端开发、后端架构、AI应用等领域。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>chenzhuo995@gmail.com (陈灼)</managingEditor>
    <webMaster>chenzhuo995@gmail.com (陈灼)</webMaster>
    <generator>Next.js</generator>
    <image>
      <url>${baseUrl}/favicon.png</url>
      <title>陈灼的网络日志</title>
      <link>${baseUrl}</link>
    </image>
    ${posts
      .map(
        (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(post.summary || post.title)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      ${post.tags && post.tags.length > 0 ? `<category>${post.tags.map(tag => escapeXml(tag)).join(', ')}</category>` : ''}
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

