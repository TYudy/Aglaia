const slider = document.querySelector('.slider');

function activate(e) {
  const items = document.querySelectorAll('.item');
  e.target.matches('.next') && slider.append(items[0]);
  e.target.matches('.prev') && slider.prepend(items[items.length - 1]);
}

function handleAction(e) {
  if (e.target.classList.contains('accept')) {
    alert('Project accepted!');
  } else if (e.target.classList.contains('reject')) {
    alert('Project rejected!');
  }
}

document.addEventListener('click', activate, false);
document.addEventListener('click', handleAction, false);
