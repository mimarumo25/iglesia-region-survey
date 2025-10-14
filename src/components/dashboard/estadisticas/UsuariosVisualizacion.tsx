/**
 * Componente para visualizar estadísticas de usuarios y roles
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Usuarios } from "@/types/estadisticas-completas"
import { Users, Shield, UserCheck, UserX, Mail, Ban } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UsuariosVisualizacionProps {
  usuarios: Usuarios
  className?: string
}

const UsuariosVisualizacion = ({ usuarios, className }: UsuariosVisualizacionProps) => {
  // Colores para el gráfico de roles
  const COLORS = ['#1e40af', '#d97706', '#10b981', '#f59e0b', '#8b5cf6']

  // Preparar datos para gráfico de roles
  const dataRoles = usuarios.distribucionPorRol.map((rol, index) => ({
    name: rol.rol,
    value: rol.totalUsuarios,
    porcentaje: rol.porcentaje,
    color: COLORS[index % COLORS.length]
  }))

  // Estadísticas principales
  const estadisticasPrincipales = [
    {
      label: "Total Usuarios",
      value: usuarios.totalUsuarios,
      icon: Users,
      color: "bg-primary/10 text-primary"
    },
    {
      label: "Usuarios Activos",
      value: usuarios.usuariosActivos,
      icon: UserCheck,
      color: "bg-success/10 text-success"
    },
    {
      label: "Usuarios Inactivos",
      value: usuarios.usuariosInactivos,
      icon: UserX,
      color: "bg-muted text-muted-foreground"
    },
    {
      label: "Emails Verificados",
      value: usuarios.emailsVerificados,
      icon: Mail,
      color: "bg-blue-50 text-blue-600"
    },
    {
      label: "Usuarios Bloqueados",
      value: usuarios.usuariosBloqueados,
      icon: Ban,
      color: "bg-destructive/10 text-destructive"
    },
    {
      label: "Total Roles",
      value: usuarios.totalRoles,
      icon: Shield,
      color: "bg-secondary/10 text-secondary"
    }
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Usuarios y Roles del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {estadisticasPrincipales.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${stat.color} transition-transform hover:scale-105`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Grid con gráfico y detalles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de distribución de roles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Distribución por Rol
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataRoles}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, porcentaje }) => `${name}: ${porcentaje.toFixed(1)}%`}
                >
                  {dataRoles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value} usuarios`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Leyenda personalizada */}
            <div className="space-y-2">
              {usuarios.top5RolesMasUsados.map((rol, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{rol.rol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{rol.usuarios}</span>
                    <Badge variant="secondary" className="text-xs">
                      {rol.porcentaje.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalles de roles */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Roles en Uso</p>
                <p className="text-2xl font-bold text-primary">{usuarios.rolesEnUso}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Roles Sin Asignar</p>
                <p className="text-2xl font-bold">{usuarios.rolesSinAsignar}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Roles Sin Usuarios ({usuarios.rolesSinUsuarios.length})
              </h3>
              <ScrollArea className="h-[200px] w-full rounded-lg border p-3 bg-muted/20">
                <div className="flex flex-wrap gap-2">
                  {usuarios.rolesSinUsuarios.map((rol, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs"
                    >
                      {rol}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Estadísticas adicionales */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Usuarios con Múltiples Roles</span>
                <span className="font-semibold">{usuarios.usuariosConMultiplesRoles}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <span className="text-sm font-medium">Tasa de Verificación de Emails</span>
                <span className="text-lg font-bold text-primary">
                  {((usuarios.emailsVerificados / usuarios.totalUsuarios) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UsuariosVisualizacion
