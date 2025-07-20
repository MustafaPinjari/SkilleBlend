"use client"

import type React from "react"
import { motion } from "framer-motion"

interface AdvancedToggleProps {
  checked: boolean
  onChange: () => void
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "premium" | "neon"
}

export const AdvancedToggle: React.FC<AdvancedToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  icon,
  disabled = false,
  size = "md",
  variant = "premium",
}) => {
  const sizes = {
    sm: { toggle: "h-5 w-9", thumb: "h-3 w-3", translate: "translate-x-4" },
    md: { toggle: "h-6 w-11", thumb: "h-4 w-4", translate: "translate-x-5" },
    lg: { toggle: "h-7 w-13", thumb: "h-5 w-5", translate: "translate-x-6" },
  }

  const variants = {
    default: {
      bg: checked ? "bg-blue-600" : "bg-gray-300",
      thumb: "bg-white",
    },
    premium: {
      bg: checked ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-300",
      thumb: "bg-white shadow-lg",
    },
    neon: {
      bg: checked ? "bg-cyan-500 shadow-cyan-500/50" : "bg-gray-700",
      thumb: "bg-white shadow-lg",
    },
  }

  return (
    <motion.div
      className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-all duration-300 group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        {icon && (
          <motion.div
            className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors"
            animate={{ rotate: checked ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}
        <div>
          <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {label}
          </div>
          {description && <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label}`}
        disabled={disabled}
        onClick={onChange}
        className={`
          relative inline-flex ${sizes[size].toggle} items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant].bg}
          ${variant === "neon" && checked ? "shadow-lg" : ""}
        `}
      >
        <motion.span
          className={`
            inline-block ${sizes[size].thumb} transform rounded-full transition-transform duration-300
            ${variants[variant].thumb}
          `}
          animate={{
            x: checked ? sizes[size].translate.replace("translate-x-", "") + "px" : "2px",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />

        {/* Glow effect for neon variant */}
        {variant === "neon" && checked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/30 blur-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </button>
    </motion.div>
  )
}
