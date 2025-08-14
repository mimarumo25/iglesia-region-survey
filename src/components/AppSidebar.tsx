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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  Droplets,
  Home,
  LogOut,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Heart,
  User,
  Trash2,
  Shirt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

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
    description: "Gestión de usuarios",
    requiredRoles: ["admin"] // Solo administradores
  },
  {
    title: "Mi Perfil",
    url: "/profile",
    icon: User,
    description: "Ver y editar mi perfil"
  },
  {
    title: "Configuración",
    icon: Settings,
    description: "Configuración del sistema",
    isExpandable: true,
    subItems: [
      {
        title: "General",
        url: "/settings",
        icon: Settings,
        description: "Configuración general del sistema"
      },
      {
        title: "Parroquias",
        url: "/settings/parroquias",
        icon: Church,
        description: "Gestión de parroquias",
        requiredRoles: ["admin"]
      },

      {
        title: "Enfermedades",
        url: "/settings/enfermedades",
        icon: Heart,
        description: "Catálogo de enfermedades",
        requiredRoles: ["admin"]
      },
      {
        title: "Veredas",
        url: "/settings/veredas",
        icon: MapPin,
        description: "Gestión de veredas",
        requiredRoles: ["admin"]
      },
      {
        title: "Municipios",
        url: "/settings/municipios",
        icon: MapPin,
        description: "Gestión de municipios",
        requiredRoles: ["admin"]
      },
      {
        title: "Aguas Residuales",
        url: "/settings/aguas-residuales",
        icon: Droplets,
        description: "Tipos de sistemas de aguas residuales",
        requiredRoles: ["admin"]
      },
      {
        title: "Tipos de Vivienda",
        url: "/settings/tipos-vivienda",
        icon: Home,
        description: "Tipos de vivienda disponibles",
        requiredRoles: ["admin"]
      },
      {
        title: "Parentescos",
        url: "/settings/parentescos",
        icon: Users,
        description: "Tipos de relación familiar",
        requiredRoles: ["admin"]
      },
      {
        title: "Estados Civiles",
        url: "/settings/estados-civiles",
        icon: Heart,
        description: "Tipos de estado civil",
        requiredRoles: ["admin"]
      },
      {
        title: "Disposición de Basura",
        url: "/settings/disposicion-basura",
        icon: Trash2,
        description: "Tipos de disposición de basura",
        requiredRoles: ["admin"]
      },
      {
        title: "Sexos",
        url: "/settings/sexos",
        icon: Users,
        description: "Catálogo de sexos",
        requiredRoles: ["admin"]
      },
      {
        title: "Comunidades Culturales",
        url: "/settings/comunidades-culturales",
        icon: Users,
        description: "Comunidades étnicas y culturales",
        requiredRoles: ["admin"]
      },
      {
        title: "Estudios",
        url: "/settings/estudios",
        icon: Users,
        description: "Niveles de estudio",
        requiredRoles: ["admin"]
      },
      {
        title: "Situaciones Civiles",
        url: "/settings/situaciones-civiles",
        icon: Heart,
        description: "Estados de situación civil",
        requiredRoles: ["admin"]
      },
      {
        title: "Departamentos",
        url: "/settings/departamentos",
        icon: MapPin,
        description: "Departamentos del país",
        requiredRoles: ["admin"]
      },
      {
        title: "Profesiones",
        url: "/settings/profesiones",
        icon: Users,
        description: "Catálogo de profesiones",
        requiredRoles: ["admin"]
      },
      {
        title: "Catálogo Sectores",
        url: "/settings/sectores-config",
        icon: MapPin,
        description: "Catálogo de sectores del sistema",
        requiredRoles: ["admin"]
      },
      {
        title: "Tallas",
        url: "/settings/tallas",
        icon: Shirt,
        description: "Gestión de tallas (Camisa, Pantalón, Calzado)",
        requiredRoles: ["admin"]
      }
    ]
  }
];

