/**
 * 📋 Página de Detalles de Encuesta
 * 
 * Muestra toda la información completa de una encuesta específica,
 * incluyendo miembros de familia, fallecidos, servicios, etc.
 */

import React, { useState, useEffect } from "react";
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
import { useEncuesta } from "@/hooks/useEncuestas";
import { EncuestaListItem } from "@/services/encuestas";
import { useResponsiveTable } from "@/hooks/useResponsiveTable";
import { MemberMobileCard } from "@/components/ui/MemberMobileCard";

// Importar estilos para animaciones móviles
import "@/styles/mobile-animations.css";

/**
 * Helper function to parse JSON array strings or comma-separated strings into array
 * Handles: ["item1", "item2"], ["item1, item2"], "item1, item2", or simple strings
 */
const parseArrayField = (field: string | null | undefined): string[] => {
  if (!field) return [];
  
  try {
    // Try to parse as JSON array first
    const parsed = JSON.parse(field);
    if (Array.isArray(parsed)) {
      // Flatten array and split each element by comma
      return parsed
        .flatMap(item => 
          typeof item === 'string' && item.includes(',') 
            ? item.split(',').map(s => s.trim())
            : [item]
        )
        .filter(item => item && String(item).trim())
        .map(item => String(item).trim());
    }
  } catch {
    // Not valid JSON, continue to comma splitting
  }
  
  // Split by comma and filter empty items
  return field.split(',').map(item => item.trim()).filter(item => item);
};

const SurveyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Hook para obtener encuesta (usando el helper correcto)
  const { data: encuestaData, isLoading: loading, error } = useEncuesta(id || '');
  
  // Hook para responsive design
  const { shouldUseMobileView, isMobile, isVerySmall } = useResponsiveTable();

  // Estado derivado - Cast a any porque backend devuelve EncuestaListItem pero TypeScript espera EncuestaCompleta
  const encuesta = encuestaData?.data as any;

  // Manejo de error
  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error al cargar encuesta",
        description: error.message || 'No se pudo cargar la información de la encuesta'
      });
    }
  }, [error, toast]);

  // Funciones auxiliares con badges optimizados para ambos temas
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-success/15 text-success border-2 border-success/30 hover:bg-success/25 dark:bg-success/20 dark:border-success/40 font-semibold transition-all">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-secondary/15 text-secondary border-2 border-secondary/30 hover:bg-secondary/25 dark:bg-secondary/20 dark:border-secondary/40 font-semibold transition-all">
            <Clock className="w-3 h-3 mr-1" />
            En Progreso
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-destructive/15 text-destructive border-2 border-destructive/30 hover:bg-destructive/25 dark:bg-destructive/20 dark:border-destructive/40 font-semibold transition-all">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-warning/15 text-warning border-2 border-warning/30 hover:bg-warning/25 dark:bg-warning/20 dark:border-warning/40 font-semibold transition-all">
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
      <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
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
      <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar encuesta</h3>
            <p className="text-muted-foreground mb-4">{error?.message || 'Error desconocido'}</p>
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
    <div className={`container mx-auto ${isMobile ? 'px-3 py-4' : 'p-6'} mobile-scroll-container`}>
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row md:items-center md:justify-between'} ${isMobile ? 'gap-3 mb-4' : 'gap-4 mb-6'}`}>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate("/surveys")} 
            variant="outline" 
            size={isMobile ? "default" : "sm"}
            className={isMobile ? "w-full sm:w-auto" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className={isMobile ? "hidden" : "block"}>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Detalles de Encuesta
            </h1>
            <p className="text-muted-foreground">
              Familia {encuesta.apellido_familiar} - {encuesta.codigo_familia}
            </p>
          </div>
        </div>
        
        {/* Título móvil */}
        {isMobile && (
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Detalles de Encuesta
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Familia {encuesta.apellido_familiar}
            </p>
            <p className="text-xs text-muted-foreground/80">{encuesta.codigo_familia}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate(`/surveys/${id}/edit`)} 
            className={`flex items-center gap-2 ${isMobile ? 'w-full sm:w-auto' : ''}`}
            size={isMobile ? "default" : "default"}
          >
            <Edit3 className="w-4 h-4" />
            {isMobile ? "Editar" : "Editar Encuesta"}
          </Button>
        </div>
      </div>

      {/* Información General */}
      <div className={`grid gap-6 mb-8 ${shouldUseMobileView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
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
              <p className="text-sm text-muted-foreground font-semibold">Familia</p>
              <p className="font-bold text-foreground">{encuesta.apellido_familiar}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Código de Familia</p>
              <code className="text-sm bg-muted/30 dark:bg-muted/20 px-2 py-1 rounded font-mono text-foreground">
                {encuesta.codigo_familia}
              </code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Estado</p>
              {getStatusBadge(encuesta.estado_encuesta)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Tipo de Vivienda</p>
              <p className="font-semibold text-foreground/90">{encuesta.tipo_vivienda.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Dirección</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground/60 mt-0.5" />
                <p className="text-sm text-foreground/90">{encuesta.direccion_familia}</p>
              </div>
            </div>
            {encuesta.telefono && (
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Teléfono</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground/60" />
                  <p className="text-sm font-mono text-foreground/90">{encuesta.telefono}</p>
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
              <p className="text-sm text-muted-foreground font-semibold">Municipio</p>
              <p className="font-semibold text-foreground/90">{encuesta.municipio.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Parroquia</p>
              <p className="font-semibold text-foreground/90">{encuesta.parroquia.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Sector</p>
              <Badge variant="outline">{encuesta.sector.nombre}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Vereda</p>
              <p className="font-semibold text-foreground/90">{encuesta.vereda.nombre}</p>
            </div>
            {(encuesta as any).corregimiento && (
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Corregimiento</p>
                <p className="font-semibold text-foreground/90">{(encuesta as any).corregimiento.nombre}</p>
              </div>
            )}
            {(encuesta as any).centro_poblado && (
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Centro Poblado</p>
                <p className="font-semibold text-foreground/90">{(encuesta as any).centro_poblado.nombre}</p>
              </div>
            )}
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
              <span className="text-sm text-muted-foreground font-semibold">Total Miembros</span>
              <Badge variant="outline" className="font-semibold">{encuesta.miembros_familia?.total_miembros || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-semibold">Personas Fallecidas</span>
              <Badge variant="outline" className="font-semibold">{encuesta.deceasedMembers?.length || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-semibold">Tamaño Familia</span>
              <Badge variant="outline" className="font-semibold">{encuesta.tamaño_familia || 0}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold">Fecha Creación</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground/60" />
                <p className="text-sm text-foreground/90">{formatDate(encuesta.metadatos.fecha_creacion)}</p>
              </div>
            </div>
            {encuesta.estado_encuesta === 'completed' && (
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Última Actualización</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground/60" />
                  <p className="text-sm text-foreground/90">{formatDate(encuesta.fecha_ultima_encuesta)}</p>
                </div>
              </div>
            )}
            {/* Mostrar encuestador/creador */}
            {(() => {
              const encuestador = (encuesta as any).usuario_creador
                || encuesta.encuestador
                || (encuesta as any).created_by 
                || (encuesta as any).createdBy 
                || (encuesta as any).user_id
                || encuesta.metadatos?.usuario_creador
                || encuesta.metadatos?.created_by
                || encuesta.metadatos?.encuestador;
              
              // Extraer el nombre si es un objeto {id, nombre}
              const encuestadorNombre = typeof encuestador === 'object' && encuestador !== null
                ? encuestador.nombre || encuestador.name || String(encuestador.id)
                : encuestador;
              
              return encuestadorNombre ? (
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">Encuestador</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground/60" />
                    <Badge variant="secondary" className="font-semibold">{encuestadorNombre}</Badge>
                  </div>
                </div>
              ) : null;
            })()}
            {(encuesta as any).numero_contrato_epm && (
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Contrato EPM</p>
                <code className="text-sm bg-muted/30 dark:bg-muted/20 px-2 py-1 rounded font-mono text-foreground">
                  {(encuesta as any).numero_contrato_epm}
                </code>
              </div>
            )}
            {(encuesta as any).comunion_en_casa !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-semibold">Comunión en Casa</span>
                <Badge variant={(encuesta as any).comunion_en_casa ? "default" : "outline"}>
                  {(encuesta as any).comunion_en_casa ? "Sí" : "No"}
                </Badge>
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
          <div className={`grid gap-6 ${shouldUseMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {/* Acueducto */}
            <div>
              <p className="text-sm text-muted-foreground font-semibold mb-2">Sistema de Acueducto</p>
              {Array.isArray(encuesta.acueducto) ? (
                <div className="space-y-1">
                  {encuesta.acueducto.map((ac: any) => (
                    <Badge key={ac.id} variant="outline" className="mr-1">{ac.nombre}</Badge>
                  ))}
                </div>
              ) : (
                <Badge variant="outline">{encuesta.acueducto?.nombre || 'No especificado'}</Badge>
              )}
            </div>
            
            {/* Aguas Residuales */}
            <div>
              <p className="text-sm text-muted-foreground font-semibold mb-2">Aguas Residuales</p>
              {Array.isArray(encuesta.aguas_residuales) ? (
                <div className="space-y-1">
                  {encuesta.aguas_residuales.map((ar: any) => (
                    <Badge key={ar.id} variant="outline" className="mr-1 mb-1">{ar.nombre}</Badge>
                  ))}
                </div>
              ) : encuesta.aguas_residuales ? (
                <Badge variant="outline">{encuesta.aguas_residuales.nombre}</Badge>
              ) : (
                <span className="text-muted-foreground/70 italic">No especificado</span>
              )}
            </div>
            
            {/* Disposición de Basuras */}
            <div>
              <p className="text-sm text-muted-foreground font-semibold mb-2">Disposición de Basuras</p>
              {encuesta.basuras && encuesta.basuras.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {encuesta.basuras.map((b: any) => (
                    <Badge key={b.id} variant="secondary" className="text-xs font-semibold">
                      {b.nombre}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground/70 italic">No especificado</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Miembros de Familia - DETALLE COMPLETO */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Miembros de Familia ({encuesta.miembros_familia.total_miembros})
          </CardTitle>
          <CardDescription>
            Información completa de todos los miembros activos de la familia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {encuesta.miembros_familia.personas.length > 0 ? (
            <div className="space-y-6">
              {encuesta.miembros_familia.personas.map((miembro: any, index: number) => {
                return (
                <Card key={miembro.id} className={`border-2 hover:border-primary/50 transition-colors ${isMobile ? 'mb-4' : ''}`}>
                  <CardHeader className={isMobile ? "pb-2 pt-3 px-3" : "pb-3"}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
                          <User className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
                          {miembro.nombre_completo}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          {miembro.parentesco && (
                            <Badge variant="secondary" className={isMobile ? "text-xs" : ""}>{miembro.parentesco.nombre}</Badge>
                          )}
                          <Badge variant="outline" className={isMobile ? "text-xs" : ""}>{miembro.sexo?.descripcion || miembro.sexo?.nombre}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-primary`}>{miembro.edad || calculateAge(miembro.fecha_nacimiento)}</p>
                        <p className="text-xs text-muted-foreground font-semibold">años</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className={`space-y-${isMobile ? '3' : '4'} ${isMobile ? 'px-3 pb-3' : ''}`}>
                    {/* Información Personal */}
                    <div>
                      <h4 className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-foreground mb-2 flex items-center gap-1`}>
                        <User className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-primary`} /> Información Personal
                      </h4>
                      <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 lg:grid-cols-3 gap-3'} text-sm`}>
                        <div>
                          <p className="text-muted-foreground font-semibold">Identificación</p>
                          <p className="font-semibold text-foreground/90">{miembro.identificacion.numero}</p>
                          <p className="text-xs text-muted-foreground/70">{miembro.identificacion.tipo?.nombre}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-semibold">Fecha de Nacimiento</p>
                          <p className="font-semibold text-foreground/90">{formatDate(miembro.fecha_nacimiento)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-semibold">Estado Civil</p>
                          <p className="font-semibold text-foreground/90">{miembro.estado_civil.nombre}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Contacto */}
                    <div>
                      <h4 className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-foreground mb-2 flex items-center gap-1`}>
                        <Phone className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-primary`} /> Contacto
                      </h4>
                      <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 gap-3'} text-sm`}>
                        {miembro.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground/60" />
                            <span className="text-foreground/90">{miembro.telefono}</span>
                          </div>
                        )}
                        {miembro.email && !miembro.email.includes('@temp.com') && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground/60" />
                            <span className="text-xs break-all text-foreground/90">{miembro.email}</span>
                          </div>
                        )}
                        {miembro.direccion && (
                          <div className="flex items-center gap-2 col-span-full">
                            <MapPin className="w-4 h-4 text-muted-foreground/60" />
                            <span className="text-foreground/90">{miembro.direccion}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Educación y Profesión */}
                    <div>
                      <h4 className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-foreground mb-2 flex items-center gap-1`}>
                        <GraduationCap className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-primary`} /> Educación y Profesión
                      </h4>
                      <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 gap-3'} text-sm`}>
                        <div>
                          <p className="text-muted-foreground font-semibold">Nivel de Estudios</p>
                          <p className="font-semibold text-foreground/90">{miembro.estudios.nombre}</p>
                        </div>
                        {miembro.profesion && (
                          <div>
                            <p className="text-muted-foreground font-semibold">Profesión/Oficio</p>
                            <p className="font-semibold text-foreground/90">{miembro.profesion.nombre}</p>
                          </div>
                        )}
                        {miembro.comunidad_cultural && (
                          <div>
                            <p className="text-muted-foreground font-semibold">Comunidad Cultural</p>
                            <p className="font-semibold text-foreground/90">{miembro.comunidad_cultural.nombre}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Tallas */}
                    <div>
                      <h4 className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-foreground mb-2 flex items-center gap-1`}>
                        <Shirt className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-primary`} /> Tallas
                      </h4>
                      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-4'} text-sm`}>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-semibold">👕 Camisa:</span>
                          <Badge variant="outline" className="font-semibold">{miembro.tallas.camisa}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-semibold">👖 Pantalón:</span>
                          <Badge variant="outline" className="font-semibold">{miembro.tallas.pantalon}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-semibold">👟 Zapato:</span>
                          <Badge variant="outline" className="font-semibold">{miembro.tallas.zapato}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Liderazgo */}
                    {miembro.en_que_eres_lider && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-bold text-sm text-foreground mb-2">
                            👑 Áreas de Liderazgo
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {parseArrayField(miembro.en_que_eres_lider).map((area, idx) => (
                              <Badge key={idx} variant="default" className="bg-purple-100 text-purple-800 border-purple-300">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Habilidades */}
                    {miembro.habilidades && miembro.habilidades.length > 0 ? (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-bold text-sm text-foreground mb-2">
                            ⭐ Habilidades
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {miembro.habilidades.map((h: any) => (
                              <Badge key={h.id} variant="secondary" className="text-xs font-semibold">
                                {h.nombre} {h.nivel && `(${h.nivel})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-bold text-sm text-foreground mb-2">
                            ⭐ Habilidades
                          </h4>
                          <p className="text-xs text-muted-foreground/70 italic">Sin habilidades registradas</p>
                        </div>
                      </>
                    )}

                    {/* Destrezas */}
                    {miembro.destrezas && miembro.destrezas.length > 0 ? (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-bold text-sm text-foreground mb-2">
                            🛠️ Destrezas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {miembro.destrezas.map((d: any) => (
                              <Badge key={d.id} variant="outline" className="text-xs font-semibold">
                                {d.nombre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-bold text-sm text-foreground mb-2">
                            🛠️ Destrezas
                          </h4>
                          <p className="text-xs text-muted-foreground/70 italic">Sin destrezas registradas</p>
                        </div>
                      </>
                    )}

                    {/* Celebraciones */}
                    {miembro.celebraciones && miembro.celebraciones.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-foreground mb-2 flex items-center gap-1`}>
                            <Calendar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-primary`} /> Fechas para Celebrar
                          </h4>
                          <div className={`${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
                            {miembro.celebraciones.map((c: any, idx: number) => (
                              <div key={c.id || idx} className="flex items-center gap-2 text-sm">
                                <Badge variant="outline">{c.dia}/{c.mes}</Badge>
                                <span>{c.motivo}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Enfermedades */}
                    {miembro.enfermedades && miembro.enfermedades.length > 0 ? (
                      <>
                        <Separator />
                        <div>
                          <h4 className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-foreground mb-2 flex items-center gap-1`}>
                            <Heart className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-destructive`} /> Enfermedades
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {miembro.enfermedades.map((e: any) => (
                              <Badge key={e.id} variant="destructive" className="text-xs font-semibold">
                                {e.nombre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Separator />
                        <div>
                          <h4 className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-foreground mb-2 flex items-center gap-1`}>
                            <Heart className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-muted-foreground/60`} /> Enfermedades
                          </h4>
                          <p className="text-xs text-muted-foreground/70 italic">Sin enfermedades registradas</p>
                        </div>
                      </>
                    )}

                    {/* Necesidades de Enfermo */}
                    {miembro.necesidad_enfermo && (
                      <>
                        <Separator />
                        <div>
                          <h4 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 mb-2 flex items-center gap-1`}>
                            <AlertTriangle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-orange-500`} /> Necesidades del Enfermo
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {parseArrayField(miembro.necesidad_enfermo).map((necesidad, idx) => (
                              <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-800 border-orange-300">
                                {necesidad}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Solicitud de Comunión en Casa */}
                    {miembro.solicitudComunionCasa && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <Heart className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900">Solicita Comunión en Casa</p>
                            <p className="text-xs text-blue-700">Este miembro ha solicitado recibir la comunión en su domicilio.</p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>No hay miembros registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personas Fallecidas */}
      {encuesta.deceasedMembers && encuesta.deceasedMembers.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Personas Fallecidas ({encuesta.deceasedMembers.length})
            </CardTitle>
            <CardDescription>
              Registro de familiares fallecidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {encuesta.deceasedMembers.map((fallecido: any, index: number) => (
                <Card key={index} className="border-purple-200 bg-purple-50/30">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nombre Completo</p>
                        <p className="font-semibold text-purple-900">{fallecido.nombres}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Fallecimiento</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <p className="font-medium">{formatDate(fallecido.fechaFallecimiento)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sexo</p>
                        <Badge variant="outline">{fallecido.sexo.nombre}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Parentesco</p>
                        <Badge variant="secondary">{fallecido.parentesco.nombre}</Badge>
                      </div>
                      {fallecido.causaFallecimiento && (
                        <div className="col-span-full">
                          <p className="text-sm text-gray-500">Causa de Fallecimiento</p>
                          <p className="text-sm mt-1 p-2 bg-white rounded border">
                            {fallecido.causaFallecimiento}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observaciones y Consentimiento */}
      <Card className="mb-8 border-blue-200 bg-blue-50/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Observaciones y Consentimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-500" />
                Sustento de la Familia
              </p>
              <div className="p-3 bg-white rounded-lg border border-blue-100 min-h-[80px]">
                <p className="text-sm text-gray-700">
                  {encuesta.observaciones?.sustento_familia || encuesta.sustento_familia || encuesta.socioeconomica?.fuente_ingresos || "No especificado"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Observaciones del Encuestador
              </p>
              <div className="p-3 bg-white rounded-lg border border-blue-100 min-h-[80px]">
                <p className="text-sm text-gray-700">
                  {encuesta.observaciones?.observaciones_encuestador || encuesta.observaciones_encuestador || encuesta.observaciones_generales || "Sin observaciones"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Autorización de Datos</p>
              <p className="text-sm text-green-700">
                {encuesta.autorizacion_datos || encuesta.observaciones?.autorizacion_datos 
                  ? "El usuario ha autorizado el tratamiento de sus datos personales para vincularse a la parroquia." 
                  : "No se ha registrado autorización explícita en este campo."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
