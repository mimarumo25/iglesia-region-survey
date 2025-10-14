/**
 * Componente para visualizar estadísticas de salud con gráficos interactivos
 * Versión mejorada con animaciones y diseño moderno
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from "recharts"
import type { Salud } from "@/types/estadisticas-completas"
import { Activity, AlertCircle, Heart, TrendingDown, Users, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaludVisualizacionProps {
  salud: Salud
  className?: string
}

const SaludVisualizacion = ({ salud, className }: SaludVisualizacionProps) => {
  // Preparar datos para el gráfico de barras con colores
  const dataEnfermedades = salud.top10EnfermedadesMasComunes
    .filter(e => e.enfermedad !== "Ninguna")
    .slice(0, 6)
    .map((enfermedad, index) => ({
      nombre: enfermedad.enfermedad.length > 20 
        ? enfermedad.enfermedad.substring(0, 20) + '...' 
        : enfermedad.enfermedad,
      nombreCompleto: enfermedad.enfermedad,
      casos: enfermedad.casos,
      porcentaje: enfermedad.porcentajeDelTotal
    }))

  // Colores altamente contrastantes y diferentes para las barras
  const COLORS = [
    '#ef4444', // rojo brillante
    '#3b82f6', // azul 
    '#10b981', // verde esmeralda
    '#f59e0b', // ámbar/naranja
    '#8b5cf6', // violeta
    '#ec4899'  // rosa/magenta
  ]

  // Estadísticas principales mejoradas
  const estadisticasPrincipales = [
    {
      label: "Total Personas",
      value: salud.totalPersonas,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      change: "100%"
    },
    {
      label: "Con Enfermedades",
      value: salud.personasConEnfermedades,
      icon: AlertCircle,
      gradient: "from-red-500 to-red-600",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
      change: `${((salud.personasConEnfermedades / salud.totalPersonas) * 100).toFixed(1)}%`
    },
    {
      label: "Personas Sanas",
      value: salud.personasSanas,
      icon: Shield,
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      change: `${((salud.personasSanas / salud.totalPersonas) * 100).toFixed(1)}%`
    },
    {
      label: "Familias Afectadas",
      value: salud.familiasConPersonasEnfermas,
      icon: Heart,
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      change: "Monitoreo"
    }
  ]

  // Custom tooltip para los gráficos
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-sm mb-2">{payload[0].payload.nombreCompleto}</p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center justify-between gap-4">
              <span>Casos:</span>
              <span className="font-bold text-primary">{payload[0].value}</span>
            </p>
            {payload[1] && (
              <p className="text-xs text-muted-foreground flex items-center justify-between gap-4">
                <span>Porcentaje:</span>
                <span className="font-bold text-secondary">{payload[1].value}%</span>
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border-b">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <Activity className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">Estadísticas de Salud</h3>
            <p className="text-sm text-muted-foreground font-normal">
              Análisis completo del estado de salud poblacional
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {salud.top10EnfermedadesMasComunes.length} enfermedades registradas
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Tarjetas de resumen mejoradas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {estadisticasPrincipales.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index} 
                className={cn(
                  "group relative p-5 rounded-2xl overflow-hidden",
                  "hover:shadow-xl hover:-translate-y-1",
                  "transition-all duration-500 cursor-pointer",
                  "border-2 border-transparent hover:border-primary/20",
                  "bg-gradient-to-br from-background to-muted/30"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Gradiente de fondo */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  "bg-gradient-to-br blur-2xl -z-10",
                  stat.gradient
                )} />
                
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "p-2 rounded-xl transition-transform group-hover:scale-110 group-hover:rotate-6",
                      stat.iconBg
                    )}>
                      <Icon className={cn("w-5 h-5", stat.iconColor)} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className={cn(
                      "text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent",
                      stat.gradient
                    )}>
                      {stat.value.toLocaleString('es-CO')}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Gráfico de enfermedades más comunes mejorado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Enfermedades Más Comunes</h3>
                <p className="text-sm text-muted-foreground">
                  Top 6 condiciones de salud registradas
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
              Análisis Principal
            </Badge>
          </div>
          
          <div className="bg-muted/30 rounded-2xl p-6 border-2 border-muted">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={dataEnfermedades}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={color} stopOpacity={0.3}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="nombre" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  stroke="hsl(var(--border))"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="casos" 
                  name="Casos Registrados"
                  radius={[12, 12, 0, 0]}
                  animationDuration={1500}
                >
                  {dataEnfermedades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detalles de enfermedades mejorado */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Distribución Detallada</h3>
              <p className="text-sm text-muted-foreground">
                Análisis por sexo y grupo etario
              </p>
            </div>
          </div>
          
          <div className="grid gap-3">
            {salud.distribucionPorEnfermedad.slice(0, 5).map((enfermedad, index) => (
              <div 
                key={index} 
                className={cn(
                  "group relative p-4 rounded-xl overflow-hidden",
                  "bg-gradient-to-r from-muted/50 to-muted/30",
                  "hover:from-primary/10 hover:to-secondary/10",
                  "border-2 border-transparent hover:border-primary/20",
                  "transition-all duration-300 cursor-pointer"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-2 truncate">
                      {enfermedad.enfermedad}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        👨 {enfermedad.distribucionPorSexo.masculino}
                      </Badge>
                      <Badge variant="outline" className="text-pink-600 border-pink-200">
                        👩 {enfermedad.distribucionPorSexo.femenino}
                      </Badge>
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        👶 &lt;18: {enfermedad.distribucionPorEdad.menores18}
                      </Badge>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        🧑 18-60: {enfermedad.distribucionPorEdad.entre18y60}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {enfermedad.totalPersonas}
                    </p>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                      {enfermedad.porcentaje}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SaludVisualizacion
