'use client'

import { Suspense } from 'react'
import Navigation from "@/components/Navigation";
import BlogListNew from "@/components/BlogListNew";
import Footer from "@/components/Footer";

export default function BlogPage() {
  return (
    <div className="blog-page-layout" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navigation />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center', color: 'var(--foreground)' }}>加载中...</div>}>
          <BlogListNew />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
