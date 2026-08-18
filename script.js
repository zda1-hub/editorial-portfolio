const buttons = [...document.querySelectorAll('.nav-link')];
const panels = [...document.querySelectorAll('.panel')];

function showView(target, { updateHistory = true } = {}) {
  const button = document.querySelector(`[data-view="${target}"]`);
  if (!button) return;

  buttons.forEach((item) => item.classList.toggle('is-active', item === button));
  panels.forEach((panel) => panel.classList.toggle('is-active', panel.id === target));
  if (updateHistory) window.history.replaceState(null, '', `#${target}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

buttons.forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

const initial = window.location.hash.slice(1);
if (initial && document.getElementById(initial)) showView(initial, { updateHistory: false });

document.querySelector('.monogram').addEventListener('click', (event) => {
  event.preventDefault();
  showView('work');
});

window.addEventListener('hashchange', () => showView(window.location.hash.slice(1), { updateHistory: false }));
