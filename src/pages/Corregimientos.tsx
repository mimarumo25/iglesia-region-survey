import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { ConfigModal, useConfigModal } from '@/components/ui/config-modal';
import { RHFConfigFormField } from '@/components/ui/rhf-config-form';
import { ResponsiveCorregimientosList } from '@/components/corregimientos/ResponsiveCorregimientosList';
import { useCorregimientos } from '@/hooks/useCorregimientos';
import { useMunicipios } from '@/hooks/useMunicipios';
import { Corregimiento, CorregimientoFormData } from '@/types/corregimientos';
import { municipiosToOptions } from '@/lib/utils';
import {
  corregimientoCreateSchema,
  corregimientoUpdateSchema,
  CorregimientoCreateData,
  CorregimientoUpdateData,
  formatNombreCorregimiento,
} from '@/schemas/corregimientos';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { ConfigPagination } from '@/components/ui/config-pagination';

const CorregimientosPage = () => {
  const corregimientosHook = useCorregimientos();
  const municipiosHook = useMunicipios();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Query unificada de React Query
  const { data: corregimientosResponse, isLoading: corregimientosLoading, refetch: refetchCorregimientos } = corregimientosHook.useCorregimientosQuery(
    page,
    limit,
    sortBy,
    sortOrder,
    searchTerm
  );

  // Query para obtener todos los municipios
  const { data: municipios, isLoading: municipiosLoading } = municipiosHook.useAllMunicipiosQuery();

  // Mutaciones de React Query
  const createMutation = corregimientosHook.useCreateCorregimientoMutation();
  const updateMutation = corregimientosHook.useUpdateCorregimientoMutation();
  const deleteMutation = corregimientosHook.useDeleteCorregimientoMutation();

  // Preparar opciones de municipios
  const municipiosOptions = municipiosToOptions((municipios as any) || [], true);

  // Usar datos del query unificado
  const corregimientos = corregimientosResponse?.data || [];
  const pagination = corregimientosResponse?.pagination || {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  };

  const loading =
    corregimientosLoading ||
    municipiosLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

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

  const [selectedCorregimiento, setSelectedCorregimiento] = useState<Corregimiento | null>(null);

  // Formularios con React Hook Form
  const createForm = useForm<CorregimientoCreateData>({
    resolver: zodResolver(corregimientoCreateSchema),
    defaultValues: {
      nombre: '',
      id_municipio: 0,
    },
  });

  const editForm = useForm<CorregimientoUpdateData>({
    resolver: zodResolver(corregimientoUpdateSchema),
    defaultValues: {
      nombre: '',
      id_municipio: 0,
    },
  });

  // Manejo del formulario de creación
  const handleCreateSubmit = async (data: CorregimientoCreateData) => {
    const municipioId = data.id_municipio || data.id_municipio_municipios;
    if (!data.nombre.trim() || !municipioId) return;

    createMutation.mutate(
      {
        nombre: formatNombreCorregimiento(data.nombre),
        id_municipio: municipioId,
      },
      {
        onSuccess: () => {
          setShowCreateDialog(false);
          createForm.reset();
          refetchCorregimientos();
        },
      }
    );
  };

  // Manejo del formulario de edición
  const handleEditSubmit = async (data: CorregimientoUpdateData) => {
    const municipioId = data.id_municipio || data.id_municipio_municipios;
    if (!selectedCorregimiento || !data.nombre.trim() || !municipioId) return;

    updateMutation.mutate(
      {
        id: selectedCorregimiento.id_corregimiento,
        data: {
          nombre: formatNombreCorregimiento(data.nombre),
          id_municipio: municipioId,
        },
      },
      {
        onSuccess: () => {
          setShowEditDialog(false);
          setSelectedCorregimiento(null);
          editForm.reset();
          refetchCorregimientos();
        },
      }
    );
  };

  // Abrir diálogo de edición
  const handleEdit = (corregimiento: Corregimiento) => {
    setSelectedCorregimiento(corregimiento);
    editForm.setValue('nombre', corregimiento.nombre);
    const municipioId = Number(corregimiento.id_municipio_municipios || 0);
    editForm.setValue('id_municipio', municipioId);
    openEditDialog();
  };

  // Abrir diálogo de confirmación de eliminación
  const handleDeleteConfirm = (corregimiento: Corregimiento) => {
    setSelectedCorregimiento(corregimiento);
    openDeleteDialog();
  };

  // Confirmar eliminación
  const handleDeleteSubmit = async () => {
    if (!selectedCorregimiento) return;

    deleteMutation.mutate(selectedCorregimiento.id_corregimiento, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedCorregimiento(null);
        refetchCorregimientos();
      },
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Corregimientos</h1>
        </div>
        <p className="text-muted-foreground">Gestión centralizada de corregimientos</p>
      </div>

      {/* Tarjeta principal */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Corregimientos Registrados</CardTitle>
              <CardDescription>
                Total: <Badge variant="secondary">{pagination.totalCount || 0}</Badge>
              </CardDescription>
            </div>
            <Button
              onClick={openCreateDialog}
              className="gap-2"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              Agregar Corregimiento
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar corregimiento..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchCorregimientos()}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          {/* Tabla/Lista responsiva */}
          <div className="overflow-x-auto">
            <ResponsiveCorregimientosList
              corregimientos={corregimientos}
              isLoading={loading}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
            />
          </div>

          {/* Paginación */}
          {pagination.totalCount > 0 && (
            <ConfigPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              totalItems={pagination.totalCount}
              itemsPerPage={limit}
              onItemsPerPageChange={setLimit}
            />
          )}
        </CardContent>
      </Card>

      {/* Diálogo de creación */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Corregimiento"
        description="Crea un nuevo corregimiento en el sistema"
        icon={Building2}
        loading={createMutation.isPending}
        onSubmit={createForm.handleSubmit(handleCreateSubmit)}
        submitText="Crear Corregimiento"
      >
        <Form {...createForm}>
          <div className="space-y-6">
            <RHFConfigFormField
              control={createForm.control}
              name="nombre"
              label="Nombre del Corregimiento"
              placeholder="Ej: Corregimiento El Centro"
              required
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
              required
            />
          </div>
        </Form>
      </ConfigModal>

      {/* Diálogo de edición */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Corregimiento"
        description={`Modifica los datos del corregimiento: ${selectedCorregimiento?.nombre}`}
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
              label="Nombre del Corregimiento"
              placeholder="Nombre del corregimiento"
              required
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
              required
            />
          </div>
        </Form>
      </ConfigModal>

      {/* Diálogo de confirmación de eliminación */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="Eliminar Corregimiento"
        description={`¿Está seguro de que desea eliminar el corregimiento "${selectedCorregimiento?.nombre}"? Esta acción no se puede deshacer.`}
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteSubmit}
        submitText="Eliminar"
        entityName={selectedCorregimiento?.nombre}
      />
    </div>
  );
};

export default CorregimientosPage;
