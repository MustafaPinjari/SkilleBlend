"use client"

import { useState } from "react"
import { testBackend } from "../../utils/testBackend"
import { api } from "../../services/api"

export default function TestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [apiResponse, setApiResponse] = useState<string>("")

  const runTests = async () => {
    setIsRunning(true)
    const results = await testBackend()
    setTestResults(results)
    setIsRunning(false)
  }

  const testApiCall = async (endpoint: string, method = "GET", body?: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(api.isAuthenticated() ? { Authorization: `Token ${localStorage.getItem("auth_token")}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })

      const data = await response.json()
      setApiResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setApiResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Backend Integration Testing</h1>

        {/* Connection Test */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Automated Tests</h2>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </button>

          {testResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.status === "pass"
                      ? "bg-green-100 text-green-800"
                      : result.status === "fail"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <span className="font-medium">{result.test}:</span> {result.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual API Testing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual API Testing</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <button
              onClick={() => testApiCall("/health/")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Health Check
            </button>
            <button
              onClick={() => testApiCall("/users/me/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Get User
            </button>
            <button
              onClick={() => testApiCall("/accessibility/settings/current/")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              Get Settings
            </button>
            <button
              onClick={() => testApiCall("/accessibility/presets/")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              Get Presets
            </button>
            <button
              onClick={() => testApiCall("/analytics/dashboard/")}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
            >
              Get Analytics
            </button>
            <button
              onClick={() =>
                testApiCall("/ai/suggestions/generate/", "POST", {
                  domain: "example.com",
                  url: "https://example.com",
                  score: 75,
                })
              }
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
            >
              AI Suggestions
            </button>
          </div>

          {apiResponse && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">API Response:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">{apiResponse}</pre>
            </div>
          )}
        </div>

        {/* Authentication Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className={api.isAuthenticated() ? "text-green-600" : "text-red-600"}>
                {api.isAuthenticated() ? "Authenticated" : "Not Authenticated"}
              </span>
            </p>
            <p>
              <span className="font-medium">Token:</span>{" "}
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                {localStorage.getItem("auth_token") || "None"}
              </code>
            </p>
            <p>
              <span className="font-medium">API URL:</span>{" "}
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
