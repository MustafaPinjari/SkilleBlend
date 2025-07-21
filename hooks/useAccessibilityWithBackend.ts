"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { api } from "../services/api"
import type { AccessibilitySettings, AccessibilityPreset } from "../types/accessibility"

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Add CSS for focus indicators
const addKeyboardNavigationStyles = () => {
  if (document.getElementById('keyboard-navigation-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'keyboard-navigation-styles';
  style.textContent = `
    .keyboard-navigation-active :is(a, button, input, textarea, select, details, [tabindex]):focus-visible {
      outline: 3px solid #3b82f6 !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5) !important;
    }
    
    /* Add more specific styles for focusable elements if needed */
    .keyboard-navigation-active a:focus-visible,
    .keyboard-navigation-active button:focus-visible,
    .keyboard-navigation-active input:focus-visible,
    .keyboard-navigation-active textarea:focus-visible,
    .keyboard-navigation-active select:focus-visible,
    .keyboard-navigation-active [tabindex]:focus-visible {
      position: relative;
      z-index: 9999;
    }
  `;
  document.head.appendChild(style);
};

// Remove keyboard navigation styles
const removeKeyboardNavigationStyles = () => {
  const style = document.getElementById('keyboard-navigation-styles');
  if (style) {
    style.remove();
  }
  document.documentElement.classList.remove('keyboard-navigation-active');
};

const DEFAULT_SETTINGS: AccessibilitySettings = {
  // Visual Adjustments
  contrastLevel: 100,
  highlightLinks: false,
  highlightLinksStyle: 'underline',
  textSize: 1.0,
  textSpacing: 1.0,
  lineHeight: 1.5,
  letterSpacing: 0,
  wordSpacing: 0.1,  // 0-0.5em
  paragraphSpacing: 1.0,  // 0-2.0

  // Advanced Visual
  colorBlindnessFilter: "none",
  darkMode: false,
  reducedMotion: false,
  focusIndicator: false,
  focusRing: false,

  // Behavior Controls
  pauseAnimations: false,
  animationLevel: 'full',
  hideImages: false,
  dyslexiaFont: false,
  readingMode: false,

  // Interface Tools
  cursorSize: 1,
  cursorStyle: 'default',
  customCursorUrl: '',
  showTooltips: false,
  tooltipMode: 'hover',
  pageStructure: false,
  headingLevels: true,
  landmarkRoles: true,
  keyboardNavigation: false,

  // Advanced Features
  voiceControl: false,
  aiSuggestions: true,
  accessibilityScore: true,
  customTheme: "default",
  
  // New Features
  linkUnderline: true,
  buttonFocus: true,
  formLabelVisibility: true,
  reduceTransparency: false,
  animationControls: true
};

export const useAccessibilityWithBackend = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessibilityScore, setAccessibilityScore] = useState(85)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [presets, setPresets] = useState<AccessibilityPreset[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(api.isAuthenticated())
  }, [])

  // Load settings from backend or localStorage
  useEffect(() => {
    const loadLocalSettings = (): void => {
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

  // Voice control implementation
  useEffect(() => {
    if (!isLoaded || !settings.voiceControl) return;

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    // Handle recognition results
    const handleResult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Voice command:', transcript);

      // Process voice commands
      if (transcript.includes('increase text') || transcript.includes('bigger text')) {
        updateSetting('textSize', Math.min(settings.textSize + 0.2, 2.0));
      } else if (transcript.includes('decrease text') || transcript.includes('smaller text')) {
        updateSetting('textSize', Math.max(settings.textSize - 0.2, 0.8));
      } else if (transcript.includes('dark mode')) {
        updateSetting('darkMode', !settings.darkMode);
      } else if (transcript.includes('light mode')) {
        updateSetting('darkMode', false);
      } else if (transcript.includes('reading mode')) {
        updateSetting('readingMode', !settings.readingMode);
      } else if (transcript.includes('increase contrast')) {
        updateSetting('contrastLevel', Math.min(settings.contrastLevel + 10, 200));
      } else if (transcript.includes('decrease contrast')) {
        updateSetting('contrastLevel', Math.max(settings.contrastLevel - 10, 50));
      } else if (transcript.includes('enable keyboard navigation')) {
        updateSetting('keyboardNavigation', true);
      } else if (transcript.includes('disable keyboard navigation')) {
        updateSetting('keyboardNavigation', false);
      } else if (transcript.includes('help')) {
        const helpMessage = 'Here are some voice commands you can use: ' +
          'Increase text, Decrease text, Dark mode, Light mode, Reading mode, ' +
          'Increase contrast, Decrease contrast, Enable keyboard navigation, Disable keyboard navigation';
        alert(helpMessage);
      }
    };

    // Handle errors
    const handleError = (event: any) => {
      console.error('Speech recognition error:', event.error, event);
      
      // Don't show alerts for aborted errors as they're usually not user-facing
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice control.');
        updateSetting('voiceControl', false);
      } else if (event.error === 'audio-capture') {
        console.warn('No microphone found or access denied');
        updateSetting('voiceControl', false);
      } else if (event.error === 'language-not-supported') {
        console.warn('Language not supported');
      }
      
      // Don't restart if voice control was turned off
      if (!settings.voiceControl) return;
      
      // Wait a bit before restarting to prevent rapid reconnection attempts
      setTimeout(() => {
        try {
          recognition.start();
          console.log('Restarted speech recognition after error');
        } catch (e) {
          console.error('Failed to restart speech recognition:', e);
        }
      }, 1000);
    };

    // Handle recognition end
    const handleEnd = () => {
      // Only restart if voice control is still enabled
      if (settings.voiceControl) {
        try {
          recognition.start();
          console.log('Restarted speech recognition after end');
        } catch (e) {
          console.error('Failed to restart speech recognition after end:', e);
        }
      }
    };

    // Set up event listeners
    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', handleEnd);

    // Start recognition with error handling
    const startRecognition = () => {
      try {
        recognition.start();
        console.log('Voice control started');
      } catch (err) {
        console.error('Failed to start voice recognition:', err);
        // If we fail to start, try again after a delay
        if (settings.voiceControl) {
          setTimeout(startRecognition, 2000);
        }
      }
    };

    // Initial start
    startRecognition();

    // Clean up
    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('end', handleEnd);
      
      // Stop recognition during cleanup
      try {
        recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition during cleanup:', e);
      }
    };
  }, [settings.voiceControl, isLoaded, settings.textSize, settings.darkMode, settings.readingMode, settings.contrastLevel, settings.keyboardNavigation, updateSetting]);

  // Apply DOM changes (same as original hook)
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    const body = document.body;
    
    // Add or remove keyboard navigation class
    if (settings.keyboardNavigation) {
      addKeyboardNavigationStyles();
      document.documentElement.classList.add('keyboard-navigation-active');
      
      // Add keyboard event listener for visual feedback
      const handleFirstTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          document.documentElement.classList.add('keyboard-navigation-active');
          window.removeEventListener('keydown', handleFirstTab);
          window.addEventListener('mousedown', handleMouseDown);
        }
      };
      
      const handleMouseDown = () => {
        document.documentElement.classList.remove('keyboard-navigation-active');
        window.removeEventListener('mousedown', handleMouseDown);
        window.addEventListener('keydown', handleFirstTab);
      };
      
      window.addEventListener('keydown', handleFirstTab);
      
      return () => {
        window.removeEventListener('keydown', handleFirstTab);
        window.removeEventListener('mousedown', handleMouseDown);
        document.documentElement.classList.remove('keyboard-navigation-active');
        removeKeyboardNavigationStyles();
      };
    } else {
      removeKeyboardNavigationStyles();
    }

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

    // Enhanced cursor implementation
    updates.push(() => {
      const cursorSize = settings.cursorSize;
      const cursorStyle = settings.cursorStyle || 'default';
      
      // Reset cursor styles first
      document.body.style.cursor = '';
      
      // Remove any existing cursor styles
      const existingCursorStyle = document.getElementById('custom-cursor-style');
      if (existingCursorStyle) {
        existingCursorStyle.remove();
      }

      if (cursorStyle === 'default') {
        // Default cursor with size adjustment
        if (cursorSize > 1) {
          const size = 16 + (cursorSize - 1) * 8;
          document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") ${size / 2} ${size / 2}, auto`;
        }
      } else if (cursorStyle === 'high-contrast') {
        // High contrast cursor
        const size = 24;
        const style = document.createElement('style');
        style.id = 'custom-cursor-style';
        style.textContent = `
          * {
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='11' fill='white' stroke='black' stroke-width='2'/%3E%3Ccircle cx='12' cy='12' r='6' fill='black'/%3E%3C/svg%3E") ${size / 2} ${size / 2}, auto !important;
          }
        `;
        document.head.appendChild(style);
      } else if (cursorStyle === 'large') {
        // Large cursor
        const size = 32;
        document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") ${size / 2} ${size / 2}, auto`;
      } else if (cursorStyle === 'extra-large') {
        // Extra large cursor
        const size = 48;
        document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E") ${size / 2} ${size / 2}, auto`;
      }
      
      // Add custom cursor file support if needed
      if (settings.customCursorUrl) {
        const style = document.createElement('style');
        style.id = 'custom-cursor-file-style';
        style.textContent = `
          * {
            cursor: url('${settings.customCursorUrl}'), auto !important;
          }
        `;
        document.head.appendChild(style);
      }
    });

    // Highlight links
    updates.push(() => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        if (settings.highlightLinks) {
          switch (settings.highlightLinksStyle) {
            case 'border':
              link.style.borderBottom = '2px solid #FF0000';
              link.style.paddingBottom = '2px';
              break;
            case 'background':
              link.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
              link.style.padding = '2px 4px';
              break;
            case 'underline':
            default:
              link.style.textDecoration = 'underline';
              link.style.textDecorationColor = '#FF0000';
              link.style.textDecorationThickness = '2px';
              link.style.textUnderlineOffset = '2px';
          }
        } else {
          link.style.borderBottom = '';
          link.style.paddingBottom = '';
          link.style.backgroundColor = '';
          link.style.textDecoration = '';
          link.style.textDecorationColor = '';
          link.style.textDecorationThickness = '';
          link.style.textUnderlineOffset = '';
        }
      });
    });

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
