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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useTallas } from '@/hooks/useTallas';
import { Talla, TallaFormData, ServerResponse, TallasResponse } from '@/types/tallas';
import {
  Shirt,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Opciones para el tipo de talla
const TIPOS_TALLA = [
  { value: 'camisa', label: 'Camisa/Blusa' },
  { value: 'pantalon', label: 'Pantalón' },
  { value: 'calzado', label: 'Calzado' },
];

const TallasPage = () => {
  const tallasHook = useTallas();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const [activoOnly, setActivoOnly] = useState(false);

  // Queries de React Query
  const { data: tallasResponse, isLoading: tallasLoading, refetch: refetchTallas } = tallasHook.useTallasQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = tallasHook.useSearchTallasQuery(searchTerm, page, limit, sortBy, sortOrder);
  const { data: activasResponse, isLoading: activasLoading } = tallasHook.useTallasActivasQuery(page, limit, sortBy, sortOrder);

  // Mutaciones de React Query
  const createMutation = tallasHook.useCreateTallaMutation();
  const updateMutation = tallasHook.useUpdateTallaMutation();
  const deleteMutation = tallasHook.useDeleteTallaMutation();

  let tallas: Talla[] = [];
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Determinar qué datos y paginación usar
  if (activoOnly && activasResponse) {
    const responseData = activasResponse as ServerResponse<TallasResponse>;
    if (responseData.status === 'success') {
      tallas = responseData?.data?.tallas || [];
      pagination = responseData?.data?.pagination || pagination;
    }
  } else if (searchTerm && searchResponse) {
    const responseData = searchResponse as ServerResponse<TallasResponse>;
    if (responseData.status === 'success') {
      tallas = responseData?.data?.tallas || [];
      pagination = responseData?.data?.pagination || pagination;
    }
  } else if (tallasResponse) {
    const responseData = tallasResponse as ServerResponse<TallasResponse>;
    if (responseData.status === 'success') {
      tallas = responseData?.data?.tallas || [];
      pagination = responseData?.data?.pagination || pagination;
    }
  }

  const loading = tallasLoading || searchLoading || activasLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedTalla, setSelectedTalla] = useState<Talla | null>(null);
  const [formData, setFormData] = useState<TallaFormData>({
    nombre: '',
    descripcion: '',
    tipo: '',
    activo: true,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || null,
      tipo: formData.tipo?.trim() || undefined,
      activo: formData.activo,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '', tipo: '', activo: true });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTalla || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedTalla.id_talla,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
        tipo: formData.tipo?.trim() || undefined,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedTalla(null);
        setFormData({ nombre: '', descripcion: '', tipo: '', activo: true });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedTalla) return;

    deleteMutation.mutate(selectedTalla.id_talla, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedTalla(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', tipo: '', activo: true });
    openCreateDialog();
  };

  const handleOpenEditDialog = (talla: Talla) => {
    setSelectedTalla(talla);
    setFormData({
      nombre: talla.nombre,
      descripcion: talla.descripcion || '',
      tipo: talla.tipo || '',
      activo: talla.activo,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (talla: Talla) => {
    setSelectedTalla(talla);
    openDeleteDialog();
  };

  // Manejo de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetear paginación al buscar
    setActivoOnly(false); // Desactivar filtro de activos
    // searchTerm ya está actualizado por el onChange del Input
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Manejo del filtro de activos
  const handleActivoOnlyChange = (checked: boolean) => {
    setActivoOnly(checked);
    setSearchTerm(''); // Limpiar búsqueda
    setPage(1); // Resetear paginación al cambiar filtro
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Obtener icono según el tipo de talla
  const getTipoIcon = (tipo?: string) => {
    switch (tipo) {
      case 'camisa':
        return <Shirt className="w-4 h-4" />;
      case 'pantalon':
        return <div className="w-4 h-4 border-2 border-current rounded-sm" />;
      case 'calzado':
        return <div className="w-4 h-4 border-2 border-current rounded-full" />;
      default:
        return <Shirt className="w-4 h-4 opacity-50" />;
    }
  };

  // Obtener label del tipo
  const getTipoLabel = (tipo?: string) => {
    const tipoObj = TIPOS_TALLA.find(t => t.value === tipo);
    return tipoObj?.label || tipo || 'No especificado';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shirt className="w-8 h-8 text-muted-foreground" />
            Gestión de Tallas
          </h1>
          <p className="text-muted-foreground mt-2">Administra las tallas para encuestas (Camisa, Pantalón, Calzado)</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchTallas()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={handleOpenCreateDialog}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Talla
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Búsqueda por texto */}
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre, descripción o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-input-border focus:ring-primary"
                />
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

              {/* Botones de acción */}
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  variant="outline"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                {(searchTerm || activoOnly) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setActivoOnly(false);
                      setPage(1);
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tallas</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Shirt className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalPages}</p>
              </div>
              <ChevronRight className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {tallas.filter(t => t.activo).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de tallas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shirt className="w-5 h-5" />
            Listado de Tallas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando tallas...</span>
            </div>
          ) : tallas.length === 0 ? (
            <div className="text-center py-8">
              <Shirt className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron tallas</p>
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
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Fecha Creación</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tallas.map((talla) => (
                    <TableRow 
                      key={talla.id_talla}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium text-foreground">
                        {talla.id_talla}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shirt className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{talla.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoIcon(talla.tipo)}
                          <Badge variant="outline" className="text-xs">
                            {getTipoLabel(talla.tipo)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {talla.descripcion || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={talla.activo ? "default" : "secondary"} 
                          className={talla.activo ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                        >
                          {talla.activo ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactivo
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(talla.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(talla)}
                            className="hover:bg-primary/10 hover:text-muted-foreground hover:shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(talla)}
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
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {tallas.length} de {pagination.totalCount} tallas
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm font-medium text-muted-foreground bg-primary/10 rounded-md">
                      Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
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

      {/* Modal de Crear Talla */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Talla"
        description="Crea una nueva talla para las encuestas"
        icon={Shirt}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Talla"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Talla"
          placeholder="Ej: S, M, L, XL, 36, 38, etc."
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Talla</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => setFormData({ ...formData, tipo: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de talla..." />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_TALLA.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  <div className="flex items-center gap-2">
                    {getTipoIcon(tipo.value)}
                    {tipo.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción adicional de la talla"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="activo"
            checked={formData.activo}
            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
          />
          <Label htmlFor="activo">Activo</Label>
        </div>
      </ConfigModal>

      {/* Modal de Editar Talla */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Talla"
        description="Modifica los datos de la talla"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Talla"
          placeholder="Ej: S, M, L, XL, 36, 38, etc."
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <div className="space-y-2">
          <Label htmlFor="edit-tipo">Tipo de Talla</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => setFormData({ ...formData, tipo: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de talla..." />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_TALLA.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  <div className="flex items-center gap-2">
                    {getTipoIcon(tipo.value)}
                    {tipo.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción adicional de la talla"
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

      {/* Modal de Eliminar Talla */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la talla"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedTalla?.nombre}
        submitText="Eliminar Talla"
      />
    </div>
  );
};

export default TallasPage;
