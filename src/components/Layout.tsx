import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Bell, Search, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
    <div className="min-h-screen flex w-full bg-gradient-subtle relative">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header className="h-16 lg:h-18 bg-gradient-to-r from-card via-card/95 to-card/90 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 shadow-lg backdrop-blur-sm sticky top-0 z-50 animate-slide-in-left">
          <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
            {/* Mobile/Desktop Menu Toggle mejorado */}
            <div className="flex-shrink-0">
              <AnimatedMenuButton />
            </div>
            
            {/* Search Bar */}
            <div className="relative hidden sm:block flex-1 max-w-md animate-slide-in-right">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors duration-300" />
              <Input
                placeholder="Buscar familias, sectores..."
                className="pl-12 pr-4 py-3 parish-input text-sm rounded-xl border-border/30 bg-background/80 backdrop-blur-sm hover:border-primary/30 focus:border-primary transition-all duration-300 hover-lift"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-muted-foreground/50" />
              </div>
            </div>
            
            {/* Mobile Title */}
            <div className="sm:hidden flex-1 min-w-0 animate-bounce-in">
              <h1 className="text-lg font-semibold text-foreground truncate flex items-center gap-2">
                <Star className="w-5 h-5 text-primary animate-pulse-glow" />
                Sistema Parroquial
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0 animate-slide-in-right">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-3 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 hover-scale click-effect rounded-xl group"
            >
              <Bell className="w-5 h-5 lg:w-5 lg:h-5 group-hover:animate-shake" />
              <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-gradient-to-r from-destructive to-destructive/80 rounded-full flex items-center justify-center animate-pulse-glow">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse" />
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
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-background via-background/98 to-muted/30 overflow-auto">
          <div className="max-w-full animate-bounce-in">
            {children}
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