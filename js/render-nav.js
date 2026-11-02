/* Navigation: mobile top bar and desktop sidebar. Both share the data-id hooks used by the scrollspy. */
function navLinks() {
  return [
    { id: 'stays', label: 'Stays' }, { id: 'changes', label: 'Changes' },
    ...DAYS.map(d => ({ id: d.id, label: d.short, day: d })),
    { id: 'return', label: 'Return' }, { id: 'tips', label: 'Tips' }, { id: 'checklist', label: 'Checklist' }
  ];
}

const themeButton = cls => `<button class="theme-btn ${esc(cls)}" type="button" aria-label="Toggle dark mode">${ico('theme')}<span>Theme</span></button>`;

function renderTopbar() {
  const links = navLinks().map(l => `<a href="#${esc(l.id)}" data-id="${esc(l.id)}">${esc(l.label)}</a>`).join('');
  return `<nav class="tb-nav" aria-label="Trip sections"><div class="tb-scroll" id="tb-scroll">
      <a class="today-chip" id="today-chip" href="#" hidden>${ico('sunset')}Today</a>${links}</div></nav>${themeButton('js-theme')}`;
}

function sidebarDay(d) {
  const t = driveTotals(d);
  const [dow, num] = d.short.split(' ');
  return `<a class="sb-day" href="#${esc(d.id)}" data-id="${esc(d.id)}" data-region="${esc(d.region)}">
    <span class="sb-date"><b>${esc(num)}</b><small>${esc(dow)}</small></span>
    <span class="sb-txt"><span class="sb-name">${esc(d.title)}</span>
      <small>${esc(d.stops.length)} stops · ${esc(fmtRange(t.lo, t.hi))} · ${esc(Math.round(t.mi))} mi</small></span></a>`;
}

function renderSidebar() {
  const plain = id => { const l = navLinks().find(x => x.id === id); return `<a class="sb-link" href="#${esc(id)}" data-id="${esc(id)}">${esc(l.label)}</a>`; };
  return `<div class="sb-brand"><p class="eyebrow">${esc(TRIP.eyebrow)}</p><p class="sb-title">${esc(TRIP.title)}</p></div>
    <nav class="sb-nav" aria-label="Trip sections">
      ${plain('stays')}${plain('changes')}
      <p class="sb-label">Itinerary</p>
      ${DAYS.map(sidebarDay).join('')}
      <p class="sb-label">Plan</p>
      ${plain('return')}${plain('tips')}${plain('checklist')}
    </nav>
    <div class="sb-foot">${themeButton('js-theme')}<span class="ver">v${esc(TRIP.version)}</span></div>`;
}
