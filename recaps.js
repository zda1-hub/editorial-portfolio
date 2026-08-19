const dailyRecaps = [
  {
    image: 'assets/wins/5-bet-parlay-winner.jpg',
    alt: 'Winning 5-bet parlay with completed green checks',
    title: '5-bet parlay',
    tag: 'Discord pick · winner +636',
    summary: '$19.80 wager returned $145.82.',
  },
  {
    image: 'assets/wins/3-leg-parlay-277-winner.jpg',
    alt: 'Winning 3-leg parlay',
    title: '3-leg parlay',
    tag: 'Discord pick · winner +277',
    summary: 'Three completed legs, graded as a win.',
  },
  {
    image: 'assets/wins/3-leg-parlay-652-winner.jpg',
    alt: 'Winning 3-leg parlay',
    title: '3-leg parlay',
    tag: 'Discord pick · winner +652',
    summary: 'Three completed legs, graded as a win.',
  },
  {
    image: 'assets/wins/9-leg-parlay-winner.png',
    alt: 'Winning 9-leg parlay with completed green checks',
    title: '9-leg parlay',
    tag: 'Discord pick · winner +3674',
    summary: '$27.50 wager paid $1,038.06.',
  },
  {
    image: 'assets/wins/5-leg-sgp-winner.jpg',
    alt: 'Winning five-leg same-game parlay',
    title: '5-leg SGP',
    tag: 'Discord pick · winner +845',
    summary: 'Five-leg same-game parlay graded as a win.',
  },
];

const recapList = document.querySelector('[data-recap-list]');

function renderRecaps() {
  const recentRecaps = [...dailyRecaps];

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
    <article class="recap-card" data-title="${recap.title}" data-tag="${recap.tag}" data-description="${recap.summary}">
      <div class="recap-date">DISCORD PICK</div>
      <img src="${recap.image}" alt="${recap.alt || 'Daily winning recap'}" />
      <p>${recap.summary}</p>
    </article>`).join('');
}

renderRecaps();
