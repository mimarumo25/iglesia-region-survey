import { ConfigModal, ConfigFormField } from "@/components/ui/config-modal";
import { Edit2 } from "lucide-react";
import { UserFormData } from "./CreateUserModal";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const EditUserModal = ({ 
  open, 
  onOpenChange, 
  formData, 
  setFormData, 
  onSubmit, 
  loading 
}: EditUserModalProps) => {
  return (
    <ConfigModal
      open={open}
      onOpenChange={onOpenChange}
      type="edit"
      title="Editar Usuario"
      description="Modifica los datos del usuario"
      icon={Edit2}
      loading={loading}
      onSubmit={onSubmit}
      submitText="Guardar Cambios"
    >
      {/* Información Personal - Primera fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfigFormField
          id="edit-primer_nombre"
          label="Primer Nombre"
          placeholder="Ej: Juan"
          value={formData.primer_nombre}
          onChange={(value) => setFormData({ ...formData, primer_nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-segundo_nombre"
          label="Segundo Nombre (Opcional)"
          placeholder="Ej: Carlos"
          value={formData.segundo_nombre}
          onChange={(value) => setFormData({ ...formData, segundo_nombre: value })}
        />
      </div>

      {/* Apellidos - Segunda fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ConfigFormField
          id="edit-primer_apellido"
          label="Primer Apellido"
          placeholder="Ej: Pérez"
          value={formData.primer_apellido}
          onChange={(value) => setFormData({ ...formData, primer_apellido: value })}
          required
        />
        <ConfigFormField
          id="edit-segundo_apellido"
          label="Segundo Apellido (Opcional)"
          placeholder="Ej: García"
          value={formData.segundo_apellido}
          onChange={(value) => setFormData({ ...formData, segundo_apellido: value })}
        />
      </div>

      {/* Email - Tercera fila */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <ConfigFormField
          id="edit-correo_electronico"
          label="Correo Electrónico"
          placeholder="Ej: juan.perez@example.com"
          value={formData.correo_electronico}
          onChange={(value) => setFormData({ ...formData, correo_electronico: value })}
          required
        />
      </div>

      {/* Información Adicional - Cuarta fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfigFormField
          id="edit-telefono"
          label="Teléfono (Opcional)"
          placeholder="Ej: +57 300 123 4567"
          value={formData.telefono}
          onChange={(value) => setFormData({ ...formData, telefono: value })}
        />
        <ConfigFormField
          id="edit-numero_documento"
          label="Número de Documento (Opcional)"
          placeholder="Ej: 12345678"
          value={formData.numero_documento}
          onChange={(value) => setFormData({ ...formData, numero_documento: value })}
        />
      </div>
    </ConfigModal>
  );
};
