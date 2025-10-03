import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveTable, ResponsiveTableColumn } from '@/components/ui/responsive-table';
import { ConfigModal, ConfigFormField, useConfigModal } from "@/components/ui/config-modal";
import ConfigPagination from '@/components/ui/config-pagination';
import { useMunicipios } from "@/hooks/useMunicipios";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { Municipio } from "@/services/municipios";
import { Departamento } from "@/services/departamentos";

// Tipo local para el formulario
interface MunicipioFormData {
  nombre_municipio: string;
  codigo_dane: string;
  id_departamento: string; // Mantenerlo como string para el select
}
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";

const MunicipiosPage = () => {
  const municipiosHook = useMunicipios();
  const departamentosHook = useDepartamentos();

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('nombre_municipio');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query - Ahora con query unificado
  const { data: municipiosResponse, isLoading: municipiosLoading, refetch: refetchMunicipios } = municipiosHook.useMunicipiosQuery(page, limit, sortBy, sortOrder, searchTerm);
  const { data: departamentosResponse, isLoading: departamentosLoading } = departamentosHook.useActiveDepartamentosQuery();

  // Mutaciones de React Query
  const createMutation = municipiosHook.useCreateMunicipioMutation();
  const updateMutation = municipiosHook.useUpdateMunicipioMutation();
  const deleteMutation = municipiosHook.useDeleteMunicipioMutation();

  const municipios = (municipiosResponse as any)?.data?.municipios || [];
  const pagination = {
    totalItems: (municipiosResponse as any)?.data?.pagination?.totalCount || 0,
    totalPages: (municipiosResponse as any)?.data?.pagination?.totalPages || 1,
    currentPage: (municipiosResponse as any)?.data?.pagination?.currentPage || 1,
    hasNext: (municipiosResponse as any)?.data?.pagination?.hasNext || false,
    hasPrev: (municipiosResponse as any)?.data?.pagination?.hasPrev || false,
    itemsPerPage: (municipiosResponse as any)?.data?.pagination?.limit || limit
  };

  // Lista de departamentos para el dropdown
  const departamentos: Departamento[] = (departamentosResponse as any)?.data || [];

  const loading = municipiosLoading || departamentosLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
  const [formData, setFormData] = useState<MunicipioFormData>({
    nombre_municipio: '',
    codigo_dane: '',
    id_departamento: '', // Valor vacío para el select
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_municipio.trim() || !formData.codigo_dane.trim() || !formData.id_departamento) return;

    createMutation.mutate({
      nombre_municipio: formData.nombre_municipio.trim(),
      codigo_dane: formData.codigo_dane.trim(),
      id_departamento: parseInt(formData.id_departamento),
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre_municipio: '', codigo_dane: '', id_departamento: '' });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMunicipio || !formData.nombre_municipio.trim() || !formData.codigo_dane.trim() || !formData.id_departamento) return;

    updateMutation.mutate({
      id: String(selectedMunicipio.id_municipio),
      data: {
        nombre_municipio: formData.nombre_municipio.trim(),
        codigo_dane: formData.codigo_dane.trim(),
        id_departamento: parseInt(formData.id_departamento),
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedMunicipio(null);
        setFormData({ nombre_municipio: '', codigo_dane: '', id_departamento: '' });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedMunicipio) return;

    deleteMutation.mutate(String(selectedMunicipio.id_municipio), {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedMunicipio(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre_municipio: '', codigo_dane: '', id_departamento: '' });
    openCreateDialog();
  };

  const handleOpenEditDialog = (municipio: Municipio) => {
    setSelectedMunicipio(municipio);
    setFormData({
      nombre_municipio: municipio.nombre_municipio,
      codigo_dane: municipio.codigo_dane,
      id_departamento: String(municipio.id_departamento), // Convertir a string
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (municipio: Municipio) => {
    setSelectedMunicipio(municipio);
    openDeleteDialog();
  };

  // Manejo de búsqueda - Ahora en tiempo real
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda ya se ejecuta automáticamente por el cambio en searchTerm
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Resetear paginación al buscar
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
    <div className="container mx-auto p-3 sm:p-6 max-w-7xl">
      {/* Header optimizado para móvil */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center sm:justify-start gap-3">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            Gestión de Municipios
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Administra los municipios para encuestas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            variant="outline" 
            onClick={() => refetchMunicipios()}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          {/*<Button 
            onClick={handleOpenCreateDialog}
            className="w-full sm:w-auto"
          >
           <Plus className="w-4 h-4 mr-2" />
            Nuevo Municipio
          </Button>*/}
        </div>
      </div>

      {/* Búsqueda optimizada para móvil */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-4 sm:pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Input
              placeholder="Buscar por nombre, código DANE o departamento..."
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              className="flex-1 text-base"
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearSearch}
                  className="flex-1 sm:flex-initial"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas responsivas para móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Municipios</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{pagination.totalItems}</p>
              </div>
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Páginas</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{pagination.totalPages}</p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-secondary opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de municipios responsiva */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-center sm:text-left flex items-center gap-2 text-base sm:text-lg">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Listado de Municipios
            </CardTitle>
            <div className="text-center sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Página {pagination.currentPage} de {pagination.totalPages}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mb-3" />
              <span className="text-sm text-muted-foreground">Cargando municipios...</span>
            </div>
          ) : municipios.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground mb-2">No se encontraron municipios</p>
              {searchTerm && (
                <p className="text-xs sm:text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <>
              <ResponsiveTable
                data={municipios}
                columns={[
                  {
                    key: 'id_municipio',
                    label: 'ID',
                    priority: 'medium',
                    render: (value: any) => <span className="font-medium text-foreground">{value}</span>
                  },
                  {
                    key: 'nombre_municipio',
                    label: 'Nombre',
                    priority: 'high',
                    render: (value: any) => (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  },
                  {
                    key: 'codigo_dane',
                    label: 'Código DANE',
                    priority: 'medium',
                    render: (value: any) => (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  },
                  {
                    key: 'departamento',
                    label: 'Departamento',
                    priority: 'high',
                    render: (value: any) => (
                      <Badge variant="secondary">
                        {value?.nombre || 'N/A'}
                      </Badge>
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
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
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

      {/* Modal de Crear Municipio */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Municipio"
        description="Crea un nuevo municipio en el sistema"
        icon={Building2}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Municipio"
      >
        <ConfigFormField
          id="nombre_municipio"
          label="Nombre del Municipio"
          placeholder="Ej: Medellín"
          value={formData.nombre_municipio}
          onChange={(value) => setFormData({ ...formData, nombre_municipio: value })}
          required
        />
        <ConfigFormField
          id="codigo_dane"
          label="Código DANE"
          placeholder="Ej: 05001"
          value={formData.codigo_dane}
          onChange={(value) => setFormData({ ...formData, codigo_dane: value })}
          required
        />
        
        {/* Dropdown para Departamento */}
        <div className="space-y-2">
          <label htmlFor="id_departamento" className="text-sm font-medium text-foreground">
            Departamento <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.id_departamento}
            onValueChange={(value) => setFormData({ ...formData, id_departamento: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos.map((dept) => (
                <SelectItem key={dept.id_departamento} value={String(dept.id_departamento)}>
                  {dept.nombre} ({dept.codigo_dane})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ConfigModal>

      {/* Modal de Editar Municipio */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Municipio"
        description="Modifica los datos del municipio"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre_municipio"
          label="Nombre del Municipio"
          placeholder="Ej: Medellín"
          value={formData.nombre_municipio}
          onChange={(value) => setFormData({ ...formData, nombre_municipio: value })}
          required
        />
        <ConfigFormField
          id="edit-codigo_dane"
          label="Código DANE"
          placeholder="Ej: 05001"
          value={formData.codigo_dane}
          onChange={(value) => setFormData({ ...formData, codigo_dane: value })}
          required
        />
        
        {/* Dropdown para Departamento en Edición */}
        <div className="space-y-2">
          <label htmlFor="edit-id_departamento" className="text-sm font-medium text-foreground">
            Departamento <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.id_departamento}
            onValueChange={(value) => setFormData({ ...formData, id_departamento: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos.map((dept) => (
                <SelectItem key={dept.id_departamento} value={String(dept.id_departamento)}>
                  {dept.nombre} ({dept.codigo_dane})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ConfigModal>

      {/* Modal de Eliminar Municipio */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el municipio"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedMunicipio?.nombre_municipio}
        submitText="Eliminar Municipio"
      />
    </div>
  );
};

export default MunicipiosPage;