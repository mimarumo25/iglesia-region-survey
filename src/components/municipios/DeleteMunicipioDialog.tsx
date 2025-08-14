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
import { AlertTriangle, Loader2 } from "lucide-react";
import { Municipio } from '@/services/municipios';

interface DeleteMunicipioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  municipio: Municipio | null;
  isLoading: boolean;
}

export const DeleteMunicipioDialog: React.FC<DeleteMunicipioDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  municipio,
  isLoading
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  if (!municipio) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Eliminación
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              ¿Está seguro de que desea eliminar el municipio{' '}
              <span className="font-semibold text-gray-900">
                "{municipio.nombre_municipio}"
              </span>?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Información del municipio:</strong>
              </p>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Código DANE: {municipio.codigo_dane}</li>
                <li>• Departamento: {municipio.departamento?.nombre || 'N/A'}</li>
                {municipio.created_at && (
                  <li>• Creado: {new Date(municipio.created_at).toLocaleDateString()}</li>
                )}
              </ul>
            </div>
            <p className="text-sm text-red-600 font-medium">
              ⚠️ Esta acción no se puede deshacer.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Eliminando...' : 'Eliminar Municipio'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMunicipioDialog;
