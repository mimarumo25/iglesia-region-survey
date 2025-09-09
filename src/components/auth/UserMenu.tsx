import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Palette, Sun, Moon, Check } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

/**
 * Componente de menú de usuario con opciones de perfil y logout
 */
export const UserMenu: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthContext();
  const { currentTheme, setTheme, themePresets, isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  // Debug en desarrollo
  if (import.meta.env.DEV) {
    console.log('🔍 UserMenu Debug:', { 
      user, 
      hasUser: !!user, 
      isAuthenticated,
      skipAuth: import.meta.env.VITE_SKIP_AUTH 
    });
  }

  // Si no hay usuario y no estamos en modo skip auth, no mostrar nada
  if (!user && import.meta.env.VITE_SKIP_AUTH !== 'true') {
    return null;
  }

  // En modo desarrollo con skip auth, mostrar indicador si no hay usuario
  if (!user && import.meta.env.VITE_SKIP_AUTH === 'true') {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-orange-100 border border-orange-300">
        <span className="text-orange-600 text-xs font-bold" title="No User - Dev Mode">
          NU
        </span>
      </Button>
    );
  }

  // Si llegamos aquí, tenemos un usuario válido
  console.log('🔍 UserMenu: Renderizando con usuario válido:', user.firstName, user.lastName);

  // Obtener iniciales del usuario con validación
  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    
    if (!first && !last) {
      // Si no hay nombres, usar iniciales del email
      const emailPrefix = user?.email?.split('@')[0] || 'U';
      return emailPrefix.substring(0, 2).toUpperCase();
    }
    
    return `${first}${last}`.toUpperCase();
  };

  // Obtener el nombre completo del usuario
  const getFullName = (): string => {
    const parts = [
      user.firstName,
      user.secondName,
      user.lastName,
      user.secondLastName
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(' ') : user.email;
  };

  // Mapear el rol a un formato más amigable para mostrar
  const getRoleDisplayName = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'user': 'Usuario',
      'manager': 'Gestor',
      'supervisor': 'Supervisor'
    };
    
    return roleMap[role.toLowerCase()] || role;
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileClick = () => {
    console.log('🔍 UserMenu: Navegando al perfil...');
    try {
      navigate('/profile');
      console.log('✅ UserMenu: Navegación al perfil iniciada');
    } catch (error) {
      console.error('❌ UserMenu: Error al navegar al perfil:', error);
    }
  };

  const fullName = getFullName();

  return (
    <DropdownMenu onOpenChange={(open) => {
      console.log('🔍 UserMenu: DropdownMenu onOpenChange:', open);
    }}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary/20"
          title={`Menú de ${fullName}`}
          onClick={() => {
            console.log('🔍 UserMenu: Button onClick disparado');
          }}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
            <AvatarImage 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0066cc&color=ffffff&bold=true`}
              alt={fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold text-sm">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              Rol: {getRoleDisplayName(user.role)}
            </p>
            {user.roles && user.roles.length > 1 && (
              <p className="text-xs leading-none text-muted-foreground/70">
                Roles adicionales: {user.roles.slice(1).join(', ')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 transition-colors" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔍 UserMenu: Click en Perfil detectado');
            handleProfileClick();
          }}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Mi Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 transition-colors"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            <span>Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
              {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {themePresets.map((preset) => (
              <DropdownMenuItem
                key={preset.name}
                onClick={() => setTheme(preset.name)}
                className="cursor-pointer"
              >
                <div className="flex items-center w-full">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 border border-border"
                    style={{ backgroundColor: `hsl(${preset.colors.primary})` }}
                  />
                  <span className="flex-1">{preset.displayName}</span>
                  {currentTheme === preset.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
