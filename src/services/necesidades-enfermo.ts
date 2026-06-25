import { apiClient } from '@/interceptors/axios';
import { API_ENDPOINTS } from '@/config/api';
import {
  NecesidadEnfermo,
  NecesidadEnfermoCreate,
  NecesidadEnfermoOption,
  NecesidadEnfermoUpdate,
  NecesidadesEnfermoParams,
  NecesidadesEnfermoResponse,
} from '@/types/necesidades-enfermo';

const endpoint = API_ENDPOINTS.CATALOG.NECESIDADES_ENFERMO;

type ApiRecord = Record<string, unknown>;

const asRecord = (value: unknown): ApiRecord =>
  typeof value === 'object' && value !== null ? value as ApiRecord : {};

const normalizeItem = (value: unknown): NecesidadEnfermo => {
  const item = asRecord(value);
  return {
    id_tipo_necesidad_enfermo: Number(
      item.id_tipo_necesidad_enfermo ?? item.id ?? item.value
    ),
    nombre: String(item.nombre ?? item.label ?? ''),
    descripcion: typeof item.descripcion === 'string' ? item.descripcion : null,
    activo: typeof item.activo === 'boolean' ? item.activo : true,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
    created_at: typeof item.created_at === 'string' ? item.created_at : undefined,
    updated_at: typeof item.updated_at === 'string' ? item.updated_at : undefined,
  };
};

const extractItems = (payload: unknown): unknown[] => {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const datos = asRecord(root.datos);
  const nestedDatos = asRecord(data.datos);
  const candidates = [
    datos.tipos,
    datos.necesidades,
    nestedDatos.tipos,
    nestedDatos.necesidades,
    data.items,
    data.necesidades,
    data.tipos_necesidad,
    data.data,
    root.data,
    root.items,
    payload,
  ];

  return candidates.find(Array.isArray) ?? [];
};

const extractItem = (payload: unknown): NecesidadEnfermo => {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const value = data.data ?? root.data ?? payload;
  return normalizeItem(value);
};

class NecesidadesEnfermoService {
  async getAll(params: NecesidadesEnfermoParams = {}): Promise<NecesidadesEnfermoResponse> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 50;
    const response = await apiClient.get(endpoint, {
      params: {
        sortBy: 'nombre',
        sortOrder: 'ASC',
        ...params,
        page,
        limit,
      },
    });

    const responseRoot = asRecord(response.data);
    const responseData = asRecord(responseRoot.data);
    const pagination = asRecord(responseRoot.pagination);
    const data = extractItems(response.data)
      .map(normalizeItem)
      .filter((item) => Number.isFinite(item.id_tipo_necesidad_enfermo) && item.nombre);
    const total = Number(
      pagination.totalItems ??
      responseData.total ??
      responseRoot.total ??
      data.length
    );
    const totalPages = Number(
      pagination.totalPages ??
      responseData.totalPages ??
      responseRoot.totalPages ??
      Math.max(1, Math.ceil(total / limit))
    );

    return { data, total, page, limit, totalPages };
  }

  async getSelectOptions(): Promise<NecesidadEnfermoOption[]> {
    try {
      const response = await apiClient.get(`${endpoint}/select`);
      const options = extractItems(response.data)
        .map(normalizeItem)
        .filter((item) => Number.isFinite(item.id_tipo_necesidad_enfermo) && item.nombre)
        .map((item) => ({
          id: item.id_tipo_necesidad_enfermo,
          nombre: item.nombre,
        }));

      if (options.length > 0) {
        return options;
      }
    } catch {
      // Use the paginated catalog endpoint as a fallback below.
    }

    const response = await this.getAll({ activo: true, limit: 500 });
    return response.data.map((item) => ({
      id: item.id_tipo_necesidad_enfermo,
      nombre: item.nombre,
    }));
  }

  async getById(id: number): Promise<NecesidadEnfermo> {
    const response = await apiClient.get(`${endpoint}/${id}`);
    return extractItem(response.data);
  }

  async create(data: NecesidadEnfermoCreate): Promise<NecesidadEnfermo> {
    const response = await apiClient.post(endpoint, data);
    return extractItem(response.data);
  }

  async update(id: number, data: NecesidadEnfermoUpdate): Promise<NecesidadEnfermo> {
    const response = await apiClient.put(`${endpoint}/${id}`, data);
    return extractItem(response.data);
  }

  async deactivate(id: number): Promise<void> {
    await apiClient.delete(`${endpoint}/${id}`);
  }
}

export const necesidadesEnfermoService = new NecesidadesEnfermoService();
