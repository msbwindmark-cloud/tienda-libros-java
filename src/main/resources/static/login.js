// Añade esto al final del body en login.html
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('logout')) {
    Swal.fire('Sesión cerrada', 'Has salido del sistema correctamente', 'info');
}