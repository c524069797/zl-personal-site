'use client'

import Link from "next/link";
import { Layout, List, Card, Tag, Typography, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { formatDate } from "@/lib/utils";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <Layout className="min-h-screen">
      <Content style={{
      padding: '40px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    }}>
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/"
          style={{ color: 'var(--foreground)', opacity: 0.8 }}
        >
          ← 返回首页
        </Link>
        <Title level={1} style={{
          marginTop: '16px',
          marginBottom: 0,
          color: 'var(--foreground)',
        }}>
          博客
        </Title>
      </div>

      {posts.length === 0 ? (
        <Card>
          <Paragraph style={{ textAlign: 'center', color: 'var(--foreground)' }}>
            暂无文章
          </Paragraph>
        </Card>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={posts}
          renderItem={(post) => (
            <List.Item style={{ padding: '24px 0' }}>
              <Card
                hoverable
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'block',
                    transition: 'all 0.2s',
                  }}
                  onClick={(e) => {
                    const target = e.currentTarget
                    target.style.opacity = '0.7'
                    target.style.transform = 'scale(0.98)'
                    setTimeout(() => {
                      target.style.opacity = '1'
                      target.style.transform = 'scale(1)'
                    }, 200)
                  }}
                >
                  <Title level={3} style={{
                    marginBottom: '12px',
                    color: 'var(--foreground)',
                  }}>
                    {post.title}
                  </Title>
                </Link>
                <Space style={{ marginBottom: '12px' }}>
                  <CalendarOutlined style={{ color: 'var(--foreground)', opacity: 0.6 }} />
                  <span style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                    {formatDate(post.date)}
                  </span>
                </Space>
                <Paragraph
                  ellipsis={{ rows: 2, expandable: false }}
                  style={{
                    color: 'var(--foreground)',
                    opacity: 0.8,
                    marginBottom: '12px',
                  }}
                >
                  {post.summary}
                </Paragraph>
                {post.tags && post.tags.length > 0 && (
                  <Space wrap>
                    {post.tags.map((tag) => (
                      <Tag
                        key={tag}
                        style={{
                          background: 'var(--background)',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground)',
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </Content>
    </Layout>
  );
}

