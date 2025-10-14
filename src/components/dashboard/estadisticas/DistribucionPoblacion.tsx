/**
 * Componente para visualizar distribución por sexo con gráfico de dona
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Poblacion } from "@/types/estadisticas-completas"
import { Users } from "lucide-react"

interface DistribucionPoblacionProps {
  poblacion: Poblacion
  className?: string
}

const DistribucionPoblacion = ({ poblacion, className }: DistribucionPoblacionProps) => {
  // Datos para gráfico de sexo (simulados - en producción sería la distribución completa)
  const dataSexo = [
    { name: "Masculino", value: parseInt(poblacion.distribucionSexo.total), color: "#1e40af" },
    { name: "Femenino", value: poblacion.total - parseInt(poblacion.distribucionSexo.total), color: "#d946ef" }
  ]

  // Datos para estado civil
  const dataEstadoCivil = [
    { 
      name: poblacion.distribucionEstadoCivil.estado_civil, 
      value: parseInt(poblacion.distribucionEstadoCivil.total),
      porcentaje: parseFloat(poblacion.distribucionEstadoCivil.porcentaje)
    }
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Distribución de Población
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Sexo */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Por Sexo</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dataSexo}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataSexo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value} personas`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1e40af]" />
                <span>{poblacion.distribucionSexo.sexo}: {poblacion.distribucionSexo.total}</span>
              </div>
              <div className="text-muted-foreground">
                {poblacion.distribucionSexo.porcentaje}%
              </div>
            </div>
          </div>

          {/* Estado Civil */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Estado Civil</h3>
            <div className="space-y-3 pt-8">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">{poblacion.distribucionEstadoCivil.estado_civil}</span>
                <span className="text-2xl font-bold text-primary">
                  {poblacion.distribucionEstadoCivil.total}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <span className="text-sm text-muted-foreground">Porcentaje del total</span>
                <span className="text-xl font-bold text-primary">
                  {poblacion.distribucionEstadoCivil.porcentaje}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                <span className="text-sm text-muted-foreground">Rango de edad dominante</span>
                <span className="text-sm font-medium">
                  {poblacion.distribucionEdad.rango_edad}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Identificación */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tipo de Identificación</h3>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <span className="font-medium">{poblacion.distribucionTipoIdentificacion.tipo_identificacion}</span>
            <span className="text-2xl font-bold text-primary">
              {poblacion.distribucionTipoIdentificacion.total}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DistribucionPoblacion
