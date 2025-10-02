import { AlertTriangle, RefreshCw, WifiOff, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ConfigurationData } from "@/hooks/useConfigurationData";

interface FormDataLoadingErrorProps {
  /** Datos de configuración con estados de error */
  configurationData: ConfigurationData;
  /** Función para reintentar carga de todos los servicios */
  onRetryAll?: () => void;
  /** Mostrar solo errores críticos */
  criticalOnly?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente que muestra errores específicos cuando fallan servicios críticos 
 * para el formulario de encuestas
 */
const FormDataLoadingError = ({
  configurationData,
  onRetryAll,
  criticalOnly = false,
  className
}: FormDataLoadingErrorProps) => {

  // Servicios críticos que impiden el funcionamiento del formulario
  const criticalServices = [
    {
      key: 'municipios',
      name: 'Municipios',
      error: configurationData.municipiosError,
      loading: configurationData.municipiosLoading,
      description: 'Necesario para ubicación geográfica'
    },
    {
      key: 'parroquias', 
      name: 'Parroquias',
      error: configurationData.parroquiasError,
      loading: configurationData.parroquiasLoading,
      description: 'Necesario para identificar la parroquia'
    },
    {
      key: 'sectores',
      name: 'Sectores',
      error: configurationData.sectoresError,
      loading: configurationData.sectoresLoading,
      description: 'Necesario para ubicación dentro de la parroquia'
    }
  ];

  // Servicios no críticos pero importantes
  const nonCriticalServices = [
    {
      key: 'veredas',
      name: 'Veredas',
      error: configurationData.veredasError,
      loading: configurationData.veredasLoading,
      description: 'Ubicación rural opcional'
    },
    {
      key: 'tiposVivienda',
      name: 'Tipos de Vivienda',
      error: configurationData.tiposViviendaError,
      loading: configurationData.tiposViviendaLoading,
      description: 'Información de vivienda'
    },
    {
      key: 'disposicionBasura',
      name: 'Disposición de Basura',
      error: configurationData.disposicionBasuraError,
      loading: configurationData.disposicionBasuraLoading,
      description: 'Manejo de residuos'
    },
    {
      key: 'aguasResiduales',
      name: 'Aguas Residuales',
      error: configurationData.aguasResidualesError,
      loading: configurationData.aguasResidualesLoading,
      description: 'Servicios de saneamiento'
    },
    {
      key: 'sistemasAcueducto',
      name: 'Sistemas de Acueducto',
      error: configurationData.sistemasAcueductoError,
      loading: configurationData.sistemasAcueductoLoading,
      description: 'Servicios de agua'
    },
    {
      key: 'sexos',
      name: 'Sexos',
      error: configurationData.sexosError,
      loading: configurationData.sexosLoading,
      description: 'Información demográfica'
    },
    {
      key: 'estadosCiviles',
      name: 'Estados Civiles',
      error: configurationData.situacionesCivilesError,
      loading: configurationData.situacionesCivilesLoading,
      description: 'Información personal'
    }
  ];

  // Filtrar servicios con errores
  const failedCriticalServices = criticalServices.filter(service => service.error && !service.loading);
  const failedNonCriticalServices = nonCriticalServices.filter(service => service.error && !service.loading);

  const allFailedServices = [...failedCriticalServices, ...failedNonCriticalServices];
  const servicesToShow = criticalOnly ? failedCriticalServices : allFailedServices;

  // Si no hay errores, no mostrar nada
  if (servicesToShow.length === 0) {
    return null;
  }

  // Determinar el nivel de severidad
  const hasCriticalErrors = failedCriticalServices.length > 0;
  const severity = hasCriticalErrors ? 'critical' : 'warning';

  return (
    <Card className={cn(
      "border-2 shadow-lg",
      severity === 'critical' 
        ? "border-destructive/30 bg-destructive/5 dark:bg-destructive/10" 
        : "border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/10",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            severity === 'critical' 
              ? "bg-destructive/10 text-destructive" 
              : "bg-orange-500/10 text-orange-600"
          )}>
            {hasCriticalErrors ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <WifiOff className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className={cn(
              "text-lg font-bold",
              severity === 'critical' 
                ? "text-destructive" 
                : "text-orange-600 dark:text-orange-500"
            )}>
              {severity === 'critical' 
                ? "Error Crítico en Carga de Datos" 
                : "Advertencia: Algunos Servicios No Disponibles"}
            </CardTitle>
            <CardDescription className={cn(
              "text-sm mt-1",
              severity === 'critical' 
                ? "text-destructive/80" 
                : "text-orange-600/80 dark:text-orange-500/80"
            )}>
              {severity === 'critical' 
                ? "No se pueden cargar datos esenciales para el formulario" 
                : "El formulario funcionará con limitaciones"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Lista de servicios fallidos */}
        <div className="space-y-3">
          {servicesToShow.map((service) => (
            <Alert 
              key={service.key}
              variant={failedCriticalServices.includes(service) ? "destructive" : "default"}
              className={cn(
                "border border-border bg-background/50",
                failedCriticalServices.includes(service) 
                  ? "border-destructive/20" 
                  : "border-orange-500/20"
              )}
            >
              <Server className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <span className="font-semibold">{service.name}:</span> {service.description}
                <br />
                <span className="text-sm text-muted-foreground">
                  Error: {typeof service.error === 'string' ? service.error : service.error?.message || 'Error desconocido en el servicio'}
                </span>
              </AlertDescription>
            </Alert>
          ))}
        </div>

        {/* Información sobre el impacto */}
        {hasCriticalErrors && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>Impacto:</strong> Sin estos datos críticos, no se puede continuar con la encuesta. 
              Los campos afectados aparecerán deshabilitados o con opciones limitadas.
            </AlertDescription>
          </Alert>
        )}

        {/* Botón para reintentar */}
        {onRetryAll && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={onRetryAll}
              className={cn(
                "font-semibold",
                severity === 'critical'
                  ? "border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  : "border-orange-500/30 text-orange-600 hover:bg-orange-500 hover:text-white"
              )}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar Carga de Datos
            </Button>
          </div>
        )}

        {/* Información de ayuda */}
        <div className="text-xs text-muted-foreground text-center border-t pt-3">
          Si el problema persiste, verifique su conexión a internet o contacte al administrador del sistema.
        </div>
      </CardContent>
    </Card>
  );
};

export default FormDataLoadingError;