#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Definición de la estructura para representar una actividad
typedef struct {
    char nombre;           // Identificador de la actividad
    int inicio;           // Tiempo de inicio
    int fin;              // Tiempo de finalización
} Actividad;

// Función para calcular la duración de una actividad
int calcularDuracion(Actividad a) {
    return a.fin - a.inicio;
}

// Función de comparación para ordenar por tiempo de inicio
int compararPorInicio(const void *a, const void *b) {
    Actividad *act1 = (Actividad *)a;
    Actividad *act2 = (Actividad *)b;
    return act1->inicio - act2->inicio;
}

// Función de comparación para ordenar por tiempo de finalización
int compararPorFin(const void *a, const void *b) {
    Actividad *act1 = (Actividad *)a;
    Actividad *act2 = (Actividad *)b;
    return act1->fin - act2->fin;
}

// Función de comparación para ordenar por duración (menor a mayor)
int compararPorDuracion(const void *a, const void *b) {
    Actividad *act1 = (Actividad *)a;
    Actividad *act2 = (Actividad *)b;
    int duracion1 = calcularDuracion(*act1);
    int duracion2 = calcularDuracion(*act2);
    return duracion1 - duracion2;
}

// Función que verifica si dos actividades son compatibles (no se traslapan)
int sonCompatibles(Actividad a1, Actividad a2) {
    // Dos actividades son compatibles si una termina antes o cuando la otra empieza
    return (a1.fin <= a2.inicio || a2.fin <= a1.inicio);
}

// Función que implementa el algoritmo ávido para seleccionar actividades
void seleccionarActividades(Actividad actividades[], int n, int criterio) {
    // Crear una copia del arreglo para no modificar el original
    Actividad *copia = (Actividad *)malloc(n * sizeof(Actividad));
    memcpy(copia, actividades, n * sizeof(Actividad));
    
    // Ordenar según el criterio seleccionado
    switch(criterio) {
        case 1:
            printf("\n Criterio de Tiempo de Inicio\n");
            qsort(copia, n, sizeof(Actividad), compararPorInicio);
            break;
        case 2:
            printf("\n Criterio de Tiempo de FInalizacion\n");
            qsort(copia, n, sizeof(Actividad), compararPorFin);
            break;
        case 3:
            printf("\n Criterio de Tiempo de Duracion\n");
            qsort(copia, n, sizeof(Actividad), compararPorDuracion);
            break;
    }
    
    // Mostrar el orden después de ordenar
    printf("Orden de consideracion: ");
    for(int i = 0; i < n; i++) {
        printf("%c ", copia[i].nombre);
    }
    printf("\n\n");
    
    // Arreglo para guardar las actividades seleccionadas
    Actividad *seleccionadas = (Actividad *)malloc(n * sizeof(Actividad));
    int numSeleccionadas = 0;
    
    // Algoritmo ávido: recorrer las actividades ordenadas
    for(int i = 0; i < n; i++) {
        int esCompatible = 1; // Bandera para verificar compatibilidad
        
        // Verificar si la actividad actual es compatible con todas las ya seleccionadas
        for(int j = 0; j < numSeleccionadas; j++) {
            if(!sonCompatibles(copia[i], seleccionadas[j])) {
                esCompatible = 0;
                break;
            }
        }
        
        // Si es compatible, agregarla a la solución
        if(esCompatible) {
            seleccionadas[numSeleccionadas] = copia[i];
            numSeleccionadas++;
            printf("Seleccionada: %c [%d, %d] - Duracion: %d\n", 
                   copia[i].nombre, copia[i].inicio, copia[i].fin, 
                   calcularDuracion(copia[i]));
        } else {
            printf("Rechazada:    %c [%d, %d] - Se traslapa con otra actividad\n", 
                   copia[i].nombre, copia[i].inicio, copia[i].fin);
        }
    }
    
    // Mostrar el resumen de la solución
    printf("Total de actividades seleccionadas: %d\n", numSeleccionadas);
    printf("Secuencia: ");
    for(int i = 0; i < numSeleccionadas; i++) {
        printf("%c ", seleccionadas[i].nombre);
    }
    printf("\n");
    
    // Liberar memoria
    free(copia);
    free(seleccionadas);
}

// Función para mostrar todas las actividades
void mostrarActividades(Actividad actividades[], int n) {
    printf("Actividades disponibles:\n");
    printf("Nombre | Inicio | Fin | Duracion\n");
    printf("-------|--------|-----|----------\n");
    for(int i = 0; i < n; i++) {
        printf("   %c   |   %2d   | %2d  |    %d\n", 
               actividades[i].nombre, 
               actividades[i].inicio, 
               actividades[i].fin,
               calcularDuracion(actividades[i]));
    }
    printf("\n");
}

int main() {
    // Datos proporcionados
    Actividad actividades[] = {
        {'a', 0, 6},
        {'b', 1, 4},
        {'c', 3, 5},
        {'d', 3, 8},
        {'e', 4, 7},
        {'f', 5, 9},
        {'g', 6, 10},
        {'h', 8, 11}
    };
    
    int n = sizeof(actividades) / sizeof(actividades[0]);
    
    printf("ALGORITMO AVIDO\n");
    
    mostrarActividades(actividades, n);
    
    // Probar los tres criterios
    seleccionarActividades(actividades, n, 1);
    printf("\n");
    seleccionarActividades(actividades, n, 2);
    printf("\n");
    seleccionarActividades(actividades, n, 3);
    
    return 0;
}