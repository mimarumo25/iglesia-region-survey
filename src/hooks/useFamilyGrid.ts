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

// Esquema de validación con Zod - Usando validación de tallas mejorada y validaciones de contacto
const familyMemberSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  fechaNacimiento: z.date().optional().nullable(),
  tipoIdentificacion: z.string().min(1, "El tipo de identificación es obligatorio"),
  numeroIdentificacion: z.string().min(1, "El número de identificación es obligatorio").min(5, "El número de identificación debe tener al menos 5 caracteres"),
  sexo: z.string().optional(),
  situacionCivil: z.string().optional(),
  parentesco: z.string().optional(),
  talla: z.object({
    camisa: tallasValidationSchemas.strict.talla_camisa,
    pantalon: tallasValidationSchemas.strict.talla_pantalon,
    calzado: tallasValidationSchemas.strict.talla_zapato,
  }),
  estudio: z.string().optional(),
  comunidadCultural: z.string().optional(),
  telefono: phoneValidationSchema,
  enQueEresLider: z.string().optional(),
  habilidadDestreza: z.string().optional(),
  correoElectronico: emailValidationSchema,
  enfermedad: z.string().optional(),
  necesidadesEnfermo: z.string().optional(),
  solicitudComunionCasa: z.boolean().optional(),
  profesionMotivoFechaCelebrar: z.object({
    profesion: z.string().optional(),
    motivo: z.string().optional(),
    dia: z.string().optional(),
    mes: z.string().optional(),
  }).optional(),
});

export type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;

interface UseFamilyGridProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
}

/**
 * Transforma un FamilyMember a FamilyMemberFormData para edición
 */
const familyMemberToFormData = (member: FamilyMember): Partial<FamilyMemberFormData> => {
  try {
    const formData = {
      nombres: member?.nombres || '',
      fechaNacimiento: member?.fechaNacimiento && member.fechaNacimiento instanceof Date && !isNaN(member.fechaNacimiento.getTime()) 
        ? member.fechaNacimiento 
        : null,
      tipoIdentificacion: extractConfigurationItemId(member?.tipoIdentificacion),
      numeroIdentificacion: member?.numeroIdentificacion || '',
      sexo: extractConfigurationItemId(member?.sexo),
      situacionCivil: extractConfigurationItemId(member?.situacionCivil),
      parentesco: extractConfigurationItemId(member?.parentesco),
      talla: {
        // Las tallas ya son strings, se pasan directamente con fallbacks seguros
        camisa: member?.talla_camisa || '',
        pantalon: member?.talla_pantalon || '',
        calzado: member?.talla_zapato || '',
      },
      estudio: extractConfigurationItemId(member?.estudio),
      comunidadCultural: extractConfigurationItemId(member?.comunidadCultural),
      telefono: member?.telefono || '',
      enQueEresLider: member?.enQueEresLider || '',
      habilidadDestreza: member?.habilidadDestreza || '',
      correoElectronico: member?.correoElectronico || '',
      enfermedad: extractConfigurationItemId(member?.enfermedad),
      necesidadesEnfermo: member?.necesidadesEnfermo || '',
      solicitudComunionCasa: member?.solicitudComunionCasa || false,
      profesionMotivoFechaCelebrar: {
        profesion: extractConfigurationItemId(member?.profesionMotivoFechaCelebrar?.profesion),
        motivo: member?.profesionMotivoFechaCelebrar?.motivo || '',
        dia: member?.profesionMotivoFechaCelebrar?.dia || '',
        mes: member?.profesionMotivoFechaCelebrar?.mes || '',
      }
    };

    console.log('✅ FormData transformado exitosamente:', {
      nombres: formData.nombres,
      talla: formData.talla,
      tipoIdentificacion: formData.tipoIdentificacion
    });

    return formData;
  } catch (error) {
    console.error('💥 Error en familyMemberToFormData:', error);
    console.error('Member que causó el error:', member);
    
    // Retornar datos mínimos para evitar crash
    return {
      nombres: member?.nombres || '',
      fechaNacimiento: null,
      tipoIdentificacion: extractConfigurationItemId(member?.tipoIdentificacion),
      numeroIdentificacion: member?.numeroIdentificacion || '',
      sexo: extractConfigurationItemId(member?.sexo),
      situacionCivil: extractConfigurationItemId(member?.situacionCivil),
      parentesco: extractConfigurationItemId(member?.parentesco),
      talla: {
        camisa: member?.talla_camisa || '',
        pantalon: member?.talla_pantalon || '',
        calzado: member?.talla_zapato || '',
      },
      estudio: extractConfigurationItemId(member?.estudio),
      comunidadCultural: extractConfigurationItemId(member?.comunidadCultural),
      telefono: member?.telefono || '',
      enQueEresLider: member?.enQueEresLider || '',
      habilidadDestreza: member?.habilidadDestreza || '',
      correoElectronico: member?.correoElectronico || '',
      enfermedad: extractConfigurationItemId(member?.enfermedad),
      necesidadesEnfermo: member?.necesidadesEnfermo || '',
      solicitudComunionCasa: member?.solicitudComunionCasa || false,
      profesionMotivoFechaCelebrar: {
        profesion: extractConfigurationItemId(member?.profesionMotivoFechaCelebrar?.profesion),
        motivo: member?.profesionMotivoFechaCelebrar?.motivo || '',
        dia: member?.profesionMotivoFechaCelebrar?.dia || '',
        mes: member?.profesionMotivoFechaCelebrar?.mes || '',
      }
    } as Partial<FamilyMemberFormData>;
  }
};

