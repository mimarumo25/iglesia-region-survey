/**
 * Componente de tabla para mostrar familias consolidadas
 * Incluye filtros, paginación y acciones sobre las familias
 */

import React, { useState, useMemo } from 'react';
import { 
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download,
  Users,
  MapPin,
  Phone,
  Mail,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FamiliaTableRow } from '@/types/familias-consolidadas';

interface FamiliasConsolidadasTableProps {
  familias: FamiliaTableRow[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onFamiliaClick?: (familiaId: string) => void;
  onExport?: () => void;
  className?: string;
}

export const FamiliasConsolidadasTable: React.FC<FamiliasConsolidadasTableProps> = ({
  familias,
  isLoading = false,
  onRefresh,
  onFamiliaClick,
  onExport,
  className
}) => {
  // Estados para filtros y ordenamiento
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Definición de columnas
  const columns = useMemo<ColumnDef<FamiliaTableRow>[]>(() => [
    {
      accessorKey: 'codigo_familia',
      header: 'Código',
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue('codigo_familia')}
        </div>
      ),
    },
    {
      accessorKey: 'apellido_familiar',
      header: 'Apellido Familiar',
      cell: ({ row }) => (
        <div className="font-semibold">
          {row.getValue('apellido_familiar')}
        </div>
      ),
    },
    {
      accessorKey: 'ubicacion_completa',
      header: 'Ubicación',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate">
                <MapPin className="inline w-4 h-4 mr-1 text-muted-foreground" />
                {row.getValue('ubicacion_completa')}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue('ubicacion_completa')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'total_miembros',
      header: 'Total Miembros',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge variant="secondary" className="min-w-[40px]">
            <Users className="w-3 h-3 mr-1" />
            {row.getValue('total_miembros')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'total_vivos',
      header: 'Vivos',
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            {row.getValue('total_vivos')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'total_difuntos',
      header: 'Difuntos',
      cell: ({ row }) => {
        const difuntos = row.getValue('total_difuntos') as number;
        return (
          <div className="text-center">
            {difuntos > 0 ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
                {difuntos}
              </Badge>
            ) : (
              <span className="text-muted-foreground">0</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'total_menores',
      header: 'Menores',
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {row.getValue('total_menores')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'total_adultos',
      header: 'Adultos',
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {row.getValue('total_adultos')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'tiene_contacto',
      header: 'Contacto',
      cell: ({ row }) => {
        const tieneContacto = row.getValue('tiene_contacto') as boolean;
        return (
          <div className="flex justify-center">
            {tieneContacto ? (
              <div className="flex space-x-1">
                <Phone className="w-4 h-4 text-green-600" />
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">Sin contacto</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFamiliaClick?.(row.original.familia_id)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    }
  ], [onFamiliaClick]);

  // Configuración de la tabla
  const table = useReactTable({
    data: familias,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header con controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Familias Consolidadas
              </CardTitle>
              <CardDescription>
                Gestión y consulta de familias registradas en el sistema
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                Actualizar
              </Button>
              
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Controles de filtrado */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar familias..."
                  value={globalFilter ?? ''}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select
              value={(table.getColumn('total_miembros')?.getFilterValue() as string) ?? ''}
              onValueChange={(value) =>
                table.getColumn('total_miembros')?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por miembros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1">1 miembro</SelectItem>
                <SelectItem value="2">2 miembros</SelectItem>
                <SelectItem value="3">3+ miembros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Cargando familias...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => onFamiliaClick?.(row.original.familia_id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No hay familias registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Paginación */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} familias
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamiliasConsolidadasTable;