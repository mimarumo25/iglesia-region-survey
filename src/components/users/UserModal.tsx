import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, User, Mail, Lock, Shield } from "lucide-react";
import { CreateUserRequest, UpdateUserRequest, UserResponse } from "@/services/users";

// Schema de validación para crear usuario
const createUserSchema = z.object({
  firstName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  lastName: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  email: z.string()
    .email("Email inválido")
    .min(5, "El email debe tener al menos 5 caracteres"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"),
  role: z.string()
    .min(1, "Debe seleccionar un rol"),
});

// Schema de validación para editar usuario (sin contraseña obligatoria)
const updateUserSchema = z.object({
  firstName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  lastName: z.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  email: z.string()
    .email("Email inválido")
    .min(5, "El email debe tener al menos 5 caracteres"),
  role: z.string()
    .min(1, "Debe seleccionar un rol"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => Promise<boolean>;
  isLoading: boolean;
  user?: UserResponse | null;
  mode: 'create' | 'edit';
}

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "coordinator", label: "Coordinador" },
  { value: "surveyor", label: "Encuestador" }
];

export const UserModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  user, 
  mode 
}: UserModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : updateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      ...(mode === 'create' && { password: "" }),
      role: "",
    },
  });

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && user) {
        form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        });
      } else {
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          ...(mode === 'create' && { password: "" }),
          role: "",
        });
      }
    }
  }, [isOpen, mode, user, form]);

  const handleSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50/80 border-0 shadow-2xl">
        {/* Header mejorado */}
        <DialogHeader className="space-y-4 pb-6 border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                {mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {mode === 'create' 
                  ? 'Complete la información para agregar un nuevo usuario al sistema.'
                  : 'Modifique los datos del usuario seleccionado.'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Formulario mejorado */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-6">
            {/* Información Personal - Card */}
            <div className="bg-white/60 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ingrese el nombre"
                          disabled={isLoading}
                          className="h-12 bg-white/80 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Apellido */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Apellido</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ingrese el apellido"
                          disabled={isLoading}
                          className="h-12 bg-white/80 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Credenciales - Card */}
            <div className="bg-white/60 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Credenciales de Acceso</h3>
              </div>
              
              <div className="space-y-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="usuario@ejemplo.com"
                            disabled={isLoading}
                            className="h-12 pl-10 bg-white/80 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Contraseña (solo para crear) */}
                {mode === 'create' && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              disabled={isLoading}
                              className="h-12 pl-10 bg-white/80 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                        <p className="text-xs text-gray-500 mt-1">
                          Mínimo 8 caracteres, incluya mayúsculas, minúsculas, números y símbolos
                        </p>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Permisos - Card */}
            <div className="bg-white/60 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Permisos y Rol</h3>
              </div>
              
              {/* Rol */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Rol del Usuario</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/80 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg">
                        <SelectItem value="admin" className="rounded-lg">
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div>
                              <span className="font-medium">Administrador</span>
                              <p className="text-xs text-gray-500">Acceso completo al sistema</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="coordinator" className="rounded-lg">
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <span className="font-medium">Coordinador</span>
                              <p className="text-xs text-gray-500">Gestión de encuestas y reportes</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="surveyor" className="rounded-lg">
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <span className="font-medium">Encuestador</span>
                              <p className="text-xs text-gray-500">Realización de encuestas</p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Botones de acción mejorados */}
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="h-12 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'create' ? 'Creando...' : 'Actualizando...'}
                  </>
                ) : (
                  <>
                    {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
