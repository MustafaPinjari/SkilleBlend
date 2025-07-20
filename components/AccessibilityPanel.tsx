"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  Link,
  Type,
  Pause,
  Brain,
  MousePointer,
  RotateCcw,
  X,
  Sparkles,
  TrendingUp,
  Zap,
  Moon,
  Sun,
  Focus,
  Volume2,
  Keyboard,
  ChevronDown,
  Settings,
  Award,
  Target,
} from "lucide-react"
import { GlassCard } from "./GlassCard"
import { AdvancedToggle } from "./AdvancedToggle"
import { PremiumSlider } from "./PremiumSlider"
import { useAccessibilityWithBackend } from "../hooks/useAccessibilityWithBackend"
import { LoginModal } from "./LoginModal"

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSetting,
    resetSettings,
    accessibilityScore,
    aiSuggestions,
    presets,
    isAuthenticated,
    login,
    logout,
    isLoading,
    error,
    generateAISuggestions,
    applySuggestion,
    analyzeCurrentPage,
  } = useAccessibilityWithBackend()
  const [activeTab, setActiveTab] = useState<"features" | "ai" | "presets">("features")
  const [expandedSection, setExpandedSection] = useState<string>("visual")
  const [showLoginModal, setShowLoginModal] = useState(false)

  const tabs = [
    { id: "features", label: "Features", icon: <Settings className="w-4 h-4" /> },
    { id: "ai", label: "AI Assistant", icon: <Sparkles className="w-4 h-4" /> },
    { id: "presets", label: "Presets", icon: <Zap className="w-4 h-4" /> },
  ]

  const presetsData = [
    {
      id: "dyslexia",
      name: "Dyslexia Support",
      description: "Optimized for dyslexic users",
      icon: <Brain className="w-5 h-5" />,
      settings: { dyslexiaFont: true, textSpacing: 1.5, lineHeight: 2.0 },
    },
    {
      id: "low-vision",
      name: "Low Vision",
      description: "High contrast and large text",
      icon: <Eye className="w-5 h-5" />,
      settings: { contrastLevel: 150, textSize: 1.4, highlightLinks: true },
    },
    {
      id: "motor",
      name: "Motor Impairment",
      description: "Larger targets and reduced motion",
      icon: <Target className="w-5 h-5" />,
      settings: { cursorSize: 2, pauseAnimations: true, keyboardNavigation: true },
    },
  ]

  const FeatureSection = ({ title, children, id }: { title: string; children: React.ReactNode; id: string }) => (
    <motion.div className="mb-4">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? "" : id)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <motion.div animate={{ rotate: expandedSection === id ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="fixed bottom-20 right-4 w-96 max-h-[85vh] z-50"
    >
      <GlassCard className="overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Accessibility Hub</h2>
                <div className="flex items-center space-x-2 text-sm opacity-90">
                  <Award className="w-4 h-4" />
                  <span>Score: {accessibilityScore}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetSettings}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Reset all settings"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close accessibility panel"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="flex items-center justify-between mt-3 p-3 bg-white/10 rounded-lg">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/90">Synced</span>
                </div>
                <button onClick={logout} className="text-sm text-white/80 hover:text-white transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-white/90">Local Only</span>
                </div>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4 bg-white/10 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 flex-1 justify-center
                  ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] bg-white/5 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {activeTab === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FeatureSection title="Visual Adjustments" id="visual">
                  <PremiumSlider
                    value={settings.contrastLevel}
                    onChange={(value) => updateSetting("contrastLevel", value)}
                    min={50}
                    max={200}
                    step={10}
                    label="Contrast Level"
                    description="Adjust color contrast"
                    icon={<Eye className="w-5 h-5" />}
                    unit="%"
                  />
                  <PremiumSlider
                    value={settings.textSize}
                    onChange={(value) => updateSetting("textSize", value)}
                    min={0.8}
                    max={2.0}
                    step={0.1}
                    label="Text Size"
                    description="Scale font size"
                    icon={<Type className="w-5 h-5" />}
                    unit="x"
                  />
                  <AdvancedToggle
                    checked={settings.highlightLinks}
                    onChange={() => updateSetting("highlightLinks", !settings.highlightLinks)}
                    label="Highlight Links"
                    description="Make links more visible"
                    icon={<Link className="w-5 h-5" />}
                    variant="premium"
                  />
                  <AdvancedToggle
                    checked={settings.darkMode}
                    onChange={() => updateSetting("darkMode", !settings.darkMode)}
                    label="Dark Mode"
                    description="Switch to dark theme"
                    icon={settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    variant="neon"
                  />
                </FeatureSection>

                <FeatureSection title="Behavior Controls" id="behavior">
                  <AdvancedToggle
                    checked={settings.readingMode}
                    onChange={() => updateSetting("readingMode", !settings.readingMode)}
                    label="Reading Mode"
                    description="Distraction-free reading"
                    icon={<Focus className="w-5 h-5" />}
                    variant="premium"
                  />
                  <AdvancedToggle
                    checked={settings.dyslexiaFont}
                    onChange={() => updateSetting("dyslexiaFont", !settings.dyslexiaFont)}
                    label="Dyslexia Font"
                    description="OpenDyslexic typeface"
                    icon={<Brain className="w-5 h-5" />}
                  />
                  <AdvancedToggle
                    checked={settings.pauseAnimations}
                    onChange={() => updateSetting("pauseAnimations", !settings.pauseAnimations)}
                    label="Reduce Motion"
                    description="Minimize animations"
                    icon={<Pause className="w-5 h-5" />}
                  />
                </FeatureSection>

                <FeatureSection title="Interface Tools" id="interface">
                  <PremiumSlider
                    value={settings.cursorSize}
                    onChange={(value) => updateSetting("cursorSize", value)}
                    min={1}
                    max={3}
                    step={0.5}
                    label="Cursor Size"
                    description="Enlarge mouse pointer"
                    icon={<MousePointer className="w-5 h-5" />}
                    unit="x"
                  />
                  <AdvancedToggle
                    checked={settings.keyboardNavigation}
                    onChange={() => updateSetting("keyboardNavigation", !settings.keyboardNavigation)}
                    label="Keyboard Navigation"
                    description="Enhanced focus indicators"
                    icon={<Keyboard className="w-5 h-5" />}
                    variant="neon"
                  />
                  <AdvancedToggle
                    checked={settings.voiceControl}
                    onChange={() => updateSetting("voiceControl", !settings.voiceControl)}
                    label="Voice Control"
                    description="Voice commands (Beta)"
                    icon={<Volume2 className="w-5 h-5" />}
                  />
                </FeatureSection>
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-200/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Suggestions</h3>
                  </div>

                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm mb-4">
                      {error}
                    </div>
                  )}

                  {aiSuggestions.length > 0 ? (
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-white/10 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                        >
                          {suggestion}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No suggestions at the moment. Your accessibility setup looks great!
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-200/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility Score</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{accessibilityScore}%</div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${accessibilityScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Based on current page analysis and your settings
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "presets" && (
              <motion.div
                key="presets"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {presetsData.map((preset) => (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      Object.entries(preset.settings).forEach(([key, value]) => {
                        updateSetting(key as any, value)
                      })
                    }}
                    className="w-full p-4 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-xl border border-white/10 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-500">{preset.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{preset.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{preset.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={login}
          onRegister={async (userData) => {
            // Handle registration - you can implement this
            return { success: false, error: "Registration not implemented yet" }
          }}
        />
      </GlassCard>
    </motion.div>
  )
}
