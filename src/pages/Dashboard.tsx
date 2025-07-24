import {
  DashboardHeader,
  StatsCards,
  SectorProgress,
  RecentActivity,
  HousingTypes
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";

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
    <div className="space-y-8 lg:space-y-10">
      <DashboardHeader />
      
      {/* Botón de acción principal para nueva encuesta */}
      <Card className="bg-gradient-to-r from-primary to-primary-light border-0 text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <FileText className="w-6 h-6" />
            Realizar Nueva Caracterización
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Inicie una nueva encuesta de caracterización poblacional para registrar información de familias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/survey')}
            className="bg-white text-primary hover:bg-gray-100 font-semibold rounded-full p-4"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2 " />
            Iniciar Nueva Encuesta
          </Button>
        </CardContent>
      </Card>
      
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <SectorProgress sectorData={sectorData} />
        <RecentActivity activities={recentActivity} />
      </div>

      <HousingTypes housingTypes={housingTypes} />
    </div>
  );
};

export default DashboardMain;