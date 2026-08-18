const minimumWinRate = 85;

// Add only official daily Discord recaps here after Kobe sends them.
// Entries under the 85% threshold are automatically kept off the website.
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
  const eligibleRecaps = dailyRecaps
    .filter((recap) => recap.winRate >= minimumWinRate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!eligibleRecaps.length) {
    recapList.innerHTML = `
      <article class="recap-empty">
        <span>85%+</span>
        <h3>Recaps are on the way.</h3>
        <p>Official daily recap screenshots and dates will appear here once Kobe sends them over.</p>
      </article>`;
    return;
  }

  recapList.innerHTML = eligibleRecaps.map((recap) => `
    <article class="recap-card">
      <div class="recap-date">${formatRecapDate(recap.date)}</div>
      <div class="recap-rate">${recap.winRate}% <span>win rate</span></div>
      <img src="${recap.image}" alt="${recap.alt || 'Daily winning recap'}" />
      <p>${recap.summary || 'Official daily Discord recap.'}</p>
    </article>`).join('');
}

renderRecaps();
