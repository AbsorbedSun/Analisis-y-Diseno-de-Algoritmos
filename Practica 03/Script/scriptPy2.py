import re
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

def leer_archivo_rendimiento(ruta_archivo):
    """
    Lee un archivo de texto y extrae los datos de tamaño y tiempo.
    Maneja archivos con múltiples líneas por prueba.
    
    Args:
        ruta_archivo (str): Ruta al archivo de texto
    
    Returns:
        list: Lista de tuplas (tamaño, tiempo)
    """
    datos = []
    
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
            lineas = archivo.readlines()
            
            print(f"Leyendo {len(lineas)} líneas del archivo...")
            
            # Procesar línea por línea para mejor control
            for i, linea in enumerate(lineas):
                linea = linea.strip()
                if not linea:  # Saltar líneas vacías
                    continue
                    
                # Buscar patrones de tamaño y tiempo en cada línea
                patron_tamano = r'Tamaño:\s*([0-9,]+)\s*elementos'
                patron_tiempo = r'Tiempo\s*total:\s*([0-9,.]+)\s*ms'
                
                match_tamano = re.search(patron_tamano, linea)
                match_tiempo = re.search(patron_tiempo, linea)
                
                # Si ambos patrones están en la misma línea
                if match_tamano and match_tiempo:
                    tamano = int(match_tamano.group(1).replace(',', ''))
                    tiempo = float(match_tiempo.group(1).replace(',', ''))
                    datos.append((tamano, tiempo))
                    
                # Si están en líneas separadas, buscar en la siguiente línea
                elif match_tamano and i + 1 < len(lineas):
                    siguiente_linea = lineas[i + 1].strip()
                    match_tiempo_siguiente = re.search(patron_tiempo, siguiente_linea)
                    
                    if match_tiempo_siguiente:
                        tamano = int(match_tamano.group(1).replace(',', ''))
                        tiempo = float(match_tiempo_siguiente.group(1).replace(',', ''))
                        datos.append((tamano, tiempo))
                        
        print(f"Se encontraron {len(datos)} registros de datos")
        
        # Verificar que tenemos 100 pruebas como esperamos
        if len(datos) == 100:
            print("✓ Se detectaron correctamente 100 pruebas")
        else:
            print(f"⚠ Se esperaban 100 pruebas, pero se encontraron {len(datos)}")
        
    except FileNotFoundError:
        print(f"Error: No se pudo encontrar el archivo {ruta_archivo}")
        return []
    except Exception as e:
        print(f"Error al leer el archivo: {e}")
        return []
    
    return datos

def crear_dataframe(datos):
    """
    Convierte los datos en un DataFrame de pandas y los ordena.
    
    Args:
        datos (list): Lista de tuplas (tamaño, tiempo)
    
    Returns:
        pd.DataFrame: DataFrame ordenado
    """
    if not datos:
        return pd.DataFrame()
    
    df = pd.DataFrame(datos, columns=['Elementos', 'Tiempo (ms)'])
    
    # Ordenar por número de elementos
    df = df.sort_values('Elementos').reset_index(drop=True)
    
    # Agregar columnas adicionales para análisis
    df['Tiempo por Elemento (ms)'] = df['Tiempo (ms)'] / df['Elementos']
    
    return df

