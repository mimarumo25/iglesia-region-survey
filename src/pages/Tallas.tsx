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
import { Talla, TallaFormData, TallasApiResponse } from '@/types/tallas';
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

// Opciones para el tipo de prenda (actualizadas según la API)
const TIPOS_PRENDA = [
  { value: 'camisa', label: 'Camisa' },
  { value: 'blusa', label: 'Blusa' },
  { value: 'pantalon', label: 'Pantalón' },
  { value: 'falda', label: 'Falda' },
  { value: 'zapato', label: 'Zapato/Calzado' },
  { value: 'vestido', label: 'Vestido' },
];

// Opciones para el género (actualizadas según la API)
const GENEROS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'unisex', label: 'Unisex' },
];

const TallasPage = () => {
  const tallasHook = useTallas();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('talla');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: tallasResponse, isLoading: tallasLoading, refetch: refetchTallas } = tallasHook.useTallasQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = tallasHook.useSearchTallasQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = tallasHook.useCreateTallaMutation();
  const updateMutation = tallasHook.useUpdateTallaMutation();
  const deleteMutation = tallasHook.useDeleteTallaMutation();

  // Extraer los datos correctamente de la respuesta anidada de la API
  const currentResponse = searchTerm ? searchResponse : tallasResponse;
  const tallas = Array.isArray(currentResponse?.data?.data) 
    ? currentResponse.data.data 
    : [];
    
  // Adaptar la respuesta de la API al formato esperado por el frontend
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil((currentResponse?.data?.total || 0) / limit),
    totalCount: currentResponse?.data?.total || 0,
    hasNext: page < Math.ceil((currentResponse?.data?.total || 0) / limit),
    hasPrev: page > 1,
  };

  const loading = tallasLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
    tipo_prenda: '',
    talla: '',
    genero: '',
    descripcion: '',
    equivalencia_numerica: '',
    activo: true,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.talla.trim() || !formData.tipo_prenda.trim()) return;

    createMutation.mutate({
      tipo_prenda: formData.tipo_prenda.trim(),
      talla: formData.talla.trim(),
      genero: formData.genero?.trim() || undefined,
      descripcion: formData.descripcion?.trim() || null,
      equivalencia_numerica: formData.equivalencia_numerica?.trim() || undefined,
      activo: formData.activo,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ 
          tipo_prenda: '', 
          talla: '', 
          genero: '', 
          descripcion: '', 
          equivalencia_numerica: '', 
          activo: true 
        });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTalla || !formData.talla.trim() || !formData.tipo_prenda.trim()) return;

    updateMutation.mutate({
      id: selectedTalla.id_talla,
      data: {
        tipo_prenda: formData.tipo_prenda.trim(),
        talla: formData.talla.trim(),
        genero: formData.genero?.trim() || undefined,
        descripcion: formData.descripcion?.trim() || null,
        equivalencia_numerica: formData.equivalencia_numerica?.trim() || undefined,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedTalla(null);
        setFormData({ 
          tipo_prenda: '', 
          talla: '', 
          genero: '', 
          descripcion: '', 
          equivalencia_numerica: '', 
          activo: true 
        });
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
    setFormData({ 
      tipo_prenda: '', 
      talla: '', 
      genero: '', 
      descripcion: '', 
      equivalencia_numerica: '', 
      activo: true 
    });
    openCreateDialog();
  };

  const handleOpenEditDialog = (talla: Talla) => {
    setSelectedTalla(talla);
    setFormData({
      tipo_prenda: talla.tipo_prenda,
      talla: talla.talla,
      genero: talla.genero || '',
      descripcion: talla.descripcion || '',
      equivalencia_numerica: talla.equivalencia_numerica || '',
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
    // searchTerm ya está actualizado por el onChange del Input
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Obtener icono según el tipo de prenda
  const getTipoIcon = (tipo_prenda?: string) => {
    switch (tipo_prenda?.toLowerCase()) {
      case 'camisa':
      case 'blusa':
        return <Shirt className="w-4 h-4" />;
      case 'pantalon':
        return <div className="w-4 h-4 border-2 border-current rounded-sm" />;
      case 'falda':
        return <div className="w-4 h-4 border-2 border-current rounded-b-full" />;
      case 'zapato':
      case 'calzado':
        return <div className="w-4 h-4 border-2 border-current rounded-full" />;
      case 'vestido':
        return <div className="w-4 h-4 border-2 border-current rounded-t-sm rounded-b-full" />;
      default:
        return <Shirt className="w-4 h-4 opacity-50" />;
    }
  };

  // Obtener label del tipo
  const getTipoLabel = (tipo_prenda?: string) => {
    const tipoObj = TIPOS_PRENDA.find(t => t.value.toLowerCase() === tipo_prenda?.toLowerCase());
    return tipoObj?.label || tipo_prenda || 'No especificado';
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
                  placeholder="Buscar por talla, descripción o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-input-border focus:ring-primary"
                />
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
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
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
                  {Array.isArray(tallas) ? tallas.filter(t => t.activo).length : 0}
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
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
              <div className="mt-4 text-xs text-muted-foreground/70 bg-muted p-2 rounded">
                <p>Debug Info:</p>
                <p>Response: {currentResponse ? 'Sí' : 'No'}</p>
                <p>Data array: {Array.isArray(currentResponse?.data?.data) ? 'Sí' : 'No'}</p>
                <p>Array length: {currentResponse?.data?.data?.length || 0}</p>
                <p>Total: {currentResponse?.data?.total || 0}</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Talla</TableHead>
                    <TableHead className="font-semibold">Tipo Prenda</TableHead>
                    <TableHead className="font-semibold">Género</TableHead>
                    <TableHead className="font-semibold">Equivalencia</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
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
                          <span className="font-medium">{talla.talla}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoIcon(talla.tipo_prenda)}
                          <Badge variant="outline" className="text-xs">
                            {getTipoLabel(talla.tipo_prenda)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {talla.genero && (
                          <Badge variant="secondary" className="text-xs">
                            {talla.genero.charAt(0).toUpperCase() + talla.genero.slice(1)}
                          </Badge>
                        ) || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {talla.equivalencia_numerica && (
                          <Badge variant="outline" className="text-xs">
                            {talla.equivalencia_numerica}
                          </Badge>
                        ) || 'N/A'}
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
          id="talla"
          label="Talla"
          placeholder="Ej: S, M, L, XL, 36, 38, etc."
          value={formData.talla}
          onChange={(value) => setFormData({ ...formData, talla: value })}
          required
        />
        <div className="space-y-2">
          <Label htmlFor="tipo_prenda">Tipo de Prenda</Label>
          <Select
            value={formData.tipo_prenda}
            onValueChange={(value) => setFormData({ ...formData, tipo_prenda: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de prenda..." />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_PRENDA.map((tipo) => (
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
        <div className="space-y-2">
          <Label htmlFor="genero">Género</Label>
          <Select
            value={formData.genero}
            onValueChange={(value) => setFormData({ ...formData, genero: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar género..." />
            </SelectTrigger>
            <SelectContent>
              {GENEROS.map((genero) => (
                <SelectItem key={genero.value} value={genero.value}>
                  {genero.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ConfigFormField
          id="equivalencia_numerica"
          label="Equivalencia Numérica"
          placeholder="Ej: 34-36, 90-95, etc."
          value={formData.equivalencia_numerica}
          onChange={(value) => setFormData({ ...formData, equivalencia_numerica: value })}
        />
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
          id="edit-talla"
          label="Talla"
          placeholder="Ej: S, M, L, XL, 36, 38, etc."
          value={formData.talla}
          onChange={(value) => setFormData({ ...formData, talla: value })}
          required
        />
        <div className="space-y-2">
          <Label htmlFor="edit-tipo_prenda">Tipo de Prenda</Label>
          <Select
            value={formData.tipo_prenda}
            onValueChange={(value) => setFormData({ ...formData, tipo_prenda: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de prenda..." />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_PRENDA.map((tipo) => (
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
        <div className="space-y-2">
          <Label htmlFor="edit-genero">Género</Label>
          <Select
            value={formData.genero}
            onValueChange={(value) => setFormData({ ...formData, genero: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar género..." />
            </SelectTrigger>
            <SelectContent>
              {GENEROS.map((genero) => (
                <SelectItem key={genero.value} value={genero.value}>
                  {genero.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ConfigFormField
          id="edit-equivalencia_numerica"
          label="Equivalencia Numérica"
          placeholder="Ej: 34-36, 90-95, etc."
          value={formData.equivalencia_numerica}
          onChange={(value) => setFormData({ ...formData, equivalencia_numerica: value })}
        />
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
        entityName={selectedTalla?.talla}
        submitText="Eliminar Talla"
      />
    </div>
  );
};

export default TallasPage;
