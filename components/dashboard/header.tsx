"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, User, LogOut, Settings, HelpCircle, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUserData } from "@/context/UserDataContext"
import { getNotifications, markNotificationAsRead, getUnreadNotificationsCount } from "@/lib/api/notifications"
import type { Notification } from "@/lib/api/notifications"
import { formatDistanceToNow } from "date-fns"

export function DashboardHeader() {
  const { profile } = useUserData()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // Notification feature removed: no unreadCount, no notification dropdown
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger />

          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              StarkTol VTU
            </span>
          </Link>

          <div className={`relative ${isSearchOpen ? "flex md:w-64 lg:w-96" : "hidden md:flex md:w-64 lg:w-96"}`}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full pl-8" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Toggle search">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>



          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-5 w-5" />
                <span className="hidden md:inline-flex">
                  {profile?.full_name || profile?.email || 'User'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
