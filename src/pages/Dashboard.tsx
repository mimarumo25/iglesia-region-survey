import {
  DashboardHeader
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParishButton } from "@/components/ui/parish-button";
import { ParishCard } from "@/components/ui/parish-card";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Loader2, AlertCircle, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { obtenerEstadisticasCompletas } from "@/services/estadisticas-completas";
import type { EstadisticasCompletasDatos } from "@/types/estadisticas-completas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ResumenGeneralCards,
  SaludVisualizacion,
  EducacionVisualizacion,
  ViviendaVisualizacion
} from "@/components/dashboard/estadisticas";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const DashboardMain = () => {
  const navigate = useNavigate();
  
  // Estado para estadísticas del API
  const [estadisticasCompletas, setEstadisticasCompletas] = useState<EstadisticasCompletasDatos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener estadísticas al montar el componente
  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const dataCompletas = await obtenerEstadisticasCompletas();
        
        setEstadisticasCompletas(dataCompletas);
      } catch (err: any) {
        setError(err.message || 'Error al cargar estadísticas del dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8 space-y-8 lg:space-y-10 min-h-screen bg-background/50">
      <DashboardHeader />
      
      {/* Estado de carga */}
      {isLoading && (
        <ParishCard variant="elevated" className="border-primary/20">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Cargando estadísticas...</p>
            </div>
          </CardContent>
        </ParishCard>
      )}

      {/* Estado de error */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error al cargar estadísticas</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Contenido principal - solo se muestra cuando hay datos */}
      {!isLoading && estadisticasCompletas && (
        <>
          {/* Botón de acción principal para nueva encuesta */}
          <ParishCard variant="gradient" themeBackground="animated" className="border-0 text-primary-foreground overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Realizar Nueva Caracterización
              </CardTitle>
              <CardDescription className="text-primary-foreground/90">
                Inicie una nueva encuesta de caracterización poblacional para registrar información de familias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParishButton
                variant="primary"
                theme="parish"
                icon={Plus}
                onClick={() => navigate('/survey')}
                size="lg"
              >
                Iniciar Nueva Encuesta
              </ParishButton>
            </CardContent>
          </ParishCard>

          {/* Estadísticas Completas del Sistema */}
          <div className="pt-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-primary" />
              Estadísticas del Sistema
            </h2>
          </div>

          {/* Resumen General */}
          <ErrorBoundary variant="component" className="mb-6">
            <ResumenGeneralCards resumen={estadisticasCompletas.resumen} />
          </ErrorBoundary>

          {/* Grid de Estadísticas Detalladas */}
          <div className="space-y-8">
            {/* Salud */}
            <ErrorBoundary variant="component">
              <SaludVisualizacion salud={estadisticasCompletas.salud} />
            </ErrorBoundary>

            {/* Educación */}
            <ErrorBoundary variant="component">
              <EducacionVisualizacion educacion={estadisticasCompletas.educacion} />
            </ErrorBoundary>

            {/* Vivienda */}
            <ErrorBoundary variant="component">
              <ViviendaVisualizacion vivienda={estadisticasCompletas.vivienda} />
            </ErrorBoundary>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardMain;