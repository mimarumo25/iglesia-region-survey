/**
 * Componente de prueba simplificado para diagnosticar el problema con destrezas
 */
import { useQuery } from '@tanstack/react-query';
import { destrezasService } from '@/services/destrezas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

const DestrezasTest = () => {
  // Test 1: Obtener todas las destrezas
  const { data: allData, isLoading: allLoading, error: allError } = useQuery({
    queryKey: ['destrezas-test-all'],
    queryFn: () => {
      return destrezasService.getDestrezas(1, 100, 'id_destreza', 'ASC');
    },
    retry: false,
  });

  // Test 2: Obtener destrezas activas
  const { data: activeData, isLoading: activeLoading, error: activeError } = useQuery({
    queryKey: ['destrezas-test-active'],
    queryFn: () => {
      return destrezasService.getActiveDestrezas();
    },
    retry: false,
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🧪 Página de Prueba - Destrezas</h1>

      {/* Test 1: getDestrezas() */}
      <Card>
        <CardHeader>
          <CardTitle>Test 1: getDestrezas()</CardTitle>
        </CardHeader>
        <CardContent>
          {allLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando...</span>
            </div>
          )}
          
          {allError && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Error: {(allError as any)?.message || 'Error desconocido'}</span>
            </div>
          )}
          
          {allData && (
            <div className="space-y-2">
              <p className="font-semibold text-green-600">✅ Datos recibidos correctamente</p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(allData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test 2: getActiveDestrezas() */}
      <Card>
        <CardHeader>
          <CardTitle>Test 2: getActiveDestrezas()</CardTitle>
        </CardHeader>
        <CardContent>
          {activeLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando...</span>
            </div>
          )}
          
          {activeError && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Error: {(activeError as any)?.message || 'Error desconocido'}</span>
            </div>
          )}
          
          {activeData && (
            <div className="space-y-2">
              <p className="font-semibold text-green-600">✅ Datos recibidos correctamente</p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(activeData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Información de la API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Base URL:</strong> {import.meta.env.VITE_BASE_URL_SERVICES}</p>
          <p><strong>Endpoint:</strong> /api/catalog/destrezas</p>
          <p><strong>Autenticación:</strong> Token Bearer (automático vía interceptor)</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DestrezasTest;
