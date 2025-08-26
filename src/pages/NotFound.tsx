import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { AlertCircle, Home, Search, Sun, Moon } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const { currentTheme, isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    console.warn('404 — route not found:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-4xl">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-start justify-center space-y-4 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-10 h-10 text-destructive/90" />
              <h1 className="text-4xl font-extrabold">Página no encontrada</h1>
            </div>

            <p className="text-muted-foreground">
              La ruta <span className="font-mono bg-muted/10 px-2 py-0.5 rounded">{location.pathname}</span> no existe o se ha movido.
            </p>

            <p className="text-sm text-muted-foreground/80">
              Puedes volver al inicio o usar la búsqueda para localizar la sección que necesitas.
            </p>

            <div className="flex gap-3 mt-4">
              <Link to="/">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Home className="w-4 h-4" /> Ir al inicio
                </Button>
              </Link>

              <Link to="/surveys">
                <Button className="flex items-center gap-2">
                  <Search className="w-4 h-4" /> Ir a Encuestas
                </Button>
              </Link>
            </div>

            <div className="mt-6">
              <Button variant="outline" onClick={toggleDarkMode} className="flex items-center gap-2">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Alternar Modo
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-8xl font-extrabold tracking-tight">
                <span className="text-foreground">4</span>
                <span className="text-muted-foreground/60">0</span>
                <span className="text-foreground">4</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Tema actual: <strong>{currentTheme}</strong></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
