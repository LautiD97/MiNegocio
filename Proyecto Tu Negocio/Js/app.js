// ===== INIT =====
window.obtenerPlan = function () {
  const plan = JSON.parse(localStorage.getItem("plan"));
  if (!plan) return { tipo: "free" };

  const hoy = new Date();
  const vencimiento = new Date(plan.vence);

  if (plan.tipo === "pro" && hoy <= vencimiento) {
    return plan;
  }

  return { tipo: "free" };
};

window.esPro = function () {
  return obtenerPlan().tipo === "pro";
};

function obtenerPlan() {
  const plan = JSON.parse(localStorage.getItem("plan"));
  if (!plan) return { tipo: "free" };

  const hoy = new Date();
  const vencimiento = new Date(plan.vence);

  if (plan.tipo === "pro" && hoy <= vencimiento) {
    return plan;
  }

  return { tipo: "free" };
}


function inicializarCodigoClientes() {

  if (!clientes || clientes.length === 0) return;

  const max = Math.max(...clientes.map(c => c.codigo || 0));

  localStorage.setItem("ultimoCodigoCliente", max);
}


document.addEventListener("DOMContentLoaded", () => {

  


});


// ===== LIMITES FREE =====

function actualizarLimites() {

  const limiteProductos = document.getElementById("limiteProductos");
  const limiteClientes = document.getElementById("limiteClientes");
  const limitePedidos = document.getElementById("limitePedidos");

  

  if (limiteProductos) limiteProductos.textContent = productos.length + " / 5";
  if (limiteClientes) limiteClientes.textContent = clientes.length + " / 5";
  if (limitePedidos) limitePedidos.textContent = pedidos.length + " / 10";
}

// ===== MODAL PRO =====

function abrirModalPro() {
  const modal = document.getElementById("modalPro");
  if (modal) modal.style.display = "flex";
}

function cerrarModal() {
  const modal = document.getElementById("modalPro");
  if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarUIPro();
});



 





document.addEventListener("DOMContentLoaded", () => {

  const sistema = document.getElementById("sistema");
  const login = document.getElementById("login");

  const sesion = localStorage.getItem("sesionActiva");

  if (sesion === "true") {
    if (login) login.style.display = "none";

    if (sistema) {
      sistema.classList.remove("oculto");
      sistema.style.display = "";
    }
  } else {
    if (sistema) sistema.style.display = "none";
    if (login) login.style.display = "flex";
  }

  // 🔥 inicializaciones normales
  mostrarProductos();
  mostrarClientes();
  mostrarPedidos();
  actualizarLimites();

  

  const plan = obtenerPlan();

const badge = document.getElementById("badgePro");

if (badge) {
  if (plan.tipo === "pro") {
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
}

if (plan.tipo === "pro") {

  const dias = Math.ceil(
    (new Date(plan.vence) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const banner = document.getElementById("bannerFree");

  if (banner) {
    banner.innerHTML = `💎 Plan PRO activo (${dias} días restantes)`;
  }
}

});