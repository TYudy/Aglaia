let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
 arrowParent.classList.toggle("showMenu");
  });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".logo");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("close");
});

function ponerTema(nombreTema) {
    localStorage.setItem('tema', nombreTema);
    document.documentElement.className = nombreTema;

}



function cambiarTema() {
    if (localStorage.getItem('tema') === 'Oscuro') {
        ponerTema('Claro');
       const light = document.querySelector('.light')
       const dark = document.querySelector('.dark')
       light.style.color = 'var(--color-primario)'
       dark.style.color = 'var(--letra)'
    } else {
        ponerTema('Oscuro');
        const light = document.querySelector('.light')
       const dark = document.querySelector('.dark')
       light.style.color = 'var(--letra)'
       dark.style.color = 'var(--color-primario)'
        
        
    }
}


(function () {
  
    if (localStorage.getItem('tema') === 'Oscuro') {
        ponerTema('Oscuro');
        document.getElementById('slider').checked = false;
        
    } else {
        ponerTema('Claro');
      document.getElementById('slider').checked = true;
      
    }
})();