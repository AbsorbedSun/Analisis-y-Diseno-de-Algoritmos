#include <stdio.h>
#include <time.h>
#include <stdlib.h>

/* 
Práctica 02 - Análisis y Diseño de Algoritmos - Garcia Ambrosio Aldo 3CM1 2025

Utilizando las funciones de medición de tiempo vistas en la práctica anterior, calcula el tiempo 
de ejecución de las siguientes funciones, considerando iteraciones de 1,000 a 1,000,000 con 
incrementos de 1,000 en 1,000. Es decir, debes incrementar n de 1,000 en 1,000. 
Debes obtener tres gráficas diferentes.

Ejecución: gcc "complejidadT.c" -o complejidadT
           ./complejidadT {numero} > salida.txt
Ejemplo:   ./complejidadT 100000 > numerosmillon.txt
*/

/*
void cicloSuma(int n)
Recibe: int n como el límite superior para el ciclo de incremento de 2 en 2
Devuelve: void (No retorna valor explícito)
Observaciones: Función que ejecuta un ciclo que incrementa de 2 en 2 desde 1 hasta n,
               midiendo el tiempo de ejecución. Tiene complejidad temporal O(n/2) ≈ O(n)
               debido a que itera aproximadamente n/2 veces.
*/
void cicloSuma(int n) {
    if (n <= 0) return;
    
    clock_t t = clock();
    
    int j = 0;
    // Ciclo que incrementa de 2 en 2 desde 1 hasta n
    for (int i = 1; i <= n; i += 2) {
        j++; // Contador de iteraciones (opcional para debugging)
    }
    
    t = clock() - t;
    double time_taken = ((double)t) / CLOCKS_PER_SEC;
    printf("A cicloSuma le tomó %f segundos ejecutarse", time_taken);
}

/*
void cicloMultiplicacion(int n)
Recibe: int n como el límite superior para el ciclo de multiplicación por 2
Devuelve: void (No retorna valor explícito)
Observaciones: Función que ejecuta un ciclo que multiplica por 2 en cada iteración desde 1 hasta n,
               midiendo el tiempo de ejecución. Tiene complejidad temporal O(log n) debido a que
               el número de iteraciones es logarítmico base 2 respecto a n.
*/
void cicloMultiplicacion(int n) {
    if (n <= 0) return;
    
    clock_t t = clock();
    
    int j = 0;
    // Ciclo que multiplica por 2 en cada iteración desde 1 hasta n
    for (int i = 1; i <= n; i *= 2) {
        j++; // Contador de iteraciones (opcional para debugging)
    }
    
    t = clock() - t;
    double time_taken = ((double)t) / CLOCKS_PER_SEC;
    printf("A cicloMultiplicacion le tomó %f segundos ejecutarse", time_taken);
}

/*
void cicloResta(int n)
Recibe: int n como el valor inicial para el ciclo de decremento de 2 en 2
Devuelve: void (No retorna valor explícito)
Observaciones: Función que ejecuta un ciclo que decrementa de 2 en 2 desde n hasta 0,
               midiendo el tiempo de ejecución. Tiene complejidad temporal O(n/2) ≈ O(n)
               debido a que itera aproximadamente n/2 veces.
*/
void cicloResta(int n) {
    if (n <= 0) return;
    
    clock_t t = clock();
    
    int j = 0;
    // Ciclo que decrementa de 2 en 2 desde n hasta 0
    for (int i = n; i > 0; i -= 2) {
        j++; // Contador de iteraciones (opcional para debugging)
    }
    
    t = clock() - t;
    double time_taken = ((double)t) / CLOCKS_PER_SEC;
    printf("A cicloResta le tomó %f segundos ejecutarse", time_taken);
}

/*
int main(int num_arg, char *arg_user[])
Recibe: int num_arg (número de argumentos de línea de comandos),
        char *arg_user[] (arreglo de argumentos de línea de comandos)
Devuelve: int (código de salida del programa, 0 indica ejecución exitosa)
Observaciones: Función principal que valida los argumentos de entrada, ejecuta las tres funciones
               de análisis de complejidad temporal y muestra los resultados de tiempo de ejecución.
               Requiere exactamente un argumento numérico positivo como parámetro.
*/
int main(int num_arg, char *arg_user[]) {
    
    // Validación del número de argumentos
    if (num_arg != 2) {
        printf("Uso: %s <numero_entero_positivo>\n", arg_user[0]);
        printf("Ejemplo: %s 1000\n", arg_user[0]);
        exit(1);
    }
    
    // Conversión del argumento a entero
    int n = atoi(arg_user[1]);
    
    // Validación de que el número sea positivo
    if (n <= 0) {
        printf("Error: el número debe ser positivo (mayor que 0)\n");
        exit(1);
    }
    
    printf("\nInicia la prueba de complejidad con n = %d\n", n);
    
    // Ejecutar los diferentes tipos de ciclos y medir sus tiempos
    printf("\n");
    cicloSuma(n);          // Complejidad O(n/2) ≈ O(n)
    printf("\n");
    cicloMultiplicacion(n); // Complejidad O(log n)
    printf("\n");
    cicloResta(n);         // Complejidad O(n/2) ≈ O(n)
    
    printf("\n\nPrueba completada.\n");
    return 0;
}