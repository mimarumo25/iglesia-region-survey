/**
 * 🔍 Modal de Detalles de Encuesta
 * 
 * Modal dinámico que muestra toda la información completa de una encuesta
 * con navegación interna por pestañas y componentes modulares
 */

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { useEncuestas, EncuestaListItem } from "@/services/encuestas";

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
    showBadge: (data) => data.miembros_familia.total_miembros > 0,
    badgeCount: (data) => data.miembros_familia.total_miembros,
  },
  {
    id: "deceased",
    label: "Fallecidos",
    icon: Heart,
    component: DeceasedMembersSection,
    showBadge: (data) => data.personas_fallecidas.total_fallecidos > 0,
    badgeCount: (data) => data.personas_fallecidas.total_fallecidos,
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
  const { getEncuestaById } = useEncuestas();

  // Estados
  const [surveyData, setSurveyData] = useState<EncuestaListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // ========================================================================
  // EFECTOS Y CARGAR DATOS
  // ========================================================================

  /**
   * Cargar datos de la encuesta cuando se abre el modal
   */
  useEffect(() => {
    const loadSurveyData = async () => {
      if (!isOpen || !surveyId) {
        setSurveyData(null);
        setError(null);
        return;
      }

      // Si tenemos datos iniciales, usarlos temporalmente
      if (initialData) {
        setSurveyData(initialData as EncuestaListItem);
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getEncuestaById(parseInt(surveyId));
        setSurveyData(response.data as EncuestaListItem);

        console.log('✅ Datos de encuesta cargados en modal:', response.data);

      } catch (error: any) {
        console.error('❌ Error al cargar encuesta en modal:', error);
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

    loadSurveyData();
  }, [isOpen, surveyId, initialData, getEncuestaById, toast]);

  /**
   * Resetear estado al cerrar modal
   */
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("basic");
      setError(null);
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
    setSurveyData(null);
    setError(null);
    onClose();
  };

  // ========================================================================
  // RENDERIZADO
  // ========================================================================

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "max-w-6xl h-[90vh] p-0 overflow-hidden survey-detail-modal",
          loading && !surveyData && "loading"
        )}
        aria-describedby="survey-detail-description"
      >
        <div id="survey-detail-description" className="sr-only">
          Modal que muestra la información completa de una encuesta familiar con detalles organizados por pestañas
        </div>
        {/* Header del Modal */}
        <DialogHeader className="p-6 pb-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {loading ? (
                  <Skeleton className="h-6 w-48" />
                ) : surveyData ? (
                  `Familia ${surveyData.apellido_familiar}`
                ) : (
                  'Detalles de Encuesta'
                )}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : surveyData && (
                  <>
                    <code className="text-xs bg-gray-200 px-2 py-0.5 rounded">
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
        <div className="flex-1 overflow-hidden">
          {loading && !surveyData ? (
            // Estado de carga inicial optimizado con skeleton de pestañas
            <div className="h-full flex flex-col">
              {/* Skeleton de pestañas */}
              <div className="flex-shrink-0 border-b bg-white px-6">
                <div className="grid grid-cols-6 h-12 bg-gray-50 border border-gray-200 rounded-lg p-1 gap-1 tabs-skeleton">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-full rounded-md skeleton" />
                  ))}
                </div>
              </div>
              {/* Skeleton de contenido */}
              <div className="flex-1 p-6 space-y-6">
                <div className="flex items-center justify-center gap-3 py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                  <p className="text-gray-600">Cargando detalles de la encuesta...</p>
                </div>
              </div>
            </div>
          ) : error && !surveyData ? (
            // Estado de error
            <div className="p-6">
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
              {/* Lista de pestañas - Fija en la parte superior */}
              <div className="flex-shrink-0 border-b bg-white px-6 sticky top-0 z-10">
                <TabsList className="grid w-full grid-cols-6 h-12 bg-gray-50 border border-gray-200 rounded-lg p-1">
                  {TAB_CONFIGS.map((tab) => {
                    const IconComponent = tab.icon;
                    const showBadge = tab.showBadge?.(surveyData);
                    const badgeCount = tab.badgeCount?.(surveyData);
                    
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className={cn(
                          "flex items-center gap-2 text-xs flex-shrink-0",
                          "hover:bg-green-50 hover:text-green-700",
                          "data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md",
                          "data-[state=active]:border-green-600 data-[state=active]:font-semibold",
                          "text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                          "transition-all duration-150 ease-in-out"
                        )}
                      >
                        <IconComponent className={cn(
                          "w-4 h-4 flex-shrink-0 tab-icon",
                          activeTab === tab.id ? "text-white" : "text-gray-500"
                        )} />
                        <span className="hidden sm:inline truncate">{tab.label}</span>
                        {showBadge && (
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
                          className="mt-0 p-6 focus:outline-none data-[state=inactive]:hidden tab-content"
                        >
                          <ComponentToRender data={surveyData} />
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
