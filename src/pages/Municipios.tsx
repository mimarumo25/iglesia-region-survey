import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfigurationTable, TableColumn, TableAction, PaginationData } from '@/components/ui/configuration-table';
import { ConfigModal, ConfigFormField, useConfigModal } from "@/components/ui/config-modal";
import { useMunicipios } from "@/hooks/useMunicipios";
import { Municipio } from "@/types/veredas";

// Tipo local para el formulario
interface MunicipioFormData {
  nombre_municipio: string;
  codigo_dane: string;
  id_departamento: number;
}
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MunicipiosPage = () => {
  const municipiosHook = useMunicipios();

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('nombre_municipio');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query
  const { data: municipiosResponse, isLoading: municipiosLoading, refetch: refetchMunicipios } = municipiosHook.useMunicipiosQuery(page, limit, sortBy, sortOrder, searchTerm);

  // Mutaciones de React Query
  const createMutation = municipiosHook.useCreateMunicipioMutation();
  const updateMutation = municipiosHook.useUpdateMunicipioMutation();
  const deleteMutation = municipiosHook.useDeleteMunicipioMutation();

  const municipios = (municipiosResponse as any)?.data?.municipios || [];
  const pagination = (municipiosResponse as any)?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  };

  const loading = municipiosLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
    id_departamento: 0,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_municipio.trim() || !formData.codigo_dane.trim() || formData.id_departamento === 0) return;

    createMutation.mutate({
      nombre_municipio: formData.nombre_municipio.trim(),
      codigo_dane: formData.codigo_dane.trim(),
      id_departamento: formData.id_departamento,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ nombre_municipio: '', codigo_dane: '', id_departamento: 0 });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMunicipio || !formData.nombre_municipio.trim() || !formData.codigo_dane.trim() || formData.id_departamento === 0) return;

    updateMutation.mutate({
      id: String(selectedMunicipio.id_municipio),
      data: {
        nombre_municipio: formData.nombre_municipio.trim(),
        codigo_dane: formData.codigo_dane.trim(),
        id_departamento: formData.id_departamento,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedMunicipio(null);
        setFormData({ nombre_municipio: '', codigo_dane: '', id_departamento: 0 });
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
    setFormData({ nombre_municipio: '', codigo_dane: '', id_departamento: 0 });
    openCreateDialog();
  };

  const handleOpenEditDialog = (municipio: Municipio) => {
    setSelectedMunicipio(municipio);
    setFormData({
      nombre_municipio: municipio.nombre_municipio,
      codigo_dane: municipio.codigo_dane,
      id_departamento: typeof municipio.id_departamento === 'string' 
        ? parseInt(municipio.id_departamento) 
        : Number(municipio.id_departamento),
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (municipio: Municipio) => {
    setSelectedMunicipio(municipio);
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
            <Building2 className="w-8 h-8 text-muted-foreground " />
            Gestión de Municipios
          </h1>
          <p className="text-muted-foreground mt-2">Administra los municipios para encuestas</p>
        </div>
        <div className="flex gap-2 ">
          <Button 
            variant="outline" 
            onClick={() => refetchMunicipios()}
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
            Nuevo Municipio
          </Button>
        </div>
      </div>

      {/* Búsqueda con diseño mejorado */}
      <Card className="mb-6  ">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Buscar por nombre o código DANE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-input-border focus:ring-primary"
            />
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
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="  ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Municipios</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Building2 className="w-8 h-8 text-muted-foreground opacity-70 " />
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
              <Building2 className="w-8 h-8 text-secondary opacity-70 " />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de municipios con diseño mejorado */}
      <Card className=" ">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="w-5 h-5" />
            Listado de Municipios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando municipios...</span>
            </div>
          ) : municipios.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 " />
              <p className="text-muted-foreground">No se encontraron municipios</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <ConfigurationTable
              data={municipios}
              columns={[
                {
                  key: 'id_municipio',
                  label: 'ID',
                  render: (value: any) => <span className="font-medium text-foreground">{value}</span>
                },
                {
                  key: 'nombre_municipio',
                  label: 'Nombre',
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
                  render: (value: any) => (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                },
                {
                  key: 'departamento',
                  label: 'Departamento',
                  render: (value: any) => (
                    <Badge variant="secondary">
                      {value?.nombre || 'N/A'}
                    </Badge>
                  )
                },
                {
                  key: 'created_at',
                  label: 'Fecha Creación',
                  render: (value: any) => (
                    <Badge variant="outline">
                      {formatDate(value)}
                    </Badge>
                  )
                }
              ]}
              actions={[
                {
                  type: 'edit' as const,
                  label: 'Editar',
                  icon: <Edit2 className="w-4 h-4" />,
                  color: 'default' as const,
                  onClick: (item: any) => handleOpenEditDialog(item)
                },
                {
                  type: 'delete' as const,
                  label: 'Eliminar',
                  icon: <Trash2 className="w-4 h-4" />,
                  color: 'destructive' as const,
                  onClick: (item: any) => handleOpenDeleteDialog(item)
                }
              ]}
              pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.totalCount || 0,
                itemsPerPage: limit
              }}
              onPageChange={handlePageChange}
            />
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
        <ConfigFormField
          id="id_departamento"
          label="ID Departamento"
          placeholder="Ej: 5 (Antioquia)"
          value={formData.id_departamento.toString()}
          onChange={(value) => setFormData({ ...formData, id_departamento: parseInt(value) || 0 })}
          type="text"
          required
        />
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
        <ConfigFormField
          id="edit-id_departamento"
          label="ID Departamento"
          placeholder="Ej: 5 (Antioquia)"
          value={formData.id_departamento.toString()}
          onChange={(value) => setFormData({ ...formData, id_departamento: parseInt(value) || 0 })}
          type="text"
          required
        />
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