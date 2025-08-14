import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Lock, AlertTriangle } from 'lucide-react';

// Import the services we want to test
import { departamentosService } from '@/services/departamentos';
import { TiposIdentificacionService } from '@/services/tipos-identificacion';
import { MunicipiosService } from '@/services/municipios';
import { SistemasAcueductoService } from '@/services/sistemas-acueducto';
import { TallasService } from '@/services/tallas';
import { ParentescosService } from '@/services/parentescos';
import { SexosService } from '@/services/sexos';
import { estudiosService } from '@/services/estudios';
import { AguasResidualesService } from '@/services/aguas-residuales';

interface ServiceTestResult {
  name: string;
  status: 'working' | 'auth-required' | 'error' | 'not-found';
  message: string;
  count?: number;
  data?: any[];
}

const ConfigurationDemo: React.FC = () => {
  // Test queries for each service
  const departamentosQuery = useQuery({
    queryKey: ['test-departamentos'],
    queryFn: departamentosService.getAll,
    retry: false,
  });

  const tiposIdQuery = useQuery({
    queryKey: ['test-tipos-identificacion'],
    queryFn: tiposIdentificacionService.getAll,
    retry: false,
  });

  const municipiosQuery = useQuery({
    queryKey: ['test-municipios'],
    queryFn: municipiosService.getAll,
    retry: false,
  });

  const sistemasQuery = useQuery({
    queryKey: ['test-sistemas-acueducto'],
    queryFn: sistemasAcueductoService.getAll,
    retry: false,
  });

  const tallasQuery = useQuery({
    queryKey: ['test-tallas'],
    queryFn: tallasService.getAll,
    retry: false,
  });

  const parentescosQuery = useQuery({
    queryKey: ['test-parentescos'],
    queryFn: parentescosService.getAll,
    retry: false,
  });

  const sexosQuery = useQuery({
    queryKey: ['test-sexos'],
    queryFn: sexosService.getAll,
    retry: false,
  });

  const estudiosQuery = useQuery({
    queryKey: ['test-estudios'],
    queryFn: estudiosService.getAll,
    retry: false,
  });

  const aguasQuery = useQuery({
    queryKey: ['test-aguas-residuales'],
    queryFn: aguasResidualesService.getAll,
    retry: false,
  });

  // Process results
  const processResult = (query: any, name: string): ServiceTestResult => {
    if (query.isLoading) {
      return { name, status: 'working', message: 'Cargando...' };
    }
    
    if (query.isError) {
      const error = query.error as any;
      if (error?.response?.status === 401) {
        return { name, status: 'auth-required', message: 'Requiere autenticación' };
      }
      if (error?.response?.status === 404) {
        return { name, status: 'not-found', message: 'Servicio no encontrado (404)' };
      }
      return { name, status: 'error', message: error?.message || 'Error desconocido' };
    }
    
    if (query.isSuccess) {
      const count = Array.isArray(query.data) ? query.data.length : 
                   query.data?.data ? (Array.isArray(query.data.data) ? query.data.data.length : Object.keys(query.data.data).length) : 0;
      const data = Array.isArray(query.data) ? query.data.slice(0, 3) : 
                  query.data?.data ? (Array.isArray(query.data.data) ? query.data.data.slice(0, 3) : query.data.data) : null;
      return { 
        name, 
        status: 'working', 
        message: `Funcionando correctamente - ${count} registros`,
        count,
        data
      };
    }
    
    return { name, status: 'error', message: 'Estado desconocido' };
  };

  const results: ServiceTestResult[] = [
    processResult(departamentosQuery, 'Departamentos (Nuevo)'),
    processResult(municipiosQuery, 'Municipios'),
    processResult(tiposIdQuery, 'Tipos de Identificación'),
    processResult(sistemasQuery, 'Sistemas de Acueducto (Nuevo)'),
    processResult(tallasQuery, 'Tallas (Nuevo)'),
    processResult(parentescosQuery, 'Parentescos'),
    processResult(sexosQuery, 'Sexos'),
    processResult(estudiosQuery, 'Estudios'),
    processResult(aguasQuery, 'Aguas Residuales'),
  ];

  const getStatusIcon = (status: ServiceTestResult['status']) => {
    switch (status) {
      case 'working': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'auth-required': return <Lock className="h-4 w-4 text-yellow-500" />;
      case 'not-found': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ServiceTestResult['status']) => {
    switch (status) {
      case 'working': return <Badge variant="default" className="bg-green-500">Funcionando</Badge>;
      case 'auth-required': return <Badge variant="secondary">Auth Requerida</Badge>;
      case 'not-found': return <Badge variant="destructive">404 - No Encontrado</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
    }
  };

  const workingServices = results.filter(r => r.status === 'working');
  const authServices = results.filter(r => r.status === 'auth-required');
  const notFoundServices = results.filter(r => r.status === 'not-found');
  const errorServices = results.filter(r => r.status === 'error');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">🔧 Validación de Servicios de Configuración</h1>
        <p className="text-muted-foreground">
          Prueba en vivo de todos los servicios de configuración implementados
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionando</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{workingServices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requieren Auth</CardTitle>
            <Lock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{authServices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Encontrados</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{notFoundServices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{results.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Resultados Detallados</CardTitle>
          <CardDescription>
            Estado actual de cada servicio de configuración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className="font-semibold">{result.name}</h3>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.data && result.status === 'working' && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Datos de ejemplo:</p>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 max-w-md overflow-hidden">
                          {JSON.stringify(result.data, null, 2).slice(0, 200)}...
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {result.count !== undefined && (
                    <Badge variant="outline">{result.count} registros</Badge>
                  )}
                  {getStatusBadge(result.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>🆕 Servicios Nuevos Implementados</CardTitle>
          <CardDescription>
            Los 3 servicios nuevos que se implementaron en esta sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.filter(r => r.name.includes('(Nuevo)')).map((result, index) => (
              <Card key={index} className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <CardTitle className="text-lg">{result.name.replace(' (Nuevo)', '')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                  {getStatusBadge(result.status)}
                  {result.status === 'working' && result.count && (
                    <p className="text-sm mt-2 text-green-600 font-semibold">
                      ✅ {result.count} registros cargados exitosamente
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationDemo;
