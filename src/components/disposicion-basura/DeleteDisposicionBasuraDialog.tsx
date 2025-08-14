import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { DisposicionBasura } from "@/types/disposicion-basura";

interface DeleteDisposicionBasuraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  disposicionBasura: DisposicionBasura | null;
  isDeleting: boolean;
}

export const DeleteDisposicionBasuraDialog: React.FC<DeleteDisposicionBasuraDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  disposicionBasura,
  isDeleting,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // El error se maneja en el hook
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Eliminar Tipo de Disposición
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>¿Estás seguro de que deseas eliminar este tipo de disposición de basura?</span>
            {disposicionBasura && (
              <div className="bg-muted p-3 rounded-md">
                <p className="font-semibold">{disposicionBasura.nombre}</p>
                <p className="text-sm text-muted-foreground">{disposicionBasura.descripcion}</p>
              </div>
            )}
            <span className="text-sm text-red-600 block">
              Esta acción no se puede deshacer y eliminará permanentemente este tipo de disposición del sistema.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
