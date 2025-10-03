import { useState } from 'react';
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
import { useSituacionesCiviles } from '@/hooks/useSituacionesCiviles';
import { SituacionCivil, SituacionCivilFormData } from '@/types/situaciones-civiles';
import {
  Scale,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const SituacionesCivilesPage = () => {
  const situacionesCivilesHook = useSituacionesCiviles();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: situacionesResponse, isLoading: situacionesLoading, refetch: refetchSituaciones } = situacionesCivilesHook.useSituacionesCivilesQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = situacionesCivilesHook.useSearchSituacionesCivilesQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = situacionesCivilesHook.useCreateSituacionCivilMutation();
  const updateMutation = situacionesCivilesHook.useUpdateSituacionCivilMutation();
  const deleteMutation = situacionesCivilesHook.useDeleteSituacionCivilMutation();

  const situaciones = searchTerm 
    ? (searchResponse?.data?.situaciones_civiles || []) 
    : (situacionesResponse?.data?.situaciones_civiles || []);
  const pagination = searchTerm 
    ? (searchResponse?.data?.pagination || { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false }) 
    : (situacionesResponse?.data?.pagination || { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false });

  const loading = situacionesLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedSituacion, setSelectedSituacion] = useState<SituacionCivil | null>(null);
  const [formData, setFormData] = useState<SituacionCivilFormData>({
    nombre: '',
    descripcion: '',
    codigo: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || undefined,
      codigo: formData.codigo?.trim() || undefined,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '', codigo: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSituacion || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedSituacion.id,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
        codigo: formData.codigo?.trim() || undefined,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedSituacion(null);
        setFormData({ nombre: '', descripcion: '', codigo: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedSituacion) return;

    deleteMutation.mutate(selectedSituacion.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedSituacion(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', codigo: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (situacion: SituacionCivil) => {
    setSelectedSituacion(situacion);
    setFormData({
      nombre: situacion.nombre,
      descripcion: situacion.descripcion || '',
      codigo: situacion.codigo || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (situacion: SituacionCivil) => {
    setSelectedSituacion(situacion);
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Scale className="w-8 h-8 text-muted-foreground" />
            Gestión de Situaciones Civiles
          </h1>
          <p className="text-muted-foreground mt-2">Administra las situaciones civiles para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchSituaciones()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Situación Civil
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
                <p className="text-sm text-muted-foreground">Total Situaciones</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Scale className="w-8 h-8 text-muted-foreground" />
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
              <Scale className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de situaciones civiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Scale className="w-5 h-5" />
            Listado de Situaciones Civiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando situaciones civiles...</span>
            </div>
          ) : situaciones.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron situaciones civiles</p>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {situaciones.map((situacion) => (
                    <TableRow key={situacion.id_situacion_civil}>
                      <TableCell className="font-medium">{situacion.id_situacion_civil}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-primary" />
                          <span className="font-medium">{situacion.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {situacion.codigo || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {situacion.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(situacion.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(situacion)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(situacion)}
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
                itemsPerPage={situaciones.length > 0 ? Math.ceil(pagination.totalCount / pagination.totalPages) : 10}
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

      {/* Modal de Crear Situación Civil */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Situación Civil"
        description="Crea una nueva situación civil en el sistema"
        icon={Scale}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Situación Civil"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Situación Civil"
          placeholder="Ej: Desplazado"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la situación civil"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <ConfigFormField
          id="codigo"
          label="Código"
          placeholder="Ej: SL, CS, DP"
          value={formData.codigo}
          onChange={(value) => setFormData({ ...formData, codigo: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Situación Civil */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Situación Civil"
        description="Modifica los datos de la situación civil"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Situación Civil"
          placeholder="Ej: Desplazado"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la situación civil"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
        <ConfigFormField
          id="edit-codigo"
          label="Código"
          placeholder="Ej: SL, CS, DP"
          value={formData.codigo}
          onChange={(value) => setFormData({ ...formData, codigo: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Situación Civil */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la situación civil"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedSituacion?.nombre}
        submitText="Eliminar Situación Civil"
      />
    </div>
  );
};

export default SituacionesCivilesPage;
