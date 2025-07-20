import { api } from "../services/api"

export class BackendTester {
  private testResults: Array<{ test: string; status: "pass" | "fail" | "pending"; message?: string }> = []

  async runAllTests() {
    console.log("🧪 Starting Backend Integration Tests...")
    this.testResults = []

    await this.testConnection()
    await this.testAuthentication()
    await this.testSettings()
    await this.testPresets()
    await this.testAnalytics()

    this.printResults()
    return this.testResults
  }

  private async testConnection() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/health/`)
      if (response.ok) {
        this.addResult("Connection", "pass", "Backend is reachable")
      } else {
        this.addResult("Connection", "fail", `HTTP ${response.status}`)
      }
    } catch (error) {
      this.addResult("Connection", "fail", "Backend not reachable")
    }
  }

  private async testAuthentication() {
    try {
      // Test with invalid credentials
      const loginResult = await api.login("test@example.com", "wrongpassword")
      if (loginResult.error) {
        this.addResult("Authentication", "pass", "Login validation works")
      } else {
        this.addResult("Authentication", "fail", "Login should have failed")
      }
    } catch (error) {
      this.addResult("Authentication", "fail", "Authentication endpoint error")
    }
  }

  private async testSettings() {
    try {
      // Test getting settings without authentication
      const settingsResult = await api.getCurrentSettings()
      if (settingsResult.error && settingsResult.error.includes("401")) {
        this.addResult("Settings", "pass", "Settings require authentication")
      } else {
        this.addResult("Settings", "fail", "Settings should require authentication")
      }
    } catch (error) {
      this.addResult("Settings", "fail", "Settings endpoint error")
    }
  }

  private async testPresets() {
    try {
      const presetsResult = await api.getPresets()
      if (presetsResult.error && presetsResult.error.includes("401")) {
        this.addResult("Presets", "pass", "Presets require authentication")
      } else {
        this.addResult("Presets", "fail", "Presets should require authentication")
      }
    } catch (error) {
      this.addResult("Presets", "fail", "Presets endpoint error")
    }
  }

  private async testAnalytics() {
    try {
      const analyticsResult = await api.getDashboard()
      if (analyticsResult.error && analyticsResult.error.includes("401")) {
        this.addResult("Analytics", "pass", "Analytics require authentication")
      } else {
        this.addResult("Analytics", "fail", "Analytics should require authentication")
      }
    } catch (error) {
      this.addResult("Analytics", "fail", "Analytics endpoint error")
    }
  }

  private addResult(test: string, status: "pass" | "fail" | "pending", message?: string) {
    this.testResults.push({ test, status, message })
  }

  private printResults() {
    console.log("\n📊 Test Results:")
    console.log("================")

    this.testResults.forEach((result) => {
      const icon = result.status === "pass" ? "✅" : result.status === "fail" ? "❌" : "⏳"
      console.log(`${icon} ${result.test}: ${result.message || result.status}`)
    })

    const passed = this.testResults.filter((r) => r.status === "pass").length
    const total = this.testResults.length
    console.log(`\n📈 Summary: ${passed}/${total} tests passed`)
  }
}

// Usage example
export const testBackend = async () => {
  const tester = new BackendTester()
  return await tester.runAllTests()
}
