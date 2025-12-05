/**
 * ============================================================================
 * GESTIÓN DE DATOS
 * ============================================================================
 * Almacena y gestiona los datos de profesores y equipos de entrevistas
 */

// Datos de profesores (se puede modificar dinámicamente)
let professorsData = [
  { name: "Lucas", startTime: 600, endTime: 1080 }, // 10:00 - 18:00
  { name: "Anselmo", startTime: 420, endTime: 900 }, // 7:00 - 15:00
  { name: "Lucrecia", startTime: 720, endTime: 1200 }, // 12:00 - 20:00
  { name: "Renato", startTime: 780, endTime: 1260 }, // 13:00 - 21:00
  { name: "Florinda", startTime: 420, endTime: 900 }, // 7:00 - 15:00
];

// Datos de equipos de aspirantes (se puede modificar dinámicamente)
let teamsData = [
  { id: 1, professors: ["Lucas", "Anselmo", "Florinda"] },
  { id: 2, professors: ["Renato", "Anselmo", "Lucrecia"] },
  { id: 3, professors: ["Lucas", "Lucrecia", "Florinda"] },
  { id: 4, professors: ["Renato", "Lucas", "Florinda"] },
  { id: 5, professors: ["Lucrecia", "Anselmo", "Florinda"] },
  { id: 6, professors: ["Anselmo", "Lucas", "Florinda"] },
  { id: 7, professors: ["Anselmo", "Florinda", "Renato"] },
  { id: 8, professors: ["Lucrecia", "Renato", "Lucas"] },
];

/**
 * Agrega un nuevo profesor al sistema
 */
function addProfessorToData(name, startTime, endTime) {
  // Verificar que no exista
  const exists = professorsData.some((p) => p.name === name);
  if (exists) {
    throw new Error(`El profesor "${name}" ya existe`);
  }

  professorsData.push({ name, startTime, endTime });
}

/**
 * Agrega un nuevo equipo al sistema
 */
function addTeamToData(professors) {
  // Validar que sean exactamente 3 profesores
  if (professors.length !== 3) {
    throw new Error("Un equipo debe tener exactamente 3 profesores");
  }

  // Generar nuevo ID
  const newId =
    teamsData.length > 0 ? Math.max(...teamsData.map((t) => t.id)) + 1 : 1;

  teamsData.push({ id: newId, professors });
}

/**
 * Elimina un profesor del sistema
 */
function removeProfessor(name) {
  const index = professorsData.findIndex((p) => p.name === name);
  if (index !== -1) {
    professorsData.splice(index, 1);
  }
}

/**
 * Elimina un equipo del sistema
 */
function removeTeam(id) {
  const index = teamsData.findIndex((t) => t.id === id);
  if (index !== -1) {
    teamsData.splice(index, 1);
  }
}

/**
 * Obtiene todos los profesores
 */
function getAllProfessors() {
  return professorsData;
}

/**
 * Obtiene todos los equipos
 */
function getAllTeams() {
  return teamsData;
}
