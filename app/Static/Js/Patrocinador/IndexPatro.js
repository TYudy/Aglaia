function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
  }
  document.addEventListener('click', function(event) {
    var sidebar = document.querySelector('.app-sidebar');
    var toggleMenu = document.querySelector('.toggle-menu');

    if (!sidebar.contains(event.target) && !toggleMenu.contains(event.target)) {
      document.body.classList.remove('sidebar-open');
    }
  });

  const arrowIcon = document.querySelector('.user-arrow-btn .bx');
const subMenu = document.querySelector('.user-arrow-btn .sub-menu');

arrowIcon.addEventListener('click', function() {
  
  document.querySelector('.user-arrow-btn').classList.toggle('showMenu');
});

function ponerTema(nombreTema) {
  localStorage.setItem('tema', nombreTema);
  document.documentElement.className = nombreTema;
  var iframe = document.getElementById('iframeContent');
  iframe.src = iframe.src;
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



function loadContent(page) {
  var iframe = document.getElementById('iframeContent');
  iframe.src = page;
  iframe.style.display = 'block';
  document.getElementById('Home').style.display = 'none';
   document.querySelector('form').style.display="none"
}

function loadHome() {
  var iframe = document.getElementById('iframeContent');
  iframe.style.display = 'none';
  document.getElementById('Home').style.display = 'block';
  document.querySelector('form').style.display="block"
}

window.onload = function() {
  if (localStorage.getItem('tema') === 'Oscuro') {
      ponerTema('Oscuro');
      document.getElementById('slider').checked = false;
  } else {
      ponerTema('Claro');
      document.getElementById('slider').checked = true;
  }


  loadHome();

};
