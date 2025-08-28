/**
 * Componente temporal para probar la transformación de datos
 * Este componente puede ser agregado temporalmente a cualquier página para probar
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { testTransformation, testMinimalData } from '@/utils/testSurveyTransformation';
import { transformSurveyDataForAPI, validateAPIFormat } from '@/utils/surveyAPITransformer';
import { SurveySessionData } from '@/types/survey';

const SurveyTransformationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const runTransformationTest = () => {
    try {
      console.clear();
      testTransformation();
      setTestResults({
        success: true,
        message: 'Prueba de transformación completada. Revisa la consola para más detalles.',
        details: 'Consulta abrir las herramientas de desarrollador (F12) y revisar la consola.'
      });
    } catch (error) {
      setTestResults({
        success: false,
        message: 'Error durante la prueba de transformación',
        details: error
      });
    }
  };

  const runMinimalDataTest = () => {
    try {
      console.clear();
      testMinimalData();
      setTestResults({
        success: true,
        message: 'Prueba con datos mínimos completada. Revisa la consola.',
        details: 'Los datos mínimos se transformaron correctamente.'
      });
    } catch (error) {
      setTestResults({
        success: false,
        message: 'Error en la prueba con datos mínimos',
        details: error
      });
    }
  };

  const runRealDataTest = () => {
    // Datos del ejemplo proporcionado por el usuario
    const ejemploReal: SurveySessionData = {
      informacionGeneral: {
        municipio: { id: "5", nombre: "Medellin" },
        parroquia: { id: "1", nombre: "demo" },
        sector: { id: "1", nombre: "Sector San José" },
        vereda: { id: "8", nombre: "El Alamo" },
        fecha: "2025-08-28T02:55:41.079Z",
        apellido_familiar: "este es una prueba de encuentas",
        direccion: "cra 44 66 175",
        telefono: "+57 320 6668151",
        numero_contrato_epm: "1233333",
        comunionEnCasa: false
      },
      vivienda: {
        tipo_vivienda: { id: "2", nombre: "Apartamento" },
        disposicion_basuras: {
          recolector: false, quemada: false, enterrada: false,
          recicla: false, aire_libre: false, no_aplica: false
        }
      },
      servicios_agua: {
        sistema_acueducto: { id: "3", nombre: "Aljibe" },
        aguas_residuales: null,
        pozo_septico: false, letrina: false, campo_abierto: false
      },
      observaciones: {
        sustento_familia: "demos 33333",
        observaciones_encuestador: "demos",
        autorizacion_datos: true
      },
      familyMembers: [{
        id: "test-id",
        nombres: "Mrcos demos",
        fechaNacimiento: null,
        tipoIdentificacion: { id: "1756314397754", nombre: "CC" },
        numeroIdentificacion: "4566668",
        sexo: { id: "1756314397754", nombre: "2" },
        situacionCivil: { id: "1756314397754", nombre: "1" },
        parentesco: { id: "1756314397754", nombre: "1" },
        talla_camisa: "20", talla_pantalon: "32", talla_zapato: "41",
        estudio: { id: "1756314397754", nombre: "1" },
        comunidadCultural: { id: "1756314397754", nombre: "1" },
        telefono: "3206668151",
        enQueEresLider: "Sembrar Yuca",
        habilidadDestreza: "Cultivasr la tierra",
        correoElectronico: "estosesunaprueba@gmail.com",
        enfermedad: { id: "1756314397754", nombre: "27" },
        necesidadesEnfermo: "NA",
        solicitudComunionCasa: true,
        profesionMotivoFechaCelebrar: {
          profesion: null,
          motivo: "Cumpleaños", dia: "12", mes: "12"
        }
      }],
      deceasedMembers: [{
        id: "deceased-1",
        nombres: "manuel Alejando",
        fechaFallecimiento: new Date("2025-08-06T05:00:00.000Z"),
        sexo: { id: "1", nombre: "Masculino" },
        parentesco: { id: "1", nombre: "Padre" },
        causaFallecimiento: "mmmmm"
      }],
      metadata: {
        timestamp: "2025-08-28T02:57:03.958Z",
        completed: true, currentStage: 6
      }
    };

    try {
      console.clear();
      console.log('🔄 Probando transformación con datos reales...');
      
      const transformado = transformSurveyDataForAPI(ejemploReal);
      const validacion = validateAPIFormat(transformado);
      
      console.log('📤 Datos transformados:', JSON.stringify(transformado, null, 2));
      
      setTestResults({
        success: validacion.isValid,
        message: validacion.isValid ? 
          'Transformación exitosa con datos reales' : 
          'Errores en la transformación',
        details: validacion.isValid ? 
          'Los datos se transformaron correctamente al formato API' : 
          validacion.errors
      });
    } catch (error) {
      setTestResults({
        success: false,
        message: 'Error al transformar datos reales',
        details: error
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Pruebas de Transformación de Datos API</CardTitle>
        <p className="text-sm text-muted-foreground">
          Utilidad para probar la transformación de datos de encuesta al formato requerido por la API
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={runTransformationTest} variant="default">
            📊 Prueba Completa
          </Button>
          <Button onClick={runMinimalDataTest} variant="outline">
            🎯 Datos Mínimos
          </Button>
          <Button onClick={runRealDataTest} variant="secondary">
            🚀 Datos Reales
          </Button>
        </div>

        {testResults && (
          <Card className={`${testResults.success ? 'border-green-200' : 'border-red-200'}`}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={testResults.success ? "default" : "destructive"}>
                  {testResults.success ? '✅ Éxito' : '❌ Error'}
                </Badge>
                <span className="text-sm font-medium">{testResults.message}</span>
              </div>
              
              {testResults.details && (
                <div className="text-sm text-muted-foreground mt-2">
                  <pre className="whitespace-pre-wrap bg-muted p-2 rounded text-xs">
                    {typeof testResults.details === 'string' ? 
                      testResults.details : 
                      JSON.stringify(testResults.details, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• <strong>Prueba Completa:</strong> Usa el ejemplo original del usuario</p>
          <p>• <strong>Datos Mínimos:</strong> Usa solo campos requeridos</p>
          <p>• <strong>Datos Reales:</strong> Transforma el JSON del problema reportado</p>
          <p>• Abre la consola del navegador (F12) para ver detalles completos</p>
        </div>

      </CardContent>
    </Card>
  );
};

export default SurveyTransformationTest;
