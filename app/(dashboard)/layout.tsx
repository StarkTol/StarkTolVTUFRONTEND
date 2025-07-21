"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarProvider } from "@/components/ui/sidebar"
import AuthGuard from "@/components/auth/AuthGuard"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen flex-col">
          <DashboardHeader />
          <div className="flex flex-1">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
          </div>
          <div className="fixed bottom-4 right-4">
            <ModeToggle />
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
