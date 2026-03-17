// ===== PRODUCTOS =====

function guardarProducto() {

  if (!esPro && productos.length >= 5 && editandoProducto === null) {
    abrirModalPro();
    return;
  }

  const nombreInput = document.getElementById("nombreProducto");
  const precioInput = document.getElementById("precioProducto");
  const stockInput = document.getElementById("stockProducto");

  if (
    nombreInput.value.trim() === "" ||
    precioInput.value === "" ||
    stockInput.value === ""
  ) {
    alert("Completá todos los campos");
    return;
  }

  if (editandoProducto !== null) {
    productos[editandoProducto] = {
      nombre: nombreInput.value,
      precio: +precioInput.value,
      stock: +stockInput.value
    };
    editandoProducto = null;
  } else {
    productos.push({
      nombre: nombreInput.value,
      precio: +precioInput.value,
      stock: +stockInput.value
    });

    if (!esUsuarioPro() && productos.length >= 5 && editandoProducto === null) {
  abrirModalPro();
  return;
}
  }

  localStorage.setItem("productos", JSON.stringify(productos));

  nombreInput.value = "";
  precioInput.value = "";
  stockInput.value = "";

  mostrarProductos();
}

function mostrarProductos() {

  const tabla = document.getElementById("tablaProductos");
  if (!tabla) return;

  tabla.innerHTML = "";

  productos.forEach((p, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn btn-primary" onclick="editarProducto(${i})">✏️</button>
          <button class="btn btn-danger" onclick="eliminarProducto(${i})">X</button>
        </td>
      </tr>
    `;
  });
}

function editarProducto(i) {

  const nombreInput = document.getElementById("nombreProducto");
  const precioInput = document.getElementById("precioProducto");
  const stockInput = document.getElementById("stockProducto");

  nombreInput.value = productos[i].nombre;
  precioInput.value = productos[i].precio;
  stockInput.value = productos[i].stock;

  editandoProducto = i;

  if (typeof mostrarSeccion === "function") {
    mostrarSeccion("productos");
  }
}

function eliminarProducto(i) {
  productos.splice(i, 1);
  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductos();
}

function filtrarProductos() {

  if (!esUsuarioPro) return; // Solo PRO
  document.getElementById("buscadorProductos").style.display = "none";

  const texto = document.getElementById("buscadorProductos").value.toLowerCase();

  const tabla = document.getElementById("tablaProductos");
  tabla.innerHTML = "";

  productos
    .filter(p => p.nombre.toLowerCase().includes(texto))
    .forEach((p, i) => {
      tabla.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>$${p.precio}</td>
          <td>${p.stock}</td>
          <td>
            <button onclick="editarProducto(${i})">✏️</button>
            <button onclick="eliminarProducto(${i})">X</button>
          </td>
        </tr>
      `;
    });
}

function limpiarFiltroProductos() {
  document.getElementById("buscarProducto").value = "";
  renderProductos();
}