import { ConfigModal, ConfigFormField } from "@/components/ui/config-modal";
import { User as UserIcon } from "lucide-react";

export interface UserFormData {
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo_electronico: string;
  password: string;
  telefono: string;
  numero_documento: string;
}

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const CreateUserModal = ({ 
  open, 
  onOpenChange, 
  formData, 
  setFormData, 
  onSubmit, 
  loading 
}: CreateUserModalProps) => {
  return (
    <ConfigModal
      open={open}
      onOpenChange={onOpenChange}
      type="create"
      title="Nuevo Usuario"
      description="Crea un nuevo usuario en el sistema"
      icon={UserIcon}
      loading={loading}
      onSubmit={onSubmit}
      submitText="Crear Usuario"
    >
      {/* Información Personal - Primera fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfigFormField
          id="primer_nombre"
          label="Primer Nombre"
          placeholder="Ej: Juan"
          value={formData.primer_nombre}
          onChange={(value) => setFormData({ ...formData, primer_nombre: value })}
          required
        />
        <ConfigFormField
          id="segundo_nombre"
          label="Segundo Nombre (Opcional)"
          placeholder="Ej: Carlos"
          value={formData.segundo_nombre}
          onChange={(value) => setFormData({ ...formData, segundo_nombre: value })}
        />
      </div>

      {/* Apellidos - Segunda fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfigFormField
          id="primer_apellido"
          label="Primer Apellido"
          placeholder="Ej: Pérez"
          value={formData.primer_apellido}
          onChange={(value) => setFormData({ ...formData, primer_apellido: value })}
          required
        />
        <ConfigFormField
          id="segundo_apellido"
          label="Segundo Apellido (Opcional)"
          placeholder="Ej: García"
          value={formData.segundo_apellido}
          onChange={(value) => setFormData({ ...formData, segundo_apellido: value })}
        />
      </div>

      {/* Credenciales - Tercera fila */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <ConfigFormField
          id="correo_electronico"
          label="Correo Electrónico"
          placeholder="Ej: juan.perez@example.com"
          value={formData.correo_electronico}
          onChange={(value) => setFormData({ ...formData, correo_electronico: value })}
          required
        />
        <ConfigFormField
          id="password"
          label="Contraseña"
          placeholder="********"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          required
        />
      </div>

      {/* Información Adicional - Cuarta fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfigFormField
          id="telefono"
          label="Teléfono (Opcional)"
          placeholder="Ej: +57 300 123 4567"
          value={formData.telefono}
          onChange={(value) => setFormData({ ...formData, telefono: value })}
        />
        <ConfigFormField
          id="numero_documento"
          label="Número de Documento (Opcional)"
          placeholder="Ej: 12345678"
          value={formData.numero_documento}
          onChange={(value) => setFormData({ ...formData, numero_documento: value })}
        />
      </div>
    </ConfigModal>
  );
};
