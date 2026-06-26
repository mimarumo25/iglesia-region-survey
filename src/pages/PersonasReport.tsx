/**
 * Página de Reportes de Personas - Sistema MIA
 * 
 * @description Página completa para consultar personas consolidadas con múltiples filtros.
 * Usa el componente reutilizable PersonasTable para mostrar TODOS los campos de la API.
 * 
 * 🎯 **Características:**
 * - 6 tabs de consulta: Geográfico, Familia, Personal, Tallas, Edad, Reporte General
 * - Muestra TODOS los 40+ campos de la API en cada resultado
 * - Exportación a Excel por tab
 * - Filtros inteligentes con autocompletado
 * - Tabla horizontal scrollable para ver todos los campos
 * 
 * @version 2.0
 * @since Sistema MIA v2.0
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MapPin,
  Home,
  UserCircle,
  Shirt,
  Calendar,
  FileSpreadsheet
} from "lucide-react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { useGeographicFilters } from "@/hooks/useGeographicFilters";
import { useDestrezasFormulario } from "@/hooks/useDestrezasFormulario";
import { useLiderazgoFormulario } from "@/hooks/useLiderazgoFormulario";
import { useNecesidadesEnfermoOptions } from "@/hooks/useNecesidadesEnfermo";
import { useToast } from "@/hooks/use-toast";
import PersonasTable from "@/components/personas/PersonasTable";
import type { 
  PersonaConsolidada,
  FiltrosGeograficos,
  FiltrosFamilia,
  FiltrosPersonales,
  FiltrosTallas,
  FiltrosEdad,
  FiltrosReporteGeneral,
  PersonasResponse
} from "@/types/personas";
import { apiClient } from "@/interceptors/axios";
import ModernDatePicker from "@/components/ui/modern-date-picker";
import ReportActions from "@/components/reports/ReportActions";

const MONTH_OPTIONS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const parseLocalDate = (value?: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatLocalDate = (value?: Date) => {
  if (!value) return undefined;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 📊 Componente Principal de Reportes de Personas
 */
