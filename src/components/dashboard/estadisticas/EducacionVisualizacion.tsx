/**
 * Componente para visualizar estadísticas de educación
 * Versión mejorada con diseño interactivo y moderno
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
  Cell
} from "recharts"
import type { Educacion } from "@/types/estadisticas-completas"
import { GraduationCap, Wrench, Users, TrendingUp, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface EducacionVisualizacionProps {
  educacion: Educacion
  className?: string
}

const EducacionVisualizacion = ({ educacion, className }: EducacionVisualizacionProps) => {
  // Datos para gráfico de profesiones
  const dataProfesiones = educacion.top5Profesiones.map((prof, index) => ({
    nombre: prof.profesion.length > 15 ? prof.profesion.substring(0, 15) + '...' : prof.profesion,
    nombreCompleto: prof.profesion,
    total: prof.totalPersonas,
    index
  }))

  // Datos para gráfico de habilidades
  const dataHabilidades = educacion.top5Habilidades.map((hab, index) => ({
    nombre: hab.habilidad.length > 15 ? hab.habilidad.substring(0, 15) + '...' : hab.habilidad,
    nombreCompleto: hab.habilidad,
    total: hab.totalPersonas,
    index
  }))

  // Paleta de colores altamente contrastantes y diferentes
  const COLORS_PROFESIONES = [
    '#ef4444', // rojo brillante
    '#3b82f6', // azul brillante
    '#10b981', // verde esmeralda
    '#f59e0b', // ámbar/naranja
    '#8b5cf6'  // violeta
  ]

  const COLORS_HABILIDADES = [
    '#ec4899', // rosa/magenta
    '#06b6d4', // cyan
    '#84cc16', // lima brillante
    '#f97316', // naranja intenso
    '#6366f1'  // índigo
  ]

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-sm mb-1">{payload[0].payload.nombreCompleto}</p>
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-primary">{payload[0].value}</span> personas
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* Tarjeta de Profesiones */}
      <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500">
        {/* Gradiente decorativo de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border-b relative">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">Profesiones</h3>
              <p className="text-sm text-muted-foreground font-normal">
                Perfiles profesionales registrados
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {educacion.totalProfesionesCatalogo} tipos
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 relative">
          {/* Estadísticas resumidas mejoradas */}
          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "relative p-4 rounded-2xl overflow-hidden",
              "bg-gradient-to-br from-blue-500/10 to-purple-500/10",
              "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer",
              "border-2 border-transparent hover:border-blue-500/20"
            )}>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <Badge variant="secondary" className="text-xs">
                    {((educacion.personasConProfesion / (educacion.personasConProfesion + educacion.personasSinProfesion)) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Con Profesión</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {educacion.personasConProfesion.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
            
            <div className={cn(
              "relative p-4 rounded-2xl overflow-hidden",
              "bg-muted/50",
              "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer",
              "border-2 border-transparent hover:border-muted-foreground/20"
            )}>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {((educacion.personasSinProfesion / (educacion.personasConProfesion + educacion.personasSinProfesion)) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Sin Profesión</p>
                <p className="text-3xl font-bold">
                  {educacion.personasSinProfesion.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico de barras mejorado */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold">Top 5 Profesiones</h4>
            </div>
            
            <div className="bg-muted/30 rounded-2xl p-4 border-2 border-muted">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart 
                  data={dataProfesiones} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <defs>
                    {COLORS_PROFESIONES.map((color, index) => (
                      <linearGradient key={index} id={`gradient-prof-${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0.4}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--border))"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    dataKey="nombre" 
                    type="category"
                    width={120}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total" 
                    radius={[0, 12, 12, 0]}
                    animationDuration={1500}
                  >
                    {dataProfesiones.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient-prof-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="space-y-3 pt-3 border-t-2 border-dashed border-muted">
            <h4 className="text-sm font-bold text-muted-foreground">Detalles Adicionales</h4>
            <div className="grid gap-2">
              <div className="flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
                <span className="text-sm text-muted-foreground">Con Profesión y Habilidades</span>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {educacion.personasConProfesionYHabilidades}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Solo Profesión</span>
                <Badge variant="secondary">{educacion.personasSoloProfesion}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Habilidades */}
      <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500">
        {/* Gradiente decorativo de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-lime-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-lime-500/10 border-b relative">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">Habilidades</h3>
              <p className="text-sm text-muted-foreground font-normal">
                Destrezas y competencias técnicas
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {educacion.totalHabilidadesCatalogo} tipos
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 relative">
          {/* Estadísticas resumidas mejoradas */}
          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "relative p-4 rounded-2xl overflow-hidden",
              "bg-gradient-to-br from-orange-500/10 to-pink-500/10",
              "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer",
              "border-2 border-transparent hover:border-orange-500/20"
            )}>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Wrench className="w-5 h-5 text-orange-600" />
                  <Badge variant="secondary" className="text-xs">
                    {educacion.familiasConHabilidades} familias
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Con Habilidades</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {educacion.personasConHabilidades.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
            
            <div className={cn(
              "relative p-4 rounded-2xl overflow-hidden",
              "bg-gradient-to-br from-lime-500/10 to-green-500/10",
              "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer",
              "border-2 border-transparent hover:border-lime-500/20"
            )}>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-lime-600" />
                  <Badge variant="outline" className="text-xs bg-lime-50 dark:bg-lime-950/20">
                    Especialistas
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Solo Habilidades</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                  {educacion.personasSoloHabilidades.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico de barras mejorado */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <h4 className="text-sm font-bold">Top Habilidades</h4>
            </div>
            
            <div className="bg-muted/30 rounded-2xl p-4 border-2 border-muted">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart 
                  data={dataHabilidades} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <defs>
                    {COLORS_HABILIDADES.map((color, index) => (
                      <linearGradient key={index} id={`gradient-hab-${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0.4}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--border))"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    dataKey="nombre" 
                    type="category"
                    width={120}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total" 
                    radius={[0, 12, 12, 0]}
                    animationDuration={1500}
                  >
                    {dataHabilidades.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient-hab-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="space-y-3 pt-3 border-t-2 border-dashed border-muted">
            <h4 className="text-sm font-bold text-muted-foreground">Detalles Adicionales</h4>
            <div className="grid gap-2">
              <div className="flex items-center justify-between p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl">
                <span className="text-sm text-muted-foreground">Familias con Habilidades</span>
                <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                  {educacion.familiasConHabilidades}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Sin Profesión ni Habilidades</span>
                <Badge variant="secondary">{educacion.personasSinNinguna}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EducacionVisualizacion
