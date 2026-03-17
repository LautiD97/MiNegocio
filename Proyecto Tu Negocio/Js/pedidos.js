// ===== PEDIDOS =====

function cargarSelects() {

  const selectCliente = document.getElementById("selectCliente");
  const selectProducto = document.getElementById("selectProducto");

  if (!selectCliente || !selectProducto) return;

  selectCliente.innerHTML = "";
  clientes.forEach(c => {
    selectCliente.innerHTML += `<option>${c.nombre}</option>`;
  });

  selectProducto.innerHTML = "";
  productos.forEach((p, i) => {
    selectProducto.innerHTML += `<option value="${i}">${p.nombre}</option>`;
  });
}

function actualizarTotal() {

  const selectProducto = document.getElementById("selectProducto");
  const cantidadPedido = document.getElementById("cantidadPedido");
  const totalPedido = document.getElementById("totalPedido");

  const producto = productos[selectProducto.value];
  const cantidad = +cantidadPedido.value;

  totalPedido.value = producto && cantidad ? producto.precio * cantidad : 0;
}

function guardarPedido() {

  if (!esPro && pedidos.length >= 10 && editandoPedido === null) {
    abrirModalPro();
    return;
  }

  const selectCliente = document.getElementById("selectCliente");
  const selectProducto = document.getElementById("selectProducto");
  const cantidadPedido = document.getElementById("cantidadPedido");
  const totalPedido = document.getElementById("totalPedido");

  const indexProducto = selectProducto.value;
  const cantidad = +cantidadPedido.value;
  const producto = productos[indexProducto];

  if (!producto || cantidad <= 0) {
    alert("Datos inválidos");
    return;
  }

  if (editandoPedido !== null) {
    pedidos[editandoPedido] = {
      fecha: new Date().toLocaleDateString("es-AR"),
      cliente: selectCliente.value,
      producto: producto.nombre,
      cantidad,
      total: totalPedido.value
    };
    editandoPedido = null;

  } else {

    if (cantidad > producto.stock) {
      alert("Stock insuficiente");
      return;
    }

    producto.stock -= cantidad;

    pedidos.push({
      fecha: new Date().toLocaleDateString("es-AR"),
      cliente: selectCliente.value,
      producto: producto.nombre,
      cantidad,
      total: totalPedido.value
    });
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  cantidadPedido.value = "";
  totalPedido.value = "";

  mostrarPedidos();
  mostrarProductos();
}

function mostrarPedidos() {

  const tabla = document.getElementById("tablaPedidos");
  if (!tabla) return;

  tabla.innerHTML = "";

  pedidos.forEach((p, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.fecha}</td>
        <td>${p.cliente}</td>
        <td>${p.producto}</td>
        <td>${p.cantidad}</td>
        <td>$${p.total}</td>
        <td>
          <button class="btn btn-primary" onclick="editarPedido(${i})">✏️</button>
          <button class="btn btn-danger" onclick="eliminarPedido(${i})">X</button>
        </td>
      </tr>
    `;
  });
}

function editarPedido(i) {

  const selectCliente = document.getElementById("selectCliente");
  const selectProducto = document.getElementById("selectProducto");
  const cantidadPedido = document.getElementById("cantidadPedido");
  const totalPedido = document.getElementById("totalPedido");

  const p = pedidos[i];

  selectCliente.value = p.cliente;
  selectProducto.value = productos.findIndex(pr => pr.nombre === p.producto);
  cantidadPedido.value = p.cantidad;
  totalPedido.value = p.total;

  editandoPedido = i;

  if (typeof mostrarSeccion === "function") {
    mostrarSeccion("pedidos");
  }
  
}

function eliminarPedido(i) {
  pedidos.splice(i, 1);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  mostrarPedidos();
}

function filtrarPedidos() {

  if (!esUsuarioPro) return;
  document.getElementById("buscadorProductos").style.display = "none";

  const fecha = document.getElementById("filtroFecha").value;
  const tabla = document.getElementById("tablaPedidos");
  tabla.innerHTML = "";

  pedidos
    .filter(p => !fecha || p.fecha === fecha)
    .forEach(p => {
      tabla.innerHTML += `
        <tr>
          <td>${p.fecha}</td>
          <td>$${p.total}</td>
        </tr>
      `;
    });
}

fecha: new Date().toISOString().split("T")[0]

function limpiarFiltroVentas() {
  document.getElementById("filtroFecha").value = "";
  renderVentas();
}