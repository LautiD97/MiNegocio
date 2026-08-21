// ===== PRODUCTOS =====

function guardarProducto() {
  if (!esPro() && editandoProducto === null && !puedeCrearProducto()) {
    abrirModalPro();
    return;
  }

  const nombreInput = document.getElementById("nombreProducto");
  const precioInput = document.getElementById("precioProducto");
  const stockInput = document.getElementById("stockProducto");
  const codigoInput = document.getElementById("codigoProducto");

  const codigo = codigoInput ? codigoInput.value.trim() : "";

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
      ...productos[editandoProducto],
      nombre: nombreInput.value.trim(),
      precio: +precioInput.value,
      stock: +stockInput.value
    };

    if (!productos[editandoProducto].codigo && codigo) {
      productos[editandoProducto].codigo = codigo;
    }

    editandoProducto = null;
  } else {
    productos.push({
      nombre: nombreInput.value.trim(),
      precio: +precioInput.value,
      stock: +stockInput.value,
      codigo
    });
  }

  localStorage.setItem("productos", JSON.stringify(productos));

  nombreInput.value = "";
  precioInput.value = "";
  stockInput.value = "";
  if (codigoInput) codigoInput.value = "";

  mostrarProductos();
  if (typeof actualizarLimites === "function") actualizarLimites();
}

function mostrarProductos() {
  const tabla = document.getElementById("tablaProductos");
  if (!tabla) return;

  tabla.innerHTML = "";

  productos.forEach((p, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.codigo || ""}</td>
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
  const codigoInput = document.getElementById("codigoProducto");

  nombreInput.value = productos[i].nombre;
  precioInput.value = productos[i].precio;
  stockInput.value = productos[i].stock;
  if (codigoInput) codigoInput.value = productos[i].codigo || "";

  editandoProducto = i;

  if (typeof mostrarSeccion === "function") mostrarSeccion("productos");
}

function eliminarProducto(i) {
  productos.splice(i, 1);
  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductos();
  if (typeof actualizarLimites === "function") actualizarLimites();
}

function filtrarProductos() {
  const input = document.getElementById("buscadorProductos");
  const tabla = document.getElementById("tablaProductos");
  if (!input || !tabla) return;

  const texto = input.value.toLowerCase();
  tabla.innerHTML = "";

  productos
    .filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      String(p.codigo || "").toLowerCase().includes(texto)
    )
    .forEach((p, i) => {
      tabla.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>${p.codigo || ""}</td>
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
  const buscador = document.getElementById("buscadorProductos");
  if (buscador) buscador.value = "";
  mostrarProductos();
}