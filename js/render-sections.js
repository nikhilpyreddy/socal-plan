/* Non-day sections: stats, stays, changes, return, tips, checklist. Return HTML strings; app.js mounts them. */
const CHECKLIST_KEY = 'socal-checklist-v2';

function allTotals() {
  return DAYS.map(driveTotals).reduce((a, t) => ({ lo: a.lo + t.lo, hi: a.hi + t.hi, mi: a.mi + t.mi }), { lo: 0, hi: 0, mi: 0 });
}

function renderStats() {
  const all = allTotals();
  const places = DAYS.reduce((n, d) => n + d.stops.filter(s => s.type !== 'logistics').length, 0);
  const sunsets = DAYS.filter(d => d.stops.some(s => (s.badges || []).some(b => b.kind === 'sunset'))).length;
  return [
    [places, 'places to see'],
    [`${Math.round(all.lo / 60)}–${Math.round(all.hi / 60)} h`, 'total driving'],
    [`${Math.round(all.mi)} mi`, 'on the road'],
    [`${sunsets} sunsets`, 'planned around']
  ].map(([b, s]) => `<div class="stat"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join('');
}

function renderStay(s) {
  return `<article class="stay" data-region="${esc(s.region)}">
    <p class="stay-kick"><span class="rg-dot" aria-hidden="true"></span>${esc(s.city)} · ${esc(s.area)}</p>
    <h3>${esc(s.area)}</h3>
    <p class="stay-dates">${ico('clock')}${esc(s.dates)}</p>
    <p class="stay-addr">${ico('pin')}${esc(s.address)}</p>
    <p class="stay-note">${esc(s.note)}</p>
    <p class="stay-links">
      <a class="btn sm" href="${esc(safeUrl(s.bookingUrl))}" target="_blank" rel="noopener">${esc(s.bookingLabel)} ${ico('out')}</a>
      <a class="btn sm ghost" href="${esc(safeUrl(s.mapUrl))}" target="_blank" rel="noopener">Map ${ico('out')}</a>
    </p>
  </article>`;
}

const renderStays = () => STAYS.map(renderStay).join('');

function renderLegend() {
  return `<ul class="legend" aria-label="Time bar colours">
    <li><i class="g-explore"></i>Explore</li><li><i class="g-food"></i>Food / evening</li>
    <li><i class="g-view"></i>Views &amp; sunset</li><li><i class="g-logi"></i>Logistics</li>
    <li><i class="travel"></i>Travel + parking</li></ul>`;
}

const renderNote = n => `<article class="note"><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p></article>`;
const renderNotes = list => list.map(renderNote).join('');

function renderReturn() {
  const r = RETURN_TRIP;
  return `<header class="day-head">
      <p class="day-kick"><span class="rg-dot" aria-hidden="true"></span>Return · ${esc(r.dateLabel)}</p>
      <h2>${esc(r.title)}</h2>
      <p class="lede">${esc(r.summary)}</p>
      <ul class="chips">
        <li>${ico('car')}<b>${esc(r.driveLabel)}</b> · ${esc(r.miles)} mi</li>
        <li>${ico('road')}<b>${esc(r.route)}</b></li>
      </ul>
      <a class="btn" href="${esc(safeUrl(r.routeUrl))}" target="_blank" rel="noopener">${ico('route')}Open route to LAX</a>
    </header>
    <div class="grid2 notes">${renderNotes(r.options)}</div>`;
}

function renderChecklist(saved) {
  return CHECKLIST.map(c => `<li><label class="ck"><input type="checkbox" data-id="${esc(c.id)}"${saved[c.id] ? ' checked' : ''}><span>${esc(c.text)}</span></label></li>`).join('');
}

function readChecklist() {
  try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}') || {}; } catch (e) { return {}; }
}

function writeChecklist(state) {
  try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable: ticks just won't persist */ }
}

function bindChecklist(listEl, progressEl) {
  let saved = readChecklist();
  const update = () => {
    const done = CHECKLIST.filter(c => saved[c.id]).length;
    progressEl.textContent = `${done} of ${CHECKLIST.length} done`;
  };
  listEl.innerHTML = renderChecklist(saved);
  update();
  listEl.addEventListener('change', e => {
    const id = e.target.dataset.id;
    if (!id) return;
    saved = { ...saved, [id]: e.target.checked };
    writeChecklist(saved);
    update();
  });
}
