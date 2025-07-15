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
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'checkbox' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface FormStage {
  id: number;
  title: string;
  description: string;
  fields?: FormField[];
  type?: string;
}

export interface SurveyData {
  informacionGeneral: Record<string, any>;
  familyMembers: FamilyMember[];
  timestamp: string;
  completed: boolean;
}
