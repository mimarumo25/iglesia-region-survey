import { AutocompleteOption } from "@/components/ui/autocomplete";
import { CatalogFormFieldDefinition } from "@/components/ui/config-modal";
import { apiClient } from "@/interceptors/axios";

export type CatalogCreateKey =
  | "municipio"
  | "parroquia"
  | "corregimiento"
  | "centro_poblado"
  | "vereda"
  | "sector"
  | "tipo_vivienda"
  | "sistema_acueducto"
  | "tipoIdentificacion"
  | "sexo"
  | "parentesco"
  | "situacionCivil"
  | "estudio"
  | "profesion"
  | "comunidadCultural"
  | "enfermedades"
  | "liderazgo"
  | "habilidades"
  | "destrezas";

export interface CatalogCreatedOption {
  id: string | number;
  nombre: string;
}

export interface CatalogCreateContext {
  municipioId?: string;
  departamentoOptions?: AutocompleteOption[];
}

interface CatalogCreateDefinition {
  title: string;
  description: string;
  submitText: string;
  endpoint: string;
  idKey: string;
  nameKey?: string;
  queryKeys: string[];
  fields: (context: CatalogCreateContext) => CatalogFormFieldDefinition[];
  buildPayload: (values: Record<string, string>, context: CatalogCreateContext) => Record<string, unknown>;
}

const commonFields = (nameLabel = "Nombre"): CatalogFormFieldDefinition[] => [
  { id: "nombre", label: nameLabel, placeholder: "Ingrese el nombre", required: true },
  { id: "descripcion", label: "Descripción", type: "textarea", placeholder: "Descripción opcional", rows: 3 },
];

