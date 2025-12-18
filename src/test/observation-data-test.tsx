/**
 * 🧪 Test para verificar visualización de datos de observaciones
 * 
 * Este archivo simula datos de observaciones para verificar que el componente
 * ObservationsSection muestra correctamente los valores cuando están presentes.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ObservationsSection } from "@/components/modales/survey-details/ObservationsSection";
import { EncuestaListItem } from "@/services/encuestas";
import { CheckCircle, XCircle, FileText } from "lucide-react";

// Datos de prueba simulando la respuesta exacta esperada
const mockDataWithObservations: EncuestaListItem = {
  id_encuesta: "29",
  apellido_familiar: "Test Family",
  telefono: "1234567890",
  direccion_familia: "Test Address",
  parroquia: "Test Parish",
  municipio: "Test Municipality",
  sector: "Test Sector",
  encuestador: "Test Surveyor",
  fecha_creacion: "2025-01-18",
  tipo_vivienda: "Casa",
  servicios: {
    acueducto: { id: 1, nombre: "Acueducto Municipal" },
    aguas_residuales: [],
    disposicion_basura: []
  },
  
  // 🎯 Datos de observaciones específicos que queremos validar
  observaciones: {
    sustento_familia: "tma nuevo pruiebs",           // ✅ Valor esperado
    observaciones_encuestador: "completedooo",      // ✅ Valor esperado  
    autorizacion_datos: true                        // ✅ Valor esperado
  },
  
  familyMembers: [],
  deceasedMembers: [],
  metadatos: {
    fecha_creacion: "2025-01-18T14:00:00Z",
    estado: "completada",
    version: "1.0"
  }
};

// Datos de prueba sin observaciones (valores por defecto)
const mockDataEmpty: EncuestaListItem = {
  ...mockDataWithObservations,
  observaciones: {
    sustento_familia: "",
    observaciones_encuestador: "",
    autorizacion_datos: false
  }
};

const ObservationDataTest: React.FC = () => {
  const [useRealData, setUseRealData] = useState(true);
  const currentData = useRealData ? mockDataWithObservations : mockDataEmpty;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        {/* Header de prueba */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              🧪 Test de Visualización de Datos de Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Este componente prueba la visualización de datos de observaciones para validar
                que el componente <code>ObservationsSection</code> muestra correctamente los valores
                esperados cuando están presentes en la respuesta de la API.
              </p>
              
              {/* Toggle para cambiar entre datos */}
              <div className="flex items-center gap-4">
                <Button 
                  variant={useRealData ? "default" : "outline"}
                  onClick={() => setUseRealData(true)}
                >
                  Con Datos Reales
                </Button>
                <Button 
                  variant={!useRealData ? "default" : "outline"}
                  onClick={() => setUseRealData(false)}
                >
                  Datos Vacíos
                </Button>
              </div>
              
              {/* Indicador de estado actual */}
              <Badge className={useRealData ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {useRealData ? "Mostrando datos esperados" : "Mostrando datos vacíos"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Datos de prueba visibles */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Datos de Prueba Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{JSON.stringify({
  sustento_familia: currentData.observaciones.sustento_familia || "vacío",
  observaciones_encuestador: currentData.observaciones.observaciones_encuestador || "vacío", 
  autorizacion_datos: currentData.observaciones.autorizacion_datos
}, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Resultados esperados */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Resultados Esperados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border">
                <h4 className="font-semibold text-blue-800 mb-2">Sustento de Familia</h4>
                <p className="text-sm text-blue-700">
                  {useRealData ? "✅ Debería mostrar: 'tma nuevo pruiebs'" : "❌ Debería mostrar texto por defecto"}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border">
                <h4 className="font-semibold text-purple-800 mb-2">Observaciones Encuestador</h4>
                <p className="text-sm text-purple-700">
                  {useRealData ? "✅ Debería mostrar: 'completedooo'" : "❌ Debería mostrar texto por defecto"}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border">
                <h4 className="font-semibold text-green-800 mb-2">Autorización de Datos</h4>
                <div className="flex items-center gap-2">
                  {currentData.observaciones.autorizacion_datos ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">✅ Autorizado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">❌ No Autorizado</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Componente real ObservationsSection */}
        <Card>
          <CardHeader>
            <CardTitle>🎨 Componente ObservationsSection (Resultado Real)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
              <ObservationsSection data={currentData} />
            </div>
          </CardContent>
        </Card>

        {/* Diagnóstico */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {currentData.observaciones.sustento_familia === "tma nuevo pruiebs" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">
                  Sustento de familia: <code>{currentData.observaciones.sustento_familia || "(vacío)"}</code>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {currentData.observaciones.observaciones_encuestador === "completedooo" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">
                  Observaciones encuestador: <code>{currentData.observaciones.observaciones_encuestador || "(vacío)"}</code>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {currentData.observaciones.autorizacion_datos ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">
                  Autorización de datos: <code>{String(currentData.observaciones.autorizacion_datos)}</code>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">💡 Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700">
              <li>
                Navega a <code>http://localhost:8081/test-observations</code> para ver este componente
              </li>
              <li>
                Alterna entre "Con Datos Reales" y "Datos Vacíos" para comparar comportamientos
              </li>
              <li>
                Verifica que cuando hay datos reales, se muestran exactamente los valores esperados:
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li><strong>sustento_familia:</strong> "tma nuevo pruiebs"</li>
                  <li><strong>observaciones_encuestador:</strong> "completedooo"</li>
                  <li><strong>autorizacion_datos:</strong> true</li>
                </ul>
              </li>
              <li>
                Si el componente funciona aquí pero no en la encuesta real, 
                el problema está en la respuesta de la API <code>/api/encuesta/29</code>
              </li>
            </ol>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ObservationDataTest;