import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConfigurationData } from '@/hooks/useConfigurationData';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const TestServices: React.FC = () => {
  const configurationData = useConfigurationData();

  const services = [
    {
      name: 'Sectores',
      options: configurationData.sectorOptions,
      loading: configurationData.sectoresLoading,
      error: configurationData.sectoresError,
    },
    {
      name: 'Tipos de Identificación',
      options: configurationData.tiposIdentificacionOptions,
      loading: configurationData.tiposIdentificacionLoading,
      error: configurationData.tiposIdentificacionError,
    },
    {
      name: 'Sexos',
      options: configurationData.sexoOptions,
      loading: configurationData.sexosLoading,
      error: configurationData.sexosError,
    },
    {
      name: 'Parentescos',
      options: configurationData.parentescosOptions,
      loading: configurationData.parentescosLoading,
      error: configurationData.parentescosError,
    },
    {
      name: 'Estados Civiles',
      options: configurationData.estadoCivilOptions,
      loading: configurationData.estadosCivilesLoading,
      error: configurationData.estadosCivilesError,
    },
    {
      name: 'Estudios',
      options: configurationData.estudiosOptions,
      loading: configurationData.estudiosLoading,
      error: configurationData.estudiosError,
    },
    {
      name: 'Profesiones',
      options: configurationData.profesionesOptions,
      loading: configurationData.profesionesLoading,
      error: configurationData.profesionesError,
    },
    {
      name: 'Enfermedades',
      options: configurationData.enfermedadesOptions,
      loading: configurationData.enfermedadesLoading,
      error: configurationData.enfermedadesError,
    },
    {
      name: 'Comunidades Culturales',
      options: configurationData.comunidadesCulturalesOptions,
      loading: configurationData.comunidadesCulturalesLoading,
      error: configurationData.comunidadesCulturalesError,
    },
    {
      name: 'Aguas Residuales',
      options: configurationData.aguasResidualesOptions,
      loading: configurationData.aguasResidualesLoading,
      error: configurationData.aguasResidualesError,
    },
    {
      name: 'Tipos de Vivienda',
      options: configurationData.tipoViviendaOptions,
      loading: configurationData.tiposViviendaLoading,
      error: configurationData.tiposViviendaError,
    },
    {
      name: 'Disposición de Basura',
      options: configurationData.disposicionBasuraOptions,
      loading: configurationData.disposicionBasuraLoading,
      error: configurationData.disposicionBasuraError,
    },
    {
      name: 'Departamentos',
      options: configurationData.departamentoOptions,
      loading: configurationData.departamentosLoading,
      error: configurationData.departamentosError,
    },
    {
      name: 'Municipios',
      options: configurationData.municipioOptions,
      loading: configurationData.municipiosLoading,
      error: configurationData.municipiosError,
    },
    {
      name: 'Parroquias',
      options: configurationData.parroquiaOptions,
      loading: configurationData.parroquiasLoading,
      error: configurationData.parroquiasError,
    },
    {
      name: 'Veredas',
      options: configurationData.veredaOptions,
      loading: configurationData.veredasLoading,
      error: configurationData.veredasError,
    },
    {
      name: 'Sistemas de Acueducto',
      options: configurationData.sistemasAcueductoOptions,
      loading: configurationData.sistemasAcueductoLoading,
      error: configurationData.sistemasAcueductoError,
    },
    {
      name: 'Tallas',
      options: configurationData.tallasOptions,
      loading: configurationData.tallasLoading,
      error: configurationData.tallasError,
    },
  ];

  const getStatusIcon = (loading: boolean, error: any, options: any[]) => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (error) return <XCircle className="w-4 h-4 text-red-500" />;
    if (options.length > 0) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-orange-500" />;
  };

  const getStatusText = (loading: boolean, error: any, options: any[]) => {
    if (loading) return "Cargando...";
    if (error) return `Error: ${error?.message || 'Desconocido'}`;
    if (options.length > 0) return `${options.length} opciones`;
    return "Sin datos";
  };

  const getStatusColor = (loading: boolean, error: any, options: any[]) => {
    if (loading) return "bg-blue-100 text-blue-800";
    if (error) return "bg-red-100 text-red-800";
    if (options.length > 0) return "bg-green-100 text-green-800";
    return "bg-orange-100 text-orange-800";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Test de Servicios</h1>
        <p className="text-gray-600 mt-2">
          Estado de todos los servicios de configuración implementados
        </p>
      </div>

      {/* Resumen General */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => !s.loading && !s.error && s.options.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Funcionando</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {services.filter(s => s.loading).length}
              </div>
              <div className="text-sm text-gray-600">Cargando</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {services.filter(s => s.error).length}
              </div>
              <div className="text-sm text-gray-600">Con Error</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {services.filter(s => !s.loading && !s.error && s.options.length === 0).length}
              </div>
              <div className="text-sm text-gray-600">Sin Datos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {service.name}
                {getStatusIcon(service.loading, service.error, service.options)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant="outline" 
                className={`w-full justify-center py-1 ${getStatusColor(service.loading, service.error, service.options)}`}
              >
                {getStatusText(service.loading, service.error, service.options)}
              </Badge>
              
              {service.options.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">Primeras opciones:</div>
                  <div className="space-y-1">
                    {service.options.slice(0, 3).map((option, i) => (
                      <div key={i} className="text-xs bg-gray-50 px-2 py-1 rounded truncate">
                        <span className="font-mono text-blue-600">{option.value}</span>
                        <span className="text-gray-600"> - {option.label}</span>
                      </div>
                    ))}
                    {service.options.length > 3 && (
                      <div className="text-xs text-gray-400 italic">
                        ... y {service.options.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )}

              {service.error && (
                <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
                  <strong>Error:</strong> {service.error?.message || 'Error desconocido'}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información de Estados */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>ℹ️ Información de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Estados Globales:</h4>
              <div className="space-y-1">
                <div>
                  <Badge variant={configurationData.isAnyLoading ? "default" : "outline"}>
                    Cargando: {configurationData.isAnyLoading ? "SÍ" : "NO"}
                  </Badge>
                </div>
                <div>
                  <Badge variant={configurationData.hasAnyError ? "destructive" : "outline"}>
                    Error: {configurationData.hasAnyError ? "SÍ" : "NO"}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Total de Opciones:</h4>
              <div className="text-lg font-bold text-blue-600">
                {services.reduce((total, service) => total + service.options.length, 0)} opciones
              </div>
              <div className="text-xs text-gray-500">
                En {services.filter(s => s.options.length > 0).length} servicios activos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestServices;
