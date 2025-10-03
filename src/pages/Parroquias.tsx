import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { ConfigModal, useConfigModal } from '@/components/ui/config-modal';
import { RHFConfigFormField } from '@/components/ui/rhf-config-form';
import { ResponsiveParroquiasList } from '@/components/parroquias/ResponsiveParroquiasList';
import { useParroquias } from '@/hooks/useParroquias';
import { useMunicipios } from '@/hooks/useMunicipios';
import { Parroquia, ParroquiaFormData } from '@/types/parroquias';
import { municipiosToOptions, formatDate } from '@/lib/utils';
import { 
  parroquiaCreateSchema, 
  parroquiaUpdateSchema, 
  ParroquiaCreateData, 
  ParroquiaUpdateData,
  formatTelefono 
} from '@/schemas/parroquias';
import {
  Church,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  Search,
} from 'lucide-react';
import { ConfigPagination } from '@/components/ui/config-pagination';

const ParroquiasPage = () => {
  const parroquiasHook = useParroquias();
  const municipiosHook = useMunicipios();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_parroquia');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Query unificada de React Query
  const { data: parroquiasResponse, isLoading: parroquiasLoading, refetch: refetchParroquias } = parroquiasHook.useParroquiasQuery(page, limit, sortBy, sortOrder, searchTerm);
  
  // Query para obtener todos los municipios para el autocomplete
  const { data: municipios, isLoading: municipiosLoading, error: municipiosError } = municipiosHook.useAllMunicipiosQuery();

  // Mutaciones de React Query
  const createMutation = parroquiasHook.useCreateParroquiaMutation();
  const updateMutation = parroquiasHook.useUpdateParroquiaMutation();
  const deleteMutation = parroquiasHook.useDeleteParroquiaMutation();

  // Preparar opciones de municipios para el autocomplete
  const municipiosOptions = municipiosToOptions((municipios as any) || [], true);

  // Usar datos del query unificado
  const parroquias = parroquiasResponse?.data || [];
  const pagination = parroquiasResponse?.pagination || { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false };

  const loading = parroquiasLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedParroquia, setSelectedParroquia] = useState<Parroquia | null>(null);

  // Formularios con React Hook Form y validación Zod
  const createForm = useForm<ParroquiaCreateData>({
    resolver: zodResolver(parroquiaCreateSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      id_municipio: '',
    },
  });

  const editForm = useForm<ParroquiaUpdateData>({
    resolver: zodResolver(parroquiaUpdateSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      id_municipio: '',
    },
  });

  // Manejo del formulario con React Hook Form
  const handleCreateSubmit = (data: ParroquiaCreateData) => {
    const submitData = {
      ...data,
      nombre: data.nombre.trim(),
      direccion: data.direccion.trim(),
      telefono: data.telefono?.trim() || undefined,
      email: data.email?.trim() || undefined,
    };

    createMutation.mutate(submitData, {
      onSuccess: () => {
        setShowCreateDialog(false);
        createForm.reset();
      }
    });
  };

  const handleEditSubmit = (data: ParroquiaUpdateData) => {
    if (!selectedParroquia) return;

    const submitData = {
      ...data,
      nombre: data.nombre.trim(),
      direccion: data.direccion.trim(),
      telefono: data.telefono?.trim() || undefined,
      email: data.email?.trim() || undefined,
    };

    updateMutation.mutate({
      id: selectedParroquia.id_parroquia,
      data: submitData
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedParroquia(null);
        editForm.reset();
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedParroquia) return;

    deleteMutation.mutate(selectedParroquia.id_parroquia, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedParroquia(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    createForm.reset({
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      id_municipio: '',
    });
    openCreateDialog();
  };

  const handleOpenEditDialog = (parroquia: Parroquia) => {
    setSelectedParroquia(parroquia);
    editForm.reset({
      nombre: parroquia.nombre,
      direccion: parroquia.direccion,
      telefono: parroquia.telefono || '',
      email: parroquia.email || '',
      id_municipio: parroquia.id_municipio,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (parroquia: Parroquia) => {
    setSelectedParroquia(parroquia);
    openDeleteDialog();
  };

  // Manejo de búsqueda en tiempo real
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1); // Resetear a primera página
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
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
    <div className="container mx-auto p-3 sm:p-6 max-w-7xl">
      {/* Header responsive */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <Church className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground flex-shrink-0" />
            <span className="truncate">Gestión de Parroquias</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Administra las parroquias para encuestas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchParroquias()}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="sm:inline">Actualizar</span>
          </Button>
          <Button 
            onClick={handleOpenCreateDialog}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="sm:inline">Nueva Parroquia</span>
          </Button>
        </div>
      </div>

      {/* Búsqueda responsive */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar parroquias..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                className="pl-10 w-full"
              />
            </div>
            {searchTerm && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
                className="w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-muted-foreground mt-2">
              Búsqueda por: nombre, dirección, teléfono, email o municipio
            </p>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Church className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Páginas</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{pagination.totalPages}</p>
              </div>
              <Church className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista/Tabla responsive de parroquias */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <Church className="w-5 h-5" />
            Listado de Parroquias
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-2" />
                <span className="text-sm text-muted-foreground">Cargando parroquias...</span>
              </div>
            </div>
          ) : parroquias.length === 0 ? (
            <div className="text-center py-12">
              <Church className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No se encontraron parroquias</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <>
              <ResponsiveParroquiasList
                parroquias={parroquias}
                onEdit={handleOpenEditDialog}
                onDelete={handleOpenDeleteDialog}
                loading={loading}
              />

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

      {/* Modal de Crear Parroquia */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Parroquia"
        description="Crea una nueva parroquia en el sistema"
        icon={Church}
        loading={createMutation.isPending}
        onSubmit={createForm.handleSubmit(handleCreateSubmit)}
        submitText="Crear Parroquia"
      >
        <Form {...createForm}>
          <div className="space-y-6">
            <RHFConfigFormField
              control={createForm.control}
              name="nombre"
              label="Nombre de la Parroquia"
              placeholder="Ej: Parroquia San Juan"
              required
            />
            
            <RHFConfigFormField
              control={createForm.control}
              name="direccion"
              label="Dirección"
              placeholder="Ej: Calle 10 # 20-30"
              required
            />
            
            <RHFConfigFormField
              control={createForm.control}
              name="telefono"
              type="tel"
              label="Teléfono"
              placeholder="Ej: 1234567, 3001234567, +57 300 123 4567"
            />
            
            <RHFConfigFormField
              control={createForm.control}
              name="email"
              type="email"
              label="Email"
              placeholder="Ej: parroquia@ejemplo.com"
            />
            
            <RHFConfigFormField
              control={createForm.control}
              name="id_municipio"
              type="autocomplete"
              label="Municipio"
              placeholder="Seleccionar municipio..."
              searchPlaceholder="Buscar municipio..."
              emptyText="No se encontraron municipios"
              options={municipiosOptions}
              isLoading={municipiosLoading}
              error={municipiosError}
              errorText="Error al cargar municipios"
              required
            />
          </div>
        </Form>
      </ConfigModal>

      {/* Modal de Editar Parroquia */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Parroquia"
        description="Modifica los datos de la parroquia"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={editForm.handleSubmit(handleEditSubmit)}
        submitText="Guardar Cambios"
      >
        <Form {...editForm}>
          <div className="space-y-6">
            <RHFConfigFormField
              control={editForm.control}
              name="nombre"
              label="Nombre de la Parroquia"
              placeholder="Ej: Parroquia San Juan"
              required
            />
            
            <RHFConfigFormField
              control={editForm.control}
              name="direccion"
              label="Dirección"
              placeholder="Ej: Calle 10 # 20-30"
              required
            />
            
            <RHFConfigFormField
              control={editForm.control}
              name="telefono"
              type="tel"
              label="Teléfono"
              placeholder="Ej: 1234567, 3001234567, +57 300 123 4567"
            />
            
            <RHFConfigFormField
              control={editForm.control}
              name="email"
              type="email"
              label="Email"
              placeholder="Ej: parroquia@ejemplo.com"
            />
            
            <RHFConfigFormField
              control={editForm.control}
              name="id_municipio"
              type="autocomplete"
              label="Municipio"
              placeholder="Seleccionar municipio..."
              searchPlaceholder="Buscar municipio..."
              emptyText="No se encontraron municipios"
              options={municipiosOptions}
              isLoading={municipiosLoading}
              error={municipiosError}
              errorText="Error al cargar municipios"
              required
            />
          </div>
        </Form>
      </ConfigModal>

      {/* Modal de Eliminar Parroquia */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la parroquia"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedParroquia?.nombre}
        submitText="Eliminar Parroquia"
      />
    </div>
  );
};

export default ParroquiasPage;