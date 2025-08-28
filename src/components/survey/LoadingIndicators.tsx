import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ConfigurationData } from "@/hooks/useConfigurationData";

interface LoadingIndicatorsProps {
  configurationData: ConfigurationData;
}

/**
 * Componente reutilizable para mostrar indicadores de carga de datos de configuración
 */
const LoadingIndicators = ({ configurationData }: LoadingIndicatorsProps) => {
  if (!configurationData.isAnyLoading) {
    return null;
  }

  const loadingStates = [
    { loading: configurationData.tiposIdentificacionLoading, key: "tipos-id", label: "Tipos ID" },
    { loading: configurationData.sexosLoading, key: "sexos", label: "Sexos" },
    { loading: configurationData.parentescosLoading, key: "parentescos", label: "Parentescos" },
    { loading: configurationData.situacionesCivilesLoading, key: "estado-civil", label: "Estado Civil" },
    { loading: configurationData.estudiosLoading, key: "estudios", label: "Estudios" },
    { loading: configurationData.profesionesLoading, key: "profesiones", label: "Profesiones" },
    { loading: configurationData.enfermedadesLoading, key: "enfermedades", label: "Enfermedades" },
    { loading: configurationData.comunidadesCulturalesLoading, key: "comunidades", label: "Comunidades" }
  ];

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-200 dark:bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 text-sm text-amber-800 dark:text-amber-800">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">Cargando datos para el formulario...</span>
          <div className="flex items-center gap-2 text-xs">
            {loadingStates
              .filter(state => state.loading)
              .map(state => (
                <span 
                  key={state.key} 
                  className="bg-amber-200 px-2 py-1 rounded dark:bg-amber-200"
                >
                  {state.label}
                </span>
              ))
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingIndicators;
