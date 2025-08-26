import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useDisposicionBasura } from '@/hooks/useDisposicionBasura';
import { DisposicionBasura, DisposicionBasuraCreate } from '@/types/disposicion-basura';
import {
  Trash,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DisposicionBasuraFormData {
  nombre: string;
  descripcion: string;
}

const DisposicionBasuraPage = () => {
  const disposicionBasuraHook = useDisposicionBasura();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: disposicionBasuraResponse, isLoading: disposicionBasuraLoading, refetch: refetchDisposicionBasura } = disposicionBasuraHook.useDisposicionBasuraQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = disposicionBasuraHook.useSearchDisposicionBasuraQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = disposicionBasuraHook.useCreateDisposicionBasuraMutation();
  const updateMutation = disposicionBasuraHook.useUpdateDisposicionBasuraMutation();
  const deleteMutation = disposicionBasuraHook.useDeleteDisposicionBasuraMutation();

  let disposicionBasura: DisposicionBasura[] = [];
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Determinar qué datos y paginación usar
  if (searchTerm && searchResponse) {
    if (searchResponse.status === 'success') {
      disposicionBasura = searchResponse?.data?.data || [];
      pagination = {
        currentPage: page,
        totalPages: Math.ceil((searchResponse?.data?.total || 0) / limit),
        totalCount: searchResponse?.data?.total || 0,
        hasNext: page < Math.ceil((searchResponse?.data?.total || 0) / limit),
        hasPrev: page > 1,
      };
    }
  } else if (disposicionBasuraResponse) {
    if (disposicionBasuraResponse.status === 'success') {
      disposicionBasura = disposicionBasuraResponse?.data?.data || [];
      pagination = {
        currentPage: page,
        totalPages: Math.ceil((disposicionBasuraResponse?.data?.total || 0) / limit),
        totalCount: disposicionBasuraResponse?.data?.total || 0,
        hasNext: page < Math.ceil((disposicionBasuraResponse?.data?.total || 0) / limit),
        hasPrev: page > 1,
      };
    }
  }

  const loading = disposicionBasuraLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  const [selectedDisposicionBasura, setSelectedDisposicionBasura] = useState<DisposicionBasura | null>(null);
  const [formData, setFormData] = useState<DisposicionBasuraFormData>({
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
    if (!selectedDisposicionBasura || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedDisposicionBasura.id_tipo_disposicion_basura,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedDisposicionBasura(null);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedDisposicionBasura) return;

    deleteMutation.mutate(selectedDisposicionBasura.id_tipo_disposicion_basura, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedDisposicionBasura(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (disposicion: DisposicionBasura) => {
    setSelectedDisposicionBasura(disposicion);
    setFormData({
      nombre: disposicion.nombre,
      descripcion: disposicion.descripcion || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (disposicion: DisposicionBasura) => {
    setSelectedDisposicionBasura(disposicion);
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

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="min-h-screen bg-background/95 dark:bg-background/95 transition-colors duration-200">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Trash className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Disposición de Basura</h1>
              <p className="text-sm text-muted-foreground">
                Gestión de tipos de disposición de basura del sistema
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenCreateDialog}
            className="flex items-center space-x-2"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Tipo</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar tipos de disposición..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button type="submit" variant="outline" size="sm" disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetchDisposicionBasura()}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Tipos de Disposición</span>
              <Badge variant="secondary">
                Total: {pagination.totalCount}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32">
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="ml-2">Cargando tipos de disposición...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : disposicionBasura.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center">
                        {searchTerm
                          ? 'No se encontraron tipos que coincidan con la búsqueda'
                          : 'No hay tipos de disposición registrados'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    disposicionBasura.map((disposicion) => (
                      <TableRow key={disposicion.id_tipo_disposicion_basura}>
                        <TableCell className="font-medium">
                          {disposicion.nombre}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {disposicion.descripcion}
                        </TableCell>
                        <TableCell>
                          {formatDate(disposicion.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditDialog(disposicion)}
                              disabled={loading}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(disposicion)}
                              disabled={loading}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Crear Tipo */}
        <ConfigModal
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          type="create"
          title="Nuevo Tipo de Disposición"
          description="Crea un nuevo tipo de disposición de basura"
          icon={Trash}
          loading={createMutation.isPending}
          onSubmit={handleCreateSubmit}
          submitText="Crear Tipo"
        >
          <ConfigFormField
            id="nombre"
            label="Nombre del Tipo"
            placeholder="Ej: Relleno sanitario"
            value={formData.nombre}
            onChange={(value) => setFormData({ ...formData, nombre: value })}
            required
          />
          <ConfigFormField
            id="descripcion"
            label="Descripción"
            placeholder="Breve descripción del tipo de disposición"
            value={formData.descripcion}
            onChange={(value) => setFormData({ ...formData, descripcion: value })}
          />
        </ConfigModal>

        {/* Modal de Editar Tipo */}
        <ConfigModal
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          type="edit"
          title="Editar Tipo de Disposición"
          description="Modifica los datos del tipo de disposición"
          icon={Edit2}
          loading={updateMutation.isPending}
          onSubmit={handleEditSubmit}
          submitText="Guardar Cambios"
        >
          <ConfigFormField
            id="nombre"
            label="Nombre del Tipo"
            placeholder="Ej: Relleno sanitario"
            value={formData.nombre}
            onChange={(value) => setFormData({ ...formData, nombre: value })}
            required
          />
          <ConfigFormField
            id="descripcion"
            label="Descripción"
            placeholder="Breve descripción del tipo de disposición"
            value={formData.descripcion}
            onChange={(value) => setFormData({ ...formData, descripcion: value })}
          />
        </ConfigModal>

        {/* Modal de Eliminar Tipo */}
        <ConfigModal
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          type="delete"
          title="Eliminar Tipo de Disposición"
          description="¿Estás seguro de que deseas eliminar este tipo de disposición?"
          icon={Trash2}
          loading={deleteMutation.isPending}
          onConfirm={handleDelete}
          entityName={selectedDisposicionBasura?.nombre}
        />
      </div>
    </div>
  );
};

export default DisposicionBasuraPage;
