import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FamilyMember } from "@/types/survey";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { useFamilyGrid } from "@/hooks/useFamilyGrid";
import { DIALOG_BUTTONS } from "@/utils/dialog-helpers";
import LoadingIndicators from "./LoadingIndicators";
import FamilyMemberDialog from "./FamilyMemberDialog";
import FamilyMemberTable from "./FamilyMemberTable";

interface FamilyGridProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
}

/**
 * Componente principal para gestionar miembros familiares
 * Refactorizado en componentes más pequeños para mejor mantenibilidad y reusabilidad
 * 
 * Arquitectura:
 * - LoadingIndicators: Muestra indicadores de carga de datos
 * - FamilyMemberDialog: Formulario para agregar/editar miembros
 * - FamilyMemberTable: Tabla para mostrar y gestionar miembros existentes
 * - useFamilyGrid: Hook personalizado que maneja la lógica de negocio
 */
const FamilyGrid = ({ familyMembers, setFamilyMembers }: FamilyGridProps) => {
  // Hook personalizado con toda la lógica de negocio
  const {
    showFamilyDialog,
    setShowFamilyDialog,
    editingFamilyMember,
    form,
    resetForm,
    onSubmit,
    handleEdit,
    handleDelete
  } = useFamilyGrid({ familyMembers, setFamilyMembers });

  // Hook para datos de configuración
  const configurationData = useConfigurationData();

  const handleAddFirst = () => {
    resetForm();
    setShowFamilyDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Indicadores de carga reutilizables */}
      <LoadingIndicators configurationData={configurationData} />

      {/* Encabezado con título y botón de agregar */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
            Integrantes de la Familia
          </h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Agregue la información de cada miembro del hogar
          </p>
        </div>
        
        <Dialog open={showFamilyDialog} onOpenChange={setShowFamilyDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm} 
              className={DIALOG_BUTTONS.trigger.className}
            >
              <Plus className="w-4 h-4" />
              Agregar Miembro
            </Button>
          </DialogTrigger>

          {/* Diálogo para agregar/editar miembros */}
          <FamilyMemberDialog
            form={form}
            onSubmit={onSubmit}
            onCancel={resetForm}
            editingMember={editingFamilyMember}
          />
        </Dialog>
      </div>

      {/* Tabla de miembros familiares */}
      <FamilyMemberTable
        familyMembers={familyMembers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddFirst={handleAddFirst}
      />
    </div>
  );
};

export default FamilyGrid;
