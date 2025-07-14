import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-14 lg:h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
              {/* Mobile/Desktop Menu Toggle */}
              <SidebarTrigger className="flex-shrink-0 text-foreground hover:bg-muted p-2 rounded-lg transition-all duration-200 hover:scale-105">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              
              {/* Search Bar */}
              <div className="relative hidden sm:block flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar familias, sectores..."
                  className="pl-10 parish-input text-sm"
                />
              </div>
              
              {/* Mobile Title */}
              <div className="sm:hidden flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  Sistema Parroquial
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-destructive rounded-full flex items-center justify-center">
                  <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-white rounded-full" />
                </span>
              </Button>

              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 bg-gradient-subtle overflow-auto">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;