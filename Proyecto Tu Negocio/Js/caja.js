function asegurarEstilosCajaDropdown() {
  if (document.getElementById("estilosCajaDropdown")) return;

  const style = document.createElement("style");
  style.id = "estilosCajaDropdown";
  style.textContent = `
    .buscador-productos-caja { position: relative; width: 100%; z-index: 50; }
    #productosCaja.productos-dropdown-caja {
      position: absolute;
      top: calc(100% - 8px);
      left: 0;
      width: 100%;
      max-height: 360px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #dbe3ee;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 12px 30px rgba(15,23,42,.15);
      display: none;
      padding: 6px;
    }
    #productosCaja.productos-dropdown-caja.abierto { display: block; }
    .item-producto-caja {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 9px;
      cursor: pointer;
      background: #fff;
      border-bottom: 1px solid #eef2f7;
    }
    .item-producto-caja:hover { background: #eff6ff; }
    .item-producto-caja.producto-seleccionado {
      background: #dbeafe;
      outline: 2px solid #2563eb;
      outline-offset: -2px;
    }

    .producto-caja-info { min-width: 0; text-align: left; }
    .producto-caja-info strong {
      display: block; color: #111827;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .producto-caja-info small { color: #64748b; }
    .producto-caja-precio {
      white-space: nowrap; font-weight: 700; color: #2563eb;
    }
    .lista-productos-vacia {
      padding: 18px; text-align: center; color: #64748b;
    }

    .alerta-saldo-modal {
      position: fixed; inset: 0; display: none;
      align-items: center; justify-content: center;
      padding: 20px; background: rgba(15,23,42,.72);
      backdrop-filter: blur(3px); z-index: 99999;
    }
    .alerta-saldo-modal.abierto { display: flex; }
    .alerta-saldo-contenido {
      width: min(520px, 94vw); background: #fff;
      border-radius: 22px; padding: 34px 30px;
      text-align: center; box-shadow: 0 25px 70px rgba(0,0,0,.30);
      animation: alertaSaldoEntrada .18s ease-out;
    }
    .alerta-saldo-icono {
      width: 78px; height: 78px; margin: 0 auto 16px;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; background: #fee2e2; font-size: 42px;
    }
    .alerta-saldo-contenido h2 {
      margin: 0 0 14px; font-size: 28px; color: #991b1b;
    }
    .alerta-saldo-contenido p {
      margin: 0; font-size: 18px; line-height: 1.8; color: #334155;
    }
    .btn-alerta-saldo {
      margin-top: 24px; min-width: 180px; padding: 13px 24px;
      border: 0; border-radius: 10px; background: #2563eb;
      color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
    }
    @keyframes alertaSaldoEntrada {
      from { opacity: 0; transform: scale(.94) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// ===== CAJA / VENTA RÁPIDA =====

let clienteSeleccionado = null;
let ventaPendiente = null;
let scannerActivo = null;
let productosFiltradosCaja = [];
let indiceProductoActivo = -1;

// ===== CARGAR CAJA =====
function cargarCaja() {
  renderProductosFiltrados([]);
  cargarClientesCaja();
  renderCaja();
  actualizarEstadoSaldo();
  actualizarMetodosPagoCaja();
}

// ===== CLIENTES =====
function cargarClientesCaja() {
  const select = document.getElementById("clienteCaja");
  if (!select) return;

  select.innerHTML = `<option value="">Consumidor final</option>` +
    clientes.map((c, i) => `
      <option value="${i}">
        ${c.codigo || ""} - ${c.nombre} ($${c.saldo ?? 0})
      </option>
    `).join("");

  select.value = "";
  clienteSeleccionado = null;
  mostrarClienteCaja(null);
}

function seleccionarClienteCaja(index) {
  if (index === "" || index === null || index === undefined) {
    clienteSeleccionado = null;
    mostrarClienteCaja(null);
    actualizarEstadoSaldo();
    return;
  }

  clienteSeleccionado = clientes[Number(index)] || null;
  mostrarClienteCaja(clienteSeleccionado);
  actualizarEstadoSaldo();
}

function mostrarClienteCaja(cliente) {
  const info = document.getElementById("infoClienteCaja");
  const alerta = document.getElementById("alertaSaldo");

  if (!info || !alerta) return;

  if (!cliente) {
    info.innerHTML = `Cliente: <strong>Consumidor final</strong>`;
    alerta.innerHTML = "";
    return;
  }

  info.innerHTML = `
    Cliente: <strong>${cliente.nombre}</strong><br>
    💰 Saldo disponible: <strong>$${cliente.saldo ?? 0}</strong>
  `;

  verificarSaldo(cliente);
}

function obtenerBotonCobrar() {
  return document.getElementById("btnCobrar") ||
         document.querySelector(".btn-cobrar");
}

function verificarSaldo(cliente) {
  const alerta = document.getElementById("alertaSaldo");
  const btnCobrar = obtenerBotonCobrar();

  if (!cliente) {
    if (alerta) alerta.innerHTML = "";
    if (btnCobrar) btnCobrar.disabled = pedidoCaja.length === 0;
    return true;
  }

  const total = calcularTotalCaja();
  const saldo = Number(cliente.saldo ?? 0);
  const suficiente = saldo >= total;

  if (alerta) {
    alerta.innerHTML = suficiente
      ? `Saldo suficiente para realizar la venta.`
      : `❌ Saldo insuficiente. Disponible: $${saldo} | Necesario: $${total}`;
  }

  if (btnCobrar) {
    btnCobrar.disabled = pedidoCaja.length === 0 || !suficiente;
  }

  return suficiente;
}

function actualizarEstadoSaldo() {
  if (clienteSeleccionado) {
    verificarSaldo(clienteSeleccionado);
    return;
  }

  const alerta = document.getElementById("alertaSaldo");
  const btnCobrar = obtenerBotonCobrar();

  if (alerta) alerta.innerHTML = "";
  if (btnCobrar) btnCobrar.disabled = pedidoCaja.length === 0;
}

// ===== RENDER PRODUCTOS =====
function renderProductosFiltrados(lista) {
  const contenedor = document.getElementById("productosCaja");
  if (!contenedor) return;

  const buscador = document.getElementById("buscadorCaja");
  const texto = buscador ? buscador.value.trim() : "";

  productosFiltradosCaja = Array.isArray(lista) ? lista : [];
  indiceProductoActivo = -1;

  // El listado queda oculto hasta que el usuario escriba.
  if (!texto) {
    contenedor.innerHTML = "";
    contenedor.classList.remove("abierto");
    return;
  }

  if (!productosFiltradosCaja.length) {
    contenedor.innerHTML = `
      <div class="lista-productos-vacia">
        No se encontraron productos
      </div>
    `;
    contenedor.classList.add("abierto");
    return;
  }

  contenedor.innerHTML = productosFiltradosCaja.map((p, i) => {
    const index = productos.indexOf(p);
    const sinStock = Number(p.stock) <= 0;

    return `
      <div
        class="item-producto-caja ${sinStock ? "sin-stock" : ""}"
        data-producto-indice="${i}"
        ${sinStock ? "" : `onclick="agregarACaja(${index})"`}
      >
        <div class="producto-caja-info">
          <strong>${p.nombre}</strong>
          <small>Código: ${p.codigo || "Sin código"} · Stock: ${p.stock}</small>
        </div>

        <div class="producto-caja-precio">
          $${p.precio}
        </div>
      </div>
    `;
  }).join("");

  contenedor.classList.add("abierto");
}

function moverProductoSeleccionado(direccion) {
  const lista = document.getElementById("productosCaja");

  if (!lista || !productosFiltradosCaja.length) return;

  const productosDisponibles = productosFiltradosCaja
    .map((producto, indice) => ({
      producto,
      indice,
      indexReal: productos.indexOf(producto)
    }))
    .filter(item => Number(item.producto.stock) > 0);

  if (!productosDisponibles.length) return;

  const posicionActual = productosDisponibles.findIndex(
    item => item.indice === indiceProductoActivo
  );

  let nuevaPosicion;

  if (posicionActual === -1) {
    nuevaPosicion = direccion > 0
      ? 0
      : productosDisponibles.length - 1;
  } else {
    nuevaPosicion =
      posicionActual + direccion;

    if (nuevaPosicion < 0) {
      nuevaPosicion = productosDisponibles.length - 1;
    }

    if (nuevaPosicion >= productosDisponibles.length) {
      nuevaPosicion = 0;
    }
  }

  indiceProductoActivo =
    productosDisponibles[nuevaPosicion].indice;

  lista.querySelectorAll(".item-producto-caja").forEach(item => {
    item.classList.remove("producto-seleccionado");
  });

  const elemento = lista.querySelector(
    `[data-producto-indice="${indiceProductoActivo}"]`
  );

  if (elemento) {
    elemento.classList.add("producto-seleccionado");

    elemento.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }
}

function seleccionarProductoActivo() {
  if (
    indiceProductoActivo < 0 ||
    indiceProductoActivo >= productosFiltradosCaja.length
  ) {
    return false;
  }

  const producto = productosFiltradosCaja[indiceProductoActivo];

  if (!producto || Number(producto.stock) <= 0) {
    return false;
  }

  agregarACaja(productos.indexOf(producto));
  return true;
}

// ===== ESTILOS CAJA =====
function mostrarAlertaSaldoInsuficiente(saldo, total) {
  const modal = document.getElementById("alertaSaldoModal");
  const mensaje = document.getElementById("alertaSaldoMensaje");

  if (!modal) {
    alert(`Saldo insuficiente. Disponible: $${saldo} | Necesario: $${total}`);
    return;
  }

  if (mensaje) {
    mensaje.innerHTML = `
      Saldo disponible: <strong>$${saldo}</strong><br>
      Total de la venta: <strong>$${total}</strong>
    `;
  }

  modal.classList.add("abierto");
  modal.setAttribute("aria-hidden", "false");
}

function cerrarAlertaSaldo() {
  const modal = document.getElementById("alertaSaldoModal");
  if (!modal) return;

  modal.classList.remove("abierto");
  modal.setAttribute("aria-hidden", "true");
}

// ===== AGREGAR PRODUCTO =====
function agregarACaja(index) {
  const producto = productos[index];
  if (!producto) return;

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
      precio: Number(producto.precio),
      cantidad: 1
    });
  }

  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 100);

  renderCaja();

  const buscadorCaja = document.getElementById("buscadorCaja");
  const listaCaja = document.getElementById("productosCaja");
  if (buscadorCaja) buscadorCaja.value = "";
  if (listaCaja) {
    listaCaja.innerHTML = "";
    listaCaja.classList.remove("abierto");
  }


  const buscador = document.getElementById("buscadorCaja");
  const lista = document.getElementById("productosCaja");
  if (buscador) buscador.value = "";
  if (lista) {
    lista.innerHTML = "";
    lista.classList.remove("abierto");
  }
}

// ===== TOTAL =====
function calcularTotalCaja() {
  return pedidoCaja.reduce(
    (acc, p) => acc + (Number(p.precio) * Number(p.cantidad)),
    0
  );
}

// ===== RENDER CAJA =====
function renderCaja() {
  const tabla = document.getElementById("tablaCaja");
  const totalSpan = document.getElementById("totalCaja");

  if (!tabla || !totalSpan) return;

  const total = calcularTotalCaja();

  tabla.innerHTML = pedidoCaja.map((p, i) => {
    const subtotal = p.precio * p.cantidad;

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
  }).join("");

  totalSpan.textContent = total;
  actualizarEstadoSaldo();
}

// ===== CANTIDAD =====
function cambiarCantidad(i, cambio) {
  const item = pedidoCaja[i];
  if (!item) return;

  const producto = productos[item.index];
  if (!producto) return;

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

function quitarDeCaja(i) {
  pedidoCaja.splice(i, 1);
  renderCaja();
}

// ===== VUELTO =====
function calcularVuelto() {
  const total = calcularTotalCaja();
  const pagoInput = document.getElementById("pagoCliente");
  const vueltoElement = document.getElementById("vuelto");

  if (!pagoInput || !vueltoElement) return;

  const pago = parseFloat(pagoInput.value) || 0;
  const vuelto = pago - total;

  vueltoElement.textContent = vuelto >= 0 ? vuelto : 0;
}

// ===== COBRAR =====
function cobrarCaja() {
  if (pedidoCaja.length === 0) {
    alert("No hay productos en la caja");
    return;
  }

  const metodoElement = document.getElementById("metodoPago");
  const metodo = metodoElement ? metodoElement.value : "efectivo";
  const total = calcularTotalCaja();

  // Cliente con saldo: la venta se descuenta de su cuenta.
  if (clienteSeleccionado) {
    const saldo = Number(clienteSeleccionado.saldo ?? 0);

    if (saldo < total) {
      verificarSaldo(clienteSeleccionado);
      mostrarAlertaSaldoInsuficiente(saldo, total);
      return;
    }

    // Guardamos la venta pendiente y descontamos SOLO al confirmar.
    ventaPendiente = {
      tipo: "saldo",
      clienteIndex: clientes.indexOf(clienteSeleccionado),
      total,
      metodo
    };

    finalizarVenta();
    return;
  }

  // FREE: solo efectivo.
  // QR y tarjeta son funciones exclusivas de PRO.
  if ((metodo === "qr" || metodo === "tarjeta") && !esPro()) {
    abrirModalPro();
    return;
  }

  // Consumidor final: usa el método de pago seleccionado.
  if (metodo === "qr") {
    ventaPendiente = { tipo: "pago", total, metodo };
    generarQR(total);
    return;
  }

  if (metodo === "tarjeta") {
    ventaPendiente = { tipo: "pago", total, metodo };
    procesarPagoTarjeta(total);
    return;
  }

  finalizarVenta();
}

// ===== MÉTODOS DE PAGO FREE / PRO =====
function actualizarMetodosPagoCaja() {
  const select = document.getElementById("metodoPago");
  if (!select) return;

  Array.from(select.options).forEach(opcion => {
    const valor = opcion.value;

    if (valor === "qr" || valor === "tarjeta") {
      const base = valor === "qr" ? "📱 QR" : "💳 Tarjeta";
      opcion.textContent = esPro() ? base : `${base} 🔒 PRO`;
    }
  });
}

// ===== QR =====
function generarQR(monto) {
  const contenedor = document.getElementById("qrContainer");
  if (!contenedor) return;

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
  const contenedor = document.getElementById("qrContainer");
  if (contenedor) contenedor.innerHTML = "";
  ventaPendiente = null;
}

// ===== FINALIZAR VENTA =====
function finalizarVenta() {
  if (pedidoCaja.length === 0) return;

  const metodoElement = document.getElementById("metodoPago");
  const metodo = ventaPendiente?.metodo ||
    (metodoElement ? metodoElement.value : "efectivo");

  const total = calcularTotalCaja();
  const clienteIndex = ventaPendiente?.clienteIndex;

  // Descontar saldo SOLO cuando la venta queda confirmada.
  if (ventaPendiente?.tipo === "saldo" && clienteIndex !== undefined) {
    const cliente = clientes[clienteIndex];

    if (!cliente || Number(cliente.saldo ?? 0) < total) {
      ventaPendiente = null;
      mostrarAlertaSaldoInsuficiente(Number(cliente.saldo ?? 0), total);
      return;
    }

    cliente.saldo = Number(cliente.saldo ?? 0) - total;
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }

  const imprimir = document.getElementById("imprimirTicket");
  if (imprimir?.checked) generarTicket();

  const nombreCliente = clienteIndex !== undefined && clientes[clienteIndex]
    ? clientes[clienteIndex].nombre
    : "Venta mostrador";

  pedidoCaja.forEach(p => {
    productos[p.index].stock -= p.cantidad;

    pedidos.push({
      fecha: new Date().toLocaleDateString("es-AR"),
      cliente: nombreCliente,
      producto: p.nombre,
      cantidad: p.cantidad,
      total: p.precio * p.cantidad
    });
  });

  // Una venta a cuenta no entra como efectivo/QR/tarjeta.
  if (ventaPendiente?.tipo === "pago" || !clienteIndex) {
    registrarVentaCaja(total, metodo);
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  pedidoCaja = [];
  ventaPendiente = null;

  renderCaja();
  cargarCaja();
  mostrarProductos();
  mostrarPedidos();

  const qrContainer = document.getElementById("qrContainer");
  if (qrContainer) qrContainer.innerHTML = "";

  const pagoCliente = document.getElementById("pagoCliente");
  if (pagoCliente) pagoCliente.value = "";

  const vuelto = document.getElementById("vuelto");
  if (vuelto) vuelto.textContent = "0";

  mostrarClienteCaja(clienteIndex !== undefined ? clientes[clienteIndex] : null);
  cargarClientesCaja();
  actualizarCajaDia();

  alert("Venta finalizada ✅");
}

// ===== TICKET =====
function generarTicket() {
  const negocio = obtenerDatosNegocio();
  let total = 0;

  const items = pedidoCaja.map(p => {
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

  const metodoElement = document.getElementById("metodoPago");
  const metodo = (ventaPendiente?.tipo === "saldo" ? "SALDO" : (metodoElement?.value || "efectivo")).toUpperCase();
  const numeroTicket = obtenerNumeroTicket();

  const contenido = `
    <html>
      <head>
        <title>Ticket</title>
        <style>
          body { font-family: monospace; width: 220px; margin: auto; font-size: 12px; }
          .center { text-align: center; }
          .right { text-align: right; }
          .titulo { font-size: 14px; font-weight: bold; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 5px; }
          td { padding: 2px 0; }
          .total { font-size: 14px; font-weight: bold; }
          hr { border-top: 1px dashed black; margin: 5px 0; }
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
        <table>${items}</table>
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

// ===== BUSCADOR DE PRODUCTOS =====
document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscadorCaja");
  if (!buscador) return;

  buscador.addEventListener("input", function () {
    const valor = this.value.toLowerCase().trim();

    if (!valor) {
      renderProductosFiltrados([]);
      return;
    }

    const filtrados = productos.filter(p =>
      p.nombre.toLowerCase().includes(valor) ||
      String(p.codigo ?? "").toLowerCase().includes(valor)
    );

    renderProductosFiltrados(filtrados);
  });

  buscador.addEventListener("keydown", function(e) {
    // Flecha abajo: siguiente producto
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moverProductoSeleccionado(1);
      return;
    }

    // Flecha arriba: producto anterior
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moverProductoSeleccionado(-1);
      return;
    }

    // Enter: seleccionar producto marcado
    if (e.key === "Enter") {
      e.preventDefault();

      if (seleccionarProductoActivo()) {
        return;
      }

      // Si no hay selección con flechas, mantiene el comportamiento
      // anterior: Enter sobre un nombre/código exacto.
      const valor = this.value.toLowerCase().trim();

      if (!valor) return;

      const producto = productos.find(p =>
        p.nombre.toLowerCase() === valor ||
        String(p.codigo ?? "").toLowerCase() === valor
      );

      if (!producto) {
        alert("Producto no encontrado");
        return;
      }

      agregarACaja(productos.indexOf(producto));
      return;
    }

    // Escape: cerrar buscador/listado
    if (e.key === "Escape") {
      e.preventDefault();
      this.value = "";
      renderProductosFiltrados([]);
      this.blur();
    }
  });

  document.addEventListener("click", function(e) {
    const lista = document.getElementById("productosCaja");
    if (!lista) return;

    if (!buscador.contains(e.target) && !lista.contains(e.target)) {
      lista.classList.remove("abierto");
    }
  });
});

