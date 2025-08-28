/**
 * Archivo de prueba para verificar la transformación de datos de la API
 * Utiliza el ejemplo real proporcionado por el usuario para validar la transformación
 */

import { transformSurveyDataForAPI, validateAPIFormat, logDataDifferences } from './surveyAPITransformer';
import { SurveySessionData } from '@/types/survey';

// Datos de ejemplo proporcionados por el usuario (simulando el formato actual)
const ejemploUsuario: SurveySessionData = {
  informacionGeneral: {
    municipio: {
      id: "5",
      nombre: "Medellin"
    },
    parroquia: {
      id: "1",
      nombre: "demo"
    },
    sector: {
      id: "1",
      nombre: "Sector San José"
    },
    vereda: {
      id: "8",
      nombre: "El Alamo"
    },
    fecha: "2025-08-28T02:55:41.079Z",
    apellido_familiar: "este es una prueba de encuentas",
    direccion: "cra 44 66 175",
    telefono: "+57 320 6668151",
    numero_contrato_epm: "1233333",
    comunionEnCasa: false
  },
  vivienda: {
    tipo_vivienda: {
      id: "2",
      nombre: "Apartamento"
    },
    disposicion_basuras: {
      recolector: false,
      quemada: false,
      enterrada: false,
      recicla: false,
      aire_libre: false,
      no_aplica: false
    }
  },
  servicios_agua: {
    sistema_acueducto: {
      id: "3",
      nombre: "Aljibe"
    },
    aguas_residuales: null,
    pozo_septico: false,
    letrina: false,
    campo_abierto: false
  },
  observaciones: {
    sustento_familia: "demos 33333",
    observaciones_encuestador: "demos",
    autorizacion_datos: true
  },
  familyMembers: [
    {
      id: "test-id-1",
      nombres: "Mrcos demos",
      fechaNacimiento: null,
      tipoIdentificacion: {
        id: "1756314397754",
        nombre: "CC"
      },
      numeroIdentificacion: "4566668",
      sexo: {
        id: "1756314397754",
        nombre: "2"
      },
      situacionCivil: {
        id: "1756314397754",
        nombre: "1"
      },
      parentesco: {
        id: "1756314397754",
        nombre: "1"
      },
      talla_camisa: "20",
      talla_pantalon: "32",
      talla_zapato: "41",
      estudio: {
        id: "1756314397754",
        nombre: "1"
      },
      comunidadCultural: {
        id: "1756314397754",
        nombre: "1"
      },
      telefono: "3206668151",
      enQueEresLider: "Sembrar Yuca",
      habilidadDestreza: "Cultivasr la tierra",
      correoElectronico: "estosesunaprueba@gmail.com",
      enfermedad: {
        id: "1756314397754",
        nombre: "27"
      },
      necesidadesEnfermo: "NA",
      solicitudComunionCasa: true,
      profesionMotivoFechaCelebrar: {
        profesion: null,
        motivo: "Cumpleaños",
        dia: "12",
        mes: "12"
      }
    }
  ],
  deceasedMembers: [
    {
      id: "1756349793251",
      nombres: "manuel Alejando",
      fechaFallecimiento: new Date("2025-08-06T05:00:00.000Z"),
      sexo: {
        id: "1",
        nombre: "Masculino"
      },
      parentesco: {
        id: "1",
        nombre: "Gastritis Crónica"  // Nota: parece que hay un error en el original, debería ser un parentesco
      },
      causaFallecimiento: "mmmmm"
    }
  ],
  metadata: {
    timestamp: "2025-08-28T02:57:03.958Z",
    completed: true,
    currentStage: 6
  }
};

/**
 * Función para ejecutar las pruebas de transformación
 */
