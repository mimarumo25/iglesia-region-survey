import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  RefreshCw,
  Download,
  AlertCircle,
  BarChart3,
  Phone,
  Mail,
  User,
  Calendar,
  MapPin,
  Heart
} from "lucide-react";
import { useFamiliasConsolidadas } from "@/hooks/useFamiliasConsulta";
import { FamiliasConsolidadasTable } from "@/components/familias/FamiliasConsolidadasTable";

/**
 * Página de familias consolidadas - Reporte integrado con API
 * Muestra familias del servidor usando el endpoint /api/familias
 */

const Families = () => {
  const navigate = useNavigate();
  
  // Hook para datos de familias consolidadas
  const {
    familiasParaTabla,
    estadisticas,
    isLoading,
    error,
    refrescar,
    total
  } = useFamiliasConsolidadas({
    autoLoad: true,
    limite: 100
  });

  /**
   * Navegar a detalles de familia
   */
  const handleFamiliaClick = (familiaId: string) => {
    console.log('📍 Navegando a familia:', familiaId);
    // TODO: Implementar página de detalles de familia
    // navigate(`/families/${familiaId}`);
  };

  /**
   * Exportar datos a Excel/CSV
   */
  const handleExport = () => {
    console.log('📊 Exportando familias...');
    // TODO: Implementar exportación
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            Familias Parroquiales
          </h1>
          <p className="text-muted-foreground">
            Reporte consolidado de familias registradas en el sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/survey")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Familia
          </Button>
          
          <Button
            variant="outline"
            onClick={refrescar}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar familias: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Estadísticas principales */}
      {estadisticas && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Familias</p>
                  <p className="text-2xl font-bold">{estadisticas.total_familias}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Personas</p>
                  <p className="text-2xl font-bold">{estadisticas.total_personas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vivos</p>
                  <p className="text-2xl font-bold text-green-700">{estadisticas.total_vivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Menores</p>
                  <p className="text-2xl font-bold text-purple-700">{estadisticas.total_menores}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adultos</p>
                  <p className="text-2xl font-bold text-orange-700">{estadisticas.total_adultos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <div className="flex">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <Mail className="w-3 h-3 text-emerald-600 -ml-1" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Con Contacto</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {Math.max(estadisticas.familias_con_telefono, estadisticas.familias_con_email)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resumen informativo */}
      {estadisticas && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <BarChart3 className="h-5 w-5" />
              Resumen Pastoral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  <Phone className="w-3 h-3 mr-1" />
                  {estadisticas.familias_con_telefono} familias con teléfono
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  <Mail className="w-3 h-3 mr-1" />
                  {estadisticas.familias_con_email} familias con email
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  <MapPin className="w-3 h-3 mr-1" />
                  {total} registros en total
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de familias */}
      <FamiliasConsolidadasTable
        familias={familiasParaTabla}
        isLoading={isLoading}
        onRefresh={refrescar}
        onFamiliaClick={handleFamiliaClick}
        onExport={handleExport}
        className="mt-6"
      />

      {/* Info de estado */}
      {!isLoading && familiasParaTabla.length === 0 && !error && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay familias registradas</h3>
            <p className="text-muted-foreground mb-4">
              Comienza registrando la primera familia en el sistema
            </p>
            <Button onClick={() => navigate("/survey")} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Registrar Primera Familia
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Families;
