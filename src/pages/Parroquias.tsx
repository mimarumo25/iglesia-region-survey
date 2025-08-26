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
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { AutocompleteWithLoading } from '@/components/ui/autocomplete-with-loading';
import { useParroquias } from '@/hooks/useParroquias';
import { useMunicipios } from '@/hooks/useMunicipios';
import { Parroquia, ParroquiaFormData } from '@/types/parroquias';
import { municipiosToOptions, formatDate } from '@/lib/utils';
import {
  Church,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ParroquiasPage = () => {
  const parroquiasHook = useParroquias();
  const municipiosHook = useMunicipios();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_parroquia');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: parroquiasResponse, isLoading: parroquiasLoading, refetch: refetchParroquias } = parroquiasHook.useParroquiasQuery(page, limit, sortBy, sortOrder);
  const { data: searchResponse, isLoading: searchLoading } = parroquiasHook.useSearchParroquiasQuery(searchTerm, page, limit);
  
  // Query para obtener todos los municipios para el autocomplete
  const { data: municipios, isLoading: municipiosLoading, error: municipiosError } = municipiosHook.useAllMunicipiosQuery();

  // Mutaciones de React Query
  const createMutation = parroquiasHook.useCreateParroquiaMutation();
  const updateMutation = parroquiasHook.useUpdateParroquiaMutation();
  const deleteMutation = parroquiasHook.useDeleteParroquiaMutation();

  // Preparar opciones de municipios para el autocomplete
  const municipiosOptions = municipiosToOptions((municipios as any) || [], true);

  const parroquias = searchTerm 
    ? (searchResponse?.data?.parroquias || []) 
    : (parroquiasResponse?.data?.parroquias || []);
  const pagination = searchTerm 
    ? (searchResponse?.data?.pagination || { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false }) 
    : (parroquiasResponse?.data?.pagination || { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false });

  const loading = parroquiasLoading || searchLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedParroquia, setSelectedParroquia] = useState<Parroquia | null>(null);
  const [formData, setFormData] = useState<ParroquiaFormData>({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    id_municipio: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.id_municipio) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono?.trim() || undefined,
      email: formData.email?.trim() || undefined,
      id_municipio: formData.id_municipio,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', direccion: '', telefono: '', email: '', id_municipio: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParroquia || !formData.nombre.trim() || !formData.direccion.trim() || !formData.id_municipio) return;

    updateMutation.mutate({
      id: selectedParroquia.id_parroquia,
      data: {
        nombre: formData.nombre.trim(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        id_municipio: formData.id_municipio,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedParroquia(null);
        setFormData({ nombre: '', direccion: '', telefono: '', email: '', id_municipio: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedParroquia) return;

    deleteMutation.mutate(selectedParroquia.id_parroquia, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedParroquia(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', direccion: '', telefono: '', email: '', id_municipio: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (parroquia: Parroquia) => {
    setSelectedParroquia(parroquia);
    setFormData({
      nombre: parroquia.nombre,
      direccion: parroquia.direccion,
      telefono: parroquia.telefono || '',
      email: parroquia.email || '',
      id_municipio: parroquia.id_municipio,
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (parroquia: Parroquia) => {
    setSelectedParroquia(parroquia);
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header con diseño neutro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Church className="w-8 h-8 text-muted-foreground" />
            Gestión de Parroquias
          </h1>
          <p className="text-muted-foreground mt-2">Administra las parroquias para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchParroquias()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? '' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={handleOpenCreateDialog}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Parroquia
          </Button>
        </div>
      </div>

      {/* Búsqueda con diseño neutro */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Buscar por nombre o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
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
                  setPage(1); // Resetear paginación
                }}
              >
                Limpiar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas con diseño neutro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Parroquias</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Church className="w-8 h-8 text-muted-foreground" />
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
              <Church className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de parroquias con diseño neutro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Church className="w-5 h-5" />
            Listado de Parroquias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando parroquias...</span>
            </div>
          ) : parroquias.length === 0 ? (
            <div className="text-center py-8">
              <Church className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron parroquias</p>
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
                    <TableHead className="font-semibold text-foreground">ID</TableHead>
                    <TableHead className="font-semibold text-foreground">Nombre</TableHead>
                    <TableHead className="font-semibold text-foreground">Dirección</TableHead>
                    <TableHead className="font-semibold text-foreground">Teléfono</TableHead>
                    <TableHead className="font-semibold text-foreground">Email</TableHead>
                    <TableHead className="font-semibold text-foreground">Municipio</TableHead>
                    <TableHead className="font-semibold text-foreground">Fecha Creación</TableHead>
                    <TableHead className="text-right font-semibold text-primary">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parroquias.map((parroquia, index) => (
                    <TableRow 
                      key={parroquia.id_parroquia}
                      className="hover:bg-muted/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium text-foreground">
                        {parroquia.id_parroquia}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Church className="w-4 h-4 text-primary" />
                          <span className="font-medium">{parroquia.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {parroquia.direccion}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                          {parroquia.telefono || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                          {parroquia.email || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {parroquia.municipio?.nombre_municipio || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {formatDate(parroquia.fecha_creacion)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(parroquia)}
                            className="hover:bg-primary/10 hover:text-primary hover:shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(parroquia)}
                            className="hover:bg-destructive/10 hover:text-destructive hover:shadow-md"
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
                    Mostrando {parroquias.length} de {pagination.totalCount} parroquias
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="hover:shadow-hover disabled:opacity-50"
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
                      className="hover:shadow-hover disabled:opacity-50"
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

      {/* Modal de Crear Parroquia */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Parroquia"
        description="Crea una nueva parroquia en el sistema"
        icon={Church}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Parroquia"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Parroquia"
          placeholder="Ej: Parroquia San Juan"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="direccion"
          label="Dirección"
          placeholder="Ej: Calle 10 # 20-30"
          value={formData.direccion}
          onChange={(value) => setFormData({ ...formData, direccion: value })}
          required
        />
        <ConfigFormField
          id="telefono"
          label="Teléfono"
          placeholder="Ej: 1234567"
          value={formData.telefono}
          onChange={(value) => setFormData({ ...formData, telefono: value })}
        />
        <ConfigFormField
          id="email"
          label="Email"
          placeholder="Ej: parroquia@ejemplo.com"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
        />
        
        {/* Campo de Municipio con Autocomplete */}
        <div className="space-y-2">
          <label htmlFor="municipio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Municipio <span className="text-red-500">*</span>
          </label>
          <AutocompleteWithLoading
            options={municipiosOptions}
            value={formData.id_municipio}
            onValueChange={(value) => setFormData({ ...formData, id_municipio: value })}
            placeholder="Seleccionar municipio..."
            searchPlaceholder="Buscar municipio..."
            emptyText="No se encontraron municipios"
            isLoading={municipiosLoading}
            error={municipiosError}
            errorText="Error al cargar municipios"
          />
        </div>
      </ConfigModal>

      {/* Modal de Editar Parroquia */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Parroquia"
        description="Modifica los datos de la parroquia"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Parroquia"
          placeholder="Ej: Parroquia San Juan"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-direccion"
          label="Dirección"
          placeholder="Ej: Calle 10 # 20-30"
          value={formData.direccion}
          onChange={(value) => setFormData({ ...formData, direccion: value })}
          required
        />
        <ConfigFormField
          id="edit-telefono"
          label="Teléfono"
          placeholder="Ej: 1234567"
          value={formData.telefono}
          onChange={(value) => setFormData({ ...formData, telefono: value })}
        />
        <ConfigFormField
          id="edit-email"
          label="Email"
          placeholder="Ej: parroquia@ejemplo.com"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
        />
        
        {/* Campo de Municipio con Autocomplete para Edición */}
        <div className="space-y-2">
          <label htmlFor="edit-municipio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Municipio <span className="text-red-500">*</span>
          </label>
          <AutocompleteWithLoading
            options={municipiosOptions}
            value={formData.id_municipio}
            onValueChange={(value) => setFormData({ ...formData, id_municipio: value })}
            placeholder="Seleccionar municipio..."
            searchPlaceholder="Buscar municipio..."
            emptyText="No se encontraron municipios"
            isLoading={municipiosLoading}
            error={municipiosError}
            errorText="Error al cargar municipios"
          />
        </div>
      </ConfigModal>

      {/* Modal de Eliminar Parroquia */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la parroquia"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedParroquia?.nombre}
        submitText="Eliminar Parroquia"
      />
    </div>
  );
};

export default ParroquiasPage;