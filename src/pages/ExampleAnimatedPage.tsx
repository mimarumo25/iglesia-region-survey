import React from 'react';
import { AnimatedElement, StaggeredList } from '@/components/ui/RouteTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, MapPin, FileText } from 'lucide-react';

/**
 * Ejemplo de página que utiliza las nuevas animaciones
 * para demostrar cómo eliminar el parpadeo en React.lazy
 */
const ExampleAnimatedPage: React.FC = () => {
  const stats = [
    {
      title: "Familias Registradas",
      value: "1,234",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Encuestas Completadas",
      value: "856",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Sectores Activos",
      value: "24",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Reportes Generados",
      value: "142",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header animado */}
      <AnimatedElement delay={0}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Dashboard con Transiciones Suaves
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Este es un ejemplo de cómo las transiciones eliminan el parpadeo en React.lazy
          </p>
        </div>
      </AnimatedElement>

      {/* Stats cards con animación escalonada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StaggeredList staggerDelay={100}>
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title} className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </StaggeredList>
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedElement delay={600}>
          <Card>
            <CardHeader>
              <CardTitle>Navegación Sin Parpadeo</CardTitle>
              <CardDescription>
                Gracias a las transiciones CSS y React useTransition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                El sistema implementado incluye:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Preloading inteligente con hover</li>
                <li>Skeletons específicos por tipo de página</li>
                <li>Transiciones CSS suaves</li>
                <li>Hook useTransition de React 18</li>
              </ul>
              <Button className="w-full">
                Explorar Funcionalidades
              </Button>
            </CardContent>
          </Card>
        </AnimatedElement>

        <AnimatedElement delay={700}>
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Optimizado</CardTitle>
              <CardDescription>
                Code splitting y lazy loading eficiente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Técnicas implementadas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>React.lazy() con Suspense mejorado</li>
                <li>Cache de componentes precargados</li>
                <li>Prevención de Layout Shift (CLS)</li>
                <li>Fallbacks inteligentes por ruta</li>
              </ul>
              <Button variant="outline" className="w-full">
                Ver Métricas
              </Button>
            </CardContent>
          </Card>
        </AnimatedElement>
      </div>

      {/* Footer animado */}
      <AnimatedElement delay={800}>
        <div className="text-center p-6 rounded-xl bg-muted/30">
          <p className="text-muted-foreground">
            🎉 ¡La navegación ahora es completamente fluida sin parpadeos!
          </p>
        </div>
      </AnimatedElement>
    </div>
  );
};

export default ExampleAnimatedPage;
