import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { ConfigPagination } from '@/components/ui/config-pagination';
import { useDestrezasQuery, useDestrezas, paginateClientSide, filterBySearch } from '@/hooks/useDestrezas';
import { Destreza, DestrezaFormData, CATEGORIAS_DESTREZA } from '@/types/destrezas';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  AlertCircle,
  Search,
} from 'lucide-react';

const DestrezasPage = () => {
  const destrezasHook = useDestrezas();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: response, isLoading, error, refetch } = useDestrezasQuery(searchTerm);

  const hasError = error && !isLoading;

  const processedData = useMemo(() => {
    if (!response?.data) return {
      items: [],
      pagination: { totalPages: 1, totalCount: 0, currentPage: 1, hasNext: false, hasPrev: false }
    };

    const allItems = Array.isArray(response.data) ? response.data : [];
    const filteredItems = searchTerm ? filterBySearch(allItems, searchTerm) : allItems;
    const paginationResult = paginateClientSide(filteredItems, currentPage, itemsPerPage);

    return { items: paginationResult.paginatedItems, pagination: paginationResult };
  }, [response, searchTerm, currentPage, itemsPerPage]);

  const createMutation = destrezasHook.useCreateDestrezaMutation();
  const updateMutation = destrezasHook.useUpdateDestrezaMutation();
  const deleteMutation = destrezasHook.useDeleteDestrezaMutation();

  const loading = isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  const [selectedDestreza, setSelectedDestreza] = useState<Destreza | null>(null);
  const [formData, setFormData] = useState<DestrezaFormData>({ nombre: '', descripcion: '', categoria: '' });
  const [formErrors, setFormErrors] = useState<{ nombre?: string; descripcion?: string }>({});

  const validateForm = () => {
    const errors: { nombre?: string; descripcion?: string } = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    else if (formData.nombre.trim().length < 2) errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    createMutation.mutate(
      { nombre: formData.nombre.trim(), descripcion: formData.descripcion?.trim() || undefined, categoria: formData.categoria || undefined },
      {
        onSuccess: () => {
          setShowCreateDialog(false);
          setFormData({ nombre: '', descripcion: '', categoria: '' });
          setFormErrors({});
        }
      }
    );
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestreza || !validateForm()) return;
    updateMutation.mutate(
      { id: selectedDestreza.id_destreza, data: { nombre: formData.nombre.trim(), descripcion: formData.descripcion?.trim() || undefined, categoria: formData.categoria || undefined } },
      {
        onSuccess: () => {
          setShowEditDialog(false);
          setSelectedDestreza(null);
          setFormData({ nombre: '', descripcion: '', categoria: '' });
          setFormErrors({});
        }
      }
    );
  };

  const handleDelete = async () => {
    if (!selectedDestreza) return;
    deleteMutation.mutate(selectedDestreza.id_destreza, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedDestreza(null);
      }
    });
  };

  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', categoria: '' });
    setFormErrors({});
    openCreateDialog();
  };

  const handleOpenEditDialog = (destreza: Destreza) => {
    setSelectedDestreza(destreza);
    setFormData({ nombre: destreza.nombre, descripcion: destreza.descripcion || '', categoria: destreza.categoria || '' });
    setFormErrors({});
    openEditDialog();
  };

  const handleOpenDeleteDialog = (destreza: Destreza) => {
    setSelectedDestreza(destreza);
    openDeleteDialog();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

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
            <Wrench className="w-8 h-8 text-muted-foreground" />
            Gestión de Destrezas
          </h1>
          <p className="text-muted-foreground mt-2">Administra las destrezas técnicas y artesanales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Destreza
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, descripción o categoría..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-10 pr-10 transition-all duration-200 ${
                    searchTerm
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-input focus:ring-primary'
                  }`}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded transition-colors"
                    title="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {searchTerm && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Search className="w-4 h-4" />
                  <span>
                    Buscando: <strong className="text-foreground">"{searchTerm}"</strong>
                  </span>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {processedData.pagination.totalCount} resultado
                  {processedData.pagination.totalCount !== 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Destrezas</p>
                <p className="text-2xl font-bold text-foreground">{processedData.pagination.totalCount}</p>
              </div>
              <Wrench className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{processedData.pagination.totalPages}</p>
              </div>
              <Wrench className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Wrench className="w-5 h-5" />
            Listado de Destrezas
            <span className="text-sm font-normal text-muted-foreground">
              Total: {processedData.pagination.totalCount}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasError ? (
            <div className="text-center py-12">
              <div className="relative mb-6">
                <AlertCircle className="w-16 h-16 text-red-500/30 mx-auto" />
                <X className="w-6 h-6 absolute top-0 right-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Error al cargar los datos</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {(error as any)?.message || 'No se pudieron cargar las destrezas.'}
              </p>
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Reintentar
              </Button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <Wrench className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <Loader2 className="w-8 h-8 absolute top-2 left-4 animate-spin text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cargando Destrezas</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Obteniendo la información más reciente...
              </p>
            </div>
          ) : processedData.items.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <>
                  <div className="relative mb-6">
                    <Search className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                    <X className="w-6 h-6 absolute top-0 right-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    No hay destrezas que coincidan con <strong>"{searchTerm}"</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" onClick={handleClearSearch}>
                      <X className="w-4 h-4 mr-2" />
                      Limpiar búsqueda
                    </Button>
                    <Button onClick={handleOpenCreateDialog}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Destreza
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative mb-6">
                    <Wrench className="w-20 h-20 text-muted-foreground/20 mx-auto mb-4" />
                    <AlertCircle className="w-8 h-8 absolute top-6 right-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aún no hay destrezas registradas
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Comienza creando la primera destreza. Ejemplos: Carpintería, Música, Costura.
                  </p>
                  <Button size="lg" onClick={handleOpenCreateDialog}>
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Primera Destreza
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={processedData.items}
                columns={[
                  {
                    key: 'id_destreza',
                    label: 'ID',
                    priority: 'medium',
                    width: '80px',
                    render: (value: number) => (
                      <span className="text-muted-foreground text-sm">#{value}</span>
                    ),
                  },
                  {
                    key: 'nombre',
                    label: 'Nombre',
                    priority: 'high',
                    render: (value: string) => (
                      <span className="font-medium text-foreground">{value}</span>
                    ),
                  },
                  {
                    key: 'categoria',
                    label: 'Categoría',
                    priority: 'medium',
                    render: (value: string) =>
                      value ? (
                        <Badge variant="secondary">{value}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      ),
                  },
                  {
                    key: 'descripcion',
                    label: 'Descripción',
                    priority: 'medium',
                    render: (value: string) => (
                      <span className="text-muted-foreground text-sm line-clamp-2">{value || '—'}</span>
                    ),
                  },
                  {
                    key: 'created_at',
                    label: 'Creado',
                    priority: 'low',
                    hideOnMobile: true,
                    render: (value: string) => (
                      <span className="text-muted-foreground text-sm">{formatDate(value)}</span>
                    ),
                  },
                ]}
                actions={[
                  {
                    label: 'Editar',
                    icon: <Edit2 className="w-4 h-4" />,
                    onClick: (item: Destreza) => handleOpenEditDialog(item),
                    variant: 'outline',
                    primary: true,
                  },
                  {
                    label: 'Eliminar',
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: (item: Destreza) => handleOpenDeleteDialog(item),
                    variant: 'destructive',
                  },
                ]}
              />

              <div className="mt-4">
                <ConfigPagination
                  currentPage={currentPage}
                  totalPages={processedData.pagination.totalPages}
                  totalCount={processedData.pagination.totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal: Crear */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) { setFormData({ nombre: '', descripcion: '', categoria: '' }); setFormErrors({}); }
        }}
        type="create"
        title="Nueva Destreza"
        description="Completa los campos para registrar una nueva destreza."
        icon={Wrench}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Destreza"
      >
        <div className="space-y-2">
          <Label htmlFor="nombre" className="flex items-center gap-2">
            Nombre <span className="text-red-500">*</span>
            {formErrors.nombre && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="nombre"
            placeholder="Ej: Carpintería"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className={formErrors.nombre ? 'border-red-500 bg-red-50' : formData.nombre ? 'border-green-500 bg-green-50' : ''}
          />
          {formErrors.nombre && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.nombre}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS_DESTREZA.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la destreza"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal: Editar */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) { setSelectedDestreza(null); setFormData({ nombre: '', descripcion: '', categoria: '' }); setFormErrors({}); }
        }}
        type="edit"
        title="Editar Destreza"
        description={`Modifica los datos de "${selectedDestreza?.nombre || ''}"`}
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <div className="space-y-2">
          <Label htmlFor="edit-nombre" className="flex items-center gap-2">
            Nombre <span className="text-red-500">*</span>
            {formErrors.nombre && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="edit-nombre"
            placeholder="Ej: Carpintería"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className={formErrors.nombre ? 'border-red-500 bg-red-50' : formData.nombre ? 'border-green-500 bg-green-50' : ''}
          />
          {formErrors.nombre && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.nombre}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-categoria">Categoría</Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS_DESTREZA.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la destreza"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal: Eliminar */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Eliminar destreza?"
        description="Esta acción eliminará permanentemente la destreza"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedDestreza?.nombre}
        submitText="Eliminar Destreza"
      />
    </div>
  );
};

export default DestrezasPage;
