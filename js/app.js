/* Boot: render everything, then wire theme, scrollspy, Today chip and print. */
(function () {
  const THEME_KEY = 'socal-theme';
  const TICK_PAD_PX = 8;
  const SPY_MARGIN = '-30% 0px -65% 0px';
  const $ = id => document.getElementById(id);
  const mount = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };

  function showBanner(errors) {
    errors.forEach(e => console.error('[trip data]', e));
    const el = document.createElement('div');
    el.className = 'banner';
    el.setAttribute('role', 'alert');
    el.innerHTML = `<b>Itinerary data problem (fix before pushing):</b><ul>${errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul>`;
    document.body.prepend(el);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, root.dataset.theme); } catch (e) { /* theme just won't persist */ }
  }

  function currentIso() {
    const forced = new URLSearchParams(location.search).get('today');
    return /^\d{4}-\d{2}-\d{2}$/.test(forced || '') ? forced : localIso(new Date());
  }

  function setupToday() {
    const day = DAYS.find(d => d.iso === currentIso());
    const chip = $('today-chip');
    if (!day || !chip) return;
    chip.hidden = false;
    chip.href = `#${day.id}`;
    document.querySelector(`#${day.id}`).dataset.today = 'true';
  }

  function markCurrent(id) {
    document.querySelectorAll('[data-id]').forEach(a => {
      if (a.dataset.id === id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    const scroller = $('tb-scroll'), active = scroller && scroller.querySelector(`[data-id="${id}"]`);
    if (active) scroller.scrollTo({ left: active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2 });
  }

  function setupScrollspy() {
    const obs = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) markCurrent(en.target.id); }), { rootMargin: SPY_MARGIN });
    navLinks().forEach(l => { const s = $(l.id); if (s) obs.observe(s); });
  }

  /* Hide hour ticks that would overlap (measured in pixels). Priority: sunset, edges, then hours. */
  function thinTicks() {
    document.querySelectorAll('.bar .ticks').forEach(row => {
      const spans = [...row.children];
      spans.forEach(s => s.classList.remove('off'));
      const rank = s => (s.classList.contains('sun') ? 0 : s.classList.contains('edge') ? 1 : 2);
      const kept = [];
      spans.sort((a, b) => rank(a) - rank(b)).forEach(s => {
        const r = s.getBoundingClientRect();
        const clash = kept.some(k => r.left < k.right + TICK_PAD_PX && r.right > k.left - TICK_PAD_PX);
        if (clash) s.classList.add('off'); else kept.push(r);
      });
    });
  }

  function setupTicks() {
    let timer = 0;
    thinTicks();
    addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(thinTicks, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(thinTicks);
  }

  function setupPrint() {
    let opened = [];
    addEventListener('beforeprint', () => {
      opened = [...document.querySelectorAll('details:not([open])')];
      opened.forEach(d => { d.open = true; });
    });
    addEventListener('afterprint', () => { opened.forEach(d => { d.open = false; }); opened = []; });
  }

  function boot() {
    const errors = validateTrip();
    if (errors.length) showBanner(errors);
    mount('topbar', renderTopbar());
    mount('sidebar', renderSidebar());
    mount('stats', renderStats());
    mount('stays-list', renderStays());
    mount('legend', renderLegend());
    mount('chg', renderNotes(CHANGES));
    const count = $('chg-count');
    if (count) count.textContent = `Show all ${CHANGES.length} changes`;
    mount('days', DAYS.map(renderDay).join(''));
    mount('return', renderReturn());
    mount('tipgrid', renderNotes(TIPS));
    bindChecklist($('check'), $('ck-progress'));
    mount('ver', `v${esc(TRIP.version)}`);
    document.querySelectorAll('.js-theme').forEach(b => b.addEventListener('click', toggleTheme));
    setupToday();
    setupScrollspy();
    setupTicks();
    setupPrint();
  }

  boot();
})();
