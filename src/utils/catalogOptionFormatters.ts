export interface NormalizedCatalogOption {
  id?: string | number;
  nombre: string;
}

const NAME_KEYS = [
  'nombre',
  'tipo_necesidad',
  'tipo_necesidad_enfermo',
  'name',
  'label',
  'descripcion',
  'value',
];

const ID_KEYS = [
  'id',
  'id_tipo_necesidad_enfermo',
  'id_necesidad_enfermo',
  'value',
];

const splitTextValue = (value: string): string[] => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '-' || trimmed.toLowerCase() === 'null') {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    return normalizeCatalogOptionLabels(parsed);
  } catch {
    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const getObjectLabel = (value: Record<string, unknown>): string | null => {
  for (const key of NAME_KEYS) {
    const rawValue = value[key];
    if (typeof rawValue === 'string' && rawValue.trim()) {
      return rawValue.trim();
    }
    if (typeof rawValue === 'number') {
      return String(rawValue);
    }
  }

  return null;
};

const getObjectId = (value: Record<string, unknown>): string | number | undefined => {
  for (const key of ID_KEYS) {
    const rawValue = value[key];
    if (typeof rawValue === 'string' || typeof rawValue === 'number') {
      return rawValue;
    }
  }

  return undefined;
};

export const normalizeCatalogOptions = (value: unknown): NormalizedCatalogOption[] => {
  if (value === null || value === undefined || value === false) {
    return [];
  }

  if (Array.isArray(value)) {
    const seen = new Set<string>();
    return value
      .flatMap((item) => normalizeCatalogOptions(item))
      .filter((item) => {
        const key = `${item.id ?? ''}:${item.nombre.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  if (typeof value === 'string') {
    return splitTextValue(value).map((nombre) => ({ nombre }));
  }

  if (typeof value === 'number') {
    return [{ nombre: String(value) }];
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const nestedValue = objectValue.data ?? objectValue.datos ?? objectValue.items;
    if (nestedValue !== undefined) {
      return normalizeCatalogOptions(nestedValue);
    }

    const label = getObjectLabel(objectValue);
    if (!label) return [];

    return [{
      id: getObjectId(objectValue),
      nombre: label,
    }];
  }

  return [];
};

export const normalizeCatalogOptionLabels = (value: unknown): string[] => (
  normalizeCatalogOptions(value).map((item) => item.nombre)
);

export const formatCatalogOptionLabels = (value: unknown, fallback = '-'): string => {
  const labels = normalizeCatalogOptionLabels(value);
  return labels.length ? labels.join(', ') : fallback;
};
