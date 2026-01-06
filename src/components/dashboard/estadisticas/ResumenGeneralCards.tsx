/**
 * Componente para mostrar el resumen general con tarjetas estadísticas
 * Versión mejorada con animaciones y diseño interactivo
 */

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  UserCheck, 
  UserX, 
  UsersRound, 
  MapPin,
  Building2,
  TrendingUp
} from "lucide-react"
import type { ResumenGeneral } from "@/types/estadisticas-completas"
import { cn } from "@/lib/utils"

interface ResumenGeneralCardsProps {
  resumen: ResumenGeneral
  className?: string
}

const ResumenGeneralCards = ({ resumen, className }: ResumenGeneralCardsProps) => {
  const cards = [
    {
      title: "Total Personas",
      value: resumen.totalPersonas,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      description: "Personas registradas",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Personas Vivas",
      value: resumen.totalPersonasVivas,
      icon: UserCheck,
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      description: "Actualmente vivas",
      trend: "Activo",
      trendUp: true
    },
    {
      title: "Difuntos",
      value: resumen.totalDifuntos,
      icon: UserX,
      gradient: "from-gray-500 to-gray-600",
      iconBg: "bg-gray-500/10",
      iconColor: "text-gray-600",
      description: "Registros históricos",
      trend: "Histórico",
      trendUp: false
    },
    {
      title: "Familias",
      value: resumen.totalFamilias,
      icon: UsersRound,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      description: "Núcleos familiares",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Departamentos",
      value: resumen.totalDepartamentos,
      icon: MapPin,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      description: "Zonas geográficas",
      trend: "Completo",
      trendUp: true
    },
    {
      title: "Municipios",
      value: resumen.totalMunicipios,
      icon: Building2,
      gradient: "from-pink-500 to-rose-600",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600",
      description: "Municipios activos",
      trend: "+3",
      trendUp: true
    },
  ]

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4", className)}>
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card 
            key={index} 
            className={cn(
              "group relative overflow-hidden",
              "hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1",
              "transition-all duration-500 ease-out cursor-pointer",
              "border-2 border-transparent hover:border-primary/30",
              "animate-in fade-in slide-in-from-bottom-4",
              "bg-gradient-to-br from-background to-muted/20"
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            {/* Gradiente de fondo decorativo */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-br",
              card.gradient,
              "blur-3xl -z-10 scale-150"
            )} />
            
            <CardContent className="p-3 sm:p-4 xl:p-5 relative">
              <div className="flex flex-col gap-2.5 sm:gap-3">
                {/* Header con icono y badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className={cn(
                    "p-2 sm:p-2.5 xl:p-3 rounded-xl xl:rounded-2xl transition-all duration-300",
                    "group-hover:scale-110 group-hover:rotate-6",
                    "shadow-lg group-hover:shadow-xl",
                    card.iconBg
                  )}>
                    <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6", card.iconColor)} />
                  </div>
                  
                  {/* Badge de tendencia */}
                  <Badge 
                    variant={card.trendUp ? "default" : "secondary"}
                    className={cn(
                      "text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 flex items-center gap-0.5 sm:gap-1",
                      "transition-all duration-300 group-hover:scale-110",
                      card.trendUp && "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                    )}
                  >
                    {card.trendUp && <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {card.trend}
                  </Badge>
                </div>
                
                {/* Valor principal con animación */}
                <div className="space-y-0.5">
                  <p className={cn(
                    "text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold",
                    "bg-gradient-to-br bg-clip-text text-transparent",
                    card.gradient,
                    "transition-all duration-300 group-hover:scale-105"
                  )}>
                    {card.value.toLocaleString('es-CO')}
                  </p>
                  <p className="text-[11px] sm:text-xs xl:text-sm font-semibold text-foreground line-clamp-1">
                    {card.title}
                  </p>
                  <p className="text-[9px] sm:text-[10px] xl:text-xs text-muted-foreground/80 line-clamp-1">
                    {card.description}
                  </p>
                </div>

                {/* Barra de progreso decorativa */}
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full bg-gradient-to-r rounded-full",
                      "transition-all duration-1000 ease-out",
                      card.gradient,
                      "group-hover:w-full"
                    )}
                    style={{ 
                      width: '60%',
                      animationDelay: `${index * 100 + 300}ms`
                    }}
                  />
                </div>
              </div>
            </CardContent>

            {/* Brillo decorativo en hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default ResumenGeneralCards
