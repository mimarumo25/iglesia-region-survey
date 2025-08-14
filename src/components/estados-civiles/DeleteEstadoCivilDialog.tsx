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
import { Loader2, AlertTriangle, Heart } from "lucide-react";
import { EstadoCivil } from "@/types/estados-civiles";

interface DeleteEstadoCivilDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  estadoCivil: EstadoCivil | null;
  isLoading?: boolean;
}

export const DeleteEstadoCivilDialog: React.FC<DeleteEstadoCivilDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  estadoCivil,
  isLoading = false,
}) => {
  if (!estadoCivil) return null;

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
              ¿Estás seguro de que deseas eliminar este estado civil?
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-pink-500">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">
                      {estadoCivil.nombre}
                    </p>
                    <Badge 
                      variant={estadoCivil.activo ? "default" : "secondary"}
                      className={estadoCivil.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {estadoCivil.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {estadoCivil.descripcion}
                  </p>
                  <div className="flex flex-col gap-1 mt-2 text-xs text-gray-500">
                    <div className="grid grid-cols-2 gap-4">
                      <span>ID: {estadoCivil.id}</span>
                      <span>Código: {estadoCivil.codigo}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <span>Orden: {estadoCivil.orden}</span>
                      {estadoCivil.createdAt && (
                        <span>
                          Creado: {new Date(estadoCivil.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-red-600 font-medium">
              Esta acción no se puede deshacer. Se eliminará permanentemente el estado civil 
              del sistema y podría afectar los registros que lo utilicen.
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
