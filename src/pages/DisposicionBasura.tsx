import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ConfigurationTable from '@/components/ConfigurationTable';
import { useDisposicionBasura } from '@/hooks/useDisposicionBasura';
import { DisposicionBasura, DisposicionBasuraCreate, DisposicionBasuraResponse } from '@/types/disposicion-basura';
import { useResponsiveTypography } from '@/hooks/useTypography';
import {
  Trash2,
  Plus,
  Search,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const DisposicionBasuraPage = () => {
  const { getResponsiveTypographyClass } = useResponsiveTypography();

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id_tipo_disposicion_basura');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados locales del componente
  const [selectedDisposicion, setSelectedDisposicion] = useState<DisposicionBasura | null>(null);
  const [formData, setFormData] = useState<DisposicionBasuraCreate>({
    nombre: '',
    descripcion: '',
  });

  // Hooks de disposición basura
  const disposicionBasuraHook = useDisposicionBasura();
  
  // Query para obtener datos
  const queryResult = searchTerm
    ? disposicionBasuraHook.useSearchDisposicionBasuraQuery(searchTerm, page, limit, sortBy, sortOrder)
    : disposicionBasuraHook.useDisposicionBasuraQuery(page, limit, sortBy, sortOrder);

  const { data, isLoading, error } = queryResult;
  
  // Mutations
  const createMutation = disposicionBasuraHook.useCreateDisposicionBasuraMutation();
  const updateMutation = disposicionBasuraHook.useUpdateDisposicionBasuraMutation();
  const deleteMutation = disposicionBasuraHook.useDeleteDisposicionBasuraMutation();

  // Extraer datos de la respuesta
  const responseData = data as DisposicionBasuraResponse | undefined;
  const disposicionBasura = responseData?.data?.tipos || [];
  const pagination = responseData?.data?.pagination || { 
    currentPage: 1, 
    totalPages: 1, 
    totalItems: 0, 
    itemsPerPage: limit,
    hasNextPage: false,
    hasPrevPage: false
  };

  // Función para formatear fechas
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para refrescar datos (no necesaria con react-query, se revalida automáticamente)
  const handleRefresh = () => {
    queryResult.refetch();
  };

  // Funciones para las acciones
  const handleEdit = (disposicion: DisposicionBasura) => {
    setSelectedDisposicion(disposicion);
    setFormData({
      nombre: disposicion.nombre,
      descripcion: disposicion.descripcion || '',
    });
    // Aquí podrías abrir un modal de edición
  };

  const handleDelete = (disposicion: DisposicionBasura) => {
    setSelectedDisposicion(disposicion);
    // Aquí podrías abrir un modal de confirmación
    // Por ahora, eliminamos directamente
    deleteMutation.mutate(disposicion.id_tipo_disposicion_basura.toString());
  };

  const handleRowClick = (disposicion: DisposicionBasura) => {
    // Implementar navegación a detalle si es necesario
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header con diseño neutro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className={`${getResponsiveTypographyClass('h1')} text-foreground flex items-center gap-3`}>
            <Trash2 className="w-8 h-8 text-muted-foreground" />
            Gestión de Tipos de Disposición de Basura
          </h1>
          <p className={`text-muted-foreground mt-2 ${getResponsiveTypographyClass('body')}`}>
            Administra los tipos de disposición de basura para encuestas
          </p>
        </div>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tipos de disposición de basura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => {}}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Tipo
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className={`${getResponsiveTypographyClass('h3')} text-foreground flex items-center gap-2`}>
            <Trash2 className="w-5 h-5 text-muted-foreground" />
            Listado de Tipos de Disposición de Basura
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando tipos de disposición de basura...</span>
            </div>
          ) : disposicionBasura.length === 0 ? (
            <div className="text-center py-8">
              <Trash2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron tipos de disposición de basura</p>
              {searchTerm && (
                <p className="text-sm text-muted-foreground/70">
                  Intenta con otros términos de búsqueda
                </p>
              )}
            </div>
          ) : (
            <ConfigurationTable
              data={disposicionBasura}
              columns={[
                {
                  key: 'id_tipo_disposicion_basura',
                  title: 'ID',
                  render: (item) => item.id_tipo_disposicion_basura.toString(),
                  className: 'font-medium'
                },
                {
                  key: 'nombre',
                  title: 'Nombre',
                  render: (item) => (
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.nombre}</span>
                    </div>
                  )
                },
                {
                  key: 'descripcion',
                  title: 'Descripción',
                  render: (item) => (
                    <span>
                      {item.descripcion || 'N/A'}
                    </span>
                  )
                },
                {
                  key: 'created_at',
                  title: 'Fecha Creación',
                  render: (item) => (
                    <Badge variant="outline">
                      {formatDate(item.created_at)}
                    </Badge>
                  )
                }
              ]}
              loading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRowClick={handleRowClick}
              emptyState={{
                icon: <Trash2 className="w-12 h-12" />,
                title: 'No hay tipos de disposición',
                description: 'Comienza agregando el primer tipo de disposición de basura'
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisposicionBasuraPage;
