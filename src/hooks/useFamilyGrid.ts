import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { FamilyMember, ConfigurationItem } from "@/types/survey";
// Importar validaciones de tallas
import { tallasValidationSchemas } from "@/components/tallas";

// Esquema de validación con Zod - Usando validación de tallas mejorada
const familyMemberSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  fechaNacimiento: z.date().optional().nullable(),
  tipoIdentificacion: z.string().optional(),
  numeroIdentificacion: z.string().optional(),
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
  telefono: z.string().optional(),
  enQueEresLider: z.string().optional(),
  habilidadDestreza: z.string().optional(),
  correoElectronico: z.string().email("Email inválido").optional().or(z.literal("")),
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
  return {
    nombres: member.nombres,
    fechaNacimiento: member.fechaNacimiento && member.fechaNacimiento instanceof Date && !isNaN(member.fechaNacimiento.getTime()) 
      ? member.fechaNacimiento 
      : null,
    tipoIdentificacion: typeof member.tipoIdentificacion === 'object' && member.tipoIdentificacion ? member.tipoIdentificacion.nombre : '',
    numeroIdentificacion: member.numeroIdentificacion || '',
    sexo: typeof member.sexo === 'object' && member.sexo ? member.sexo.nombre : '',
    situacionCivil: typeof member.situacionCivil === 'object' && member.situacionCivil ? member.situacionCivil.nombre : '',
    parentesco: typeof member.parentesco === 'object' && member.parentesco ? member.parentesco.nombre : '',
    talla: {
      // Las tallas ya son strings, se pasan directamente
      camisa: member.talla_camisa || '',
      pantalon: member.talla_pantalon || '',
      calzado: member.talla_zapato || '',
    },
    estudio: typeof member.estudio === 'object' && member.estudio ? member.estudio.nombre : '',
    comunidadCultural: typeof member.comunidadCultural === 'object' && member.comunidadCultural ? member.comunidadCultural.nombre : '',
    telefono: member.telefono || '',
    enQueEresLider: member.enQueEresLider || '',
    habilidadDestreza: member.habilidadDestreza || '',
    correoElectronico: member.correoElectronico || '',
    enfermedad: typeof member.enfermedad === 'object' && member.enfermedad ? member.enfermedad.nombre : '',
    necesidadesEnfermo: member.necesidadesEnfermo || '',
    solicitudComunionCasa: member.solicitudComunionCasa || false,
    profesionMotivoFechaCelebrar: {
      profesion: typeof member.profesionMotivoFechaCelebrar?.profesion === 'object' && member.profesionMotivoFechaCelebrar?.profesion ? member.profesionMotivoFechaCelebrar.profesion.nombre : '',
      motivo: member.profesionMotivoFechaCelebrar?.motivo || '',
      dia: member.profesionMotivoFechaCelebrar?.dia || '',
      mes: member.profesionMotivoFechaCelebrar?.mes || '',
    }
  };
};

/**
 * Transforma FamilyMemberFormData a FamilyMember para guardar
 */
const formDataToFamilyMember = (data: FamilyMemberFormData, id: string): Partial<FamilyMember> => {
  // Crear ConfigurationItem o null para cada campo (excepto tallas)
  const createConfigItem = (value: string | undefined): ConfigurationItem | null => {
    return value && value.trim() ? { id: Date.now().toString(), nombre: value } : null;
  };

  return {
    id,
    nombres: data.nombres,
    fechaNacimiento: data.fechaNacimiento || null,
    tipoIdentificacion: createConfigItem(data.tipoIdentificacion),
    numeroIdentificacion: data.numeroIdentificacion || '',
    sexo: createConfigItem(data.sexo),
    situacionCivil: createConfigItem(data.situacionCivil),
    parentesco: createConfigItem(data.parentesco),
    // Las tallas se almacenan como strings directamente
    talla_camisa: data.talla?.camisa || '',
    talla_pantalon: data.talla?.pantalon || '',
    talla_zapato: data.talla?.calzado || '',
    estudio: createConfigItem(data.estudio),
    comunidadCultural: createConfigItem(data.comunidadCultural),
    telefono: data.telefono || '',
    enQueEresLider: data.enQueEresLider || '',
    habilidadDestreza: data.habilidadDestreza || '',
    correoElectronico: data.correoElectronico || '',
    enfermedad: createConfigItem(data.enfermedad),
    necesidadesEnfermo: data.necesidadesEnfermo || '',
    solicitudComunionCasa: data.solicitudComunionCasa || false,
    profesionMotivoFechaCelebrar: {
      profesion: createConfigItem(data.profesionMotivoFechaCelebrar?.profesion),
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
    }
  });

  const resetForm = () => {
    setEditingFamilyMember(null);
    form.reset();
    setShowFamilyDialog(false);
  };

  const onSubmit = (data: FamilyMemberFormData) => {
    if (editingFamilyMember) {
      const updatedMember = formDataToFamilyMember(data, editingFamilyMember.id);
      setFamilyMembers(prev => prev.map(m => 
        m.id === editingFamilyMember.id ? { ...m, ...updatedMember } : m
      ));
      toast({ 
        title: "Miembro actualizado", 
        description: "Datos actualizados correctamente.",
        duration: 3000
      });
    } else {
      const newMember = formDataToFamilyMember(data, Date.now().toString());
      setFamilyMembers(prev => [...prev, newMember as FamilyMember]);
      toast({ 
        title: "Miembro agregado", 
        description: "Nuevo miembro agregado a la familia.",
        duration: 3000
      });
    }
    resetForm();
  };

  const handleEdit = (member: FamilyMember) => {
    const migratedMember = migrateDateFormat(member);
    const formData = familyMemberToFormData(migratedMember);
    setEditingFamilyMember(migratedMember);
    form.reset(formData);
    setShowFamilyDialog(true);
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
    onSubmit,
    handleEdit,
    handleDelete
  };
};
