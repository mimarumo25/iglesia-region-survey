import { useState, useEffect, useMemo } from 'react';
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
import { ConfigPagination } from '@/components/ui/config-pagination';
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
  X,
} from 'lucide-react';

interface DisposicionBasuraFormData {
  nombre: string;
  descripcion: string;
}

const DisposicionBasuraPage = () => {
  const { 
    useDisposicionBasuraQuery,
    paginateClientSide,
    filterBySearch,
    useCreateDisposicionBasuraMutation,
    useUpdateDisposicionBasuraMutation,
    useDeleteDisposicionBasuraMutation,
  } = useDisposicionBasura();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Controlado por el usuario
  const [searchTerm, setSearchTerm] = useState('');

  // Query unificada - Una sola query que maneja tanto datos normales como búsqueda
  const { data: disposicionBasuraResponse, isLoading, refetch } = useDisposicionBasuraQuery();

  // Mutaciones
  const createMutation = useCreateDisposicionBasuraMutation();
  const updateMutation = useUpdateDisposicionBasuraMutation();
  const deleteMutation = useDeleteDisposicionBasuraMutation();

  // Procesamiento de datos con filtros del lado del cliente - Patrón de Parentescos
  const { disposicionBasura, pagination } = useMemo(() => {
    // Obtener array de datos directamente
    let allItems: DisposicionBasura[] = [];

    // Manejar diferentes estructuras de respuesta del backend
    if (disposicionBasuraResponse?.status === 'success') {
      // Si tiene data.data, usar esa estructura
      if (disposicionBasuraResponse.data?.data) {
        allItems = Array.isArray(disposicionBasuraResponse.data.data) 
          ? disposicionBasuraResponse.data.data 
          : [];
      }
      // Si no, usar directamente data
      else if (Array.isArray(disposicionBasuraResponse.data)) {
        allItems = disposicionBasuraResponse.data;
      }
    }
    // También manejar si viene directamente como array
    else if (Array.isArray(disposicionBasuraResponse)) {
      allItems = disposicionBasuraResponse;
    }

    // Aplicar filtro de búsqueda del lado del cliente
    const filteredItems = filterBySearch(allItems, searchTerm);
    
    // Aplicar paginación client-side usando la función helper
    const result = paginateClientSide(filteredItems, page, limit);
    
    return {
      disposicionBasura: result.items,
      pagination: {
        totalItems: result.pagination.totalCount,
        totalPages: result.pagination.totalPages,
        currentPage: result.pagination.currentPage,
        hasNext: result.pagination.hasNext,
        hasPrev: result.pagination.hasPrev,
        itemsPerPage: limit
      }
    };
  }, [disposicionBasuraResponse, searchTerm, page, limit, filterBySearch, paginateClientSide]);

  const loading = isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset a primera página cuando cambie el límite
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Trash className="w-8 h-8 text-muted-foreground" />
            Gestión de Disposición de Basura
          </h1>
          <p className="text-muted-foreground mt-2">Administra los tipos de disposición de basura para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button 
            onClick={handleOpenCreateDialog}
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tipo
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar tipos de disposición..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tipos</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalItems}</p>
              </div>
              <Trash className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trash className="w-5 h-5" />
            Listado de Tipos de Disposición
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              <span className="ml-2">Cargando...</span>
            </div>
          ) : disposicionBasura.length === 0 ? (
            <div className="text-center py-8">
              <Trash className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No se encontraron resultados' : 'No hay tipos registrados'}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Nombre</TableHead>
                      <TableHead className="font-semibold">Descripción</TableHead>
                      <TableHead className="font-semibold">Fecha Creación</TableHead>
                      <TableHead className="text-right font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disposicionBasura.map((disposicion) => (
                      <TableRow 
                        key={disposicion.id_tipo_disposicion_basura}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {disposicion.id_tipo_disposicion_basura}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Trash className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{disposicion.nombre}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="truncate block">
                            {disposicion.descripcion || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatDate(disposicion.created_at)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditDialog(disposicion)}
                              disabled={loading}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(disposicion)}
                              disabled={loading}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación unificada con patrón completo */}
              <ConfigPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
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

      {/* Modales */}
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
  );
};

export default DisposicionBasuraPage;
