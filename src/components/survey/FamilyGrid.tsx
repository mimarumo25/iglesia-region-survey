import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
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
    closeDialog,
    openDialogForNew,
    onSubmit,
    handleEdit,
    handleDelete
  } = useFamilyGrid({ familyMembers, setFamilyMembers });

  // Hook para datos de configuración
  const configurationData = useConfigurationData();

  const handleAddFirst = () => {
    console.log('🎯 handleAddFirst llamado - usando openDialogForNew');
    openDialogForNew();
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
        
        <Dialog 
          open={showFamilyDialog} 
          onOpenChange={(open) => {
            if (!open) {
              // Llamar closeDialog cuando se cierre el diálogo
              setTimeout(() => {
                closeDialog();
              }, 100);
            } else {
              // Abrir el diálogo
              setShowFamilyDialog(open);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                console.log('🎯 Botón Agregar Miembro clickeado - usando openDialogForNew');
                openDialogForNew();
              }}
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
            onCancel={closeDialog}
            editingMember={editingFamilyMember}
          />
        </Dialog>
      </div>

      {/* Tabla de miembros familiares con protección de error boundary */}
      <ErrorBoundary
        fallback={
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50 text-center">
            <h4 className="text-lg font-semibold text-red-700 mb-2">Error en la tabla</h4>
            <p className="text-red-600 mb-4">Hubo un problema al mostrar la tabla de miembros familiares.</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Recargar página
            </Button>
          </div>
        }
        onError={(error, errorInfo) => {
          console.error('Error en FamilyMemberTable:', error);
          console.error('ErrorInfo:', errorInfo);
          
          // Logging específico para errores de DOM
          if (error.message?.includes('removeChild') || error.message?.includes('NotFoundError')) {
            console.warn('🔧 DOM manipulation error en tabla familiar - aplicando recovery automático');
          }
        }}
      >
        <FamilyMemberTable
          familyMembers={familyMembers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddFirst={handleAddFirst}
        />
      </ErrorBoundary>
    </div>
  );
};

export default FamilyGrid;
