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
import { FileText, Plus, Sparkles } from "lucide-react";

const DashboardMain = () => {
  const navigate = useNavigate();
  
  const stats = {
    totalEncuestas: 1247,
    completadas: 1089,
    pendientes: 158,
    sectores: 12
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
      
      {/* Ejemplo adicional de variantes temáticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ParishCard variant="elevated" themeBackground="secondary" glowEffect className="text-secondary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Fondo Secundario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Tarjeta con fondo temático secundario y efecto de brillo.
            </p>
          </CardContent>
        </ParishCard>
        
        <ParishCard variant="interactive" themeBackground="subtle" hoverAnimation>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Fondo Sutil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tarjeta con gradiente sutil y animación de hover.
            </p>
          </CardContent>
        </ParishCard>
        
        <ParishCard variant="gradient" themeBackground="default" className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Fondo Default
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tarjeta con fondo por defecto y patrón decorativo.
            </p>
          </CardContent>
        </ParishCard>
      </div>
    </div>
  );
};

export default DashboardMain;