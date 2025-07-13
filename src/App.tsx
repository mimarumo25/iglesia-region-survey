import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/surveys" element={<Layout><div className="p-8"><h1 className="text-2xl font-bold">Encuestas</h1><p className="text-muted-foreground">Módulo en construcción</p></div></Layout>} />
          <Route path="/families" element={<Layout><div className="p-8"><h1 className="text-2xl font-bold">Familias</h1><p className="text-muted-foreground">Módulo en construcción</p></div></Layout>} />
          <Route path="/sectors" element={<Layout><div className="p-8"><h1 className="text-2xl font-bold">Sectores</h1><p className="text-muted-foreground">Módulo en construcción</p></div></Layout>} />
          <Route path="/reports" element={<Layout><div className="p-8"><h1 className="text-2xl font-bold">Reportes</h1><p className="text-muted-foreground">Módulo en construcción</p></div></Layout>} />
          <Route path="/users" element={<Layout><div className="p-8"><h1 className="text-2xl font-bold">Usuarios</h1><p className="text-muted-foreground">Módulo en construcción</p></div></Layout>} />
          <Route path="/settings" element={<Layout><div className="p-8"><h1 className="text-2xl font-bold">Configuración</h1><p className="text-muted-foreground">Módulo en construcción</p></div></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
