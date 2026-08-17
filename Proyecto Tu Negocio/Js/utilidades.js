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

  

function abrirUpgrade() {
  document.getElementById("modalUpgrade").style.display = "flex";
}

function cerrarUpgrade() {
  document.getElementById("modalUpgrade").style.display = "none";
}
}

function actualizarCajaDia() {

  const hoy = new Date().toLocaleDateString("es-AR");
  const caja = JSON.parse(localStorage.getItem("cajaDiaria")) || {};

  const datos = caja[hoy];

  if (!datos) {
    document.getElementById("cajaTotal").textContent = 0;
    document.getElementById("cajaEfectivo").textContent = 0;
    document.getElementById("cajaQR").textContent = 0;
    document.getElementById("cajaTarjeta").textContent = 0;
    return;
  }

  document.getElementById("cajaTotal").textContent = datos.total;
  document.getElementById("cajaEfectivo").textContent = datos.efectivo;
  document.getElementById("cajaQR").textContent = datos.qr;
  document.getElementById("cajaTarjeta").textContent = datos.tarjeta;
  document.addEventListener("DOMContentLoaded", actualizarCajaDia);
}

function guardarDatosNegocio() {

  const nombre = document.getElementById("nombreNegocio")?.value || "";
  const telefono = document.getElementById("telefonoNegocio")?.value || "";
  const direccion = document.getElementById("direccionNegocio")?.value || "";

  const negocio = {
    nombre,
    telefono,
    direccion
  };

  localStorage.setItem("negocio", JSON.stringify(negocio));

  alert("Datos guardados ✅");
}

function obtenerDatosNegocio() {

  const datos = localStorage.getItem("negocio");

  if (!datos) {
    return {
      nombre: "MiNegocio",
      telefono: "",
      direccion: ""
    };
  }

  return JSON.parse(datos);
}