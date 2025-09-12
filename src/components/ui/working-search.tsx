import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, MapPin, User, Settings, Home, Users, FileText, BarChart3, UserPlus, Heart, Droplets, Home as HomeIcon, Trash2, UserCheck, Globe, GraduationCap, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSectores } from '@/hooks/useSectores';
import { useUsers } from '@/hooks/useUsers';

// Base de datos completa de funcionalidades del sitio
const siteFunctionalities = [
  // Dashboard y páginas principales
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Panel principal del sistema', route: '/dashboard', category: 'Principal', icon: Home, keywords: ['inicio', 'principal', 'home', 'panel'] },
  { id: 'surveys', title: 'Encuestas', subtitle: 'Gestionar encuestas familiares', route: '/surveys', category: 'Principal', icon: FileText, keywords: ['encuestas', 'formularios', 'surveys'] },
  { id: 'families', title: 'Familias', subtitle: 'Registro y gestión de familias', route: '/families', category: 'Principal', icon: Users, keywords: ['familias', 'hogares', 'families'] },
  { id: 'reports', title: 'Reportes', subtitle: 'Visualizar reportes y estadísticas', route: '/reports', category: 'Principal', icon: BarChart3, keywords: ['reportes', 'estadísticas', 'gráficos', 'reports'] },
  
  // Usuarios y perfil
  { id: 'users', title: 'Usuarios', subtitle: 'Gestión de usuarios del sistema', route: '/users', category: 'Usuarios', icon: Users, keywords: ['usuarios', 'users', 'personas', 'administrar'] },
  { id: 'users-new', title: 'Nuevo Usuario', subtitle: 'Crear nuevo usuario', route: '/users/new', category: 'Usuarios', icon: UserPlus, keywords: ['nuevo', 'crear', 'usuario', 'registrar'] },
  { id: 'profile', title: 'Mi Perfil', subtitle: 'Ver y editar perfil personal', route: '/profile', category: 'Usuarios', icon: User, keywords: ['perfil', 'profile', 'mi cuenta', 'datos personales'] },
  
  // Configuraciones generales
  { id: 'settings', title: 'Configuraciones', subtitle: 'Configuración general del sistema', route: '/settings', category: 'Configuración', icon: Settings, keywords: ['configuración', 'settings', 'ajustes', 'configurar'] },
  
  // Configuraciones específicas - Geográficas
  { id: 'parroquias', title: 'Parroquias', subtitle: 'Gestión de parroquias', route: '/settings/parroquias', category: 'Geografía', icon: Building, keywords: ['parroquias', 'iglesias', 'territorial'] },
  { id: 'sectores', title: 'Sectores', subtitle: 'Gestión de sectores', route: '/settings/sectors', category: 'Geografía', icon: MapPin, keywords: ['sectores', 'zonas', 'areas', 'territorial'] },
  { id: 'veredas', title: 'Veredas', subtitle: 'Gestión de veredas', route: '/settings/veredas', category: 'Geografía', icon: MapPin, keywords: ['veredas', 'rural', 'territorial'] },
  { id: 'municipios', title: 'Municipios', subtitle: 'Gestión de municipios', route: '/settings/municipios', category: 'Geografía', icon: Building, keywords: ['municipios', 'ciudades', 'territorial'] },
  { id: 'departamentos', title: 'Departamentos', subtitle: 'Gestión de departamentos', route: '/settings/departamentos', category: 'Geografía', icon: Building, keywords: ['departamentos', 'estados', 'territorial'] },
  
  // Configuraciones de salud y bienestar
  { id: 'enfermedades', title: 'Enfermedades', subtitle: 'Catálogo de enfermedades', route: '/settings/enfermedades', category: 'Salud', icon: Heart, keywords: ['enfermedades', 'salud', 'médico', 'patologías'] },
  
  // Configuraciones de infraestructura
  { id: 'aguas-residuales', title: 'Aguas Residuales', subtitle: 'Sistemas de aguas residuales', route: '/settings/aguas-residuales', category: 'Infraestructura', icon: Droplets, keywords: ['aguas', 'residuales', 'alcantarillado', 'saneamiento'] },
  { id: 'tipos-vivienda', title: 'Tipos de Vivienda', subtitle: 'Clasificación de viviendas', route: '/settings/tipos-vivienda', category: 'Infraestructura', icon: HomeIcon, keywords: ['vivienda', 'casa', 'hogar', 'tipos'] },
  { id: 'disposicion-basura', title: 'Disposición de Basura', subtitle: 'Sistemas de manejo de basura', route: '/settings/disposicion-basura', category: 'Infraestructura', icon: Trash2, keywords: ['basura', 'residuos', 'desechos', 'recolección'] },
  
  // Configuraciones sociales
  { id: 'parentescos', title: 'Parentescos', subtitle: 'Tipos de parentesco familiar', route: '/settings/parentescos', category: 'Social', icon: Users, keywords: ['parentesco', 'familia', 'relación', 'familiar'] },
  { id: 'estados-civiles', title: 'Estados Civiles', subtitle: 'Estados civiles disponibles', route: '/settings/estados-civiles', category: 'Social', icon: UserCheck, keywords: ['estado civil', 'matrimonio', 'soltero', 'civil'] },
  { id: 'sexos', title: 'Géneros', subtitle: 'Clasificación de géneros', route: '/settings/sexos', category: 'Social', icon: User, keywords: ['género', 'sexo', 'masculino', 'femenino'] },
  { id: 'comunidades-culturales', title: 'Comunidades Culturales', subtitle: 'Grupos culturales', route: '/settings/comunidades-culturales', category: 'Social', icon: Globe, keywords: ['cultura', 'comunidad', 'étnico', 'cultural'] },
  { id: 'estudios', title: 'Nivel de Estudios', subtitle: 'Niveles educativos', route: '/settings/estudios', category: 'Social', icon: GraduationCap, keywords: ['educación', 'estudios', 'escolar', 'académico'] },
  { id: 'profesiones', title: 'Profesiones', subtitle: 'Catálogo de profesiones', route: '/settings/profesiones', category: 'Social', icon: User, keywords: ['profesión', 'trabajo', 'ocupación', 'empleo'] },
  // Tallas removed from quick search
];

