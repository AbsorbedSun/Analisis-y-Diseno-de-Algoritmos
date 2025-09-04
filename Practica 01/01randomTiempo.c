#include <stdio.h>
#include <time.h>
#include <stdlib.h>

/* 
Práctica 01 - Analisis y Diseño de Algoritmos
- Garcia Ambrosio Aldo 3CM1 2025
- Pelcastre Rangel Cecilia Jaqueline 3CM1 2025

Programar el algoritmo de ordenamiento por selección
en C y probarlo con archivos de enteros de diferente 
tamaño y en tres condiciones diferentes.
Archivos con las siguientes cantidades de enteros:
 100
 500
 1,500
 5,000
 10,000
 15,000
 50,000
 100,000
 250,000
 500,000
 1,000,000
Y en tres condiciones diferentes:
1)En orden aleatorio
2)En orden inverso
3)En orden
4)Casi ordenados, es decir de un archivo de enteros
ordenados, mover 10 elementos a posiciones diferentes.

Medir el tiempo y graficar los resultados.

Ejecucion: gcc "01randomTiempo" -o randomTiempo
           ./randomTiempo {numero} < numeros.txt > salida.txt
Ejemplo:
           ./randomTiempo.exe 100 < ./MaterialExtra/Ordenados/numeros1millon.txt > numerosInversos1millon.txt
*/

void ordenSeleccion(int *ArregloDES, int n); // Prototipo de la función ordenSeleccion

/*
void generaAle(int *arr, int min, int max)
Recibe: int *arr (puntero al arreglo), int min (valor mínimo), int max (cantidad de elementos y valor máximo)
Devuelve: void (No retorna valor explícito)
Observaciones: Función que llena un arreglo con números aleatorios entre min y max. 
Genera max cantidad de números e imprime cada uno en pantalla.
*/
void generaAle(int *arr,int min, int max) {
    //printf("Llena un arreglo con numeros aleatorios entre %d y %d: \n", min, max);
  
    for (int i = 0; i < max; i++) {
        // Generamos un número aleatorio entre min y max
        int num_ale = rand() % (max - min + 1) + min;
	    arr[i]=num_ale;
        printf("%d \n", num_ale);
    }
}

/*
void take_enter()
Recibe: void (No recibe parámetros)
Devuelve: void (No retorna valor explícito)
Observaciones: Función que pausa la ejecución del programa hasta que el usuario presione enter.
Utiliza un bucle infinito que se rompe cuando se detecta una entrada del usuario.
*/
void take_enter() {
   printf("Presiona enter para detener el contador \n");
   while(1) {
      if (getchar())
      break;
   }
}

/*
void ordenSeleccion(int *arregloDes, int n)
Recibe: int * arreglo (puntero) como arregloDes y n como tamaño del arreglo
Devuelve: void (No retorna valor explícito)
Observaciones: Función que ordena el arregloDes de menor a mayor haciendo uso del algoritmo de ordenamiento 
Selección (busca el mínimo en la parte desordenada y lo intercambia con el primer elemento de esa parte además de dividir en parte ordenada y no ordenada).
*/
void ordenSeleccion(int *arregloDes, int n) {
   // Iterar sobre el arreglo partiendo del segundo elemento¿?
   for(int k = 0; k <= (n - 2); k++){
       // Indice del menos valor en la parte ordenada, inicia tomando el primer elemento de la parte desordenada
       int posMin = k;
       // Iteracion para encontrar el minimo en la parte desordenada
       for(int i = k + 1; i <= (n - 1); i++){
           if(arregloDes[i] < arregloDes[posMin]){
               // Asignar el nuevo valor minimo
               posMin = i;
           }
       }
       // Intercambiar el valor minimo con el primer elemento de la parte desordenada
       int temp = arregloDes[posMin]; // Asigna el valor minimo a una variable temporal
       arregloDes[posMin] = arregloDes[k]; // Reemplaza el menor valor encontrado por el primer elemento de la parte desordenada
       arregloDes[k] = temp; // Coloca el menor valor en la posición k (moviendolo a la parte ordenada)
   }
}


