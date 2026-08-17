// ===== DATOS GLOBALES =====

// Estado PRO


// Arrays principales
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// Caja
let pedidoCaja = [];

// Ediciones
let editandoProducto = null;
let editandoCliente = null;
let editandoPedido = null;

window.addEventListener("DOMContentLoaded", () => {

  const sesionActiva = localStorage.getItem("sesionActiva");

  if (sesionActiva === "true") {
    document.getElementById("login").style.display = "none";
    document.getElementById("sistema").style.display = "flex";
    
  }

});