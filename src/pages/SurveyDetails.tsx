/**
 * 📋 Página de Detalles de Encuesta
 * 
 * Muestra toda la información completa de una encuesta específica,
 * incluyendo miembros de familia, fallecidos, servicios, etc.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FileText,
  Edit3,
  MapPin,
  Phone,
  Calendar,
  Home,
  Users,
  Droplets,
  Trash,
  User,
  Mail,
  Heart,
  GraduationCap,
  Shirt,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from "lucide-react";

// Importar servicios y tipos
import { useEncuestas, EncuestaListItem } from "@/services/encuestas";

const SurveyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getEncuestaById } = useEncuestas();

  // Estados
  const [encuesta, setEncuesta] = useState<EncuestaListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la encuesta
  useEffect(() => {
    const loadEncuesta = async () => {
      if (!id) {
        setError("ID de encuesta no válido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getEncuestaById(parseInt(id));
        setEncuesta(response.data as EncuestaListItem);

        console.log('✅ Encuesta cargada:', response.data);

      } catch (error: any) {
        console.error('❌ Error al cargar encuesta:', error);
        setError(error.message || 'Error al cargar la encuesta');
        toast({
          variant: "destructive",
          title: "Error al cargar encuesta",
          description: error.message || 'No se pudo cargar la información de la encuesta'
        });
      } finally {
        setLoading(false);
      }
    };

    loadEncuesta();
  }, [id, getEncuestaById, toast]);

  // Funciones auxiliares
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            En Progreso
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !encuesta) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar encuesta</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/surveys")} variant="outline">
                Volver a Encuestas
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate("/surveys")} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Detalles de Encuesta
            </h1>
            <p className="text-gray-600">
              Familia {encuesta.apellido_familiar} - {encuesta.codigo_familia}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate(`/surveys/${id}/edit`)} 
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Editar Encuesta
          </Button>
        </div>
      </div>

      {/* Información General */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Familia</p>
              <p className="font-medium">{encuesta.apellido_familiar}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Código de Familia</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {encuesta.codigo_familia}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              {getStatusBadge(encuesta.estado_encuesta)}
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo de Vivienda</p>
              <p className="font-medium">{encuesta.tipo_vivienda.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <p className="text-sm">{encuesta.direccion_familia}</p>
              </div>
            </div>
            {encuesta.telefono && (
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-sm">{encuesta.telefono}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Municipio</p>
              <p className="font-medium">{encuesta.municipio.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Parroquia</p>
              <p className="font-medium">{encuesta.parroquia.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sector</p>
              <Badge variant="outline">{encuesta.sector.nombre}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vereda</p>
              <p className="font-medium">{encuesta.vereda.nombre}</p>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Miembros</span>
              <Badge variant="outline">{encuesta.miembros_familia.total_miembros}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Personas Fallecidas</span>
              <Badge variant="outline">{encuesta.personas_fallecidas.total_fallecidos}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Tamaño Familia</span>
              <Badge variant="outline">{encuesta.tamaño_familia}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha Creación</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm">{formatDate(encuesta.metadatos.fecha_creacion)}</p>
              </div>
            </div>
            {encuesta.estado_encuesta === 'completed' && (
              <div>
                <p className="text-sm text-gray-500">Última Actualización</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm">{formatDate(encuesta.fecha_ultima_encuesta)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Servicios */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Servicios de Vivienda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Sistema de Acueducto</p>
              <Badge variant="outline">{encuesta.acueducto.nombre}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Aguas Residuales</p>
              {encuesta.aguas_residuales ? (
                <Badge variant="outline">{encuesta.aguas_residuales.nombre}</Badge>
              ) : (
                <span className="text-gray-400">No especificado</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Miembros de Familia */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Miembros de Familia ({encuesta.miembros_familia.total_miembros})
          </CardTitle>
          <CardDescription>
            Información de todos los miembros activos de la familia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {encuesta.miembros_familia.personas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Estado Civil</TableHead>
                  <TableHead>Estudios</TableHead>
                  <TableHead>Contacto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encuesta.miembros_familia.personas.map((miembro, index) => (
                  <TableRow key={miembro.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{miembro.nombre_completo}</p>
                        <div className="flex gap-1 text-xs text-gray-500 mt-1">
                          <span>👕 {miembro.tallas.camisa}</span>
                          <span>👖 {miembro.tallas.pantalon}</span>
                          <span>👟 {miembro.tallas.zapato}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{miembro.identificacion.numero}</p>
                        {miembro.identificacion.tipo && (
                          <p className="text-xs text-gray-500">
                            {miembro.identificacion.tipo.codigo}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{miembro.edad || calculateAge(miembro.fecha_nacimiento)} años</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(miembro.fecha_nacimiento)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {miembro.sexo.descripcion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{miembro.estado_civil.nombre}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{miembro.estudios.nombre}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {miembro.telefono && (
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="w-3 h-3" />
                            {miembro.telefono}
                          </div>
                        )}
                        {miembro.email && !miembro.email.includes('@temp.com') && (
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="w-3 h-3" />
                            {miembro.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>No hay miembros registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personas Fallecidas */}
      {encuesta.personas_fallecidas.total_fallecidos > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Personas Fallecidas ({encuesta.personas_fallecidas.total_fallecidos})
            </CardTitle>
            <CardDescription>
              Registro de familiares fallecidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Fecha Fallecimiento</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Causa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {encuesta.personas_fallecidas.fallecidos.map((fallecido) => (
                  <TableRow key={fallecido.id}>
                    <TableCell>
                      <p className="font-medium">{fallecido.nombre_completo}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(fallecido.fecha_fallecimiento)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {fallecido.era_padre && <Badge variant="outline">Padre</Badge>}
                        {fallecido.era_madre && <Badge variant="outline">Madre</Badge>}
                        {!fallecido.era_padre && !fallecido.era_madre && (
                          <span className="text-gray-500">Familiar</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{fallecido.causa_fallecimiento}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Metadatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información Técnica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Versión</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                v{encuesta.metadatos.version}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado Técnico</p>
              <Badge variant="outline">{encuesta.metadatos.estado}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Número de Encuestas</p>
              <Badge variant="outline">{encuesta.numero_encuestas}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyDetails;
