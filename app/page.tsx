"use client"

import { FloatingWidget } from "../components/FloatingWidget"

export default function AccessibilityWidgetDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-500">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Accessibility Widget 2025
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of web accessibility with our AI-powered widget. Featuring glassmorphism design, voice
            control, and intelligent suggestions.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-8">
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              ✨ AI-Powered
            </div>
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              🎨 Premium Design
            </div>
            <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              🚀 2025 Ready
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto space-y-16">
          {/* Feature showcase */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Advanced Controls</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Precision sliders, smart toggles, and AI-powered suggestions for the perfect accessibility setup.
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Dynamic contrast adjustment</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Voice control integration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Real-time accessibility scoring</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Premium Experience</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Glassmorphism design with smooth animations and haptic feedback for an unparalleled user experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Design Score</span>
                  <span className="font-bold text-blue-600">98/100</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Performance</span>
                  <span className="font-bold text-green-600">Excellent</span>
                </div>
              </div>
            </div>
          </section>

          {/* Demo content */}
          <section className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Test the Widget</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                This is sample content to demonstrate the accessibility features. Try the floating widget in the
                bottom-right corner to:
              </p>
              <ul>
                <li>Adjust contrast and text size with precision sliders</li>
                <li>Enable reading mode for distraction-free browsing</li>
                <li>Use voice commands to control settings</li>
                <li>Get AI-powered accessibility suggestions</li>
                <li>Apply smart presets for different needs</li>
              </ul>

              <h3>Sample Links and Media</h3>
              <p>
                Here are some{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  sample links
                </a>{" "}
                and
                <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors ml-2">
                  another link
                </a>{" "}
                to test the highlight feature.
              </p>

              <div className="my-8">
                <img
                  src="/Niagara.jpeg"
                  alt="Modern accessibility dashboard interface"
                  className="rounded-xl shadow-lg w-full"
                />
              </div>

              <h4>Animated Elements</h4>
              <div className="flex items-center justify-center space-x-4 my-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400">
                These animated elements can be paused using the "Reduce Motion" feature
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Accessibility Widget */}
      <FloatingWidget />

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
