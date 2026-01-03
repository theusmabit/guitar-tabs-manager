"use client"

import * as React from "react"
import { Home, Music, Heart, Folder, Plus, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  { id: "home", title: "Início", icon: Home },
  { id: "library", title: "Biblioteca", icon: Music },
  { id: "favorites", title: "Favoritos", icon: Heart },
  { id: "folders", title: "Pastas", icon: Folder },
  { id: "add", title: "Adicionar Música", icon: Plus },
  { id: "settings", title: "Configurações", icon: Settings },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentView: string
  onNavigate: (view: any) => void
}

export function AppSidebar({ currentView, onNavigate, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        <div className="flex items-center gap-2 font-bold text-primary">
          <Music className="size-6" />
          <span className="group-data-[collapsible=icon]:hidden">Guitar Tabs</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}