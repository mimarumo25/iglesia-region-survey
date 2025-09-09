import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/AuthContext";
import { User } from "@/types/auth";
import { Loader2, User as UserIcon, AlertCircle, CheckCircle } from "lucide-react";

const ProfileSimplePage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-gradient-subtle min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
        <UserIcon className="w-8 h-8" /> Mi Perfil
      </h1>

      {/* Panel de estado de autenticación */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Estado de Autenticación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="font-semibold">Autenticado:</span>
              {isAuthenticated ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Sí
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> No
                </span>
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Usuario disponible:</span>
              {user ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Sí
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> No
                </span>
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Modo desarrollo:</span>
              {import.meta.env.DEV ? (
                <span className="text-blue-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Activo
                </span>
              ) : (
                <span className="text-gray-600">Inactivo</span>
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Skip Auth:</span>
              {import.meta.env.VITE_SKIP_AUTH === 'true' ? (
                <span className="text-orange-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Habilitado
                </span>
              ) : (
                <span className="text-gray-600">Deshabilitado</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Información del usuario */}
      {user ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage 
                  src={user.profilePictureUrl || "/placeholder-avatar.png"} 
                  alt="Avatar" 
                />
                <AvatarFallback className="text-lg">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  Rol: {user.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de Usuario
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                  {user.id}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">
                  {user.firstName} {user.secondName} {user.lastName} {user.secondLastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">
                  {user.phone || 'No disponible'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">
                  {user.active ? 'Activo' : 'Inactivo'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Verificado
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">
                  {user.emailVerified ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Sin Datos de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              No se pudieron cargar los datos del usuario. Esto puede deberse a:
            </p>
            <ul className="mt-2 text-red-700 list-disc list-inside space-y-1">
              <li>Sesión expirada</li>
              <li>Problemas de conectividad</li>
              <li>Error en el contexto de autenticación</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Información de debug solo en desarrollo */}
      {import.meta.env.DEV && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">
              🔧 Información de Debug
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-yellow-800">Variables de Entorno:</h4>
                <pre className="text-xs bg-yellow-100 p-2 rounded mt-1 overflow-x-auto">
{`VITE_BASE_URL_SERVICES: ${import.meta.env.VITE_BASE_URL_SERVICES}
VITE_SKIP_AUTH: ${import.meta.env.VITE_SKIP_AUTH}
DEV: ${import.meta.env.DEV}
MODE: ${import.meta.env.MODE}`}
                </pre>
              </div>
              
              {user && (
                <div>
                  <h4 className="font-semibold text-yellow-800">Datos del Usuario (JSON):</h4>
                  <pre className="text-xs bg-yellow-100 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSimplePage;
