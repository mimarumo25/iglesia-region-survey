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
import ConfigPagination from '@/components/ui/config-pagination';
import { useParentescos } from '@/hooks/useParentescos';
import { Parentesco, ParentescoFormData } from '@/types/parentescos';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';

const ParentescosPage = () => {
  const parentescosHook = useParentescos();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Query unificada - Una sola query que maneja tanto datos normales como búsqueda
  const { data: parentescosResponse, isLoading: parentescosLoading, refetch: refetchParentescos } = parentescosHook.useParentescosQuery(page, limit, searchTerm);

  // Mutaciones de React Query
  const createMutation = parentescosHook.useCreateParentescoMutation();
  const updateMutation = parentescosHook.useUpdateParentescoMutation();
  const deleteMutation = parentescosHook.useDeleteParentescoMutation();

    // Datos y paginación simplificados
  const parentescos = (parentescosResponse as any)?.data || [];
  const pagination = {
    totalItems: (parentescosResponse as any)?.pagination?.totalCount || 0,
    totalPages: (parentescosResponse as any)?.pagination?.totalPages || 1,
    currentPage: (parentescosResponse as any)?.pagination?.currentPage || 1,
    hasNext: (parentescosResponse as any)?.pagination?.hasNext || false,
    hasPrev: (parentescosResponse as any)?.pagination?.hasPrev || false,
    itemsPerPage: (parentescosResponse as any)?.pagination?.limit || limit
  };

  // Debug logs
  console.log('🎯 Página: parentescosResponse:', parentescosResponse);
  console.log('📊 Página: parentescos array:', parentescos);
  console.log('📄 Página: pagination:', pagination);
  console.log('⏳ Página: isLoading:', parentescosLoading);

  const loading = parentescosLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedParentesco, setSelectedParentesco] = useState<Parentesco | null>(null);
  const [formData, setFormData] = useState<ParentescoFormData>({
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
    if (!selectedParentesco || !formData.nombre.trim()) return;

    updateMutation.mutate({
      id: selectedParentesco.id_parentesco,
      data: {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedParentesco(null);
        setFormData({ nombre: '', descripcion: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedParentesco) return;

    deleteMutation.mutate(selectedParentesco.id_parentesco, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedParentesco(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (parentesco: Parentesco) => {
    setSelectedParentesco(parentesco);
    setFormData({
      nombre: parentesco.nombre,
      descripcion: parentesco.descripcion || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (parentesco: Parentesco) => {
    setSelectedParentesco(parentesco);
    openDeleteDialog();
  };

  // Manejo de búsqueda en tiempo real
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1); // Resetear paginación al cambiar búsqueda
  };

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
    <div className="container mx-auto p-6 max-w-7xl ">
      {/* Header con diseño mejorado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-muted-foreground " />
            Gestión de Parentescos
          </h1>
          <p className="text-muted-foreground mt-2">Administra los tipos de parentesco para encuestas</p>
        </div>
        <div className="flex gap-2 ">
          <Button 
            variant="outline" 
            onClick={() => refetchParentescos()}
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
            Nuevo Parentesco
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros con diseño mejorado */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Búsqueda por texto */}
              <div className="flex-1 relative">
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="border-input-border focus:ring-primary transition-smooth pr-8"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas con diseño mejorado */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Parentescos Filtrados' : 'Total Parentescos'}
                </p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalItems}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground opacity-70 " />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de parentescos con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5" />
            Listado de Parentescos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando parentescos...</span>
            </div>
          ) : !Array.isArray(parentescos) || parentescos.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 " />
              <p className="text-muted-foreground">No se encontraron parentescos</p>
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
                  {Array.isArray(parentescos) && parentescos.map((parentesco, index) => (
                    <TableRow 
                      key={parentesco.id_parentesco}
                      className="hover:bg-muted/50 "
                      
                    >
                      <TableCell className="font-medium text-foreground">
                        {parentesco.id_parentesco}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground " />
                          <span className="font-medium">{parentesco.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                          {parentesco.descripcion || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="">
                          {formatDate(parentesco.createdAt)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(parentesco)}
                            className="hover:bg-primary/10 hover:text-muted-foreground hover:shadow-md"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(parentesco)}
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

              {/* Paginación unificada con patrón completo */}
              <ConfigPagination
                variant="complete"
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                showInfo={true}
                showItemsPerPageSelector={true}
                itemsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Crear Parentesco */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Parentesco"
        description="Crea un nuevo tipo de parentesco para las encuestas"
        icon={Users}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Parentesco"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre del Parentesco"
          placeholder="Ej: Padre/Madre"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="descripcion"
          label="Descripción"
          placeholder="Breve descripción del parentesco"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Editar Parentesco */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Parentesco"
        description="Modifica los datos del parentesco"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Parentesco"
          placeholder="Ej: Padre/Madre"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        <ConfigFormField
          id="edit-descripcion"
          label="Descripción"
          placeholder="Breve descripción del parentesco"
          value={formData.descripcion}
          onChange={(value) => setFormData({ ...formData, descripcion: value })}
        />
      </ConfigModal>

      {/* Modal de Eliminar Parentesco */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el parentesco"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedParentesco?.nombre}
        submitText="Eliminar Parentesco"
      />
    </div>
  );
};

export default ParentescosPage;