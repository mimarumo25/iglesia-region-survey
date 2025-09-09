/**
 * 💔 Sección de Miembros Fallecidos
 * 
 * Muestra información de personas fallecidas de la familia con sensibilidad y respeto
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  Calendar,
  User,
  IdCard,
  AlertCircle
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";

interface DeceasedMembersSectionProps {
  data: EncuestaListItem;
}

export const DeceasedMembersSection = ({ data }: DeceasedMembersSectionProps) => {
  
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
    const badges = [];
    
    if (fallecido.era_padre) {
      badges.push(
        <Badge key="padre" className="bg-blue-100 text-blue-700">
          👨 Padre
        </Badge>
      );
    }
    
    if (fallecido.era_madre) {
      badges.push(
        <Badge key="madre" className="bg-pink-100 text-pink-700">
          👩 Madre
        </Badge>
      );
    }
    
    if (badges.length === 0) {
      badges.push(
        <Badge key="familiar" variant="outline">
          👤 Familiar
        </Badge>
      );
    }
    
    return badges;
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

  const fallecidos = data.personas_fallecidas.fallecidos || [];

  return (
    <div className="space-y-6">
      {/* Header con información sensible */}
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Registro de Personas Fallecidas ({data.personas_fallecidas.total_fallecidos})
          </CardTitle>
          <p className="text-sm text-gray-600">
            En memoria de los seres queridos que partieron. Esta información se mantiene con respeto y para propósitos pastorales.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          {fallecidos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{fallecidos.length}</div>
                <div className="text-sm text-red-700">Total Fallecidos</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {fallecidos.filter(f => f.era_padre || f.era_madre).length}
                </div>
                <div className="text-sm text-blue-700">Padres/Madres</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {fallecidos.filter(f => !f.era_padre && !f.era_madre).length}
                </div>
                <div className="text-sm text-purple-700">Otros Familiares</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay registros de personas fallecidas en esta familia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista detallada de fallecidos */}
      {fallecidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Información Detallada
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
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
                    <TableRow key={fallecido.id || index} className="hover:bg-gray-50">
                      {/* Información Personal */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {getInitials(fallecido.nombre_completo)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {fallecido.nombre_completo}
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
                            <p className="text-sm font-mono">{fallecido.identificacion.numero}</p>
                          </div>
                          {fallecido.identificacion.tipo && (
                            <p className="text-xs text-gray-500 mt-1">
                              {fallecido.identificacion.tipo.codigo}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Fecha Fallecimiento */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-red-400" />
                          <p className="text-sm">{formatDate(fallecido.fecha_fallecimiento)}</p>
                        </div>
                      </TableCell>

                      {/* Parentesco */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getParentescoBadges(fallecido)}
                        </div>
                      </TableCell>

                      {/* Causa */}
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-700">
                            {fallecido.causa_fallecimiento || "No especificada"}
                          </p>
                        </div>
                      </TableCell>

                      {/* Años Transcurridos */}
                      <TableCell>
                        <div className="text-center">
                          {(() => {
                            const years = getYearsSinceDeath(fallecido.fecha_fallecimiento);
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
          </CardContent>
        </Card>
      )}

      {/* Análisis de fallecimientos */}
      {fallecidos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Análisis del Registro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Causas de fallecimiento */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Principales Causas</h4>
                <div className="space-y-2">
                  {(() => {
                    const causas = fallecidos.reduce((acc: any, f) => {
                      const causa = f.causa_fallecimiento || 'No especificada';
                      acc[causa] = (acc[causa] || 0) + 1;
                      return acc;
                    }, {});
                    
                    return Object.entries(causas).map(([causa, count]: [string, any]) => (
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
                <h4 className="font-medium text-gray-900 mb-3">Distribución por Parentesco</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Padres</span>
                    <Badge variant="outline">{fallecidos.filter(f => f.era_padre).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Madres</span>
                    <Badge variant="outline">{fallecidos.filter(f => f.era_madre).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Otros Familiares</span>
                    <Badge variant="outline">
                      {fallecidos.filter(f => !f.era_padre && !f.era_madre).length}
                    </Badge>
                  </div>
                </div>
              </div>
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
