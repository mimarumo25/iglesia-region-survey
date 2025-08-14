import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { ActivityData } from "@/types/dashboard";

interface RecentActivityProps {
  activities: ActivityData[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card className="card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10">
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          Actividad Reciente
        </CardTitle>
        <CardDescription>
          Últimas acciones realizadas en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.type}</p>
              <p className="text-xs text-muted-foreground">
                {activity.user} • {activity.sector}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
