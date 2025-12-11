#include <stdio.h>
#include <stdbool.h>

/**
 * ALGORITMO CERTIFICADOR PARA ORDENAMIENTO
 * 
 * Problema: Verificar si una lista está ordenada
 * Entrada s: arreglo de enteros
 * Certificado t: no se requiere (NULL)
 * Retorna: true si s está ordenado, false en caso contrario
 */

// CERTIFICADOR C(s, t) - Verifica si el arreglo está ordenado
bool certificador_ordenamiento(int s[], int n) {
    printf("Verificando si el arreglo está ordenado...\n\n");
    
    // Recorrer el arreglo y verificar que cada elemento sea <= al siguiente
    for (int i = 0; i < n - 1; i++) {
        printf("  Comparando: s[%d]=%d con s[%d]=%d\n", i, s[i], i+1, s[i+1]);
        
        if (s[i] > s[i + 1]) {
            printf("s[%d] > s[%d] (%d > %d)\n", i, i+1, s[i], s[i+1]);
            printf("\nEl arreglo NO está ordenado\n");
            return false;
        }
        printf("s[%d] <= s[%d]\n", i, i+1);
    }
    
    printf("\nEl arreglo está ordenado\n");
    return true;
}

// Función auxiliar para imprimir arreglos
void imprimir_arreglo(const char* nombre, int arr[], int n) {
    printf("%s: [", nombre);
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(", ");
    }
    printf("]\n");
}

int main() {
    // Caso 1: Lista ordenada ascendente
    printf("\n\nLista ordenada\n");
    int s1[] = {1, 3, 5, 7, 9};
    int n1 = 5;
    
    imprimir_arreglo("Entrada s", s1, n1);
    certificador_ordenamiento(s1, n1);
    
    // Caso 2: Lista desordenada
    printf("\n\nLista desordenada\n");
    int s2[] = {5, 2, 8, 1, 9};
    int n2 = 5;
    
    imprimir_arreglo("Entrada s", s2, n2);
    certificador_ordenamiento(s2, n2);
    
    // Caso 3: Lista con elementos repetidos (ordenada)
    printf("\n\nLista con repetidos (ordenada)\n");
    int s3[] = {1, 2, 2, 3, 5, 5, 8};
    int n3 = 7;
    
    imprimir_arreglo("Entrada s", s3, n3);
    certificador_ordenamiento(s3, n3);
    
    // Caso 4: Lista de un solo elemento
    printf("\n\nCASO 4: Un solo elemento\n");
    int s4[] = {42};
    int n4 = 1;
    
    imprimir_arreglo("Entrada s", s4, n4);
    certificador_ordenamiento(s4, n4);
    
    // Caso 5: Lista vacía (caso borde)
    printf("\n\nLista de dos elementos ordenados\n");
    int s5[] = {10, 20};
    int n5 = 2;
    
    imprimir_arreglo("Entrada s", s5, n5);
    certificador_ordenamiento(s5, n5);
    
    // Caso 6: Lista casi ordenada
    printf("\n\nLista casi ordenada\n");
    int s6[] = {1, 2, 3, 10, 5, 6};
    int n6 = 6;
    
    imprimir_arreglo("Entrada s", s6, n6);
    certificador_ordenamiento(s6, n6);

    return 0;
}