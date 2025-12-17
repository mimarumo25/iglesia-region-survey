import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, SurveyFormSkeleton } from "@/components/ui/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, X, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SurveyHeader from "./survey/SurveyHeader";
import StandardFormField from "./survey/StandardFormField";
import FamilyGrid from "./survey/FamilyGrid";
import DeceasedGrid from "./survey/DeceasedGrid";
import SurveyControls from "./survey/SurveyControls";
import FormDataLoadingError from "./survey/FormDataLoadingError";
import DataProtectionModal from "./survey/DataProtectionModal";
import DataProtectionCheckbox from "./survey/DataProtectionCheckbox";
import { FamilyMember, DeceasedFamilyMember, FormStage } from "@/types/survey";
import { useConfigurationData } from '@/hooks/useConfigurationData';
import { useMunicipioDependentParroquias } from "@/hooks/useMunicipioDependentParroquias";
import { useMunicipioDependentVeredas } from "@/hooks/useMunicipioDependentVeredas";
import { useMunicipioDependentCorregimientos } from "@/hooks/useMunicipioDependentCorregimientos";
import { useMunicipioDependentCentrosPoblados } from "@/hooks/useMunicipioDependentCentrosPoblados";
import { getAutocompleteOptions, getLoadingState, getErrorState } from "@/utils/formFieldHelpers";
import { transformFormDataToSurveySession, saveSurveyToLocalStorage } from "@/utils/sessionDataTransformer";
import { convertSelectionMapToIds } from "@/utils/dynamicSelectionHelpers";
import { SurveySubmissionService } from "@/services/surveySubmission";
import { encuestasService } from "@/services/encuestas";
import { transformEncuestaToFormData, validateTransformedData } from "@/utils/encuestaToFormTransformer";
import { hasLeadershipFamilyMember, getLeadershipMessage } from "@/utils/familyValidationHelpers";
import { ENCUESTAS_QUERY_KEYS } from "@/hooks/useEncuestas";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
// Removed storage debugger import - component was cleaned up

/**
 * Normaliza un ConfigurationItem para asegurar que el ID sea numérico
 * Útil para datos que vienen de localStorage con IDs como strings
 */
const normalizeConfigurationItem = (item: any): any => {
  if (!item) return null;
  
  // Si no tiene estructura de ConfigurationItem, retornar tal cual
  if (typeof item !== 'object' || !item.id) return item;
  
  // Convertir el ID a número
  const numericId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
  
  // Si la conversión falla, devolver el item original
  if (isNaN(numericId)) return item;
  
  return {
    ...item,
    id: numericId
  };
};

// Definición de las etapas del formulario basado en la encuesta parroquial
const formStages: FormStage[] = [
  {
    id: 1,
    title: "Información General",
    description: "Datos básicos del hogar y ubicación",
    fields: [
      { id: "municipio", label: "Municipio", type: "autocomplete", required: true, configKey: "municipioOptions" },
      { id: "parroquia", label: "Parroquia", type: "autocomplete", required: true, configKey: "parroquiaOptions" },
      { id: "fecha", label: "Fecha", type: "date", required: true },
      { id: "apellido_familiar", label: "Apellido Familiar", type: "text", required: true },
      { id: "corregimiento", label: "Corregimiento", type: "autocomplete", required: false, configKey: "corregimientoOptions" },
      { id: "centro_poblado", label: "Centro Poblado", type: "autocomplete", required: false, configKey: "centroPobladoOptions" },
      { id: "vereda", label: "Vereda", type: "autocomplete", required: false, configKey: "veredaOptions" },
      { id: "sector", label: "Sector", type: "autocomplete", required: false, configKey: "sectorOptions" },
      { id: "direccion", label: "Dirección", type: "text", required: false },
      { id: "telefono", label: "Teléfono", type: "text", required: false },
      { id: "numero_contrato_epm", label: "Número Contrato EPM", type: "text", required: false }
    ]
  },
  {
    id: 2,
    title: "Información de Vivienda y Basuras",
    description: "Características de la vivienda y manejo de basuras",
    fields: [
      { id: "tipo_vivienda", label: "Tipo de Vivienda", type: "autocomplete", required: true, configKey: "tipoViviendaOptions" },
      { id: "disposicion_basura", label: "Tipos de Disposición de Basura", type: "multiple-checkbox", required: false, configKey: "disposicionBasuraOptions" }
    ]
  },
  {
    id: 3,
    title: "Acueducto y Aguas Residuales",
    description: "Servicios de agua y saneamiento - Selecciona las opciones que apliquen",
    fields: [
      { id: "sistema_acueducto", label: "Sistema de Acueducto", type: "autocomplete", required: false, configKey: "sistemasAcueductoOptions" },
      { id: "aguas_residuales", label: "Tipos de Aguas Residuales", type: "multiple-checkbox", required: false, configKey: "aguasResidualesOptions" }
    ]
  },
  {
    id: 4,
    title: "Información Familiar",
    description: "Integrantes del núcleo familiar con información completa",
    type: "family_grid"
  },
  {
    id: 5,
    title: "Difuntos de la Familia",
    description: "Información sobre familiares difuntos y fechas de aniversario",
    type: "deceased_grid"
  },
  {
    id: 6,
    title: "Observaciones y Consentimiento",
    description: "Observaciones finales y autorización de datos",
    fields: [
      { id: "sustento_familia", label: "Sustento de la Familia", type: "textarea", required: false },
      { id: "observaciones_encuestador", label: "Observaciones del Encuestador", type: "textarea", required: false },
      { id: "autorizacion_datos", label: "Autorizo el tratamiento de mis datos personales para vincularme a la parroquia y recibir notificaciones de interés", type: "boolean", required: true }
    ]
  }
];

const SurveyForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: surveyId } = useParams<{ id: string }>(); // Detectar ID de la URL para modo edición
  
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [deceasedMembers, setDeceasedMembers] = useState<DeceasedFamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false); // Indica si la encuesta fue enviada exitosamente
  const [isEditMode, setIsEditMode] = useState(false); // Indica si estamos editando
  const [isLoadingEncuesta, setIsLoadingEncuesta] = useState(false); // Loading de carga de encuesta
  const [showDataProtectionModal, setShowDataProtectionModal] = useState(false); // NO mostrar automáticamente
  const [hasAcceptedDataProtection, setHasAcceptedDataProtection] = useState(false); // Inicia sin aceptar
  const [isDraftLoaded, setIsDraftLoaded] = useState(false); // Indica si el borrador ya fue cargado
  const { toast } = useToast();

  // Hook para cargar datos de configuración
  const configurationData = useConfigurationData();

  // Hook para manejar parroquias dependientes del municipio
  const {
    parroquiaOptions: dinamicParroquiaOptions,
    isLoading: parroquiasLoading,
    error: parroquiasError,
    hasSelectedMunicipio
  } = useMunicipioDependentParroquias(formData?.municipio);

  // Hook para manejar veredas dependientes del municipio
  const {
    veredaOptions: dinamicVeredaOptions,
    isLoading: veredasLoading,
    error: veredasError,
    hasSelectedMunicipio: hasSelectedMunicipioForVeredas
  } = useMunicipioDependentVeredas(formData?.municipio);

  // Hook para manejar corregimientos dependientes del municipio
  const {
    corregimientoOptions: dinamicCorregimientoOptions,
    isLoading: corregimientosLoading,
    error: corregimientosError
  } = useMunicipioDependentCorregimientos(formData?.municipio);

  // Hook para manejar centros poblados dependientes del municipio
  const {
    centroPobladoOptions: dinamicCentroPobladoOptions,
    isLoading: centrosPobladosLoading,
    error: centrosPobladosError
  } = useMunicipioDependentCentrosPoblados(formData?.municipio);

  const currentStageData = formStages.find(stage => stage.id === currentStage);
  const progress = (currentStage / formStages.length) * 100;

  // Auto-guardado cuando cambia la etapa (solo nueva estructura)
  useEffect(() => {
    // ✅ No guardar borrador si la encuesta ya fue enviada exitosamente o si no se ha cargado el borrador inicial
    if (isSubmittedSuccessfully || !isDraftLoaded) {
      return;
    }
    
    if (Object.keys(formData).length > 0 || familyMembers.length > 0 || deceasedMembers.length > 0) {
      // Crear estructura de borrador con datos organizados
      const draftStructuredData = transformFormDataToSurveySession(
        formData,
        familyMembers,
        deceasedMembers,
        configurationData
      );
      
      // Actualizar metadata del borrador
      draftStructuredData.metadata.completed = false;
      draftStructuredData.metadata.currentStage = currentStage;
      
      // Guardar borrador solo con nueva estructura
      saveSurveyToLocalStorage(draftStructuredData, 'parish-survey-draft');
    }
  }, [currentStage, formData, familyMembers, deceasedMembers, configurationData, isSubmittedSuccessfully, isDraftLoaded]);

  // Cargar borrador al iniciar (nueva estructura)
  useEffect(() => {
    // Si estamos en modo edición, no cargar el borrador general
    if (surveyId) {
      setIsDraftLoaded(true);
      return;
    }

    const draft = localStorage.getItem('parish-survey-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        
        // Verificar si es la nueva estructura (tiene metadata y versión)
        if (draftData.metadata && draftData.informacionGeneral) {
          // Nueva estructura SurveySessionData
          setCurrentStage(draftData.metadata.currentStage || 1);
          
          // Convertir estructura nueva a formato del formulario actual
          const legacyFormData: Record<string, any> = {
            municipio: draftData.informacionGeneral.municipio?.id?.toString() || '',
            parroquia: draftData.informacionGeneral.parroquia?.id?.toString() || '',
            sector: draftData.informacionGeneral.sector?.id?.toString() || '',
            vereda: draftData.informacionGeneral.vereda?.id?.toString() || '',
            corregimiento: draftData.informacionGeneral.corregimiento?.id?.toString() || '',
            centro_poblado: draftData.informacionGeneral.centro_poblado?.id?.toString() || '',
            // Guardar también los datos completos para usarlos en el transformador
            // ⭐ IMPORTANTE: Normalizar para asegurar IDs numéricos (migración de datos antiguos)
            sector_data: normalizeConfigurationItem(draftData.informacionGeneral.sector),
            vereda_data: normalizeConfigurationItem(draftData.informacionGeneral.vereda),
            corregimiento_data: normalizeConfigurationItem(draftData.informacionGeneral.corregimiento),
            centro_poblado_data: normalizeConfigurationItem(draftData.informacionGeneral.centro_poblado),
            fecha: draftData.informacionGeneral.fecha ? new Date(draftData.informacionGeneral.fecha) : null,
            apellido_familiar: draftData.informacionGeneral.apellido_familiar,
            direccion: draftData.informacionGeneral.direccion,
            telefono: draftData.informacionGeneral.telefono,
            numero_contrato_epm: draftData.informacionGeneral.numero_contrato_epm,
            tipo_vivienda: draftData.vivienda.tipo_vivienda?.id?.toString() || '',
            // 🔄 NUEVO: Convertir DynamicSelectionMap de vuelta a array de IDs
            disposicion_basura: convertSelectionMapToIds(draftData.vivienda.disposicion_basuras || {}),
            sistema_acueducto: draftData.servicios_agua.sistema_acueducto?.id?.toString() || '',
            // 🔄 NUEVO: Convertir DynamicSelectionMap de vuelta a array de IDs
            aguas_residuales: convertSelectionMapToIds(draftData.servicios_agua.aguas_residuales || {}),
            sustento_familia: draftData.observaciones.sustento_familia,
            observaciones_encuestador: draftData.observaciones.observaciones_encuestador,
            autorizacion_datos: draftData.observaciones.autorizacion_datos,
          };
          
          setFormData(legacyFormData);
          
          // Convertir fechas en miembros de familia
          const familyMembersWithDates = (draftData.familyMembers || []).map((member: any) => ({
            ...member,
            fechaNacimiento: member.fechaNacimiento ? new Date(member.fechaNacimiento) : null
          }));
          setFamilyMembers(familyMembersWithDates);
          
          // Convertir fechas en difuntos
          const deceasedMembersWithDates = (draftData.deceasedMembers || []).map((member: any) => ({
            ...member,
            fechaFallecimiento: member.fechaFallecimiento ? new Date(member.fechaFallecimiento) : null
          }));
          setDeceasedMembers(deceasedMembersWithDates);
        } else {
          // Estructura legacy (por compatibilidad temporal)
          const { stage, data, familyMembers: savedFamilyMembers, deceasedMembers: savedDeceasedMembers } = draftData;
          setCurrentStage(stage);
          
          // Asegurar que la fecha sea un objeto Date si existe
          if (data && data.fecha && typeof data.fecha === 'string') {
            data.fecha = new Date(data.fecha);
          }
          
          setFormData(data);
          
          if (savedFamilyMembers) {
            const familyMembersWithDates = savedFamilyMembers.map((member: any) => ({
              ...member,
              fechaNacimiento: member.fechaNacimiento ? new Date(member.fechaNacimiento) : null
            }));
            setFamilyMembers(familyMembersWithDates);
          }
          
          if (savedDeceasedMembers) {
            const deceasedMembersWithDates = savedDeceasedMembers.map((member: any) => ({
              ...member,
              fechaFallecimiento: member.fechaFallecimiento ? new Date(member.fechaFallecimiento) : null
            }));
            setDeceasedMembers(deceasedMembersWithDates);
          }
        }

        toast({
          title: "Borrador recuperado",
          description: "Se ha recuperado un borrador guardado anteriormente.",
        });
      } catch (error) {
        console.error('Error al cargar borrador:', error);
        // Si hay error, limpiar el borrador corrupto
        localStorage.removeItem('parish-survey-draft');
      }
    }
    setIsDraftLoaded(true);
  }, [surveyId]);

  // Cargar encuesta existente si estamos en modo edición
  useEffect(() => {
    const loadEncuestaForEdit = async () => {
      if (!surveyId) {
        setIsEditMode(false);
        return;
      }

      setIsEditMode(true);
      setIsLoadingEncuesta(true);

      try {
        const response = await encuestasService.getEncuestaById(surveyId);
        
        if (!response.data) {
          throw new Error('No se encontraron datos de la encuesta');
        }

        const encuesta = response.data;

        // 🔄 Transformar datos de la API al formato del formulario
        const transformedData = transformEncuestaToFormData(encuesta);
        
        // Validar que los datos transformados sean válidos
        if (!validateTransformedData(transformedData)) {
          throw new Error('Los datos de la encuesta están incompletos o son inválidos');
        }

        // ✅ Cargar datos transformados al estado del formulario
        setFormData(transformedData.formData);
        setFamilyMembers(transformedData.familyMembers);
        setDeceasedMembers(transformedData.deceasedMembers);

        toast({
          title: "✅ Encuesta cargada",
          description: `Encuesta "${encuesta.apellido_familiar}" lista para editar. ${transformedData.familyMembers.length} miembros de familia, ${transformedData.deceasedMembers.length} difuntos.`,
          variant: "default"
        });

      } catch (error: any) {
        console.error('❌ Error al cargar encuesta para editar:', error);
        toast({
          title: "Error al cargar encuesta",
          description: error.message || "No se pudo cargar la encuesta para editar",
          variant: "destructive"
        });
        
        // Redirigir al listado si no se puede cargar
        setTimeout(() => navigate('/surveys'), 2000);
      } finally {
        setIsLoadingEncuesta(false);
      }
    };

    loadEncuestaForEdit();
  }, [surveyId]); // Solo ejecutar cuando cambia surveyId

  // Asegurar que el campo 'fecha' siempre tenga la fecha actual si no hay una
  useEffect(() => {
    setFormData(prev => {
      if (prev.fecha) return prev;
      return {
        ...prev,
        fecha: new Date()
      };
    });
  }, []);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [fieldId]: value
      };

      // Si se cambia el municipio, limpiar campos dependientes
      if (fieldId === 'municipio') {
        updated.parroquia = '';
        updated.vereda = '';
        updated.vereda_data = null;
        updated.corregimiento = '';
        updated.corregimiento_data = null;
        updated.centro_poblado = '';
        updated.centro_poblado_data = null;
      }

      // Para campos dinámicos, guardar también el objeto completo {id, nombre}
      // ⭐ IMPORTANTE: Convertir IDs a número para cumplir con contrato de API
      if (fieldId === 'sector') {
        // Sector viene de configurationData
        const sectorObj = configurationData.sectorOptions.find(opt => opt.value === value);
        if (sectorObj) {
          const numericId = parseInt(sectorObj.value, 10);
          updated.sector_data = { 
            id: isNaN(numericId) ? 0 : numericId, 
            nombre: sectorObj.label 
          };
        } else {
          updated.sector_data = null;
        }
      } else if (fieldId === 'vereda') {
        // Vereda es dinámico basado en municipio
        const veredaObj = dinamicVeredaOptions.find(opt => opt.value === value);
        if (veredaObj) {
          const numericId = parseInt(veredaObj.value, 10);
          updated.vereda_data = { 
            id: isNaN(numericId) ? 0 : numericId, 
            nombre: veredaObj.label 
          };
        } else {
          updated.vereda_data = null;
        }
      } else if (fieldId === 'corregimiento') {
        // Corregimiento es dinámico basado en municipio
        const corregimientoObj = dinamicCorregimientoOptions.find(opt => opt.value === value);
        if (corregimientoObj) {
          const numericId = parseInt(corregimientoObj.value, 10);
          updated.corregimiento_data = { 
            id: isNaN(numericId) ? 0 : numericId, 
            nombre: corregimientoObj.label 
          };
        } else {
          updated.corregimiento_data = null;
        }
      } else if (fieldId === 'centro_poblado') {
        // Centro poblado es dinámico basado en municipio
        const centroPobladoObj = dinamicCentroPobladoOptions.find(opt => opt.value === value);
        if (centroPobladoObj) {
          const numericId = parseInt(centroPobladoObj.value, 10);
          updated.centro_poblado_data = { 
            id: isNaN(numericId) ? 0 : numericId, 
            nombre: centroPobladoObj.label 
          };
        } else {
          updated.centro_poblado_data = null;
        }
      }
      // 🔄 NUEVO: disposicion_basura y aguas_residuales ahora son arrays de IDs directos
      // No necesitan conversión adicional, los valores ya vienen como array de IDs

      return updated;
    });
  };

  // Función para limpiar borrador del localStorage
  const handleClearDraft = () => {
    try {
      // ✅ Marcar como enviado exitosamente para evitar guardado automático
      setIsSubmittedSuccessfully(true);
      
      // Limpiar borrador del localStorage
      localStorage.removeItem('parish-survey-draft');
      
      // Resetear estado del formulario
      setFormData({});
      setFamilyMembers([]);
      setDeceasedMembers([]);
      setCurrentStage(1);
      
      // Establecer fecha actual nuevamente
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          fecha: new Date()
        }));
      }, 0);

      toast({
        title: "✅ Borrador eliminado",
        description: "El borrador ha sido eliminado completamente del almacenamiento local.",
        variant: "default"
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error al limpiar borrador:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo eliminar el borrador del almacenamiento local.",
        variant: "destructive"
      });
    }
  };

  // Función para cancelar la edición y regresar al listado
  const handleCancelEdit = () => {
    toast({
      title: "Edición cancelada",
      description: "Los cambios no guardados se han descartado.",
      variant: "default"
    });
    
    // Redirigir al listado de encuestas
    navigate('/surveys');
  };

  const handleNext = () => {
    // Validar campos requeridos de la etapa actual
    if (currentStageData?.fields) {
      const requiredFields = currentStageData.fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => {
        const value = formData[field.id];
        // Validación mejorada para manejar strings, dates y otros tipos
        if (field.type === 'date') {
          return !value || (!(value instanceof Date) && (!value || value.toString().trim() === ''));
        }
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingFields.length > 0) {
        toast({
          title: "Campos requeridos",
          description: `Por favor complete: ${missingFields.map(f => f.label).join(', ')}`,
          variant: "destructive"
        });
        return;
      }
    }

    // Validar etapa de información familiar
    if (currentStage === 4 && familyMembers.length === 0) {
      toast({
        title: "Información familiar requerida",
        description: "Debe agregar al menos un miembro de la familia",
        variant: "destructive"
      });
      return;
    }

    // Validar que al menos un familiar tenga un rol de liderazgo/responsabilidad (Cabeza de Hogar, Jefe, Líder, etc.)
    if (currentStage === 4 && familyMembers.length > 0) {
      if (!hasLeadershipFamilyMember(familyMembers)) {
        toast({
          title: "Rol de liderazgo requerido",
          description: getLeadershipMessage(),
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStage < formStages.length) {
      setCurrentStage(currentStage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    // Verificar que el usuario haya marcado la autorización de datos
    if (formData.autorizacion_datos !== true) {
      toast({
        title: "Autorización Requerida",
        description: "Debes aceptar la autorización de tratamiento de datos personales antes de enviar la encuesta.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transformar datos del formulario actual a estructura organizada por sesiones
      const structuredSurveyData = transformFormDataToSurveySession(
        formData,
        familyMembers,
        deceasedMembers,
        configurationData
      );

      // Marcar como completado
      structuredSurveyData.metadata.completed = true;
      structuredSurveyData.metadata.currentStage = formStages.length;

      // Guardar con nueva estructura en localStorage antes del envío
      saveSurveyToLocalStorage(structuredSurveyData, 'parish-survey-completed');
      
      // **DECIDIR SI CREAR O ACTUALIZAR SEGÚN EL MODO**
      let response;
      if (isEditMode && surveyId) {
        // Modo edición - actualizar encuesta existente
        response = await SurveySubmissionService.updateSurvey(surveyId, structuredSurveyData);
      } else {
        // Modo creación - crear nueva encuesta
        response = await SurveySubmissionService.submitSurvey(structuredSurveyData);
      }
      
      if (response.success) {
        
        // ✅ Marcar como enviado exitosamente para evitar guardado automático
        setIsSubmittedSuccessfully(true);
        
        // 🧹 Limpiar TODOS los borradores del localStorage tras envío exitoso
        SurveySubmissionService.clearStorageAfterSubmission();
        
        // 🧹 Limpiar también el estado del formulario para evitar re-guardado
        setFormData({});
        setFamilyMembers([]);
        setDeceasedMembers([]);

        // 🔄 Invalida las queries de encuestas para que se refresquen en el listado
        // Usamos refetchType: 'all' para asegurar que se recarguen incluso si no están activas
        await queryClient.invalidateQueries({ 
          queryKey: ENCUESTAS_QUERY_KEYS.all,
          exact: false,
          refetchType: 'all'
        });
        
        toast({
          title: isEditMode ? "✅ Encuesta actualizada" : "✅ Encuesta creada exitosamente",
          description: `${response.message} ${response.surveyId ? `(ID: ${response.surveyId})` : ''}. Redirigiendo a la lista de encuestas...`,
          variant: "default"
        });

        // ✅ Redirigir a la vista de encuestas después de un breve momento
        setTimeout(() => {
          navigate('/surveys');
        }, 2000);
        
      } else {
        console.error('❌ Error en el envío:', response);
        
        // Mostrar error con detalles estructurados si están disponibles
        const errorTitle = response.errorDetails?.code 
          ? `❌ ${response.errorDetails.code.replace(/_/g, ' ')}`
          : "❌ Error al enviar al servidor";
        
        const errorDescription = response.errorDetails
          ? `${response.message}\n\nLos datos se guardaron localmente.`
          : `${response.message} - Los datos se guardaron localmente.`;
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive"
        });
        
        // Log adicional para debugging si hay detalles de error
        if (response.errorDetails) {
          console.error('🔴 Detalles del error:', {
            code: response.errorDetails.code,
            catalog: response.errorDetails.catalog,
            invalidId: response.errorDetails.invalidId,
            person: response.errorDetails.person,
            suggestion: response.errorDetails.suggestion
          });
        }
      }
      
    } catch (error) {
      console.error('❌ Error inesperado durante el envío:', error);
      toast({
        title: "❌ Error inesperado",
        description: "Hubo un problema durante el envío. Los datos se guardaron localmente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentStageData) return null;

  // ============================================================
  // FUNCIÓN HELPER: Obtener opciones de autocomplete con lógica especial para Parroquia y Vereda
  // ============================================================
  const getFieldAutocompleteOptions = (field: any) => {
    // Si es el campo de parroquia y hay un municipio seleccionado, usar opciones dinámicas
    if (field.id === 'parroquia' && hasSelectedMunicipio) {
      return dinamicParroquiaOptions;
    }
    // Si es el campo de parroquia pero NO hay municipio seleccionado, retornar vacío
    if (field.id === 'parroquia' && !hasSelectedMunicipio) {
      return [];
    }
    // Si es el campo de vereda y hay un municipio seleccionado, usar opciones dinámicas
    if (field.id === 'vereda' && hasSelectedMunicipioForVeredas) {
      return dinamicVeredaOptions;
    }
    // Si es el campo de vereda pero NO hay municipio seleccionado, retornar vacío
    if (field.id === 'vereda' && !hasSelectedMunicipioForVeredas) {
      return [];
    }
    // Si es el campo de corregimiento y hay un municipio seleccionado, retornar opciones dinámicas
    if (field.id === 'corregimiento' && formData?.municipio) {
      return dinamicCorregimientoOptions;
    }
    // Si es el campo de centro poblado y hay un municipio seleccionado, retornar opciones dinámicas
    if (field.id === 'centro_poblado' && formData?.municipio) {
      return dinamicCentroPobladoOptions;
    }
    // Para otros campos, usar la configuración normal
    return getAutocompleteOptions(field, configurationData);
  };

  // FUNCIÓN HELPER: Obtener estado de loading con lógica especial para Parroquia, Vereda, Corregimiento y Centro Poblado
  const getFieldLoadingState = (field: any) => {
    // Si es el campo de parroquia y hay un municipio seleccionado, mostrar loading dinámico
    if (field.id === 'parroquia' && hasSelectedMunicipio) {
      return parroquiasLoading;
    }
    // Si es el campo de vereda y hay un municipio seleccionado, mostrar loading dinámico
    if (field.id === 'vereda' && hasSelectedMunicipioForVeredas) {
      return veredasLoading;
    }
    // Si es el campo de corregimiento y hay un municipio seleccionado, mostrar loading dinámico
    if (field.id === 'corregimiento' && formData?.municipio) {
      return corregimientosLoading;
    }
    // Si es el campo de centro poblado y hay un municipio seleccionado, mostrar loading dinámico
    if (field.id === 'centro_poblado' && formData?.municipio) {
      return centrosPobladosLoading;
    }
    // Para otros campos, usar la configuración normal
    return getLoadingState(field, configurationData);
  };

  // FUNCIÓN HELPER: Obtener estado de error con lógica especial para Parroquia, Vereda, Corregimiento y Centro Poblado
  const getFieldErrorState = (field: any) => {
    // Si es el campo de parroquia y hay un municipio seleccionado, mostrar error dinámico
    if (field.id === 'parroquia' && hasSelectedMunicipio) {
      return parroquiasError;
    }
    // Si es el campo de vereda y hay un municipio seleccionado, mostrar error dinámico
    if (field.id === 'vereda' && hasSelectedMunicipioForVeredas) {
      return veredasError;
    }
    // Si es el campo de corregimiento y hay un municipio seleccionado, mostrar error dinámico
    if (field.id === 'corregimiento' && formData?.municipio) {
      return corregimientosError;
    }
    // Si es el campo de centro poblado y hay un municipio seleccionado, mostrar error dinámico
    if (field.id === 'centro_poblado' && formData?.municipio) {
      return centrosPobladosError;
    }
    // Para otros campos, usar la configuración normal
    return getErrorState(field, configurationData);
  };

  // Mostrar skeleton completo mientras cargan los datos de configuración o la encuesta para editar
  if (configurationData.isAnyLoading || isLoadingEncuesta) {
    return <SurveyFormSkeleton />;
  }

  // Mostrar errores críticos que impiden el uso del formulario
  if (configurationData.hasAnyError) {
    const hasCriticalErrors = !!(
      configurationData.municipiosError || 
      configurationData.parroquiasError || 
      configurationData.sectoresError
    );

    if (hasCriticalErrors) {
      return (
        <div className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8 bg-background min-h-screen">
          <FormDataLoadingError 
            configurationData={configurationData}
            onRetryAll={() => window.location.reload()}
            criticalOnly={false}
          />
        </div>
      );
    }
  }

  return (
    <div 
      className="w-full max-w-[98%] 2xl:max-w-[96%] mx-auto px-3 lg:px-6 py-6 lg:py-8 bg-background dark:bg-background min-h-screen"
      data-testid="survey-form-container"
    >
      {/* Header con progreso usando componente refactorizado */}
      <SurveyHeader 
        title={isEditMode ? `Editar Encuesta #${surveyId}` : "Caracterización Poblacional"}
        description={`Etapa ${currentStage} de ${formStages.length}: ${currentStageData.title}`}
        progress={progress}
        currentStage={currentStage}
        formStages={formStages}
      />

      {/* Botón para limpiar borrador - Solo visible en modo creación */}
      {!isEditMode && (
        <div className="mb-6 flex justify-end" data-testid="draft-actions-container">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                data-testid="clear-draft-button"
                id="clear-draft-button"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar Borrador
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  ¿Eliminar borrador?
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold">Esta acción eliminará permanentemente:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Todos los datos ingresados en el formulario</li>
                      <li>Información de familia agregada</li>
                      <li>Información de difuntos agregada</li>
                      <li>El progreso actual de la encuesta</li>
                    </ul>
                    <p className="font-bold text-destructive mt-3">
                      ⚠️ Esta acción no se puede deshacer. El borrador no podrá ser recuperado.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="cancel-clear-draft-button">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearDraft}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-testid="confirm-clear-draft-button"
                >
                  Sí, eliminar borrador
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Botón para cancelar edición - Solo visible en modo edición */}
      {isEditMode && (
        <div className="mb-6 flex justify-between items-center" data-testid="edit-mode-actions-container">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                data-testid="cancel-edit-button"
                id="cancel-edit-button"
              >
                <X className="h-4 w-4" />
                Cancelar Edición
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  ¿Cancelar edición?
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold">Si cancelas la edición:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Los cambios realizados se perderán</li>
                      <li>La encuesta mantendrá sus datos originales</li>
                      <li>Serás redirigido al listado de encuestas</li>
                    </ul>
                    <p className="font-bold text-amber-600 dark:text-amber-500 mt-3">
                      ⚠️ Los cambios no guardados se descartarán.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="cancel-edit-cancel-button">Continuar editando</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelEdit}
                  className="bg-muted text-muted-foreground hover:bg-muted/90"
                  data-testid="confirm-cancel-edit-button"
                >
                  Sí, cancelar edición
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
              data-testid="edit-mode-badge"
            >
              📝 Modo Edición
            </Badge>
            <span className="text-sm text-muted-foreground font-medium" data-testid="edit-survey-id">
              ID: <span className="font-mono">{surveyId}</span>
            </span>
          </div>
        </div>
      )}

      {/* Mostrar advertencias para errores no críticos */}
      {configurationData.hasAnyError && (
        <FormDataLoadingError 
          configurationData={configurationData}
          onRetryAll={() => window.location.reload()}
          criticalOnly={false}
          className="mb-6"
        />
      )}

      {/* Formulario actual con Tailwind CSS compatible con tema oscuro */}
      <Card 
        className="shadow-lg border-border rounded-xl bg-card dark:bg-card dark:border-border"
        data-testid={`survey-stage-${currentStage}-card`}
        id={`survey-stage-${currentStage}`}
      >
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-xl border-b border-border dark:border-border">
          <CardTitle className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg"
              data-testid={`stage-indicator-${currentStage}`}
            >
              {currentStage}
            </div>
            <span 
              className="text-2xl font-bold text-foreground dark:text-foreground"
              data-testid="stage-title"
            >
              {currentStageData.title}
            </span>
          </CardTitle>
          <CardDescription 
            className="text-base text-muted-foreground pl-14 font-medium dark:text-muted-foreground"
            data-testid="stage-description"
          >
            {currentStageData.description}
          </CardDescription>
        </CardHeader>
        <ErrorBoundary 
          variant="component" 
          resetKeys={[currentStage]}
          className="border-0 shadow-none bg-transparent"
        >
          <CardContent className="space-y-4 p-3 sm:space-y-6 sm:p-6">
            {currentStageData.type === 'family_grid' ? (
              <FamilyGrid 
                familyMembers={familyMembers}
                setFamilyMembers={setFamilyMembers}
              />
            ) : currentStageData.type === 'deceased_grid' ? (
              <DeceasedGrid 
                deceasedMembers={deceasedMembers}
                setDeceasedMembers={setDeceasedMembers}
              />
            ) : (
              currentStageData.fields?.map((field) => (
                <div 
                  key={field.id} 
                  className="sm:p-4 sm:bg-muted/50 sm:rounded-xl sm:border sm:border-border sm:hover:border-ring sm:hover:shadow-sm sm:transition-all sm:duration-200 sm:dark:bg-muted/50 sm:dark:border-border sm:dark:hover:border-ring"
                  data-testid={`field-container-${field.id}`}
                >
                  {field.id === "autorizacion_datos" ? (
                    <DataProtectionCheckbox
                      checked={formData[field.id] === true}
                      onCheckedChange={(value) => handleFieldChange(field.id, value)}
                      onOpenModal={() => setShowDataProtectionModal(true)}
                      hasAcceptedTerms={hasAcceptedDataProtection}
                    />
                  ) : (
                    <StandardFormField
                      field={field}
                      value={formData[field.id]}
                      onChange={handleFieldChange}
                      autocompleteOptions={getFieldAutocompleteOptions(field)}
                      isLoading={getFieldLoadingState(field)}
                      error={getFieldErrorState(field)}
                    />
                  )}
                </div>
              ))
            )}
          </CardContent>
        </ErrorBoundary>
      </Card>

      {/* Controles de navegación */}
      <SurveyControls 
        currentStage={currentStage}
        totalStages={formStages.length}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />

      {/* Modal de Protección de Datos */}
      <DataProtectionModal
        open={showDataProtectionModal}
        onOpenChange={setShowDataProtectionModal}
        onAccept={() => {
          setHasAcceptedDataProtection(true);
          setShowDataProtectionModal(false);
        }}
        isRequired={true}
      />

      {/* Storage debugger component was removed during cleanup */}
    </div>
  );
};

export default SurveyForm;