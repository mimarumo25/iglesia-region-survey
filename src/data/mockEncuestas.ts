/**
 * 🧪 Datos de prueba para encuestas
 * 
 * Este archivo contiene datos simulados para probar la vista de encuestas
 * mientras se desarrolla la integración completa con la API.
 */

import { EncuestaListItem } from '@/services/encuestas';

/**
 * Datos de ejemplo basados en la estructura JSON proporcionada
 */
export const mockEncuestasData: EncuestaListItem[] = [
  {
    id_encuesta: "11",
    apellido_familiar: "Bozon Rodriguez",
    direccion_familia: "cffdfdsfdfdfdf",
    telefono: "2334444",
    codigo_familia: "FAM_1757139870063_a6e113f8",
    estado_encuesta: "completed",
    numero_encuestas: 1,
    fecha_ultima_encuesta: "2025-09-06",
    tipo_vivienda: {
      id: "2",
      nombre: "Apartamento"
    },
    tamaño_familia: 3,
    sector: {
      id: "1",
      nombre: "Sector Centro"
    },
    municipio: {
      id: "1",
      nombre: "Abejorral"
    },
    vereda: {
      id: "11",
      nombre: "El platanal"
    },
    parroquia: {
      id: "2",
      nombre: "Parroquia Central Abrego"
    },
    basuras: [],
    acueducto: {
      id: "1",
      nombre: "Acueducto Público"
    },
    aguas_residuales: null,
    miembros_familia: {
      total_miembros: 2,
      personas: [
        {
          id: "42",
          nombre_completo: "MIGUEL MARIANO R. Bozon Rodriguez",
          identificacion: {
            numero: "4566668",
            tipo: {
              id: "1",
              nombre: "Cédula de Ciudadanía",
              codigo: "CC"
            }
          },
          telefono: "12333333",
          email: "miguel.1757139870120.0@temp.com",
          fecha_nacimiento: "2025-09-05",
          direccion: "cffdfdsfdfdfdf",
          estudios: {
            id: "1",
            nombre: "Educación Primaria"
          },
          edad: 0,
          sexo: {
            id: "1",
            descripcion: "Sexo masculino"
          },
          estado_civil: {
            id: 1,
            nombre: "Soltero(a)"
          },
          tallas: {
            camisa: "20",
            pantalon: "28",
            zapato: "41"
          }
        },
        {
          id: "43",
          nombre_completo: "Juan Carlos Palacios Bozon Rodriguez",
          identificacion: {
            numero: "1456899",
            tipo: {
              id: "1",
              nombre: "Cédula de Ciudadanía",
              codigo: "CC"
            }
          },
          telefono: "111111111",
          email: "juan.1757139870131.1@temp.com",
          fecha_nacimiento: "2022-09-22",
          direccion: "cffdfdsfdfdfdf",
          estudios: {
            id: "7",
            nombre: "Especialización"
          },
          edad: 2,
          sexo: {
            id: "1",
            descripcion: "Sexo masculino"
          },
          estado_civil: {
            id: 1,
            nombre: "Soltero(a)"
          },
          tallas: {
            camisa: "20",
            pantalon: "32",
            zapato: "40"
          }
        }
      ]
    },
    personas_fallecidas: {
      total_fallecidos: 1,
      fallecidos: [
        {
          id: "44",
          nombre_completo: "manuel Alejando Bozon Rodriguez",
          identificacion: {
            numero: "FALLECIDO_1757139870135_91d57f7b_0",
            tipo: null
          },
          fecha_fallecimiento: "2025-09-01",
          era_padre: false,
          era_madre: false,
          causa_fallecimiento: "mbbbbbbbbbb",
          es_fallecido: true
        }
      ]
    },
    metadatos: {
      fecha_creacion: "2025-09-06",
      estado: "completed",
      version: "1.0"
    },
    
    // Campos calculados para compatibilidad
    id: 11,
    direccion: "cffdfdsfdfdfdf",
    fecha: "2025-09-06",
    created_at: "2025-09-06",
    updated_at: "2025-09-06",
    familySize: 2,
    surveyor: "Miguel Mariano",
    status: "completed"
  },
  {
    id_encuesta: "12",
    apellido_familiar: "García López",
    direccion_familia: "Calle 123 #45-67",
    telefono: "3001234567",
    codigo_familia: "FAM_1757140000000_b7f224g9",
    estado_encuesta: "in_progress",
    numero_encuestas: 1,
    fecha_ultima_encuesta: "2025-09-05",
    tipo_vivienda: {
      id: "1",
      nombre: "Casa"
    },
    tamaño_familia: 4,
    sector: {
      id: "2",
      nombre: "Sector Norte"
    },
    municipio: {
      id: "1",
      nombre: "Abejorral"
    },
    vereda: {
      id: "12",
      nombre: "La esperanza"
    },
    parroquia: {
      id: "1",
      nombre: "Parroquia San José"
    },
    basuras: [],
    acueducto: {
      id: "2",
      nombre: "Acueducto Veredal"
    },
    aguas_residuales: {
      id: "1",
      nombre: "Alcantarillado Municipal"
    },
    miembros_familia: {
      total_miembros: 4,
      personas: [
        {
          id: "50",
          nombre_completo: "Juan García López",
          identificacion: {
            numero: "12345678",
            tipo: {
              id: "1",
              nombre: "Cédula de Ciudadanía",
              codigo: "CC"
            }
          },
          telefono: "3001234567",
          email: "juan.garcia@email.com",
          fecha_nacimiento: "1985-03-15",
          direccion: "Calle 123 #45-67",
          estudios: {
            id: "3",
            nombre: "Educación Secundaria"
          },
          edad: 39,
          sexo: {
            id: "1",
            descripcion: "Sexo masculino"
          },
          estado_civil: {
            id: 2,
            nombre: "Casado(a)"
          },
          tallas: {
            camisa: "L",
            pantalon: "32",
            zapato: "42"
          }
        }
      ]
    },
    personas_fallecidas: {
      total_fallecidos: 0,
      fallecidos: []
    },
    metadatos: {
      fecha_creacion: "2025-09-05",
      estado: "in_progress",
      version: "1.0"
    },
    
    // Campos calculados para compatibilidad
    id: 12,
    direccion: "Calle 123 #45-67",
    fecha: "2025-09-05",
    created_at: "2025-09-05",
    updated_at: "2025-09-05",
    familySize: 4,
    surveyor: "Ana María Rodríguez",
    status: "in_progress"
  },
  {
    id_encuesta: "13",
    apellido_familiar: "Martínez Pérez",
    direccion_familia: "Carrera 45 #12-34",
    telefono: "3109876543",
    codigo_familia: "FAM_1757141111111_c8g335h0",
    estado_encuesta: "pending",
    numero_encuestas: 1,
    fecha_ultima_encuesta: "2025-09-04",
    tipo_vivienda: {
      id: "3",
      nombre: "Finca"
    },
    tamaño_familia: 6,
    sector: {
      id: "3",
      nombre: "Sector Sur"
    },
    municipio: {
      id: "2",
      nombre: "Cocorná"
    },
    vereda: {
      id: "15",
      nombre: "Buenos Aires"
    },
    parroquia: {
      id: "3",
      nombre: "Parroquia Nuestra Señora del Carmen"
    },
    basuras: [],
    acueducto: {
      id: "3",
      nombre: "Pozo Artesiano"
    },
    aguas_residuales: null,
    miembros_familia: {
      total_miembros: 6,
      personas: []
    },
    personas_fallecidas: {
      total_fallecidos: 0,
      fallecidos: []
    },
    metadatos: {
      fecha_creacion: "2025-09-04",
      estado: "pending",
      version: "1.0"
    },
    
    // Campos calculados para compatibilidad
    id: 13,
    direccion: "Carrera 45 #12-34",
    fecha: "2025-09-04",
    created_at: "2025-09-04",
    updated_at: "2025-09-04",
    familySize: 6,
    surveyor: "Carlos Hernández",
    status: "pending"
  }
];

/**
 * Respuesta mockup de la API
 */
export const mockEncuestasResponse = {
  status: "success",
  message: "Encuestas obtenidas exitosamente",
  data: mockEncuestasData,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: mockEncuestasData.length,
    itemsPerPage: mockEncuestasData.length,
    hasNextPage: false,
    hasPrevPage: false
  }
};

/**
 * Estadísticas calculadas de los datos mock
 */
export const mockEncuestasStats = {
  total: mockEncuestasData.length,
  completed: mockEncuestasData.filter(e => e.estado_encuesta === 'completed').length,
  pending: mockEncuestasData.filter(e => e.estado_encuesta === 'pending').length,
  in_progress: mockEncuestasData.filter(e => e.estado_encuesta === 'in_progress').length,
  cancelled: mockEncuestasData.filter(e => e.estado_encuesta === 'cancelled').length,
};

/**
 * Función para obtener una encuesta por ID (mock)
 */
export const getMockEncuestaById = (id: string | number): EncuestaListItem | null => {
  return mockEncuestasData.find(encuesta => 
    encuesta.id_encuesta === id.toString() || encuesta.id === parseInt(id.toString())
  ) || null;
};
