<<<<<<< HEAD
// function loadContent(page) {
//     fetch(page)
//         .then(response => response.text())
//         .then(data => {
//             var tempDiv = document.createElement('div');
//             tempDiv.innerHTML = data;
//             var content = tempDiv.querySelector('#Home').innerHTML;
            
//             document.getElementById('content').innerHTML = content;
//         })
//         .catch(error => {
//             console.error('Error al cargar el contenido:', error);
//         });
// }
// window.onload = function() {
//     loadContent('#Home');
// };

// function loadContent(page) {
//     fetch(page)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('content').innerHTML = data;
//         })
//         .catch(error => {
//             console.error('Error al cargar el contenido:', error);
//         });
// }

// window.onload = function() {
    
//     loadContent('/');
// };

// function loadContent(page) {
//     fetch(page)
//         .then(response => response.text())
//         .then(data => {
//             var isHome = page === '/';
//             if (isHome) {
//                 var tempDiv = document.createElement('div');
//                 tempDiv.innerHTML = data;
//                 var content = tempDiv.querySelector('#Home').innerHTML;
//                 document.getElementById('content').innerHTML = content;
//             } else {
//                 document.getElementById('content').innerHTML = data;
//             }
//         })
//         .catch(error => {
//             console.error('Error al cargar el contenido:', error);
//         });
// }

// window.onload = function() {
//     loadContent('/');
// };


// function loadContent(page) {
//     fetch(page)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('dynamicContent').innerHTML = data;
//         })
//         .catch(error => {
//             console.error('Error al cargar el contenido:', error);
//         });
// }

// function loadHome() {
//     document.getElementById('Home').style.display = 'block';
//     document.getElementById('dynamicContent').innerHTML = '';
// }

// window.onload = function() {
//     loadHome(); // Cargar la página de inicio por defecto
// };
=======

>>>>>>> bc810460056645b5fc541fe2862a01dcff7d793c

function loadContent(page) {
    var iframe = document.getElementById('iframeContent');
    iframe.src = page;
    iframe.style.display = 'block';
    document.getElementById('Home').style.display = 'none';
}

function loadHome() {
    document.getElementById('Home').style.display = 'block';
    document.getElementById('iframeContent').style.display = 'none';
}

window.onload = function() {
<<<<<<< HEAD
    loadHome(); // Cargar la página de inicio por defecto
=======
    loadHome(); 
>>>>>>> bc810460056645b5fc541fe2862a01dcff7d793c
};
