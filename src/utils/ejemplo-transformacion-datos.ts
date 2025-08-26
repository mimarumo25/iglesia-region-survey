/**
 * Test de transformación de datos del formulario
 * Este archivo muestra ejemplos de cómo se transforman los datos
 */

// EJEMPLO DE DATOS ANTES DE LA TRANSFORMACIÓN (como los almacena el formulario):
const formularioOriginal = {
  familyMembers: [
    {
      id: "1703123456789", // ID temporal generado en frontend
      nombres: "Juan Carlos Pérez",
      fechaNacimiento: new Date("1985-03-15"),
      tipoIdentificacion: "CC", // String con el ID
      numeroIdentificacion: "12345678",
      sexo: "M", // String con el ID  
      situacionCivil: "CASADO_CIVIL", // String con el ID
      parentesco: "PADRE", // String con el ID
      estudio: "UNIVERSITARIO", // String con el ID
      comunidadCultural: "NINGUNA", // String con el ID
      telefono: "3001234567",
      correoElectronico: "juan@email.com",
      talla_camisa: "M",
      talla_pantalon: "32",
      talla_zapato: "42",
      enfermedad: null,
      necesidadesEnfermo: "",
      solicitudComunionCasa: true,
      profesionMotivoFechaCelebrar: {
        profesion: "INGENIERO", // String con el ID
        motivo: "Cumpleaños",
        dia: "15", 
        mes: "03"
      }
    }
  ]
};

// EJEMPLO DE DATOS DESPUÉS DE LA TRANSFORMACIÓN (como se envía al backend):
const datosParaBackend = {
  familyMembers: [
    {
      // ❌ ID eliminado - el backend lo generará
      nombres: "Juan Carlos Pérez",
      fechaNacimiento: new Date("1985-03-15"),
      tipoIdentificacion: {  // ✅ Objeto con id y nombre
        id: "CC",
        nombre: "Cédula de Ciudadanía"
      },
      numeroIdentificacion: "12345678",
      sexo: {  // ✅ Objeto con id y nombre
        id: "M",
        nombre: "Masculino"
      },
      situacionCivil: {  // ✅ Objeto con id y nombre
        id: "CASADO_CIVIL",
        nombre: "Casado Civil"
      },
      parentesco: {  // ✅ Objeto con id y nombre
        id: "PADRE",
        nombre: "Padre"
      },
      estudio: {  // ✅ Objeto con id y nombre
        id: "UNIVERSITARIO",
        nombre: "Universitario"
      },
      comunidadCultural: {  // ✅ Objeto con id y nombre
        id: "NINGUNA",
        nombre: "Ninguna"
      },
      telefono: "3001234567",
      correoElectronico: "juan@email.com",
      talla_camisa: "M",        // ✅ String simple
      talla_pantalon: "32",     // ✅ String simple
      talla_zapato: "42",       // ✅ String simple
      enfermedad: null,
      necesidadesEnfermo: "",
      solicitudComunionCasa: true,
      profesionMotivoFechaCelebrar: {
        profesion: {  // ✅ Objeto con id y nombre
          id: "INGENIERO",
          nombre: "Ingeniero"
        },
        motivo: "Cumpleaños",
        dia: "15", 
        mes: "03"
      }
    }
  ],
  // ❌ savedAt eliminado - el backend lo generará automáticamente
  metadata: {
    timestamp: "2024-08-25T10:30:00.000Z",
    completed: true,
    currentStage: 6
  }
};

console.log("✅ Transformación completada:");
console.log("- IDs temporales eliminados");
console.log("- savedAt eliminado");
console.log("- Strings convertidos a objetos {id, nombre} para:");
console.log("  - tipoIdentificacion");
console.log("  - sexo");
console.log("  - situacionCivil");
console.log("  - estudio");
console.log("  - parentesco");
console.log("  - comunidadCultural");
console.log("  - profesion (dentro de profesionMotivoFechaCelebrar)");
