/**
 * ============================================================================
 * FUNCIONES AUXILIARES
 * ============================================================================
 */

function timeToMinutes(timeStr) {
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Genera días hábiles (lunes a viernes) entre dos fechas
 * CORREGIDO: Maneja fechas correctamente sin problemas de zona horaria
 */
function getWorkingDays(startDate, endDate) {
  const days = [];

  // Crear fechas locales sin problemas de zona horaria
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  const current = new Date(start);

  console.log("🔍 Generando días hábiles:");
  console.log(
    `  Desde: ${current.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`
  );
  console.log(
    `  Hasta: ${end.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`
  );

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
    const dayName = current.toLocaleDateString("es-ES", { weekday: "long" });

    // Solo incluir días de lunes (1) a viernes (5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const workingDay = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate()
      );
      days.push(workingDay);
      console.log(`  ✅ ${dayName} ${current.getDate()} - DÍA HÁBIL`);
    } else {
      console.log(
        `  ❌ ${dayName} ${current.getDate()} - NO HÁBIL (fin de semana)`
      );
    }

    current.setDate(current.getDate() + 1);
  }

  console.log(`📅 Total días hábiles encontrados: ${days.length}`);
  return days;
}

function formatDate(date) {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Compara si dos fechas son el mismo día (ignora hora)
 */
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

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

function isProfessorBusy(professorNames, schedule, day, startTime, duration) {
  const endTime = startTime + duration;

  for (let entry of schedule) {
    // Comparar solo la fecha (sin hora) usando componentes de fecha
    if (!isSameDay(entry.day, day)) continue;

    // Verificar solapamiento de tiempo: (start1 < end2) AND (start2 < end1)
    const hasOverlap = startTime < entry.endTime && entry.startTime < endTime;

    if (hasOverlap) {
      for (let profName of professorNames) {
        if (entry.team.professors.includes(profName)) {
          return true;
        }
      }
    }
  }
  return false;
}

function countConcurrentInterviews(schedule, day, startTime, duration) {
  let count = 0;
  const endTime = startTime + duration;

  for (let entry of schedule) {
    if (!isSameDay(entry.day, day)) continue;

    const hasOverlap = startTime < entry.endTime && entry.startTime < endTime;
    if (hasOverlap) {
      count++;
    }
  }
  return count;
}
