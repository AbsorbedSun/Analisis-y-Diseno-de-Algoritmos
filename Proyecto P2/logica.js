/**
 * SISTEMA DE PROGRAMACIÓN DE ENTREVISTAS ACADÉMICAS
 *
 * Este archivo contiene toda la lógica para programar entrevistas de aspirantes
 * considerando restricciones de horarios de profesores, concurrencia y disponibilidad.
 *
 * Estrategia: Algoritmo Greedy (voraz) con validación de restricciones múltiples
 */

// ============================================================================
// DATOS PRECARGADOS
// ============================================================================

/**
 * Horarios de trabajo de cada profesor
 * Los tiempos están en minutos desde medianoche (ej: 600 = 10:00 AM)
 */
const professorsData = [
  { name: "Lucas", startTime: 600, endTime: 1080 }, // 10:00 - 18:00
  { name: "Anselmo", startTime: 420, endTime: 900 }, // 7:00 - 15:00
  { name: "Lucrecia", startTime: 720, endTime: 1200 }, // 12:00 - 20:00
  { name: "Renato", startTime: 780, endTime: 1260 }, // 13:00 - 21:00
  { name: "Florinda", startTime: 420, endTime: 900 }, // 7:00 - 15:00
];

/**
 * Equipos de profesores asignados a cada aspirante
 * Cada equipo debe tener exactamente 3 profesores
 */
const teamsData = [
  { id: 1, professors: ["Lucas", "Anselmo", "Florinda"] },
  { id: 2, professors: ["Renato", "Anselmo", "Lucrecia"] },
  { id: 3, professors: ["Lucas", "Lucrecia", "Florinda"] },
  { id: 4, professors: ["Renato", "Lucas", "Florinda"] },
  { id: 5, professors: ["Lucrecia", "Anselmo", "Florinda"] },
  { id: 6, professors: ["Anselmo", "Lucas", "Florinda"] },
  { id: 7, professors: ["Anselmo", "Florinda", "Renato"] },
  { id: 8, professors: ["Lucrecia", "Renato", "Lucas"] },
];

// ============================================================================
// FUNCIÓN PRINCIPAL DE PROGRAMACIÓN
// ============================================================================

/**
 * Función principal que orquesta todo el proceso de scheduling
 * Lee los parámetros del usuario, ejecuta el algoritmo y muestra resultados
 */
function scheduleInterviews() {
  // Leer los parámetros configurados por el usuario
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const nonWorkingDays = document
    .getElementById("nonWorkingDays")
    .value.split(",")
    .map((d) => parseInt(d.trim()));
  const startTime = timeToMinutes(document.getElementById("startTime").value);
  const endTime = timeToMinutes(document.getElementById("endTime").value);
  const duration = parseInt(document.getElementById("duration").value) * 60; // Convertir a minutos
  const maxConcurrent = parseInt(document.getElementById("concurrent").value);

  // Generar la lista de días hábiles en el período especificado
  const workingDays = getWorkingDays(startDate, endDate, nonWorkingDays);

  // Estructuras para almacenar los resultados
  const schedule = []; // Entrevistas programadas exitosamente
  const unscheduled = []; // Entrevistas que no se pudieron programar

  // Intentar programar cada equipo de entrevista usando el algoritmo greedy
  for (let team of teamsData) {
    const scheduled = tryScheduleTeam(
      team,
      workingDays,
      startTime,
      endTime,
      duration,
      maxConcurrent,
      schedule
    );

    // Si no se pudo programar, agregarlo a la lista de no programados
    if (!scheduled) {
      unscheduled.push(team);
    }
  }

  // Mostrar los resultados en la interfaz
  displayResults(schedule, unscheduled, workingDays);
}

// ============================================================================
// ALGORITMO GREEDY DE SCHEDULING
// ============================================================================

