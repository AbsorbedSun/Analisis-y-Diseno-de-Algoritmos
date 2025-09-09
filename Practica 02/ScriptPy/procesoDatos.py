#!/usr/bin/env python3
"""
Script para procesar resultados de análisis de complejidad temporal
Práctica 02 - Análisis y Diseño de Algoritmos
Garcia Ambrosio Aldo 3CM1 2025

Este script lee el archivo de texto generado por el programa de análisis de complejidad
y organiza los datos en tablas Excel para su posterior graficación.
"""

import re
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import sys

def extraer_datos_del_archivo(nombre_archivo):
    """
    Extrae los datos de tiempo y tamaño del archivo de texto generado
    
    Args:
        nombre_archivo (str): Nombre del archivo de texto a procesar
        
    Returns:
        tuple: Tres listas con los datos de n, cicloSuma, cicloMultiplicacion, cicloResta
    """
    
    # Listas para almacenar los datos extraídos
    valores_n = []
    tiempos_ciclo_suma = []
    tiempos_ciclo_multiplicacion = []
    tiempos_ciclo_resta = []
    
    try:
        with open(nombre_archivo, 'r', encoding='utf-8') as archivo:
            contenido = archivo.read()
            
        # Patrón regex para extraer bloques completos de datos
        patron_bloque = r'Inicia la prueba de complejidad con n = (\d+)\s*\n\s*A cicloSuma le tomó ([\d.]+) segundos ejecutarse\s*\n\s*A cicloMultiplicacion le tomó ([\d.]+) segundos ejecutarse\s*\n\s*A cicloResta le tomó ([\d.]+) segundos ejecutarse'
        
        # Buscar todas las coincidencias en el archivo
        coincidencias = re.findall(patron_bloque, contenido)
        
        print(f"Se encontraron {len(coincidencias)} registros en el archivo")
        
        # Procesar cada coincidencia encontrada
        for coincidencia in coincidencias:
            n, tiempo_suma, tiempo_mult, tiempo_resta = coincidencia
            
            valores_n.append(int(n))
            tiempos_ciclo_suma.append(float(tiempo_suma))
            tiempos_ciclo_multiplicacion.append(float(tiempo_mult))
            tiempos_ciclo_resta.append(float(tiempo_resta))
            
    except FileNotFoundError:
        print(f"Error: No se pudo encontrar el archivo '{nombre_archivo}'")
        return [], [], [], []
    except Exception as e:
        print(f"Error al procesar el archivo: {str(e)}")
        return [], [], [], []
    
    return valores_n, tiempos_ciclo_suma, tiempos_ciclo_multiplicacion, tiempos_ciclo_resta

def crear_dataframe_principal(valores_n, tiempos_suma, tiempos_mult, tiempos_resta):
    """
    Crea un DataFrame principal con todos los datos organizados
    
    Args:
        valores_n (list): Lista de valores de n (tamaños)
        tiempos_suma (list): Lista de tiempos de cicloSuma
        tiempos_mult (list): Lista de tiempos de cicloMultiplicacion
        tiempos_resta (list): Lista de tiempos de cicloResta
        
    Returns:
        pandas.DataFrame: DataFrame con todos los datos organizados
    """
    
    df_principal = pd.DataFrame({
        'Tamaño_n': valores_n,
        'Tiempo_cicloSuma_seg': tiempos_suma,
        'Tiempo_cicloMultiplicacion_seg': tiempos_mult,
        'Tiempo_cicloResta_seg': tiempos_resta
    })
    
    # Agregar columnas con tiempos en microsegundos para mejor precisión
    df_principal['Tiempo_cicloSuma_microseg'] = df_principal['Tiempo_cicloSuma_seg'] * 1000000
    df_principal['Tiempo_cicloMultiplicacion_microseg'] = df_principal['Tiempo_cicloMultiplicacion_seg'] * 1000000
    df_principal['Tiempo_cicloResta_microseg'] = df_principal['Tiempo_cicloResta_seg'] * 1000000
    
    return df_principal

