// ===== CLIENTES =====

function guardarCliente() {

  if (!esPro && clientes.length >= 5 && editandoCliente === null) {
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
      nombre: nombreInput.value,
      telefono: telefonoInput.value,
      nota: notaInput.value
    };
    editandoCliente = null;
  } else {
    clientes.push({
      nombre: nombreInput.value,
      telefono: telefonoInput.value,
      nota: notaInput.value
    });
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));

  nombreInput.value = "";
  telefonoInput.value = "";
  notaInput.value = "";

  mostrarClientes();
}

function mostrarClientes() {

  const tabla = document.getElementById("tablaClientes");
  if (!tabla) return;

  tabla.innerHTML = "";

  clientes.forEach((c, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.telefono}</td>
        <td>${c.nota}</td>
        <td>
          <button class="btn btn-primary" onclick="editarCliente(${i})">✏️</button>
          <button class="btn btn-danger" onclick="eliminarCliente(${i})">X</button>
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

  if (typeof mostrarSeccion === "function") {
    mostrarSeccion("clientes");
  }
}

function eliminarCliente(i) {
  clientes.splice(i, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}

function filtrarClientes() {

  if (!esPro) return;

  const texto = document.getElementById("buscadorClientes").value.toLowerCase();
  const tabla = document.getElementById("tablaClientes");
  tabla.innerHTML = "";

  clientes
    .filter(c => c.nombre.toLowerCase().includes(texto))
    .forEach((c, i) => {
      tabla.innerHTML += `
        <tr>
          <td>${c.nombre}</td>
          <td>${c.telefono}</td>
          <td>${c.nota}</td>
          <td>
            <button onclick="editarCliente(${i})">✏️</button>
            <button onclick="eliminarCliente(${i})">X</button>
          </td>
        </tr>
      `;
    });
}

function limpiarFiltroClientes() {
  document.getElementById("buscarCliente").value = "";
  renderClientes();
}