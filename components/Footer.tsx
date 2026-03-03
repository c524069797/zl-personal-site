'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '48px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="footer-section-title">
            <span className="footer-brand">技术博客</span>
            <div className="footer-underline" />
          </div>
          <p className="footer-text" style={{ marginTop: '24px', lineHeight: 1.6 }}>
            分享前沿技术文章，助力开发者成长
          </p>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="footer-section-title">
            快速链接
            <div className="footer-underline" />
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0 0' }}>
            {[
              { href: '/', label: '首页' },
              { href: '/blog?category=tech', label: '前端技术' },
              { href: '/blog?category=life', label: '生活记录' },
              { href: '/blog', label: '全部博客' },
            ].map(item => (
              <li key={item.href} style={{ marginBottom: '8px' }}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="footer-section-title">
            资源推荐
            <div className="footer-underline" />
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0 0' }}>
            {[
              { href: '/blog', label: '官方文档' },
              { href: '/blog', label: '开源项目' },
              { href: '/blog', label: '学习路径' },
              { href: '/ai-chat', label: 'AI 助手' },
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="footer-section-title">
            联系我们
            <div className="footer-underline" />
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0 0' }}>
            {[
              { href: '/resume', label: '关于我' },
              { href: 'https://github.com/c524069797', label: 'GitHub' },
              { href: 'mailto:chenzhuo995@gmail.com', label: '邮件联系' },
              { href: '/blog', label: '反馈建议' },
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()}{' '}
        <span className="footer-brand-inline">技术博客</span>
        {' '}| 版权所有
      </div>
    </footer>
  )
}
