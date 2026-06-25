import { useMemo, useState } from 'react';
import { Activity, Edit2, Loader2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfigFormField, ConfigModal, useConfigModal } from '@/components/ui/config-modal';
import { ConfigPagination } from '@/components/ui/config-pagination';
import { Input } from '@/components/ui/input';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import {
  useNecesidadesEnfermoMutations,
  useNecesidadesEnfermoQuery,
} from '@/hooks/useNecesidadesEnfermo';
import { NecesidadEnfermo } from '@/types/necesidades-enfermo';

const NecesidadesEnfermoPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<NecesidadEnfermo | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
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
  const { createMutation, updateMutation, deactivateMutation } = useNecesidadesEnfermoMutations();
  const { data, isLoading, error, refetch } = useNecesidadesEnfermoQuery({
    search: search.trim() || undefined,
    page,
    limit,
  });

  const items = useMemo(() => data?.data ?? [], [data?.data]);
  const isMutating = createMutation.isPending || updateMutation.isPending || deactivateMutation.isPending;

  const activeCount = useMemo(() => items.filter((item) => item.activo).length, [items]);

  const openCreate = () => {
    setFormData({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const openEdit = (item: NecesidadEnfermo) => {
    setSelected(item);
    setFormData({ nombre: item.nombre, descripcion: item.descripcion ?? '' });
    openEditDialog();
  };

  const openDelete = (item: NecesidadEnfermo) => {
    setSelected(item);
    openDeleteDialog();
  };

  const submitCreate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.nombre.trim()) return;
    createMutation.mutate(
      {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
      },
      { onSuccess: () => setShowCreateDialog(false) }
    );
  };

  const submitEdit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || !formData.nombre.trim()) return;
    updateMutation.mutate(
      {
        id: selected.id_tipo_necesidad_enfermo,
        data: {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          activo: selected.activo,
        },
      },
      {
        onSuccess: () => {
          setShowEditDialog(false);
          setSelected(null);
        },
      }
    );
  };

  const deactivate = () => {
    if (!selected) return;
    deactivateMutation.mutate(selected.id_tipo_necesidad_enfermo, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelected(null);
      },
    });
  };

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
            <Activity className="h-8 w-8 text-primary" />
            Necesidades del Enfermo
          </h1>
          <p className="mt-2 text-muted-foreground">
            Administra las opciones disponibles para los miembros de una encuesta.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading || isMutating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva necesidad
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nombre..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{data?.total ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Activas en esta página</p>
            <p className="text-2xl font-bold">{activeCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de necesidades</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Cargando necesidades...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-destructive">
              No se pudo cargar el catálogo. Intenta actualizar.
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron necesidades.
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={items}
                columns={[
                  {
                    key: 'id_tipo_necesidad_enfermo',
                    label: 'ID',
                    priority: 'medium',
                  },
                  {
                    key: 'nombre',
                    label: 'Nombre',
                    priority: 'high',
                    render: (value: string) => <span className="font-semibold">{value}</span>,
                  },
                  {
                    key: 'descripcion',
                    label: 'Descripción',
                    priority: 'medium',
                    render: (value: string | null) => value || 'Sin descripción',
                  },
                  {
                    key: 'activo',
                    label: 'Estado',
                    priority: 'high',
                    render: (value: boolean) => (
                      <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Activo' : 'Inactivo'}
                      </Badge>
                    ),
                  },
                ]}
                actions={[
                  {
                    label: 'Editar',
                    icon: <Edit2 className="h-4 w-4" />,
                    variant: 'default',
                    onClick: openEdit,
                  },
                  {
                    label: 'Desactivar',
                    icon: <Trash2 className="h-4 w-4" />,
                    variant: 'destructive',
                    onClick: openDelete,
                  },
                ]}
              />
              <ConfigPagination
                currentPage={data?.page ?? page}
                totalPages={data?.totalPages ?? 1}
                totalItems={data?.total ?? 0}
                itemsPerPage={limit}
                onPageChange={setPage}
                onItemsPerPageChange={(nextLimit) => {
                  setLimit(nextLimit);
                  setPage(1);
                }}
                itemsPerPageOptions={[5, 10, 25, 50]}
                variant="complete"
                showInfo
                loading={isLoading}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Necesidad del Enfermo"
        description="Crea una opción para usarla en las encuestas."
        icon={Plus}
        loading={createMutation.isPending}
        onSubmit={submitCreate}
        submitText="Crear necesidad"
      >
        <ConfigFormField
          id="necesidad-nombre"
          label="Nombre"
          placeholder="Ej: Medicamentos"
          value={formData.nombre}
          onChange={(nombre) => setFormData((current) => ({ ...current, nombre }))}
          required
        />
        <ConfigFormField
          id="necesidad-descripcion"
          label="Descripción"
          type="textarea"
          placeholder="Descripción opcional"
          value={formData.descripcion}
          onChange={(descripcion) => setFormData((current) => ({ ...current, descripcion }))}
        />
      </ConfigModal>

      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Necesidad del Enfermo"
        description="Actualiza el nombre o la descripción."
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={submitEdit}
        submitText="Guardar cambios"
      >
        <ConfigFormField
          id="editar-necesidad-nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(nombre) => setFormData((current) => ({ ...current, nombre }))}
          required
        />
        <ConfigFormField
          id="editar-necesidad-descripcion"
          label="Descripción"
          type="textarea"
          value={formData.descripcion}
          onChange={(descripcion) => setFormData((current) => ({ ...current, descripcion }))}
        />
      </ConfigModal>

      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="Desactivar necesidad"
        description="La opción dejará de aparecer en nuevas selecciones"
        icon={Trash2}
        loading={deactivateMutation.isPending}
        onConfirm={deactivate}
        entityName={selected?.nombre}
        submitText="Desactivar"
      />
    </div>
  );
};

export default NecesidadesEnfermoPage;
