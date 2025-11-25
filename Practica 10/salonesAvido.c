#include <stdio.h>
#include <stdlib.h>

// Estructura para representar una clase con su tiempo de inicio y fin
typedef struct {
    int inicio;
    int fin;
    char nombre;  // Identificador de la clase (a, b, c, etc.)
} Clase;

// Estructura para representar un salón que tiene un registro de cuándo termina su última clase
typedef struct {
    int fin_ultima_clase;  // Hora en que termina la última clase asignada
    int numero_salon;      // Número identificador del salón
} Salon;

// Función para comparar dos clases por su tiempo de inicio (para ordenar)
// Esta función la usaremos con qsort
int compararClases(const void *a, const void *b) {
    Clase *claseA = (Clase *)a;
    Clase *claseB = (Clase *)b;
    
    // Retornamos la diferencia de los tiempos de inicio
    // Si es negativo, claseA va primero; si es positivo, claseB va primero
    return claseA->inicio - claseB->inicio;
}

int main() {
    // Definimos las clases según el diagrama
    // Cada clase tiene: tiempo de inicio, tiempo de fin, y un nombre identificador
    Clase clases[] = {
        {9, 10, 'a'},      // Clase 'a' de 9:00 a 10:00
        {930, 1030, 'b'},  // Clase 'b' de 9:30 a 10:30
        {10, 11, 'c'},     // Clase 'c' de 10:00 a 11:00
        {11, 1230, 'd'},   // Clase 'd' de 11:00 a 12:30
        {12, 130, 'e'},    // Clase 'e' de 12:00 a 1:30
        {1230, 230, 'f'},  // Clase 'f' de 12:30 a 2:30
        {130, 230, 'g'},   // Clase 'g' de 1:30 a 2:30
        {230, 4, 'h'},     // Clase 'h' de 2:30 a 4:00
        {3, 330, 'i'},     // Clase 'i' de 3:00 a 3:30
        {330, 430, 'j'}    // Clase 'j' de 3:30 a 4:30
    };
    
    int num_clases = sizeof(clases) / sizeof(clases[0]);
    
    printf("Problema: Asignar %d clases al mínimo número de salones\n\n", num_clases);
    
    // PASO 1: Ordenar las clases por tiempo de inicio
    // Esto es crucial porque procesamos las clases en orden cronológico
    printf("PASO 1: Ordenando clases por tiempo de inicio...\n");
    qsort(clases, num_clases, sizeof(Clase), compararClases);
    
    printf("Clases ordenadas:\n");
    for (int i = 0; i < num_clases; i++) {
        printf("  Clase '%c': inicio=%d, fin=%d\n", 
               clases[i].nombre, clases[i].inicio, clases[i].fin);
    }
    printf("\n");
    
    // PASO 2: Preparar la estructura para rastrear los salones
    // Creamos un arreglo de salones. En el peor caso necesitamos un salón por clase
    Salon *salones = (Salon *)malloc(num_clases * sizeof(Salon));
    int num_salones_usados = 0;  // Contador de cuántos salones hemos necesitado
    
    // PASO 3: Procesar cada clase una por una
    printf("PASO 2: Asignando clases a salones...\n\n");
    
    for (int i = 0; i < num_clases; i++) {
        Clase clase_actual = clases[i];
        
        printf("Procesando clase '%c' (inicio=%d, fin=%d):\n", 
               clase_actual.nombre, clase_actual.inicio, clase_actual.fin);
        
        // Intentamos encontrar un salón disponible
        // Un salón está disponible si su última clase termina antes o cuando empieza la actual
        int salon_encontrado = -1;  // -1 significa que no hemos encontrado salón disponible
        
        // Revisamos todos los salones que ya estamos usando
        for (int j = 0; j < num_salones_usados; j++) {
            // Verificamos si este salón está libre
            if (salones[j].fin_ultima_clase <= clase_actual.inicio) {
                // ¡Este salón está disponible!
                salon_encontrado = j;
                printf("  -> Salón %d está disponible (terminó a las %d)\n", 
                       salones[j].numero_salon, salones[j].fin_ultima_clase);
                break;  // No necesitamos seguir buscando
            }
        }
        
        // Decidimos qué hacer según si encontramos un salón disponible o no
        if (salon_encontrado != -1) {
            // CASO A: Encontramos un salón disponible, lo reutilizamos
            // Actualizamos cuándo termina la última clase en ese salón
            salones[salon_encontrado].fin_ultima_clase = clase_actual.fin;
            printf("  -> Asignada al salón %d (existente)\n\n", 
                   salones[salon_encontrado].numero_salon);
        } else {
            // CASO B: No hay salones disponibles, necesitamos uno nuevo
            printf("  -> No hay salones disponibles\n");
            
            // Creamos un nuevo salón
            salones[num_salones_usados].numero_salon = num_salones_usados + 1;
            salones[num_salones_usados].fin_ultima_clase = clase_actual.fin;
            
            printf("  -> Creando salón %d (nuevo)\n", num_salones_usados + 1);
            printf("  -> Asignada al salón %d\n\n", num_salones_usados + 1);
            
            num_salones_usados++;  // Incrementamos el contador de salones
        }
    }
    
    // PASO 4: Mostrar resultados
    printf("Número mínimo de salones necesarios: %d\n", num_salones_usados);
    // Liberamos la memoria que reservamos dinámicamente
    free(salones);
    
    return 0;
}