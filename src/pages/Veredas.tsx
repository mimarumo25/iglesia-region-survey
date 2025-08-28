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
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useVeredas } from '@/hooks/useVeredas';
import { useMunicipios } from '@/hooks/useMunicipios';
import { Vereda, VeredaFormData, VeredaPagination } from '@/types/veredas';
import { Municipio } from '@/services/municipios';
import { municipiosToOptions, formatDate } from '@/lib/utils';
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
} from 'lucide-react';

const VeredasPage = () => {
  const veredasHook = useVeredas();

  // Estados para la paginación y filtros de veredas
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_vereda');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipioFilter, setSelectedMunicipioFilter] = useState<string>('');

  // Queries de React Query
  const { data: municipiosData, isLoading: municipiosLoading } = veredasHook.useMunicipiosQuery();
  const { data: veredasResponse, isLoading: veredasLoading, refetch: refetchVeredas } = veredasHook.useVeredasQuery(page, limit, sortBy, sortOrder);
  const { data: searchVeredasResponse, isLoading: searchLoading, refetch: refetchSearch } = veredasHook.useSearchVeredasQuery(searchTerm);
  const { data: veredasByMunicipioResponse, isLoading: veredasByMunicipioLoading, refetch: refetchVeredasByMunicipio } = veredasHook.useVeredasByMunicipioQuery(parseInt(selectedMunicipioFilter));

  // Mutaciones de React Query
  const createMutation = veredasHook.useCreateVeredaMutation();
  const updateMutation = veredasHook.useUpdateVeredaMutation();
  const deleteMutation = veredasHook.useDeleteVeredaMutation();

  const municipios = (municipiosData || []) as Municipio[];
  let veredas: Vereda[] = [];
  let pagination: VeredaPagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  // Determinar qué datos de veredas y paginación usar
  if (searchTerm && searchTerm.trim()) {
    veredas = searchVeredasResponse?.data || [];
    pagination = {
      page: searchVeredasResponse?.page || 1,
      limit: searchVeredasResponse?.limit || limit,
      total: searchVeredasResponse?.total || 0,
      totalPages: searchVeredasResponse?.totalPages || 1,
    };
  } else if (selectedMunicipioFilter && selectedMunicipioFilter !== 'all' && selectedMunicipioFilter !== '') {
    veredas = veredasByMunicipioResponse?.data || [];
    pagination = {
      page: veredasByMunicipioResponse?.page || 1,
      limit: veredasByMunicipioResponse?.limit || limit,
      total: veredasByMunicipioResponse?.total || 0,
      totalPages: veredasByMunicipioResponse?.totalPages || 1,
    };
  } else {
    veredas = veredasResponse?.data || [];
    pagination = {
      page: veredasResponse?.page || 1,
      limit: veredasResponse?.limit || limit,
      total: veredasResponse?.total || 0,
      totalPages: veredasResponse?.totalPages || 1,
    };
  }

  const loading = veredasLoading || searchLoading || veredasByMunicipioLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
    codigo_vereda: '',
    id_municipio: 0
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.codigo_vereda.trim() || formData.id_municipio === 0) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      codigo_vereda: formData.codigo_vereda.trim(),
      id_municipio: formData.id_municipio
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', codigo_vereda: '', id_municipio: 0 });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVereda || !formData.nombre.trim() || !formData.codigo_vereda.trim() || formData.id_municipio === 0) return;

    updateMutation.mutate({
      id: selectedVereda.id_vereda,
      data: {
        nombre: formData.nombre.trim(),
        codigo_vereda: formData.codigo_vereda.trim(),
        id_municipio: formData.id_municipio
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedVereda(null);
        setFormData({ nombre: '', codigo_vereda: '', id_municipio: 0 });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedVereda) return;

    deleteMutation.mutate(selectedVereda.id_vereda, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedVereda(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', codigo_vereda: '', id_municipio: 0 });
    openCreateDialog();
  };

  const handleOpenEditDialog = (vereda: Vereda) => {
    setSelectedVereda(vereda);
    setFormData({
      nombre: vereda.nombre,
      codigo_vereda: vereda.codigo_vereda,
      id_municipio: vereda.id_municipio
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (vereda: Vereda) => {
    setSelectedVereda(vereda);
    openDeleteDialog();
  };

  // Manejo de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetear paginación al buscar
    // Al cambiar searchTerm, useSearchVeredasQuery se ejecutará automáticamente
    // No es necesario llamar a refetch explícitamente aquí si el enabled depende de searchTerm
  };

  // Manejo del filtro por municipio
  const handleMunicipioFilter = (municipioId: string) => {
    setSelectedMunicipioFilter(municipioId);
    setSearchTerm(''); // Limpiar búsqueda al aplicar filtro de municipio
    setPage(1); // Resetear paginación al aplicar filtro
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Obtener nombre del municipio
  const getMunicipioName = (id_municipio: number): string => {
    if (!municipios || municipios.length === 0) return 'Desconocido';
    const municipio = municipios.find(m => {
      const municipioId = typeof m.id_municipio === 'string' 
        ? parseInt(m.id_municipio) 
        : m.id_municipio;
      return municipioId === id_municipio;
    });
    return municipio?.nombre_municipio || 'Desconocido';
  };

  // Convertir municipios a opciones de autocompletado
  const getMunicipiosOptions = (): AutocompleteOption[] => {
    return municipiosToOptions((municipios as any) || [], false);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl ">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MapPin className="w-8 h-8 text-muted-foreground " />
            Gestión de Veredas
          </h1>
          <p className="text-muted-foreground mt-2">Administra las veredas por municipio</p>
        </div>
        <div className="flex gap-2 ">
          <Button
            variant="outline"
            onClick={() => {
              if (searchTerm && searchTerm.trim()) {
                refetchSearch();
              } else if (selectedMunicipioFilter && selectedMunicipioFilter !== 'all' && selectedMunicipioFilter !== '') {
                refetchVeredasByMunicipio();
              } else {
                refetchVeredas();
              }
            }}
            disabled={loading}
            className=""
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? '' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={handleOpenCreateDialog}
            className=""
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Vereda
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6  ">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda por texto */}
              <div className="flex-1">
                <Input
                  placeholder="Buscar veredas por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-input-border focus:ring-primary"
                />
              </div>
              
              {/* Filtro por municipio */}
              <div className="w-full md:w-64">
                <Autocomplete
                  options={[
                    { value: 'all', label: 'Todos los municipios' },
                    ...getMunicipiosOptions()
                  ]}
                  value={selectedMunicipioFilter}
                  onValueChange={handleMunicipioFilter}
                  placeholder="Filtrar por municipio"
                  searchPlaceholder="Buscar municipio..."
                  emptyText="No se encontraron municipios"
                  loading={municipiosLoading}
                  disabled={municipiosLoading}
                  className="w-full"
                />
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
                {(searchTerm || selectedMunicipioFilter) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedMunicipioFilter('');
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
                <p className="text-sm text-muted-foreground">Total Veredas</p>
                <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
              </div>
              <MapPin className="w-8 h-8 text-muted-foreground opacity-70 " />
            </div>
          </CardContent>
        </Card>
        
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Municipios</p>
                <p className="text-2xl font-bold text-foreground">{municipios.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-secondary opacity-70 " />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de veredas con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
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
              {/* Alerta sobre problema del backend */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-sm font-medium text-amber-800">Problema temporal del servidor</h4>
                </div>
                <p className="text-sm text-amber-700 mb-2">
                  Las veredas se están guardando correctamente, pero existe un problema en el servidor 
                  que impide mostrarlas. El equipo técnico ya ha sido notificado.
                </p>
                <p className="text-xs text-amber-600">
                  <strong>Para desarrolladores:</strong> Error de asociación de tablas "Municipios is not associated to Veredas!" 
                  en el endpoint GET /api/catalog/veredas
                </p>
              </div>
              
              <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 " />
              <p className="text-muted-foreground">No se encontraron veredas</p>
              {(searchTerm || selectedMunicipioFilter) && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda o filtros
                </p>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Código</TableHead>
                    <TableHead className="font-semibold">Municipio</TableHead>
                    <TableHead className="font-semibold">Fecha Creación</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {veredas.map((vereda, index) => (
                    <TableRow
                      key={vereda.id_vereda}
                            className=""                    >
                      <TableCell className="font-medium text-muted-foreground/80">
                        {vereda.id_vereda}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground " />
                          <span className="font-medium">{vereda.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                          {vereda.codigo_vereda}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-secondary " />
                          <span>{getMunicipioName(vereda.id_municipio)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="">
                          {formatDate(vereda.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(vereda)}
                            className=""
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(vereda)}
                            className=""
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación con diseño mejorado */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {veredas.length} de {pagination.total} veredas
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className=""
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm font-medium text-muted-foreground bg-primary/10 rounded-md">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className=""
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
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
          id="codigo_vereda"
          label="Código de Vereda"
          placeholder="Ej: EP001"
          value={formData.codigo_vereda}
          onChange={(value) => setFormData({ ...formData, codigo_vereda: value })}
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
          id="edit-codigo_vereda"
          label="Código de Vereda"
          placeholder="Ej: EP001"
          value={formData.codigo_vereda}
          onChange={(value) => setFormData({ ...formData, codigo_vereda: value })}
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