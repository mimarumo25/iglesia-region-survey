import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useHabilidadesQuery, useHabilidades, paginateClientSide, filterBySearch } from '@/hooks/useHabilidades';
import { Habilidad, HabilidadFormData, NIVELES_HABILIDAD } from '@/types/habilidades';
import {
  Lightbulb,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';

const HabilidadesPage = () => {
  const habilidadesHook = useHabilidades();

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Query unificada
  const { data: response, isLoading, refetch } = useHabilidadesQuery(searchTerm);

  // Procesar datos del lado del cliente
  const processedData = useMemo(() => {
    if (!response?.data) return {
      items: [],
      pagination: {
        totalPages: 1,
        totalCount: 0,
        currentPage: 1,
        hasNext: false,
        hasPrev: false
      }
    };

    const allItems = Array.isArray(response.data) ? response.data : [];
    
    // Filtrar por búsqueda del lado del cliente si es necesario
    const filteredItems = searchTerm ? filterBySearch(allItems, searchTerm) : allItems;
    
    // Paginar del lado del cliente
    const paginationResult = paginateClientSide(filteredItems, currentPage, itemsPerPage);
    
    return {
      items: paginationResult.paginatedItems,
      pagination: paginationResult
    };
  }, [response, searchTerm, currentPage, itemsPerPage]);

  // Mutaciones de React Query
  const createMutation = habilidadesHook.useCreateHabilidadMutation();
  const updateMutation = habilidadesHook.useUpdateHabilidadMutation();
  const deleteMutation = habilidadesHook.useDeleteHabilidadMutation();

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
  
  const [selectedHabilidad, setSelectedHabilidad] = useState<Habilidad | null>(null);
  const [formData, setFormData] = useState<HabilidadFormData>({
    nombre: '',
    descripcion: '',
    nivel: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || undefined,
      nivel: formData.nivel || undefined,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '', nivel: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabilidad || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedHabilidad.id_habilidad,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
        nivel: formData.nivel || undefined,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedHabilidad(null);
        setFormData({ nombre: '', descripcion: '', nivel: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedHabilidad) return;

    deleteMutation.mutate(selectedHabilidad.id_habilidad, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedHabilidad(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', nivel: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (habilidad: Habilidad) => {
    setSelectedHabilidad(habilidad);
    setFormData({
      nombre: habilidad.nombre,
      descripcion: habilidad.descripcion || '',
      nivel: habilidad.nivel || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (habilidad: Habilidad) => {
    setSelectedHabilidad(habilidad);
    openDeleteDialog();
  };

  // Real-time search handler
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Clear search handler
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Manejo de paginación
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
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
            <Lightbulb className="w-8 h-8 text-muted-foreground" />
            Gestión de Habilidades
          </h1>
          <p className="text-muted-foreground mt-2">Administra las habilidades profesionales</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Habilidad
          </Button>
        </div>
      </div>

      {/* Búsqueda en tiempo real */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Input
              placeholder="Buscar por nombre, descripción o nivel..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pr-10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Habilidades</p>
                <p className="text-2xl font-bold text-foreground">{processedData.pagination.totalCount}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{processedData.pagination.totalPages}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de habilidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lightbulb className="w-5 h-5" />
            Listado de Habilidades
            <span className="text-sm font-normal text-muted-foreground">Total: {processedData.pagination.totalCount}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando habilidades...</span>
            </div>
          ) : processedData.items.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron habilidades</p>
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
                    <TableHead>Nivel</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.items.map((habilidad) => (
                    <TableRow key={habilidad.id_habilidad}>
                      <TableCell className="font-medium">{habilidad.id_habilidad}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          <span className="font-medium">{habilidad.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {habilidad.nivel ? (
                          <Badge variant="secondary">{habilidad.nivel}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {habilidad.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(habilidad.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(habilidad)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(habilidad)}
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
              <ConfigPagination
                currentPage={processedData.pagination.currentPage}
                totalPages={processedData.pagination.totalPages}
                totalItems={processedData.pagination.totalCount}
                itemsPerPage={itemsPerPage}
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

      {/* Modal de Crear Habilidad */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Habilidad"
        description="Crea una nueva habilidad profesional en el sistema"
        icon={Lightbulb}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Habilidad"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Habilidad"
          placeholder="Ej: Comunicación efectiva"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <div className="space-y-2">
          <label htmlFor="nivel" className="text-sm font-medium">
            Nivel
          </label>
          <Select
            value={formData.nivel}
            onValueChange={(value) => setFormData({ ...formData, nivel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              {NIVELES_HABILIDAD.map((nivel) => (
                <SelectItem key={nivel.value} value={nivel.value}>
                  {nivel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la habilidad"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Habilidad */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Habilidad"
        description="Modifica los datos de la habilidad"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Habilidad"
          placeholder="Ej: Comunicación efectiva"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <div className="space-y-2">
          <label htmlFor="edit-nivel" className="text-sm font-medium">
            Nivel
          </label>
          <Select
            value={formData.nivel}
            onValueChange={(value) => setFormData({ ...formData, nivel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              {NIVELES_HABILIDAD.map((nivel) => (
                <SelectItem key={nivel.value} value={nivel.value}>
                  {nivel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la habilidad"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Habilidad */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la habilidad"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedHabilidad?.nombre}
        submitText="Eliminar Habilidad"
      />
    </div>
  );
};

export default HabilidadesPage;
