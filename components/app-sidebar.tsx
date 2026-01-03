"use client"

import * as React from "react"
import { Home, Music, Heart, Folder, Plus, Settings, LogOut, ChevronDown, HelpCircle, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarFooter, useSidebar, } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

const navigationItems = [
  {
    id: "home",
    title: "Início",
    icon: Home,
  },
  {
    id: "library",
    title: "Biblioteca",
    icon: Music,
  },
  {
    id: "favorites",
    title: "Favoritos",
    icon: Heart,
  },
  {
    id: "folders",
    title: "Pastas",
    icon: Folder,
  },
  {
    id: "add",
    title: "Adicionar Música",
    icon: Plus,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentView: string
  onNavigate: (view: any) => void
}

export function AppSidebar({ currentView, onNavigate, ...props }: AppSidebarProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const mockUser = {
    name: "Usuário Mock",
    email: "user@example.com",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center justify-center px-4 group-data-[collapsible=icon]:px-2">
        {/* Logo ChordMaster */}
        <div className="flex items-center gap-2 font-bold text-primary">
          <Music className="size-6" />
          <span className="group-data-[collapsible=icon]:hidden">ChordMaster</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="justify-start">
        {/* Grupo 1: Navegação Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex w-full min-w-0 flex-col gap-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentView === item.id}
                    tooltip={item.title}
                    size="lg"
                  >
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2 group-data-[collapsible=icon]:p-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* User Profile Row - Agora é o Trigger */}
            <div 
              className="flex items-center gap-2 p-2 hover:bg-sidebar-accent cursor-pointer transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:rounded-none rounded-md"
              role="button"
              tabIndex={0}
            >
              <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                <User className="size-4 mx-auto" />
              </div>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium truncate">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
              </div>
              <ChevronDown className="size-4 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-56">
            {/* Item: Configurações */}
            <DropdownMenuItem onClick={() => onNavigate("settings")}>
              <Settings className="size-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            {/* Item: Ajuda */}
            <DropdownMenuItem>
              <HelpCircle className="size-4 mr-2" />
              Ajuda
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Item: Sair */}
            <DropdownMenuItem onClick={() => console.log("Logout")} className="text-destructive">
              <LogOut className="size-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}