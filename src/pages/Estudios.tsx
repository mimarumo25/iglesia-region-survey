import { useState } from 'react';
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
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const EstudiosPage = () => {
  const estudiosHook = useEstudios();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: estudiosResponse, isLoading: estudiosLoading, refetch: refetchEstudios } = estudiosHook.useEstudiosQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = estudiosHook.useSearchEstudiosQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = estudiosHook.useCreateEstudioMutation();
  const updateMutation = estudiosHook.useUpdateEstudioMutation();
  const deleteMutation = estudiosHook.useDeleteEstudioMutation();

  const estudios = searchTerm 
    ? (searchResponse?.estudios || []) 
    : (estudiosResponse?.estudios || []);
  const totalCount = searchTerm 
    ? (searchResponse?.total || 0) 
    : (estudiosResponse?.total || 0);

  const loading = estudiosLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  // Manejo de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
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
            onClick={() => refetchEstudios()}
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
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
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
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Estudios</p>
                <p className="text-2xl font-bold text-foreground">{totalCount}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estudios Mostrados</p>
                <p className="text-2xl font-bold text-foreground">{estudios.length}</p>
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
            Listado de Estudios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando estudios...</span>
            </div>
          ) : estudios.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron estudios</p>
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
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudios.map((estudio) => (
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
                        {estudio.activo ? (
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

              {/* Información simple sin paginación ya que la API no la proporciona */}
              <div className="flex items-center justify-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Mostrando {estudios.length} de {totalCount} estudios
                </p>
              </div>
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
        <ConfigFormField
          id="ordenNivel"
          label="Orden del Nivel"
          placeholder="1"
          value={formData.ordenNivel?.toString() || '1'}
          onChange={(value) => setFormData({ ...formData, ordenNivel: parseInt(value) || 1 })}
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
