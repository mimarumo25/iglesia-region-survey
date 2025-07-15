import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, MapPin } from "lucide-react";
import { StatsData } from "@/types/dashboard";

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="card-enhanced hover-lift click-effect animate-bounce-in group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-all duration-300 truncate">
                Total Encuestas
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-primary transition-all duration-300 group-hover:scale-110 animate-pulse-glow">
                {stats.totalEncuestas}
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <FileText className="h-8 w-8 lg:h-10 lg:w-10 text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced hover-lift click-effect animate-bounce-in group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-success transition-all duration-300">
                Completadas
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-success transition-all duration-300 group-hover:scale-110">
                {stats.completadas}
              </p>
              <p className="text-xs text-success/70 mt-1">
                {Math.round((stats.completadas / stats.totalEncuestas) * 100)}% del total
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <CheckCircle className="h-8 w-8 lg:h-10 lg:w-10 text-success transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-success/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced hover-lift click-effect animate-bounce-in group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-warning transition-all duration-300">
                Pendientes
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-warning transition-all duration-300 group-hover:scale-110">
                {stats.pendientes}
              </p>
              <p className="text-xs text-warning/70 mt-1">
                {Math.round((stats.pendientes / stats.totalEncuestas) * 100)}% restante
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <Clock className="h-8 w-8 lg:h-10 lg:w-10 text-warning transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-warning/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced hover-lift click-effect animate-bounce-in group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-secondary transition-all duration-300">
                Sectores
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-secondary transition-all duration-300 group-hover:scale-110">
                {stats.sectores}
              </p>
              <p className="text-xs text-secondary/70 mt-1">
                Zonas activas
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <MapPin className="h-8 w-8 lg:h-10 lg:w-10 text-secondary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
