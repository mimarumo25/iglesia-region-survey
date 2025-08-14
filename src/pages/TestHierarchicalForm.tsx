import React from 'react';
import { HierarchicalSurveyForm } from '@/components/HierarchicalSurveyForm';

const TestHierarchicalForm: React.FC = () => {
  const handleFormSubmit = (data: any) => {
    alert('Formulario enviado. Revisa la consola para ver los datos.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Prueba del Formulario de Encuestas Reorganizado
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Este formulario sigue un flujo organizado en 3 pasos: primero selecciona el municipio, 
            luego completa la ubicación específica, y finalmente ingresa la información familiar.
          </p>
        </div>

        <HierarchicalSurveyForm onSubmit={handleFormSubmit} />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Cómo usar el formulario reorganizado:
          </h2>
          <ol className="list-decimal list-inside text-blue-800 space-y-2">
            <li><strong>Paso 1 - Municipio:</strong> Selecciona primero el municipio donde se realizará la encuesta</li>
            <li><strong>Paso 2 - Ubicación:</strong> Una vez seleccionado el municipio, completa parroquia, sector, vereda y dirección</li>
            <li><strong>Paso 3 - Información:</strong> Completa los datos básicos de la familia (apellido, fecha, teléfono, etc.)</li>
            <li>El formulario muestra un indicador de progreso para seguir tu avance</li>
            <li>Los campos se habilitan progresivamente según completes los pasos anteriores</li>
            <li>El botón de envío se activa solo cuando todos los campos requeridos están completos</li>
          </ol>
        </div>

        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-md font-semibold text-green-900 mb-2">
            ✨ Mejoras en la Reorganización:
          </h3>
          <ul className="list-disc list-inside text-green-800 space-y-1">
            <li><strong>Flujo lógico:</strong> Municipio → Ubicación → Información familiar</li>
            <li><strong>Indicador visual de progreso</strong> con pasos numerados y estados</li>
            <li><strong>Feedback inmediato:</strong> Confirmación visual al completar cada paso</li>
            <li><strong>Secciones claras:</strong> Cada paso está en su propia tarjeta identificada</li>
            <li><strong>Deshabilitación inteligente:</strong> Los campos se habilitan cuando corresponde</li>
            <li><strong>Mensajes contextuales:</strong> Instrucciones claras en cada etapa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestHierarchicalForm;
