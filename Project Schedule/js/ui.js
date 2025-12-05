/**
 * ============================================================================
 * INTERFAZ DE USUARIO
 * ============================================================================
 * Funciones para actualizar y mostrar datos en la interfaz
 */

/**
 * Muestra los profesores en la interfaz
 */
function displayProfessors() {
  const container = document.getElementById("professorsDisplay");
  let html = "";

  const professors = getAllProfessors();

  if (professors.length === 0) {
    html =
      '<p style="color: #5a6c7d; text-align: center;">No hay profesores registrados</p>';
  } else {
    for (let prof of professors) {
      html += '<div class="professor-item">';
      html += `<div class="professor-name">${prof.name}</div>`;
      html += `<div class="professor-schedule">`;
      html += `⏰ ${formatTime(prof.startTime)} - ${formatTime(prof.endTime)}`;
      html += `</div>`;
      html += "</div>";
    }
  }

  container.innerHTML = html;
}

/**
 * Muestra los equipos en la interfaz
 */
function displayTeams() {
  const container = document.getElementById("teamsDisplay");
  let html = "";

  const teams = getAllTeams();

  if (teams.length === 0) {
    html =
      '<p style="color: #5a6c7d; text-align: center;">No hay equipos registrados</p>';
  } else {
    for (let team of teams) {
      html += '<div class="team-item">';
      html += `<div class="team-header">Aspirante ${team.id}</div>`;
      html += '<div class="team-professors">';

      for (let prof of team.professors) {
        html += `<span class="team-professor-tag">${prof}</span>`;
      }

      html += "</div>";
      html += "</div>";
    }
  }

  container.innerHTML = html;

  // Actualizar contador
  document.getElementById("totalInterviews").textContent = teams.length;
}

/**
 * Muestra los resultados de la programación
 */
function displayResults(schedule, unscheduled, workingDays) {
  const resultsDiv = document.getElementById("results");
  let html = "";

  const totalTeams = getAllTeams().length;

  // Estadísticas
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

  // Alertas
  if (schedule.length === totalTeams) {
    html += '<div class="alert alert-success">';
    html +=
      "<strong>✅ Éxito total:</strong> Todas las entrevistas fueron programadas exitosamente.";
    html += "</div>";
  } else if (schedule.length > 0) {
    html += '<div class="alert alert-warning">';
    html += `<strong>⚠️ Programación parcial:</strong> Se programaron ${schedule.length} de ${totalTeams} entrevistas.`;
    html += "</div>";
  } else {
    html += '<div class="alert alert-error">';
    html +=
      "<strong>❌ Error:</strong> No se pudo programar ninguna entrevista. Revise los parámetros.";
    html += "</div>";
  }

  // Programación exitosa
  if (schedule.length > 0) {
    html += '<div class="section">';
    html += "<h2>📅 Programación de Entrevistas</h2>";

    // Agrupar por día
    const scheduleByDay = {};
    for (let entry of schedule) {
      const dayKey = entry.day.toISOString().split("T")[0];
      if (!scheduleByDay[dayKey]) {
        scheduleByDay[dayKey] = [];
      }
      scheduleByDay[dayKey].push(entry);
    }

    // Ordenar por hora
    for (let dayKey in scheduleByDay) {
      scheduleByDay[dayKey].sort((a, b) => a.startTime - b.startTime);
    }

    // Mostrar cada día
    for (let dayKey in scheduleByDay) {
      const dayEntries = scheduleByDay[dayKey];
      const dateObj = new Date(dayKey + "T12:00:00");
      const dateStr = formatDate(dateObj);

      html += '<div class="schedule-day">';
      html += `<h3>${dateStr}</h3>`;

      for (let entry of dayEntries) {
        const concurrentClass = entry.concurrent > 1 ? "concurrent" : "";
        html += `<div class="interview-slot ${concurrentClass}">`;
        html += `<div class="interview-header">Entrevista - Aspirante ${entry.team.id}</div>`;
        html += `<div class="interview-details">`;
        html += `<strong>Horario:</strong> ${formatTime(
          entry.startTime
        )} - ${formatTime(entry.endTime)}<br>`;

        if (entry.concurrent > 1) {
          html += `<strong>⚡ Concurrente:</strong> Sala ${entry.concurrent}<br>`;
        }

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

  // Entrevistas no programadas
  if (unscheduled.length > 0) {
    html += '<div class="section">';
    html += "<h2>❌ Entrevistas No Programadas</h2>";

    for (let team of unscheduled) {
      const startTime = timeToMinutes(
        document.getElementById("startTime").value
      );
      const endTime = timeToMinutes(document.getElementById("endTime").value);
      const duration = parseInt(document.getElementById("duration").value) * 60;

      const reason = analyzeWhyNotScheduled(team, {
        startTime,
        endTime,
        duration,
      });

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

  resultsDiv.innerHTML = html;
}
