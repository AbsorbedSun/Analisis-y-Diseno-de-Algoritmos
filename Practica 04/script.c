#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Definición de la estructura Alumno
typedef struct {
    char nombre[50];
    char especialidad[30];
    int matricula;
    char grupo[10];
} Alumno;

// Función comparadora para ordenar por nombre
int compararPorNombre(const void *a, const void *b) {
    // Hacemos casting de void* a Alumno*
    Alumno *alumnoA = (Alumno *)a;
    Alumno *alumnoB = (Alumno *)b;
    
    // Usamos strcmp para comparar cadenas
    return strcmp(alumnoA->nombre, alumnoB->nombre);
}

// Función comparadora para ordenar por matrícula
int compararPorMatricula(const void *a, const void *b) {
    // Hacemos casting de void* a Alumno*
    Alumno *alumnoA = (Alumno *)a;
    Alumno *alumnoB = (Alumno *)b;
    
    // Comparación numérica directa
    return alumnoA->matricula - alumnoB->matricula;
}

// Función para imprimir el arreglo de alumnos
void imprimirAlumnos(Alumno alumnos[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%s - %s - %d - %s\n",
               alumnos[i].nombre,
               alumnos[i].especialidad,
               alumnos[i].matricula,
               alumnos[i].grupo);
    }
}

int main() {
    // Declaración e inicialización del arreglo de alumnos
    Alumno alumnos[] = {
        {"Carlos Ramirez", "Computacion", 2021630045, "3CM1"},
        {"Ana Martinez", "Sistemas", 2021630012, "3CM2"},
        {"Luis Fernandez", "Computacion", 2021630089, "3CM1"},
        {"Maria Gonzalez", "Datos", 2021630003, "3CM3"},
        {"Pedro Sanchez", "Sistemas", 2021630156, "3CM2"},
        {"Laura Torres", "Computacion", 2021630078, "3CM1"},
        {"Jorge Diaz", "Datos", 2021630034, "3CM3"},
        {"Sofia Hernandez", "Sistemas", 2021630201, "3CM2"},
        {"Roberto Lopez", "Computacion", 2021630067, "3CM1"},
        {"Elena Ruiz", "Datos", 2021630123, "3CM3"}
    };
    
    int n = sizeof(alumnos) / sizeof(alumnos[0]);
    
    // Ordenamiento por nombre
    printf("=== Ordenamiento por Nombre ===\n");
    qsort(alumnos, n, sizeof(Alumno), compararPorNombre);
    imprimirAlumnos(alumnos, n);
    
    // Ordenamiento por matrícula
    printf("\n=== Ordenamiento por Matricula ===\n");
    qsort(alumnos, n, sizeof(Alumno), compararPorMatricula);
    imprimirAlumnos(alumnos, n);
    
    return 0;
}