/*
void ordenInverso(int *arregloDes, int n)
Recibe: int * arreglo (puntero) como arregloDes y n como tamaño del arreglo
Devuelve: void (No retorna valor explícito)
Observaciones: Función que ordena el arregloDes de mayor a menor haciendo uso del algoritmo de ordenamiento 
por Selección (busca el máximo en la parte desordenada y lo intercambia con el primer elemento de esa parte 
además de dividir en parte ordenada y no ordenada).
*/
void ordenInverso(int *arregloDes, int n){
    // Iterar sobre el arreglo hasta el penúltimo elemento
    for(int k = 0; k <= (n - 2); k++){
        // Índice del mayor valor en la parte desordenada, inicia tomando el primer elemento de la parte desordenada
        int posMin = k;  // Nota: mantiene el nombre posMin por consistencia con el código original
        
        // Iteración para encontrar el máximo en la parte desordenada
        for(int i = k + 1; i <= (n - 1); i++){
            // Si encontramos un elemento mayor que el actual máximo
            if(arregloDes[i] > arregloDes[posMin]){
                // Asignar el nuevo valor máximo
                posMin = i;
            }
        }
        
        // Intercambiar el valor máximo con el primer elemento de la parte desordenada
        int temp = arregloDes[posMin]; // Asigna el valor máximo a una variable temporal
        arregloDes[posMin] = arregloDes[k]; // Reemplaza el mayor valor encontrado por el primer elemento de la parte desordenada
        arregloDes[k] = temp; // Coloca el mayor valor en la posición k (moviéndolo a la parte ordenada)
    }
}

/*
int main(int num_arg, char *arg_user[])
Recibe: int num_arg (número de argumentos de línea de comandos), char *arg_user[] (arreglo de argumentos)
Devuelve: int (código de salida del programa, 0 indica ejecución exitosa)
Observaciones: Función principal que ejecuta el programa de ordenamiento por selección.
Valida argumentos, asigna memoria dinámicamente, lee datos de entrada estándar, 
ejecuta el algoritmo de ordenamiento y mide el tiempo de ejecución utilizando clock().
*/
int main(int num_arg, char *arg_user[]) {
   // Calculamos el tiempo que toma ejecutar  take_enter()
   clock_t t;
   t = clock();

   //Recibir por argumento el tamaño de n y el valor / intervalo de valores a usar
	if (num_arg != 2) {
		printf("Indique el tamanio de n y el valor \n",arg_user[0]);
		exit(1);
	} 

   // Variable que define el numero de elementos
   int n = atoi(arg_user[1]);

   // Apartar memoria para n números enteros
   int *arreglo = malloc(n * sizeof(int));

   // Validar que se haya apartado la memoria correctamente
    if (arreglo == NULL) {
        printf("Error: No se pudo asignar memoria\n");
        exit(1);
    }
    
    //Lee de la entrada estandar los n valores y los coloca en un arreglo
    for (int i = 0; i < n; i++) {
        scanf("%d", &arreglo[i]);
    }

    // Mostrar el arreglo antes del ordenamiento
    //printf("Arreglo antes del ordenamiento: \n");
    //for (int i = 0; i < n; i++) {
      //  printf("%d \n", arreglo[i]);
    //}
    //printf("\n");


   printf("Inicia timer\n");
   //generaAle(arreglo,0,n);

    //*****************************************  
	// Algoritmo de Ordenamiento Seleccion
	//*****************************************
    // Llamar a la función de ordenamiento
    ordenSeleccion(arreglo,n);
    //ordenInverso(arreglo,n);
   
   // Mostrar el arreglo ordenado
   //printf("\nArreglo despues del ordenamiento: \n");
   //for (int i = 0; i < n; i++) {
       //printf("%d \n", arreglo[i]);
   //}
   //printf("Se detuvo el timer\n");
   t = clock() - t;
   double time_taken = ((double)t)/CLOCKS_PER_SEC; // calculamos el tiempo trascurrido
   printf("Le tomo %f segundos ejecutarse", time_taken);
   
   // Liberar la memoria asignada dinámicamente
   free(arreglo);
   
   return 0;
}