const PersonasReport = () => {
  const [activeTab, setActiveTab] = useState("geografico");
  const configData = useConfigurationData();
  const { destrezas: destrezasCatalogo } = useDestrezasFormulario();
  const { liderazgos: liderazgosCatalogo, isLoading: liderazgosLoading } = useLiderazgoFormulario();
  const { data: necesidadesEnfermoOptions = [], isLoading: necesidadesEnfermoLoading } = useNecesidadesEnfermoOptions();
  const { toast } = useToast();

  // Estados compartidos para resultados
  const [personas, setPersonas] = useState<PersonaConsolidada[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);

  // Estados para filtros de cada tab
  const [filtrosGeograficos, setFiltrosGeograficos] = useState<FiltrosGeograficos>({
    page: 1,
    limit: 100
  });

  // Hook para carga jerárquica de datos geográficos
  const geoFilters = useGeographicFilters({
    id_municipio: filtrosGeograficos.id_municipio,
    id_parroquia: filtrosGeograficos.id_parroquia,
    id_sector: filtrosGeograficos.id_sector,
    id_vereda: filtrosGeograficos.id_vereda,
    id_corregimiento: filtrosGeograficos.id_corregimiento,
    id_centro_poblado: filtrosGeograficos.id_centro_poblado
  });

  const [filtrosFamilia, setFiltrosFamilia] = useState<FiltrosFamilia>({
    page: 1,
    limit: 100
  });

  const geoFiltersFamilia = useGeographicFilters({
    id_municipio: filtrosFamilia.id_municipio,
    id_parroquia: filtrosFamilia.id_parroquia,
    id_sector: filtrosFamilia.id_sector,
    id_vereda: filtrosFamilia.id_vereda,
    id_corregimiento: filtrosFamilia.id_corregimiento,
    id_centro_poblado: filtrosFamilia.id_centro_poblado
  });

  const [filtrosPersonales, setFiltrosPersonales] = useState<FiltrosPersonales>({
    page: 1,
    limit: 100
  });

  const geoFiltersPersonal = useGeographicFilters({
    id_municipio: filtrosPersonales.id_municipio,
    id_parroquia: filtrosPersonales.id_parroquia,
    id_sector: filtrosPersonales.id_sector,
    id_vereda: filtrosPersonales.id_vereda,
    id_corregimiento: filtrosPersonales.id_corregimiento,
    id_centro_poblado: filtrosPersonales.id_centro_poblado
  });

  const [filtrosTallas, setFiltrosTallas] = useState<FiltrosTallas>({
    page: 1,
    limit: 100,
    id_sexo: undefined,
    sexo: undefined,
    edad_min: undefined,
    edad_max: undefined
  });

  const geoFiltersTallas = useGeographicFilters({
    id_municipio: filtrosTallas.id_municipio,
    id_parroquia: filtrosTallas.id_parroquia,
    id_sector: filtrosTallas.id_sector,
    id_vereda: filtrosTallas.id_vereda,
    id_corregimiento: filtrosTallas.id_corregimiento,
    id_centro_poblado: filtrosTallas.id_centro_poblado
  });

  const [filtrosEdad, setFiltrosEdad] = useState<FiltrosEdad>({
    page: 1,
    limit: 100
  });

  const geoFiltersEdad = useGeographicFilters({
    id_municipio: filtrosEdad.id_municipio,
    id_parroquia: filtrosEdad.id_parroquia,
    id_sector: filtrosEdad.id_sector,
    id_vereda: filtrosEdad.id_vereda,
    id_corregimiento: filtrosEdad.id_corregimiento,
    id_centro_poblado: filtrosEdad.id_centro_poblado
  });

  const [filtrosReporte, setFiltrosReporte] = useState<FiltrosReporteGeneral>({
    page: 1,
    limit: 100
  });

  // Hook adicional para filtros geográficos del tab de reporte general
  const geoFiltersReporte = useGeographicFilters({
    id_municipio: filtrosReporte.id_municipio,
    id_parroquia: filtrosReporte.id_parroquia,
    id_sector: filtrosReporte.id_sector,
    id_vereda: filtrosReporte.id_vereda,
    id_corregimiento: filtrosReporte.id_corregimiento,
    id_centro_poblado: filtrosReporte.id_centro_poblado
  });

  /**
   * 🔍 Consulta automática al entrar a un tab
   */
  useEffect(() => {
    if (!hasQueried) {
      handleQuery();
    }
  }, [activeTab]);

  /**
   * � Maneja el cambio de página
   */
  const handlePageChange = async (newPage: number) => {
    setIsLoading(true);
    
    try {
      let endpoint = '';
      let params: any = {};

      // Determinar endpoint y parámetros según el tab activo (con nueva página)
      switch (activeTab) {
        case 'geografico':
          endpoint = '/api/personas/consolidado/geografico';
          params = { ...filtrosGeograficos, page: newPage };
          setFiltrosGeograficos(prev => ({ ...prev, page: newPage }));
          break;
        
        case 'familia':
          endpoint = '/api/personas/consolidado/familia';
          params = { ...filtrosFamilia, page: newPage };
          setFiltrosFamilia(prev => ({ ...prev, page: newPage }));
          break;
        
        case 'personal':
          endpoint = '/api/personas/consolidado/personal';
          params = { ...filtrosPersonales, page: newPage };
          setFiltrosPersonales(prev => ({ ...prev, page: newPage }));
          break;
        
        case 'tallas':
          endpoint = '/api/personas/consolidado/tallas';
          params = { ...filtrosTallas, page: newPage };
          setFiltrosTallas(prev => ({ ...prev, page: newPage }));
          break;
        
        case 'edad':
          endpoint = '/api/personas/consolidado/edad';
          params = { ...filtrosEdad, page: newPage };
          setFiltrosEdad(prev => ({ ...prev, page: newPage }));
          break;
        
        case 'reporte':
          endpoint = '/api/personas/consolidado/reporte';
          params = { ...filtrosReporte, page: newPage };
          setFiltrosReporte(prev => ({ ...prev, page: newPage }));
          break;
        
        default:
          throw new Error('Tab inválido');
      }

      // Limpiar parámetros undefined
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '' && value !== 'all')
      );

      const response = await apiClient.get<PersonasResponse>(endpoint, { params: cleanParams });

      setPersonas(response.data.data);
      setTotal(response.data.total);

    } catch (error: any) {
      toast({
        title: "❌ Error en la consulta",
        description: error.response?.data?.message || "No se pudo obtener el consolidado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * �🔍 Función principal de consulta según el tab activo
   */
  const handleQuery = async () => {
    setIsLoading(true);
    setHasQueried(false);
    
    try {
      let endpoint = '';
      let params: any = {};

      // Determinar endpoint y parámetros según el tab activo
      switch (activeTab) {
        case 'geografico':
          endpoint = '/api/personas/consolidado/geografico';
          params = filtrosGeograficos;
          break;
        
        case 'familia':
          endpoint = '/api/personas/consolidado/familia';
          params = filtrosFamilia;
          break;
        
        case 'personal':
          endpoint = '/api/personas/consolidado/personal';
          params = { ...filtrosPersonales };
          break;
        
        case 'tallas':
          endpoint = '/api/personas/consolidado/tallas';
          params = filtrosTallas;
          break;
        
        case 'edad':
          endpoint = '/api/personas/consolidado/edad';
          params = filtrosEdad;
          break;
        
        case 'reporte':
          endpoint = '/api/personas/consolidado/reporte';
          params = { ...filtrosReporte };
          break;
        
        default:
          throw new Error('Tab inválido');
      }

      // Limpiar parámetros undefined
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '' && value !== 'all')
      );

      const response = await apiClient.get<PersonasResponse>(endpoint, { params: cleanParams });

      setPersonas(response.data.data);
      setTotal(response.data.total);
      setHasQueried(true);

      toast({
        title: "✅ Consulta exitosa",
        description: `Se encontraron ${response.data.total} personas`,
        variant: "default"
      });

    } catch (error: any) {
      toast({
        title: "❌ Error en la consulta",
        description: error.response?.data?.message || "No se pudo obtener el consolidado",
        variant: "destructive"
      });
      setPersonas([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 📥 Descarga el reporte en formato Excel
   */
  const handleExportToExcel = async () => {
    try {
      let endpoint = '';
      let params: any = {};

      // Determinar endpoint según tab activo
      switch (activeTab) {
        case 'geografico':
          endpoint = '/api/personas/consolidado/geografico';
          params = { ...filtrosGeograficos, format: 'excel' };
          break;
        case 'familia':
          endpoint = '/api/personas/consolidado/familia';
          params = { ...filtrosFamilia, format: 'excel' };
          break;
        case 'personal':
          endpoint = '/api/personas/consolidado/personal';
          params = { ...filtrosPersonales, format: 'excel' };
          break;
        case 'tallas':
          endpoint = '/api/personas/consolidado/tallas';
          params = { ...filtrosTallas, format: 'excel' };
          break;
        case 'edad':
          endpoint = '/api/personas/consolidado/edad';
          params = { ...filtrosEdad, format: 'excel' };
          break;
        case 'reporte':
          endpoint = '/api/personas/consolidado/reporte';
          params = { ...filtrosReporte, format: 'excel' };
          break;
      }

      // Limpiar parámetros undefined
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== '' && value !== 'all')
      );

      toast({
        title: "📥 Generando reporte...",
        description: "La descarga comenzará en breve",
        variant: "default"
      });

      const response = await apiClient.get(endpoint, {
        params: cleanParams,
        responseType: 'blob'
      });

      // Crear y descargar archivo
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `personas-${activeTab}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ Descarga exitosa",
        description: "El archivo Excel se ha descargado correctamente",
        variant: "default"
      });

    } catch (error: any) {
      console.error('Error exportando:', error);
      toast({
        title: "❌ Error en la exportación",
        description: error.response?.data?.message || "No se pudo descargar el reporte",
        variant: "destructive"
      });
    }
  };

  /**
   * 🧹 Limpia todos los filtros del tab activo
   */
  const clearFilters = () => {
    switch (activeTab) {
      case 'geografico':
        setFiltrosGeograficos({ page: 1, limit: 100 });
        break;
      case 'familia':
        setFiltrosFamilia({ page: 1, limit: 100 });
        break;
      case 'personal':
        setFiltrosPersonales({ page: 1, limit: 100 });
        break;
      case 'tallas':
        setFiltrosTallas({ 
          page: 1, 
          limit: 100,
          id_sexo: undefined,
          sexo: undefined,
          edad_min: undefined,
          edad_max: undefined
        });
        break;
      case 'edad':
        setFiltrosEdad({ page: 1, limit: 100 });
        break;
      case 'reporte':
        setFiltrosReporte({ page: 1, limit: 100 });
        break;
    }
    
    setPersonas([]);
    setTotal(0);
    setHasQueried(false);
  };

  const renderReportActions = () => (
    <ReportActions
      onClear={clearFilters}
      onQuery={handleQuery}
      onExport={handleExportToExcel}
      isLoading={isLoading}
      exportDisabled={personas.length === 0}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[98%] space-y-3 px-1.5 py-3 sm:space-y-6 sm:px-4 sm:py-6 lg:px-6 lg:py-8 2xl:max-w-[96%]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold sm:gap-3 sm:text-3xl">
              <Users className="h-5 w-5 text-primary sm:h-8 sm:w-8" />
              Reportes de Personas
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-base">
              Consulta y exporta información consolidada de personas según diferentes criterios
            </p>
          </div>
        </div>

        {/* Tabs de reportes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* TabsList responsive */}
          <div className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-sm sm:grid-cols-3 xl:grid-cols-6">
              <TabsTrigger value="geografico" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors data-[state=active]:border-primary/25 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/70 sm:text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Geográfico</span>
              </TabsTrigger>
              <TabsTrigger value="familia" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors data-[state=active]:border-primary/25 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/70 sm:text-sm">
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Familia</span>
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors data-[state=active]:border-primary/25 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/70 sm:text-sm">
                <UserCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="tallas" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors data-[state=active]:border-primary/25 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/70 sm:text-sm">
                <Shirt className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Tallas</span>
              </TabsTrigger>
              <TabsTrigger value="edad" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors data-[state=active]:border-primary/25 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/70 sm:text-sm">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Edad</span>
              </TabsTrigger>
              <TabsTrigger value="reporte" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors data-[state=active]:border-primary/25 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:bg-muted/70 sm:text-sm">
                <FileSpreadsheet className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Reporte</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content: Geográfico */}
          <TabsContent value="geografico" className="space-y-4 sm:space-y-6">
            <Card className="report-card">
              <CardHeader className="report-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Filtros Geográficos
                  </CardTitle>
                  {renderReportActions()}
                </div>
              </CardHeader>
              <CardContent className="report-card-content">
                <div className="report-filter-section report-filter-section-primary report-filter-fields grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosGeograficos.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_municipio: value ? Number(value) : undefined,
                        // Limpiar filtros dependientes al cambiar municipio
                        id_parroquia: undefined,
                        id_sector: undefined,
                        id_vereda: undefined,
                        id_corregimiento: undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label>Parroquia</Label>
                    <Autocomplete
                      options={geoFilters.parroquiaOptions}
                      value={filtrosGeograficos.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_parroquia: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={geoFilters.isLoadingParroquias}
                      emptyText={filtrosGeograficos.id_municipio ? "No se encontraron parroquias" : "Selecciona un municipio primero"}
                      disabled={!filtrosGeograficos.id_municipio}
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Autocomplete
                      options={geoFilters.sectorOptions}
                      value={filtrosGeograficos.id_sector?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_sector: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar sector..."
                      loading={geoFilters.isLoadingSectores}
                      emptyText={filtrosGeograficos.id_municipio ? "No se encontraron sectores" : "Selecciona un municipio primero"}
                      disabled={!filtrosGeograficos.id_municipio}
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label>Vereda</Label>
                    <Autocomplete
                      options={geoFilters.veredaOptions}
                      value={filtrosGeograficos.id_vereda?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_vereda: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar vereda..."
                      loading={geoFilters.isLoadingVeredas}
                      emptyText={filtrosGeograficos.id_municipio ? "No se encontraron veredas" : "Selecciona un municipio primero"}
                      disabled={!filtrosGeograficos.id_municipio}
                    />
                  </div>

                  {/* Corregimiento */}
                  <div className="space-y-2">
                    <Label>Corregimiento</Label>
                    <Autocomplete
                      options={geoFilters.corregimientoOptions}
                      value={filtrosGeograficos.id_corregimiento?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_corregimiento: value ? Number(value) : undefined,
                        // Limpiar centro poblado al cambiar corregimiento
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar corregimiento..."
                      loading={geoFilters.isLoadingCorregimientos}
                      emptyText={filtrosGeograficos.id_municipio ? "No se encontraron corregimientos" : "Selecciona un municipio primero"}
                      disabled={!filtrosGeograficos.id_municipio}
                    />
                  </div>

                  {/* Centro Poblado */}
                  <div className="space-y-2">
                    <Label>Centro Poblado</Label>
                    <Autocomplete
                      options={geoFilters.centroPobladoOptions}
                      value={filtrosGeograficos.id_centro_poblado?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_centro_poblado: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar centro poblado..."
                      loading={geoFilters.isLoadingCentrosPoblados}
                      emptyText={filtrosGeograficos.id_municipio ? "No se encontraron centros poblados" : "Selecciona un municipio primero"}
                      disabled={!filtrosGeograficos.id_municipio}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Resultados */}
            {hasQueried && (
              <PersonasTable 
                personas={personas} 
                isLoading={isLoading}
                total={total}
                currentPage={filtrosGeograficos.page || 1}
                pageSize={filtrosGeograficos.limit || 100}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>

          {/* Tab Content: Familia */}
          <TabsContent value="familia" className="space-y-4 sm:space-y-6">
            <Card className="report-card">
              <CardHeader className="report-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Filtros de Familia
                  </CardTitle>
                  {renderReportActions()}
                </div>
              </CardHeader>
              <CardContent className="report-card-content flex flex-col">
                <div className="report-section-title order-4 rounded-xl bg-secondary/[0.05] px-4 py-3">
                  Filtros específicos
                </div>
                <div className="report-filter-fields order-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Apellido Familiar */}
                  <div className="space-y-2">
                    <Label>Apellido Familiar</Label>
                    <Input
                      value={filtrosFamilia.apellido_familiar || ""}
                      onChange={(e) => setFiltrosFamilia(prev => ({ 
                        ...prev, 
                        apellido_familiar: e.target.value 
                      }))}
                      placeholder="Ej: García Rodríguez"
                    />
                  </div>

                  {/* Tipo de Vivienda */}
                  <div className="space-y-2">
                    <Label className={filtrosFamilia.apellido_familiar ? "text-muted-foreground" : ""}>Tipo de Vivienda</Label>
                    <Autocomplete
                      options={configData.tipoViviendaOptions}
                      value={filtrosFamilia.id_tipo_vivienda?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({ 
                        ...prev, 
                        id_tipo_vivienda: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar tipo..."
                      loading={configData.tiposViviendaLoading}
                      emptyText="No se encontraron tipos"
                      disabled={!!filtrosFamilia.apellido_familiar}
                    />
                  </div>

                  {/* Parentesco */}
                  <div className="space-y-2">
                    <Label className={filtrosFamilia.apellido_familiar ? "text-muted-foreground" : ""}>Parentesco</Label>
                    <Autocomplete
                      options={configData.parentescosOptions}
                      value={filtrosFamilia.id_parentesco?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({ 
                        ...prev, 
                        id_parentesco: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar parentesco..."
                      loading={configData.parentescosLoading}
                      emptyText="No se encontraron parentescos"
                      disabled={!!filtrosFamilia.apellido_familiar}
                    />
                  </div>
                </div>

                {/* Filtros Geográficos */}
                <Separator className="order-3 my-6" />
                <div className="report-section-title order-1 rounded-xl bg-primary/[0.05] px-4 py-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Ubicación geográfica</span>
                </div>
                <div className="report-filter-fields order-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosFamilia.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({
                        ...prev,
                        id_municipio: value ? Number(value) : undefined,
                        id_parroquia: undefined,
                        id_sector: undefined,
                        id_vereda: undefined,
                        id_corregimiento: undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label>Parroquia</Label>
                    <Autocomplete
                      options={geoFiltersFamilia.parroquiaOptions}
                      value={filtrosFamilia.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({
                        ...prev,
                        id_parroquia: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={geoFiltersFamilia.isLoadingParroquias}
                      emptyText={filtrosFamilia.id_municipio ? "No se encontraron parroquias" : "Selecciona un municipio primero"}
                      disabled={!filtrosFamilia.id_municipio}
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Autocomplete
                      options={geoFiltersFamilia.sectorOptions}
                      value={filtrosFamilia.id_sector?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({
                        ...prev,
                        id_sector: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar sector..."
                      loading={geoFiltersFamilia.isLoadingSectores}
                      emptyText={filtrosFamilia.id_municipio ? "No se encontraron sectores" : "Selecciona un municipio primero"}
                      disabled={!filtrosFamilia.id_municipio}
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label>Vereda</Label>
                    <Autocomplete
                      options={geoFiltersFamilia.veredaOptions}
                      value={filtrosFamilia.id_vereda?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({
                        ...prev,
                        id_vereda: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar vereda..."
                      loading={geoFiltersFamilia.isLoadingVeredas}
                      emptyText={filtrosFamilia.id_municipio ? "No se encontraron veredas" : "Selecciona un municipio primero"}
                      disabled={!filtrosFamilia.id_municipio}
                    />
                  </div>

                  {/* Corregimiento */}
                  <div className="space-y-2">
                    <Label>Corregimiento</Label>
                    <Autocomplete
                      options={geoFiltersFamilia.corregimientoOptions}
                      value={filtrosFamilia.id_corregimiento?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({
                        ...prev,
                        id_corregimiento: value ? Number(value) : undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar corregimiento..."
                      loading={geoFiltersFamilia.isLoadingCorregimientos}
                      emptyText={filtrosFamilia.id_municipio ? "No se encontraron corregimientos" : "Selecciona un municipio primero"}
                      disabled={!filtrosFamilia.id_municipio}
                    />
                  </div>

                  {/* Centro Poblado */}
                  <div className="space-y-2">
                    <Label>Centro Poblado</Label>
                    <Autocomplete
                      options={geoFiltersFamilia.centroPobladoOptions}
                      value={filtrosFamilia.id_centro_poblado?.toString() || ""}
                      onValueChange={(value) => setFiltrosFamilia(prev => ({
                        ...prev,
                        id_centro_poblado: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar centro poblado..."
                      loading={geoFiltersFamilia.isLoadingCentrosPoblados}
                      emptyText={filtrosFamilia.id_municipio ? "No se encontraron centros poblados" : "Selecciona un municipio primero"}
                      disabled={!filtrosFamilia.id_municipio}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Resultados */}
            {hasQueried && (
              <PersonasTable 
                personas={personas} 
                isLoading={isLoading}
                total={total}
                currentPage={filtrosFamilia.page || 1}
                pageSize={filtrosFamilia.limit || 100}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>

          {/* Tab Content: Personal */}
          <TabsContent value="personal" className="space-y-4 sm:space-y-6">
            <Card className="report-card">
              <CardHeader className="report-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Filtros Personales
                  </CardTitle>
                  {renderReportActions()}
                </div>
              </CardHeader>
              <CardContent className="report-card-content flex flex-col">
                <div className="report-section-title order-4 rounded-xl bg-secondary/[0.05] px-4 py-3">
                  Filtros específicos
                </div>
                <div className="report-filter-fields order-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Estado Civil */}
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Autocomplete
                      options={configData.estadoCivilOptions}
                      value={filtrosPersonales.id_estado_civil?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({ 
                        ...prev, 
                        id_estado_civil: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar estado civil..."
                      loading={configData.situacionesCivilesLoading}
                      emptyText="No se encontraron estados civiles"
                    />
                  </div>

                  {/* Profesión */}
                  <div className="space-y-2">
                    <Label>Profesión</Label>
                    <Autocomplete
                      options={configData.profesionesOptions}
                      value={filtrosPersonales.id_profesion?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({ 
                        ...prev, 
                        id_profesion: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar profesión..."
                      loading={configData.profesionesLoading}
                      emptyText="No se encontraron profesiones"
                    />
                  </div>

                  {/* Nivel Educativo */}
                  <div className="space-y-2">
                    <Label>Nivel Educativo</Label>
                    <Autocomplete
                      options={configData.estudiosOptions}
                      value={filtrosPersonales.id_nivel_educativo?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({ 
                        ...prev, 
                        id_nivel_educativo: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar nivel..."
                      loading={configData.estudiosLoading}
                      emptyText="No se encontraron niveles"
                    />
                  </div>

                  {/* Comunidad Cultural */}
                  <div className="space-y-2">
                    <Label>Comunidad Cultural</Label>
                    <Autocomplete
                      options={configData.comunidadesCulturalesOptions}
                      value={filtrosPersonales.id_comunidad_cultural?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({ 
                        ...prev, 
                        id_comunidad_cultural: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar comunidad..."
                      loading={configData.comunidadesCulturalesLoading}
                      emptyText="No se encontraron comunidades"
                    />
                  </div>

                  {/* Liderazgo */}
                  <div className="space-y-2">
                    <Label>Liderazgo</Label>
                    <Autocomplete
                      options={liderazgosCatalogo.map(l => ({
                        value: l.id,
                        label: l.nombre,
                        category: 'Liderazgo'
                      }))}
                      value={filtrosPersonales.id_liderazgo || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_liderazgo: value || undefined
                      }))}
                      placeholder="Seleccionar liderazgo..."
                      loading={liderazgosLoading}
                      emptyText="No se encontraron tipos de liderazgo"
                    />
                  </div>

                  {/* Destrezas */}
                  <div className="space-y-2">
                    <Label>Destrezas</Label>
                    <Autocomplete
                      options={destrezasCatalogo.map(d => ({
                        value: d.id.toString(),
                        label: d.nombre,
                        category: 'Destrezas'
                      }))}
                      value={filtrosPersonales.id_destreza?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_destreza: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar destreza..."
                      emptyText="No se encontraron destrezas"
                    />
                  </div>

                  {/* Necesidad del Enfermo */}
                  <div className="space-y-2">
                    <Label>Necesidad del Enfermo</Label>
                    <Autocomplete
                      options={necesidadesEnfermoOptions.map((necesidad) => ({
                        value: necesidad.id.toString(),
                        label: necesidad.nombre,
                        category: 'Necesidades del Enfermo'
                      }))}
                      value={filtrosPersonales.id_necesidad_enfermo?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_necesidad_enfermo: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar necesidad..."
                      loading={necesidadesEnfermoLoading}
                      emptyText="No se encontraron necesidades"
                    />
                  </div>
                  {/* Mes de nacimiento */}
                  <div className="space-y-2">
                    <Label>Mes de nacimiento</Label>
                    <Select
                      value={filtrosPersonales.mes_nacimiento?.toString() || "all"}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        mes_nacimiento: value === "all" ? undefined : Number(value)
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar mes..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los meses</SelectItem>
                        {MONTH_OPTIONS.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filtros Geográficos */}
                <Separator className="order-3 my-6" />
                <div className="report-section-title order-1 rounded-xl bg-primary/[0.05] px-4 py-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Ubicación geográfica</span>
                </div>
                <div className="report-filter-fields order-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosPersonales.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_municipio: value ? Number(value) : undefined,
                        id_parroquia: undefined,
                        id_sector: undefined,
                        id_vereda: undefined,
                        id_corregimiento: undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label>Parroquia</Label>
                    <Autocomplete
                      options={geoFiltersPersonal.parroquiaOptions}
                      value={filtrosPersonales.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_parroquia: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={geoFiltersPersonal.isLoadingParroquias}
                      emptyText={filtrosPersonales.id_municipio ? "No se encontraron parroquias" : "Selecciona un municipio primero"}
                      disabled={!filtrosPersonales.id_municipio}
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Autocomplete
                      options={geoFiltersPersonal.sectorOptions}
                      value={filtrosPersonales.id_sector?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_sector: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar sector..."
                      loading={geoFiltersPersonal.isLoadingSectores}
                      emptyText={filtrosPersonales.id_municipio ? "No se encontraron sectores" : "Selecciona un municipio primero"}
                      disabled={!filtrosPersonales.id_municipio}
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label>Vereda</Label>
                    <Autocomplete
                      options={geoFiltersPersonal.veredaOptions}
                      value={filtrosPersonales.id_vereda?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_vereda: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar vereda..."
                      loading={geoFiltersPersonal.isLoadingVeredas}
                      emptyText={filtrosPersonales.id_municipio ? "No se encontraron veredas" : "Selecciona un municipio primero"}
                      disabled={!filtrosPersonales.id_municipio}
                    />
                  </div>

                  {/* Corregimiento */}
                  <div className="space-y-2">
                    <Label>Corregimiento</Label>
                    <Autocomplete
                      options={geoFiltersPersonal.corregimientoOptions}
                      value={filtrosPersonales.id_corregimiento?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_corregimiento: value ? Number(value) : undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar corregimiento..."
                      loading={geoFiltersPersonal.isLoadingCorregimientos}
                      emptyText={filtrosPersonales.id_municipio ? "No se encontraron corregimientos" : "Selecciona un municipio primero"}
                      disabled={!filtrosPersonales.id_municipio}
                    />
                  </div>

                  {/* Centro Poblado */}
                  <div className="space-y-2">
                    <Label>Centro Poblado</Label>
                    <Autocomplete
                      options={geoFiltersPersonal.centroPobladoOptions}
                      value={filtrosPersonales.id_centro_poblado?.toString() || ""}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({
                        ...prev,
                        id_centro_poblado: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar centro poblado..."
                      loading={geoFiltersPersonal.isLoadingCentrosPoblados}
                      emptyText={filtrosPersonales.id_municipio ? "No se encontraron centros poblados" : "Selecciona un municipio primero"}
                      disabled={!filtrosPersonales.id_municipio}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Resultados */}
            {hasQueried && (
              <PersonasTable 
                personas={personas} 
                isLoading={isLoading}
                total={total}
                currentPage={filtrosPersonales.page || 1}
                pageSize={filtrosPersonales.limit || 100}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>

          {/* Tab Content: Tallas */}
          <TabsContent value="tallas" className="space-y-4 sm:space-y-6">
            <Card className="report-card">
              <CardHeader className="report-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    Filtros de Tallas
                  </CardTitle>
                  {renderReportActions()}
                </div>
              </CardHeader>
              <CardContent className="report-card-content flex flex-col">
                <div className="report-section-title order-4 rounded-xl bg-secondary/[0.05] px-4 py-3">
                  Filtros específicos
                </div>
                <div className="report-filter-fields order-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">

                  {/* Necesidad del Enfermo */}
                  <div className="space-y-2">
                    <Label>Necesidad del Enfermo</Label>
                    <Autocomplete
                      options={necesidadesEnfermoOptions.map((necesidad) => ({
                        value: necesidad.id.toString(),
                        label: necesidad.nombre,
                        category: 'Necesidades del Enfermo'
                      }))}
                      value={filtrosTallas.id_necesidad_enfermo?.toString() || ""}
                      onValueChange={(value) => setFiltrosTallas(prev => ({
                        ...prev,
                        id_necesidad_enfermo: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar necesidad..."
                      loading={necesidadesEnfermoLoading}
                      emptyText="No se encontraron necesidades"
                    />
                  </div>
                  {/* Talla Camisa */}
                  <div className="space-y-2">
                    <Label>Talla Camisa</Label>
                    <Input
                      value={filtrosTallas.talla_camisa || ""}
                      onChange={(e) => setFiltrosTallas(prev => ({ 
                        ...prev, 
                        talla_camisa: e.target.value 
                      }))}
                      placeholder="Ej: M, L, XL"
                    />
                  </div>

                  {/* Talla Pantalón */}
                  <div className="space-y-2">
                    <Label>Talla Pantalón</Label>
                    <Input
                      value={filtrosTallas.talla_pantalon || ""}
                      onChange={(e) => setFiltrosTallas(prev => ({ 
                        ...prev, 
                        talla_pantalon: e.target.value 
                      }))}
                      placeholder="Ej: 32, 34, 36"
                    />
                  </div>

                  {/* Talla Zapato */}
                  <div className="space-y-2">
                    <Label>Talla Zapato</Label>
                    <Input
                      value={filtrosTallas.talla_zapato || ""}
                      onChange={(e) => setFiltrosTallas(prev => ({ 
                        ...prev, 
                        talla_zapato: e.target.value 
                      }))}
                      placeholder="Ej: 38, 40, 42"
                    />
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <Label>Sexo</Label>
                    <Autocomplete
                      options={configData.sexoOptions}
                      value={filtrosTallas.id_sexo?.toString() || ""}
                      onValueChange={(value) => {
                        const selectedSexo = configData.sexoItems.find(s => s.id === value);
                        setFiltrosTallas(prev => ({ 
                          ...prev, 
                          id_sexo: value ? Number(value) : undefined,
                          sexo: selectedSexo?.nombre
                        }));
                      }}
                      placeholder="Seleccionar sexo..."
                      loading={configData.sexosLoading}
                    />
                  </div>

                  {/* Edad Mínima */}
                  <div className="space-y-2">
                    <Label>Edad Mínima</Label>
                    <Input
                      type="number"
                      min="0"
                      max="120"
                      value={filtrosTallas.edad_min || ""}
                      onChange={(e) => setFiltrosTallas(prev => ({ 
                        ...prev, 
                        edad_min: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Ej: 18"
                    />
                  </div>

                  {/* Edad Máxima */}
                  <div className="space-y-2">
                    <Label>Edad Máxima</Label>
                    <Input
                      type="number"
                      min="0"
                      max="120"
                      value={filtrosTallas.edad_max || ""}
                      onChange={(e) => setFiltrosTallas(prev => ({ 
                        ...prev, 
                        edad_max: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Ej: 65"
                    />
                  </div>
                </div>

                {/* Filtros Geográficos */}
                <Separator className="order-3 my-6" />
                <div className="report-section-title order-1 rounded-xl bg-primary/[0.05] px-4 py-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Ubicación geográfica</span>
                </div>
                <div className="report-filter-fields order-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosTallas.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosTallas(prev => ({
                        ...prev,
                        id_municipio: value ? Number(value) : undefined,
                        id_parroquia: undefined,
                        id_sector: undefined,
                        id_vereda: undefined,
                        id_corregimiento: undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label>Parroquia</Label>
                    <Autocomplete
                      options={geoFiltersTallas.parroquiaOptions}
                      value={filtrosTallas.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosTallas(prev => ({
                        ...prev,
                        id_parroquia: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={geoFiltersTallas.isLoadingParroquias}
                      emptyText={filtrosTallas.id_municipio ? "No se encontraron parroquias" : "Selecciona un municipio primero"}
                      disabled={!filtrosTallas.id_municipio}
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Autocomplete
                      options={geoFiltersTallas.sectorOptions}
                      value={filtrosTallas.id_sector?.toString() || ""}
                      onValueChange={(value) => setFiltrosTallas(prev => ({
                        ...prev,
                        id_sector: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar sector..."
                      loading={geoFiltersTallas.isLoadingSectores}
                      emptyText={filtrosTallas.id_municipio ? "No se encontraron sectores" : "Selecciona un municipio primero"}
                      disabled={!filtrosTallas.id_municipio}
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label>Vereda</Label>
                    <Autocomplete
                      options={geoFiltersTallas.veredaOptions}
                      value={filtrosTallas.id_vereda?.toString() || ""}
                      onValueChange={(value) => setFiltrosTallas(prev => ({
                        ...prev,
                        id_vereda: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar vereda..."
                      loading={geoFiltersTallas.isLoadingVeredas}
                      emptyText={filtrosTallas.id_municipio ? "No se encontraron veredas" : "Selecciona un municipio primero"}
                      disabled={!filtrosTallas.id_municipio}
                    />
                  </div>

                  {/* Corregimiento */}
                  <div className="space-y-2">
                    <Label>Corregimiento</Label>
                    <Autocomplete
                      options={geoFiltersTallas.corregimientoOptions}
                      value={filtrosTallas.id_corregimiento?.toString() || ""}
                      onValueChange={(value) => setFiltrosTallas(prev => ({
                        ...prev,
                        id_corregimiento: value ? Number(value) : undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar corregimiento..."
                      loading={geoFiltersTallas.isLoadingCorregimientos}
                      emptyText={filtrosTallas.id_municipio ? "No se encontraron corregimientos" : "Selecciona un municipio primero"}
                      disabled={!filtrosTallas.id_municipio}
                    />
                  </div>

                  {/* Centro Poblado */}
                  <div className="space-y-2">
                    <Label>Centro Poblado</Label>
                    <Autocomplete
                      options={geoFiltersTallas.centroPobladoOptions}
                      value={filtrosTallas.id_centro_poblado?.toString() || ""}
                      onValueChange={(value) => setFiltrosTallas(prev => ({
                        ...prev,
                        id_centro_poblado: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar centro poblado..."
                      loading={geoFiltersTallas.isLoadingCentrosPoblados}
                      emptyText={filtrosTallas.id_municipio ? "No se encontraron centros poblados" : "Selecciona un municipio primero"}
                      disabled={!filtrosTallas.id_municipio}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Resultados */}
            {hasQueried && (
              <PersonasTable 
                personas={personas} 
                isLoading={isLoading}
                total={total}
                currentPage={filtrosTallas.page || 1}
                pageSize={filtrosTallas.limit || 100}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>
          {/* Tab Content: Edad */}
          <TabsContent value="edad" className="space-y-4 sm:space-y-6">
            <Card className="report-card">
              <CardHeader className="report-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Filtros de Edad
                  </CardTitle>
                  {renderReportActions()}
                </div>
              </CardHeader>
              <CardContent className="report-card-content flex flex-col">
                <div className="report-section-title order-4 rounded-xl bg-secondary/[0.05] px-4 py-3">
                  Filtros específicos
                </div>
                <div className="report-filter-fields order-5 grid grid-cols-1 sm:grid-cols-2">
                  {/* Edad Mínima */}
                  <div className="space-y-2">
                    <Label>Edad Mínima</Label>
                    <Input
                      type="number"
                      min={0}
                      max={120}
                      value={filtrosEdad.edad_min || ""}
                      onChange={(e) => setFiltrosEdad(prev => ({ 
                        ...prev, 
                        edad_min: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Ej: 18"
                    />
                  </div>

                  {/* Edad Máxima */}
                  <div className="space-y-2">
                    <Label>Edad Máxima</Label>
                    <Input
                      type="number"
                      min={0}
                      max={120}
                      value={filtrosEdad.edad_max || ""}
                      onChange={(e) => setFiltrosEdad(prev => ({ 
                        ...prev, 
                        edad_max: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Ej: 65"
                    />
                  </div>
                  {/* Necesidad del Enfermo */}
                  <div className="space-y-2">
                    <Label>Necesidad del Enfermo</Label>
                    <Autocomplete
                      options={necesidadesEnfermoOptions.map((necesidad) => ({
                        value: necesidad.id.toString(),
                        label: necesidad.nombre,
                        category: 'Necesidades del Enfermo'
                      }))}
                      value={filtrosEdad.id_necesidad_enfermo?.toString() || ""}
                      onValueChange={(value) => setFiltrosEdad(prev => ({
                        ...prev,
                        id_necesidad_enfermo: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar necesidad..."
                      loading={necesidadesEnfermoLoading}
                      emptyText="No se encontraron necesidades"
                    />
                  </div>
                </div>

                {/* Filtros Geográficos */}
                <Separator className="order-3 my-6" />
                <div className="report-section-title order-1 rounded-xl bg-primary/[0.05] px-4 py-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Ubicación geográfica</span>
                </div>
                <div className="report-filter-fields order-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosEdad.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosEdad(prev => ({
                        ...prev,
                        id_municipio: value ? Number(value) : undefined,
                        id_parroquia: undefined,
                        id_sector: undefined,
                        id_vereda: undefined,
                        id_corregimiento: undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label>Parroquia</Label>
                    <Autocomplete
                      options={geoFiltersEdad.parroquiaOptions}
                      value={filtrosEdad.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosEdad(prev => ({
                        ...prev,
                        id_parroquia: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={geoFiltersEdad.isLoadingParroquias}
                      emptyText={filtrosEdad.id_municipio ? "No se encontraron parroquias" : "Selecciona un municipio primero"}
                      disabled={!filtrosEdad.id_municipio}
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Autocomplete
                      options={geoFiltersEdad.sectorOptions}
                      value={filtrosEdad.id_sector?.toString() || ""}
                      onValueChange={(value) => setFiltrosEdad(prev => ({
                        ...prev,
                        id_sector: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar sector..."
                      loading={geoFiltersEdad.isLoadingSectores}
                      emptyText={filtrosEdad.id_municipio ? "No se encontraron sectores" : "Selecciona un municipio primero"}
                      disabled={!filtrosEdad.id_municipio}
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label>Vereda</Label>
                    <Autocomplete
                      options={geoFiltersEdad.veredaOptions}
                      value={filtrosEdad.id_vereda?.toString() || ""}
                      onValueChange={(value) => setFiltrosEdad(prev => ({
                        ...prev,
                        id_vereda: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar vereda..."
                      loading={geoFiltersEdad.isLoadingVeredas}
                      emptyText={filtrosEdad.id_municipio ? "No se encontraron veredas" : "Selecciona un municipio primero"}
                      disabled={!filtrosEdad.id_municipio}
                    />
                  </div>

                  {/* Corregimiento */}
                  <div className="space-y-2">
                    <Label>Corregimiento</Label>
                    <Autocomplete
                      options={geoFiltersEdad.corregimientoOptions}
                      value={filtrosEdad.id_corregimiento?.toString() || ""}
                      onValueChange={(value) => setFiltrosEdad(prev => ({
                        ...prev,
                        id_corregimiento: value ? Number(value) : undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar corregimiento..."
                      loading={geoFiltersEdad.isLoadingCorregimientos}
                      emptyText={filtrosEdad.id_municipio ? "No se encontraron corregimientos" : "Selecciona un municipio primero"}
                      disabled={!filtrosEdad.id_municipio}
                    />
                  </div>

                  {/* Centro Poblado */}
                  <div className="space-y-2">
                    <Label>Centro Poblado</Label>
                    <Autocomplete
                      options={geoFiltersEdad.centroPobladoOptions}
                      value={filtrosEdad.id_centro_poblado?.toString() || ""}
                      onValueChange={(value) => setFiltrosEdad(prev => ({
                        ...prev,
                        id_centro_poblado: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar centro poblado..."
                      loading={geoFiltersEdad.isLoadingCentrosPoblados}
                      emptyText={filtrosEdad.id_municipio ? "No se encontraron centros poblados" : "Selecciona un municipio primero"}
                      disabled={!filtrosEdad.id_municipio}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Resultados */}
            {hasQueried && (
              <PersonasTable 
                personas={personas} 
                isLoading={isLoading}
                total={total}
                currentPage={filtrosEdad.page || 1}
                pageSize={filtrosEdad.limit || 100}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>

          {/* Tab Content: Reporte General */}
          <TabsContent value="reporte" className="space-y-4 sm:space-y-6">
            <Card className="report-card">
              <CardHeader className="report-card-header">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Reporte General Consolidado
                  </CardTitle>
                  {renderReportActions()}
                </div>
              </CardHeader>
              <CardContent className="report-card-content">
                <p className="text-sm text-muted-foreground mb-4">
                  Este tab combina todos los filtros disponibles para generar reportes personalizados.
                  Puedes mezclar filtros geográficos, familiares, personales, de tallas y edad.
                </p>
                <Separator className="my-4" />
                
                {/* Filtros simplificados para reporte general */}
                <div className="report-filter-fields grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <div className="report-section-title col-span-full rounded-xl bg-primary/[0.05] px-4 py-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      Ubicación geográfica
                    </span>
                  </div>

                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosReporte.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_municipio: value ? Number(value) : undefined,
                        // Limpiar filtros dependientes
                        id_parroquia: undefined,
                        id_sector: undefined,
                        id_vereda: undefined,
                        id_corregimiento: undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label>Parroquia</Label>
                    <Autocomplete
                      options={geoFiltersReporte.parroquiaOptions}
                      value={filtrosReporte.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_parroquia: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={geoFiltersReporte.isLoadingParroquias}
                      disabled={!filtrosReporte.id_municipio}
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Autocomplete
                      options={geoFiltersReporte.sectorOptions}
                      value={filtrosReporte.id_sector?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_sector: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar sector..."
                      loading={geoFiltersReporte.isLoadingSectores}
                      disabled={!filtrosReporte.id_municipio}
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label>Vereda</Label>
                    <Autocomplete
                      options={geoFiltersReporte.veredaOptions}
                      value={filtrosReporte.id_vereda?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_vereda: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar vereda..."
                      loading={geoFiltersReporte.isLoadingVeredas}
                      disabled={!filtrosReporte.id_municipio}
                    />
                  </div>

                  {/* Corregimiento */}
                  <div className="space-y-2">
                    <Label>Corregimiento</Label>
                    <Autocomplete
                      options={geoFiltersReporte.corregimientoOptions}
                      value={filtrosReporte.id_corregimiento?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_corregimiento: value ? Number(value) : undefined,
                        id_centro_poblado: undefined
                      }))}
                      placeholder="Seleccionar corregimiento..."
                      loading={geoFiltersReporte.isLoadingCorregimientos}
                      disabled={!filtrosReporte.id_municipio}
                    />
                  </div>

                  {/* Centro Poblado */}
                  <div className="space-y-2">
                    <Label>Centro Poblado</Label>
                    <Autocomplete
                      options={geoFiltersReporte.centroPobladoOptions}
                      value={filtrosReporte.id_centro_poblado?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_centro_poblado: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar centro poblado..."
                      loading={geoFiltersReporte.isLoadingCentrosPoblados}
                      disabled={!filtrosReporte.id_municipio}
                    />
                  </div>

                  <div className="report-section-title col-span-full mt-2 rounded-xl bg-secondary/[0.05] px-4 py-3">
                    Filtros específicos
                  </div>

                  {/* Apellido Familiar */}
                  <div className="space-y-2">
                    <Label>Apellido Familiar</Label>
                    <Input
                      value={filtrosReporte.apellido_familiar || ""}
                      onChange={(e) => setFiltrosReporte(prev => ({
                        ...prev,
                        apellido_familiar: e.target.value
                      }))}
                      placeholder="Ej: García Rodríguez"
                    />
                  </div>

                  {/* Tipo de Vivienda */}
                  <div className="space-y-2">
                    <Label>Tipo de Vivienda</Label>
                    <Autocomplete
                      options={configData.tipoViviendaOptions}
                      value={filtrosReporte.id_tipo_vivienda?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_tipo_vivienda: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar tipo..."
                      loading={configData.tiposViviendaLoading}
                    />
                  </div>

                  {/* Parentesco */}
                  <div className="space-y-2">
                    <Label>Parentesco</Label>
                    <Autocomplete
                      options={configData.parentescosOptions}
                      value={filtrosReporte.id_parentesco?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_parentesco: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar parentesco..."
                      loading={configData.parentescosLoading}
                    />
                  </div>

                  {/* Estado Civil */}
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Autocomplete
                      options={configData.estadoCivilOptions}
                      value={filtrosReporte.id_estado_civil?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_estado_civil: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar estado civil..."
                      loading={configData.situacionesCivilesLoading}
                    />
                  </div>

                  {/* Profesión */}
                  <div className="space-y-2">
                    <Label>Profesión</Label>
                    <Autocomplete
                      options={configData.profesionesOptions}
                      value={filtrosReporte.id_profesion?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_profesion: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar profesión..."
                      loading={configData.profesionesLoading}
                    />
                  </div>

                  {/* Nivel Educativo */}
                  <div className="space-y-2">
                    <Label>Nivel Educativo</Label>
                    <Autocomplete
                      options={configData.estudiosOptions}
                      value={filtrosReporte.id_nivel_educativo?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_nivel_educativo: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar nivel..."
                      loading={configData.estudiosLoading}
                    />
                  </div>

                  {/* Comunidad Cultural */}
                  <div className="space-y-2">
                    <Label>Comunidad Cultural</Label>
                    <Autocomplete
                      options={configData.comunidadesCulturalesOptions}
                      value={filtrosReporte.id_comunidad_cultural?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_comunidad_cultural: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar comunidad..."
                      loading={configData.comunidadesCulturalesLoading}
                    />
                  </div>

                  {/* Liderazgo */}
                  <div className="space-y-2">
                    <Label>Liderazgo</Label>
                    <Autocomplete
                      options={liderazgosCatalogo.map(l => ({
                        value: l.id,
                        label: l.nombre,
                        category: 'Liderazgo'
                      }))}
                      value={filtrosReporte.id_liderazgo || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_liderazgo: value || undefined
                      }))}
                      placeholder="Seleccionar liderazgo..."
                      loading={liderazgosLoading}
                      emptyText="No se encontraron tipos de liderazgo"
                    />
                  </div>

                  {/* Destreza */}
                  <div className="space-y-2">
                    <Label>Destreza</Label>
                    <Autocomplete
                      options={destrezasCatalogo.map(d => ({
                        value: d.id.toString(),
                        label: d.nombre,
                        category: 'Destrezas'
                      }))}
                      value={filtrosReporte.id_destreza?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_destreza: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar destreza..."
                      emptyText="No se encontraron destrezas"
                    />
                  </div>


                  {/* Necesidad del Enfermo */}
                  <div className="space-y-2">
                    <Label>Necesidad del Enfermo</Label>
                    <Autocomplete
                      options={necesidadesEnfermoOptions.map((necesidad) => ({
                        value: necesidad.id.toString(),
                        label: necesidad.nombre,
                        category: 'Necesidades del Enfermo'
                      }))}
                      value={filtrosReporte.id_necesidad_enfermo?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        id_necesidad_enfermo: value ? Number(value) : undefined
                      }))}
                      placeholder="Seleccionar necesidad..."
                      loading={necesidadesEnfermoLoading}
                      emptyText="No se encontraron necesidades"
                    />
                  </div>
                  {/* Talla Camisa */}
                  <div className="space-y-2">
                    <Label>Talla Camisa</Label>
                    <Input
                      value={filtrosReporte.talla_camisa || ""}
                      onChange={(e) => setFiltrosReporte(prev => ({
                        ...prev,
                        talla_camisa: e.target.value
                      }))}
                      placeholder="Ej: M, L, XL"
                    />
                  </div>

                  {/* Talla Pantalón */}
                  <div className="space-y-2">
                    <Label>Talla Pantalón</Label>
                    <Input
                      value={filtrosReporte.talla_pantalon || ""}
                      onChange={(e) => setFiltrosReporte(prev => ({
                        ...prev,
                        talla_pantalon: e.target.value
                      }))}
                      placeholder="Ej: 32, 34, 36"
                    />
                  </div>

                  {/* Talla Zapato */}
                  <div className="space-y-2">
                    <Label>Talla Zapato</Label>
                    <Input
                      value={filtrosReporte.talla_zapato || ""}
                      onChange={(e) => setFiltrosReporte(prev => ({
                        ...prev,
                        talla_zapato: e.target.value
                      }))}
                      placeholder="Ej: 38, 40, 42"
                    />
                  </div>

                  {/* Edad Mínima */}
                  <div className="space-y-2">
                    <Label>Edad Mínima</Label>
                    <Input
                      type="number"
                      value={filtrosReporte.edad_min || ""}
                      onChange={(e) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        edad_min: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Ej: 18"
                    />
                  </div>

                  {/* Edad Máxima */}
                  <div className="space-y-2">
                    <Label>Edad Máxima</Label>
                    <Input
                      type="number"
                      value={filtrosReporte.edad_max || ""}
                      onChange={(e) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        edad_max: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="Ej: 65"
                    />
                  </div>
                  {/* Mes de nacimiento */}
                  <div className="space-y-2">
                    <Label>Mes de nacimiento</Label>
                    <Select
                      value={filtrosReporte.mes_nacimiento?.toString() || "all"}
                      onValueChange={(value) => setFiltrosReporte(prev => ({
                        ...prev,
                        mes_nacimiento: value === "all" ? undefined : Number(value)
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar mes..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los meses</SelectItem>
                        {MONTH_OPTIONS.map((month, index) => (
                          <SelectItem key={month} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="report-section-title col-span-full mt-2 rounded-xl bg-muted/50 px-4 py-3">
                    Rango de fechas
                  </div>

                  {/* Fecha Registro Desde */}
                  <div className="space-y-2">
                    <Label>Fecha Registro Desde</Label>
                    <ModernDatePicker
                      value={parseLocalDate(filtrosReporte.fecha_registro_desde)}
                      onChange={(date) => setFiltrosReporte(prev => ({
                        ...prev,
                        fecha_registro_desde: formatLocalDate(date)
                      }))}
                      placeholder="Seleccionar fecha desde"
                      title="Fecha de registro (Desde)"
                      description="Elija la fecha inicial del registro"
                    />
                  </div>

                  {/* Fecha Registro Hasta */}
                  <div className="space-y-2">
                    <Label>Fecha Registro Hasta</Label>
                    <ModernDatePicker
                      value={parseLocalDate(filtrosReporte.fecha_registro_hasta)}
                      onChange={(date) => setFiltrosReporte(prev => ({
                        ...prev,
                        fecha_registro_hasta: formatLocalDate(date)
                      }))}
                      placeholder="Seleccionar fecha hasta"
                      title="Fecha de registro (Hasta)"
                      description="Elija la fecha final del registro"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Resultados */}
            {hasQueried && (
              <PersonasTable 
                personas={personas} 
                isLoading={isLoading}
                total={total}
                currentPage={filtrosReporte.page || 1}
                pageSize={filtrosReporte.limit || 100}
                onPageChange={handlePageChange}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PersonasReport;
