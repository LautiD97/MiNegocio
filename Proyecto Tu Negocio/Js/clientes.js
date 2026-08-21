// ===== CLIENTES =====

function generarCodigoCliente() {
  let ultimo = localStorage.getItem("ultimoCodigoCliente") || 0;
  ultimo = parseInt(ultimo) + 1;
  localStorage.setItem("ultimoCodigoCliente", ultimo);
  return ultimo;
}

function guardarCliente() {
  if (!esPro() && editandoCliente === null && !puedeCrearCliente()) {
    abrirModalPro();
    return;
  }

  const nombreInput = document.getElementById("nombreCliente");
  const telefonoInput = document.getElementById("telefonoCliente");
  const notaInput = document.getElementById("notaCliente");

  if (
    nombreInput.value.trim() === "" ||
    telefonoInput.value.trim() === ""
  ) {
    alert("Nombre y teléfono son obligatorios");
    return;
  }

  if (editandoCliente !== null) {
    clientes[editandoCliente] = {
      ...clientes[editandoCliente],
      nombre: nombreInput.value.trim(),
      telefono: telefonoInput.value.trim(),
      nota: notaInput.value.trim()
    };

    editandoCliente = null;
  } else {
    clientes.push({
      codigo: generarCodigoCliente(),
      nombre: nombreInput.value.trim(),
      telefono: telefonoInput.value.trim(),
      nota: notaInput.value.trim(),
      saldo: 0
    });
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));

  nombreInput.value = "";
  telefonoInput.value = "";
  notaInput.value = "";

  mostrarClientes();
  if (typeof actualizarLimites === "function") actualizarLimites();
}

function mostrarClientes() {
  const tabla = document.getElementById("tablaClientes");
  if (!tabla) return;

  tabla.innerHTML = "";

  clientes.forEach((c, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${c.codigo}</td>
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.nota}</td>
        <td>$${c.saldo ?? 0}</td>
        <td>
          <button onclick="editarCliente(${i})">✏️</button>
          <button onclick="editarSaldo(${i})">💰</button>
          <button onclick="eliminarCliente(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

function editarCliente(i) {
  const nombreInput = document.getElementById("nombreCliente");
  const telefonoInput = document.getElementById("telefonoCliente");
  const notaInput = document.getElementById("notaCliente");

  nombreInput.value = clientes[i].nombre;
  telefonoInput.value = clientes[i].telefono;
  notaInput.value = clientes[i].nota;

  editandoCliente = i;

  if (typeof mostrarSeccion === "function") mostrarSeccion("clientes");
}

function eliminarCliente(i) {
  clientes.splice(i, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
  if (typeof actualizarLimites === "function") actualizarLimites();
}

function filtrarClientes() {
  const input = document.getElementById("buscadorClientes");
  const tabla = document.getElementById("tablaClientes");
  if (!input || !tabla) return;

  const texto = input.value.toLowerCase();
  tabla.innerHTML = "";

  clientes
    .filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      String(c.codigo ?? "").toLowerCase().includes(texto)
    )
    .forEach((c, i) => {
      tabla.innerHTML += `
        <tr>
          <td>${c.codigo}</td>
          <td>${c.nombre}</td>
          <td>${c.telefono}</td>
          <td>${c.nota}</td>
          <td>$${c.saldo ?? 0}</td>
          <td>
            <button onclick="editarCliente(${i})">✏️</button>
            <button onclick="editarSaldo(${i})">💰</button>
            <button onclick="eliminarCliente(${i})">🗑️</button>
          </td>
        </tr>
      `;
    });
}

function limpiarFiltroClientes() {
  const buscador = document.getElementById("buscadorClientes");
  if (buscador) buscador.value = "";
  mostrarClientes();
}

function editarSaldo(index) {
  const monto = prompt("Ingresar monto (+ suma / - resta):");
  if (monto === null) return;

  const valor = parseFloat(monto);

  if (isNaN(valor)) {
    alert("Monto inválido");
    return;
  }

  clientes[index].saldo =
    (clientes[index].saldo ?? 0) + valor;

  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}