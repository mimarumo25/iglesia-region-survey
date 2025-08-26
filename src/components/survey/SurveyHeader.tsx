import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FormStage {
  id: number;
  title: string;
  description: string;
}

interface SurveyHeaderProps {
  title: string;
  description: string;
  progress: number;
  currentStage: number;
  formStages: FormStage[];
}

const SurveyHeader = ({ title, description, progress, currentStage, formStages }: SurveyHeaderProps) => {
  return (
    <Card className="mb-6 lg:mb-8 shadow-lg border-border rounded-xl bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/30">
      <CardHeader className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1 animate-fade-in-left">
            <CardTitle className="text-xl lg:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
              {title}
            </CardTitle>
            <CardDescription className="text-sm lg:text-base mt-1 text-muted-foreground font-medium">
              {description}
            </CardDescription>
          </div>
          <div className="text-sm font-semibold flex-shrink-0 bg-muted text-foreground px-4 py-2 rounded-full border border-border shadow-sm">
            {Math.round(progress)}% completado
          </div>
        </div>
        
        {/* Indicador de etapas con Tailwind CSS */}
        <div className="flex items-center gap-2 mb-4 p-4 bg-muted/50 rounded-lg border border-border shadow-inner">
          {formStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                stage.id < currentStage 
                  ? 'bg-green-500 text-white shadow-lg scale-105' : 
                stage.id === currentStage 
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg' : 
                  'bg-muted text-muted-foreground border-2 border-border'
              }`}>
                {stage.id < currentStage ? '✓' : stage.id}
              </div>
              <div className="flex-1 text-center px-2">
                <div className={`text-xs font-semibold transition-colors duration-300 ${
                  stage.id === currentStage ? 'text-primary' : 
                  stage.id < currentStage ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                }`}>
                  {stage.title}
                </div>
              </div>
              {index < formStages.length - 1 && (
                <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  stage.id < currentStage 
                    ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-sm' 
                    : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Barra de progreso con bordes redondeados y Tailwind CSS */}
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-3 bg-muted border-2 border-border rounded-full overflow-hidden shadow-inner"
          />
          <div 
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-primary to-primary/80 shadow-md"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
    </Card>
  );
};

export default SurveyHeader;