/**
 * Transforma FamilyMemberFormData a FamilyMember para guardar
 */
const formDataToFamilyMember = (data: FamilyMemberFormData, id: string, configurationData: any): Partial<FamilyMember> => {
  // Función helper para convertir valor de autocomplete a ConfigurationItem
  const createConfigItemFromValue = (value: string | undefined, optionsKey: string): ConfigurationItem | null => {
    if (!value || !value.trim()) return null;
    
    const options = configurationData[optionsKey] || [];
    const selectedOption = options.find((option: any) => option.value === value);
    
    if (selectedOption) {
      return {
        id: selectedOption.value,
        nombre: selectedOption.label
      };
    }
    
    // Fallback: si no se encuentra la opción, crear con el valor como ID y nombre
    console.warn(`Option not found for value: ${value} in ${optionsKey}`);
    return {
      id: value,
      nombre: value
    };
  };

  return {
    id,
    nombres: data.nombres || '',
    fechaNacimiento: data.fechaNacimiento || null,
    tipoIdentificacion: createConfigItemFromValue(data.tipoIdentificacion, 'tiposIdentificacionOptions'),
    numeroIdentificacion: data.numeroIdentificacion || '',
    sexo: createConfigItemFromValue(data.sexo, 'sexoOptions'),
    situacionCivil: createConfigItemFromValue(data.situacionCivil, 'estadoCivilOptions'),
    parentesco: createConfigItemFromValue(data.parentesco, 'parentescosOptions'),
    // Las tallas se almacenan como strings directamente
    talla_camisa: data.talla?.camisa || '',
    talla_pantalon: data.talla?.pantalon || '',
    talla_zapato: data.talla?.calzado || '',
    estudio: createConfigItemFromValue(data.estudio, 'estudiosOptions'),
    comunidadCultural: createConfigItemFromValue(data.comunidadCultural, 'comunidadesCulturalesOptions'),
    telefono: data.telefono || '',
    enQueEresLider: data.enQueEresLider || '',
    habilidadDestreza: data.habilidadDestreza || '',
    correoElectronico: data.correoElectronico || '',
    enfermedad: createConfigItemFromValue(data.enfermedad, 'enfermedadesOptions'),
    necesidadesEnfermo: data.necesidadesEnfermo || '',
    solicitudComunionCasa: data.solicitudComunionCasa || false,
    profesionMotivoFechaCelebrar: {
      profesion: createConfigItemFromValue(data.profesionMotivoFechaCelebrar?.profesion, 'profesionesOptions'),
      motivo: data.profesionMotivoFechaCelebrar?.motivo || '',
      dia: data.profesionMotivoFechaCelebrar?.dia || '',
      mes: data.profesionMotivoFechaCelebrar?.mes || '',
    }
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

  // Configuración de React Hook Form
  const form = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      nombres: '',
      fechaNacimiento: null, // Sin fecha por defecto
      tipoIdentificacion: '',
      numeroIdentificacion: '',
      sexo: '',
      situacionCivil: '',
      parentesco: '',
      talla: { camisa: '', pantalon: '', calzado: '' },
      estudio: '',
      comunidadCultural: '',
      telefono: '',
      enQueEresLider: '',
      habilidadDestreza: '',
      correoElectronico: '',
      enfermedad: '',
      necesidadesEnfermo: '',
      solicitudComunionCasa: false,
      profesionMotivoFechaCelebrar: { profesion: '', motivo: '', dia: '', mes: '' }
    },
    mode: 'onChange' // Validar en tiempo real para mejor UX
  });

  const openDialogForNew = () => {
    try {
      console.log('🟢 Abriendo diálogo para nuevo miembro');
      setEditingFamilyMember(null);
      form.reset();
      setShowFamilyDialog(true);
    } catch (error) {
      console.error('Error al abrir diálogo para nuevo miembro:', error);
    }
  };

  const resetForm = () => {
    try {
      setEditingFamilyMember(null);
      form.reset();
    } catch (error) {
      console.error('Error al resetear formulario:', error);
    }
  };

  const closeDialog = () => {
    try {
      resetForm();
      
      // Usar setTimeout para evitar problemas de timing con el Portal
      setTimeout(() => {
        setShowFamilyDialog(false);
      }, 50);
    } catch (error) {
      console.error('Error al cerrar diálogo:', error);
      // Forzar cierre del diálogo
      setShowFamilyDialog(false);
    }
  };

  const onSubmit = (data: FamilyMemberFormData) => {
    try {
      if (editingFamilyMember) {
        const updatedMember = formDataToFamilyMember(data, editingFamilyMember.id, configurationData);
        setFamilyMembers(prev => prev.map(m => 
          m.id === editingFamilyMember.id ? { ...m, ...updatedMember } : m
        ));
        toast({ 
          title: "Miembro actualizado", 
          description: "Datos actualizados correctamente.",
          duration: 3000
        });
      } else {
        const newMember = formDataToFamilyMember(data, Date.now().toString(), configurationData);
        setFamilyMembers(prev => [...prev, newMember as FamilyMember]);
        toast({ 
          title: "Miembro agregado", 
          description: "Nuevo miembro agregado a la familia.",
          duration: 3000
        });
      }
      
      // Usar setTimeout para evitar problemas con el Portal
      setTimeout(() => {
        closeDialog();
      }, 100);
      
    } catch (error) {
      console.error('Error al procesar miembro familiar:', error);
      toast({ 
        title: "Error", 
        description: "Hubo un problema al procesar la información del miembro. Por favor, inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const handleEdit = (member: FamilyMember) => {
    try {
      // Log detallado para diagnosticar el problema
      console.log('📝 handleEdit llamado con member:', {
        hasId: !!member?.id,
        id: member?.id,
        nombres: member?.nombres,
        memberKeys: member ? Object.keys(member) : 'member is null/undefined',
        memberType: typeof member,
        memberIsNull: member === null,
        memberIsUndefined: member === undefined
      });

      // Validar que el miembro existe
      if (!member) {
        console.error('❌ Member es null o undefined:', member);
        toast({ 
          title: "Error", 
          description: "No se puede editar este miembro. Datos no válidos.",
          variant: "destructive",
          duration: 3000
        });
        return;
      }

      // Si no tiene ID, vamos a generar uno temporal
      let memberWithId = member;
      if (!member.id) {
        console.warn('⚠️ Member sin ID, generando uno temporal:', member);
        memberWithId = { 
          ...member, 
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
        };
        
        // Actualizar el array de familyMembers con el nuevo ID
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
      
      // Pequeño delay para asegurar que el estado se actualice correctamente
      setTimeout(() => {
        setShowFamilyDialog(true);
      }, 50);
      
    } catch (error) {
      console.error('💥 Error al preparar edición de miembro:', error);
      console.error('Stack trace:', error.stack);
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
