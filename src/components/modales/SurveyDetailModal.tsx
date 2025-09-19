/**
 * 🔍 Modal de Detalles de Encuesta
 * 
 * Modal dinámico que muestra toda la información completa de una encuesta
 * con navegación interna por pestañas y componentes modulares
 */

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  FileText,
  Home,
  Users,
  Heart,
  Droplets,
  MapPin,
  Settings,
  AlertTriangle,
  Loader2
} from "lucide-react";

// Importar servicios
import { useEncuestas } from "@/hooks/useEncuestas";
import { EncuestaListItem } from "@/services/encuestas";
import { useResponsiveTable } from "@/hooks/useResponsiveTable";

// Import directo de componentes para evitar lazy loading que causa flickering inicial
import BasicInfoSection from "@/components/modales/survey-details/BasicInfoSection";
import LocationSection from "@/components/modales/survey-details/LocationSection";
import ServicesSection from "@/components/modales/survey-details/ServicesSection";
import FamilyMembersSection from "@/components/modales/survey-details/FamilyMembersSection";
import DeceasedMembersSection from "@/components/modales/survey-details/DeceasedMembersSection";
import MetadataSection from "@/components/modales/survey-details/MetadataSection";

// Importar estilos para eliminar flickering
import "@/styles/survey-modal-fixes.css";

// ============================================================================
// INTERFACES
// ============================================================================

interface SurveyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string | null;
  initialData?: Partial<EncuestaListItem>;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ data: EncuestaListItem }>;
  showBadge?: (data: EncuestaListItem) => boolean;
  badgeCount?: (data: EncuestaListItem) => number;
}

// ============================================================================
// CONFIGURACIÓN DE PESTAÑAS
// ============================================================================

