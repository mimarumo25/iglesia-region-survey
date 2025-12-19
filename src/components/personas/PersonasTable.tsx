/**
 * Componente de Tabla de Personas - Sistema MIA
 * 
 * @description Tabla reutilizable que muestra TODOS los campos de personas consolidadas.
 * Se usa en todos los tabs de PersonasReport (Geográfico, Familia, Personal, Tallas, Edad, Reporte).
 * 
 * @version 2.0
 * @since Sistema MIA v2.0
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Loader2, Users, CheckCircle2, XCircle, MapPin, Phone, Mail, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonaConsolidada } from "@/types/personas";

interface PersonasTableProps {
  personas: PersonaConsolidada[];
  isLoading: boolean;
  total: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

const PersonasTable = ({ personas, isLoading, total, currentPage = 1, pageSize = 100, onPageChange }: PersonasTableProps) => {
  // Calcular total de páginas
  const totalPages = Math.ceil(total / pageSize);

  /**
   * Genera array de números de página a mostrar
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 4) {
        // Cerca del inicio
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Cerca del final
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // En el medio
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };
  /**
   * Formatea valores booleanos con badges visuales
   */
  const formatBoolean = (value: boolean | null | undefined): JSX.Element => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }
    
    return value ? (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Sí
      </Badge>
    ) : (
      <Badge variant="secondary" className="gap-1">
        <XCircle className="h-3 w-3" />
        No
      </Badge>
    );
  };

  /**
   * Formatea fechas de manera legible
   */
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "-";
    
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  };

  /**
   * Formatea arrays (como destrezas) en badges
   */
  const formatArray = (arr: string[] | null | undefined): JSX.Element => {
    if (!arr || arr.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {arr.map((item, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
    );
  };

  /**
   * Renderiza valor genérico (maneja null/undefined)
   */
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Cargando datos de personas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (personas.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Users className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No se encontraron registros con los filtros aplicados</p>
            <p className="text-sm text-muted-foreground">Intenta ajustar los criterios de búsqueda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Users className="h-5 w-5" />
          Resultados de Consulta
        </CardTitle>
        <CardDescription className="text-sm">
          Se encontraron <strong>{total}</strong> registros - Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* VISTA MÓVIL - Tarjetas */}
        <div className="block lg:hidden space-y-3">
          <ScrollArea className="h-auto">
            {personas.map((persona) => (
              <div key={persona.id_personas} className="pr-4">
                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    {/* Header - Nombre y Documento */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate text-primary">
                          {formatValue(persona.nombre_completo)}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          Doc: {formatValue(persona.documento)} ({formatValue(persona.tipo_identificacion)})
                        </p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        {formatValue(persona.edad)} años
                      </Badge>
                    </div>

                    {/* Información Personal */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2">
                      <div>
                        <p className="text-muted-foreground font-medium">Sexo</p>
                        <p className="font-medium">{formatValue(persona.sexo)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Fecha Nac.</p>
                        <p className="font-medium text-xs">{formatDate(persona.fecha_nacimiento)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Estado Civil</p>
                        <p className="font-medium">{formatValue(persona.estado_civil)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Profesión</p>
                        <p className="font-medium">{formatValue(persona.profesion)}</p>
                      </div>
                    </div>

                    {/* Contacto */}
                    {(persona.telefono || persona.correo_electronico) && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Contacto</p>
                        {persona.telefono && (
                          <p className="flex items-center gap-2">
                            <Phone className="h-3 w-3 flex-shrink-0 text-primary" />
                            <span className="font-medium">{formatValue(persona.telefono)}</span>
                          </p>
                        )}
                        {persona.correo_electronico && (
                          <p className="flex items-center gap-2">
                            <Mail className="h-3 w-3 flex-shrink-0 text-primary" />
                            <span className="font-medium truncate">{formatValue(persona.correo_electronico)}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Ubicación - Personal */}
                    {persona.direccion_personal && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium flex items-center gap-1">
                          <Home className="h-3 w-3" /> Dirección Personal
                        </p>
                        <p className="font-medium">{formatValue(persona.direccion_personal)}</p>
                      </div>
                    )}

                    {/* Ubicación Geográfica */}
                    <div className="border-t pt-2 space-y-1 text-xs">
                      <p className="text-muted-foreground font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Ubicación Geográfica
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <span className="text-muted-foreground text-xs">Municipio</span>
                          <p className="font-medium">{formatValue(persona.municipio)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Parroquia</span>
                          <p className="font-medium">{formatValue(persona.parroquia)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Sector</span>
                          <p className="font-medium">{formatValue(persona.sector)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Vereda</span>
                          <p className="font-medium">{formatValue(persona.vereda)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Información Familiar */}
                    {(persona.apellido_familiar || persona.direccion_familia || persona.parentesco) && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Familia</p>
                        <div className="grid grid-cols-2 gap-1">
                          {persona.apellido_familiar && (
                            <div>
                              <span className="text-muted-foreground text-xs">Apellido Familiar</span>
                              <p className="font-medium">{formatValue(persona.apellido_familiar)}</p>
                            </div>
                          )}
                          {persona.parentesco && (
                            <div>
                              <span className="text-muted-foreground text-xs">Parentesco</span>
                              <p className="font-medium">{formatValue(persona.parentesco)}</p>
                            </div>
                          )}
                        </div>
                        {persona.direccion_familia && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground text-xs">Dirección Familia</span>
                            <p className="font-medium">{formatValue(persona.direccion_familia)}</p>
                          </div>
                        )}
                        {persona.telefono_familia && (
                          <p className="col-span-2 font-medium">Tel: {formatValue(persona.telefono_familia)}</p>
                        )}
                      </div>
                    )}

                    {/* Tallas */}
                    {(persona.talla_camisa || persona.talla_pantalon || persona.talla_zapato) && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Tallas</p>
                        <div className="flex gap-2 flex-wrap">
                          {persona.talla_camisa && (
                            <Badge variant="secondary" className="text-xs">
                              Camisa: {formatValue(persona.talla_camisa)}
                            </Badge>
                          )}
                          {persona.talla_pantalon && (
                            <Badge variant="secondary" className="text-xs">
                              Pantalón: {formatValue(persona.talla_pantalon)}
                            </Badge>
                          )}
                          {persona.talla_zapato && (
                            <Badge variant="secondary" className="text-xs">
                              Zapato: {formatValue(persona.talla_zapato)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Servicios Sanitarios */}
                    {(persona.pozo_septico !== undefined || persona.letrina !== undefined || persona.campo_abierto !== undefined) && (
                      <div className="border-t pt-2 space-y-2 text-xs">
                        <p className="text-muted-foreground font-medium">Servicios Sanitarios</p>
                        <div className="space-y-1">
                          {persona.pozo_septico !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Pozo Séptico:</span>
                              {formatBoolean(persona.pozo_septico)}
                            </div>
                          )}
                          {persona.letrina !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Letrina:</span>
                              {formatBoolean(persona.letrina)}
                            </div>
                          )}
                          {persona.campo_abierto !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Campo Abierto:</span>
                              {formatBoolean(persona.campo_abierto)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Manejo de Basura */}
                    {(persona.basura_recolector !== undefined || persona.basura_quemada !== undefined) && (
                      <div className="border-t pt-2 space-y-2 text-xs">
                        <p className="text-muted-foreground font-medium">Manejo de Basura</p>
                        <div className="space-y-1">
                          {persona.basura_recolector !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Recolector:</span>
                              {formatBoolean(persona.basura_recolector)}
                            </div>
                          )}
                          {persona.basura_quemada !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Quemada:</span>
                              {formatBoolean(persona.basura_quemada)}
                            </div>
                          )}
                          {persona.basura_enterrada !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Enterrada:</span>
                              {formatBoolean(persona.basura_enterrada)}
                            </div>
                          )}
                          {persona.basura_recicla !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Reciclaje:</span>
                              {formatBoolean(persona.basura_recicla)}
                            </div>
                          )}
                          {persona.basura_aire_libre !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Aire Libre:</span>
                              {formatBoolean(persona.basura_aire_libre)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Destrezas */}
                    {persona.destrezas && persona.destrezas.length > 0 && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Destrezas</p>
                        <div className="flex flex-wrap gap-1">
                          {persona.destrezas.map((destreza, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {destreza}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* VISTA TABLET - Tabla Simplificada (solo lg+) */}
        <div className="hidden lg:block rounded-md border overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {/* Información Personal */}
                  <TableHead className="font-semibold min-w-[200px] sticky left-0 bg-muted/50 z-10">Nombre Completo</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Documento</TableHead>
                  <TableHead className="font-semibold min-w-[100px]">Edad</TableHead>
                  <TableHead className="font-semibold min-w-[100px]">Sexo</TableHead>
                  
                  {/* Contacto */}
                  <TableHead className="font-semibold min-w-[130px]">Teléfono</TableHead>
                  <TableHead className="font-semibold min-w-[180px]">Correo</TableHead>
                  
                  {/* Ubicación Geográfica */}
                  <TableHead className="font-semibold min-w-[140px]">Municipio</TableHead>
                  <TableHead className="font-semibold min-w-[150px]">Parroquia</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Sector</TableHead>
                  
                  {/* Información Familiar */}
                  <TableHead className="font-semibold min-w-[130px]">Parentesco</TableHead>
                  <TableHead className="font-semibold min-w-[160px]">Apellido Familiar</TableHead>
                  
                  {/* Datos Personales */}
                  <TableHead className="font-semibold min-w-[120px]">Estado Civil</TableHead>
                  <TableHead className="font-semibold min-w-[140px]">Profesión</TableHead>
                  
                  {/* Tallas */}
                  <TableHead className="font-semibold min-w-[90px] text-center">Camisa</TableHead>
                  <TableHead className="font-semibold min-w-[90px] text-center">Pantalón</TableHead>
                  <TableHead className="font-semibold min-w-[90px] text-center">Zapato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personas.map((persona) => (
                  <TableRow key={persona.id_personas} className="hover:bg-muted/30">
                    {/* Información Personal */}
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      {formatValue(persona.nombre_completo)}
                    </TableCell>
                    <TableCell className="text-sm">{formatValue(persona.documento)}</TableCell>
                    <TableCell className="text-center text-sm">{formatValue(persona.edad)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.sexo)}</TableCell>
                    
                    {/* Contacto */}
                    <TableCell className="text-sm">{formatValue(persona.telefono)}</TableCell>
                    <TableCell className="text-xs truncate" title={formatValue(persona.correo_electronico)}>
                      {formatValue(persona.correo_electronico)}
                    </TableCell>
                    
                    {/* Ubicación Geográfica */}
                    <TableCell className="text-sm">{formatValue(persona.municipio)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.parroquia)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.sector)}</TableCell>
                    
                    {/* Información Familiar */}
                    <TableCell className="text-sm">{formatValue(persona.parentesco)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.apellido_familiar)}</TableCell>
                    
                    {/* Datos Personales */}
                    <TableCell className="text-sm">{formatValue(persona.estado_civil)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.profesion)}</TableCell>
                    
                    {/* Tallas */}
                    <TableCell className="text-center text-sm">{formatValue(persona.talla_camisa)}</TableCell>
                    <TableCell className="text-center text-sm">{formatValue(persona.talla_pantalon)}</TableCell>
                    <TableCell className="text-center text-sm">{formatValue(persona.talla_zapato)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
          </div>
        </div>
        
        {/* Componente de Paginación */}
        {onPageChange && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} de {total} registros
              {totalPages > 1 && (
                <span className="ml-2 text-xs">
                  (Pág. {currentPage}/{totalPages})
                </span>
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center sm:justify-end">
                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="gap-1 h-8 sm:h-9"
                      >
                        <PaginationPrevious className="p-0 h-auto border-0 bg-transparent hover:bg-transparent" />
                      </Button>
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, index) => (
                      <PaginationItem key={index} className="hidden sm:inline-flex">
                        {pageNum === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <Button
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(pageNum)}
                            className={cn(
                              "min-w-[36px] h-8 sm:h-9 sm:min-w-[40px]",
                              currentPage === pageNum && "bg-primary text-white hover:bg-primary/90"
                            )}
                          >
                            {pageNum}
                          </Button>
                        )}
                      </PaginationItem>
                    ))}
                    
                    {/* Solo mostrar página actual en móvil */}
                    <PaginationItem className="sm:hidden">
                      <div className="px-3 py-1.5 text-sm font-medium">
                        {currentPage} / {totalPages}
                      </div>
                    </PaginationItem>

                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="gap-1 h-8 sm:h-9"
                      >
                        <PaginationNext className="p-0 h-auto border-0 bg-transparent hover:bg-transparent" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
        
        {/* Información de paginación */}
        <div className="text-xs sm:text-sm text-muted-foreground text-center pt-2">
          💡 <strong>Tip:</strong> En móvil ves tarjetas completas. En desktop, tabla con scroll horizontal. En tablet, tabla simplificada.
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonasTable;
