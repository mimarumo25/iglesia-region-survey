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
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Users } from "lucide-react";
import { Parentesco } from "@/types/parentescos";

interface DeleteParentescoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  parentesco: Parentesco | null;
  isLoading?: boolean;
}

export const DeleteParentescoDialog: React.FC<DeleteParentescoDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  parentesco,
  isLoading = false,
}) => {
  if (!parentesco) return null;

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
              ¿Estás seguro de que deseas eliminar este tipo de parentesco?
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">
                      {parentesco.nombre}
                    </p>
                    <Badge 
                      variant={parentesco.activo ? "default" : "secondary"}
                      className={parentesco.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {parentesco.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {parentesco.descripcion}
                  </p>
                  <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
                    <span>ID: {parentesco.id_parentesco}</span>
                    {parentesco.createdAt && (
                      <span>
                        Creado: {new Date(parentesco.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-red-600 font-medium">
              Esta acción no se puede deshacer. Se eliminará permanentemente el tipo de parentesco 
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
