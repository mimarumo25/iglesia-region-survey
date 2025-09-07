/**
 * Página de demostración de validaciones
 * 
 * Esta página demuestra las nuevas validaciones de teléfono y email
 * implementadas en el sistema MIA.
 */

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { EmailInput } from "@/components/ui/email-input";
import { ConfigFormFieldWithValidation } from "@/components/ui/config-form-field-enhanced";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { phoneValidationSchema, emailValidationSchema } from "@/utils/validationHelpers";
// Removed test import - testing utilities were cleaned up
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Esquema para la demo
const demoSchema = z.object({
  telefono: phoneValidationSchema,
  email: emailValidationSchema,
  nombre: z.string().min(1, "El nombre es requerido"),
});

type DemoFormData = z.infer<typeof demoSchema>;

const ValidationDemoPage = () => {
  const { toast } = useToast();
  const [standalonePhone, setStandalonePhone] = useState("");
  const [standaloneEmail, setStandaloneEmail] = useState("");
  
  // Formulario con validación Zod
  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      telefono: "",
      email: "",
      nombre: "",
    },
  });

  const onSubmit = (data: DemoFormData) => {
    toast({
      title: "✅ Formulario válido",
      description: `Datos: ${JSON.stringify(data, null, 2)}`,
    });
  };

  const runTests = () => {
    // Test functionality was removed during cleanup
    toast({
      title: "🧪 Tests no disponibles",
      description: "Las utilidades de testing fueron removidas durante la limpieza del proyecto",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Demostración de Validaciones</h1>
        <p className="text-muted-foreground">
          Validación en tiempo real para teléfonos colombianos y emails
        </p>
      </div>

      {/* Información sobre las validaciones */}
      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Criterios de Validación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">📱 Teléfonos Colombianos:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Teléfonos fijos: 7 dígitos (ej: 123-4567)</li>
              <li>• Celulares: 10 dígitos que empiecen con 3 (ej: 300-123-4567)</li>
              <li>• Formatos permitidos: números, espacios, guiones, paréntesis</li>
              <li>• Formateo automático al perder el foco</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-semibold text-sm mb-2">📧 Emails:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Formato estándar: usuario@dominio.com</li>
              <li>• No puntos consecutivos o al inicio/final</li>
              <li>• Longitud máxima: 254 caracteres</li>
              <li>• Validación en tiempo real</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Demostración de componentes standalone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Componente PhoneInput</CardTitle>
            <CardDescription>
              Componente especializado para teléfonos colombianos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PhoneInput
              value={standalonePhone}
              onChange={setStandalonePhone}
              placeholder="Ingresa un teléfono"
            />
            
            <div className="text-sm">
              <Badge variant={standalonePhone ? "default" : "secondary"}>
                Valor: {standalonePhone || "vacío"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium">Ejemplos para probar:</p>
              <div className="flex flex-wrap gap-1">
                {["3001234567", "123-4567", "300 123 4567", "invalid", "2001234567"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setStandalonePhone(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Componente EmailInput</CardTitle>
            <CardDescription>
              Componente especializado para direcciones de email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EmailInput
              value={standaloneEmail}
              onChange={setStandaloneEmail}
              placeholder="Ingresa un email"
            />
            
            <div className="text-sm">
              <Badge variant={standaloneEmail ? "default" : "secondary"}>
                Valor: {standaloneEmail || "vacío"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium">Ejemplos para probar:</p>
              <div className="flex flex-wrap gap-1">
                {["test@example.com", "invalid-email", "@example.com", "user..name@example.com"].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => setStandaloneEmail(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demostración con React Hook Form + Zod */}
      <Card>
        <CardHeader>
          <CardTitle>Formulario con Validación Zod</CardTitle>
          <CardDescription>
            Ejemplo de uso con React Hook Form y validación Zod
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ConfigFormFieldWithValidation
                id="nombre"
                label="Nombre"
                type="text"
                value={form.watch("nombre") || ""}
                onChange={(value) => form.setValue("nombre", value)}
                placeholder="Ingresa tu nombre"
                required
              />
              
              <ConfigFormFieldWithValidation
                id="telefono"
                label="Teléfono"
                type="phone"
                value={form.watch("telefono") || ""}
                onChange={(value) => form.setValue("telefono", value)}
                placeholder="Ingresa tu teléfono"
              />
              
              <ConfigFormFieldWithValidation
                id="email"
                label="Email"
                type="email"
                value={form.watch("email") || ""}
                onChange={(value) => form.setValue("email", value)}
                placeholder="Ingresa tu email"
              />
            </div>

            {/* Mostrar errores de validación */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">Errores de validación:</span>
                </div>
                <ul className="text-sm text-red-600 space-y-1">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>• {field}: {error.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={!form.formState.isValid}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Enviar Formulario
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => form.reset()}
              >
                Limpiar
              </Button>
              
              <Button 
                type="button" 
                variant="secondary"
                onClick={runTests}
              >
                Ejecutar Pruebas
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Estadísticas del formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Formulario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {form.formState.isValid ? "✓" : "✗"}
              </div>
              <div className="text-xs text-muted-foreground">Válido</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {form.formState.touchedFields ? Object.keys(form.formState.touchedFields).length : 0}
              </div>
              <div className="text-xs text-muted-foreground">Campos tocados</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-red-600">
                {Object.keys(form.formState.errors).length}
              </div>
              <div className="text-xs text-muted-foreground">Errores</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {form.formState.isSubmitting ? "Sí" : "No"}
              </div>
              <div className="text-xs text-muted-foreground">Enviando</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationDemoPage;
