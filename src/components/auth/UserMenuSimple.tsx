import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Versión simplificada del UserMenu para testing
 */
export const UserMenuSimple: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  console.log('🔍 UserMenuSimple: Renderizando con usuario:', user);

  const handleProfileClick = () => {
    console.log('🔍 UserMenuSimple: Click en perfil detectado');
    navigate('/profile');
  };

  // Mostrar siempre un avatar, con indicador si no hay usuario
  const displayUser = user || {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com'
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleProfileClick}
        className="text-xs"
      >
        Perfil
      </Button>
      
      <Button 
        variant="ghost" 
        className="relative h-10 w-10 rounded-full"
        onClick={handleProfileClick}
        title={`Ir al perfil de ${displayUser.firstName} ${displayUser.lastName}`}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback className={user ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
            {user ? 
              `${displayUser.firstName?.charAt(0)}${displayUser.lastName?.charAt(0)}` : 
              'NU'
            }
          </AvatarFallback>
        </Avatar>
      </Button>
      
      {import.meta.env.DEV && (
        <div className="text-xs text-muted-foreground">
          {user ? '✅' : '❌'} User
        </div>
      )}
    </div>
  );
};

export default UserMenuSimple;
