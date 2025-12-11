/**
 * ============================================================================
 * ALGORITMO DE PROGRAMACIÓN: VORAZ (GREEDY)
 * ============================================================================
 */

function getCommonTimeWindow(professorNames) {
  let commonStart = 0;
  let commonEnd = 24 * 60;

  for (let profName of professorNames) {
    const prof = professorsData.find((p) => p.name === profName);
    if (prof) {
      commonStart = Math.max(commonStart, prof.startTime);
      commonEnd = Math.min(commonEnd, prof.endTime);
    }
  }

  return {
    start: commonStart,
    end: commonEnd,
    window: commonEnd - commonStart,
  };
}

function calculateTeamPriority(team) {
  const window = getCommonTimeWindow(team.professors);
  return window.window;
}

function isSlotValid(team, day, startTime, duration, schedule, config) {
  const endTime = startTime + duration;
  const { startTime: appStart, endTime: appEnd, maxConcurrent } = config;

  if (startTime < appStart || endTime > appEnd) {
    return { valid: false, reason: "Fuera del horario de aplicación" };
  }

  for (let profName of team.professors) {
    const prof = professorsData.find((p) => p.name === profName);
    if (!prof) {
      return { valid: false, reason: `Profesor ${profName} no encontrado` };
    }
    if (startTime < prof.startTime || endTime > prof.endTime) {
      return { valid: false, reason: `Profesor ${profName} no disponible` };
    }
  }

  if (isProfessorBusy(team.professors, schedule, day, startTime, duration)) {
    return { valid: false, reason: "Profesor ocupado" };
  }

  const concurrentCount = countConcurrentInterviews(
    schedule,
    day,
    startTime,
    duration
  );
  if (concurrentCount >= maxConcurrent) {
    return { valid: false, reason: "Límite de concurrencia alcanzado" };
  }

  return { valid: true, concurrent: concurrentCount + 1 };
}

function scheduleTeamGreedy(team, workingDays, config, schedule) {
  const { startTime, endTime, duration } = config;

  for (let day of workingDays) {
    let currentTime = startTime;

    while (currentTime + duration <= endTime) {
      const validation = isSlotValid(
        team,
        day,
        currentTime,
        duration,
        schedule,
        config
      );

      if (validation.valid) {
        // Crear fecha limpia sin horas
        const scheduleDay = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate()
        );

        schedule.push({
          team: team,
          day: scheduleDay,
          startTime: currentTime,
          endTime: currentTime + duration,
          concurrent: validation.concurrent,
        });
        return { success: true };
      }

      currentTime += 30;
    }
  }

  return { success: false, reason: "No hay slots disponibles" };
}

function scheduleInterviewsGreedy(config) {
  const { workingDays, teams } = config;

  const sortedTeams = [...teams].sort((a, b) => {
    const priorityA = calculateTeamPriority(a);
    const priorityB = calculateTeamPriority(b);
    return priorityA - priorityB;
  });

  console.log("📊 Equipos ordenados por prioridad:");
  sortedTeams.forEach((team) => {
    const window = getCommonTimeWindow(team.professors);
    console.log(`  Equipo ${team.id}: ventana de ${window.window} minutos`);
  });

  const schedule = [];
  const unscheduled = [];

  for (let team of sortedTeams) {
    const result = scheduleTeamGreedy(team, workingDays, config, schedule);

    if (!result.success) {
      unscheduled.push(team);
      console.log(`❌ Equipo ${team.id} no programado: ${result.reason}`);
    } else {
      console.log(`✅ Equipo ${team.id} programado exitosamente`);
    }
  }

  return { scheduled: schedule, unscheduled };
}

function analyzeWhyNotScheduled(team, config) {
  const { startTime, endTime, duration } = config;
  const window = getCommonTimeWindow(team.professors);

  if (window.window < duration) {
    return `No hay suficiente solapamiento en los horarios. Horario común: ${formatTime(
      window.start
    )} - ${formatTime(window.end)} (requiere ${
      duration / 60
    } horas continuas).`;
  }

  const effectiveStart = Math.max(window.start, startTime);
  const effectiveEnd = Math.min(window.end, endTime);

  if (effectiveEnd - effectiveStart < duration) {
    return `El horario común no coincide suficientemente con el horario de aplicación (${formatTime(
      startTime
    )} - ${formatTime(endTime)}).`;
  }

  return `Todos los slots disponibles están ocupados. Considere aumentar días hábiles, ampliar horario, o aumentar concurrencia.`;
}
