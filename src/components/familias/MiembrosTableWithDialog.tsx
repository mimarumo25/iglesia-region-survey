/**
 * MiembrosTableWithDialog - Tabla de miembros con modal de detalles
 * 
 * Componente que muestra una tabla resumen de miembros de familia
 * con un botón "Ver Detalles" que abre un Dialog mostrando toda
 * la información completa organizada en 7 tarjetas temáticas.
 * 
 * @version 1.0
 * @since Sistema MIA v1.0
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Heart,
  Church,
  Ruler,
  Sparkles,
  Eye
} from "lucide-react";
import type { MiembroFamiliaConsolidado, CelebracionMiembro, EnfermedadMiembro } from "@/types/familias";
import { formatCatalogOptionLabels } from "@/utils/catalogOptionFormatters";

interface MiembrosTableWithDialogProps {
  miembros: MiembroFamiliaConsolidado[];
}

const formatNecesidadesEnfermo = (miembro: MiembroFamiliaConsolidado): string => (
  formatCatalogOptionLabels((miembro as any).necesidadesEnfermo ?? miembro.necesidades_enfermo)
);

const MiembrosTableWithDialog = ({ miembros }: MiembrosTableWithDialogProps) => {
  const [selectedMiembro, setSelectedMiembro] = useState<MiembroFamiliaConsolidado | null>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /**
   * Abre el modal de detalles para un miembro específico
   */
  const handleVerDetalles = (miembro: MiembroFamiliaConsolidado) => {
    setSelectedMiembro(miembro);
    setIsDialogOpen(true);
  };

  /**
   * Cierra el modal de detalles
   */
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay para evitar flash visual
    setTimeout(() => setSelectedMiembro(null), 200);
  };

  if (!miembros || miembros.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No hay miembros registrados en esta familia</p>
      </div>
    );
  }

  return (
    <>
      {/* Tabla resumen de miembros */}
      <div className="professional-table-shell max-h-[55vh] overflow-hidden">
        <Table className="professional-data-table min-w-[980px] text-[0.82rem]">
          <TableHeader>
            <TableRow className="bg-muted/70">
              <TableHead className="sticky top-0 bg-muted z-20 min-w-[220px]">Nombre Completo</TableHead>
              <TableHead className="sticky top-0 bg-muted z-20 min-w-[170px]">Identificación</TableHead>
              <TableHead className="sticky top-0 bg-muted z-20 text-center min-w-[90px]">Edad</TableHead>
              <TableHead className="sticky top-0 bg-muted z-20 text-center min-w-[100px]">Sexo</TableHead>
              <TableHead className="sticky top-0 bg-muted z-20 min-w-[130px]">Parentesco</TableHead>
              <TableHead className="sticky top-0 bg-muted z-20 min-w-[220px]">Contacto</TableHead>
              <TableHead className="sticky top-0 bg-muted z-20 text-right min-w-[150px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {miembros.map((miembro, index) => {
              const rowKey = `${miembro.numero_identificacion || miembro.nombre_completo || "miembro"}-${index}`;
              const isSelected = selectedRowKey === rowKey;
              return (
              <TableRow
                key={rowKey}
                data-state={isSelected ? "selected" : undefined}
                aria-selected={isSelected}
                tabIndex={0}
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={() => setSelectedRowKey(rowKey)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedRowKey(rowKey);
                  }
                }}
              >
                <TableCell className="font-medium">{miembro.nombre_completo || "-"}</TableCell>
                <TableCell>
                  {miembro.tipo_identificacio && miembro.numero_identificacion
                    ? `${miembro.tipo_identificacio} ${miembro.numero_identificacion}`
                    : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {miembro.edad ? `${miembro.edad} años` : "-"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={miembro.sexo === "Masculino" ? "default" : "secondary"}>
                    {miembro.sexo || "-"}
                  </Badge>
                </TableCell>
                <TableCell>{miembro.parentesco || "-"}</TableCell>
                <TableCell>
                  {miembro.telefono_personal || miembro.email_personal ? (
                    <div className="flex flex-col gap-1 text-sm">
                      {miembro.telefono_personal && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {miembro.telefono_personal}
                        </span>
                      )}
                      {miembro.email_personal && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {miembro.email_personal}
                        </span>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => { event.stopPropagation(); setSelectedRowKey(rowKey); handleVerDetalles(miembro); }}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialog con información completa del miembro */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {selectedMiembro?.nombre_completo || "Información del Miembro"}
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    {selectedMiembro?.tipo_identificacio} {selectedMiembro?.numero_identificacion}
                  </DialogDescription>
                </div>
              </div>
              {selectedMiembro && (
                <div className="flex gap-2">
                  <Badge variant={selectedMiembro.sexo === "Masculino" ? "default" : "secondary"} className="text-sm">
                    {selectedMiembro.sexo}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {selectedMiembro.edad} años
                  </Badge>
                </div>
              )}
            </div>
          </DialogHeader>

          {selectedMiembro && (
            <div className="space-y-6 mt-6">
              {/* Sección 1: Información Personal y Contacto */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Datos Personales y Contacto
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Card: Información Personal */}
                  <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Información Personal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fecha de Nacimiento</p>
                          <p className="font-medium">{selectedMiembro.fecha_nacimiento || "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Edad</p>
                          <Badge variant="outline" className="font-medium">
                            {selectedMiembro.edad ? `${selectedMiembro.edad} años` : "-"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Parentesco</p>
                          <p className="font-medium">{selectedMiembro.parentesco || "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Estado Civil</p>
                          <p className="font-medium">{selectedMiembro.situacion_civil || "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card: Contacto */}
                  <Card className="border-blue-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        Información de Contacto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                        <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Teléfono Personal</p>
                          <p className="font-medium truncate">{selectedMiembro.telefono_personal || "-"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                        <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Email Personal</p>
                          <p className="font-medium text-blue-600 truncate">
                            {selectedMiembro.email_personal || "-"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sección 2: Formación, Trabajo y Cultura */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Formación y Desarrollo
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Card: Formación & Trabajo */}
                  <Card className="border-purple-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-600" />
                        Formación & Trabajo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                        <GraduationCap className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Nivel de Estudios</p>
                          <p className="font-medium">{selectedMiembro.estudios || "-"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                        <Briefcase className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Profesión u Oficio</p>
                          <p className="font-medium">{selectedMiembro.profesion || "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card: Habilidades & Liderazgo */}
                  <Card className="border-yellow-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        Habilidades & Liderazgo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                        <Users className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Comunidad Cultural</p>
                          <p className="font-medium">{selectedMiembro.comunidad_cultural || "-"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="p-2 rounded-md bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Liderazgo</p>
                          <p className="font-medium">{selectedMiembro.liderazgo || "-"}</p>
                        </div>
                        <div className="p-2 rounded-md bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Destrezas</p>
                          <p className="font-medium">{selectedMiembro.destrezas || "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sección 3: Salud y Religión */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Salud y Vida Espiritual
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Card: Salud y Enfermedades */}
                  <Card className="border-red-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-600" />
                        Información de Salud
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {/* Lista de enfermedades */}
                      {selectedMiembro.todas_las_enfermedades && selectedMiembro.todas_las_enfermedades.length > 0 ? (
                        <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                          <p className="text-xs text-muted-foreground mb-2 font-semibold">Enfermedades Registradas</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedMiembro.todas_las_enfermedades.map((enfermedad, idx) => (
                              <Badge key={idx} variant="destructive" className="text-xs">
                                {enfermedad.nombre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                          <p className="font-medium text-green-700 dark:text-green-400">
                            ✅ Sin enfermedades registradas
                          </p>
                        </div>
                      )}
                      
                      {formatNecesidadesEnfermo(selectedMiembro) !== '-' && (
                        <div className="p-3 rounded-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                          <p className="text-xs text-muted-foreground mb-1 font-semibold">Necesidades Especiales</p>
                          <p className="font-medium text-orange-700 dark:text-orange-400">
                            {formatNecesidadesEnfermo(selectedMiembro)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Card: Información Religiosa */}
                  <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Church className="h-4 w-4 text-primary" />
                        Vida Espiritual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Church className="h-4 w-4 text-primary" />
                          <span className="font-medium">Comunión en Casa</span>
                        </div>
                        <Badge 
                          variant={selectedMiembro.comunion_casa ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {selectedMiembro.comunion_casa ? "Sí" : "No"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sección 4: Información Adicional */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-cyan-600 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Información Adicional
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Card: Tallas & Medidas */}
                  <Card className="border-cyan-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-cyan-600" />
                        Tallas & Medidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-muted/30">
                          <Ruler className="h-5 w-5 text-cyan-600" />
                          <p className="text-xs text-muted-foreground text-center">Camisa/Blusa</p>
                          <Badge variant="outline" className="text-sm px-3 py-1 font-semibold">
                            {selectedMiembro.tallas?.camisa_blusa || "-"}
                          </Badge>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-muted/30">
                          <Ruler className="h-5 w-5 text-cyan-600" />
                          <p className="text-xs text-muted-foreground text-center">Pantalón</p>
                          <Badge variant="outline" className="text-sm px-3 py-1 font-semibold">
                            {selectedMiembro.tallas?.pantalon || "-"}
                          </Badge>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-muted/30">
                          <Ruler className="h-5 w-5 text-cyan-600" />
                          <p className="text-xs text-muted-foreground text-center">Calzado</p>
                          <Badge variant="outline" className="text-sm px-3 py-1 font-semibold">
                            {selectedMiembro.tallas?.calzado || "-"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card: Celebraciones Especiales */}
                  <Card className="border-amber-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        Celebraciones Especiales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {selectedMiembro.todas_las_celebraciones && selectedMiembro.todas_las_celebraciones.length > 0 ? (
                        <div className="space-y-2">
                          {selectedMiembro.todas_las_celebraciones.map((celebracion, idx) => {
                            const meses = [
                              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                            ];
                            const mesNombre = meses[celebracion.mes - 1] || celebracion.mes;
                            
                            return (
                              <div key={idx} className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                      {celebracion.motivo}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        📅 {celebracion.dia} de {mesNombre}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">Sin celebraciones registradas</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MiembrosTableWithDialog;