/**
 * Intenta programar un equipo en el primer slot disponible que cumpla todas las restricciones
 *
 * Estrategia Greedy: Busca secuencialmente desde el primer día hasta el último,
 * y dentro de cada día desde la primera hora hasta la última, asignando el
 * primer slot válido que encuentre.
 *
 * @param {Object} team - El equipo a programar (incluye id y array de profesores)
 * @param {Array} workingDays - Lista de fechas que son días hábiles
 * @param {number} startTime - Hora de inicio del horario de aplicación (en minutos)
 * @param {number} endTime - Hora de fin del horario de aplicación (en minutos)
 * @param {number} duration - Duración de la entrevista (en minutos)
 * @param {number} maxConcurrent - Número máximo de entrevistas simultáneas permitidas
 * @param {Array} schedule - Array de entrevistas ya programadas (se modifica si se encuentra slot)
 * @returns {boolean} true si se programó exitosamente, false en caso contrario
 */
function tryScheduleTeam(
  team,
  workingDays,
  startTime,
  endTime,
  duration,
  maxConcurrent,
  schedule
) {
  // Iterar sobre cada día hábil en orden cronológico
  for (let day of workingDays) {
    // Dentro de cada día, probar slots de tiempo en incrementos de 30 minutos
    let currentTime = startTime;

    while (currentTime + duration <= endTime) {
      // RESTRICCIÓN 1: Verificar disponibilidad de horarios de profesores
      // Todos los profesores del equipo deben estar en su horario laboral
      const allAvailable = checkProfessorsAvailable(
        team.professors,
        currentTime,
        duration
      );

      if (!allAvailable) {
        currentTime += 30; // Avanzar 30 minutos y probar siguiente slot
        continue;
      }

      // RESTRICCIÓN 2: Verificar límite de concurrencia
      // No podemos tener más de M entrevistas al mismo tiempo (límite de salones)
      const concurrentCount = countConcurrentInterviews(
        schedule,
        day,
        currentTime,
        duration
      );

      if (concurrentCount >= maxConcurrent) {
        currentTime += 30;
        continue;
      }

      // RESTRICCIÓN 3: Verificar que ningún profesor esté en dos lugares a la vez
      // Si un profesor ya tiene otra entrevista en este horario, no puede estar aquí
      const professorBusy = isProfessorBusy(
        team.professors,
        schedule,
        day,
        currentTime,
        duration
      );

      if (professorBusy) {
        currentTime += 30;
        continue;
      }

      // ¡ÉXITO! Todas las restricciones se cumplieron
      // Agregar esta entrevista al calendario
      schedule.push({
        team: team,
        day: day,
        startTime: currentTime,
        endTime: currentTime + duration,
        concurrent: concurrentCount + 1, // Número de sala asignada
      });

      return true; // Entrevista programada exitosamente
    }
  }

  // No se encontró ningún slot válido en ningún día
  return false;
}

// ============================================================================
// FUNCIONES DE VALIDACIÓN DE RESTRICCIONES
// ============================================================================

/**
 * Verifica que todos los profesores de un equipo estén disponibles en un horario específico
 * Un profesor está disponible si el slot de la entrevista cae completamente dentro
 * de su horario laboral.
 *
 * @param {Array} professorNames - Nombres de los profesores a verificar
 * @param {number} startTime - Hora de inicio propuesta (en minutos)
 * @param {number} duration - Duración de la entrevista (en minutos)
 * @returns {boolean} true si todos están disponibles, false en caso contrario
 */
function checkProfessorsAvailable(professorNames, startTime, duration) {
  for (let profName of professorNames) {
    // Buscar los datos del profesor
    const prof = professorsData.find((p) => p.name === profName);
    if (!prof) continue;

    // El profesor debe estar disponible durante TODO el período de la entrevista
    // Por ejemplo, si la entrevista es de 14:00 a 16:00 y el profesor trabaja
    // hasta las 15:00, esto NO es válido
    if (startTime < prof.startTime || startTime + duration > prof.endTime) {
      return false;
    }
  }
  return true;
}

/**
 * Cuenta cuántas entrevistas ya están programadas en un slot de tiempo específico
 * Esto es necesario para respetar el límite de concurrencia (número de salones disponibles)
 *
 * @param {Array} schedule - Array de entrevistas ya programadas
 * @param {Date} day - El día a verificar
 * @param {number} startTime - Hora de inicio del slot (en minutos)
 * @param {number} duration - Duración de la entrevista (en minutos)
 * @returns {number} Cantidad de entrevistas concurrentes en ese slot
 */
