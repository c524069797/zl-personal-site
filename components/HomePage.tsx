'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  FileText,
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
  Activity,
  TrendingUp,
  Palette,
  Sparkles,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import PostCoverImage from '@/components/PostCoverImage'
import { useTranslation } from '@/hooks/useTranslation'
import { categorizeBlog } from '@/lib/blog-category'
import ParticleBackground from '@/components/home/ParticleBackground'
import GlowCard from '@/components/home/GlowCard'
import ProjectCard from '@/components/home/ProjectCard'
import MagneticButton from '@/components/home/MagneticButton'

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

// ——————————————————————————————————————————————
// Featured projects data (placeholders)
// ——————————————————————————————————————————————
const featuredProjects = [
  {
    title: 'Sports Hub 浏览器插件',
    description:
      'NBA、足球、电竞赛事聚合浏览器扩展，实时追踪比分、赛程与数据统计，一键掌握全球热门赛事动态。',
    image:
      "url('/projects/sports-hub.png') center/cover no-repeat",
    tags: ['Chrome Extension', 'TypeScript', 'Sports API', '实时数据'],
    githubUrl: 'https://github.com/c524069797/sports-hub-extension',
    icon: <Activity size={20} />,
    accentColor: '#0ea5e9',
  },
  {
    title: 'SportOracle 体育预测平台',
    description:
      'AI 驱动的体育预测平台，GPT 分析每场比赛胜负与大小分，集成 Kelly 准则智能下注、Polymarket 预测市场交易。',
    image:
      "url('/projects/nba-predict.png') center/cover no-repeat",
    tags: ['Next.js', 'AI 分析', 'Polymarket', '智能下注'],
    demoUrl: 'https://nba.clczl.asia/',
    icon: <TrendingUp size={20} />,
    accentColor: '#06b6d4',
  },
  {
    title: '织趣社区',
    description:
      '钩织爱好者的温馨家园，涵盖产品库、图解教程资源库和讨论区，发现好物、学习技巧、分享作品。',
    image:
      "url('/projects/zhiqu-crochet.png') center/cover no-repeat",
    tags: ['Web App', '社区平台', '产品库', '资源分享'],
    demoUrl: 'https://zhiqu.clczl.asia/',
    icon: <Palette size={20} />,
    accentColor: '#ec4899',
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ——————————————————————————————————————————————
// Main Component
// ——————————————————————————————————————————————
export default function HomePage() {
  const { t } = useTranslation()
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Hero 3D tilt tracking
  const heroRef = useRef<HTMLDivElement>(null)
  const heroMouseX = useMotionValue(0)
  const heroMouseY = useMotionValue(0)
  const heroRotateX = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 150,
    damping: 20,
  })
  const heroRotateY = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 150,
    damping: 20,
  })

  // Scroll parallax for hero
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, 60])

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

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    heroMouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    heroMouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0)
    heroMouseY.set(0)
  }

  // ——————————————————————————————————————————
  // Render
  // ——————————————————————————————————————————
  return (
    <div className="w-full text-white overflow-x-hidden">
      {/* =========================================
          HERO SECTION — full bleed, no rounding
          ========================================= */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroTranslateY }}
      >
        <div
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #050816 0%, #0a0f2c 50%, #050816 100%)' }}
        >
          {/* Particle canvas */}
          <ParticleBackground />

          {/* Radial glow behind text */}
          <div className="absolute inset-0 z-[1]">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 z-[1] opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Hero content */}
          <motion.div
            style={{
              rotateX: heroRotateX,
              rotateY: heroRotateY,
              transformPerspective: 1200,
            }}
            className="relative z-10 text-center px-4 sm:px-6 w-full max-w-4xl mx-auto"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-4 sm:mb-6">
                <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm">
                  <Sparkles size={14} />
                  Full-Stack Developer & Creator
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  {t('home.hero.title')}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
              >
                {t('home.hero.description')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
              >
                <Link href="/blog" className="w-full sm:w-auto">
                  <MagneticButton className="w-full sm:w-auto px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm sm:text-base hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-shadow duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <BookOpen size={18} />
                      {t('common.browseBlog')}
                    </span>
                  </MagneticButton>
                </Link>
                <Link href="/resume" className="w-full sm:w-auto">
                  <MagneticButton className="w-full sm:w-auto px-8 py-3 sm:py-3.5 rounded-full border-2 border-white/20 text-white/80 font-semibold text-sm sm:text-base hover:border-indigo-400/50 hover:text-white transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <FileText size={18} />
                      {t('common.viewResume')}
                    </span>
                  </MagneticButton>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom fade - extended for smoother transition */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent z-10" />
        </div>
      </motion.div>

      {/* =========================================
          FEATURED WORKS SECTION
          ========================================= */}
      <RevealSection className="relative -mt-16 pt-4 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="works">
        <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              精选作品
            </h2>
            <p className="text-white/40 text-sm sm:text-base">
              探索我最近的项目与开源贡献
            </p>
          </div>
          <Link
            href="https://github.com/c524069797"
            target="_blank"
            className="hidden sm:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
          >
            查看更多 <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProjects.map((project) => (
            <motion.div key={project.title} variants={fadeInScale}>
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>

        {/* Mobile "查看更多" link */}
        <motion.div variants={fadeInUp} className="flex sm:hidden justify-center mt-6">
          <Link
            href="https://github.com/c524069797"
            target="_blank"
            className="flex items-center gap-2 text-indigo-400 text-sm font-medium"
          >
            查看更多项目 <ArrowRight size={16} />
          </Link>
        </motion.div>
      </RevealSection>

      {/* =========================================
          BENTO GRID - POSTS + ABOUT
          ========================================= */}
      <RevealSection className="mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Latest Posts - spans 2 columns on lg */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {t('home.latestPosts')}
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
                >
                  {t('common.viewAll')} <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>

            {loading
              ? [1, 2, 3].map((i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 animate-pulse">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-20 sm:w-28 h-16 sm:h-20 rounded-xl bg-white/10 shrink-0" />
                        <div className="flex-1 space-y-2 sm:space-y-3">
                          <div className="h-3 sm:h-4 bg-white/10 rounded w-1/3" />
                          <div className="h-4 sm:h-5 bg-white/10 rounded w-3/4" />
                          <div className="h-3 bg-white/10 rounded w-full" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              : latestPosts.map((post) => {
                  const categoryInfo = categorizeBlog(post.title, post.summary)
                  return (
                    <motion.div key={post.id} variants={fadeInUp}>
                      <GlowCard glowColor="rgba(99, 102, 241, 0.3)">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="w-20 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden shrink-0">
                            <PostCoverImage
                              title={post.title}
                              summary={post.summary}
                              height={80}
                              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Meta row */}
                            <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 text-[10px] sm:text-xs text-white/40 flex-wrap">
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
                              <h3 className="text-white font-semibold text-sm sm:text-base mb-1 sm:mb-1.5 hover:text-indigo-300 transition-colors line-clamp-1">
                                {post.title}
                              </h3>
                            </Link>
                            {/* Summary */}
                            <p className="text-white/40 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-1.5 sm:mb-2">
                              {post.summary}
                            </p>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
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
            <motion.div variants={fadeInScale}>
              <GlowCard glowColor="rgba(139, 92, 246, 0.3)">
                <div className="text-center">
                  <div className="relative w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-3 sm:mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse-slow" />
                    <div className="absolute inset-[2px] rounded-full overflow-hidden bg-[#0c0f1a]">
                      <Image
                        src="/my-profile.png"
                        alt="陈灼"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                    陈灼 (Jack Chen)
                  </h3>
                  <p className="text-white/40 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
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
                        className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-indigo-400 hover:border-indigo-400/40 transition-all duration-300"
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
                <h3 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">
                  {t('home.categories')}
                </h3>
                <div className="space-y-3">
                  <Link href="/blog?category=tech" className="block">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all duration-300 group">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/30 transition-colors shrink-0">
                        <Code2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium">技术博客</p>
                        <p className="text-white/30 text-xs truncate">最新技术文章与开发技巧</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/blog?category=life" className="block">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] transition-all duration-300 group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/30 transition-colors shrink-0">
                        <Heart size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium">生活记录</p>
                        <p className="text-white/30 text-xs truncate">社会化技能与生活感想</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </GlowCard>
            </motion.div>

            {/* AI Chat promo */}
            <motion.div variants={fadeInScale}>
              <Link href="/ai-chat">
                <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] p-4 sm:p-5 hover:border-violet-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                      <Bot size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm">AI 对话助手</p>
                      <p className="text-white/40 text-xs">与 AI 聊聊技术问题</p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-white/30 group-hover:text-violet-400 transition-colors shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </RevealSection>

      {/* =========================================
          HOT POSTS SECTION
          ========================================= */}
      <RevealSection className="mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-rose-500 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t('home.hotPosts')}
              </h2>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
            >
              {t('common.viewAll')} <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {loading
            ? [1, 2, 3].map((i) => (
                <motion.div key={i} variants={fadeInScale}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 animate-pulse">
                    <div className="h-28 sm:h-32 rounded-xl bg-white/10 mb-4" />
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                  </div>
                </motion.div>
              ))
            : hotPosts.map((post) => {
                const categoryInfo = categorizeBlog(post.title, post.summary)
                return (
                  <motion.div key={post.id} variants={fadeInScale}>
                    <GlowCard glowColor="rgba(249, 115, 22, 0.3)">
                      <div className="h-28 sm:h-32 rounded-xl overflow-hidden mb-3 sm:mb-4">
                        <PostCoverImage
                          title={post.title}
                          summary={post.summary}
                          height={128}
                          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        />
                      </div>
                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs text-white/40">
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
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 hover:text-indigo-300 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-white/40 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-2 sm:mb-3">
                        {post.summary}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium"
                      >
                        {t('common.readMore')} <ArrowRight size={12} />
                      </Link>
                    </GlowCard>
                  </motion.div>
                )
              })}
        </div>
      </RevealSection>

      {/* =========================================
          FOOTER SECTION
          ========================================= */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-white/10 pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6"
      >
        <div className="flex flex-col items-center text-center max-w-7xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            陈灼的网络日志
          </h3>
          <p className="text-white/30 text-xs sm:text-sm mb-5 sm:mb-6">
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
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-indigo-400 hover:border-indigo-400/30 transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="text-white/20 text-xs">
            © {new Date().getFullYear()} 陈灼 | 个人网站 | 版权所有
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
