function validarFormulario() {
    var contrasena = document.getElementById("contrasena").value;
    var confirmarContrasena = document.getElementById("confirmar_contrasena").value;
  
    if (contrasena !== confirmarContrasena) {
        mostrarError("Las contraseñas no coinciden");
        return false;
    }
  
    var nombresMiembros = document.getElementById("nombre_miembros").value.trim();
    if (nombresMiembros === "") {
        mostrarError("Por favor ingresa al menos un nombre de miembro");
        return false;
    }
  
    return true;
  }
  
  function mostrarError(mensaje) {
    var mensajeError = document.getElementById("mensajeError");
    mensajeError.textContent = mensaje;
  }
  