/**
 * @fileoverview Hook personalizado para gestión de Grid de Familia
 * 
 * Maneja toda la lógica de negocio del componente FamilyGrid, incluyendo:
 * - Validación de formularios con React Hook Form + Zod
 * - Transformación de datos entre formato UI y modelo de datos
 * - CRUD de miembros de familia (Crear, Leer, Actualizar, Eliminar)
 * - Normalización de fechas y celebraciones
 * - Manejo de errores y notificaciones
 * 
 * Este hook centraliza la lógica compleja de gestión de familia,
 * siguiendo el principio de separación de responsabilidades (UI vs. lógica).
 * 
 * @module hooks/useFamilyGrid
 * @version 2.0.0
 */

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

/**
 * Esquema de validación Zod para FamilyMember
 * 
 * Define las reglas de validación para cada campo del formulario,
 * organizado por secciones para mejor mantenibilidad.
 * 
 * @constant {z.ZodObject} familyMemberSchema
 */
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

/**
 * Tipo inferido desde el schema Zod para datos de formulario
 * 
 * Representa la estructura de datos utilizada internamente por React Hook Form.
 * 
 * @typedef {z.infer<typeof familyMemberSchema>} FamilyMemberFormData
 */
export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;

/**
 * Genera un ID único para celebraciones
 * 
 * Utiliza crypto.randomUUID() si está disponible, de lo contrario
 * genera un ID basado en timestamp + random.
 * 
 * @returns {string} ID único para la celebración
 * 
 * @example
 * const id = createCelebracionId();
 * // => "550e8400-e29b-41d4-a716-446655440000" (UUID v4)
 * // o "celebracion-1234567890-abc123" (fallback)
 */
