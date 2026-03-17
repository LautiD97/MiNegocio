// ===== BACKUP =====

function hacerBackup() {

  const datos = { productos, clientes, pedidos };

  const blob = new Blob(
    [JSON.stringify(datos, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup_minegocio.json";
  a.click();
}

function restaurarBackup(input) {

  const archivo = input.files[0];
  if (!archivo) return;

  const lector = new FileReader();

  lector.onload = e => {

    try {
      const datos = JSON.parse(e.target.result);

      productos = datos.productos || [];
      clientes = datos.clientes || [];
      pedidos = datos.pedidos || [];

      localStorage.setItem("productos", JSON.stringify(productos));
      localStorage.setItem("clientes", JSON.stringify(clientes));
      localStorage.setItem("pedidos", JSON.stringify(pedidos));

      mostrarProductos();
      mostrarClientes();
      mostrarPedidos();
      cargarEstadisticas();

      alert("Backup restaurado correctamente ✅");

    } catch (error) {
      alert("Archivo inválido ❌");
    }
  };

  lector.readAsText(archivo);
}


function backupAutomatico() {

  if (!esUsuarioPro) return;

  const datos = {
    productos,
    clientes,
    pedidos
  };

  localStorage.setItem("backupAuto", JSON.stringify(datos));
}

if (!esUsuarioPro) {
  setInterval(() => {
    localStorage.setItem("backup_auto", JSON.stringify({
      fecha: new Date(),
      productos,
      clientes,
      pedidos
    }));
  }, 300000); // cada 5 min
}