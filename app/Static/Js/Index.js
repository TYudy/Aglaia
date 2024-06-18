function loadContent(page) {
    var iframe = document.getElementById('iframeContent');
    iframe.src = page;
    iframe.style.display = 'block'; // Mostrar el iframe cuando se carga contenido
    document.getElementById('Home').style.display = 'none'; // Ocultar la sección Home
}

function loadHome() {
    var iframe = document.getElementById('iframeContent');
    iframe.style.display = 'none'; // Ocultar el iframe cuando se vuelve a la página de inicio
    document.getElementById('Home').style.display = 'block'; // Mostrar la sección Home
}

window.onload = function() {
    loadHome(); // Asegurar que al cargar la página se muestre la sección Home
};