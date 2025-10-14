/**
 * Página de prueba para verificar FamilyMemberDialog
 * Específicamente para probar Habilidades y Destrezas (Sección 9)
 */

import { useState } from 'react'
import FamilyGrid from '@/components/survey/FamilyGrid'
import { FamilyMember } from '@/types/survey'

export default function FamilyMemberDialogTest() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Prueba de Habilidades y Destrezas
          </h1>
          <p className="text-gray-600 mb-4">
            Esta página permite probar el formulario de miembros de familia, 
            específicamente la <strong>Sección 9: Habilidades y Destrezas</strong>
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Instrucciones:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Haz clic en el botón <strong>"Agregar Miembro"</strong> en la tabla de abajo</li>
              <li>Se abrirá un diálogo con un formulario largo de varias secciones</li>
              <li>Desplázate hacia abajo hasta la <strong>Sección 9: Habilidades y Destrezas</strong></li>
              <li>Verifica que el campo <strong>"Habilidades Profesionales"</strong> muestra 15 opciones al hacer clic</li>
              <li>Verifica que el campo <strong>"Destrezas Técnicas"</strong> muestra 15 opciones al hacer clic</li>
              <li>Selecciona algunas opciones y verifica que aparecen como chips debajo del selector</li>
              <li>Completa los campos mínimos requeridos (Nombres, Tipo ID, Número ID) y guarda</li>
              <li>Verifica que las habilidades/destrezas seleccionadas se guardan correctamente</li>
            </ol>
          </div>
        </div>

        {/* Expected Console Logs */}
        <div className="bg-gray-800 text-gray-100 rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-2 text-white">💻 Console Logs Esperados:</h3>
          <p className="text-sm text-gray-300 mb-3">
            Abre las DevTools de Chrome (F12) y verifica que estos mensajes aparecen en la consola:
          </p>
          <pre className="text-xs overflow-x-auto bg-gray-900 p-3 rounded border border-gray-700">
{`⚠️ [habilidadesService.getActiveHabilidades] Usando datos MOCK (backend no disponible)
✅ Habilidades activas cargadas: 15 items

⚠️ [destrezasService.getActiveDestrezas] Usando datos MOCK (backend no disponible)
✅ Destrezas activas cargadas: 15 items`}
          </pre>
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded">
            <p className="text-xs text-yellow-200">
              <strong>ℹ️ Nota:</strong> Los datos MOCK se están usando temporalmente porque 
              los endpoints del backend (<code>/api/catalog/habilidades</code> y 
              <code>/api/catalog/destrezas</code>) aún no están implementados.
            </p>
          </div>
        </div>

        {/* Expected Data */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Habilidades */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              🎯 Habilidades Esperadas (15 items)
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto text-sm">
              <div className="p-2 bg-green-50 border border-green-200 rounded">
                <strong>Liderazgo</strong> <span className="text-xs text-gray-600">(Avanzado)</span>
              </div>
              <div className="p-2 bg-green-50 border border-green-200 rounded">
                <strong>Comunicación</strong> <span className="text-xs text-gray-600">(Avanzado)</span>
              </div>
              <div className="p-2 bg-green-50 border border-green-200 rounded">
                <strong>Trabajo en Equipo</strong> <span className="text-xs text-gray-600">(Avanzado)</span>
              </div>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500">
                ... y 12 habilidades más
              </div>
            </div>
          </div>

          {/* Destrezas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              🛠️ Destrezas Esperadas (15 items)
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto text-sm">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Carpintería</strong> <span className="text-xs text-gray-600">(Manual)</span>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Plomería</strong> <span className="text-xs text-gray-600">(Manual)</span>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Electricidad</strong> <span className="text-xs text-gray-600">(Técnica)</span>
              </div>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500">
                ... y 12 destrezas más
              </div>
            </div>
          </div>
        </div>

        {/* Actual FamilyGrid Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-300">
          <h3 className="font-semibold text-xl text-gray-800 mb-4 pb-3 border-b-2 border-gray-200">
            👨‍👩‍👧‍👦 Componente FamilyGrid - Haz clic en "Agregar Miembro"
          </h3>
          <FamilyGrid 
            familyMembers={familyMembers} 
            setFamilyMembers={setFamilyMembers} 
          />
        </div>

        {/* Results Display */}
        {familyMembers.length > 0 && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-xl text-green-900 mb-4">
              ✅ Miembros Agregados: {familyMembers.length}
            </h3>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div key={member.id} className="bg-white p-4 rounded border border-green-200">
                  <p className="font-medium text-lg text-gray-800 mb-2">
                    {member.nombres}
                    {member.numeroIdentificacion && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({member.tipoIdentificacion?.nombre || 'ID'}: {member.numeroIdentificacion})
                      </span>
                    )}
                  </p>
                  
                  {member.habilidades && member.habilidades.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-green-700 mb-1">
                        🎯 Habilidades ({member.habilidades.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.habilidades.map((hab, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-300"
                          >
                            {typeof hab === 'object' ? hab.nombre : hab}
                            {typeof hab === 'object' && hab.nivel && (
                              <span className="ml-1 text-green-600">({hab.nivel})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {member.destrezas && member.destrezas.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-1">
                        �️ Destrezas ({member.destrezas.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.destrezas.map((dest, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-300"
                          >
                            {typeof dest === 'object' ? dest.nombre : dest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(!member.habilidades || member.habilidades.length === 0) && 
                   (!member.destrezas || member.destrezas.length === 0) && (
                    <p className="text-sm text-gray-500 italic">
                      No se seleccionaron habilidades ni destrezas para este miembro
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
