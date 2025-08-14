import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { PrivateRoute, PublicRoute } from "@/components/auth/PrivateRoute";
import Layout from "@/components/Layout";
import { Loader2 } from "lucide-react";
import { useGlobalTypography } from "@/hooks/useTypography";

// Lazy-loaded page components
const Login = React.lazy(() => import("./pages/Login"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Surveys = React.lazy(() => import("./pages/Surveys"));
const Families = React.lazy(() => import("./pages/Families"));
const Sectors = React.lazy(() => import("./pages/Sectors"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Users = React.lazy(() => import("./pages/Users"));
const SettingsWrapper = React.lazy(() => import("./pages/SettingsWrapper"));
const Parroquias = React.lazy(() => import("./pages/Parroquias"));
const EnfermedadesPage = React.lazy(() => import("./pages/Enfermedades"));
const SurveyForm = React.lazy(() => import("@/components/SurveyForm"));
const NewSurveyWithHierarchy = React.lazy(() => import("./pages/NewSurveyWithHierarchy"));
const TestHierarchicalForm = React.lazy(() => import("./pages/TestHierarchicalForm"));
const TestServices = React.lazy(() => import("./pages/TestServices"));
const DemoPage = React.lazy(() => import("./pages/DemoPage"));
const Profile = React.lazy(() => import("./pages/Profile"));
const TallasPage = React.lazy(() => import("./pages/Tallas"));
// const NoPermissions = React.lazy(() => import("@/components/ui/no-permissions"));

const queryClient = new QueryClient();

/**
 * Componente wrapper para inicializar la tipografía global
 */
const AppWithTypography = ({ children }: { children: React.ReactNode }) => {
  // Inicializar tipografía global
  useGlobalTypography();
  
  return <>{children}</>;
};

/**
 * Componente principal de la aplicación
 * Configura el contexto de autenticación, routing y proveedores globales
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AppWithTypography>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Cargando aplicación...</span>
              </div>
            }>
              <Routes>
                {/* Ruta raíz - redirigir al dashboard */}
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <Navigate to="/dashboard" replace />
                    </PrivateRoute>
                  } 
                />
                
                {/* Rutas públicas - solo accesibles para usuarios no autenticados */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                
                {/* Ruta pública para reset password */}
                <Route 
                  path="/reset-password" 
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  } 
                />
                
                {/* Ruta pública para verificación de email */}
                <Route 
                  path="/verify-email" 
                  element={
                    <PublicRoute>
                      <VerifyEmail />
                    </PublicRoute>
                  } 
                />
                
                {/* Rutas protegidas - requieren autenticación */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/survey" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <SurveyForm />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/surveys" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Surveys />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/survey/new-hierarchy" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <NewSurveyWithHierarchy />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/test-hierarchy" 
                  element={
                    <PrivateRoute>
                      <TestHierarchicalForm />
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/test-services" 
                  element={
                    <PrivateRoute>
                      <TestServices />
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/demo" 
                  element={
                    <DemoPage />
                  } 
                />
                
                <Route 
                  path="/families" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Families />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/sectors" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Sectors />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/reports" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Reports />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                
                {/* Rutas con permisos específicos - Usuarios (solo admins) */}
                <Route 
                  path="/users" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <Users />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                {/* Ruta específica para crear nuevo usuario */}
                <Route 
                  path="/users/new" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <Users />
                        {/* TODO: Implementar modo create */}
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                {/* Ruta de perfil del usuario */}
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/settings" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                {/* Rutas específicas para sub-configuraciones */}
                <Route 
                  path="/settings/parroquias" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/sectors" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/enfermedades" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/veredas" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/municipios" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/aguas-residuales" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/tipos-vivienda" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/parentescos" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/estados-civiles" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/disposicion-basura" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/sexos" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/comunidades-culturales" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/estudios" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/situaciones-civiles" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/departamentos" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/profesiones" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/sectores-config" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/settings/tallas" 
                  element={
                    <PrivateRoute requiredRole={["admin"]}>
                      <Layout>
                        <SettingsWrapper />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                {/* Ruta específica para parroquias (opcional, ahora redirige a settings/parroquias) */}
                <Route 
                  path="/parroquias" 
                  element={<Navigate to="/settings/parroquias" replace />} 
                />

                {/* Ruta específica para veredas (opcional, ahora redirige a settings/veredas) */}
                <Route 
                  path="/veredas" 
                  element={<Navigate to="/settings/veredas" replace />} 
                />

                {/* Ruta temporal de prueba para enfermedades */}
                <Route 
                  path="/test-enfermedades" 
                  element={<EnfermedadesPage />} 
                />
                
                {/* Página de no autorizado */}
                <Route 
                  path="/unauthorized" 
                  element={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
                        <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
                      </div>
                    </div>
                  } 
                />
                
                {/* Ruta catch-all para páginas no encontradas */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </AppWithTypography>
    </ThemeProvider>
  </TooltipProvider>
</QueryClientProvider>
);
export default App;