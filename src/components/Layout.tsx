import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Bell, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";
import { WorkingSearch } from "@/components/ui/working-search";
import { RouteSuspenseWrapper } from "@/components/ui/RouteSuspenseWrapper";

interface LayoutProps {
  children: React.ReactNode;
}

// Componente para el botón hamburguesa animado
const AnimatedMenuButton = () => {
  const { openMobile, toggleSidebar, isMobile } = useSidebar();
  
  // Solo mostrar en móvil
  if (!isMobile) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className={cn(
        "relative w-12 h-12 p-0 rounded-xl transition-all duration-300 hover:bg-primary/10 group",
        "flex flex-col items-center justify-center gap-1",
        "hover-scale click-effect"
      )}
      aria-label={openMobile ? "Cerrar menú" : "Abrir menú"}
    >
      <span
        className={cn(
          "block w-6 h-0.5 bg-current transition-all duration-300 ease-out rounded-full",
          openMobile ? "rotate-45 translate-y-2" : ""
        )}
      />
      <span
        className={cn(
          "block w-6 h-0.5 bg-current transition-all duration-300 ease-out rounded-full",
          openMobile ? "opacity-0" : ""
        )}
      />
      <span
        className={cn(
          "block w-6 h-0.5 bg-current transition-all duration-300 ease-out rounded-full",
          openMobile ? "-rotate-45 -translate-y-2" : ""
        )}
      />
    </Button>
  );
};

// Componente interno que puede usar useSidebar
const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex w-full bg-gradient-subtle relative overflow-hidden">
      {/* Sidebar fijo con altura completa */}
      <div className="flex-shrink-0">
        <AppSidebar />
      </div>
      
      {/* Contenido principal con scroll independiente */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
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
            <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 hover-scale click-effect rounded-xl group"
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
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* User Menu */}
              <UserMenu />
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