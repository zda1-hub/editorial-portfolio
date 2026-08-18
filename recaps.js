// Add approved recent Discord picks here after Kobe sends them.
const dailyRecaps = [];

const recapList = document.querySelector('[data-recap-list]');

function formatRecapDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

function renderRecaps() {
  const recentRecaps = [...dailyRecaps]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!recentRecaps.length) {
    recapList.innerHTML = `
      <article class="recap-empty">
        <span>FROM THE DISCORD</span>
        <h3>Recent picks are on the way.</h3>
        <p>Fresh picks, slips, and Discord posts will appear here once Kobe sends them over.</p>
      </article>`;
    return;
  }

  recapList.innerHTML = recentRecaps.map((recap) => `
    <article class="recap-card">
      <div class="recap-date">${formatRecapDate(recap.date)}</div>
      <img src="${recap.image}" alt="${recap.alt || 'Daily winning recap'}" />
      <p>${recap.summary || 'Recent Discord post.'}</p>
    </article>`).join('');
}

renderRecaps();
