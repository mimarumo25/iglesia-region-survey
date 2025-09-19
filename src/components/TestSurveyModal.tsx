/**
 * 🧪 Componente de Prueba para Testing del Modal de Encuesta
 * 
 * Componente temporal para probar la funcionalidad de pestañas
 * del modal de detalles de encuesta sin depender del backend
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SurveyDetailModal from "@/components/modales/SurveyDetailModal";
import { EncuestaListItem } from "@/services/encuestas";

// Datos de prueba simulados
const mockSurveyData: EncuestaListItem = {
  id_encuesta: "TEST-001",
  apellido_familiar: "Rodríguez García",
  direccion_familia: "Calle 123 # 45-67",
  telefono: "3201234567",
  codigo_familia: "FAM_1757054602618_8e040142",
  estado_encuesta: "completed",
  numero_encuestas: 1,
  fecha_ultima_encuesta: "2024-09-18T12:00:00Z",
  tipo_vivienda: {
    id: "1",
    nombre: "Casa"
  },
  tamaño_familia: 4,
  sector: {
    id: "1",
    nombre: "Centro"
  },
  municipio: {
    id: "1",
    nombre: "Bogotá"
  },
  vereda: {
    id: "1",
    nombre: "Vereda Central"
  },
  parroquia: {
    id: "1",
    nombre: "San José"
  },
  basuras: [{
    id: "1",
    nombre: "Recolección Municipal"
  }],
  acueducto: {
    id: "1",
    nombre: "Acueducto Público"
  },
  aguas_residuales: {
    id: "1",
    nombre: "Alcantarillado"
  },
  miembros_familia: {
    total_miembros: 3,
    personas: [
      {
        id: "1",
        nombre_completo: "María Rodríguez García",
        identificacion: {
          numero: "12345678",
          tipo: {
            id: "1",
            nombre: "Cédula de Ciudadanía",
            codigo: "CC"
          }
        },
        telefono: "3201234567",
        email: "maria@email.com",
        fecha_nacimiento: "1990-05-15",
        direccion: "Calle 123 # 45-67",
        estudios: {
          id: "1",
          nombre: "Universitario"
        },
        edad: 34,
        sexo: {
          id: "2",
          descripcion: "Femenino"
        },
        estado_civil: {
          id: 1,
          nombre: "Casada"
        },
        tallas: {
          camisa: "M",
          pantalon: "8",
          zapato: "37"
        }
      }
    ]
  },
  deceasedMembers: [
    {
      nombres: "Pedro Rodríguez",
      fechaFallecimiento: "2020-03-15",
      sexo: {
        id: 1,
        nombre: "Masculino"
      },
      parentesco: {
        id: 1,
        nombre: "Padre"
      },
      causaFallecimiento: "Enfermedad natural"
    },
    {
      nombres: "Ana García",
      fechaFallecimiento: "2018-12-20",
      sexo: {
        id: 2,
        nombre: "Femenino"
      },
      parentesco: {
        id: 2,
        nombre: "Abuela"
      },
      causaFallecimiento: "Edad avanzada"
    }
  ],
  metadatos: {
    fecha_creacion: "2024-09-18T10:00:00Z",
    estado: "activo",
    version: "1.0"
  }
};

export const TestSurveyModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          🧪 Prueba de Modal de Encuesta
        </h1>
        <p className="text-lg text-gray-600">
          Componente de prueba para testear las pestañas del modal de detalles de encuesta
        </p>
        
        {/* Información de los datos de prueba */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Datos de Prueba Incluidos:
          </h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Información General (Familia {mockSurveyData.apellido_familiar})</li>
            <li>✅ Ubicación (Sector, Municipio, Parroquia)</li>
            <li>✅ Servicios (Acueducto, Aguas Residuales, Basuras)</li>
            <li>✅ Miembros Familia ({mockSurveyData.miembros_familia.total_miembros} personas)</li>
            <li>✅ Fallecidos ({mockSurveyData.deceasedMembers.length} personas)</li>
            <li>✅ Datos Técnicos (Metadatos del sistema)</li>
          </ul>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
        >
          🔍 Abrir Modal de Prueba
        </Button>

        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
          <p>
            <strong>Objetivo:</strong> Probar que las pestañas del modal funcionan correctamente,
            especialmente verificar que la pestaña "Fallecidos" no se "baja" automáticamente.
          </p>
        </div>
      </div>

      <SurveyDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        surveyId="TEST-001"
        initialData={mockSurveyData}
      />
    </div>
  );
};

export default TestSurveyModal;