/**
 * MAPEO DINÁMICO DE DISPOSICIÓN DE BASURA
 * 
 * Este archivo centraliza toda la lógica de mapeo de opciones dinámicas
 * a campos booleanos. Es 100% flexible y se adapta a nuevas opciones.
 * 
 * VENTAJAS:
 * ✅ Centralizado en un solo lugar
 * ✅ Fácil de actualizar cuando nuevas opciones se agreguen
 * ✅ Reutilizable desde cualquier componente
 * ✅ Documentado con ejemplos de labels reales
 */

/**
 * Categorías de disposición de basura con palabras clave
 * Si el admin agrega nuevas opciones, solo agrega las palabras clave aquí
 */
export const DISPOSICION_BASURA_CATEGORIAS = {
  recolector: {
    campo: 'basuras_recolector',
    palabrasEtiqueta: ['recolección', 'recoleccion', 'empresa', 'pública', 'publica', 'municipal', 'servicio', 'recogida'],
    ejemplos: ['Recolección Pública', 'Empresa de Recolección', 'Servicio Municipal'],
    descripcion: 'Basura recolectada por empresa/servicio'
  },
  
  quemada: {
    campo: 'basuras_quemada',
    palabrasEtiqueta: ['quema', 'quemada', 'incineración', 'incineracion', 'incinerador', 'hornillo'],
    ejemplos: ['Quema', 'Incineración', 'Quema en Hornillo'],
    descripcion: 'Basura quemada o incinerada'
  },
  
  enterrada: {
    campo: 'basuras_enterrada',
    palabrasEtiqueta: ['enterr', 'enterrado', 'entierro', 'enterrador'],
    ejemplos: ['Enterrio', 'Enterrado en Predio', 'Entierro'],
    descripcion: 'Basura enterrada en el terreno'
  },
  
  recicla: {
    campo: 'basuras_recicla',
    palabrasEtiqueta: ['reciclaj', 'reciclar', 'composta', 'compostaje', 'compostage', 'compostadora'],
    ejemplos: ['Reciclaje', 'Compostaje', 'Reciclado', 'Compostadora'],
    descripcion: 'Basura reciclada o compostada'
  },
  
  aireLibre: {
    campo: 'basuras_aire_libre',
    palabrasEtiqueta: ['botader', 'aire libre', 'campo abierto', 'río', 'rio', 'quebrada', 'agua', 'acequia', 'canal', 'arroyo'],
    ejemplos: ['Botadero', 'Campo Abierto', 'Río o Quebrada', 'Aire Libre'],
    descripcion: 'Basura tirada en botadero o cuerpo de agua'
  }
};

/**
 * Mapea un label dinámico (que viene de la API) a una categoría
 * 
 * @param label - El label que viene desde configurationData (ej: "Recolección Pública")
 * @returns El nombre del campo booleano (ej: "basuras_recolector") o null si no coincide
 * 
 * EJEMPLO:
 * const campo = mapearLabelACategoria("Recolección Pública"); // "basuras_recolector"
 * const campo = mapearLabelACategoria("Quema"); // "basuras_quemada"
 * const campo = mapearLabelACategoria("Algo Nuevo"); // null (no definido aún)
 */
export const mapearLabelACategoria = (label: string): string | null => {
  if (!label || typeof label !== 'string') return null;
  
  const labelLower = label.toLowerCase().trim();
  
  // Buscar en cada categoría
  for (const [clave, config] of Object.entries(DISPOSICION_BASURA_CATEGORIAS)) {
    const coincide = config.palabrasEtiqueta.some(palabra => 
      labelLower.includes(palabra)
    );
    
    if (coincide) {
      return config.campo;
    }
  }
  
  // Si no coincide con ninguna categoría conocida, retornar null
  console.warn(
    `⚠️ DISPOSICION_BASURA: Label "${label}" no coincide con ninguna categoría conocida.`,
    'Añade sus palabras clave en DISPOSICION_BASURA_CATEGORIAS si es una nueva opción.'
  );
  
  return null;
};

