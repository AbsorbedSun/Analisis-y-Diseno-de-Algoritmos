/**
 * ============================================================================
 * FUNCIONES AUXILIARES
 * ============================================================================
 * Funciones de utilidad para conversión de tiempo, fechas, etc.
 */

/**
 * Convierte un string de tiempo "HH:MM" a minutos desde medianoche
 */
function timeToMinutes(timeStr) {
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

/**
 * Convierte minutos desde medianoche a formato "HH:MM"
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Genera una lista de días hábiles entre dos fechas
 */
function getWorkingDays(startDate, endDate, nonWorkingDays) {
  const days = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();

    if (!nonWorkingDays.includes(dayOfWeek)) {
      days.push(new Date(current));
    }

    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Verifica si todos los profesores están disponibles en un horario
 */
function checkProfessorsAvailable(professorNames, startTime, duration) {
  for (let profName of professorNames) {
    const prof = professorsData.find((p) => p.name === profName);
    if (!prof) continue;

    if (startTime < prof.startTime || startTime + duration > prof.endTime) {
      return false;
    }
  }
  return true;
}

/**
 * Cuenta entrevistas concurrentes en un slot de tiempo
 */
function countConcurrentInterviews(schedule, day, startTime, duration) {
  let count = 0;
  const endTime = startTime + duration;

  for (let entry of schedule) {
    if (entry.day.getTime() !== day.getTime()) continue;

    // Verificar solapamiento
    if (!(entry.endTime <= startTime || entry.startTime >= endTime)) {
      count++;
    }
  }

  return count;
}

/**
 * Verifica si algún profesor está ocupado en un slot
 */
function isProfessorBusy(professorNames, schedule, day, startTime, duration) {
  const endTime = startTime + duration;

  for (let entry of schedule) {
    if (entry.day.getTime() !== day.getTime()) continue;

    // Hay solapamiento de horario
    if (!(entry.endTime <= startTime || entry.startTime >= endTime)) {
      for (let profName of professorNames) {
        if (entry.team.professors.includes(profName)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Formatea una fecha para mostrar
 */
function formatDate(date) {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