def crear_dataframes_individuales(df_principal):
    """
    Crea DataFrames individuales para cada función analizada
    
    Args:
        df_principal (pandas.DataFrame): DataFrame principal con todos los datos
        
    Returns:
        tuple: Tres DataFrames individuales para cada función
    """
    
    # DataFrame para cicloSuma (Complejidad O(n))
    df_ciclo_suma = pd.DataFrame({
        'Tamaño_n': df_principal['Tamaño_n'],
        'Tiempo_segundos': df_principal['Tiempo_cicloSuma_seg'],
        'Tiempo_microsegundos': df_principal['Tiempo_cicloSuma_microseg'],
        'Complejidad': 'O(n) - Lineal'
    })
    
    # DataFrame para cicloMultiplicacion (Complejidad O(log n))
    df_ciclo_mult = pd.DataFrame({
        'Tamaño_n': df_principal['Tamaño_n'],
        'Tiempo_segundos': df_principal['Tiempo_cicloMultiplicacion_seg'],
        'Tiempo_microsegundos': df_principal['Tiempo_cicloMultiplicacion_microseg'],
        'Complejidad': 'O(log n) - Logarítmica'
    })
    
    # DataFrame para cicloResta (Complejidad O(n))
    df_ciclo_resta = pd.DataFrame({
        'Tamaño_n': df_principal['Tamaño_n'],
        'Tiempo_segundos': df_principal['Tiempo_cicloResta_seg'],
        'Tiempo_microsegundos': df_principal['Tiempo_cicloResta_microseg'],
        'Complejidad': 'O(n) - Lineal'
    })
    
    return df_ciclo_suma, df_ciclo_mult, df_ciclo_resta

def generar_archivo_excel(df_principal, df_suma, df_mult, df_resta, nombre_salida):
    """
    Genera un archivo Excel con múltiples hojas para los diferentes análisis
    
    Args:
        df_principal (pandas.DataFrame): DataFrame principal
        df_suma (pandas.DataFrame): DataFrame de cicloSuma
        df_mult (pandas.DataFrame): DataFrame de cicloMultiplicacion
        df_resta (pandas.DataFrame): DataFrame de cicloResta
        nombre_salida (str): Nombre del archivo Excel de salida
    """
    
    try:
        with pd.ExcelWriter(nombre_salida, engine='openpyxl') as writer:
            # Hoja principal con todos los datos
            df_principal.to_excel(writer, sheet_name='Datos_Completos', index=False)
            
            # Hojas individuales para cada función
            df_suma.to_excel(writer, sheet_name='CicloSuma_O(n)', index=False)
            df_mult.to_excel(writer, sheet_name='CicloMultiplicacion_O(logn)', index=False)
            df_resta.to_excel(writer, sheet_name='CicloResta_O(n)', index=False)
            
            # Hoja de resumen estadístico
            df_estadisticas = pd.DataFrame({
                'Función': ['cicloSuma', 'cicloMultiplicacion', 'cicloResta'],
                'Complejidad': ['O(n)', 'O(log n)', 'O(n)'],
                'Tiempo_Promedio_seg': [
                    df_principal['Tiempo_cicloSuma_seg'].mean(),
                    df_principal['Tiempo_cicloMultiplicacion_seg'].mean(),
                    df_principal['Tiempo_cicloResta_seg'].mean()
                ],
                'Tiempo_Máximo_seg': [
                    df_principal['Tiempo_cicloSuma_seg'].max(),
                    df_principal['Tiempo_cicloMultiplicacion_seg'].max(),
                    df_principal['Tiempo_cicloResta_seg'].max()
                ],
                'Tiempo_Mínimo_seg': [
                    df_principal['Tiempo_cicloSuma_seg'].min(),
                    df_principal['Tiempo_cicloMultiplicacion_seg'].min(),
                    df_principal['Tiempo_cicloResta_seg'].min()
                ]
            })
            df_estadisticas.to_excel(writer, sheet_name='Resumen_Estadistico', index=False)
            
        print(f"Archivo Excel generado exitosamente: {nombre_salida}")
        
    except Exception as e:
        print(f"Error al generar el archivo Excel: {str(e)}")