const AppSidebar = () => {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const { user, logout } = useAuthContext(); // Agregar logout del contexto
  const { canManageUsers } = usePermissions(); // Usar el hook de permisos
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [activeItem, setActiveItem] = useState(currentPath);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filtrar elementos del menú según permisos del usuario
  const filteredNavigationItems = navigationItems.filter(item => {
    // Si el item no tiene requiredRoles, es accesible para todos
    if (!item.requiredRoles) return true;
    
    // Si el usuario no está autenticado, no mostrar items con permisos
    if (!user) return false;
    
    // Para el elemento de usuarios, usar el hook de permisos específico
    if (item.title === "Usuarios") {
      return canManageUsers;
    }
    
    // Verificar si el usuario tiene uno de los roles requeridos
    return item.requiredRoles.includes(user.role);
  });

  // Actualizar item activo cuando cambie la ruta
  useEffect(() => {
    setActiveItem(currentPath);
    // Auto-expandir el menú padre si estamos en una sub-ruta específica (no en /settings)
    navigationItems.forEach(item => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(subItem => {
          // Expandir solo si estamos en una sub-ruta específica, no en /settings
          return currentPath === subItem.url && subItem.url !== '/settings';
        });
        if (hasActiveSubItem && !expandedItems.includes(item.title)) {
          setExpandedItems(prev => [...prev, item.title]);
        }
        // Contraer si estamos en /settings
        if (currentPath === '/settings' && expandedItems.includes(item.title)) {
          setExpandedItems(prev => prev.filter(title => title !== item.title));
        }
      }
    });
  }, [currentPath]);

  const isActive = (path: string) => {
    // Para rutas exactas
    if (path === '/settings') {
      return currentPath === '/settings';
    }
    // Para otras rutas, usar coincidencia exacta o que empiece con la ruta
    return currentPath === path || (currentPath.startsWith(path) && path !== '/settings');
  };

  const handleNavClick = (path: string) => {
    setActiveItem(path);
    // Cerrar el menú en móvil después de seleccionar
    if (isMobile) {
      setTimeout(() => setOpenMobile(false), 150);
    }
  };

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev => 
      prev.includes(itemTitle) 
        ? prev.filter(title => title !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const isExpanded = (itemTitle: string) => expandedItems.includes(itemTitle);

  // Filtrar sub-items según permisos
  const filterSubItems = (subItems: any[]) => {
    return subItems.filter(subItem => {
      if (!subItem.requiredRoles) return true;
      if (!user) return false;
      
      if (subItem.title === "Parroquias" || subItem.title === "Sectores") {
        return canManageUsers; // Usar los mismos permisos que usuarios por ahora
      }
      
      return subItem.requiredRoles.includes(user.role);
    });
  };

  // Verificar si el item expandible debería mostrarse
  const shouldShowExpandableItem = (item: any) => {
    if (!item.isExpandable || !item.subItems) return true;
    
    // Si no hay sub-items después del filtrado, no mostrar el item expandible
    const filteredSubItems = filterSubItems(item.subItems);
    return filteredSubItems.length > 0;
  };

  const getNavCls = (path?: string, isSubItem: boolean = false) => {
    const baseClasses = `
      flex items-center gap-3 px-4 py-3 w-full rounded-xl
      transition-all duration-300 ease-out relative overflow-hidden
      hover-lift click-effect group min-h-[56px]
      ${isSubItem ? 'ml-3 py-2 min-h-[48px] px-5' : ''}
    `;
    
    // Solo marcar como activo si la ruta coincide exactamente
    if (path && isActive(path)) {
      return `${baseClasses} active-menu-item animate-slide-in-right`;
    }
    
    return `${baseClasses} 
      text-sidebar-foreground/80 hover:text-sidebar-foreground 
      hover:bg-sidebar-accent/20 hover:shadow-md
      hover:border-l-4 hover:border-secondary
    `;
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      await logout();
      // El contexto de autenticación se encargará de la redirección
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Fallback: redirección manual si el logout falla
      window.location.href = "/login";
    }
  };

  // Verificar si el menú de configuración está expandido
  const isConfigExpanded = isExpanded("Configuración");
  
  // Log para debugging (remover en producción)
  useEffect(() => {
    console.log('Configuración expandida:', isConfigExpanded);
  }, [isConfigExpanded]);

  return (
    <div
      style={{
        // Cambiar el ancho dinámicamente según si configuración está expandida
        '--sidebar-width': isConfigExpanded ? '22rem' : '16rem',
        '--sidebar-width-mobile': isConfigExpanded ? '24rem' : '18rem',
      } as React.CSSProperties}
      className="sidebar-dynamic-width"
    >
      <Sidebar
        className="bg-gradient-sidebar border-r border-sidebar-border shadow-lg flex flex-col h-screen transition-all duration-300"
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
                {filteredNavigationItems.map((item, index) => {
                  // No mostrar items expandibles si no tienen sub-items visibles
                  if (item.isExpandable && !shouldShowExpandableItem(item)) {
                    return null;
                  }
                  
                  return (
                    <SidebarMenuItem 
                      key={item.title} 
                      className={cn(
                        "transition-all duration-300 rounded-xl",
                        isMobile && state === "expanded" ? "staggered-fade-in" : "animate-slide-in-left"
                      )} 
                      style={{ animationDelay: `${index * (isMobile ? 0.05 : 0.1)}s` }}
                    >
                      {item.isExpandable && item.subItems ? (
                        // Menú expandible con sub-items
                        <Collapsible
                          open={isExpanded(item.title)}
                          onOpenChange={() => toggleExpanded(item.title)}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className={cn(
                                getNavCls(),
                                // No marcar como activo si estamos en /settings pero el menú es expandible
                                currentPath === '/settings' && item.isExpandable ? 
                                  'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20' : ''
                              )}
                            >
                              <item.icon className={`
                                w-5 h-5 flex-shrink-0 transition-all duration-300
                                group-hover:scale-110
                              `} />
                              {!isCollapsed && (
                                <>
                                  <div className="flex-1 transition-all duration-300 min-w-0 sidebar-text-wrapper">
                                    <span className="font-medium block transition-all duration-300 truncate text-sm text-sidebar-foreground">
                                      {item.title}
                                    </span>
                                    <p className="text-[10px] leading-3 opacity-90 transition-all duration-300 truncate text-sidebar-foreground/80 sidebar-description">
                                      {item.description}
                                    </p>
                                  </div>
                                  {isExpanded(item.title) ? (
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                                  )}
                                </>
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          
                          {!isCollapsed && (
                            <CollapsibleContent className="sidebar-collapsible-content">
                              <SidebarMenuSub className="ml-3 mt-2 space-y-1 pl-2">
                                {filterSubItems(item.subItems).map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <NavLink 
                                        to={subItem.url} 
                                        className={getNavCls(subItem.url, true)}
                                        title={isCollapsed ? subItem.title : undefined}
                                        onClick={() => handleNavClick(subItem.url)}
                                      >
                                        <subItem.icon className={`
                                          w-4 h-4 flex-shrink-0 transition-all duration-300
                                          ${isActive(subItem.url) ? 'text-white animate-pulse-glow' : 'group-hover:scale-110'}
                                        `} />
                                        <div className="flex-1 transition-all duration-300 min-w-0 sidebar-text-wrapper">
                                          <span className={`
                                            font-medium block transition-all duration-300 truncate text-sm text-sidebar-foreground
                                            ${isActive(subItem.url) ? 'text-white font-semibold' : ''}
                                          `}>
                                            {subItem.title}
                                          </span>
                                          <p className={`
                                            text-[10px] leading-3 opacity-90 transition-all duration-300 truncate sidebar-description
                                            ${isActive(subItem.url) ? 'text-white/90' : 'text-sidebar-foreground/80'}
                                          `}>
                                            {subItem.description}
                                          </p>
                                        </div>
                                        {isActive(subItem.url) && (
                                          <div className="absolute right-2 w-2 h-2 bg-secondary rounded-full animate-pulse-glow" />
                                        )}
                                      </NavLink>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      ) : (
                        // Menú normal sin sub-items
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url!} 
                            end 
                            className={getNavCls(item.url)}
                            title={isCollapsed ? item.title : undefined}
                            onClick={() => handleNavClick(item.url!)}
                          >
                            <item.icon className={`
                              w-5 h-5 flex-shrink-0 transition-all duration-300
                              ${isActive(item.url!) ? 'text-white animate-pulse-glow' : 'group-hover:scale-110'}
                            `} />
                            {!isCollapsed && (
                              <div className="flex-1 transition-all duration-300 min-w-0 sidebar-text-wrapper">
                                <span className={`
                                  font-medium block transition-all duration-300 truncate text-sm text-sidebar-foreground
                                  ${isActive(item.url!) ? 'text-white font-semibold' : ''}
                                `}>
                                  {item.title}
                                </span>
                                <p className={`
                                  text-[10px] leading-3 opacity-90 transition-all duration-300 truncate sidebar-description
                                  ${isActive(item.url!) ? 'text-white/90' : 'text-sidebar-foreground/80'}
                                `}>
                                  {item.description}
                                </p>
                              </div>
                            )}
                            {isActive(item.url!) && (
                              <div className="absolute right-2 w-2 h-2 bg-secondary rounded-full animate-pulse-glow" />
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Profile Section - Fixed at bottom */}
        <div className="flex-shrink-0 pt-4 border-t border-sidebar-border/50 mt-4">
          <div 
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 hover:bg-white hover-lift card-enhanced mb-4 shadow-sm border border-gray-200/50 cursor-pointer transition-all duration-200"
            onClick={() => window.location.href = '/profile'}
            title="Ver perfil"
          >
            <Avatar className="w-10 h-10 hover-scale flex-shrink-0">
              <AvatarFallback className="bg-gradient-hover text-white text-sm font-semibold shadow-md rounded-xl">
                {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 animate-slide-in-right min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate capitalize">
                  {user?.role === 'admin' ? 'Administrador' : 
                   user?.role === 'coordinator' ? 'Coordinador' : 
                   user?.role === 'surveyor' ? 'Encuestador' : user?.role}
                </p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-2xl transition-all duration-300 hover-lift click-effect h-11 bg-white/50 border border-gray-200/30"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Cerrar Sesión</span>
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
    </div>
  );
};

export default AppSidebar;