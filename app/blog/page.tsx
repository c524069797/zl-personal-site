'use client'

import { Suspense } from 'react'
import Navigation from "@/components/Navigation";
import BlogListNew from "@/components/BlogListNew";
import { Layout } from 'antd';

const { Content } = Layout;

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <Layout className="min-h-screen" style={{ background: 'var(--background)' }}>
        <Content style={{ background: 'var(--background)' }}>
          <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>}>
            <BlogListNew />
          </Suspense>
        </Content>
      </Layout>
    </>
  );
}
