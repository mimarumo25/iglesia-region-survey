import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTable, ResponsiveTableColumn } from '@/components/ui/responsive-table';
import { useConfigModal } from "@/components/ui/config-modal";
import { useUsers } from "@/hooks/useUsers";
import { UserResponse, CreateUserRequest, UpdateUserRequest } from "@/services/users";

// Importar modales refactorizados
import { CreateUserModal, EditUserModal, DeleteUserModal, type UserFormData } from "@/pages/modales/usuarios";
import {
  User as UserIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const UsersPage = () => {
  const usersHook = useUsers();

  // Queries
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = usersHook.useUsersQuery();
  const users = usersData as UserResponse[] | undefined;

  // Mutations
  const createMutation = usersHook.useCreateUserMutation();
  const updateMutation = usersHook.useUpdateUserMutation();
  const deleteMutation = usersHook.useDeleteUserMutation();

  const loading = usersLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Estados para diálogos y formularios
  const {
    showCreateDialog,
    showEditDialog,
    showDeleteDialog,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    setShowCreateDialog,
    setShowEditDialog,
    setShowDeleteDialog,
  } = useConfigModal();
  
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo_electronico: "",
    password: "",
    telefono: "",
    numero_documento: "",
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.primer_nombre.trim() || !formData.primer_apellido.trim() || !formData.correo_electronico.trim() || !formData.password.trim()) return;

    createMutation.mutate({
      primer_nombre: formData.primer_nombre.trim(),
      segundo_nombre: formData.segundo_nombre.trim() || undefined,
      primer_apellido: formData.primer_apellido.trim(),
      segundo_apellido: formData.segundo_apellido.trim() || undefined,
      correo_electronico: formData.correo_electronico.trim(),
      password: formData.password.trim(),
      telefono: formData.telefono.trim() || undefined,
      numero_documento: formData.numero_documento.trim() || undefined,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ 
          primer_nombre: "", 
          segundo_nombre: "", 
          primer_apellido: "", 
          segundo_apellido: "", 
          correo_electronico: "", 
          password: "", 
          telefono: "", 
          numero_documento: "" 
        });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !formData.primer_nombre.trim() || !formData.primer_apellido.trim() || !formData.correo_electronico.trim()) return;

    updateMutation.mutate({
      id: selectedUser.id,
      data: {
        primer_nombre: formData.primer_nombre.trim(),
        segundo_nombre: formData.segundo_nombre.trim() || undefined,
        primer_apellido: formData.primer_apellido.trim(),
        segundo_apellido: formData.segundo_apellido.trim() || undefined,
        correo_electronico: formData.correo_electronico.trim(),
        telefono: formData.telefono.trim() || undefined,
        numero_documento: formData.numero_documento.trim() || undefined,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedUser(null);
        setFormData({ 
          primer_nombre: "", 
          segundo_nombre: "", 
          primer_apellido: "", 
          segundo_apellido: "", 
          correo_electronico: "", 
          password: "", 
          telefono: "", 
          numero_documento: "" 
        });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedUser(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ 
      primer_nombre: "", 
      segundo_nombre: "", 
      primer_apellido: "", 
      segundo_apellido: "", 
      correo_electronico: "", 
      password: "", 
      telefono: "", 
      numero_documento: "" 
    });
    openCreateDialog();
  };

  const handleOpenEditDialog = (user: UserResponse) => {
    setSelectedUser(user);
    setFormData({
      primer_nombre: user.primer_nombre,
      segundo_nombre: user.segundo_nombre || "",
      primer_apellido: user.primer_apellido,
      segundo_apellido: user.segundo_apellido || "",
      correo_electronico: user.correo_electronico,
      password: "", // No cargar contraseña para edición
      telefono: user.telefono || "",
      numero_documento: user.numero_documento || "",
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (user: UserResponse) => {
    setSelectedUser(user);
    openDeleteDialog();
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear nombre completo
  const getFullName = (user: UserResponse | null) => {
    if (!user) return 'Usuario no seleccionado';
    const nombres = [user.primer_nombre, user.segundo_nombre].filter(Boolean).join(' ');
    const apellidos = [user.primer_apellido, user.segundo_apellido].filter(Boolean).join(' ');
    return `${nombres} ${apellidos}`.trim();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-gradient-subtle min-h-screen">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-primary" />
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-2">Administra los usuarios del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchUsers()}
            disabled={loading}
            className=""
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? '' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={handleOpenCreateDialog}
            className="bg-gradient-primary shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Búsqueda (si aplica, no implementada en useUsersQuery) */}
      {/* <Card className="mb-6 shadow-card hover:shadow-hover transition-smooth animate-bounce-in">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-input-border focus:ring-primary"
            />
            <Button 
              type="submit" 
              variant="outline"
              className=""
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setPage(1); // Resetear paginación
                }}
                className=""
              >
                Limpiar
              </Button>
            )}
          </form>
        </CardContent>
      </Card> */}

      {/* Estadísticas (si aplica, no implementada en useUsersQuery) */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-card hover:shadow-hover transition-smooth animate-bounce-in bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{users.length}</p>
              </div>
              <UserIcon className="w-8 h-8 text-primary opacity-70 animate-float" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card hover:shadow-hover transition-smooth animate-bounce-in bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                <p className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">{users.filter(u => u.isActive).length}</p>
              </div>
              <UserIcon className="w-8 h-8 text-secondary opacity-70 animate-float" />
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Tabla de usuarios con diseño mejorado */}
      <Card className="shadow-card hover:shadow-hover">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <UserIcon className="w-5 h-5" />
            Listado de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary" />
              <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
            </div>
          ) : !users || users.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron usuarios</p>
            </div>
          ) : (
            <ResponsiveTable
              data={users || []}
              columns={[
                {
                  key: 'nombre_completo',
                  label: 'Nombre Completo',
                  priority: 'high',
                  render: (value: any, item: UserResponse) => (
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="font-medium">{getFullName(item)}</span>
                        <span className="text-xs text-muted-foreground">{item.numero_documento || 'Sin documento'}</span>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'correo_electronico',
                  label: 'Email',
                  priority: 'high',
                  render: (value: any) => (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {value}
                    </Badge>
                  )
                },
                {
                  key: 'telefono',
                  label: 'Teléfono',
                  priority: 'medium',
                  render: (value: any) => (
                    <span className="text-sm">{value || '-'}</span>
                  )
                },
                {
                  key: 'activo',
                  label: 'Estado',
                  priority: 'high',
                  render: (value: any) => value ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      <Eye className="w-3 h-3 mr-1" /> Activo
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                      <EyeOff className="w-3 h-3 mr-1" /> Inactivo
                    </Badge>
                  )
                },
                {
                  key: 'email_verificado',
                  label: 'Email Verificado',
                  priority: 'medium',
                  render: (value: any) => value ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      ✓ Verificado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      ⚠ Pendiente
                    </Badge>
                  )
                },
                {
                  key: 'fecha_ultimo_acceso',
                  label: 'Último Acceso',
                  priority: 'low',
                  render: (value: any) => (
                    <span className="text-sm text-muted-foreground">
                      {formatDate(value)}
                    </span>
                  )
                },
                {
                  key: 'created_at',
                  label: 'Fecha Creación',
                  priority: 'low',
                  render: (value: any) => (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {formatDate(value)}
                    </Badge>
                  )
                }
              ]}
              actions={[
                {
                  label: 'Editar',
                  icon: <Edit2 className="w-4 h-4" />,
                  variant: 'default' as const,
                  onClick: (item: UserResponse) => handleOpenEditDialog(item)
                },
                {
                  label: 'Eliminar',
                  icon: <Trash2 className="w-4 h-4" />,
                  variant: 'destructive' as const,
                  onClick: (item: UserResponse) => handleOpenDeleteDialog(item)
                }
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* Modales refactorizados */}
      <CreateUserModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateSubmit}
        loading={createMutation.isPending}
      />

      <EditUserModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
        loading={updateMutation.isPending}
      />

      <DeleteUserModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default UsersPage;