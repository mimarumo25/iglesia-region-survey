# Plan de Pruebas - Validaciones de Formulario de Parroquias

## Resumen de Implementación

Se han implementado validaciones robustas para el formulario de parroquias usando:
- **React Hook Form** para manejo optimizado del estado
- **Zod** para validaciones del lado cliente
- **Validación específica para teléfonos colombianos**
- **Validaciones completas para todos los campos**

## Validaciones Implementadas

### 📞 Teléfonos Colombianos
- **Formatos válidos:**
  - Fijos locales: `1234567` (7 dígitos)
  - Móviles locales: `3001234567` (10 dígitos)
  - Con código país: `+57 1234567` o `+57 3001234567`
  - Con espacios/guiones: `+57 300 123 4567`, `300-123-4567`
- **Caracteres permitidos:** números, espacios, guiones, paréntesis, signo +
- **Campo opcional:** puede estar vacío

### 📧 Email
- **Formato estándar:** `usuario@dominio.com`
- **Campo opcional:** puede estar vacío
- **Validación regex:** verifica estructura válida

### 🏛️ Nombre de Parroquia
- **Obligatorio:** mínimo 3 caracteres, máximo 100
- **Caracteres permitidos:** letras, números, espacios, guiones, apostrofes, puntos
- **Soporte Unicode:** acepta acentos y ñ

### 📍 Dirección
- **Obligatorio:** mínimo 5 caracteres, máximo 200
- **Caracteres permitidos:** letras, números, espacios, guiones, comas, #, °
- **Soporte para direcciones colombianas típicas**

### 🏘️ Municipio
- **Obligatorio:** debe seleccionar un municipio válido
- **Validación:** verifica que sea un ID numérico válido

## Casos de Prueba Manual

### ✅ Casos Válidos

**Teléfonos válidos:**
- `1234567` ✅
- `3001234567` ✅
- `+57 1234567` ✅
- `+57 300 123 4567` ✅
- `300-123-4567` ✅
- `(1) 234-5678` ✅
- Campo vacío ✅

**Emails válidos:**
- `parroquia@ejemplo.com` ✅
- `admin@iglesia.org.co` ✅
- Campo vacío ✅

**Nombres válidos:**
- `Parroquia San Juan` ✅
- `Iglesia Nuestra Señora de la Paz` ✅
- `San José - Centro` ✅

**Direcciones válidas:**
- `Calle 10 # 20-30` ✅
- `Carrera 15 No. 25-40, Barrio Centro` ✅
- `Av. Principal 123` ✅

### ❌ Casos Inválidos

**Teléfonos inválidos:**
- `123` ❌ (muy corto)
- `abcd1234567` ❌ (contiene letras)
- `12345678901` ❌ (muy largo)
- `+1 234 567 8901` ❌ (código país incorrecto)

**Emails inválidos:**
- `email-sin-arroba.com` ❌
- `email@` ❌
- `@dominio.com` ❌

**Nombres inválidos:**
- `A` ❌ (muy corto)
- `12` ❌ (muy corto)
- `Nombre@con#simbolos` ❌ (caracteres no permitidos)
- Campo vacío ❌

**Direcciones inválidas:**
- `Ca` ❌ (muy corto)
- `Dir*` ❌ (caracteres no permitidos)
- Campo vacío ❌

**Municipio inválido:**
- No seleccionar municipio ❌

## Funcionalidades Adicionales

### 🔧 Formateo Automático
- Los teléfonos se formatean automáticamente en la tabla de resultados
- Ejemplos:
  - `3001234567` → `300 123 4567`
  - `1234567` → `123 4567`

### 🎯 Experiencia de Usuario
- **Validación en tiempo real:** errores se muestran al perder foco
- **Mensajes claros:** descripciones específicas de cada error
- **No bloqueo:** permite escribir mientras valida
- **Recuperación automática:** errores desaparecen al corregir

### 📱 Responsive y Accesible
- **ARIA labels:** para lectores de pantalla
- **Navegación por teclado:** funciona sin mouse
- **Alto contraste:** errores en rojo visible
- **Responsive:** funciona en móviles y tablets

## Instrucciones de Prueba

### 1. Probar Creación de Parroquia
1. Ir a la página de Parroquias
2. Hacer clic en "Nueva Parroquia"
3. Probar cada campo con datos válidos e inválidos
4. Verificar que los errores se muestran correctamente
5. Confirmar que solo se permite enviar con datos válidos

### 2. Probar Edición de Parroquia
1. Seleccionar una parroquia existente
2. Hacer clic en el ícono de editar
3. Modificar campos con datos inválidos
4. Verificar que las validaciones funcionan igual que en creación
5. Guardar cambios con datos válidos

### 3. Probar Validación de Teléfonos
- Probar todos los formatos válidos listados arriba
- Intentar formatos inválidos y verificar errores
- Verificar que el campo vacío es aceptado
- Comprobar formateo automático en la tabla

### 4. Probar Campos Opcionales
- Dejar teléfono y email vacíos → debe permitir guardar
- Llenar solo nombre, dirección y municipio → debe funcionar

### 5. Probar Navegación por Teclado
- Usar solo Tab/Shift+Tab para navegar
- Verificar que el foco es visible
- Confirmar que Enter envía el formulario
- Probar Escape para cancelar

## Tecnologías Utilizadas

```typescript
// Esquema de validación Zod
const parroquiaCreateSchema = z.object({
  nombre: z.string().min(3).max(100).regex(/[a-zA-Z]/),
  direccion: z.string().min(5).max(200),
  telefono: z.string().optional().refine(isValidPhone),
  email: z.string().optional().refine(isValidEmail),
  id_municipio: z.string().min(1)
});

// React Hook Form integration
const form = useForm({
  resolver: zodResolver(parroquiaCreateSchema),
  defaultValues: { ... }
});
```

## Resultado Esperado

Al completar las pruebas, el formulario debe:
- ✅ Mostrar errores claros para cada tipo de dato inválido
- ✅ Permitir envío solo con datos válidos
- ✅ Formatear teléfonos automáticamente
- ✅ Manejar campos opcionales correctamente
- ✅ Proporcionar excelente experiencia de usuario
- ✅ Ser completamente accesible y responsive

---

**Estado de Implementación:** ✅ COMPLETADO
**Fecha:** Septiembre 29, 2025
**Responsable:** GitHub Copilot AI