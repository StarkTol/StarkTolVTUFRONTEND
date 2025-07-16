import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/authContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StarkTol VTU - Automated. Profitable. Powerful.",
  description: "A futuristic, robotic, and fully automated Nigerian VTU platform",
  // developer: "Tolani", // ❌ Remove or move to a <meta> tag manually if needed
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
