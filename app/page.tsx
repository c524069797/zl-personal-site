'use client'

import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import { Layout, Typography } from 'antd';

const { Content, Footer } = Layout;

export default function Home() {
  return (
    <>
      <Navigation />
      <Layout className="min-h-screen">
        <Content style={{
          padding: '0 24px 60px',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          background: 'var(--background)',
        }}>
          <HomePage />
        </Content>

        <Footer style={{
          textAlign: 'center',
          background: 'var(--background)',
          borderTop: '1px solid var(--border)',
          color: 'var(--foreground)',
          padding: '48px 24px',
        }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb', marginBottom: '16px' }}>
            陈灼的网络日志
          </div>
          <div style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            体验设计与创新技术的完美融合
          </div>
          <div style={{
            marginTop: '32px',
            paddingTop: '32px',
            borderTop: '1px solid var(--border)',
            color: 'var(--foreground)',
            opacity: 0.6,
          }}>
            © 2024 陈灼 | 个人网站 | 版权所有
          </div>
        </Footer>
      </Layout>
    </>
  );
}
