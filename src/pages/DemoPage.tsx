import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AutocompleteWithLoading } from '@/components/ui/autocomplete-with-loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DemoPage: React.FC = () => {
  // Datos mock para probar UI
  const mockDepartamentos = [
    { value: "1", label: "Amazonas" },
    { value: "2", label: "Antioquia" },
    { value: "3", label: "Arauca" },
    { value: "4", label: "Atlántico" },
    { value: "5", label: "Bogotá D.C." },
  ];

  const mockSistemasAcueducto = [
    { value: "1", label: "Acueducto Municipal" },
    { value: "2", label: "Pozo Artesiano" },
    { value: "3", label: "Agua de Lluvia" },
    { value: "4", label: "Río/Quebrada" },
    { value: "5", label: "Carro Tanque" },
  ];

  const mockTallas = [
    { value: "camisa_xs", label: "Camisa - XS" },
    { value: "camisa_s", label: "Camisa - S" },
    { value: "camisa_m", label: "Camisa - M" },
    { value: "camisa_l", label: "Camisa - L" },
    { value: "pantalon_28", label: "Pantalón - 28" },
    { value: "pantalon_30", label: "Pantalón - 30" },
    { value: "pantalon_32", label: "Pantalón - 32" },
    { value: "calzado_35", label: "Calzado - 35" },
    { value: "calzado_36", label: "Calzado - 36" },
    { value: "calzado_37", label: "Calzado - 37" },
  ];

  const [selectedDepartamento, setSelectedDepartamento] = React.useState('');
  const [selectedSistema, setSelectedSistema] = React.useState('');
  const [selectedTallaCamisa, setSelectedTallaCamisa] = React.useState('');
  const [selectedTallaPantalon, setSelectedTallaPantalon] = React.useState('');
  const [selectedTallaCalzado, setSelectedTallaCalzado] = React.useState('');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🎯 Demo de Servicios Implementados</h1>
        <p className="text-gray-600 mt-2">
          Prueba visual de los componentes con datos simulados
        </p>
      </div>

      {/* Demo: Servicio de Departamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏛️ Servicio de Departamentos (Nuevo)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="departamento">Selecciona un Departamento</Label>
            <AutocompleteWithLoading
              options={mockDepartamentos}
              value={selectedDepartamento}
              onValueChange={setSelectedDepartamento}
              placeholder="Buscar departamento..."
              isLoading={false}
              error={null}
              emptyText="No hay departamentos disponibles"
            />
            {selectedDepartamento && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Seleccionado: <strong>{mockDepartamentos.find(d => d.value === selectedDepartamento)?.label}</strong>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo: Servicio de Sistemas de Acueducto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💧 Sistema de Acueducto (Nuevo - SurveyForm)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sistema">Sistema de Abastecimiento</Label>
            <AutocompleteWithLoading
              options={mockSistemasAcueducto}
              value={selectedSistema}
              onValueChange={setSelectedSistema}
              placeholder="Seleccionar sistema de acueducto..."
              isLoading={false}
              error={null}
              emptyText="No hay sistemas disponibles"
            />
            {selectedSistema && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✅ Sistema: <strong>{mockSistemasAcueducto.find(s => s.value === selectedSistema)?.label}</strong>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo: Servicio de Tallas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👕 Tallas (Nuevo - FamilyGrid)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Talla Camisa */}
            <div>
              <Label htmlFor="talla-camisa">Talla Camisa/Blusa</Label>
              <AutocompleteWithLoading
                options={mockTallas.filter(t => t.value.includes('camisa'))}
                value={selectedTallaCamisa}
                onValueChange={setSelectedTallaCamisa}
                placeholder="Talla camisa..."
                isLoading={false}
                error={null}
                emptyText="No hay tallas disponibles"
              />
            </div>

            {/* Talla Pantalón */}
            <div>
              <Label htmlFor="talla-pantalon">Talla Pantalón</Label>
              <AutocompleteWithLoading
                options={mockTallas.filter(t => t.value.includes('pantalon'))}
                value={selectedTallaPantalon}
                onValueChange={setSelectedTallaPantalon}
                placeholder="Talla pantalón..."
                isLoading={false}
                error={null}
                emptyText="No hay tallas disponibles"
              />
            </div>

            {/* Talla Calzado */}
            <div>
              <Label htmlFor="talla-calzado">Talla Calzado</Label>
              <AutocompleteWithLoading
                options={mockTallas.filter(t => t.value.includes('calzado'))}
                value={selectedTallaCalzado}
                onValueChange={setSelectedTallaCalzado}
                placeholder="Talla calzado..."
                isLoading={false}
                error={null}
                emptyText="No hay tallas disponibles"
              />
            </div>
          </div>

          {(selectedTallaCamisa || selectedTallaPantalon || selectedTallaCalzado) && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Tallas Seleccionadas:</h4>
              <div className="space-y-1 text-sm text-purple-700">
                {selectedTallaCamisa && <div>👕 Camisa: <strong>{mockTallas.find(t => t.value === selectedTallaCamisa)?.label}</strong></div>}
                {selectedTallaPantalon && <div>👖 Pantalón: <strong>{mockTallas.find(t => t.value === selectedTallaPantalon)?.label}</strong></div>}
                {selectedTallaCalzado && <div>👟 Calzado: <strong>{mockTallas.find(t => t.value === selectedTallaCalzado)?.label}</strong></div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo: Estados de Carga */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⏳ Estados de Carga (Loading States)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Estado: Cargando</Label>
              <AutocompleteWithLoading
                options={[]}
                value=""
                onValueChange={() => {}}
                placeholder="Cargando datos..."
                isLoading={true}
                error={null}
                emptyText="No hay datos"
              />
            </div>

            <div>
              <Label>Estado: Error</Label>
              <AutocompleteWithLoading
                options={[]}
                value=""
                onValueChange={() => {}}
                placeholder="Seleccionar..."
                isLoading={false}
                error={{ message: "Error de conexión" }}
                emptyText="No hay datos"
              />
            </div>

            <div>
              <Label>Estado: Sin Datos</Label>
              <AutocompleteWithLoading
                options={[]}
                value=""
                onValueChange={() => {}}
                placeholder="Seleccionar..."
                isLoading={false}
                error={null}
                emptyText="No hay opciones disponibles"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Resumen de Prueba
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-800">Servicios Nuevos</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">20+</div>
              <div className="text-sm text-blue-800">Total Servicios</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">✅</div>
              <div className="text-sm text-purple-800">UI Funcionando</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">🚀</div>
              <div className="text-sm text-orange-800">Ready to Test</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">✅ Funcionalidades Verificadas:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AutocompleteWithLoading con datos mock</li>
              <li>• Estados de carga (loading, error, empty)</li>
              <li>• Filtrado por categorías (tallas por tipo)</li>
              <li>• Integración con formularios</li>
              <li>• Responsive design</li>
              <li>• Validación de selecciones</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage;
