import { Button } from "@/components/ui/button";
import { Loader2, Send, Save } from "lucide-react";

interface SurveyControlsProps {
  currentStage: number;
  totalStages: number;
  isSubmitting: boolean;
  isEditMode?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const SurveyControls = ({
  currentStage,
  totalStages,
  isSubmitting,
  isEditMode = false,
  onPrevious,
  onNext,
  onSubmit,
}: SurveyControlsProps) => {
  return (
    <div className="mt-8 flex justify-between items-center" data-testid="survey-controls">
      <div>
        {currentStage > 1 && (
          <Button
            onClick={onPrevious}
            variant="outline"
            className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl px-6 py-2.5 font-semibold shadow-sm transition-all duration-200"
            data-testid="previous-stage-button"
            id="previous-stage-button"
          >
            Anterior
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        {currentStage < totalStages ? (
          <Button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-8 py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
            data-testid="next-stage-button"
            id="next-stage-button"
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl px-8 py-2.5 shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
            data-testid="submit-survey-button"
            id="submit-survey-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Actualizando...' : 'Enviando al servidor...'}
              </>
            ) : (
              <>
                {isEditMode ? (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar al Servidor
                  </>
                )}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SurveyControls;
