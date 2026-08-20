const buttons = [...document.querySelectorAll('[data-view]')];
const panels = [...document.querySelectorAll('.panel')];
const stage = document.querySelector('.work-stage');
const track = document.querySelector('.gallery-track');
const winsScrollStage = document.querySelector('.wins-scroll-stage');
const winsScrollTrack = document.querySelector('.wins-scroll-track');
const kobesWinsPanel = document.querySelector('#kobes-wins');
const autoScrollToggle = document.querySelector('.auto-scroll-toggle');
const overlay = document.querySelector('.detail-overlay');
const detailImage = document.querySelector('.detail-image');
const detailTitle = document.querySelector('.detail-copy h2');
const detailTag = document.querySelector('.detail-tag');
const detailDescription = document.querySelector('.detail-description');
const manualWinsScrollSpeed = 3;

document.querySelectorAll('.gallery-row').forEach((row) => {
  const originals = [...row.children];
  for (let copy = 0; copy < 2; copy += 1) {
    originals.forEach((tile) => row.append(tile.cloneNode(true)));
  }
});

const originalWinsTiles = [...winsScrollTrack.children];
originalWinsTiles.forEach((tile) => {
  const repeatedTile = tile.cloneNode(true);
  repeatedTile.setAttribute('aria-hidden', 'true');
  winsScrollTrack.append(repeatedTile);
});

let offset = 0;
let pointerStart = 0;
let offsetStart = 0;
let dragging = false;
let moved = false;
let autoScrollEnabled = true;
let lastAutoScrollFrame = 0;

function positionTrack() {
  document.querySelectorAll('.gallery-row').forEach((row) => {
    const firstRepeatedTile = row.children[Math.floor(row.children.length / 3)];
    const loopWidth = firstRepeatedTile ? firstRepeatedTile.offsetLeft : 0;
    const loopedOffset = loopWidth ? ((offset % loopWidth) + loopWidth) % loopWidth : 0;
    row.style.transform = `translate3d(${-loopedOffset}px, 0, 0)`;
  });
}

function winsLoopWidth() {
  const tiles = winsScrollTrack.children;
  const firstRepeatedTile = tiles[Math.floor(tiles.length / 2)];
  return firstRepeatedTile ? firstRepeatedTile.offsetLeft : 0;
}

function normalizeWinsScroll() {
  const loopWidth = winsLoopWidth();
  if (loopWidth && winsScrollStage.scrollLeft >= loopWidth) {
    winsScrollStage.scrollLeft -= loopWidth;
  }
}

function showView(target, { updateHistory = true } = {}) {
  const button = document.querySelector(`[data-view="${target}"]`);
  if (!button) return;
  buttons.forEach((item) => item.classList.toggle('is-active', item === button));
  panels.forEach((panel) => panel.classList.toggle('is-active', panel.id === target));
  if (updateHistory) window.history.replaceState(null, '', `#${target}`);
  if (target === 'work') requestAnimationFrame(positionTrack);
}

function openDetail(tile) {
  detailImage.src = tile.querySelector('img').src;
  detailImage.alt = tile.querySelector('img').alt;
  detailTitle.textContent = tile.dataset.title;
  detailTag.textContent = tile.dataset.tag;
  detailDescription.textContent = tile.dataset.description;
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
}

function closeDetail() {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
}

buttons.forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));

stage.addEventListener('wheel', (event) => {
  event.preventDefault();
  offset += event.deltaY + event.deltaX;
  positionTrack();
}, { passive: false });

winsScrollStage.addEventListener('wheel', (event) => {
  event.preventDefault();
  winsScrollStage.scrollLeft += (event.deltaY + event.deltaX) * manualWinsScrollSpeed;
  normalizeWinsScroll();
}, { passive: false });

function autoScrollWins(timestamp) {
  if (autoScrollEnabled && kobesWinsPanel.classList.contains('is-active')) {
    if (lastAutoScrollFrame) {
      winsScrollStage.scrollLeft += ((timestamp - lastAutoScrollFrame) / 1000) * 56;
      normalizeWinsScroll();
    }
    lastAutoScrollFrame = timestamp;
  } else {
    lastAutoScrollFrame = 0;
  }
  window.requestAnimationFrame(autoScrollWins);
}

autoScrollToggle.addEventListener('click', () => {
  autoScrollEnabled = !autoScrollEnabled;
  autoScrollToggle.setAttribute('aria-pressed', String(autoScrollEnabled));
  autoScrollToggle.textContent = `auto scroll: ${autoScrollEnabled ? 'on' : 'off'}`;
  lastAutoScrollFrame = 0;
});

stage.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  pointerStart = event.clientX;
  offsetStart = offset;
  moved = false;
  dragging = true;
  stage.classList.add('is-dragging');
  stage.setPointerCapture(event.pointerId);
});

stage.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  const distance = event.clientX - pointerStart;
  if (Math.abs(distance) > 5) moved = true;
  offset = offsetStart - distance;
  positionTrack();
});

function finishDrag(event) {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('is-dragging');
  if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
}

stage.addEventListener('pointerup', finishDrag);
stage.addEventListener('pointercancel', finishDrag);

document.querySelectorAll('.tile, .wins-scroll-tile, .recap-card').forEach((tile) => {
  tile.tabIndex = tile.getAttribute('aria-hidden') === 'true' ? -1 : 0;
  tile.setAttribute('role', 'button');
  tile.setAttribute('aria-label', `Enlarge ${tile.dataset.title}`);
  tile.addEventListener('click', () => {
    if (!tile.closest('.work-stage') || !moved) openDetail(tile);
  });
  tile.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetail(tile);
    }
  });
});

overlay.querySelector('.detail-close').addEventListener('click', closeDetail);
detailImage.addEventListener('click', closeDetail);
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) closeDetail();
});

document.querySelector('.monogram')?.addEventListener('click', (event) => {
  event.preventDefault();
  showView('work');
});

window.addEventListener('resize', () => {
  positionTrack();
  normalizeWinsScroll();
});
window.addEventListener('hashchange', () => showView(window.location.hash.slice(1), { updateHistory: false }));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDetail();
});

const initial = window.location.hash.slice(1);
showView(initial && document.getElementById(initial) ? initial : 'work', { updateHistory: false });
positionTrack();
window.requestAnimationFrame(autoScrollWins);
