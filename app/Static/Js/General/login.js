// login.js
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
        toastr.error('No se pudo iniciar sesión. Intente nuevamente.');
    }
});
