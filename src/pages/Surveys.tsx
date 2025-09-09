import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete, AutocompleteOption } from "@/components/ui/autocomplete";
import { AutocompleteWithLoading } from "@/components/ui/autocomplete-with-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Loader2,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Importar hooks de servicios
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { encuestasService, useEncuestas, EncuestaListItem, EncuestasFilters } from "@/services/encuestas";

// Importar modal de detalles
import { SurveyDetailModal } from "@/components/modales/SurveyDetailModal";

const Surveys = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("");
  const [surveyorFilter, setSurveyorFilter] = useState("");

  // Estados para datos de encuestas
  const [encuestas, setEncuestas] = useState<EncuestaListItem[]>([]);
  const [encuestasLoading, setEncuestasLoading] = useState(true);
  const [encuestasError, setEncuestasError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    in_progress: 0,
    cancelled: 0
  });

  // Estados para operaciones CRUD
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<EncuestaListItem | null>(null);

  // Estados para modal de detalles
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [selectedSurveyData, setSelectedSurveyData] = useState<Partial<EncuestaListItem> | undefined>(undefined);

  // Hook centralizado para cargar datos de configuración
  const {
    sectorOptions = [],
    sectoresLoading = false,
    sectoresError,
    userOptions: surveyorOptions = [],
    usersLoading = false,
    usersError,
    isAnyLoading = false
  } = useConfigurationData() || {}; // Fallback en caso de error del hook

  // Hook de encuestas
  const { getEncuestas, getEncuestasStats, deleteEncuesta } = useEncuestas();

  // ============================================================================
  // EFECTOS Y CARGAR DATOS
  // ============================================================================

  /**
   * Cargar encuestas desde la API
   */
  const loadEncuestas = useCallback(async (filters?: EncuestasFilters) => {
    setEncuestasLoading(true);
    setEncuestasError(null);

    try {
      const currentFilters: EncuestasFilters = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters
      };

      // Aplicar filtros de búsqueda
      if (searchTerm.trim()) {
        currentFilters.search = searchTerm.trim();
      }

      // Aplicar filtros de estado
      if (statusFilter !== "all") {
        currentFilters.estado = statusFilter;
      }

      // Aplicar filtros geográficos (si están disponibles en el futuro)
      if (sectorFilter) {
        const sectorOption = sectorOptions.find(s => s.value === sectorFilter);
        if (sectorOption) {
          currentFilters.sector_id = parseInt(sectorOption.value);
        }
      }

      console.log('🔍 Cargando encuestas con filtros:', currentFilters);

      const response = await getEncuestas(currentFilters);

      setEncuestas(response.data.encuestas);
      setPagination(response.data.pagination);

      // Cargar estadísticas si están disponibles
      if (response.data.stats) {
        setStats(response.data.stats);
      } else {
        loadStats();
      }

      console.log('✅ Encuestas cargadas exitosamente:', response.data.encuestas.length);

    } catch (error: any) {
      console.error('❌ Error al cargar encuestas:', error);
      setEncuestasError(error.message || 'Error al cargar encuestas');
      toast({
        variant: "destructive",
        title: "Error al cargar encuestas",
        description: error.message || 'Hubo un problema al cargar las encuestas'
      });
    } finally {
      setEncuestasLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, statusFilter, sectorFilter, sectorOptions, getEncuestas, toast]);

  /**
   * Cargar estadísticas de encuestas
   */
  const loadStats = useCallback(async () => {
    try {
      const statsData = await getEncuestasStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('❌ Error al cargar estadísticas:', error);
    }
  }, [getEncuestasStats]);

  /**
   * Efecto inicial para cargar datos
   */
  useEffect(() => {
    loadEncuestas();
  }, []);

  /**
   * Efecto para recargar cuando cambien los filtros
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadEncuestas();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, sectorFilter, surveyorFilter]);

  // ============================================================================
  // FUNCIONES CRUD
  // ============================================================================

  /**
   * Manejar eliminación de encuesta
   */
  const handleDeleteClick = (encuesta: EncuestaListItem) => {
    setItemToDelete(encuesta);
    setDeleteDialogOpen(true);
  };

  /**
   * Confirmar eliminación
   */
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete.id);

    try {
      await deleteEncuesta(itemToDelete.id);
      
      toast({
        title: "Encuesta eliminada",
        description: `La encuesta de ${itemToDelete.apellido_familiar} ha sido eliminada exitosamente`
      });

      // Recargar lista
      loadEncuestas();

    } catch (error: any) {
      console.error('❌ Error al eliminar encuesta:', error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error.message || 'Hubo un problema al eliminar la encuesta'
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  /**
   * Navegación a detalles
   */
  const handleViewDetails = (id: number) => {
    // navigate(`/surveys/${id}`);
    
    // Usar modal en lugar de navegación
    const encuesta = encuestas.find(e => parseInt(e.id_encuesta) === id);
    setSelectedSurveyId(id.toString());
    setSelectedSurveyData(encuesta);
    setDetailModalOpen(true);
  };

  /**
   * Cerrar modal de detalles
   */
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedSurveyId(null);
    setSelectedSurveyData(undefined);
  };

  /**
   * Navegación a edición
   */
  const handleEdit = (id: number) => {
    navigate(`/surveys/${id}/edit`);
  };

  // ============================================================================
  // FUNCIONES DE FILTRADO Y UTILIDADES
  // ============================================================================

  /**
   * Filtrar encuestas localmente (aplicado sobre los resultados de la API)
   */
  const filteredEncuestas = encuestas.filter(encuesta => {
    // Filtro por encuestador (si está disponible)
    if (surveyorFilter && encuesta.surveyor && encuesta.surveyor !== surveyorFilter) {
      return false;
    }
    
    return true;
  });

  /**
   * Recargar datos manualmente
   */
  const handleRefresh = () => {
    loadEncuestas();
  };

  /**
   * Limpiar filtros
   */
  const handleClearFilters = () => {
    setSearchTerm("");
    setSectorFilter("");
    setSurveyorFilter("");
    setStatusFilter("all");
  };

  // ============================================================================
  // COMPONENTES DE UI Y UTILIDADES
  // ============================================================================

  /**
   * Función para obtener el icono y color según el estado
   */
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Completada</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">En Progreso</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Cancelada</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pendiente</Badge>;
    }
  };

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Gestión de Encuestas
          </h1>
          <p className="text-gray-600">Administra todas las encuestas de caracterización familiar</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={encuestasLoading}
          >
            <RefreshCw className={`w-4 h-4 ${encuestasLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={() => navigate("/survey")} 
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Encuesta
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {encuestasLoading && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-gray-600">Cargando encuestas...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {encuestasError && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error al cargar encuestas</p>
                <p className="text-sm">{encuestasError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{stats.in_progress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de carga de servicios */}
      {isAnyLoading && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando datos de configuración...
              {sectoresLoading && <span>• Sectores</span>}
              {usersLoading && <span>• Usuarios</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por familia, sector o encuestador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                Filtros:
              </div>
              
              {/* Filtro por Estado */}
              <div className="min-w-[140px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Completadas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Sector */}
              <div className="min-w-[180px]">
                <AutocompleteWithLoading
                  options={sectorOptions}
                  value={sectorFilter}
                  onValueChange={setSectorFilter}
                  placeholder="Filtrar por sector..."
                  emptyText="No hay sectores disponibles"
                  searchPlaceholder="Buscar sector..."
                  isLoading={sectoresLoading}
                  error={sectoresError}
                  errorText="Error al cargar sectores"
                />
              </div>

              {/* Filtro por Encuestador */}
              <div className="min-w-[200px]">
                <AutocompleteWithLoading
                  options={surveyorOptions}
                  value={surveyorFilter}
                  onValueChange={setSurveyorFilter}
                  placeholder="Filtrar por encuestador..."
                  emptyText="No hay encuestadores disponibles"
                  searchPlaceholder="Buscar encuestador..."
                  isLoading={usersLoading}
                  error={usersError}
                  errorText="Error al cargar usuarios"
                />
              </div>

              {/* Botón para limpiar filtros */}
              {(sectorFilter || surveyorFilter || statusFilter !== "all" || searchTerm) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-gray-600"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Encuestas Registradas</CardTitle>
          <CardDescription>
            Lista completa de encuestas de caracterización familiar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Información Familiar</TableHead>
                <TableHead className="w-[200px]">Ubicación</TableHead>
                <TableHead className="w-[150px]">Encuestador</TableHead>
                <TableHead className="w-[120px]">Estado</TableHead>
                <TableHead className="w-[120px]">Fecha Creación</TableHead>
                <TableHead className="w-[120px]">Fecha Completada</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {encuestasLoading ? (
                // Estado de carga
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-16 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredEncuestas.length === 0 ? (
                // Estado vacío
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <FileText className="w-12 h-12" />
                      <p className="text-lg font-medium">No hay encuestas disponibles</p>
                      <p className="text-sm">
                        {searchTerm || statusFilter !== "all" || sectorFilter || surveyorFilter
                          ? "No se encontraron encuestas con los filtros aplicados"
                          : "Comienza creando tu primera encuesta"
                        }
                      </p>
                      {!(searchTerm || statusFilter !== "all" || sectorFilter || surveyorFilter) && (
                        <Button 
                          onClick={() => navigate("/survey")} 
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Encuesta
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Renderizar encuestas
                filteredEncuestas.map((encuesta) => (
                  <TableRow key={`encuesta-${encuesta.id_encuesta}`}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{encuesta.apellido_familiar}</p>
                          <Badge variant="outline" className="text-xs">
                            {encuesta.codigo_familia}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {encuesta.direccion_familia}
                        </div>
                        {encuesta.telefono && (
                          <p className="text-sm text-gray-500">📞 {encuesta.telefono}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>👥 {encuesta.miembros_familia.total_miembros} miembros</span>
                          {encuesta.personas_fallecidas.total_fallecidos > 0 && (
                            <span>💀 {encuesta.personas_fallecidas.total_fallecidos} fallecidos</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          🏠 {encuesta.tipo_vivienda.nombre}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {encuesta.sector?.nombre || "-"}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          📍 {encuesta.municipio?.nombre}
                        </div>
                        <div className="text-xs text-gray-500">
                          ⛪ {encuesta.parroquia?.nombre}
                        </div>
                        <div className="text-xs text-gray-500">
                          🌾 {encuesta.vereda?.nombre}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        {encuesta.surveyor || "No asignado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(encuesta.estado_encuesta)}
                        <div className="text-xs text-gray-500">
                          v{encuesta.metadatos.version}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {formatDate(encuesta.metadatos.fecha_creacion)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {encuesta.estado_encuesta === 'completed' ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {formatDate(encuesta.fecha_ultima_encuesta)}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            disabled={deletingId === parseInt(encuesta.id_encuesta)}
                          >
                            {deletingId === parseInt(encuesta.id_encuesta) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(parseInt(encuesta.id_encuesta))}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(parseInt(encuesta.id_encuesta))}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteClick({
                              ...encuesta,
                              id: parseInt(encuesta.id_encuesta)
                            })}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {filteredEncuestas.length} de {pagination.totalItems} encuestas
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1 || encuestasLoading}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages || encuestasLoading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar encuesta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la encuesta de{" "}
              <strong>{itemToDelete?.apellido_familiar}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletingId !== null}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deletingId !== null ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar encuesta'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de detalles de encuesta */}
      <SurveyDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
        surveyId={selectedSurveyId}
        initialData={selectedSurveyData}
      />
    </div>
  );
};

// Componente principal con error boundary simple
const SurveysWithSafeRenderer = () => (
  <ErrorBoundary
    fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al Cargar Encuestas
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Hubo un problema al cargar el componente. Por favor, recarga la página.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Recargar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    }
    onError={(error, errorInfo) => {
      console.error('Error en componente Surveys:', error);
      console.error('ErrorInfo:', errorInfo);
      
      // Logging específico para errores de DOM
      if (error.message?.includes('removeChild') || error.message?.includes('NotFoundError')) {
        console.warn('🔧 DOM manipulation error detected. Attempting automatic recovery...');
        // Auto-recovery después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }}
  >
    <Surveys />
  </ErrorBoundary>
);

export default SurveysWithSafeRenderer;
