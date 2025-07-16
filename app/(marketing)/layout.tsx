"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const currentPath = window.location.pathname

    // Only allow unauthenticated users on these pages
    const publicRoutes = ["/", "/login", "/register", "/about"]

    if (!token && !publicRoutes.includes(currentPath)) {
      router.push("/login")
    }

    // Optional: prevent logged-in users from seeing auth pages again
    if (token && ["/", "/login", "/register"].includes(currentPath)) {
      router.push("/dashboard")
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}
