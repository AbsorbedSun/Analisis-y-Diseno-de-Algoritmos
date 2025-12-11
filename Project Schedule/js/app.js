/**
 * ============================================================================
 * APLICACIÓN PRINCIPAL
 * ============================================================================
 */

function scheduleInterviews() {
  document.getElementById("resultsCard").style.display = "block";

  setTimeout(() => {
    document.getElementById("resultsCard").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);

  try {
    // Obtener fechas del input y crear fechas locales
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;

    if (!startDateInput || !endDateInput) {
      alert("Por favor seleccione las fechas de inicio y fin");
      return;
    }

    // Crear fechas locales usando los componentes año/mes/día
    const [startYear, startMonth, startDay] = startDateInput
      .split("-")
      .map(Number);
    const [endYear, endMonth, endDay] = endDateInput.split("-").map(Number);

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    console.log("📅 Fechas seleccionadas:");
    console.log(
      `  Inicio: ${startDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`
    );
    console.log(
      `  Fin: ${endDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`
    );

    const startTime = timeToMinutes(document.getElementById("startTime").value);
    const endTime = timeToMinutes(document.getElementById("endTime").value);
    const duration = parseInt(document.getElementById("duration").value) * 60;
    const maxConcurrent = parseInt(document.getElementById("concurrent").value);

    if (startDate > endDate) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    const workingDays = getWorkingDays(startDate, endDate);

    if (workingDays.length === 0) {
      alert("No hay días hábiles en el período seleccionado");
      return;
    }

    const teams = getAllTeams();
    const config = {
      workingDays,
      startTime,
      endTime,
      duration,
      maxConcurrent,
      teams,
    };

    console.log("🚀 Iniciando Algoritmo Voraz...");
    const startExecution = performance.now();

    const result = scheduleInterviewsGreedy(config);

    const endExecution = performance.now();
    const executionTime = (endExecution - startExecution).toFixed(2);

    console.log(`✅ Algoritmo completado en ${executionTime}ms`);
    console.log(`📊 Programadas: ${result.scheduled.length}/${teams.length}`);

    displayResults(result.scheduled, result.unscheduled, workingDays);
    showExecutionTime(executionTime);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al programar entrevistas: " + error.message);
  }
}

window.onload = function () {
  console.log("🎯 Sistema de Programación de Entrevistas");
  console.log("🚀 Algoritmo: Voraz (Greedy)");
  console.log("📅 Días hábiles: Lunes a Viernes");
  console.log("=".repeat(50));

  displayProfessors();
  displayTeams();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("startDate").value = tomorrow
    .toISOString()
    .split("T")[0];

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  document.getElementById("endDate").value = nextWeek
    .toISOString()
    .split("T")[0];

  console.log("✅ Sistema listo");
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal("professorModal");
    closeModal("teamModal");
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    scheduleInterviews();
  }
});
