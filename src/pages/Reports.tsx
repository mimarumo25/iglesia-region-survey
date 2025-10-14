/**
 * Página de Reportes - Sistema MIA
 * Vista principal con tabs para diferentes tipos de reportes
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Heart, 
  Calendar, 
  FileSpreadsheet,
  RefreshCw,
  Loader2,
  Search
} from "lucide-react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import DifuntosReportPage from "@/components/difuntos/DifuntosReportPage";
import { useToast } from "@/hooks/use-toast";
import { getFamiliasConsolidado, exportFamiliasToExcel } from "@/services/familias";
import type { FamiliaConsolidada } from "@/types/familias";
import FamiliasAccordionList from "@/components/familias/FamiliasAccordionList";
import { useSaludData } from "@/hooks/useSaludData";
import type { SaludFiltros } from "@/types/salud";
import SaludList from "@/components/salud/SaludList";

/**
 * 📊 Módulo de Reportes y Estadísticas - Sistema MIA
 * 
 * Este componente implementa un sistema completo de filtros avanzados y generación
 * de reportes para diferentes módulos del sistema parroquial.
 * 
 * ✨ **Funcionalidades Implementadas:**
 * 
 * ### 🏛️ **Reportes de Parroquias**
 * - **Filtros Geográficos**: Municipio y parroquia con autocompletado inteligente
 * - **Filtros de Infraestructura**: Tipo de vivienda, sistema de acueducto, aguas residuales
 * - **Filtros de Servicios**: Disposición de basura y servicios públicos
 * - **Controles Avanzados**: Paginación numérica, límites configurables (50-1000)
 * - **Estadísticas Opcionales**: Switch para incluir/excluir datos estadísticos detallados
 * 
 * ### 👨‍👩‍👧‍👦 **Reportes de Familias**
 * - **Filtros Demográficos**: Sexo, parentesco, rangos de edad
 * - **Filtros Familiares**: Familias sin padre, sin madre, composición familiar
 * - **Ubicación**: Parroquia, municipio, sector específico
 * - **Configuración**: Incluir detalles, límites de resultados
 * 
 * 🔧 **Características Técnicas:**
 * - Integración completa con `useConfigurationData` para autocompletados
 * - Validación en tiempo real de filtros
 * - Exportación dual: PDF + Excel para cada tipo de reporte
 * - Estado reactivo con TypeScript interfaces tipadas
 * - Limpieza de filtros con un solo click
 * - Navegación por tabs responsive
 * 
 * 📁 **Estructura de Filtros:**
 * ```typescript
 * interface ParroquiasFilters {
 *   municipio: string;                    // Usando configData.municipioOptions
 *   parroquia: string;                   // Usando configData.parroquiaOptions
 *   tipo_vivienda: string;               // Usando configData.tiposViviendaOptions
 *   sistema_acueducto: string;           // Usando configData.sistemasAcueductoOptions
 *   tipo_aguas_residuales: string;       // Usando configData.aguasResidualesOptions
 *   disposicion_basura: string;          // Usando configData.disposicionBasuraOptions
 *   incluir_estadisticas: boolean;       // Switch para estadísticas detalladas
 *   pagina: number;                      // Paginación (default: 1)
 *   limitado: number;                    // Límite de resultados (50/100/250/500/1000)
 * }
 * ```
 * 
 * 🎨 **Componentes UI Utilizados:**
 * - `Autocomplete` - Para filtros con búsqueda inteligente
 * - `Switch` - Para toggles de opciones booleanas
 * - `Select` - Para opciones predefinidas (límites, rangos)
 * - `Input` - Para campos numéricos (página, edades)
 * - `Tabs` - Navegación entre tipos de reportes
 * 
 * @version 2.0
 * @since Sistema MIA v1.0
 * @author Equipo de desarrollo MIA
 */
/**
 * Interfaz para los filtros de reportes de familias (Consolidado)
 */
