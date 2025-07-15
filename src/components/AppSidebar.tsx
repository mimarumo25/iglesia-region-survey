import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  LogOut,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Panel de Control",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Vista general del sistema"
  },
  {
    title: "Nueva Encuesta",
    url: "/survey",
    icon: FileText,
    description: "Realizar nueva caracterización"
  },
  {
    title: "Encuestas",
    url: "/surveys",
    icon: BarChart3,
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
  const { state, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [activeItem, setActiveItem] = useState(currentPath);

  // Actualizar item activo cuando cambie la ruta
  useEffect(() => {
    setActiveItem(currentPath);
  }, [currentPath]);

  const isActive = (path: string) => activeItem === path;

  const handleNavClick = (path: string) => {
    setActiveItem(path);
    // Cerrar el menú en móvil después de seleccionar
    if (isMobile) {
      setTimeout(() => setOpenMobile(false), 150);
    }
  };

  const getNavCls = (path: string) => {
    const baseClasses = `
      flex items-center gap-3 px-3 py-3 w-full rounded-xl
      transition-all duration-300 ease-out relative overflow-hidden
      hover-lift click-effect group min-h-[56px]
    `;
    
    if (isActive(path)) {
      return `${baseClasses} active-menu-item animate-slide-in-right`;
    }
    
    return `${baseClasses} 
      text-sidebar-foreground/80 hover:text-sidebar-foreground 
      hover:bg-sidebar-accent/20 hover:shadow-md
      hover:border-l-4 hover:border-secondary
    `;
  };

  return (
    <Sidebar
      className="bg-gradient-sidebar border-r border-sidebar-border shadow-lg flex flex-col h-screen"
      collapsible="icon"
      variant="sidebar"
    >
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 animate-bounce-in">
          <div className="w-12 h-12 bg-gradient-hover rounded-xl flex items-center justify-center shadow-md hover-glow animate-float">
            <Church className="w-7 h-7 text-white" />
          </div>
          {!isCollapsed && (
            <div className="animate-slide-in-right">
              <h2 className="font-bold text-sidebar-foreground text-lg">Sistema Parroquial</h2>
              <p className="text-sm text-sidebar-foreground/70 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Caracterización
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full p-4 overflow-hidden">
        {/* Navigation Section - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border/50 scrollbar-track-transparent">
          <SidebarGroup>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {navigationItems.map((item, index) => (
                  <SidebarMenuItem 
                    key={item.title} 
                    className={cn(
                      "transition-all duration-300 rounded-xl",
                      isMobile && state === "expanded" ? "staggered-fade-in" : "animate-slide-in-left"
                    )} 
                    style={{ animationDelay: `${index * (isMobile ? 0.05 : 0.1)}s` }}
                  >
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls(item.url)}
                        title={isCollapsed ? item.title : undefined}
                        onClick={() => handleNavClick(item.url)}
                      >
                        <item.icon className={`
                          w-5 h-5 flex-shrink-0 transition-all duration-300
                          ${isActive(item.url) ? 'text-white animate-pulse-glow' : 'group-hover:scale-110'}
                        `} />
                        {!isCollapsed && (
                          <div className="flex-1 transition-all duration-300 min-w-0">
                            <span className={`
                              font-medium block transition-all duration-300 truncate text-sm
                              ${isActive(item.url) ? 'text-white font-semibold' : ''}
                            `}>
                              {item.title}
                            </span>
                            <p className={`
                              text-[10px] leading-3 opacity-70 transition-all duration-300 truncate
                              ${isActive(item.url) ? 'text-white/90' : 'text-sidebar-foreground/60'}
                            `}>
                              {item.description}
                            </p>
                          </div>
                        )}
                        {isActive(item.url) && (
                          <div className="absolute right-2 w-2 h-2 bg-secondary rounded-full animate-pulse-glow" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Profile Section - Fixed at bottom */}
        <div className="flex-shrink-0 pt-4 border-t border-sidebar-border/50 mt-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 hover:bg-white hover-lift card-enhanced mb-4 shadow-sm border border-gray-200/50">
            <Avatar className="w-10 h-10 hover-scale flex-shrink-0">
              <AvatarFallback className="bg-gradient-hover text-white text-sm font-semibold shadow-md rounded-xl">
                AD
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 animate-slide-in-right min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">Administrador</p>
                <p className="text-xs text-gray-600 truncate">Sistema Parroquial</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-2xl transition-all duration-300 hover-lift click-effect h-11 bg-white/50 border border-gray-200/30"
              onClick={() => {
                // Lógica de logout
                window.location.href = "/login";
              }}
            >
              <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Cerrar Sesión</span>
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;