export const CATALOG_CREATE_DEFINITIONS: Record<CatalogCreateKey, CatalogCreateDefinition> = {
  municipio: {
    title: "Nuevo municipio",
    description: "Crea un municipio usando el mismo formulario del módulo de Configuración.",
    submitText: "Crear Municipio",
    endpoint: "/api/catalog/municipios",
    idKey: "id_municipio",
    queryKeys: ["municipios", "allMunicipios"],
    fields: (context) => [
      { id: "nombre", label: "Nombre del municipio", placeholder: "Ingrese el nombre", required: true },
      { id: "codigo_dane", label: "Código DANE", placeholder: "Ingrese el código DANE", required: true },
      {
        id: "id_departamento",
        label: "Departamento",
        type: "autocomplete",
        placeholder: "Seleccionar departamento...",
        required: true,
        options: context.departamentoOptions || [],
      },
    ],
    buildPayload: (values) => ({
      nombre_municipio: values.nombre,
      codigo_dane: values.codigo_dane,
      id_departamento: Number(values.id_departamento),
    }),
  },
  parroquia: {
    title: "Nueva parroquia",
    description: "Crea una parroquia para el municipio seleccionado.",
    submitText: "Crear Parroquia",
    endpoint: "/api/catalog/parroquias",
    idKey: "id_parroquia",
    queryKeys: ["parroquias"],
    fields: () => commonFields(),
    buildPayload: (values, context) => ({ nombre: values.nombre, id_municipio: context.municipioId }),
  },
  corregimiento: {
    title: "Nuevo corregimiento",
    description: "Crea un corregimiento para el municipio seleccionado.",
    submitText: "Crear Corregimiento",
    endpoint: "/api/catalog/corregimientos",
    idKey: "id_corregimiento",
    queryKeys: ["corregimientos", "allCorregimientos"],
    fields: () => commonFields(),
    buildPayload: (values, context) => ({ nombre: values.nombre, id_municipio_municipios: Number(context.municipioId) }),
  },
  centro_poblado: {
    title: "Nuevo centro poblado",
    description: "Crea un centro poblado para el municipio seleccionado.",
    submitText: "Crear Centro Poblado",
    endpoint: "/api/catalog/centros-poblados",
    idKey: "id_centro_poblado",
    queryKeys: ["centrosPoblados", "allCentrosPoblados"],
    fields: () => commonFields(),
    buildPayload: (values, context) => ({ nombre: values.nombre, id_municipio_municipios: Number(context.municipioId) }),
  },
  vereda: {
    title: "Nueva vereda",
    description: "Crea una vereda para el municipio seleccionado.",
    submitText: "Crear Vereda",
    endpoint: "/api/catalog/veredas",
    idKey: "id_vereda",
    queryKeys: ["veredas"],
    fields: () => commonFields(),
    buildPayload: (values, context) => ({ nombre: values.nombre, id_municipio: Number(context.municipioId) }),
  },
  sector: {
    title: "Nuevo sector",
    description: "Crea un sector para el municipio seleccionado.",
    submitText: "Crear Sector",
    endpoint: "/api/catalog/sectores",
    idKey: "id_sector",
    queryKeys: ["sectores", "sectores-active"],
    fields: () => commonFields(),
    buildPayload: (values, context) => ({ nombre: values.nombre, id_municipio: Number(context.municipioId) }),
  },
  tipo_vivienda: {
    title: "Nuevo tipo de vivienda",
    description: "Crea un tipo de vivienda en el catálogo.",
    submitText: "Crear Tipo de Vivienda",
    endpoint: "/api/catalog/tipos-vivienda",
    idKey: "id_tipo_vivienda",
    queryKeys: ["tiposVivienda"],
    fields: () => commonFields(),
    buildPayload: (values) => ({ nombre: values.nombre, descripcion: values.descripcion, activo: true }),
  },
  sistema_acueducto: {
    title: "Nuevo sistema de acueducto",
    description: "Crea un sistema de acueducto en el catálogo.",
    submitText: "Crear Sistema",
    endpoint: "/api/catalog/sistemas-acueducto",
    idKey: "id_sistema_acueducto",
    queryKeys: ["sistemasAcueducto"],
    fields: () => commonFields(),
    buildPayload: (values) => ({ nombre: values.nombre, descripcion: values.descripcion, activo: true }),
  },
  tipoIdentificacion: {
    title: "Nuevo tipo de identificación",
    description: "Crea un tipo de identificación en el catálogo.",
    submitText: "Crear Tipo",
    endpoint: "/api/catalog/tipos-identificacion",
    idKey: "id_tipo_identificacion",
    queryKeys: ["tiposIdentificacion", "tiposIdentificacionActivos"],
    fields: () => [
      { id: "nombre", label: "Nombre", placeholder: "Ej: Cédula de Ciudadanía", required: true },
      { id: "codigo", label: "Código", placeholder: "Ej: CC", required: true },
      { id: "descripcion", label: "Descripción", type: "textarea", placeholder: "Descripción opcional" },
    ],
    buildPayload: (values) => ({ ...values, activo: true }),
  },
  sexo: {
    title: "Nuevo sexo",
    description: "Crea un nuevo tipo de sexo en el sistema.",
    submitText: "Crear Sexo",
    endpoint: "/api/catalog/sexos",
    idKey: "id_sexo",
    queryKeys: ["sexos"],
    fields: () => commonFields("Nombre del Sexo"),
    buildPayload: (values) => values,
  },
  parentesco: {
    title: "Nuevo parentesco",
    description: "Crea un parentesco en el catálogo.",
    submitText: "Crear Parentesco",
    endpoint: "/api/catalog/parentescos",
    idKey: "id_parentesco",
    queryKeys: ["parentescos"],
    fields: () => commonFields("Nombre del Parentesco"),
    buildPayload: (values) => values,
  },
  situacionCivil: {
    title: "Nuevo estado civil",
    description: "Crea un estado civil en el catálogo.",
    submitText: "Crear Estado Civil",
    endpoint: "/api/catalog/situaciones-civiles",
    idKey: "id",
    queryKeys: ["situaciones-civiles"],
    fields: () => commonFields("Nombre del Estado Civil"),
    buildPayload: (values) => ({ ...values, activo: true }),
  },
  estudio: {
    title: "Nuevo nivel de estudios",
    description: "Crea un nivel de estudios en el catálogo.",
    submitText: "Crear Nivel",
    endpoint: "/api/catalog/estudios",
    idKey: "id",
    nameKey: "nivel",
    queryKeys: ["estudios", "estudios-active"],
    fields: () => commonFields("Nivel de Estudios"),
    buildPayload: (values) => ({ nivel: values.nombre, descripcion: values.descripcion, ordenNivel: 99, activo: true }),
  },
  profesion: {
    title: "Nueva profesión",
    description: "Crea una profesión en el catálogo.",
    submitText: "Crear Profesión",
    endpoint: "/api/catalog/profesiones",
    idKey: "id_profesion",
    queryKeys: ["profesiones", "profesiones-active"],
    fields: () => commonFields("Nombre de la Profesión"),
    buildPayload: (values) => values,
  },
  comunidadCultural: {
    title: "Nueva comunidad cultural",
    description: "Crea una comunidad cultural en el catálogo.",
    submitText: "Crear Comunidad",
    endpoint: "/api/catalog/comunidades-culturales",
    idKey: "id_comunidad_cultural",
    queryKeys: ["comunidades-culturales"],
    fields: () => commonFields("Nombre de la Comunidad"),
    buildPayload: (values) => ({ ...values, activo: true }),
  },
  enfermedades: {
    title: "Nueva enfermedad",
    description: "Crea una enfermedad en el catálogo.",
    submitText: "Crear Enfermedad",
    endpoint: "/api/catalog/enfermedades",
    idKey: "id_enfermedad",
    queryKeys: ["enfermedades"],
    fields: () => commonFields("Nombre de la Enfermedad"),
    buildPayload: (values) => values,
  },
  liderazgo: {
    title: "Nuevo tipo de liderazgo",
    description: "Crea un tipo de liderazgo en el catálogo.",
    submitText: "Crear Liderazgo",
    endpoint: "/api/catalog/liderazgo",
    idKey: "id_tipo_liderazgo",
    queryKeys: ["liderazgo", "liderazgo-active-form"],
    fields: () => commonFields("Nombre del Liderazgo"),
    buildPayload: (values) => values,
  },
  habilidades: {
    title: "Nueva habilidad",
    description: "Crea una habilidad profesional en el catálogo.",
    submitText: "Crear Habilidad",
    endpoint: "/api/catalog/habilidades",
    idKey: "id_habilidad",
    queryKeys: ["habilidades", "habilidades-active"],
    fields: () => [
      ...commonFields("Nombre de la Habilidad"),
      { id: "nivel", label: "Nivel", placeholder: "Ej: Básico, Intermedio" },
    ],
    buildPayload: (values) => values,
  },
  destrezas: {
    title: "Nueva destreza",
    description: "Crea una destreza técnica en el catálogo.",
    submitText: "Crear Destreza",
    endpoint: "/api/catalog/destrezas",
    idKey: "id_destreza",
    queryKeys: ["destrezas", "destrezas-active"],
    fields: () => [
      ...commonFields("Nombre de la Destreza"),
      { id: "categoria", label: "Categoría", placeholder: "Ej: Técnica, Manual" },
    ],
    buildPayload: (values) => values,
  },
};

const findCreatedItem = (value: unknown, idKey: string): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (record[idKey] !== undefined) return record;
  for (const nested of Object.values(record)) {
    const found = findCreatedItem(nested, idKey);
    if (found) return found;
  }
  return null;
};

export const createCatalogOption = async (
  key: CatalogCreateKey,
  values: Record<string, string>,
  context: CatalogCreateContext = {}
): Promise<CatalogCreatedOption> => {
  const definition = CATALOG_CREATE_DEFINITIONS[key];
  const response = await apiClient.post(definition.endpoint, definition.buildPayload(values, context));
  const created = findCreatedItem(response.data, definition.idKey);
  const id = created?.[definition.idKey];
  if (id === undefined || id === null) {
    throw new Error("El catálogo se creó, pero la API no devolvió su identificador");
  }
  return {
    id: id as string | number,
    nombre: String(created?.[definition.nameKey || "nombre"] || values.nombre),
  };
};
