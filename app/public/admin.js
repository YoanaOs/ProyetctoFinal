function Productos() {
  document.location.href = "productos.html";
}



function recargarsaldo() {
  document.location.href = "/pagar";
}
function cerrarSesion() {
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.location.href = "/";
}



