/**
 * @fileoverview Tipos e interfaces principales para el sistema de encuestas MIA
 * 
 * Define las estructuras de datos para formularios de caracterización poblacional,
 * miembros de familia, difuntos, configuración dinámica y metadata de sesiones.
 * 
 * @module types/survey
 * @version 2.0.0
 */

/**
 * Item de configuración genérico para catálogos del sistema
 * 
 * Representa cualquier elemento de un catálogo (departamentos, municipios,
 * parroquias, tipos de identificación, etc.) con estructura normalizada.
 * 
 * @interface ConfigurationItem
 * @property {string | number} id - Identificador único (puede ser numérico o string según la fuente)
 * @property {string} nombre - Nombre descriptivo del elemento
 * @property {string | number | null} [id_municipio] - ID del municipio padre (para filtrado jerárquico)
 * 
 * @example
 * const departamento: ConfigurationItem = {
 *   id: 5,
 *   nombre: "Antioquia"
 * };
 * 
 * @example
 * const vereda: ConfigurationItem = {
 *   id: "123",
 *   nombre: "La Esperanza",
 *   id_municipio: 5
 * };
 */
export interface ConfigurationItem {
  id: string | number; // ID puede ser string o número dependiendo de la fuente
  nombre: string;
  id_municipio?: string | number | null; // Opcional: para filtrado jerárquico por municipio
}

/**
 * Miembro de familia en una encuesta
 * 
 * Estructura completa para caracterización de personas dentro del núcleo familiar,
 * incluyendo datos personales, contacto, salud, educación, habilidades y celebraciones.
 * 
 * @interface FamilyMember
 * @property {string} id - Identificador único del miembro (UUID generado en frontend)
 * @property {string} nombres - Nombres y apellidos completos
 * @property {Date | null} fechaNacimiento - Fecha de nacimiento (null si no se proporciona)
 * @property {ConfigurationItem | null} tipoIdentificacion - Tipo de documento (CC, TI, CE, etc.)
 * @property {string} numeroIdentificacion - Número del documento de identidad
 * @property {ConfigurationItem | null} sexo - Sexo biológico (Masculino, Femenino, Otro)
 * @property {ConfigurationItem | null} situacionCivil - Estado civil actual
 * @property {ConfigurationItem | null} parentesco - Relación con el jefe de hogar
 * @property {string} talla_camisa - Talla de camisa (XS, S, M, L, XL, XXL)
 * @property {string} talla_pantalon - Talla de pantalón (28, 30, 32, etc.)
 * @property {string} talla_zapato - Talla de calzado (35, 36, 37, etc.)
 * @property {ConfigurationItem | null} estudio - Nivel educativo alcanzado
 * @property {ConfigurationItem | null} comunidadCultural - Comunidad cultural de pertenencia
 * @property {string} telefono - Número de teléfono de contacto
 * @property {string[]} enQueEresLider - Áreas donde ejerce liderazgo comunitario
 * @property {string} correoElectronico - Email de contacto
 * @property {Array<{id: number; nombre: string}>} enfermedades - Enfermedades o condiciones de salud
 * @property {string[]} necesidadesEnfermo - Necesidades específicas por enfermedad
 * @property {boolean} solicitudComunionCasa - Si solicita comunión en casa
 * @property {Object} profesionMotivoFechaCelebrar - Datos de profesión y celebraciones
 * @property {ConfigurationItem | null} profesionMotivoFechaCelebrar.profesion - Profesión u oficio
 * @property {Array<{id: string; motivo: string; dia: string; mes: string}>} profesionMotivoFechaCelebrar.celebraciones - Fechas especiales a celebrar
 * @property {Array<{id: number; nombre: string; nivel?: string}>} habilidades - Habilidades personales con nivel opcional
 * @property {Array<{id: number; nombre: string}>} destrezas - Destrezas técnicas o manuales
 * 
 * @example
 * const miembro: FamilyMember = {
 *   id: "uuid-123",
 *   nombres: "Juan Pérez García",
 *   fechaNacimiento: new Date("1985-03-15"),
 *   tipoIdentificacion: { id: 1, nombre: "Cédula de Ciudadanía" },
 *   numeroIdentificacion: "1234567890",
 *   sexo: { id: 1, nombre: "Masculino" },
 *   situacionCivil: { id: 2, nombre: "Casado" },
 *   parentesco: { id: 1, nombre: "Jefe de hogar" },
 *   talla_camisa: "L",
 *   talla_pantalon: "32",
 *   talla_zapato: "42",
 *   estudio: { id: 3, nombre: "Técnico" },
 *   comunidadCultural: null,
 *   telefono: "3001234567",
 *   enQueEresLider: ["Acción Católica"],
 *   correoElectronico: "juan@example.com",
 *   enfermedades: [{ id: 5, nombre: "Diabetes" }],
 *   necesidadesEnfermo: [],
 *   solicitudComunionCasa: false,
 *   profesionMotivoFechaCelebrar: {
 *     profesion: { id: 10, nombre: "Carpintero" },
 *     celebraciones: [{ id: "1", motivo: "Cumpleaños", dia: "15", mes: "3" }]
 *   },
 *   habilidades: [{ id: 1, nombre: "Liderazgo", nivel: "Alto" }],
 *   destrezas: [{ id: 3, nombre: "Carpintería" }]
 * };
 */
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
  enfermedades: Array<{ id: number; nombre: string }>;
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

