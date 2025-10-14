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
import { useDestrezasQuery, useDestrezas, paginateClientSide, filterBySearch } from '@/hooks/useDestrezas';
import { Destreza, DestrezaFormData, CATEGORIAS_DESTREZA } from '@/types/destrezas';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';

const DestrezasPage = () => {
  const destrezasHook = useDestrezas();

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Query unificada
  const { data: response, isLoading, refetch } = useDestrezasQuery(searchTerm);

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
  const createMutation = destrezasHook.useCreateDestrezaMutation();
  const updateMutation = destrezasHook.useUpdateDestrezaMutation();
  const deleteMutation = destrezasHook.useDeleteDestrezaMutation();

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
  
  const [selectedDestreza, setSelectedDestreza] = useState<Destreza | null>(null);
  const [formData, setFormData] = useState<DestrezaFormData>({
    nombre: '',
    descripcion: '',
    categoria: '',
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || undefined,
      categoria: formData.categoria || undefined,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre: '', descripcion: '', categoria: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestreza || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedDestreza.id_destreza,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || undefined,
        categoria: formData.categoria || undefined,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedDestreza(null);
        setFormData({ nombre: '', descripcion: '', categoria: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedDestreza) return;

    deleteMutation.mutate(selectedDestreza.id_destreza, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedDestreza(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '', categoria: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (destreza: Destreza) => {
    setSelectedDestreza(destreza);
    setFormData({
      nombre: destreza.nombre,
      descripcion: destreza.descripcion || '',
      categoria: destreza.categoria || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (destreza: Destreza) => {
    setSelectedDestreza(destreza);
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
            <Wrench className="w-8 h-8 text-muted-foreground" />
            Gestión de Destrezas
          </h1>
          <p className="text-muted-foreground mt-2">Administra las destrezas técnicas y artesanales</p>
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
            Nueva Destreza
          </Button>
        </div>
      </div>

      {/* Búsqueda en tiempo real */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Input
              placeholder="Buscar por nombre, descripción o categoría..."
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
                <p className="text-sm text-muted-foreground">Total Destrezas</p>
                <p className="text-2xl font-bold text-foreground">{processedData.pagination.totalCount}</p>
              </div>
              <Wrench className="w-8 h-8 text-muted-foreground" />
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
              <Wrench className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de destrezas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Wrench className="w-5 h-5" />
            Listado de Destrezas
            <span className="text-sm font-normal text-muted-foreground">Total: {processedData.pagination.totalCount}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando destrezas...</span>
            </div>
          ) : processedData.items.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron destrezas</p>
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
                    <TableHead>Categoría</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.items.map((destreza) => (
                    <TableRow key={destreza.id_destreza}>
                      <TableCell className="font-medium">{destreza.id_destreza}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-primary" />
                          <span className="font-medium">{destreza.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {destreza.categoria ? (
                          <Badge variant="secondary">{destreza.categoria}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {destreza.descripcion || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(destreza.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(destreza)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(destreza)}
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

      {/* Modal de Crear Destreza */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nueva Destreza"
        description="Crea una nueva destreza técnica o artesanal en el sistema"
        icon={Wrench}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Destreza"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre de la Destreza"
          placeholder="Ej: Carpintería"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <div className="space-y-2">
          <label htmlFor="categoria" className="text-sm font-medium">
            Categoría
          </label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS_DESTREZA.map((categoria) => (
                <SelectItem key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la destreza"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Destreza */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Destreza"
        description="Modifica los datos de la destreza"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre de la Destreza"
          placeholder="Ej: Carpintería"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <div className="space-y-2">
          <label htmlFor="edit-categoria" className="text-sm font-medium">
            Categoría
          </label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS_DESTREZA.map((categoria) => (
                <SelectItem key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la destreza"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Destreza */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente la destreza"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedDestreza?.nombre}
        submitText="Eliminar Destreza"
      />
    </div>
  );
};

export default DestrezasPage;
