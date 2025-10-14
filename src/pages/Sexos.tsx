import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useSexos } from '@/hooks/useSexos';
import { Sexo, SexoFormData } from '@/types/sexos';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ConfigPagination } from '@/components/ui/config-pagination';

const SexosPage = () => {
  const sexosHook = useSexos();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_sexo');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: sexosResponse, isLoading: sexosLoading, refetch: refetchSexos } = sexosHook.useSexosQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = sexosHook.useSearchSexosQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = sexosHook.useCreateSexoMutation();
  const updateMutation = sexosHook.useUpdateSexoMutation();
  const deleteMutation = sexosHook.useDeleteSexoMutation();

  const sexos = searchTerm 
    ? (searchResponse?.data?.data || []) 
    : (sexosResponse?.data?.data || []);
  const total = searchTerm 
    ? (searchResponse?.data?.total || 0) 
    : (sexosResponse?.data?.total || 0);
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalCount: total,
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };

  const loading = sexosLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedSexo, setSelectedSexo] = useState<Sexo | null>(null);
  const [formData, setFormData] = useState<SexoFormData>({
    nombre: '',
    codigo: '',
    descripcion: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      codigo: formData.codigo?.trim() || undefined,
      descripcion: formData.descripcion?.trim() || undefined,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', codigo: '', descripcion: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSexo || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedSexo.id_sexo,
      data: {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo?.trim() || undefined,
        descripcion: formData.descripcion?.trim() || undefined,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedSexo(null);
        setFormData({ nombre: '', codigo: '', descripcion: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedSexo) return;

    deleteMutation.mutate(selectedSexo.id_sexo, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedSexo(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', codigo: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (sexo: Sexo) => {
    setSelectedSexo(sexo);
    setFormData({
      nombre: sexo.nombre,
      codigo: sexo.codigo || '',
      descripcion: sexo.descripcion || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (sexo: Sexo) => {
    setSelectedSexo(sexo);
    openDeleteDialog();
  };

  // Manejo de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset a primera página cuando cambie el límite
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-muted-foreground" />
            Gestión de Sexos
          </h1>
          <p className="text-muted-foreground mt-2">Administra los tipos de sexo para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchSexos()}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Sexo
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
              >
                Limpiar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sexos</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
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
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de sexos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5" />
            Listado de Sexos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando sexos...</span>
            </div>
          ) : sexos.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron sexos</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sexos.map((sexo) => (
                    <TableRow key={sexo.id_sexo}>
                      <TableCell className="font-medium">{sexo.id_sexo}</TableCell>
                      <TableCell>
                        <span className="font-medium">{sexo.nombre}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {sexo.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {sexo.created_at ? new Date(sexo.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(sexo)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(sexo)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación unificada con patrón completo */}
              <ConfigPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalCount}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                showItemsPerPageSelector={true}
                itemsPerPageOptions={[5, 10, 25, 50]}
                variant="complete"
                showInfo={true}
                showFirstLast={false}
                maxVisiblePages={5}
                loading={loading}
                infoText="Mostrando {start}-{end} de {total} registros"
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Crear Sexo */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Sexo"
        description="Crea un nuevo tipo de sexo en el sistema"
        icon={Users}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Sexo"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre del Sexo"
          placeholder="Ej: Masculino"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional del sexo"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Sexo */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Sexo"
        description="Modifica los datos del sexo"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Sexo"
          placeholder="Ej: Masculino"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional del sexo"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Sexo */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el sexo"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedSexo?.nombre}
        submitText="Eliminar Sexo"
      />
    </div>
  );
};

export default SexosPage;
