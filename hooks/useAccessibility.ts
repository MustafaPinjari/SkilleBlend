"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { AccessibilitySettings, AccessibilityPreset } from "../types/accessibility"

const DEFAULT_SETTINGS: AccessibilitySettings = {
  contrastLevel: 100,
  highlightLinks: false,
  textSize: 1.0,
  textSpacing: 1.0,
  lineHeight: 1.5,
  letterSpacing: 0,
  colorBlindnessFilter: "none",
  darkMode: false,
  reducedMotion: false,
  focusIndicator: false,
  pauseAnimations: false,
  hideImages: false,
  dyslexiaFont: false,
  readingMode: false,
  cursorSize: 1,
  showTooltips: false,
  pageStructure: false,
  keyboardNavigation: false,
  voiceControl: false,
  aiSuggestions: true,
  accessibilityScore: true,
  customTheme: "default",
}

const STORAGE_KEY = "a11y-widget-settings-v2"
const USAGE_KEY = "a11y-widget-usage"

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  const [accessibilityScore, setAccessibilityScore] = useState(85)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [usageStats, setUsageStats] = useState<Record<string, number>>({})
  const observerRef = useRef<MutationObserver | null>(null)

  // Load settings and usage stats
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY)
    const savedUsage = localStorage.getItem(USAGE_KEY)

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (error) {
        console.error("Failed to parse accessibility settings:", error)
      }
    }

    if (savedUsage) {
      try {
        setUsageStats(JSON.parse(savedUsage))
      } catch (error) {
        console.error("Failed to parse usage stats:", error)
      }
    }

    setIsLoaded(true)
  }, [])

  // Save settings and update usage stats
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  // AI-powered accessibility analysis
  const analyzeAccessibility = useCallback(() => {
    const issues: string[] = []
    let score = 100

    // Check for common accessibility issues
    const images = document.querySelectorAll("img:not([alt])")
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`)
      score -= 10
    }

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    if (headings.length === 0) {
      issues.push("No heading structure found")
      score -= 15
    }

    const links = document.querySelectorAll("a:not([aria-label]):not([title])")
    const emptyLinks = Array.from(links).filter((link) => !link.textContent?.trim())
    if (emptyLinks.length > 0) {
      issues.push(`${emptyLinks.length} links without descriptive text`)
      score -= 5
    }

    const contrast = window.getComputedStyle(document.body).color
    if (contrast === "rgb(128, 128, 128)") {
      issues.push("Low contrast detected")
      score -= 10
    }

    setAccessibilityScore(Math.max(score, 0))

    // Generate AI suggestions based on issues
    const suggestions: string[] = []
    if (issues.length > 0) {
      suggestions.push("Consider increasing contrast for better readability")
      suggestions.push("Enable focus indicators for keyboard navigation")
      if (settings.textSize < 1.2) {
        suggestions.push("Larger text size recommended for your usage pattern")
      }
    }

    setAiSuggestions(suggestions)
  }, [settings.textSize])

  // Advanced DOM manipulation with performance optimization
  useEffect(() => {
    if (!isLoaded) return

    const root = document.documentElement
    const body = document.body

    // Batch DOM updates for performance
    const updates: (() => void)[] = []

    // Advanced contrast with CSS filters
    updates.push(() => {
      const contrastValue = settings.contrastLevel / 100
      const filters = [
        `contrast(${contrastValue})`,
        settings.colorBlindnessFilter !== "none" ? `url(#${settings.colorBlindnessFilter}-filter)` : "",
      ]
        .filter(Boolean)
        .join(" ")

      body.style.filter = filters || ""
    })

    // Advanced text controls
    updates.push(() => {
      root.style.setProperty("--a11y-text-size", settings.textSize.toString())
      root.style.setProperty("--a11y-line-height", settings.lineHeight.toString())
      root.style.setProperty("--a11y-letter-spacing", `${settings.letterSpacing}em`)

      body.style.fontSize = `calc(1rem * var(--a11y-text-size, 1))`
      body.style.lineHeight = `var(--a11y-line-height, 1.5)`
      body.style.letterSpacing = `var(--a11y-letter-spacing, 0)`
    })

    // Dark mode with system preference
    updates.push(() => {
      if (settings.darkMode) {
        root.classList.add("dark")
        root.style.colorScheme = "dark"
      } else {
        root.classList.remove("dark")
        root.style.colorScheme = "light"
      }
    })

    // Reading mode
    updates.push(() => {
      const readingModeStyle = document.getElementById("a11y-reading-mode")
      if (settings.readingMode) {
        if (!readingModeStyle) {
          const style = document.createElement("style")
          style.id = "a11y-reading-mode"
          style.textContent = `
            body * {
              background: #fefefe !important;
              color: #333 !important;
              border-color: #ddd !important;
            }
            body {
              background: #fefefe !important;
              max-width: 800px !important;
              margin: 0 auto !important;
              padding: 2rem !important;
              font-family: Georgia, serif !important;
            }
            img, video, iframe, svg {
              opacity: 0.7 !important;
            }
          `
          document.head.appendChild(style)
        }
      } else {
        readingModeStyle?.remove()
      }
    })

    // Advanced cursor
    updates.push(() => {
      const cursorSize = settings.cursorSize
      if (cursorSize > 1) {
        const size = 16 + (cursorSize - 1) * 8
        body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") ${size / 2} ${size / 2}, auto`
      } else {
        body.style.cursor = ""
      }
    })

    // Execute all updates in a single frame
    requestAnimationFrame(() => {
      updates.forEach((update) => update())
    })

    // Run accessibility analysis
    setTimeout(analyzeAccessibility, 1000)
  }, [settings, isLoaded, analyzeAccessibility])

  // Voice control setup
  useEffect(() => {
    if (!settings.voiceControl || !("webkitSpeechRecognition" in window)) return

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase()

      if (command.includes("increase text")) {
        updateSetting("textSize", Math.min(settings.textSize + 0.1, 2.0))
      } else if (command.includes("decrease text")) {
        updateSetting("textSize", Math.max(settings.textSize - 0.1, 0.8))
      } else if (command.includes("dark mode")) {
        updateSetting("darkMode", !settings.darkMode)
      } else if (command.includes("reading mode")) {
        updateSetting("readingMode", !settings.readingMode)
      }
    }

    recognition.start()
    return () => recognition.stop()
  }, [settings.voiceControl, settings.textSize, settings.darkMode, settings.readingMode])

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))

      // Track usage
      setUsageStats((prev) => {
        const updated = { ...prev, [key]: (prev[key] || 0) + 1 }
        localStorage.setItem(USAGE_KEY, JSON.stringify(updated))
        return updated
      })
    },
    [],
  )

  const applyPreset = useCallback((preset: AccessibilityPreset) => {
    setSettings((prev) => ({ ...prev, ...preset.settings }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setUsageStats({})
    localStorage.removeItem(USAGE_KEY)
  }, [])

  return {
    settings,
    updateSetting,
    applyPreset,
    resetSettings,
    accessibilityScore,
    aiSuggestions,
    usageStats,
    isLoaded,
  }
}
