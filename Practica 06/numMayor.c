#include <stdio.h>
#include <stdlib.h>

/** 
 * Para cada elemento del arreglo, contamos cuántas veces aparece
 * en todo el arreglo. Si aparece más de n/2 veces, es el mayoritario.
 * 
 * Funcionamiento:
 * - Tomamos cada elemento como candidato
 * - Contamos sus apariciones en todo el arreglo
 * - Si el conteo supera n/2, lo retornamos
 * 
 * Complejidad temporal:
 * - Mejor caso: O(n) - el primer elemento es el mayoritario y aparece
 *   en más de n/2 posiciones, lo verificamos rápidamente
 * - Peor caso: O(n²) - debemos contar las apariciones de cada elemento
 * - Caso promedio: O(n²) - en promedio revisamos varios candidatos
 * 
 * Complejidad espacial: O(1) - solo usamos variables auxiliares
 */
int comparacionFuerzaB(int arr[], int n) {
    // Iteramos sobre cada elemento como posible candidato
    for (int i = 0; i < n; i++) {
        int candidato = arr[i];
        int conteo = 0;
        
        // Contamos cuántas veces aparece este candidato
        for (int j = 0; j < n; j++) {
            if (arr[j] == candidato) {
                conteo++;
            }
        }
        
        // Si aparece más de n/2 veces, es el mayoritario
        if (conteo > n / 2) {
            return candidato;
        }
    }
    
    return -1; // No debería llegar aquí si existe elemento mayoritario
}

/**
 * FUNCIÓN AUXILIAR para contar apariciones de un elemento en un rango
 * Usada por el algoritmo de divide y vencerás
 */
int contarApariciones(int arr[], int inicio, int fin, int elemento) {
    int conteo = 0;
    for (int i = inicio; i <= fin; i++) {
        if (arr[i] == elemento) {
            conteo++;
        }
    }
    return conteo;
}

/**
 * DIVIDE Y VENCERÁS
 * 
 * La idea  es dividir el arreglo en dos mitades y aplicar el principio 
 * de que si un elemento es mayoritario en el arreglo completo,
 * debe ser mayoritario en al menos una de las dos mitades.
 * 
 * - Si un elemento aparece más de n/2 veces en un arreglo de tamaño n,
 *   entonces DEBE aparecer más de (n/2)/2 veces en al menos una mitad.
 * - Esto es porque si apareciera menos en ambas mitades, no podría
 *   sumar más de n/2 en total.
 * 
 * Algoritmo paso a paso:
 * 1. Caso base: si el arreglo tiene un solo elemento, ese es el mayoritario
 * 2. Dividimos el arreglo en dos mitades (izquierda y derecha)
 * 3. Recursivamente encontramos el mayoritario de cada mitad
 * 4. Verificamos cuál de estos candidatos aparece más de n/2 veces
 *    en el arreglo completo
 * 
 * Complejidad temporal:
 * - La relación de recurrencia es: T(n) = 2T(n/2) + O(n)
 *   Donde 2T(n/2) son las dos llamadas recursivas y O(n) es contar apariciones
 * - Por el teorema maestro (caso 2): T(n) = O(n log n)
 * - Mejor caso: O(n log n) - no podemos evitar la recursión
 * - Peor caso: O(n log n) - siempre dividimos completamente
 * - Caso promedio: O(n log n) - similar al peor caso
 * 
 * Complejidad espacial: O(log n) por la pila de recursión
 */
int divideVencerasMayor(int arr[], int inicio, int fin) {
    // Caso base: si solo hay un elemento, ese es el mayoritario
    if (inicio == fin) {
        return arr[inicio];
    }
    
    // Dividimos el arreglo en dos mitades
    int mid = inicio + (fin - inicio) / 2;
    
    // Recursivamente encontramos el mayoritario en cada mitad
    int mayoritarioIzq = divideVencerasMayor(arr, inicio, mid);
    int mayoritarioDer = divideVencerasMayor(arr, mid + 1, fin);
    
    // Si ambas mitades tienen el mismo mayoritario, ese es el resultado
    if (mayoritarioIzq == mayoritarioDer) {
        return mayoritarioIzq;
    }
    
    // Si son diferentes, debemos verificar cuál es realmente mayoritario
    // en el rango completo [inicio, fin]
    int conteoIzq = contarApariciones(arr, inicio, fin, mayoritarioIzq);
    int conteoD = contarApariciones(arr, inicio, fin, mayoritarioDer);
    
    int longitudRango = fin - inicio + 1;
    
    // Retornamos el que aparece más de (longitudRango / 2) veces
    if (conteoIzq > longitudRango / 2) {
        return mayoritarioIzq;
    }
    if (conteoD > longitudRango / 2) {
        return mayoritarioDer;
    }
    
    // No debería llegar aquí si existe elemento mayoritario
    return -1;
}


// Función auxiliar para imprimir arreglos
void imprimirArreglo(int arr[], int n) {
    printf("[");
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(", ");
    }
    printf("]\n");
}

int main() {
    
    // Caso 1
    int arr1[] = {3, 3, 4, 2, 4, 4, 2, 4, 4};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    
    // Caso 2
    int arr2[] = {2, 2, 2, 2, 1, 3, 5};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    
    // Caso 3
    int arr3[] = {1, 2, 1, 3, 1, 4, 1, 5, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    
    // Caso 4
    int arr4[] = {7, 7, 7, 7, 7};
    int n4 = sizeof(arr4) / sizeof(arr4[0]);
    
    printf("Arreglo 1: ");
    imprimirArreglo(arr1, n1);
    int resultado1a = comparacionFuerzaB(arr1, n1);
    int resultado1b = divideVencerasMayor(arr1, 0, n1 - 1);
    printf("Fuerza bruta: %d\n", resultado1a);
    printf("Divide y vencerás: %d\n", resultado1b);
    
    printf("Arreglo 2: ");
    imprimirArreglo(arr1, n1);
    int resultado1a = comparacionFuerzaB(arr2, n2);
    int resultado1b = divideVencerasMayor(arr2, 0, n2 - 1);
    printf("Fuerza bruta: %d\n", resultado1a);
    printf("Divide y vencerás: %d\n", resultado1b);
    
    return 0;
}