import type React from "react"

export type CursorStyle = 'default' | 'large' | 'extra-large' | 'high-contrast'
export type TooltipMode = 'hover' | 'always' | 'focus' | 'click'
export type AnimationLevel = 'full' | 'reduced' | 'none'

export interface AccessibilitySettings {
  // Visual Adjustments
  contrastLevel: number // 0-200
  highlightLinks: boolean
  highlightLinksStyle: 'border' | 'background' | 'underline' // New
  textSize: number // 0.8-2.0
  textSpacing: number // 1.0-2.0
  lineHeight: number // 1.0-3.0
  letterSpacing: number // 0-0.2
  wordSpacing: number // 0-0.5em, New
  paragraphSpacing: number // 0-2.0, New

  // Advanced Visual
  colorBlindnessFilter: "none" | "protanopia" | "deuteranopia" | "tritanopia"
  darkMode: boolean
  reducedMotion: boolean
  focusIndicator: boolean
  focusRing: boolean // New

  // Behavior Controls
  pauseAnimations: boolean
  animationLevel: AnimationLevel // New
  hideImages: boolean
  dyslexiaFont: boolean
  readingMode: boolean

  // Interface Tools
  cursorSize: number // 1-3
  cursorStyle: CursorStyle
  customCursorUrl?: string // URL to custom cursor file
  showTooltips: boolean
  tooltipMode: TooltipMode
  pageStructure: boolean
  headingLevels: boolean
  landmarkRoles: boolean
  keyboardNavigation: boolean

  // Advanced Features
  voiceControl: boolean
  aiSuggestions: boolean
  accessibilityScore: boolean
  customTheme: string
  
  // New Features
  linkUnderline: boolean
  buttonFocus: boolean
  formLabelVisibility: boolean
  reduceTransparency: boolean
  animationControls: boolean
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
