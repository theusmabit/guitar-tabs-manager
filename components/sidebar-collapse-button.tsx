"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function SidebarCollapseButton() {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (isMobile) return null

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
      className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      aria-label={isCollapsed ? "Expandir Sidebar" : "Minimizar Sidebar"}
    >
      <ChevronDown className={cn("size-4 transition-transform", isCollapsed ? "rotate-90" : "-rotate-90")} />
    </Button>
  )
}