import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Church, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de login - remover en implementación real
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Bienvenido",
      description: "Acceso autorizado al sistema parroquial.",
      variant: "default"
    });
    
    // Aquí iría la lógica de autenticación real
    window.location.href = "/dashboard";
    
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    toast({
      title: "Recuperación de contraseña",
      description: "Se ha enviado un enlace de recuperación a su correo electrónico.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-animated flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center animate-bounce-in">
        {/* Columna de imagen */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6 animate-slide-in-left">
          <div className="relative group">
            <div className="w-96 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 hover-lift">
              <img 
                src="https://images.unsplash.com/photo-1520637836862-4d197d17c13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Iglesia parroquial" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary rounded-full flex items-center justify-center shadow-xl animate-float">
              <Church className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-foreground mb-2">Gestión Parroquial</h2>
            <p className="text-muted-foreground text-lg">Sistema integral para la caracterización y seguimiento de las comunidades católicas</p>
          </div>
        </div>

        {/* Columna del formulario */}
        <div className="w-full max-w-md mx-auto space-y-8 animate-slide-in-right">
          {/* Logo y título para móviles */}
          <div className="lg:hidden text-center space-y-4 animate-slide-in-left">
            <div className="mx-auto w-20 h-20 bg-gradient-animated rounded-full flex items-center justify-center shadow-glow hover-lift animate-float">
              <Church className="w-10 h-10 text-white" />
            </div>
            <div className="animate-slide-in-right">
              <h1 className="text-4xl font-bold text-foreground mb-2">Sistema Parroquial</h1>
              <p className="text-muted-foreground text-lg">Caracterización Poblacional</p>
            </div>
          </div>

          {/* Formulario de login */}
          <Card className="card-enhanced hover-lift click-effect animate-bounce-in rounded-3xl border-2">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-3xl text-primary animate-pulse-glow">Iniciar Sesión</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Ingrese sus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 animate-slide-in-left">
                  <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@parroquia.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-14 parish-input hover-lift transition-all duration-300 focus:scale-[1.02] rounded-2xl text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-slide-in-right">
                  <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-12 pr-14 h-14 parish-input hover-lift transition-all duration-300 focus:scale-[1.02] rounded-2xl text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 h-6 w-6 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 click-effect"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 parish-button-primary hover-lift click-effect animate-bounce-in text-lg font-semibold transition-all duration-300 rounded-2xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center animate-slide-in-left">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary-hover transition-all duration-300 underline hover:scale-105 click-effect font-medium rounded-xl px-4 py-2"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <div className="text-center text-sm text-muted-foreground animate-slide-in-right">
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover-lift transition-all duration-300">
              <p className="font-medium">¿Necesita ayuda?</p>
              <p className="mt-1">Contacte al administrador del sistema</p>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float opacity-60" />
      <div className="fixed bottom-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-float opacity-40" />
      <div className="fixed top-1/2 right-10 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-float opacity-50" />
    </div>
  );
};

export default Login;
