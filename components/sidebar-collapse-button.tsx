"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

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
      {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
    </Button>
  )
}