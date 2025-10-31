// Tipos e interfaces para el formulario de encuesta

// Nueva interfaz para datos con ID y nombre
export interface ConfigurationItem {
  id: string | number; // ID puede ser string o número dependiendo de la fuente
  nombre: string;
}

// Interfaz mejorada para miembros de familia con objetos estructurados
export interface FamilyMember {
  id: string;
  nombres: string;
  fechaNacimiento: Date | null;
  tipoIdentificacion: ConfigurationItem | null;
  numeroIdentificacion: string;
  sexo: ConfigurationItem | null;
  situacionCivil: ConfigurationItem | null;
  parentesco: ConfigurationItem | null;
  // Las tallas se almacenan como strings simples para usar con nuestro sistema de tallas
  talla_camisa: string;
  talla_pantalon: string;
  talla_zapato: string;
  estudio: ConfigurationItem | null;
  comunidadCultural: ConfigurationItem | null;
  telefono: string;
  enQueEresLider: string[];
  correoElectronico: string;
  enfermedades: Array<{ id: string; nombre: string }>;
  necesidadesEnfermo: string[];
  solicitudComunionCasa: boolean;
  profesionMotivoFechaCelebrar: {
    profesion: ConfigurationItem | null;
    celebraciones: Array<{ id: string; motivo: string; dia: string; mes: string }>;
  };
  // Nuevos campos: Habilidades y Destrezas como arrays de objetos
  habilidades: Array<{ id: number; nombre: string; nivel?: string }>;
  destrezas: Array<{ id: number; nombre: string }>;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'checkbox' | 'textarea' | 'autocomplete' | 'multiple-checkbox';
  required: boolean;
  options?: string[];
  configKey?: string; // Nueva propiedad para vincular con useConfigurationData
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  errorText?: string;
}

export interface FormStage {
  id: number;
  title: string;
  description: string;
  fields?: FormField[];
  type?: string;
}

export interface DeceasedFamilyMember {
  id: string;
  nombres: string;
  fechaFallecimiento: Date | null;
  sexo: ConfigurationItem | null;
  parentesco: ConfigurationItem | null;
  causaFallecimiento: string;
}

/**
 * Tipo para almacenar selecciones dinámicas basadas en IDs
 * Estructura: Array de objetos con id, nombre y estado de selección
 * 
 * Esta estructura permite que el frontend se adapte automáticamente
 * cuando las opciones cambian en el backend sin necesidad de modificar código.
 * 
 * @example
 * [
 *   { id: "1", nombre: "Recolección municipal", seleccionado: true },
 *   { id: "2", nombre: "Incineración", seleccionado: false },
 *   { id: "3", nombre: "Reciclaje", seleccionado: true }
 * ]
 */
export interface DynamicSelectionItem {
  id: string;
  nombre: string;
  seleccionado: boolean;
}

export type DynamicSelectionMap = DynamicSelectionItem[];

// Nueva estructura de datos organizada por sesiones
export interface SurveySessionData {
  // Información General con estructura id + nombre
  informacionGeneral: {
    municipio: ConfigurationItem | null;
    parroquia: ConfigurationItem | null;
    sector: ConfigurationItem | null;
    vereda: ConfigurationItem | null;
    corregimiento: ConfigurationItem | null;
    centro_poblado: ConfigurationItem | null;
    fecha: string;
    apellido_familiar: string;
    direccion: string;
    telefono: string;
    numero_contrato_epm: string;
  };
  
  // Información de Vivienda
  vivienda: {
    tipo_vivienda: ConfigurationItem | null;
    /**
     * Disposición de basuras con estructura dinámica basada en IDs
     * Array de objetos con id, nombre y estado de selección
     * Se adapta automáticamente a cambios en el backend
     * 
     * @example
     * [
     *   { id: "1", nombre: "Recolección municipal", seleccionado: true },
     *   { id: "2", nombre: "Botadero", seleccionado: false },
     *   { id: "3", nombre: "Reciclaje", seleccionado: true }
     * ]
     */
    disposicion_basuras: DynamicSelectionMap;
  };
  
  // Servicios de Agua y Saneamiento
  servicios_agua: {
    sistema_acueducto: ConfigurationItem | null;
    /**
     * Aguas residuales con estructura dinámica basada en IDs
     * Array de objetos con id, nombre y estado de selección
     * Se adapta automáticamente a cambios en el backend
     * 
     * @example
     * [
     *   { id: "1", nombre: "Pozo séptico", seleccionado: true },
     *   { id: "2", nombre: "Letrina", seleccionado: false },
     *   { id: "3", nombre: "Campo abierto", seleccionado: true }
     * ]
     */
    aguas_residuales: DynamicSelectionMap;
  };
  
  // Observaciones y consentimiento
  observaciones: {
    sustento_familia: string;
    observaciones_encuestador: string;
    autorizacion_datos: boolean;
  };
  
  // Miembros de familia y fallecidos (mantienen estructura existente)
  familyMembers: FamilyMember[];
  deceasedMembers: DeceasedFamilyMember[];
  
  // Metadata
  metadata: {
    timestamp: string;
    completed: boolean;
    currentStage: number;
  };
}

export interface SurveyData {
  informacionGeneral: Record<string, any>;
  familyMembers: FamilyMember[];
  deceasedMembers: DeceasedFamilyMember[];
  timestamp: string;
  completed: boolean;
}
