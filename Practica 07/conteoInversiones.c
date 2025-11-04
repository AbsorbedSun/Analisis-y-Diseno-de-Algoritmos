/*  
  Autor: Aldo Garcia Ambrosio (C) Marzo 2025
  Merge Sort con conteo de inversiones
  
  Compilación: gcc ordenMerge.c -o merge
  Ejecución: ./merge {elementos a ordenar} < lista_caracteres.txt
*/

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// Variable global para contar inversiones (opcional)
long long int inversiones_totales = 0;

/*
OPCIÓN 2: Merge con conteo de inversiones
Esta función mezcla Y cuenta cuántas inversiones hay
Una inversión ocurre cuando un elemento de la mitad derecha
es menor que elementos de la mitad izquierda
*/
void MergeConInversiones(int *arregloDes, int posIni, int mitad, int posFin){
    int l = posFin - posIni + 1, i = posIni, j = mitad + 1, k;
    int *arregloAux = malloc(l * sizeof(int));

    for(k = 0; k <= (l - 1); k++){
        if(i <= mitad && j <= posFin){
            if(arregloDes[i] <= arregloDes[j]){
                arregloAux[k] = arregloDes[i];
                i++;
            }else{
                // Si tomamos un elemento de la derecha, significa que
                // TODOS los elementos restantes de la izquierda (desde i hasta mitad)
                // son mayores y forman inversiones
                arregloAux[k] = arregloDes[j];
                inversiones_totales += (mitad - i + 1);  // Contar inversiones
                j++;
            }
        } else if(i <= mitad){
            arregloAux[k] = arregloDes[i];
            i++;
        } else{
            arregloAux[k] = arregloDes[j];
            j++;
        }
    }
    
    k = posIni;
    for(int i = 0; i < l; i++){
        arregloDes[k] = arregloAux[i]; 
        k++;
    }

    free(arregloAux);
}

/*
mergeSortConInversiones - Versión que cuenta inversiones
*/
void mergeSortConInversiones(int *arregloDes, int posIni, int posFin) {
    if (posIni < posFin){
        int mitad = (posIni + posFin) / 2;
        
        // Ordenar y contar inversiones en mitad izquierda
        mergeSortConInversiones(arregloDes, posIni, mitad);
        
        // Ordenar y contar inversiones en mitad derecha
        mergeSortConInversiones(arregloDes, mitad + 1, posFin);
        
        // Mezclar y contar inversiones entre mitades
        MergeConInversiones(arregloDes, posIni, mitad, posFin);
    }
}

int main(int num_arg, char *arg_user[]) {

    if (num_arg != 2) {
        printf("\nUso: %s [cantidad_elementos] < archivo.txt\n", arg_user[0]);
        printf("Ejemplo: ./merge 10 < numeros.txt\n");
        exit(1);
    } 

    int fin = atoi(arg_user[1]);
    
    int *arreglo = malloc(fin * sizeof(int));
    
    if (arreglo == NULL) {
        printf("Error: No se pudo asignar memoria\n");
        exit(1);
    }
    
    // Leer n valores
    for (int i = 0; i < fin; i++) {
        scanf("%d", &arreglo[i]);
    }
    
    printf("Arreglo antes del ordenamiento: \n");
    for (int i = 0; i < fin; i++) {
        printf("%d ", arreglo[i]);
    }
    printf("\n\n");
    
    // Opción 2: Ordenar Y contar inversiones
    inversiones_totales = 0;  // Reiniciar contador
    mergeSortConInversiones(arreglo, 0, fin - 1);
    printf("Numero total de inversiones: %lld\n\n", inversiones_totales);
    
    printf("Arreglo despues del ordenamiento: \n");
    for (int i = 0; i < fin; i++) {
        printf("%d ", arreglo[i]);
    }
    printf("\n");
    
    free(arreglo);
    
    return 0;
}
