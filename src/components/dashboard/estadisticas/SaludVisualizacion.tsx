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
  Cell
} from "recharts"
import type { Salud } from "@/types/estadisticas-completas"
import { Activity, AlertCircle, Heart, TrendingDown, Users, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaludVisualizacionProps {
  salud: Salud
  className?: string
}

// Paleta suave con tonos health-friendly
const SOFT_COLORS = [
  { bar: '#60a5fa', gradient: ['#93c5fd', '#3b82f6'] }, // sky blue
  { bar: '#34d399', gradient: ['#6ee7b7', '#10b981'] }, // emerald
  { bar: '#f87171', gradient: ['#fca5a5', '#ef4444'] }, // rose soft
  { bar: '#fbbf24', gradient: ['#fde68a', '#f59e0b'] }, // amber warm
  { bar: '#a78bfa', gradient: ['#c4b5fd', '#7c3aed'] }, // violet soft
  { bar: '#f472b6', gradient: ['#f9a8d4', '#db2777'] }, // pink soft
]

const STAT_CONFIGS = [
  {
    gradient: 'from-sky-400/20 to-blue-400/10',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    numColor: 'text-sky-700',
    border: 'border-sky-200/60',
  },
  {
    gradient: 'from-rose-400/20 to-red-300/10',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
    numColor: 'text-rose-600',
    border: 'border-rose-200/60',
  },
  {
    gradient: 'from-emerald-400/20 to-green-300/10',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    numColor: 'text-emerald-700',
    border: 'border-emerald-200/60',
  },
  {
    gradient: 'from-amber-400/20 to-orange-300/10',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    numColor: 'text-amber-700',
    border: 'border-amber-200/60',
  },
]

const DIST_BORDER_COLORS = [
  'border-l-sky-400',
  'border-l-emerald-400',
  'border-l-rose-400',
  'border-l-amber-400',
  'border-l-violet-400',
]

const SaludVisualizacion = ({ salud, className }: SaludVisualizacionProps) => {
  const dataEnfermedades = salud.top10EnfermedadesMasComunes
    .filter(e => e.enfermedad !== "Ninguna")
    .slice(0, 6)
    .map((enfermedad) => ({
      nombre: enfermedad.enfermedad.length > 18
        ? enfermedad.enfermedad.substring(0, 18) + '…'
        : enfermedad.enfermedad,
      nombreCompleto: enfermedad.enfermedad,
      casos: enfermedad.casos,
      porcentaje: enfermedad.porcentajeDelTotal
    }))

  const estadisticasPrincipales = [
    {
      label: "Total Personas",
      value: salud.totalPersonas,
      icon: Users,
      badge: "100%",
      ...STAT_CONFIGS[0],
    },
    {
      label: "Con Enfermedades",
      value: salud.personasConEnfermedades,
      icon: AlertCircle,
      badge: `${((salud.personasConEnfermedades / salud.totalPersonas) * 100).toFixed(1)}%`,
      ...STAT_CONFIGS[1],
    },
    {
      label: "Personas Sanas",
      value: salud.personasSanas,
      icon: Shield,
      badge: `${((salud.personasSanas / salud.totalPersonas) * 100).toFixed(1)}%`,
      ...STAT_CONFIGS[2],
    },
    {
      label: "Familias Afectadas",
      value: salud.familiasConPersonasEnfermas,
      icon: Heart,
      badge: "Seguimiento",
      ...STAT_CONFIGS[3],
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white/95 dark:bg-card/95 backdrop-blur-sm border border-slate-200 dark:border-border rounded-xl p-3 shadow-lg min-w-[160px]">
        <p className="font-semibold text-xs text-slate-700 dark:text-foreground mb-2 leading-snug">
          {payload[0].payload.nombreCompleto}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-slate-500 dark:text-muted-foreground">Casos</span>
          <span className="text-[11px] font-bold" style={{ color: payload[0].fill || SOFT_COLORS[0].bar }}>
            {payload[0].value}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-slate-500 dark:text-muted-foreground">Del total</span>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-muted-foreground">
            {payload[0].payload.porcentaje}%
          </span>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("overflow-hidden border border-slate-200/80 dark:border-border shadow-sm", className)}>
      {/* Header suave — teal/azul en lugar de rojo */}
      <CardHeader className="bg-gradient-to-r from-teal-50 via-sky-50 to-blue-50 dark:from-teal-500/8 dark:via-sky-500/6 dark:to-blue-500/8 border-b border-slate-200/60 dark:border-border p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="p-1.5 sm:p-2 bg-teal-100 dark:bg-teal-500/15 rounded-lg sm:rounded-xl flex-shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-foreground leading-tight">
                Estadísticas de Salud
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-500 dark:text-muted-foreground font-normal leading-tight mt-0.5">
                Análisis completo del estado de salud poblacional
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] sm:text-xs self-start sm:self-auto whitespace-nowrap border-teal-300 text-teal-700 dark:border-teal-500/40 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10"
          >
            {salud.top10EnfermedadesMasComunes.length} enfermedades
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 sm:p-6 space-y-6 sm:space-y-8">

        {/* Tarjetas resumen — fondo suave sin gradientes agresivos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {estadisticasPrincipales.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className={cn(
                  "relative p-3 sm:p-4 rounded-xl overflow-hidden",
                  "border",
                  "transition-shadow duration-300 hover:shadow-md",
                  `bg-gradient-to-br ${stat.gradient}`,
                  stat.border,
                )}
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-1.5 rounded-lg", stat.iconBg)}>
                      <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", stat.iconColor)} />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[9px] sm:text-[10px] px-1.5 py-0.5 leading-tight font-medium bg-white/60 dark:bg-background/40 text-slate-600 dark:text-muted-foreground border-0"
                    >
                      {stat.badge}
                    </Badge>
                  </div>
                  <div>
                    <p className={cn("text-xl sm:text-2xl font-bold leading-tight", stat.numColor)}>
                      {stat.value.toLocaleString('es-CO')}
                    </p>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-muted-foreground mt-0.5 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Distribución + Gráfica lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">

          {/* Distribución detallada — columna izquierda */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-500/15 rounded-lg flex-shrink-0">
                <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-foreground leading-tight">
                  Distribución Detallada
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-muted-foreground leading-tight">
                  Por sexo y grupo etario
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3">
              {salud.distribucionPorEnfermedad.slice(0, 5).map((enfermedad, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative p-3 sm:p-4 rounded-xl",
                    "border-l-[3px] border border-slate-200/60 dark:border-border",
                    "bg-white/80 dark:bg-card/60",
                    "hover:bg-slate-50 dark:hover:bg-muted/30",
                    "transition-colors duration-200",
                    DIST_BORDER_COLORS[i % DIST_BORDER_COLORS.length],
                  )}
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm text-slate-700 dark:text-foreground mb-2 truncate">
                        {enfermedad.enfermedad}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20">
                          <span className="font-medium">M</span> {enfermedad.distribucionPorSexo.masculino}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-200/60 dark:border-pink-500/20">
                          <span className="font-medium">F</span> {enfermedad.distribucionPorSexo.femenino}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200/60 dark:border-violet-500/20">
                          <span className="font-medium">&lt;18</span> {enfermedad.distribucionPorEdad.menores18}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20">
                          <span className="font-medium">18-60</span> {enfermedad.distribucionPorEdad.entre18y60}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-foreground leading-none">
                        {enfermedad.totalPersonas}
                      </p>
                      <span
                        className="inline-block text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: SOFT_COLORS[i % SOFT_COLORS.length].bar + '25',
                          color: SOFT_COLORS[i % SOFT_COLORS.length].gradient[1],
                        }}
                      >
                        {enfermedad.porcentaje}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>{/* fin columna izquierda */}

          {/* Gráfico de enfermedades — columna derecha */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 dark:bg-rose-500/15 rounded-lg flex-shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-foreground leading-tight">
                    Enfermedades Más Comunes
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-muted-foreground leading-tight">
                    Top 6 condiciones de salud registradas
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs self-start sm:self-auto border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-500/8"
              >
                Análisis principal
              </Badge>
            </div>

            <div className="bg-slate-50/60 dark:bg-muted/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/50 dark:border-border w-full">
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3 sm:mb-4">
                {dataEnfermedades.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: SOFT_COLORS[i % SOFT_COLORS.length].bar }}
                    />
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-muted-foreground truncate max-w-[90px]">
                      {item.nombre}
                    </span>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dataEnfermedades}
                  margin={{ top: 4, right: 8, left: -12, bottom: 60 }}
                  barCategoryGap="28%"
                >
                  <defs>
                    {SOFT_COLORS.map((c, i) => (
                      <linearGradient key={i} id={`sg-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c.gradient[0]} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={c.gradient[1]} stopOpacity={0.65} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" strokeOpacity={0.6} vertical={false} />
                  <XAxis
                    dataKey="nombre"
                    angle={-38}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                  <Bar dataKey="casos" name="Casos" radius={[8, 8, 0, 0]} animationDuration={1200} animationEasing="ease-out">
                    {dataEnfermedades.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={`url(#sg-${i % SOFT_COLORS.length})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>{/* fin columna derecha */}

        </div>{/* fin grid */}

      </CardContent>
    </Card>
  )
}

export default SaludVisualizacion
