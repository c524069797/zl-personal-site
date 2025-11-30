interface StructuredDataProps {
  type: "Article" | "Blog" | "WebSite" | "BreadcrumbList";
  data: Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          ...data,
        };
      case "Blog":
        return {
          "@context": "https://schema.org",
          "@type": "Blog",
          ...data,
        };
      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          ...data,
        };
      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          ...data,
        };
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface ArticleStructuredDataProps {
  post: {
    title: string;
    description: string;
    date: string;
    author?: {
      name: string;
      email?: string;
    };
    tags?: Array<{ name: string }>;
    slug: string;
  };
}

export function ArticleStructuredData({ post }: ArticleStructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${siteUrl}/favicon.png`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author?.name || "陈灼",
      ...(post.author?.email && { email: post.author.email }),
    },
    publisher: {
      "@type": "Organization",
      name: "陈灼的网络日志",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.map((t) => t.name).join(", "),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface WebSiteStructuredDataProps {
  siteName: string;
  siteUrl: string;
  description: string;
}

export function WebSiteStructuredData({
  siteName,
  siteUrl,
  description,
}: WebSiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

