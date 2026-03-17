// ===== CAJA / VENTA RÁPIDA =====

function cargarCaja() {

  const contenedor = document.getElementById("productosCaja");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((p, i) => {

    const sinStock = p.stock <= 0;

    contenedor.innerHTML += `
      <div class="card caja-producto ${sinStock ? 'sin-stock' : ''}" 
           onclick="${sinStock ? '' : `agregarACaja(${i})`}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <small>
          ${sinStock ? '❌ Sin stock' : 'Stock: ' + p.stock}
        </small>
      </div>
    `;
  });

}


function agregarACaja(index) {

  const producto = productos[index];

  if (producto.stock <= 0) {
    alert("Sin stock ❌");
    return;
  }

  const item = pedidoCaja.find(p => p.index === index);

  if (item) {

    if (item.cantidad + 1 > producto.stock) {
      alert("Stock insuficiente ❌");
      return;
    }

    item.cantidad++;

  } else {

    pedidoCaja.push({
      index,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });

  }

  renderCaja();
}

function renderCaja() {

  const tabla = document.getElementById("tablaCaja");
  const totalSpan = document.getElementById("totalCaja");

  if (!tabla || !totalSpan) return;

  tabla.innerHTML = "";
  let total = 0;

  pedidoCaja.forEach((p, i) => {

    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.cantidad}</td>
        <td>$${subtotal}</td>
        <td>
          <button class="btn btn-danger" onclick="quitarDeCaja(${i})">X</button>
        </td>
      </tr>
    `;
  });

  totalSpan.textContent = total;
}

function quitarDeCaja(i) {
  pedidoCaja.splice(i, 1);
  renderCaja();
}

function cobrarCaja() {

  if (pedidoCaja.length === 0) {
    alert("No hay productos en la caja");
    return;
  }

  pedidoCaja.forEach(p => {

    productos[p.index].stock -= p.cantidad;

    pedidos.push({
      fecha: new Date().toLocaleDateString("es-AR"),
      cliente: "Venta mostrador",
      producto: p.nombre,
      cantidad: p.cantidad,
      total: p.precio * p.cantidad
    });
  });

  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  pedidoCaja = [];

  renderCaja();
  mostrarProductos();
  mostrarPedidos();

  alert("Venta registrada correctamente ✅");
}

function cancelarCaja() {
  pedidoCaja = [];
  renderCaja();
}
