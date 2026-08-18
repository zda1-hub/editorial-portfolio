const buttons = [...document.querySelectorAll('.nav-link')];
const panels = [...document.querySelectorAll('.panel')];

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.view;
    buttons.forEach((item) => item.classList.toggle('is-active', item === button));
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.id === target));
    window.history.replaceState(null, '', `#${target}`);
  });
});

const initial = window.location.hash.slice(1);
if (initial && document.getElementById(initial)) document.querySelector(`[data-view="${initial}"]`).click();
