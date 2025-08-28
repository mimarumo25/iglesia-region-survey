import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { DeceasedFamilyMember } from "@/types/survey";
import { useDeceasedGrid } from "@/hooks/useDeceasedGrid";
import { DIALOG_BUTTONS } from "@/utils/dialog-helpers";
import LoadingIndicators from "./LoadingIndicators";
import DeceasedMemberDialog from "./DeceasedMemberDialog";
import DeceasedMemberTable from "./DeceasedMemberTable";
import { useConfigurationData } from "@/hooks/useConfigurationData";

interface DeceasedGridProps {
  deceasedMembers: DeceasedFamilyMember[];
  setDeceasedMembers: React.Dispatch<React.SetStateAction<DeceasedFamilyMember[]>>;
}

/**
 * Componente principal para gestionar miembros difuntos
 * Refactorizado en componentes más pequeños para mejor mantenibilidad y reusabilidad
 * 
 * Arquitectura:
 * - LoadingIndicators: Muestra indicadores de carga de datos (reutilizado de FamilyGrid)
 * - DeceasedMemberDialog: Formulario para agregar/editar difuntos
 * - DeceasedMemberTable: Tabla para mostrar y gestionar difuntos existentes
 * - useDeceasedGrid: Hook personalizado que maneja la lógica de negocio
 */
const DeceasedGrid = ({ deceasedMembers, setDeceasedMembers }: DeceasedGridProps) => {
  // Hook personalizado con toda la lógica de negocio
  const {
    showDeceasedDialog,
    setShowDeceasedDialog,
    editingDeceasedMember,
    form,
    resetForm,
    onSubmit,
    handleEdit,
    handleDelete
  } = useDeceasedGrid({ deceasedMembers, setDeceasedMembers });

  // Hook para datos de configuración
  const configurationData = useConfigurationData();

  const handleAddFirst = () => {
    resetForm();
    setShowDeceasedDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Indicadores de carga reutilizables */}
      <LoadingIndicators configurationData={configurationData} />

      {/* Encabezado con título y botón de agregar */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
            Difuntos de la Familia
          </h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Registre información sobre familiares difuntos con detalles del fallecimiento
          </p>
        </div>
        
        <Dialog open={showDeceasedDialog} onOpenChange={setShowDeceasedDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm} 
              className={DIALOG_BUTTONS.trigger.className}
            >
              <Plus className="w-4 h-4" />
              Agregar Difunto
            </Button>
          </DialogTrigger>

          {/* Diálogo para agregar/editar difuntos */}
          <DeceasedMemberDialog
            form={form}
            onSubmit={onSubmit}
            onCancel={resetForm}
            editingMember={editingDeceasedMember}
          />
        </Dialog>
      </div>

      {/* Tabla de miembros difuntos */}
      <DeceasedMemberTable
        deceasedMembers={deceasedMembers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddFirst={handleAddFirst}
      />
    </div>
  );
};

export default DeceasedGrid;
