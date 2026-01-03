"use client"

import type React from "react"
import { useState } from "react"
import { Search, Bell, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./theme-toggle"

interface TopBarProps {
  onSearch?: (query: string) => void
  onNavigateHome?: () => void
}

export function TopBar({ onSearch, onNavigateHome }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2 flex-1">
        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar artista ou música..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-none"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button className="hidden sm:flex" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>
        
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}