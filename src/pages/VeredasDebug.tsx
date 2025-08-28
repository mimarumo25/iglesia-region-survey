/**
 * Componente de debug temporal para veredas
 * Permite ver el estado actual y proporciona información sobre el problema
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Bug, 
  CheckCircle, 
  XCircle,
  MapPin,
  Database,
  Settings,
  Wrench
} from 'lucide-react';

const VeredasDebugPage = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [testing, setTesting] = useState(false);

  const runDiagnostic = async () => {
    setTesting(true);
    try {
      // Simular diagnóstico (en un caso real, esto haría llamadas a la API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDebugInfo({
        apiEndpoint: {
          url: '/api/catalog/veredas',
          status: 'accessible',
          method: 'GET'
        },
        creation: {
          status: 'working',
          message: 'Las veredas se pueden crear exitosamente'
        },
        consultation: {
          status: 'failed',
          message: 'Las consultas GET devuelven 0 registros'
        },
        permissions: {
          status: 'blocked',
          message: 'Usuario actual no tiene permisos de admin'
        },
        lastTest: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bug className="w-8 h-8 text-orange-500" />
          Debug: Problema de Veredas
        </h1>
        <p className="text-muted-foreground mt-2">
          Diagnóstico y información sobre el problema de visualización de veredas
        </p>
      </div>

      {/* Problema Identificado */}
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Problema Identificado</AlertTitle>
        <AlertDescription className="text-red-700">
          <strong>Las veredas no se visualizan debido a dos problemas:</strong>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li><strong>Permisos:</strong> Usuario actual (Encuestador) no puede acceder a configuración de veredas</li>
            <li><strong>API Backend:</strong> Bug en endpoints de consulta - las veredas se crean pero no se pueden consultar</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Estado de la API */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Estado de la API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Endpoint Principal:</span>
              <Badge variant="outline">/api/catalog/veredas</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Creación (POST):</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Funciona
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Consulta (GET):</span>
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Falla
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>GET por ID:</span>
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Error 500
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Estado de Permisos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Usuario Actual:</span>
              <Badge variant="outline">admin@parroquia.com</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Rol:</span>
              <Badge variant="secondary">Encuestador</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Acceso Config:</span>
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Denegado
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Requiere:</span>
              <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones de Diagnóstico */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Herramientas de Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={runDiagnostic}
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  Ejecutar Diagnóstico
                </>
              )}
            </Button>
          </div>

          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Resultado del Diagnóstico:</h4>
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Soluciones Recomendadas */}
      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Soluciones Recomendadas</AlertTitle>
        <AlertDescription className="text-blue-700">
          <strong>Para solucionar este problema:</strong>
          <ol className="mt-2 ml-4 list-decimal space-y-2">
            <li>
              <strong>Solución Inmediata:</strong> Modificar temporalmente los permisos o crear un usuario admin
            </li>
            <li>
              <strong>Problema Backend:</strong> Revisar la lógica de consulta de veredas en el servidor
              <ul className="ml-4 mt-1 list-disc">
                <li>Verificar consultas SQL/ORM</li>
                <li>Revisar filtros y condiciones WHERE</li>
                <li>Validar paginación y ordenamiento</li>
              </ul>
            </li>
            <li>
              <strong>Testing:</strong> Implementar tests unitarios para endpoints de veredas
            </li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Información Técnica */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm">
            <div>
              <strong>Comportamiento Observado:</strong>
              <ul className="ml-4 mt-1 list-disc text-gray-600">
                <li>POST /api/catalog/veredas ✅ Funciona (crea vereda con ID)</li>
                <li>GET /api/catalog/veredas ❌ Devuelve data: [], total: 0</li>
                <li>GET /api/catalog/veredas/:id ❌ Error 500</li>
              </ul>
            </div>
            <div>
              <strong>Rutas de Acceso:</strong>
              <ul className="ml-4 mt-1 list-disc text-gray-600">
                <li>/settings/veredas (requiere rol admin)</li>
                <li>/veredas (redirecciona a /settings/veredas)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VeredasDebugPage;
