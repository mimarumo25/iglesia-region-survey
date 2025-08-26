# Ejemplo de Estructura de Difuntos - Nuevos Campos

## Nueva Estructura de DeceasedFamilyMember

Los campos de la sección de difuntos han sido actualizados para proporcionar información más completa y realista:

### Antes (campos antiguos)
```json
{
  "id": "1",
  "nombres": "Pedro Antonio Rodríguez",
  "fechaAniversario": "2020-05-15T00:00:00.000Z",
  "eraPadre": true,
  "eraMadre": false
}
```

### Después (campos nuevos - más detallados)
```json
{
  "id": "1",
  "nombres": "Pedro Antonio Rodríguez",
  "fechaFallecimiento": "2020-05-15T00:00:00.000Z",
  "sexo": {
    "id": "1",
    "nombre": "Masculino"
  },
  "parentesco": {
    "id": "1", 
    "nombre": "Padre"
  },
  "causaFallecimiento": "Enfermedad cardiovascular"
}
```

## Campos Implementados

### 1. **nombres** (string) - *Obligatorio*
- Nombres y apellidos completos del familiar difunto

### 2. **fechaFallecimiento** (Date | null) - *Opcional*  
- Fecha exacta del fallecimiento (reemplaza fechaAniversario)

### 3. **sexo** (ConfigurationItem | null) - *Opcional*
- Sexo del difunto usando la configuración del sistema
- Conectado con el catálogo de sexos existente

### 4. **parentesco** (ConfigurationItem | null) - *Opcional*
- Relación familiar específica (Padre, Madre, Hermano, etc.)
- Conectado con el catálogo de parentescos existente
- Más preciso que los checkboxes boolean eraPadre/eraMadre

### 5. **causaFallecimiento** (string) - *Obligatorio*
- Descripción detallada de la causa de muerte
- Campo de texto libre para máxima flexibilidad

## Ventajas de la Nueva Estructura

✅ **Más realista**: No se limita a solo padres/madres
✅ **Más detallada**: Incluye causa de fallecimiento y sexo
✅ **Mejor UX**: Formulario más intuitivo con autocompletado
✅ **Consistente**: Usa la misma estructura ConfigurationItem que otros campos
✅ **Extensible**: Fácil agregar más campos en el futuro

## Componentes Actualizados

- ✅ `DeceasedGrid.tsx` - Formulario y tabla actualizados
- ✅ `survey.ts` - Interface DeceasedFamilyMember actualizada  
- ✅ Validación con Zod actualizada
- ✅ Conectado con hooks de configuración existentes
- ✅ Compatible con modo oscuro
