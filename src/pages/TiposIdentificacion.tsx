import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { useTiposIdentificacion } from '@/hooks/useTiposIdentificacion';
import { TipoIdentificacion } from '@/services/tipos-identificacion';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';

interface TipoIdentificacionFormData {
  nombre: string;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

const TiposIdentificacionPage = () => {
  const tiposIdentificacionHook = useTiposIdentificacion();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Query unificada
  const { data: tiposIdentificacionResponse, isLoading: tiposIdentificacionLoading, refetch: refetchTiposIdentificacion } = 
    searchTerm 
      ? tiposIdentificacionHook.useSearchTiposIdentificacionQuery(searchTerm, page, limit)
      : tiposIdentificacionHook.useTiposIdentificacionQuery(page, limit);

  // Mutaciones de React Query
  const createMutation = tiposIdentificacionHook.useCreateTipoIdentificacionMutation();
  const updateMutation = tiposIdentificacionHook.useUpdateTipoIdentificacionMutation();
  const deleteMutation = tiposIdentificacionHook.useDeleteTipoIdentificacionMutation();

  // Datos y paginación simplificados - estructura real de la API
  const tiposIdentificacion = (tiposIdentificacionResponse as any)?.data?.data?.tiposIdentificacion || 
                              (tiposIdentificacionResponse as any)?.data?.tiposIdentificacion || 
                              [];
  const total = (tiposIdentificacionResponse as any)?.data?.data?.total || 
                (tiposIdentificacionResponse as any)?.data?.pagination?.totalCount || 
                tiposIdentificacion.length;
  
  const pagination = {
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    hasNext: (page * limit) < total,
    hasPrev: page > 1,
    itemsPerPage: limit
  };

  const loading = tiposIdentificacionLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedTipoIdentificacion, setSelectedTipoIdentificacion] = useState<TipoIdentificacion | null>(null);
  const [formData, setFormData] = useState<TipoIdentificacionFormData>({
    nombre: '',
    codigo: '',
    descripcion: '',
    activo: true,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.codigo.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      codigo: formData.codigo.trim().toUpperCase(),
      descripcion: formData.descripcion?.trim() || undefined,
      activo: formData.activo,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', codigo: '', descripcion: '', activo: true });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTipoIdentificacion || !formData.nombre.trim() || !formData.codigo.trim()) return;

    updateMutation.mutate({
      id: selectedTipoIdentificacion.id_tipo_identificacion,
      data: {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo.trim().toUpperCase(),
        descripcion: formData.descripcion?.trim() || undefined,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedTipoIdentificacion(null);
        setFormData({ nombre: '', codigo: '', descripcion: '', activo: true });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedTipoIdentificacion) return;

    deleteMutation.mutate(selectedTipoIdentificacion.id_tipo_identificacion, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedTipoIdentificacion(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', codigo: '', descripcion: '', activo: true });
    openCreateDialog();
  };

  const handleOpenEditDialog = (tipoIdentificacion: TipoIdentificacion) => {
    setSelectedTipoIdentificacion(tipoIdentificacion);
    setFormData({
      nombre: tipoIdentificacion.nombre,
      codigo: tipoIdentificacion.codigo,
      descripcion: tipoIdentificacion.descripcion || '',
      activo: tipoIdentificacion.activo,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (tipoIdentificacion: TipoIdentificacion) => {
    setSelectedTipoIdentificacion(tipoIdentificacion);
    openDeleteDialog();
  };

  // Manejo de búsqueda en tiempo real
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
            Tipos de Identificación
          </h1>
          <p className="text-muted-foreground mt-2">Gestión de tipos de documentos de identificación</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchTiposIdentificacion()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tipo
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 relative">
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="border-input-border focus:ring-primary transition-smooth pr-8"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
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
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Tipos Filtrados' : 'Total Tipos de Identificación'}
                </p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalItems}</p>
              </div>
              <CreditCard className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de datos */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Lista de Tipos de Identificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              <span className="ml-2 text-muted-foreground">Cargando tipos de identificación...</span>
            </div>
          ) : !Array.isArray(tiposIdentificacion) || tiposIdentificacion.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron tipos de identificación</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-semibold">Código</TableHead>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="font-semibold">Fecha Creación</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(tiposIdentificacion) && tiposIdentificacion.map((tipoIdentificacion) => (
                    <TableRow 
                      key={tipoIdentificacion.id_tipo_identificacion}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>
                        <Badge variant="outline" className="font-mono font-semibold">
                          {tipoIdentificacion.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{tipoIdentificacion.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tipoIdentificacion.descripcion || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(tipoIdentificacion.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(tipoIdentificacion)}
                            className="hover:bg-primary/10 hover:text-muted-foreground hover:shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(tipoIdentificacion)}
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

              {/* Paginación */}
              <ConfigPagination
                variant="complete"
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                showInfo={true}
                showItemsPerPageSelector={true}
                itemsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Crear */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Tipo de Identificación"
        description="Crea un nuevo tipo de documento de identificación"
        icon={CreditCard}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Tipo"
      >
        <ConfigFormField
          id="codigo"
          label="Código"
          placeholder="Ej: CC, TI, CE"
          value={formData.codigo}
          onChange={(value) => setFormData({ ...formData, codigo: value.toUpperCase() })}
          required
        />
        <ConfigFormField
          id="nombre"
          label="Nombre del Tipo"
          placeholder="Ej: Cédula de Ciudadanía"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <div className="space-y-3">
          <Label className="text-foreground font-medium">Estado</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
            />
            <Label className="text-sm">
              {formData.activo ? 'Activo' : 'Inactivo'}
            </Label>
          </div>
        </div>
      </ConfigModal>

      {/* Modal de Editar */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Tipo de Identificación"
        description="Modifica los datos del tipo de identificación"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-codigo"
          label="Código"
          placeholder="Ej: CC, TI, CE"
          value={formData.codigo}
          onChange={(value) => setFormData({ ...formData, codigo: value.toUpperCase() })}
          required
        />
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Tipo"
          placeholder="Ej: Cédula de Ciudadanía"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <div className="space-y-3">
          <Label className="text-foreground font-medium">Estado</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.activo}
              onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
            />
            <Label className="text-sm">
              {formData.activo ? 'Activo' : 'Inactivo'}
            </Label>
          </div>
        </div>
      </ConfigModal>

      {/* Modal de Eliminar */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el tipo de identificación"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedTipoIdentificacion?.nombre}
        submitText="Eliminar Tipo"
      />
    </div>
  );
};

export default TiposIdentificacionPage;
