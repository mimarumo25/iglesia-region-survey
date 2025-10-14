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
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Loader2, Users, CheckCircle2, XCircle } from "lucide-react";
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

  // Debug: Log para verificar valores
  console.log('📊 PersonasTable - Debug Paginación:', {
    total,
    pageSize,
    totalPages,
    currentPage,
    hasOnPageChange: !!onPageChange,
    personasLength: personas.length
  });

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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Resultados de Consulta
        </CardTitle>
        <CardDescription>
          Se encontraron <strong>{total}</strong> registros - Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {/* Información Personal */}
                <TableHead className="font-semibold min-w-[200px] sticky left-0 bg-muted/50 z-10">Nombre Completo</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Documento</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Tipo Identificación</TableHead>
                <TableHead className="font-semibold min-w-[80px]">Edad</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Fecha Nacimiento</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Sexo</TableHead>
                
                {/* Contacto */}
                <TableHead className="font-semibold min-w-[130px]">Teléfono</TableHead>
                <TableHead className="font-semibold min-w-[200px]">Correo Electrónico</TableHead>
                <TableHead className="font-semibold min-w-[250px]">Dirección Personal</TableHead>
                
                {/* Ubicación Geográfica */}
                <TableHead className="font-semibold min-w-[150px]">Municipio</TableHead>
                <TableHead className="font-semibold min-w-[180px]">Parroquia</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Sector</TableHead>
                <TableHead className="font-semibold min-w-[180px]">Vereda</TableHead>
                
                {/* Información Familiar */}
                <TableHead className="font-semibold min-w-[250px]">Dirección Familia</TableHead>
                <TableHead className="font-semibold min-w-[180px]">Apellido Familiar</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Parentesco</TableHead>
                <TableHead className="font-semibold min-w-[130px]">Teléfono Familia</TableHead>
                <TableHead className="font-semibold min-w-[140px]">Fecha Registro</TableHead>
                
                {/* Vivienda */}
                <TableHead className="font-semibold min-w-[120px]">Tipo Vivienda</TableHead>
                
                {/* Servicios Sanitarios (Booleanos) */}
                <TableHead className="font-semibold min-w-[120px]">Pozo Séptico</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Letrina</TableHead>
                <TableHead className="font-semibold min-w-[130px]">Campo Abierto</TableHead>
                
                {/* Manejo de Basura (Booleanos) */}
                <TableHead className="font-semibold min-w-[140px]">Recolector Basura</TableHead>
                <TableHead className="font-semibold min-w-[130px]">Basura Quemada</TableHead>
                <TableHead className="font-semibold min-w-[140px]">Basura Enterrada</TableHead>
                <TableHead className="font-semibold min-w-[130px]">Basura Recicla</TableHead>
                <TableHead className="font-semibold min-w-[140px]">Basura Aire Libre</TableHead>
                
                {/* Datos Personales */}
                <TableHead className="font-semibold min-w-[130px]">Estado Civil</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Profesión</TableHead>
                <TableHead className="font-semibold min-w-[150px]">Estudios</TableHead>
                <TableHead className="font-semibold min-w-[180px]">Comunidad Cultural</TableHead>
                <TableHead className="font-semibold min-w-[300px]">Liderazgo</TableHead>
                
                {/* Tallas */}
                <TableHead className="font-semibold min-w-[110px]">Talla Camisa</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Talla Pantalón</TableHead>
                <TableHead className="font-semibold min-w-[110px]">Talla Zapato</TableHead>
                
                {/* Salud */}
                <TableHead className="font-semibold min-w-[200px]">Necesidad Enfermo</TableHead>
                
                {/* Celebraciones */}
                <TableHead className="font-semibold min-w-[180px]">Motivo Celebrar</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Día Celebrar</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Mes Celebrar</TableHead>
                
                {/* Destrezas (Array) */}
                <TableHead className="font-semibold min-w-[200px]">Destrezas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personas.map((persona) => (
                <TableRow key={persona.id_personas} className="hover:bg-muted/30">
                  {/* Información Personal */}
                  <TableCell className="font-medium sticky left-0 bg-background z-10">
                    {formatValue(persona.nombre_completo)}
                  </TableCell>
                  <TableCell>{formatValue(persona.documento)}</TableCell>
                  <TableCell>{formatValue(persona.tipo_identificacion)}</TableCell>
                  <TableCell className="text-center">{formatValue(persona.edad)}</TableCell>
                  <TableCell>{formatDate(persona.fecha_nacimiento)}</TableCell>
                  <TableCell>{formatValue(persona.sexo)}</TableCell>
                  
                  {/* Contacto */}
                  <TableCell>{formatValue(persona.telefono)}</TableCell>
                  <TableCell className="text-xs">{formatValue(persona.correo_electronico)}</TableCell>
                  <TableCell>{formatValue(persona.direccion_personal)}</TableCell>
                  
                  {/* Ubicación Geográfica */}
                  <TableCell>{formatValue(persona.municipio)}</TableCell>
                  <TableCell>{formatValue(persona.parroquia)}</TableCell>
                  <TableCell>{formatValue(persona.sector)}</TableCell>
                  <TableCell>{formatValue(persona.vereda)}</TableCell>
                  
                  {/* Información Familiar */}
                  <TableCell>{formatValue(persona.direccion_familia)}</TableCell>
                  <TableCell>{formatValue(persona.apellido_familiar)}</TableCell>
                  <TableCell>{formatValue(persona.parentesco)}</TableCell>
                  <TableCell>{formatValue(persona.telefono_familia)}</TableCell>
                  <TableCell>{formatDate(persona.fecha_registro)}</TableCell>
                  
                  {/* Vivienda */}
                  <TableCell>{formatValue(persona.tipo_vivienda)}</TableCell>
                  
                  {/* Servicios Sanitarios */}
                  <TableCell>{formatBoolean(persona.pozo_septico)}</TableCell>
                  <TableCell>{formatBoolean(persona.letrina)}</TableCell>
                  <TableCell>{formatBoolean(persona.campo_abierto)}</TableCell>
                  
                  {/* Manejo de Basura */}
                  <TableCell>{formatBoolean(persona.basura_recolector)}</TableCell>
                  <TableCell>{formatBoolean(persona.basura_quemada)}</TableCell>
                  <TableCell>{formatBoolean(persona.basura_enterrada)}</TableCell>
                  <TableCell>{formatBoolean(persona.basura_recicla)}</TableCell>
                  <TableCell>{formatBoolean(persona.basura_aire_libre)}</TableCell>
                  
                  {/* Datos Personales */}
                  <TableCell>{formatValue(persona.estado_civil)}</TableCell>
                  <TableCell>{formatValue(persona.profesion)}</TableCell>
                  <TableCell>{formatValue(persona.estudios)}</TableCell>
                  <TableCell>{formatValue(persona.comunidad_cultural)}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={formatValue(persona.liderazgo)}>
                    {formatValue(persona.liderazgo)}
                  </TableCell>
                  
                  {/* Tallas */}
                  <TableCell className="text-center">{formatValue(persona.talla_camisa)}</TableCell>
                  <TableCell className="text-center">{formatValue(persona.talla_pantalon)}</TableCell>
                  <TableCell className="text-center">{formatValue(persona.talla_zapato)}</TableCell>
                  
                  {/* Salud */}
                  <TableCell>{formatValue(persona.necesidad_enfermo)}</TableCell>
                  
                  {/* Celebraciones */}
                  <TableCell>{formatValue(persona.motivo_celebrar)}</TableCell>
                  <TableCell className="text-center">{formatValue(persona.dia_celebrar)}</TableCell>
                  <TableCell className="text-center">{formatValue(persona.mes_celebrar)}</TableCell>
                  
                  {/* Destrezas */}
                  <TableCell>{formatArray(persona.destrezas)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Componente de Paginación */}
        {onPageChange && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} de {total} registros
              {totalPages > 1 && (
                <span className="ml-2 text-xs">
                  (Página {currentPage} de {totalPages})
                </span>
              )}
            </div>
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <PaginationPrevious className="p-0 h-auto border-0 bg-transparent hover:bg-transparent" />
                    </Button>
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <Button
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(pageNum)}
                          className={cn(
                            "min-w-[40px]",
                            currentPage === pageNum && "bg-primary text-white hover:bg-primary/90"
                          )}
                        >
                          {pageNum}
                        </Button>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      <PaginationNext className="p-0 h-auto border-0 bg-transparent hover:bg-transparent" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
        
        {/* Información de paginación */}
        <div className="text-sm text-muted-foreground text-center pt-2">
          💡 <strong>Tip:</strong> Desplázate horizontalmente para ver todos los campos de cada persona
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonasTable;
