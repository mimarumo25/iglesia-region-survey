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
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { UserResponse } from "@/services/users";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: UserResponse | null;
  isLoading: boolean;
}

export const DeleteUserDialog = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading
}: DeleteUserDialogProps) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

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
              ¿Está seguro que desea eliminar al usuario{" "}
              <span className="font-semibold">
                {user?.firstName} {user?.lastName}
              </span>?
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Rol:</strong> {user?.role}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
              <p className="text-sm text-red-800">
                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. 
                Se eliminarán todos los datos asociados con este usuario.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Usuario
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
