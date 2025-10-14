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
import ConfigPagination from '@/components/ui/config-pagination';
import { useTiposVivienda } from '@/hooks/useTiposVivienda';
import { TipoVivienda, TipoViviendaFormData, ServerResponse, TiposViviendaResponse } from '@/types/tipos-vivienda';
import {
  Home,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const TiposViviendaPage = () => {
  const { 
    useTiposViviendaQuery, 
    paginateClientSide, 
    filterBySearch,
    useCreateTipoViviendaMutation,
    useUpdateTipoViviendaMutation,
    useDeleteTipoViviendaMutation,
  } = useTiposVivienda();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50); // Límite alto para paginación del lado del cliente
  const [sortBy] = useState('nombre');
  const [sortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const [activoOnly, setActivoOnly] = useState(false);

  // Query unificada con búsqueda opcional
  const { data: tiposViviendaResponse, isLoading, refetch } = useTiposViviendaQuery(
    searchTerm,
    1, // Siempre página 1 porque paginamos del lado del cliente
    limit,
    sortBy,
    sortOrder
  );

  // Mutaciones
  const createMutation = useCreateTipoViviendaMutation();
  const updateMutation = useUpdateTipoViviendaMutation();
  const deleteMutation = useDeleteTipoViviendaMutation();

  // Procesamiento de datos con filtros del lado del cliente
  const { items: tiposVivienda, pagination } = useMemo(() => {
    let allTipos: TipoVivienda[] = [];

    if (tiposViviendaResponse?.status === 'success') {
      allTipos = tiposViviendaResponse.data?.tiposVivienda || [];
    }

    // Aplicar filtro de solo activos si está habilitado
    if (activoOnly) {
      allTipos = allTipos.filter(tipo => tipo.activo);
    }

    // Filtrar por búsqueda del lado del cliente (para búsquedas en tiempo real)
    const filteredTipos = filterBySearch(allTipos, searchTerm);

    // Paginar del lado del cliente
    return paginateClientSide(filteredTipos, page, 10); // 10 items por página en la vista
  }, [tiposViviendaResponse, searchTerm, activoOnly, page, filterBySearch, paginateClientSide]);

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
  
  const [selectedTipoVivienda, setSelectedTipoVivienda] = useState<TipoVivienda | null>(null);
  const [formData, setFormData] = useState<TipoViviendaFormData>({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || null,
      activo: formData.activo,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '', activo: true });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTipoVivienda || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedTipoVivienda.id_tipo_vivienda,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedTipoVivienda(null);
        setFormData({ nombre: '', descripcion: '', activo: true });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedTipoVivienda) return;

    deleteMutation.mutate(selectedTipoVivienda.id_tipo_vivienda, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedTipoVivienda(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', activo: true });
    openCreateDialog();
  };

  const handleOpenEditDialog = (tipoVivienda: TipoVivienda) => {
    setSelectedTipoVivienda(tipoVivienda);
    setFormData({
      nombre: tipoVivienda.nombre,
      descripcion: tipoVivienda.descripcion || '',
      activo: tipoVivienda.activo,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (tipoVivienda: TipoVivienda) => {
    setSelectedTipoVivienda(tipoVivienda);
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

  // Manejo del filtro de activos
  const handleActivoOnlyChange = (checked: boolean) => {
    setActivoOnly(checked);
    setPage(1); // Resetear paginación al cambiar filtro
  };

  // Limpiar búsqueda y filtros
  const handleClearSearch = () => {
    setSearchTerm('');
    setActivoOnly(false);
    setPage(1);
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Home className="w-8 h-8 text-muted-foreground " />
            Gestión de Tipos de Vivienda
          </h1>
          <p className="text-muted-foreground mt-2">Administra los tipos de vivienda para encuestas</p>
        </div>
        <div className="flex gap-2 ">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
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
            Nuevo Tipo
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6  ">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Búsqueda por texto con X clear button */}
              <div className="flex-1 relative">
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1); // Resetear paginación al buscar
                  }}
                  className="border-input-border focus:ring-primary pr-10"
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
              
              {/* Solo activos */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="activo-only"
                  checked={activoOnly}
                  onCheckedChange={handleActivoOnlyChange}
                />
                <Label htmlFor="activo-only">Solo Activos</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tipos</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Home className="w-8 h-8 text-muted-foreground opacity-70 " />
            </div>
          </CardContent>
        </Card>
        
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalPages}</p>
              </div>
              <Home className="w-8 h-8 text-secondary opacity-70 " />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de tipos de vivienda con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Home className="w-5 h-5" />
            Listado de Tipos de Vivienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando tipos de vivienda...</span>
            </div>
          ) : tiposVivienda.length === 0 ? (
            <div className="text-center py-8">
              <Home className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 " />
              <p className="text-muted-foreground">No se encontraron tipos de vivienda</p>
              {(searchTerm || activoOnly) && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda o filtros
                </p>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="font-semibold">Fecha Creación</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiposVivienda.map((tipo, index) => (
                    <TableRow 
                      key={tipo.id_tipo_vivienda}
                      className="hover:bg-muted/50 "
                      
                    >
                      <TableCell className="font-medium text-foreground">
                        {tipo.id_tipo_vivienda}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground " />
                          <span className="font-medium">{tipo.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                       
                          {tipo.descripcion || 'N/A'}
                       
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="">
                          {formatDate(tipo.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(tipo)}
                            className="hover:bg-primary/10 hover:text-muted-foreground hover:shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(tipo)}
                            className="hover:bg-destructive/10 hover:text-destructive"
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
                itemsPerPage={10}
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

      {/* Modal de Crear Tipo de Vivienda */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Tipo de Vivienda"
        description="Crea un nuevo tipo de vivienda para las encuestas"
        icon={Home}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Tipo"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre del Tipo"
          placeholder="Ej: Casa"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Breve descripción del tipo de vivienda"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Tipo de Vivienda */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Tipo de Vivienda"
        description="Modifica los datos del tipo de vivienda"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Tipo"
          placeholder="Ej: Casa"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Breve descripción del tipo de vivienda"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-activo"
            checked={formData.activo}
            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
          />
          <Label htmlFor="edit-activo">Activo</Label>
        </div>
      </ConfigModal>

      {/* Modal de Eliminar Tipo de Vivienda */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el tipo de vivienda"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedTipoVivienda?.nombre}
        submitText="Eliminar Tipo"
      />
    </div>
  );
};

export default TiposViviendaPage;