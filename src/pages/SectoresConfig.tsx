import { useCallback, useMemo, useState } from 'react';
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
import { useSectores } from '@/hooks/useSectores';
import { useMunicipios } from '@/hooks/useMunicipios';
import { Sector, SectorFormData } from '@/types/sectores';
import { Municipio } from '@/services/municipios';
import { municipiosToOptions } from '@/lib/utils';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';

const SectoresPage = () => {
  const sectoresHook = useSectores();
  const municipiosHook = useMunicipios();

  // Estados para paginación y filtros
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_sector');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries de React Query - Ahora con query unificado
  const { data: sectoresResponse, isLoading: sectoresLoading, refetch: refetchSectores } = sectoresHook.useSectoresQuery(page, limit, sortBy, sortOrder, searchTerm);
  const { data: municipios, isLoading: municipiosLoading } = municipiosHook.useAllMunicipiosQuery();

  const municipioOptions = useMemo(() => {
    const allMunicipios = (municipios ?? []) as Municipio[];
    if (allMunicipios.length === 0) return [];

    return municipiosToOptions(
      allMunicipios.map((municipio) => ({
        id_municipio: municipio.id_municipio ?? '',
        nombre_municipio: municipio.nombre_municipio ?? 'Sin nombre',
        departamento: municipio.departamento
          ? { nombre: municipio.departamento.nombre }
          : undefined,
      })),
      false
    );
  }, [municipios]);

  const municipioNameMap = useMemo(() => {
    const map = new Map<string | number, string>();
    const allMunicipios = (municipios ?? []) as Municipio[];

    allMunicipios.forEach((municipio) => {
      if (!municipio) return;
      const displayName = municipio.nombre_municipio ?? 'Sin municipio';
      const rawId = municipio.id_municipio;

      if (rawId !== undefined && rawId !== null) {
        map.set(rawId, displayName);

        const numericId = Number(rawId);
        if (!Number.isNaN(numericId)) {
          map.set(numericId, displayName);
        }
      }
    });

    return map;
  }, [municipios]);

  const resolveMunicipioName = useCallback(
    (sectorItem: Sector): string => {
      if (typeof sectorItem.municipioNombre === 'string' && sectorItem.municipioNombre.trim().length > 0) {
        return sectorItem.municipioNombre;
      }

      const rawId = sectorItem.id_municipio;
      if (rawId === null || rawId === undefined) {
        return 'Sin municipio';
      }

      const numericId = typeof rawId === 'string' ? Number(rawId) : rawId;

      if (typeof rawId === 'string' && municipioNameMap.has(rawId)) {
        return municipioNameMap.get(rawId) ?? 'Sin municipio';
      }

      if (!Number.isNaN(numericId) && municipioNameMap.has(numericId)) {
        return municipioNameMap.get(numericId) ?? 'Sin municipio';
      }

      return municipioNameMap.get(rawId) ?? 'Sin municipio';
    },
    [municipioNameMap]
  );

  // Mutaciones de React Query
  const createMutation = sectoresHook.useCreateSectorMutation();
  const updateMutation = sectoresHook.useUpdateSectorMutation();
  const deleteMutation = sectoresHook.useDeleteSectorMutation();

  const sectores = sectoresResponse?.data?.sectores || [];
  const pagination = sectoresResponse?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  };

  const loading = sectoresLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

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
  
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState<SectorFormData>({
    nombre: '',
    id_municipio: 0,
  });

  // Manejo del formulario
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || formData.id_municipio === 0) return;

    createMutation.mutate({
      nombre: formData.nombre.trim(),
      id_municipio: formData.id_municipio,
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setFormData({ 
          nombre: '', 
          id_municipio: 0,
        });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSector || !formData.nombre.trim() || formData.id_municipio === 0) return;

    updateMutation.mutate({
      id: selectedSector.id_sector,
      data: {
        nombre: formData.nombre.trim(),
        id_municipio: formData.id_municipio,
      }
    }, {
      onSuccess: () => {
        setShowEditDialog(false);
        setSelectedSector(null);
        setFormData({ 
          nombre: '', 
          id_municipio: 0,
        });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedSector) return;

    deleteMutation.mutate(selectedSector.id_sector, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedSector(null);
      }
    });
  };

  // Funciones para abrir diálogos
  const handleOpenCreateDialog = () => {
    setFormData({ nombre: '', id_municipio: 0 });
    openCreateDialog();
  };

  const handleOpenEditDialog = (sector: Sector) => {
    setSelectedSector(sector);
    setFormData({
      nombre: sector.nombre,
      id_municipio: (() => {
        if (typeof sector.id_municipio === 'number') {
          return sector.id_municipio;
        }

        if (typeof sector.id_municipio === 'string') {
          const parsed = Number(sector.id_municipio);
          return Number.isNaN(parsed) ? 0 : parsed;
        }

        return 0;
      })(),
    });
    openEditDialog();
  };

  const handleOpenDeleteDialog = (sector: Sector) => {
    setSelectedSector(sector);
    openDeleteDialog();
  };

  // Manejo de búsqueda en tiempo real
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1); // Resetear a primera página
  };

  // Limpiar búsqueda
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
    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }
    return parsedDate.toLocaleDateString('es-ES');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Building2 className="w-8 h-8 text-muted-foreground" />
            Gestión de Sectores
          </h1>
          <p className="text-muted-foreground mt-2">Administra los sectores para encuestas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchSectores()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Sector
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por nombre o municipio..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="flex-1"
            />
            {searchTerm && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
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
                <p className="text-sm text-muted-foreground">Total Sectores</p>
                <p className="text-2xl font-bold text-foreground">{pagination.totalCount}</p>
              </div>
              <Building2 className="w-8 h-8 text-muted-foreground" />
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
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de sectores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="w-5 h-5" />
            Listado de Sectores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando sectores...</span>
            </div>
          ) : sectores.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron sectores</p>
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
                    <TableHead>Municipio</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Fecha Actualización</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectores.map((sector) => (
                    <TableRow key={sector.id_sector}>
                      <TableCell className="font-medium">{sector.id_sector}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="font-medium">{sector.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {resolveMunicipioName(sector)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(sector.created_at)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(sector.updated_at)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(sector)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(sector)}
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
                itemsPerPage={sectores.length > 0 ? Math.ceil(pagination.totalCount / pagination.totalPages) : 10}
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

      {/* Modal de Crear Sector */}
      <ConfigModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        type="create"
        title="Nuevo Sector"
        description="Crea un nuevo sector en el sistema"
        icon={Building2}
        loading={createMutation.isPending}
        onSubmit={handleCreateSubmit}
        submitText="Crear Sector"
      >
        <ConfigFormField
          id="nombre"
          label="Nombre del Sector"
          placeholder="Ej: Sector San José"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <ConfigFormField
          id="municipio"
          label="Municipio"
          type="autocomplete"
          placeholder="Selecciona un municipio"
          searchPlaceholder="Buscar municipio..."
          emptyText="No se encontraron municipios"
          value={formData.id_municipio ? formData.id_municipio.toString() : ''}
          onChange={(value) => setFormData({
            ...formData,
            id_municipio: value ? Number.parseInt(value, 10) || 0 : 0,
          })}
          options={municipioOptions}
          loading={municipiosLoading}
          disabled={municipiosLoading}
          required
        />

      </ConfigModal>

      {/* Modal de Editar Sector */}
      <ConfigModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        type="edit"
        title="Editar Sector"
        description="Modifica los datos del sector"
        icon={Edit2}
        loading={updateMutation.isPending}
        onSubmit={handleEditSubmit}
        submitText="Guardar Cambios"
      >
        <ConfigFormField
          id="edit-nombre"
          label="Nombre del Sector"
          placeholder="Ej: Sector San José"
          value={formData.nombre}
          onChange={(value) => setFormData({ ...formData, nombre: value })}
          required
        />
        
        <ConfigFormField
          id="edit-municipio"
          label="Municipio"
          type="autocomplete"
          placeholder="Selecciona un municipio"
          searchPlaceholder="Buscar municipio..."
          emptyText="No se encontraron municipios"
          value={formData.id_municipio ? formData.id_municipio.toString() : ''}
          onChange={(value) => setFormData({
            ...formData,
            id_municipio: value ? Number.parseInt(value, 10) || 0 : 0,
          })}
          options={municipioOptions}
          loading={municipiosLoading}
          disabled={municipiosLoading}
          required
        />

      </ConfigModal>

      {/* Modal de Eliminar Sector */}
      <ConfigModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        type="delete"
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el sector"
        icon={Trash2}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        entityName={selectedSector?.nombre}
        submitText="Eliminar Sector"
      />
    </div>
  );
};

export default SectoresPage;
