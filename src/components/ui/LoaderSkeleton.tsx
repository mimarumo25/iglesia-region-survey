import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/logo';

interface LoaderSkeletonProps {
  /** Tipo de carga para mostrar skeleton específico */
  type?: 'dashboard' | 'form' | 'table' | 'settings' | 'generic';
  /** Mensaje personalizado */
  message?: string;
  /** Mostrar logo */
  showLogo?: boolean;
  /** Clase adicional */
  className?: string;
  /** Animación reducida para mejor performance */
  reduceAnimation?: boolean;
}

/**
 * Skeleton para Dashboard
 */
const DashboardSkeleton = ({ reduceAnimation }: { reduceAnimation?: boolean }) => (
  <div className="p-6 space-y-6">
    {/* Header Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-32 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border",
            !reduceAnimation && "animate-pulse"
          )}
        />
      ))}
    </div>
    
    {/* Chart Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        className={cn(
          "h-80 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border",
          !reduceAnimation && "animate-pulse"
        )}
      />
      <div
        className={cn(
          "h-80 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border",
          !reduceAnimation && "animate-pulse"
        )}
      />
    </div>
  </div>
);

/**
 * Skeleton para Formularios
 */
const FormSkeleton = ({ reduceAnimation }: { reduceAnimation?: boolean }) => (
  <div className="p-6 max-w-2xl mx-auto space-y-6">
    <div className={cn("h-8 w-1/3 bg-muted rounded-lg", !reduceAnimation && "animate-pulse")} />
    
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className={cn("h-4 w-1/4 bg-muted/70 rounded", !reduceAnimation && "animate-pulse")} />
          <div className={cn("h-10 w-full bg-muted/50 rounded-lg", !reduceAnimation && "animate-pulse")} />
        </div>
      ))}
    </div>
    
    <div className="flex gap-3 pt-4">
      <div className={cn("h-10 w-24 bg-primary/30 rounded-lg", !reduceAnimation && "animate-pulse")} />
      <div className={cn("h-10 w-24 bg-muted/50 rounded-lg", !reduceAnimation && "animate-pulse")} />
    </div>
  </div>
);

/**
 * Skeleton para Tablas
 */
const TableSkeleton = ({ reduceAnimation }: { reduceAnimation?: boolean }) => (
  <div className="p-6 space-y-4">
    {/* Search bar */}
    <div className={cn("h-10 w-full max-w-sm bg-muted/50 rounded-lg", !reduceAnimation && "animate-pulse")} />
    
    {/* Table header */}
    <div className="border rounded-lg overflow-hidden">
      <div className={cn("h-12 bg-muted/30", !reduceAnimation && "animate-pulse")} />
      
      {/* Table rows */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-16 bg-gradient-to-r from-transparent via-muted/20 to-transparent border-t",
            !reduceAnimation && "animate-pulse"
          )}
        />
      ))}
    </div>
  </div>
);

/**
 * Skeleton para Settings
 */
const SettingsSkeleton = ({ reduceAnimation }: { reduceAnimation?: boolean }) => (
  <div className="p-6 space-y-6">
    <div className={cn("h-8 w-1/4 bg-muted rounded-lg", !reduceAnimation && "animate-pulse")} />
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-40 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border",
            !reduceAnimation && "animate-pulse"
          )}
        />
      ))}
    </div>
  </div>
);

/**
 * Componente de carga mejorado con skeletons específicos
 * que coinciden visualmente con el contenido esperado
 */
const LoaderSkeleton: React.FC<LoaderSkeletonProps> = ({
  type = 'generic',
  message = 'Cargando...',
  showLogo = true,
  className,
  reduceAnimation = false
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return <DashboardSkeleton reduceAnimation={reduceAnimation} />;
      case 'form':
        return <FormSkeleton reduceAnimation={reduceAnimation} />;
      case 'table':
        return <TableSkeleton reduceAnimation={reduceAnimation} />;
      case 'settings':
        return <SettingsSkeleton reduceAnimation={reduceAnimation} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            {showLogo && (
              <div className="mb-4">
                <Logo 
                  size="lg" 
                  showText={false} 
                  className={cn(
                    "w-16 h-16",
                    !reduceAnimation && "animate-pulse"
                  )} 
                />
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Loader2 className={cn(
                "w-6 h-6 text-primary",
                !reduceAnimation && "animate-spin"
              )} />
              <span className="text-muted-foreground font-medium">{message}</span>
              <Sparkles className={cn(
                "w-4 h-4 text-primary/60",
                !reduceAnimation && "animate-pulse"
              )} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "w-full transition-opacity duration-300",
      className
    )}>
      {renderSkeleton()}
    </div>
  );
};

export default LoaderSkeleton;