interface WorkingSearchProps {
  className?: string;
  placeholder?: string;
}

/**
 * Búsqueda integral del sistema con navegación a funcionalidades
 * - Busca en funcionalidades del sitio (Dashboard, Configuraciones, etc.)
 * - Busca en datos dinámicos (Sectores, Usuarios)
 * - Incluye navegación inteligente con relevancia
 */
export const WorkingSearch: React.FC<WorkingSearchProps> = ({
  className = '',
  placeholder = 'Buscar funcionalidades, usuarios, sectores...'
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Hooks para datos reales con menos queries pesadas
  const { useActiveSectoresQuery } = useSectores();
  const { useUsersQuery } = useUsers();
  
  const { data: sectoresData, isLoading: sectoresLoading } = useActiveSectoresQuery();
  const { data: usersData, isLoading: usersLoading } = useUsersQuery();

  // Procesar datos de sectores
  const sectores = useMemo(() => {
    if (Array.isArray(sectoresData)) {
      return sectoresData;
    } else if (sectoresData && 'data' in sectoresData) {
      const response = sectoresData as any;
      return response.data?.data || [];
    }
    return [];
  }, [sectoresData]);

  // Procesar datos de usuarios
  const usuarios = useMemo(() => {
    return (usersData as any) || [];
  }, [usersData]);

  // Función de búsqueda optimizada con caché y mejor performance
  const searchResults = useMemo(() => {
    if (query.length < 1) return []; // Cambiar de 2 a 1

    const results: any[] = [];
    const searchTerm = query.toLowerCase();

    // 1. Buscar en funcionalidades del sitio (prioridad alta) - Optimizado
    for (const func of siteFunctionalities) {
      const matchTitle = func.title.toLowerCase().includes(searchTerm);
      const matchKeywords = func.keywords.some(keyword => keyword.includes(searchTerm));
      
      // Búsqueda más eficiente
      if (matchTitle || matchKeywords) {
        let relevance = 0;
        if (matchTitle) relevance += func.title.toLowerCase().startsWith(searchTerm) ? 15 : 10;
        if (matchKeywords) relevance += 5;

        results.push({
          id: `func-${func.id}`,
          title: func.title,
          subtitle: func.subtitle,
          description: func.category,
          type: 'funcionalidad',
          icon: func.icon,
          path: func.route,
          relevance,
          category: func.category
        });

        // Limitar temprano para mejor performance
        if (results.length >= 15) break;
      }
    }

    // Solo buscar en datos dinámicos si hay menos de 10 resultados de funcionalidades
    if (results.length < 10) {
      // 2. Buscar en sectores (limitado)
      sectores.slice(0, 50).forEach((sector: any) => {
        if (results.length >= 15) return;
        
        if (sector.nombre?.toLowerCase().includes(searchTerm)) {
          results.push({
            id: `sector-${sector.id_sector}`,
            title: sector.nombre,
            subtitle: sector.municipio?.nombre || 'Sin municipio',
            description: sector.descripcion,
            type: 'sector',
            icon: MapPin,
            path: '/sectors',
            relevance: 5
          });
        }
      });

      // 3. Buscar en usuarios (limitado)
      usuarios.slice(0, 30).forEach((usuario: any) => {
        if (results.length >= 15) return;
        
        const fullName = `${usuario.primer_nombre || ''} ${usuario.primer_apellido || ''}`.trim();
        if (fullName.toLowerCase().includes(searchTerm) || 
            usuario.correo_electronico?.toLowerCase().includes(searchTerm)) {
          results.push({
            id: `user-${usuario.id}`,
            title: fullName || usuario.correo_electronico,
            subtitle: usuario.correo_electronico,
            description: usuario.activo ? 'Usuario Activo' : 'Usuario Inactivo',
            type: 'usuario',
            icon: User,
            path: '/users',
            relevance: 4
          });
        }
      });
    }

    // Ordenar por relevancia y limitar resultados
    return results
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, 12);
  }, [query, sectores, usuarios]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Abrir inmediatamente si hay contenido
    setIsOpen(value.length >= 1);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleResultClick = (result: any) => {
    console.log('Navegando a:', result.path);
    navigate(result.path);
    setIsOpen(false);
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.working-search-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sector': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'usuario': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'funcionalidad': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'configuracion': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sector': return 'Sector';
      case 'usuario': return 'Usuario';
      case 'funcionalidad': return 'Funcionalidad';
      case 'configuracion': return 'Config';
      default: return type;
    }
  };

  return (
    <div className={`working-search-container relative w-full ${className}`}>
      {/* Input de búsqueda con icono visible y centrado */}
      <div className="relative w-full">
        {/* Icono de búsqueda - visible y bien posicionado */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
        
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="w-full pl-12 pr-12 py-3 text-sm text-left rounded-xl border-border/50 bg-gray-100 dark:bg-gray-800 backdrop-blur-sm hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm"
        />
        
        {/* Botón para limpiar y indicador de carga */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center z-10">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-muted rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          {(sectoresLoading || usersLoading) && query && (
            <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin ml-2" />
          )}
        </div>
      </div>

      {/* Resultados */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/30">
              <span className="font-medium text-sm">Resultados para "{query}"</span>
              <Badge variant="outline" className="text-xs">
                {searchResults.length}
              </Badge>
            </div>

            {/* Resultados */}
            {searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((result) => {
                  const IconComponent = result.icon;
                  return (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground truncate">
                            {result.title}
                          </h4>
                          <Badge variant="secondary" className={`text-xs ${getTypeColor(result.type)}`}>
                            {getTypeLabel(result.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                        {result.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center">
                <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
                <p className="text-xs text-muted-foreground/70">Intenta con otros términos</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
