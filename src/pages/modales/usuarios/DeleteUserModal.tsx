import { ConfigModal } from "@/components/ui/config-modal";
import { Trash2 } from "lucide-react";
import { UserResponse } from "@/services/users";

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  selectedUser: UserResponse | null;
}

// Función helper para formatear nombre completo
const getFullName = (user: UserResponse | null) => {
  if (!user) return 'Usuario no seleccionado';
  const nombres = [user.primer_nombre, user.segundo_nombre].filter(Boolean).join(' ');
  const apellidos = [user.primer_apellido, user.segundo_apellido].filter(Boolean).join(' ');
  return `${nombres} ${apellidos}`.trim();
};

export const DeleteUserModal = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  loading, 
  selectedUser 
}: DeleteUserModalProps) => {
  return (
    <ConfigModal
      open={open}
      onOpenChange={onOpenChange}
      type="delete"
      title="¿Estás seguro?"
      description="Esta acción no se puede deshacer. Se eliminará permanentemente el usuario"
      icon={Trash2}
      loading={loading}
      onConfirm={onConfirm}
      entityName={selectedUser ? getFullName(selectedUser) : 'Usuario'}
      submitText="Eliminar Usuario"
    />
  );
};
