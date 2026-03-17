// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {

  mostrarProductos();
  mostrarClientes();
  mostrarPedidos();
  cargarEstadisticas();
  aplicarModulos();
  actualizarLimites();

  if (!esUsuarioPro){
    const banner = document.getElementById("bannerFree");
    if (banner) banner.style.display = "none";
  }
});


// ===== LIMITES FREE =====

function actualizarLimites() {

  const limiteProductos = document.getElementById("limiteProductos");
  const limiteClientes = document.getElementById("limiteClientes");
  const limitePedidos = document.getElementById("limitePedidos");

  if (!esUsuarioPro){
    const bloque = document.getElementById("limitesFree");
    return;
  }

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

localStorage.setItem("plan", JSON.stringify({
  tipo: "pro",
  vence: "2026-03-20"
}));

function activarPro() {
  esPro = true;
  localStorage.setItem("esPro", "true");
  document.getElementById("badgePro").style.display = "block";
  cerrarUpgrade();
}
  function activarPro() {

  const hoy = new Date();
  hoy.setMonth(hoy.getMonth() + 1);

  const plan = {
    tipo: "pro",
    vence: hoy.toISOString().slice(0,10)
  };

  localStorage.setItem("plan", JSON.stringify(plan));

  alert("PRO activado hasta " + plan.vence + " 💎");

  location.reload();
}


function esUsuarioPro() {
  const plan = JSON.parse(localStorage.getItem("plan"));
  if (!plan) return false;

  const hoy = new Date();
  const vencimiento = new Date(plan.vence);

  return plan.tipo === "pro" && hoy <= vencimiento;
}


