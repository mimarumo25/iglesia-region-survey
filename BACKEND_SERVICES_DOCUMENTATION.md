# Sistema de Encuestas Parroquiales - Documentación Backend

## Arquitectura de Servicios

### Tecnologías Recomendadas
- **Backend:** Node.js + Express.js / NestJS
- **Base de Datos:** PostgreSQL / MongoDB
- **Autenticación:** JWT + bcrypt
- **Validación:** Joi / Zod
- **ORM:** Prisma / TypeORM

---

## 1. MODELOS DE DATOS (Schemas)

### 1.1 Usuario (User)
```typescript
interface User {
  id: string; // UUID
  name: string;
  email: string;
  password: string; // Hash
  phone?: string;
  role: 'admin' | 'coordinator' | 'surveyor';
  sector?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  surveysCompleted: number;
}
```

### 1.2 Sector
```typescript
interface Sector {
  id: string; // UUID
  name: string;
  description: string;
  families: number;
  completed: number;
  pending: number;
  coordinator: string; // User ID
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lastUpdate: Date;
}
```

### 1.3 Encuesta (Survey)
```typescript
interface Survey {
  id: string; // UUID
  userId: string; // Encuestador ID
  familyId?: string; // Familia ID (opcional)
  
  // Información General
  sector: string;
  familyHead: string;
  address: string;
  phone?: string;
  email?: string;
  familySize: number;
  housingType: string;
  observations?: string;
  
  // Control de Estado
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  currentStage: number;
  totalStages: number;
  progress: number; // Porcentaje 0-100
  
  // Datos por Etapa
  stagesData: {
    stageId: number;
    stageName: string;
    fields: Record<string, any>;
    completedAt?: Date;
    isValid: boolean;
  }[];
  
  // Miembros de Familia
  familyMembers: FamilyMember[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // Metadatos
  version: number; // Control de versiones
  lastSavedStage: number;
}
```

