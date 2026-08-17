// ===== CAJA / VENTA RÁPIDA =====
let clienteSeleccionado = null;
// CARGAR PRODUCTOS
function cargarCaja() {
  renderProductosFiltrados(productos);
  cargarClientesCaja(); // 🔥 nuevo
}

function cargarClientesCaja() {
  const select = document.getElementById("clienteCaja");
  if (!select) return;

  select.innerHTML = `<option value="">Consumidor final</option>` +
    clientes.map((c, i) => `
      <option value="${i}">
        ${c.codigo || ""} - ${c.nombre} ($${c.saldo ?? 0})
      </option>
    `).join("");
}

// RENDER PRODUCTOS
function renderProductosFiltrados(lista) {

  const contenedor = document.getElementById("productosCaja");
  if (!contenedor) return;

  contenedor.innerHTML = lista.map((p) => {

    const index = productos.indexOf(p);
    const sinStock = p.stock <= 0;

    return `
      <div class="card caja-producto ${sinStock ? 'sin-stock' : ''}" 
           onclick="${sinStock ? '' : `agregarACaja(${index})`}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
      </div>
    `;
  }).join("");
}

// AGREGAR
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
document.body.classList.add("flash");

setTimeout(() => {
  document.body.classList.remove("flash");
}, 100);
  renderCaja();
}


// RENDER CAJA
function renderCaja() {

  const tabla = document.getElementById("tablaCaja");
  const totalSpan = document.getElementById("totalCaja");

  if (!tabla || !totalSpan) return;

  let total = 0;

  const filas = pedidoCaja.map((p, i) => {

    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    return `
      <tr>
        <td>${p.nombre}</td>
        <td>
  <div class="cantidad-control">
    <button class="btn-cant" onclick="cambiarCantidad(${i}, -1)">−</button>
    <span>${p.cantidad}</span>
    <button class="btn-cant" onclick="cambiarCantidad(${i}, 1)">+</button>
  </div>
</td>
        <td>$${subtotal}</td>
        <td>
          <button class="btn btn-danger" onclick="quitarDeCaja(${i})">X</button>
        </td>
      </tr>
    `;
  });

  tabla.innerHTML = filas.join("");
  totalSpan.textContent = total;
}

// CAMBIAR CANTIDAD
function cambiarCantidad(i, cambio) {

  const item = pedidoCaja[i];
  const producto = productos[item.index];

  if (item.cantidad + cambio <= 0) {
    quitarDeCaja(i);
    return;
  }

  if (item.cantidad + cambio > producto.stock) {
    alert("Stock insuficiente ❌");
    return;
  }

  item.cantidad += cambio;
  renderCaja();
}

// QUITAR
function quitarDeCaja(i) {
  pedidoCaja.splice(i, 1);
  renderCaja();
}

// 💰 VUELTO
function calcularVuelto() {

  const total = parseFloat(document.getElementById("totalCaja").textContent) || 0;
  const pago = parseFloat(document.getElementById("pagoCliente").value) || 0;

  const vuelto = pago - total;

  document.getElementById("vuelto").textContent = vuelto >= 0 ? vuelto : 0;
}

// EVENTO VUELTO (MEJORADO)
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("pagoCliente");
  if (input) input.addEventListener("input", calcularVuelto);
});

// 💳 COBRAR
function cobrarCaja() {

  


  if (pedidoCaja.length === 0) {
    alert("No hay productos en la caja");
    return;
  }

  const metodo = document.getElementById("metodoPago").value;

  const total = pedidoCaja.reduce((acc, p) => 
    acc + (p.precio * p.cantidad), 0
  );

  const clienteIndex = document.getElementById("clienteCaja").value;

  let totalFinal = total;

  // 🔥 SI HAY CLIENTE
  if (clienteIndex !== "") {

    const cliente = clientes[clienteIndex];
    const saldo = cliente.saldo ?? 0;

    // 🔒 BLOQUEO
    if (saldo < total) {
      alert("Saldo insuficiente ❌");
      return;
    }

    // 💸 DESCUENTO
    cliente.saldo -= total;

    localStorage.setItem("clientes", JSON.stringify(clientes));

    totalFinal = 0;
  }

  // 🔹 MÉTODOS DE PAGO
  if (metodo === "qr") {
    generarQR(totalFinal);
    return;
  }

  if (metodo === "tarjeta") {
    procesarPagoTarjeta(totalFinal);
    return;
  }

  // EFECTIVO
  finalizarVenta();

  // 🔄 refrescar saldo en UI
  mostrarSaldoCliente();
  cargarClientesCaja();
}
// 📲 QR EN PANTALLA
function generarQR(monto) {

  const contenedor = document.getElementById("qrContainer");

  contenedor.innerHTML = `
    <div style="text-align:center">
      <h3>📲 Escaneá para pagar</h3>

      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pago%20de%20$${monto}" />

      <p style="margin-top:10px;">Monto: <strong>$${monto}</strong></p>

      <button class="btn btn-primary" onclick="finalizarVenta()">
        ✅ Confirmar pago recibido
      </button>

      <button class="btn btn-danger" onclick="cancelarQR()">
        ❌ Cancelar
      </button>
    </div>
  `;
}

