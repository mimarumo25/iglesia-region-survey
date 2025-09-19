import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Bell, Search, Star, Menu, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserMenuWorking } from "@/components/auth/UserMenuWorking";
import { WorkingSearch } from "@/components/ui/working-search";
import { RouteSuspenseWrapper } from "@/components/ui/RouteSuspenseWrapper";

interface LayoutProps {
  children: React.ReactNode;
}

// Componente para el menú hamburguesa proporcional en el header
const CornerHamburgerMenu = () => {
  const { isHidden, toggleHidden, isMobile } = useSidebar();
  
  // Solo mostrar en desktop cuando el sidebar esté oculto
  // Agregamos hidden md:block para asegurar que se oculte en móvil
  if (isMobile || !isHidden) {
    return null;
  }

  return (
    <div className="hidden md:block fixed top-2 left-4 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleHidden}
        className={cn(
          "relative w-12 h-12 p-0 rounded-xl group",
          // Efecto glassmorphism adaptativo para modo claro y oscuro
          "bg-background/20 hover:bg-background/30 dark:bg-white/8 dark:hover:bg-white/15",
          "backdrop-blur-md",
          "border border-border/30 hover:border-border/50 dark:border-white/15 dark:hover:border-white/25",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300 ease-out",
          "hover:scale-105 active:scale-95",
          "flex flex-col items-center justify-center gap-1",
        )}
        aria-label="Mostrar sidebar"
      >
        {/* Icono hamburguesa adaptativo para modo claro/oscuro */}
        <span className="block w-6 h-0.5 bg-foreground/70 group-hover:bg-foreground/90 dark:bg-white/70 dark:group-hover:bg-white/90 rounded-full transition-all duration-200" />
        <span className="block w-6 h-0.5 bg-foreground/70 group-hover:bg-foreground/90 dark:bg-white/70 dark:group-hover:bg-white/90 rounded-full transition-all duration-200" />
        <span className="block w-6 h-0.5 bg-foreground/70 group-hover:bg-foreground/90 dark:bg-white/70 dark:group-hover:bg-white/90 rounded-full transition-all duration-200" />
        
        {/* Sutil anillo de foco adaptativo */}
        <div className="absolute inset-0 rounded-xl border border-border/20 dark:border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </Button>
    </div>
  );
};

// Componente para el botón hamburguesa optimizado (solo para header móvil)
const AnimatedMenuButton = () => {
  const { openMobile, toggleSidebar, isMobile, isHidden } = useSidebar();
  
  // En móvil, usar la lógica original
  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className={cn(
          "relative w-12 h-12 p-0 rounded-xl hover:bg-primary/10 group",
          "flex flex-col items-center justify-center gap-1"
        )}
        aria-label={openMobile ? "Cerrar menú" : "Abrir menú"}
      >
        <span
          className={cn(
            "block w-6 h-0.5 bg-current rounded-full transition-transform duration-200",
            openMobile ? "rotate-45 translate-y-2" : ""
          )}
        />
        <span
          className={cn(
            "block w-6 h-0.5 bg-current rounded-full transition-opacity duration-200",
            openMobile ? "opacity-0" : ""
          )}
        />
        <span
          className={cn(
            "block w-6 h-0.5 bg-current rounded-full transition-transform duration-200",
            openMobile ? "-rotate-45 -translate-y-2" : ""
          )}
        />
      </Button>
    );
  }

  // En desktop, cuando el sidebar está oculto, no mostrar nada aquí
  // porque usamos el CornerHamburgerMenu
  return null;
};

// Componente interno que puede usar useSidebar
const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isHidden, isMobile } = useSidebar();
  
  return (
    <div className="h-screen flex w-full bg-gradient-subtle relative overflow-hidden">
      {/* Menú hamburguesa transparente en la esquina para desktop */}
      <CornerHamburgerMenu />
      
      {/* Sidebar fijo con altura completa - Solo renderizar si no está oculto */}
      {(!isHidden || isMobile) && (
        <div className="flex-shrink-0">
          <AppSidebar />
        </div>
      )}
      
      {/* Contenido principal con scroll independiente */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 relative z-10 h-full",
        // Si el sidebar está oculto en desktop, usar todo el ancho
        isHidden && !isMobile && "w-full"
      )}>
        {/* Top Header - Fijo */}
        <header className="flex-shrink-0 h-16 lg:h-18 bg-gradient-to-r from-card via-card/95 to-card/90 border-b border-border/50 flex items-center justify-center px-4 lg:px-6 shadow-lg backdrop-blur-sm z-50">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            {/* Mobile/Desktop Menu Toggle mejorado */}
            <div className="flex-shrink-0">
              <AnimatedMenuButton />
            </div>
            
            {/* Search Bar - Centrado en la pantalla */}
            <div className="flex-1 flex justify-center px-4">
              <WorkingSearch
                className="w-full max-w-lg"
                placeholder="Buscar en el sistema..."
              />
            </div>
            
            {/* Mobile Title - solo visible en mobile */}
            <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                MIA
              </h1>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0" style={{ pointerEvents: 'auto' }}>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 hover-scale click-effect rounded-xl group"
                style={{ pointerEvents: 'auto' }}
              >
                <Bell className="w-5 h-5 lg:w-5 lg:h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-gradient-to-r from-destructive to-destructive/80 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full" />
                </span>
              </Button>

              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden p-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 hover-scale click-effect rounded-xl"
                style={{ pointerEvents: 'auto' }}
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* User Menu - Versión funcional */}
              <div className="flex items-center ml-2" style={{ pointerEvents: 'auto' }}>
                <UserMenuWorking />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background/98 to-muted/30 main-content-scroll">
          <div className="p-6 lg:p-8">
            <div className="max-w-full">
              <RouteSuspenseWrapper>
                {children}
              </RouteSuspenseWrapper>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default Layout;