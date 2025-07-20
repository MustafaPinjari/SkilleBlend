const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface ApiResponse<T> {
  data?: T
  error?: string
  details?: Record<string, string[]>
}

class AccessibilityAPI {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Token ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || `HTTP ${response.status}`,
          details: data.details,
        }
      }

      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ key: string; user: any }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response.data?.key) {
      this.token = response.data.key
      localStorage.setItem("auth_token", this.token)
    }

    return response
  }

  async register(userData: {
    email: string
    password1: string
    password2: string
    first_name?: string
    last_name?: string
  }) {
    return this.request<{ key: string; user: any }>("/auth/registration/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    const response = await this.request("/auth/logout/", { method: "POST" })
    this.token = null
    localStorage.removeItem("auth_token")
    return response
  }

  // User Management
  async getCurrentUser() {
    return this.request<any>("/users/me/")
  }

  async updateProfile(profileData: any) {
    return this.request<any>("/users/me/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    })
  }

  async syncSettings(settings: any) {
    return this.request<any>("/users/sync_settings/", {
      method: "POST",
      body: JSON.stringify({ settings }),
    })
  }

  // Accessibility Settings
  async getCurrentSettings() {
    return this.request<any>("/accessibility/settings/current/")
  }

  async updateSettings(settings: any) {
    return this.request<any>("/accessibility/settings/bulk_update/", {
      method: "POST",
      body: JSON.stringify(settings),
    })
  }

  async getPresets() {
    return this.request<any[]>("/accessibility/presets/")
  }

  async applyPreset(presetId: string) {
    return this.request<any>(`/accessibility/presets/${presetId}/apply/`, {
      method: "POST",
    })
  }

  // Website Analysis
  async analyzeWebsite(url: string, options: { include_suggestions?: boolean; deep_analysis?: boolean } = {}) {
    return this.request<any>("/accessibility/analysis/analyze/", {
      method: "POST",
      body: JSON.stringify({ url, ...options }),
    })
  }

  // AI Suggestions
  async generateSuggestions(data: { domain: string; url: string; issues?: any[]; score?: number }) {
    return this.request<any>("/ai/suggestions/generate/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async applySuggestion(suggestionId: string) {
    return this.request<any>(`/ai/suggestions/${suggestionId}/apply/`, {
      method: "POST",
    })
  }

  async provideFeedback(suggestionId: string, feedback: string, rating: number) {
    return this.request<any>(`/ai/suggestions/${suggestionId}/feedback/`, {
      method: "POST",
      body: JSON.stringify({ feedback, rating }),
    })
  }

  // Analytics
  async getDashboard() {
    return this.request<any>("/analytics/dashboard/")
  }

  async trackUsage(data: { feature_name: string; domain: string; url: string }) {
    return this.request<any>("/analytics/usage/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Utility methods
  setToken(token: string) {
    this.token = token
    localStorage.setItem("auth_token", token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem("auth_token")
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const api = new AccessibilityAPI()
export default AccessibilityAPI
