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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    recoveryEmail: ""
  });
  const { toast } = useToast();

  // Función de validación de email
  const validateEmail = (email: string): string => {
    if (!email) return "El correo electrónico es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Ingrese un correo electrónico válido";
    return "";
  };

  // Función de validación de contraseña
  const validatePassword = (password: string): string => {
    if (!password) return "La contraseña es requerida";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  // Validación en tiempo real
  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    }
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleRecoveryEmailChange = (email: string) => {
    setForgotPasswordEmail(email);
    if (errors.recoveryEmail) {
      setErrors(prev => ({ ...prev, recoveryEmail: validateEmail(email) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError,
      recoveryEmail: ""
    });

    // Si hay errores, no continuar
    if (emailError || passwordError) {
      toast({
        title: "Error de validación",
        description: "Por favor corrija los errores en el formulario",
        variant: "destructive"
      });
      return;
    }

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
    setShowForgotPassword(true);
    setErrors({
      email: "",
      password: "",
      recoveryEmail: ""
    });
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar email de recuperación
    const emailError = validateEmail(forgotPasswordEmail);
    
    setErrors(prev => ({
      ...prev,
      recoveryEmail: emailError
    }));

    // Si hay errores, no continuar
    if (emailError) {
      toast({
        title: "Error de validación",
        description: "Por favor ingrese un correo electrónico válido",
        variant: "destructive"
      });
      return;
    }

    setIsRecoveryLoading(true);
    
    // Simulación de recuperación - remover en implementación real
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Recuperación de contraseña",
      description: `Se ha enviado un enlace de recuperación a ${forgotPasswordEmail}`,
    });
    
    setIsRecoveryLoading(false);
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setErrors({
      email: "",
      password: "",
      recoveryEmail: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Columna de imagen */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="relative group">
            <div className="w-[500px] h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 hover-lift">
              <img 
                src="https://images.unsplash.com/photo-1520637836862-4d197d17c13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Iglesia parroquial" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary rounded-full flex items-center justify-center shadow-xl">
              <Church className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-foreground mb-2">Gestión Parroquial</h2>
            <p className="text-muted-foreground text-lg">Sistema integral para la caracterización y seguimiento de las comunidades católicas</p>
          </div>
        </div>

        {/* Columna del formulario */}
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo y título para móviles */}
          <div className="lg:hidden text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Church className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Sistema Parroquial</h1>
              <p className="text-muted-foreground text-lg">Caracterización Poblacional</p>
            </div>
          </div>

          {/* Formulario de login o recuperación */}
          <Card className="card-enhanced hover-lift click-effect rounded-3xl border-2">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="inline-block bg-primary/10 rounded-2xl px-6 py-3 mb-4">
                <CardTitle className="text-3xl text-primary">
                  {showForgotPassword ? "Recuperar Contraseña" : "Iniciar Sesión"}
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-lg">
                {showForgotPassword 
                  ? "Ingrese su correo para recibir el enlace de recuperación"
                  : "Ingrese sus credenciales para acceder al sistema"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {showForgotPassword ? (
                // Formulario de recuperación de contraseña
                <form onSubmit={handleRecoverySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email" className="text-sm font-medium">Correo Electrónico</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="correo@parroquia.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => handleRecoveryEmailChange(e.target.value)}
                        className={`pl-12 h-14 parish-input hover-lift transition-all duration-300 focus:scale-[1.02] rounded-2xl text-lg ${
                          errors.recoveryEmail ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                    </div>
                    {errors.recoveryEmail && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500">⚠</span>
                        {errors.recoveryEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-14 parish-button-primary hover-lift click-effect text-lg font-semibold transition-all duration-300 rounded-2xl"
                      disabled={isRecoveryLoading || !!errors.recoveryEmail || !forgotPasswordEmail}
                    >
                      {isRecoveryLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        "Enviar Enlace de Recuperación"
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleBackToLogin}
                      variant="outline"
                      className="w-full h-14 text-lg font-semibold transition-all duration-300 rounded-2xl border-2"
                    >
                      Volver al Inicio de Sesión
                    </Button>
                  </div>
                </form>
              ) : (
                // Formulario de login normal
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@parroquia.com"
                        value={formData.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`pl-12 h-14 parish-input hover-lift transition-all duration-300 focus:scale-[1.02] rounded-2xl text-lg ${
                          errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500">⚠</span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={`pl-12 pr-14 h-14 parish-input hover-lift transition-all duration-300 focus:scale-[1.02] rounded-2xl text-lg ${
                          errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
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
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500">⚠</span>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 parish-button-primary hover-lift click-effect text-lg font-semibold transition-all duration-300 rounded-2xl"
                    disabled={isLoading || !!errors.email || !!errors.password || !formData.email || !formData.password}
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
              )}

              {!showForgotPassword && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:text-primary-hover transition-all duration-300 underline hover:scale-105 click-effect font-medium rounded-xl px-4 py-2"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <div className="text-center text-sm text-muted-foreground">
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 hover-lift transition-all duration-300">
              <p className="font-medium">¿Necesita ayuda?</p>
              <p className="mt-1">Contacte al administrador del sistema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
