/**
 * =============================================
 * IMPLEMENTACIÓN DE INSERTION SORT EN JAVASCRIPT
 * =============================================
 *
 * Este programa implementa el algoritmo de ordenamiento Insertion Sort
 * y proporciona herramientas para medir su rendimiento.
 *
 * Complejidad temporal: O(n²) en el peor caso
 * Complejidad espacial: O(1) - ordenamiento in-place
 */

// =============================================
// DEFINICIÓN DE LA CLASE CARRAY
// =============================================

/**
 * Constructor de la clase CArray
 * Crea un arreglo dinámico con funciones de ordenamiento
 *
 * @param {number} numElements - Número de elementos del arreglo
 */
function CArray(numElements) {
  this.dataStore = []; // Almacén de datos del arreglo
  this.pos = 0; // Posición actual para inserción
  this.numElements = numElements; // Tamaño total del arreglo

  // Asignación de métodos al objeto
  this.insert = insert;
  this.toString = toString;
  this.clear = clear;
  this.setData = setData;
  this.swap = swap;
  this.insertionSort = insertionSort;

  // Inicialización del arreglo con valores secuenciales
  for (var i = 0; i < numElements; ++i) {
    this.dataStore[i] = i;
  }
}

// =============================================
// MÉTODOS DE LA CLASE CARRAY
// =============================================

/**
 * Llena el arreglo con números aleatorios
 * Rango: 0 a numElements
 */
function setData() {
  for (var i = 0; i < this.numElements; ++i) {
    this.dataStore[i] = Math.floor(Math.random() * (this.numElements + 1));
  }
}

/**
 * Limpia el arreglo estableciendo todos los elementos a 0
 */
function clear() {
  for (var i = 0; i < this.dataStore.length; ++i) {
    this.dataStore[i] = 0;
  }
}

/**
 * Inserta un elemento en la posición actual y avanza el índice
 * @param {*} element - Elemento a insertar
 */
function insert(element) {
  this.dataStore[this.pos++] = element;
}

/**
 * Convierte el arreglo a string para visualización
 * Formato: 10 elementos por línea
 * @returns {string} Representación en string del arreglo
 */
function toString() {
  var retstr = "";
  for (var i = 0; i < this.dataStore.length; ++i) {
    retstr += this.dataStore[i] + " ";
    // Nueva línea cada 10 elementos para mejor legibilidad
    if (i > 0 && i % 10 == 0) {
      retstr += "\n";
    }
  }
  return retstr;
}

/**
 * Intercambia dos elementos en un arreglo
 * @param {Array} arr - Arreglo donde intercambiar
 * @param {number} index1 - Primer índice
 * @param {number} index2 - Segundo índice
 */
function swap(arr, index1, index2) {
  var temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
}

/**
 * Implementación del algoritmo Insertion Sort
 *
 * FUNCIONAMIENTO:
 * 1. Comienza desde el segundo elemento (índice 1)
 * 2. Compara cada elemento con los anteriores
 * 3. Desplaza elementos mayores hacia la derecha
 * 4. Inserta el elemento en su posición correcta
 *
 * Complejidad: O(n²) peor caso, O(n) mejor caso (arreglo ya ordenado)
 */
function insertionSort() {
  var temp, inner;

  // Recorre desde el segundo elemento hasta el final
  for (var outer = 1; outer <= this.dataStore.length - 1; ++outer) {
    temp = this.dataStore[outer]; // Elemento a insertar
    inner = outer; // Posición de búsqueda

    // Desplaza elementos mayores hacia la derecha
    while (inner > 0 && this.dataStore[inner - 1] >= temp) {
      this.dataStore[inner] = this.dataStore[inner - 1];
      --inner;
    }

    // Inserta el elemento en su posición correcta
    this.dataStore[inner] = temp;
  }
}

// =============================================
// FUNCIÓN DE PRUEBA DE RENDIMIENTO
// =============================================

/**
 * Ejecuta una prueba de rendimiento del algoritmo Insertion Sort
 *
 * @param {number} size - Tamaño del arreglo a probar
 * @returns {Object} Resultado con métricas de rendimiento
 */
function testInsertionSort(size) {
  for (var i = 10000; i <= size; i += 10000) {
    // Crear y configurar arreglo de prueba
    var arreglo = new CArray(i);
    arreglo.setData(); // Llenar con datos aleatorios

    // Medir tiempo de ejecución
    var start = performance.now();
    arreglo.insertionSort();
    var end = performance.now();

    // Calcular métricas
    var time = end - start;

    // Mostrar resultados
    console.log(`Tamaño: ${i.toLocaleString()} elementos`);
    console.log(`Tiempo total: ${time.toFixed(2)} ms`);
  }
}

// =============================================
// EJECUCIÓN DE EJEMPLO
// =============================================

//console.log("============================");
console.log("Algoritmo: Insertion Sort");
console.log("Complejidad: O(n²)");
console.log("Tipo: Ordenamiento por inserción");
//console.log("============================\n");

// Ejecutar prueba con arreglo
var resultado = testInsertionSort(1000000);
