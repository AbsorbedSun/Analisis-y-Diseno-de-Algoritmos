#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Función auxiliar para obtener el máximo de dos números
int obtener_maximo(int a, int b) {
    return (a > b) ? a : b;
}

/**
 * Calcula la tabla de programación dinámica para el LCS
 * usando la ecuación de Bellman
 */
int** calcular_tabla_lcs(char *cadena1, char *cadena2, int longitud1, int longitud2) {
    // Asignar memoria dinámica para la tabla
    int** tabla = (int**)malloc((longitud1 + 1) * sizeof(int*));
    for (int i = 0; i <= longitud1; i++) {
        tabla[i] = (int*)malloc((longitud2 + 1) * sizeof(int));
    }
    
    // Inicializar primera fila y columna con ceros
    for (int i = 0; i <= longitud1; i++) {
        tabla[i][0] = 0;
    }
    for (int j = 0; j <= longitud2; j++) {
        tabla[0][j] = 0;
    }
    
    // Llenar la tabla con la ecuación de Bellman
    for (int i = 1; i <= longitud1; i++) {
        for (int j = 1; j <= longitud2; j++) {
            // Si los caracteres coinciden
            if (cadena1[i - 1] == cadena2[j - 1]) {
                tabla[i][j] = 1 + tabla[i - 1][j - 1];
            }
            // Si los caracteres NO coinciden
            else {
                tabla[i][j] = obtener_maximo(tabla[i - 1][j], tabla[i][j - 1]);
            }
        }
    }
    
    return tabla;
}

/**
 * Reconstruye la subsecuencia común más larga
 * a partir de la tabla de programación dinámica
 */
void reconstruir_subsecuencia(char *cadena1, char *cadena2, int longitud1, int longitud2, 
                              int** tabla, char *resultado) {
    int indice_i = longitud1;
    int indice_j = longitud2;
    int posicion = tabla[longitud1][longitud2];
    
    // Agregar terminador de cadena
    resultado[posicion] = '\0';
    
    // Recorrer la tabla desde abajo-derecha hacia arriba-izquierda
    while (indice_i > 0 && indice_j > 0) {
        // Si los caracteres coinciden, son parte del LCS
        if (cadena1[indice_i - 1] == cadena2[indice_j - 1]) {
            posicion--;
            resultado[posicion] = cadena1[indice_i - 1];
            indice_i--;
            indice_j--;
        }
        // Si no coinciden, moverse hacia el valor mayor
        else if (tabla[indice_i - 1][indice_j] > tabla[indice_i][indice_j - 1]) {
            indice_i--;
        }
        else {
            indice_j--;
        }
    }
}

/**
 * Muestra la tabla de programación dinámica de forma visual
 */
void mostrar_tabla_dp(char *cadena1, char *cadena2, int longitud1, int longitud2, int** tabla) {
    printf("\nTabla de Programacion Dinamica:\n");
    printf("      ");
    
    // Encabezado con caracteres de cadena2
    for (int j = 0; j < longitud2; j++) {
        printf("%3c", cadena2[j]);
    }
    printf("\n");
    
    // Filas de la tabla
    for (int i = 0; i <= longitud1; i++) {
        if (i == 0) {
            printf("  ");
        } else {
            printf("%2c", cadena1[i - 1]);
        }
        
        for (int j = 0; j <= longitud2; j++) {
            printf("%3d", tabla[i][j]);
        }
        printf("\n");
    }
}

/**
 * Libera la memoria de la tabla
 */
void liberar_tabla(int** tabla, int longitud1) {
    for (int i = 0; i <= longitud1; i++) {
        free(tabla[i]);
    }
    free(tabla);
}

/**
 * Función principal que resuelve el problema del LCS completo
 */
void resolver_lcs(char *cadena1, char *cadena2) {
    int longitud1 = strlen(cadena1);
    int longitud2 = strlen(cadena2);
    
    printf("Cadena 1: %s\n", cadena1);
    printf("Cadena 2: %s\n", cadena2);
    printf("\n");
    
    // Paso 1: Calcular la tabla de programación dinámica
    int** tabla = calcular_tabla_lcs(cadena1, cadena2, longitud1, longitud2);
    int longitud_lcs = tabla[longitud1][longitud2];
    
    printf("Longitud del LCS: %d\n", longitud_lcs);
    
    // Paso 2: Reconstruir la subsecuencia
    if (longitud_lcs > 0) {
        char* subsecuencia = (char*)malloc((longitud_lcs + 1) * sizeof(char));
        reconstruir_subsecuencia(cadena1, cadena2, longitud1, longitud2, tabla, subsecuencia);
        printf("Subsecuencia comun mas larga: '%s'\n", subsecuencia);
        free(subsecuencia);
    } else {
        printf("Subsecuencia comun mas larga: '' (vacia)\n");
    }
    
    // Paso 3: Mostrar la tabla
    mostrar_tabla_dp(cadena1, cadena2, longitud1, longitud2, tabla);
    
    // Liberar memoria
    liberar_tabla(tabla, longitud1);
}

int main() {
    
    char cadena1[100];
    char cadena2[100];
    
    printf("\nIngresa la primera cadena: ");
    if (scanf("%99s", cadena1) == 1) {
        printf("Ingresa la segunda cadena: ");
        if (scanf("%99s", cadena2) == 1) {
            printf("\n");
            resolver_lcs(cadena1, cadena2);
        }
    }
    
    return 0;
}