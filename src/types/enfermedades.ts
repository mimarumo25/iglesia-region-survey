export interface Enfermedad {
  id_enfermedad: string;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnfermedadCreate {
  nombre: string;
  descripcion: string;
}

export interface EnfermedadUpdate {
  nombre: string;
  descripcion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface EnfermedadesData {
  enfermedades: Enfermedad[];
  totalCount: number;
}

export interface EnfermedadesResponse {
  data: Enfermedad[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EnfermedadFormData {
  nombre: string;
  descripcion: string;
}

export interface EnfermedadPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Categorías predefinidas para enfermedades
export const CATEGORIAS_ENFERMEDADES = [
  { value: 'cardiovascular', label: 'Cardiovascular' },
  { value: 'respiratoria', label: 'Respiratoria' },
  { value: 'digestiva', label: 'Digestiva' },
  { value: 'neurologica', label: 'Neurológica' },
  { value: 'endocrina', label: 'Endocrina' },
  { value: 'musculoesqueletica', label: 'Musculoesquelética' },
  { value: 'dermatologica', label: 'Dermatológica' },
  { value: 'oftalmologica', label: 'Oftalmológica' },
  { value: 'otorrinolaringologica', label: 'Otorrinolaringológica' },
  { value: 'ginecologica', label: 'Ginecológica' },
  { value: 'urologica', label: 'Urológica' },
  { value: 'hematologica', label: 'Hematológica' },
  { value: 'infecciosa', label: 'Infecciosa' },
  { value: 'mental', label: 'Salud Mental' },
  { value: 'genetica', label: 'Genética' },
  { value: 'otra', label: 'Otra' },
] as const;

export type CategoriaEnfermedad = typeof CATEGORIAS_ENFERMEDADES[number]['value'];
