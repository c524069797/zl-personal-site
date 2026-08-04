'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  motion,
} from 'framer-motion'
import {
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Calendar,
  MessageSquare,
  Clock,
  ChevronRight,
  Code2,
  Heart,
  Bot,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import PostCoverImage from '@/components/PostCoverImage'
import { useTranslation } from '@/hooks/useTranslation'
import { categorizeBlog } from '@/lib/blog-category'
import GlowCard from '@/components/home/GlowCard'
import HeroAnimated from '@/components/home/HeroAnimated'
import HeroSimple from '@/components/home/HeroSimple'
import ExperienceJourney from '@/components/home/ExperienceJourney'
import VisionSection from '@/components/home/VisionSection'
import CoreExpertise from '@/components/home/CoreExpertise'
import ModeToggle from '@/components/home/ModeToggle'

// ——————————————————————————————————————————————
// Types
// ——————————————————————————————————————————————
interface Post {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  tags: Array<{ name: string; slug: string }>
  commentCount: number
  readingTime?: number
  coverImage?: string
}

// ——————————————————————————————————————————————
// Animation variants
// ——————————————————————————————————————————————
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

const visualHighlights = [
  {
    title: '工程现场',
    caption: '把想法推进到可上线的产品',
    src: '/ai-front.png',
    accent: 'from-cyan-500/70 to-indigo-500/70',
  },
  {
    title: '体育分析',
    caption: '数据、预测与实时体验',
    src: '/projects/nba-predict.png',
    accent: 'from-orange-500/70 to-sky-500/70',
  },
  {
    title: '插件产品',
    caption: '轻量入口承载高频场景',
    src: '/projects/sports-hub.png',
    accent: 'from-blue-500/70 to-emerald-500/70',
  },
  {
    title: '社区应用',
    caption: '围绕内容和关系做体验',
    src: '/projects/zhiqu-crochet.png',
    accent: 'from-pink-500/70 to-violet-500/70',
  },
]

const fallbackLatestPosts: Post[] = [
  {
    id: 'fallback-ai-tools-guide',
    slug: 'ai-tools-guide',
    title: 'AI 工具链实践指南',
    date: '2026-03-24',
    summary: '记录 AI 辅助开发、工作流编排与日常工程提效的实际经验。',
    tags: [],
    commentCount: 0,
    readingTime: 8,
    coverImage: '/ai-front.png',
  },
  {
    id: 'fallback-agent-workflow',
    slug: 'nba-langgraph-agent-workflow',
    title: 'LangGraph Agent 工作流实践',
    date: '2026-03-21',
    summary: '从多 Agent 协作、状态管理到工具调用，拆解一个可运行的分析流程。',
    tags: [],
    commentCount: 0,
    readingTime: 10,
    coverImage: '/projects/nba-predict.png',
  },
  {
    id: 'fallback-enterprise-experience',
    slug: 'ai-projects-enterprise-experience',
    title: '企业 AI 项目落地经验',
    date: '2026-03-18',
    summary: '围绕需求、数据、交互与交付节奏，总结 AI 项目的工程化要点。',
    tags: [],
    commentCount: 0,
    readingTime: 7,
    coverImage: '/projects/sports-hub.png',
  },
]

const fallbackHotPosts: Post[] = [
  {
    id: 'fallback-rag',
    slug: 'rag-pitfalls-and-langgraph-practice',
    title: 'RAG 常见误区与实践修正',
    date: '2026-03-15',
    summary: '从检索质量、上下文组织和回答可信度几个角度看 RAG 系统落地。',
    tags: [],
    commentCount: 0,
    readingTime: 9,
    coverImage: '/ai-front.png',
  },
  {
    id: 'fallback-polymarket',
    slug: 'web3-prediction-market-polymarket',
    title: '预测市场与体育分析',
    date: '2026-03-12',
    summary: '用产品视角理解预测市场、体育数据和交易体验之间的连接。',
    tags: [],
    commentCount: 0,
    readingTime: 6,
    coverImage: '/projects/nba-predict.png',
  },
  {
    id: 'fallback-security',
    slug: 'web-security-protection',
    title: 'Web 安全防护笔记',
    date: '2026-03-10',
    summary: '整理前端与全栈项目中常见的安全边界、风险点和防护方式。',
    tags: [],
    commentCount: 0,
    readingTime: 7,
    coverImage: '/projects/sports-hub.png',
  },
]

// ——————————————————————————————————————————————
// Section wrapper with scroll-triggered reveal
// ——————————————————————————————————————————————
function RevealSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <motion.section
      id={id}
      initial="visible"
      animate="visible"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function VisualDirectionStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 mb-14 sm:mb-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {visualHighlights.map((item, index) => (
          <a
            key={item.title}
            href={index === 0 ? '#works' : index === 3 ? '#background' : '#posts'}
            className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-[0_18px_60px_-36px_rgba(15,23,42,0.7)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 ${
              index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="relative h-44 sm:h-52 lg:h-64">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={index === 0}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} via-neutral-950/20 to-transparent opacity-80`} />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-base font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/75">{item.caption}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

// ——————————————————————————————————————————————
// Main Component
// ——————————————————————————————————————————————
export default function HomePage() {
  const { t } = useTranslation()
  const [heroMode, setHeroMode] = useState<'animated' | 'simple' | '3d'>('3d')
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const [latestRes, hotRes] = await Promise.all([
          fetch('/api/posts/latest?limit=3'),
          fetch('/api/posts/hot?limit=3'),
        ])
        if (latestRes.ok) {
          const latestData = await latestRes.json()
          setLatestPosts(latestData.posts || [])
        }
        if (hotRes.ok) {
          const hotData = await hotRes.json()
          setHotPosts(hotData.posts || [])
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const toggleMode = () => {
    setHeroMode((prev) =>
      prev === '3d' ? 'animated' : prev === 'animated' ? 'simple' : '3d',
    )
  }

  const visibleLatestPosts = latestPosts.length > 0 ? latestPosts : fallbackLatestPosts
  const visibleHotPosts = hotPosts.length > 0 ? hotPosts : fallbackHotPosts

  return (
    <div className="w-full text-neutral-800 dark:text-white overflow-x-clip bg-white dark:bg-[#050816]">
      {/* Mode Toggle */}
      <ModeToggle mode={heroMode} onToggle={toggleMode} />

      {/* =========================================
          HERO SECTION — 3d 模式直接以经历时间轴开场（Passion 文案已下沉合并），
          其余模式保留独立 Hero + 时间轴
          ========================================= */}
      {heroMode === '3d' ? (
        <ExperienceJourney withIntro />
      ) : (
        <>
          {heroMode === 'animated' ? <HeroAnimated /> : <HeroSimple />}
          <ExperienceJourney />
        </>
      )}
      <VisualDirectionStrip />

      {/* =========================================
          BENTO GRID - POSTS + ABOUT
          ========================================= */}
      <RevealSection className="mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="posts">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Latest Posts - spans 2 columns on lg */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white">
                    {t('home.latestPosts')}
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-sm font-medium"
                >
                  {t('common.viewAll')} <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>

            {loading
              ? [1, 2, 3].map((i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] p-4 sm:p-6 animate-pulse">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-20 sm:w-28 h-16 sm:h-20 rounded-xl bg-neutral-200 dark:bg-white/10 shrink-0" />
                        <div className="flex-1 space-y-2 sm:space-y-3">
                          <div className="h-3 sm:h-4 bg-neutral-200 dark:bg-white/10 rounded w-1/3" />
                          <div className="h-4 sm:h-5 bg-neutral-200 dark:bg-white/10 rounded w-3/4" />
                          <div className="h-3 bg-neutral-200 dark:bg-white/10 rounded w-full" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              : visibleLatestPosts.map((post) => {
                  const categoryInfo = categorizeBlog(post.title, post.summary)
                  return (
                    <motion.div key={post.id} variants={fadeInUp}>
                      <GlowCard glowColor="rgba(99, 102, 241, 0.3)">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="w-20 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden shrink-0">
                            {post.coverImage ? (
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={112}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <PostCoverImage
                                title={post.title}
                                summary={post.summary}
                                height={80}
                                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Meta row */}
                            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 text-[10px] sm:text-xs text-neutral-400 dark:text-white/40 flex-wrap">
                              <span
                                className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{
                                  background: `${categoryInfo.color}20`,
                                  color: categoryInfo.color,
                                  border: `1px solid ${categoryInfo.color}40`,
                                }}
                              >
                                {categoryInfo.label}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={10} /> {formatDate(post.date)}
                              </span>
                              {post.readingTime ? (
                                <span className="hidden sm:flex items-center gap-1">
                                  <Clock size={10} /> {post.readingTime}分钟
                                </span>
                              ) : null}
                              <span className="hidden sm:flex items-center gap-1">
                                <MessageSquare size={10} /> {post.commentCount}
                              </span>
                            </div>
                            {/* Title */}
                            <Link href={`/blog/${post.slug}`}>
                              <h3 className="text-neutral-800 dark:text-white font-semibold text-sm sm:text-base mb-1 sm:mb-1.5 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors line-clamp-1">
                                {post.title}
                              </h3>
                            </Link>
                            {/* Summary */}
                            <p className="text-neutral-400 dark:text-white/40 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-1.5 sm:mb-2">
                              {post.summary}
                            </p>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium"
                            >
                              {t('common.readMore')} <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  )
                })}
          </div>

          {/* Sidebar column */}
          <div className="space-y-4 sm:space-y-6">
            {/* About Me Card */}
            <motion.div variants={fadeInScale} id="ai-entry">
              <GlowCard glowColor="rgba(139, 92, 246, 0.3)">
                <div className="text-center">
                  <div className="relative w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-3 sm:mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse-slow" />
                    <div className="absolute inset-[2px] rounded-full overflow-hidden bg-neutral-100 dark:bg-[#0c0f1a]">
                      <Image
                        src="/my-profile.png"
                        alt="陈灼"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <h3 className="text-neutral-800 dark:text-white font-bold text-base sm:text-lg mb-1">
                    陈灼 (Jack Chen)
                  </h3>
                  <p className="text-neutral-400 dark:text-white/40 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
                    热爱学习的前端，全栈40%<br />一名篮球爱好者
                  </p>

                  {/* Social icons */}
                  <div className="flex justify-center gap-3 mb-4 sm:mb-5">
                    {[
                      { icon: <Github size={16} />, href: 'https://github.com/c524069797', label: 'GitHub' },
                      { icon: <Twitter size={16} />, href: 'https://twitter.com', label: 'Twitter' },
                      { icon: <Mail size={16} />, href: 'mailto:chenzhuo995@gmail.com', label: 'Email' },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] flex items-center justify-center text-neutral-400 dark:text-white/50 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/40 transition-all duration-300"
                        aria-label={s.label}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>

                  <Link href="/resume">
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-shadow duration-300">
                      {t('common.viewResume')}
                    </button>
                  </Link>
                </div>
              </GlowCard>
            </motion.div>

            {/* Categories Card */}
            <motion.div variants={fadeInScale}>
              <GlowCard glowColor="rgba(59, 130, 246, 0.3)">
                <h3 className="text-neutral-800 dark:text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">
                  {t('home.categories')}
                </h3>
                <div className="space-y-3">
                  <Link href="/blog?category=tech" className="block">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all duration-300 group">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/30 transition-colors shrink-0">
                        <Code2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-neutral-800 dark:text-white text-sm font-medium">技术博客</p>
                        <p className="text-neutral-400 dark:text-white/30 text-xs truncate">最新技术文章与开发技巧</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/blog?category=life" className="block">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] transition-all duration-300 group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/30 transition-colors shrink-0">
                        <Heart size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-neutral-800 dark:text-white text-sm font-medium">生活记录</p>
                        <p className="text-neutral-400 dark:text-white/30 text-xs truncate">社会化技能与生活感想</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </GlowCard>
            </motion.div>

            {/* AI Chat promo */}
            <motion.div variants={fadeInScale}>
              <Link href="/ai-chat">
                <div className="relative group rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] p-4 sm:p-5 hover:border-violet-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                      <Bot size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-neutral-800 dark:text-white font-semibold text-sm">AI 对话助手</p>
                      <p className="text-neutral-400 dark:text-white/40 text-xs">与 AI 聊聊技术问题</p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-neutral-300 dark:text-white/30 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="mt-10 sm:mt-14">
          <motion.div variants={fadeInUp} className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-rose-500 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white">
                  {t('home.hotPosts')}
                </h2>
              </div>
              <Link
                href="/blog"
                className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-sm font-medium"
              >
                {t('common.viewAll')} <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {loading
              ? [1, 2, 3].map((i) => (
                  <motion.div key={i} variants={fadeInScale}>
                    <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] p-4 sm:p-5 animate-pulse">
                      <div className="h-28 sm:h-32 rounded-xl bg-neutral-200 dark:bg-white/10 mb-4" />
                      <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-neutral-200 dark:bg-white/10 rounded w-full" />
                    </div>
                  </motion.div>
                ))
              : visibleHotPosts.map((post) => {
                  const categoryInfo = categorizeBlog(post.title, post.summary)
                  return (
                    <motion.div key={post.id} variants={fadeInScale} className="h-full">
                      <GlowCard glowColor="rgba(249, 115, 22, 0.3)" className="h-full">
                        <div className="flex h-full flex-col">
                          <div className="h-28 sm:h-32 rounded-xl overflow-hidden mb-3 sm:mb-4">
                            {post.coverImage ? (
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                width={360}
                                height={128}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <PostCoverImage
                                title={post.title}
                                summary={post.summary}
                                height={128}
                                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs text-neutral-400 dark:text-white/40">
                            <span
                              className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-medium"
                              style={{
                                background: `${categoryInfo.color}20`,
                                color: categoryInfo.color,
                                border: `1px solid ${categoryInfo.color}40`,
                              }}
                            >
                              {categoryInfo.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={10} /> {formatDate(post.date)}
                            </span>
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <h3 className="min-h-[3.5rem] text-neutral-800 dark:text-white font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="min-h-[3rem] flex-1 text-neutral-400 dark:text-white/40 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-2 sm:mb-3">
                            {post.summary}
                          </p>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="mt-auto inline-flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400 hover:text-orange-400 dark:hover:text-orange-300 transition-colors font-medium"
                          >
                            {t('common.readMore')} <ArrowRight size={12} />
                          </Link>
                        </div>
                      </GlowCard>
                    </motion.div>
                  )
                })}
          </div>
        </div>
      </RevealSection>

      <div id="background" className="home-background-sections">
        <CoreExpertise />
        <VisionSection />
      </div>

      {/* =========================================
          FOOTER SECTION
          ========================================= */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-neutral-200 dark:border-white/10 pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6"
      >
        <div className="flex flex-col items-center text-center max-w-7xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            陈灼的网络日志
          </h3>
          <p className="text-neutral-400 dark:text-white/30 text-xs sm:text-sm mb-5 sm:mb-6">
            体验设计与创新技术的完美融合
          </p>
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { icon: <Github size={16} />, href: 'https://github.com/c524069797' },
              { icon: <Twitter size={16} />, href: 'https://twitter.com' },
              { icon: <Mail size={16} />, href: 'mailto:chenzhuo995@gmail.com' },
            ].map((s) => (
              <a
                key={s.href}
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] flex items-center justify-center text-neutral-400 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/30 transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="text-neutral-300 dark:text-white/20 text-xs">
            © {new Date().getFullYear()} 陈灼 | 个人网站 | 版权所有
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
