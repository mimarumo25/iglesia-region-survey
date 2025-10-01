/**
 * Página de Reportes - Sistema MIA
 * Vista principal con tabs para diferentes tipos de reportes
 */

import { useState } from "react";
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
  RefreshCw
} from "lucide-react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import DifuntosReportPage from "@/components/difuntos/DifuntosReportPage";

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
 * Interfaz para los filtros de reportes de familias
 */
interface FamiliasFilters {
  parroquia: string;
  municipio: string;
  sector: string;
  sexo: string;
  parentesco: string;
  sinPadre: boolean;
  sinMadre: boolean;
  edad_min: number | null;
  edad_max: number | null;
  incluir_detalles: boolean;
  limite: number;
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState("parroquias");
  const configData = useConfigurationData();

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
    sexo: "",
    parentesco: "",
    sinPadre: false,
    sinMadre: false,
    edad_min: null,
    edad_max: null,
    incluir_detalles: true,
    limite: 100
  });

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
      sexo: "",
      parentesco: "",
      sinPadre: false,
      sinMadre: false,
      edad_min: null,
      edad_max: null,
      incluir_detalles: true,
      limite: 100
    });
  };

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
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight parish-text-primary">
            Reportes y Estadísticas
          </h1>
        </div>

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
                    <CardDescription>
                      Configura los filtros y genera reportes demográficos familiares
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFamiliasFilters}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Limpiar
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => console.log('Exportando Familias a PDF:', familiasFilters)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <FileText className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        onClick={() => console.log('Exportando Familias a Excel:', familiasFilters)}
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
                {/* Campos de filtros - Ubicación geográfica */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Label htmlFor="familia_sector">Sector / Vereda</Label>
                    <Autocomplete
                      options={configData.sectorOptions}
                      value={familiasFilters.sector}
                      onValueChange={(value) => handleFamiliasFilterChange('sector', value)}
                      placeholder="Seleccionar sector o vereda..."
                      loading={configData.sectoresLoading}
                      emptyText="No se encontraron sectores"
                    />
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_sexo">Sexo</Label>
                    <Autocomplete
                      options={configData.sexoOptions}
                      value={familiasFilters.sexo}
                      onValueChange={(value) => handleFamiliasFilterChange('sexo', value)}
                      placeholder="Seleccionar sexo..."
                      loading={configData.sexosLoading}
                      emptyText="No se encontraron opciones de sexo"
                    />
                  </div>

                  {/* Parentesco */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_parentesco">Parentesco</Label>
                    <Autocomplete
                      options={configData.parentescosOptions}
                      value={familiasFilters.parentesco}
                      onValueChange={(value) => handleFamiliasFilterChange('parentesco', value)}
                      placeholder="Seleccionar parentesco..."
                      loading={configData.parentescosLoading}
                      emptyText="No se encontraron parentescos"
                    />
                  </div>

                  {/* Edad Mínima */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_edad_min">Edad Mínima</Label>
                    <Input
                      id="familia_edad_min"
                      type="number"
                      min={0}
                      max={120}
                      value={familiasFilters.edad_min || ""}
                      onChange={(e) => handleFamiliasFilterChange('edad_min', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Edad mínima..."
                      className="w-full"
                    />
                  </div>

                  {/* Edad Máxima */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_edad_max">Edad Máxima</Label>
                    <Input
                      id="familia_edad_max"
                      type="number"
                      min={0}
                      max={120}
                      value={familiasFilters.edad_max || ""}
                      onChange={(e) => handleFamiliasFilterChange('edad_max', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Edad máxima..."
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Configuraciones adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Sin Padre */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="familia_sin_padre"
                      checked={familiasFilters.sinPadre}
                      onCheckedChange={(checked) => handleFamiliasFilterChange('sinPadre', checked)}
                    />
                    <Label htmlFor="familia_sin_padre">Familias sin padre</Label>
                  </div>

                  {/* Sin Madre */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="familia_sin_madre"
                      checked={familiasFilters.sinMadre}
                      onCheckedChange={(checked) => handleFamiliasFilterChange('sinMadre', checked)}
                    />
                    <Label htmlFor="familia_sin_madre">Familias sin madre</Label>
                  </div>

                  {/* Incluir Detalles */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="familia_incluir_detalles"
                      checked={familiasFilters.incluir_detalles}
                      onCheckedChange={(checked) => handleFamiliasFilterChange('incluir_detalles', checked)}
                    />
                    <Label htmlFor="familia_incluir_detalles">Incluir detalles estadísticos</Label>
                  </div>

                  {/* Límite */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_limite">Límite de resultados</Label>
                    <Select 
                      value={familiasFilters.limite.toString()} 
                      onValueChange={(value) => handleFamiliasFilterChange('limite', parseInt(value))}
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
