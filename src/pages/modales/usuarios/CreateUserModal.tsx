import { ConfigModal, ConfigFormField } from "@/components/ui/config-modal";
import { User as UserIcon } from "lucide-react";

export interface UserFormData {
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo_electronico: string;
  password: string;  // Internamente usamos 'password' en el form
  telefono: string;
  numero_documento: string;
  rol: string;  // Nuevo campo para rol
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
  // Validaciones en tiempo real
  const isPasswordValid = 
    formData.password.length >= 8 && 
    formData.password.length <= 100 &&
    /[a-z]/.test(formData.password) &&
    /[A-Z]/.test(formData.password) &&
    /[0-9]/.test(formData.password) &&
    /[@$!%*?&#^()_+=\-\[\]{}|:;"'<>,.~`]/.test(formData.password);
  
  const isPhoneValid = !formData.telefono || (formData.telefono.length >= 10 && formData.telefono.length <= 20);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico);
  
  const canSubmit = 
    formData.primer_nombre.trim() !== "" &&
    formData.primer_apellido.trim() !== "" &&
    isEmailValid &&
    isPasswordValid &&
    isPhoneValid &&
    formData.rol !== "";  // Validar que se haya seleccionado un rol

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
        <div>
          <ConfigFormField
            id="correo_electronico"
            label="Correo Electrónico"
            placeholder="Ej: juan.perez@example.com"
            value={formData.correo_electronico}
            onChange={(value) => setFormData({ ...formData, correo_electronico: value })}
            required
          />
          {formData.correo_electronico && !isEmailValid && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">❌ El formato del email no es válido</p>
          )}
          {formData.correo_electronico && isEmailValid && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">✅ Email válido</p>
          )}
        </div>
        <div>
          <ConfigFormField
            id="password"
            label="Contraseña"
            placeholder="********"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            required
          />
          {/* Ayuda visual para requisitos de contraseña */}
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Requisitos de contraseña:</p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li className="flex items-start gap-2">
                <span className={formData.password.length >= 8 && formData.password.length <= 100 ? "text-green-600" : "text-gray-500"}>●</span>
                <span>Entre 8 y 100 caracteres</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={/[a-z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>●</span>
                <span>Al menos una letra minúscula (a-z)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>●</span>
                <span>Al menos una letra mayúscula (A-Z)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={/[0-9]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>●</span>
                <span>Al menos un número (0-9)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={/[@$!%*?&#^()_+=\-\[\]{}|:;"'<>,.~`]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>●</span>
                <span>Al menos un carácter especial (@$!%*?&#, etc.)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rol - Cuarta fila */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
          Rol del Usuario <span className="text-red-500">*</span>
        </label>
        <select
          id="rol"
          value={formData.rol}
          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          className="w-full h-12 px-4 bg-background dark:bg-background border border-input dark:border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          required
        >
          <option value="">Seleccione un rol</option>
          <option value="Administrador">👑 Administrador - Acceso completo al sistema</option>
          <option value="Encuestador">📋 Encuestador - Realización de encuestas</option>
        </select>
        {!formData.rol && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            ⚠️ Debe seleccionar un rol para el usuario
          </p>
        )}
        {formData.rol && (
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
            ✅ Rol seleccionado: <strong>{formData.rol}</strong>
          </p>
        )}
      </div>

      {/* Información Adicional - Quinta fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ConfigFormField
            id="telefono"
            label="Teléfono (Opcional)"
            placeholder="Ej: +57 300 123 4567"
            value={formData.telefono}
            onChange={(value) => setFormData({ ...formData, telefono: value })}
          />
          {formData.telefono && formData.telefono.length > 0 && formData.telefono.length < 10 && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">⚠️ El teléfono debe tener al menos 10 dígitos</p>
          )}
        </div>
        <ConfigFormField
          id="numero_documento"
          label="Número de Documento (Opcional)"
          placeholder="Ej: 12345678"
          value={formData.numero_documento}
          onChange={(value) => setFormData({ ...formData, numero_documento: value })}
        />
      </div>
      
      {/* Nota adicional sobre permisos */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">ℹ️ Información sobre roles:</p>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Administrador</strong>: Gestión completa de usuarios, encuestas y configuración del sistema</li>
          <li>• <strong>Encuestador</strong>: Creación y edición de encuestas, visualización de reportes básicos</li>
        </ul>
      </div>
    </ConfigModal>
  );
};
