// Declaración del arreglo de alumnos
let alumnos = [
  {
    nombre: "Carlos Ramírez",
    especialidad: "Computación",
    matricula: 2021630045,
    grupo: "3CM1",
  },
  {
    nombre: "Ana Martínez",
    especialidad: "Sistemas",
    matricula: 2021630012,
    grupo: "3CM2",
  },
  {
    nombre: "Luis Fernández",
    especialidad: "Computación",
    matricula: 2021630089,
    grupo: "3CM1",
  },
  {
    nombre: "María González",
    especialidad: "Datos",
    matricula: 2021630003,
    grupo: "3CM3",
  },
  {
    nombre: "Pedro Sánchez",
    especialidad: "Sistemas",
    matricula: 2021630156,
    grupo: "3CM2",
  },
  {
    nombre: "Laura Torres",
    especialidad: "Computación",
    matricula: 2021630078,
    grupo: "3CM1",
  },
  {
    nombre: "Jorge Díaz",
    especialidad: "Datos",
    matricula: 2021630034,
    grupo: "3CM3",
  },
  {
    nombre: "Sofía Hernández",
    especialidad: "Sistemas",
    matricula: 2021630201,
    grupo: "3CM2",
  },
  {
    nombre: "Roberto López",
    especialidad: "Computación",
    matricula: 2021630067,
    grupo: "3CM1",
  },
  {
    nombre: "Elena Ruiz",
    especialidad: "Datos",
    matricula: 2021630123,
    grupo: "3CM3",
  },
];

// Ordenamiento por nombre (alfabético)
console.log("=== Ordenamiento por Nombre ===");
let alumnosPorNombre = [...alumnos]; // Creamos una copia para no modificar el original
alumnosPorNombre.sort((a, b) => {
  // Comparación alfabética de cadenas
  if (a.nombre < b.nombre) return -1;
  if (a.nombre > b.nombre) return 1;
  return 0;
});

alumnosPorNombre.forEach((alumno) => {
  console.log(
    `${alumno.nombre} - ${alumno.especialidad} - ${alumno.matricula} - ${alumno.grupo}`
  );
});

// Forma alternativa más concisa para cadenas
alumnosPorNombre.sort((a, b) => a.nombre.localeCompare(b.nombre));

// Ordenamiento por matrícula (numérico)
console.log("\n=== Ordenamiento por Matrícula ===");
let alumnosPorMatricula = [...alumnos]; // Creamos otra copia
alumnosPorMatricula.sort((a, b) => a.matricula - b.matricula);

alumnosPorMatricula.forEach((alumno) => {
  console.log(
    `${alumno.matricula} - ${alumno.nombre} - ${alumno.especialidad} - ${alumno.grupo}`
  );
});
