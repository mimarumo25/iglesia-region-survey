/**
 * 📋 Ejemplo de Uso: PaginationControls
 * 
 * Este archivo muestra cómo implementar paginación en cualquier
 * vista del sistema usando el componente PaginationControls.
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaginationControls, SimplePaginationControls } from "@/components/ui/PaginationControls";
import { PaginationInfo } from "@/types/pagination";

// ============================================================================
// EJEMPLO 1: Paginación Completa (con selector de límite)
// ============================================================================

export const EjemploPaginacionCompleta = () => {
  // Estado de paginación
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    filter: ""
  });

  // Query con React Query
  const { data, isLoading } = useQuery({
    queryKey: ['items', queryParams],
    queryFn: async () => {
      // Simular llamada a API
      const response = await fetch(`/api/items?page=${queryParams.page}&limit=${queryParams.limit}`);
      return response.json();
    }
  });

  // Handlers
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setQueryParams(prev => ({ ...prev, page: 1, limit }));
  };

  // Paginación de la API
  const pagination: PaginationInfo = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  };

  return (
    <div>
      {/* Tu contenido aquí */}
      <div className="my-data-list">
        {data?.items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>

      {/* Paginación completa */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={isLoading}
          options={{
            showPageInfo: true,
            showItemsPerPage: true,
            showTotalItems: true,
            itemsPerPageOptions: [5, 10, 20, 50, 100]
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// EJEMPLO 2: Paginación Simple (solo navegación)
// ============================================================================

export const EjemploPaginacionSimple = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['items-simple', page],
    queryFn: async () => {
      const response = await fetch(`/api/items?page=${page}&limit=10`);
      return response.json();
    }
  });

  const pagination: PaginationInfo = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  };

  return (
    <div>
      {/* Contenido */}
      <div className="items">
        {data?.items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>

      {/* Paginación simple */}
      {pagination.totalPages > 1 && (
        <SimplePaginationControls
          pagination={pagination}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// ============================================================================
// EJEMPLO 3: Paginación Responsive (móvil/desktop)
// ============================================================================

export const EjemploPaginacionResponsive = () => {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10
  });

  // Hook para detectar tamaño de pantalla
  const isMobile = window.innerWidth < 768;

  const { data, isLoading } = useQuery({
    queryKey: ['items-responsive', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/items?page=${queryParams.page}&limit=${queryParams.limit}`);
      return response.json();
    }
  });

  const pagination: PaginationInfo = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  };

  return (
    <div>
      {/* Contenido */}
      <div className="items">
        {data?.items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>

      {/* Paginación responsive */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={(page) => setQueryParams(prev => ({ ...prev, page }))}
          onItemsPerPageChange={(limit) => setQueryParams(prev => ({ ...prev, page: 1, limit }))}
          isLoading={isLoading}
          options={{
            compact: isMobile // Activa modo compacto en móvil
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// EJEMPLO 4: Paginación con Filtros (caso completo)
// ============================================================================

export const EjemploPaginacionConFiltros = () => {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "all",
    category: ""
  });

  const { data, isLoading } = useQuery({
    queryKey: ['items-filtered', queryParams],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: queryParams.page.toString(),
        limit: queryParams.limit.toString(),
        search: queryParams.search,
        status: queryParams.status !== 'all' ? queryParams.status : '',
        category: queryParams.category
      });
      
      const response = await fetch(`/api/items?${params}`);
      return response.json();
    }
  });

  // Cuando cambian los filtros, volver a página 1
  const handleFilterChange = (newFilters: Partial<typeof queryParams>) => {
    setQueryParams(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Importante: resetear a página 1
    }));
  };

  const pagination: PaginationInfo = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  };

  return (
    <div>
      {/* Filtros */}
      <div className="filters mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={queryParams.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
        
        <select
          value={queryParams.status}
          onChange={(e) => handleFilterChange({ status: e.target.value })}
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      {/* Contenido */}
      <div className="items">
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          data?.items.map(item => (
            <div key={item.id}>{item.name}</div>
          ))
        )}
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={(page) => setQueryParams(prev => ({ ...prev, page }))}
          onItemsPerPageChange={(limit) => setQueryParams(prev => ({ ...prev, page: 1, limit }))}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// ============================================================================
// EJEMPLO 5: Paginación con Custom Hook
// ============================================================================

// Hook personalizado para manejar paginación
const usePaginatedData = (endpoint: string, initialParams = {}) => {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    ...initialParams
  });

  const query = useQuery({
    queryKey: [endpoint, queryParams],
    queryFn: async () => {
      const params = new URLSearchParams(
        Object.entries(queryParams).map(([key, value]) => [key, String(value)])
      );
      const response = await fetch(`${endpoint}?${params}`);
      return response.json();
    }
  });

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setQueryParams(prev => ({ ...prev, page: 1, limit }));
  };

  const updateFilters = (filters: any) => {
    setQueryParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    pagination: query.data?.pagination,
    handlePageChange,
    handleItemsPerPageChange,
    updateFilters
  };
};

// Uso del hook
export const EjemploConCustomHook = () => {
  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleItemsPerPageChange
  } = usePaginatedData('/api/items');

  if (!pagination) return null;

  return (
    <div>
      {/* Contenido */}
      <div className="items">
        {data?.items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// ============================================================================
// TIPS Y MEJORES PRÁCTICAS
// ============================================================================

/**
 * 💡 TIPS:
 * 
 * 1. Siempre resetear a página 1 al cambiar filtros o límite
 *    ✅ setQueryParams(prev => ({ ...prev, search: value, page: 1 }))
 *    ❌ setQueryParams(prev => ({ ...prev, search: value }))
 * 
 * 2. Usar React Query para caché automático
 *    - Evita requests duplicados
 *    - Maneja estados de loading automáticamente
 *    - Permite invalidación selectiva
 * 
 * 3. Implementar debounce en filtros de búsqueda
 *    const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * 4. Modo compacto en móviles
 *    options={{ compact: shouldUseMobileView }}
 * 
 * 5. Personalizar opciones de límite según el módulo
 *    itemsPerPageOptions: [10, 25, 50] // Para datasets pequeños
 *    itemsPerPageOptions: [20, 50, 100, 200] // Para datasets grandes
 * 
 * 6. Manejar estado vacío
 *    {pagination.totalItems === 0 ? <EmptyState /> : <DataList />}
 * 
 * 7. No mostrar paginación si solo hay 1 página
 *    {pagination.totalPages > 1 && <PaginationControls />}
 */
