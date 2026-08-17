function actualizarDashboard() {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  const hoy = new Date().toISOString().split("T")[0];

  const pedidosHoy = pedidos.filter(p => p.fecha === hoy);

  const ventasHoy = pedidosHoy.reduce((total, p) => total + p.total, 0);

  const bajoStock = productos.filter(p => p.stock <= 5);

  document.getElementById("ventasHoy").textContent = `$${ventasHoy}`;
  document.getElementById("pedidosHoy").textContent = pedidosHoy.length;
  document.getElementById("clientesTotales").textContent = clientes.length;
  document.getElementById("stockBajo").textContent = bajoStock.length;
}