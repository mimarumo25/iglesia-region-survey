/**
 * Tipos TypeScript para las estadísticas completas del sistema MIA
 * Basado en la respuesta del endpoint /api/estadisticas/completas
 */

// ==================== Resumen General ====================
export interface ResumenGeneral {
  totalPersonas: number
  totalPersonasVivas: number
  totalDifuntos: number
  totalFamilias: number
  totalUsuarios: number
  totalDepartamentos: number
  totalMunicipios: number
}

// ==================== Geografía ====================
export interface GeografiaTotal {
  departamentos: number
  municipios: number
  parroquias: number
  sectores: number
  veredas: number
}

export interface GeografiaDistribucion {
  departamento: string
  municipios: string
  parroquias: string
  familias: string
}

export interface Geografia {
  total: GeografiaTotal
  distribucion: GeografiaDistribucion
}

// ==================== Población ====================
export interface DistribucionSexo {
  sexo: string
  total: string
  porcentaje: string
}

export interface DistribucionEstadoCivil {
  estado_civil: string
  total: string
  porcentaje: string
}

export interface DistribucionEdad {
  rango_edad: string
  total: string
}

export interface DistribucionTipoIdentificacion {
  tipo_identificacion: string
  total: string
}

export interface Poblacion {
  total: number
  distribucionSexo: DistribucionSexo
  distribucionEstadoCivil: DistribucionEstadoCivil
  distribucionEdad: DistribucionEdad
  distribucionTipoIdentificacion: DistribucionTipoIdentificacion
}

// ==================== Familias ====================
export interface DistribucionPorParroquia {
  parroquia: string
  total_familias: string
  total_personas: string
}

export interface Familias {
  total: number
  promedioMiembrosPorFamilia: number
  maxMiembrosPorFamilia: number
  minMiembrosPorFamilia: number
  familiasConDifuntos: number
  distribucionPorParroquia: DistribucionPorParroquia
}

// ==================== Salud ====================
export interface DistribucionPorSexo {
  masculino: number
  femenino: number
}

export interface DistribucionPorEdadSalud {
  menores18: number
  entre18y60: number
  mayores60: number
}

export interface DistribucionPorEnfermedad {
  enfermedad: string
  totalPersonas: number
  porcentaje: number
  familias: number
  distribucionPorSexo: DistribucionPorSexo
  distribucionPorEdad: DistribucionPorEdadSalud
}

export interface Top10Enfermedad {
  enfermedad: string
  casos: number
  familias: number
  porcentajeDelTotal: number
}

export interface Salud {
  totalPersonas: number
  totalPersonasVivas: number
  personasConEnfermedades: number
  personasSanas: number
  distribucionPorEnfermedad: DistribucionPorEnfermedad[]
  familiasConPersonasEnfermas: number
  familiasCompletamenteSanas: number
  promedioEnfermosPorFamilia: number
  top10EnfermedadesMasComunes: Top10Enfermedad[]
  distribucionPorParroquia: any[]
}

// ==================== Educación ====================
export interface Top5Profesion {
  profesion: string
  totalPersonas: number
  familias: number
}

export interface Top5Habilidad {
  habilidad: string
  totalPersonas: number
  familias: number
}

export interface Educacion {
  totalPersonas: number
  personasConProfesion: number
  personasConHabilidades: number
  personasSinProfesion: number
  totalProfesionesCatalogo: number
  totalHabilidadesCatalogo: number
  familiasConProfesionales: number
  familiasConMultiplesProfesiones: number
  familiasConHabilidades: number
  promedioProfesionalesPorFamilia: number
  personasConProfesionYHabilidades: number
  personasSoloProfesion: number
  personasSoloHabilidades: number
  personasSinNinguna: number
  top5Profesiones: Top5Profesion[]
  top5Habilidades: Top5Habilidad[]
  distribucionEducativaPorParroquia: any[]
}

// ==================== Vivienda ====================
export interface DistribucionPorTipoVivienda {
  tipo_vivienda: string
  descripcion: string
  total_familias: string
  porcentaje: string
}

export interface DistribucionPorAcueducto {
  sistema_acueducto: string
  total_familias: string
  porcentaje: string
}

export interface DistribucionPorAguasResiduales {
  tipo_aguas_residuales: string
  descripcion: string
  total_familias: string
  porcentaje: string
}

export interface ResumenCategorias {
  tiposVivienda: number
  sistemasAcueducto: number
  tiposDisposicionBasura: number
  tiposAguasResiduales: number
}

export interface Vivienda {
  totalFamilias: number
  familiasConTipoVivienda: number
  distribucionPorTipoVivienda: DistribucionPorTipoVivienda[]
  distribucionPorAcueducto: DistribucionPorAcueducto[]
  distribucionPorDisposicionBasura: any[]
  distribucionPorAguasResiduales: DistribucionPorAguasResiduales[]
  resumenCategorias: ResumenCategorias
}

// ==================== Catálogos ====================
export interface Catalogos {
  sexos: number
  situacionesCiviles: number
  profesiones: number
  habilidades: number
  enfermedades: number
  parentescos: number
}

// ==================== Usuarios ====================
export interface DistribucionPorRol {
  rol: string
  totalUsuarios: number
  usuariosActivos: number
  usuariosInactivos: number
  porcentaje: number
}

export interface Top5RolesMasUsados {
  rol: string
  usuarios: number
  porcentaje: number
}

export interface Usuarios {
  totalUsuarios: number
  usuariosActivos: number
  usuariosInactivos: number
  emailsVerificados: number
  usuariosBloqueados: number
  totalRoles: number
  distribucionPorRol: DistribucionPorRol[]
  rolesEnUso: number
  rolesSinAsignar: number
  usuariosConMultiplesRoles: number
  top5RolesMasUsados: Top5RolesMasUsados[]
  rolesSinUsuarios: string[]
}

// ==================== Datos Completos ====================
export interface EstadisticasCompletasDatos {
  timestamp: string
  resumen: ResumenGeneral
  geografia: Geografia
  poblacion: Poblacion
  familias: Familias
  salud: Salud
  educacion: Educacion
  vivienda: Vivienda
  catalogos: Catalogos
  usuarios: Usuarios
}

// ==================== Respuesta API ====================
export interface EstadisticasCompletasResponse {
  exito: boolean
  mensaje: string
  datos: EstadisticasCompletasDatos
}
