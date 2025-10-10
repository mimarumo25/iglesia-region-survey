import {
  DashboardHeader,
  StatsCards,
  SectorProgress,
  RecentActivity,
  HousingTypes
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParishButton } from "@/components/ui/parish-button";
import { ParishCard } from "@/components/ui/parish-card";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { obtenerEstadisticasEncuesta } from "@/services/estadisticas";
import type { EstadisticasDashboard } from "@/types/estadisticas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DashboardMain = () => {
  const navigate = useNavigate();
  
  // Estado para estadísticas del API
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener estadísticas al montar el componente
  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await obtenerEstadisticasEncuesta();
        setEstadisticas(data);
      } catch (err: any) {
        console.error('Error al cargar estadísticas:', err);
        setError(err.message || 'Error al cargar estadísticas del dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  // Stats usando datos reales del API
  const stats = estadisticas ? {
    totalEncuestas: estadisticas.totalEncuestas,
    completadas: estadisticas.familiasCompletadas,
    pendientes: estadisticas.familiasPendientes,
    sectores: estadisticas.municipiosCubiertos
  } : {
    totalEncuestas: 0,
    completadas: 0,
    pendientes: 0,
    sectores: 0
  };

  const recentActivity = [
    {
      id: 1,
      type: "Encuesta completada",
      user: "María González",
      sector: "La Esperanza",
      time: "Hace 5 minutos"
    },
    {
      id: 2,
      type: "Nueva familia registrada",
      user: "Carlos Mendoza",
      sector: "San José",
      time: "Hace 15 minutos"
    },
    {
      id: 3,
      type: "Encuesta iniciada",
      user: "Ana Rodríguez",
      sector: "Cristo Rey",
      time: "Hace 30 minutos"
    }
  ];

  const sectorData = [
    { name: "La Esperanza", families: 156, completed: 142 },
    { name: "San José", families: 98, completed: 89 },
    { name: "Cristo Rey", families: 134, completed: 120 },
    { name: "Divino Niño", families: 87, completed: 78 },
  ];

  const housingTypes = [
    { type: "Casa propia", count: 567, percentage: 52 },
    { type: "Casa arrendada", count: 312, percentage: 29 },
    { type: "Casa familiar", count: 156, percentage: 14 },
    { type: "Apartamento", count: 54, percentage: 5 }
  ];

  return (
    <div className="space-y-8 lg:space-y-10 min-h-screen bg-background/50 p-6">
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
      {!isLoading && estadisticas && (
        <>
          {/* Botón de acción principal para nueva encuesta */}
          <ParishCard variant="gradient" themeBackground="animated" className="border-0 text-primary-foreground overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Realizar Nueva Caracterización
              </CardTitle>
              <CardDescription className="text">
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
          
          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Progreso de sectores con fondo primario */}
            <ParishCard variant="elevated" themeBackground="subtle" className="p-6 bg-card/50 backdrop-blur-sm">
              <SectorProgress sectorData={sectorData} />
            </ParishCard>
            
            {/* Actividad reciente con fondo secundario */}
            <ParishCard variant="interactive" themeBackground="default" className="p-6 bg-card/50 backdrop-blur-sm">
              <RecentActivity activities={recentActivity} />
            </ParishCard>
          </div>

          {/* Tipos de vivienda con fondo temático */}
          <ParishCard variant="gradient" themeBackground="primary" className="text-primary-foreground">
            <div className="relative z-10">
              <HousingTypes housingTypes={housingTypes} />
            </div>
          </ParishCard>
        </>
      )}
    </div>
  );
};

export default DashboardMain;