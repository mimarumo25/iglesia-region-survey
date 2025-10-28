import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import Logo from "@/components/ui/logo";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
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
  Shirt,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouteTransition, useRoutePreloader } from "@/hooks/useRouteTransition";
import { lazyRoutes, getPreloadPriority } from "@/config/routes";
import { useIsMobile } from "@/hooks/use-mobile";

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
    title: "Reportes",
    url: "/reports",
    icon: BarChart3,
    description: "Reportes y estadísticas",
    isExpandable: true,
    subItems: [
      {
        title: "Reportes Generales",
        url: "/reports",
        icon: BarChart3,
        description: "Vista general de reportes"
      },
      {
        title: "Personas",
        url: "/reports/personas",
        icon: User,
        description: "Reporte de personas"
      }
    ]
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: UserCheck,
    description: "Gestión de usuarios",
    requiredRoles: ["admin"] // Solo administradores
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
        icon: MapPin,
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
        title: "Habilidades",
        url: "/settings/habilidades",
        icon: Users,
        description: "Catálogo de habilidades profesionales",
        requiredRoles: ["admin"]
      },
      {
        title: "Destrezas",
        url: "/settings/destrezas",
        icon: Users,
        description: "Catálogo de destrezas técnicas",
        requiredRoles: ["admin"]
      },
      {
        title: "Catálogo Sectores",
        url: "/settings/sectores-config",
        icon: MapPin,
        description: "Catálogo de sectores del sistema",
        requiredRoles: ["admin"]
      },
  // Tallas removed per request
    ]
  }
];

const AppSidebar = () => {
  const { state, setOpenMobile, openMobile, isMobile, toggleHidden, isHidden } = useSidebar();
  const { user, logout } = useAuthContext(); // Agregar logout del contexto
  const { canManageUsers } = usePermissions(); // Usar el hook de permisos
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileDevice = useIsMobile(); // Agregar detección específica de móvil
  const currentPath = location.pathname;
  // En móvil Sheet, forzar expanded para mostrar sub-items
  const isCollapsed = openMobile ? false : (isMobile ? false : state === "collapsed");
  const [activeItem, setActiveItem] = useState(currentPath);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Referencia al contenedor del sidebar para detectar clics fuera
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Hooks para transiciones y preloading
  const { navigateWithTransition, isPending } = useRouteTransition();
  const { preloadRoute } = useRoutePreloader();
  
  // Estados simplificados para renderizado inmediato
  const [isInitialMount, setIsInitialMount] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(true);

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
    
    // Verificar si estamos en una ruta de Configuración o Reportes
    const isInSettings = currentPath.startsWith('/settings');
    const isInReports = currentPath.startsWith('/reports');
    
    // Si NO estamos en ninguna de estas secciones, colapsar todos los menús
    if (!isInSettings && !isInReports) {
      setExpandedItems([]);
      return;
    }
    
    // Si estamos en Configuración o Reportes, auto-expandir el menú correspondiente
    navigationItems.forEach(item => {
      if (item.subItems) {
        // Verificar si algún sub-item coincide con la ruta actual
        const hasActiveSubItem = item.subItems.some(subItem => 
          currentPath === subItem.url || currentPath.startsWith(subItem.url + '/')
        );
        
        if (hasActiveSubItem) {
          // Expandir el menú padre si tiene un sub-item activo
          if (!expandedItems.includes(item.title)) {
            setExpandedItems(prev => [...prev, item.title]);
          }
        } else {
          // Contraer si no tiene sub-items activos
          if (expandedItems.includes(item.title)) {
            setExpandedItems(prev => prev.filter(title => title !== item.title));
          }
        }
      }
    });
  }, [currentPath]);

  // Simplificar efectos de montaje para mejor rendimiento
  useEffect(() => {
    // Renderizado inmediato sin delays
    setIsInitialMount(false);
  }, []);

  /**
   * 🔒 Detector de clics fuera del sidebar
   * Colapsa los menús expandidos cuando se hace clic fuera del sidebar
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Solo actuar si hay menús expandidos
      if (expandedItems.length === 0) return;
      
      // Verificar si el clic fue fuera del sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Colapsar todos los menús expandidos
        setExpandedItems([]);
      }
    };

    // Agregar listener solo si hay menús expandidos
    if (expandedItems.length > 0) {
      // Usar capture phase para detectar antes que otros eventos
      document.addEventListener('mousedown', handleClickOutside, true);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [expandedItems]);

  const isActive = (path: string) => {
    // Para rutas exactas de las páginas base expandibles
    if (path === '/settings' || path === '/reports') {
      return currentPath === path;
    }
    // Para otras rutas, usar coincidencia exacta o que empiece con la ruta
    return currentPath === path || (currentPath.startsWith(path) && path !== '/settings' && path !== '/reports');
  };

  const handleNavClick = (path: string) => {
    setActiveItem(path);
    // Usar navegación con transición en lugar de navegación regular
    navigateWithTransition(path);
    // Cerrar el menú móvil inmediatamente sin delay
    if (isMobile && state === "expanded") {
      setOpenMobile(false);
    }
  };

  /**
   * Función para precargar componente cuando el usuario hace hover
   */
  const handleLinkHover = async (path: string) => {
    // Solo precargar si la ruta existe en nuestro catálogo
    if (lazyRoutes[path as keyof typeof lazyRoutes]) {
      try {
        await preloadRoute(path, lazyRoutes[path as keyof typeof lazyRoutes]);
      } catch (error) {
        console.warn(`Error precargando ruta ${path}:`, error);
      }
    }
  };

  /**
   * Precarga automática de rutas de alta prioridad
   */
  useEffect(() => {
    const preloadHighPriorityRoutes = async () => {
      const highPriorityRoutes = Object.keys(lazyRoutes).filter(route => 
        getPreloadPriority(route) === 'high'
      );

      // Usar requestIdleCallback si está disponible, sino setTimeout
      const schedulePreload = (callback: () => void) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(callback);
        } else {
          setTimeout(callback, 100);
        }
      };

      schedulePreload(() => {
        highPriorityRoutes.forEach(async (route) => {
          if (route !== currentPath) { // No precargar la ruta actual
            await handleLinkHover(route);
          }
        });
      });
    };

    // Solo ejecutar después de que el componente esté completamente montado
    if (shouldRenderContent && !isInitialMount) {
      preloadHighPriorityRoutes();
    }
  }, [shouldRenderContent, isInitialMount, currentPath]);

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
    // Clases base adaptadas para móvil
    const baseClasses = cn(
      "flex items-center gap-3 px-4 py-3 w-full rounded-xl relative overflow-hidden group",
      isSubItem ? "ml-3 py-2 px-5" : "",
      isSubItem 
        ? (isMobileDevice ? "min-h-[44px]" : "min-h-[48px]") 
        : (isMobileDevice ? "min-h-[52px]" : "min-h-[56px]"),
      shouldRenderContent && !isInitialMount && 'transition-all duration-300 ease-out',
      isMobileDevice 
        ? "active:bg-sidebar-accent/30 active:scale-[0.98] touch-manipulation" 
        : "hover-lift click-effect"
    );
    
    // Solo marcar como activo si la ruta coincide exactamente
    if (path && isActive(path)) {
      return cn(baseClasses, "active-menu-item");
    }
    
    return cn(
      baseClasses,
      "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20",
      !isMobileDevice && "hover:shadow-md hover:border-l-4 hover:border-secondary"
    );
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      await logout();
      // El contexto de autenticación se encargará de la redirección
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Usar navigate en lugar de window.location
      navigate("/login", { replace: true });
    }
  };

  // Verificar si algún menú expandible está abierto
  const isConfigExpanded = isExpanded("Configuración");
  const isReportesExpanded = isExpanded("Reportes");
  const isAnyMenuExpanded = isConfigExpanded || isReportesExpanded;
  
  return (
    <div
      ref={sidebarRef}
      style={{
        // Cambiar el ancho dinámicamente según si algún menú está expandido
        '--sidebar-width': isAnyMenuExpanded ? '22rem' : '16rem',
        '--sidebar-width-mobile': isAnyMenuExpanded ? '24rem' : '18rem',
      } as React.CSSProperties}
      className="sidebar-dynamic-width h-screen"
    >
      <Sidebar
        className={cn(
          "bg-gradient-sidebar border-r border-sidebar-border shadow-lg flex flex-col h-full",
          shouldRenderContent && !isInitialMount && 'transition-all duration-300'
        )}
        collapsible="icon"
        variant="sidebar"
      >
      {isHidden && !isMobile ? (
        // Vista cuando el sidebar está oculto - SOLO EN DESKTOP
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
          <div className="text-center space-y-4 p-6">
            <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md mx-auto border border-white/20">
              <img 
                src="/mia-logo.svg" 
                alt="MIA Logo" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Sidebar Oculto</h3>
              <p className="text-white/70 text-sm mb-4">El menú lateral está oculto</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  toggleHidden();
                }}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40"
              >
                <PanelLeftOpen className="h-4 w-4 mr-2" />
                Mostrar Sidebar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
      {/* Header optimizado para móvil */}
      <SidebarHeader className={cn(
        "border-b border-sidebar-border/50",
        isMobileDevice ? "p-4" : "p-6"
      )}>
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Botón para ocultar sidebar - Más grande en móvil */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toggleHidden();
                // En móvil también cerrar el Sheet con animación suave
                if (isMobile) {
                  setOpenMobile(false);
                }
              }}
              className={cn(
                "rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200",
                isMobileDevice ? "p-3 h-10 w-10 active:bg-white/20 active:scale-95" : "p-2 h-8 w-8"
              )}
              title={isHidden ? "Mostrar sidebar" : "Ocultar sidebar"}
            >
              {isHidden ? (
                <PanelLeftOpen className={cn(isMobileDevice ? "h-5 w-5" : "h-4 w-4")} />
              ) : (
                <PanelLeftClose className={cn(isMobileDevice ? "h-5 w-5" : "h-4 w-4")} />
              )}
            </Button>
          </div>
          
          {/* Logo adaptivo para móvil */}
          <div className={cn(
            "bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 border border-white/20",
            isMobileDevice ? "w-16 h-16" : "w-20 h-20"
          )}>
            <Logo 
              size={isMobileDevice ? "md" : "lg"} 
              showText={false} 
              className={cn(isMobileDevice ? "w-12 h-12" : "w-16 h-16")} 
            />
          </div>
          {!isCollapsed && (
            <div className="text-center">
              <h2 className={cn(
                "text-white font-bold leading-tight",
                isMobileDevice ? "text-base" : "text-lg"
              )}>
                Sistema MIA
              </h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={cn(
        "flex flex-col h-full overflow-hidden",
        isMobileDevice ? "p-3" : "p-4"
      )}>
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
                        "rounded-xl",
                        shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                      )} 
                    >
                      {item.isExpandable && item.subItems ? (
                        // Menú expandible con sub-items
                        <Collapsible
                          open={openMobile ? true : isExpanded(item.title)}
                          onOpenChange={() => {
                            if (!openMobile) {
                              toggleExpanded(item.title)
                            }
                          }}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className={cn(
                                getNavCls(),
                                // No marcar como activo si estamos en rutas base expandibles (/settings o /reports)
                                (currentPath === '/settings' || currentPath === '/reports') && item.isExpandable ? 
                                  'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20' : ''
                              )}
                            >
                              <item.icon className={`
                                w-5 h-5 flex-shrink-0
                                ${shouldRenderContent && !isInitialMount ? 'transition-all duration-300 group-hover:scale-110' : ''}
                              `} />
                              {!isCollapsed && (
                                <>
                                  <div className={cn(
                                    "flex-1 min-w-0 sidebar-text-wrapper",
                                    shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                  )}>
                                    <span className={cn(
                                      "font-medium block truncate text-sm text-sidebar-foreground",
                                      shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                    )}>
                                      {item.title}
                                    </span>
                                    <p className={cn(
                                      "text-[10px] leading-3 opacity-90 truncate text-sidebar-foreground/80 sidebar-description",
                                      shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                    )}>
                                      {item.description}
                                    </p>
                                  </div>
                                  {isExpanded(item.title) ? (
                                    <ChevronDown className={cn(
                                      "w-4 h-4",
                                      shouldRenderContent && !isInitialMount && 'transition-transform duration-200'
                                    )} />
                                  ) : (
                                    <ChevronRight className={cn(
                                      "w-4 h-4", 
                                      shouldRenderContent && !isInitialMount && 'transition-transform duration-200'
                                    )} />
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
                                    {openMobile ? (
                                      // Sheet mobile: SidebarMenuSubButton con button
                                      <SidebarMenuSubButton
                                        onClick={(e) => {
                                          console.log('[SUBMENU BUTTON] Clicked!', { url: subItem.url, openMobile });
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setOpenMobile(false);
                                          setTimeout(() => navigate(subItem.url), 350);
                                        }}
                                      >
                                        <subItem.icon className="w-4 h-4" />
                                        <span>{subItem.title}</span>
                                      </SidebarMenuSubButton>
                                    ) : (
                                      // En desktop: usar NavLink normal
                                      <SidebarMenuSubButton asChild>
                                        <NavLink 
                                          to={subItem.url} 
                                          className={getNavCls(subItem.url, true)}
                                          title={isCollapsed ? subItem.title : undefined}
                                          onClick={() => handleNavClick(subItem.url)}
                                        onMouseEnter={() => handleLinkHover(subItem.url)}
                                      >
                                        <subItem.icon className={`
                                          w-4 h-4 flex-shrink-0
                                          ${shouldRenderContent && !isInitialMount ? 'transition-all duration-300' : ''}
                                          ${isActive(subItem.url) ? 'text-white' : (shouldRenderContent && !isInitialMount ? 'group-hover:scale-105' : '')}
                                        `} />
                                        <div className={cn(
                                          "flex-1 min-w-0 sidebar-text-wrapper",
                                          shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                        )}>
                                          <span className={cn(
                                            "font-medium block truncate text-sm text-sidebar-foreground",
                                            isActive(subItem.url) ? 'text-white font-semibold' : '',
                                            shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                          )}>
                                            {subItem.title}
                                          </span>
                                          <p className={cn(
                                            "text-[10px] leading-3 opacity-90 truncate sidebar-description",
                                            isActive(subItem.url) ? 'text-white/90' : 'text-sidebar-foreground/80',
                                            shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                          )}>
                                            {subItem.description}
                                          </p>
                                        </div>
                                        {isActive(subItem.url) && (
                                          <div className="absolute right-2 w-2 h-2 bg-secondary rounded-full" />
                                        )}
                                      </NavLink>
                                    </SidebarMenuSubButton>
                                    )}
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
                            onMouseEnter={() => handleLinkHover(item.url!)}
                          >
                            <item.icon className={`
                              w-5 h-5 flex-shrink-0
                              ${shouldRenderContent && !isInitialMount ? 'transition-all duration-300' : ''}
                              ${isActive(item.url!) ? 'text-white' : (shouldRenderContent && !isInitialMount ? 'group-hover:scale-105' : '')}
                            `} />
                            {!isCollapsed && (
                              <div className={cn(
                                "flex-1 min-w-0 sidebar-text-wrapper",
                                shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                              )}>
                                <span className={cn(
                                  "font-medium block truncate text-sm text-sidebar-foreground",
                                  isActive(item.url!) ? 'text-white font-semibold' : '',
                                  shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                )}>
                                  {item.title}
                                </span>
                                <p className={cn(
                                  "text-[10px] leading-3 opacity-90 truncate sidebar-description",
                                  isActive(item.url!) ? 'text-white/90' : 'text-sidebar-foreground/80',
                                  shouldRenderContent && !isInitialMount && 'transition-all duration-300'
                                )}>
                                  {item.description}
                                </p>
                              </div>
                            )}
                            {isActive(item.url!) && (
                              <div className="absolute right-2 w-2 h-2 bg-secondary rounded-full" />
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

        {/* User Profile Section - Fixed at bottom, optimizada para móvil */}
        <div className="flex-shrink-0 pt-4 border-t border-sidebar-border/50 mt-4">
          <div 
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-white/90 hover:bg-white mb-4 shadow-sm border border-gray-200/50 cursor-pointer",
              isMobileDevice 
                ? "p-3 active:bg-white/95 active:scale-[0.98] transition-all duration-150" 
                : "p-4 hover-lift card-enhanced transition-all duration-200",
              shouldRenderContent && !isInitialMount && 'transition-all duration-200'
            )}
            onClick={() => navigate('/profile')}
            title="Ver perfil"
          >
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="bg-gradient-hover text-white text-sm font-semibold shadow-md rounded-xl">
                {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-2xl h-11 bg-white/50 border border-gray-200/30",
                shouldRenderContent && !isInitialMount && 'hover-lift click-effect transition-all duration-300'
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Cerrar Sesión</span>
            </Button>
          )}
        </div>
      </SidebarContent>
      </>
      )}
    </Sidebar>
    </div>
  );
};

export default AppSidebar;