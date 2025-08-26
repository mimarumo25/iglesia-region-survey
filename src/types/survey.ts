// Tipos e interfaces para el formulario de encuesta

// Nueva interfaz para datos con ID y nombre
export interface ConfigurationItem {
  id: string;
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
  talla_camisa: ConfigurationItem | null;
  talla_pantalon: ConfigurationItem | null;
  talla_zapato: ConfigurationItem | null;
  estudio: ConfigurationItem | null;
  comunidadCultural: ConfigurationItem | null;
  telefono: string;
  enQueEresLider: string;
  habilidadDestreza: string;
  correoElectronico: string;
  enfermedad: ConfigurationItem | null;
  necesidadesEnfermo: string;
  solicitudComunionCasa: boolean;
  profesionMotivoFechaCelebrar: { profesion: ConfigurationItem | null; motivo: string; dia: string; mes: string };
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

// Nueva estructura de datos organizada por sesiones
export interface SurveySessionData {
  // Información General con estructura id + nombre
  informacionGeneral: {
    municipio: ConfigurationItem | null;
    parroquia: ConfigurationItem | null;
    sector: ConfigurationItem | null;
    vereda: ConfigurationItem | null;
    fecha: string;
    apellido_familiar: string;
    direccion: string;
    telefono: string;
    numero_contrato_epm: string;
  };
  
  // Información de Vivienda
  vivienda: {
    tipo_vivienda: ConfigurationItem | null;
    disposicion_basuras: {
      recolector: boolean;
      quemada: boolean;
      enterrada: boolean;
      recicla: boolean;
      aire_libre: boolean;
      no_aplica: boolean;
    };
  };
  
  // Servicios de Agua y Saneamiento
  servicios_agua: {
    sistema_acueducto: ConfigurationItem | null;
    aguas_residuales: ConfigurationItem | null;
    pozo_septico: boolean;
    letrina: boolean;
    campo_abierto: boolean;
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
