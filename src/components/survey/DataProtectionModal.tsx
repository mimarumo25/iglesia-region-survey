import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface DataProtectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  isRequired?: boolean;
}

const DataProtectionModal = ({
  open,
  onOpenChange,
  onAccept,
  isRequired = true,
}: DataProtectionModalProps) => {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    // Calcular progreso
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(100, progress));
    // Se considera que llegó al final si está a menos de 20px del final
    const isAtEnd = scrollHeight - (scrollTop + clientHeight) < 20;
    setHasScrolledToEnd(isAtEnd);
  };

  // Reset cuando se abre/cierra el modal
  useEffect(() => {
    if (!open) {
      setHasAccepted(false);
      setHasScrolledToEnd(false);
    }
  }, [open]);

  const handleAccept = () => {
    if (hasAccepted && hasScrolledToEnd) {
      onAccept();
      onOpenChange(false);
    }
  };

  // Handler para cerrar el modal (solo si ya fue aceptado o después de scroll)
  const handleOpenChange = (newOpen: boolean) => {
    // Permitir cerrar siempre (con el botón X)
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 flex-1">
              <AlertCircle className="h-6 w-6 text-primary" />
              Autorización para Tratamiento de Datos Personales
            </DialogTitle>
            <div className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {Math.round(scrollProgress)}%
            </div>
          </div>
          <DialogDescription className="text-base mt-2">
            Por favor, lee y acepta los términos de tratamiento de datos antes de continuar
          </DialogDescription>
        </DialogHeader>

        {/* Barra de progreso de lectura */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div 
          ref={scrollAreaRef}
          className="flex-1 border rounded-lg p-6 bg-muted/50 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold text-lg mb-2">1. Responsable del Tratamiento</h3>
              <p className="text-sm text-muted-foreground">
                El responsable del tratamiento de tus datos personales es la Diócesis/Parroquia participante en esta encuesta. Garantizamos el cumplimiento de todas las normas vigentes en materia de protección de datos personales.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">2. Finalidad del Tratamiento</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Los datos personales que proporcionas serán utilizados exclusivamente para:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Realizar la caracterización poblacional de tu familia</li>
                <li>• Generar estadísticas diocesanas y parroquiales</li>
                <li>• Mejorar los servicios pastorales</li>
                <li>• Contacto pastoral cuando sea necesario</li>
                <li>• Análisis de datos para planificación pastoral</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. Datos Personales Recolectados</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Se recopilarán los siguientes datos:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Información de identificación personal (nombre, cédula, fecha de nacimiento)</li>
                <li>• Información de ubicación (dirección, municipio, parroquia)</li>
                <li>• Información familiar (composición, relaciones de parentesco)</li>
                <li>• Información socioeconómica (ocupación, nivel educativo)</li>
                <li>• Información de salud (enfermedades, discapacidades)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. Legitimación del Tratamiento</h3>
              <p className="text-sm text-muted-foreground">
                El tratamiento de tus datos se realiza con base en tu consentimiento expreso al completar esta encuesta, así como en el interés legítimo de la institución religiosa para desarrollar actividades pastorales y sociales.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Seguridad de los Datos</h3>
              <p className="text-sm text-muted-foreground">
                Implementamos medidas técnicas, administrativas y organizacionales apropiadas para proteger tus datos contra acceso no autorizado, alteración, pérdida o divulgación.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Derechos del Titular</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Tienes derecho a:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>• Acceder a tus datos personales</li>
                <li>• Solicitar la rectificación de datos incorrectos</li>
                <li>• Solicitar la eliminación de tus datos (derecho al olvido)</li>
                <li>• Limitar el tratamiento de tus datos</li>
                <li>• Oponerme al tratamiento de mis datos</li>
                <li>• Revocar tu consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">7. Duración del Almacenamiento</h3>
              <p className="text-sm text-muted-foreground">
                Los datos serán almacenados mientras sean necesarios para cumplir con la finalidad indicada, o por el período requerido por la ley. Transcurrido este tiempo, serán eliminados o anonimizados.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">8. Contacto y Reclamaciones</h3>
              <p className="text-sm text-muted-foreground">
                Si tienes preguntas sobre el tratamiento de tus datos o deseas ejercer tus derechos, contacta con la oficina de privacidad de la Diócesis. También tienes derecho a presentar una reclamación ante la autoridad competente en materia de protección de datos.
              </p>
            </section>

            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                Al completar esta encuesta, confirmas que has leído, entendido y aceptas estos términos de tratamiento de datos personales.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg border border-border">
            <Checkbox
              id="accept-terms"
              checked={hasAccepted}
              onCheckedChange={(checked) => setHasAccepted(checked as boolean)}
              disabled={!hasScrolledToEnd}
              className="mt-1"
            />
            <label
              htmlFor="accept-terms"
              className={`text-sm font-medium leading-relaxed flex-1 ${
                hasScrolledToEnd ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              Confirmo que he leído y acepto la{" "}
              <span className="font-semibold">Autorización para Tratamiento de Datos Personales</span>
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </label>
          </div>

          {!hasScrolledToEnd && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                Por favor, lee todo el contenido hasta el final para poder aceptar los términos.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {!isRequired && (
              <Button
                variant="outline"
                onClick={() => {
                  setHasAccepted(false);
                  onOpenChange(false);
                }}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={handleAccept}
              disabled={!hasAccepted || !hasScrolledToEnd}
              className={`flex-1 sm:flex-none ${
                hasAccepted && hasScrolledToEnd
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white`}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aceptar y Continuar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataProtectionModal;
