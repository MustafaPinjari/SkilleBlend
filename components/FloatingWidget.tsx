"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Accessibility, Sparkles, Zap } from "lucide-react"
import { AccessibilityPanel } from "./AccessibilityPanel"
import { useAccessibility } from "../hooks/useAccessibility"

export const FloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { accessibilityScore } = useAccessibility()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10])
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10])

  // Floating animation
  const floatingY = useMotionValue(0)

  useEffect(() => {
    const interval = setInterval(() => {
      floatingY.set(Math.sin(Date.now() / 1000) * 3)
    }, 16)
    return () => clearInterval(interval)
  }, [floatingY])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(event.clientX - centerX)
    mouseY.set(event.clientY - centerY)
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Main Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        style={{ y: floatingY }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
      >
        <motion.button
          onClick={togglePanel}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            mouseX.set(0)
            mouseY.set(0)
          }}
          className="relative group"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Open accessibility menu"
          aria-expanded={isOpen}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-60"
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0.8 : 0.6,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Main button */}
          <motion.div
            className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
            animate={{
              scale: isHovered ? 1.1 : 1,
              boxShadow: isHovered
                ? "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)"
                : "0 10px 30px rgba(0,0,0,0.2)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            />

            {/* Icon */}
            <motion.div
              className="relative z-10 text-white"
              animate={{
                rotate: isOpen ? 180 : 0,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Accessibility className="w-7 h-7" />
            </motion.div>

            {/* Sparkle effects */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      initial={{
                        opacity: 0,
                        scale: 0,
                        x: 0,
                        y: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                        y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Score indicator */}
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            {accessibilityScore}
          </motion.div>
        </motion.button>

        {/* Floating action hints */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Accessibility Tools</span>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Action Buttons */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 flex flex-col space-y-3 z-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {[
              { icon: <Zap className="w-4 h-4" />, label: "Quick Fix", color: "from-yellow-500 to-orange-500" },
              { icon: <Sparkles className="w-4 h-4" />, label: "AI Assist", color: "from-purple-500 to-pink-500" },
            ].map((action, index) => (
              <motion.button
                key={action.label}
                className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {action.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        <AccessibilityPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </AnimatePresence>
    </>
  )
}
