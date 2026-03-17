// ===== LOGIN Y USUARIOS =====

function login() {

  const usuarioGuardado = localStorage.getItem("usuario");
  const claveGuardada = localStorage.getItem("clave");

  if (usuarioLogin.value === usuarioGuardado && claveLogin.value === claveGuardada) {

    localStorage.setItem("sesionActiva", "true");

    document.getElementById("login").style.display = "none";
    document.getElementById("sistema").style.display = "flex";

    if (typeof aplicarModulos === "function") {
      aplicarModulos();
    }

  } else {
    alert("Usuario o contraseña incorrectos");
  }

}

function cerrarSesion() {

  localStorage.removeItem("sesionActiva");

  document.getElementById("sistema").style.display = "none";
  document.getElementById("login").style.display = "flex";

  usuarioLogin.value = "";
  claveLogin.value = "";
}

function crearUsuarioLogin() {

  const usuario = nuevoUserLogin.value.trim();
  const pass = nuevaPassLogin.value.trim();
  const telefono = telefonoUserLogin.value.trim();

  if (usuario === "" || pass === "" || telefono === "") {
    alert("Completá todos los campos");
    return;
  }

  localStorage.setItem("usuario", usuario);
  localStorage.setItem("clave", pass);
  localStorage.setItem("telefonoRecuperacion", telefono);

  const modulosIniciales = {
    productos: modProdLogin.checked,
    clientes: modCliLogin.checked,
    pedidos: modPedLogin.checked,
    estadisticas: modEstLogin.checked
  };

  localStorage.setItem("modulos", JSON.stringify(modulosIniciales));

  alert("Usuario creado correctamente ✅");

  ocultarRegistro();
}



// ===== MOSTRAR / OCULTAR =====

function mostrarRegistro() {
  document.getElementById("registroUsuario").style.display = "block";
}

function ocultarRegistro() {
  document.getElementById("registroUsuario").style.display = "none";
}

function mostrarRecuperacion() {
  document.getElementById("login").style.display = "none";
  document.getElementById("recuperacion").style.display = "flex";
}

function volverLogin() {
  document.getElementById("recuperacion").style.display = "none";
  document.getElementById("login").style.display = "flex";
}



// ===== RECUPERACIÓN DE CONTRASEÑA =====

function recuperarClave() {

  const telefonoIngresado = document.getElementById("telefonoRecuperacion").value.trim();
  const telefonoGuardado = localStorage.getItem("telefonoRecuperacion");

  if (!telefonoGuardado) {
    alert("No hay usuario registrado");
    return;
  }

  if (telefonoIngresado !== telefonoGuardado) {
    alert("El número no coincide");
    return;
  }

  // Generar código
  const codigo = Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem("codigoRecupero", codigo);

  alert("Tu código es: " + codigo);

  mostrarInputCodigo();
}

function mostrarInputCodigo() {

  const contenedor = document.getElementById("recuperacion");

  contenedor.innerHTML += `
    <input id="codigoIngresado" placeholder="Ingresá el código">
    <input id="nuevaClaveRecuperada" type="password" placeholder="Nueva contraseña">
    <button class="btn btn-primary" onclick="confirmarRecuperacion()">Confirmar</button>
  `;
}

function confirmarRecuperacion() {

  const codigoGuardado = localStorage.getItem("codigoRecupero");
  const codigoIngresado = document.getElementById("codigoIngresado").value;
  const nuevaClave = document.getElementById("nuevaClaveRecuperada").value;

  if (codigoIngresado !== codigoGuardado) {
    alert("Código incorrecto");
    return;
  }

  if (nuevaClave.trim() === "") {
    alert("Ingresá una nueva contraseña");
    return;
  }

  localStorage.setItem("clave", nuevaClave);
  localStorage.removeItem("codigoRecupero");

  alert("Contraseña actualizada correctamente ✅");

  volverLogin();
}

function activarPro() {
  esPro = true;
  localStorage.setItem("esPro", "true");

  cerrarModal();

  alert("🎉 Ahora sos usuario PRO");

  actualizarUIPro();
}

function actualizarUIPro() {

  const banner = document.querySelector(".banner-free");
  const limites = document.querySelector(".limites-free");

  if (esUsuarioPro) {
    if (banner) banner.style.display = "none";
    if (limites) limites.style.display = "none";
  }
}

function cerrarModal() {
  const modal = document.getElementById("modalPro");
  if (modal) modal.style.display = "none";
}

function desactivarPro() {
  localStorage.removeItem("plan");
  alert("Tu plan PRO fue desactivado.");
  location.reload();
}