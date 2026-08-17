// ===== ESTADÍSTICAS =====

function cargarEstadisticas() {

  function cargarEstadisticas() {

    const canvas = document.getElementById("graficoVentas");
    const bloque = document.getElementById("bloqueProEstadisticas");

    if (!esPro) {
        if (canvas) canvas.style.display = "none";
        if (bloque) bloque.style.display = "block";
        return;
    }

    if (canvas) canvas.style.display = "block";
    if (bloque) bloque.style.display = "none";

    // tu lógica normal de estadísticas acá abajo
}

  let total = 0;
  let conteo = {};

  pedidos.forEach(p => {
    total += +p.total;
    conteo[p.producto] = (conteo[p.producto] || 0) + +p.cantidad;
  });

  let top = "-";
  let max = 0;

  for (let producto in conteo) {
    if (conteo[producto] > max) {
      max = conteo[producto];
      top = producto;
    }
  }

  const statPedidos = document.getElementById("statPedidos");
  const statTotal = document.getElementById("statTotal");
  const statProducto = document.getElementById("statProducto");

  const statPedidos2 = document.getElementById("statPedidos2");
  const statTotal2 = document.getElementById("statTotal2");
  const statProducto2 = document.getElementById("statProducto2");

  if (statPedidos) statPedidos.textContent = pedidos.length;
  if (statTotal) statTotal.textContent = total.toFixed(2);
  if (statProducto) statProducto.textContent = top;

  if (statPedidos2) statPedidos2.textContent = pedidos.length;
  if (statTotal2) statTotal2.textContent = total.toFixed(2);
  if (statProducto2) statProducto2.textContent = top;
}

function estadisticasAvanzadas() {

  if (!esPro) return;

  const resumen = {};

  pedidos.forEach(p => {
    const mes = p.fecha.slice(0, 7); // YYYY-MM
    resumen[mes] = (resumen[mes] || 0) + p.total;
  });

  console.log("Ventas por mes:", resumen);
}



let grafico;

function generarGraficoVentas() {


if (!esUsuarioPro()) return;
  const ctx = document.getElementById("graficoVentas");
  if (!ctx) return;

  const ventasPorMes = {};

  pedidos.forEach(p => {
    const mes = p.fecha.slice(0, 7); // YYYY-MM
    ventasPorMes[mes] = (ventasPorMes[mes] || 0) + Number(p.total);
  });

  const labels = Object.keys(ventasPorMes);
  const data = Object.values(ventasPorMes);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Ventas por mes",
        data: data,
        backgroundColor: "#2563eb",
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

