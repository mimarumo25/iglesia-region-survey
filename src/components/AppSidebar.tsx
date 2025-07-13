import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Church,
  UserCheck,
  MapPin,
  Calendar,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigationItems = [
  {
    title: "Panel de Control",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Vista general del sistema"
  },
  {
    title: "Encuestas",
    url: "/surveys",
    icon: FileText,
    description: "Gestión de formularios"
  },
  {
    title: "Familias",
    url: "/families",
    icon: Users,
    description: "Registro de familias"
  },
  {
    title: "Sectores",
    url: "/sectors",
    icon: MapPin,
    description: "Gestión de sectores"
  },
  {
    title: "Reportes",
    url: "/reports",
    icon: BarChart3,
    description: "Estadísticas y análisis"
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: UserCheck,
    description: "Gestión de usuarios"
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
    description: "Configuración del sistema"
  }
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "parish-sidebar-item active bg-sidebar-accent text-sidebar-accent-foreground" 
      : "parish-sidebar-item hover:bg-sidebar-accent/10 text-sidebar-foreground";

  return (
    <Sidebar
      className="bg-sidebar border-r border-sidebar-border"
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-accent rounded-lg flex items-center justify-center">
            <Church className="w-6 h-6 text-sidebar-accent-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-sidebar-foreground">Sistema Parroquial</h2>
              <p className="text-sm text-sidebar-foreground/70">Caracterización</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium mb-4">
            {!isCollapsed && "Navegación Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-sidebar-foreground/60">{item.description}</p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Section */}
        <div className="mt-auto pt-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/10">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                AD
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="font-medium text-sidebar-foreground text-sm">Admin</p>
                <p className="text-xs text-sidebar-foreground/60">Administrador</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <Button
              variant="ghost"
              className="w-full mt-3 justify-start text-sidebar-foreground hover:bg-sidebar-accent/10"
              onClick={() => {
                // Lógica de logout
                window.location.href = "/login";
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;