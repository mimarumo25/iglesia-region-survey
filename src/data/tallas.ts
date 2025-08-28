/**
 * Datos de tallas de vestimenta más utilizadas en Colombia
 * 
 * @description Este archivo contiene los datos estáticos de las tallas más comunes
 * utilizadas en Colombia para camisas/blusas, pantalones y calzado, basadas en
 * estándares nacionales e internacionales adoptados localmente.
 * 
 * @author Sistema MIA - Módulo de Tallas
 * @version 1.0.0
 */

import { TallasData } from '@/types/tallas';

/**
 * Datos completos de tallas organizados por categoría
 * Incluye las tallas más utilizadas en el mercado colombiano
 */
export const TALLAS_DATA: TallasData = {
  // ========== TALLAS DE CAMISAS/BLUSAS ==========
  camisas: [
    // Tallas numéricas colombianas
    { id: '6', nombre: '6', descripcion: 'Talla 6 - Muy pequeña', categoria: 'camisa', orden: 1 },
    { id: '8', nombre: '8', descripcion: 'Talla 8 - Pequeña', categoria: 'camisa', orden: 2 },
    { id: '10', nombre: '10', descripcion: 'Talla 10 - Mediana pequeña', categoria: 'camisa', orden: 3 },
    { id: '12', nombre: '12', descripcion: 'Talla 12 - Mediana', categoria: 'camisa', orden: 4 },
    { id: '14', nombre: '14', descripcion: 'Talla 14 - Mediana grande', categoria: 'camisa', orden: 5 },
    { id: '16', nombre: '16', descripcion: 'Talla 16 - Grande', categoria: 'camisa', orden: 6 },
    { id: '18', nombre: '18', descripcion: 'Talla 18 - Extra grande', categoria: 'camisa', orden: 7 },
    { id: '20', nombre: '20', descripcion: 'Talla 20 - Extra extra grande', categoria: 'camisa', orden: 8 },
    { id: '22', nombre: '22', descripcion: 'Talla 22 - XXL', categoria: 'camisa', orden: 9 },
    
    // Tallas internacionales adoptadas en Colombia
    { id: 'XS', nombre: 'XS', descripcion: 'Extra Small - Muy pequeña', categoria: 'camisa', orden: 10 },
    { id: 'S', nombre: 'S', descripcion: 'Small - Pequeña', categoria: 'camisa', orden: 11 },
    { id: 'M', nombre: 'M', descripcion: 'Medium - Mediana', categoria: 'camisa', orden: 12 },
    { id: 'L', nombre: 'L', descripcion: 'Large - Grande', categoria: 'camisa', orden: 13 },
    { id: 'XL', nombre: 'XL', descripcion: 'Extra Large - Extra grande', categoria: 'camisa', orden: 14 },
    { id: 'XXL', nombre: 'XXL', descripcion: 'Extra Extra Large - Muy grande', categoria: 'camisa', orden: 15 },
    { id: 'XXXL', nombre: 'XXXL', descripcion: 'Triple Extra Large - Super grande', categoria: 'camisa', orden: 16 },
  ],

  // ========== TALLAS DE PANTALONES ==========
  pantalones: [
    // Tallas de cintura en pulgadas (más comunes en Colombia)
    { id: '26', nombre: '26"', descripcion: 'Cintura 26 pulgadas', categoria: 'pantalon', orden: 1 },
    { id: '28', nombre: '28"', descripcion: 'Cintura 28 pulgadas', categoria: 'pantalon', orden: 2 },
    { id: '30', nombre: '30"', descripcion: 'Cintura 30 pulgadas', categoria: 'pantalon', orden: 3 },
    { id: '32', nombre: '32"', descripcion: 'Cintura 32 pulgadas', categoria: 'pantalon', orden: 4 },
    { id: '34', nombre: '34"', descripcion: 'Cintura 34 pulgadas', categoria: 'pantalon', orden: 5 },
    { id: '36', nombre: '36"', descripcion: 'Cintura 36 pulgadas', categoria: 'pantalon', orden: 6 },
    { id: '38', nombre: '38"', descripcion: 'Cintura 38 pulgadas', categoria: 'pantalon', orden: 7 },
    { id: '40', nombre: '40"', descripcion: 'Cintura 40 pulgadas', categoria: 'pantalon', orden: 8 },
    { id: '42', nombre: '42"', descripcion: 'Cintura 42 pulgadas', categoria: 'pantalon', orden: 9 },
    { id: '44', nombre: '44"', descripcion: 'Cintura 44 pulgadas', categoria: 'pantalon', orden: 10 },
    { id: '46', nombre: '46"', descripcion: 'Cintura 46 pulgadas', categoria: 'pantalon', orden: 11 },
    { id: '48', nombre: '48"', descripcion: 'Cintura 48 pulgadas', categoria: 'pantalon', orden: 12 },

    // Tallas numéricas colombianas para pantalón
    { id: '6P', nombre: '6', descripcion: 'Talla 6 - Muy pequeña', categoria: 'pantalon', orden: 13 },
    { id: '8P', nombre: '8', descripcion: 'Talla 8 - Pequeña', categoria: 'pantalon', orden: 14 },
    { id: '10P', nombre: '10', descripcion: 'Talla 10 - Mediana pequeña', categoria: 'pantalon', orden: 15 },
    { id: '12P', nombre: '12', descripcion: 'Talla 12 - Mediana', categoria: 'pantalon', orden: 16 },
    { id: '14P', nombre: '14', descripcion: 'Talla 14 - Mediana grande', categoria: 'pantalon', orden: 17 },
    { id: '16P', nombre: '16', descripcion: 'Talla 16 - Grande', categoria: 'pantalon', orden: 18 },
    { id: '18P', nombre: '18', descripcion: 'Talla 18 - Extra grande', categoria: 'pantalon', orden: 19 },

    // Tallas internacionales
    { id: 'XSP', nombre: 'XS', descripcion: 'Extra Small - Muy pequeña', categoria: 'pantalon', orden: 20 },
    { id: 'SP', nombre: 'S', descripcion: 'Small - Pequeña', categoria: 'pantalon', orden: 21 },
    { id: 'MP', nombre: 'M', descripcion: 'Medium - Mediana', categoria: 'pantalon', orden: 22 },
    { id: 'LP', nombre: 'L', descripcion: 'Large - Grande', categoria: 'pantalon', orden: 23 },
    { id: 'XLP', nombre: 'XL', descripcion: 'Extra Large - Extra grande', categoria: 'pantalon', orden: 24 },
    { id: 'XXLP', nombre: 'XXL', descripcion: 'Extra Extra Large - Muy grande', categoria: 'pantalon', orden: 25 },
  ],

  // ========== TALLAS DE CALZADO ==========
  calzado: [
    // Tallas colombianas/latinoamericanas estándar para hombres y mujeres
    { id: '34', nombre: '34', descripcion: 'Talla 34 - Equivale a US 4', categoria: 'calzado', orden: 1 },
    { id: '35', nombre: '35', descripcion: 'Talla 35 - Equivale a US 5', categoria: 'calzado', orden: 2 },
    { id: '36', nombre: '36', descripcion: 'Talla 36 - Equivale a US 6', categoria: 'calzado', orden: 3 },
    { id: '37', nombre: '37', descripcion: 'Talla 37 - Equivale a US 7', categoria: 'calzado', orden: 4 },
    { id: '38', nombre: '38', descripcion: 'Talla 38 - Equivale a US 8', categoria: 'calzado', orden: 5 },
    { id: '39', nombre: '39', descripcion: 'Talla 39 - Equivale a US 9', categoria: 'calzado', orden: 6 },
    { id: '40', nombre: '40', descripcion: 'Talla 40 - Equivale a US 10', categoria: 'calzado', orden: 7 },
    { id: '41', nombre: '41', descripcion: 'Talla 41 - Equivale a US 10.5', categoria: 'calzado', orden: 8 },
    { id: '42', nombre: '42', descripcion: 'Talla 42 - Equivale a US 11', categoria: 'calzado', orden: 9 },
    { id: '43', nombre: '43', descripcion: 'Talla 43 - Equivale a US 12', categoria: 'calzado', orden: 10 },
    { id: '44', nombre: '44', descripcion: 'Talla 44 - Equivale a US 13', categoria: 'calzado', orden: 11 },
    { id: '45', nombre: '45', descripcion: 'Talla 45 - Equivale a US 14', categoria: 'calzado', orden: 12 },
    { id: '46', nombre: '46', descripcion: 'Talla 46 - Equivale a US 15', categoria: 'calzado', orden: 13 },
    { id: '47', nombre: '47', descripcion: 'Talla 47 - Equivale a US 16', categoria: 'calzado', orden: 14 },

    // Tallas para niños (comunes en Colombia)
    { id: '21', nombre: '21', descripcion: 'Talla 21 - Niños pequeños', categoria: 'calzado', orden: 15 },
    { id: '22', nombre: '22', descripcion: 'Talla 22 - Niños pequeños', categoria: 'calzado', orden: 16 },
    { id: '23', nombre: '23', descripcion: 'Talla 23 - Niños pequeños', categoria: 'calzado', orden: 17 },
    { id: '24', nombre: '24', descripcion: 'Talla 24 - Niños', categoria: 'calzado', orden: 18 },
    { id: '25', nombre: '25', descripcion: 'Talla 25 - Niños', categoria: 'calzado', orden: 19 },
    { id: '26', nombre: '26', descripcion: 'Talla 26 - Niños', categoria: 'calzado', orden: 20 },
    { id: '27', nombre: '27', descripcion: 'Talla 27 - Niños', categoria: 'calzado', orden: 21 },
    { id: '28', nombre: '28', descripcion: 'Talla 28 - Niños', categoria: 'calzado', orden: 22 },
    { id: '29', nombre: '29', descripcion: 'Talla 29 - Niños', categoria: 'calzado', orden: 23 },
    { id: '30', nombre: '30', descripcion: 'Talla 30 - Niños/Adolescentes', categoria: 'calzado', orden: 24 },
    { id: '31', nombre: '31', descripcion: 'Talla 31 - Niños/Adolescentes', categoria: 'calzado', orden: 25 },
    { id: '32', nombre: '32', descripcion: 'Talla 32 - Adolescentes', categoria: 'calzado', orden: 26 },
    { id: '33', nombre: '33', descripcion: 'Talla 33 - Adolescentes', categoria: 'calzado', orden: 27 },
  ],
};

/**
 * Función helper para obtener las tallas más comunes por categoría
 * Útil para mostrar opciones por defecto o destacadas
 */
export const getTallasMasComunes = () => ({
  camisas: ['S', 'M', 'L', 'XL', '12', '14', '16'],
  pantalones: ['30', '32', '34', '36', 'M', 'L'],
  calzado: ['37', '38', '39', '40', '41', '42', '36']
});

/**
 * Función helper para buscar tallas por texto
 */
export const buscarTallas = (texto: string, categoria?: 'camisa' | 'pantalon' | 'calzado') => {
  const todasLasTallas = categoria 
    ? TALLAS_DATA[categoria === 'camisa' ? 'camisas' : categoria === 'pantalon' ? 'pantalones' : 'calzado']
    : [...TALLAS_DATA.camisas, ...TALLAS_DATA.pantalones, ...TALLAS_DATA.calzado];

  return todasLasTallas.filter(talla => 
    talla.nombre.toLowerCase().includes(texto.toLowerCase()) ||
    talla.descripcion?.toLowerCase().includes(texto.toLowerCase())
  );
};
