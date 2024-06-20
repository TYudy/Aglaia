function toggleRegisterMenu() {
    var menu = document.getElementById('register-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

function loadContent(page) {
    var iframe = document.getElementById('iframeContent');
    iframe.src = page;
    iframe.style.display = 'block';
    document.getElementById('Home').style.display = 'none';
    document.getElementById('buscador').style.display = 'none';
}

function loadHome() {
    document.getElementById('Home').style.display = 'block';
    document.getElementById('buscador').style.display = 'block';
    document.getElementById('iframeContent').style.display = 'none';
}

window.onload = function() {
    loadHome(); 
};

// Cierra el menú de registro si se hace clic fuera de él
window.onclick = function(event) {
    var menu = document.getElementById('register-menu');
    if (!event.target.matches('#register-menu') && !event.target.closest('#register-menu') && !event.target.closest('a')) {
        menu.style.display = 'none';
    }
}

// Función para mostrar/ocultar el menú desplegable
function toggleMenu() {
    var ul = document.querySelector('nav ul');
    ul.classList.toggle('active');
}

// Asegurar que el pie de página esté siempre al final de la página
function adjustFooterPosition() {
    const footer = document.querySelector('footer');
    const body = document.body;
    const html = document.documentElement;
    
    const windowHeight = window.innerHeight;
    const bodyHeight = body.offsetHeight;
    const htmlHeight = html.offsetHeight;
  
    if (bodyHeight < windowHeight || htmlHeight < windowHeight) {
      footer.style.position = 'absolute';
      footer.style.bottom = '0';
    } else {
      footer.style.position = 'relative';
    }
  }
  
  // Ejecutar la función cuando se carga la página y cuando se redimensiona la ventana
  window.addEventListener('load', adjustFooterPosition);
  window.addEventListener('resize', adjustFooterPosition);
  

