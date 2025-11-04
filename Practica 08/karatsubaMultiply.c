#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

/*
 * Algoritmo de Multiplicación de Karatsuba
 * 
 * Objetivo: Multiplicar dos números enteros de n bits usando el enfoque
 * divide y conquista, reduciendo la complejidad de O(n²) a O(n^log₂3) ≈ O(n^1.585)
 * 
 * Principio: Divide números en mitades y usa solo 3 multiplicaciones recursivas
 * en lugar de 4, mediante la identidad: bc + ad = ac + bd - (a-b)(c-d)
*/


/**
 * potencia - Calcula 2^exp
 * @exp: exponente
 * 
 * Retorna: 2 elevado a la potencia exp
 * Uso: Calcular desplazamientos binarios (2^m, 2^(2m))
 */
long long potencia(int exp) {
    long long resultado = 1;
    for (int i = 0; i < exp; i++) {
        resultado *= 2;
    }
    return resultado;
}

/**
 * karatsubaMultiply - Multiplicación usando algoritmo de Karatsuba
 * @x: primer número entero
 * @y: segundo número entero
 * @n: número de bits (debe ser potencia de 2)
 * 
 * Algoritmo:
 * 1. Caso base: si n=1, multiplicación directa
 * 2. Dividir x e y en mitades: x = a*2^m + b, y = c*2^m + d
 * 3. Calcular 3 productos: ac, bd, (a-b)(c-d)
 * 4. Aplicar fórmula: x*y = 2^(2m)*ac + 2^m*(ac+bd-(a-b)(c-d)) + bd
 * 
 * Retorna: producto x * y
 * Complejidad: O(n^1.585) vs O(n²) de multiplicación tradicional
 */
long long karatsubaMultiply(long long x, long long y, int n) {
    // Caso base: números de un bit, multiplicación directa
    if (n == 1) {
        return x * y;
    }
    
    // Calcular mitad del número de bits
    int m = n / 2;
    long long dosElevadoM = potencia(m);
    
    // Dividir x en: a (bits altos) y b (bits bajos)
    // Dividir y en: c (bits altos) y d (bits bajos)
    // Ejemplo: x=10001101, m=4 → a=1000, b=1101
    long long a = x / dosElevadoM;
    long long b = x % dosElevadoM;
    long long c = y / dosElevadoM;
    long long d = y % dosElevadoM;
    
    // Tres multiplicaciones recursivas (truco de Karatsuba)
    long long e = karatsubaMultiply(a, c, m);      // e = ac
    long long f = karatsubaMultiply(b, d, m);      // f = bd
    long long g = karatsubaMultiply(a - b, c - d, m);  // g = (a-b)(c-d)
    
    // Aplicar fórmula de Karatsuba:
    // x*y = 2^(2m)*ac + 2^m*(bc+ad) + bd
    // Donde: bc+ad = ac + bd - (a-b)(c-d) = e + f - g
    long long dosElevado2M = potencia(2 * m);
    long long resultado = dosElevado2M * e + dosElevadoM * (e + f - g) + f;
    
    // Corrección para casos con números negativos
    if (g < 0) {
        resultado = dosElevado2M * e + dosElevadoM * (e + f + (-g)) + f;
    }
    
    return resultado;
}

/**
 * contarBits - Calcula bits necesarios redondeado a potencia de 2
 * @num: número a analizar
 * 
 * Retorna: menor potencia de 2 que puede representar el número
 * Ejemplo: num=137 (10001001 en binario) → 8 bits
 */
int contarBits(long long num) {
    if (num == 0) return 1;
    
    // Contar bits necesarios
    int bits = 0;
    while (num > 0) {
        bits++;
        num /= 2;
    }
    
    // Redondear a la siguiente potencia de 2
    int potenciaDeDos = 1;
    while (potenciaDeDos < bits) {
        potenciaDeDos *= 2;
    }
    
    return potenciaDeDos;
}

/**
 * main - Función principal con ejemplos de uso
 * 
 * Ejecuta tres ejemplos del algoritmo de Karatsuba con diferentes
 * tamaños de números y verifica resultados contra multiplicación normal.
 */
int main() {
    // Ejemplo 1: números de 8 bits
    long long x1 = 137;  // Binario: 10001001
    long long y1 = 225;  // Binario: 11100001
    
    printf("=== Ejemplo 1 ===\n");
    printf("x = %lld (binario: ", x1);
    
    // Imprimir representación binaria
    for (int i = 7; i >= 0; i--) {
        printf("%d", (int)((x1 >> i) & 1));
    }
    printf(")\n");
    
    printf("y = %lld (binario: ", y1);
    for (int i = 7; i >= 0; i--) {
        printf("%d", (int)((y1 >> i) & 1));
    }
    printf(")\n");
    
    // Calcular bits necesarios y ejecutar Karatsuba
    int bits1 = contarBits(x1 > y1 ? x1 : y1);
    printf("Numero de bits utilizados: %d\n", bits1);
    
    long long resultado1 = karatsubaMultiply(x1, y1, bits1);
    printf("Resultado con Karatsuba: %lld\n", resultado1);
    printf("Verificacion (multiplicacion normal): %lld\n\n", x1 * y1);
    
    // Ejemplo 2: números más grandes
    long long x2 = 12345;
    long long y2 = 6789;
    
    printf("=== Ejemplo 2 ===\n");
    printf("x = %lld\n", x2);
    printf("y = %lld\n", y2);
    
    int bits2 = contarBits(x2 > y2 ? x2 : y2);
    printf("Numero de bits utilizados: %d\n", bits2);
    
    long long resultado2 = karatsubaMultiply(x2, y2, bits2);
    printf("Resultado con Karatsuba: %lld\n", resultado2);
    printf("Verificacion (multiplicacion normal): %lld\n\n", x2 * y2);
    
    // Ejemplo 3: simulación con números menores
    long long x3 = 255;
    long long y3 = 127;
    
    printf("=== Ejemplo 3 ===\n");
    printf("x = %lld\n", x3);
    printf("y = %lld\n", y3);
    
    int bits3 = contarBits(x3 > y3 ? x3 : y3);
    printf("Numero de bits utilizados: %d\n", bits3);
    
    long long resultado3 = karatsubaMultiply(x3, y3, bits3);
    printf("Resultado con Karatsuba: %lld\n", resultado3);
    printf("Verificacion (multiplicacion normal): %lld\n", x3 * y3);
    
    return 0;
}