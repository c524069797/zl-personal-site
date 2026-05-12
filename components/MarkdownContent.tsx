'use client'

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement, useState } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

/**
 * 【React 进阶模式学习 7：树状结构的递归遍历】
 * React 的 children 可能是一个字符串，也可能是一个数组，甚至是一个极其嵌套的 React 元素对象树。
 * 当我们需要从富文本组件中提取纯文本（例如为了实现“一键复制”功能）时，
 * 就需要使用这种递归函数，一层层剥开对象的 props.children，直到拿到最底层的纯文本 string。
 */
// 递归提取 React 元素中的文本内容
function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return extractTextFromChildren(children.props.children);
  }
  return '';
}

type CodeBlockProps = ComponentPropsWithoutRef<"code"> & {
  code: string;
  language: string;
};

// 代码块组件（CSDN风格）
function CodeBlock({ code, language, className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 从 DOM 中提取纯文本用于复制
  const getCodeText = () => {
    if (typeof code === 'string') {
      return code;
    }
    // 如果 code 不是字符串，尝试从 children 中提取
    if (typeof children === 'string') {
      return children;
    }
    // 降级方案：从 DOM 中提取
    return '';
  };

  const handleCopy = async () => {
    const codeText = getCodeText();
    if (!codeText) {
      // 如果无法获取文本，尝试从 DOM 中提取
      const codeElement = document.querySelector(`.code-block-${language}`);
      if (codeElement) {
        const text = codeElement.textContent || '';
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // 降级方案
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = codeText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        margin: '1.5rem 0',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid #e8e8e8',
        background: '#fafafa',
      }}
    >
      {/* 代码块头部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: '#f5f5f5',
          borderBottom: '1px solid #e8e8e8',
          fontSize: '12px',
          color: '#666',
        }}
      >
        <span style={{ fontWeight: 500 }}>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#666',
            fontSize: '12px',
            borderRadius: '3px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e8e8e8';
            e.currentTarget.style.color = '#333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#666';
          }}
        >
          {copied ? (
            <>
              <CheckOutlined style={{ fontSize: '12px' }} />
              <span>已复制</span>
            </>
          ) : (
            <>
              <CopyOutlined style={{ fontSize: '12px' }} />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      {/* 代码内容 */}
      <pre
        style={{
          margin: 0,
          padding: '16px',
          background: '#fafafa',
          color: '#333',
          fontSize: '14px',
          lineHeight: '1.6',
          overflow: 'auto',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          whiteSpace: 'pre',
        }}
      >
        <code
          className={`${className} code-block-${language}`}
          {...props}
        >
          {children || code}
        </code>
      </pre>
    </div>
  );
}

const markdownComponents: Components = {
  h1: ({ children }) => (
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
  h2: ({ children }) => (
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
  h3: ({ children }) => (
    <h3 style={{
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: '1.5rem 0 1rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{
      marginBottom: '1.5rem',
      lineHeight: '1.6',
      color: 'var(--foreground)',
    }}>
      {children}
    </p>
  ),
  a: ({ href, children }) => (
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
  ul: ({ children }) => (
    <ul style={{
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{
      marginBottom: '0.5rem',
      color: 'var(--foreground)',
    }}>
      {children}
    </li>
  ),
  code: ({ className, children, node, ...props }) => {
    void node;
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : '';

    // 提取纯文本用于复制功能，并移除末尾的换行符
    const codeText = extractTextFromChildren(children).replace(/\n$/, '');

    return match ? (
      <CodeBlock
        code={codeText}
        language={language}
        className={className}
        {...props}
      >
        {children}
      </CodeBlock>
    ) : (
      <code
        style={{
          background: '#f5f5f5',
          padding: '0.125rem 0.375rem',
          borderRadius: '3px',
          fontSize: '0.875rem',
          color: '#e83e8c',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
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
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
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
          /* CSDN风格代码高亮样式 */
          .hljs {
            background: #fafafa !important;
            color: #333 !important;
          }
          .hljs-keyword {
            color: #0000ff !important;
            font-weight: bold;
          }
          .hljs-string {
            color: #008000 !important;
          }
          .hljs-comment {
            color: #808080 !important;
            font-style: italic;
          }
          .hljs-number {
            color: #ff0000 !important;
          }
          .hljs-function {
            color: #795e26 !important;
          }
          .hljs-variable {
            color: #001080 !important;
          }
          .hljs-title {
            color: #267f99 !important;
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
