import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/AuthContext";
import { LoginCredentials } from "@/types/auth";
import { AuthService } from "@/services/auth";
import Logo from "@/components/ui/logo";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    recoveryEmail: ""
  });
  
  const { toast } = useToast();
  const { login, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si es modo desarrollo y si se hizo logout manual
  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
      const manualLogout = sessionStorage.getItem('manual_logout');
      if (manualLogout === 'true') {
        setShowDevLogin(true);
        toast({
          title: "Sesión cerrada",
          description: "Ha cerrado sesión correctamente. Click en 'Volver a Ingresar' para continuar.",
          variant: "default"
        });
      }
      // No redirigir automáticamente, dejar que el usuario elija
    }
  }, []); // Solo ejecutar una vez al montar el componente

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

  // Función especial para re-ingresar en modo desarrollo
  const handleDevLogin = () => {
    sessionStorage.removeItem('manual_logout');
    navigate('/dashboard', { replace: true });
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

    // Intentar login usando el contexto de autenticación
    const success = await login(formData);
    
    if (success) {
      // Redirigir a la página de origen o al dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    // El manejo de errores se hace automáticamente en el hook useAuth
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
    
    try {
      // Llamar al servicio real de recuperación
      const response = await AuthService.forgotPassword(forgotPasswordEmail);
      
      toast({
        title: "Recuperación de contraseña",
        description: response.message || `Se ha enviado un enlace de recuperación a ${forgotPasswordEmail}`,
      });
      
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al solicitar recuperación de contraseña",
        variant: "destructive"
      });
    } finally {
      setIsRecoveryLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 dark:from-background dark:via-background dark:to-muted/5 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[98%] 2xl:max-w-[96%] grid lg:grid-cols-2 gap-8 items-center">
        {/* Columna de imagen */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="relative group">
            <div className="w-[500px] h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-border/50 dark:border-border/30 hover-lift bg-gradient-to-br from-card to-background dark:from-card dark:to-background flex items-center justify-center">
              <img 
                src="/logo_mia.png" 
                alt="MIA - Sistema de Gestión Integral" 
                className="w-[400px] h-[400px] object-contain"
              />
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">MIA</h2>
            <p className="text-muted-foreground dark:text-muted-foreground text-lg">Sistema integral de gestión y seguimiento</p>
          </div>
        </div>

        {/* Columna del formulario */}
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo y título para móviles */}
          <div className="lg:hidden text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-card to-background dark:from-card dark:to-background rounded-2xl flex items-center justify-center shadow-lg border-2 border-border dark:border-border">
              <Logo iconOnly size="lg" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground dark:text-foreground mb-2">MIA</h1>
              <p className="text-muted-foreground dark:text-muted-foreground text-lg">Iniciar Sesión</p>
            </div>
          </div>

          {/* Formulario de login o recuperación */}
          <Card className="card-enhanced hover-lift click-effect rounded-3xl border-2 bg-card dark:bg-card border-border dark:border-border shadow-2xl dark:shadow-2xl dark:shadow-black/20">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="inline-block bg-primary/10 dark:bg-primary/20 rounded-2xl px-6 py-3 mb-4">
                <CardTitle className="text-3xl text-foreground dark:text-foreground">
                  {showDevLogin ? "Modo Desarrollo" : 
                   showForgotPassword ? "Recuperar Contraseña" : "Iniciar Sesión"}
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground dark:text-muted-foreground text-lg">
                {showDevLogin 
                  ? "Sesión cerrada correctamente en modo desarrollo"
                  : showForgotPassword 
                    ? "Ingrese su correo para recibir el enlace de recuperación"
                    : "Ingrese sus credenciales para acceder al sistema"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {showDevLogin ? (
                // Interfaz especial para modo desarrollo después del logout
                <div className="space-y-6">
                  <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                    <div className="w-5 h-5 text-green-600 bg-white rounded p-1 border border-green-200">
                      <Logo iconOnly size="sm" />
                    </div>
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      <strong>Logout exitoso:</strong> Ha cerrado sesión correctamente del sistema. 
                      En modo desarrollo puede volver a ingresar sin credenciales.
                    </AlertDescription>
                  </Alert>
                  
                  <Button
                    onClick={handleDevLogin}
                    className="w-full h-14 parish-button-primary text-lg font-semibold rounded-2xl"
                  >
                    <div className="w-5 h-5 mr-2 bg-white rounded p-1">
                      <Logo iconOnly size="sm" />
                    </div>
                    Volver a Ingresar (Modo Dev)
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Modo desarrollo activo: <code className="bg-secondary/50 px-2 py-1 rounded">VITE_SKIP_AUTH=true</code>
                    </p>
                  </div>
                </div>
              ) : showForgotPassword ? (
                // Formulario de recuperación de contraseña
                <form onSubmit={handleRecoverySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email" className="text-sm font-medium text-foreground dark:text-foreground">Correo Electrónico</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="correo@parroquia.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => handleRecoveryEmailChange(e.target.value)}
                        className={`pl-12 h-14 parish-input rounded-2xl text-lg bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground ${
                          errors.recoveryEmail ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                    </div>
                    {errors.recoveryEmail && (
                      <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500 dark:text-red-400">⚠</span>
                        {errors.recoveryEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-14 parish-button-primary text-lg font-semibold rounded-2xl"
                      disabled={isRecoveryLoading || !!errors.recoveryEmail || !forgotPasswordEmail}
                    >
                      {isRecoveryLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
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
                      className="w-full h-14 text-lg font-semibold rounded-2xl border-2"
                    >
                      Volver al Inicio de Sesión
                    </Button>
                  </div>
                </form>
              ) : (
                // Formulario de login normal
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground dark:text-foreground">Correo Electrónico</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@parroquia.com"
                        value={formData.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`pl-12 h-14 parish-input hover-lift transition-all duration-300 focus:scale-[1.02] rounded-2xl text-lg bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground ${
                          errors.email ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500 dark:text-red-400">⚠</span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground dark:text-foreground">Contraseña</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground dark:text-muted-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={`pl-12 pr-14 h-14 parish-input hover-lift transition-all duration-300 focus:scale-[1.02] rounded-2xl text-lg bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground ${
                          errors.password ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20 dark:focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 h-6 w-6 text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-all duration-300 hover:scale-110 click-effect"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500 dark:text-red-400">⚠</span>
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

              {!showForgotPassword && !showDevLogin && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary dark:text-primary hover:text-primary-hover dark:hover:text-primary-hover transition-all duration-300 underline hover:scale-105 click-effect font-medium rounded-xl px-4 py-2"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <div className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
            <div className="p-6 rounded-2xl bg-card/50 dark:bg-card/50 border border-border/50 dark:border-border/30 hover-lift transition-all duration-300">
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
