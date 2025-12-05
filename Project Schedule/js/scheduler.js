/**
 * ============================================================================
 * ALGORITMO DE PROGRAMACIÓN: DIVIDE Y VENCERÁS
 * ============================================================================
 * Implementa un algoritmo de Divide y Vencerás para programar entrevistas
 *
 * ESTRATEGIA:
 * 1. DIVIDIR: Separar el problema en sub-problemas más pequeños
 *    - Dividir los equipos en grupos
 *    - Dividir los días en períodos
 *
 * 2. CONQUISTAR: Resolver cada sub-problema recursivamente
 *    - Programar cada grupo de equipos en su período
 *
 * 3. COMBINAR: Unir las soluciones parciales
 *    - Fusionar los schedules de cada sub-problema
 */

/**
 * Función principal de programación con Divide y Vencerás
 */
function scheduleInterviewsDivideConquer(config) {
  const { workingDays, startTime, endTime, duration, maxConcurrent, teams } =
    config;

  // Caso base: si no hay equipos, retornar vacío
  if (teams.length === 0) {
    return { scheduled: [], unscheduled: [] };
  }

  // Caso base: si solo hay 1 equipo, programarlo directamente
  if (teams.length === 1) {
    const schedule = [];
    const success = tryScheduleTeam(
      teams[0],
      workingDays,
      startTime,
      endTime,
      duration,
      maxConcurrent,
      schedule
    );

    return {
      scheduled: success ? schedule : [],
      unscheduled: success ? [] : teams,
    };
  }

  // DIVIDIR: Separar equipos en dos mitades
  const mid = Math.floor(teams.length / 2);
  const leftTeams = teams.slice(0, mid);
  const rightTeams = teams.slice(mid);

  // CONQUISTAR: Resolver recursivamente cada mitad
  const leftResult = scheduleInterviewsDivideConquer({
    ...config,
    teams: leftTeams,
  });

  // Para la segunda mitad, usar el schedule ya creado como base
  const rightResult = scheduleInterviewsDivideConquer({
    ...config,
    teams: rightTeams,
  });

  // COMBINAR: Fusionar los resultados
  return mergeSchedules(leftResult, rightResult, config);
}

/**
 * Combina dos schedules parciales
 * Intenta reprogramar los no programados con el contexto completo
 */
function mergeSchedules(leftResult, rightResult, config) {
  const { workingDays, startTime, endTime, duration, maxConcurrent } = config;

  // Combinar los schedules exitosos
  let combinedSchedule = [...leftResult.scheduled, ...rightResult.scheduled];

  // Combinar los no programados
  let remainingUnscheduled = [
    ...leftResult.unscheduled,
    ...rightResult.unscheduled,
  ];

  // Intentar reprogramar los que fallaron con el contexto completo
  const finalUnscheduled = [];

  for (let team of remainingUnscheduled) {
    const success = tryScheduleTeam(
      team,
      workingDays,
      startTime,
      endTime,
      duration,
      maxConcurrent,
      combinedSchedule
    );

    if (!success) {
      finalUnscheduled.push(team);
    }
  }

  return {
    scheduled: combinedSchedule,
    unscheduled: finalUnscheduled,
  };
}

/**
 * Intenta programar un equipo usando búsqueda exhaustiva
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
  // Iterar sobre cada día hábil
  for (let day of workingDays) {
    let currentTime = startTime;

    // Probar slots de 30 minutos
    while (currentTime + duration <= endTime) {
      // RESTRICCIÓN 1: Disponibilidad de profesores
      const allAvailable = checkProfessorsAvailable(
        team.professors,
        currentTime,
        duration
      );

      if (!allAvailable) {
        currentTime += 30;
        continue;
      }

      // RESTRICCIÓN 2: Límite de concurrencia
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

      // RESTRICCIÓN 3: Profesor no ocupado
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

      // ¡ÉXITO! Programar la entrevista
      schedule.push({
        team: team,
        day: day,
        startTime: currentTime,
        endTime: currentTime + duration,
        concurrent: concurrentCount + 1,
      });

      return true;
    }
  }

  return false;
}

/**
 * Analiza por qué un equipo no pudo ser programado
 */
function analyzeWhyNotScheduled(team, config) {
  const { startTime, endTime, duration } = config;

  const profSchedules = team.professors.map((name) => {
    return professorsData.find((p) => p.name === name);
  });

  // Encontrar horario común
  let commonStart = Math.max(...profSchedules.map((p) => p.startTime));
  let commonEnd = Math.min(...profSchedules.map((p) => p.endTime));

  // ANÁLISIS 1: Solapamiento insuficiente
  if (commonEnd - commonStart < duration) {
    return `No hay suficiente solapamiento en los horarios de los profesores. 
                Horario común: ${formatTime(commonStart)} - ${formatTime(
      commonEnd
    )} 
                (requiere ${duration / 60} horas continuas).`;
  }

  // ANÁLISIS 2: Horario común fuera de rango de aplicación
  commonStart = Math.max(commonStart, startTime);
  commonEnd = Math.min(commonEnd, endTime);

  if (commonEnd - commonStart < duration) {
    return `El horario común de los profesores no coincide suficientemente con el 
                horario de aplicación (${formatTime(startTime)} - ${formatTime(
      endTime
    )}).`;
  }

  // ANÁLISIS 3: Saturación de recursos
  return `Todos los slots disponibles están ocupados por otras entrevistas o se alcanzó 
            el límite de concurrencia. Considere aumentar el número de días hábiles, 
            ampliar el horario de aplicación, o aumentar el límite de concurrencia.`;
}
