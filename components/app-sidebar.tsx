"use client"

import * as React from "react"
import { Home, Music, Heart, Folder, Plus, Settings, Palette, LogOut, User, ChevronDown, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"

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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { SidebarCollapseButton } from "./sidebar-collapse-button"

const navigationItems = [
  { id: "home", title: "Início", icon: Home },
  { id: "library", title: "Biblioteca", icon: Music },
  { id: "favorites", title: "Favoritos", icon: Heart },
  { id: "folders", title: "Pastas", icon: Folder },
  { id: "add", title: "Adicionar Música", icon: Plus },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentView: string
  onNavigate: (view: any) => void
}

export function AppSidebar({ currentView, onNavigate, ...props }: AppSidebarProps) {
  const { setTheme } = useTheme()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const mockUser = {
    name: "Usuário Mock",
    email: "user@example.com",
    initials: "UM",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        <div className="flex items-center gap-2 font-bold text-primary">
          <Music className="size-6" />
          <span className="group-data-[collapsible=icon]:hidden">ChordMaster</span>
        </div>
        <div className="ml-auto group-data-[collapsible=icon]:hidden">
          <SidebarCollapseButton />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="justify-start">
        {/* Grupo 1: Navegação Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
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

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {/* User Profile Row */}
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {mockUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">{mockUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shrink-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
                tooltip="Opções de Usuário"
              >
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-56">
              
              {/* Item: Configurações */}
              <DropdownMenuItem onClick={() => onNavigate("settings")}>
                <Settings className="size-4 mr-2" />
                Configurações
              </DropdownMenuItem>

              {/* Submenu: Tema */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="size-4 mr-2" />
                  Tema
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

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
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}