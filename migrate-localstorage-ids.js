/**
 * Script de Migración de localStorage - IDs String → IDs Number
 * 
 * Ejecutar este script en DevTools Console para migrar datos antiguos
 * que tienen IDs como strings a la nueva estructura con IDs numéricos.
 * 
 * USO:
 * 1. Abrir DevTools (F12)
 * 2. Ir a pestaña Console
 * 3. Copiar y pegar este código completo
 * 4. Presionar Enter
 * 5. Ver resultado de la migración
 */

(function migrateLocalStorageIDs() {
  console.log('🔄 Iniciando migración de IDs en localStorage...\n');
  
  /**
   * Normaliza un ConfigurationItem para asegurar ID numérico
   */
  function normalizeConfigItem(item) {
    if (!item || typeof item !== 'object') return item;
    if (!item.id) return item;
    
    const numericId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
    
    if (isNaN(numericId)) {
      console.warn('⚠️  ID no válido encontrado:', item);
      return item;
    }
    
    return {
      ...item,
      id: numericId
    };
  }
  
  /**
   * Normaliza un array de DynamicSelectionItems
   */
  function normalizeDynamicSelection(items) {
    if (!Array.isArray(items)) return items;
    
    return items.map(item => normalizeConfigItem(item));
  }
  
  /**
   * Normaliza un FamilyMember completo
   */
  function normalizeFamilyMember(member) {
    if (!member || typeof member !== 'object') return member;
    
    return {
      ...member,
      // ConfigurationItems
      tipoIdentificacion: normalizeConfigItem(member.tipoIdentificacion),
      sexo: normalizeConfigItem(member.sexo),
      parentesco: normalizeConfigItem(member.parentesco),
      situacionCivil: normalizeConfigItem(member.situacionCivil),
      estudio: normalizeConfigItem(member.estudio),
      comunidadCultural: normalizeConfigItem(member.comunidadCultural),
      profesionMotivoFechaCelebrar: member.profesionMotivoFechaCelebrar ? {
        ...member.profesionMotivoFechaCelebrar,
        profesion: normalizeConfigItem(member.profesionMotivoFechaCelebrar.profesion)
      } : member.profesionMotivoFechaCelebrar,
      // Arrays con IDs
      enfermedades: Array.isArray(member.enfermedades) 
        ? member.enfermedades.map(e => normalizeConfigItem(e))
        : member.enfermedades,
      habilidades: Array.isArray(member.habilidades)
        ? member.habilidades.map(h => normalizeConfigItem(h))
        : member.habilidades,
      destrezas: Array.isArray(member.destrezas)
        ? member.destrezas.map(d => normalizeConfigItem(d))
        : member.destrezas
    };
  }
  
  // Obtener datos del localStorage
  const draftKey = 'parish-survey-draft';
  const sessionKey = 'surveySessionData';
  
  let migrated = false;
  let changes = {
    informacionGeneral: 0,
    vivienda: 0,
    servicios_agua: 0,
    familyMembers: 0,
    deceasedMembers: 0
  };
  
  // Migrar parish-survey-draft
  try {
    const draftData = localStorage.getItem(draftKey);
    if (draftData) {
      const data = JSON.parse(draftData);
      
      console.log('📦 Datos encontrados en localStorage:', draftKey);
      
      if (data.informacionGeneral) {
        const oldMunicipio = JSON.stringify(data.informacionGeneral.municipio);
        const oldSector = JSON.stringify(data.informacionGeneral.sector);
        
        // Normalizar informacionGeneral
        data.informacionGeneral.municipio = normalizeConfigItem(data.informacionGeneral.municipio);
        data.informacionGeneral.parroquia = normalizeConfigItem(data.informacionGeneral.parroquia);
        data.informacionGeneral.sector = normalizeConfigItem(data.informacionGeneral.sector);
        data.informacionGeneral.vereda = normalizeConfigItem(data.informacionGeneral.vereda);
        data.informacionGeneral.corregimiento = normalizeConfigItem(data.informacionGeneral.corregimiento);
        data.informacionGeneral.centro_poblado = normalizeConfigItem(data.informacionGeneral.centro_poblado);
        
        if (oldMunicipio !== JSON.stringify(data.informacionGeneral.municipio)) changes.informacionGeneral++;
        if (oldSector !== JSON.stringify(data.informacionGeneral.sector)) changes.informacionGeneral++;
        
        migrated = true;
      }
      
      if (data.vivienda) {
        const oldTipo = JSON.stringify(data.vivienda.tipo_vivienda);
        const oldDisposicion = JSON.stringify(data.vivienda.disposicion_basuras);
        
        // Normalizar vivienda
        data.vivienda.tipo_vivienda = normalizeConfigItem(data.vivienda.tipo_vivienda);
        data.vivienda.disposicion_basuras = normalizeDynamicSelection(data.vivienda.disposicion_basuras);
        
        if (oldTipo !== JSON.stringify(data.vivienda.tipo_vivienda)) changes.vivienda++;
        if (oldDisposicion !== JSON.stringify(data.vivienda.disposicion_basuras)) changes.vivienda++;
        
        migrated = true;
      }
      
      if (data.servicios_agua) {
        const oldAcueducto = JSON.stringify(data.servicios_agua.sistema_acueducto);
        
        // Normalizar servicios_agua
        data.servicios_agua.sistema_acueducto = normalizeConfigItem(data.servicios_agua.sistema_acueducto);
        data.servicios_agua.aguas_residuales = normalizeDynamicSelection(data.servicios_agua.aguas_residuales);
        
        if (oldAcueducto !== JSON.stringify(data.servicios_agua.sistema_acueducto)) changes.servicios_agua++;
        
        migrated = true;
      }
      
      if (Array.isArray(data.familyMembers)) {
        const oldCount = data.familyMembers.length;
        data.familyMembers = data.familyMembers.map(normalizeFamilyMember);
        changes.familyMembers = oldCount;
        migrated = true;
      }
      
      if (Array.isArray(data.deceasedMembers)) {
        const oldCount = data.deceasedMembers.length;
        data.deceasedMembers = data.deceasedMembers.map(member => ({
          ...member,
          sexo: normalizeConfigItem(member.sexo),
          parentesco: normalizeConfigItem(member.parentesco)
        }));
        changes.deceasedMembers = oldCount;
        migrated = true;
      }
      
      // Guardar datos migrados
      if (migrated) {
        localStorage.setItem(draftKey, JSON.stringify(data));
        console.log('✅ Datos migrados exitosamente\n');
        
        console.log('📊 RESUMEN DE CAMBIOS:');
        console.log(`   - Información General: ${changes.informacionGeneral} campos actualizados`);
        console.log(`   - Vivienda: ${changes.vivienda} campos actualizados`);
        console.log(`   - Servicios Agua: ${changes.servicios_agua} campos actualizados`);
        console.log(`   - Miembros Familia: ${changes.familyMembers} miembros procesados`);
        console.log(`   - Difuntos: ${changes.deceasedMembers} registros procesados\n`);
        
        // Mostrar ejemplo de migración
        if (data.informacionGeneral?.municipio) {
          console.log('📋 EJEMPLO DE MIGRACIÓN:');
          console.log('   Municipio:', data.informacionGeneral.municipio);
          console.log('   Tipo de ID:', typeof data.informacionGeneral.municipio.id);
          console.log('   ✅ ID es número:', typeof data.informacionGeneral.municipio.id === 'number' ? 'SÍ' : 'NO');
        }
        
        console.log('\n🎉 MIGRACIÓN COMPLETADA');
        console.log('💡 Recarga la página para aplicar los cambios');
      } else {
        console.log('ℹ️  No se encontraron datos para migrar');
      }
    } else {
      console.log('ℹ️  No hay datos guardados en localStorage');
    }
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
})();
