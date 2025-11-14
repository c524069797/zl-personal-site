'use client'

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 style={{
      fontSize: '1.875rem',
      fontWeight: 'bold',
      margin: '2rem 0 1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid var(--border)',
      color: 'var(--foreground)',
    }}>
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 style={{
      fontSize: '1.5rem',
      fontWeight: '600',
      margin: '2rem 0 1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid var(--border)',
      color: 'var(--foreground)',
    }}>
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 style={{
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: '1.5rem 0 1rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p style={{
      marginBottom: '1.5rem',
      lineHeight: '1.6',
      color: 'var(--foreground)',
    }}>
      {children}
    </p>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      style={{
        color: '#1890ff',
        textDecoration: 'none',
        transition: 'text-decoration 0.3s',
      }}
      target="_blank"
      rel="noopener noreferrer"
      className="markdown-link"
    >
      {children}
    </a>
  ),
  ul: ({ children }: any) => (
    <ul style={{
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol style={{
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li style={{
      marginBottom: '0.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </li>
  ),
  code: ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre style={{
        background: '#2d2d2d',
        color: '#f8f8f2',
        padding: '1rem',
        borderRadius: '4px',
        margin: '1.5rem 0',
        overflow: 'auto',
      }}>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code
        style={{
          background: 'var(--background-light)',
          padding: '0.125rem 0.375rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: 'var(--foreground)',
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: ({ children }: any) => (
    <blockquote style={{
      borderLeft: '3px solid #1890ff',
      padding: '1rem 1.5rem',
      background: 'var(--background-light)',
      margin: '1.5rem 0',
      color: 'var(--text-secondary)',
      fontStyle: 'italic',
    }}>
      {children}
    </blockquote>
  ),
  img: ({ src, alt }: any) => (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: '100%',
        borderRadius: '4px',
        margin: '1rem 0',
      }}
    />
  ),
};

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .markdown-link:hover {
            text-decoration: underline;
          }
        `
      }} />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

