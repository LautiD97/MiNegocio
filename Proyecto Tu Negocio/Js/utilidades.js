// ===== UTILIDADES =====

function mostrarSeccion(id) {

  const secciones = document.querySelectorAll(".section");

  secciones.forEach(sec => {
    sec.style.display = "none";
  });

  const actual = document.getElementById(id);

  if (actual) {
    actual.style.display = "block";
  }

  // 👉 Activar botón
  document.querySelectorAll(".sidebar button")
    .forEach(btn => btn.classList.remove("active-btn"));

  const boton = document.querySelector(`.sidebar button[onclick="mostrarSeccion('${id}')"]`);
  if (boton) boton.classList.add("active-btn");

  if (id === "pedidos") cargarSelects();
  if (id === "inicio" || id === "estadisticas") cargarEstadisticas();
  if (id === "caja") cargarCaja();

  if (id === "estadisticas") {
  cargarEstadisticas();
  generarGraficoVentas();
}

function abrirUpgrade() {
  document.getElementById("modalUpgrade").style.display = "flex";
}

function cerrarUpgrade() {
  document.getElementById("modalUpgrade").style.display = "none";
}
}