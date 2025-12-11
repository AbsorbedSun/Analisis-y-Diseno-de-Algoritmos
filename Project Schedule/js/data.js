/**
 * ============================================================================
 * GESTIÓN DE DATOS
 * ============================================================================
 */

let professorsData = [
  { name: "Lucas", startTime: 600, endTime: 1080 }, // 10:00 - 18:00
  { name: "Anselmo", startTime: 420, endTime: 900 }, // 7:00 - 15:00
  { name: "Lucrecia", startTime: 720, endTime: 1200 }, // 12:00 - 20:00
  { name: "Renato", startTime: 780, endTime: 1260 }, // 13:00 - 21:00
  { name: "Florinda", startTime: 420, endTime: 900 }, // 7:00 - 15:00
];

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

function addProfessorToData(name, startTime, endTime) {
  const exists = professorsData.some((p) => p.name === name);
  if (exists) {
    throw new Error(`El profesor "${name}" ya existe`);
  }
  professorsData.push({ name, startTime, endTime });
}

function addTeamToData(professors) {
  if (professors.length !== 3) {
    throw new Error("Un equipo debe tener exactamente 3 profesores");
  }
  const newId =
    teamsData.length > 0 ? Math.max(...teamsData.map((t) => t.id)) + 1 : 1;
  teamsData.push({ id: newId, professors });
}

function getAllProfessors() {
  return professorsData;
}

function getAllTeams() {
  return teamsData;
}
