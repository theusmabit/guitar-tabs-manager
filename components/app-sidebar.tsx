"use client"

import * as React from "react"
import { Home, Music, Heart, Folder, Plus, Settings, Palette, LogOut, MoreVertical, ChevronDown, HelpCircle } from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4 group-data-[variant=inset]:px-2">
        <div className="flex items-center gap-2 font-bold text-primary">
          <Music className="size-6" />
          <span className="group-data-[collapsible=icon]:hidden">ChordMaster</span>
        </div>
        <div className="ml-auto group-data-[collapsible=icon]:hidden">
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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

        {/* Grupo 2: Ferramentas e Utilidades */}
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip="Tema">
                      <Palette />
                      <span>Tema</span>
                      <ChevronDown className="size-4 ml-auto group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right" sideOffset={isCollapsed ? 12 : 0}>
                    <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Ajuda">
                  <HelpCircle />
                  <span>Ajuda</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grupo 3: Configurações */}
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onNavigate("settings")}
                  isActive={currentView === "settings"}
                  tooltip="Configurações"
                >
                  <Settings />
                  <span>Configurações</span>
                  <ChevronDown className="size-4 ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2 group-data-[variant=inset]:p-0">
        {/* User Profile Row - Integrated style */}
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent group-data-[variant=inset]:p-2">
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
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" sideOffset={8}>
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