function cancelarQR() {
  document.getElementById("qrContainer").innerHTML = "";
}

// FINALIZAR VENTA
function finalizarVenta() {



localStorage.setItem("clientes", JSON.stringify(clientes));

  const metodo = document.getElementById("metodoPago").value;

  let total = 0;

  pedidoCaja.forEach(p => {
    total += p.precio * p.cantidad;
  });

  const imprimir = document.getElementById("imprimirTicket").checked;

  if (imprimir) generarTicket();

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

  // 🔥 REGISTRAR CAJA (AHORA SÍ FUNCIONA)
  registrarVentaCaja(total, metodo);

  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  pedidoCaja = [];

  renderCaja();
  cargarCaja();
  mostrarProductos();
  mostrarPedidos();

  document.getElementById("qrContainer").innerHTML = "";
  document.getElementById("pagoCliente").value = "";
  document.getElementById("vuelto").textContent = "0";

  alert("Venta finalizada ✅");
}

// 🧾 TICKET
function generarTicket() {

  const negocio = obtenerDatosNegocio();

  let total = 0;

  let items = pedidoCaja.map(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    return `
      <tr>
        <td>${p.nombre}</td>
        <td class="center">${p.cantidad}</td>
        <td class="right">$${subtotal}</td>
      </tr>
    `;
  }).join("");

  const metodo = document.getElementById("metodoPago").value.toUpperCase();
  const numeroTicket = obtenerNumeroTicket();

  const contenido = `
    <html>
      <head>
        <title>Ticket</title>
        <style>
          body {
            font-family: monospace;
            width: 220px;
            margin: auto;
            font-size: 12px;
          }

          .center {
            text-align: center;
          }

          .right {
            text-align: right;
          }

          .titulo {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
          }

          td {
            padding: 2px 0;
          }

          .total {
            font-size: 14px;
            font-weight: bold;
          }

          hr {
            border-top: 1px dashed black;
            margin: 5px 0;
          }
        </style>
      </head>

      <body>

        <div class="titulo">${negocio.nombre || "MiNegocio"}</div>
        <div class="center">${negocio.direccion || ""}</div>
        <div class="center">${negocio.telefono || ""}</div>

        <hr>

        <div class="center">Ticket N° ${numeroTicket}</div>
        <div class="center">${new Date().toLocaleString()}</div>

        <hr>

        <table>
          ${items}
        </table>

        <hr>

        <table>
          <tr>
            <td class="total">TOTAL</td>
            <td class="right total">$${total}</td>
          </tr>
        </table>

        <hr>

        <div class="center">Método: ${metodo}</div>

        <div class="center">Gracias por tu compra</div>

      </body>
    </html>
  `;

  const ventana = window.open("", "_blank", "width=320,height=600");

  if (!ventana) {
    alert("Permití ventanas emergentes");
    return;
  }

  ventana.document.open();
  ventana.document.write(contenido);
  ventana.document.close();

  ventana.focus();
  ventana.print();
}
// 🔎 BUSCADOR (SEGURO)
document.addEventListener("DOMContentLoaded", () => {

  const buscador = document.getElementById("buscadorCaja");

  if (!buscador) return;

  buscador.addEventListener("input", function () {

    const valor = this.value.toLowerCase();

    const filtrados = productos.filter(p =>
      p.nombre.toLowerCase().includes(valor) || p.codigo == valor
    );

    renderProductosFiltrados(filtrados);
  });

  buscador.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

      const valor = this.value.toLowerCase();

      const producto = productos.find(p =>
        p.nombre.toLowerCase() === valor
      );

      if (producto) {
        const index = productos.indexOf(producto);
        agregarACaja(index);
        this.value = "";
      } else {
        alert("Producto no encontrado");
      }
    }
  });
});

function registrarVentaCaja(total, metodo) {

  const hoy = new Date().toLocaleDateString("es-AR");

  let caja = JSON.parse(localStorage.getItem("cajaDiaria")) || {};

  if (!caja[hoy]) {
    caja[hoy] = {
      efectivo: 0,
      qr: 0,
      tarjeta: 0,
      total: 0
    };
  }

  caja[hoy][metodo] += total;
  caja[hoy].total += total;

  localStorage.setItem("cajaDiaria", JSON.stringify(caja));
}

function actualizarCajaDia() {

  const hoy = new Date().toLocaleDateString("es-AR");

  const caja = JSON.parse(localStorage.getItem("cajaDiaria")) || {};

  const datos = caja[hoy] || {
    efectivo: 0,
    qr: 0,
    tarjeta: 0,
    total: 0
  };

  document.getElementById("cajaTotal").textContent = datos.total;
  document.getElementById("cajaEfectivo").textContent = datos.efectivo;
  document.getElementById("cajaQR").textContent = datos.qr;
  document.getElementById("cajaTarjeta").textContent = datos.tarjeta;
}
document.addEventListener("DOMContentLoaded", actualizarCajaDia);

