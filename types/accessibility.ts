import type React from "react"

export interface AccessibilitySettings {
  // Visual Adjustments
  contrastLevel: number // 0-200
  highlightLinks: boolean
  textSize: number // 0.8-2.0
  textSpacing: number // 1.0-2.0
  lineHeight: number // 1.0-3.0
  letterSpacing: number // 0-0.2

  // Advanced Visual
  colorBlindnessFilter: "none" | "protanopia" | "deuteranopia" | "tritanopia"
  darkMode: boolean
  reducedMotion: boolean
  focusIndicator: boolean

  // Behavior Controls
  pauseAnimations: boolean
  hideImages: boolean
  dyslexiaFont: boolean
  readingMode: boolean

  // Interface Tools
  cursorSize: number // 1-3
  showTooltips: boolean
  pageStructure: boolean
  keyboardNavigation: boolean

  // Advanced Features
  voiceControl: boolean
  aiSuggestions: boolean
  accessibilityScore: boolean
  customTheme: string
}

export interface AccessibilityPreset {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  settings: Partial<AccessibilitySettings>
}

export interface AccessibilityFeature {
  id: keyof AccessibilitySettings
  label: string
  icon: React.ReactNode
  description: string
  category: "visual" | "behavior" | "interface" | "advanced"
  type: "boolean" | "range" | "select"
  range?: { min: number; max: number; step: number }
  options?: Array<{ value: string; label: string }>
}

export interface WidgetTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  gradient: string
}
