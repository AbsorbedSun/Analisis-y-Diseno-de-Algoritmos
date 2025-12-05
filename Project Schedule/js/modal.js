/**
 * ============================================================================
 * GESTIÓN DE MODALES
 * ============================================================================
 * Funciones para abrir, cerrar y gestionar las ventanas emergentes
 */

/**
 * Abre el modal para agregar profesor
 */
function openAddProfessorModal() {
  const modal = document.getElementById("professorModal");
  modal.style.display = "block";

  // Limpiar campos
  document.getElementById("profName").value = "";
  document.getElementById("profStartTime").value = "08:00";
  document.getElementById("profEndTime").value = "16:00";
}

/**
 * Abre el modal para agregar equipo
 */
function openAddTeamModal() {
  const modal = document.getElementById("teamModal");
  modal.style.display = "block";

  // Generar checkboxes de profesores
  const container = document.getElementById("professorCheckboxes");
  const professors = getAllProfessors();

  if (professors.length === 0) {
    container.innerHTML =
      '<p style="color: #e74c3c; text-align: center; padding: 20px;">No hay profesores disponibles. Agregue profesores primero.</p>';
    return;
  }

  let html = "";
  for (let prof of professors) {
    html += '<div class="checkbox-item">';
    html += `<input type="checkbox" id="prof_${prof.name}" value="${prof.name}">`;
    html += `<label for="prof_${prof.name}">${prof.name} (${formatTime(
      prof.startTime
    )} - ${formatTime(prof.endTime)})</label>`;
    html += "</div>";
  }

  container.innerHTML = html;

  // Ocultar advertencia
  document.getElementById("selectionWarning").style.display = "none";
}

/**
 * Cierra un modal específico
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

/**
 * Cierra modales al hacer clic fuera de ellos
 */
window.onclick = function (event) {
  const professorModal = document.getElementById("professorModal");
  const teamModal = document.getElementById("teamModal");

  if (event.target === professorModal) {
    closeModal("professorModal");
  }
  if (event.target === teamModal) {
    closeModal("teamModal");
  }
};

/**
 * Agrega un nuevo profesor al sistema
 */
function addProfessor() {
  const name = document.getElementById("profName").value.trim();
  const startTimeStr = document.getElementById("profStartTime").value;
  const endTimeStr = document.getElementById("profEndTime").value;

  // Validaciones
  if (!name) {
    alert("Por favor ingrese el nombre del profesor");
    return;
  }

  const startTime = timeToMinutes(startTimeStr);
  const endTime = timeToMinutes(endTimeStr);

  if (startTime >= endTime) {
    alert("La hora de inicio debe ser anterior a la hora de fin");
    return;
  }

  try {
    addProfessorToData(name, startTime, endTime);

    // Actualizar interfaz
    displayProfessors();

    // Cerrar modal
    closeModal("professorModal");

    // Mostrar mensaje de éxito
    showSuccessMessage(`Profesor "${name}" agregado exitosamente`);
  } catch (error) {
    alert(error.message);
  }
}

/**
 * Agrega un nuevo equipo al sistema
 */
function addTeam() {
  // Obtener profesores seleccionados
  const checkboxes = document.querySelectorAll(
    '#professorCheckboxes input[type="checkbox"]:checked'
  );
  const selectedProfessors = Array.from(checkboxes).map((cb) => cb.value);

  // Validar que sean exactamente 3
  if (selectedProfessors.length !== 3) {
    document.getElementById("selectionWarning").style.display = "block";
    return;
  }

  try {
    addTeamToData(selectedProfessors);

    // Actualizar interfaz
    displayTeams();

    // Cerrar modal
    closeModal("teamModal");

    // Mostrar mensaje de éxito
    showSuccessMessage(
      `Equipo agregado exitosamente con ${selectedProfessors.join(", ")}`
    );
  } catch (error) {
    alert(error.message);
  }
}

/**
 * Muestra un mensaje de éxito temporal
 */
function showSuccessMessage(message) {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = "success-notification";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Agregar animaciones CSS para las notificaciones
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
