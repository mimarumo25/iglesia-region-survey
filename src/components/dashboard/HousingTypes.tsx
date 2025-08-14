import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { HousingData } from "@/types/dashboard";

interface HousingTypesProps {
  housingTypes: HousingData[];
}

const HousingTypes = ({ housingTypes }: HousingTypesProps) => {
  return (
    <Card className="card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/10">
            <Home className="w-5 h-5 text-success" />
          </div>
          Tipos de Vivienda
        </CardTitle>
        <CardDescription>
          Distribución de tipos de vivienda en la comunidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {housingTypes.map((housing, index) => (
            <div key={housing.type} className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{housing.count}</p>
              <p className="text-sm font-medium">{housing.type}</p>
              <p className="text-xs text-muted-foreground">{housing.percentage}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HousingTypes;
