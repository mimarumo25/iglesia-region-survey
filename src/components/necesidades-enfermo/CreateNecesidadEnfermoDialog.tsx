import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ConfigFormField, ConfigModal } from '@/components/ui/config-modal';
import { useNecesidadesEnfermoMutations } from '@/hooks/useNecesidadesEnfermo';
import { NecesidadEnfermoOption } from '@/types/necesidades-enfermo';

interface CreateNecesidadEnfermoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (option: NecesidadEnfermoOption) => void;
  initialName?: string;
}

export const CreateNecesidadEnfermoDialog = ({
  open,
  onOpenChange,
  onCreated,
  initialName = '',
}: CreateNecesidadEnfermoDialogProps) => {
  const [nombre, setNombre] = useState(initialName);
  const [descripcion, setDescripcion] = useState('');
  const { createMutation } = useNecesidadesEnfermoMutations();

  useEffect(() => {
    if (open) {
      setNombre(initialName);
      setDescripcion('');
    }
  }, [initialName, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setNombre(initialName);
      setDescripcion('');
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = nombre.trim();
    if (!cleanName) return;

    createMutation.mutate(
      { nombre: cleanName, descripcion: descripcion.trim() || undefined },
      {
        onSuccess: (created) => {
          onCreated?.({
            id: created.id_tipo_necesidad_enfermo,
            nombre: created.nombre,
          });
          onOpenChange(false);
          setNombre('');
          setDescripcion('');
        },
      }
    );
  };

  return (
    <ConfigModal
      open={open}
      onOpenChange={handleOpenChange}
      type="create"
      title="Nueva Necesidad del Enfermo"
      description="La nueva opción quedará disponible inmediatamente en la encuesta."
      icon={Plus}
      loading={createMutation.isPending}
      onSubmit={handleSubmit}
      submitText="Crear y seleccionar"
    >
      <ConfigFormField
        id="nueva-necesidad-nombre"
        label="Nombre"
        placeholder="Ej: Medicamentos"
        value={nombre}
        onChange={setNombre}
        required
      />
      <ConfigFormField
        id="nueva-necesidad-descripcion"
        label="Descripción"
        type="textarea"
        placeholder="Descripción opcional de la necesidad"
        value={descripcion}
        onChange={setDescripcion}
      />
    </ConfigModal>
  );
};
