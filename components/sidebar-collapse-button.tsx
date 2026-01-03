"use client"

import { PanelLeft, PanelLeftOpen } from "lucide-react"
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
      {isCollapsed ? (
        <PanelLeftOpen className="size-4" />
      ) : (
        <PanelLeft className="size-4" />
      )}
    </Button>
  )
}