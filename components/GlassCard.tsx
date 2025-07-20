"use client"

import type React from "react"
import { motion } from "framer-motion"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  blur?: "sm" | "md" | "lg"
  opacity?: number
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", blur = "md", opacity = 0.1 }) => {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${blurClasses[blur]} 
        bg-white/10 dark:bg-black/10 
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-2xl
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${opacity}) 0%, rgba(255,255,255,${opacity * 0.5}) 100%)`,
      }}
    >
      {children}
    </motion.div>
  )
}