### 1.4 Miembro de Familia (FamilyMember)
```typescript
interface FamilyMember {
  id: string;
  surveyId: string;
  nombres: string;
  fechaNacimiento: Date;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  sexo: 'M' | 'F' | 'Otro';
  situacionCivil: string;
  parentesco: string;
  talla: {
    camisa: string;
    pantalon: string;
    calzado: string;
  };
  estudio: string;
  comunidadCultural: string;
  telefono?: string;
  enQueEresLider?: string;
  habilidadDestreza?: string;
  correoElectronico?: string;
  enfermedad?: string;
  necesidadesEnfermo?: string;
  solicitudComunionCasa: boolean;
  profesionMotivoFechaCelebrar: {
    profesion: string;
    motivo: string;
    dia: string;
    mes: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.5 Familia (Family)
```typescript
interface Family {
  id: string;
  familyHead: string;
  sector: string;
  address: string;
  phone?: string;
  email?: string;
  familySize: number;
  housingType: string;
  surveyStatus: 'pending' | 'in_progress' | 'completed';
  surveysCount: number;
  lastSurveyDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 2. HISTORIAS DE USUARIO (HU) - SERVICIOS DE ENCUESTA

### HU-001: Crear Nueva Encuesta
**Como** encuestador del sistema parroquial  
**Quiero** crear una nueva encuesta de caracterización familiar  
**Para** iniciar el registro de una nueva familia en mi sector  

**Criterios de Aceptación:**
- Debo poder ingresar información básica: sector, jefe de familia, dirección, teléfono, email, tamaño familiar y tipo de vivienda
- El sistema debe crear automáticamente una encuesta en estado "draft"
- Debe asignar la etapa inicial (currentStage = 1) y progreso 0%
- Debe generar un ID único para la encuesta
- Debe registrar la fecha y hora de creación
- Solo encuestadores autenticados pueden crear encuestas

**Definición de Terminado:**
- Endpoint POST /surveys implementado
- Validaciones de campos obligatorios funcionando
- Respuesta incluye ID de encuesta y estado inicial
- Tests unitarios y de integración pasando

---

### HU-002: Guardar Progreso de Etapa (Guardado Incremental)
**Como** encuestador realizando una encuesta  
**Quiero** que el sistema guarde automáticamente mi progreso cada vez que avanzo a la siguiente etapa  
**Para** no perder información si se interrumpe el proceso y poder continuar más tarde  

**Criterios de Aceptación:**
- Al hacer clic en "Siguiente", todos los datos de la etapa actual se guardan en el backend
- El sistema debe actualizar el número de etapa actual (currentStage)
- Debe calcular automáticamente el porcentaje de progreso
- Los datos se almacenan en formato JSON flexible para cada etapa
- Debe validar los datos según las reglas de la etapa actual
- El estado cambia automáticamente de "draft" a "in_progress"
- Debe registrar timestamp de la última actualización

**Definición de Terminado:**
- Endpoint PUT /surveys/:id implementado
- Lógica de cálculo de progreso funcionando
- Validación por etapa implementada
- Manejo de errores y rollback
- Tests de guardado incremental pasando

---

### HU-003: Obtener Encuesta Específica
**Como** encuestador o coordinador  
**Quiero** consultar los detalles completos de una encuesta específica  
**Para** revisar la información registrada, continuar una encuesta pendiente o verificar datos  

**Criterios de Aceptación:**
- Debo poder buscar una encuesta por su ID único
- La respuesta debe incluir todos los datos de la encuesta: información general, etapas completadas, miembros de familia
- Debe mostrar el estado actual y progreso
- Si la encuesta está incompleta, debe indicar en qué etapa puede continuar
- Debe incluir información de validación si hay errores
- Solo el creador, coordinadores del sector o admins pueden acceder
- Debe mostrar historial de cambios si está disponible

**Definición de Terminado:**
- Endpoint GET /surveys/:id implementado
- Control de permisos por rol funcionando
- Respuesta completa con todos los datos
- Manejo de encuestas no encontradas
- Tests de autorización pasando

---

### HU-004: Listar Encuestas con Filtros
**Como** coordinador o administrador  
**Quiero** ver una lista de todas las encuestas con capacidad de filtrado y búsqueda  
**Para** hacer seguimiento del progreso, identificar encuestas pendientes y generar reportes  

**Criterios de Aceptación:**
- Debo poder ver lista paginada de encuestas
- Puedo filtrar por: estado, sector, encuestador, fechas, jefe de familia
- Puedo ordenar por: fecha de creación, última actualización, progreso
- Cada encuesta muestra: ID, jefe de familia, sector, estado, progreso, última actualización
- Debo poder buscar por texto en nombre de familia o dirección
- Los resultados respetan los permisos de mi rol (sector asignado)
- Incluye estadísticas resumidas: total, completadas, pendientes

**Definición de Terminado:**
- Endpoint GET /surveys implementado
- Sistema de filtros y paginación funcionando
- Búsqueda por texto implementada
- Control de permisos por sector
- Performance optimizada para grandes volúmenes
- Tests de filtros y búsqueda pasando

---

### HU-005: Actualizar Información de Encuesta
**Como** encuestador o coordinador  
**Quiero** modificar información específica de una encuesta existente  
**Para** corregir errores, actualizar datos que cambiaron o completar información faltante  

**Criterios de Aceptación:**
- Puedo modificar información general: dirección, teléfono, email, observaciones
- Puedo editar datos de miembros de familia individualmente
- Puedo agregar o eliminar miembros de familia
- Puedo modificar datos de etapas específicas
- Los cambios deben mantener la integridad de la encuesta
- Debe registrar quién y cuándo hizo los cambios (auditoría)
- No puedo modificar encuestas completadas sin permisos especiales
- Validaciones específicas según el campo modificado

**Definición de Terminado:**
- Endpoint PUT /surveys/:id implementado para edición completa
- Endpoint PATCH /surveys/:id para ediciones parciales
- Sistema de auditoría funcionando
- Validaciones de integridad implementadas
- Control de permisos para encuestas completadas
- Tests de edición y auditoría pasando

---

### HU-006: Cambiar Estado de Encuesta
**Como** encuestador o coordinador  
**Quiero** cambiar el estado de una encuesta (completar, cancelar, reactivar)  
**Para** marcar el progreso oficial y controlar el flujo de trabajo  

**Criterios de Aceptación:**
- Puedo marcar una encuesta como "completed" cuando esté 100% completada
- Puedo cancelar una encuesta con motivo obligatorio
- Puedo reactivar encuestas canceladas si tengo permisos
- Al completar, debe validar que todas las etapas estén completas
- Debe actualizar automáticamente las estadísticas del sector
- Debe registrar fecha de finalización
- Coordinadores pueden cambiar estados de encuestas de su sector
- Admins pueden cambiar cualquier estado

**Definición de Terminado:**
- Endpoint PATCH /surveys/:id/status implementado
- Validaciones de estado implementadas
- Actualización automática de estadísticas
- Control de permisos por rol
- Log de cambios de estado
- Tests de transiciones de estado pasando

---

### HU-007: Eliminar Encuesta
**Como** administrador del sistema  
**Quiero** eliminar encuestas incorrectas o duplicadas  
**Para** mantener la calidad de los datos y liberar espacio de almacenamiento  

**Criterios de Aceptación:**
- Solo administradores pueden eliminar encuestas
- Debe ser eliminación lógica (soft delete) por defecto
- Debo confirmar la eliminación antes de proceder
- Las encuestas completadas requieren confirmación adicional
- Debe mantener log de eliminaciones para auditoría
- Opción de eliminación física solo para administradores de sistema
- Al eliminar, debe actualizar estadísticas relacionadas
- No afecta estadísticas históricas de reportes

**Definición de Terminado:**
- Endpoint DELETE /surveys/:id implementado
- Sistema de soft delete funcionando
- Confirmaciones de seguridad implementadas
- Actualización de estadísticas
- Log de auditoría para eliminaciones
- Tests de eliminación y recuperación pasando

---

### HU-008: Recuperar Encuesta Incompleta
**Como** encuestador  
**Quiero** poder continuar una encuesta que dejé incompleta anteriormente  
**Para** retomar el trabajo donde lo dejé sin perder progreso  

**Criterios de Aceptación:**
- El sistema debe mostrar desde qué etapa puedo continuar
- Debe cargar todos los datos previamente guardados
- Debe validar la integridad de los datos existentes
- Si hay datos temporales de auto-guardado, debe ofrecerlos
- Debe mostrar la fecha de última modificación
- Solo puedo recuperar mis propias encuestas (excepto coordinadores/admins)
- Debe advertir si hay problemas de validación en datos existentes

**Definición de Terminado:**
- Endpoint GET /surveys/:id/resume implementado
- Lógica de recuperación de datos funcionando
- Validación de integridad implementada
- Manejo de datos temporales
- Control de ownership
- Tests de recuperación pasando

---

### HU-009: Auto-guardado de Progreso
**Como** encuestador completando una encuesta  
**Quiero** que el sistema guarde automáticamente mi progreso cada cierto tiempo  
**Para** no perder trabajo si hay problemas de conectividad o cierro accidentalmente la aplicación  

**Criterios de Aceptación:**
- El sistema debe auto-guardar cada 30 segundos automáticamente
- Debe guardar datos temporales sin validar completamente
- No debe interrumpir la experiencia del usuario
- Debe mostrar indicador visual de "Guardando..." y "Guardado"
- Al recuperar, debe ofrecer restaurar desde auto-guardado
- Debe limpiar datos temporales al completar la encuesta
- Funciona offline con sincronización posterior

**Definición de Terminado:**
- Endpoint POST /surveys/:id/auto-save implementado
- Lógica de auto-guardado sin validación estricta
- Indicadores visuales en frontend
- Limpieza automática de datos temporales
- Manejo de offline/online
- Tests de auto-guardado pasando

---

### HU-010: Duplicar Encuesta como Template
**Como** encuestador  
**Quiero** crear una nueva encuesta basada en una existente  
**Para** acelerar el proceso cuando registro familias similares en el mismo sector  

**Criterios de Aceptación:**
- Puedo seleccionar una encuesta completada como base
- Se copia información general pero NO datos personales específicos
- Se mantiene: sector, tipo de vivienda, estructura básica
- Se limpia: nombres, identificaciones, datos personales específicos
- La nueva encuesta inicia en estado "draft" y etapa 1
- Debo poder modificar la información copiada
- Solo puedo duplicar encuestas de mi sector (excepto admins)

**Definición de Terminado:**
- Endpoint POST /surveys/:id/duplicate implementado
- Lógica de filtrado de datos personales
- Validación de permisos por sector
- Nuevo ID y timestamps generados
- Tests de duplicación pasando

---

## 3. ENDPOINTS API

### 2.1 Autenticación
```typescript
// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
  expiresIn: number;
}

// POST /auth/refresh
interface RefreshRequest {
  refreshToken: string;
}

// POST /auth/logout
interface LogoutRequest {
  token: string;
}
```

### 2.2 Usuarios
```typescript
// GET /users
interface GetUsersQuery {
  page?: number;
  limit?: number;
  role?: string;
  sector?: string;
  status?: string;
  search?: string;
}

// GET /users/:id
interface GetUserResponse {
  user: User;
  surveys: Survey[];
  stats: {
    totalSurveys: number;
    completedSurveys: number;
    pendingSurveys: number;
    averageCompletionTime: number;
  };
}

// POST /users
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'coordinator' | 'surveyor';
  sector?: string;
}

// PUT /users/:id
interface UpdateUserRequest extends Partial<CreateUserRequest> {}
```

### 2.3 Encuestas (Core - Guardado Incremental)
```typescript
// POST /surveys - Crear nueva encuesta
interface CreateSurveyRequest {
  sector: string;
  familyHead: string;
  address: string;
  phone?: string;
  email?: string;
  familySize: number;
  housingType: string;
  observations?: string;
}

interface CreateSurveyResponse {
  id: string;
  status: 'draft';
  currentStage: 1;
  totalStages: number;
  progress: 0;
  createdAt: Date;
}

// PUT /surveys/:id - Actualizar progreso (GUARDADO INCREMENTAL)
interface UpdateSurveyProgressRequest {
  currentStage: number;
  stageData: {
    stageId: number;
    stageName: string;
    fields: Record<string, any>;
    isValid: boolean;
  };
  familyMembers?: FamilyMember[];
  autoSave?: boolean; // Para guardado automático
}

interface UpdateSurveyProgressResponse {
  id: string;
  status: string;
  currentStage: number;
  progress: number;
  lastSavedAt: Date;
  nextStage?: {
    id: number;
    name: string;
    fields: FormField[];
  };
}

// PATCH /surveys/:id/status - Cambiar estado
interface UpdateSurveyStatusRequest {
  status: 'in_progress' | 'completed' | 'cancelled';
  completionNotes?: string;
}

// GET /surveys/:id - Obtener encuesta específica
interface GetSurveyResponse {
  survey: Survey;
  canResume: boolean;
  nextStage?: number;
  validationErrors?: string[];
}

// GET /surveys - Listar encuestas
interface GetSurveysQuery {
  page?: number;
  limit?: number;
  status?: string;
  sector?: string;
  userId?: string;
  familyHead?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'progress';
  sortOrder?: 'asc' | 'desc';
}

// POST /surveys/:id/auto-save - Guardado automático
interface AutoSaveRequest {
  currentStage: number;
  tempData: Record<string, any>;
  timestamp: Date;
}
```

### 2.4 Familias
```typescript
// GET /families
interface GetFamiliesQuery {
  page?: number;
  limit?: number;
  sector?: string;
  search?: string;
  surveyStatus?: string;
}

// POST /families
interface CreateFamilyRequest {
  familyHead: string;
  sector: string;
  address: string;
  phone?: string;
  email?: string;
  familySize: number;
  housingType: string;
}

// GET /families/:id/surveys
interface GetFamilySurveysResponse {
  family: Family;
  surveys: Survey[];
  stats: {
    totalSurveys: number;
    lastSurveyDate: Date;
    completionRate: number;
  };
}
```

### 2.5 Sectores
```typescript
// GET /sectors
interface GetSectorsResponse {
  sectors: Sector[];
  totalStats: {
    totalSectors: number;
    activeSectors: number;
    totalFamilies: number;
    completedSurveys: number;
  };
}

// GET /sectors/:id/progress
interface GetSectorProgressResponse {
  sector: Sector;
  surveys: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  familyStats: {
    registered: number;
    surveyed: number;
    completionRate: number;
  };
}
```

### 2.6 Reportes
```typescript
// GET /reports
interface GetReportsQuery {
  type?: 'general' | 'sectors' | 'families' | 'users';
  period?: string;
  format?: 'json' | 'pdf' | 'excel';
}

// POST /reports/generate
interface GenerateReportRequest {
  type: 'general' | 'sectors' | 'families' | 'users';
  filters: {
    sectors?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    status?: string[];
  };
  format: 'pdf' | 'excel';
  includeCharts: boolean;
}
```

---

## 3. LÓGICA DE GUARDADO INCREMENTAL

### 3.1 Flujo de Guardado por Etapas

```typescript
// Servicio de Encuestas
class SurveyService {
  
  // Crear nueva encuesta
  async createSurvey(data: CreateSurveyRequest, userId: string): Promise<Survey> {
    const survey = await this.surveyRepository.create({
      ...data,
      userId,
      status: 'draft',
      currentStage: 1,
      totalStages: this.getFormStagesCount(),
      progress: 0,
      stagesData: [],
      familyMembers: [],
      version: 1
    });
    
    return survey;
  }

  // Guardar progreso de etapa (CORE FUNCTION)
  async saveStageProgress(
    surveyId: string, 
    stageData: UpdateSurveyProgressRequest,
    userId: string
  ): Promise<UpdateSurveyProgressResponse> {
    
    const survey = await this.findSurveyById(surveyId);
    
    // Validaciones
    this.validateSurveyOwnership(survey, userId);
    this.validateStageData(stageData);
    
    // Actualizar datos de la etapa
    const updatedStagesData = this.updateStageData(survey.stagesData, stageData.stageData);
    
    // Calcular progreso
    const progress = this.calculateProgress(updatedStagesData, survey.totalStages);
    
    // Determinar estado
    const status = this.determineStatus(stageData.currentStage, survey.totalStages, progress);
    
    // Actualizar encuesta
    const updatedSurvey = await this.surveyRepository.update(surveyId, {
      currentStage: stageData.currentStage,
      stagesData: updatedStagesData,
      familyMembers: stageData.familyMembers || survey.familyMembers,
      progress,
      status,
      lastSavedStage: stageData.currentStage,
      updatedAt: new Date(),
      version: survey.version + 1
    });
    
    // Log de auditoría
    await this.auditService.logSurveyUpdate(surveyId, userId, stageData.currentStage);
    
    // Respuesta
    return {
      id: updatedSurvey.id,
      status: updatedSurvey.status,
      currentStage: updatedSurvey.currentStage,
      progress: updatedSurvey.progress,
      lastSavedAt: updatedSurvey.updatedAt,
      nextStage: this.getNextStageInfo(stageData.currentStage, survey.totalStages)
    };
  }

  // Guardado automático (cada 30 segundos)
  async autoSave(surveyId: string, tempData: any, userId: string): Promise<void> {
    const survey = await this.findSurveyById(surveyId);
    
    // Guardar datos temporales sin validar
    await this.surveyRepository.updateTempData(surveyId, {
      tempData,
      lastAutoSave: new Date()
    });
  }

  // Recuperar encuesta para continuar
  async resumeSurvey(surveyId: string, userId: string): Promise<GetSurveyResponse> {
    const survey = await this.findSurveyById(surveyId);
    
    this.validateSurveyOwnership(survey, userId);
    
    const canResume = survey.status === 'draft' || survey.status === 'in_progress';
    const nextStage = canResume ? survey.currentStage : null;
    const validationErrors = this.validateSurveyData(survey);
    
    return {
      survey,
      canResume,
      nextStage,
      validationErrors
    };
  }

  // Finalizar encuesta
  async completeSurvey(surveyId: string, userId: string): Promise<Survey> {
    const survey = await this.findSurveyById(surveyId);
    
    // Validaciones finales
    const validationErrors = this.validateCompleteSurvey(survey);
    if (validationErrors.length > 0) {
      throw new ValidationError('Survey incomplete', validationErrors);
    }
    
    // Actualizar estado
    const completedSurvey = await this.surveyRepository.update(surveyId, {
      status: 'completed',
      progress: 100,
      completedAt: new Date()
    });
    
    // Actualizar estadísticas
    await this.updateSectorStats(survey.sector);
    await this.updateUserStats(userId);
    
    return completedSurvey;
  }
  
  // Métodos auxiliares
  private calculateProgress(stagesData: any[], totalStages: number): number {
    const completedStages = stagesData.filter(stage => stage.isValid).length;
    return Math.round((completedStages / totalStages) * 100);
  }
  
  private determineStatus(currentStage: number, totalStages: number, progress: number): string {
    if (progress === 0) return 'draft';
    if (progress === 100) return 'completed';
    return 'in_progress';
  }
  
  private updateStageData(existingStages: any[], newStageData: any): any[] {
    const existingIndex = existingStages.findIndex(s => s.stageId === newStageData.stageId);
    
    if (existingIndex >= 0) {
      existingStages[existingIndex] = {
        ...newStageData,
        completedAt: new Date()
      };
    } else {
      existingStages.push({
        ...newStageData,
        completedAt: new Date()
      });
    }
    
    return existingStages;
  }
}
```

### 3.2 Middleware de Validación

```typescript
// Middleware para validar datos de etapa
export const validateStageData = (req: Request, res: Response, next: NextFunction) => {
  const { currentStage, stageData } = req.body;
  
  // Validar estructura básica
  if (!currentStage || !stageData) {
    return res.status(400).json({
      error: 'Missing required fields: currentStage, stageData'
    });
  }
  
  // Validar datos específicos de la etapa
  const validationResult = validateStageFields(currentStage, stageData.fields);
  
  if (!validationResult.isValid) {
    return res.status(400).json({
      error: 'Stage data validation failed',
      details: validationResult.errors
    });
  }
  
  next();
};

// Validador específico por etapa
function validateStageFields(stageId: number, fields: Record<string, any>) {
  const stageValidators = {
    1: validateGeneralInfoStage,
    2: validateFamilyMembersStage,
    3: validateHousingStage,
    4: validateFinalStage
  };
  
  const validator = stageValidators[stageId];
  if (!validator) {
    return { isValid: false, errors: ['Unknown stage'] };
  }
  
  return validator(fields);
}
```

### 3.3 Configuración de Base de Datos

```sql
-- Tabla Surveys con campos para guardado incremental
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  family_id UUID REFERENCES families(id),
  
  -- Información básica
  sector VARCHAR(100) NOT NULL,
  family_head VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  family_size INTEGER NOT NULL,
  housing_type VARCHAR(100) NOT NULL,
  observations TEXT,
  
  -- Control de estado
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  current_stage INTEGER NOT NULL DEFAULT 1,
  total_stages INTEGER NOT NULL DEFAULT 4,
  progress INTEGER NOT NULL DEFAULT 0,
  
  -- Datos por etapa (JSONB para flexibilidad)
  stages_data JSONB NOT NULL DEFAULT '[]',
  family_members JSONB NOT NULL DEFAULT '[]',
  temp_data JSONB, -- Para guardado automático
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  last_auto_save TIMESTAMP,
  
  -- Control de versiones
  version INTEGER NOT NULL DEFAULT 1,
  last_saved_stage INTEGER DEFAULT 1,
  
  -- Índices
  INDEX idx_surveys_user_id (user_id),
  INDEX idx_surveys_status (status),
  INDEX idx_surveys_sector (sector),
  INDEX idx_surveys_progress (progress),
  INDEX idx_surveys_created_at (created_at)
);

-- Tabla de auditoría para cambios
CREATE TABLE survey_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  stage_id INTEGER,
  old_data JSONB,
  new_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 4. CONFIGURACIÓN DE SEGURIDAD

### 4.1 Autenticación JWT
```typescript
// JWT Configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  refreshTokenExpires: '7d'
};

