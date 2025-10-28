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
import { Button } from "@/components/ui/button";
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
  FileSpreadsheet,
  RefreshCw,
  Loader2,
  Search
} from "lucide-react";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useConfigurationData } from "@/hooks/useConfigurationData";
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

/**
 * 📊 Componente Principal de Reportes de Personas
 */
const PersonasReport = () => {
  const [activeTab, setActiveTab] = useState("geografico");
  const configData = useConfigurationData();
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

  const [filtrosFamilia, setFiltrosFamilia] = useState<FiltrosFamilia>({
    page: 1,
    limit: 100
  });

  const [filtrosPersonales, setFiltrosPersonales] = useState<FiltrosPersonales>({
    liderazgo: 'all' as any,
    page: 1,
    limit: 100
  });

  const [filtrosTallas, setFiltrosTallas] = useState<FiltrosTallas>({
    page: 1,
    limit: 100,
    id_sexo: undefined,
    sexo: undefined,
    edad_min: undefined,
    edad_max: undefined
  });

  const [filtrosEdad, setFiltrosEdad] = useState<FiltrosEdad>({
    page: 1,
    limit: 100
  });

  const [filtrosReporte, setFiltrosReporte] = useState<FiltrosReporteGeneral>({
    liderazgo: 'all' as any,
    page: 1,
    limit: 100
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
          params = {
            ...filtrosPersonales,
            page: newPage,
            liderazgo: typeof filtrosPersonales.liderazgo === 'string'
                     ? (filtrosPersonales.liderazgo === 'true' ? true 
                       : filtrosPersonales.liderazgo === 'false' ? false 
                       : undefined)
                     : filtrosPersonales.liderazgo
          };
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
          params = {
            ...filtrosReporte,
            page: newPage,
            liderazgo: typeof filtrosReporte.liderazgo === 'string'
                     ? (filtrosReporte.liderazgo === 'true' ? true 
                       : filtrosReporte.liderazgo === 'false' ? false 
                       : undefined)
                     : filtrosReporte.liderazgo
          };
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

      // Debug: Log para cambio de página
      console.log('📄 Cambio de Página:', {
        newPage,
        endpoint,
        params: cleanParams,
        total: response.data.total,
        dataLength: response.data.data.length
      });

    } catch (error: any) {
      console.error('Error consultando personas:', error);
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
          params = {
            ...filtrosPersonales,
            liderazgo: typeof filtrosPersonales.liderazgo === 'string'
                     ? (filtrosPersonales.liderazgo === 'true' ? true 
                       : filtrosPersonales.liderazgo === 'false' ? false 
                       : undefined)
                     : filtrosPersonales.liderazgo
          };
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
          params = {
            ...filtrosReporte,
            liderazgo: typeof filtrosReporte.liderazgo === 'string'
                     ? (filtrosReporte.liderazgo === 'true' ? true 
                       : filtrosReporte.liderazgo === 'false' ? false 
                       : undefined)
                     : filtrosReporte.liderazgo
          };
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

      // Debug: Log para verificar respuesta de la API
      console.log('🔍 PersonasReport - Respuesta API:', {
        endpoint,
        params: cleanParams,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        dataLength: response.data.data.length,
        calculatedPages: Math.ceil(response.data.total / (response.data.limit || 100))
      });

      toast({
        title: "✅ Consulta exitosa",
        description: `Se encontraron ${response.data.total} personas`,
        variant: "default"
      });

    } catch (error: any) {
      console.error('Error consultando personas:', error);
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
          params = { 
            ...filtrosPersonales, 
            format: 'excel',
            liderazgo: typeof filtrosPersonales.liderazgo === 'string'
                     ? (filtrosPersonales.liderazgo === 'true' ? true 
                       : filtrosPersonales.liderazgo === 'false' ? false 
                       : undefined)
                     : filtrosPersonales.liderazgo
          };
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
          params = { 
            ...filtrosReporte, 
            format: 'excel',
            liderazgo: typeof filtrosReporte.liderazgo === 'string'
                     ? (filtrosReporte.liderazgo === 'true' ? true 
                       : filtrosReporte.liderazgo === 'false' ? false 
                       : undefined)
                     : filtrosReporte.liderazgo
          };
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
        setFiltrosPersonales({ liderazgo: 'all' as any, page: 1, limit: 100 });
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
        setFiltrosReporte({ liderazgo: 'all' as any, page: 1, limit: 100 });
        break;
    }
    
    setPersonas([]);
    setTotal(0);
    setHasQueried(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              Reportes de Personas
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Consulta y exporta información consolidada de personas según diferentes criterios
            </p>
          </div>
        </div>

        {/* Tabs de reportes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* TabsList con scroll horizontal en móvil */}
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-2">
              <TabsTrigger value="geografico" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Geográfico</span>
              </TabsTrigger>
              <TabsTrigger value="familia" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Familia</span>
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <UserCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="tallas" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <Shirt className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Tallas</span>
              </TabsTrigger>
              <TabsTrigger value="edad" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Edad</span>
              </TabsTrigger>
              <TabsTrigger value="reporte" className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <FileSpreadsheet className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Reporte</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content: Geográfico */}
          <TabsContent value="geografico" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Filtros Geográficos
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <RefreshCw className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQuery}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportToExcel}
                      disabled={isLoading || personas.length === 0}
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosGeograficos.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_municipio: value ? Number(value) : undefined 
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
                      options={configData.parroquiaOptions}
                      value={filtrosGeograficos.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_parroquia: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={configData.parroquiasLoading}
                      emptyText="No se encontraron parroquias"
                    />
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Autocomplete
                      options={configData.sectorOptions}
                      value={filtrosGeograficos.id_sector?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_sector: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar sector..."
                      loading={configData.sectoresLoading}
                      emptyText="No se encontraron sectores"
                    />
                  </div>

                  {/* Vereda */}
                  <div className="space-y-2">
                    <Label>Vereda</Label>
                    <Autocomplete
                      options={configData.veredaOptions}
                      value={filtrosGeograficos.id_vereda?.toString() || ""}
                      onValueChange={(value) => setFiltrosGeograficos(prev => ({ 
                        ...prev, 
                        id_vereda: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar vereda..."
                      loading={configData.veredasLoading}
                      emptyText="No se encontraron veredas"
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
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Filtros de Familia
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <RefreshCw className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQuery}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportToExcel}
                      disabled={isLoading || personas.length === 0}
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Label>Tipo de Vivienda</Label>
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
                    />
                  </div>

                  {/* Parentesco */}
                  <div className="space-y-2">
                    <Label>Parentesco</Label>
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
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Filtros Personales
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <RefreshCw className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQuery}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportToExcel}
                      disabled={isLoading || personas.length === 0}
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Select 
                      value={typeof filtrosPersonales.liderazgo === 'string' ? filtrosPersonales.liderazgo : 'all'}
                      onValueChange={(value) => setFiltrosPersonales(prev => ({ 
                        ...prev, 
                        liderazgo: value as any
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="true">Solo con liderazgo</SelectItem>
                        <SelectItem value="false">Sin liderazgo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Destrezas */}
                  <div className="space-y-2">
                    <Label>Destrezas</Label>
                    <Input
                      type="number"
                      value={filtrosPersonales.id_destreza || ""}
                      onChange={(e) => setFiltrosPersonales(prev => ({ 
                        ...prev, 
                        id_destreza: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      placeholder="ID de destreza"
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
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    Filtros de Tallas
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <RefreshCw className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQuery}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportToExcel}
                      disabled={isLoading || personas.length === 0}
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Filtros de Edad
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <RefreshCw className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQuery}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportToExcel}
                      disabled={isLoading || personas.length === 0}
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Reporte General Consolidado
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFilters}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <RefreshCw className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQuery}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 sm:mr-2" />
                      )}
                      <span className="hidden sm:inline">Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportToExcel}
                      disabled={isLoading || personas.length === 0}
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    >
                      <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Este tab combina todos los filtros disponibles para generar reportes personalizados.
                  Puedes mezclar filtros geográficos, familiares, personales, de tallas y edad.
                </p>
                <Separator className="my-4" />
                
                {/* Filtros simplificados para reporte general */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Municipio */}
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={filtrosReporte.id_municipio?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_municipio: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                    />
                  </div>

                  {/* Parroquia */}
                  <div className="space-y-2">
                    <Label>Parroquia</Label>
                    <Autocomplete
                      options={configData.parroquiaOptions}
                      value={filtrosReporte.id_parroquia?.toString() || ""}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        id_parroquia: value ? Number(value) : undefined 
                      }))}
                      placeholder="Seleccionar parroquia..."
                      loading={configData.parroquiasLoading}
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

                  {/* Liderazgo */}
                  <div className="space-y-2">
                    <Label>Liderazgo</Label>
                    <Select 
                      value={typeof filtrosReporte.liderazgo === 'string' ? filtrosReporte.liderazgo : 'all'}
                      onValueChange={(value) => setFiltrosReporte(prev => ({ 
                        ...prev, 
                        liderazgo: value as any
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="true">Solo con liderazgo</SelectItem>
                        <SelectItem value="false">Sin liderazgo</SelectItem>
                      </SelectContent>
                    </Select>
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
