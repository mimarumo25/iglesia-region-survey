/**
 * Página de Reportes Placeholder - Sistema MIA
 * Esta página ha sido vaciada de toda funcionalidad de reportes
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Construction } from "lucide-react";

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight parish-text-primary">
            Reportes
          </h1>
          <p className="text-muted-foreground">
            Esta sección está en proceso de reestructuración
          </p>
        </div>

        {/* Mensaje de estado */}
        <Card className="border-dashed border-orange-200 bg-orange-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Construction className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">
                Funcionalidad en Desarrollo
              </CardTitle>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                Mantenimiento
              </Badge>
            </div>
            <CardDescription className="text-orange-800">
              El sistema de reportes está siendo completamente rediseñado para ofrecer mejores funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="mb-2">
                  <strong>Estado actual:</strong> Todas las funcionalidades de reportes han sido eliminadas del sistema
                  para permitir una implementación completamente nueva y mejorada.
                </p>
                <p>
                  Esta página permanecerá como placeholder hasta que se complete la nueva implementación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información para desarrolladores */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">
              Información Técnica
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• Componentes de reportes eliminados: <code>src/components/reportes/</code></li>
              <li>• Referencias en búsqueda global limpiadas</li>
              <li>• Rutas de reportes removidas del sistema de navegación</li>
              <li>• Sidebar actualizado sin enlace a reportes</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
