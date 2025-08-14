// Tipos e interfaces para el formulario de encuesta

export interface FamilyMember {
  id: string;
  nombres: string;
  fechaNacimiento: Date | null;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  sexo: string;
  situacionCivil: string;
  parentesco: string;
  talla: { camisa: string; pantalon: string; calzado: string };
  estudio: string;
  comunidadCultural: string;
  telefono: string;
  enQueEresLider: string;
  habilidadDestreza: string;
  correoElectronico: string;
  enfermedad: string;
  necesidadesEnfermo: string;
  solicitudComunionCasa: boolean;
  profesionMotivoFechaCelebrar: { profesion: string; motivo: string; dia: string; mes: string };
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
  fechaAniversario: Date | null;
  eraPadre: boolean;
  eraMadre: boolean;
}

export interface SurveyData {
  informacionGeneral: Record<string, any>;
  familyMembers: FamilyMember[];
  deceasedMembers: DeceasedFamilyMember[];
  timestamp: string;
  completed: boolean;
}
