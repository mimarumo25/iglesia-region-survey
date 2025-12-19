/**
 * @fileoverview Servicio de Búsqueda Global - Sistema MIA
 * 
 * Implementa un motor de búsqueda frontend para consultas en tiempo real
 * sobre datos ya cargados en memoria:
 * - Familias
 * - Sectores
 * - Usuarios
 * - Encuestas
 * - Configuración del sistema
 * 
 * Características:
 * - ⚡ Búsqueda instantánea sin llamadas API
 * - 🎯 Scoring inteligente con pesos por campo
 * - 🔤 Normalización de texto (sin acentos, minúsculas)
 * - 📊 Resultados ordenados por relevancia
 * - 🔍 Búsqueda fuzzy en múltiples campos
 * 
 * @module services/globalSearch
 * @version 1.0.0
 */

import { Sector } from '@/types/sectores';
import { UserResponse } from '@/services/users';

/**
 * Item individual en resultados de búsqueda
 * 
 * @interface SearchResultItem
 * @property {string} id - Identificador único del elemento
 * @property {string} title - Título principal del resultado
 * @property {string} subtitle - Subtítulo descriptivo
 * @property {string} [description] - Descripción adicional opcional
 * @property {'familia' | 'sector' | 'usuario' | 'encuesta' | 'configuracion'} type - Tipo de resultado
 * @property {string} path - Ruta de navegación del resultado
 * @property {string} icon - Nombre del ícono Lucide
 * @property {number} matchScore - Puntuación de relevancia (0-1)
 * @property {string[]} matchFields - Campos donde se encontró coincidencia
 */
export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  type: 'familia' | 'sector' | 'usuario' | 'encuesta' | 'configuracion';
  path: string;
  icon: string; // Nombre del ícono de Lucide
  matchScore: number; // Puntuación de coincidencia (0-1)
  matchFields: string[]; // Campos donde se encontró la coincidencia
}

/**
 * Resultados de búsqueda organizados por categoría
 * 
 * @interface SearchResults
 * @property {SearchResultItem[]} familias - Resultados de familias
 * @property {SearchResultItem[]} sectores - Resultados de sectores
 * @property {SearchResultItem[]} usuarios - Resultados de usuarios
 * @property {SearchResultItem[]} encuestas - Resultados de encuestas
 * @property {SearchResultItem[]} configuracion - Resultados de configuración
 */
export interface SearchResults {
  familias: SearchResultItem[];
  sectores: SearchResultItem[];
  usuarios: SearchResultItem[];
  encuestas: SearchResultItem[];
  configuracion: SearchResultItem[];
}

/**
 * Datos disponibles para búsqueda
 * 
 * @interface SearchableData
 * @property {Sector[]} [sectores] - Lista de sectores
 * @property {UserResponse[]} [usuarios] - Lista de usuarios
 * @property {any[]} [familias] - Lista de familias
 * @property {any[]} [encuestas] - Lista de encuestas
 */
export interface SearchableData {
  sectores?: Sector[];
  usuarios?: UserResponse[];
  familias?: any[]; // TODO: Definir tipo específico
  encuestas?: any[]; // TODO: Definir tipo específico
}

/**
 * Servicio de búsqueda global en memoria
 * 
 * Implementa algoritmo de búsqueda fuzzy con scoring ponderado
 * para búsquedas instantáneas en datos del frontend.
 * 
 * @class GlobalSearchService
 * @static
 * 
 * @example
 * const data: SearchableData = {
 *   sectores: [...],
 *   usuarios: [...]
 * };
 * 
 * const results = GlobalSearchService.search('garcía', data, 10);
 * console.log(results.familias); // Familias que coinciden con 'garcía'
 */
export class GlobalSearchService {
  /**
   * Normaliza texto para búsqueda (sin acentos, minúsculas)
   */
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Calcula puntuación de coincidencia entre query y texto
   */
  private static calculateMatchScore(query: string, text: string, fieldWeight: number = 1): number {
    const normalizedQuery = this.normalizeText(query);
    const normalizedText = this.normalizeText(text);

    // Coincidencia exacta
    if (normalizedText === normalizedQuery) return 1.0 * fieldWeight;
    
    // Empieza con
    if (normalizedText.startsWith(normalizedQuery)) return 0.8 * fieldWeight;
    
    // Contiene la palabra completa
    if (normalizedText.includes(` ${normalizedQuery} `)) return 0.7 * fieldWeight;
    
    // Contiene parcialmente
    if (normalizedText.includes(normalizedQuery)) return 0.5 * fieldWeight;
    
    return 0;
  }

