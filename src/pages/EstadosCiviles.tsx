import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ResponsiveTable, ResponsiveTableColumn } from '@/components/ui/responsive-table';
import { ConfigModal, ConfigFormField, useConfigModal } from '@/components/ui/config-modal';
import { ConfigPagination } from '@/components/ui/config-pagination';
import { useEstadosCivilesQuery, useEstadosCiviles, paginateClientSide, filterBySearch } from '@/hooks/useEstadosCiviles';
import { EstadoCivil, EstadoCivilCreate } from '@/types/estados-civiles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  AlertCircle,
  Search
} from 'lucide-react';

// 🔍 Esquema de validación con Zod
const estadoCivilSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZÀ-ſ\s]+$/, "El nombre solo puede contener letras y espacios")
    .transform(val => val.trim()),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres")
    .transform(val => val.trim()),
});

type EstadoCivilFormData = z.infer<typeof estadoCivilSchema>;

const EstadosCivilesPage = () => {
  const estadosCivilesHook = useEstadosCiviles();

  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ USAR PATRÓN UNIFICADO - Single query 
  const { data: response, isLoading, error, refetch } = useEstadosCivilesQuery(searchTerm, false);

  // 🚨 Manejo de errores de red/servidor
  const hasError = error && !isLoading;

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
  const createMutation = estadosCivilesHook.useCreateEstadoCivilMutation();
  const updateMutation = estadosCivilesHook.useUpdateEstadoCivilMutation();
  const deleteMutation = estadosCivilesHook.useDeleteEstadoCivilMutation();

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

  const [selectedEstadoCivil, setSelectedEstadoCivil] = useState<EstadoCivil | null>(null);
  
  // 🗝️ Formulario con React Hook Form + Zod
  const form = useForm<EstadoCivilFormData>({
    resolver: zodResolver(estadoCivilSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
    mode: 'onChange', // Validación en tiempo real
  });

  const { register, handleSubmit, reset, formState: { errors, isValid, isDirty } } = form;

  // 📋 Manejo del formulario de creación
  const handleCreateSubmit = async (data: EstadoCivilFormData) => {
    // ⚠️ Validación adicional antes de enviar
    if (!isValid || !isDirty) {
      toast({
        title: "⚠️ Formulario Incompleto",
        description: "Por favor completa todos los campos correctamente antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        nombre: data.nombre,
        descripcion: data.descripcion,
      });
      
      // ✅ Éxito - cerrar modal y resetear formulario
      setShowCreateDialog(false);
      reset();
      
      toast({
        title: "✅ Estado Civil Creado",
        description: `"${data.nombre}" se ha creado exitosamente`,
      });
    } catch (error: any) {
      // ⚠️ Error ya manejado por el mutation, pero podemos agregar feedback adicional
      toast({
        title: "❌ Error al Crear",
        description: error?.response?.data?.message || "No se pudo crear el estado civil",
        variant: "destructive",
      });
    }
  };

  // ✏️ Manejo del formulario de edición
  const handleEditSubmit = async (data: EstadoCivilFormData) => {
    if (!selectedEstadoCivil) return;
    
    // ⚠️ Validación adicional antes de enviar
    if (!isValid) {
      toast({
        title: "⚠️ Datos Inválidos",
        description: "Por favor corrige los errores antes de guardar los cambios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateMutation.mutateAsync({
        id: selectedEstadoCivil.id,
        data: {
          nombre: data.nombre,
          descripcion: data.descripcion,
        }
      });
      
      // ✅ Éxito - cerrar modal y limpiar estado
      setShowEditDialog(false);
      setSelectedEstadoCivil(null);
      reset();
      
      toast({
        title: "✅ Estado Civil Actualizado",
        description: `"${data.nombre}" se ha actualizado exitosamente`,
      });
    } catch (error: any) {
      // ⚠️ Error ya manejado por el mutation
      toast({
        title: "❌ Error al Actualizar",
        description: error?.response?.data?.message || "No se pudo actualizar el estado civil",
        variant: "destructive",
      });
    }
  };

  // 🗑️ Manejo de eliminación
  const handleDelete = async () => {
    if (!selectedEstadoCivil) return;

    try {
      await deleteMutation.mutateAsync(selectedEstadoCivil.id);
      
      // ✅ Éxito - cerrar modal y limpiar estado
      setShowDeleteDialog(false);
      setSelectedEstadoCivil(null);
      
      toast({
        title: "✅ Estado Civil Eliminado",
        description: `"${selectedEstadoCivil.nombre}" se ha eliminado exitosamente`,
      });
    } catch (error: any) {
      // ⚠️ Error ya manejado por el mutation
      toast({
        title: "❌ Error al Eliminar",
        description: error?.response?.data?.message || "No se pudo eliminar el estado civil",
        variant: "destructive",
      });
    }
  };

  // 📝 Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    reset({ nombre: '', descripcion: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (estadoCivil: EstadoCivil) => {
    setSelectedEstadoCivil(estadoCivil);
    reset({
      nombre: estadoCivil.nombre,
      descripcion: estadoCivil.descripcion || '',
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (estadoCivil: EstadoCivil) => {
    setSelectedEstadoCivil(estadoCivil);
    openDeleteDialog();
  };

  // ✅ REAL-TIME SEARCH HANDLER - Sin botón "Buscar"
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetear a la primera página al buscar
  };

  // ✅ CLEAR SEARCH HANDLER - Botón X
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
    setCurrentPage(1); // Reset a primera página cuando cambie el límite
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
            <Heart className="w-8 h-8 text-muted-foreground " />
            Gestión de Estados Civiles
          </h1>
          <p className="text-muted-foreground mt-2">Administra los estados civiles para encuestas</p>
        </div>
        <div className="flex gap-2 ">
          <Button
            variant="outline"
            onClick={() => refetch()}
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
            Nuevo Estado Civil
          </Button>
        </div>
      </div>

      {/* 🔍 BÚSQUEDA EN TIEMPO REAL - Con feedback visual mejorado */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Campo de búsqueda mejorado */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-10 pr-10 transition-all duration-200 ${
                    searchTerm 
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                      : 'border-input focus:ring-primary'
                  }`}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded transition-colors"
                    title="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Indicadores de búsqueda */}
            {searchTerm && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Search className="w-4 h-4" />
                  <span>Buscando: <strong className="text-foreground">"{searchTerm}"</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {processedData.pagination.totalCount} resultado{processedData.pagination.totalCount !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ✅ ESTADÍSTICAS DINÁMICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Estados Civiles</p>
                <p className="text-2xl font-bold text-foreground">{processedData.pagination.totalCount}</p>
              </div>
              <Heart className="w-8 h-8 text-muted-foreground opacity-70 " />
            </div>
          </CardContent>
        </Card>

        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-foreground">{processedData.pagination.totalPages}</p>
              </div>
              <Heart className="w-8 h-8 text-secondary opacity-70 " />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de estados civiles con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Heart className="w-5 h-5" />
            Listado de Estados Civiles
            <span className="text-sm font-normal text-muted-foreground">Total: {processedData.pagination.totalCount}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 🚨 Estado de Error */}
          {hasError ? (
            <div className="text-center py-12">
              <div className="relative mb-6">
                <AlertCircle className="w-16 h-16 text-red-500/30 mx-auto" />
                <X className="w-6 h-6 absolute top-0 right-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error al cargar los datos
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {error?.message || 'No se pudieron cargar los estados civiles. Verifica tu conexión a internet.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Reintentar
                </Button>
                <Button 
                  onClick={handleOpenCreateDialog}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear Estado Civil
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <Loader2 className="w-8 h-8 absolute top-2 left-4 animate-spin text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cargando Estados Civiles</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Estamos obteniendo la información más reciente...
              </p>
            </div>
          ) : processedData.items.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                // 🔍 Estado: Sin resultados de búsqueda
                <>
                  <div className="relative mb-6">
                    <Search className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                    <X className="w-6 h-6 absolute top-0 right-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    No hay estados civiles que coincidan con <strong>"{searchTerm}"</strong>.
                    Intenta con otros términos de búsqueda.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      onClick={handleClearSearch}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Limpiar búsqueda
                    </Button>
                    <Button 
                      onClick={handleOpenCreateDialog}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Crear Estado Civil
                    </Button>
                  </div>
                </>
              ) : (
                // 📋 Estado: Lista vacía (sin datos)
                <>
                  <div className="relative mb-6">
                    <Heart className="w-20 h-20 text-muted-foreground/20 mx-auto mb-4" />
                    <AlertCircle className="w-8 h-8 absolute top-6 right-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aún no hay estados civiles registrados
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Comienza creando el primer estado civil para tu sistema de encuestas.
                    Ejemplos: Soltero(a), Casado(a), Divorciado(a), Viudo(a).
                  </p>
                  <Button 
                    onClick={handleOpenCreateDialog}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Crear Primer Estado Civil
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={processedData.items}
                columns={[
                  {
                    key: 'id',
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
                        <Heart className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  },
                  {
                    key: 'descripcion',
                    label: 'Descripción',
                    priority: 'low',
                    render: (value: any) => (
                      <span>{value || 'N/A'}</span>
                    )
                  },
                  {
                    key: 'createdAt',
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

      {/* 🎆 Modal de Crear Estado Civil con Validaciones */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) reset(); // Limpiar formulario al cerrar
        }}
        type="create"
        title="🎆 Nuevo Estado Civil"
        description="Crea un nuevo estado civil con validaciones en tiempo real"
        icon={Heart}
        loading={createMutation.isPending}
        onSubmit={handleSubmit(handleCreateSubmit)}
        submitText="Crear Estado Civil"
      >
        {/* Campo Nombre con validación */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="flex items-center gap-2">
            Nombre del Estado Civil 
            <span className="text-red-500">*</span>
            {errors.nombre && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="nombre"
            placeholder="Ej: Soltero(a), Casado(a), Divorciado(a)"
            {...register('nombre')}
            className={`transition-all duration-200 ${
              errors.nombre 
                ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                : isDirty ? 'border-green-500 bg-green-50 focus:ring-green-200' : ''
            }`}
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.nombre.message}
            </p>
          )}
        </div>

        {/* Campo Descripción con validación */}
        <div className="space-y-2">
          <Label htmlFor="descripcion" className="flex items-center gap-2">
            Descripción 
            <span className="text-red-500">*</span>
            {errors.descripcion && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="descripcion"
            placeholder="Breve descripción del estado civil"
            {...register('descripcion')}
            className={`transition-all duration-200 ${
              errors.descripcion 
                ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                : isDirty ? 'border-green-500 bg-green-50 focus:ring-green-200' : ''
            }`}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.descripcion.message}
            </p>
          )}
        </div>

      </ConfigModal>

      {/* ✏️ Modal de Editar Estado Civil con Validaciones */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) {
            setSelectedEstadoCivil(null);
            reset();
          }
        }}
        type="edit"
        title="✏️ Editar Estado Civil"
        description={`Modifica los datos de "${selectedEstadoCivil?.nombre || ''}"`}
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleSubmit(handleEditSubmit)}
        submitText="Guardar Cambios"
      >
        {/* Campo Nombre con validación */}
        <div className="space-y-2">
          <Label htmlFor="edit-nombre" className="flex items-center gap-2">
            Nombre del Estado Civil 
            <span className="text-red-500">*</span>
            {errors.nombre && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="edit-nombre"
            placeholder="Ej: Soltero(a), Casado(a), Divorciado(a)"
            {...register('nombre')}
            className={`transition-all duration-200 ${
              errors.nombre 
                ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                : isDirty ? 'border-green-500 bg-green-50 focus:ring-green-200' : ''
            }`}
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.nombre.message}
            </p>
          )}
        </div>

        {/* Campo Descripción con validación */}
        <div className="space-y-2">
          <Label htmlFor="edit-descripcion" className="flex items-center gap-2">
            Descripción 
            <span className="text-red-500">*</span>
            {errors.descripcion && <AlertCircle className="w-4 h-4 text-red-500" />}
          </Label>
          <Input
            id="edit-descripcion"
            placeholder="Breve descripción del estado civil"
            {...register('descripcion')}
            className={`transition-all duration-200 ${
              errors.descripcion 
                ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                : isDirty ? 'border-green-500 bg-green-50 focus:ring-green-200' : ''
            }`}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.descripcion.message}
            </p>
          )}
        </div>

      </ConfigModal>

      {/* Modal de Eliminar Estado Civil */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el estado civil"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedEstadoCivil?.nombre}
        submitText="Eliminar Estado Civil"
      />
    </div>
  );
};

export default EstadosCivilesPage;