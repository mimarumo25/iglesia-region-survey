/**
 * 💔 Sección de Miembros Fallecidos
 * 
 * Muestra información de personas fallecidas de la familia con sensibilidad y respeto
 * con diseño responsive: tabla en desktop, cards en móvil
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  Calendar,
  User,
  IdCard,
  AlertCircle,
  Clock,
  Users
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";
import { useResponsiveTable } from "@/hooks/useResponsiveTable";

// Importar estilos para animaciones
import "@/styles/mobile-animations.css";

interface DeceasedMembersSectionProps {
  data: EncuestaListItem;
}

export const DeceasedMembersSection = ({ data }: DeceasedMembersSectionProps) => {
  
  // Hook para detectar dispositivo móvil
  const { shouldUseMobileView, isMobile, isVerySmall } = useResponsiveTable();
  
  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  /**
   * Obtener iniciales para avatar
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Obtener badges de parentesco
   */
  const getParentescoBadges = (fallecido: any) => {
    // Con la nueva estructura, usamos el parentesco directamente
    if (fallecido.parentesco?.nombre) {
      return (
        <Badge variant="outline">
          � {fallecido.parentesco.nombre}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        👤 Familiar
      </Badge>
    );
  };

  /**
   * Calcular años desde fallecimiento
   */
  const getYearsSinceDeath = (deathDate: string) => {
    try {
      const death = new Date(deathDate);
      const today = new Date();
      const years = today.getFullYear() - death.getFullYear();
      return years;
    } catch {
      return null;
    }
  };

  const fallecidos = data.deceasedMembers || [];

  return (
    <div className="space-y-6">
      {/* Header con información sensible */}
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Registro de Personas Fallecidas ({data.deceasedMembers?.length || 0})
          </CardTitle>
          <p className="text-sm text-gray-600">
            En memoria de los seres queridos que partieron. Esta información se mantiene con respeto y para propósitos pastorales.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          {fallecidos.length > 0 ? (
            <div className={`grid gap-4 ${isVerySmall ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{fallecidos.length}</div>
                <div className="text-sm text-red-700">Total Fallecidos</div>
              </div>
              {!isVerySmall && (
                <>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {fallecidos.filter(f => f.sexo?.nombre === 'Masculino').length}
                    </div>
                    <div className="text-sm text-blue-700">Hombres</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {fallecidos.filter(f => f.sexo?.nombre === 'Femenino').length}
                    </div>
                    <div className="text-sm text-purple-700">Mujeres</div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay registros de personas fallecidas en esta familia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista detallada de fallecidos - Responsive */}
      {fallecidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Información Detallada
            </CardTitle>
          </CardHeader>
          <CardContent className={shouldUseMobileView ? "p-4" : "p-0"}>
            {shouldUseMobileView ? (
              // Vista móvil: Temporalmente simplificada hasta ajustar DeceasedMobileCard
              <div className="space-y-3 mobile-view-transition">
                {fallecidos.map((fallecido, index) => (
                  <Card key={`deceased-mobile-${index}`} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {getInitials(fallecido.nombres || 'NA')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{fallecido.nombres || 'Nombre no especificado'}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          ✝️ {formatDate(fallecido.fechaFallecimiento || '')}
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline">
                            👤 {fallecido.parentesco?.nombre || 'No especificado'}
                          </Badge>
                        </div>
                        {fallecido.causaFallecimiento && (
                          <p className="text-xs text-gray-500 mt-2">
                            Causa: {fallecido.causaFallecimiento}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // Vista desktop: Tabla
              <div className="desktop-view-transition">
                <ScrollArea className="w-full">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Persona Fallecida</TableHead>
                          <TableHead>Identificación</TableHead>
                          <TableHead>Fecha Fallecimiento</TableHead>
                          <TableHead>Parentesco</TableHead>
                          <TableHead>Causa</TableHead>
                          <TableHead>Años Transcurridos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fallecidos.map((fallecido, index) => (
                          <TableRow key={`fallecido-${index}`} className="hover:bg-gray-50">
                            {/* Información Personal */}
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-gray-100 text-gray-600">
                                    {getInitials(fallecido.nombres || 'NA')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {fallecido.nombres || 'Nombre no especificado'}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    ✝️ En memoria
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            {/* Identificación */}
                            <TableCell>
                              <div>
                                <div className="flex items-center gap-1">
                                  <IdCard className="w-3 h-3 text-gray-400" />
                                  <p className="text-sm font-mono">No disponible</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  N/A
                                </p>
                              </div>
                            </TableCell>

                            {/* Fecha Fallecimiento */}
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-red-400" />
                                <p className="text-sm">{formatDate(fallecido.fechaFallecimiento || '')}</p>
                              </div>
                            </TableCell>

                            {/* Parentesco */}
                            <TableCell>
                              <Badge variant="outline">
                                👤 {fallecido.parentesco?.nombre || 'No especificado'}
                              </Badge>
                            </TableCell>

                            {/* Causa */}
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="text-sm text-gray-700">
                                  {fallecido.causaFallecimiento || "No especificada"}
                                </p>
                              </div>
                            </TableCell>

                            {/* Años Transcurridos */}
                            <TableCell>
                              <div className="text-center">
                                {(() => {
                                  const years = getYearsSinceDeath(fallecido.fechaFallecimiento || '');
                                  return years !== null ? (
                                    <div>
                                      <p className="text-sm font-medium">{years}</p>
                                      <p className="text-xs text-gray-500">
                                        {years === 1 ? 'año' : 'años'}
                                      </p>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  );
                                })()}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Análisis de fallecimientos - Responsive */}
      {fallecidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Análisis del Registro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${shouldUseMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {/* Causas de fallecimiento */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Principales Causas
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const causas = fallecidos.reduce((acc: any, f) => {
                      const causa = f.causaFallecimiento || 'No especificada';
                      acc[causa] = (acc[causa] || 0) + 1;
                      return acc;
                    }, {});
                    
                    const sortedCausas = Object.entries(causas)
                      .sort(([,a]: [string, any], [,b]: [string, any]) => b - a)
                      .slice(0, shouldUseMobileView ? 3 : 5);
                    
                    return sortedCausas.map(([causa, count]: [string, any]) => (
                      <div key={causa} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{causa}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Distribución por parentesco */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  Distribución por Parentesco
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const parentescos = fallecidos.reduce((acc: any, f) => {
                      const parentesco = f.parentesco?.nombre || 'No especificado';
                      acc[parentesco] = (acc[parentesco] || 0) + 1;
                      return acc;
                    }, {});
                    
                    return Object.entries(parentescos).map(([parentesco, count]: [string, any]) => (
                      <div key={parentesco} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{parentesco}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Análisis temporal - Solo en desktop o cuando hay espacio */}
              {!shouldUseMobileView && fallecidos.length > 2 && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Distribución Temporal
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(() => {
                      const currentYear = new Date().getFullYear();
                      const recent = fallecidos.filter(f => {
                        const year = new Date(f.fechaFallecimiento || '').getFullYear();
                        return currentYear - year <= 5;
                      }).length;
                      const medium = fallecidos.filter(f => {
                        const year = new Date(f.fechaFallecimiento || '').getFullYear();
                        return currentYear - year > 5 && currentYear - year <= 15;
                      }).length;
                      const older = fallecidos.filter(f => {
                        const year = new Date(f.fechaFallecimiento || '').getFullYear();
                        return currentYear - year > 15;
                      }).length;

                      return [
                        { label: "Últimos 5 años", count: recent },
                        { label: "6-15 años", count: medium },
                        { label: "Más de 15 años", count: older }
                      ].map((period, index) => (
                        <div key={index} className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-lg font-semibold text-gray-900">{period.count}</p>
                          <p className="text-xs text-gray-600">{period.label}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Nota pastoral */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Nota Pastoral</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Esta información se mantiene para ofrecer acompañamiento espiritual y 
                    recordar a nuestros hermanos en la fe que han partido hacia la casa del Padre.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeceasedMembersSection;
