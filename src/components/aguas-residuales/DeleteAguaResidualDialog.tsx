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
import { Loader2, AlertTriangle, Droplets } from "lucide-react";
import { AguaResidual } from "@/types/aguas-residuales";

interface DeleteAguaResidualDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  aguaResidual: AguaResidual | null;
  isLoading?: boolean;
}

export const DeleteAguaResidualDialog: React.FC<DeleteAguaResidualDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  aguaResidual,
  isLoading = false,
}) => {
  if (!aguaResidual) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Eliminación
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              ¿Estás seguro de que deseas eliminar el tipo de agua residual?
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {aguaResidual.nombre}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {aguaResidual.descripcion}
                  </p>
                  <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
                    <span>ID: {aguaResidual.id_tipo_aguas_residuales}</span>
                    {aguaResidual.created_at && (
                      <span>
                        Creado: {new Date(aguaResidual.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-red-600 font-medium">
              Esta acción no se puede deshacer. Se eliminará permanentemente el tipo de agua residual 
              del sistema.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
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
