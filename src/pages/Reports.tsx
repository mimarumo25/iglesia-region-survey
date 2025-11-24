/**
 * Página de Reportes - Sistema MIA
 * Vista principal con tabs para diferentes tipos de reportes
 */

import { useState, useEffect, useMemo } from "react";
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
import { useParroquias } from "@/hooks/useParroquias";
import { useCorregimientos } from "@/hooks/useCorregimientos";
import { useCentrosPoblados } from "@/hooks/useCentrosPoblados";
import { useSectores } from "@/hooks/useSectores";

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
  corregimiento: string;
  centro_poblado: string;
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
  corregimiento: string;
  centro_poblado: string;
  limite: number;
  offset: number;
}

const Reports = () => {
  const [activeTab, setActiveTab] = useState("familias");
  const configData = useConfigurationData();
  const { toast } = useToast();

  // Hooks dinámicos para filtrado por municipio
  const { useParroquiasByMunicipioQuery } = useParroquias();
  const { useCorregimientosByMunicipioQuery } = useCorregimientos();
  const { useCentrosPobladosByMunicipioQuery } = useCentrosPoblados();
  const { useSectoresByMunicipioQuery } = useSectores();

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
    corregimiento: "",
    centro_poblado: "",
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
    corregimiento: "",
    centro_poblado: "",
    limite: 100,
    offset: 0
  });

  // Estado de paginación para Salud
  const [saludCurrentPage, setSaludCurrentPage] = useState(1);
  const saludLimite = saludFilters.limite || 10;
  const saludTotalPages = Math.ceil(saludTotal / saludLimite);

  // ============================================================
  // 🔍 QUERIES DINÁMICAS POR MUNICIPIO - SALUD
  // ============================================================

  /**
   * Queries que se activan cuando se selecciona un municipio en Salud
   * Estas llamadas a la API filtran directamente en el backend
   */
  const { data: saludParroquiasByMunicipioData } = useParroquiasByMunicipioQuery(
    saludFilters.municipio || ""
  );

  const { data: saludSectoresByMunicipioData } = useSectoresByMunicipioQuery(
    saludFilters.municipio ? Number(saludFilters.municipio) : null
  );

  const { data: saludCorregimientosByMunicipioData } = useCorregimientosByMunicipioQuery(
    saludFilters.municipio ? Number(saludFilters.municipio) : null
  );

  const { data: saludCentrosPobladosByMunicipioData } = useCentrosPobladosByMunicipioQuery(
    saludFilters.municipio ? Number(saludFilters.municipio) : null
  );

  // ============================================================
  // 🔍 QUERIES DINÁMICAS POR MUNICIPIO - FAMILIAS
  // ============================================================

  /**
   * Queries que se activan cuando se selecciona un municipio en Familias
   */
  const { data: familiasParroquiasByMunicipioData } = useParroquiasByMunicipioQuery(
    familiasFilters.municipio || ""
  );

  const { data: familiasSectoresByMunicipioData } = useSectoresByMunicipioQuery(
    familiasFilters.municipio ? Number(familiasFilters.municipio) : null
  );

  const { data: familiasCorregimientosByMunicipioData } = useCorregimientosByMunicipioQuery(
    familiasFilters.municipio ? Number(familiasFilters.municipio) : null
  );

  const { data: familiasCentrosPobladosByMunicipioData } = useCentrosPobladosByMunicipioQuery(
    familiasFilters.municipio ? Number(familiasFilters.municipio) : null
  );

  /**
   * Maneja el cambio de página en Salud
   */
  const handleSaludPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > saludTotalPages) return;
    
    setSaludCurrentPage(newPage);
    const newOffset = (newPage - 1) * saludLimite;
    setSaludFilters(prev => ({ ...prev, offset: newOffset }));
  };

  // ============================================================
  // 🔍 FILTRADO JERÁRQUICO POR MUNICIPIO - FAMILIAS
  // ============================================================
  
  /**
   * Filtrar opciones de Parroquia basadas en el municipio seleccionado
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredFamiliasParroquiaOptions = useMemo(() => {
    if (!familiasFilters.municipio) return configData.parroquiaOptions;
    
    // Si hay datos dinámicos de la API, usarlos
    if (Array.isArray(familiasParroquiasByMunicipioData) && familiasParroquiasByMunicipioData.length > 0) {
      return familiasParroquiasByMunicipioData.map(p => ({
        value: p.id_parroquia?.toString() || '',
        label: p.nombre || 'Sin nombre',
        description: `Parroquia del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local (método anterior)
    return configData.parroquiaOptions.filter(option => {
      const parroquia = configData.parroquiaItems?.find(p => p.id === option.value);
      return parroquia?.id_municipio?.toString() === familiasFilters.municipio;
    });
  }, [familiasFilters.municipio, familiasParroquiasByMunicipioData, configData.parroquiaOptions, configData.parroquiaItems]);

  /**
   * Filtrar opciones de Sector basadas en el municipio seleccionado
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredFamiliasSectorOptions = useMemo(() => {
    if (!familiasFilters.municipio) return configData.sectorOptions;
    
    // Si hay datos dinámicos de la API, usarlos
    if (Array.isArray(familiasSectoresByMunicipioData) && familiasSectoresByMunicipioData.length > 0) {
      return familiasSectoresByMunicipioData.map(s => ({
        value: s.id_sector?.toString() || '',
        label: s.nombre || 'Sin nombre',
        description: `Sector del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local
    return configData.sectorOptions.filter(option => {
      const sector = configData.sectorItems?.find(s => s.id === option.value);
      return sector?.id_municipio?.toString() === familiasFilters.municipio;
    });
  }, [familiasFilters.municipio, familiasSectoresByMunicipioData, configData.sectorOptions, configData.sectorItems]);

  /**
   * Filtrar opciones de Vereda basadas en el municipio seleccionado
   */
  const filteredFamiliasVeredaOptions = useMemo(() => {
    if (!familiasFilters.municipio) return configData.veredaOptions;
    
    return configData.veredaOptions.filter(option => {
      const vereda = configData.veredaItems?.find(v => v.id === option.value);
      return vereda?.id_municipio?.toString() === familiasFilters.municipio;
    });
  }, [familiasFilters.municipio, configData.veredaOptions, configData.veredaItems]);

  /**
   * Filtrar opciones de Corregimiento basadas en el municipio seleccionado
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredFamiliasCorregimientoOptions = useMemo(() => {
    if (!familiasFilters.municipio) return configData.corregimientoOptions;
    
    // Si hay datos dinámicos de la API, usarlos (el hook devuelve array directamente)
    if (familiasCorregimientosByMunicipioData && Array.isArray(familiasCorregimientosByMunicipioData) && familiasCorregimientosByMunicipioData.length > 0) {
      return familiasCorregimientosByMunicipioData.map(c => ({
        value: c.id_corregimiento?.toString() || '',
        label: c.nombre || 'Sin nombre',
        description: `Corregimiento del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local
    return configData.corregimientoOptions.filter(option => {
      const corregimiento = configData.corregimientoItems?.find(c => c.id === option.value);
      return corregimiento?.id_municipio?.toString() === familiasFilters.municipio;
    });
  }, [familiasFilters.municipio, familiasCorregimientosByMunicipioData, configData.corregimientoOptions, configData.corregimientoItems]);

  /**
   * Filtrar opciones de Centro Poblado basadas en el municipio seleccionado
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredFamiliasCentroPobladoOptions = useMemo(() => {
    if (!familiasFilters.municipio) return configData.centroPobladoOptions;
    
    // Si hay datos dinámicos de la API, usarlos (el hook devuelve array directamente)
    if (familiasCentrosPobladosByMunicipioData && Array.isArray(familiasCentrosPobladosByMunicipioData) && familiasCentrosPobladosByMunicipioData.length > 0) {
      return familiasCentrosPobladosByMunicipioData.map(cp => ({
        value: cp.id_centro_poblado?.toString() || '',
        label: cp.nombre || 'Sin nombre',
        description: `Centro poblado del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local
    return configData.centroPobladoOptions.filter(option => {
      const centroPoblado = configData.centroPobladoItems?.find(cp => cp.id === option.value);
      return centroPoblado?.id_municipio?.toString() === familiasFilters.municipio;
    });
  }, [familiasFilters.municipio, familiasCentrosPobladosByMunicipioData, configData.centroPobladoOptions, configData.centroPobladoItems]);

  // ============================================================
  // 🔍 FILTRADO JERÁRQUICO POR MUNICIPIO - SALUD
  // ============================================================

  /**
   * Filtrar opciones de Parroquia basadas en el municipio seleccionado (Salud)
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredSaludParroquiaOptions = useMemo(() => {
    if (!saludFilters.municipio) return configData.parroquiaOptions;
    
    // Si hay datos dinámicos de la API, usarlos
    if (saludParroquiasByMunicipioData?.data) {
      return saludParroquiasByMunicipioData.data.map(p => ({
        value: p.id_parroquia?.toString() || '',
        label: p.nombre || 'Sin nombre',
        description: `Parroquia del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local
    return configData.parroquiaOptions.filter(option => {
      const parroquia = configData.parroquiaItems?.find(p => p.id === option.value);
      return parroquia?.id_municipio?.toString() === saludFilters.municipio;
    });
  }, [saludFilters.municipio, saludParroquiasByMunicipioData, configData.parroquiaOptions, configData.parroquiaItems]);

  /**
   * Filtrar opciones de Sector basadas en el municipio seleccionado (Salud)
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredSaludSectorOptions = useMemo(() => {
    if (!saludFilters.municipio) return configData.sectorOptions;
    
    // Si hay datos dinámicos de la API, usarlos
    if (saludSectoresByMunicipioData?.data) {
      return saludSectoresByMunicipioData.data.map(s => ({
        value: s.id_sector?.toString() || '',
        label: s.nombre || 'Sin nombre',
        description: `Sector del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local
    return configData.sectorOptions.filter(option => {
      const sector = configData.sectorItems?.find(s => s.id === option.value);
      return sector?.id_municipio?.toString() === saludFilters.municipio;
    });
  }, [saludFilters.municipio, saludSectoresByMunicipioData, configData.sectorOptions, configData.sectorItems]);

  /**
   * Filtrar opciones de Corregimiento basadas en el municipio seleccionado (Salud)
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredSaludCorregimientoOptions = useMemo(() => {
    if (!saludFilters.municipio) return configData.corregimientoOptions;
    
    // Si hay datos dinámicos de la API, usarlos (el hook devuelve array directamente)
    if (saludCorregimientosByMunicipioData && Array.isArray(saludCorregimientosByMunicipioData) && saludCorregimientosByMunicipioData.length > 0) {
      return saludCorregimientosByMunicipioData.map(c => ({
        value: c.id_corregimiento?.toString() || '',
        label: c.nombre || 'Sin nombre',
        description: `Corregimiento del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local
    return configData.corregimientoOptions.filter(option => {
      const corregimiento = configData.corregimientoItems?.find(c => c.id === option.value);
      return corregimiento?.id_municipio?.toString() === saludFilters.municipio;
    });
  }, [saludFilters.municipio, saludCorregimientosByMunicipioData, configData.corregimientoOptions, configData.corregimientoItems]);

  /**
   * Filtrar opciones de Centro Poblado basadas en el municipio seleccionado (Salud)
   * Prioriza datos dinámicos de la API, fallback a filtro local
   */
  const filteredSaludCentroPobladoOptions = useMemo(() => {
    if (!saludFilters.municipio) return configData.centroPobladoOptions;
    
    // Si hay datos dinámicos de la API, usarlos (el hook devuelve array directamente)
    if (saludCentrosPobladosByMunicipioData && Array.isArray(saludCentrosPobladosByMunicipioData) && saludCentrosPobladosByMunicipioData.length > 0) {
      return saludCentrosPobladosByMunicipioData.map(cp => ({
        value: cp.id_centro_poblado?.toString() || '',
        label: cp.nombre || 'Sin nombre',
        description: `Centro poblado del municipio`,
        category: 'Ubicación'
      }));
    }
    
    // Fallback: Filtro local
    return configData.centroPobladoOptions.filter(option => {
      const centroPoblado = configData.centroPobladoItems?.find(cp => cp.id === option.value);
      return centroPoblado?.id_municipio?.toString() === saludFilters.municipio;
    });
  }, [saludFilters.municipio, saludCentrosPobladosByMunicipioData, configData.centroPobladoOptions, configData.centroPobladoItems]);

  /**
   * Maneja cambios en filtros de Familias
   * Si cambia el municipio, resetea los filtros dependientes
   */
  const handleFamiliasFilterChange = (key: keyof FamiliasFilters, value: any) => {
    setFamiliasFilters(prev => {
      // Si cambió el municipio, resetear todos los filtros dependientes
      if (key === 'municipio') {
        return {
          ...prev,
          municipio: value,
          parroquia: "",
          sector: "",
          vereda: "",
          corregimiento: "",
          centro_poblado: ""
        };
      }
      
      return { ...prev, [key]: value };
    });
  };

  /**
   * Maneja cambios en filtros de Salud
   * Si cambia el municipio, resetea los filtros dependientes
   */
  const handleSaludFilterChange = (key: keyof SaludFiltersUI, value: any) => {
    setSaludFilters(prev => {
      // Si cambió el municipio, resetear todos los filtros dependientes
      if (key === 'municipio') {
        return {
          ...prev,
          municipio: value,
          parroquia: "",
          sector: "",
          corregimiento: "",
          centro_poblado: ""
        };
      }
      
      return { ...prev, [key]: value };
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
      corregimiento: "",
      centro_poblado: "",
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
      corregimiento: "",
      centro_poblado: "",
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
        id_corregimiento: familiasFilters.corregimiento ? Number(familiasFilters.corregimiento) : undefined,
        id_centro_poblado: familiasFilters.centro_poblado ? Number(familiasFilters.centro_poblado) : undefined,
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
        id_corregimiento: familiasFilters.corregimiento ? Number(familiasFilters.corregimiento) : undefined,
        id_centro_poblado: familiasFilters.centro_poblado ? Number(familiasFilters.centro_poblado) : undefined,
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
      id_corregimiento: saludFilters.corregimiento ? Number(saludFilters.corregimiento) : undefined,
      id_centro_poblado: saludFilters.centro_poblado ? Number(saludFilters.centro_poblado) : undefined,
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
      id_corregimiento: saludFilters.corregimiento ? Number(saludFilters.corregimiento) : undefined,
      id_centro_poblado: saludFilters.centro_poblado ? Number(saludFilters.centro_poblado) : undefined,
      id_sector: saludFilters.sector ? Number(saludFilters.sector) : undefined,
      limite: 5000 // Límite alto para exportación completa
    };

    await exportSaludExcel(filtrosAPI);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-2 sm:px-3 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Tabs de reportes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-1 p-1">
            <TabsTrigger value="familias" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Familias</span>
            </TabsTrigger>
            <TabsTrigger value="salud" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Salud</span>
            </TabsTrigger>
            <TabsTrigger value="difuntos" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Difuntos</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: Familias */}
          <TabsContent value="familias" className="space-y-4 sm:space-y-6">
            {/* Card de filtros y botones de exportación */}
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>Reportes de Familias</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Filtra y consulta información de familias registradas
                    </CardDescription>
                  </div>
                  
                  {/* Botones de acción - Stack en móvil, inline en desktop */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearFamiliasFilters}
                      disabled={familiasLoading}
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm h-9"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQueryFamilias}
                      disabled={familiasLoading}
                      className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-9"
                    >
                      {familiasLoading ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span className="hidden xs:inline">Consultar Familias</span>
                      <span className="xs:hidden">Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportFamiliasToExcel}
                      disabled={familiasLoading}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-9"
                    >
                      <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Descargar Excel</span>
                      <span className="xs:hidden">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Campos de filtros - Ubicación geográfica */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {/* Municipio - FILTRO PRINCIPAL */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_municipio" className="text-sm font-medium">
                      Municipio <span className="text-primary">⭐</span>
                    </Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={familiasFilters.municipio}
                      onValueChange={(value) => handleFamiliasFilterChange('municipio', value)}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia - Filtrada por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_parroquia" className="text-sm font-medium">Parroquia</Label>
                    <Autocomplete
                      options={filteredFamiliasParroquiaOptions}
                      value={familiasFilters.parroquia}
                      onValueChange={(value) => handleFamiliasFilterChange('parroquia', value)}
                      placeholder={familiasFilters.municipio ? "Seleccionar parroquia..." : "Primero seleccione municipio"}
                      loading={configData.parroquiasLoading}
                      disabled={!familiasFilters.municipio}
                      emptyText="No hay parroquias en este municipio"
                    />
                  </div>

                  {/* Sector - Filtrado por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_sector" className="text-sm font-medium">Sector</Label>
                    <Autocomplete
                      options={filteredFamiliasSectorOptions}
                      value={familiasFilters.sector}
                      onValueChange={(value) => handleFamiliasFilterChange('sector', value)}
                      placeholder={familiasFilters.municipio ? "Seleccionar sector..." : "Primero seleccione municipio"}
                      loading={configData.sectoresLoading}
                      disabled={!familiasFilters.municipio}
                      emptyText="No hay sectores en este municipio"
                    />
                  </div>

                  {/* Vereda - Filtrada por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_vereda" className="text-sm font-medium">Vereda</Label>
                    <Autocomplete
                      options={filteredFamiliasVeredaOptions}
                      value={familiasFilters.vereda}
                      onValueChange={(value) => handleFamiliasFilterChange('vereda', value)}
                      placeholder={familiasFilters.municipio ? "Seleccionar vereda..." : "Primero seleccione municipio"}
                      loading={configData.veredasLoading}
                      disabled={!familiasFilters.municipio}
                      emptyText="No hay veredas en este municipio"
                    />
                  </div>

                  {/* Corregimiento - Filtrado por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_corregimiento" className="text-sm font-medium">Corregimiento</Label>
                    <Autocomplete
                      options={filteredFamiliasCorregimientoOptions}
                      value={familiasFilters.corregimiento}
                      onValueChange={(value) => handleFamiliasFilterChange('corregimiento', value)}
                      placeholder={familiasFilters.municipio ? "Seleccionar corregimiento..." : "Primero seleccione municipio"}
                      loading={configData.corregimientosLoading}
                      disabled={!familiasFilters.municipio}
                      emptyText="No hay corregimientos en este municipio"
                    />
                  </div>

                  {/* Centro Poblado - Filtrado por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="familia_centro_poblado" className="text-sm font-medium">Centro Poblado</Label>
                    <Autocomplete
                      options={filteredFamiliasCentroPobladoOptions}
                      value={familiasFilters.centro_poblado}
                      onValueChange={(value) => handleFamiliasFilterChange('centro_poblado', value)}
                      placeholder={familiasFilters.municipio ? "Seleccionar centro poblado..." : "Primero seleccione municipio"}
                      loading={configData.centrosPobladosLoading}
                      disabled={!familiasFilters.municipio}
                      emptyText="No hay centros poblados en este municipio"
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
          <TabsContent value="salud" className="space-y-4 sm:space-y-6">
            {/* Card de filtros y botones de exportación */}
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>Reportes de Salud</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Estadísticas de personas con condiciones de salud
                    </CardDescription>
                  </div>
                  
                  {/* Botones de acción - Stack en móvil, inline en desktop */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearSaludFilters}
                      disabled={saludLoading}
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm h-9"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Limpiar</span>
                    </Button>
                    <Button 
                      onClick={handleQuerySaludWithReset}
                      disabled={saludLoading}
                      className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-9"
                    >
                      {saludLoading ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span>Consultar</span>
                    </Button>
                    <Button 
                      onClick={handleExportSaludToExcel}
                      disabled={saludLoading}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-9"
                    >
                      <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Descargar Excel</span>
                      <span className="xs:hidden">Excel</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Campos de filtros - Datos de salud */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {/* Enfermedad */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_enfermedad" className="text-sm font-medium">Enfermedad</Label>
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
                    <Label htmlFor="salud_sexo" className="text-sm font-medium">Sexo</Label>
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
                    <Label htmlFor="salud_edad_min" className="text-sm font-medium">Edad Mínima</Label>
                    <Input
                      id="salud_edad_min"
                      type="number"
                      min={0}
                      max={120}
                      value={saludFilters.edad_min}
                      onChange={(e) => handleSaludFilterChange('edad_min', e.target.value)}
                      placeholder="Ej: 18"
                      className="w-full h-9 text-sm"
                    />
                  </div>

                  {/* Edad Máxima */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_edad_max" className="text-sm font-medium">Edad Máxima</Label>
                    <Input
                      id="salud_edad_max"
                      type="number"
                      min={0}
                      max={120}
                      value={saludFilters.edad_max}
                      onChange={(e) => handleSaludFilterChange('edad_max', e.target.value)}
                      placeholder="Ej: 65"
                      className="w-full h-9 text-sm"
                    />
                  </div>
                </div>

                <Separator className="my-4 sm:my-6" />

                {/* Filtros de ubicación geográfica */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {/* Municipio - FILTRO PRINCIPAL */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_municipio" className="text-sm font-medium">
                      Municipio <span className="text-primary">⭐</span>
                    </Label>
                    <Autocomplete
                      options={configData.municipioOptions}
                      value={saludFilters.municipio}
                      onValueChange={(value) => handleSaludFilterChange('municipio', value)}
                      placeholder="Seleccionar municipio..."
                      loading={configData.municipiosLoading}
                      emptyText="No se encontraron municipios"
                    />
                  </div>

                  {/* Parroquia - Filtrada por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_parroquia" className="text-sm font-medium">Parroquia</Label>
                    <Autocomplete
                      options={filteredSaludParroquiaOptions}
                      value={saludFilters.parroquia}
                      onValueChange={(value) => handleSaludFilterChange('parroquia', value)}
                      placeholder={saludFilters.municipio ? "Seleccionar parroquia..." : "Primero seleccione municipio"}
                      loading={configData.parroquiasLoading}
                      disabled={!saludFilters.municipio}
                      emptyText="No hay parroquias en este municipio"
                    />
                  </div>

                  {/* Sector - Filtrado por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_sector" className="text-sm font-medium">Sector</Label>
                    <Autocomplete
                      options={filteredSaludSectorOptions}
                      value={saludFilters.sector}
                      onValueChange={(value) => handleSaludFilterChange('sector', value)}
                      placeholder={saludFilters.municipio ? "Seleccionar sector..." : "Primero seleccione municipio"}
                      loading={configData.sectoresLoading}
                      disabled={!saludFilters.municipio}
                      emptyText="No hay sectores en este municipio"
                    />
                  </div>

                  {/* Corregimiento - Filtrado por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_corregimiento" className="text-sm font-medium">Corregimiento</Label>
                    <Autocomplete
                      options={filteredSaludCorregimientoOptions}
                      value={saludFilters.corregimiento}
                      onValueChange={(value) => handleSaludFilterChange('corregimiento', value)}
                      placeholder={saludFilters.municipio ? "Seleccionar corregimiento..." : "Primero seleccione municipio"}
                      loading={configData.corregimientosLoading}
                      disabled={!saludFilters.municipio}
                      emptyText="No hay corregimientos en este municipio"
                    />
                  </div>

                  {/* Centro Poblado - Filtrado por municipio */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_centro_poblado" className="text-sm font-medium">Centro Poblado</Label>
                    <Autocomplete
                      options={filteredSaludCentroPobladoOptions}
                      value={saludFilters.centro_poblado}
                      onValueChange={(value) => handleSaludFilterChange('centro_poblado', value)}
                      placeholder={saludFilters.municipio ? "Seleccionar centro poblado..." : "Primero seleccione municipio"}
                      loading={configData.centrosPobladosLoading}
                      disabled={!saludFilters.municipio}
                      emptyText="No hay centros poblados en este municipio"
                    />
                  </div>

                  {/* Límite de resultados */}
                  <div className="space-y-2">
                    <Label htmlFor="salud_limite" className="text-sm font-medium">Límite de resultados</Label>
                    <Select 
                      value={saludFilters.limite.toString()} 
                      onValueChange={(value) => handleSaludFilterChange('limite', parseInt(value))}
                    >
                      <SelectTrigger className="h-9">
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
