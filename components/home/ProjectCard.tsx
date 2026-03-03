'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl?: string
  demoUrl?: string
  icon: React.ReactNode
  accentColor?: string
}

/**
 * Featured project card with:
 * - Image zoom on hover
 * - Flowing neon border animation
 * - Tech tag pills
 * - GitHub + Demo links
 */
export default function ProjectCard({
  title,
  description,
  image,
  tags,
  githubUrl,
  demoUrl,
  icon,
  accentColor = '#6366f1',
}: ProjectCardProps) {
  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Flowing border glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] z-0"
        style={{
          background: `conic-gradient(from var(--glow-angle, 0deg), ${accentColor}, transparent 30%, transparent 70%, ${accentColor})`,
          animation: 'glowSpin 3s linear infinite',
        }}
      />

      <div className="relative z-10 bg-[#0c0f1a]/90 rounded-2xl overflow-hidden">
        {/* Image section */}
        <div className="relative h-48 overflow-hidden">
          {/* Placeholder gradient background as image */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            style={{
              background: image,
            }}
          />
          {/* Overlay with description on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
            <p className="text-white/90 text-sm text-center leading-relaxed">
              {description}
            </p>
          </div>
          {/* Icon badge */}
          <div
            className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
            style={{ background: `${accentColor}cc` }}
          >
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs rounded-full border border-white/10 text-white/60 bg-white/[0.04]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-300"
              >
                <Github size={14} />
                <span>Source</span>
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm hover:text-white transition-colors duration-300"
                style={{ color: accentColor }}
              >
                <ExternalLink size={14} />
                <span>Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
