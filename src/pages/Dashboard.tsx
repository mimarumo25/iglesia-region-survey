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
    <div className="parish-container parish-section space-y-8">
      {/* Header */}
      <div className="parish-gradient-header -mx-4 -mt-8 px-4 py-8 mb-8">
        <div className="parish-container">
          <h1 className="text-4xl font-bold mb-2">Panel de Control</h1>
          <p className="text-primary-foreground/80 text-lg">
            Sistema de Caracterización Poblacional - Parroquia
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="parish-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Encuestas</p>
                <p className="text-3xl font-bold text-primary">{stats.totalEncuestas}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="parish-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completadas</p>
                <p className="text-3xl font-bold text-success">{stats.completadas}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="parish-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-3xl font-bold text-warning">{stats.pendientes}</p>
              </div>
              <Activity className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="parish-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sectores</p>
                <p className="text-3xl font-bold text-secondary">{stats.sectores}</p>
              </div>
              <MapPin className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progreso por Sector */}
        <Card className="parish-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Progreso por Sector
            </CardTitle>
            <CardDescription>
              Familias encuestadas por cada sector de la parroquia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sectorData.map((sector) => {
              const percentage = Math.round((sector.completed / sector.families) * 100);
              return (
                <div key={sector.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{sector.name}</span>
                    <span className="text-muted-foreground">
                      {sector.completed}/{sector.families} ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Tipos de Vivienda */}
        <Card className="parish-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Tipos de Vivienda
            </CardTitle>
            <CardDescription>
              Distribución de tipos de vivienda en la comunidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {housingTypes.map((housing) => (
              <div key={housing.type} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full bg-primary"
                    style={{ backgroundColor: `hsl(var(--primary))` }}
                  />
                  <span className="font-medium">{housing.type}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{housing.count}</p>
                  <p className="text-sm text-muted-foreground">{housing.percentage}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="parish-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>
            Últimas acciones realizadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className={`flex items-center gap-4 p-4 rounded-lg ${
                index % 2 === 0 ? 'bg-muted/30' : 'bg-background'
              }`}>
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1">
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user} - Sector {activity.sector}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;