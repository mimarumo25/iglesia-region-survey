import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  showServices?: boolean;
  variant?: "compact" | "detailed";
}

/**
 * Componente de loading skeleton moderno para mostrar durante la carga de servicios
 * Muestra un skeleton atractivo en lugar del texto "Cargando datos de configuración..."
 */
export const LoadingSkeleton = ({ 
  className, 
  showServices = true,
  variant = "detailed" 
}: LoadingSkeletonProps) => {
  if (variant === "compact") {
    return (
      <Card className={cn("mb-6 border-primary/10 bg-primary/5", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Spinner skeleton */}
            <Skeleton className="w-4 h-4 rounded-full" />
            
            {/* Text skeleton */}
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-48" />
              {showServices && (
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-18" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "mb-6 border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5",
      className
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header con indicador de carga */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
            
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>

          {/* Servicios skeleton */}
          {showServices && (
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {[
                  "Sectores",
                  "Parroquias", 
                  "Municipios",
                  "Tipos de Vivienda",
                  "Disposición de Basura",
                  "Aguas Residuales",
                  "Tipos de Identificación",
                  "Parentescos"
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress bar skeleton */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton simple para formularios
 */
export const FormSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Form fields skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
      ))}
      
      {/* Buttons skeleton */}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

/**
 * Skeleton para tablas de datos
 */
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string;
}) => {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Table header */}
          <div className="flex gap-4 pb-3 border-b border-muted">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 py-2">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton completo para el formulario de encuestas
 * Reemplaza toda la interfaz del SurveyForm durante la carga
 */
export const SurveyFormSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8 bg-background dark:bg-background min-h-screen", className)}>
      {/* Header Skeleton */}
      <div className="space-y-4 mb-6">
        {/* Title and description */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse" style={{ width: '25%' }} />
          </div>
        </div>

        {/* Stage indicators */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              {i < 5 && <Skeleton className="w-8 h-0.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card Skeleton */}
      <Card className="shadow-lg border-border rounded-xl bg-card dark:bg-card dark:border-border mb-6">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-xl border-b border-border dark:border-border p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="pl-13">
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        {/* Card Content - Form Fields */}
        <CardContent className="space-y-6 p-6">
          {/* Simular 4-6 campos del formulario */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 bg-muted/50 rounded-xl border border-border">
              <div className="space-y-3">
                {/* Label */}
                <Skeleton className="h-4 w-32" />
                
                {/* Input field */}
                <Skeleton className="h-10 w-full" />
                
                {/* Optional helper text */}
                {Math.random() > 0.5 && (
                  <Skeleton className="h-3 w-48" />
                )}
              </div>
            </div>
          ))}

          {/* Simular una grilla de miembros de familia si es necesario */}
          {Math.random() > 0.7 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-24" />
              </div>
              
              {/* Table header */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-3 border-b border-border">
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((col) => (
                      <Skeleton key={col} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
                
                {/* Table rows */}
                {[1, 2, 3].map((row) => (
                  <div key={row} className="p-3 border-b border-border last:border-b-0">
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((col) => (
                        <Skeleton key={col} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls Skeleton */}
      <div className="flex justify-between items-center mt-8">
        <Skeleton className="h-10 w-24" /> {/* Previous button */}
        
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" /> {/* Save draft */}
          <Skeleton className="h-10 w-24" /> {/* Next/Submit button */}
        </div>
      </div>

      {/* Loading indicator con texto */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <div className="relative">
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;