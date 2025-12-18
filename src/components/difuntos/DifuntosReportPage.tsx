/**
 * Página de Reportes de Difuntos - Sistema MIA
 * 
 * Componente principal que integra el formulario de filtros,
 * la tabla de resultados y las funciones de exportación
 * 
 * @version 1.0
 * @author Sistema MIA
 */

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  FileSpreadsheet,
  Database,
  Activity,
  Download
} from "lucide-react";

// Componentes específicos de difuntos
import DifuntosForm from "@/components/difuntos/DifuntosForm";
import DifuntosTable from "@/components/difuntos/DifuntosTable";

// Hook personalizado
import { useDifuntosConsulta } from "@/hooks/useDifuntosConsulta";

/**
 * Componente DifuntosReportPage - Página completa de reportes de difuntos
 */
export const DifuntosReportPage = () => {
  const {
    difuntos,
    total,
    isLoading,
    error,
    searchDifuntos,
    clearFilters,
    exportToExcel,
    isExporting,
    setFilters
  } = useDifuntosConsulta();

  /**
   * Cargar automáticamente todos los difuntos al entrar por primera vez
   */
  useEffect(() => {
    // Cargar todos los difuntos sin filtros al montar el componente
    const loadInitialData = async () => {
      try {
        setFilters({});
        await searchDifuntos();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    loadInitialData();
  }, []); // Solo ejecutar una vez al montar

  /**
   * Maneja la búsqueda con filtros desde el formulario
   */
  const handleSearch = async (newFilters: any) => {
    await searchDifuntos(newFilters);
  };

  /**
   * Maneja la limpieza de filtros
   */
  const handleClearFilters = () => {
    clearFilters();
    searchDifuntos({});
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header de la página */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>Reportes de Difuntos</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Consulta y genera reportes detallados de registros de difuntos 
                con filtros avanzados por ubicación, parentesco y fechas
              </CardDescription>
            </div>
            
            {/* Botones de acción agrupados */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Button
                variant="default"
                onClick={exportToExcel}
                disabled={isExporting || difuntos.length === 0}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-9"
              >
                {isExporting ? (
                  <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="hidden xs:inline">Descargar Excel</span>
                <span className="xs:hidden">Excel</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Formulario de filtros */}
      <DifuntosForm 
        onSearch={handleSearch}
        isLoading={isLoading}
        onClearFilters={handleClearFilters}
      />

      {/* Mensaje de error si existe */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Error en la consulta:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de resultados */}
      <DifuntosTable 
        data={difuntos}
        isLoading={isLoading}
        total={total}
      />

      {/* Mensaje de ayuda si no hay datos ni está cargando */}
      {!isLoading && difuntos.length === 0 && !error && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Consulta de Difuntos</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Configure los filtros de búsqueda arriba y haga clic en "Buscar" 
              para consultar los registros de difuntos según sus criterios.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Database className="h-4 w-4" />
                <span>Múltiples fuentes de datos</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                <span>Exportación Excel</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Filtros avanzados</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DifuntosReportPage;