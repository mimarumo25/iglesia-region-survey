import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Palette, 
  Sun, 
  Moon, 
  RotateCcw, 
  Check,
  Paintbrush,
  Sparkles,
  Settings
} from 'lucide-react';

const ThemeCustomizer: React.FC = () => {
  const { 
    currentTheme, 
    setTheme, 
    themePresets, 
    isDarkMode, 
    toggleDarkMode,
    customColors,
    setCustomColors,
    applyCustomColors,
    resetToPreset
  } = useTheme();
  
  const [tempCustomColors, setTempCustomColors] = useState(customColors);

  const handleColorChange = (colorKey: string, value: string) => {
    // Convertir hex a HSL
    const hslValue = hexToHsl(value);
    setTempCustomColors(prev => ({
      ...prev,
      [colorKey]: hslValue
    }));
  };

  const applyTempColors = () => {
    setCustomColors(tempCustomColors);
    applyCustomColors();
  };

  const resetColors = () => {
    setTempCustomColors({});
    resetToPreset(currentTheme);
  };

  // Función para convertir hex a HSL
  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    
    const h = diff === 0 ? 0 : 
      max === r ? ((g - b) / diff) % 6 :
      max === g ? (b - r) / diff + 2 :
      (r - g) / diff + 4;
    
    const hue = Math.round(h * 60);
    const saturation = Math.round(diff === 0 ? 0 : (diff / (1 - Math.abs(2 * (sum / 2) - 1))) * 100);
    const lightness = Math.round((sum / 2) * 100);

    return `${hue < 0 ? hue + 360 : hue} ${saturation}% ${lightness}%`;
  };

  // Función para convertir HSL a hex
  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
    const saturation = s / 100;
    const lightness = l / 100;

    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = lightness - c / 2;

    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const currentPreset = themePresets.find(preset => preset.name === currentTheme);
  const getColorValue = (key: string) => {
    return tempCustomColors[key as keyof typeof tempCustomColors] || 
           currentPreset?.colors[key as keyof typeof currentPreset.colors] || 
           '';
  };

  const mainColors = [
    { key: 'primary', label: 'Color Primario', description: 'Color principal del tema' },
    { key: 'secondary', label: 'Color Secundario', description: 'Color de acento secundario' },
    { key: 'success', label: 'Color de Éxito', description: 'Color para mensajes de éxito' },
    { key: 'warning', label: 'Color de Advertencia', description: 'Color para advertencias' },
    { key: 'destructive', label: 'Color de Error', description: 'Color para errores y acciones destructivas' },
  ];

  const sidebarColors = [
    { key: 'sidebarBackground', label: 'Fondo del Sidebar', description: 'Color de fondo del menú lateral' },
    { key: 'sidebarPrimary', label: 'Primario del Sidebar', description: 'Color primario del sidebar' },
    { key: 'sidebarAccent', label: 'Acento del Sidebar', description: 'Color de acento del sidebar' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left">
          <div className="p-2 bg-primary/10 rounded-lg mx-auto sm:mx-0 w-fit">
            <Palette className="h-5 h-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Personalizar Tema</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Configura los colores y apariencia del sistema
            </p>
          </div>
        </div>
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="text-sm sm:text-base">
            {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </span>
        </Button>
      </div>

      <Tabs defaultValue="presets" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto min-h-[100px] sm:min-h-[50px] gap-2 p-2 sm:p-0">
          <TabsTrigger value="presets" className="flex flex-col sm:flex-row items-center justify-center gap-1 p-2 sm:p-3 text-xs sm:text-sm h-auto">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center line-clamp-2">Temas</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex flex-col sm:flex-row items-center justify-center gap-1 p-2 sm:p-3 text-xs sm:text-sm h-auto">
            <Paintbrush className="h-4 w-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center line-clamp-2">Personalizar</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex flex-col sm:flex-row items-center justify-center gap-1 p-2 sm:p-3 text-xs sm:text-sm h-auto">
            <Settings className="h-4 w-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center line-clamp-2">Avanzado</span>
          </TabsTrigger>
        </TabsList>

        {/* Temas Predefinidos */}
        <TabsContent value="presets" className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {themePresets.map((preset) => (
              <Card 
                key={preset.name}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden ${
                  currentTheme === preset.name 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setTheme(preset.name)}
              >
                <CardHeader className="pb-2 p-2 sm:p-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-sm sm:text-base line-clamp-1">{preset.displayName}</CardTitle>
                    {currentTheme === preset.name && (
                      <Badge variant="default" className="flex items-center gap-1 w-fit text-xs">
                        <Check className="h-3 w-3" />
                        <span>Activo</span>
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs line-clamp-2">
                    {preset.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <div className="flex gap-2 justify-start">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: `hsl(${preset.colors.primary})` }}
                      title={preset.colors.primary}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: `hsl(${preset.colors.secondary})` }}
                      title={preset.colors.secondary}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: `hsl(${preset.colors.sidebarBackground})` }}
                      title={preset.colors.sidebarBackground}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Personalización */}
        <TabsContent value="custom" className="space-y-3 sm:space-y-6">
          {/* Colores Principales */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-lg">Colores Principales</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Personaliza los colores principales del tema
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {mainColors.map((color) => (
                <div key={color.key} className="space-y-2">
                  <Label htmlFor={color.key} className="text-xs sm:text-sm font-medium">{color.label}</Label>
                  <div className="flex gap-2 items-end">
                    <div className="flex-shrink-0">
                      <Input
                        id={color.key}
                        type="color"
                        value={hslToHex(getColorValue(color.key))}
                        onChange={(e) => handleColorChange(color.key, e.target.value)}
                        className="w-14 h-10 p-1 border-2 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={getColorValue(color.key)}
                      placeholder="HSL"
                      onChange={(e) => setTempCustomColors(prev => ({
                        ...prev,
                        [color.key]: e.target.value
                      }))}
                      className="flex-1 h-10 text-xs p-2"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {color.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Colores del Sidebar */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-lg">Colores del Menú</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Personaliza el menú de navegación
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {sidebarColors.map((color) => (
                <div key={color.key} className="space-y-2">
                  <Label htmlFor={color.key} className="text-xs sm:text-sm font-medium">{color.label}</Label>
                  <div className="flex gap-2 items-end">
                    <div className="flex-shrink-0">
                      <Input
                        id={color.key}
                        type="color"
                        value={hslToHex(getColorValue(color.key))}
                        onChange={(e) => handleColorChange(color.key, e.target.value)}
                        className="w-14 h-10 p-1 border-2 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={getColorValue(color.key)}
                      placeholder="HSL"
                      onChange={(e) => setTempCustomColors(prev => ({
                        ...prev,
                        [color.key]: e.target.value
                      }))}
                      className="flex-1 h-10 text-xs p-2"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {color.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={resetColors}
              className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restablecer</span>
            </Button>
            <Button
              onClick={applyTempColors}
              className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
            >
              <Check className="h-4 w-4" />
              <span>Aplicar</span>
            </Button>
          </div>
        </TabsContent>

        {/* Configuración Avanzada */}
        <TabsContent value="advanced" className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-lg">Configuración Avanzada</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Opciones adicionales de personalización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b">
                <div className="flex-1">
                  <Label htmlFor="dark-mode" className="text-xs sm:text-sm font-medium cursor-pointer">Modo Oscuro</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Activa el tema oscuro para toda la aplicación
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <div className="pt-2 sm:pt-4">
                <h4 className="font-medium mb-3 text-xs sm:text-base">Información del Tema</h4>
                <div className="space-y-2 text-xs sm:text-sm bg-muted/50 p-2 sm:p-3 rounded-md">
                  <p><strong>Tema:</strong> <span className="ml-2">{currentPreset?.displayName}</span></p>
                  <p><strong>Modo:</strong> <span className="ml-2">{isDarkMode ? 'Oscuro' : 'Claro'}</span></p>
                  <p><strong>Personalizaciones:</strong> <span className="ml-2">{Object.keys(customColors).length}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeCustomizer;
