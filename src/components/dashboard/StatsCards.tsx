import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, MapPin } from "lucide-react";
import { StatsData } from "@/types/dashboard";

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="card-enhanced group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground truncate">
                Total Encuestas
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">
                {stats.totalEncuestas.toLocaleString()}
              </p>
            </div>
            <div className="relative">
              <FileText className="h-8 w-8 lg:h-10 lg:w-10 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Completadas
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-success">
                {stats.completadas}
              </p>
              <p className="text-xs text-success/70 mt-1">
                {Math.round((stats.completadas / stats.totalEncuestas) * 100)}% del total
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <CheckCircle className="h-8 w-8 lg:h-10 lg:w-10 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Pendientes
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-warning">
                {stats.pendientes}
              </p>
              <p className="text-xs text-warning/70 mt-1">
                {Math.round((stats.pendientes / stats.totalEncuestas) * 100)}% restante
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <Clock className="h-8 w-8 lg:h-10 lg:w-10 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                Sectores
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-secondary">
                {stats.sectores}
              </p>
              <p className="text-xs text-secondary/70 mt-1">
                Zonas activas
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <MapPin className="h-8 w-8 lg:h-10 lg:w-10 text-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
