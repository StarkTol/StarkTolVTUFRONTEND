"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { setupDevAuth, clearDevAuth, isDevAuth } from "@/lib/dev-auth"
import { Wrench, UserCheck, UserX } from "lucide-react"

export function DevAuthButton() {
  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false)

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  useEffect(() => {
    setIsDevAuthenticated(isDevAuth())
  }, [])

  const handleSetupDevAuth = () => {
    setupDevAuth()
    setIsDevAuthenticated(true)
    // Refresh the page to apply authentication
    window.location.reload()
  }

  const handleClearDevAuth = () => {
    clearDevAuth()
    setIsDevAuthenticated(false)
    // Refresh the page to clear authentication
    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Badge variant="secondary" className="text-xs">
        <Wrench className="h-3 w-3 mr-1" />
        Development Mode
      </Badge>
      
      {isDevAuthenticated ? (
        <Button
          onClick={handleClearDevAuth}
          variant="destructive"
          size="sm"
          className="text-xs"
        >
          <UserX className="h-3 w-3 mr-1" />
          Clear Dev Auth
        </Button>
      ) : (
        <Button
          onClick={handleSetupDevAuth}
          variant="default"
          size="sm"
          className="text-xs"
        >
          <UserCheck className="h-3 w-3 mr-1" />
          Setup Dev Auth
        </Button>
      )}
    </div>
  )
}