function countConcurrentInterviews(schedule, day, startTime, duration) {
  let count = 0;
  const endTime = startTime + duration;

  for (let entry of schedule) {
    // Solo considerar entrevistas del mismo día
    if (entry.day.getTime() !== day.getTime()) continue;

    // Verificar si hay solapamiento de tiempo
    // Dos intervalos [a1, a2] y [b1, b2] se solapan si NOT (a2 <= b1 OR a1 >= b2)
    if (!(entry.endTime <= startTime || entry.startTime >= endTime)) {
      count++;
    }
  }

  return count;
}

/**
 * Verifica si algún profesor del equipo ya está ocupado en otro evento durante este slot
 * Un profesor no puede estar en dos entrevistas al mismo tiempo
 *
 * @param {Array} professorNames - Nombres de los profesores a verificar
 * @param {Array} schedule - Array de entrevistas ya programadas
 * @param {Date} day - El día a verificar
 * @param {number} startTime - Hora de inicio del slot (en minutos)
 * @param {number} duration - Duración de la entrevista (en minutos)
 * @returns {boolean} true si algún profesor está ocupado, false si todos están libres
 */
function isProfessorBusy(professorNames, schedule, day, startTime, duration) {
  const endTime = startTime + duration;

  for (let entry of schedule) {
    // Solo considerar entrevistas del mismo día
    if (entry.day.getTime() !== day.getTime()) continue;

    // Verificar si hay solapamiento de tiempo
    if (!(entry.endTime <= startTime || entry.startTime >= endTime)) {
      // Hay solapamiento de horario, ahora verificar si comparten profesores
      for (let profName of professorNames) {
        if (entry.team.professors.includes(profName)) {
          return true; // Este profesor ya está ocupado en este horario
        }
      }
    }
  }

  return false; // Ningún profesor está ocupado
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Genera una lista de días hábiles dentro de un rango de fechas
 * Excluye los días especificados en nonWorkingDays (por ejemplo, fines de semana)
 *
 * @param {Date} startDate - Fecha de inicio del período
 * @param {Date} endDate - Fecha de fin del período
 * @param {Array} nonWorkingDays - Array de números representando días no hábiles (0=Domingo, 6=Sábado)
 * @returns {Array} Array de objetos Date que son días hábiles
 */
function getWorkingDays(startDate, endDate, nonWorkingDays) {
  const days = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado

    // Si este día NO está en la lista de días no hábiles, es un día hábil
    if (!nonWorkingDays.includes(dayOfWeek)) {
      days.push(new Date(current)); // Agregar una copia de la fecha
    }

    // Avanzar al siguiente día
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Convierte un string de tiempo en formato HH:MM a minutos desde medianoche
 * Ejemplo: "14:30" -> 870 minutos (14*60 + 30)
 *
 * @param {string} timeStr - Tiempo en formato "HH:MM"
 * @returns {number} Minutos desde medianoche
 */
function timeToMinutes(timeStr) {
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

/**
 * Convierte minutos desde medianoche a formato de tiempo HH:MM
 * Ejemplo: 870 -> "14:30"
 *
 * @param {number} minutes - Minutos desde medianoche
 * @returns {string} Tiempo en formato "HH:MM"
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// ============================================================================
// FUNCIONES DE VISUALIZACIÓN Y PRESENTACIÓN
// ============================================================================

/**
 * Muestra los resultados completos de la programación en la interfaz
 * Incluye estadísticas, programación exitosa y análisis de entrevistas no programadas
 *
 * @param {Array} schedule - Array de entrevistas programadas exitosamente
 * @param {Array} unscheduled - Array de equipos que no se pudieron programar
 * @param {Array} workingDays - Lista de días hábiles disponibles
 */
function displayResults(schedule, unscheduled, workingDays) {
  const resultsDiv = document.getElementById("results");
  let html = "";

  // ========== SECCIÓN DE ESTADÍSTICAS ==========
  html += '<div class="stats">';
  html += `<div class="stat-card">
        <div class="stat-number">${schedule.length}</div>
        <div class="stat-label">Entrevistas Programadas</div>
    </div>`;
  html += `<div class="stat-card">
        <div class="stat-number">${unscheduled.length}</div>
        <div class="stat-label">No Programadas</div>
    </div>`;
  html += `<div class="stat-card">
        <div class="stat-number">${workingDays.length}</div>
        <div class="stat-label">Días Hábiles</div>
    </div>`;
  html += "</div>";

  // ========== ALERTAS DE ESTADO ==========
  if (schedule.length === teamsData.length) {
    html += '<div class="alert alert-success">';
    html +=
      "<strong>✅ Éxito total:</strong> Todas las entrevistas fueron programadas exitosamente.";
    html += "</div>";
  } else if (schedule.length > 0) {
    html += '<div class="alert alert-warning">';
    html +=
      "<strong>⚠️ Programación parcial:</strong> Se programaron " +
      schedule.length +
      " de " +
      teamsData.length +
      " entrevistas.";
    html += "</div>";
  } else {
    html += '<div class="alert alert-error">';
    html +=
      "<strong>❌ Error:</strong> No se pudo programar ninguna entrevista. Revise los parámetros.";
    html += "</div>";
  }

  // ========== PROGRAMACIÓN EXITOSA ==========
  if (schedule.length > 0) {
    html += '<div class="section">';
    html += "<h2>📅 Programación de Entrevistas</h2>";

    // Agrupar entrevistas por día
    const scheduleByDay = {};
    for (let entry of schedule) {
      const dayKey = entry.day.toISOString().split("T")[0];
      if (!scheduleByDay[dayKey]) {
        scheduleByDay[dayKey] = [];
      }
      scheduleByDay[dayKey].push(entry);
    }

    // Ordenar las entrevistas de cada día por hora de inicio
    for (let dayKey in scheduleByDay) {
      scheduleByDay[dayKey].sort((a, b) => a.startTime - b.startTime);
    }

    // Mostrar cada día con sus entrevistas
    for (let dayKey in scheduleByDay) {
      const dayEntries = scheduleByDay[dayKey];
      const dateObj = new Date(dayKey + "T12:00:00");
      const dateStr = dateObj.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      html += '<div class="schedule-day">';
      html += `<h3>${dateStr}</h3>`;

      // Mostrar cada entrevista del día
      for (let entry of dayEntries) {
        const concurrentClass = entry.concurrent > 1 ? "concurrent" : "";
        html += `<div class="interview-slot ${concurrentClass}">`;
        html += `<div class="interview-header">Entrevista - Aspirante ${entry.team.id}</div>`;
        html += `<div class="interview-details">`;
        html += `<strong>Horario:</strong> ${formatTime(
          entry.startTime
        )} - ${formatTime(entry.endTime)}<br>`;

        // Si es concurrente, indicar el número de sala
        if (entry.concurrent > 1) {
          html += `<strong>⚡ Concurrente:</strong> Sala ${entry.concurrent}<br>`;
        }

        // Mostrar los profesores como etiquetas
        html += `<div class="professors">`;
        for (let prof of entry.team.professors) {
          html += `<span class="professor-tag">${prof}</span>`;
        }
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
      }

      html += "</div>";
    }

    html += "</div>";
  }

  // ========== ENTREVISTAS NO PROGRAMADAS ==========
  if (unscheduled.length > 0) {
    html += '<div class="section">';
    html += "<h2>❌ Entrevistas No Programadas</h2>";

    for (let team of unscheduled) {
      // Analizar por qué no se pudo programar este equipo
      const reason = analyzeWhyNotScheduled(team, workingDays);

      html += '<div class="no-schedule">';
      html += `<h4>Aspirante ${team.id}</h4>`;
      html += `<p><strong>Profesores:</strong> ${team.professors.join(
        ", "
      )}</p>`;
      html += `<p><strong>Razón:</strong> ${reason}</p>`;
      html += "</div>";
    }

    html += "</div>";
  }

  // Insertar todo el HTML generado en la página
  resultsDiv.innerHTML = html;
}

/**
 * Analiza por qué un equipo no pudo ser programado y retorna una explicación detallada
 * Esto ayuda al usuario a entender qué restricción no se pudo cumplir
 *
 * @param {Object} team - El equipo que no se pudo programar
 * @param {Array} workingDays - Lista de días hábiles disponibles
 * @returns {string} Explicación de por qué no se pudo programar
 */
function analyzeWhyNotScheduled(team, workingDays) {
  const startTime = timeToMinutes(document.getElementById("startTime").value);
  const endTime = timeToMinutes(document.getElementById("endTime").value);
  const duration = parseInt(document.getElementById("duration").value) * 60;

  // Obtener los horarios de todos los profesores del equipo
  const profSchedules = team.professors.map((name) => {
    return professorsData.find((p) => p.name === name);
  });

  // Encontrar el horario común entre todos los profesores
  // El inicio común es el máximo de todos los inicios (el último en empezar)
  // El fin común es el mínimo de todos los fines (el primero en terminar)
  let commonStart = Math.max(...profSchedules.map((p) => p.startTime));
  let commonEnd = Math.min(...profSchedules.map((p) => p.endTime));

  // ANÁLISIS 1: ¿Hay suficiente solapamiento entre horarios de profesores?
  if (commonEnd - commonStart < duration) {
    return `No hay suficiente solapamiento en los horarios de los profesores. Horario común: ${formatTime(
      commonStart
    )} - ${formatTime(commonEnd)} (requiere ${duration / 60} horas continuas).`;
  }

  // ANÁLISIS 2: ¿El horario común cae dentro del horario de aplicación?
  commonStart = Math.max(commonStart, startTime);
  commonEnd = Math.min(commonEnd, endTime);

  if (commonEnd - commonStart < duration) {
    return `El horario común de los profesores no coincide suficientemente con el horario de aplicación (${formatTime(
      startTime
    )} - ${formatTime(endTime)}).`;
  }

  // ANÁLISIS 3: Si llegamos aquí, el problema es saturación de recursos
  return `Todos los slots disponibles están ocupados por otras entrevistas o se alcanzó el límite de concurrencia. Considere aumentar el número de días hábiles, ampliar el horario de aplicación, o aumentar el límite de concurrencia.`;
}

// ============================================================================
// FUNCIONES DE INICIALIZACIÓN Y VISUALIZACIÓN DE DATOS
// ============================================================================

/**
 * Muestra los horarios de todos los profesores en la interfaz
 * Se ejecuta automáticamente al cargar la página
 */
function displayProfessorsData() {
  const container = document.getElementById("professorsDisplay");
  let html = "";

  for (let prof of professorsData) {
    html += '<div class="professor-item">';
    html += `<div class="professor-name">${prof.name}</div>`;
    html += `<div class="professor-schedule">`;
    html += `⏰ ${formatTime(prof.startTime)} - ${formatTime(prof.endTime)}`;
    const totalHours = (prof.endTime - prof.startTime) / 60;
    html += ` <span style="color: #999;">(${totalHours} horas)</span>`;
    html += `</div>`;
    html += "</div>";
  }

  container.innerHTML = html;
}

/**
 * Muestra todos los equipos de aspirantes con sus profesores asignados
 * Se ejecuta automáticamente al cargar la página
 */
function displayTeamsData() {
  const container = document.getElementById("teamsDisplay");
  let html = "";

  for (let team of teamsData) {
    html += '<div class="team-item">';
    html += `<div class="team-header">Aspirante ${team.id}</div>`;
    html += '<div class="team-professors">';

    for (let prof of team.professors) {
      html += `<span class="team-professor-tag">${prof}</span>`;
    }

    html += "</div>";
    html += "</div>";
  }

  container.innerHTML = html;
}

/**
 * Función que se ejecuta automáticamente cuando se carga la página
 * Inicializa la visualización de todos los datos
 */
window.onload = function () {
  // Mostrar los datos de profesores y equipos
  displayProfessorsData();
  displayTeamsData();

  console.log("Sistema de programación de entrevistas cargado exitosamente");
  console.log(`Profesores registrados: ${professorsData.length}`);
  console.log(`Equipos de aspirantes: ${teamsData.length}`);
};
