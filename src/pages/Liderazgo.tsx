import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { ConfigModal, useConfigModal } from '@/components/ui/config-modal';
import { ConfigPagination } from '@/components/ui/config-pagination';
import { useLiderazgoQuery, useLiderazgo, paginateClientSide, filterBySearch } from '@/hooks/useLiderazgo';
import { TipoLiderazgo, TipoLiderazgoCreate } from '@/types/liderazgo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  AlertCircle,
  Search,
} from 'lucide-react';

// 🔍 Esquema de validación con Zod
const liderazgoSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform((val) => val.trim()),
  descripcion: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .transform((val) => val.trim()),
});

type LiderazgoFormData = z.infer<typeof liderazgoSchema>;

const LiderazgoPage = () => {
  const liderazgoHook = useLiderazgo();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: response, isLoading, error, refetch } = useLiderazgoQuery(searchTerm, false);

  const hasError = error && !isLoading;

  const processedData = useMemo(() => {
    // API devuelve: { success, data: { status, data: [...], total, ... } }
    const innerData = response?.data?.data;
    if (!innerData)
      return {
        items: [],
        pagination: {
          totalPages: 1,
          totalCount: 0,
          currentPage: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

    const allItems = Array.isArray(innerData) ? innerData : [];
    const filteredItems = searchTerm ? filterBySearch(allItems, searchTerm) : allItems;
    const paginationResult = paginateClientSide(filteredItems, currentPage, itemsPerPage);

    return {
      items: paginationResult.paginatedItems,
      pagination: paginationResult,
    };
  }, [response, searchTerm, currentPage, itemsPerPage]);

  const createMutation = liderazgoHook.useCreateLiderazgoMutation();
  const updateMutation = liderazgoHook.useUpdateLiderazgoMutation();
  const deleteMutation = liderazgoHook.useDeleteLiderazgoMutation();

  const loading =
    isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

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

  const [selectedItem, setSelectedItem] = useState<TipoLiderazgo | null>(null);

  const form = useForm<LiderazgoFormData>({
    resolver: zodResolver(liderazgoSchema),
    defaultValues: { nombre: '', descripcion: '' },
    mode: 'onChange',
  });

  const { register, handleSubmit, reset, formState: { errors, isValid, isDirty } } = form;

  // 📋 Crear
  const handleCreateSubmit = async (data: LiderazgoFormData) => {
    if (!isValid || !isDirty) {
      toast({
        title: '⚠️ Formulario Incompleto',
        description: 'Por favor completa todos los campos correctamente.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await createMutation.mutateAsync({ nombre: data.nombre, descripcion: data.descripcion });
      setShowCreateDialog(false);
      reset();
      toast({ title: '✅ Tipo de Liderazgo Creado', description: `"${data.nombre}" se ha creado exitosamente` });
    } catch (error: any) {
      toast({
        title: '❌ Error al Crear',
        description: error?.response?.data?.message || 'No se pudo crear el tipo de liderazgo',
        variant: 'destructive',
      });
    }
  };

  // ✏️ Editar
  const handleEditSubmit = async (data: LiderazgoFormData) => {
    if (!selectedItem) return;
    if (!isValid) {
      toast({
        title: '⚠️ Datos Inválidos',
        description: 'Por favor corrige los errores antes de guardar.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: selectedItem.id_tipo_liderazgo,
        data: { nombre: data.nombre, descripcion: data.descripcion },
      });
      setShowEditDialog(false);
      setSelectedItem(null);
      reset();
      toast({ title: '✅ Tipo de Liderazgo Actualizado', description: `"${data.nombre}" se ha actualizado exitosamente` });
    } catch (error: any) {
      toast({
        title: '❌ Error al Actualizar',
        description: error?.response?.data?.message || 'No se pudo actualizar el tipo de liderazgo',
        variant: 'destructive',
      });
    }
  };

  // 🗑️ Eliminar
  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteMutation.mutateAsync(selectedItem.id_tipo_liderazgo);
      setShowDeleteDialog(false);
      setSelectedItem(null);
      toast({ title: '✅ Tipo de Liderazgo Eliminado', description: `"${selectedItem.nombre}" se ha eliminado exitosamente` });
    } catch (error: any) {
      toast({
        title: '❌ Error al Eliminar',
        description: error?.response?.data?.message || 'No se pudo eliminar el tipo de liderazgo',
        variant: 'destructive',
      });
    }
  };

  const handleOpenCreateDialog = () => {
    reset({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (item: TipoLiderazgo) => {
    setSelectedItem(item);
    reset({ nombre: item.nombre, descripcion: item.descripcion || '' });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (item: TipoLiderazgo) => {
    setSelectedItem(item);
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
            <Star className="w-8 h-8 text-muted-foreground" />
            Gestión de Liderazgo
          </h1>
          <p className="text-muted-foreground mt-2">Administra los tipos de liderazgo del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tipo de Liderazgo
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
                  placeholder="Buscar por nombre o descripción..."
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
                <p className="text-sm text-muted-foreground">Total Tipos de Liderazgo</p>
                <p className="text-2xl font-bold text-foreground">
                  {processedData.pagination.totalCount}
                </p>
              </div>
              <Star className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">
                  {processedData.pagination.totalPages}
                </p>
              </div>
              <Star className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Star className="w-5 h-5" />
            Listado de Tipos de Liderazgo
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
                {error?.message || 'No se pudieron cargar los tipos de liderazgo.'}
              </p>
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Reintentar
              </Button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <Star className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <Loader2 className="w-8 h-8 absolute top-2 left-4 animate-spin text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cargando Tipos de Liderazgo</h3>
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
                    No hay tipos de liderazgo que coincidan con{' '}
                    <strong>"{searchTerm}"</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" onClick={handleClearSearch}>
                      <X className="w-4 h-4 mr-2" />
                      Limpiar búsqueda
                    </Button>
                    <Button onClick={handleOpenCreateDialog}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Tipo de Liderazgo
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative mb-6">
                    <Star className="w-20 h-20 text-muted-foreground/20 mx-auto mb-4" />
                    <AlertCircle className="w-8 h-8 absolute top-6 right-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aún no hay tipos de liderazgo registrados
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Comienza creando el primer tipo de liderazgo. Ejemplos: Líder comunitario,
                    Coordinador, Animador pastoral.
                  </p>
                  <Button size="lg" onClick={handleOpenCreateDialog}>
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Primer Tipo de Liderazgo
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
                    key: 'id_tipo_liderazgo',
                    label: 'ID',
                    priority: 'medium',
                    width: '80px',
                    render: (value: string) => (
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
                    key: 'descripcion',
                    label: 'Descripción',
                    priority: 'medium',
                    render: (value: string) => (
                      <span className="text-muted-foreground text-sm line-clamp-2">{value || '-'}</span>
                    ),
                  },
                  {
                    key: 'activo',
                    label: 'Estado',
                    priority: 'medium',
                    width: '100px',
                    render: (value: boolean) => (
                      <Badge variant={value !== false ? 'default' : 'secondary'}>
                        {value !== false ? 'Activo' : 'Inactivo'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'createdAt',
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
                    onClick: (item: TipoLiderazgo) => handleOpenEditDialog(item),
                    variant: 'outline',
                    primary: true,
                  },
                  {
                    label: 'Eliminar',
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: (item: TipoLiderazgo) => handleOpenDeleteDialog(item),
                    variant: 'destructive',
                  },
                ]}
              />

              {/* Paginación */}
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
          if (!open) reset();
        }}
        type="create"
        title="Nuevo Tipo de Liderazgo"
        description="Completa los campos para registrar un nuevo tipo de liderazgo."
        icon={Star}
        loading={createMutation.isPending}
        onSubmit={handleSubmit(handleCreateSubmit)}
        submitText="Crear Tipo de Liderazgo"
      >
        <div className="space-y-2">
          <Label htmlFor="nombre" className="flex items-center gap-2">
            Nombre <span className="text-red-500">*</span>
            {errors.nombre && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="nombre"
            placeholder="Ej: Líder comunitario"
            {...register('nombre')}
            className={errors.nombre ? 'border-red-500 bg-red-50' : isDirty ? 'border-green-500 bg-green-50' : ''}
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.nombre.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion" className="flex items-center gap-2">
            Descripción <span className="text-red-500">*</span>
            {errors.descripcion && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="descripcion"
            placeholder="Breve descripción del tipo de liderazgo"
            {...register('descripcion')}
            className={errors.descripcion ? 'border-red-500 bg-red-50' : isDirty ? 'border-green-500 bg-green-50' : ''}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.descripcion.message}
            </p>
          )}
        </div>
      </ConfigModal>

      {/* Modal: Editar */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setSelectedItem(null);
            reset();
          }
        }}
        type="edit"
        title="Editar Tipo de Liderazgo"
        description={`Modifica los datos de "${selectedItem?.nombre || ''}"`}
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleSubmit(handleEditSubmit)}
        submitText="Guardar Cambios"
      >
        <div className="space-y-2">
          <Label htmlFor="edit-nombre" className="flex items-center gap-2">
            Nombre <span className="text-red-500">*</span>
            {errors.nombre && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="edit-nombre"
            placeholder="Ej: Líder comunitario"
            {...register('nombre')}
            className={errors.nombre ? 'border-red-500 bg-red-50' : isDirty ? 'border-green-500 bg-green-50' : ''}
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.nombre.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-descripcion" className="flex items-center gap-2">
            Descripción <span className="text-red-500">*</span>
            {errors.descripcion && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="edit-descripcion"
            placeholder="Breve descripción del tipo de liderazgo"
            {...register('descripcion')}
            className={errors.descripcion ? 'border-red-500 bg-red-50' : isDirty ? 'border-green-500 bg-green-50' : ''}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.descripcion.message}
            </p>
          )}
        </div>
      </ConfigModal>

      {/* Modal: Eliminar/Desactivar */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Eliminar tipo de liderazgo?"
        description="Esta acción eliminará permanentemente el tipo de liderazgo"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedItem?.nombre}
        submitText="Eliminar"
      />
    </div>
  );
};

export default LiderazgoPage;
