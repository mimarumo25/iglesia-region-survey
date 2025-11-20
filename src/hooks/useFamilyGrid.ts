import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { FamilyMember, ConfigurationItem } from "@/types/survey";
// Importar validaciones de tallas
import { tallasValidationSchemas } from "@/components/tallas";
// Importar validaciones de teléfono y email
import { phoneValidationSchema, emailValidationSchema } from "@/utils/validationHelpers";
// Importar utilidades de autocomplete para manejo correcto de IDs
import { extractConfigurationItemId, createConfigurationItemHandler } from "@/utils/autocomplete-utils";
import { useConfigurationData } from "@/hooks/useConfigurationData";

// Esquema de validación con Zod - Organizado según secciones del formulario
const familyMemberSchema = z.object({
  // SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL
  nombres: z.string().min(1, "El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  fechaNacimiento: z.date().optional().nullable(),
  numeroIdentificacion: z.string().min(1, "El número de identificación es obligatorio").min(5, "El número de identificación debe tener al menos 5 caracteres"),
  tipoIdentificacion: z.string().min(1, "El tipo de identificación es obligatorio"),
  
  // SECCIÓN 2: INFORMACIÓN DE CONTACTO
  telefono: phoneValidationSchema,
  correoElectronico: emailValidationSchema,
  
  // SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA
  sexo: z.string().optional(),
  parentesco: z.string().optional(),
  situacionCivil: z.string().optional(),
  
  // SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL
  estudio: z.string().optional(),
  profesionMotivoFechaCelebrar: z.object({
    profesion: z.string().optional().or(z.literal('')),
    celebraciones: z.array(z.object({
      id: z.string().optional(),
      motivo: z.string().optional().or(z.literal('')),
      dia: z.string().optional().or(z.literal('')),
      mes: z.string().optional().or(z.literal('')),
    })).default([]),
  }).default({ profesion: '', celebraciones: [] }),
  
  // SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD
  comunidadCultural: z.string().optional(),
  enfermedades: z.array(z.object({
    id: z.union([z.number(), z.string()]).transform(val => {
      const num = typeof val === 'string' ? parseInt(val) : val;
      return isNaN(num) ? 0 : num;
    }),
    nombre: z.string().min(1, "El nombre de la enfermedad es requerido"),
  })).optional().default([]),
  necesidadesEnfermo: z.array(z.string().min(1, "La necesidad no puede estar vacía")).optional().default([]),
  solicitudComunionCasa: z.boolean().optional(),
  
  // SECCIÓN 6: INFORMACIÓN DE TALLAS
  talla: z.object({
    camisa: tallasValidationSchemas.strict.talla_camisa,
    pantalon: tallasValidationSchemas.strict.talla_pantalon,
    calzado: tallasValidationSchemas.strict.talla_zapato,
  }),

  enQueEresLider: z.array(z.string().min(1, "El liderazgo no puede estar vacío")).optional().default([]),
  
  // SECCIÓN 9: HABILIDADES Y DESTREZAS
  // Hacer el schema más permisivo para evitar errores de validación silenciosos
  habilidades: z.array(z.object({
    id: z.union([z.number(), z.string()]).transform(val => {
      const num = typeof val === 'string' ? parseInt(val) : val;
      return isNaN(num) ? 0 : num;
    }),
    nombre: z.string().min(1, "El nombre de la habilidad es requerido"),
    nivel: z.string().optional(),
  })).optional().default([]),
  
  destrezas: z.array(z.object({
    id: z.union([z.number(), z.string()]).transform(val => {
      const num = typeof val === 'string' ? parseInt(val) : val;
      return isNaN(num) ? 0 : num;
    }),
    nombre: z.string().min(1, "El nombre de la destreza es requerido"),
  })).optional().default([]),
});

export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;

const createCelebracionId = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) {
    return uuid;
  }

  return `celebracion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeCelebraciones = (member: FamilyMember | null | undefined) => {
  const celebracionesArray = Array.isArray(member?.profesionMotivoFechaCelebrar?.celebraciones)
    ? member?.profesionMotivoFechaCelebrar?.celebraciones ?? []
    : [];

  const normalized = celebracionesArray
    .filter((item) => item && (item.motivo?.trim() || item.dia?.trim() || item.mes?.trim()))
    .map((item) => ({
      id: item.id || createCelebracionId(),
      motivo: item.motivo?.trim() || '',
      dia: item.dia?.trim() || '',
      mes: item.mes?.trim() || '',
    }));

  const legacySource: any = member?.profesionMotivoFechaCelebrar;
  if (legacySource && !Array.isArray(legacySource?.celebraciones)) {
    const motivo = legacySource?.motivo?.trim?.() || '';
    const dia = legacySource?.dia?.trim?.() || '';
    const mes = legacySource?.mes?.trim?.() || '';

    if (motivo || dia || mes) {
      normalized.push({
        id: createCelebracionId(),
        motivo,
        dia,
        mes,
      });
    }
  }

  return normalized;
};

interface UseFamilyGridProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
}

/**
 * Transforma un FamilyMember a FamilyMemberFormData para edición
 * Organizado según las secciones del formulario para mejor legibilidad
 */
const familyMemberToFormData = (member: FamilyMember): Partial<FamilyMemberFormData> => {
  try {
    // Helper para convertir fechaNacimiento a Date válida
    const parseFecha = (fecha: any): Date | null => {
      if (!fecha) return null;
      
      // Si ya es una Date válida
      if (fecha instanceof Date && !isNaN(fecha.getTime())) {
        return fecha;
      }
      
      // Si es un string, intentar convertirlo a Date
      if (typeof fecha === 'string' && fecha.trim()) {
        const parsedDate = new Date(fecha);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
      
      return null;
    };

    const formData = {
      // SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL
      nombres: member?.nombres || '',
      fechaNacimiento: parseFecha(member?.fechaNacimiento),
      numeroIdentificacion: member?.numeroIdentificacion || '',
      tipoIdentificacion: extractConfigurationItemId(member?.tipoIdentificacion),
      
      // SECCIÓN 2: INFORMACIÓN DE CONTACTO
      telefono: member?.telefono || '',
      correoElectronico: member?.correoElectronico || '',
      
      // SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA
      sexo: extractConfigurationItemId(member?.sexo),
      parentesco: extractConfigurationItemId(member?.parentesco),
      situacionCivil: extractConfigurationItemId(member?.situacionCivil),
      
      // SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL
      estudio: extractConfigurationItemId(member?.estudio),
      profesionMotivoFechaCelebrar: {
        profesion: extractConfigurationItemId(member?.profesionMotivoFechaCelebrar?.profesion),
        celebraciones: normalizeCelebraciones(member),
      },
      
      // SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD
      comunidadCultural: extractConfigurationItemId(member?.comunidadCultural),
      enfermedades: member?.enfermedades || [],
      necesidadesEnfermo: member?.necesidadesEnfermo || [],
      solicitudComunionCasa: member?.solicitudComunionCasa || false,
      
      // SECCIÓN 6: INFORMACIÓN DE TALLAS
      talla: {
        camisa: member?.talla_camisa || '',
        pantalon: member?.talla_pantalon || '',
        calzado: member?.talla_zapato || '',
      },
      
      // SECCIÓN 7: FECHAS A CELEBRAR (incluido en profesionMotivoFechaCelebrar)
      
      // SECCIÓN 8: INFORMACIÓN DE SERVICIOS Y LIDERAZGO
      enQueEresLider: member?.enQueEresLider || [],
      
      // SECCIÓN 9: HABILIDADES Y DESTREZAS
      habilidades: member?.habilidades || [],
      destrezas: member?.destrezas || [],
    };

    return formData;
  } catch (error) {
    console.error('Error en familyMemberToFormData:', error);
    
    // Retornar datos mínimos para evitar crash
    return {
      // SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL
      nombres: member?.nombres || '',
      fechaNacimiento: null,
      numeroIdentificacion: member?.numeroIdentificacion || '',
      tipoIdentificacion: extractConfigurationItemId(member?.tipoIdentificacion),
      
      // SECCIÓN 2: INFORMACIÓN DE CONTACTO
      telefono: member?.telefono || '',
      correoElectronico: member?.correoElectronico || '',
      
      // SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA
      sexo: extractConfigurationItemId(member?.sexo),
      parentesco: extractConfigurationItemId(member?.parentesco),
      situacionCivil: extractConfigurationItemId(member?.situacionCivil),
      
      // SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL
      estudio: extractConfigurationItemId(member?.estudio),
      profesionMotivoFechaCelebrar: {
        profesion: extractConfigurationItemId(member?.profesionMotivoFechaCelebrar?.profesion),
        celebraciones: normalizeCelebraciones(member),
      },
      
      // SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD
      comunidadCultural: extractConfigurationItemId(member?.comunidadCultural),
      enfermedades: member?.enfermedades || [],
      necesidadesEnfermo: Array.isArray(member?.necesidadesEnfermo) ? member?.necesidadesEnfermo : [],
      solicitudComunionCasa: member?.solicitudComunionCasa || false,
      
      // SECCIÓN 6: INFORMACIÓN DE TALLAS
      talla: {
        camisa: member?.talla_camisa || '',
        pantalon: member?.talla_pantalon || '',
        calzado: member?.talla_zapato || '',
      },
      
      // SECCIÓN 8: INFORMACIÓN DE SERVICIOS Y LIDERAZGO
      enQueEresLider: Array.isArray(member?.enQueEresLider) ? member?.enQueEresLider : [],
      
      // SECCIÓN 9: HABILIDADES Y DESTREZAS
      habilidades: member?.habilidades || [],
      destrezas: member?.destrezas || [],
    } as Partial<FamilyMemberFormData>;
  }
};

/**
 * Transforma FamilyMemberFormData a FamilyMember para guardar
 * Organizado según las secciones del formulario
 */
const formDataToFamilyMember = (data: FamilyMemberFormData, id: string, configurationData: any): Partial<FamilyMember> => {
  // Función helper para convertir valor de autocomplete a ConfigurationItem con ID numérico
  const createConfigItemFromValue = (value: string | undefined, optionsKey: string): ConfigurationItem | null => {
    if (!value || !value.trim()) return null;
    
    const options = configurationData[optionsKey] || [];
    const selectedOption = options.find((option: any) => option.value === value);
    
    if (selectedOption) {
      // El value ya es el ID numérico en formato string
      // Convertirlo a número para almacenamiento
      const numericId = typeof selectedOption.value === 'string' 
        ? parseInt(selectedOption.value, 10) 
        : selectedOption.value;
      
      return {
        id: isNaN(numericId) ? selectedOption.value : numericId, // Usar número si es válido
        nombre: selectedOption.label
      };
    }
    
    // Si no se encuentra en opciones, intentar convertir a número
    const parsedId = parseInt(value, 10);
    return {
      id: isNaN(parsedId) ? value : parsedId,
      nombre: value
    };
  };

  return {
    id,
    // SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL
    nombres: data.nombres || '',
    fechaNacimiento: data.fechaNacimiento || null,
    numeroIdentificacion: data.numeroIdentificacion || '',
    tipoIdentificacion: createConfigItemFromValue(data.tipoIdentificacion, 'tiposIdentificacionOptions'),
    
    // SECCIÓN 2: INFORMACIÓN DE CONTACTO
    telefono: data.telefono || '',
    correoElectronico: data.correoElectronico || '',
    
    // SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA
    sexo: createConfigItemFromValue(data.sexo, 'sexoOptions'),
    parentesco: createConfigItemFromValue(data.parentesco, 'parentescosOptions'),
    situacionCivil: createConfigItemFromValue(data.situacionCivil, 'estadoCivilOptions'),
    
    // SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL
    estudio: createConfigItemFromValue(data.estudio, 'estudiosOptions'),
    profesionMotivoFechaCelebrar: {
      profesion: createConfigItemFromValue(data.profesionMotivoFechaCelebrar?.profesion, 'profesionesOptions'),
      celebraciones: (data.profesionMotivoFechaCelebrar?.celebraciones || [])
        .map((item) => ({
          id: item.id || createCelebracionId(),
          motivo: item.motivo?.trim() || '',
          dia: item.dia?.trim() || '',
          mes: item.mes?.trim() || '',
        }))
        .filter((item) => item.motivo || item.dia || item.mes),
    },
    
    // SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD
    comunidadCultural: createConfigItemFromValue(data.comunidadCultural, 'comunidadesCulturalesOptions'),
    enfermedades: (data.enfermedades || []).filter(e => e.id && e.nombre) as Array<{ id: number; nombre: string }>,
    necesidadesEnfermo: Array.isArray(data.necesidadesEnfermo) ? data.necesidadesEnfermo : [],
    solicitudComunionCasa: data.solicitudComunionCasa || false,
    
    // SECCIÓN 6: INFORMACIÓN DE TALLAS
    talla_camisa: data.talla?.camisa || '',
    talla_pantalon: data.talla?.pantalon || '',
    talla_zapato: data.talla?.calzado || '',
    
    // SECCIÓN 8: INFORMACIÓN DE SERVICIOS Y LIDERAZGO
    enQueEresLider: Array.isArray(data.enQueEresLider) ? data.enQueEresLider : [],
    
    // SECCIÓN 9: HABILIDADES Y DESTREZAS
    habilidades: (data.habilidades || []).filter(h => h.id && h.nombre) as Array<{ id: number; nombre: string; nivel?: string }>,
    destrezas: (data.destrezas || []).filter(d => d.id && d.nombre) as Array<{ id: number; nombre: string }>,
  };
};

/**
 * Hook personalizado que maneja toda la lógica de negocio para FamilyGrid
 * Separa la lógica de la presentación siguiendo el principio de separación de responsabilidades
 */
export const useFamilyGrid = ({ familyMembers, setFamilyMembers }: UseFamilyGridProps) => {
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const { toast } = useToast();
  
  // Obtener datos de configuración para mapear correctamente los IDs
  const configurationData = useConfigurationData();

  // Función helper para migrar fechas del formato anterior
  const migrateDateFormat = (member: any): FamilyMember => {
    if (member.fechaNacimiento && typeof member.fechaNacimiento === 'object' && 'dia' in member.fechaNacimiento) {
      // Formato anterior: { dia: string, mes: string, año: string }
      const { dia, mes, año } = member.fechaNacimiento;
      if (dia && mes && año) {
        const date = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
        return { ...member, fechaNacimiento: date };
      } else {
        return { ...member, fechaNacimiento: null };
      }
    }
    return member;
  };

  // Configuración de React Hook Form con valores por defecto organizados por sección
  const form = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      // SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL
      nombres: '',
      fechaNacimiento: null,
      numeroIdentificacion: '',
      tipoIdentificacion: '',
      
      // SECCIÓN 2: INFORMACIÓN DE CONTACTO
      telefono: '',
      correoElectronico: '',
      
      // SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA
      sexo: '',
      parentesco: '',
      situacionCivil: '',
      
      // SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL
      estudio: '',
  profesionMotivoFechaCelebrar: { profesion: '', celebraciones: [] },
      
      // SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD
      comunidadCultural: '',
      enfermedades: [],
      necesidadesEnfermo: [],
      solicitudComunionCasa: false,
      
      // SECCIÓN 6: INFORMACIÓN DE TALLAS
      talla: { camisa: '', pantalon: '', calzado: '' },
      
      // SECCIÓN 8: INFORMACIÓN DE SERVICIOS Y LIDERAZGO
      enQueEresLider: [],
      
      // SECCIÓN 9: HABILIDADES Y DESTREZAS
      habilidades: [],
      destrezas: [],
    },
    mode: 'onChange'
  });

  const openDialogForNew = () => {
    try {
      setEditingFamilyMember(null);
      // Resetear el formulario con los valores por defecto explícitamente
      form.reset({
        // SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL
        nombres: '',
        fechaNacimiento: null,
        numeroIdentificacion: '',
        tipoIdentificacion: '',
        
        // SECCIÓN 2: INFORMACIÓN DE CONTACTO
        telefono: '',
        correoElectronico: '',
        
        // SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA
        sexo: '',
        parentesco: '',
        situacionCivil: '',
        
        // SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL
        estudio: '',
        profesionMotivoFechaCelebrar: { profesion: '', celebraciones: [] },
        
        // SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD
        comunidadCultural: '',
        enfermedades: [],
        necesidadesEnfermo: [],
        solicitudComunionCasa: false,
        
        // SECCIÓN 6: INFORMACIÓN DE TALLAS
        talla: { camisa: '', pantalon: '', calzado: '' },
        
        // SECCIÓN 8: INFORMACIÓN DE SERVICIOS Y LIDERAZGO
        enQueEresLider: [],
        
        // SECCIÓN 9: HABILIDADES Y DESTREZAS
        habilidades: [],
        destrezas: [],
      });
      setShowFamilyDialog(true);
    } catch (error) {
      console.error('Error al abrir diálogo para nuevo miembro:', error);
    }
  };

  const resetForm = () => {
    try {
      setEditingFamilyMember(null);
      // Resetear el formulario con los valores por defecto explícitamente
      form.reset({
        // SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL
        nombres: '',
        fechaNacimiento: null,
        numeroIdentificacion: '',
        tipoIdentificacion: '',
        
        // SECCIÓN 2: INFORMACIÓN DE CONTACTO
        telefono: '',
        correoElectronico: '',
        
        // SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA
        sexo: '',
        parentesco: '',
        situacionCivil: '',
        
        // SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL
        estudio: '',
        profesionMotivoFechaCelebrar: { profesion: '', celebraciones: [] },
        
        // SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD
        comunidadCultural: '',
        enfermedades: [],
        necesidadesEnfermo: [],
        solicitudComunionCasa: false,
        
        // SECCIÓN 6: INFORMACIÓN DE TALLAS
        talla: { camisa: '', pantalon: '', calzado: '' },
        
        // SECCIÓN 8: INFORMACIÓN DE SERVICIOS Y LIDERAZGO
        enQueEresLider: [],
        
        // SECCIÓN 9: HABILIDADES Y DESTREZAS
        habilidades: [],
        destrezas: [],
      });
    } catch (error) {
      console.error('Error al resetear formulario:', error);
    }
  };

  const closeDialog = () => {
    try {
      resetForm();
      setShowFamilyDialog(false);
    } catch (error) {
      console.error('Error al cerrar diálogo:', error);
      // Forzar cierre del diálogo
      setShowFamilyDialog(false);
    }
  };

  const onSubmit = (data: FamilyMemberFormData) => {
    try {
      // Validar que los arrays de habilidades y destrezas estén bien formados
      const habilidadesValidas = (data.habilidades || []).filter(h => {
        return h && h.id && h.nombre && h.nombre.trim() !== '';
      });

      const destrezasValidas = (data.destrezas || []).filter(d => {
        return d && d.id && d.nombre && d.nombre.trim() !== '';
      });

      const celebracionesValidas = (data.profesionMotivoFechaCelebrar?.celebraciones || [])
        .map((item) => ({
          id: item.id || createCelebracionId(),
          motivo: item.motivo?.trim() || '',
          dia: item.dia?.trim() || '',
          mes: item.mes?.trim() || '',
        }))
        .filter((item) => item.motivo || item.dia || item.mes);

      // Crear objeto con datos validados
      const dataValidada = {
        ...data,
        habilidades: habilidadesValidas,
        destrezas: destrezasValidas,
        profesionMotivoFechaCelebrar: {
          profesion: data.profesionMotivoFechaCelebrar?.profesion ?? '',
          celebraciones: celebracionesValidas,
        },
      };

      console.log('✅ Datos validados para guardar:', {
        habilidades: dataValidada.habilidades.length,
        destrezas: dataValidada.destrezas.length
      });

      if (editingFamilyMember) {
        const updatedMember = formDataToFamilyMember(dataValidada, editingFamilyMember.id, configurationData);
        
        setFamilyMembers(prev => 
          prev.map(m => m.id === editingFamilyMember.id ? { ...m, ...updatedMember } : m)
        );
        
        toast({ 
          title: "Miembro actualizado", 
          description: "Datos actualizados correctamente.",
          duration: 3000
        });
      } else {
        const newMember = formDataToFamilyMember(dataValidada, Date.now().toString(), configurationData);
        
        setFamilyMembers(prev => [...prev, newMember as FamilyMember]);
        
        toast({ 
          title: "Miembro agregado", 
          description: "Nuevo miembro agregado a la familia.",
          duration: 3000
        });
      }
      
      // Cerrar el diálogo inmediatamente después de guardar
      closeDialog();
      
    } catch (error) {
      toast({ 
        title: "Error al guardar", 
        description: error instanceof Error ? error.message : "Hubo un problema al procesar la información del miembro. Por favor, inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const handleEdit = (member: FamilyMember) => {
    try {
      if (!member) {
        toast({ 
          title: "Error", 
          description: "No se puede editar este miembro. Datos no válidos.",
          variant: "destructive",
          duration: 3000
        });
        return;
      }

      // Si no tiene ID, generar uno temporal
      let memberWithId = member;
      if (!member.id) {
        memberWithId = { 
          ...member, 
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
        };
        
        setFamilyMembers(prev => {
          const memberIndex = prev.findIndex(m => 
            m.nombres === member.nombres && 
            m.numeroIdentificacion === member.numeroIdentificacion
          );
          
          if (memberIndex >= 0) {
            const updated = [...prev];
            updated[memberIndex] = memberWithId;
            return updated;
          }
          
          return prev;
        });
      }

      const migratedMember = migrateDateFormat(memberWithId);
      const formData = familyMemberToFormData(migratedMember);
      
      setEditingFamilyMember(migratedMember);
      form.reset(formData);
      setShowFamilyDialog(true);
      
    } catch (error) {
      console.error('Error al preparar edición de miembro:', error);
      toast({ 
        title: "Error al editar", 
        description: "Hubo un problema al cargar los datos para edición. Por favor, inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const handleDelete = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    toast({ 
      title: "Miembro eliminado", 
      description: "El miembro ha sido eliminado.",
      duration: 3000
    });
  };

  return {
    // Estados
    showFamilyDialog,
    setShowFamilyDialog,
    editingFamilyMember,
    
    // Formulario
    form,
    
    // Funciones
    resetForm,
    closeDialog,
    openDialogForNew,
    onSubmit,
    handleEdit,
    handleDelete
  };
};