/**
 * Campo de formulario dinámico
 * 
 * Define la configuración de un campo individual del formulario de encuesta,
 * incluyendo tipo, validaciones, opciones y textos de ayuda.
 * 
 * @interface FormField
 * @property {string} id - Identificador único del campo
 * @property {string} label - Etiqueta visible del campo
 * @property {'text' | 'number' | 'date' | 'select' | 'boolean' | 'checkbox' | 'textarea' | 'autocomplete' | 'multiple-checkbox'} type - Tipo de input
 * @property {boolean} required - Si el campo es obligatorio
 * @property {string[]} [options] - Opciones para campos select o checkbox
 * @property {string} [configKey] - Clave para vincular con useConfigurationData
 * @property {string} [placeholder] - Texto de placeholder
 * @property {string} [emptyText] - Texto cuando no hay opciones
 * @property {string} [searchPlaceholder] - Placeholder del campo de búsqueda (autocomplete)
 * @property {string} [errorText] - Mensaje de error personalizado
 * 
 * @example
 * const campo: FormField = {
 *   id: "municipio",
 *   label: "Municipio",
 *   type: "autocomplete",
 *   required: true,
 *   configKey: "municipios",
 *   placeholder: "Seleccione un municipio",
 *   emptyText: "No hay municipios disponibles",
 *   searchPlaceholder: "Buscar municipio...",
 *   errorText: "El municipio es obligatorio"
 * };
 */
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

/**
 * Etapa del formulario multi-paso
 * 
 * Representa una sección completa del formulario de encuesta con sus campos asociados.
 * El formulario está dividido en 6 etapas progresivas.
 * 
 * @interface FormStage
 * @property {number} id - Número de la etapa (1-6)
 * @property {string} title - Título de la etapa
 * @property {string} description - Descripción de lo que se captura en esta etapa
 * @property {FormField[]} [fields] - Campos del formulario en esta etapa
 * @property {string} [type] - Tipo especial de etapa (e.g., "family-grid")
 * 
 * @example
 * const etapa: FormStage = {
 *   id: 1,
 *   title: "Información General",
 *   description: "Datos básicos de ubicación y contacto",
 *   fields: [
 *     { id: "municipio", label: "Municipio", type: "autocomplete", required: true },
 *     { id: "direccion", label: "Dirección", type: "text", required: true }
 *   ]
 * };
 */
export interface FormStage {
  id: number;
  title: string;
  description: string;
  fields?: FormField[];
  type?: string;
}

