/**
 * Página de Estadísticas Completas del Sistema MIA
 * Visualización integral de datos poblacionales, salud, educación, vivienda y usuarios
 */

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ParishCard } from "@/components/ui/parish-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Loader2, 
  AlertCircle, 
  BarChart3, 
  RefreshCw,
  ArrowLeft,
  Download,
  Calendar
} from "lucide-react"
import { obtenerEstadisticasCompletas } from "@/services/estadisticas-completas"
import type { EstadisticasCompletasDatos } from "@/types/estadisticas-completas"
import { 
  ResumenGeneralCards,
  DistribucionPoblacion,
  SaludVisualizacion,
  EducacionVisualizacion,
  ViviendaVisualizacion,
  UsuariosVisualizacion
} from "@/components/dashboard/estadisticas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const EstadisticasCompletas = () => {
  const navigate = useNavigate()
  const [estadisticas, setEstadisticas] = useState<EstadisticasCompletasDatos | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await obtenerEstadisticasCompletas()
      setEstadisticas(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas del sistema')
    } finally {
      setIsLoading(false)
    }
  }

  // Formatear fecha del timestamp
  const fechaActualizacion = estadisticas 
    ? format(new Date(estadisticas.timestamp), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
    : ""

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8 space-y-8 min-h-screen bg-background/50">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                Estadísticas Completas
              </h1>
              <p className="text-muted-foreground mt-1">
                Análisis integral del sistema MIA
              </p>
            </div>
          </div>
          {estadisticas && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground ml-14">
              <Calendar className="w-4 h-4" />
              <span>Última actualización: {fechaActualizacion}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ml-14 lg:ml-0">
          <Button
            variant="outline"
            size="sm"
            onClick={cargarEstadisticas}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            disabled={!estadisticas}
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <ParishCard variant="elevated" className="border-primary/20">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <div className="text-center">
                <p className="text-lg font-medium">Cargando estadísticas completas...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Esto puede tomar unos segundos
                </p>
              </div>
            </div>
          </CardContent>
        </ParishCard>
      )}

      {/* Estado de error */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error al cargar estadísticas</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p>{error}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={cargarEstadisticas}
              >
                Reintentar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Volver al Dashboard
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Contenido principal - solo se muestra cuando hay datos */}
      {!isLoading && estadisticas && (
        <>
          {/* Resumen General */}
          <ResumenGeneralCards resumen={estadisticas.resumen} />

          {/* Tabs de categorías */}
          <Tabs defaultValue="poblacion" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 h-auto p-2">
              <TabsTrigger value="poblacion" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Población
              </TabsTrigger>
              <TabsTrigger value="salud" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Salud
              </TabsTrigger>
              <TabsTrigger value="educacion" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Educación
              </TabsTrigger>
              <TabsTrigger value="vivienda" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Vivienda
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="geografia" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Geografía
              </TabsTrigger>
            </TabsList>

            {/* Contenido de Población */}
            <TabsContent value="poblacion" className="space-y-6">
              <DistribucionPoblacion poblacion={estadisticas.poblacion} />
              
              {/* Tarjeta de Familias */}
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Familias</CardTitle>
                  <CardDescription>
                    Información sobre composición y distribución familiar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Familias</p>
                      <p className="text-2xl font-bold text-primary">{estadisticas.familias.total}</p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Promedio Miembros</p>
                      <p className="text-2xl font-bold text-secondary">
                        {estadisticas.familias.promedioMiembrosPorFamilia.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Máx. Miembros</p>
                      <p className="text-2xl font-bold text-green-600">
                        {estadisticas.familias.maxMiembrosPorFamilia}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Mín. Miembros</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {estadisticas.familias.minMiembrosPorFamilia}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Con Difuntos</p>
                      <p className="text-2xl font-bold">
                        {estadisticas.familias.familiasConDifuntos}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contenido de Salud */}
            <TabsContent value="salud" className="space-y-6">
              <SaludVisualizacion salud={estadisticas.salud} />
            </TabsContent>

            {/* Contenido de Educación */}
            <TabsContent value="educacion" className="space-y-6">
              <EducacionVisualizacion educacion={estadisticas.educacion} />
            </TabsContent>

            {/* Contenido de Vivienda */}
            <TabsContent value="vivienda" className="space-y-6">
              <ViviendaVisualizacion vivienda={estadisticas.vivienda} />
            </TabsContent>

            {/* Contenido de Usuarios */}
            <TabsContent value="usuarios" className="space-y-6">
              <UsuariosVisualizacion usuarios={estadisticas.usuarios} />
            </TabsContent>

            {/* Contenido de Geografía */}
            <TabsContent value="geografia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución Geográfica</CardTitle>
                  <CardDescription>
                    Cobertura territorial del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Departamentos</p>
                      <p className="text-2xl font-bold text-primary">
                        {estadisticas.geografia.total.departamentos}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Municipios</p>
                      <p className="text-2xl font-bold text-secondary">
                        {estadisticas.geografia.total.municipios}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Parroquias</p>
                      <p className="text-2xl font-bold text-green-600">
                        {estadisticas.geografia.total.parroquias}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Sectores</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {estadisticas.geografia.total.sectores}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Veredas</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {estadisticas.geografia.total.veredas}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                      Distribución Principal
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg">
                        <span className="font-medium">Departamento</span>
                        <span className="text-xl font-bold text-primary">
                          {estadisticas.geografia.distribucion.departamento}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/10 to-transparent rounded-lg">
                        <span className="font-medium">Municipios Cubiertos</span>
                        <span className="text-xl font-bold text-secondary">
                          {estadisticas.geografia.distribucion.municipios}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg">
                        <span className="font-medium">Parroquias Activas</span>
                        <span className="text-xl font-bold text-green-600">
                          {estadisticas.geografia.distribucion.parroquias}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg">
                        <span className="font-medium">Familias Registradas</span>
                        <span className="text-xl font-bold text-blue-600">
                          {estadisticas.geografia.distribucion.familias}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Catálogos del Sistema */}
              <Card>
                <CardHeader>
                  <CardTitle>Catálogos del Sistema</CardTitle>
                  <CardDescription>
                    Información sobre los catálogos disponibles en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Sexos</p>
                      <p className="text-2xl font-bold text-primary">{estadisticas.catalogos.sexos}</p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Estados Civiles</p>
                      <p className="text-2xl font-bold text-secondary">{estadisticas.catalogos.situacionesCiviles}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Profesiones</p>
                      <p className="text-2xl font-bold text-green-600">{estadisticas.catalogos.profesiones}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Habilidades</p>
                      <p className="text-2xl font-bold text-blue-600">{estadisticas.catalogos.habilidades}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Enfermedades</p>
                      <p className="text-2xl font-bold text-purple-600">{estadisticas.catalogos.enfermedades}</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Parentescos</p>
                      <p className="text-2xl font-bold text-pink-600">{estadisticas.catalogos.parentescos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

export default EstadisticasCompletas
