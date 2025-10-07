import re
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

def leer_archivo_rendimiento(ruta_archivo):
    """
    Lee un archivo de texto y extrae los datos de tamaño y tiempo.
    Formato esperado: "Tamaño: X elementos | Tiempo: Y ms" (todo en una línea)
    
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
            
            # Patrón para capturar el formato: "Tamaño: X elementos | Tiempo: Y ms"
            # Este patrón busca números con o sin comas, y valores decimales para el tiempo
            patron_completo = r'Tamaño:\s*([0-9,]+)\s*elementos\s*\|\s*Tiempo:\s*([0-9,.]+)\s*ms'
            
            for i, linea in enumerate(lineas, 1):
                linea = linea.strip()
                
                # Saltar líneas vacías
                if not linea:
                    continue
                
                # Buscar el patrón completo en la línea
                match = re.search(patron_completo, linea)
                
                if match:
                    # Extraer y limpiar el tamaño (remover comas)
                    tamano_str = match.group(1).replace(',', '')
                    # Extraer y limpiar el tiempo (remover comas si las hay)
                    tiempo_str = match.group(2).replace(',', '')
                    
                    try:
                        tamano = int(tamano_str)
                        tiempo = float(tiempo_str)
                        datos.append((tamano, tiempo))
                    except ValueError as e:
                        print(f"⚠ Advertencia en línea {i}: No se pudo convertir los valores ({tamano_str}, {tiempo_str})")
                        continue
                else:
                    # Si la línea no está vacía pero no coincide con el patrón, mostrar advertencia
                    if len(linea) > 5:  # Solo si tiene contenido significativo
                        print(f"⚠ Línea {i} no coincide con el formato esperado: {linea[:50]}...")
                        
        print(f"✓ Se encontraron {len(datos)} registros válidos")
        
        # Verificar consistencia de los datos
        if datos:
            primer_tamano = datos[0][0]
            ultimo_tamano = datos[-1][0]
            print(f"📊 Rango detectado: {primer_tamano:,} a {ultimo_tamano:,} elementos")
            
            # Detectar el incremento entre pruebas
            if len(datos) > 1:
                incrementos = [datos[i][0] - datos[i-1][0] for i in range(1, len(datos))]
                incremento_comun = max(set(incrementos), key=incrementos.count)
                print(f"📈 Incremento más común entre pruebas: {incremento_comun:,} elementos")
        
    except FileNotFoundError:
        print(f"❌ Error: No se pudo encontrar el archivo '{ruta_archivo}'")
        return []
    except Exception as e:
        print(f"❌ Error inesperado al leer el archivo: {e}")
        return []
    
    return datos

def crear_dataframe(datos):
    """
    Convierte los datos en un DataFrame de pandas y los ordena.
    Agrega columnas calculadas para análisis adicional.
    
    Args:
        datos (list): Lista de tuplas (tamaño, tiempo)
    
    Returns:
        pd.DataFrame: DataFrame ordenado con métricas calculadas
    """
    if not datos:
        return pd.DataFrame()
    
    # Crear DataFrame básico
    df = pd.DataFrame(datos, columns=['Elementos', 'Tiempo (ms)'])
    
    # Ordenar por número de elementos para asegurar consistencia
    df = df.sort_values('Elementos').reset_index(drop=True)
    
    # Calcular métricas adicionales que ayudan a entender el rendimiento
    
    # Tiempo promedio por cada elemento procesado
    df['Tiempo por Elemento (μs)'] = (df['Tiempo (ms)'] / df['Elementos']) * 1000
    
    # Calcular la tasa de crecimiento del tiempo respecto a la prueba anterior
    df['Crecimiento Tiempo (%)'] = df['Tiempo (ms)'].pct_change() * 100
    
    # Calcular el ratio entre el tiempo y n*log(n) para verificar complejidad O(n log n)
    df['Ratio Tiempo/(n log n)'] = df['Tiempo (ms)'] / (df['Elementos'] * np.log2(df['Elementos']))
    
    return df

def guardar_excel(df, nombre_archivo='analisis_rendimiento.xlsx'):
    """
    Guarda el DataFrame en un archivo Excel con formato profesional.
    Incluye múltiples hojas con diferentes vistas de los datos.
    
    Args:
        df (pd.DataFrame): DataFrame con los datos
        nombre_archivo (str): Nombre del archivo Excel a crear
    """
    if df.empty:
        print("⚠ No hay datos para guardar en Excel")
        return
    
    try:
        with pd.ExcelWriter(nombre_archivo, engine='openpyxl') as writer:
            # Hoja principal con todos los datos
            df.to_excel(writer, sheet_name='Datos Completos', index=False)
            
            # Hoja con estadísticas resumidas
            stats_df = pd.DataFrame({
                'Métrica': [
                    'Número de Pruebas',
                    'Elementos Mínimos',
                    'Elementos Máximos',
                    'Tiempo Mínimo (ms)',
                    'Tiempo Máximo (ms)',
                    'Tiempo Promedio (ms)',
                    'Desviación Estándar Tiempo',
                    'Tiempo por Elemento Promedio (μs)'
                ],
                'Valor': [
                    len(df),
                    df['Elementos'].min(),
                    df['Elementos'].max(),
                    df['Tiempo (ms)'].min(),
                    df['Tiempo (ms)'].max(),
                    df['Tiempo (ms)'].mean(),
                    df['Tiempo (ms)'].std(),
                    df['Tiempo por Elemento (μs)'].mean()
                ]
            })
            stats_df.to_excel(writer, sheet_name='Estadísticas', index=False)
            
            # Formatear las hojas
            for sheet_name in writer.sheets:
                worksheet = writer.sheets[sheet_name]
                
                # Ajustar el ancho de las columnas basándose en el contenido
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    
                    for cell in column:
                        try:
                            if cell.value:
                                max_length = max(max_length, len(str(cell.value)))
                        except:
                            pass
                    
                    # Establecer un ancho apropiado, pero no excesivo
                    adjusted_width = min(max_length + 2, 50)
                    worksheet.column_dimensions[column_letter].width = adjusted_width
        
        print(f"✅ Archivo Excel guardado exitosamente: {nombre_archivo}")
        
    except Exception as e:
        print(f"❌ Error al guardar archivo Excel: {e}")

def crear_graficos(df, nombre_algoritmo='Sort Nativo', guardar_graficos=True):
    """
    Crea visualizaciones comprehensivas de los datos de rendimiento.
    Incluye múltiples perspectivas para entender el comportamiento del algoritmo.
    
    Args:
        df (pd.DataFrame): DataFrame con los datos
        nombre_algoritmo (str): Nombre del algoritmo para los títulos
        guardar_graficos (bool): Si guardar los gráficos como archivo PNG
    """
    if df.empty:
        print("⚠ No hay datos para graficar")
        return
    
    # Configurar estilo visual moderno
    plt.style.use('seaborn-v0_8-darkgrid')
    
    # Crear una figura grande con múltiples subgráficos
    fig = plt.figure(figsize=(16, 12))
    fig.suptitle(f'Análisis Completo de Rendimiento - {nombre_algoritmo}', 
                 fontsize=18, fontweight='bold', y=0.995)
    
    # Crear una cuadrícula de subgráficos 3x2
    gs = fig.add_gridspec(3, 2, hspace=0.3, wspace=0.3)
    
    # Gráfico 1: Tiempo vs Elementos (línea principal)
    ax1 = fig.add_subplot(gs[0, :])  # Ocupa toda la primera fila
    ax1.plot(df['Elementos'], df['Tiempo (ms)'], 
             marker='o', linewidth=2.5, markersize=4, 
             color='#2E86AB', label='Tiempo de ejecución')
    ax1.fill_between(df['Elementos'], df['Tiempo (ms)'], alpha=0.3, color='#2E86AB')
    ax1.set_xlabel('Número de Elementos', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Tiempo (ms)', fontsize=12, fontweight='bold')
    ax1.set_title('Curva de Rendimiento: Tiempo vs Tamaño del Arreglo', 
                  fontsize=14, pad=10)
    ax1.grid(True, alpha=0.4, linestyle='--')
    ax1.legend(loc='upper left')
    
    # Agregar anotaciones en puntos clave
    if len(df) > 0:
        # Anotar el primer punto
        ax1.annotate(f'{df["Tiempo (ms)"].iloc[0]:.2f} ms', 
                     xy=(df['Elementos'].iloc[0], df['Tiempo (ms)'].iloc[0]),
                     xytext=(10, 10), textcoords='offset points',
                     bbox=dict(boxstyle='round,pad=0.5', fc='yellow', alpha=0.7),
                     arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0'))
        # Anotar el último punto
        ax1.annotate(f'{df["Tiempo (ms)"].iloc[-1]:.2f} ms', 
                     xy=(df['Elementos'].iloc[-1], df['Tiempo (ms)'].iloc[-1]),
                     xytext=(-60, -20), textcoords='offset points',
                     bbox=dict(boxstyle='round,pad=0.5', fc='yellow', alpha=0.7),
                     arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0'))
    
    # Gráfico 2: Eficiencia (Tiempo por elemento en microsegundos)
    ax2 = fig.add_subplot(gs[1, 0])
    ax2.plot(df['Elementos'], df['Tiempo por Elemento (μs)'], 
             marker='s', linewidth=2, markersize=5, color='#A23B72')
    ax2.set_xlabel('Número de Elementos', fontsize=11)
    ax2.set_ylabel('Tiempo por Elemento (μs)', fontsize=11)
    ax2.set_title('Eficiencia: Tiempo por Elemento', fontsize=12)
    ax2.grid(True, alpha=0.4)
    
    # Gráfico 3: Análisis de complejidad (escala log-log)
    ax3 = fig.add_subplot(gs[1, 1])
    ax3.loglog(df['Elementos'], df['Tiempo (ms)'], 
               marker='D', linewidth=2, markersize=5, color='#F18F01')
    ax3.set_xlabel('Número de Elementos (escala log)', fontsize=11)
    ax3.set_ylabel('Tiempo (ms) (escala log)', fontsize=11)
    ax3.set_title('Análisis de Complejidad (Log-Log)', fontsize=12)
    ax3.grid(True, alpha=0.4, which='both')
    
    # Agregar línea de referencia O(n log n) si es apropiado
    if len(df) > 1:
        x_ref = df['Elementos']
        # Calcular una línea de referencia basada en el primer punto
        factor = df['Tiempo (ms)'].iloc[0] / (df['Elementos'].iloc[0] * np.log2(df['Elementos'].iloc[0]))
        y_ref = factor * x_ref * np.log2(x_ref)
        ax3.loglog(x_ref, y_ref, '--', color='gray', alpha=0.7, label='O(n log n) teórico')
        ax3.legend()
    
    # Gráfico 4: Distribución de tiempos (histograma)
    ax4 = fig.add_subplot(gs[2, 0])
    ax4.hist(df['Tiempo (ms)'], bins=30, color='#06A77D', alpha=0.7, edgecolor='black')
    ax4.set_xlabel('Tiempo (ms)', fontsize=11)
    ax4.set_ylabel('Frecuencia', fontsize=11)
    ax4.set_title('Distribución de Tiempos de Ejecución', fontsize=12)
    ax4.grid(True, alpha=0.4, axis='y')
    
    # Gráfico 5: Ratio de consistencia (Tiempo / n log n)
    ax5 = fig.add_subplot(gs[2, 1])
    ax5.plot(df['Elementos'], df['Ratio Tiempo/(n log n)'], 
             marker='o', linewidth=2, markersize=4, color='#C73E1D')
    ax5.set_xlabel('Número de Elementos', fontsize=11)
    ax5.set_ylabel('Ratio Tiempo/(n log n)', fontsize=11)
    ax5.set_title('Consistencia del Algoritmo O(n log n)', fontsize=12)
    ax5.grid(True, alpha=0.4)
    
    # Agregar línea horizontal en el promedio para ver estabilidad
    promedio_ratio = df['Ratio Tiempo/(n log n)'].mean()
    ax5.axhline(y=promedio_ratio, color='red', linestyle='--', alpha=0.7, 
                label=f'Promedio: {promedio_ratio:.6f}')
    ax5.legend()
    
    # Ajustar el diseño para evitar superposiciones
    plt.tight_layout()
    
    # Guardar el gráfico si se solicita
    if guardar_graficos:
        nombre_archivo = 'analisis_rendimiento_completo.png'
        plt.savefig(nombre_archivo, dpi=300, bbox_inches='tight')
        print(f"✅ Gráficos guardados: {nombre_archivo}")
    
    plt.show()

def mostrar_estadisticas(df):
    """
    Muestra un resumen estadístico detallado de los datos de rendimiento.
    Proporciona información sobre la calidad y características de los datos.
    
    Args:
        df (pd.DataFrame): DataFrame con los datos de rendimiento
    """
    if df.empty:
        print("⚠ No hay datos para mostrar estadísticas")
        return
    
    print("\n" + "="*70)
    print(" "*20 + "ANÁLISIS ESTADÍSTICO DE RENDIMIENTO")
    print("="*70)
    
    # Información básica sobre el dataset
    print(f"\n📊 INFORMACIÓN DEL DATASET")
    print(f"   Número total de pruebas realizadas: {len(df)}")
    print(f"   Rango de elementos: {df['Elementos'].min():,} a {df['Elementos'].max():,}")
    
    # Calcular y mostrar el incremento entre pruebas
    if len(df) > 1:
        incrementos = df['Elementos'].diff().dropna()
        incremento_promedio = incrementos.mean()
        incremento_min = incrementos.min()
        incremento_max = incrementos.max()
        
        print(f"\n📈 INCREMENTOS ENTRE PRUEBAS")
        print(f"   Incremento promedio: {incremento_promedio:,.0f} elementos")
        print(f"   Incremento mínimo: {incremento_min:,.0f} elementos")
        print(f"   Incremento máximo: {incremento_max:,.0f} elementos")
        
        # Verificar si los incrementos son consistentes
        if incremento_min == incremento_max:
            print(f"   ✓ Incrementos perfectamente consistentes de {incremento_min:,.0f} elementos")
        elif abs(incremento_max - incremento_min) < incremento_promedio * 0.1:
            print(f"   ✓ Incrementos altamente consistentes")
        else:
            print(f"   ⚠ Los incrementos varían significativamente")
    
    # Estadísticas de tiempo de ejecución
    print(f"\n⏱️  TIEMPOS DE EJECUCIÓN")
    print(f"   Tiempo mínimo: {df['Tiempo (ms)'].min():.3f} ms")
    print(f"   Tiempo máximo: {df['Tiempo (ms)'].max():.3f} ms")
    print(f"   Tiempo promedio: {df['Tiempo (ms)'].mean():.3f} ms")
    print(f"   Mediana de tiempo: {df['Tiempo (ms)'].median():.3f} ms")
    print(f"   Desviación estándar: {df['Tiempo (ms)'].std():.3f} ms")
    
    # Análisis de eficiencia
    print(f"\n⚡ ANÁLISIS DE EFICIENCIA")
    print(f"   Tiempo promedio por elemento: {df['Tiempo por Elemento (μs)'].mean():.6f} μs")
    print(f"   Tiempo mínimo por elemento: {df['Tiempo por Elemento (μs)'].min():.6f} μs")
    print(f"   Tiempo máximo por elemento: {df['Tiempo por Elemento (μs)'].max():.6f} μs")
    
    # Análisis de crecimiento
    if len(df) > 1:
        factor_elementos = df['Elementos'].iloc[-1] / df['Elementos'].iloc[0]
        factor_tiempo = df['Tiempo (ms)'].iloc[-1] / df['Tiempo (ms)'].iloc[0]
        
        print(f"\n📊 ANÁLISIS DE ESCALABILIDAD")
        print(f"   Los elementos crecieron: {factor_elementos:.2f}x")
        print(f"   El tiempo creció: {factor_tiempo:.2f}x")
        
        # Para O(n log n), esperaríamos que el tiempo crezca aproximadamente n log n veces
        factor_teorico_nlogn = factor_elementos * (np.log2(df['Elementos'].iloc[-1]) / np.log2(df['Elementos'].iloc[0]))
        print(f"   Factor teórico O(n log n): {factor_teorico_nlogn:.2f}x")
        
        diferencia_porcentual = abs(factor_tiempo - factor_teorico_nlogn) / factor_teorico_nlogn * 100
        
        if diferencia_porcentual < 15:
            print(f"   ✓ El comportamiento es muy consistente con O(n log n) ({diferencia_porcentual:.1f}% de diferencia)")
        elif diferencia_porcentual < 30:
            print(f"   ~ El comportamiento es razonablemente consistente con O(n log n) ({diferencia_porcentual:.1f}% de diferencia)")
        else:
            print(f"   ⚠ El comportamiento difiere de O(n log n) teórico ({diferencia_porcentual:.1f}% de diferencia)")
    
    # Verificar estabilidad del ratio Tiempo/(n log n)
    if 'Ratio Tiempo/(n log n)' in df.columns:
        ratio_std = df['Ratio Tiempo/(n log n)'].std()
        ratio_mean = df['Ratio Tiempo/(n log n)'].mean()
        coef_variacion = (ratio_std / ratio_mean) * 100
        
        print(f"\n🎯 CONSISTENCIA DEL ALGORITMO")
        print(f"   Ratio promedio Tiempo/(n log n): {ratio_mean:.9f}")
        print(f"   Coeficiente de variación: {coef_variacion:.2f}%")
        
        if coef_variacion < 10:
            print(f"   ✓ Algoritmo muy estable y predecible")
        elif coef_variacion < 25:
            print(f"   ✓ Algoritmo razonablemente estable")
        else:
            print(f"   ⚠ El rendimiento varía considerablemente")
    
    print("\n" + "="*70 + "\n")

def main():
    """
    Función principal que coordina todo el proceso de análisis.
    Maneja la interacción con el usuario y el flujo de trabajo completo.
    """
    print("="*70)
    print(" "*15 + "ANALIZADOR DE RENDIMIENTO DE ALGORITMOS")
    print("="*70)
    
    # Solicitar la ruta del archivo al usuario
    ruta_archivo = input("\n📁 Ingresa la ruta del archivo de texto (o Enter para 'datos.txt'): ").strip()
    
    # Usar nombre por defecto si no se proporciona ruta
    if not ruta_archivo:
        ruta_archivo = 'datos.txt'
    
    # Eliminar comillas si el usuario las incluyó
    ruta_archivo = ruta_archivo.strip('"').strip("'")
    
    # Verificar si el archivo existe
    archivo_path = Path(ruta_archivo)
    
    if not archivo_path.exists():
        print(f"\n❌ ERROR: El archivo '{ruta_archivo}' no existe.")
        print(f"📂 Directorio actual: {Path.cwd()}")
        print("\n📋 Archivos .txt disponibles en el directorio actual:")
        
        # Listar archivos .txt disponibles
        archivos_txt = sorted(Path.cwd().glob("*.txt"))
        if archivos_txt:
            for i, archivo in enumerate(archivos_txt, 1):
                tamaño_kb = archivo.stat().st_size / 1024
                print(f"   {i}. {archivo.name} ({tamaño_kb:.2f} KB)")
        else:
            print("   (No se encontraron archivos .txt)")
        
        return
    
    # Mostrar información del archivo encontrado
    print(f"\n✅ Archivo encontrado: {archivo_path.name}")
    print(f"📊 Tamaño: {archivo_path.stat().st_size / 1024:.2f} KB")
    
    # Mostrar muestra del contenido
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            primeras_lineas = [f.readline().strip() for _ in range(3)]
        
        print("\n🔍 Primeras líneas del archivo:")
        for i, linea in enumerate(primeras_lineas, 1):
            if linea:
                # Truncar líneas muy largas
                linea_mostrar = linea if len(linea) <= 70 else linea[:70] + "..."
                print(f"   {i}: {linea_mostrar}")
    except Exception as e:
        print(f"⚠ No se pudo leer la vista previa: {e}")
    
    # Procesar el archivo
    print(f"\n{'='*70}")
    print("📖 Procesando archivo...")
    print(f"{'='*70}")
    
    datos = leer_archivo_rendimiento(ruta_archivo)
    
    if not datos:
        print("\n❌ No se encontraron datos válidos en el archivo.")
        print("💡 Verifica que el archivo contenga líneas con el formato:")
        print("   'Tamaño: X elementos | Tiempo: Y ms'")
        print("\nEjemplo válido:")
        print("   Tamaño: 10,000 elementos | Tiempo: 5.23 ms")
        return
    
    # Crear DataFrame con los datos extraídos
    df = crear_dataframe(datos)
    
    # Mostrar vista previa de los datos
    print(f"\n{'='*70}")
    print("📋 VISTA PREVIA DE LOS DATOS")
    print(f"{'='*70}")
    print("\nPrimeras 5 pruebas:")
    print(df.head().to_string(index=False))
    
    if len(df) > 10:
        print("\n... (pruebas intermedias omitidas) ...\n")
        print("Últimas 5 pruebas:")
        print(df.tail().to_string(index=False))
    
    # Mostrar estadísticas completas
    mostrar_estadisticas(df)
    
    # Preguntar nombre del algoritmo para personalizar los gráficos
    nombre_algoritmo = input("📝 Nombre del algoritmo (Enter para 'Sort Nativo'): ").strip()
    if not nombre_algoritmo:
        nombre_algoritmo = 'Sort Nativo'
    
    # Guardar resultados en Excel
    print(f"\n{'='*70}")
    print("💾 Guardando resultados...")
    print(f"{'='*70}")
    guardar_excel(df)
    
    # Crear visualizaciones
    print(f"\n{'='*70}")
    print("📊 Generando visualizaciones...")
    print(f"{'='*70}")
    crear_graficos(df, nombre_algoritmo=nombre_algoritmo)
    
    # Resumen final
    print(f"\n{'='*70}")
    print("✅ ANÁLISIS COMPLETADO EXITOSAMENTE")
    print(f"{'='*70}")
    print("\n📁 Archivos generados:")
    print("   • analisis_rendimiento.xlsx - Datos y estadísticas en Excel")
    print("   • analisis_rendimiento_completo.png - Visualizaciones gráficas")
    print(f"\n{'='*70}\n")

if __name__ == "__main__":
    main()