/**
 * Miembro fallecido de la familia
 * 
 * Registro de difuntos del núcleo familiar para control parroquial
 * y estadísticas de mortalidad.
 * 
 * @interface DeceasedFamilyMember
 * @property {string} id - Identificador único del registro (UUID)
 * @property {string} nombres - Nombres y apellidos completos del difunto
 * @property {Date | null} fechaFallecimiento - Fecha del fallecimiento
 * @property {ConfigurationItem | null} sexo - Sexo del difunto
 * @property {ConfigurationItem | null} parentesco - Relación con el jefe de hogar
 * @property {string} causaFallecimiento - Causa o motivo del fallecimiento
 * 
 * @example
 * const difunto: DeceasedFamilyMember = {
 *   id: "uuid-456",
 *   nombres: "María López",
 *   fechaFallecimiento: new Date("2023-05-10"),
 *   sexo: { id: 2, nombre: "Femenino" },
 *   parentesco: { id: 3, nombre: "Madre" },
 *   causaFallecimiento: "Enfermedad respiratoria"
 * };
 */
export interface DeceasedFamilyMember {
  id: string;
  nombres: string;
  fechaFallecimiento: Date | null;
  sexo: ConfigurationItem | null;
  parentesco: ConfigurationItem | null;
  causaFallecimiento: string;
}

/**
 * Item de selección dinámica
 * 
 * Representa una opción seleccionable en campos de selección múltiple dinámicos
 * (disposición de basura, aguas residuales, etc.).
 * 
 * Esta estructura permite que el frontend se adapte automáticamente cuando
 * las opciones cambian en el backend sin necesidad de modificar código.
 * 
 * @interface DynamicSelectionItem
 * @property {number} id - Identificador único de la opción
 * @property {string} nombre - Nombre descriptivo de la opción
 * @property {boolean} seleccionado - Si la opción está seleccionada
 * 
 * @example
 * const opcion: DynamicSelectionItem = {
 *   id: 1,
 *   nombre: "Recolección municipal",
 *   seleccionado: true
 * };
 */
export interface DynamicSelectionItem {
  id: number;
  nombre: string;
  seleccionado: boolean;
}

/**
 * Mapa de selecciones dinámicas
 * 
 * Array de items de selección múltiple para campos dinámicos.
 * 
 * @typedef {DynamicSelectionItem[]} DynamicSelectionMap
 * 
 * @example
 * const disposicionBasuras: DynamicSelectionMap = [
 *   { id: 1, nombre: "Recolección municipal", seleccionado: true },
 *   { id: 2, nombre: "Incineración", seleccionado: false },
 *   { id: 3, nombre: "Reciclaje", seleccionado: true }
 * ];
 */
export type DynamicSelectionMap = DynamicSelectionItem[];

