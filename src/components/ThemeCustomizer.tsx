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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Personalizar Tema</h2>
            <p className="text-muted-foreground">
              Configura los colores y apariencia del sistema
            </p>
          </div>
        </div>
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </Button>
      </div>

      <Tabs defaultValue="presets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Temas Predefinidos
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            Personalizar
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Avanzado
          </TabsTrigger>
        </TabsList>

        {/* Temas Predefinidos */}
        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themePresets.map((preset) => (
              <Card 
                key={preset.name}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  currentTheme === preset.name 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setTheme(preset.name)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{preset.displayName}</CardTitle>
                    {currentTheme === preset.name && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Activo
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {preset.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${preset.colors.primary})` }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${preset.colors.secondary})` }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${preset.colors.sidebarBackground})` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Personalización */}
        <TabsContent value="custom" className="space-y-6">
          {/* Colores Principales */}
          <Card>
            <CardHeader>
              <CardTitle>Colores Principales</CardTitle>
              <CardDescription>
                Personaliza los colores principales del tema
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainColors.map((color) => (
                <div key={color.key} className="space-y-2">
                  <Label htmlFor={color.key}>{color.label}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={color.key}
                      type="color"
                      value={hslToHex(getColorValue(color.key))}
                      onChange={(e) => handleColorChange(color.key, e.target.value)}
                      className="w-12 h-12 p-1 border-0"
                    />
                    <div className="flex-1">
                      <Input
                        value={getColorValue(color.key)}
                        placeholder="HSL (ej: 213 100% 45%)"
                        onChange={(e) => setTempCustomColors(prev => ({
                          ...prev,
                          [color.key]: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {color.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Colores del Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle>Colores del Menú Lateral</CardTitle>
              <CardDescription>
                Personaliza la apariencia del menú de navegación
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sidebarColors.map((color) => (
                <div key={color.key} className="space-y-2">
                  <Label htmlFor={color.key}>{color.label}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={color.key}
                      type="color"
                      value={hslToHex(getColorValue(color.key))}
                      onChange={(e) => handleColorChange(color.key, e.target.value)}
                      className="w-12 h-12 p-1 border-0"
                    />
                    <div className="flex-1">
                      <Input
                        value={getColorValue(color.key)}
                        placeholder="HSL (ej: 213 94% 35%)"
                        onChange={(e) => setTempCustomColors(prev => ({
                          ...prev,
                          [color.key]: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {color.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={resetColors}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restablecer
            </Button>
            <Button
              onClick={applyTempColors}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Aplicar Cambios
            </Button>
          </div>
        </TabsContent>

        {/* Configuración Avanzada */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Avanzada</CardTitle>
              <CardDescription>
                Opciones adicionales de personalización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Modo Oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Activa el tema oscuro para toda la aplicación
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Información del Tema Actual</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Tema:</strong> {currentPreset?.displayName}</p>
                  <p><strong>Modo:</strong> {isDarkMode ? 'Oscuro' : 'Claro'}</p>
                  <p><strong>Personalizaciones:</strong> {Object.keys(customColors).length} colores modificados</p>
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