interface FamiliasFilters {
  parroquia: string;
  municipio: string;
  sector: string;
  vereda: string;
  limite: number;
  offset: number;
}

/**
 * Interfaz para los filtros de reportes de salud
 */
interface SaludFiltersUI {
  enfermedad: string;
  edad_min: string;
  edad_max: string;
  sexo: string;
  parroquia: string;
  municipio: string;
  sector: string;
  limite: number;
  offset: number;
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState("familias");
  const configData = useConfigurationData();
  const { toast } = useToast();

  // Hook para gestión de datos de salud
  const {
    personas: personasSalud,
    total: saludTotal,
    isLoading: saludLoading,
    hasQueried: saludQueried,
    fetchPersonas: fetchSaludPersonas,
    exportToExcel: exportSaludExcel,
    resetData: resetSaludData
  } = useSaludData();

  // Estados para filtros de Familias
  const [familiasFilters, setFamiliasFilters] = useState<FamiliasFilters>({
    parroquia: "",
    municipio: "",
    sector: "",
    vereda: "",
    limite: 100,
    offset: 0
  });

  // Estados para resultados y UI de Familias (Consolidado)
  const [familiasConsolidado, setFamiliasConsolidado] = useState<FamiliaConsolidada[]>([]);
  const [familiasLoading, setFamiliasLoading] = useState(false);
  const [familiasQueried, setFamiliasQueried] = useState(false);

  // Estados para filtros de Salud
  const [saludFilters, setSaludFilters] = useState<SaludFiltersUI>({
    enfermedad: "",
    edad_min: "",
    edad_max: "",
    sexo: "",
    parroquia: "",
    municipio: "",
    sector: "",
    limite: 100,
    offset: 0
  });

  // Estado de paginación para Salud
  const [saludCurrentPage, setSaludCurrentPage] = useState(1);
  const saludLimite = saludFilters.limite || 10;
  const saludTotalPages = Math.ceil(saludTotal / saludLimite);

