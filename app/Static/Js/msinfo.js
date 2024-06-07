// script.js
document.getElementById('infoButton').addEventListener('click', function() {
    var infoContainer = document.getElementById('infoContainer');
    if (infoContainer.style.display === 'none') {
        infoContainer.style.display = 'block';
    } else {
        infoContainer.style.display = 'none';
    }
});
