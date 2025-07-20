"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { GlassCard } from "./GlassCard"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onRegister?: (userData: any) => Promise<{ success: boolean; error?: string }>
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isLoginMode) {
        const result = await onLogin(formData.email, formData.password)
        if (result.success) {
          onClose()
          setFormData({ email: "", password: "", password2: "", firstName: "", lastName: "" })
        } else {
          setError(result.error || "Login failed")
        }
      } else {
        if (formData.password !== formData.password2) {
          setError("Passwords don't match")
          return
        }

        if (onRegister) {
          const result = await onRegister({
            email: formData.email,
            password1: formData.password,
            password2: formData.password2,
            first_name: formData.firstName,
            last_name: formData.lastName,
          })

          if (result.success) {
            onClose()
            setFormData({ email: "", password: "", password2: "", firstName: "", lastName: "" })
          } else {
            setError(result.error || "Registration failed")
          }
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassCard className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold">{isLoginMode ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-sm opacity-90">
                  {isLoginMode ? "Sign in to sync your settings" : "Join to unlock premium features"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 bg-white/5 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password2}
                      onChange={(e) => handleInputChange("password2", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isLoginMode ? "Signing in..." : "Creating account..."}</span>
                  </div>
                ) : (
                  <span>{isLoginMode ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode)
                  setError(null)
                  setFormData({ email: "", password: "", password2: "", firstName: "", lastName: "" })
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-200/20">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Premium Benefits</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Sync settings across devices</li>
                <li>• AI-powered accessibility suggestions</li>
                <li>• Advanced analytics and insights</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
