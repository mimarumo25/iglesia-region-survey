/**
 * Página de Reportes - Sistema MIA
 * Vista principal con tabs para diferentes tipos de reportes
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Users, 
  Heart, 
  Calendar, 
  MapPin, 
  Download,
  FileText,
  FileSpreadsheet,
  Activity,
  Filter,
  RefreshCw,
  Loader2,
  Search
} from "lucide-react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import DifuntosReportPage from "@/components/difuntos/DifuntosReportPage";
import { useToast } from "@/hooks/use-toast";
import { 
  getReporteFamilias, 
  exportReporteFamilias,
  type FamiliaReporte
} from "@/services/reportes";
import { getFamiliasConsolidado, exportFamiliasToExcel } from "@/services/familias";
import type { FamiliaConsolidada } from "@/types/familias";
import FamiliasAccordionList from "@/components/familias/FamiliasAccordionList";

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
interface ParroquiasFilters {
  municipio: string;
  parroquia: string;
  tipo_vivienda: string;
  sistema_acueducto: string;
  tipo_aguas_residuales: string;
  disposicion_basura: string;
  incluir_estadisticas: boolean;
  pagina: number;
  limitado: number;
}

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

const Reports = () => {
  const [activeTab, setActiveTab] = useState("parroquias");
  const configData = useConfigurationData();
  const { toast } = useToast();

  // Estados para filtros de Parroquias
  const [parroquiasFilters, setParroquiasFilters] = useState<ParroquiasFilters>({
    municipio: "",
    parroquia: "",
    tipo_vivienda: "",
    sistema_acueducto: "",
    tipo_aguas_residuales: "",
    disposicion_basura: "",
    incluir_estadisticas: true,
    pagina: 1,
    limitado: 100
  });

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

  /**
   * Maneja cambios en filtros de Parroquias
   */
  const handleParroquiasFilterChange = (key: keyof ParroquiasFilters, value: any) => {
    setParroquiasFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Maneja cambios en filtros de Familias
   */
  const handleFamiliasFilterChange = (key: keyof FamiliasFilters, value: any) => {
    setFamiliasFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Limpia todos los filtros de Parroquias
   */
  const clearParroquiasFilters = () => {
    setParroquiasFilters({
      municipio: "",
      parroquia: "",
      tipo_vivienda: "",
      sistema_acueducto: "",
      tipo_aguas_residuales: "",
      disposicion_basura: "",
      incluir_estadisticas: true,
      pagina: 1,
      limitado: 100
    });
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
   * 🔍 Consulta automática al entrar al tab de familias
   */
  useEffect(() => {
    if (activeTab === "familias" && !familiasQueried) {
      handleQueryFamilias();
    }
  }, [activeTab]);

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
   * 📄 ELIMINADAS: Funciones de exportación PDF/Excel
   * (Se mantienen solo como placeholder para futura implementación)
   */
  
  /**
   * Exporta reporte en formato PDF
   */
  const exportToPDF = async () => {
    try {
      console.log('Exportando a PDF con filtros:', parroquiasFilters);
      // TODO: Implementar llamada al endpoint PDF
      // const response = await reportesService.exportParroquiasPDF(parroquiasFilters);
      // downloadFile(response, 'reporte_parroquias.pdf');
    } catch (error) {
      console.error('Error exportando PDF:', error);
    }
  };

  /**
   * Exporta reporte en formato Excel
   */
  const exportToExcel = async () => {
    try {
      console.log('Exportando a Excel con filtros:', parroquiasFilters);
      // TODO: Implementar llamada al endpoint Excel
      // const response = await reportesService.exportParroquiasExcel(parroquiasFilters);
      // downloadFile(response, 'reporte_parroquias.xlsx');
    } catch (error) {
      console.error('Error exportando Excel:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Tabs de reportes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="parroquias" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Parroquias</span>
            </TabsTrigger>
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

          {/* Tab Content: Parroquias */}
          <TabsContent value="parroquias" className="space-y-6">
            {/* Card de filtros y botones de exportación */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Reportes de Parroquias
                    </CardTitle>
                    <CardDescription>
                      Configura los filtros y genera reportes estadísticos
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearParroquiasFilters}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Limpiar
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        onClick={exportToPDF}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <FileText className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Campos de filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="municipio">Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={parroquiasFilters.municipio}
                      onValueChange={(value) => handleParroquiasFilterChange('municipio', value)}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label htmlFor="parroquia">Parroquia</Label>
                    <Autocomplete
                      options={configData.parroquiaOptions}
                      value={parroquiasFilters.parroquia}
                      onValueChange={(value) => handleParroquiasFilterChange('parroquia', value)}
                      placeholder="Seleccionar parroquia..."
                      loading={configData.parroquiasLoading}
                      emptyText="No se encontraron parroquias"
                    />
                  </div>

                  {/* Tipo de Vivienda */}
                  <div className="space-y-2">
                    <Label htmlFor="tipo_vivienda">Tipo de Vivienda</Label>
                    <Autocomplete
                      options={configData.tipoViviendaOptions}
                      value={parroquiasFilters.tipo_vivienda}
                      onValueChange={(value) => handleParroquiasFilterChange('tipo_vivienda', value)}
                      placeholder="Seleccionar tipo de vivienda..."
                      loading={configData.tiposViviendaLoading}
                      emptyText="No se encontraron tipos de vivienda"
                    />
                  </div>

                  {/* Sistema Acueducto */}
                  <div className="space-y-2">
                    <Label htmlFor="sistema_acueducto">Sistema de Acueducto</Label>
                    <Autocomplete
                      options={configData.sistemasAcueductoOptions}
                      value={parroquiasFilters.sistema_acueducto}
                      onValueChange={(value) => handleParroquiasFilterChange('sistema_acueducto', value)}
                      placeholder="Seleccionar sistema de acueducto..."
                      loading={configData.sistemasAcueductoLoading}
                      emptyText="No se encontraron sistemas de acueducto"
                    />
                  </div>

                  {/* Tipo Aguas Residuales */}
                  <div className="space-y-2">
                    <Label htmlFor="tipo_aguas_residuales">Tipo de Aguas Residuales</Label>
                    <Autocomplete
                      options={configData.aguasResidualesOptions}
                      value={parroquiasFilters.tipo_aguas_residuales}
                      onValueChange={(value) => handleParroquiasFilterChange('tipo_aguas_residuales', value)}
                      placeholder="Seleccionar tipo de aguas residuales..."
                      loading={configData.aguasResidualesLoading}
                      emptyText="No se encontraron tipos de aguas residuales"
                    />
                  </div>

                  {/* Disposición de Basura */}
                  <div className="space-y-2">
                    <Label htmlFor="disposicion_basura">Disposición de Basura</Label>
                    <Autocomplete
                      options={configData.disposicionBasuraOptions}
                      value={parroquiasFilters.disposicion_basura}
                      onValueChange={(value) => handleParroquiasFilterChange('disposicion_basura', value)}
                      placeholder="Seleccionar disposición de basura..."
                      loading={configData.disposicionBasuraLoading}
                      emptyText="No se encontraron tipos de disposición"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Configuraciones adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Incluir Estadísticas */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="incluir_estadisticas"
                      checked={parroquiasFilters.incluir_estadisticas}
                      onCheckedChange={(checked) => handleParroquiasFilterChange('incluir_estadisticas', checked)}
                    />
                    <Label htmlFor="incluir_estadisticas">Incluir estadísticas detalladas</Label>
                  </div>

                  {/* Página */}
                  <div className="space-y-2">
                    <Label htmlFor="pagina">Página</Label>
                    <Input
                      id="pagina"
                      type="number"
                      min={1}
                      value={parroquiasFilters.pagina}
                      onChange={(e) => handleParroquiasFilterChange('pagina', parseInt(e.target.value) || 1)}
                      className="w-full"
                    />
                  </div>

                  {/* Limitado */}
                  <div className="space-y-2">
                    <Label htmlFor="limitado">Límite de resultados</Label>
                    <Select 
                      value={parroquiasFilters.limitado.toString()} 
                      onValueChange={(value) => handleParroquiasFilterChange('limitado', parseInt(value))}
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
          </TabsContent>

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
          <TabsContent value="salud" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Reportes de Salud
                    </CardTitle>
                    <CardDescription>
                      Estadísticas sanitarias, enfermedades y condiciones de salud
                    </CardDescription>
                  </div>
                  <Badge variant="outline">En desarrollo</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-dashed hover:border-solid cursor-pointer transition-all">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Heart className="h-8 w-8 text-muted-foreground mb-2" />
                      <h4 className="font-semibold">Prevalencia de Enfermedades</h4>
                      <p className="text-sm text-muted-foreground text-center">
                        Condiciones médicas por región
                      </p>
                      <Button variant="outline" className="mt-3 w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Generar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed hover:border-solid cursor-pointer transition-all">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Activity className="h-8 w-8 text-muted-foreground mb-2" />
                      <h4 className="font-semibold">Perfil Epidemiológico</h4>
                      <p className="text-sm text-muted-foreground text-center">
                        Análisis por grupos etarios
                      </p>
                      <Button variant="outline" className="mt-3 w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Generar
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed hover:border-solid cursor-pointer transition-all">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <BarChart3 className="h-8 w-8 text-muted-foreground mb-2" />
                      <h4 className="font-semibold">Indicadores de Salud</h4>
                      <p className="text-sm text-muted-foreground text-center">
                        Métricas y tendencias
                      </p>
                      <Button variant="outline" className="mt-3 w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Generar
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
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
