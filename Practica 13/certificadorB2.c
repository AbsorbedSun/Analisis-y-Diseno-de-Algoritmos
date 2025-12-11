#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>

/**
 * ALGORITMO CERTIFICADOR PARA PRIMALIDAD/COMPOSICIÓN
 * 
 * Usa el Algoritmo de Euclides para verificar divisibilidad
 * 
 * Problema 1: Verificar si n es COMPUESTO (apropiado para NP)
 * Entrada s: número n
 * Certificado t: un divisor propio de n
 * Retorna: true si t prueba que n es compuesto
 * 
 * Problema 2: Verificar si n es PRIMO
 * Entrada s: número n
 * Certificado t: NULL (verificación directa)
 * Retorna: true si n es primo
 */

// ALGORITMO DE EUCLIDES para calcular MCD
int mcd_euclides(int a, int b) {
    printf("  Calculando MCD(%d, %d) usando Euclides:\n", a, b);
    int original_a = a, original_b = b;
    
    while (b != 0) {
        int temp = b;
        printf("    %d = %d × %d + %d\n", a, b, a/b, a % b);
        b = a % b;
        a = temp;
    }
    
    printf("  MCD(%d, %d) = %d\n", original_a, original_b, a);
    return a;
}

// CERTIFICADOR: Verifica si n es COMPUESTO usando un divisor como certificado
bool certificador_composicion(int n, int t) {
    printf("¿Es %d compuesto?\n", n);
    printf("Certificado (divisor propuesto): %d\n\n", t);
    
    // Validar que t es un candidato válido
    if (t < 2 || t >= n) {
        printf("El certificado debe estar en [2, %d)\n", n);
        return false;
    }
    
    // Usar algoritmo de Euclides para verificar si t divide a n
    int mcd = mcd_euclides(n, t);
    
    if (mcd == t) {
        // t divide a n
        printf("\nMCD(%d, %d) = %d\n", n, t, mcd);
        printf("%d divide a %d\n", t, n);
        printf("%d = %d × %d\n", n, t, n/t);
        printf("\n%d es COMPUESTO\n", n);
        return true;
    } else {
        printf("\n%d NO divide a %d\n", t, n);
        printf("(Esto NO prueba que %d sea primo, solo que %d no es un divisor)\n", n, t);
        return false;
    }
}

// CERTIFICADOR: Verifica si n es PRIMO (método directo)
bool certificador_primalidad(int n) {
    printf("\n¿Es %d primo?\n\n", n);
    
    if (n < 2) {
        printf("%d < 2, no es primo\n", n);
        return false;
    }
    
    if (n == 2) {
        printf("2 es primo\n");
        return true;
    }
    
    if (n % 2 == 0) {
        printf(" %d es par, no es primo\n", n);
        return false;
    }
    
    printf("Verificando divisores desde 3 hasta √%d = %.2f\n", n, sqrt(n));
    
    int limite = (int)sqrt(n);
    for (int i = 3; i <= limite; i += 2) {
        int mcd = mcd_euclides(n, i);
        if (mcd > 1) {
            printf("\nEncontrado divisor: %d\n", i);
            printf("%d NO es primo\n", n);
            return false;
        }
    }
    
    printf("\nNo se encontraron divisores\n");
    printf("%d es PRIMO\n", n);
    return true;
}

// Función auxiliar para encontrar un divisor (para generar certificados)
int encontrar_divisor(int n) {
    if (n < 2) return -1;
    if (n % 2 == 0) return 2;
    
    int limite = (int)sqrt(n);
    for (int i = 3; i <= limite; i += 2) {
        if (n % i == 0) {
            return i;
        }
    }
    return -1; // n es primo
}

int main() {
    // PARTE 1: Verificar números compuestos con certificados
    int numeros_compuestos[] = {24, 100, 51, 91};
    int n_compuestos = 4;
    
    for (int i = 0; i < n_compuestos; i++) {
        int n = numeros_compuestos[i];
        int divisor = encontrar_divisor(n);
        
        certificador_composicion(n, divisor);
    }
    
    // PARTE 2: Intentar con certificado inválido
    certificador_composicion(17, 3); // 3 no divide a 17
    
    // PARTE 3: Verificar primalidad
    int numeros_primos[] = {2, 17, 29, 97};
    int n_primos = 4;
    
    for (int i = 0; i < n_primos; i++) {
        certificador_primalidad(numeros_primos[i]);
    }
    
    // PARTE 4: Verificar número compuesto
    certificador_primalidad(100);
    
    // PARTE 5: Ejemplos del algoritmo de Euclides
    int pares[][2] = {{48, 18}, {100, 35}, {17, 19}, {56, 42}};
    int n_pares = 4;
    
    for (int i = 0; i < n_pares; i++) {
        int a = pares[i][0];
        int b = pares[i][1];
        printf("\n");
        int resultado = mcd_euclides(a, b);
        printf("\n");
    }
    
    return 0;
}