const TAB_CONFIGS: TabConfig[] = [
  {
    id: "basic",
    label: "Información General",
    icon: Home,
    component: BasicInfoSection,
  },
  {
    id: "location",
    label: "Ubicación",
    icon: MapPin,
    component: LocationSection,
  },
  {
    id: "services",
    label: "Servicios",
    icon: Droplets,
    component: ServicesSection,
  },
  {
    id: "family",
    label: "Miembros Familia",
    icon: Users,
    component: FamilyMembersSection,
    showBadge: (data) => data.miembros_familia?.total_miembros > 0,
    badgeCount: (data) => data.miembros_familia?.total_miembros || 0,
  },
  {
    id: "deceased",
    label: "Fallecidos",
    icon: Heart,
    component: DeceasedMembersSection,
    showBadge: (data) => data.deceasedMembers && data.deceasedMembers.length > 0,
    badgeCount: (data) => data.deceasedMembers ? data.deceasedMembers.length : 0,
  },
  {
    id: "metadata",
    label: "Datos Técnicos",
    icon: Settings,
    component: MetadataSection,
  },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const SurveyDetailModal = ({ 
  isOpen, 
  onClose, 
  surveyId, 
  initialData 
}: SurveyDetailModalProps) => {
  const { toast } = useToast();
  
  // Hook para obtener encuesta (solo cuando tenemos ID)
  const { 
    data: encuestaResponse, 
    isLoading: loading, 
    error: queryError 
  } = useEncuestas().getEncuestaById(surveyId || '');
  
  // Hook para responsive design
  const { shouldUseMobileView, isMobile, isVerySmall } = useResponsiveTable();

  // Estados locales
  const [activeTab, setActiveTab] = useState("basic");
  
  // Datos derivados
  const surveyData = encuestaResponse?.data || (initialData as EncuestaListItem) || null;
  const error = queryError?.message || null;

  // ========================================================================
  // EFECTOS
  // ========================================================================

  /**
   * Mostrar toast de error cuando ocurra
   */
  React.useEffect(() => {
    if (error && isOpen) {
      toast({
        variant: "destructive",
        title: "Error al cargar encuesta",
        description: error
      });
    }
  }, [error, isOpen, toast]);

  /**
   * Resetear estado al cerrar modal
   */
  React.useEffect(() => {
    if (!isOpen) {
      setActiveTab("basic");
    }
  }, [isOpen]);

  /**
   * Función simplificada para manejar cambio de pestañas
   */
  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
  };

  // ========================================================================
  // FUNCIONES AUXILIARES
  // ========================================================================

  /**
   * Type guard para verificar si es EncuestaListItem
   */
  const isEncuestaListItem = (data: any): data is EncuestaListItem => {
    return data && typeof data.codigo_familia === 'string';
  };

  /**
   * Obtener badge de estado
   */
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completada</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700">En Progreso</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Cancelada</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pendiente</Badge>;
    }
  };

  /**
   * Manejar cierre del modal
   */
  const handleClose = () => {
    onClose();
  };

  // ========================================================================
  // RENDERIZADO
  // ========================================================================

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden survey-detail-modal",
          shouldUseMobileView 
            ? "max-w-[95vw] h-[95vh] w-[95vw]" 
            : "max-w-6xl h-[90vh]",
          loading && !surveyData && "loading"
        )}
      >
        <DialogDescription className="sr-only">
          Modal que muestra la información completa de una encuesta familiar con detalles organizados por pestañas
        </DialogDescription>
        
        {/* Header del Modal - Responsive */}
        <DialogHeader className={cn(
          "border-b bg-gray-50",
          isMobile ? "p-4 pb-3" : "p-6 pb-4"
        )}>
          <div className={cn(
            "flex items-center gap-4",
            isMobile && "flex-col gap-2"
          )}>
            <div className={cn(
              "bg-green-100 rounded-lg flex items-center justify-center",
              isMobile ? "w-8 h-8" : "w-10 h-10"
            )}>
              <FileText className={cn(
                "text-green-600",
                isMobile ? "w-4 h-4" : "w-5 h-5"
              )} />
            </div>
            <div className={isMobile ? "text-center" : ""}>
              <DialogTitle className={cn(
                "font-bold text-gray-900",
                isMobile ? "text-lg" : "text-xl"
              )}>
                {loading ? (
                  <Skeleton className={cn(
                    isMobile ? "h-5 w-32" : "h-6 w-48"
                  )} />
                ) : surveyData ? (
                  `Familia ${surveyData.apellido_familiar}`
                ) : (
                  'Detalles de Encuesta'
                )}
              </DialogTitle>
              <div className={cn(
                "flex items-center gap-2 mt-1",
                isMobile && "justify-center"
              )}>
                {loading ? (
                  <Skeleton className={cn(
                    isMobile ? "h-3 w-24" : "h-4 w-32"
                  )} />
                ) : surveyData && (
                  <>
                    <code className={cn(
                      "bg-gray-200 px-2 py-0.5 rounded",
                      isMobile ? "text-xs" : "text-xs"
                    )}>
                      {surveyData.codigo_familia}
                    </code>
                    {getStatusBadge(surveyData.estado_encuesta)}
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Contenido del Modal */}
        <div className="flex-1 overflow-hidden mobile-modal-content">
          {loading && !surveyData ? (
            // Estado de carga inicial optimizado con skeleton de pestañas
            <div className="h-full flex flex-col">
              {/* Skeleton de pestañas */}
              <div className={cn(
                "flex-shrink-0 border-b bg-white",
                isMobile ? "px-4" : "px-6"
              )}>
                <div className={cn(
                  "h-12 bg-gray-50 border border-gray-200 rounded-lg p-1 gap-1 tabs-skeleton",
                  isMobile ? "grid grid-cols-3" : "grid grid-cols-6"
                )}>
                  {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-full rounded-md skeleton" />
                  ))}
                </div>
              </div>
              {/* Skeleton de contenido */}
              <div className={cn(
                "flex-1 space-y-6",
                isMobile ? "p-4" : "p-6"
              )}>
                <div className="flex items-center justify-center gap-3 py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                  <p className="text-gray-600">Cargando detalles de la encuesta...</p>
                </div>
              </div>
            </div>
          ) : error && !surveyData ? (
            // Estado de error
            <div className={cn(isMobile ? "p-4" : "p-6")}>
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <AlertTriangle className="w-16 h-16 text-red-500" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Error al cargar encuesta
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            </div>
          ) : surveyData ? (
            // Contenido principal con pestañas
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
              {/* Lista de pestañas - Responsive */}
              <div className={cn(
                "flex-shrink-0 border-b bg-white sticky top-0 z-10",
                isMobile ? "px-4" : "px-6"
              )}>
                <TabsList className={cn(
                  "w-full bg-gray-50 border border-gray-200 rounded-lg p-1",
                  isMobile 
                    ? "grid grid-cols-3 gap-1 h-auto mobile-tabs" 
                    : "grid grid-cols-6 h-12"
                )}>
                  {(isMobile ? TAB_CONFIGS.slice(0, 6) : TAB_CONFIGS).map((tab) => {
                    const IconComponent = tab.icon;
                    const showBadge = isEncuestaListItem(surveyData) && tab.showBadge?.(surveyData);
                    const badgeCount = isEncuestaListItem(surveyData) ? (tab.badgeCount?.(surveyData) || 0) : 0;
                    
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className={cn(
                          "flex items-center gap-2 flex-shrink-0",
                          "hover:bg-green-50 hover:text-green-700",
                          "data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md",
                          "data-[state=active]:border-green-600 data-[state=active]:font-semibold",
                          "text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                          "transition-all duration-150 ease-in-out",
                          isMobile 
                            ? "text-xs p-2 min-w-0 flex-col h-16 justify-center" 
                            : "text-xs"
                        )}
                      >
                        <IconComponent className={cn(
                          "flex-shrink-0 tab-icon",
                          activeTab === tab.id ? "text-white" : "text-gray-500",
                          isMobile ? "w-3 h-3" : "w-4 h-4"
                        )} />
                        <span className={cn(
                          "truncate text-center",
                          isMobile ? "text-xs leading-tight" : "hidden sm:inline"
                        )}>
                          {isMobile ? tab.label.split(' ')[0] : tab.label}
                        </span>
                        {showBadge && !isMobile && (
                          <Badge 
                            variant={activeTab === tab.id ? "secondary" : "outline"} 
                            className={cn(
                              "text-xs ml-1 tab-badge",
                              activeTab === tab.id 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : "bg-gray-100 text-gray-600"
                            )}
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Contenido de pestañas - Scrolleable */}
              <div className="flex-1 overflow-hidden min-h-0">
                <ScrollArea className="h-full">
                  <div className="relative">
                    {TAB_CONFIGS.map((tab) => {
                      const ComponentToRender = tab.component;
                      
                      return (
                        <TabsContent 
                          key={tab.id} 
                          value={tab.id} 
                          className={cn(
                            "mt-0 focus:outline-none data-[state=inactive]:hidden tab-content",
                            isMobile ? "p-4" : "p-6"
                          )}
                        >
                          {isEncuestaListItem(surveyData) ? (
                            <ComponentToRender data={surveyData} />
                          ) : (
                            <div className="p-8 text-center">
                              <p className="text-gray-500">Datos no disponibles para este formato</p>
                            </div>
                          )}
                        </TabsContent>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </Tabs>
          ) : null}
        </div>

        {/* Indicador de carga superpuesto */}
        {loading && surveyData && (
          <div className="absolute top-0 right-0 m-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Actualizando...
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SurveyDetailModal;
