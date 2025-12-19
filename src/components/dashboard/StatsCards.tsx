import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, MapPin } from "lucide-react";
import { StatsData } from "@/types/dashboard";

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="card-enhanced group cursor-pointer hover:border-primary/40 transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground/90 dark:text-muted-foreground truncate">
                Total Encuestas
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground mt-1">
                {stats.totalEncuestas.toLocaleString()}
              </p>
            </div>
            <div className="relative p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all">
              <FileText className="h-7 w-7 lg:h-9 lg:w-9 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced group cursor-pointer hover:border-success/40 transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-muted-foreground/90 dark:text-muted-foreground">
                Completadas
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-success mt-1">
                {stats.completadas}
              </p>
              <p className="text-xs font-medium text-success/80 dark:text-success mt-1.5">
                {Math.round((stats.completadas / stats.totalEncuestas) * 100)}% del total
              </p>
            </div>
            <div className="relative flex-shrink-0 p-3 bg-success/10 rounded-xl group-hover:bg-success/20 transition-all">
              <CheckCircle className="h-7 w-7 lg:h-9 lg:w-9 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced group cursor-pointer hover:border-warning/40 transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-muted-foreground/90 dark:text-muted-foreground">
                Pendientes
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-warning mt-1">
                {stats.pendientes}
              </p>
              <p className="text-xs font-medium text-warning/80 dark:text-warning mt-1.5">
                {Math.round((stats.pendientes / stats.totalEncuestas) * 100)}% restante
              </p>
            </div>
            <div className="relative flex-shrink-0 p-3 bg-warning/10 rounded-xl group-hover:bg-warning/20 transition-all">
              <Clock className="h-7 w-7 lg:h-9 lg:w-9 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced group cursor-pointer hover:border-secondary/40 transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-muted-foreground/90 dark:text-muted-foreground">
                Sectores
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-secondary mt-1">
                {stats.sectores}
              </p>
              <p className="text-xs font-medium text-secondary/80 dark:text-secondary mt-1.5">
                Zonas activas
              </p>
            </div>
            <div className="relative flex-shrink-0 p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-all">
              <MapPin className="h-7 w-7 lg:h-9 lg:w-9 text-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
