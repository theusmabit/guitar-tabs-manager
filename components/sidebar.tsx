"use client"

import { Home, Music, Heart, Folder, Plus, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarProps {
  currentView: string
  onNavigate: (view: "home" | "library" | "favorites" | "folders" | "add" | "settings") => void
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "library", label: "Library", icon: Music },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "folders", label: "Folders", icon: Folder },
    { id: "add", label: "Add Song", icon: Plus },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside
      className={cn(
        "hidden md:flex bg-card border-r border-border flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {!isCollapsed && (
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Music className="w-6 h-6" />
            Guitar Tabs
          </h1>
        </div>
      )}

      {isCollapsed && (
        <div className="p-4 border-b border-border flex justify-center">
          <Music className="w-6 h-6 text-primary" />
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full gap-3 text-muted-foreground hover:text-foreground hover:bg-accent",
                isCollapsed ? "justify-center px-0" : "justify-start",
                currentView === item.id && "bg-primary/10 text-primary hover:text-primary hover:bg-primary/20",
              )}
              onClick={() => onNavigate(item.id as any)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary h-9 w-9"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  )
}