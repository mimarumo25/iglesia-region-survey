import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { useComunidadesCulturales } from '@/hooks/useComunidadesCulturales';
import { ComunidadCultural, ComunidadCulturalFormData } from '@/types/comunidades-culturales';
import {
  Globe,
  Plus,
  X,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const ComunidadesCulturalesPage = () => {
  const comunidadesCulturalesHook = useComunidadesCulturales();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Query unificada que reemplaza las dos queries separadas
  const { data: comunidadesResponse, isLoading, refetch, error } = comunidadesCulturalesHook.useComunidadesCulturalesQuery(searchTerm);

  // 🔍 Procesamiento de datos del lado del cliente
  const { filteredData, paginatedData, stats } = useMemo(() => {
    const allComunidades = comunidadesResponse?.data?.comunidades_culturales || [];
    
    // Filtrar por término de búsqueda del lado del cliente
    const filtered = comunidadesCulturalesHook.filterBySearch(allComunidades, searchTerm);
    
    // Paginación del lado del cliente
    const paginated = comunidadesCulturalesHook.paginateClientSide(filtered, page, limit);
    
    return {
      filteredData: filtered,
      paginatedData: paginated,
      stats: {
        total: filtered.length,
        pages: paginated.totalPages,
      }
    };
  }, [comunidadesResponse, searchTerm, page, limit, comunidadesCulturalesHook]);

  // Mutaciones de React Query
  const createMutation = comunidadesCulturalesHook.useCreateComunidadCulturalMutation();
  const updateMutation = comunidadesCulturalesHook.useUpdateComunidadCulturalMutation();
  const deleteMutation = comunidadesCulturalesHook.useDeleteComunidadCulturalMutation();

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
  
  const [selectedComunidad, setSelectedComunidad] = useState<ComunidadCultural | null>(null);
  const [formData, setFormData] = useState<ComunidadCulturalFormData>({
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
      descripcion: formData.descripcion?.trim() || undefined,
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
    if (!selectedComunidad || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedComunidad.id_comunidad_cultural,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedComunidad(null);
        setFormData({ nombre: '', descripcion: '', activo: true });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedComunidad) return;

    deleteMutation.mutate(selectedComunidad.id_comunidad_cultural, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedComunidad(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', activo: true });
    openCreateDialog();
  };

  const handleOpenEditDialog = (comunidad: ComunidadCultural) => {
    setSelectedComunidad(comunidad);
    setFormData({
      nombre: comunidad.nombre,
      descripcion: comunidad.descripcion || '',
      activo: comunidad.activo,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (comunidad: ComunidadCultural) => {
    setSelectedComunidad(comunidad);
    openDeleteDialog();
  };

  // Manejo de búsqueda en tiempo real
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Resetear a la primera página al buscar
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setPage(1);
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

  // Obtener fecha de creación considerando ambos formatos
  const getCreationDate = (comunidad: ComunidadCultural) => {
    return comunidad.createdAt || comunidad.created_at;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Globe className="w-8 h-8 text-muted-foreground" />
            Gestión de Comunidades Culturales
          </h1>
          <p className="text-muted-foreground mt-2">Administra las comunidades culturales para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Comunidad Cultural
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Comunidades</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{stats.pages}</p>
              </div>
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de comunidades culturales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Globe className="w-5 h-5" />
            Lista de Comunidades Culturales
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              Total: {stats.total}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Error al cargar comunidades culturales</p>
              <p className="text-sm text-muted-foreground mb-4">
                {(error as any)?.response?.data?.message || (error as any)?.message || 'Ha ocurrido un error inesperado'}
              </p>
              <Button 
                onClick={() => refetch()}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando comunidades culturales...</span>
            </div>
          ) : paginatedData.paginatedItems.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No se encontraron comunidades culturales que coincidan con tu búsqueda' : 'No se encontraron comunidades culturales'}
              </p>
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
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.paginatedItems.map((comunidad) => (
                    <TableRow key={comunidad.id_comunidad_cultural}>
                      <TableCell className="font-medium">{comunidad.id_comunidad_cultural}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="font-medium">{comunidad.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {comunidad.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {comunidad.activo ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(getCreationDate(comunidad))}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(comunidad)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(comunidad)}
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
              {paginatedData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {paginatedData.paginatedItems.length} de {stats.total} comunidades culturales
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(paginatedData.currentPage - 1)}
                      disabled={paginatedData.currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm font-medium text-primary bg-primary/10 rounded-md">
                      Página {paginatedData.currentPage} de {paginatedData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(paginatedData.currentPage + 1)}
                      disabled={paginatedData.currentPage === paginatedData.totalPages}
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

      {/* Modal de Crear Comunidad Cultural */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Comunidad Cultural"
        description="Crea una nueva comunidad cultural en el sistema"
        icon={Globe}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Comunidad Cultural"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Comunidad Cultural"
          placeholder="Ej: Indígena"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la comunidad cultural"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="activo"
            checked={formData.activo}
            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
          />
          <label htmlFor="activo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Activo
          </label>
        </div>
      </ConfigModal>

      {/* Modal de Editar Comunidad Cultural */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Comunidad Cultural"
        description="Modifica los datos de la comunidad cultural"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Comunidad Cultural"
          placeholder="Ej: Indígena"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la comunidad cultural"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-activo"
            checked={formData.activo}
            onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
          />
          <label htmlFor="edit-activo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Activo
          </label>
        </div>
      </ConfigModal>

      {/* Modal de Eliminar Comunidad Cultural */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la comunidad cultural"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedComunidad?.nombre}
        submitText="Eliminar Comunidad Cultural"
      />
    </div>
  );
};

export default ComunidadesCulturalesPage;
