import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useVeredas } from '@/hooks/useVeredas';
import { Vereda, VeredaFormData } from '@/types/veredas';
import { Municipio } from '@/services/municipios';
import { municipiosToOptions, formatDate } from '@/lib/utils';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { ConfigPagination } from '@/components/ui/config-pagination';

const VeredasPage = () => {
  const veredasHook = useVeredas();

  // Estados para búsqueda, filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipioFilter, setSelectedMunicipioFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Queries usando patrón unificado
  const { data: municipiosData, isLoading: municipiosLoading } = veredasHook.useMunicipiosQuery();
  const { data: veredasResponse, isLoading: veredasLoading, refetch: refetchVeredas } = veredasHook.useVeredasQuery(searchTerm, selectedMunicipioFilter, page, limit);

  // Mutaciones de React Query
  const createMutation = veredasHook.useCreateVeredaMutation();
  const updateMutation = veredasHook.useUpdateVeredaMutation();
  const deleteMutation = veredasHook.useDeleteVeredaMutation();

  const municipios = (municipiosData || []) as Municipio[];
  const veredas = veredasResponse?.data || [];
  const pagination = {
    page: veredasResponse?.page || 1,
    limit: veredasResponse?.limit || limit,
    total: veredasResponse?.total || 0,
    totalPages: veredasResponse?.totalPages || 1,
  };

  const loading = veredasLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Estados para diálogos y formularios usando el hook personalizado
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
  
  const [selectedVereda, setSelectedVereda] = useState<Vereda | null>(null);
  const [formData, setFormData] = useState<VeredaFormData>({
    nombre: '',
    id_municipio: 0
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || formData.id_municipio === 0) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      id_municipio: formData.id_municipio
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', id_municipio: 0 });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVereda || !formData.nombre.trim() || formData.id_municipio === 0) return;

    updateMutation.mutate({
      id: typeof selectedVereda.id_vereda === 'string' 
        ? parseInt(selectedVereda.id_vereda) 
        : selectedVereda.id_vereda,
      data: {
        nombre: formData.nombre.trim(),
        id_municipio: formData.id_municipio
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedVereda(null);
        setFormData({ nombre: '', id_municipio: 0 });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedVereda) return;

    deleteMutation.mutate(
      typeof selectedVereda.id_vereda === 'string' 
        ? parseInt(selectedVereda.id_vereda) 
        : selectedVereda.id_vereda, 
      {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedVereda(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', id_municipio: 0 });
    openCreateDialog();
  };

  const handleOpenEditDialog = (vereda: Vereda) => {
    setSelectedVereda(vereda);
    setFormData({
      nombre: vereda.nombre,
      id_municipio: vereda.id_municipio
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (vereda: Vereda) => {
    setSelectedVereda(vereda);
    openDeleteDialog();
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset a primera página cuando cambie el límite
  };

  // Obtener nombre del municipio desde la vereda o desde la lista de municipios como fallback
  const getMunicipioName = (vereda: Vereda): string => {
    // Si la vereda tiene la información del municipio incluida (API response)
    if (vereda.municipio && vereda.municipio.nombre) {
      return vereda.municipio.nombre;
    }
    
    // Fallback: buscar en la lista de municipios por id_municipio
    if (!municipios || municipios.length === 0) return 'Desconocido';
    const municipio = municipios.find(m => {
      const municipioId = typeof m.id_municipio === 'string' 
        ? parseInt(m.id_municipio) 
        : m.id_municipio;
      return municipioId === vereda.id_municipio;
    });
    return municipio?.nombre_municipio || 'Desconocido';
  };

  // Convertir municipios a opciones de autocompletado
  const getMunicipiosOptions = (): AutocompleteOption[] => {
    return municipiosToOptions(municipios || [], false);
  };

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MapPin className="w-8 h-8 text-muted-foreground" />
            Gestión de Veredas
          </h1>
          <p className="text-muted-foreground mt-2">Administra las veredas por municipio</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetchVeredas()}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button
            onClick={handleOpenCreateDialog}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Vereda
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda por texto con búsqueda en tiempo real */}
              <div className="flex-1 relative">
                <Input
                  placeholder="Buscar veredas por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-input-border focus:ring-primary pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    type="button"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Filtro por municipio */}
              <div className="w-full md:w-64">
                <Autocomplete
                  options={[
                    { value: 'all', label: 'Todos los municipios' },
                    ...getMunicipiosOptions()
                  ]}
                  value={selectedMunicipioFilter}
                  onValueChange={(value) => setSelectedMunicipioFilter(value)}
                  placeholder="Filtrar por municipio"
                  searchPlaceholder="Buscar municipio..."
                  emptyText="No se encontraron municipios"
                  loading={municipiosLoading}
                  disabled={municipiosLoading}
                  className="w-full"
                />
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
                  {(searchTerm || selectedMunicipioFilter !== 'all') && selectedMunicipioFilter !== '' ? 'Veredas Filtradas' : 'Total Veredas'}
                </p>
                <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
              </div>
              <MapPin className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Municipios</p>
                <p className="text-2xl font-bold text-foreground">{municipios.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de veredas con diseño mejorado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            Listado de Veredas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando veredas...</span>
            </div>
          ) : veredas.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron veredas</p>
              {(searchTerm || selectedMunicipioFilter) && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda o filtros
                </p>
              )}
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={veredas}
                columns={[
                  {
                    key: 'id_vereda',
                    label: 'ID',
                    priority: 'low',
                    hideOnMobile: true,
                    render: (value) => (
                      <span className="font-medium text-muted-foreground/80">
                        {value}
                      </span>
                    ),
                  },
                  {
                    key: 'nombre',
                    label: 'Nombre',
                    priority: 'high',
                    render: (value) => (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{value}</span>
                      </div>
                    ),
                  },
                  {
                    key: 'codigo_vereda',
                    label: 'Código',
                    priority: 'medium',
                    hideOnMobile: true,
                    render: (value) => (
                      <span >
                        {value || 'Sin código'}
                      </span>
                    ),
                  },
                  {
                    key: 'municipio',
                    label: 'Municipio',
                    priority: 'high',
                    render: (value, item) => (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-secondary" />
                        <span>{getMunicipioName(item)}</span>
                      </div>
                    ),
                  },
                  {
                    key: 'created_at',
                    label: 'Fecha Creación',
                    priority: 'low',
                    hideOnMobile: true,
                    render: (value) => (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-background border border-border text-foreground text-xs">
                        {formatDate(value)}
                      </span>
                    ),
                  },
                ]}
                actions={[
                  {
                    label: 'Editar',
                    icon: <Edit2 className="w-4 h-4" />,
                    onClick: handleOpenEditDialog,
                    variant: 'ghost',
                    primary: true,
                  },
                  {
                    label: 'Eliminar',
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: handleOpenDeleteDialog,
                    variant: 'destructive',
                    primary: false,
                  },
                ]}
                emptyState={{
                  icon: <MapPin className="w-16 h-16 text-muted-foreground/50" />,
                  title: 'No se encontraron veredas',
                  description: (searchTerm || selectedMunicipioFilter) 
                    ? 'Intenta con otros términos de búsqueda o filtros'
                    : undefined,
                }}
                loading={loading}
                loadingText="Cargando veredas..."
                itemKey="id_vereda"
              />

              {/* Paginación unificada con patrón completo */}
              <ConfigPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
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

      {/* Modal de Crear Vereda */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Vereda"
        description="Crea una nueva vereda en el sistema"
        icon={MapPin}
        loading={createMutation.isPending || municipiosLoading}
        onSubmit={handleCreateSubmit}
        submitText="Crear Vereda"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Vereda"
          placeholder="Ej: El Poblado"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <ConfigFormField
          id="municipio"
          label="Municipio"
          type="autocomplete"
          placeholder="Selecciona un municipio"
          searchPlaceholder="Buscar municipio..."
          emptyText="No se encontraron municipios"
          value={formData.id_municipio ? formData.id_municipio.toString() : ''}
          onChange={(value) => setFormData({ ...formData, id_municipio: value ? parseInt(value) : 0 })}
          options={getMunicipiosOptions()}
          loading={municipiosLoading}
          disabled={municipiosLoading}
        />
      </ConfigModal>

      {/* Modal de Editar Vereda */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Vereda"
        description="Modifica los datos de la vereda"
        icon={Edit2}
        loading={updateMutation.isPending || municipiosLoading}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Vereda"
          placeholder="Ej: El Poblado"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <ConfigFormField
          id="edit-municipio"
          label="Municipio"
          type="autocomplete"
          placeholder="Selecciona un municipio"
          searchPlaceholder="Buscar municipio..."
          emptyText="No se encontraron municipios"
          value={formData.id_municipio ? formData.id_municipio.toString() : ''}
          onChange={(value) => setFormData({ ...formData, id_municipio: value ? parseInt(value) : 0 })}
          options={getMunicipiosOptions()}
          loading={municipiosLoading}
          disabled={municipiosLoading}
        />
      </ConfigModal>

      {/* Modal de Eliminar Vereda */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la vereda"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedVereda?.nombre}
        submitText="Eliminar Vereda"
      />
    </div>
  );
};

export default VeredasPage;