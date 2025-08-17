import type React from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="absolute left-0 top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              StarkTol VTU
            </span>
          </Link>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="w-full text-center text-sm text-muted-foreground py-6">
        &copy; {new Date().getFullYear()} StarkTol VTU. All rights reserved.
      </footer>
    </div>
  )
}
