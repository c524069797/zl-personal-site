'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Code2,
  Server,
  Layers,
  Briefcase,
  GraduationCap,
  Target,
  Shield,
  Lock,
  HardDrive,
  BarChart3,
  ArchiveRestore,
  BadgeCheck,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
          {icon}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white">
          {title}
        </h2>
      </div>
      <p className="text-neutral-400 dark:text-white/40 text-sm sm:text-base ml-11">
        {subtitle}
      </p>
    </div>
  )
}

function RevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function TechCard({
  children,
  className = '',
  glowFrom = 'from-cyan-500/8',
  glowTo = 'to-blue-500/8',
  accentBorder = false,
}: {
  children: React.ReactNode
  className?: string
  glowFrom?: string
  glowTo?: string
  accentBorder?: boolean
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500
        bg-white/60 dark:bg-white/[0.04]
        backdrop-blur-xl
        border border-neutral-200/60 dark:border-white/[0.08]
        shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] dark:shadow-none
        hover:shadow-[0_12px_40px_-8px_rgba(0,212,255,0.15)] dark:hover:shadow-white/5
        hover:border-neutral-300 dark:hover:border-white/15
        ${accentBorder ? 'hover:border-cyan-300/70 dark:hover:border-cyan-500/30' : ''}
        ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ animation: 'scanLine 3s ease-in-out infinite' }}
        />
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-[-100%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/[0.04] to-transparent" />
      </div>
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${glowFrom} ${glowTo} rounded-full blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700`} />
      <div className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400/40 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-cyan-400/40 to-transparent" />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

function DataProtectionCard({
  title,
  desc,
  skillsTitle,
  skillLabels,
  hoverHint,
}: {
  title: string
  desc: string
  skillsTitle: string
  skillLabels: string[]
  hoverHint: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  const aiDetailSkills = skillLabels.map((label, i) => ({
    label,
    level: [90, 88, 85, 85, 80, 78][i] || 80,
  }))

  return (
    <motion.div
      variants={fadeInUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500
        bg-white/60 dark:bg-white/[0.04]
        backdrop-blur-xl
        border border-neutral-200/60 dark:border-white/[0.08]
        shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] dark:shadow-none
        hover:shadow-[0_12px_40px_-8px_rgba(0,212,255,0.2)] dark:hover:shadow-cyan-500/10
        hover:border-cyan-300/70 dark:hover:border-cyan-500/30"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ animation: 'scanLine 3s ease-in-out infinite' }}
        />
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-[-100%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/[0.04] to-transparent" />
      </div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400/40 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-cyan-400/40 to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <Lock size={20} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-white/50 leading-relaxed mb-4">
          {desc}
        </p>

        <motion.div
          initial={false}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-neutral-100 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive size={14} className="text-cyan-500" />
              <span className="text-xs font-semibold text-cyan-500 tracking-wide uppercase">{skillsTitle}</span>
            </div>
            {aiDetailSkills.map((skill, i) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, x: -10 }}
                animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-white/60">{skill.label}</span>
                  <span className="text-cyan-500 font-medium">{skill.level}%</span>
                </div>
                <div className="h-1 rounded-full bg-neutral-100 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isHovered ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ delay: i * 0.05 + 0.15, duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 mt-2"
        >
          <Shield size={12} className="text-cyan-400" />
          <span className="text-[11px] text-cyan-400">{hoverHint}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function VisionSection() {
  const { t } = useTranslation()

  const skills = [
    {
      category: t('home.skills.cat0Name'),
      icon: <Shield size={18} />,
      items: [t('home.skills.cat0Item0'), t('home.skills.cat0Item1'), t('home.skills.cat0Item2'), t('home.skills.cat0Item3')],
      color: 'from-cyan-500 to-blue-400',
      textColor: 'text-cyan-600',
      shadowColor: 'shadow-cyan-500/15',
      borderHover: 'hover:border-cyan-400/60',
      iconBg: 'bg-cyan-500/10',
      borderColor: 'border-cyan-200/60',
    },
    {
      category: t('home.skills.cat1Name'),
      icon: <ArchiveRestore size={18} />,
      items: [t('home.skills.cat1Item0'), t('home.skills.cat1Item1'), t('home.skills.cat1Item2'), t('home.skills.cat1Item3')],
      color: 'from-blue-500 to-indigo-400',
      textColor: 'text-blue-600',
      shadowColor: 'shadow-blue-500/15',
      borderHover: 'hover:border-blue-400/60',
      iconBg: 'bg-blue-500/10',
      borderColor: 'border-blue-200/60',
    },
    {
      category: t('home.skills.cat2Name'),
      icon: <HardDrive size={18} />,
      items: [t('home.skills.cat2Item0'), t('home.skills.cat2Item1'), t('home.skills.cat2Item2'), t('home.skills.cat2Item3')],
      color: 'from-indigo-500 to-violet-400',
      textColor: 'text-indigo-600',
      shadowColor: 'shadow-indigo-500/15',
      borderHover: 'hover:border-indigo-400/60',
      iconBg: 'bg-indigo-500/10',
      borderColor: 'border-indigo-200/60',
    },
    {
      category: t('home.skills.cat3Name'),
      icon: <BadgeCheck size={18} />,
      items: [t('home.skills.cat3Item0'), t('home.skills.cat3Item1'), t('home.skills.cat3Item2'), t('home.skills.cat3Item3')],
      color: 'from-violet-500 to-purple-400',
      textColor: 'text-violet-600',
      shadowColor: 'shadow-violet-500/15',
      borderHover: 'hover:border-violet-400/60',
      iconBg: 'bg-violet-500/10',
      borderColor: 'border-violet-200/60',
    },
    {
      category: t('home.skills.cat4Name'),
      icon: <Code2 size={18} />,
      items: [t('home.skills.cat4Item0'), t('home.skills.cat4Item1'), t('home.skills.cat4Item2'), t('home.skills.cat4Item3')],
      color: 'from-purple-500 to-fuchsia-400',
      textColor: 'text-purple-600',
      shadowColor: 'shadow-purple-500/15',
      borderHover: 'hover:border-purple-400/60',
      iconBg: 'bg-purple-500/10',
      borderColor: 'border-purple-200/60',
    },
    {
      category: t('home.skills.cat5Name'),
      icon: <Server size={18} />,
      items: [t('home.skills.cat5Item0'), t('home.skills.cat5Item1'), t('home.skills.cat5Item2'), t('home.skills.cat5Item3')],
      color: 'from-sky-500 to-cyan-400',
      textColor: 'text-sky-600',
      shadowColor: 'shadow-sky-500/15',
      borderHover: 'hover:border-sky-400/60',
      iconBg: 'bg-sky-500/10',
      borderColor: 'border-sky-200/60',
    },
  ]

  const experiences = [
    {
      period: t('home.experience.exp0Period'),
      title: t('home.experience.exp0Title'),
      company: t('home.experience.exp0Company'),
      description: t('home.experience.exp0Desc'),
      icon: <Briefcase size={16} />,
    },
    {
      period: t('home.experience.exp1Period'),
      title: t('home.experience.exp1Title'),
      company: t('home.experience.exp1Company'),
      description: t('home.experience.exp1Desc'),
      icon: <Layers size={16} />,
    },
  ]

  const visionSkillLabels = [
    t('home.vision.dataSecuritySkill0'),
    t('home.vision.dataSecuritySkill1'),
    t('home.vision.dataSecuritySkill2'),
    t('home.vision.dataSecuritySkill3'),
    t('home.vision.dataSecuritySkill4'),
    t('home.vision.dataSecuritySkill5'),
  ]

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Vision */}
      <RevealSection className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          icon={<Target size={18} />}
          title={t('home.vision.visionTitle')}
          subtitle={t('home.vision.visionSubtitle')}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <DataProtectionCard
            title={t('home.vision.dataProtectionTitle')}
            desc={t('home.vision.dataProtectionDesc')}
            skillsTitle={t('home.vision.dataSecuritySkillsTitle')}
            skillLabels={visionSkillLabels}
            hoverHint={t('home.vision.dataProtectionHoverHint')}
          />
          <TechCard glowFrom="from-blue-500/8" glowTo="from-indigo-500/8">
            <div className="p-6 sm:p-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white mb-3">
                {t('home.vision.dataDrivenTitle')}
              </h3>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-white/50 leading-relaxed">
                {t('home.vision.dataDrivenDesc')}
              </p>
            </div>
          </TechCard>
        </div>
      </RevealSection>

      {/* Skills */}
      <RevealSection className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          icon={<Code2 size={18} />}
          title={t('home.skills.title')}
          subtitle={t('home.skills.subtitle')}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {skills.map((skill) => (
            <motion.div
              key={skill.category}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500
                bg-white/60 dark:bg-white/[0.04]
                backdrop-blur-xl
                border ${skill.borderColor} dark:border-white/[0.08]
                shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] dark:shadow-none
                hover:shadow-lg ${skill.shadowColor}
                ${skill.borderHover} dark:hover:border-white/15
                p-5 sm:p-6`}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div
                  className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ animation: 'scanLine 3s ease-in-out infinite' }}
                />
              </div>
              <div className="absolute top-0 left-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-cyan-400/30 to-transparent" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                    {skill.icon}
                  </div>
                  <h3 className={`font-semibold ${skill.textColor} group-hover:translate-x-1 transition-transform duration-300`}>
                    {skill.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <motion.span
                      key={item}
                      whileHover={{ scale: 1.08 }}
                      className="px-2.5 py-1 rounded-full text-xs font-medium
                        bg-neutral-100/80 dark:bg-white/10
                        text-neutral-600 dark:text-white/70
                        border border-neutral-200/80 dark:border-white/10
                        hover:border-neutral-400 dark:hover:border-white/30
                        transition-colors duration-300 cursor-default"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* Experience */}
      <RevealSection className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          icon={<Briefcase size={18} />}
          title={t('home.experience.title')}
          subtitle={t('home.experience.subtitle')}
        />
        <div className="space-y-4 sm:space-y-6">
          {experiences.map((exp) => (
            <motion.div
              key={exp.period}
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500
                bg-white/60 dark:bg-white/[0.04]
                backdrop-blur-xl
                border border-neutral-200/60 dark:border-white/[0.08]
                shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] dark:shadow-none
                hover:shadow-[0_12px_40px_-8px_rgba(0,212,255,0.12)] dark:hover:shadow-cyan-500/5
                hover:border-cyan-200/70 dark:hover:border-cyan-500/30
                p-5 sm:p-6"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div
                  className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ animation: 'scanLine 3s ease-in-out infinite' }}
                />
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute inset-[-100%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/[0.04] to-transparent" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 left-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400/40 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-cyan-400/40 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-2 sm:w-48 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-500">
                    {exp.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-400 dark:text-white/40 font-medium">
                    {exp.period}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-cyan-500 mb-2">{exp.company}</p>
                  <p className="text-sm text-neutral-500 dark:text-white/50 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* Education & More */}
      <RevealSection className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <TechCard glowFrom="from-emerald-500/8" glowTo="from-teal-500/8">
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap size={16} />
                </div>
                <h3 className="font-semibold text-neutral-800 dark:text-white">
                  {t('home.education.title')}
                </h3>
              </div>
              <p className="text-sm text-neutral-500 dark:text-white/50 leading-relaxed">
                {t('home.education.desc')}
              </p>
            </div>
          </TechCard>
          <TechCard glowFrom="from-blue-500/8" glowTo="from-cyan-500/8">
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                  <Target size={16} />
                </div>
                <h3 className="font-semibold text-neutral-800 dark:text-white">
                  {t('home.focus.title')}
                </h3>
              </div>
              <p className="text-sm text-neutral-500 dark:text-white/50 leading-relaxed">
                {t('home.focus.desc')}
              </p>
            </div>
          </TechCard>
        </div>
      </RevealSection>
    </div>
  )
}
