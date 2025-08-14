import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ConfigurationTable, TableColumn, TableAction, PaginationData } from '@/components/ui/configuration-table';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useEstadosCiviles } from '@/hooks/useEstadosCiviles';
import { EstadoCivil, EstadoCivilCreate } from '@/types/estados-civiles';
import {
  Heart,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';

const EstadosCivilesPage = () => {
  const estadosCivilesHook = useEstadosCiviles();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('orden');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);

  // Queries de React Query
  const { data: estadosCivilesResponse, isLoading: estadosCivilesLoading, refetch: refetchEstadosCiviles } = estadosCivilesHook.useEstadosCivilesQuery(page, limit, sortBy, sortOrder, includeInactive);
  const { data: searchResponse, isLoading: searchLoading } = estadosCivilesHook.useSearchEstadosCivilesQuery(searchTerm, page, limit, sortBy, sortOrder, includeInactive);

  // Mutaciones de React Query
  const createMutation = estadosCivilesHook.useCreateEstadoCivilMutation();
  const updateMutation = estadosCivilesHook.useUpdateEstadoCivilMutation();
  const deleteMutation = estadosCivilesHook.useDeleteEstadoCivilMutation();

  const estadosCiviles = searchTerm
    ? ((searchResponse as any)?.data || [])
    : ((estadosCivilesResponse as any)?.data || []);
  const pagination = searchTerm
    ? ((searchResponse as any)?.pagination || { totalItems: 0, totalPages: 1, currentPage: 1, itemsPerPage: 10 })
    : ((estadosCivilesResponse as any)?.pagination || { totalItems: 0, totalPages: 1, currentPage: 1, itemsPerPage: 10 });

  const loading = estadosCivilesLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  const [selectedEstadoCivil, setSelectedEstadoCivil] = useState<EstadoCivil | null>(null);
  const [formData, setFormData] = useState<EstadoCivilCreate>({
    nombre: '',
    descripcion: '',
    codigo: '',
    orden: 0,
    activo: true,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || '',
      codigo: formData.codigo.trim(),
      orden: formData.orden,
      activo: formData.activo,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '', codigo: '', orden: 0, activo: true });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstadoCivil || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedEstadoCivil.id,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || '',
        codigo: formData.codigo.trim(),
        orden: formData.orden,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedEstadoCivil(null);
        setFormData({ nombre: '', descripcion: '', codigo: '', orden: 0, activo: true });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedEstadoCivil) return;

    deleteMutation.mutate(selectedEstadoCivil.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedEstadoCivil(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', codigo: '', orden: 0, activo: true });
    openCreateDialog();
  };

  const handleOpenEditDialog = (estadoCivil: EstadoCivil) => {
    setSelectedEstadoCivil(estadoCivil);
    setFormData({
      nombre: estadoCivil.nombre,
      descripcion: estadoCivil.descripcion || '',
      codigo: estadoCivil.codigo,
      orden: estadoCivil.orden,
      activo: estadoCivil.activo,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (estadoCivil: EstadoCivil) => {
    setSelectedEstadoCivil(estadoCivil);
    openDeleteDialog();
  };

  // Manejo de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetear paginación al buscar
    // searchTerm ya está actualizado por el onChange del Input
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Manejo del filtro de inactivos
  const handleIncludeInactiveChange = (checked: boolean) => {
    setIncludeInactive(checked);
    setPage(1); // Resetear paginación al cambiar filtro
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl ">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Heart className="w-8 h-8 text-muted-foreground " />
            Gestión de Estados Civiles
          </h1>
          <p className="text-muted-foreground mt-2">Administra los estados civiles para encuestas</p>
        </div>
        <div className="flex gap-2 ">
          <Button
            variant="outline"
            onClick={() => refetchEstadosCiviles()}
            disabled={loading}
            className=""
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={handleOpenCreateDialog}
            className=""
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Estado Civil
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6  ">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Búsqueda por texto */}
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-input-border focus:ring-primary transition-smooth"
                />
              </div>

              {/* Incluir inactivos */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-inactive"
                  checked={includeInactive}
                  onCheckedChange={handleIncludeInactiveChange}
                />
                <Label htmlFor="include-inactive">Incluir Inactivos</Label>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
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
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Estados Civiles</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalItems}</p>
              </div>
              <Heart className="w-8 h-8 text-muted-foreground opacity-70 " />
            </div>
          </CardContent>
        </Card>

        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalPages}</p>
              </div>
              <Heart className="w-8 h-8 text-secondary opacity-70 " />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de estados civiles con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Heart className="w-5 h-5" />
            Listado de Estados Civiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando estados civiles...</span>
            </div>
          ) : estadosCiviles.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 " />
              <p className="text-muted-foreground">No se encontraron estados civiles</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <ConfigurationTable
              data={estadosCiviles}
              columns={[
                {
                  key: 'id',
                  label: 'ID',
                  render: (value: any) => <span className="font-medium text-foreground">{value}</span>
                },
                {
                  key: 'nombre',
                  label: 'Nombre',
                  render: (value: any) => (
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                },
                {
                  key: 'codigo',
                  label: 'Código',
                  render: (value: any) => (
                    <span >
                      {value}
                    </span>
                  )
                },
                {
                  key: 'descripcion',
                  label: 'Descripción',
                  render: (value: any) => (
                    <span>{value || 'N/A'}</span>
                  )
                },
                {
                  key: 'orden',
                  label: 'Orden',
                  render: (value: any) => (
                    <span className="font-medium text-foreground">
                      {value}
                    </span>
                  )
                },
                {
                  key: 'activo',
                  label: 'Estado',
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
                  key: 'createdAt',
                  label: 'Fecha Creación',
                  render: (value: any) => (
                    <Badge variant="outline">
                      {formatDate(value)}
                    </Badge>
                  )
                }
              ]}
              actions={[
                {
                  type: 'edit' as const,
                  label: 'Editar',
                  icon: <Edit2 className="w-4 h-4" />,
                  color: 'default' as const,
                  onClick: (item: any) => handleOpenEditDialog(item)
                },
                {
                  type: 'delete' as const,
                  label: 'Eliminar',
                  icon: <Trash2 className="w-4 h-4" />,
                  color: 'destructive' as const,
                  onClick: (item: any) => handleOpenDeleteDialog(item)
                }
              ]}
              pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.totalItems,
                itemsPerPage: pagination.itemsPerPage
              }}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de Crear Estado Civil */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Estado Civil"
        description="Crea un nuevo estado civil para las encuestas"
        icon={Heart}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Estado Civil"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre del Estado Civil"
          placeholder="Ej: Soltero"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Breve descripción del estado civil"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <ConfigFormField
          id="orden"
          label="Orden"
          placeholder="Ej: 1"
          value={formData.orden.toString()}
          onChange={(value) => setFormData({ ...formData, orden: parseInt(value) || 0 })}
          type="text"
          required
        />
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="activo"
            checked={formData.activo}
            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
          />
          <Label htmlFor="activo">Activo</Label>
        </div>
      </ConfigModal>

      {/* Modal de Editar Estado Civil */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Estado Civil"
        description="Modifica los datos del estado civil"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Estado Civil"
          placeholder="Ej: Soltero"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Breve descripción del estado civil"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <ConfigFormField
          id="edit-orden"
          label="Orden"
          placeholder="Ej: 1"
          value={formData.orden.toString()}
          onChange={(value) => setFormData({ ...formData, orden: parseInt(value) || 0 })}
          type="text"
          required
        />
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="edit-activo"
            checked={formData.activo}
            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
          />
          <Label htmlFor="edit-activo">Activo</Label>
        </div>
      </ConfigModal>

      {/* Modal de Eliminar Estado Civil */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el estado civil"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedEstadoCivil?.nombre}
        submitText="Eliminar Estado Civil"
      />
    </div>
  );
};

export default EstadosCivilesPage;