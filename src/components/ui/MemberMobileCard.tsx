/**
 * 📱 Card Móvil para Miembros de Familia
 * 
 * Componente optimizado para mostrar información de miembros
 * en dispositivos móviles con layout card-based
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Heart,
  Shirt,
  MapPin,
  IdCard,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// INTERFACES
// ============================================================================

interface MemberMobileCardProps {
  /** Datos del miembro de familia */
  member: {
    id: string | number;
    nombre_completo: string;
    identificacion: {
      numero: string;
      tipo?: {
        codigo: string;
        nombre: string;
      };
    };
    fecha_nacimiento: string;
    edad?: number;
    sexo: {
      descripcion: string;
    };
    estado_civil: {
      nombre: string;
    };
    estudios: {
      nombre: string;
    };
    telefono?: string;
    email?: string;
    direccion?: string;
    tallas: {
      camisa: string;
      pantalon: string;
      zapato: string;
    };
  };
  /** Dirección de la familia (fallback) */
  familyAddress?: string;
  /** Índice para animaciones */
  index?: number;
  /** Callback para acciones */
  onEdit?: (member: any) => void;
  onView?: (member: any) => void;
  /** Si mostrar acciones */
  showActions?: boolean;
  /** Estilo compacto para modales */
  compact?: boolean;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const MemberMobileCard = ({
  member,
  familyAddress,
  index = 0,
  onEdit,
  onView,
  showActions = false,
  compact = false
}: MemberMobileCardProps) => {

  // ========================================================================
  // FUNCIONES AUXILIARES
  // ========================================================================

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
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          ♂️ Masculino
        </Badge>
      );
    } else if (isFemale) {
      return (
        <Badge className="bg-pink-100 text-pink-700 border-pink-200">
          ♀️ Femenino
        </Badge>
      );
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

  /**
   * Obtener badge para edad
   */
  const getAgeBadge = (age: number) => {
    if (age < 13) {
      return <Badge className="bg-yellow-100 text-yellow-700">Niño/a</Badge>;
    } else if (age < 18) {
      return <Badge className="bg-orange-100 text-orange-700">Adolescente</Badge>;
    } else if (age < 60) {
      return <Badge className="bg-green-100 text-green-700">Adulto/a</Badge>;
    } else {
      return <Badge className="bg-purple-100 text-purple-700">Adulto Mayor</Badge>;
    }
  };

  // ========================================================================
  // VARIABLES CALCULADAS
  // ========================================================================

  const age = member.edad || calculateAge(member.fecha_nacimiento);
  const hasValidPhone = member.telefono && member.telefono.length > 0;
  const hasValidEmail = member.email && !isTemporaryEmail(member.email);
  const hasContact = hasValidPhone || hasValidEmail;

  // ========================================================================
  // RENDERIZADO
  // ========================================================================

  return (
    <Card 
      className={`
        relative transition-all duration-300 hover:shadow-lg border border-gray-200
        ${compact ? 'mb-3' : 'mb-4'}
        bg-white hover:bg-gray-50
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.4s ease-out forwards'
      }}
    >
      <CardContent className={`${compact ? 'p-4' : 'p-5'} space-y-4`}>
        
        {/* Header con avatar y info principal */}
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {getInitials(member.nombre_completo)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {member.nombre_completo}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getSexBadge(member.sexo)}
                  {getAgeBadge(age)}
                </div>
              </div>
              
              {/* Acciones */}
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(member)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(member)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Información personal en grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Edad y fecha nacimiento */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">Edad</span>
            </div>
            <p className="text-gray-900 font-semibold">{age} años</p>
            <p className="text-xs text-gray-500">{formatDate(member.fecha_nacimiento)}</p>
          </div>

          {/* Identificación */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <IdCard className="w-3 h-3" />
              <span className="font-medium">Documento</span>
            </div>
            <p className="text-gray-900 font-mono text-sm">{member.identificacion.numero}</p>
            {member.identificacion.tipo && (
              <p className="text-xs text-gray-500">{member.identificacion.tipo.codigo}</p>
            )}
          </div>
        </div>

        {!compact && (
          <>
            <Separator />

            {/* Información adicional */}
            <div className="grid grid-cols-1 gap-3 text-sm">
              {/* Estado civil y estudios */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Heart className="w-3 h-3" />
                    <span className="font-medium">Estado Civil</span>
                  </div>
                  <p className="text-gray-900">{member.estado_civil.nombre}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-gray-500">
                    <GraduationCap className="w-3 h-3" />
                    <span className="font-medium">Estudios</span>
                  </div>
                  <p className="text-gray-900">{member.estudios.nombre}</p>
                </div>
              </div>

              {/* Contacto */}
              {hasContact && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-gray-500">
                    <User className="w-3 h-3" />
                    <span className="font-medium">Contacto</span>
                  </div>
                  <div className="space-y-1">
                    {hasValidPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-green-500" />
                        <span className="font-mono text-gray-900">{member.telefono}</span>
                      </div>
                    )}
                    {hasValidEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-900 text-xs">{member.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dirección */}
              {(member.direccion || familyAddress) && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="font-medium">Dirección</span>
                  </div>
                  <p className="text-gray-900 text-xs">
                    {member.direccion || familyAddress}
                  </p>
                </div>
              )}

              {/* Tallas */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gray-500">
                  <Shirt className="w-3 h-3" />
                  <span className="font-medium">Tallas</span>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span>👕</span>
                    <span className="font-medium">{member.tallas.camisa}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👖</span>
                    <span className="font-medium">{member.tallas.pantalon}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👟</span>
                    <span className="font-medium">{member.tallas.zapato}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Si no hay contacto válido, mostrar aviso */}
        {!hasContact && !compact && (
          <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded">
            Sin información de contacto
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberMobileCard;
