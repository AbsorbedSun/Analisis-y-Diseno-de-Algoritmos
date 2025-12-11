/**
 * ============================================================================
 * INTERFAZ DE USUARIO
 * ============================================================================
 */

function displayProfessors() {
  const container = document.getElementById("professorsDisplay");
  let html = "";
  const professors = getAllProfessors();

  if (professors.length === 0) {
    html =
      '<p style="color: #5a6c7d; text-align: center;">No hay profesores</p>';
  } else {
    for (let prof of professors) {
      html += '<div class="professor-item">';
      html += `<div class="professor-name">${prof.name}</div>`;
      html += `<div class="professor-schedule">⏰ ${formatTime(
        prof.startTime
      )} - ${formatTime(prof.endTime)}</div>`;
      html += "</div>";
    }
  }
  container.innerHTML = html;
}

function displayTeams() {
  const container = document.getElementById("teamsDisplay");
  let html = "";
  const teams = getAllTeams();

  if (teams.length === 0) {
    html = '<p style="color: #5a6c7d; text-align: center;">No hay equipos</p>';
  } else {
    for (let team of teams) {
      html += '<div class="team-item">';
      html += `<div class="team-header">Aspirante ${team.id}</div>`;
      html += '<div class="team-professors">';
      for (let prof of team.professors) {
        html += `<span class="team-professor-tag">${prof}</span>`;
      }
      html += "</div></div>";
    }
  }
  container.innerHTML = html;
  document.getElementById("totalInterviews").textContent = teams.length;
}

function displayResults(schedule, unscheduled, workingDays) {
  const resultsDiv = document.getElementById("results");
  let html = "";
  const totalTeams = getAllTeams().length;

  html += '<div class="stats">';
  html += `<div class="stat-card"><div class="stat-number">${schedule.length}</div><div class="stat-label">Programadas</div></div>`;
  html += `<div class="stat-card"><div class="stat-number">${unscheduled.length}</div><div class="stat-label">No Programadas</div></div>`;
  html += `<div class="stat-card"><div class="stat-number">${workingDays.length}</div><div class="stat-label">Días Hábiles</div></div>`;
  html += "</div>";

  if (schedule.length === totalTeams) {
    html +=
      '<div class="alert alert-success"><strong>✅ Éxito total:</strong> Todas las entrevistas fueron programadas.</div>';
  } else if (schedule.length > 0) {
    html += `<div class="alert alert-warning"><strong>⚠️ Parcial:</strong> ${schedule.length} de ${totalTeams} programadas.</div>`;
  } else {
    html +=
      '<div class="alert alert-error"><strong>❌ Error:</strong> No se pudo programar ninguna entrevista.</div>';
  }

  if (schedule.length > 0) {
    const scheduleByDay = {};
    for (let entry of schedule) {
      // Crear clave única para el día usando componentes de fecha
      const dayKey = `${entry.day.getFullYear()}-${String(
        entry.day.getMonth() + 1
      ).padStart(2, "0")}-${String(entry.day.getDate()).padStart(2, "0")}`;
      if (!scheduleByDay[dayKey]) scheduleByDay[dayKey] = [];
      scheduleByDay[dayKey].push(entry);
    }

    for (let dayKey in scheduleByDay) {
      scheduleByDay[dayKey].sort((a, b) => a.startTime - b.startTime);
    }

    // Ordenar las claves de días cronológicamente
    const sortedDayKeys = Object.keys(scheduleByDay).sort();

    for (let dayKey of sortedDayKeys) {
      const dayEntries = scheduleByDay[dayKey];
      const dateObj = dayEntries[0].day; // Usar la fecha del primer entry
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
          html += `<strong>⚡ Sala ${entry.concurrent}</strong><br>`;
        }
        html += `<div class="professors">`;
        for (let prof of entry.team.professors) {
          html += `<span class="professor-tag">${prof}</span>`;
        }
        html += `</div></div></div>`;
      }
      html += "</div>";
    }
  }

  if (unscheduled.length > 0) {
    html +=
      '<h2 style="color: #2c5f7f; margin: 20px 0;">❌ No Programadas</h2>';
    for (let team of unscheduled) {
      const config = {
        startTime: timeToMinutes(document.getElementById("startTime").value),
        endTime: timeToMinutes(document.getElementById("endTime").value),
        duration: parseInt(document.getElementById("duration").value) * 60,
      };
      const reason = analyzeWhyNotScheduled(team, config);
      html += '<div class="no-schedule">';
      html += `<h4>Aspirante ${team.id}</h4>`;
      html += `<p><strong>Profesores:</strong> ${team.professors.join(
        ", "
      )}</p>`;
      html += `<p><strong>Razón:</strong> ${reason}</p>`;
      html += "</div>";
    }
  }

  resultsDiv.innerHTML = html;
}

function showExecutionTime(time) {
  const notification = document.createElement("div");
  notification.textContent = `⚡ Algoritmo ejecutado en ${time}ms`;
  notification.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; background: #28a745;
        color: white; padding: 12px 20px; border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;
        font-size: 0.9em; font-weight: 600;
    `;
  document.body.appendChild(notification);
  setTimeout(() => document.body.removeChild(notification), 4000);
}