def generar_graficas(df_principal, nombre_grafica):
    """
    Genera gráficas de los datos de complejidad temporal
    
    Args:
        df_principal (pandas.DataFrame): DataFrame con todos los datos
        nombre_grafica (str): Nombre base para los archivos de gráficas
    """
    
    # Configurar el estilo de las gráficas
    plt.style.use('seaborn-v0_8')
    sns.set_palette("husl")
    
    # Gráfica 1: Comparación de las tres funciones
    plt.figure(figsize=(12, 8))
    plt.plot(df_principal['Tamaño_n'], df_principal['Tiempo_cicloSuma_microseg'], 
             label='cicloSuma O(n)', marker='o', linewidth=2)
    plt.plot(df_principal['Tamaño_n'], df_principal['Tiempo_cicloMultiplicacion_microseg'], 
             label='cicloMultiplicacion O(log n)', marker='s', linewidth=2)
    plt.plot(df_principal['Tamaño_n'], df_principal['Tiempo_cicloResta_microseg'], 
             label='cicloResta O(n)', marker='^', linewidth=2)
    
    plt.xlabel('Tamaño del problema (n)', fontsize=12)
    plt.ylabel('Tiempo de ejecución (microsegundos)', fontsize=12)
    plt.title('Análisis de Complejidad Temporal - Comparación de Algoritmos', fontsize=14, fontweight='bold')
    plt.legend(fontsize=10)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(f'{nombre_grafica}_comparacion.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Gráficas individuales
    fig, axes = plt.subplots(1, 3, figsize=(18, 6))
    
    # cicloSuma
    axes[0].plot(df_principal['Tamaño_n'], df_principal['Tiempo_cicloSuma_microseg'], 
                'b-o', linewidth=2, markersize=4)
    axes[0].set_title('cicloSuma - Complejidad O(n)', fontweight='bold')
    axes[0].set_xlabel('Tamaño (n)')
    axes[0].set_ylabel('Tiempo (μs)')
    axes[0].grid(True, alpha=0.3)
    
    # cicloMultiplicacion
    axes[1].plot(df_principal['Tamaño_n'], df_principal['Tiempo_cicloMultiplicacion_microseg'], 
                'r-s', linewidth=2, markersize=4)
    axes[1].set_title('cicloMultiplicacion - Complejidad O(log n)', fontweight='bold')
    axes[1].set_xlabel('Tamaño (n)')
    axes[1].set_ylabel('Tiempo (μs)')
    axes[1].grid(True, alpha=0.3)
    
    # cicloResta
    axes[2].plot(df_principal['Tamaño_n'], df_principal['Tiempo_cicloResta_microseg'], 
                'g-^', linewidth=2, markersize=4)
    axes[2].set_title('cicloResta - Complejidad O(n)', fontweight='bold')
    axes[2].set_xlabel('Tamaño (n)')
    axes[2].set_ylabel('Tiempo (μs)')
    axes[2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{nombre_grafica}_individuales.png', dpi=300, bbox_inches='tight')
    plt.show()

def main():
    """
    Función principal que coordina el procesamiento de datos
    """
    
    print("=== Procesador de Datos de Complejidad Temporal ===")
    print("Práctica 02 - Análisis y Diseño de Algoritmos")
    print("Garcia Ambrosio Aldo 3CM1 2025\n")
    
    # Verificar argumentos de línea de comandos
    if len(sys.argv) > 1:
        archivo_entrada = sys.argv[1]
    else:
        archivo_entrada = input("Ingrese el nombre del archivo de datos (default: salida_completa.txt): ").strip()
        if not archivo_entrada:
            archivo_entrada = "salida_completa.txt"
    
    # Verificar si el archivo existe
    if not Path(archivo_entrada).exists():
        print(f"Error: El archivo '{archivo_entrada}' no existe.")
        return
    
    print(f"Procesando archivo: {archivo_entrada}")
    
    # Extraer datos del archivo
    valores_n, tiempos_suma, tiempos_mult, tiempos_resta = extraer_datos_del_archivo(archivo_entrada)
    
    if not valores_n:
        print("No se pudieron extraer datos del archivo.")
        return
    
    print(f"Datos extraídos exitosamente: {len(valores_n)} registros")
    
    # Crear DataFrames
    df_principal = crear_dataframe_principal(valores_n, tiempos_suma, tiempos_mult, tiempos_resta)
    df_suma, df_mult, df_resta = crear_dataframes_individuales(df_principal)
    
    # Mostrar información básica
    print(f"\nRango de tamaños analizados: {min(valores_n)} - {max(valores_n)}")
    print(f"Incremento promedio: {(max(valores_n) - min(valores_n)) // (len(valores_n) - 1) if len(valores_n) > 1 else 0}")
    
    # Generar archivos de salida
    nombre_excel = archivo_entrada.replace('.txt', '_analisis_complejidad.xlsx')
    generar_archivo_excel(df_principal, df_suma, df_mult, df_resta, nombre_excel)
    
    # Generar gráficas
    nombre_base_grafica = archivo_entrada.replace('.txt', '')
    generar_graficas(df_principal, nombre_base_grafica)
    
    print(f"\nProcesamiento completado exitosamente!")
    print(f"Archivos generados:")
    print(f"  - Archivo Excel: {nombre_excel}")
    print(f"    * Tabla 1: cicloSuma O(n)")
    print(f"    * Tabla 2: cicloMultiplicacion O(log n)")
    print(f"    * Tabla 3: cicloResta O(n)")
    print(f"  - Gráfica comparativa: {nombre_base_grafica}_comparacion.png")
    print(f"  - Gráficas individuales: {nombre_base_grafica}_individuales.png")

if __name__ == "__main__":
    main()