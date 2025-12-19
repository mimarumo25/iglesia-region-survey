import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete, AutocompleteOption } from "@/components/ui/autocomplete";
import { AutocompleteWithLoading } from "@/components/ui/autocomplete-with-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
import { useEncuestas, useEncuestasList, ENCUESTAS_QUERY_KEYS } from "@/hooks/useEncuestas";
import { EncuestaListItem, EncuestasSearchParams, EncuestasResponse } from "@/services/encuestas";
import { useResponsiveTable } from "@/hooks/useResponsiveTable";

// Importar modal de detalles y componentes móviles
import { SurveyDetailModal } from "@/components/modales/SurveyDetailModal";
import { SurveyMobileCard } from "@/components/ui/SurveyMobileCard";
import { ConfigPagination } from "@/components/ui/config-pagination";

// Importar estilos para animaciones móviles
import "@/styles/mobile-animations.css";
import "@/styles/surveys-mobile.css";

const Surveys = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Hook para responsive design
  const { shouldUseMobileView, isMobile, isVerySmall } = useResponsiveTable();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("");
  const [surveyorFilter, setSurveyorFilter] = useState("");
  const [municipioFilter, setMunicipioFilter] = useState("");

  // Hook de encuestas con parámetros de consulta
  const [queryParams, setQueryParams] = useState<EncuestasSearchParams>({
    page: 1,
    limit: 10,
    q: searchTerm || undefined,
    sector: sectorFilter || undefined,
    encuestador_id: surveyorFilter || undefined,
    municipio: municipioFilter || undefined,
  });

  // Hook de encuestas para obtener datos
  const encuestasQuery = useEncuestasList(queryParams);

  // Extraer datos del query
  const encuestasData = encuestasQuery.data;
  const encuestasLoading = encuestasQuery.isLoading;
  const encuestasFetching = encuestasQuery.isFetching;
  const encuestasError = encuestasQuery.error;
  const refetchEncuestas = encuestasQuery.refetch;

  // Hook para mutations
  const {
    deleteEncuesta,
    isDeleting
  } = useEncuestas();

  // Estados para datos de encuestas (actualizados desde React Query)
  const encuestas = (encuestasData as EncuestasResponse)?.data || [];
  const paginationFromAPI = (encuestasData as EncuestasResponse)?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  };



  // Calcular estadísticas reales desde los datos del backend
  const stats = useMemo(() => {
    // Total de la paginación actual
    const totalEncuestas = paginationFromAPI.totalItems;
    
    // Contar encuestas en la página actual
    const encuestasPaginaActual = encuestas.length;
    
    // Contar sectores únicos
    const sectoresUnicos = new Set(encuestas.map(e => e.sector?.id).filter(Boolean)).size;
    
    // Contar municipios únicos
    const municipiosUnicos = new Set(encuestas.map(e => e.municipio?.id).filter(Boolean)).size;
    
    // Contar familias únicas (por apellido)
    const familiasUnicas = new Set(encuestas.map(e => e.apellido_familiar).filter(Boolean)).size;
    
    return {
      total: totalEncuestas,
      enPagina: encuestasPaginaActual,
      sectores: sectoresUnicos,
      municipios: municipiosUnicos,
      familias: familiasUnicas,
    };
  }, [encuestas, paginationFromAPI]);

  // Estados para operaciones CRUD
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    municipioOptions = [],
    municipiosLoading = false,
    municipiosError,
    userOptions: surveyorOptions = [],
    usersLoading = false,
    usersError,
    isAnyLoading = false
  } = useConfigurationData() || {}; // Fallback en caso de error del hook

  // ============================================================================
  // EFECTOS Y SINCRONIZACIÓN
  // ============================================================================

  /**
   * Actualizar parámetros de consulta cuando cambien los filtros
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQueryParams({
        page: 1, // Resetear a la primera página al filtrar
        limit: paginationFromAPI.itemsPerPage,
        q: searchTerm || undefined,
        sector: sectorFilter || undefined,
        encuestador_id: surveyorFilter || undefined,
        municipio: municipioFilter || undefined,
      });
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sectorFilter, surveyorFilter, municipioFilter, paginationFromAPI.itemsPerPage]);

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

    setDeletingId(itemToDelete.id_encuesta);

    try {
      await deleteEncuesta.mutateAsync(itemToDelete.id_encuesta);

      toast({
        title: "Encuesta eliminada",
        description: `La encuesta de ${itemToDelete.apellido_familiar} ha sido eliminada exitosamente`
      });

      // React Query invalidará automáticamente y recargará los datos
      // No es necesario llamar loadEncuestas() ya que el hook useEncuestas
      // maneja la invalidación automática al eliminar

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
  const handleViewDetails = (id: string | number) => {
    const idString = typeof id === 'number' ? id.toString() : id;

    // Navegar a la página completa de detalles
    navigate(`/surveys/${idString}`);
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
  const handleEdit = (id: string | number) => {
    const idString = typeof id === 'number' ? id.toString() : id;
    navigate(`/surveys/${idString}/edit`);
  };

  // Alias para compatibilidad con SurveyMobileCard
  const handleEditSurvey = handleEdit;

  // ============================================================================
  // FUNCIONES DE FILTRADO Y UTILIDADES
  // ============================================================================

  /**
   * Filtrar encuestas localmente (aplicado sobre los resultados de la API)
   */
  const filteredEncuestas = encuestas.filter(encuesta => {
    // La API ya maneja el filtro de encuestador, no necesitamos filtrar localmente
    return true;
  });

  /**
   * Recargar datos manualmente
   */
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ENCUESTAS_QUERY_KEYS.all });
  };

  /**
   * Limpiar filtros
   */
  const handleClearFilters = () => {
    setSearchTerm("");
    setSectorFilter("");
    setSurveyorFilter("");
    setMunicipioFilter("");
  };

  /**
   * Manejar cambio de página
   */
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  /**
   * Manejar cambio de items por página
   */
  const handleItemsPerPageChange = (limit: number) => {
    setQueryParams(prev => ({ ...prev, page: 1, limit }));
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
        return <Badge className="bg-success/10 text-success dark:bg-success/20 hover:bg-success/20 dark:hover:bg-success/30">Completada</Badge>;
      case "validated":
        return <Badge className="bg-success/15 text-success dark:bg-success/25 hover:bg-success/25 dark:hover:bg-success/35">Validada</Badge>;
      case "in_progress":
        return <Badge className="bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30">En Progreso</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/10 text-destructive dark:bg-destructive/20 hover:bg-destructive/20 dark:hover:bg-destructive/30">Cancelada</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning dark:bg-warning/20 hover:bg-warning/20 dark:hover:bg-warning/30">Pendiente</Badge>;
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
    <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
      {/* Header - Responsive */}
      <div className={cn(
        "flex gap-4 mb-6",
        shouldUseMobileView ? "flex-col" : "flex-col md:flex-row md:items-center md:justify-between"
      )}>
        <div>
          <h1 className={cn(
            "font-bold text-foreground flex items-center gap-3",
            shouldUseMobileView ? "text-2xl" : "text-3xl"
          )}>
            <FileText className={cn(
              "text-primary",
              shouldUseMobileView ? "w-6 h-6" : "w-8 h-8"
            )} />
            Gestión de Encuestas
          </h1>
          <p className={cn(
            "text-muted-foreground",
            shouldUseMobileView ? "text-sm mt-1" : ""
          )}>
            Administra todas las encuestas de caracterización familiar
          </p>
        </div>
        <div className={cn(
          "flex gap-2",
          shouldUseMobileView ? "flex-col" : ""
        )}>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={encuestasFetching}
            size={shouldUseMobileView ? "sm" : "default"}
          >
            <RefreshCw className={`w-4 h-4 ${encuestasFetching ? 'animate-spin' : ''}`} />
            {shouldUseMobileView ? "Actualizar" : "Actualizar"}
          </Button>
          <Button
            onClick={() => navigate("/survey")}
            className={cn(
              "flex items-center gap-2 font-semibold button-ripple",
              shouldUseMobileView
                ? "mobile-primary-button text-white shadow-lg w-full justify-center py-3"
                : ""
            )}
            size={shouldUseMobileView ? "lg" : "default"}
          >
            <Plus className={cn(
              shouldUseMobileView ? "w-5 h-5" : "w-4 h-4"
            )} />
            {shouldUseMobileView ? "📝 Nueva Encuesta" : "Nueva Encuesta"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {encuestasLoading && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando encuestas...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {encuestasError && (
        <Card className="mb-6 border-destructive/30 bg-destructive/10 dark:bg-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error al cargar encuestas</p>
                <p className="text-sm">{encuestasError.message || 'Error desconocido'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards - Responsive: 1, 2, 3, 5 columnas */}
      <div className="grid gap-3 sm:gap-4 mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Card 1: Total de Encuestas - siempre visible */}
        <Card className="card-enhanced hover:border-primary/40">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                <FileText className="text-primary w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground dark:text-muted-foreground text-xs sm:text-sm font-semibold">
                  Total Encuestas
                </p>
                <p className="font-bold text-foreground text-2xl sm:text-3xl">
                  {stats.total.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Familias Registradas - visible desde tablet */}
        <Card className="hidden sm:block card-enhanced hover:border-secondary/40">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 rounded-lg flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                <User className="text-secondary w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground dark:text-muted-foreground text-xs sm:text-sm font-semibold">
                  Familias
                </p>
                <p className="font-bold text-foreground text-2xl sm:text-3xl">
                  {stats.familias.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Sectores - visible desde laptop */}
        <Card className="hidden lg:block card-enhanced hover:border-success/40">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 rounded-lg flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                <MapPin className="text-success w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground dark:text-muted-foreground text-xs sm:text-sm font-semibold">
                  Sectores
                </p>
                <p className="font-bold text-foreground text-2xl sm:text-3xl">
                  {stats.sectores.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Municipios - solo visible en desktop */}
        <Card className="hidden xl:block card-enhanced hover:border-warning/40">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 rounded-lg flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                <MapPin className="text-warning w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground dark:text-muted-foreground text-xs sm:text-sm font-semibold">
                  Municipios
                </p>
                <p className="font-bold text-foreground text-2xl sm:text-3xl">
                  {stats.municipios.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: En Página Actual - solo visible en desktop */}
        <Card className="hidden xl:block card-enhanced hover:border-primary/40">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                <FileText className="text-primary w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground dark:text-muted-foreground text-xs sm:text-sm font-semibold">
                  En Página
                </p>
                <p className="font-bold text-foreground text-2xl sm:text-3xl">
                  {stats.enPagina.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading skeleton para servicios */}
      {isAnyLoading && (
        <LoadingSkeleton
          showServices={true}
          variant="compact"
          className="mb-6"
        />
      )}

      {/* Filters - Responsive */}
      <Card className="mb-6">
        <CardContent className={cn(
          "p-4",
          shouldUseMobileView && "p-3"
        )}>
          <div className={cn(
            "gap-4",
            shouldUseMobileView
              ? "space-y-4"
              : "flex flex-col w-full"
          )}>
            {!shouldUseMobileView && (
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Filter className="w-4 h-4 text-primary" />
                Filtros de Búsqueda
              </div>
            )}

            {/* Grid de filtros - Responsive Grid System */}
            <div className="grid gap-3 sm:gap-4 items-end grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {/* Search Term - Full width on mobile/tablet, 2 cols on desktop */}
              <div className="space-y-1.5 col-span-full xl:col-span-2">
                <label className="text-xs font-bold text-muted-foreground/80 dark:text-muted-foreground uppercase tracking-wider ml-1">
                  Búsqueda General
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
                  <Input
                    placeholder="Buscar por apellido, parroquia, sector o municipio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-white"
                  />
                </div>
              </div>

              {/* Filtro por Municipio - siempre visible */}
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-bold text-muted-foreground/80 dark:text-muted-foreground uppercase tracking-wider ml-1">
                  Municipio
                </label>
                <div className="h-10">
                  <AutocompleteWithLoading
                    options={municipioOptions}
                    value={municipioFilter}
                    onValueChange={setMunicipioFilter}
                    placeholder="Todos los municipios"
                    emptyText="No encontrado"
                    searchPlaceholder="Buscar municipio..."
                    isLoading={municipiosLoading}
                    error={municipiosError}
                    errorText="Error al cargar"
                  />
                </div>
              </div>

              {/* Filtro por Sector - siempre visible */}
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-bold text-muted-foreground/80 dark:text-muted-foreground uppercase tracking-wider ml-1">
                  Sector
                </label>
                <div className="h-10">
                  <AutocompleteWithLoading
                    options={sectorOptions}
                    value={sectorFilter}
                    onValueChange={setSectorFilter}
                    placeholder="Todos los sectores"
                    emptyText="No encontrado"
                    searchPlaceholder="Buscar sector..."
                    isLoading={sectoresLoading}
                    error={sectoresError}
                    errorText="Error al cargar"
                  />
                </div>
              </div>

              {/* Filtro por Encuestador - siempre visible */}
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-bold text-muted-foreground/80 dark:text-muted-foreground uppercase tracking-wider ml-1">
                  Encuestador
                </label>
                <div className="h-10">
                  <AutocompleteWithLoading
                    options={surveyorOptions}
                    value={surveyorFilter}
                    onValueChange={setSurveyorFilter}
                    placeholder="Todos los encuestadores"
                    emptyText="No encontrado"
                    searchPlaceholder="Buscar encuestador..."
                    isLoading={usersLoading}
                    error={usersError}
                    errorText="Error al cargar"
                  />
                </div>
              </div>
            </div>

            {/* Botón de limpiar filtros */}
            {(sectorFilter || surveyorFilter || municipioFilter || searchTerm) && (
              <div className="flex justify-end pt-2 border-t border-border/50 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {shouldUseMobileView ? "Limpiar Filtros" : "Limpiar todos los filtros"}
                </Button>
              </div>
            )}
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
        <CardContent className={cn(shouldUseMobileView && "p-3")}>
          {shouldUseMobileView ? (
            // Vista móvil: Cards
            <div className="space-y-3 mobile-view-transition">
              {encuestasLoading ? (
                // Estado de carga móvil
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={`skeleton-mobile-${index}`} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-8" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : filteredEncuestas.length === 0 ? (
                // Estado vacío móvil
                <div className="flex flex-col items-center gap-4 text-muted-foreground py-12 px-4 empty-state-mobile">
                  <div className="text-6xl mb-2">📋</div>
                  <p className="text-lg font-semibold text-foreground">No hay encuestas disponibles</p>
                  <p className="text-sm text-center text-muted-foreground">
                    {searchTerm || sectorFilter || surveyorFilter || municipioFilter
                      ? "No se encontraron encuestas con los filtros aplicados"
                      : "Comienza creando tu primera encuesta familiar"
                    }
                  </p>
                  {!(searchTerm || sectorFilter || surveyorFilter || municipioFilter) && (
                    <Button
                      onClick={() => navigate("/survey")}
                      className="mt-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg px-6 py-3 button-ripple mobile-primary-button"
                      size="lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      📝 Crear Primera Encuesta
                    </Button>
                  )}
                </div>
              ) : (
                // Renderizar encuestas móviles
                filteredEncuestas.map((encuesta) => (
                  <SurveyMobileCard
                    key={`mobile-encuesta-${encuesta.id_encuesta}`}
                    encuesta={encuesta}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditSurvey}
                    onDelete={handleDeleteClick}
                    isDeleting={deletingId === encuesta.id_encuesta}
                    compact={isVerySmall}
                  />
                ))
              )}
            </div>
          ) : (
            // Vista desktop: Tabla tradicional
            <div className="desktop-view-transition">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <TableHead className="w-[320px] font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <span>👨‍👩‍👧‍👦</span>
                        <span>Información Familiar</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[220px] font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Ubicación Geográfica</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[160px] font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Encuestador</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[130px] font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Creación</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[130px] font-semibold text-primary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Completada</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right w-[100px] font-semibold text-primary">Acciones</TableHead>
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
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredEncuestas.length === 0 ? (
                    // Estado vacío
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <div className="text-6xl mb-2">📋</div>
                          <p className="text-lg font-semibold text-foreground">No hay encuestas disponibles</p>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm || sectorFilter || surveyorFilter
                              ? "No se encontraron encuestas con los filtros aplicados"
                              : "Comienza creando tu primera encuesta familiar"
                            }
                          </p>
                          {!(searchTerm || sectorFilter || surveyorFilter) && (
                            <Button
                              onClick={() => navigate("/survey")}
                              className="mt-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg button-ripple"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              📝 Nueva Encuesta
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Renderizar encuestas
                    filteredEncuestas.map((encuesta) => (
                      <TableRow 
                        key={`encuesta-${encuesta.id_encuesta}`} 
                        className="hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors cursor-pointer"
                        onDoubleClick={() => handleViewDetails(encuesta.id_encuesta)}
                        title="Doble clic para ver detalles"
                      >
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            {/* Apellido y código */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Familia:</span>
                              <p className="font-bold text-foreground text-base">{encuesta.apellido_familiar}</p>
                              <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary font-medium">
                                {encuesta.codigo_familia}
                              </Badge>
                            </div>
                            
                            {/* Dirección */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Dirección:</span>
                              <div className="flex items-center gap-1.5 text-sm text-foreground/90">
                                <MapPin className="w-3.5 h-3.5 text-primary/60" />
                                <span>{encuesta.direccion_familia}</span>
                              </div>
                            </div>
                            
                            {/* Teléfono */}
                            {encuesta.telefono && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Teléfono:</span>
                                <p className="text-sm text-foreground/90 font-semibold">📞 {encuesta.telefono}</p>
                              </div>
                            )}
                            
                            {/* Estadísticas */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Miembros:</span>
                              <div className="flex items-center gap-3 text-xs">
                                <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 border-primary/30">
                                  👥 {encuesta.miembros_familia.total_miembros} Total
                                </Badge>
                                {encuesta.deceasedMembers && encuesta.deceasedMembers.length > 0 && (
                                  <Badge variant="secondary" className="bg-secondary/10 text-secondary dark:bg-secondary/20 border-secondary/30">
                                    💀 {encuesta.deceasedMembers.length} Fallecidos
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {/* Tipo de vivienda */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Vivienda:</span>
                              <Badge variant="outline" className="text-xs bg-muted/30 dark:bg-muted/20">
                                🏠 {encuesta.tipo_vivienda?.nombre || "-"}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            {/* Sector */}
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[65px] flex-shrink-0">Sector:</span>
                              <span className="text-sm text-foreground/90 font-medium">{encuesta.sector?.nombre || "-"}</span>
                            </div>
                            
                            {/* Municipio */}
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[65px] flex-shrink-0">Municipio:</span>
                              <span className="text-sm text-foreground/90 font-medium">📍 {encuesta.municipio?.nombre}</span>
                            </div>
                            
                            {/* Parroquia */}
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[65px] flex-shrink-0">Parroquia:</span>
                              <span className="text-sm text-foreground/90 font-medium">⛪ {encuesta.parroquia?.nombre}</span>
                            </div>
                            
                            {/* Vereda */}
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-semibold text-muted-foreground min-w-[65px] flex-shrink-0">Vereda:</span>
                              <span className="text-sm text-foreground/90 font-medium">🌾 {encuesta.vereda?.nombre}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {encuesta.encuestador?.nombre || encuesta.usuario_creador || 'Sistema'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-primary/60" />
                              <span className="text-sm font-semibold text-foreground/90">{formatDate(encuesta.metadatos.fecha_creacion)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground pl-5 font-medium">Registro inicial</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {encuesta.estado_encuesta === 'completed' ? (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-success" />
                                <span className="text-sm font-semibold text-foreground/90">{formatDate(encuesta.fecha_ultima_encuesta)}</span>
                              </div>
                              <span className="text-xs text-success pl-5 font-bold">Finalizada</span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-warning" />
                                <span className="text-muted-foreground">-</span>
                              </div>
                              <span className="text-xs text-warning pl-5 font-bold">En proceso</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-9 px-3 hover:bg-primary/10 hover:text-primary transition-colors group"
                                disabled={deletingId === encuesta.id_encuesta}
                                title="Opciones de encuesta"
                              >
                                {deletingId === encuesta.id_encuesta ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <MoreHorizontal className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    <span className="ml-1.5 text-xs font-medium hidden group-hover:inline">Opciones</span>
                                  </>
                                )}
                                <span className="sr-only">Abrir menú de opciones</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(encuesta.id_encuesta)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(encuesta.id_encuesta)}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(encuesta)}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {paginationFromAPI.totalItems > 0 && (
        <ConfigPagination
          currentPage={paginationFromAPI.currentPage}
          totalPages={paginationFromAPI.totalPages}
          totalItems={paginationFromAPI.totalItems}
          itemsPerPage={paginationFromAPI.itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPageSelector={true}
          itemsPerPageOptions={[5, 10, 20, 50, 100]}
          variant={shouldUseMobileView ? "compact" : "complete"}
          showInfo={true}
          showFirstLast={!shouldUseMobileView}
          maxVisiblePages={5}
          loading={encuestasLoading}
          infoText="Mostrando {start}-{end} de {total} encuestas"
          size="md"
        />
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

      {/* Botón flotante para móviles cuando hay contenido */}
      {shouldUseMobileView && filteredEncuestas.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => navigate("/survey")}
            className="fab-button bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 p-0"
            size="lg"
            title="Nueva Encuesta"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente principal con error boundary optimizado
const SurveysWithSafeRenderer = () => (
  <ErrorBoundary
    maxRetries={3}
    showErrorDetails={import.meta.env.DEV}
    onError={(error, errorInfo) => {
      console.error('Error en componente Surveys:', error);
    }}
  >
    <Surveys />
  </ErrorBoundary>
);

export default SurveysWithSafeRenderer;
