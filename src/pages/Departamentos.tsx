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
import { useDepartamentos } from '@/hooks/useDepartamentos';
import { Departamento, DepartamentoFormData } from '@/types/departamentos';
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
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const DepartamentosPage = () => {
  const departamentosHook = useDepartamentos();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_departamento');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: departamentosResponse, isLoading: departamentosLoading, refetch: refetchDepartamentos } = departamentosHook.useDepartamentosQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = departamentosHook.useSearchDepartamentosQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = departamentosHook.useCreateDepartamentoMutation();
  const updateMutation = departamentosHook.useUpdateDepartamentoMutation();
  const deleteMutation = departamentosHook.useDeleteDepartamentoMutation();

  const departamentos = searchTerm 
    ? (searchResponse?.data?.departamentos || []) 
    : (departamentosResponse?.data?.departamentos || []);
  const pagination = searchTerm 
    ? (searchResponse?.data?.pagination || { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false }) 
    : (departamentosResponse?.data?.pagination || { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false });

  const loading = departamentosLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [formData, setFormData] = useState<DepartamentoFormData>({
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
    if (!selectedDepartamento || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedDepartamento.id_departamento,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
        activo: formData.activo,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedDepartamento(null);
        setFormData({ nombre: '', descripcion: '', activo: true });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedDepartamento) return;

    deleteMutation.mutate(selectedDepartamento.id_departamento, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedDepartamento(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', activo: true });
    openCreateDialog();
  };

  const handleOpenEditDialog = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setFormData({
      nombre: departamento.nombre,
      descripcion: departamento.descripcion || '',
      activo: departamento.activo,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
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
            <MapPin className="w-8 h-8 text-muted-foreground" />
            Gestión de Departamentos
          </h1>
          <p className="text-muted-foreground mt-2">Administra los departamentos para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchDepartamentos()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Departamento
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
                <p className="text-sm text-muted-foreground">Total Departamentos</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <MapPin className="w-8 h-8 text-muted-foreground" />
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
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de departamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5" />
            Listado de Departamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando departamentos...</span>
            </div>
          ) : departamentos.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron departamentos</p>
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
                  {departamentos.map((departamento) => (
                    <TableRow key={departamento.id_departamento}>
                      <TableCell className="font-medium">{departamento.id_departamento}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium">{departamento.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {departamento.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {departamento.activo ? (
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
                          {formatDate(departamento.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(departamento)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(departamento)}
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
                    Mostrando {departamentos.length} de {pagination.totalCount} departamentos
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

      {/* Modal de Crear Departamento */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Departamento"
        description="Crea un nuevo departamento en el sistema"
        icon={MapPin}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Departamento"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre del Departamento"
          placeholder="Ej: Cundinamarca"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional del departamento"
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

      {/* Modal de Editar Departamento */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Departamento"
        description="Modifica los datos del departamento"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Departamento"
          placeholder="Ej: Cundinamarca"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional del departamento"
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

      {/* Modal de Eliminar Departamento */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el departamento"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedDepartamento?.nombre}
        submitText="Eliminar Departamento"
      />
    </div>
  );
};

export default DepartamentosPage;
