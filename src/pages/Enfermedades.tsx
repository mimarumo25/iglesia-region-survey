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
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useEnfermedades } from '@/hooks/useEnfermedades';
import { Enfermedad, EnfermedadFormData, EnfermedadesResponse } from '@/types/enfermedades';
import {
  HeartPulse,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

const EnfermedadesPage = () => {
  const enfermedadesHook = useEnfermedades();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_enfermedad');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: enfermedadesResponse, isLoading: enfermedadesLoading, refetch: refetchEnfermedades } = enfermedadesHook.useEnfermedadesQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = enfermedadesHook.useSearchEnfermedadesQuery(searchTerm, page, limit);

  // Mutaciones de React Query
  const createMutation = enfermedadesHook.useCreateEnfermedadMutation();
  const updateMutation = enfermedadesHook.useUpdateEnfermedadMutation();
  const deleteMutation = enfermedadesHook.useDeleteEnfermedadMutation();

  let enfermedades: Enfermedad[] = [];
  let pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  // Determinar qué datos y paginación usar
  if (searchTerm) {
    enfermedades = (searchResponse as EnfermedadesResponse)?.data || [];
    pagination = {
      page: (searchResponse as EnfermedadesResponse)?.page || 1,
      limit: (searchResponse as EnfermedadesResponse)?.limit || limit,
      total: (searchResponse as EnfermedadesResponse)?.total || 0,
      totalPages: (searchResponse as EnfermedadesResponse)?.totalPages || 1,
    };
  } else {
    enfermedades = (enfermedadesResponse as EnfermedadesResponse)?.data || [];
    pagination = {
      page: (enfermedadesResponse as EnfermedadesResponse)?.page || 1,
      limit: (enfermedadesResponse as EnfermedadesResponse)?.limit || limit,
      total: (enfermedadesResponse as EnfermedadesResponse)?.total || 0,
      totalPages: (enfermedadesResponse as EnfermedadesResponse)?.totalPages || 1,
    };
  }

  const loading = enfermedadesLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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

  const [selectedEnfermedad, setSelectedEnfermedad] = useState<Enfermedad | null>(null);
  const [formData, setFormData] = useState<EnfermedadFormData>({
    nombre: '',
    descripcion: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || null,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnfermedad || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedEnfermedad.id_enfermedad,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedEnfermedad(null);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedEnfermedad) return;

    deleteMutation.mutate(selectedEnfermedad.id_enfermedad, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedEnfermedad(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (enfermedad: Enfermedad) => {
    setSelectedEnfermedad(enfermedad);
    setFormData({
      nombre: enfermedad.nombre,
      descripcion: enfermedad.descripcion || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (enfermedad: Enfermedad) => {
    setSelectedEnfermedad(enfermedad);
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

  return (
    <div className="container mx-auto p-6 max-w-7xl ">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-muted-foreground " />
            Gestión de Enfermedades
          </h1>
          <p className="text-muted-foreground mt-2">Administra las enfermedades para encuestas</p>
        </div>
        <div className="flex gap-2 ">
          <Button
            variant="outline"
            onClick={() => refetchEnfermedades()}
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
            Nueva Enfermedad
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6  ">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda por texto */}
              <div className="flex-1">
                <Input
                  placeholder="Buscar enfermedades por nombre o descripción..."
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
                  className=""
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
                      setPage(1); // Resetear paginación
                    }}
                    className=""
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Enfermedades</p>
                <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
              </div>
              <HeartPulse className="w-8 h-8 text-muted-foreground opacity-70 " />
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
              <HeartPulse className="w-8 h-8 text-secondary opacity-70 " />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de enfermedades con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <HeartPulse className="w-5 h-5" />
            Listado de Enfermedades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando enfermedades...</span>
            </div>
          ) : enfermedades.length === 0 ? (
            <div className="text-center py-8">
              <HeartPulse className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 " />
              <p className="text-muted-foreground">No se encontraron enfermedades</p>
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
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="font-semibold">Fecha Creación</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enfermedades.map((enfermedad, index) => (
                    <TableRow
                      key={enfermedad.id_enfermedad}
                      className="hover:bg-muted/50 "

                    >
                      <TableCell className="font-medium text-foreground">
                        {enfermedad.id_enfermedad}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <HeartPulse className="w-4 h-4 text-muted-foreground " />
                          <span className="font-medium">{enfermedad.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {enfermedad.descripcion || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(enfermedad.createdAt)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(enfermedad)}
                            className="hover:bg-primary/10 hover:text-muted-foreground hover:shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(enfermedad)}
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

              {/* Paginación con diseño mejorado */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {enfermedades.length} de {pagination.total} enfermedades
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className=""
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm font-medium text-muted-foreground bg-primary/10 rounded-md">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className=""
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

      {/* Modal de Crear Enfermedad */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Enfermedad"
        description="Crea una nueva enfermedad para las encuestas"
        icon={HeartPulse}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Enfermedad"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Enfermedad"
          placeholder="Ej: Diabetes"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Breve descripción de la enfermedad"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Enfermedad */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Enfermedad"
        description="Modifica los datos de la enfermedad"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Enfermedad"
          placeholder="Ej: Diabetes"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Breve descripción de la enfermedad"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Enfermedad */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la enfermedad"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedEnfermedad?.nombre}
        submitText="Eliminar Enfermedad"
      />
    </div>
  );
};

export default EnfermedadesPage;