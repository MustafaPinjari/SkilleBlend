"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { api } from "../services/api"
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

export const useAccessibilityWithBackend = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessibilityScore, setAccessibilityScore] = useState(85)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [presets, setPresets] = useState<AccessibilityPreset[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const syncTimeoutRef = useRef<NodeJS.Timeout>()

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(api.isAuthenticated())
  }, [])

  // Load settings from backend or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (api.isAuthenticated()) {
          // Load from backend
          const response = await api.getCurrentSettings()
          if (response.data) {
            setSettings({ ...DEFAULT_SETTINGS, ...response.data })
          } else if (response.error) {
            console.warn("Failed to load settings from backend:", response.error)
            // Fallback to localStorage
            loadLocalSettings()
          }
        } else {
          // Load from localStorage
          loadLocalSettings()
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        setError("Failed to load settings")
        loadLocalSettings()
      } finally {
        setIsLoading(false)
        setIsLoaded(true)
      }
    }

    const loadLocalSettings = () => {
      const savedSettings = localStorage.getItem("a11y-widget-settings-v2")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings({ ...DEFAULT_SETTINGS, ...parsed })
        } catch (error) {
          console.error("Failed to parse local settings:", error)
        }
      }
    }

    loadSettings()
  }, [isAuthenticated])

  // Load presets
  useEffect(() => {
    const loadPresets = async () => {
      if (!api.isAuthenticated()) return

      try {
        const response = await api.getPresets()
        if (response.data) {
          setPresets(response.data)
        }
      } catch (error) {
        console.error("Error loading presets:", error)
      }
    }

    loadPresets()
  }, [isAuthenticated])

  // Sync settings with backend (debounced)
  const syncWithBackend = useCallback(async (newSettings: AccessibilitySettings) => {
    if (!api.isAuthenticated()) return

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }

    // Set new timeout for debounced sync
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await api.updateSettings(newSettings)
        if (response.error) {
          console.error("Failed to sync settings:", response.error)
          setError("Failed to sync settings with server")
        }
      } catch (error) {
        console.error("Error syncing settings:", error)
        setError("Network error while syncing settings")
      }
    }, 1000) // 1 second debounce
  }, [])

  // Track feature usage
  const trackUsage = useCallback(async (featureName: string) => {
    if (!api.isAuthenticated()) return

    try {
      await api.trackUsage({
        feature_name: featureName,
        domain: window.location.hostname,
        url: window.location.href,
      })
    } catch (error) {
      console.error("Error tracking usage:", error)
    }
  }, [])

  // Update setting with backend sync
  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)

      // Save to localStorage immediately
      localStorage.setItem("a11y-widget-settings-v2", JSON.stringify(newSettings))

      // Sync with backend (debounced)
      syncWithBackend(newSettings)

      // Track usage
      trackUsage(key)
    },
    [settings, syncWithBackend, trackUsage],
  )

  // Apply preset
  const applyPreset = useCallback(
    async (preset: AccessibilityPreset) => {
      const newSettings = { ...settings, ...preset.settings }
      setSettings(newSettings)

      // Save to localStorage
      localStorage.setItem("a11y-widget-settings-v2", JSON.stringify(newSettings))

      // Apply preset on backend if authenticated
      if (api.isAuthenticated() && preset.id) {
        try {
          const response = await api.applyPreset(preset.id)
          if (response.error) {
            console.error("Failed to apply preset:", response.error)
            setError("Failed to apply preset")
          }
        } catch (error) {
          console.error("Error applying preset:", error)
        }
      }

      // Track usage
      trackUsage(`preset_${preset.id}`)
    },
    [settings, trackUsage],
  )

  // Generate AI suggestions
  const generateAISuggestions = useCallback(async () => {
    if (!api.isAuthenticated() || !settings.aiSuggestions) return

    try {
      const response = await api.generateSuggestions({
        domain: window.location.hostname,
        url: window.location.href,
        score: accessibilityScore,
      })

      if (response.data?.suggestions) {
        setAiSuggestions(response.data.suggestions)
      }
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
    }
  }, [accessibilityScore, settings.aiSuggestions])

  // Apply AI suggestion
  const applySuggestion = useCallback(
    async (suggestionId: string) => {
      try {
        const response = await api.applySuggestion(suggestionId)
        if (response.data) {
          // Update settings based on suggestion
          const updatedSettings = { ...settings, ...response.data.applied_settings }
          setSettings(updatedSettings)
          localStorage.setItem("a11y-widget-settings-v2", JSON.stringify(updatedSettings))
        }
      } catch (error) {
        console.error("Error applying suggestion:", error)
      }
    },
    [settings],
  )

  // Analyze current page
  const analyzeCurrentPage = useCallback(async () => {
    if (!api.isAuthenticated()) return

    try {
      const response = await api.analyzeWebsite(window.location.href, {
        include_suggestions: true,
        deep_analysis: false,
      })

      if (response.data) {
        setAccessibilityScore(response.data.overall_score)
        if (response.data.ai_suggestions) {
          setAiSuggestions(response.data.ai_suggestions)
        }
      }
    } catch (error) {
      console.error("Error analyzing page:", error)
    }
  }, [])

  // Reset settings
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem("a11y-widget-settings-v2")

    if (api.isAuthenticated()) {
      syncWithBackend(DEFAULT_SETTINGS)
    }
  }, [syncWithBackend])

  // Login handler
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.login(email, password)
      if (response.data?.key) {
        setIsAuthenticated(true)
        // Reload settings from backend
        const settingsResponse = await api.getCurrentSettings()
        if (settingsResponse.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...settingsResponse.data })
        }
        return { success: true }
      } else {
        setError(response.error || "Login failed")
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await api.logout()
      setIsAuthenticated(false)
      setPresets([])
      setAiSuggestions([])
      // Keep local settings but clear backend-specific data
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }, [])

  // Apply DOM changes (same as original hook)
  useEffect(() => {
    if (!isLoaded) return

    const root = document.documentElement
    const body = document.body

    // Apply all the DOM manipulations from the original hook
    // (contrast, text size, dark mode, etc.)
    const updates: (() => void)[] = []

    // Contrast and filters
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

    // Text controls
    updates.push(() => {
      root.style.setProperty("--a11y-text-size", settings.textSize.toString())
      root.style.setProperty("--a11y-line-height", settings.lineHeight.toString())
      root.style.setProperty("--a11y-letter-spacing", `${settings.letterSpacing}em`)

      body.style.fontSize = `calc(1rem * var(--a11y-text-size, 1))`
      body.style.lineHeight = `var(--a11y-line-height, 1.5)`
      body.style.letterSpacing = `var(--a11y-letter-spacing, 0)`
    })

    // Dark mode
    updates.push(() => {
      if (settings.darkMode) {
        root.classList.add("dark")
        root.style.colorScheme = "dark"
      } else {
        root.classList.remove("dark")
        root.style.colorScheme = "light"
      }
    })

    // Execute all updates
    requestAnimationFrame(() => {
      updates.forEach((update) => update())
    })

    // Generate AI suggestions periodically
    if (settings.aiSuggestions) {
      setTimeout(generateAISuggestions, 2000)
    }
  }, [settings, isLoaded, generateAISuggestions])

  return {
    // Settings
    settings,
    updateSetting,
    applyPreset,
    resetSettings,
    presets,

    // AI Features
    accessibilityScore,
    aiSuggestions,
    generateAISuggestions,
    applySuggestion,
    analyzeCurrentPage,

    // Authentication
    isAuthenticated,
    login,
    logout,

    // State
    isLoaded,
    isLoading,
    error,
    setError,
  }
}
