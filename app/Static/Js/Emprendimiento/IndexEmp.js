// // const sidebar = document.querySelector('.sidebar');
// // const mainContent = document.querySelector('.main-content');
// // document.querySelector('button').onclick = function () {
// //   sidebar.classList.toggle('sidebar_small');
// //   mainContent.classList.toggle('main-content_large')
// // }




// // let menu = document.querySelector(".sidebar-left");
// // let logo = document.querySelector(".logo");
// // console.log(logo)
// // logo.addEventListener("click", ()=>{
// //   menu.classList.toggle("close")
// // })




// let menu = document.querySelector(".sidebar-left");
// let sw = document.querySelector(".switch")
// let options = menu.querySelectorAll(".option");

// function flotante(){
//   menu.classList.remove("close");
//   if (sw.checked){
//      menu.classList.remove("animationb");
//      menu.classList.add("animationa");
     
//      options.forEach(option => {
      
//       option.classList.remove("hidden");
//       option.classList.add("animationop");
      
//       // setTimeout(() => {
//       //   option.style.opacity = "1";
//       // }, 500);
//       option.addEventListener("animationend", () => {
//         option.style.opacity = "1";
//       }, { once: true });
//     });
       
//     } else {
      
//     menu.classList.remove("animationa");
//         menu.classList.add("animationb");
      
//         options.forEach(option => {
//           option.classList.remove("animationop");
//           option.classList.add("hidden");
//           option.style.opacity = "0";

        
//     });
//   }
  
//   // menu.classList.toggle("close")
//   // menu.classList.remove("animationa");
//   //     void menu.offsetHeight;  
//   // menu.classList.add("animationa")
// }


// menu.classList.add("close");
// window.onload = ()=>{
  
//   sw.addEventListener("change", flotante);
// }



// function ponerTema(nombreTema) {
//   localStorage.setItem('tema', nombreTema);
//   document.documentElement.className = nombreTema;

// }



// function cambiarTema() {
//   if (localStorage.getItem('tema') === 'Oscuro') {
//       ponerTema('Claro');
//      const light = document.querySelector('.light')
//      const dark = document.querySelector('.dark')
//      light.style.color = 'var(--color-primario)'
//      dark.style.color = 'var(--letra)'
//   } else {
//       ponerTema('Oscuro');
//       const light = document.querySelector('.light')
//      const dark = document.querySelector('.dark')
//      light.style.color = 'var(--letra)'
//      dark.style.color = 'var(--color-primario)'
      
      
//   }
// }


// (function () {

//   if (localStorage.getItem('tema') === 'Oscuro') {
//       ponerTema('Oscuro');
//       document.getElementById('slider').checked = false;
      
//   } else {
//       ponerTema('Claro');
//     document.getElementById('slider').checked = true;
    
//   }
// })();






// function loadContent(page) {
//   var iframe = document.getElementById('iframeContent');
//   iframe.src = page;
//   iframe.style.display = 'block'; 
//   document.getElementById('Home').style.display = 'none';
//   // document.getElementById('buscador').style.display = 'none'; 
// }

// function loadHome() {
//   var iframe = document.getElementById('iframeContent');
//   iframe.style.display = 'none'; 
//   document.getElementById('Home').style.display = 'block';
//   // document.getElementById('buscador').style.display = 'block'; 
// }

// window.onload = function() {
//   loadHome(); 
// };

// window.onload = function() {
//   var home = document.getElementById("Home");
//   if (home) {
//       home.scrollIntoView();
//   }
// };

let menu = document.querySelector(".sidebar-left");
let sw = document.querySelector(".switch");
let options = menu.querySelectorAll(".option");

function flotante() {
    menu.classList.remove("close");
    if (sw.checked) {
        menu.classList.remove("animationb");
        menu.classList.add("animationa");
        
        options.forEach(option => {
            option.classList.remove("hidden");
            option.classList.add("animationop");
            option.addEventListener("animationend", () => {
                option.style.opacity = "1";
            }, { once: true });
        });

    } else {
        menu.classList.remove("animationa");
        menu.classList.add("animationb");

        options.forEach(option => {
            option.classList.remove("animationop");
            option.classList.add("hidden");
            option.style.opacity = "0";
        });
    }
}

function ponerTema(nombreTema) {
    localStorage.setItem('tema', nombreTema);
    document.documentElement.className = nombreTema;
    var iframe = document.getElementById('iframeContent');
    iframe.src = iframe.src;
}

function cambiarTema() {
    if (localStorage.getItem('tema') === 'Oscuro') {
        ponerTema('Claro');
        const light = document.querySelector('.light');
        const dark = document.querySelector('.dark');
        light.style.color = 'var(--color-primario)';
        dark.style.color = 'var(--letra)';
    } else {
        ponerTema('Oscuro');
        const light = document.querySelector('.light');
        const dark = document.querySelector('.dark');
        light.style.color = 'var(--letra)';
        dark.style.color = 'var(--color-primario)';
    }
}

function loadContent(page) {
    var iframe = document.getElementById('iframeContent');
    iframe.src = page;
    iframe.style.display = 'block';
    document.getElementById('Home').style.display = 'none';
}

function loadHome() {
    var iframe = document.getElementById('iframeContent');
    iframe.style.display = 'none';
    document.getElementById('Home').style.display = 'block';
}

window.onload = function() {
    if (localStorage.getItem('tema') === 'Oscuro') {
        ponerTema('Oscuro');
        document.getElementById('slider').checked = false;
    } else {
        ponerTema('Claro');
        document.getElementById('slider').checked = true;
    }

    sw.addEventListener("change", flotante);
    loadHome();

};