// ===== CAJA DIARIA =====
function registrarVentaCaja(total, metodo) {
  const hoy = new Date().toLocaleDateString("es-AR");
  const caja = JSON.parse(localStorage.getItem("cajaDiaria")) || {};

  if (!caja[hoy]) {
    caja[hoy] = { efectivo: 0, qr: 0, tarjeta: 0, total: 0 };
  }

  if (!(metodo in caja[hoy])) caja[hoy][metodo] = 0;

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

  const total = document.getElementById("cajaTotal");
  const efectivo = document.getElementById("cajaEfectivo");
  const qr = document.getElementById("cajaQR");
  const tarjeta = document.getElementById("cajaTarjeta");

  if (total) total.textContent = datos.total;
  if (efectivo) efectivo.textContent = datos.efectivo;
  if (qr) qr.textContent = datos.qr;
  if (tarjeta) tarjeta.textContent = datos.tarjeta;
}

// ===== TARJETA =====
function procesarPagoTarjeta(total) {
  const contenedor = document.getElementById("qrContainer");
  if (!contenedor) return;

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

// ===== SCANNER =====
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
        const producto = productos.find(p => String(p.codigo) === String(decodedText));

        if (!producto) {
          alert("Producto no encontrado ❌");
          return;
        }

        agregarACaja(productos.indexOf(producto));

        scannerActivo.stop().then(() => {
          const reader = document.getElementById("reader");
          if (reader) reader.innerHTML = "";
        }).catch(() => {});
      },
      () => {}
    );

  } catch (err) {
    console.error(err);
    alert("No se pudo acceder a la cámara ❌");
  }
}

