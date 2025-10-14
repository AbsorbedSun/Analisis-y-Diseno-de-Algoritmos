#include <stdio.h>
#include <time.h>

/**
 * Recorre el arreglo secuencialmente comparando cada elemento con el siguiente.
 * Cuando encuentra dos elementos consecutivos iguales, retorna ese valor.
 * 
 * Complejidad temporal:
 * - Mejor caso: O(1) - el duplicado está al inicio
 * - Peor caso: O(n) - el duplicado está al final o debemos recorrer todo
 * - Caso promedio: O(n/2) = O(n) - en promedio estará a la mitad
 */
int busquedaSecuencial(int arr[], int n) {
    // Recorremos el arreglo comparando elementos consecutivos
    for (int i = 0; i < n - 1; i++) {
        // Si el elemento actual es igual al siguiente, lo encontramos
        if (arr[i] == arr[i + 1]) {
            return arr[i];
        }
    }
    return -1; // No se (no debería ocurrir si el arreglo es válido)
}

/**
 * Búsqueda binaria
 * 
 * La idea clave: En un arreglo sin duplicados de 1 a n-1, el elemento
 * en la posición i debería ser i+1. Cuando hay un duplicado, esta propiedad
 * se rompe en algún punto.
 * 
 * Estrategia:
 * - Si arr[mid] > mid + 1: el duplicado está en la mitad izquierda
 * - Si arr[mid] == mid + 1: el duplicado está en la mitad derecha
 * - Seguimos dividiendo hasta encontrar dos elementos consecutivos iguales
 * 
 * Complejidad temporal:
 * - Mejor caso: O(1) - el duplicado está justo en el medio en la primera iteración
 * - Peor caso: O(log n) - debemos dividir el espacio de búsqueda varias veces
 * - Caso promedio: O(log n) - similar al peor caso
 */
int busquedaBinariaMod(int arr[], int inicio, int fin) {
    // Caso base: si solo quedan dos elementos, verificamos si son iguales
    if (inicio >= fin) {
        return -1;
    }
    
    // Si los elementos contiguos al inicio son iguales
    if (arr[inicio] == arr[inicio + 1]) {
        return arr[inicio];
    }
    
    // Si los elementos contiguos al final son iguales
    if (arr[fin] == arr[fin - 1]) {
        return arr[fin];
    }
    
    // Calculamos el punto medio
    int mid = inicio + (fin - inicio) / 2;
    
    // Verificamos si el duplicado está en el medio
    if (arr[mid] == arr[mid + 1]) {
        return arr[mid];
    }
    if (arr[mid] == arr[mid - 1]) {
        return arr[mid];
    }
    
    // Decidimos en qué mitad buscar:
    // Si arr[mid] es mayor que mid + 1, significa que ya pasamos el duplicado
    // (porque en un arreglo sin duplicados, arr[i] debería ser i+1)
    if (arr[mid] < mid + 1) {
        // El duplicado está en la mitad izquierda
        return busquedaBinariaMod(arr, inicio, mid - 1);
    } else {
        // El duplicado está en la mitad derecha
        return busquedaBinariaMod(arr, mid + 1, fin);
    }
}

// Función auxiliar para imprimir el arreglo
void imprimirArreglo(int arr[], int n) {
    printf("[");
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(", ");
    }
    printf("]\n");
}

int main() {
    // Ejemplo 1
    int arr1[] = {1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16};
    int n1 = (sizeof(arr1)/sizeof(arr1[0]));
    
    // Ejemplo 2
    int arr2[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16};
    int n2 = (sizeof(arr2)/sizeof(arr2[0]));
    
    // Ejemplo 3
    int arr3[] = {1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16};
    int n3 = (sizeof(arr3)/sizeof(arr3[0]));
    
    // Prueba 1
    printf("Arreglo 1: ");
    imprimirArreglo(arr1, n1);
    printf("Fuerza bruta: %d\n", busquedaSecuencial(arr1, n1));
    printf("Divide y vencerás: %d\n\n", busquedaBinariaMod(arr1, 0, n1-1));
    
    // Prueba 2
    printf("Arreglo 2: ");
    imprimirArreglo(arr2, n2);
    printf("Fuerza bruta: %d\n", busquedaSecuencial(arr2, n2));
    printf("Divide y vencerás: %d\n\n", busquedaBinariaMod(arr2, 0, n2-1));
    
    // Prueba 3
    printf("Arreglo 3: ");
    imprimirArreglo(arr3, n3);
    printf("Fuerza bruta: %d\n", busquedaSecuencial(arr3, n3));
    printf("Divide y vencerás: %d\n\n", busquedaBinariaMod(arr3, 0, n3-1));
    
    return 0;
}