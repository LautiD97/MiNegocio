// ===== PLANES Y CONFIGURACIÓN CENTRAL =====

const PLANES = {
  free: {
    tipo: "free",
    nombre: "FREE",
    precio: 0,
    maxProductos: 5,
    maxClientes: 5,
    maxPedidos: 10
  },
  pro: {
    tipo: "pro",
    nombre: "PRO",
    precio: 50000,
    maxProductos: Infinity,
    maxClientes: Infinity,
    maxPedidos: Infinity
  }
};

window.obtenerPlan = function () {
  const planGuardado = JSON.parse(localStorage.getItem("plan"));
  if (!planGuardado) return PLANES.free;

  const hoy = new Date();
  const vencimiento = new Date(planGuardado.vence);

  if (planGuardado.tipo === "pro" &&
      !isNaN(vencimiento.getTime()) &&
      hoy <= vencimiento) {
    return { ...PLANES.pro, ...planGuardado };
  }

  return PLANES.free;
};

window.esPro = function () {
  return obtenerPlan().tipo === "pro";
};

window.puedeCrearProducto = function () {
  return esPro() || productos.length < PLANES.free.maxProductos;
};

window.puedeCrearCliente = function () {
  return esPro() || clientes.length < PLANES.free.maxClientes;
};

window.puedeCrearPedido = function () {
  return esPro() || pedidos.length < PLANES.free.maxPedidos;
};

function inicializarCodigoClientes() {
  if (!clientes || clientes.length === 0) return;

  const codigos = clientes
    .map(c => parseInt(c.codigo))
    .filter(n => !isNaN(n));

  if (codigos.length === 0) return;

  localStorage.setItem("ultimoCodigoCliente", Math.max(...codigos));
}

function actualizarLimites() {
  const plan = obtenerPlan();

  const limiteProductos = document.getElementById("limiteProductos");
  const limiteClientes = document.getElementById("limiteClientes");
  const limitePedidos = document.getElementById("limitePedidos");

  if (limiteProductos) {
    limiteProductos.textContent = esPro()
      ? `${productos.length} / ∞`
      : `${productos.length} / ${plan.maxProductos}`;
  }

  if (limiteClientes) {
    limiteClientes.textContent = esPro()
      ? `${clientes.length} / ∞`
      : `${clientes.length} / ${plan.maxClientes}`;
  }

  if (limitePedidos) {
    limitePedidos.textContent = esPro()
      ? `${pedidos.length} / ∞`
      : `${pedidos.length} / ${plan.maxPedidos}`;
  }
}

function abrirModalPro() {
  const modal = document.getElementById("modalPro");
  if (modal) modal.style.display = "flex";
}

function cerrarModal() {
  const modal = document.getElementById("modalPro");
  if (modal) modal.style.display = "none";
}

// Activación local temporal.
// Más adelante se reemplaza por Mercado Pago + backend.
window.activarPro = function () {
  const hoy = new Date();
  hoy.setMonth(hoy.getMonth() + 1);

  localStorage.setItem("plan", JSON.stringify({
    tipo: "pro",
    precio: 50000,
    vence: hoy.toISOString()
  }));

  alert("💎 MiNegocio PRO activado por 1 mes");
  location.reload();
};

function actualizarUIPro() {
  const plan = obtenerPlan();
  const badge = document.getElementById("badgePro");
  const banner = document.getElementById("bannerFree");

  if (badge) {
    badge.style.display = plan.tipo === "pro" ? "block" : "none";
  }

  if (banner) {
    if (plan.tipo === "pro") {
      const dias = Math.max(
        0,
        Math.ceil(
          (new Date(plan.vence) - new Date()) /
          (1000 * 60 * 60 * 24)
        )
      );

      banner.innerHTML = `💎 Plan PRO activo — ${dias} días restantes`;
    } else {
      banner.innerHTML = `🆓 Plan FREE — Actualizá a PRO por $50.000/mes`;
    }

    banner.style.display = "block";
  }
}

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
    return;
  }

  inicializarCodigoClientes();

  if (typeof mostrarProductos === "function") mostrarProductos();
  if (typeof mostrarClientes === "function") mostrarClientes();
  if (typeof mostrarPedidos === "function") mostrarPedidos();

  actualizarLimites();
  actualizarUIPro();
});