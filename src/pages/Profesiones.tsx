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
import { useProfesiones } from '@/hooks/useProfesiones';
import { Profesion, ProfesionFormData } from '@/types/profesiones';
import {
  Briefcase,
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

const ProfesionesPage = () => {
  const profesionesHook = useProfesiones();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_profesion');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: profesionesResponse, isLoading: profesionesLoading, refetch: refetchProfesiones } = profesionesHook.useProfesionesQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = profesionesHook.useSearchProfesionesQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = profesionesHook.useCreateProfesionMutation();
  const updateMutation = profesionesHook.useUpdateProfesionMutation();
  const deleteMutation = profesionesHook.useDeleteProfesionMutation();

  const profesiones = searchTerm 
    ? (searchResponse?.data?.profesiones || []) 
    : (profesionesResponse?.data?.profesiones || []);
    
  // Adaptar la respuesta de la API al formato esperado por el frontend
  const pagination = searchTerm 
    ? {
        currentPage: page,
        totalPages: Math.ceil((searchResponse?.data?.total || 0) / limit),
        totalCount: searchResponse?.data?.total || 0,
        hasNext: page < Math.ceil((searchResponse?.data?.total || 0) / limit),
        hasPrev: page > 1,
      }
    : {
        currentPage: page,
        totalPages: Math.ceil((profesionesResponse?.data?.total || 0) / limit),
        totalCount: profesionesResponse?.data?.total || 0,
        hasNext: page < Math.ceil((profesionesResponse?.data?.total || 0) / limit),
        hasPrev: page > 1,
      };

  const loading = profesionesLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedProfesion, setSelectedProfesion] = useState<Profesion | null>(null);
  const [formData, setFormData] = useState<ProfesionFormData>({
    nombre: '',
    descripcion: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || undefined,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfesion || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedProfesion.id_profesion,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedProfesion(null);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedProfesion) return;

    deleteMutation.mutate(selectedProfesion.id_profesion, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedProfesion(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (profesion: Profesion) => {
    setSelectedProfesion(profesion);
    setFormData({
      nombre: profesion.nombre,
      descripcion: profesion.descripcion || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (profesion: Profesion) => {
    setSelectedProfesion(profesion);
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
            <Briefcase className="w-8 h-8 text-muted-foreground" />
            Gestión de Profesiones
          </h1>
          <p className="text-muted-foreground mt-2">Administra las profesiones para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchProfesiones()}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Profesión
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
                <p className="text-sm text-muted-foreground">Total Profesiones</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Briefcase className="w-8 h-8 text-muted-foreground" />
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
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de profesiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Briefcase className="w-5 h-5" />
            Listado de Profesiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando profesiones...</span>
            </div>
          ) : profesiones.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron profesiones</p>
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
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profesiones.map((profesion) => (
                    <TableRow key={profesion.id_profesion}>
                      <TableCell className="font-medium">{profesion.id_profesion}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span className="font-medium">{profesion.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {profesion.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(profesion.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(profesion)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(profesion)}
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
                    Mostrando {profesiones.length} de {pagination.totalCount} profesiones
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
                    <span className="flex items-center px-3 text-sm font-medium text-primary bg-primary/10 rounded-md">
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

      {/* Modal de Crear Profesión */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Profesión"
        description="Crea una nueva profesión en el sistema"
        icon={Briefcase}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Profesión"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Profesión"
          placeholder="Ej: Médico"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la profesión"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Profesión */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Profesión"
        description="Modifica los datos de la profesión"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Profesión"
          placeholder="Ej: Médico"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la profesión"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Profesión */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la profesión"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedProfesion?.nombre}
        submitText="Eliminar Profesión"
      />
    </div>
  );
};

export default ProfesionesPage;
