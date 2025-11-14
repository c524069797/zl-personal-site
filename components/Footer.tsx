'use client'

import Link from 'next/link'
import { Typography } from 'antd'

const { Title, Text } = Typography

export default function Footer() {
  return (
    <footer
      style={{
        background: '#001529',
        color: 'rgba(255,255,255,0.85)',
        padding: '48px 5% 32px',
        marginTop: '64px',
      }}
    >
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
          <Title
            level={4}
            style={{
              color: '#fff',
              marginBottom: '24px',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            技术博客
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '40px',
                height: '2px',
                background: '#1890ff',
              }}
            />
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
            分享前沿技术文章，助力开发者成长
          </Text>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <Title
            level={4}
            style={{
              color: '#fff',
              marginBottom: '24px',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            快速链接
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '40px',
                height: '2px',
                background: '#1890ff',
              }}
            />
          </Title>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                首页
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                前端技术
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                后端开发
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                移动开发
              </Link>
            </li>
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <Title
            level={4}
            style={{
              color: '#fff',
              marginBottom: '24px',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            资源推荐
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '40px',
                height: '2px',
                background: '#1890ff',
              }}
            />
          </Title>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                官方文档
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                开源项目
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                学习路径
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                社区论坛
              </Link>
            </li>
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <Title
            level={4}
            style={{
              color: '#fff',
              marginBottom: '24px',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            联系我们
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '40px',
                height: '2px',
                background: '#1890ff',
              }}
            />
          </Title>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                关于我们
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                加入我们
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                商务合作
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link
                href="/blog"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                反馈建议
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '32px auto 0',
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.45)',
          fontSize: '14px',
        }}
      >
        © {new Date().getFullYear()} 技术博客 | 版权所有
      </div>
    </footer>
  )
}