export function testTransformation(): void {
  console.group('🧪 Ejecutando pruebas de transformación de datos...');

  try {
    // 1. Transformar los datos
    console.log('1️⃣ Transformando datos del ejemplo del usuario...');
    const datosTransformados = transformSurveyDataForAPI(ejemploUsuario);

    // 2. Validar el formato transformado
    console.log('2️⃣ Validando formato transformado...');
    const validacion = validateAPIFormat(datosTransformados);
    
    if (validacion.isValid) {
      console.log('✅ Validación exitosa: Los datos transformados tienen el formato correcto');
    } else {
      console.error('❌ Errores de validación:', validacion.errors);
    }

    // 3. Mostrar comparación
    console.log('3️⃣ Mostrando diferencias...');
    logDataDifferences(ejemploUsuario, datosTransformados);

    // 4. Mostrar resultado final
    console.log('4️⃣ Resultado de la transformación:');
    console.log(JSON.stringify(datosTransformados, null, 2));

    // 5. Verificar campos específicos críticos
    console.log('5️⃣ Verificando campos críticos...');
    
    const verificaciones = [
      {
        campo: 'comunionEnCasa',
        esperado: false,
        actual: datosTransformados.informacionGeneral.comunionEnCasa,
        descripcion: 'Campo comunionEnCasa debe estar presente'
      },
      {
        campo: 'talla_camisa/blusa',
        esperado: '20',
        actual: datosTransformados.familyMembers[0]?.['talla_camisa/blusa'],
        descripcion: 'Campo talla camisa debe transformarse correctamente'
      },
      {
        campo: 'motivoFechaCelebrar',
        esperado: { motivo: 'Cumpleaños', dia: '12', mes: '12' },
        actual: datosTransformados.familyMembers[0]?.motivoFechaCelebrar,
        descripcion: 'Motivo y fecha celebrar deben extraerse correctamente'
      },
      {
        campo: 'fechaNacimiento',
        esperado: 'string',
        actual: typeof datosTransformados.familyMembers[0]?.fechaNacimiento,
        descripcion: 'Fecha nacimiento debe ser string en formato ISO'
      },
      {
        campo: 'municipio.id',
        esperado: 5,
        actual: datosTransformados.informacionGeneral.municipio.id,
        descripcion: 'Municipio ID debe ser numérico'
      }
    ];

    verificaciones.forEach(({ campo, esperado, actual, descripcion }) => {
      const esValido = JSON.stringify(esperado) === JSON.stringify(actual);
      console.log(
        `${esValido ? '✅' : '❌'} ${descripcion}`,
        `\n   Esperado: ${JSON.stringify(esperado)}`,
        `\n   Actual: ${JSON.stringify(actual)}`
      );
    });

    // 6. Resumen
    console.log('\n📋 RESUMEN DE PRUEBAS:');
    console.log(`- Transformación: ${datosTransformados ? '✅ Exitosa' : '❌ Falló'}`);
    console.log(`- Validación: ${validacion.isValid ? '✅ Pasó' : '❌ Falló'}`);
    console.log(`- Campos críticos: ${verificaciones.filter(v => JSON.stringify(v.esperado) === JSON.stringify(v.actual)).length}/${verificaciones.length} correctos`);

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }

  console.groupEnd();
}

/**
 * Función para probar con datos mínimos
 */
export function testMinimalData(): void {
  console.group('🧪 Probando con datos mínimos...');

  const datosMinimos: SurveySessionData = {
    informacionGeneral: {
      municipio: { id: "1", nombre: "Medellín" },
      parroquia: null,
      sector: null,
      vereda: null,
      fecha: "2025-08-28",
      apellido_familiar: "Prueba",
      direccion: "Dirección test",
      telefono: "",
      numero_contrato_epm: "",
      comunionEnCasa: false
    },
    vivienda: {
      tipo_vivienda: { id: "1", nombre: "Casa" },
      disposicion_basuras: {
        recolector: true,
        quemada: false,
        enterrada: false,
        recicla: false,
        aire_libre: false,
        no_aplica: false
      }
    },
    servicios_agua: {
      sistema_acueducto: { id: "1", nombre: "Acueducto" },
      aguas_residuales: null,
      pozo_septico: false,
      letrina: false,
      campo_abierto: false
    },
    observaciones: {
      sustento_familia: "",
      observaciones_encuestador: "",
      autorizacion_datos: true
    },
    familyMembers: [
      {
        id: "test-minimal",
        nombres: "Juan Pérez",
        fechaNacimiento: null,
        tipoIdentificacion: { id: "1", nombre: "CC" },
        numeroIdentificacion: "12345678",
        sexo: { id: "1", nombre: "Masculino" },
        situacionCivil: { id: "1", nombre: "Soltero" },
        parentesco: { id: "1", nombre: "Jefe" },
        talla_camisa: "M",
        talla_pantalon: "32",
        talla_zapato: "42",
        estudio: { id: "1", nombre: "Primaria" },
        comunidadCultural: { id: "1", nombre: "Ninguna" },
        telefono: "",
        enQueEresLider: "",
        habilidadDestreza: "",
        correoElectronico: "",
        enfermedad: { id: "1", nombre: "Ninguna" },
        necesidadesEnfermo: "",
        solicitudComunionCasa: false,
        profesionMotivoFechaCelebrar: {
          profesion: null,
          motivo: "",
          dia: "",
          mes: ""
        }
      }
    ],
    deceasedMembers: [],
    metadata: {
      timestamp: new Date().toISOString(),
      completed: true,
      currentStage: 6
    }
  };

  try {
    const resultado = transformSurveyDataForAPI(datosMinimos);
    const validacion = validateAPIFormat(resultado);

    console.log('📊 Resultado con datos mínimos:');
    console.log(`- Transformación: ${resultado ? '✅' : '❌'}`);
    console.log(`- Validación: ${validacion.isValid ? '✅' : '❌'}`);
    
    if (!validacion.isValid) {
      console.log('❌ Errores:', validacion.errors);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.groupEnd();
}

// Ejecutar pruebas si el archivo se importa
if (typeof window !== 'undefined') {
  // Solo ejecutar en el navegador para evitar errores en build
  console.log('🔬 Utilidad de pruebas de transformación cargada');
  console.log('💡 Ejecuta testTransformation() para probar la transformación');
  console.log('💡 Ejecuta testMinimalData() para probar con datos mínimos');
}
