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
  this.setDataInverso = setDataInverso;
  this.nativeSort = nativeSort;
  this.swap = swap;

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
 * Este método simula el peor caso para muchos algoritmos de ordenamiento
 */
function setData() {
  for (var i = 0; i < this.numElements; ++i) {
    this.dataStore[i] = Math.floor(Math.random() * (this.numElements + 1));
  }
}

/**
 * Llena el arreglo con números en orden INVERSO (descendente)
 * Esto representa un caso especial donde los datos están completamente desordenados
 * en el sentido opuesto al orden objetivo
 */
function setDataInverso() {
  for (var i = 0; i < this.numElements; ++i) {
    // Asignar valores de mayor a menor: numElements, numElements-1, ..., 1, 0
    this.dataStore[i] = this.numElements - i;
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
 * Ordena el arreglo usando el método sort() nativo de JavaScript
 * El método sort() usa un algoritmo híbrido (generalmente Timsort en navegadores modernos)
 * que tiene complejidad O(n log n) en el caso promedio
 */
function nativeSort() {
  // La función de comparación es necesaria para ordenar números correctamente
  // Sin ella, sort() convierte los elementos a strings y ordena lexicográficamente
  this.dataStore.sort(function (a, b) {
    return a - b; // Orden ascendente
  });
}

// =============================================
// FUNCIONES DE PRUEBA Y ANÁLISIS
// =============================================

/**
 * Ejecuta una prueba de rendimiento del método sort() nativo con datos ALEATORIOS
 * Este caso representa el escenario más común donde los datos no tienen un orden predefinido
 *
 * @param {number} maxSize - Tamaño máximo del arreglo a probar
 * @param {number} step - Incremento en cada iteración (default: 10000)
 */
function testSortAleatorio(maxSize, step = 1000) {
  console.log("\n========================================");
  console.log("PRUEBA: Sort() con DATOS ALEATORIOS");
  console.log("========================================");

  for (var i = step; i <= maxSize; i += step) {
    // Crear y configurar arreglo de prueba con datos aleatorios
    var arreglo = new CArray(i);
    arreglo.setData(); // Llenar con números aleatorios

    // Medir tiempo de ejecución
    var start = performance.now();
    arreglo.nativeSort();
    var end = performance.now();

    // Calcular métricas
    var time = end - start;

    // Mostrar resultados
    console.log(
      `Tamaño: ${i.toLocaleString()} elementos | Tiempo: ${time.toFixed(3)} ms`
    );
  }
}

/**
 * Ejecuta una prueba de rendimiento del método sort() nativo con datos en ORDEN INVERSO
 * Este caso puede ser más desafiante para algunos algoritmos de ordenamiento,
 * aunque el método sort() moderno maneja este caso eficientemente
 *
 * @param {number} maxSize - Tamaño máximo del arreglo a probar
 * @param {number} step - Incremento en cada iteración (default: 10000)
 */
function testSortInverso(maxSize, step = 1000) {
  console.log("\n========================================");
  console.log("PRUEBA: Sort() con DATOS EN ORDEN INVERSO");
  console.log("========================================");

  for (var i = step; i <= maxSize; i += step) {
    // Crear y configurar arreglo de prueba con datos en orden inverso
    var arreglo = new CArray(i);
    arreglo.setDataInverso(); // Llenar con números en orden descendente

    // Medir tiempo de ejecución
    var start = performance.now();
    arreglo.nativeSort();
    var end = performance.now();

    // Calcular métricas
    var time = end - start;

    // Mostrar resultados
    console.log(
      `Tamaño: ${i.toLocaleString()} elementos | Tiempo: ${time.toFixed(3)} ms`
    );
  }
}

/**
 * Función de comparación completa que ejecuta ambas pruebas
 * y muestra un análisis comparativo de los resultados
 *
 * @param {number} maxSize - Tamaño máximo del arreglo a probar
 */
function compararRendimiento(maxSize) {
  console.log("\nAlgoritmo: Sort() nativo de JavaScript (Timsort)");
  console.log("Complejidad temporal: O(n log n)");
  console.log("Complejidad espacial: O(n)");

  // Ejecutar prueba con datos aleatorios
  testSortAleatorio(maxSize);

  // Ejecutar prueba con datos en orden inverso
  testSortInverso(maxSize);
}

// =============================================
// EJECUCIÓN DE PRUEBAS DE RENDIMIENTO
// =============================================

// Ejecutar comparación completa con arreglos de hasta 100,000 elementos
// Puedes modificar este valor según tus necesidades
compararRendimiento(1000000);