// Middleware de autenticación
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### 4.2 Autorización por Roles
```typescript
// Middleware de autorización
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }
    next();
  };
};

// Middleware para ownership de encuestas
export const validateSurveyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  // Admins pueden acceder a todas las encuestas
  if (userRole === 'admin') {
    return next();
  }
  
  const survey = await Survey.findById(id);
  
  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }
  
  // Solo el creador o coordinadores del sector pueden modificar
  if (survey.userId !== userId && 
      !(userRole === 'coordinator' && survey.sector === req.user.sector)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};
```

---

## 5. CONFIGURACIÓN DE DESARROLLO

### 5.1 Variables de Entorno
```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/survey_db
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Servidor
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Upload
MAX_FILE_SIZE=5MB
UPLOAD_DIR=./uploads

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 5.2 Scripts de Desarrollo
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "ts-node prisma/seed.ts",
    "db:reset": "prisma migrate reset --force"
  }
}
```

---

## 6. TESTING

### 6.1 Test de Guardado Incremental
```typescript
describe('Survey Progressive Save', () => {
  
  test('should create new survey', async () => {
    const surveyData = {
      sector: 'La Esperanza',
      familyHead: 'María González',
      address: 'Calle 15 #23-45',
      familySize: 4,
      housingType: 'Casa propia'
    };
    
    const response = await request(app)
      .post('/surveys')
      .set('Authorization', `Bearer ${userToken}`)
      .send(surveyData);
    
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('draft');
    expect(response.body.currentStage).toBe(1);
    expect(response.body.progress).toBe(0);
  });
  
  test('should save stage progress', async () => {
    const stageData = {
      currentStage: 2,
      stageData: {
        stageId: 2,
        stageName: 'Información Familiar',
        fields: {
          motherName: 'Ana López',
          fatherName: 'Carlos González'
        },
        isValid: true
      }
    };
    
    const response = await request(app)
      .put(`/surveys/${surveyId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(stageData);
    
    expect(response.status).toBe(200);
    expect(response.body.currentStage).toBe(2);
    expect(response.body.progress).toBeGreaterThan(0);
  });
  
  test('should complete survey', async () => {
    const response = await request(app)
      .patch(`/surveys/${surveyId}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'completed' });
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('completed');
    expect(response.body.progress).toBe(100);
  });
});
```

---

## 7. DEPLOYMENT

### 7.1 Docker Configuration
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 7.2 Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/survey_db
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: survey_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

Este documento proporciona una guía completa para implementar el backend del sistema de encuestas con guardado incremental. El enfoque principal está en mantener el progreso del usuario en cada etapa y permitir la recuperación de encuestas incompletas.
