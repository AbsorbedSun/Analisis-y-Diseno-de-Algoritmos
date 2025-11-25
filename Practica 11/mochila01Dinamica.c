/*  
  mochilaDinamica.c
  
  Programa que resuelve el problema de la mochila 0/1 mediante programación dinámica.
  Dados n objetos, cada uno con un peso y un valor, se busca determinar la combinación de objetos que
  maximice el valor total sin exceder la capacidad de la mochila.
  
  Complejidad: O(n*W) donde n es el número de objetos y W la capacidad de la mochila
*/

#include <stdio.h>
#include <stdlib.h>

// Prototipos de funciones
int mochilaDinamica(int *pesos, int *valores, int n, int capacidadMaxima, int *solucion);
int maximo(int a, int b);

/*
int main(int num_arg, char *arg_user[])
Recibe: int num_arg como el total de argumentos ingresados al programa y char *arg_user[] 
como un arreglo que almacena los argumentos de entrada del programa.
Devuelve: 0 si termina correctamente, 1 si hay algún error
Observaciones: Función principal que valida los argumentos, crea los arreglos de pesos y valores,
invoca el algoritmo de programación dinámica y libera la memoria al finalizar.
*/
int main(int num_arg, char *arg_user[]) {
    // Verificar argumentos
    if (num_arg != 3) {
        printf("\nIndique el peso maximo de la mochila y la cantidad de elementos - Ejemplo: %s K n < datos.txt\n", arg_user[0]);
        exit(1);
    }
    
    // Obtener peso máximo de la mochila (W) y número de elementos (n)
    int pesoMaximo = atoi(arg_user[1]);
    int n = atoi(arg_user[2]);
    
    // Reservar memoria para los arreglos de pesos y valores
    int *pesos = malloc(n * sizeof(int));
    int *valores = malloc(n * sizeof(int));
    int *solucion = malloc(n * sizeof(int));
    
    // Verificar si la asignación de memoria fue exitosa
    if (pesos == NULL || valores == NULL || solucion == NULL) {
        printf("Error: No se pudo asignar memoria\n");
        exit(1);
    }
    
    // Inicializar el arreglo de solución con ceros
    for (int i = 0; i < n; i++) {
        solucion[i] = 0;
    }
    
    // Leer pesos y valores desde la entrada estándar
    for (int i = 0; i < n; i++) {
        scanf("%d", &pesos[i]);
    }
    
    for (int i = 0; i < n; i++) {
        scanf("%d", &valores[i]);
    }
    
    // Mostrar datos de entrada
    printf("\nDatos de entrada:\n");
    printf("Peso maximo de la mochila (W): %d\n", pesoMaximo);
    printf("Cantidad de elementos (n): %d\n", n);
    printf("Pesos y valores de los objetos:\n");
    for (int i = 0; i < n; i++) {
        printf("Objeto %d: peso = %d, valor = %d\n", i+1, pesos[i], valores[i]);
    }
    printf("\n");
    
    // Llamamos a la función para resolver el problema de la mochila
    int maxValue = mochilaDinamica(pesos, valores, n, pesoMaximo, solucion);
    
    // Imprimimos el resultado
    printf("\nLa maxima ganancia posible es: %d\n", maxValue);
    for (int i = 0; i < n; i++) {
        if (solucion[i] == 1)
            printf("Objeto %d incluido (peso = %d, valor = %d)\n", i+1, pesos[i], valores[i]);
    }
    
    // Liberar memoria asignada
    free(pesos);
    free(valores);
    free(solucion);
    
    return 0;
}

/* 
int maximo(int a, int b)
Recibe: dos enteros a y b
Devuelve: el valor máximo entre a y b
Observaciones: Función auxiliar para comparar dos valores
*/
int maximo(int a, int b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

/* 
int mochilaDinamica(int *pesos, int *valores, int n, int capacidadMaxima, int *solucion)
Recibe: int *pesos como arreglo de pesos, int *valores como arreglo de valores, 
n como número total de objetos, capacidadMaxima como capacidad de la mochila,
int *solucion como arreglo donde se guardará la solución (objetos seleccionados).
Devuelve: int que representa el valor máximo que se puede obtener
Observaciones: Función que implementa el algoritmo de programación dinámica bottom-up.
Construye una tabla M[i][w] donde M[i][w] representa el valor óptimo considerando 
los primeros i objetos con capacidad w. Después realiza traceback para encontrar
qué objetos forman parte de la solución óptima.
*/
int mochilaDinamica(int *pesos, int *valores, int n, int capacidadMaxima, int *solucion) {
    // Crear tabla de programación dinámica M[i][w]
    // M[i][w] = valor óptimo con objetos 1..i y capacidad w
    int **M = malloc((n + 1) * sizeof(int*));
    
    // Verificar asignación de memoria
    if (M == NULL) {
        printf("Error: No se pudo asignar memoria para la tabla\n");
        exit(1);
    }
    
    // Asignar memoria para cada fila
    for (int i = 0; i <= n; i++) {
        M[i] = malloc((capacidadMaxima + 1) * sizeof(int));
        if (M[i] == NULL) {
            printf("Error: No se pudo asignar memoria para la tabla\n");
            exit(1);
        }
    }
    
    // Inicializar primera fila: sin objetos, valor = 0
    for (int w = 0; w <= capacidadMaxima; w++) {
        M[0][w] = 0;
    }
    
    // Llenar la tabla usando programación dinámica (bottom-up)
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacidadMaxima; w++) {
            // Si el peso del objeto i-1 es mayor que la capacidad w
            if (pesos[i-1] > w) {
                // No podemos incluir el objeto, tomamos el valor anterior
                M[i][w] = M[i-1][w];
            } else {
                // Podemos elegir: incluir o no incluir el objeto
                // Caso 1: No incluir el objeto i-1
                int valorSinObjeto = M[i-1][w];
                
                // Caso 2: Incluir el objeto i-1
                int valorConObjeto = valores[i-1] + M[i-1][w - pesos[i-1]];
                
                // Tomamos el máximo de ambas opciones
                M[i][w] = maximo(valorSinObjeto, valorConObjeto);
            }
        }
    }
    
    // El valor óptimo está en M[n][capacidadMaxima]
    int resultadoOptimo = M[n][capacidadMaxima];
    
// Proceso de traceback para determinar qué objetos fueron seleccionados

    // Comenzamos desde M[n][capacidadMaxima] y retrocedemos
    int w = capacidadMaxima;
    for (int i = n; i > 0; i--) {
        // Si el valor en M[i][w] es diferente al valor en M[i-1][w],
        // significa que el objeto i-1 fue incluido en la solución
        if (M[i][w] != M[i-1][w]) {
            solucion[i-1] = 1;              // Marcamos el objeto como incluido
            w = w - pesos[i-1];             // Reducimos la capacidad disponible
        } else {
            solucion[i-1] = 0;              // El objeto no fue incluido
        }
    }
    
    // Liberar memoria de la tabla
    for (int i = 0; i <= n; i++) {
        free(M[i]);
    }
    free(M);
    
    return resultadoOptimo;
}