import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable, ResponsiveTableColumn } from '@/components/ui/responsive-table';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { useAguasResiduales } from '@/hooks/useAguasResiduales';
import { AguaResidual, AguaResidualFormData } from '@/types/aguas-residuales';
import {
  Droplet,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';
import { ConfigPagination } from '@/components/ui/config-pagination';

const AguasResidualesPage = () => {
  const aguasResidualesHook = useAguasResiduales();

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_tipo_aguas_residuales');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query - PATRÓN UNIFICADO
  const { data: aguasResidualesResponse, isLoading: aguasResidualesLoading, refetch: refetchAguasResiduales } = aguasResidualesHook.useAguasResidualesQuery(searchTerm, page, limit, sortBy, sortOrder);

  // Mutaciones de React Query
  const createMutation = aguasResidualesHook.useCreateAguaResidualMutation();
  const updateMutation = aguasResidualesHook.useUpdateAguaResidualMutation();
  const deleteMutation = aguasResidualesHook.useDeleteAguaResidualMutation();

  // Datos unificados desde una sola query
  const aguasResiduales = (aguasResidualesResponse as any)?.data?.tiposAguasResiduales || [];
  const pagination = (aguasResidualesResponse as any)?.data?.pagination || { currentPage: 1, totalPages: 1, totalCount: 0, hasNext: false, hasPrev: false };
  
  const loading = aguasResidualesLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedAguaResidual, setSelectedAguaResidual] = useState<AguaResidual | null>(null);
  const [formData, setFormData] = useState<AguaResidualFormData>({ 
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
    if (!selectedAguaResidual || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedAguaResidual.id_tipo_aguas_residuales,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedAguaResidual(null);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedAguaResidual) return;

    deleteMutation.mutate(selectedAguaResidual.id_tipo_aguas_residuales, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedAguaResidual(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (aguaResidual: AguaResidual) => {
    setSelectedAguaResidual(aguaResidual);
    setFormData({
      nombre: aguaResidual.nombre,
      descripcion: aguaResidual.descripcion || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (aguaResidual: AguaResidual) => {
    setSelectedAguaResidual(aguaResidual);
    openDeleteDialog();
  };

  // ✅ BÚSQUEDA EN TIEMPO REAL: Manejo del cambio en el input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setPage(1); // Resetear paginación
  };

  // ✅ LIMPIAR BÚSQUEDA: Manejo del botón X
  const handleClearSearch = () => {
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
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Droplet className="w-8 h-8 text-muted-foreground " />
            Gestión de Tipos de Aguas Residuales
          </h1>
          <p className="text-muted-foreground mt-2">Administra los tipos de aguas residuales para encuestas</p>
        </div>
        <div className="flex gap-2 ">
          <Button 
            variant="outline" 
            onClick={() => refetchAguasResiduales()}
            disabled={loading}
            className=""
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={handleOpenCreateDialog}
            className=""
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Tipo
          </Button>
        </div>
      </div>

      {/* ✅ BÚSQUEDA EN TIEMPO REAL: Diseño mejorado con botón X */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 pr-10"
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 h-7 w-7 p-0 -translate-y-1/2 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ ESTADÍSTICAS DINÁMICAS: Mostrar filtrados vs total */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Aguas Residuales Filtradas" : "Total Aguas Residuales"}
                </p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
                {searchTerm && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Filtrado por: "{searchTerm}"
                  </p>
                )}
              </div>
              <Droplet className="w-8 h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Páginas Filtradas" : "Total Páginas"}
                </p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalPages}</p>
              </div>
              <Droplet className="w-8 h-8 text-secondary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de tipos de aguas residuales con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Droplet className="w-5 h-5" />
            Listado de Tipos de Aguas Residuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando tipos de aguas residuales...</span>
            </div>
          ) : aguasResiduales.length === 0 ? (
            <div className="text-center py-8">
              <Droplet className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 " />
              <p className="text-muted-foreground">No se encontraron tipos de aguas residuales</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={aguasResiduales}
                columns={[
                  {
                    key: 'id_tipo_aguas_residuales',
                    label: 'ID',
                    priority: 'medium',
                    render: (value: any) => <span className="font-medium text-foreground">{value}</span>
                  },
                  {
                    key: 'nombre',
                    label: 'Nombre',
                    priority: 'high',
                    render: (value: any) => (
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  },
                  {
                    key: 'descripcion',
                    label: 'Descripción',
                    priority: 'medium',
                    render: (value: any) => (
                      <span className="font-medium">
                        {value || 'N/A'}
                      </span>
                    )
                  },
                  {
                    key: 'created_at',
                    label: 'Fecha Creación',
                    priority: 'low',
                    render: (value: any) => (
                      <Badge variant="outline">
                        {formatDate(value)}
                      </Badge>
                    )
                  }
                ]}
                actions={[
                  {
                    label: 'Editar',
                    icon: <Edit2 className="w-4 h-4" />,
                    variant: 'default' as const,
                    onClick: (item: any) => handleOpenEditDialog(item)
                  },
                  {
                    label: 'Eliminar',
                    icon: <Trash2 className="w-4 h-4" />,
                    variant: 'destructive' as const,
                    onClick: (item: any) => handleOpenDeleteDialog(item)
                  }
                ]}
              />
              
              {/* Paginación unificada con patrón completo */}
              <ConfigPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalCount}
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

      {/* Modal de Crear Tipo de Agua Residual */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Tipo de Agua Residual"
        description="Crea un nuevo tipo de agua residual para las encuestas"
        icon={Droplet}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Tipo"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre del Tipo"
          placeholder="Ej: Agua Potable"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Breve descripción del tipo de agua residual"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Tipo de Agua Residual */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Tipo de Agua Residual"
        description="Modifica los datos del tipo de agua residual"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Tipo"
          placeholder="Ej: Agua Potable"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Breve descripción del tipo de agua residual"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Tipo de Agua Residual */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el tipo de agua residual"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedAguaResidual?.nombre}
        submitText="Eliminar Tipo"
      />
    </div>
  );
};

export default AguasResidualesPage;