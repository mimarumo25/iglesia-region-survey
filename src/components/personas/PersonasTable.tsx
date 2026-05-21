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
   * Renderiza el array de liderazgo extrayendo .nombre de objetos si los hay
   */
  const formatLiderazgoArray = (arr: Array<string | { id?: string | number; nombre: string }> | null | undefined): JSX.Element => {
    if (!arr || arr.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }
    const names = arr.map((item) =>
      typeof item === 'object' && item !== null ? (item.nombre ?? '') : String(item)
    ).filter(Boolean);
    if (names.length === 0) return <span className="text-muted-foreground">-</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {names.map((name, index) => (
          <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800 border-purple-300">
            {name}
          </Badge>
        ))}
      </div>
    );
  };

  /**
   * Formatea arrays (como destrezas) en badges
   */
  const formatArray = (arr: Array<string | { id?: string | number; nombre?: string }> | null | undefined): JSX.Element => {
    if (!arr || arr.length === 0) {
      return <span className="text-muted-foreground">-</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {arr.map((item, index) => {
          const label = typeof item === 'object' && item !== null ? (item.nombre ?? '-') : String(item);
          return (
            <Badge key={index} variant="outline" className="text-xs">
              {label}
            </Badge>
          );
        })}
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
            {personas.map((persona, idx) => (
              <div key={`${persona.identificacion}-${idx}`} className="pr-4">
                <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    {/* Header - Nombre y Documento */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate text-primary">
                          {formatValue(persona.nombres)}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          Doc: {formatValue(persona.identificacion)} ({formatValue(persona.tipo_identificacion)})
                        </p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        {formatDate(persona.fecha_nacimiento)}
                      </Badge>
                    </div>

                    {/* Información Personal */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2">
                      <div>
                        <p className="text-muted-foreground font-medium">Sexo</p>
                        <p className="font-medium">{formatValue(persona.sexo)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Nivel Educativo</p>
                        <p className="font-medium text-xs">{formatValue(persona.nivel_educativo)}</p>
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

                    {/* Dirección Personal */}
                    {persona.direccion && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium flex items-center gap-1">
                          <Home className="h-3 w-3" /> Dirección
                        </p>
                        <p className="font-medium">{formatValue(persona.direccion)}</p>
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
                          <p className="font-medium">{formatValue(persona.ubicacion?.municipio?.nombre)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Parroquia</span>
                          <p className="font-medium">{formatValue(persona.ubicacion?.parroquia?.nombre)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Sector</span>
                          <p className="font-medium">{formatValue(persona.ubicacion?.sector?.nombre)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Vereda</span>
                          <p className="font-medium">{formatValue(persona.ubicacion?.vereda?.nombre)}</p>
                        </div>
                        {persona.ubicacion?.corregimiento && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground text-xs">Corregimiento</span>
                            <p className="font-medium">{persona.ubicacion.corregimiento.nombre}</p>
                          </div>
                        )}
                        {persona.ubicacion?.centro_poblado && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground text-xs">Centro Poblado</span>
                            <p className="font-medium">{persona.ubicacion.centro_poblado.nombre}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Información Familiar */}
                    {(persona.familia?.apellido_familiar || persona.parentesco) && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Familia</p>
                        <div className="grid grid-cols-2 gap-1">
                          {persona.familia?.apellido_familiar && (
                            <div>
                              <span className="text-muted-foreground text-xs">Apellido Familiar</span>
                              <p className="font-medium">{formatValue(persona.familia.apellido_familiar)}</p>
                            </div>
                          )}
                          {persona.parentesco && (
                            <div>
                              <span className="text-muted-foreground text-xs">Parentesco</span>
                              <p className="font-medium">{formatValue(persona.parentesco)}</p>
                            </div>
                          )}
                          {persona.familia?.tipo_vivienda && (
                            <div>
                              <span className="text-muted-foreground text-xs">Tipo Vivienda</span>
                              <p className="font-medium">{formatValue(persona.familia.tipo_vivienda)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tallas */}
                    {(persona.tallas?.camisa || persona.tallas?.pantalon || persona.tallas?.zapato) && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Tallas</p>
                        <div className="flex gap-2 flex-wrap">
                          {persona.tallas?.camisa && (
                            <Badge variant="secondary" className="text-xs">
                              Camisa: {formatValue(persona.tallas.camisa)}
                            </Badge>
                          )}
                          {persona.tallas?.pantalon && (
                            <Badge variant="secondary" className="text-xs">
                              Pantalón: {formatValue(persona.tallas.pantalon)}
                            </Badge>
                          )}
                          {persona.tallas?.zapato && (
                            <Badge variant="secondary" className="text-xs">
                              Zapato: {formatValue(persona.tallas.zapato)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Aguas Residuales */}
                    {persona.familia?.aguas_residuales && persona.familia.aguas_residuales.length > 0 && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Aguas Residuales</p>
                        <div className="flex flex-wrap gap-1">
                          {persona.familia.aguas_residuales.map((item) => (
                            <Badge key={item.id} variant="outline" className="text-xs">{item.nombre}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disposición de Basura */}
                    {persona.familia?.disposicion_basura && persona.familia.disposicion_basura.length > 0 && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Disposición de Basura</p>
                        <div className="flex flex-wrap gap-1">
                          {persona.familia.disposicion_basura.map((item) => (
                            <Badge key={item.id} variant="outline" className="text-xs">{item.nombre}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sistema de Acueducto */}
                    {persona.familia?.sistema_acueducto && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Sistema Acueducto</p>
                        <Badge variant="outline" className="text-xs">{persona.familia.sistema_acueducto.nombre}</Badge>
                      </div>
                    )}

                    {/* Celebraciones */}
                    {persona.celebraciones && persona.celebraciones.length > 0 && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Celebraciones</p>
                        {persona.celebraciones.map((cel, i) => (
                          <p key={i} className="font-medium">{cel.motivo}: día {cel.dia}, mes {cel.mes}</p>
                        ))}
                      </div>
                    )}

                    {/* Destrezas */}
                    {persona.destrezas && persona.destrezas.length > 0 && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Destrezas</p>
                        {formatArray(persona.destrezas)}
                      </div>
                    )}

                    {/* Liderazgo */}
                    {persona.liderazgo && persona.liderazgo.length > 0 && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Liderazgo</p>
                        {formatLiderazgoArray(persona.liderazgo)}
                      </div>
                    )}

                    {/* Necesidades Especiales */}
                    {persona.necesidad_enfermo && persona.necesidad_enfermo.length > 0 && (
                      <div className="border-t pt-2 space-y-1 text-xs">
                        <p className="text-muted-foreground font-medium">Necesidades Especiales</p>
                        {formatArray(persona.necesidad_enfermo)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* VISTA DESKTOP - Tabla Completa (solo lg+) */}
        <div className="hidden lg:block rounded-md border overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {/* Información Personal */}
                  <TableHead className="font-semibold min-w-[200px] sticky left-0 bg-muted/50 z-10">Nombre Completo</TableHead>
                  <TableHead className="font-semibold min-w-[130px]">Identificación</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Fecha Nac.</TableHead>
                  <TableHead className="font-semibold min-w-[100px]">Sexo</TableHead>

                  {/* Contacto */}
                  <TableHead className="font-semibold min-w-[130px]">Teléfono</TableHead>
                  <TableHead className="font-semibold min-w-[180px]">Correo</TableHead>

                  {/* Ubicación Geográfica */}
                  <TableHead className="font-semibold min-w-[140px]">Municipio</TableHead>
                  <TableHead className="font-semibold min-w-[150px]">Parroquia</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Sector</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Vereda</TableHead>

                  {/* Información Familiar */}
                  <TableHead className="font-semibold min-w-[130px]">Parentesco</TableHead>
                  <TableHead className="font-semibold min-w-[160px]">Apellido Familiar</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Tipo Vivienda</TableHead>

                  {/* Datos Personales */}
                  <TableHead className="font-semibold min-w-[120px]">Estado Civil</TableHead>
                  <TableHead className="font-semibold min-w-[140px]">Profesión</TableHead>
                  <TableHead className="font-semibold min-w-[150px]">Nivel Educativo</TableHead>
                  <TableHead className="font-semibold min-w-[140px]">Comunidad Cultural</TableHead>

                  {/* Tallas */}
                  <TableHead className="font-semibold min-w-[90px] text-center">Camisa</TableHead>
                  <TableHead className="font-semibold min-w-[90px] text-center">Pantalón</TableHead>
                  <TableHead className="font-semibold min-w-[90px] text-center">Zapato</TableHead>

                  {/* Servicios */}
                  <TableHead className="font-semibold min-w-[160px]">Acueducto</TableHead>
                  <TableHead className="font-semibold min-w-[160px]">Aguas Residuales</TableHead>
                  <TableHead className="font-semibold min-w-[160px]">Disposición Basura</TableHead>

                  {/* Arrays */}
                  <TableHead className="font-semibold min-w-[140px]">Destrezas</TableHead>
                  <TableHead className="font-semibold min-w-[140px]">Liderazgo</TableHead>
                  <TableHead className="font-semibold min-w-[160px]">Necesidades Especiales</TableHead>
                  <TableHead className="font-semibold min-w-[160px]">Celebraciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personas.map((persona, idx) => (
                  <TableRow key={`${persona.identificacion}-${idx}`} className="hover:bg-muted/30">
                    {/* Información Personal */}
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      {formatValue(persona.nombres)}
                    </TableCell>
                    <TableCell className="text-sm">{formatValue(persona.identificacion)}</TableCell>
                    <TableCell className="text-sm">{formatDate(persona.fecha_nacimiento)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.sexo)}</TableCell>

                    {/* Contacto */}
                    <TableCell className="text-sm">{formatValue(persona.telefono)}</TableCell>
                    <TableCell className="text-xs truncate" title={formatValue(persona.correo_electronico)}>
                      {formatValue(persona.correo_electronico)}
                    </TableCell>

                    {/* Ubicación Geográfica */}
                    <TableCell className="text-sm">{formatValue(persona.ubicacion?.municipio?.nombre)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.ubicacion?.parroquia?.nombre)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.ubicacion?.sector?.nombre)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.ubicacion?.vereda?.nombre)}</TableCell>

                    {/* Información Familiar */}
                    <TableCell className="text-sm">{formatValue(persona.parentesco)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.familia?.apellido_familiar)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.familia?.tipo_vivienda)}</TableCell>

                    {/* Datos Personales */}
                    <TableCell className="text-sm">{formatValue(persona.estado_civil)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.profesion)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.nivel_educativo)}</TableCell>
                    <TableCell className="text-sm">{formatValue(persona.comunidad_cultural)}</TableCell>

                    {/* Tallas */}
                    <TableCell className="text-center text-sm">{formatValue(persona.tallas?.camisa)}</TableCell>
                    <TableCell className="text-center text-sm">{formatValue(persona.tallas?.pantalon)}</TableCell>
                    <TableCell className="text-center text-sm">{formatValue(persona.tallas?.zapato)}</TableCell>

                    {/* Servicios */}
                    <TableCell className="text-sm">{formatValue(persona.familia?.sistema_acueducto?.nombre)}</TableCell>
                    <TableCell className="text-sm">
                      {persona.familia?.aguas_residuales?.length
                        ? persona.familia.aguas_residuales.map(a => a.nombre).join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {persona.familia?.disposicion_basura?.length
                        ? persona.familia.disposicion_basura.map(b => b.nombre).join(', ')
                        : '-'}
                    </TableCell>

                    {/* Arrays */}
                    <TableCell className="text-sm">{formatArray(persona.destrezas)}</TableCell>
                    <TableCell className="text-sm">{formatLiderazgoArray(persona.liderazgo)}</TableCell>
                    <TableCell className="text-sm">{formatArray(persona.necesidad_enfermo)}</TableCell>
                    <TableCell className="text-sm">
                      {persona.celebraciones?.length
                        ? persona.celebraciones.map(c => `${c.motivo} (${c.dia}/${c.mes})`).join(', ')
                        : '-'}
                    </TableCell>
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