// ===== BUSCADOR DE CLIENTES =====
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("clienteCaja");
  const buscadorCliente = document.getElementById("buscadorClienteCaja");

  if (select) {
    select.addEventListener("change", function () {
      seleccionarClienteCaja(this.value);
    });
  }

  if (buscadorCliente) {
    buscadorCliente.addEventListener("input", function () {
      const valor = this.value.toLowerCase().trim();
      const selectCliente = document.getElementById("clienteCaja");
      if (!selectCliente) return;

      const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(valor) ||
        String(c.codigo ?? "").toLowerCase().includes(valor)
      );

      selectCliente.innerHTML = `<option value="">Consumidor final</option>` +
        filtrados.map(c => {
          const indexReal = clientes.indexOf(c);
          return `<option value="${indexReal}">
            ${c.codigo} - ${c.nombre} ($${c.saldo ?? 0})
          </option>`;
        }).join("");
    });

    buscadorCliente.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;

      const valor = this.value.toLowerCase().trim();

      const cliente = clientes.find(c =>
        c.nombre.toLowerCase() === valor ||
        String(c.codigo ?? "").toLowerCase() === valor
      );

      if (!cliente) {
        alert("Cliente no encontrado");
        return;
      }

      const index = clientes.indexOf(cliente);
      const selectCliente = document.getElementById("clienteCaja");

      if (selectCliente) {
        selectCliente.value = index;
      }

      seleccionarClienteCaja(index);
      this.value = "";
    });
  }

  const inputPago = document.getElementById("pagoCliente");
  if (inputPago) inputPago.addEventListener("input", calcularVuelto);

  actualizarCajaDia();
  actualizarMetodosPagoCaja();
});

function limpiarBuscadorCliente() {
  const buscador = document.getElementById("buscadorClienteCaja");
  const select = document.getElementById("clienteCaja");

  if (buscador) buscador.value = "";
  if (!select) return;

  cargarClientesCaja();
}


document.addEventListener("DOMContentLoaded", () => {
  asegurarEstilosCajaDropdown();

  const contenedor = document.getElementById("productosCaja");
  if (contenedor) contenedor.classList.add("productos-dropdown-caja");

  const buscador = document.getElementById("buscadorCaja");
  if (buscador) {
    buscador.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        this.value = "";
        renderProductosFiltrados([]);
        this.blur();
      }
    });
  }

  document.addEventListener("click", function(e) {
    const b = document.getElementById("buscadorCaja");
    const l = document.getElementById("productosCaja");
    if (b && l && !b.contains(e.target) && !l.contains(e.target)) {
      l.classList.remove("abierto");
    }
  });
});