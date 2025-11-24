/**
 * 🏥 Componente SaludList - Lista de Personas con Condiciones de Salud
 * Sistema MIA - Módulo de Salud
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, MapPin, Calendar, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import type { PersonaSalud } from "@/types/salud";

interface SaludListProps {
  personas: PersonaSalud[];
  isLoading?: boolean;
  // Paginación
  currentPage?: number;
  totalPages?: number;
  total?: number;
  limite?: number;
  onPageChange?: (page: number) => void;
}

/**
 * Componente para mostrar la lista de personas con condiciones de salud
 * 
 * @param personas - Array de personas a mostrar
 * @param isLoading - Indicador de carga
 * @param currentPage - Página actual (para paginación)
 * @param totalPages - Total de páginas disponibles
 * @param total - Total de registros
 * @param limite - Límite de registros por página
 * @param onPageChange - Callback para cambio de página
 */
const SaludList = ({ 
  personas, 
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  total = 0,
  limite = 10,
  onPageChange
}: SaludListProps) => {
  
  /**
   * Determina el color del badge según la edad
   */
  const getEdadVariant = (edadStr: string): "default" | "secondary" | "destructive" => {
    const edad = parseInt(edadStr);
    if (edad < 18) return "secondary";
    if (edad >= 65) return "destructive";
    return "default";
  };

  /**
   * Formatea la fecha de nacimiento
   */
  const formatearFecha = (fechaStr: string): string => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES');
    } catch {
      return fechaStr;
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Consultando personas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sin resultados
  if (personas.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <Activity className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-semibold text-lg">No se encontraron personas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span>Personas con Condiciones de Salud</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {total > 0 ? (
            <>
              Mostrando <strong>{((currentPage - 1) * limite) + 1}</strong> - <strong>{Math.min(currentPage * limite, total)}</strong> de <strong>{total}</strong> persona(s) en total
            </>
          ) : (
            <>Se encontraron <strong>{personas.length}</strong> persona(s)</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {/* Vista de Tabla para Desktop */}
        <div className="hidden lg:block rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="min-w-[200px]">Nombre Completo</TableHead>
                <TableHead className="w-[80px]">Edad</TableHead>
                <TableHead className="w-[100px]">Sexo</TableHead>
                <TableHead className="min-w-[180px]">Condiciones de Salud</TableHead>
                <TableHead className="min-w-[150px]">Parroquia</TableHead>
                <TableHead className="min-w-[150px]">Municipio</TableHead>
                <TableHead className="min-w-[130px]">Sector</TableHead>
                <TableHead className="min-w-[150px]">Corregimiento</TableHead>
                <TableHead className="min-w-[150px]">Centro Poblado</TableHead>
                <TableHead className="min-w-[130px]">Vereda</TableHead>
                <TableHead className="min-w-[180px]">Dirección</TableHead>
                <TableHead className="min-w-[120px]">Contacto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personas.map((persona) => (
                <TableRow key={persona.id}>
                  {/* ID */}
                  <TableCell className="font-mono text-xs">
                    #{persona.id}
                  </TableCell>

                  {/* Nombre Completo */}
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">
                          {persona.nombre}
                        </p>
                        {persona.documento && (
                          <p className="text-xs text-muted-foreground">
                            Doc: {persona.documento}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Edad */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={getEdadVariant(persona.edad)} className="w-fit">
                        {persona.edad}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatearFecha(persona.fecha_nacimiento)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Sexo */}
                  <TableCell>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {persona.sexo}
                    </Badge>
                  </TableCell>

                  {/* Condiciones de Salud */}
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Activity className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                      <div className="text-sm">
                        {persona.salud.tiene_enfermedades ? (
                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1">
                              {(() => {
                                // Validación defensiva: convertir string separado por comas a array
                                let enfermedades: string[] = [];
                                
                                if (Array.isArray(persona.salud.enfermedades)) {
                                  enfermedades = persona.salud.enfermedades;
                                } else if (typeof persona.salud.enfermedades === 'string' && persona.salud.enfermedades.trim()) {
                                  // Separar por comas y limpiar espacios
                                  enfermedades = persona.salud.enfermedades
                                    .split(',')
                                    .map(e => e.trim())
                                    .filter(e => e.length > 0);
                                }
                                
                                return enfermedades.map((enfermedad, idx) => (
                                  <Badge key={idx} variant="destructive" className="text-xs">
                                    {enfermedad}
                                  </Badge>
                                ));
                              })()}
                            </div>
                            {persona.salud.necesidades_medicas && (
                              <p className="text-xs text-muted-foreground">
                                {persona.salud.necesidades_medicas}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Sin condiciones</span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Parroquia */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {persona.parroquia}
                      </span>
                    </div>
                  </TableCell>

                  {/* Municipio */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {persona.municipio}
                    </span>
                  </TableCell>

                  {/* Sector */}
                  <TableCell>
                    {persona.sector ? (
                      <span className="text-xs text-muted-foreground">
                        {persona.sector}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>

                  {/* Corregimiento */}
                  <TableCell>
                    {persona.corregimiento ? (
                      <span className="text-xs text-muted-foreground">
                        {persona.corregimiento}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>

                  {/* Centro Poblado */}
                  <TableCell>
                    {persona.centro_poblado ? (
                      <span className="text-xs text-muted-foreground">
                        {persona.centro_poblado}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>

                  {/* Vereda */}
                  <TableCell>
                    {persona.vereda ? (
                      <span className="text-xs text-muted-foreground">
                        {persona.vereda}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>

                  {/* Dirección */}
                  <TableCell>
                    {persona.direccion ? (
                      <p className="text-sm text-muted-foreground">
                        {persona.direccion}
                      </p>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin dirección</span>
                    )}
                  </TableCell>

                  {/* Contacto */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {persona.telefono ? (
                        <a 
                          href={`tel:${persona.telefono}`}
                          className="text-primary hover:underline text-sm font-medium whitespace-nowrap"
                        >
                          📱 {persona.telefono}
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Sin teléfono
                        </span>
                      )}
                      {persona.telefono_familia && persona.telefono !== persona.telefono_familia && (
                        <a 
                          href={`tel:${persona.telefono_familia}`}
                          className="text-xs text-muted-foreground hover:underline whitespace-nowrap"
                          title="Teléfono familiar"
                        >
                          🏠 {persona.telefono_familia}
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista de Tarjetas para Móvil/Tablet */}
        <div className="lg:hidden space-y-3">
          {personas.map((persona) => (
            <Card key={persona.id} className="border-2">
              <CardContent className="p-3 sm:p-4 space-y-3">
                {/* Cabecera: ID, Nombre, Edad */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <User className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base truncate">
                        {persona.nombre}
                      </p>
                      {persona.documento && (
                        <p className="text-xs text-muted-foreground">
                          Doc: {persona.documento}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        ID: #{persona.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant={getEdadVariant(persona.edad)} className="whitespace-nowrap">
                      {persona.edad} años
                    </Badge>
                    <Badge variant="outline" className="whitespace-nowrap text-xs">
                      {persona.sexo}
                    </Badge>
                  </div>
                </div>

                {/* Condiciones de Salud */}
                {persona.salud.tiene_enfermedades && (
                  <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                    <Activity className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-red-900 mb-1">Condiciones de Salud:</p>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          // Validación defensiva: convertir string separado por comas a array
                          let enfermedades: string[] = [];
                          
                          if (Array.isArray(persona.salud.enfermedades)) {
                            enfermedades = persona.salud.enfermedades;
                          } else if (typeof persona.salud.enfermedades === 'string' && persona.salud.enfermedades.trim()) {
                            // Separar por comas y limpiar espacios
                            enfermedades = persona.salud.enfermedades
                              .split(',')
                              .map(e => e.trim())
                              .filter(e => e.length > 0);
                          }
                          
                          return enfermedades.map((enfermedad, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {enfermedad}
                            </Badge>
                          ));
                        })()}
                      </div>
                      {persona.salud.necesidades_medicas && (
                        <p className="text-xs text-red-700 mt-1">
                          {persona.salud.necesidades_medicas}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Ubicación */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                    <p className="text-xs sm:text-sm">
                      <span className="font-medium">{persona.parroquia}</span>
                      <span className="text-muted-foreground"> • {persona.municipio}</span>
                    </p>
                  </div>
                  {(persona.sector || persona.corregimiento || persona.centro_poblado || persona.vereda) && (
                    <p className="text-xs text-muted-foreground ml-5">
                      {persona.sector && `Sector: ${persona.sector}`}
                      {persona.sector && (persona.corregimiento || persona.centro_poblado || persona.vereda) && ' • '}
                      {persona.corregimiento && `Corregimiento: ${persona.corregimiento}`}
                      {persona.corregimiento && (persona.centro_poblado || persona.vereda) && ' • '}
                      {persona.centro_poblado && `Centro Poblado: ${persona.centro_poblado}`}
                      {persona.centro_poblado && persona.vereda && ' • '}
                      {persona.vereda && `Vereda: ${persona.vereda}`}
                    </p>
                  )}
                  {persona.direccion && (
                    <p className="text-xs text-muted-foreground ml-5">
                      📍 {persona.direccion}
                    </p>
                  )}
                </div>

                {/* Contacto */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  {persona.telefono ? (
                    <a 
                      href={`tel:${persona.telefono}`}
                      className="flex items-center gap-1.5 text-primary hover:underline text-xs sm:text-sm font-medium"
                    >
                      <span>📱</span>
                      <span>{persona.telefono}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sin teléfono
                    </span>
                  )}
                  {persona.telefono_familia && persona.telefono !== persona.telefono_familia && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <a 
                        href={`tel:${persona.telefono_familia}`}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:underline"
                        title="Teléfono familiar"
                      >
                        <span>🏠</span>
                        <span>{persona.telefono_familia}</span>
                      </a>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controles de Paginación */}
        {totalPages > 1 && onPageChange && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2">
            <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </div>
            
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-2 sm:px-3"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              
              <div className="flex items-center gap-1">
                {/* Primera página */}
                {currentPage > 2 && (
                  <>
                    <Button
                      variant={currentPage === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                    >
                      1
                    </Button>
                    {currentPage > 3 && <span className="text-muted-foreground text-xs">...</span>}
                  </>
                )}
                
                {/* Página anterior */}
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                  >
                    {currentPage - 1}
                  </Button>
                )}
                
                {/* Página actual */}
                <Button
                  variant="default"
                  size="sm"
                  className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                  disabled
                >
                  {currentPage}
                </Button>
                
                {/* Página siguiente */}
                {currentPage < totalPages && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                  >
                    {currentPage + 1}
                  </Button>
                )}
                
                {/* Última página */}
                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && <span className="text-muted-foreground text-xs">...</span>}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(totalPages)}
                      className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SaludList;