/**
 * Procesa un array de IDs seleccionados y retorna objeto con booleanos
 * 
 * @param selectedIds - Array de IDs seleccionados (["1", "3", "5"])
 * @param optionsDelConfig - Array de opciones del configurationData con { value, label, ... }
 * @returns Objeto con booleanos para todos los campos de basura
 * 
 * EJEMPLO:
 * const resultado = procesarDisposicionBasura(
 *   ["id-1", "id-3"],
 *   configurationData.disposicionBasuraOptions
 * );
 * // Retorna:
 * // {
 * //   basuras_recolector: true,
 * //   basuras_quemada: false,
 * //   basuras_enterrada: true,
 * //   basuras_recicla: false,
 * //   basuras_aire_libre: false,
 * //   basuras_no_aplica: false
 * // }
 */
interface DisposicionBasuraBooleanos {
  basuras_recolector: boolean;
  basuras_quemada: boolean;
  basuras_enterrada: boolean;
  basuras_recicla: boolean;
  basuras_aire_libre: boolean;
  basuras_no_aplica: boolean;
}

export const procesarDisposicionBasura = (
  selectedIds: string[],
  optionsDelConfig: any[] = []
): DisposicionBasuraBooleanos => {
  // Inicializar todos los campos en false
  const resultado: DisposicionBasuraBooleanos = {
    basuras_recolector: false,
    basuras_quemada: false,
    basuras_enterrada: false,
    basuras_recicla: false,
    basuras_aire_libre: false,
    basuras_no_aplica: false
  };
  
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
    resultado.basuras_no_aplica = true;
    return resultado;
  }
  
  // Procesar cada ID seleccionado
  selectedIds.forEach((id: string) => {
    // Buscar la opción con este ID
    const option = optionsDelConfig.find((opt: any) => opt.value === id || opt.id === id);
    
    if (!option || !option.label) {
      console.warn(`⚠️ DISPOSICION_BASURA: No se encontró opción con ID "${id}"`);
      return;
    }
    
    // Mapear el label a una categoría
    const campoBooleano = mapearLabelACategoria(option.label);
    
    if (campoBooleano && campoBooleano in resultado) {
      (resultado as Record<string, any>)[campoBooleano] = true;
    }
  });
  
  return resultado;
};

/**
 * Genera un reporte de debug mostrando cómo se mapean todas las opciones
 * ÚTIL para debugging cuando se agreguen nuevas opciones
 * 
 * @param optionsDelConfig - Array de opciones del configurationData
 * @returns String formateado con reporte legible
 * 
 * EJEMPLO EN CONSOLA:
 * console.log(reporteMapeoDisposicionBasura(configurationData.disposicionBasuraOptions));
 */
export const reporteMapeoDisposicionBasura = (optionsDelConfig: any[] = []): string => {
  if (!Array.isArray(optionsDelConfig) || optionsDelConfig.length === 0) {
    return '📭 No hay opciones de disposición de basura configuradas';
  }
  
  let reporte = '\n📊 MAPEO DE DISPOSICIÓN DE BASURA\n';
  reporte += '='.repeat(60) + '\n';
  
  optionsDelConfig.forEach((option: any, index: number) => {
    const label = option.label || '(sin label)';
    const id = option.value || option.id || '(sin id)';
    const campoBooleano = mapearLabelACategoria(label);
    const estado = campoBooleano ? '✅' : '❌ NO MAPEADO';
    
    reporte += `\n${index + 1}. "${label}" (ID: ${id})\n`;
    reporte += `   ${estado} → ${campoBooleano || 'Necesita categoría'}\n`;
  });
  
  reporte += '\n' + '='.repeat(60);
  reporte += '\n📝 Si ves ❌, actualiza DISPOSICION_BASURA_CATEGORIAS con las palabras clave del nuevo label\n';
  
  return reporte;
};

/**
 * Valida si todas las opciones del config están mapeadas correctamente
 * RETORNA: { valido: boolean, noMapeados: string[] }
 */
export const validarMapeoCompleto = (optionsDelConfig: any[] = []): { valido: boolean; noMapeados: string[] } => {
  const noMapeados: string[] = [];
  
  optionsDelConfig.forEach((option: any) => {
    const label = option.label || '';
    const campoBooleano = mapearLabelACategoria(label);
    
    if (!campoBooleano) {
      noMapeados.push(`"${label}" (ID: ${option.value || option.id || '?'})`);
    }
  });
  
  return {
    valido: noMapeados.length === 0,
    noMapeados
  };
};