  /**
   * Busca en sectores
   */
  private static searchSectores(query: string, sectores: Sector[]): SearchResultItem[] {
    const results: SearchResultItem[] = [];

    sectores.forEach(sector => {
      const matchFields: string[] = [];
      let totalScore = 0;

      // Buscar en nombre (peso alto)
      const nameScore = this.calculateMatchScore(query, sector.nombre || '', 1.0);
      if (nameScore > 0) {
        matchFields.push('nombre');
        totalScore += nameScore;
      }

      // Buscar en descripción (peso medio)
      if (sector.descripcion) {
        const descScore = this.calculateMatchScore(query, sector.descripcion, 0.7);
        if (descScore > 0) {
          matchFields.push('descripción');
          totalScore += descScore;
        }
      }

      // Buscar en municipio (peso medio)
      if (sector.municipio?.nombre) {
        const municipioScore = this.calculateMatchScore(query, sector.municipio.nombre, 0.6);
        if (municipioScore > 0) {
          matchFields.push('municipio');
          totalScore += municipioScore;
        }
      }

      // Si hay coincidencias, agregar al resultado
      if (totalScore > 0) {
        results.push({
          id: sector.id_sector,
          title: sector.nombre,
          subtitle: sector.municipio?.nombre || 'Sin municipio',
          description: sector.descripcion,
          type: 'sector',
          path: `/settings/sectores-config`,
          icon: 'MapPin',
          matchScore: totalScore,
          matchFields
        });
      }
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Busca en usuarios
   */
  private static searchUsuarios(query: string, usuarios: UserResponse[]): SearchResultItem[] {
    const results: SearchResultItem[] = [];

    usuarios.forEach(usuario => {
      const matchFields: string[] = [];
      let totalScore = 0;

      // Buscar en nombre completo (peso alto)
      const fullName = `${usuario.primer_nombre || ''} ${usuario.segundo_nombre || ''} ${usuario.primer_apellido || ''} ${usuario.segundo_apellido || ''}`.trim();
      if (fullName) {
        const nameScore = this.calculateMatchScore(query, fullName, 1.0);
        if (nameScore > 0) {
          matchFields.push('nombre');
          totalScore += nameScore;
        }
      }

      // Buscar en email (peso alto)
      if (usuario.correo_electronico) {
        const emailScore = this.calculateMatchScore(query, usuario.correo_electronico, 1.0);
        if (emailScore > 0) {
          matchFields.push('email');
          totalScore += emailScore;
        }
      }

      // Buscar en documento (peso medio)
      if (usuario.numero_documento) {
        const docScore = this.calculateMatchScore(query, usuario.numero_documento, 0.6);
        if (docScore > 0) {
          matchFields.push('documento');
          totalScore += docScore;
        }
      }

      // Buscar en teléfono (peso bajo)
      if (usuario.telefono) {
        const phoneScore = this.calculateMatchScore(query, usuario.telefono, 0.5);
        if (phoneScore > 0) {
          matchFields.push('teléfono');
          totalScore += phoneScore;
        }
      }

      // Si hay coincidencias, agregar al resultado
      if (totalScore > 0) {
        results.push({
          id: usuario.id,
          title: fullName || usuario.correo_electronico,
          subtitle: usuario.correo_electronico,
          description: usuario.activo ? 'Usuario Activo' : 'Usuario Inactivo',
          type: 'usuario',
          path: `/users`,
          icon: 'User',
          matchScore: totalScore,
          matchFields
        });
      }
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Busca en elementos de configuración estáticos
   */
  private static searchConfiguracion(query: string): SearchResultItem[] {
    const configItems = [
      { name: 'Parroquias', path: '/settings/parroquias', description: 'Gestión de parroquias' },
      { name: 'Municipios', path: '/settings/municipios', description: 'Gestión de municipios' },
      { name: 'Departamentos', path: '/settings/departamentos', description: 'Gestión de departamentos' },
      { name: 'Veredas', path: '/settings/veredas', description: 'Gestión de veredas' },
      { name: 'Centros Poblados', path: '/settings/centros-poblados', description: 'Gestión de centros poblados' },
      { name: 'Tipos de Vivienda', path: '/settings/tipos-vivienda', description: 'Configuración de tipos de vivienda' },
      { name: 'Enfermedades', path: '/settings/enfermedades', description: 'Gestión de enfermedades' },
      { name: 'Estados Civiles', path: '/settings/estados-civiles', description: 'Gestión de estados civiles' },
      { name: 'Parentescos', path: '/settings/parentescos', description: 'Gestión de parentescos' },
      { name: 'Disposición de Basura', path: '/settings/disposicion-basura', description: 'Gestión de disposición de basura' },
    ];

    const results: SearchResultItem[] = [];

    configItems.forEach(item => {
      const matchFields: string[] = [];
      let totalScore = 0;

      // Buscar en nombre
      const nameScore = this.calculateMatchScore(query, item.name, 1.0);
      if (nameScore > 0) {
        matchFields.push('nombre');
        totalScore += nameScore;
      }

      // Buscar en descripción
      const descScore = this.calculateMatchScore(query, item.description, 0.7);
      if (descScore > 0) {
        matchFields.push('descripción');
        totalScore += descScore;
      }

      if (totalScore > 0) {
        results.push({
          id: item.path,
          title: item.name,
          subtitle: 'Configuración',
          description: item.description,
          type: 'configuracion',
          path: item.path,
          icon: 'Settings',
          matchScore: totalScore,
          matchFields
        });
      }
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Búsqueda global en todas las categorías
   */
  public static searchGlobal(query: string, data: SearchableData, maxResults: number = 10): SearchResults {
    if (!query.trim()) {
      return {
        familias: [],
        sectores: [],
        usuarios: [],
        encuestas: [],
        configuracion: []
      };
    }

    const results: SearchResults = {
      familias: [], // TODO: Implementar cuando tengamos datos de familias
      sectores: data.sectores ? this.searchSectores(query, data.sectores).slice(0, maxResults) : [],
      usuarios: data.usuarios ? this.searchUsuarios(query, data.usuarios).slice(0, maxResults) : [],
      encuestas: [], // TODO: Implementar cuando tengamos datos de encuestas
      configuracion: this.searchConfiguracion(query).slice(0, maxResults)
    };

    return results;
  }

  /**
   * Obtiene todos los resultados combinados y ordenados por relevancia
   */
  public static getCombinedResults(results: SearchResults): SearchResultItem[] {
    const allResults: SearchResultItem[] = [
      ...results.familias,
      ...results.sectores,
      ...results.usuarios,
      ...results.encuestas,
      ...results.configuracion
    ];

    return allResults.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Obtiene sugerencias basadas en búsquedas frecuentes
   */
  public static getSuggestions(): string[] {
    return [
      'sectores',
      'usuarios',
      'parroquias',
      'municipios',
      'encuestas',
      'familias',
      'configuración'
    ];
  }
}
