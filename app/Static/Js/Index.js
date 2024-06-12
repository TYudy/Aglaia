
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
    loadHome(); 
};
