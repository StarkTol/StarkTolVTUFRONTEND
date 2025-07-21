"use client"

import { useAuth } from "@/context/authContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useState } from "react"

export default function AuthDebug() {
  const { user, isAuthenticated, loading, accessToken } = useAuth()
  const [testResult, setTestResult] = useState<string>("")
  const [testing, setTesting] = useState(false)

  const testApiConnection = async () => {
    setTesting(true)
    setTestResult("")

    try {
      console.log("🧪 Testing API connection...")
      console.log("🧪 Using token:", localStorage.getItem('access_token'))
      console.log("🧪 User data:", localStorage.getItem('user'))
      
      // Test basic API connection
      const profileRes = await api.get("/user/profile")
      
      console.log("✅ API connection successful:", profileRes.data)
      setTestResult(`✅ API connected successfully! Profile: ${JSON.stringify(profileRes.data, null, 2)}`)
      
    } catch (error: any) {
      console.error("❌ API test failed - FULL ERROR:", error)
      
      let errorMsg = "Unknown error"
      
      if (error.response) {
        errorMsg = `HTTP ${error.response.status}: ${error.response.statusText} - ${error.response.data?.message || 'No message'}`
      } else if (error.code) {
        errorMsg = `Network Error: ${error.code} - ${error.message}`
      } else {
        errorMsg = error.message || "Unknown error"
      }
      
      setTestResult(`❌ API test failed: ${errorMsg}`)
    } finally {
      setTesting(false)
    }
  }

  const getStorageInfo = () => {
    if (typeof window === 'undefined') return "Server-side"
    
    return {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'), 
      user: localStorage.getItem('user'),
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Authentication Debug Info</CardTitle>
        <CardDescription>Debug information for troubleshooting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <h4 className="font-semibold">Auth Context State:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
              {JSON.stringify({
                loading,
                isAuthenticated,
                user: user ? { id: user.id, email: user.email } : null,
                hasAccessToken: !!accessToken
              }, null, 2)}
            </pre>
          </div>
          
          <div>
            <h4 className="font-semibold">LocalStorage:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
              {JSON.stringify(getStorageInfo(), null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold">API Base URL:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
              {process.env.NEXT_PUBLIC_BASE_URL || 'https://backend-066c.onrender.com/api/v1'}
            </pre>
          </div>

          <div>
            <Button 
              onClick={testApiConnection} 
              disabled={testing || !isAuthenticated}
              size="sm"
            >
              {testing ? "Testing..." : "Test API Connection"}
            </Button>
          </div>

          {testResult && (
            <div>
              <h4 className="font-semibold">Test Result:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
