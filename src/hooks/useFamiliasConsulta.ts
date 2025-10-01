/**
 * Hook para consulta y gestión de familias consolidadas
 * Provee estado, carga de datos, filtrado y manejo de errores
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  obtenerFamiliasConsolidadas,
  obtenerEstadisticasFamilias,
  obtenerUbicacionesDisponibles,
  buscarFamiliasPorApellido,
  filtrarFamiliasPorUbicacion
} from '@/services/familias-consolidadas';
import type { 
  FamiliaConsolidada,
  FamiliasConsultaParams,
  EstadisticasGenerales,
  FamiliasConsolidadasState,
  FamiliaTableRow
} from '@/types/familias-consolidadas';

interface UseFamiliasConsolidadasOptions {
  autoLoad?: boolean;
  limite?: number;
  filtrosIniciales?: FamiliasConsultaParams;
}

interface UseFamiliasConsolidadasResult extends FamiliasConsolidadasState {
  // Acciones
  cargarFamilias: (params?: FamiliasConsultaParams) => Promise<void>;
  buscarPorApellido: (apellido: string) => Promise<void>;
  filtrarPorUbicacion: (ubicacion: any) => Promise<void>;
  refrescar: () => Promise<void>;
  limpiarFiltros: () => void;
  
  // Datos derivados
  familiasParaTabla: FamiliaTableRow[];
  ubicacionesDisponibles: {
    departamentos: string[];
    municipios: string[];
    parroquias: string[];
    sectores: string[];
    veredas: string[];
  } | null;
  
  // Estado de filtros
  aplicarFiltros: (nuevosFiltros: Partial<FamiliasConsultaParams>) => void;
  
  // Utilidades
  obtenerFamiliaPorId: (id: string) => FamiliaConsolidada | undefined;
}

export function useFamiliasConsolidadas(
  options: UseFamiliasConsolidadasOptions = {}
): UseFamiliasConsolidadasResult {
  
  const { user } = useAuth();
  const { autoLoad = true, limite = 100, filtrosIniciales = {} } = options;
  
  // Estado principal
  const [state, setState] = useState<FamiliasConsolidadasState>({
    familias: [],
    estadisticas: null,
    filtros: { limite, ...filtrosIniciales },
    isLoading: false,
    error: null,
    total: 0
  });
  
  // Estado adicional para ubicaciones
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState<{
    departamentos: string[];
    municipios: string[];
    parroquias: string[];
    sectores: string[];
    veredas: string[];
  } | null>(null);
  
  /**
   * Cargar familias con parámetros específicos
   */
  const cargarFamilias = useCallback(async (params?: FamiliasConsultaParams) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const filtrosAUsar = { ...state.filtros, ...params };
      
      const response = await obtenerFamiliasConsolidadas(filtrosAUsar);
      
      setState(prev => ({
        ...prev,
        familias: response.datos,
        estadisticas: response.estadisticas,
        filtros: response.filtros_aplicados,
        total: response.total,
        isLoading: false,
        error: null
      }));
      
    } catch (error: any) {
      console.error('❌ Error cargando familias:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error desconocido al cargar familias'
      }));
    }
  }, [state.filtros]);
  
  /**
   * Buscar familias por apellido
   */
  const buscarPorApellido = useCallback(async (apellido: string) => {
    if (!apellido.trim()) {
      return cargarFamilias(); // Cargar todas si está vacío
    }
    
    await cargarFamilias({ ...state.filtros, apellido_familiar: apellido });
  }, [cargarFamilias, state.filtros]);
  
  /**
   * Filtrar familias por ubicación
   */
  const filtrarPorUbicacion = useCallback(async (ubicacion: any) => {
    await cargarFamilias({ ...state.filtros, ...ubicacion });
  }, [cargarFamilias, state.filtros]);
  
  /**
   * Refrescar datos manteniendo filtros actuales
   */
  const refrescar = useCallback(async () => {
    await cargarFamilias(state.filtros);
  }, [cargarFamilias, state.filtros]);
  
  /**
   * Limpiar todos los filtros
   */
  const limpiarFiltros = useCallback(() => {
    const filtrosLimpios = { limite: state.filtros.limite || 100 };
    setState(prev => ({ ...prev, filtros: filtrosLimpios }));
    cargarFamilias(filtrosLimpios);
  }, [cargarFamilias, state.filtros.limite]);
  
  /**
   * Aplicar nuevos filtros
   */
  const aplicarFiltros = useCallback((nuevosFiltros: Partial<FamiliasConsultaParams>) => {
    const filtrosActualizados = { ...state.filtros, ...nuevosFiltros };
    setState(prev => ({ ...prev, filtros: filtrosActualizados }));
    cargarFamilias(filtrosActualizados);
  }, [cargarFamilias, state.filtros]);
  
  /**
   * Obtener familia por ID
   */
  const obtenerFamiliaPorId = useCallback((id: string): FamiliaConsolidada | undefined => {
    return state.familias.find(familia => familia.familia_id === id);
  }, [state.familias]);
  
  /**
   * Transformar familias para tabla
   */
  const familiasParaTabla = useMemo((): FamiliaTableRow[] => {
    return state.familias.map(familia => ({
      familia_id: familia.familia_id,
      codigo_familia: familia.codigo_familia,
      apellido_familiar: familia.apellido_familiar,
      ubicacion_completa: [
        familia.ubicacion.departamento,
        familia.ubicacion.municipio,
        familia.ubicacion.parroquia,
        familia.ubicacion.sector,
        familia.ubicacion.vereda
      ].filter(Boolean).join(', ') || 'Sin ubicación registrada',
      total_miembros: familia.estadisticas.total_miembros,
      total_vivos: familia.estadisticas.total_vivos,
      total_difuntos: familia.estadisticas.total_difuntos,
      total_menores: familia.estadisticas.total_menores,
      total_adultos: familia.estadisticas.total_adultos,
      tiene_contacto: familia.estadisticas.tiene_telefono || familia.estadisticas.tiene_email,
      parroquia: familia.ubicacion.parroquia,
      municipio: familia.ubicacion.municipio,
      departamento: familia.ubicacion.departamento
    }));
  }, [state.familias]);
  
  /**
   * Cargar ubicaciones disponibles
   */
  const cargarUbicaciones = useCallback(async () => {
    try {
      const ubicaciones = await obtenerUbicacionesDisponibles();
      setUbicacionesDisponibles(ubicaciones);
    } catch (error) {
      console.error('❌ Error cargando ubicaciones:', error);
    }
  }, []);
  
  /**
   * Efecto de carga inicial
   */
  useEffect(() => {
    if (autoLoad && user) {
      cargarFamilias();
      cargarUbicaciones();
    }
  }, [autoLoad, user, cargarFamilias, cargarUbicaciones]);
  
  return {
    // Estado
    ...state,
    
    // Acciones
    cargarFamilias,
    buscarPorApellido,
    filtrarPorUbicacion,
    refrescar,
    limpiarFiltros,
    aplicarFiltros,
    
    // Datos derivados
    familiasParaTabla,
    ubicacionesDisponibles,
    
    // Utilidades
    obtenerFamiliaPorId
  };
}