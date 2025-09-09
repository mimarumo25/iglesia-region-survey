import React from 'react';
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const DebugUserMenu = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    console.log('🔍 Debug: Navegando al perfil directamente');
    navigate('/profile');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Debug UserMenu</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado de Autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? 'Sí' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Sí' : 'No'}</p>
            <p><strong>User exists:</strong> {user ? 'Sí' : 'No'}</p>
            <p><strong>VITE_SKIP_AUTH:</strong> {import.meta.env.VITE_SKIP_AUTH}</p>
            <p><strong>DEV:</strong> {import.meta.env.DEV ? 'Sí' : 'No'}</p>
          </div>
        </CardContent>
      </Card>

      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Datos del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Acciones de Prueba</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button onClick={handleGoToProfile} className="w-full">
              Navegar al Perfil (Directo)
            </Button>
            <Button 
              onClick={() => window.location.href = '/profile'} 
              variant="outline"
              className="w-full"
            >
              Navegar al Perfil (Window Location)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugUserMenu;
