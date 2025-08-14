import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Home, Contact } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NoPermissionsProps {
  title?: string;
  description?: string;
  action?: string;
  contactAdmin?: boolean;
}

export const NoPermissions = ({ 
  title = "Acceso Denegado",
  description = "No tiene permisos para ver esta sección. Esta funcionalidad requiere permisos especiales de administrador.",
  action = "gestión de usuarios",
  contactAdmin = true
}: NoPermissionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="border-2 border-red-200 bg-red-50/50">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">{title}</h1>
            <p className="text-red-700 leading-relaxed mb-4">
              {description}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-red-200 p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-amber-800 mb-1">
                  Permisos Requeridos
                </h3>
                <p className="text-sm text-amber-700">
                  Para acceder a la {action}, necesita tener rol de <strong>Administrador</strong> o <strong>Coordinador</strong>.
                </p>
              </div>
            </div>
          </div>

          {contactAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Contact className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    ¿Necesita Acceso?
                  </h3>
                  <p className="text-sm text-blue-700">
                    Si cree que debería tener acceso a esta funcionalidad, contacte a su administrador del sistema 
                    para solicitar los permisos necesarios.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver Atrás
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Ir al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
