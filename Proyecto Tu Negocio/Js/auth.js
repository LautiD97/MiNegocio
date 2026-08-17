// ===== LOGIN Y USUARIOS =====

function login() {

  const userInput = document.getElementById("usuarioLogin").value.trim().toLowerCase();
  const passInput = document.getElementById("claveLogin").value.trim();

  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  if (!usuarioGuardado) {
    alert("No hay usuario creado");
    return;
  }

  if (
    userInput === usuarioGuardado.usuario &&
    passInput === usuarioGuardado.clave
  ) {

    // ✅ guardar sesión SOLO si es correcto
    localStorage.setItem("sesionActiva", "true");

    document.getElementById("login").style.display = "none";

    const sistema = document.getElementById("sistema");
    sistema.classList.remove("oculto");
    sistema.style.display = "";

  } else {
    alert("Datos incorrectos ❌");
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

  const usuario = document.getElementById("nuevoUserLogin").value.trim();
  const clave = document.getElementById("nuevaPassLogin").value.trim();
  const telefono = document.getElementById("telefonoUserLogin").value.trim();

  if (!usuario || !clave) {
    alert("Completá usuario y contraseña");
    return;
  }

  const nuevoUsuario = {
    usuario: usuario.toLowerCase(),
    clave,
    telefono
  };

  localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));

  alert("Usuario creado correctamente ✅");
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

  const telefonoInput = document.getElementById("telefonoRecuperacion").value.trim();

  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  if (!usuarioGuardado) {
    alert("No hay usuario registrado");
    return;
  }

  if (telefonoInput === usuarioGuardado.telefono) {
    alert("Tu contraseña es: " + usuarioGuardado.clave);
  } else {
    alert("Número incorrecto ❌");
  }
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


function actualizarUIPro() {

  const banner = document.querySelector(".banner-free");
  const limites = document.querySelector(".limites-free");

  
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

window.activarPro = function () {

  const hoy = new Date();
  hoy.setMonth(hoy.getMonth() + 1);

  const plan = {
    tipo: "pro",
    vence: hoy.toISOString()
  };

  localStorage.setItem("plan", JSON.stringify(plan));

  alert("💎 PRO activado");

  location.reload();
};