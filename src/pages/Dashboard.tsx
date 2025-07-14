import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MapPin, 
  FileText, 
  Activity,
  Home,
  Heart,
  Calendar,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  // Datos de ejemplo - en implementación real vendrían de la API
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
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="parish-gradient-header -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-4 lg:px-8 py-6 lg:py-8 mb-6 lg:mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">Panel de Control</h1>
          <p className="text-primary-foreground/80 text-base lg:text-lg">
            Sistema de Caracterización Poblacional - Parroquia
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="parish-card fade-in group cursor-pointer">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300 truncate">
                  Total Encuestas
                </p>
                <p className="text-xl lg:text-3xl font-bold text-primary transition-all duration-300 group-hover:scale-110">
                  {stats.totalEncuestas}
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="parish-card fade-in group cursor-pointer" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-success transition-colors duration-300">
                  Completadas
                </p>
                <p className="text-3xl font-bold text-success transition-all duration-300 group-hover:scale-110">
                  {stats.completadas}
                </p>
              </div>
              <div className="relative">
                <Users className="h-8 w-8 text-success transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-success/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="parish-card fade-in group cursor-pointer" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-warning transition-colors duration-300">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-warning transition-all duration-300 group-hover:scale-110">
                  {stats.pendientes}
                </p>
              </div>
              <div className="relative">
                <Activity className="h-8 w-8 text-warning transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-warning/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="parish-card fade-in group cursor-pointer" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-secondary transition-colors duration-300">
                  Sectores
                </p>
                <p className="text-3xl font-bold text-secondary transition-all duration-300 group-hover:scale-110">
                  {stats.sectores}
                </p>
              </div>
              <div className="relative">
                <MapPin className="h-8 w-8 text-secondary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Progreso por Sector */}
        <Card className="parish-card slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              Progreso por Sector
            </CardTitle>
            <CardDescription>
              Familias encuestadas por cada sector de la parroquia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sectorData.map((sector, index) => {
              const percentage = Math.round((sector.completed / sector.families) * 100);
              return (
                <div 
                  key={sector.name} 
                  className="space-y-3 p-4 rounded-lg bg-gradient-subtle hover:bg-muted/50 transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium group-hover:text-primary transition-colors duration-300">
                      {sector.name}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      {sector.completed}/{sector.families} ({percentage}%)
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Tipos de Vivienda */}
        <Card className="parish-card slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10">
                <Home className="h-5 w-5 text-secondary" />
              </div>
              Tipos de Vivienda
            </CardTitle>
            <CardDescription>
              Distribución de tipos de vivienda en la comunidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {housingTypes.map((housing, index) => (
              <div 
                key={housing.type} 
                className="flex items-center justify-between p-4 bg-gradient-subtle rounded-lg hover:bg-muted/50 transition-all duration-300 group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="font-medium group-hover:text-primary transition-colors duration-300">
                    {housing.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                    {housing.count}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {housing.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="parish-card slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/10">
              <Activity className="h-5 w-5 text-success" />
            </div>
            Actividad Reciente
          </CardTitle>
          <CardDescription>
            Últimas acciones realizadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-4 p-4 rounded-lg bg-gradient-subtle hover:bg-muted/50 transition-all duration-300 group cursor-pointer border border-transparent hover:border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-br from-primary to-secondary rounded-full transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:text-primary transition-colors duration-300">
                    {activity.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user} - Sector {activity.sector}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;