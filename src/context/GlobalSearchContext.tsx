import React, { createContext, useContext, ReactNode } from 'react';
import { useGlobalSearch, UseGlobalSearchReturn, UseGlobalSearchOptions } from '@/hooks/useGlobalSearch';
import { SearchableData } from '@/services/globalSearch';
import { useSectores } from '@/hooks/useSectores';
import { useUsers } from '@/hooks/useUsers';
import { Sector } from '@/types/sectores';
import { UserResponse } from '@/services/users';

interface GlobalSearchContextType extends UseGlobalSearchReturn {
  // Datos disponibles para búsqueda
  searchableData: SearchableData;
  isDataLoading: boolean;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

interface GlobalSearchProviderProps {
  children: ReactNode;
  options?: UseGlobalSearchOptions;
}

/**
 * Provider del contexto de búsqueda global
 * Maneja el estado compartido de búsqueda en toda la aplicación
 */
export const GlobalSearchProvider: React.FC<GlobalSearchProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  // Hooks de datos
  const { useActiveSectoresQuery } = useSectores();
  const { useUsersQuery } = useUsers();
  
  // Queries para obtener datos
  const { data: sectoresResponse, isLoading: sectoresLoading } = useActiveSectoresQuery();
  const { data: usuariosData, isLoading: usersLoading } = useUsersQuery();

  // Extraer sectores del response con type assertion
  let sectores: Sector[] = [];
  if (Array.isArray(sectoresResponse)) {
    sectores = sectoresResponse;
  } else if (sectoresResponse && 'data' in sectoresResponse) {
    const response = sectoresResponse as any;
    sectores = response.data?.data || [];
  }

  // Usuarios con type assertion
  const usuarios: UserResponse[] = (usuariosData as UserResponse[]) || [];

  // Preparar datos para búsqueda
  const searchableData: SearchableData = {
    sectores,
    usuarios,
    // TODO: Agregar familias y encuestas cuando estén disponibles
    familias: [],
    encuestas: []
  };

  // Hook de búsqueda global
  const searchHook = useGlobalSearch(searchableData, options);

  const contextValue: GlobalSearchContextType = {
    ...searchHook,
    searchableData,
    isDataLoading: sectoresLoading || usersLoading
  };

  return (
    <GlobalSearchContext.Provider value={contextValue}>
      {children}
    </GlobalSearchContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de búsqueda global
 */
export const useGlobalSearchContext = (): GlobalSearchContextType => {
  const context = useContext(GlobalSearchContext);
  
  if (context === undefined) {
    throw new Error('useGlobalSearchContext must be used within a GlobalSearchProvider');
  }
  
  return context;
};

/**
 * HOC para envolver componentes que necesiten búsqueda global
 */
export const withGlobalSearch = <P extends object>(
  Component: React.ComponentType<P>,
  options?: UseGlobalSearchOptions
) => {
  const WithGlobalSearchComponent = (props: P) => {
    return (
      <GlobalSearchProvider options={options}>
        <Component {...props} />
      </GlobalSearchProvider>
    );
  };
  
  WithGlobalSearchComponent.displayName = `withGlobalSearch(${Component.displayName || Component.name})`;
  
  return WithGlobalSearchComponent;
};
