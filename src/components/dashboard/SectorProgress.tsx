import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";
import { SectorData } from "@/types/dashboard";

interface SectorProgressProps {
  sectorData: SectorData[];
}

const SectorProgress = ({ sectorData }: SectorProgressProps) => {
  return (
    <Card className="card-enhanced hover-glow animate-slide-in-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          Progreso por Sector
        </CardTitle>
        <CardDescription>
          Estado de completitud de encuestas por sector geográfico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sectorData.map((sector, index) => (
          <div key={sector.name} className="space-y-2 hover-lift p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 animate-slide-in-left">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{sector.name}</span>
              <span className="text-muted-foreground">
                {sector.completed}/{sector.families}
              </span>
            </div>
            <Progress 
              value={(sector.completed / sector.families) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {Math.round((sector.completed / sector.families) * 100)}% completado
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SectorProgress;
