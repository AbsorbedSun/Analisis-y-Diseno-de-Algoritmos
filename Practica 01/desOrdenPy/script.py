import random
import os

def generar_archivo_desordenado(archivo_original, cantidad_numeros, nombre_archivo):
    """
    Genera un archivo con una cantidad específica de números del archivo original
    con exactamente 10 números fuera de orden.
    
    Args:
        archivo_original: ruta del archivo con números ordenados
        cantidad_numeros: cantidad de números a incluir en el nuevo archivo
        nombre_archivo: nombre del archivo de salida
    """
    
    # Leer números del archivo original
    with open(archivo_original, 'r') as f:
        numeros = [int(line.strip()) for line in f.readlines()]
    
    # Tomar solo la cantidad necesaria de números
    numeros_seleccionados = numeros[:cantidad_numeros]
    
    # Crear una copia para modificar
    numeros_desordenados = numeros_seleccionados.copy()
    
    # Elegir 10 posiciones aleatorias para desordenar
    posiciones_a_desordenar = random.sample(range(len(numeros_desordenados)), min(10, len(numeros_desordenados)))
    
    # Crear lista de los números que se van a mover
    numeros_a_mover = [numeros_desordenados[i] for i in posiciones_a_desordenar]
    
    # Mezclar estos números
    random.shuffle(numeros_a_mover)
    
    # Asignar los números mezclados a las posiciones seleccionadas
    for i, pos in enumerate(posiciones_a_desordenar):
        numeros_desordenados[pos] = numeros_a_mover[i]
    
    # Escribir al archivo de salida
    with open(nombre_archivo, 'w') as f:
        for numero in numeros_desordenados:
            f.write(f"{numero}\n")
    
    print(f"Archivo '{nombre_archivo}' generado con {cantidad_numeros} números y 10 números desordenados")

def main():
    # Configuración
    archivo_original = "numeros1millon.txt"  # Cambia por el nombre de tu archivo
    
    # Definir los intervalos según tu imagen
    intervalos = {
        "100": 100,
        "500": 500,
        "1500": 1500,
        "5000": 5000,
        "10000": 10000,
        "15000": 15000,
        "50000": 50000,
        "100000": 100000,
        "250000": 250000,
        "500000": 500000,
        "1000000": 1000000
    }
    
    # Crear directorio para los archivos si no existe
    if not os.path.exists("archivos_desordenados"):
        os.makedirs("archivos_desordenados")
    
    # Generar archivos para cada intervalo
    for nombre, cantidad in intervalos.items():
        nombre_archivo = f"archivos_desordenados/desordenado_{nombre}.txt"
        generar_archivo_desordenado(archivo_original, cantidad, nombre_archivo)
    
    print("\n¡Todos los archivos han sido generados exitosamente!")
    print("Los archivos se encuentran en la carpeta 'archivos_desordenados'")

# Función adicional para verificar el desorden
def verificar_desorden(archivo):
    """
    Verifica cuántos números están fuera de orden en un archivo
    """
    with open(archivo, 'r') as f:
        numeros = [int(line.strip()) for line in f.readlines()]
    
    fuera_de_orden = 0
    for i in range(1, len(numeros)):
        if numeros[i] < numeros[i-1]:
            fuera_de_orden += 1
    
    return fuera_de_orden

# Función para verificar todos los archivos generados
def verificar_todos_archivos():
    """
    Verifica el nivel de desorden en todos los archivos generados
    """
    intervalos = ["100", "500", "1500", "5000", "10000", "15000", 
                  "50000", "100000", "250000", "500000", "1000000"]
    
    print("\nVerificación de archivos generados:")
    print("Archivo\t\tNúmeros fuera de orden")
    print("-" * 40)
    
    for intervalo in intervalos:
        archivo = f"archivos_desordenados/desordenado_{intervalo}.txt"
        if os.path.exists(archivo):
            desorden = verificar_desorden(archivo)
            print(f"{intervalo}\t\t{desorden}")

if __name__ == "__main__":
    # Ejecutar generación
    main()
    
    # Verificar resultados (opcional)
    verificar_todos_archivos()