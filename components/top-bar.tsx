"use client"

import type React from "react"

import { useState } from "react"
import { Music, Search, User, Palette, Languages, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">
            Chord<span className="text-primary">Master</span>
          </span>
        </button>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by artist or song..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:flex" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Chord
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex items-center gap-2">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Palette className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">Light</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">Dark</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Languages className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">English</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">
                  Português
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">Español</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-accent cursor-pointer">Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
