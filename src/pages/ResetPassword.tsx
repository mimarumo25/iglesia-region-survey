import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Church, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/services/auth";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    token: ""
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Verificar si hay token en la URL
    if (!token) {
      setErrors(prev => ({
        ...prev,
        token: "Token de recuperación inválido o faltante"
      }));
      toast({
        title: "Error",
        description: "Enlace de recuperación inválido",
        variant: "destructive"
      });
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [token, navigate, toast]);

  // Función de validación de contraseña
  const validatePassword = (password: string): string => {
    if (!password) return "La nueva contraseña es requerida";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (!/(?=.*[a-z])/.test(password)) return "Debe contener al menos una letra minúscula";
    if (!/(?=.*[A-Z])/.test(password)) return "Debe contener al menos una letra mayúscula";
    if (!/(?=.*\d)/.test(password)) return "Debe contener al menos un número";
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) return "Debe contener al menos un carácter especial";
    return "";
  };

  // Función de validación de confirmación de contraseña
  const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) return "La confirmación de contraseña es requerida";
    if (confirmPassword !== password) return "Las contraseñas no coinciden";
    return "";
  };

  // Validación en tiempo real
  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, newPassword: password }));
    if (errors.newPassword) {
      setErrors(prev => ({ ...prev, newPassword: validatePassword(password) }));
    }
    // Revalidar confirmación si ya hay algo escrito
    if (formData.confirmPassword) {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: validateConfirmPassword(formData.confirmPassword, password) 
      }));
    }
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setFormData(prev => ({ ...prev, confirmPassword }));
    if (errors.confirmPassword) {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: validateConfirmPassword(confirmPassword, formData.newPassword) 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const passwordError = validatePassword(formData.newPassword);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);
    
    setErrors(prev => ({
      ...prev,
      newPassword: passwordError,
      confirmPassword: confirmPasswordError
    }));

    // Si hay errores, no continuar
    if (passwordError || confirmPasswordError || !token) {
      toast({
        title: "Error de validación",
        description: "Por favor corrija los errores en el formulario",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Llamar al servicio de restablecimiento
      const response = await AuthService.resetPassword(token, formData.newPassword);
      
      toast({
        title: "Contraseña restablecida",
        description: response.message || "Su contraseña ha sido restablecida exitosamente",
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al restablecer la contraseña",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                className="w-full h-full object-cover"
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
              <p className="text-muted-foreground text-lg">Restablecer Contraseña</p>
            </div>
          </div>

          {/* Formulario de restablecimiento */}
          <Card className="card-enhanced hover-lift click-effect rounded-3xl border-2">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="inline-block bg-primary/10 rounded-2xl px-6 py-3 mb-4">
                <CardTitle className="text-3xl text-foreground">
                  Restablecer Contraseña
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-lg">
                Ingrese su nueva contraseña
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {errors.token ? (
                <div className="text-center space-y-4">
                  <p className="text-red-500">{errors.token}</p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="w-full h-14 parish-button-primary rounded-2xl"
                  >
                    Volver al Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">Nueva Contraseña</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={`pl-12 pr-14 h-14 parish-input rounded-2xl text-lg ${
                          errors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 h-6 w-6 text-muted-foreground hover:text-primary"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500">⚠</span>
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Contraseña</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        className={`pl-12 pr-14 h-14 parish-input rounded-2xl text-lg ${
                          errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-4 h-6 w-6 text-muted-foreground hover:text-primary"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <span className="w-4 h-4 text-red-500">⚠</span>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full h-14 parish-button-primary text-lg font-semibold rounded-2xl"
                      disabled={
                        isLoading || 
                        !!errors.newPassword || 
                        !!errors.confirmPassword || 
                        !formData.newPassword || 
                        !formData.confirmPassword
                      }
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                          <span>Restableciendo...</span>
                        </div>
                      ) : (
                        "Restablecer Contraseña"
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => navigate('/login')}
                      variant="outline"
                      className="w-full h-14 text-lg font-semibold rounded-2xl border-2"
                    >
                      Volver al Login
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Información de seguridad */}
          <div className="text-center text-sm text-muted-foreground">
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
              <p className="font-medium">Requisitos de contraseña:</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Al menos 6 caracteres</li>
                <li>• Una letra mayúscula y una minúscula</li>
                <li>• Al menos un número</li>
                <li>• Al menos un carácter especial</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
