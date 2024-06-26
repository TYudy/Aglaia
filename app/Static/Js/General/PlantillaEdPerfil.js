
console.log(localStorage.getItem('tema'))

function cambiarTema() {
    if (localStorage.getItem('tema') === 'Oscuro') {
        document.documentElement.className = 'Oscuro';
       
    } else {
        document.documentElement.className = 'Claro';  
        
    }
}
// document.addEventListener('DOMContentLoaded', function() {
//     cambiarTema();
// });
window.onload = () =>{
    cambiarTema()
}