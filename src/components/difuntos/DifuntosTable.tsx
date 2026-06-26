/**
 * Tabla de Difuntos - Sistema MIA
 * 
 * Componente responsivo para mostrar los resultados de la consulta de difuntos
 * con todos los campos de la respuesta de la API
 * 
 * Características:
 * - Tabla responsiva con scroll horizontal para desktop
 * - Vista de tarjetas para móvil
 * - Paginación de resultados
 * - Indicadores de fuente de datos
 * - Estados de carga y error
 * - Formato de fechas en español
 * 
 * @version 1.1
 * @author Sistema MIA
 */

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar,
  MapPin,
  Phone,
  Home,
  Users,
  AlertCircle,
  Database,
  FileText
} from "lucide-react";

import { DifuntoAPI, DifuntosTableProps } from "@/types/difuntos";

/**
 * Componente DifuntosTable - Tabla de resultados de difuntos con vista responsive
 */
export const DifuntosTable = ({ data, isLoading, total = 0 }: DifuntosTableProps) => {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  /**
   * Obtiene el color del badge según la fuente de datos
   */
  const getBadgeVariant = (fuente: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (fuente) {
      case "personas":
        return "default";
      case "difuntos_familia":
        return "secondary";
      default:
        return "outline";
    }
  };

  /**
   * Componente de fila de skeleton para estado de carga
   */
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
  );

  /**
   * Componente de estado vacío
   */
  const EmptyState = () => (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No se encontraron registros</h3>
      <p className="text-muted-foreground">
        No hay difuntos que coincidan con los filtros aplicados.
        Intente ajustar los criterios de búsqueda.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Resultados de la Consulta
            </CardTitle>
            <CardDescription>
              {isLoading ? (
                "Buscando registros de difuntos..."
              ) : total > 0 ? (
                `Se encontraron ${total} registro${total === 1 ? '' : 's'} de difuntos`
              ) : (
                "Sin resultados para mostrar"
              )}
            </CardDescription>
          </div>
          
          {/* Leyenda de fuentes de datos */}
          {!isLoading && data.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Personas
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Difuntos Familia
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          // Estado de carga
          <div className="space-y-4">
            {/* Vista móvil de carga */}
            <div className="block md:hidden space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Vista desktop de carga */}
            <div className="hidden md:block professional-table-shell max-h-[60vh] overflow-hidden">
              <Table className="professional-data-table min-w-[1700px] text-[0.82rem]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Fuente</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Fecha Aniversario</TableHead>
                    <TableHead>Parentesco</TableHead>
                    <TableHead>Apellido Familiar</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Municipio</TableHead>
                    <TableHead>Parroquia</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : data.length === 0 ? (
          // Estado vacío
          <EmptyState />
        ) : (
          <div>
            {/* Vista móvil - Tarjetas */}
            <div className="block md:hidden">
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3 pr-4">
                  {data.map((difunto) => (
                    <Card 
                      key={`mobile-${difunto.fuente}-${difunto.id_difunto}`} 
                      className="border-l-4 border-l-primary"
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {/* Header con fuente y nombre */}
                          <div className="flex flex-col gap-2">
                            <Badge variant={getBadgeVariant(difunto.fuente)} className="text-xs w-fit">
                              {difunto.fuente === "personas" ? (
                                <>
                                  <Users className="h-3 w-3 mr-1" />
                                  Personas
                                </>
                              ) : (
                                <>
                                  <FileText className="h-3 w-3 mr-1" />
                                  Familia
                                </>
                              )}
                            </Badge>
                            <h3 className="font-medium text-base leading-tight">
                              {difunto.nombre_completo}
                            </h3>
                          </div>
                          
                          {/* Información principal */}
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium">Fecha:</span>
                              <span>{difunto.fecha_aniversario ?? '-'}</span>
                            </div>
                            
                            {difunto.parentesco_real && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Parentesco:</span>
                                <span>{difunto.parentesco_real}</span>
                              </div>
                            )}
                            
                            {difunto.apellido_familiar && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium min-w-fit">Familia:</span>
                                <span>{difunto.apellido_familiar}</span>
                              </div>
                            )}
                            
                            {(difunto.nombre_sector || difunto.sector) && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Sector:</span>
                                <span>{difunto.nombre_sector || difunto.sector}</span>
                              </div>
                            )}
                            
                            {difunto.telefono && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium">Teléfono:</span>
                                <a 
                                  href={`tel:${difunto.telefono}`} 
                                  className="text-primary hover:underline"
                                >
                                  {difunto.telefono}
                                </a>
                              </div>
                            )}
                            
                            {difunto.nombre_municipio && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium min-w-fit">Municipio:</span>
                                <span>{difunto.nombre_municipio}</span>
                              </div>
                            )}
                            
                            {difunto.nombre_parroquia && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium min-w-fit">Parroquia:</span>
                                <span>{difunto.nombre_parroquia}</span>
                              </div>
                            )}
                            
                            {difunto.direccion_familia && (
                              <div className="flex items-start gap-2">
                                <Home className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <span className="font-medium min-w-fit">Dirección:</span>
                                <span className="break-words">{difunto.direccion_familia}</span>
                              </div>
                            )}
                            
                            {difunto.observaciones && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium min-w-fit">Observaciones:</span>
                                <span className="break-words">{difunto.observaciones}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Vista desktop - Tabla */}
            <div className="hidden md:block professional-table-shell max-h-[65vh] overflow-hidden">
              <Table className="professional-data-table min-w-[1700px] text-[0.82rem]">
                    <TableHeader>
                      <TableRow className="bg-muted/70">
                        <TableHead className="w-[110px] sticky top-0 bg-muted z-20">Fuente</TableHead>
                        <TableHead className="w-[300px] sticky top-0 bg-muted z-20">Nombre Completo</TableHead>
                        <TableHead className="w-[160px] sticky top-0 bg-muted z-20">Fecha Aniversario</TableHead>
                        <TableHead className="w-[140px] sticky top-0 bg-muted z-20">Parentesco</TableHead>
                        <TableHead className="w-[190px] sticky top-0 bg-muted z-20">Apellido Familiar</TableHead>
                        <TableHead className="w-[140px] sticky top-0 bg-muted z-20">Sector</TableHead>
                        <TableHead className="w-[140px] sticky top-0 bg-muted z-20">Teléfono</TableHead>
                        <TableHead className="w-[150px] sticky top-0 bg-muted z-20">Municipio</TableHead>
                        <TableHead className="w-[160px] sticky top-0 bg-muted z-20">Parroquia</TableHead>
                        <TableHead className="w-[220px] sticky top-0 bg-muted z-20">Dirección</TableHead>
                        <TableHead className="w-[220px] sticky top-0 bg-muted z-20">Observaciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((difunto) => {
                        const rowKey = `${difunto.fuente}-${difunto.id_difunto}`;
                        const isSelected = selectedRowKey === rowKey;
                        return (
                        <TableRow
                          key={rowKey}
                          data-state={isSelected ? "selected" : undefined}
                          aria-selected={isSelected}
                          tabIndex={0}
                          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          onClick={() => setSelectedRowKey(rowKey)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedRowKey(rowKey);
                            }
                          }}
                        >
                          {/* Fuente */}
                          <TableCell>
                            <Badge variant={getBadgeVariant(difunto.fuente)} className="text-xs">
                              {difunto.fuente === "personas" ? (
                                <>
                                  <Users className="h-3 w-3 mr-1" />
                                  Personas
                                </>
                              ) : (
                                <>
                                  <FileText className="h-3 w-3 mr-1" />
                                  Familia
                                </>
                              )}
                            </Badge>
                          </TableCell>

                          {/* Nombre Completo */}
                          <TableCell className="font-medium">
                            {difunto.nombre_completo}
                          </TableCell>

                          {/* Fecha Aniversario */}
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {difunto.fecha_aniversario ?? '-'}
                            </div>
                          </TableCell>

                          {/* Parentesco */}
                          <TableCell>
                            <span className="text-sm">
                              {difunto.parentesco_real || '-'}
                            </span>
                          </TableCell>

                          {/* Apellido Familiar */}
                          <TableCell className="font-medium text-sm">
                            {difunto.apellido_familiar || '-'}
                          </TableCell>

                          {/* Sector */}
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {difunto.nombre_sector || difunto.sector || '-'}
                            </div>
                          </TableCell>

                          {/* Teléfono */}
                          <TableCell>
                            {difunto.telefono ? (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <a 
                                  href={`tel:${difunto.telefono}`}
                                  className="text-primary hover:underline"
                                >
                                  {difunto.telefono}
                                </a>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          {/* Municipio */}
                          <TableCell className="text-sm">
                            {difunto.nombre_municipio || '-'}
                          </TableCell>

                          {/* Parroquia */}
                          <TableCell className="text-sm">
                            {difunto.nombre_parroquia || '-'}
                          </TableCell>

                          {/* Dirección */}
                          <TableCell>
                            {difunto.direccion_familia ? (
                              <div className="flex items-start gap-1 text-sm">
                                <Home className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span className="break-words">
                                  {difunto.direccion_familia}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>

                          {/* Observaciones */}
                          <TableCell>
                            {difunto.observaciones ? (
                              <span className="text-sm break-words">
                                {difunto.observaciones}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DifuntosTable;