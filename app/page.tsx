'use client'

import Link from "next/link";
import Navigation from "@/components/Navigation";
import PostTabs from "@/components/PostTabs";
import { Layout, Typography, Space, Button } from 'antd';
import { BookOutlined, FileTextOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <>
      <Navigation />
      <Layout className="min-h-screen">

      <Content style={{
        padding: '80px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={1} style={{
            fontSize: '48px',
            marginBottom: '16px',
            color: 'var(--foreground)',
          }}>
            陈灼的网站
          </Title>
          <Paragraph style={{
            fontSize: '18px',
            color: 'var(--foreground)',
            opacity: 0.8,
            marginBottom: '40px',
          }}>
            记录与分享
          </Paragraph>
        </div>

        <Space size="large" style={{ width: '100%', justifyContent: 'center', marginBottom: '40px' }}>
          <Link href="/blog">
            <Button
              type="primary"
              size="large"
              icon={<BookOutlined />}
              style={{
                height: '50px',
                padding: '0 32px',
                fontSize: '16px',
              }}
            >
              博客
            </Button>
          </Link>
          <Link href="/resume">
            <Button
              size="large"
              icon={<FileTextOutlined />}
              style={{
                height: '50px',
                padding: '0 32px',
                fontSize: '16px',
              }}
            >
              简历
            </Button>
          </Link>
        </Space>

        <PostTabs />
      </Content>

      <Footer style={{
        textAlign: 'center',
        background: 'var(--background)',
        borderTop: '1px solid var(--border)',
        color: 'var(--foreground)',
      }}>
        个人网站 ©2024
      </Footer>
      </Layout>
    </>
  );
}