def guardar_excel(df, nombre_archivo='datos_rendimiento.xlsx'):
    """
    Guarda el DataFrame en un archivo Excel con formato.
    
    Args:
        df (pd.DataFrame): DataFrame con los datos
        nombre_archivo (str): Nombre del archivo Excel
    """
    try:
        with pd.ExcelWriter(nombre_archivo, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Datos de Rendimiento', index=False)
            
            # Obtener el workbook y worksheet para formatear
            workbook = writer.book
            worksheet = writer.sheets['Datos de Rendimiento']
            
            # Ajustar ancho de columnas
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        print(f"Archivo Excel guardado como: {nombre_archivo}")
        
    except Exception as e:
        print(f"Error al guardar archivo Excel: {e}")

def crear_graficos(df, guardar_graficos=True):
    """
    Crea gráficos de los datos de rendimiento.
    
    Args:
        df (pd.DataFrame): DataFrame con los datos
        guardar_graficos (bool): Si guardar los gráficos como archivos
    """
    if df.empty:
        print("No hay datos para graficar")
        return
    
    # Configurar estilo
    plt.style.use('seaborn-v0_8')
    
    # Crear figura con subplots
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Análisis de Rendimiento', fontsize=16, fontweight='bold')
    
    # Gráfico 1: Tiempo vs Elementos (Línea)
    ax1.plot(df['Elementos'], df['Tiempo (ms)'], 
             marker='o', linewidth=2, markersize=6, color='blue')
    ax1.set_xlabel('Número de Elementos')
    ax1.set_ylabel('Tiempo (ms)')
    ax1.set_title('Tiempo de Ejecución vs Número de Elementos')
    ax1.grid(True, alpha=0.3)
    
    # Gráfico 2: Tiempo vs Elementos (Barras)
    ax2.bar(range(len(df)), df['Tiempo (ms)'], color='skyblue', alpha=0.7)
    ax2.set_xlabel('Índice de Prueba')
    ax2.set_ylabel('Tiempo (ms)')
    ax2.set_title('Tiempo de Ejecución por Prueba')
    ax2.set_xticks(range(len(df)))
    ax2.set_xticklabels([f"{x:,}" for x in df['Elementos']], rotation=45)
    
    # Gráfico 3: Tiempo por elemento
    ax3.plot(df['Elementos'], df['Tiempo por Elemento (ms)'], 
             marker='s', linewidth=2, markersize=6, color='red')
    ax3.set_xlabel('Número de Elementos')
    ax3.set_ylabel('Tiempo por Elemento (ms)')
    ax3.set_title('Eficiencia: Tiempo por Elemento')
    ax3.grid(True, alpha=0.3)
    
    # Gráfico 4: Análisis de complejidad (log-log)
    ax4.loglog(df['Elementos'], df['Tiempo (ms)'], 
               marker='D', linewidth=2, markersize=6, color='green')
    ax4.set_xlabel('Número de Elementos (log)')
    ax4.set_ylabel('Tiempo (ms) (log)')
    ax4.set_title('Análisis de Complejidad (Escala Log-Log)')
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    if guardar_graficos:
        plt.savefig('analisis_rendimiento.png', dpi=300, bbox_inches='tight')
        print("Gráfico guardado como: analisis_rendimiento.png")
    
    plt.show()

def mostrar_estadisticas(df):
    """
    Muestra estadísticas básicas de los datos.
    
    Args:
        df (pd.DataFrame): DataFrame con los datos
    """
    if df.empty:
        return
    
    print("\n" + "="*50)
    print("ESTADÍSTICAS DE RENDIMIENTO")
    print("="*50)
    
    print(f"Número total de pruebas: {len(df)}")
    print(f"Rango de elementos: {df['Elementos'].min():,} - {df['Elementos'].max():,}")
    
    # Verificar el incremento esperado
    if len(df) > 1:
        incrementos = df['Elementos'].diff().dropna()
        incremento_promedio = incrementos.mean()
        print(f"Incremento promedio entre pruebas: {incremento_promedio:,.0f} elementos")
        
        if abs(incremento_promedio - 10000) < 100:  # Tolerancia de 100
            print("✓ Incremento consistente de ~10,000 elementos por prueba")
    
    print(f"Tiempo mínimo: {df['Tiempo (ms)'].min():.2f} ms")
    print(f"Tiempo máximo: {df['Tiempo (ms)'].max():.2f} ms")
    print(f"Tiempo promedio: {df['Tiempo (ms)'].mean():.2f} ms")
    print(f"Tiempo por elemento promedio: {df['Tiempo por Elemento (ms)'].mean():.6f} ms")
    
    # Calcular tasa de crecimiento
    if len(df) > 1:
        factor_crecimiento = df['Tiempo (ms)'].iloc[-1] / df['Tiempo (ms)'].iloc[0]
        print(f"Factor de crecimiento total: {factor_crecimiento:.2f}x")
        
    # Verificar rango esperado de 10,000 a 1,000,000
    elementos_esperados = list(range(10000, 1000001, 10000))
    if len(df) == 100 and df['Elementos'].iloc[0] == 10000 and df['Elementos'].iloc[-1] == 1000000:
        print("✓ Rango de datos correcto: 10,000 a 1,000,000 elementos")
    else:
        print(f"⚠ Rango inesperado. Primer valor: {df['Elementos'].iloc[0]:,}, Último: {df['Elementos'].iloc[-1]:,}")

def main():
    """
    Función principal que ejecuta todo el análisis.
    """
    # Solicitar ruta del archivo
    ruta_archivo = input("Ingresa la ruta del archivo de texto (o presiona Enter para usar 'datos.txt'): ").strip()
    
    if not ruta_archivo:
        ruta_archivo = 'datos.txt'
    
    # Verificar si el archivo existe y mostrar información detallada
    if not Path(ruta_archivo).exists():
        print(f"❌ ERROR: El archivo '{ruta_archivo}' no existe.")
        print(f"📁 Directorio actual: {Path.cwd()}")
        print("📋 Archivos disponibles en el directorio:")
        
        # Mostrar archivos .txt disponibles
        archivos_txt = list(Path.cwd().glob("*.txt"))
        if archivos_txt:
            for archivo in archivos_txt:
                print(f"   - {archivo.name}")
        else:
            print("   (No hay archivos .txt en el directorio)")
            
        # Preguntar si quiere crear archivo de ejemplo
        respuesta = input("\n¿Deseas crear un archivo de ejemplo para probar? (s/n): ").lower()
        if respuesta == 's':
            # Crear archivo de ejemplo con 100 pruebas
            contenido_ejemplo = []
            for i in range(1, 101):  # 100 pruebas
                elementos = i * 10000  # Incrementos de 10,000
                tiempo = elementos * 0.005 + np.random.uniform(0, elementos * 0.001)  # Tiempo simulado
                contenido_ejemplo.append(f"Tamaño: {elementos:,} elementos")
                contenido_ejemplo.append(f"Tiempo total: {tiempo:.2f} ms")
            
            with open('datos_ejemplo.txt', 'w', encoding='utf-8') as f:
                f.write('\n'.join(contenido_ejemplo))
            
            print("✅ Archivo de ejemplo creado como 'datos_ejemplo.txt'")
            ruta_archivo = 'datos_ejemplo.txt'
        else:
            print("❌ Operación cancelada. Por favor, verifica la ruta del archivo.")
            return
    else:
        print(f"✅ Archivo encontrado: {ruta_archivo}")
        
        # Mostrar información del archivo
        archivo_path = Path(ruta_archivo)
        print(f"📊 Tamaño del archivo: {archivo_path.stat().st_size} bytes")
        
        # Mostrar primeras líneas del archivo para verificar
        try:
            with open(ruta_archivo, 'r', encoding='utf-8') as f:
                primeras_lineas = [f.readline().strip() for _ in range(5)]
            
            print("🔍 Primeras líneas del archivo:")
            for i, linea in enumerate(primeras_lineas, 1):
                if linea:
                    print(f"   {i}: {linea}")
                else:
                    break
        except Exception as e:
            print(f"⚠ Error al leer archivo: {e}")
    
    # Procesar datos
    print(f"\n📖 Procesando archivo: {ruta_archivo}")
    datos = leer_archivo_rendimiento(ruta_archivo)
    
    if not datos:
        print("❌ No se encontraron datos válidos en el archivo.")
        print("💡 Verifica que el archivo contenga líneas con el formato:")
        print("   'Tamaño: X elementos' y 'Tiempo total: Y ms'")
        return
    
    # Crear DataFrame
    df = crear_dataframe(datos)
    
    # Mostrar vista previa de los datos (primeros y últimos 5)
    print("\n📋 Vista previa de los datos extraídos:")
    print("Primeras 5 pruebas:")
    print(df.head().to_string(index=False))
    if len(df) > 10:
        print("...")
        print("Últimas 5 pruebas:")
        print(df.tail().to_string(index=False))
    
    # Mostrar estadísticas
    mostrar_estadisticas(df)
    
    # Guardar en Excel
    print(f"\n💾 Guardando resultados...")
    guardar_excel(df)
    
    # Crear gráficos
    print("📊 Generando gráficos...")
    crear_graficos(df)
    
    print(f"\n✅ Análisis completado. Archivos generados:")
    print("- datos_rendimiento.xlsx")
    print("- analisis_rendimiento.png")

if __name__ == "__main__":
    main()