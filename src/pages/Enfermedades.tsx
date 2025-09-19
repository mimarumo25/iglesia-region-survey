import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ResponsiveTable, ResponsiveTableColumn } from '@/components/ui/responsive-table';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useEnfermedades } from '@/hooks/useEnfermedades';
import { Enfermedad, EnfermedadCreate } from '@/types/enfermedades';
import {
  Activity,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

const EnfermedadesPage = () => {
  const enfermedadesHook = useEnfermedades();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_enfermedad');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Query unificada - Una sola query que maneja tanto datos normales como búsqueda
  const { data: enfermedadesResponse, isLoading: enfermedadesLoading, refetch: refetchEnfermedades } = enfermedadesHook.useEnfermedadesQuery(page, limit, sortBy, sortOrder, searchTerm);

  // Mutaciones de React Query
  const createMutation = enfermedadesHook.useCreateEnfermedadMutation();
  const updateMutation = enfermedadesHook.useUpdateEnfermedadMutation();
  const deleteMutation = enfermedadesHook.useDeleteEnfermedadMutation();

  // Datos y paginación simplificados
  const enfermedades = (enfermedadesResponse as any)?.data || [];
  const pagination = {
    totalItems: (enfermedadesResponse as any)?.total || 0,
    totalPages: (enfermedadesResponse as any)?.totalPages || 1,
    currentPage: (enfermedadesResponse as any)?.page || 1,
    itemsPerPage: (enfermedadesResponse as any)?.limit || 10
  };

  const loading = enfermedadesLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  const [selectedEnfermedad, setSelectedEnfermedad] = useState<Enfermedad | null>(null);
  const [formData, setFormData] = useState<EnfermedadCreate>({
    nombre: '',
    descripcion: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnfermedad || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedEnfermedad.id_enfermedad,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedEnfermedad(null);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedEnfermedad) return;

    deleteMutation.mutate(selectedEnfermedad.id_enfermedad, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedEnfermedad(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (enfermedad: Enfermedad) => {
    setSelectedEnfermedad(enfermedad);
    setFormData({
      nombre: enfermedad.nombre,
      descripcion: enfermedad.descripcion,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (enfermedad: Enfermedad) => {
    setSelectedEnfermedad(enfermedad);
    openDeleteDialog();
  };

  // Manejo de búsqueda en tiempo real
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1); // Resetear paginación al cambiar búsqueda
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="w-8 h-8 text-muted-foreground" />
            Gestión de Enfermedades
          </h1>
          <p className="text-muted-foreground mt-2">Administra las enfermedades para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetchEnfermedades()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={handleOpenCreateDialog}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Enfermedad
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Búsqueda por texto */}
              <div className="flex-1 relative">
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="border-input-border focus:ring-primary transition-smooth pr-8"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Enfermedades Filtradas' : 'Total Enfermedades'}
                </p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalItems}</p>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalPages}</p>
              </div>
              <Activity className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de enfermedades con diseño mejorado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Activity className="w-5 h-5" />
            Listado de Enfermedades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando enfermedades...</span>
            </div>
          ) : enfermedades.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron enfermedades</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={enfermedades}
                columns={[
                  {
                    key: 'id_enfermedad',
                    label: 'ID',
                    priority: 'medium',
                    render: (value: any) => <span className="font-medium text-foreground">{value}</span>
                  },
                  {
                    key: 'nombre',
                    label: 'Nombre',
                    priority: 'high',
                    render: (value: any) => (
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  },
                  {
                    key: 'descripcion',
                    label: 'Descripción',
                    priority: 'medium',
                    render: (value: any) => (
                      <span>{value || 'N/A'}</span>
                    )
                  },
                  {
                    key: 'createdAt',
                    label: 'Fecha Creación',
                    priority: 'low',
                    render: (value: any) => (
                      <Badge variant="outline">
                        {formatDate(value)}
                      </Badge>
                    )
                  },
                  {
                    key: 'updatedAt',
                    label: 'Última Actualización',
                    priority: 'low',
                    render: (value: any) => (
                      <Badge variant="outline">
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
                    onClick: (item: any) => handleOpenEditDialog(item)
                  },
                  {
                    label: 'Eliminar',
                    icon: <Trash2 className="w-4 h-4" />,
                    variant: 'destructive' as const,
                    onClick: (item: any) => handleOpenDeleteDialog(item)
                  }
                ]}
              />
              
              {/* Paginación */}
              {enfermedades.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {enfermedades.length} de {pagination.totalItems} enfermedades
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1 || loading}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.totalPages || loading}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Crear Enfermedad */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Enfermedad"
        description="Crea una nueva enfermedad para las encuestas"
        icon={Activity}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Enfermedad"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Enfermedad"
          placeholder="Ej: Diabetes"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Breve descripción de la enfermedad"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Enfermedad */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Enfermedad"
        description="Modifica los datos de la enfermedad"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Enfermedad"
          placeholder="Ej: Diabetes"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Breve descripción de la enfermedad"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Enfermedad */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la enfermedad"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedEnfermedad?.nombre}
        submitText="Eliminar Enfermedad"
      />
    </div>
  );
};

export default EnfermedadesPage;
