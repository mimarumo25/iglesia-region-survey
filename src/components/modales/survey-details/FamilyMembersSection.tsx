/**
 * 👥 Sección de Miembros de Familia
 * 
 * Muestra información detallada de todos los miembros activos de la familia
 * con diseño responsive: tabla en desktop, cards en móvil
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Heart,
  Shirt,
  MapPin,
  IdCard
} from "lucide-react";

import { EncuestaListItem } from "@/services/encuestas";
import { useResponsiveTable } from "@/hooks/useResponsiveTable";
import { MemberMobileCard } from "@/components/ui/MemberMobileCard";

// Importar estilos para animaciones
import "@/styles/mobile-animations.css";

interface FamilyMembersSectionProps {
  data: EncuestaListItem;
}

export const FamilyMembersSection = ({ data }: FamilyMembersSectionProps) => {
  
  // Hook para detectar dispositivo móvil
  const { shouldUseMobileView, isMobile, isVerySmall } = useResponsiveTable();
  
  /**
   * Calcular edad desde fecha de nacimiento
   */
  const calculateAge = (birthDate: string) => {
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  };

  /**
   * Formatear fecha para mostrar
   */
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
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
   * Obtener badge para sexo
   */
  const getSexBadge = (sexo: any) => {
    if (!sexo) return <Badge variant="outline">No especificado</Badge>;
    
    const isMale = sexo.descripcion?.toLowerCase().includes('masculino');
    const isFemale = sexo.descripcion?.toLowerCase().includes('femenino');
    
    if (isMale) {
      return <Badge className="bg-blue-100 text-blue-700">♂️ Masculino</Badge>;
    } else if (isFemale) {
      return <Badge className="bg-pink-100 text-pink-700">♀️ Femenino</Badge>;
    } else {
      return <Badge variant="outline">{sexo.descripcion}</Badge>;
    }
  };

  /**
   * Verificar si el email es temporal/generado
   */
  const isTemporaryEmail = (email: string) => {
    return email.includes('@temp.com') || email.includes('temp.');
  };

  const miembros = data.miembros_familia.personas || [];

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Miembros de la Familia ({data.miembros_familia.total_miembros})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {miembros.length > 0 ? (
            <div className={`grid gap-4 mb-4 ${isVerySmall ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{miembros.length}</div>
                <div className="text-sm text-blue-700">Total Miembros</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {miembros.filter(m => calculateAge(m.fecha_nacimiento) >= 18).length}
                </div>
                <div className="text-sm text-green-700">Adultos</div>
              </div>
              {!isVerySmall && (
                <>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {miembros.filter(m => calculateAge(m.fecha_nacimiento) < 18).length}
                    </div>
                    <div className="text-sm text-yellow-700">Menores</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(miembros.reduce((sum, m) => sum + calculateAge(m.fecha_nacimiento), 0) / miembros.length) || 0}
                    </div>
                    <div className="text-sm text-purple-700">Edad Promedio</div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>No hay miembros registrados en esta familia</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista detallada de miembros - Responsive */}
      {miembros.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Información Detallada de Miembros
            </CardTitle>
          </CardHeader>
          <CardContent className={shouldUseMobileView ? "p-4" : "p-0"}>
            {shouldUseMobileView ? (
              // Vista móvil: Cards
              <div className="space-y-3 mobile-view-transition">
                {miembros.map((miembro, index) => (
                  <MemberMobileCard
                    key={miembro.id || index}
                    member={miembro}
                    familyAddress={data.direccion_familia}
                    index={index}
                    compact={isMobile}
                  />
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
                          <TableHead className="w-[250px]">Miembro</TableHead>
                          <TableHead>Identificación</TableHead>
                          <TableHead>Edad</TableHead>
                          <TableHead>Sexo</TableHead>
                          <TableHead>Estado Civil</TableHead>
                          <TableHead>Estudios</TableHead>
                          <TableHead>Contacto</TableHead>
                          <TableHead>Tallas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {miembros.map((miembro, index) => (
                          <TableRow key={miembro.id || index}>
                            {/* Información Personal */}
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {getInitials(miembro.nombre_completo)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {miembro.nombre_completo}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {miembro.direccion || data.direccion_familia}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Identificación */}
                            <TableCell>
                              <div>
                                <div className="flex items-center gap-1">
                                  <IdCard className="w-3 h-3 text-gray-400" />
                                  <p className="text-sm font-mono">{miembro.identificacion.numero}</p>
                                </div>
                                {miembro.identificacion.tipo && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {miembro.identificacion.tipo.codigo} - {miembro.identificacion.tipo.nombre}
                                  </p>
                                )}
                              </div>
                            </TableCell>

                            {/* Edad */}
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">
                                  {miembro.edad || calculateAge(miembro.fecha_nacimiento)} años
                                </p>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(miembro.fecha_nacimiento)}
                                </div>
                              </div>
                            </TableCell>

                            {/* Sexo */}
                            <TableCell>
                              {getSexBadge(miembro.sexo)}
                            </TableCell>

                            {/* Estado Civil */}
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-gray-400" />
                                <p className="text-sm">{miembro.estado_civil.nombre}</p>
                              </div>
                            </TableCell>

                            {/* Estudios */}
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-gray-400" />
                                <p className="text-sm">{miembro.estudios.nombre}</p>
                              </div>
                            </TableCell>

                            {/* Contacto */}
                            <TableCell>
                              <div className="space-y-1">
                                {miembro.telefono && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <Phone className="w-3 h-3 text-green-500" />
                                    <span className="font-mono">{miembro.telefono}</span>
                                  </div>
                                )}
                                {miembro.email && !isTemporaryEmail(miembro.email) && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <Mail className="w-3 h-3 text-blue-500" />
                                    <span>{miembro.email}</span>
                                  </div>
                                )}
                                {(!miembro.telefono && (!miembro.email || isTemporaryEmail(miembro.email))) && (
                                  <span className="text-xs text-gray-400">Sin contacto</span>
                                )}
                              </div>
                            </TableCell>

                            {/* Tallas */}
                            <TableCell>
                              <div className="flex flex-col gap-1 text-xs">
                                <div className="flex items-center gap-1">
                                  <Shirt className="w-3 h-3 text-gray-400" />
                                  <span>👕 {miembro.tallas.camisa}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>👖 {miembro.tallas.pantalon}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>👟 {miembro.tallas.zapato}</span>
                                </div>
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

      {/* Análisis demográfico - Responsive */}
      {miembros.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Análisis Demográfico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${shouldUseMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {/* Distribución por edad */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Distribución por Edades</h4>
                <div className="space-y-2">
                  {[
                    { label: "Niños (0-12)", filter: (age: number) => age >= 0 && age <= 12 },
                    { label: "Adolescentes (13-17)", filter: (age: number) => age >= 13 && age <= 17 },
                    { label: "Adultos (18-59)", filter: (age: number) => age >= 18 && age <= 59 },
                    { label: "Adultos Mayores (60+)", filter: (age: number) => age >= 60 }
                  ].map(group => {
                    const count = miembros.filter(m => 
                      group.filter(calculateAge(m.fecha_nacimiento))
                    ).length;
                    const percentage = (count / miembros.length * 100).toFixed(1);
                    
                    return (
                      <div key={group.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{group.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Distribución por sexo */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Distribución por Sexo</h4>
                <div className="space-y-2">
                  {[
                    { label: "Masculino", filter: (sexo: any) => sexo?.descripcion?.toLowerCase().includes('masculino') },
                    { label: "Femenino", filter: (sexo: any) => sexo?.descripcion?.toLowerCase().includes('femenino') }
                  ].map(group => {
                    const count = miembros.filter(m => group.filter(m.sexo)).length;
                    const percentage = (count / miembros.length * 100).toFixed(1);
                    
                    return (
                      <div key={group.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{group.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilyMembersSection;
