import { useAuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";

export const UserDebugPanel = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          <User className="w-4 h-4 mr-2" />
          Debug User
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Debug - Usuario</CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-xs font-medium text-gray-500">Estado:</span>
            <div className="flex gap-2 mt-1">
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Autenticado" : "No Autenticado"}
              </Badge>
              <Badge variant={isLoading ? "secondary" : "outline"}>
                {isLoading ? "Cargando" : "Cargado"}
              </Badge>
            </div>
          </div>

          {user ? (
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Usuario:</span>
                <p className="text-sm">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Email:</span>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Rol:</span>
                <Badge 
                  variant={user.role === 'admin' ? 'default' : user.role === 'coordinator' ? 'secondary' : 'outline'}
                  className="ml-2"
                >
                  {user.role}
                </Badge>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">ID:</span>
                <p className="text-sm">{user.id}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No hay datos de usuario
            </div>
          )}

          <div className="pt-2 border-t">
            <span className="text-xs font-medium text-gray-500">Acciones:</span>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Debug functionality removed
                }}
              >
                Log Data
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => location.reload()}
              >
                Reload
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  sessionStorage.setItem('auth_user_data', JSON.stringify({
                    id: 1, firstName: "Admin", lastName: "Test",
                    email: "admin@test.com", role: "admin"
                  }));
                  location.reload();
                }}
                className="col-span-2"
              >
                Test Admin
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  sessionStorage.setItem('auth_user_data', JSON.stringify({
                    id: 2, firstName: "Survey", lastName: "Test",
                    email: "survey@test.com", role: "surveyor"
                  }));
                  location.reload();
                }}
                className="col-span-2"
              >
                Test Surveyor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
