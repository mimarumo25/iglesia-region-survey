/**
 * Componente para visualizar estadísticas de vivienda
 * Versión mejorada con gráficos interactivos y animaciones
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Vivienda } from "@/types/estadisticas-completas"
import { Home, Droplets, Waves, Building2, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViviendaVisualizacionProps {
  vivienda: Vivienda
  className?: string
}

const ViviendaVisualizacion = ({ vivienda, className }: ViviendaVisualizacionProps) => {
  // Estados para efectos hover en los gráficos
  const [activeIndexVivienda, setActiveIndexVivienda] = useState<number | undefined>()
  const [activeIndexAcueducto, setActiveIndexAcueducto] = useState<number | undefined>()
  const [activeIndexAguas, setActiveIndexAguas] = useState<number | undefined>()

  // Paleta de colores altamente contrastantes para máxima diferenciación
  const COLORS = [
    '#ef4444', // rojo brillante
    '#3b82f6', // azul brillante
    '#10b981', // verde esmeralda
    '#f59e0b', // ámbar/naranja
    '#8b5cf6', // violeta
    '#ec4899', // rosa/magenta
    '#06b6d4', // cyan
    '#84cc16'  // lima brillante
  ]

  // Preparar datos de tipos de vivienda (solo los que tienen familias)
  const dataTiposVivienda = vivienda.distribucionPorTipoVivienda
    .filter(tipo => parseInt(tipo.total_familias) > 0)
    .map((tipo, index) => ({
      name: tipo.tipo_vivienda,
      value: parseInt(tipo.total_familias),
      porcentaje: parseFloat(tipo.porcentaje),
      color: COLORS[index % COLORS.length]
    }))

  // Preparar datos de acueducto (solo los que tienen familias)
  const dataAcueducto = vivienda.distribucionPorAcueducto
    .filter(acu => parseInt(acu.total_familias) > 0)
    .map((acu, index) => ({
      name: acu.sistema_acueducto,
      value: parseInt(acu.total_familias),
      porcentaje: parseFloat(acu.porcentaje),
      color: COLORS[index % COLORS.length]
    }))

  // Preparar datos de aguas residuales (solo los que tienen familias)
  const dataAguasResiduales = vivienda.distribucionPorAguasResiduales
    .filter(agua => parseInt(agua.total_familias) > 0)
    .map((agua, index) => ({
      name: agua.tipo_aguas_residuales,
      value: parseInt(agua.total_familias),
      porcentaje: parseFloat(agua.porcentaje),
      color: COLORS[index % COLORS.length]
    }))

  // Custom Tooltip mejorado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-sm mb-2">{payload[0].name}</p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center justify-between gap-4">
              <span>Familias:</span>
              <span className="font-bold text-primary">{payload[0].value}</span>
            </p>
            <p className="text-xs text-muted-foreground flex items-center justify-between gap-4">
              <span>Porcentaje:</span>
              <span className="font-bold text-secondary">{payload[0].payload.porcentaje.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom Label para los gráficos de pie
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, porcentaje, index }: any) => {
    if (porcentaje < 5) return null // No mostrar labels para porciones muy pequeñas
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
        style={{ 
          textShadow: '0 0 3px rgba(0,0,0,0.5)',
          fontSize: '12px'
        }}
      >
        {`${porcentaje.toFixed(1)}%`}
      </text>
    )
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border-b">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-xl">
            <Home className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">Vivienda y Servicios</h3>
            <p className="text-sm text-muted-foreground font-normal">
              Análisis de infraestructura y servicios básicos
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {vivienda.totalFamilias} familias
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Resumen general mejorado */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Familias",
              value: vivienda.totalFamilias,
              icon: Home,
              gradient: "from-blue-500 to-blue-600",
              iconBg: "bg-blue-500/10",
              iconColor: "text-blue-600"
            },
            {
              label: "Tipos de Vivienda",
              value: vivienda.resumenCategorias.tiposVivienda,
              icon: Building2,
              gradient: "from-orange-500 to-orange-600",
              iconBg: "bg-orange-500/10",
              iconColor: "text-orange-600"
            },
            {
              label: "Sistemas Acueducto",
              value: vivienda.resumenCategorias.sistemasAcueducto,
              icon: Droplets,
              gradient: "from-cyan-500 to-cyan-600",
              iconBg: "bg-cyan-500/10",
              iconColor: "text-cyan-600"
            },
            {
              label: "Aguas Residuales",
              value: vivienda.resumenCategorias.tiposAguasResiduales,
              icon: Waves,
              gradient: "from-purple-500 to-purple-600",
              iconBg: "bg-purple-500/10",
              iconColor: "text-purple-600"
            }
          ].map((stat, index) => {
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
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  "bg-gradient-to-br blur-2xl -z-10",
                  stat.gradient
                )} />
                
                <div className="relative space-y-3">
                  <div className={cn(
                    "p-2 rounded-xl w-fit transition-transform group-hover:scale-110 group-hover:rotate-6",
                    stat.iconBg
                  )}>
                    <Icon className={cn("w-5 h-5", stat.iconColor)} />
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

        {/* Gráficos en grid mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tipos de Vivienda */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-muted">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">Tipos de Vivienda</h3>
                <p className="text-xs text-muted-foreground">Distribución por tipo</p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                {dataTiposVivienda.length}
              </Badge>
            </div>
            
            {dataTiposVivienda.length > 0 ? (
              <>
                <div className="bg-muted/30 rounded-2xl p-4 border-2 border-muted">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={dataTiposVivienda}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={renderCustomLabel}
                        activeIndex={activeIndexVivienda}
                        onMouseEnter={(_, index) => setActiveIndexVivienda(index)}
                        onMouseLeave={() => setActiveIndexVivienda(undefined)}
                      >
                        {dataTiposVivienda.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            className="transition-all duration-300"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {dataTiposVivienda.map((tipo, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        "hover:bg-muted/50 transition-colors cursor-pointer group",
                        activeIndexVivienda === index && "bg-primary/10"
                      )}
                      onMouseEnter={() => setActiveIndexVivienda(index)}
                      onMouseLeave={() => setActiveIndexVivienda(undefined)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full transition-transform group-hover:scale-125" 
                          style={{ backgroundColor: tipo.color }} 
                        />
                        <span className="text-sm font-medium">{tipo.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tipo.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
              </div>
            )}
          </div>

          {/* Sistema de Acueducto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-muted">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Droplets className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">Sistema de Acueducto</h3>
                <p className="text-xs text-muted-foreground">Acceso a agua potable</p>
              </div>
              <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs">
                {dataAcueducto.length}
              </Badge>
            </div>
            
            {dataAcueducto.length > 0 ? (
              <>
                <div className="bg-muted/30 rounded-2xl p-4 border-2 border-muted">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={dataAcueducto}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={renderCustomLabel}
                        activeIndex={activeIndexAcueducto}
                        onMouseEnter={(_, index) => setActiveIndexAcueducto(index)}
                        onMouseLeave={() => setActiveIndexAcueducto(undefined)}
                      >
                        {dataAcueducto.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            className="transition-all duration-300"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {dataAcueducto.map((acu, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        "hover:bg-muted/50 transition-colors cursor-pointer group",
                        activeIndexAcueducto === index && "bg-primary/10"
                      )}
                      onMouseEnter={() => setActiveIndexAcueducto(index)}
                      onMouseLeave={() => setActiveIndexAcueducto(undefined)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full transition-transform group-hover:scale-125" 
                          style={{ backgroundColor: acu.color }} 
                        />
                        <span className="text-sm font-medium">{acu.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {acu.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
              </div>
            )}
          </div>

          {/* Aguas Residuales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-dashed border-muted">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Waves className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">Aguas Residuales</h3>
                <p className="text-xs text-muted-foreground">Manejo de desechos</p>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs">
                {dataAguasResiduales.length}
              </Badge>
            </div>
            
            {dataAguasResiduales.length > 0 ? (
              <>
                <div className="bg-muted/30 rounded-2xl p-4 border-2 border-muted">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={dataAguasResiduales}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={renderCustomLabel}
                        activeIndex={activeIndexAguas}
                        onMouseEnter={(_, index) => setActiveIndexAguas(index)}
                        onMouseLeave={() => setActiveIndexAguas(undefined)}
                      >
                        {dataAguasResiduales.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            className="transition-all duration-300"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {dataAguasResiduales.map((agua, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        "hover:bg-muted/50 transition-colors cursor-pointer group",
                        activeIndexAguas === index && "bg-primary/10"
                      )}
                      onMouseEnter={() => setActiveIndexAguas(index)}
                      onMouseLeave={() => setActiveIndexAguas(undefined)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full transition-transform group-hover:scale-125" 
                          style={{ backgroundColor: agua.color }} 
                        />
                        <span className="text-sm font-medium">{agua.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {agua.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ViviendaVisualizacion