  /**
   * Maneja el cambio de página en Salud
   */
  const handleSaludPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > saludTotalPages) return;
    
    setSaludCurrentPage(newPage);
    const newOffset = (newPage - 1) * saludLimite;
    setSaludFilters(prev => ({ ...prev, offset: newOffset }));
  };

  /**
   * Maneja cambios en filtros de Familias
   */
  const handleFamiliasFilterChange = (key: keyof FamiliasFilters, value: any) => {
    setFamiliasFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Maneja cambios en filtros de Salud
   */
  const handleSaludFilterChange = (key: keyof SaludFiltersUI, value: any) => {
    setSaludFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Limpia todos los filtros de Familias
   */
  const clearFamiliasFilters = () => {
    setFamiliasFilters({
      parroquia: "",
      municipio: "",
      sector: "",
      vereda: "",
      limite: 100,
      offset: 0
    });
    setFamiliasConsolidado([]);
    setFamiliasQueried(false);
  };

  /**
   * Limpia todos los filtros de Salud
   */
  const clearSaludFilters = () => {
    setSaludFilters({
      enfermedad: "",
      edad_min: "",
      edad_max: "",
      sexo: "",
      parroquia: "",
      municipio: "",
      sector: "",
      limite: 100,
      offset: 0
    });
    setSaludCurrentPage(1); // Resetear paginación
    resetSaludData();
  };

  /**
   * 🔍 Consulta automática al entrar al tab de familias
   */
  useEffect(() => {
    if (activeTab === "familias" && !familiasQueried) {
      handleQueryFamilias();
    }
  }, [activeTab]);

  /**
   * 🔍 Consulta automática al entrar al tab de salud
   */
  useEffect(() => {
    if (activeTab === "salud" && !saludQueried) {
      handleQuerySalud();
    }
  }, [activeTab]);

  /**
   * 🔍 Re-consulta cuando cambia el offset (cambio de página)
   */
  useEffect(() => {
    if (activeTab === "salud" && saludQueried && saludFilters.offset !== 0) {
      handleQuerySalud();
    }
  }, [saludFilters.offset]);

  /**
   * 🔍 Consulta el consolidado de familias con los filtros actuales
   */
  const handleQueryFamilias = async () => {
    setFamiliasLoading(true);
    setFamiliasQueried(false);
    
    try {
      // Convertir filtros del componente al formato de la API
      const filtrosAPI = {
        id_parroquia: familiasFilters.parroquia ? Number(familiasFilters.parroquia) : undefined,
        id_municipio: familiasFilters.municipio ? Number(familiasFilters.municipio) : undefined,
        id_sector: familiasFilters.sector ? Number(familiasFilters.sector) : undefined,
        id_vereda: familiasFilters.vereda ? Number(familiasFilters.vereda) : undefined,
        limite: familiasFilters.limite,
        offset: familiasFilters.offset
      };

      const response = await getFamiliasConsolidado(filtrosAPI);

      setFamiliasConsolidado(response);
      setFamiliasQueried(true);

      toast({
        title: "✅ Consulta exitosa",
        description: `Se encontraron ${response.length} familias`,
        variant: "default"
      });

    } catch (error: any) {
      console.error('Error consultando familias:', error);
      toast({
        title: "❌ Error en la consulta",
        description: error.message || "No se pudo obtener el consolidado de familias",
        variant: "destructive"
      });
      setFamiliasConsolidado([]);
    } finally {
      setFamiliasLoading(false);
    }
  };

  /**
   * 📥 Descarga el reporte de familias en formato Excel
   */
  const handleExportFamiliasToExcel = async () => {
    try {
      // Convertir filtros del componente al formato de la API
      const filtrosAPI = {
        id_parroquia: familiasFilters.parroquia ? Number(familiasFilters.parroquia) : undefined,
        id_municipio: familiasFilters.municipio ? Number(familiasFilters.municipio) : undefined,
        id_sector: familiasFilters.sector ? Number(familiasFilters.sector) : undefined,
        id_vereda: familiasFilters.vereda ? Number(familiasFilters.vereda) : undefined,
        limite: familiasFilters.limite,
        offset: familiasFilters.offset
      };

      toast({
        title: "📥 Generando reporte...",
        description: "La descarga comenzará en breve",
        variant: "default"
      });

      await exportFamiliasToExcel(filtrosAPI);

      toast({
        title: "✅ Descarga exitosa",
        description: "El archivo Excel se ha descargado correctamente",
        variant: "default"
      });

    } catch (error: any) {
      console.error('Error exportando familias:', error);
      toast({
        title: "❌ Error en la exportación",
        description: error.message || "No se pudo descargar el reporte de familias",
        variant: "destructive"
      });
    }
  };

  /**
   * 🔍 Consulta el consolidado de salud con los filtros actuales
   */
  const handleQuerySalud = async () => {
    // Convertir filtros del UI al formato de la API
    const filtrosAPI: SaludFiltros = {
      id_enfermedad: saludFilters.enfermedad ? Number(saludFilters.enfermedad) : undefined,
      edad_min: saludFilters.edad_min ? Number(saludFilters.edad_min) : undefined,
      edad_max: saludFilters.edad_max ? Number(saludFilters.edad_max) : undefined,
      id_sexo: saludFilters.sexo ? Number(saludFilters.sexo) : undefined,
      id_parroquia: saludFilters.parroquia ? Number(saludFilters.parroquia) : undefined,
      id_municipio: saludFilters.municipio ? Number(saludFilters.municipio) : undefined,
      id_sector: saludFilters.sector ? Number(saludFilters.sector) : undefined,
      limite: saludFilters.limite,
      offset: saludFilters.offset
    };

    await fetchSaludPersonas(filtrosAPI);
  };

  /**
   * 🔍 Consulta con reseteo de paginación (cuando se cambian filtros)
   */
  const handleQuerySaludWithReset = async () => {
    // Resetear a página 1
    setSaludCurrentPage(1);
    setSaludFilters(prev => ({ ...prev, offset: 0 }));
    
    // Esperar un tick para que se actualice el estado
    setTimeout(() => {
      handleQuerySalud();
    }, 0);
  };

  /**
   * 📥 Descarga el reporte de salud en formato Excel
   */
  const handleExportSaludToExcel = async () => {
    // Obtener el nombre de la enfermedad seleccionada
    const enfermedadNombre = saludFilters.enfermedad 
      ? configData.enfermedadesOptions.find(opt => opt.value === saludFilters.enfermedad)?.label
      : undefined;

      
    // Convertir filtros del UI al formato de la API
    const filtrosAPI: SaludFiltros = {
      id_enfermedad: saludFilters.enfermedad ? Number(saludFilters.enfermedad) : undefined,
      enfermedad: enfermedadNombre, // Nombre de la enfermedad para el reporte
      edad_min: saludFilters.edad_min ? Number(saludFilters.edad_min) : undefined,
      edad_max: saludFilters.edad_max ? Number(saludFilters.edad_max) : undefined,
      id_sexo: saludFilters.sexo ? Number(saludFilters.sexo) : undefined,
      id_parroquia: saludFilters.parroquia ? Number(saludFilters.parroquia) : undefined,
      id_municipio: saludFilters.municipio ? Number(saludFilters.municipio) : undefined,
      id_sector: saludFilters.sector ? Number(saludFilters.sector) : undefined,
      limite: 5000 // Límite alto para exportación completa
    };

    await exportSaludExcel(filtrosAPI);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8 space-y-8">
        {/* Tabs de reportes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="familias" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Familias</span>
            </TabsTrigger>
            <TabsTrigger value="salud" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Salud</span>
            </TabsTrigger>
            <TabsTrigger value="difuntos" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Difuntos</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: Familias */}
          <TabsContent value="familias" className="space-y-6">
            {/* Card de filtros y botones de exportación */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Reportes de Familias
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">

                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFamiliasFilters}
                      disabled={familiasLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Limpiar
                    </Button>
                    <Button 
                      onClick={handleQueryFamilias}
                      disabled={familiasLoading}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                    >
                      {familiasLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Consultar Familias
                    </Button>
                    <Button 
                      onClick={handleExportFamiliasToExcel}
                      disabled={familiasLoading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Descargar Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Campos de filtros - Ubicación geográfica */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_parroquia">Parroquia</Label>
                    <Autocomplete
                      options={configData.parroquiaOptions}
                      value={familiasFilters.parroquia}
                      onValueChange={(value) => handleFamiliasFilterChange('parroquia', value)}
                      placeholder="Seleccionar parroquia..."
                      loading={configData.parroquiasLoading}
                      emptyText="No se encontraron parroquias"
                    />
                  </div>

                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_municipio">Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={familiasFilters.municipio}
                      onValueChange={(value) => handleFamiliasFilterChange('municipio', value)}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_sector">Sector</Label>
                    <Autocomplete
                      options={configData.sectorOptions}
                      value={familiasFilters.sector}
                      onValueChange={(value) => handleFamiliasFilterChange('sector', value)}
                      placeholder="Seleccionar sector..."
                      loading={configData.sectoresLoading}
                      emptyText="No se encontraron sectores"
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_vereda">Vereda</Label>
                    <Autocomplete
                      options={configData.veredaOptions}
                      value={familiasFilters.vereda}
                      onValueChange={(value) => handleFamiliasFilterChange('vereda', value)}
                      placeholder="Seleccionar vereda..."
                      loading={configData.veredasLoading}
                      emptyText="No se encontraron veredas"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Resultados */}
            {familiasQueried && (
              <FamiliasAccordionList 
                familias={familiasConsolidado} 
                isLoading={familiasLoading}
              />
            )}
          </TabsContent>

          {/* Tab Content: Salud */}
          <TabsContent value="salud" className="space-y-6">
            {/* Card de filtros y botones de exportación */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Reportes de Salud
                    </CardTitle>
                    <CardDescription>
                      Estadísticas de personas con condiciones de salud
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearSaludFilters}
                      disabled={saludLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Limpiar
                    </Button>
                    <Button 
                      onClick={handleQuerySaludWithReset}
                      disabled={saludLoading}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                    >
                      {saludLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Consultar
                    </Button>
                    <Button 
                      onClick={handleExportSaludToExcel}
                      disabled={saludLoading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Descargar Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Campos de filtros - Datos de salud */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Enfermedad */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_enfermedad">Enfermedad</Label>
                    <Autocomplete
                      options={configData.enfermedadesOptions}
                      value={saludFilters.enfermedad}
                      onValueChange={(value) => handleSaludFilterChange('enfermedad', value)}
                      placeholder="Seleccionar enfermedad..."
                      loading={configData.enfermedadesLoading}
                      emptyText="No se encontraron enfermedades"
                    />
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_sexo">Sexo</Label>
                    <Autocomplete
                      options={configData.sexoOptions}
                      value={saludFilters.sexo}
                      onValueChange={(value) => handleSaludFilterChange('sexo', value)}
                      placeholder="Seleccionar sexo..."
                      loading={configData.sexosLoading}
                      emptyText="No se encontraron opciones"
                    />
                  </div>

                  {/* Edad Mínima */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_edad_min">Edad Mínima</Label>
                    <Input
                      id="salud_edad_min"
                      type="number"
                      min={0}
                      max={120}
                      value={saludFilters.edad_min}
                      onChange={(e) => handleSaludFilterChange('edad_min', e.target.value)}
                      placeholder="Ej: 18"
                      className="w-full"
                    />
                  </div>

                  {/* Edad Máxima */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_edad_max">Edad Máxima</Label>
                    <Input
                      id="salud_edad_max"
                      type="number"
                      min={0}
                      max={120}
                      value={saludFilters.edad_max}
                      onChange={(e) => handleSaludFilterChange('edad_max', e.target.value)}
                      placeholder="Ej: 65"
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Filtros de ubicación geográfica */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_parroquia">Parroquia</Label>
                    <Autocomplete
                      options={configData.parroquiaOptions}
                      value={saludFilters.parroquia}
                      onValueChange={(value) => handleSaludFilterChange('parroquia', value)}
                      placeholder="Seleccionar parroquia..."
                      loading={configData.parroquiasLoading}
                      emptyText="No se encontraron parroquias"
                    />
                  </div>

                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_municipio">Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={saludFilters.municipio}
                      onValueChange={(value) => handleSaludFilterChange('municipio', value)}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_sector">Sector</Label>
                    <Autocomplete
                      options={configData.sectorOptions}
                      value={saludFilters.sector}
                      onValueChange={(value) => handleSaludFilterChange('sector', value)}
                      placeholder="Seleccionar sector..."
                      loading={configData.sectoresLoading}
                      emptyText="No se encontraron sectores"
                    />
                  </div>

                  {/* Límite de resultados */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_limite">Límite de resultados</Label>
                    <Select 
                      value={saludFilters.limite.toString()} 
                      onValueChange={(value) => handleSaludFilterChange('limite', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 registros</SelectItem>
                        <SelectItem value="100">100 registros</SelectItem>
                        <SelectItem value="250">250 registros</SelectItem>
                        <SelectItem value="500">500 registros</SelectItem>
                        <SelectItem value="1000">1000 registros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Resultados */}
            {saludQueried && (
              <SaludList 
                personas={personasSalud} 
                isLoading={saludLoading}
                currentPage={saludCurrentPage}
                totalPages={saludTotalPages}
                total={saludTotal}
                limite={saludLimite}
                onPageChange={handleSaludPageChange}
              />
            )}
          </TabsContent>

          {/* Tab Content: Difuntos */}
          <TabsContent value="difuntos" className="space-y-6">
            <DifuntosReportPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
