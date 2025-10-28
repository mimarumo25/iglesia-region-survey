# 🔍 INSTRUCCIONES: Capturar IDs Reales de la API

## ⚠️ Problema Identificado

He visto en tu screenshot que los nombres de las opciones son **completamente diferentes** a los que estaba mapeando:

**Lo que veo en tu pantalla**:
- ✅ Campo Abierto
- ✅ Quema
- ✅ Río o Quebrada

**Lo que el código esperaba**:
- Recolección Municipal
- Incineración
- Botadero

Esto significa que **los IDs reales de tu API son diferentes** a los que asumí (1-6).

---

## 🚀 Solución: Ejecutar Debug en Consola

He actualizado el código para capturar automáticamente los IDs reales que devuelve tu API.

### Paso 1: Limpiar el cache
```bash
# Abre una terminal PowerShell en el proyecto
cd D:\Miguel\Proyecto-tabajos-dev\iglesia-region-survey

# Ejecuta el servidor en desarrollo
npm run dev
```

### Paso 2: Esperar a que compile
```
➜  Local:   http://localhost:8081/
```

### Paso 3: Abrir el formulario
1. Ir a `http://localhost:8081`
2. Hacer clic en "Nueva Encuesta"
3. Rellenar Etapa 1 (Información General)
4. Avanzar a **Etapa 2: Información de Vivienda**

### Paso 4: Abrir DevTools
Presiona: `F12` o `Ctrl+Shift+I`

Ve a la pestaña **Console**

### Paso 5: Seleccionar checkboxes
1. En el formulario, **selecciona algunos checkboxes de "Tipos de Disposición de Basura"**
   - Por ejemplo: Campo Abierto, Quema, Río o Quebrada

2. **Mira la consola** → Deberá mostrar algo como:

```
🔍 DEBUG: disposicion_basura recibida
IDs seleccionados: ["3", "5", "7"]

📋 Opciones disponibles en config:
  ID: "1" → Label: "Compostaje"
  ID: "2" → Label: "Incineración"
  ID: "3" → Label: "Campo Abierto"
  ID: "4" → Label: "Quema"
  ID: "5" → Label: "Río o Quebrada"
  ID: "6" → Label: "Reciclaje"
  ID: "7" → Label: "Recolección Pública"

  Procesando ID "3" → Label: "Campo Abierto"
  Procesando ID "5" → Label: "Río o Quebrada"
  Procesando ID "7" → Label: "Quema"

✅ Resultado del mapeo:
{
  basuras_recolector: false,
  basuras_quemada: true,
  basuras_enterrada: false,
  basuras_recicla: false,
  basuras_aire_libre: true,
  basuras_no_aplica: false
}
```

---

## 📋 Qué Hacer con la Información

### Captura esta tabla de la consola:

Cuando selecciones los checkboxes y veas el debug, **copia esta información**:

**OPCIONES DISPONIBLES EN CONFIG** (la lista completa de ID → Label):

| ID | Label | 
|----|-------|
| ? | ? |
| ? | ? |
| ? | ? |
| ? | ? |
| ? | ? |
| ? | ? |

**SELECCIÓN DEL USUARIO**:

| Checkbox Seleccionado | ID | Label |
|----------------------|----|----|
| ✅ | ? | ? |
| ✅ | ? | ? |
| ☐ | ? | ? |

---

## 🎯 Por Qué Necesito Esto

Con la información real de los IDs y labels, podré:

1. ✅ Identificar el mapeo correcto
2. ✅ Actualizar el código para que funcione con tu API específica
3. ✅ Asegurar que lo que seleccionas en el frontend coincida con localStorage

---

## 💾 Una Vez Tengas los IDs

Comparte conmigo:
1. **Captura de pantalla de la consola con el debug**
2. **O copia/pega la salida completa de la consola**

Con eso podré hacer el fix definitivo en 5 minutos.

---

## 🆘 Si No Ves el Debug

Si no ves el debug en la consola, prueba:

1. **Recargar la página**: `Ctrl+Shift+R` (reload sin cache)
2. **Limpiar localStorage**: En DevTools → Application → Storage → LocalStorage → Clear All
3. **Abrir consola primero**: Abre DevTools ANTES de seleccionar los checkboxes
4. **Mirar filtros**: En la consola, asegúrate de no haber filtrado los logs

---

**¡Espero tu información!** 🚀
