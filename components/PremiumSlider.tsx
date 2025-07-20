"use client"

import type React from "react"
import { motion } from "framer-motion"

interface PremiumSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  label: string
  description?: string
  icon?: React.ReactNode
  unit?: string
  showValue?: boolean
}

export const PremiumSlider: React.FC<PremiumSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  description,
  icon,
  unit = "",
  showValue = true,
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <motion.div className="p-4 hover:bg-white/5 rounded-xl transition-all duration-300" whileHover={{ scale: 1.01 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {icon && <div className="text-gray-600 dark:text-gray-300">{icon}</div>}
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{label}</div>
            {description && <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>}
          </div>
        </div>
        {showValue && (
          <motion.div
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
            key={value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {value}
            {unit}
          </motion.div>
        )}
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />

        {/* Custom thumb with glow effect */}
        <motion.div
          className="absolute top-1/2 w-5 h-5 bg-blue-600 rounded-full shadow-lg pointer-events-none transform -translate-y-1/2"
          style={{ left: `calc(${percentage}% - 10px)` }}
          whileHover={{ scale: 1.2 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0.4)",
              "0 0 0 8px rgba(59, 130, 246, 0)",
              "0 0 0 0 rgba(59, 130, 246, 0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>
    </motion.div>
  )
}