const createCelebracionId = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) {
    return uuid;
  }

  return `celebracion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Normaliza el array de celebraciones desde el formato de FamilyMember
 * 
 * Maneja tanto el formato nuevo (array de celebraciones) como el formato
 * legacy (objeto único con motivo/dia/mes), asegurando compatibilidad
 * hacia atrás con datos antiguos.
 * 
 * @param {FamilyMember | null | undefined} member - Miembro de familia con celebraciones
 * @returns {Array<{id: string, motivo: string, dia: string, mes: string}>} Array normalizado de celebraciones
 * 
 * @example
 * // Formato nuevo
 * const celebraciones = normalizeCelebraciones({
 *   profesionMotivoFechaCelebrar: {
 *     celebraciones: [
 *       { id: "1", motivo: "Cumpleaños", dia: "15", mes: "3" }
 *     ]
 *   }
 * });
 * 
 * @example
 * // Formato legacy (se convierte automáticamente)
 * const celebraciones = normalizeCelebraciones({
 *   profesionMotivoFechaCelebrar: {
 *     motivo: "Cumpleaños",
 *     dia: "15",
 *     mes: "3"
 *   }
 * });
 */
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

/**
 * Props para el hook useFamilyGrid
 * 
 * @interface UseFamilyGridProps
 * @property {FamilyMember[]} familyMembers - Array de miembros de familia actuales
 * @property {React.Dispatch<React.SetStateAction<FamilyMember[]>>} setFamilyMembers - Setter para actualizar miembros
 */
interface UseFamilyGridProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
}

/**
 * Transforma FamilyMember a FamilyMemberFormData
 * 
 * Convierte un miembro de familia desde el formato de modelo de datos
 * al formato requerido por React Hook Form para edición.
 * 
 * Maneja:
 * - Conversión de fechas (Date → Date | null)
 * - Extracción de IDs desde ConfigurationItem
 * - Normalización de celebraciones
 * - Manejo de errores con fallback seguro
 * 
 * @param {FamilyMember} member - Miembro de familia a transformar
 * @returns {Partial<FamilyMemberFormData>} Datos listos para el formulario
 * 
 * @example
 * const formData = familyMemberToFormData(miembro);
 * form.reset(formData); // Cargar datos en el formulario
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
 * Transforma FamilyMemberFormData a FamilyMember
 * 
 * Convierte datos del formulario React Hook Form al formato de modelo
 * de datos FamilyMember para guardar en el estado.
 * 
 * Maneja:
 * - Conversión de IDs string → ConfigurationItem con ID numérico
 * - Mapeo de opciones desde configurationData
 * - Normalización y filtrado de arrays (habilidades, destrezas, celebraciones)
 * - Transformación de estructura de tallas
 * 
 * @param {FamilyMemberFormData} data - Datos del formulario validados
 * @param {string} id - ID único del miembro (nuevo o existente)
 * @param {any} configurationData - Datos de configuración con opciones de catálogos
 * @returns {Partial<FamilyMember>} Miembro de familia listo para guardar
 * 
 * @example
 * const miembro = formDataToFamilyMember(
 *   formData,
 *   "uuid-123",
 *   configurationData
 * );
 * setFamilyMembers(prev => [...prev, miembro as FamilyMember]);
 */
const formDataToFamilyMember = (data: FamilyMemberFormData, id: string, configurationData: any): Partial<FamilyMember> => {
  /**
   * Helper: Convierte valor de autocomplete a ConfigurationItem con ID numérico
   * 
   * @param {string | undefined} value - Valor del campo autocomplete
   * @param {string} optionsKey - Clave en configurationData para buscar opciones
   * @returns {ConfigurationItem | null} Item de configuración o null
   */
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
 * Hook personalizado para gestión del Grid de Familia
 * 
 * Centraliza toda la lógica de negocio del componente FamilyGrid:
 * - Gestión de estado del diálogo modal
 * - Configuración de formulario con React Hook Form
 * - Operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * - Validación con Zod
 * - Transformación bidireccional de datos
 * - Notificaciones con toast
 * - Manejo de errores robusto
 * 
 * @param {UseFamilyGridProps} props - Props del hook
 * @param {FamilyMember[]} props.familyMembers - Array de miembros actuales
 * @param {Function} props.setFamilyMembers - Setter para actualizar miembros
 * 
 * @returns {Object} API del hook con estados y funciones
 * @returns {boolean} returns.showFamilyDialog - Si el diálogo está visible
 * @returns {Function} returns.setShowFamilyDialog - Setter del diálogo
 * @returns {FamilyMember | null} returns.editingFamilyMember - Miembro en edición o null
 * @returns {UseFormReturn} returns.form - Instancia de React Hook Form
 * @returns {Function} returns.resetForm - Resetea el formulario a valores por defecto
 * @returns {Function} returns.closeDialog - Cierra el diálogo y limpia el estado
 * @returns {Function} returns.openDialogForNew - Abre diálogo para nuevo miembro
 * @returns {Function} returns.onSubmit - Handler del submit del formulario
 * @returns {Function} returns.handleEdit - Carga miembro para edición
 * @returns {Function} returns.handleDelete - Elimina un miembro por ID
 * 
 * @example
 * const {
 *   showFamilyDialog,
 *   form,
 *   openDialogForNew,
 *   handleEdit,
 *   handleDelete,
 *   onSubmit,
 *   closeDialog
 * } = useFamilyGrid({
 *   familyMembers,
 *   setFamilyMembers
 * });
 * 
 * // Abrir para agregar nuevo
 * <Button onClick={openDialogForNew}>Agregar Miembro</Button>
 * 
 * // Editar existente
 * <Button onClick={() => handleEdit(miembro)}>Editar</Button>
 * 
 * // Eliminar
 * <Button onClick={() => handleDelete(miembro.id)}>Eliminar</Button>
 */
export const useFamilyGrid = ({ familyMembers, setFamilyMembers }: UseFamilyGridProps) => {
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const { toast } = useToast();
  
  // Obtener datos de configuración para mapear correctamente los IDs
  const configurationData = useConfigurationData();

  /**
   * Migra formato legacy de fechas a Date
   * 
   * Convierte objetos de fecha en formato antiguo { dia, mes, año }
   * al formato nuevo Date(), manteniendo compatibilidad hacia atrás.
   * 
   * @param {any} member - Miembro con posible fecha en formato legacy
   * @returns {FamilyMember} Miembro con fecha normalizada
   */
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

  /**
   * Abre el diálogo para agregar un nuevo miembro
   * 
   * Resetea el formulario a valores por defecto y abre el modal.
   * 
   * @function openDialogForNew
   */
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

  /**
   * Resetea el formulario a valores por defecto
   * 
   * Limpia todos los campos del formulario y el estado de edición.
   * 
   * @function resetForm
   */
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

  /**
   * Cierra el diálogo del formulario
   * 
   * Resetea el formulario y cierra el modal con manejo de errores robusto.
   * 
   * @function closeDialog
   */
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

  /**
   * Handler del submit del formulario
   * 
   * Valida, transforma y guarda los datos del miembro de familia.
   * Actualiza si está en modo edición, o agrega nuevo si es creación.
   * 
   * Realiza:
   * - Validación de arrays (habilidades, destrezas, celebraciones)
   * - Transformación a modelo de datos
   * - Actualización del estado
   * - Notificación de éxito/error
   * - Cierre automático del diálogo
   * 
   * @function onSubmit
   * @param {FamilyMemberFormData} data - Datos validados del formulario
   */
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

  /**
   * Carga un miembro para edición
   * 
   * Transforma el miembro a formato de formulario, maneja migración
   * de fechas, genera ID temporal si falta, y abre el diálogo.
   * 
   * @function handleEdit
   * @param {FamilyMember} member - Miembro a editar
   */
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

  /**
   * Elimina un miembro de familia
   * 
   * Remueve el miembro del array por su ID y muestra notificación.
   * 
   * @function handleDelete
   * @param {string} id - ID del miembro a eliminar
   */
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
