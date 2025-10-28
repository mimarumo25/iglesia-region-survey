/**
 * EJEMPLOS DE USO - Hook useDisposicionBasuraMapping
 * 
 * Este archivo muestra cómo usar el sistema 100% dinámico desde cualquier componente
 */

// ============================================================
// EJEMPLO 1: Usar en un componente simple
// ============================================================

import { useDisposicionBasuraMapping } from '@/hooks/useDisposicionBasuraMapping';

function MiComponente() {
  const { mapearDisposicionBasura, opcionesDisponibles } = useDisposicionBasuraMapping();
  
  // Cuando el usuario selecciona checkboxes
  const handleDisposicionChange = (selectedIds: string[]) => {
    // Mapear automáticamente los IDs a booleanos
    const resultado = mapearDisposicionBasura(selectedIds);
    
    console.log('Resultado del mapeo:', resultado);
    // {
    //   basuras_recolector: true,
    //   basuras_quemada: false,
    //   basuras_enterrada: true,
    //   basuras_recicla: false,
    //   basuras_aire_libre: false,
    //   basuras_no_aplica: false
    // }
    
    // Guardar en estado o localStorage
    guardarEnFormulario(resultado);
  };
  
  return (
    <div>
      <label>Disposición de Basura:</label>
      {opcionesDisponibles.map(option => (
        <label key={option.value}>
          <input
            type="checkbox"
            value={option.value}
            onChange={(e) => {
              // ... lógica de manejo
              handleDisposicionChange([...selectedIds, option.value]);
            }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

// ============================================================
// EJEMPLO 2: Validar que todas las opciones estén mapeadas
// ============================================================

import { useDisposicionBasuraMapping } from '@/hooks/useDisposicionBasuraMapping';

function ComponenteConValidacion() {
  const { validarMapeo, opcionesDisponibles } = useDisposicionBasuraMapping();
  
  useEffect(() => {
    // Validar al cargar el componente
    const { valido, noMapeados } = validarMapeo();
    
    if (!valido) {
      console.error('❌ OPCIONES SIN MAPEAR:');
      console.error('Opciones disponibles:', opcionesDisponibles);
      console.error('No mapeadas:', noMapeados);
      console.error('FIX: Actualizar DISPOSICION_BASURA_CATEGORIAS en disposicionBasuraMapping.ts');
    } else {
      console.log('✅ Todas las opciones están correctamente mapeadas');
    }
  }, [validarMapeo, opcionesDisponibles]);
  
  return <div>Componente con validación</div>;
}

// ============================================================
// EJEMPLO 3: Usar el reporte de debug completo
// ============================================================

import { useDisposicionBasuraMapping } from '@/hooks/useDisposicionBasuraMapping';

function ComponenteDebug() {
  const { obtenerReporte } = useDisposicionBasuraMapping();
  
  const mostrarReporte = () => {
    // Obtener reporte formateado
    const reporte = obtenerReporte();
    console.log(reporte);
    
    // Salida en consola:
    // 📊 MAPEO DE DISPOSICIÓN DE BASURA
    // ============================================================
    // 1. "Recolección Pública" (ID: id-123)
    //    ✅ → basuras_recolector
    // 
    // 2. "Quema" (ID: id-456)
    //    ✅ → basuras_quemada
    // 
    // 3. "Opción No Reconocida" (ID: id-999)
    //    ❌ → Necesita categoría
    // ============================================================
  };
  
  return (
    <button onClick={mostrarReporte}>
      Ver Reporte de Mapeo en Consola
    </button>
  );
}

// ============================================================
// EJEMPLO 4: Obtener solo los seleccionados
// ============================================================

import { useDisposicionBasuraMapping, type DisposicionBasuraResult } from '@/hooks/useDisposicionBasuraMapping';

function ComponenteConsulta() {
  const { obtenerSeleccionados } = useDisposicionBasuraMapping();
  
  // Supongamos que el usuario seleccionó "Recolección" y "Compostaje"
  const booleanos: DisposicionBasuraResult = {
    basuras_recolector: true,
    basuras_quemada: false,
    basuras_enterrada: false,
    basuras_recicla: true,
    basuras_aire_libre: false,
    basuras_no_aplica: false
  };
  
  // Obtener solo los que están en true
  const seleccionados = obtenerSeleccionados(booleanos);
  console.log('Categorías seleccionadas:', seleccionados);
  // ['basuras_recolector', 'basuras_recicla']
  
  return (
    <div>
      <h3>Métodos de disposición seleccionados:</h3>
      <ul>
        {seleccionados.map(campo => (
          <li key={campo}>{campo}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// EJEMPLO 5: Resetear todos a false
// ============================================================

import { useDisposicionBasuraMapping } from '@/hooks/useDisposicionBasuraMapping';

function ComponenteLimpieza() {
  const { resetear } = useDisposicionBasuraMapping();
  
  const limpiarSeleccion = () => {
    const vacios = resetear();
    console.log('Selección limpiada:', vacios);
    // {
    //   basuras_recolector: false,
    //   basuras_quemada: false,
    //   basuras_enterrada: false,
    //   basuras_recicla: false,
    //   basuras_aire_libre: false,
    //   basuras_no_aplica: false
    // }
    
    // Actualizar estado
    setFormData(prev => ({
      ...prev,
      ...vacios
    }));
  };
  
  return (
    <button onClick={limpiarSeleccion}>
      Limpiar Selección
    </button>
  );
}

// ============================================================
// EJEMPLO 6: Acceder a las categorías (para referencia)
// ============================================================

import { useDisposicionBasuraMapping } from '@/hooks/useDisposicionBasuraMapping';

function ComponenteReferencia() {
  const { categorias } = useDisposicionBasuraMapping();
  
  // Categorias tiene la estructura:
  // {
  //   recolector: {
  //     campo: 'basuras_recolector',
  //     palabrasEtiqueta: [...],
  //     ejemplos: [...],
  //     descripcion: '...'
  //   },
  //   quemada: { ... },
  //   enterrada: { ... },
  //   recicla: { ... },
  //   aireLibre: { ... }
  // }
  
  return (
    <div>
      <h3>Métodos de disposición disponibles:</h3>
      {Object.entries(categorias).map(([clave, config]) => (
        <div key={clave}>
          <h4>{config.descripcion}</h4>
          <p>Campo: <code>{config.campo}</code></p>
          <p>Ejemplos: {config.ejemplos.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// EJEMPLO 7: Obtener una categoría por ID
// ============================================================

import { useDisposicionBasuraMapping } from '@/hooks/useDisposicionBasuraMapping';

function ComponenteInfo() {
  const { obtenerCategoria } = useDisposicionBasuraMapping();
  
  const verCategoria = (id: string) => {
    const label = obtenerCategoria(id);
    console.log(`El ID "${id}" corresponde a: "${label}"`);
  };
  
  return (
    <button onClick={() => verCategoria('id-abc')}>
      Ver categoría del ID
    </button>
  );
}

// ============================================================
// EJEMPLO 8: Integración completa en un formulario
// ============================================================

import { useState } from 'react';
import { useDisposicionBasuraMapping, type DisposicionBasuraResult } from '@/hooks/useDisposicionBasuraMapping';

function FormularioCompleto() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [basuraBooleanos, setBasuraBooleanos] = useState<DisposicionBasuraResult>({
    basuras_recolector: false,
    basuras_quemada: false,
    basuras_enterrada: false,
    basuras_recicla: false,
    basuras_aire_libre: false,
    basuras_no_aplica: false
  });
  
  const {
    mapearDisposicionBasura,
    opcionesDisponibles,
    obtenerSeleccionados,
    validarMapeo
  } = useDisposicionBasuraMapping();
  
  // Cuando cambia selección de checkboxes
  const handleCheckboxChange = (id: string, checked: boolean) => {
    const nuevosIds = checked
      ? [...selectedIds, id]
      : selectedIds.filter(sid => sid !== id);
    
    setSelectedIds(nuevosIds);
    
    // Mapear los nuevos IDs a booleanos
    const resultado = mapearDisposicionBasura(nuevosIds);
    setBasuraBooleanos(resultado);
    
    // Validar mapeo
    const validacion = validarMapeo();
    if (!validacion.valido) {
      console.warn('⚠️ Opciones no mapeadas:', validacion.noMapeados);
    }
  };
  
  // Guardar formulario
  const handleSubmit = () => {
    const seleccionados = obtenerSeleccionados(basuraBooleanos);
    
    const payload = {
      disposicion_basura_ids: selectedIds,
      disposicion_basura_booleanos: basuraBooleanos,
      categorias_seleccionadas: seleccionados
    };
    
    console.log('Enviando:', payload);
    // Enviar a servidor...
  };
  
  return (
    <form>
      <h2>Disposición de Basura</h2>
      
      {opcionesDisponibles.map(option => (
        <label key={option.value}>
          <input
            type="checkbox"
            checked={selectedIds.includes(option.value)}
            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
          />
          {option.label}
        </label>
      ))}
      
      <h3>Estado Actual:</h3>
      <pre>{JSON.stringify(basuraBooleanos, null, 2)}</pre>
      
      <button type="button" onClick={handleSubmit}>
        Guardar
      </button>
    </form>
  );
}

// ============================================================
// EXPORTAR todos para uso
// ============================================================

export {
  MiComponente,
  ComponenteConValidacion,
  ComponenteDebug,
  ComponenteConsulta,
  ComponenteLimpieza,
  ComponenteReferencia,
  ComponenteInfo,
  FormularioCompleto
};