/**
 * Datos de sesión de encuesta
 * 
 * Estructura principal que almacena todos los datos de una encuesta en progreso.
 * Se organiza por secciones lógicas y se persiste en localStorage para recuperación.
 * 
 * Esta estructura es la fuente de verdad del formulario y se transforma
 * al formato de API antes de enviar al backend.
 * 
 * @interface SurveySessionData
 * @property {Object} informacionGeneral - Datos de ubicación y contacto
 * @property {ConfigurationItem | null} informacionGeneral.municipio - Municipio de residencia
 * @property {ConfigurationItem | null} informacionGeneral.parroquia - Parroquia de pertenencia
 * @property {ConfigurationItem | null} informacionGeneral.sector - Sector dentro de la parroquia
 * @property {ConfigurationItem | null} informacionGeneral.vereda - Vereda de ubicación
 * @property {ConfigurationItem | null} informacionGeneral.corregimiento - Corregimiento
 * @property {ConfigurationItem | null} informacionGeneral.centro_poblado - Centro poblado
 * @property {string} informacionGeneral.fecha - Fecha de realización de la encuesta (ISO string)
 * @property {string} informacionGeneral.apellido_familiar - Apellido del núcleo familiar
 * @property {string} informacionGeneral.direccion - Dirección completa de residencia
 * @property {string} informacionGeneral.telefono - Teléfono de contacto
 * @property {string} informacionGeneral.numero_contrato_epm - Número de contrato EPM
 * 
 * @property {Object} vivienda - Información de la vivienda
 * @property {ConfigurationItem | null} vivienda.tipo_vivienda - Tipo de vivienda (casa, apartamento, etc.)
 * @property {DynamicSelectionMap} vivienda.disposicion_basuras - Métodos de disposición de basuras
 * 
 * @property {Object} servicios_agua - Servicios de agua y saneamiento
 * @property {ConfigurationItem | null} servicios_agua.sistema_acueducto - Sistema de acueducto
 * @property {DynamicSelectionMap} servicios_agua.aguas_residuales - Manejo de aguas residuales
 * 
 * @property {Object} observaciones - Observaciones y consentimiento
 * @property {string} observaciones.sustento_familia - Fuente principal de ingresos
 * @property {string} observaciones.observaciones_encuestador - Notas del encuestador
 * @property {boolean} observaciones.autorizacion_datos - Consentimiento de uso de datos
 * 
 * @property {FamilyMember[]} familyMembers - Miembros vivos del núcleo familiar
 * @property {DeceasedFamilyMember[]} deceasedMembers - Miembros fallecidos registrados
 * 
 * @property {Object} metadata - Metadata de control de la sesión
 * @property {string} metadata.timestamp - Timestamp de última modificación (ISO string)
 * @property {boolean} metadata.completed - Si la encuesta está completa
 * @property {number} metadata.currentStage - Etapa actual (1-6)
 * 
 * @example
 * const encuesta: SurveySessionData = {
 *   informacionGeneral: {
 *     municipio: { id: 5, nombre: "Medellín" },
 *     parroquia: { id: 10, nombre: "San José" },
 *     sector: { id: 1, nombre: "Norte" },
 *     vereda: null,
 *     corregimiento: null,
 *     centro_poblado: null,
 *     fecha: "2024-01-15",
 *     apellido_familiar: "García",
 *     direccion: "Calle 10 #20-30",
 *     telefono: "3001234567",
 *     numero_contrato_epm: "1234567890"
 *   },
 *   vivienda: {
 *     tipo_vivienda: { id: 1, nombre: "Casa" },
 *     disposicion_basuras: [
 *       { id: 1, nombre: "Recolección municipal", seleccionado: true }
 *     ]
 *   },
 *   servicios_agua: {
 *     sistema_acueducto: { id: 1, nombre: "Público" },
 *     aguas_residuales: [
 *       { id: 1, nombre: "Alcantarillado", seleccionado: true }
 *     ]
 *   },
 *   observaciones: {
 *     sustento_familia: "Comercio",
 *     observaciones_encuestador: "",
 *     autorizacion_datos: true
 *   },
 *   familyMembers: [],
 *   deceasedMembers: [],
 *   metadata: {
 *     timestamp: "2024-01-15T10:30:00.000Z",
 *     completed: false,
 *     currentStage: 1
 *   }
 * };
 */
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

/**
 * Datos de encuesta (formato simplificado)
 * 
 * Estructura simplificada para compatibilidad con código legacy.
 * Se recomienda usar SurveySessionData para nuevas implementaciones.
 * 
 * @interface SurveyData
 * @property {Record<string, any>} informacionGeneral - Información general (formato legacy)
 * @property {FamilyMember[]} familyMembers - Miembros de familia
 * @property {DeceasedFamilyMember[]} deceasedMembers - Miembros fallecidos
 * @property {string} timestamp - Timestamp de creación/modificación
 * @property {boolean} completed - Si la encuesta está completa
 * 
 * @deprecated Usar SurveySessionData en su lugar
 */
export interface SurveyData {
  informacionGeneral: Record<string, any>;
  familyMembers: FamilyMember[];
  deceasedMembers: DeceasedFamilyMember[];
  timestamp: string;
  completed: boolean;
}
