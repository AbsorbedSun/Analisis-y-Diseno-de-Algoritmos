/**
 * ============================================================================
 * APLICACIÓN PRINCIPAL
 * ============================================================================
 * Orquesta todas las funcionalidades del sistema
 */

/**
 * Función principal de programación
 */
function scheduleInterviews() {
  // Mostrar tarjeta de resultados
  document.getElementById("resultsCard").style.display = "block";

  // Scroll hacia resultados
  setTimeout(() => {
    document.getElementById("resultsCard").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);

  try {
    // Leer parámetros
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const nonWorkingDays = document
      .getElementById("nonWorkingDays")
      .value.split(",")
      .map((d) => parseInt(d.trim()))
      .filter((d) => !isNaN(d));

    const startTime = timeToMinutes(document.getElementById("startTime").value);
    const endTime = timeToMinutes(document.getElementById("endTime").value);
    const duration = parseInt(document.getElementById("duration").value) * 60;
    const maxConcurrent = parseInt(document.getElementById("concurrent").value);

    // Validaciones básicas
    if (startDate > endDate) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    if (startTime >= endTime) {
      alert("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }

    if (duration <= 0) {
      alert("La duración debe ser mayor a 0");
      return;
    }

    if (maxConcurrent <= 0) {
      alert("La concurrencia debe ser mayor a 0");
      return;
    }

    // Generar días hábiles
    const workingDays = getWorkingDays(startDate, endDate, nonWorkingDays);

    if (workingDays.length === 0) {
      alert("No hay días hábiles en el período seleccionado");
      return;
    }

    const teams = getAllTeams();

    if (teams.length === 0) {
      alert("No hay equipos registrados para programar");
      return;
    }

    // Configuración del algoritmo
    const config = {
      workingDays,
      startTime,
      endTime,
      duration,
      maxConcurrent,
      teams,
    };

    // Ejecutar algoritmo Divide y Vencerás
    console.log("🚀 Iniciando algoritmo Divide y Vencerás...");
    const startExecution = performance.now();

    const result = scheduleInterviewsDivideConquer(config);

    const endExecution = performance.now();
    const executionTime = (endExecution - startExecution).toFixed(2);

    console.log(`✅ Algoritmo completado en ${executionTime}ms`);
    console.log(`📊 Programadas: ${result.scheduled.length}/${teams.length}`);
    console.log(`❌ No programadas: ${result.unscheduled.length}`);

    // Mostrar resultados
    displayResults(result.scheduled, result.unscheduled, workingDays);

    // Mostrar tiempo de ejecución
    showExecutionTime(executionTime);
  } catch (error) {
    console.error("Error al programar entrevistas:", error);
    alert("Error al programar entrevistas: " + error.message);
  }
}

/**
 * Muestra el tiempo de ejecución del algoritmo
 */
function showExecutionTime(time) {
  const notification = document.createElement("div");
  notification.textContent = `⚡ Algoritmo ejecutado en ${time}ms`;
  notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #6c9bd1;
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 0.9em;
        font-weight: 600;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 4000);
}

/**
 * Inicialización al cargar la página
 */
window.onload = function () {
  console.log("🎯 Sistema de Programación de Entrevistas");
  console.log("📚 Algoritmo: Divide y Vencerás");
  console.log("=".repeat(50));

  // Mostrar datos iniciales
  displayProfessors();
  displayTeams();

  console.log(`👨‍🏫 Profesores registrados: ${getAllProfessors().length}`);
  console.log(`📋 Equipos registrados: ${getAllTeams().length}`);

  // Configurar fecha por defecto (hoy + 1 día)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  document.getElementById("startDate").value = tomorrowStr;
  document.getElementById("endDate").value = nextWeekStr;

  console.log("✅ Sistema listo para usar");
};

/**
 * Atajos de teclado
 */
document.addEventListener("keydown", function (event) {
  // ESC para cerrar modales
  if (event.key === "Escape") {
    closeModal("professorModal");
    closeModal("teamModal");
  }

  // Ctrl/Cmd + Enter para programar
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    scheduleInterviews();
  }
});
