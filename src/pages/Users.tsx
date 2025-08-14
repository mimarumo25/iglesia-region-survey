import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfigModal, ConfigFormField, useConfigModal } from "@/components/ui/config-modal";
import { useUsers } from "@/hooks/useUsers";
import { UserResponse, CreateUserRequest, UpdateUserRequest } from "@/services/users";

// Tipo para el formulario de usuarios
interface UserFormData {
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo_electronico: string;
  password: string;
  telefono: string;
  numero_documento: string;
}
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const getFullName = (user: UserResponse) => {
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
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-semibold text-foreground">Nombre Completo</TableHead>
                    <TableHead className="font-semibold text-foreground">Email</TableHead>
                    <TableHead className="font-semibold text-foreground">Teléfono</TableHead>
                    <TableHead className="font-semibold text-foreground">Estado</TableHead>
                    <TableHead className="font-semibold text-foreground">Email Verificado</TableHead>
                    <TableHead className="font-semibold text-foreground">Último Acceso</TableHead>
                    <TableHead className="font-semibold text-foreground">Fecha Creación</TableHead>
                    <TableHead className="text-right font-semibold text-primary">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.map((user, index) => (
                    <TableRow 
                      key={user.id}
                      className="hover:bg-muted/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="font-medium">{getFullName(user)}</span>
                            <span className="text-xs text-muted-foreground">{user.numero_documento || 'Sin documento'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {user.correo_electronico}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.telefono || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {user.activo ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            <Eye className="w-3 h-3 mr-1" /> Activo
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                            <EyeOff className="w-3 h-3 mr-1" /> Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.email_verificado ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            ✓ Verificado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            ⚠ Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(user.fecha_ultimo_acceso)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {formatDate(user.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(user)}
                            className="hover:bg-primary/10 hover:text-primary hover:shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(user)}
                            className="hover:bg-destructive/10 hover:text-destructive hover:shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación (si aplica, no implementada en useUsersQuery) */}
              {/* {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {users.length} de {pagination.totalCount} usuarios
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="hover:shadow-hover disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm font-medium text-primary bg-primary/10 rounded-md">
                      Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="hover:shadow-hover disabled:opacity-50"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )} */}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Crear Usuario */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Usuario"
        description="Crea un nuevo usuario en el sistema"
        icon={UserIcon}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Usuario"
      >
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
      </ConfigModal>

      {/* Modal de Editar Usuario */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Usuario"
        description="Modifica los datos del usuario"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
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
        <ConfigFormField
          id="edit-correo_electronico"
          label="Correo Electrónico"
          placeholder="Ej: juan.perez@example.com"
          value={formData.correo_electronico}
          onChange={(value) => setFormData({ ...formData, correo_electronico: value })}
          required
        />
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
      </ConfigModal>

      {/* Modal de Eliminar Usuario */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el usuario"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={getFullName(selectedUser!)}
        submitText="Eliminar Usuario"
      />
    </div>
  );
};

export default UsersPage;