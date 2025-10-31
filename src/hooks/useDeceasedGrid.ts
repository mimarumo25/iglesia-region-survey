/**
 * Custom Hook para gestión de Miembros Difuntos
 * 
 * Este hook encapsula toda la lógica de negocio para el manejo de miembros difuntos,
 * incluyendo formularios, validaciones, operaciones CRUD y estado del diálogo.
 * 
 * Características:
 * - Gestión completa del formulario con React Hook Form + Zod
 * - Operaciones CRUD (Create, Read, Update, Delete) para difuntos
 * - Manejo de estado del diálogo modal
 * - Integración con toast notifications
 * - Funciones de transformación de datos
 * - Validaciones de formulario
 * - Manejo de errores
 * 
 * Arquitectura:
 * - Separación de responsabilidades: lógica vs presentación
 * - Reutilización: puede usarse en otros contextos
 * - Testabilidad: lógica aislada es más fácil de testear
 * - Mantenibilidad: cambios de lógica no afectan componentes UI
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { DeceasedFamilyMember, ConfigurationItem } from "@/types/survey";

// Esquema de validación con Zod - Compatible con ConfigurationItem con IDs numéricos
const deceasedMemberSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  fechaFallecimiento: z.date().nullable().optional(),
  sexo: z.object({
    id: z.union([z.string(), z.number()]).transform(val => {
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? val : num;
    }),
    nombre: z.string()
  }).nullable().optional(),
  parentesco: z.object({
    id: z.union([z.string(), z.number()]).transform(val => {
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? val : num;
    }),
    nombre: z.string()
  }).nullable().optional(),
  causaFallecimiento: z.string().min(1, "La causa de fallecimiento es obligatoria"),
});

export type DeceasedMemberFormData = z.infer<typeof deceasedMemberSchema>;

interface UseDeceasedGridProps {
  deceasedMembers: DeceasedFamilyMember[];
  setDeceasedMembers: React.Dispatch<React.SetStateAction<DeceasedFamilyMember[]>>;
}

interface UseDeceasedGridReturn {
  // Estado del diálogo
  showDeceasedDialog: boolean;
  setShowDeceasedDialog: React.Dispatch<React.SetStateAction<boolean>>;
  editingDeceasedMember: DeceasedFamilyMember | null;
  
  // Form management
  form: ReturnType<typeof useForm<DeceasedMemberFormData>>;
  
  // Funciones principales
  resetForm: () => void;
  onSubmit: (data: DeceasedMemberFormData) => void;
  handleEdit: (member: DeceasedFamilyMember) => void;
  handleDelete: (id: string) => void;
  
  // Utilidades
  isEmpty: boolean;
  totalMembers: number;
}

/**
 * Hook personalizado para gestionar difuntos familiares
 * 
 * @param props - Props con el estado de difuntos y setter
 * @returns Objeto con todas las funciones y estado necesarios
 * 
 * @example
 * ```tsx
 * const {
 *   showDeceasedDialog,
 *   setShowDeceasedDialog,
 *   editingDeceasedMember,
 *   form,
 *   resetForm,
 *   onSubmit,
 *   handleEdit,
 *   handleDelete,
 *   isEmpty,
 *   totalMembers
 * } = useDeceasedGrid({ deceasedMembers, setDeceasedMembers });
 * ```
 */
export const useDeceasedGrid = ({
  deceasedMembers,
  setDeceasedMembers
}: UseDeceasedGridProps): UseDeceasedGridReturn => {
  
  // Estado local
  const [showDeceasedDialog, setShowDeceasedDialog] = useState(false);
  const [editingDeceasedMember, setEditingDeceasedMember] = useState<DeceasedFamilyMember | null>(null);
  const { toast } = useToast();

  // Configuración de React Hook Form
  const form = useForm<DeceasedMemberFormData>({
    resolver: zodResolver(deceasedMemberSchema),
    defaultValues: {
      nombres: '',
      fechaFallecimiento: null,
      sexo: null,
      parentesco: null,
      causaFallecimiento: '',
    }
  });

  /**
   * Resetea el formulario y cierra el diálogo
   */
  const resetForm = () => {
    setEditingDeceasedMember(null);
    form.reset({
      nombres: '',
      fechaFallecimiento: null,
      sexo: null,
      parentesco: null,
      causaFallecimiento: '',
    });
    setShowDeceasedDialog(false);
  };

  /**
   * Procesa el envío del formulario (crear o actualizar)
   * @param data - Datos del formulario validados
   */
  const onSubmit = (data: DeceasedMemberFormData) => {
    try {
      if (editingDeceasedMember) {
        // Actualizar difunto existente
        setDeceasedMembers(prev => prev.map(m => 
          m.id === editingDeceasedMember.id ? { ...data, id: m.id } as DeceasedFamilyMember : m
        ));
        
        toast({ 
          title: "Difunto actualizado", 
          description: `Los datos de ${data.nombres} han sido actualizados correctamente.`,
          duration: 3000
        });
      } else {
        // Crear nuevo difunto
        const newMember: DeceasedFamilyMember = { 
          ...data, 
          id: Date.now().toString() 
        } as DeceasedFamilyMember;
        
        setDeceasedMembers(prev => [...prev, newMember]);
        
        toast({ 
          title: "Difunto agregado", 
          description: `${data.nombres} ha sido agregado a la lista de difuntos.`,
          duration: 3000
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Error al procesar difunto:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar los datos. Por favor, inténtelo de nuevo.",
        variant: "destructive",
        duration: 4000
      });
    }
  };

  /**
   * Inicia la edición de un difunto
   * @param member - Difunto a editar
   */
  const handleEdit = (member: DeceasedFamilyMember) => {
    try {
      setEditingDeceasedMember(member);
      
      // Convertir fechas de string a Date si es necesario
      const formData: DeceasedMemberFormData = {
        ...member,
        fechaFallecimiento: member.fechaFallecimiento 
          ? (member.fechaFallecimiento instanceof Date 
              ? member.fechaFallecimiento 
              : new Date(member.fechaFallecimiento as string))
          : null,
      };
      
      form.reset(formData);
      setShowDeceasedDialog(true);
      
      toast({
        title: "Modo edición",
        description: `Editando los datos de ${member.nombres}`,
        duration: 2000
      });
    } catch (error) {
      console.error('Error al cargar datos para edición:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos para edición.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  /**
   * Elimina un difunto de la lista
   * @param id - ID del difunto a eliminar
   */
  const handleDelete = (id: string) => {
    try {
      const memberToDelete = deceasedMembers.find(m => m.id === id);
      setDeceasedMembers(prev => prev.filter(m => m.id !== id));
      
      toast({ 
        title: "Difunto eliminado", 
        description: memberToDelete 
          ? `${memberToDelete.nombres} ha sido eliminado de la lista.`
          : "El difunto ha sido eliminado de la lista.",
        duration: 3000
      });
    } catch (error) {
      console.error('Error al eliminar difunto:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el difunto. Por favor, inténtelo de nuevo.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  // Utilidades derivadas
  const isEmpty = deceasedMembers.length === 0;
  const totalMembers = deceasedMembers.length;

  return {
    // Estado del diálogo
    showDeceasedDialog,
    setShowDeceasedDialog,
    editingDeceasedMember,
    
    // Form management
    form,
    
    // Funciones principales
    resetForm,
    onSubmit,
    handleEdit,
    handleDelete,
    
    // Utilidades
    isEmpty,
    totalMembers,
  };
};

export default useDeceasedGrid;
