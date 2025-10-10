/**
 * Servicio API para Personas Consolidado
 * Endpoints para consultas de personas con diferentes filtros
 */

import { apiClient } from '@/interceptors/axios';
import type {
  PersonasResponse,
  FiltrosGeograficos,
  FiltrosFamilia,
  FiltrosPersonales,
  FiltrosTallas,
  FiltrosEdad,
  FiltrosReporteGeneral
} from '@/types/personas';

const BASE_URL = '/api/personas/consolidado';

/**
 * 🌍 Consultar personas por ubicación geográfica
 */
export const getPersonasGeograficas = async (filtros: FiltrosGeograficos = {}): Promise<PersonasResponse> => {
  const response = await apiClient.get(`${BASE_URL}/geografico`, {
    params: filtros
  });
  return response.data;
};

/**
 * 👨‍👩‍👧‍👦 Consultar personas por familia y vivienda
 */
export const getPersonasFamilia = async (filtros: FiltrosFamilia = {}): Promise<PersonasResponse> => {
  const response = await apiClient.get(`${BASE_URL}/familia`, {
    params: filtros
  });
  return response.data;
};

/**
 * 👤 Consultar personas por datos personales
 */
export const getPersonasPersonales = async (filtros: FiltrosPersonales = {}): Promise<PersonasResponse> => {
  const response = await apiClient.get(`${BASE_URL}/personal`, {
    params: filtros
  });
  return response.data;
};

/**
 * 👕 Consultar personas por tallas
 */
export const getPersonasTallas = async (filtros: FiltrosTallas = {}): Promise<PersonasResponse> => {
  const response = await apiClient.get(`${BASE_URL}/tallas`, {
    params: filtros
  });
  return response.data;
};

/**
 * 🎂 Consultar personas por rango de edad
 */
export const getPersonasEdad = async (filtros: FiltrosEdad = {}): Promise<PersonasResponse> => {
  const response = await apiClient.get(`${BASE_URL}/edad`, {
    params: filtros
  });
  return response.data;
};

/**
 * 📊 Generar reporte general con todos los filtros
 */
export const getReporteGeneral = async (filtros: FiltrosReporteGeneral = {}): Promise<PersonasResponse> => {
  const response = await apiClient.get(`${BASE_URL}/reporte`, {
    params: filtros
  });
  return response.data;
};

/**
 * 📥 Exportar personas geográficas a Excel
 */
export const exportPersonasGeograficasExcel = async (filtros: FiltrosGeograficos = {}): Promise<void> => {
  const filtrosExcel = { ...filtros, format: 'excel' as const };
  
  const response = await apiClient.get(`${BASE_URL}/geografico`, {
    params: filtrosExcel,
    responseType: 'blob'
  });

  // Crear blob y descargar
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `personas-geograficas-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 📥 Exportar personas por familia a Excel
 */
export const exportPersonasFamiliaExcel = async (filtros: FiltrosFamilia = {}): Promise<void> => {
  const filtrosExcel = { ...filtros, format: 'excel' as const };
  
  const response = await apiClient.get(`${BASE_URL}/familia`, {
    params: filtrosExcel,
    responseType: 'blob'
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `personas-familia-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 📥 Exportar personas personales a Excel
 */
export const exportPersonasPersonalesExcel = async (filtros: FiltrosPersonales = {}): Promise<void> => {
  const filtrosExcel = { ...filtros, format: 'excel' as const };
  
  const response = await apiClient.get(`${BASE_URL}/personal`, {
    params: filtrosExcel,
    responseType: 'blob'
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `personas-personal-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 📥 Exportar personas por tallas a Excel
 */
export const exportPersonasTallasExcel = async (filtros: FiltrosTallas = {}): Promise<void> => {
  const filtrosExcel = { ...filtros, format: 'excel' as const };
  
  const response = await apiClient.get(`${BASE_URL}/tallas`, {
    params: filtrosExcel,
    responseType: 'blob'
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `personas-tallas-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 📥 Exportar personas por edad a Excel
 */
export const exportPersonasEdadExcel = async (filtros: FiltrosEdad = {}): Promise<void> => {
  const filtrosExcel = { ...filtros, format: 'excel' as const };
  
  const response = await apiClient.get(`${BASE_URL}/edad`, {
    params: filtrosExcel,
    responseType: 'blob'
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `personas-edad-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 📥 Exportar reporte general a Excel
 */
export const exportReporteGeneralExcel = async (filtros: FiltrosReporteGeneral = {}): Promise<void> => {
  const filtrosExcel = { ...filtros, format: 'excel' as const };
  
  const response = await apiClient.get(`${BASE_URL}/reporte`, {
    params: filtrosExcel,
    responseType: 'blob'
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-general-personas-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
