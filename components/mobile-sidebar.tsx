"use client"

import { Home, Music, Heart, Folder, Plus, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface MobileSidebarProps {
  currentView: string
  onNavigate: (view: "home" | "library" | "favorites" | "folders" | "add" | "settings") => void
}

export function MobileSidebar({ currentView, onNavigate }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "library", label: "Library", icon: Music },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "folders", label: "Folders", icon: Folder },
    { id: "add", label: "Add Song", icon: Plus },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleNavigate = (view: "home" | "library" | "favorites" | "folders" | "add" | "settings") => {
    onNavigate(view)
    setOpen(false)
  }

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-primary flex items-center gap-2">
          <Music className="w-5 h-5" />
          Guitar Tabs
        </h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-card border-border w-64">
            <div className="py-6">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                <Music className="w-6 h-6" />
                Guitar Tabs
              </h2>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent",
                        currentView === item.id && "bg-primary/10 text-primary hover:text-primary hover:bg-primary/20",
                      )}
                      onClick={() => handleNavigate(item.id as any)}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
