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
import { useEstudios } from '@/hooks/useEstudios';
import { Estudio, EstudioFormData } from '@/types/estudios';
import {
  GraduationCap,
  Plus,
  X,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { ConfigPagination } from '@/components/ui/config-pagination';

const EstudiosPage = () => {
  const estudiosHook = useEstudios();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Query unificada que reemplaza las dos queries separadas
  const { data: estudiosResponse, isLoading, refetch, error } = estudiosHook.useEstudiosQuery(searchTerm);

  // 🔍 Procesamiento de datos del lado del cliente
  const { filteredData, paginatedData, stats } = useMemo(() => {
    const allEstudios = estudiosResponse?.estudios || [];
    
    // Filtrar por término de búsqueda del lado del cliente
    const filtered = estudiosHook.filterBySearch(allEstudios, searchTerm);
    
    // Paginación del lado del cliente
    const paginated = estudiosHook.paginateClientSide(filtered, page, limit);
    
    return {
      filteredData: filtered,
      paginatedData: paginated,
      stats: {
        total: filtered.length,
        pages: paginated.totalPages,
      }
    };
  }, [estudiosResponse, searchTerm, page, limit, estudiosHook]);

  // Mutaciones de React Query
  const createMutation = estudiosHook.useCreateEstudioMutation();
  const updateMutation = estudiosHook.useUpdateEstudioMutation();
  const deleteMutation = estudiosHook.useDeleteEstudioMutation();

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
  
  const [selectedEstudio, setSelectedEstudio] = useState<Estudio | null>(null);
  const [formData, setFormData] = useState<EstudioFormData>({
    nivel: '',
    descripcion: '',
    ordenNivel: 1,
    activo: true,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nivel.trim()) return;

    createMutation.mutate({
      nivel: formData.nivel.trim(),
      descripcion: formData.descripcion?.trim() || undefined,
      ordenNivel: formData.ordenNivel || 1,
      activo: formData.activo,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nivel: '', descripcion: '', ordenNivel: 1, activo: true });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudio || !formData.nivel.trim()) return;

    updateMutation.mutate({
      id: selectedEstudio.id,
      data: {
        nivel: formData.nivel.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
        ordenNivel: formData.ordenNivel || 1,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedEstudio(null);
        setFormData({ nivel: '', descripcion: '', ordenNivel: 1, activo: true });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedEstudio) return;

    deleteMutation.mutate(selectedEstudio.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedEstudio(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nivel: '', descripcion: '', ordenNivel: 1, activo: true });
    openCreateDialog();
  };

  const handleOpenEditDialog = (estudio: Estudio) => {
    setSelectedEstudio(estudio);
    setFormData({
      nivel: estudio.nivel,
      descripcion: estudio.descripcion || '',
      ordenNivel: estudio.ordenNivel || 1,
      activo: estudio.activo,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (estudio: Estudio) => {
    setSelectedEstudio(estudio);
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
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-muted-foreground" />
            Gestión de Estudios
          </h1>
          <p className="text-muted-foreground mt-2">Administra los niveles de estudios para encuestas</p>
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
            Nuevo Estudio
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por nivel o descripción..."
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
                <p className="text-sm text-muted-foreground">Total Estudios</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
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
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de estudios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <GraduationCap className="w-5 h-5" />
            Lista de Estudios
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              Total: {stats.total}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Error al cargar estudios</p>
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
              <span className="ml-2 text-muted-foreground">Cargando estudios...</span>
            </div>
          ) : paginatedData.paginatedItems.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No se encontraron estudios que coincidan con tu búsqueda' : 'No se encontraron estudios'}
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
                    <TableHead>Nivel</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.paginatedItems.map((estudio) => (
                    <TableRow key={estudio.id}>
                      <TableCell className="font-medium">{estudio.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span className="font-medium">{estudio.nivel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {estudio.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {estudio.ordenNivel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(estudio.createdAt)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(estudio)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(estudio)}
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
                currentPage={paginatedData.currentPage}
                totalPages={paginatedData.totalPages}
                totalItems={stats.total}
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

      {/* Modal de Crear Estudio */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Estudio"
        description="Crea un nuevo nivel de estudios en el sistema"
        icon={GraduationCap}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Estudio"
      >
        <ConfigFormField
          id="nivel"
          label="Nivel de Estudio"
          placeholder="Ej: Educación Primaria"
          value={formData.nivel}
          onChange={(value) => setFormData({ ...formData, nivel: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional del nivel de estudio"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Estudio */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Estudio"
        description="Modifica los datos del nivel de estudio"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nivel"
          label="Nivel de Estudio"
          placeholder="Ej: Educación Primaria"
          value={formData.nivel}
          onChange={(value) => setFormData({ ...formData, nivel: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional del nivel de estudio"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <ConfigFormField
          id="edit-ordenNivel"
          label="Orden del Nivel"
          placeholder="1"
          value={formData.ordenNivel?.toString() || '1'}
          onChange={(value) => setFormData({ ...formData, ordenNivel: parseInt(value) || 1 })}
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

      {/* Modal de Eliminar Estudio */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el nivel de estudio"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedEstudio?.nivel}
        submitText="Eliminar Estudio"
      />
    </div>
  );
};

export default EstudiosPage;