function procesarPagoTarjeta(total) {

  const contenedor = document.getElementById("qrContainer");

  contenedor.innerHTML = `
    <div style="text-align:center">
      <h3>💳 Pago con tarjeta</h3>

      <p>Total: <strong>$${total}</strong></p>

      <button class="btn btn-primary" onclick="abrirLinkPago(${total})">
        Ir al POS / Link de pago
      </button>

      <br><br>

      <button class="btn btn-success" onclick="finalizarVenta()">
        ✅ Confirmar pago realizado
      </button>

      <button class="btn btn-danger" onclick="cancelarQR()">
        ❌ Cancelar
      </button>
    </div>
  `;
}

function abrirLinkPago(total) {

  const link = `https://link.mercadopago.com.ar/TU_LINK?amount=${total}`;

  window.open(link, "_blank");
}

function obtenerNumeroTicket() {

  let numero = localStorage.getItem("numeroTicket") || 0;

  numero++;

  localStorage.setItem("numeroTicket", numero);

  return numero;
}




let scannerActivo = null;
async function iniciarScanner() {

  try {

    const devices = await Html5Qrcode.getCameras();

    if (!devices || devices.length === 0) {
      alert("Este dispositivo no tiene cámara 📵");
      return;
    }

    scannerActivo = new Html5Qrcode("reader");

    scannerActivo.start(
      devices[0].id,
      { fps: 10, qrbox: 250 },
      (decodedText) => {

        const producto = productos.find(p => p.codigo == decodedText);

        if (!producto) {
          alert("Producto no encontrado ❌");
          return;
        }

        const index = productos.indexOf(producto);
        agregarACaja(index);

        // 🔥 cerrar scanner
        scannerActivo.stop();
        document.getElementById("reader").innerHTML = "";

      },
      (error) => {}
    );

  } catch (err) {
    console.error(err);
    alert("No se pudo acceder a la cámara ❌");
  }
}

select.addEventListener("change", function () {

  const index = this.value;

  if (index === "") {
    clienteSeleccionado = null;
    mostrarClienteCaja(null);
    return;
  }

  clienteSeleccionado = clientes[index];
  mostrarClienteCaja(clienteSeleccionado);
});

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("clienteCaja");
  if (select) {
    select.addEventListener("change", mostrarSaldoCliente);
  }
});

const buscadorCliente = document.getElementById("buscadorClienteCaja");

if (buscadorCliente) {

  buscadorCliente.addEventListener("input", function () {

    const valor = this.value.toLowerCase();

    const filtrados = clientes.filter(c =>
      c.nombre.toLowerCase().includes(valor) ||
      String(c.codigo).includes(valor)
    );

    const select = document.getElementById("clienteCaja");

    select.innerHTML = `<option value="">Consumidor final</option>` +
      filtrados.map((c, i) => {
        const indexReal = clientes.indexOf(c);

        return `<option value="${indexReal}">
          ${c.codigo} - ${c.nombre} ($${c.saldo ?? 0})
        </option>`;
      }).join("");

  });

  // 🔥 AUTO SELECCIÓN
  buscadorCliente.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

      const valor = this.value.toLowerCase();

      const cliente = clientes.find(c =>
        c.nombre.toLowerCase() === valor ||
        String(c.codigo) === valor
      );

      if (cliente) {

        const index = clientes.indexOf(cliente);

        document.getElementById("clienteCaja").value = index;

        mostrarSaldoCliente(); // 🔥 actualiza saldo

        this.value = "";

      } else {
        alert("Cliente no encontrado");
      }
    }
  });
}

function limpiarBuscadorCliente() {

  const buscador = document.getElementById("buscadorClienteCaja");
  const select = document.getElementById("clienteCaja");

  if (buscador) buscador.value = "";

  // 🔥 volver a cargar TODOS los clientes
  select.innerHTML = `<option value="">Consumidor final</option>` +
    clientes.map((c, i) => `
      <option value="${i}">
        ${c.codigo} - ${c.nombre} 
      </option>
    `).join("");
    select.value = "";

}

function mostrarClienteCaja(cliente) {

  const info = document.getElementById("infoClienteCaja");
  const alerta = document.getElementById("alertaSaldo");

  if (!cliente) {
    info.innerHTML = "";
    alerta.innerHTML = "";
    return;
  }

  info.innerHTML = `
    Cliente: ${cliente.nombre} <br>
    💰 Saldo: $${cliente.saldo ?? 0}
  `;

  verificarSaldo(cliente);
}

function verificarSaldo(cliente) {

  const total = pedidoCaja.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const alerta = document.getElementById("alertaSaldo");
  const btnCobrar = document.getElementById("btnCobrar");

  if (!cliente) return;

  if ((cliente.saldo ?? 0) < total) {
    alerta.innerHTML = "❌ Saldo insuficiente";
    if (btnCobrar) btnCobrar.disabled = true;
  } else {
    alerta.innerHTML = "";
    if (btnCobrar) btnCobrar.disabled = false;
  }
}

