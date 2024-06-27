// Función para mostrar/ocultar el menú de navegación en dispositivos móviles
function toggleMenu() {
    var ul = document.querySelector('nav ul');
    ul.classList.toggle('active');
}

// Función para cargar contenido en el iframe y mostrar/ocultar secciones
function loadContent(page) {
    var iframe = document.getElementById('iframeContent');
    iframe.src = page;
    iframe.style.display = 'block';
    document.getElementById('Home').style.display = 'none';
    document.getElementById('buscador').style.display = 'none';
}

// Función para cargar la sección de inicio
function loadHome() {
    var iframe = document.getElementById('iframeContent');
    iframe.style.display = 'none';
    document.getElementById('Home').style.display = 'block';
    document.getElementById('buscador').style.display = 'block';
}

// Función para abrir/cerrar la ventana del chatbot
function toggleChat() {
    var chatWindow = document.getElementById("chatWindow");
    if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
        chatWindow.style.display = "block";
    } else {
        chatWindow.style.display = "none";
    }
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

// Mostrar el pie de página al cargar la página
window.onload = function() {
    adjustFooterPosition();
    loadHome(); 
};

// Mostrar/ocultar el contenido informativo en la sección de inicio
document.getElementById('infoButton').addEventListener('click', function() {
    var infoContainer = document.getElementById('infoContainer');
    if (infoContainer.style.display === 'none') {
        infoContainer.style.display = 'block';
    } else {
        infoContainer.style.display = 'none';
    }
});

// Cerrar el menú de registro si se hace clic fuera de él
window.onclick = function(event) {
    var menu = document.getElementById('register-menu');
    if (!event.target.matches('#register-menu') && !event.target.closest('#register-menu') && !event.target.closest('a')) {
        menu.style.display = 'none';
    }
}
