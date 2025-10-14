import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Logo from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/services/auth";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmailToken = async () => {
      // Verificar si hay token en la URL
      if (!token) {
        setError("Token de verificación inválido o faltante");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Enlace de verificación inválido",
          variant: "destructive"
        });
        return;
      }

      try {
        // Llamar al servicio de verificación
        const response = await AuthService.verifyEmail(token);
        
        if (response.status === 'success') {
          setIsSuccess(true);
          setMessage(response.message || "Su email ha sido verificado exitosamente");
          
          toast({
            title: "Verificación exitosa",
            description: response.message || "Su email ha sido verificado correctamente",
          });
          
          // Iniciar countdown para redirección
          startCountdown();
        } else {
          setError(response.message || "Error al verificar el email");
          toast({
            title: "Error de verificación",
            description: response.message || "No se pudo verificar el email",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        setError(error.message || "Error al verificar el email");
        toast({
          title: "Error",
          description: error.message || "Error al verificar el email",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmailToken();
  }, [token, toast]);

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/login', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[98%] 2xl:max-w-[96%] grid lg:grid-cols-2 gap-8 items-center">
        {/* Columna de imagen */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="relative group">
            <div className="w-[500px] h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1520637836862-4d197d17c13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Iglesia parroquial" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl">
              <Logo size="md" showText={false} className="w-12 h-12" />
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold text-foreground mb-2">MIA</h2>
            <p className="text-muted-foreground text-lg">Sistema integral de gestión y seguimiento</p>
          </div>
        </div>

        {/* Columna del contenido */}
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo y título para móviles */}
          <div className="lg:hidden text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Logo size="md" showText={false} className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">MIA</h1>
              <p className="text-muted-foreground text-lg">Verificación de Email</p>
            </div>
          </div>

          {/* Card de verificación */}
          <Card className="card-enhanced hover-lift click-effect rounded-3xl border-2">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="inline-block bg-primary/10 rounded-2xl px-6 py-3 mb-4">
                <CardTitle className="text-3xl text-foreground">
                  Verificación de Email
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-lg">
                {isLoading 
                  ? "Verificando su dirección de correo electrónico..."
                  : isSuccess 
                    ? "Su email ha sido verificado exitosamente"
                    : "Hubo un problema con la verificación"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-center space-y-6">
                {/* Icono de estado */}
                <div className="flex justify-center">
                  {isLoading ? (
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-blue-600" />
                    </div>
                  ) : isSuccess ? (
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                  )}
                </div>

                {/* Mensaje */}
                <div className="space-y-2">
                  {isLoading ? (
                    <div>
                      <p className="text-lg font-medium text-muted-foreground">
                        Procesando verificación...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Por favor espere mientras verificamos su email
                      </p>
                    </div>
                  ) : isSuccess ? (
                    <div>
                      <p className="text-lg font-medium text-green-700">
                        ¡Verificación Exitosa!
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {message}
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700 font-medium">
                          Redirigiendo al login en {countdown} segundos...
                        </p>
                        <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium text-red-700">
                        Error de Verificación
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {error}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                {!isLoading && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleGoToLogin}
                      className="w-full h-14 parish-button-primary text-lg font-semibold rounded-2xl"
                    >
                      {isSuccess ? "Ir al Login" : "Volver al Login"}
                    </Button>

                    {!isSuccess && (
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="w-full h-14 text-lg font-semibold rounded-2xl border-2"
                      >
                        Intentar Nuevamente
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="text-center text-sm text-muted-foreground">
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
              <p className="font-medium">¿Necesita ayuda?</p>
              <p className="mt-1">Contacte al administrador del sistema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
