/* Day section renderers. Every value is passed through esc(); the *Html helpers return already-escaped markup. */
const TICK_EDGE_PCT = 9;     /* hide hour ticks this close to the bar edges */
const TICK_SUN_GAP_MIN = 50; /* hide hour ticks this close to the sunset label */
const MIN_PCT = n => Number(n.toFixed(2));

function timeHtml(min) {
  const [hm, ap] = fmt(min).split(' ');
  return `${esc(hm)}<small>${esc(ap)}</small>`;
}

function barSegments(day, span, start) {
  const pct = m => MIN_PCT(((m - start) / span) * 100);
  return day.stops.map((st, i) => {
    const a = toMin(st.start), b = toMin(st.end), next = day.stops[i + 1];
    const g = TYPE_META[st.type].group;
    const tip = `${st.name} · ${fmt(a)}–${fmt(b)}`;
    const block = `<div class="seg g-${esc(g)}" style="left:${esc(pct(a))}%;width:${esc(pct(b) - pct(a))}%" title="${esc(tip)}"><b>${esc(i + 1)}</b></div>`;
    if (!next || toMin(next.start) <= b) return block;
    const n = toMin(next.start);
    const gapTip = `Travel + parking · ${fmtDur(n - b)}`;
    return block + `<div class="seg travel" style="left:${esc(pct(b))}%;width:${esc(pct(n) - pct(b))}%" title="${esc(gapTip)}"></div>`;
  }).join('');
}

function barTicks(start, end, span, sun) {
  const pct = m => MIN_PCT(((m - start) / span) * 100);
  const hasSun = sun > start && sun < end;
  const out = [`<span class="edge l">${esc(fmt(start))}</span>`, `<span class="edge r">${esc(fmt(end))}</span>`];
  for (let h = Math.ceil(start / 60); h * 60 <= end; h++) {
    const p = pct(h * 60);
    if (h % 2 || p < TICK_EDGE_PCT || p > 100 - TICK_EDGE_PCT) continue;
    if (hasSun && Math.abs(h * 60 - sun) < TICK_SUN_GAP_MIN) continue;
    out.push(`<span style="left:${esc(p)}%">${esc(fmt(h * 60).replace(':00', ''))}</span>`);
  }
  if (hasSun) out.push(`<span class="sun" style="left:${esc(pct(sun))}%">${ico('sunset')}${esc(fmt(sun))}</span>`);
  return out.join('');
}

function renderBar(day) {
  const start = toMin(day.stops[0].start), end = toMin(day.stops[day.stops.length - 1].end);
  const span = end - start, sun = toMin(day.sunset);
  const sunLine = sun > start && sun < end ? `<div class="sunline" style="left:${esc(MIN_PCT(((sun - start) / span) * 100))}%"></div>` : '';
  return `<div class="bar" aria-hidden="true">
    <div class="track">${barSegments(day, span, start)}${sunLine}</div>
    <div class="ticks">${barTicks(start, end, span, sun)}</div>
  </div>`;
}

function badgeHtml(b, day) {
  const text = b.text || (b.kind === 'sunset' ? `Sunset ${fmt(toMin(day.sunset))}` : b.kind);
  return `<span class="badge ${esc(b.kind)}">${esc(text)}</span>`;
}

function renderStop(st, n, day) {
  const meta = TYPE_META[st.type];
  const badges = (st.badges || []).map(b => badgeHtml(b, day)).join('');
  const tips = st.tips ? `<ul class="tips">${st.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
  const href = st.link ? safeUrl(st.link) : mapsUrl(st.q);
  return `<li class="stop g-${esc(meta.group)}">
    <div class="time"><b>${timeHtml(toMin(st.start))}</b><span>to ${esc(fmt(toMin(st.end)))}</span></div>
    <article class="card">
      <div class="card-top"><span class="num" aria-hidden="true">${esc(n)}</span><h3>${esc(st.name)}</h3></div>
      <p class="meta">${ico(meta.icon)}<span>${esc(meta.label)}</span>${badges}</p>
      ${st.desc ? `<p class="desc">${esc(st.desc)}</p>` : ''}${tips}
      <a class="maps" href="${esc(href)}" target="_blank" rel="noopener">Open in Maps ${ico('out')}</a>
    </article>
  </li>`;
}

function renderLeg(l) {
  return `<li class="leg"><span class="leg-rail" aria-hidden="true"></span><div class="leg-body">
    <span class="leg-time">${ico(l.mode === 'drive' ? 'car' : 'walk')}<b>${esc(fmtRange(l.min[0], l.min[1]))}</b><span>${esc(l.mi)} mi</span></span>
    <span class="leg-note">${esc(l.note)}</span></div></li>`;
}

function renderBoxes(day) {
  const boxes = (day.boxes || []).map(b => `<div class="box ${esc(b.kind)}"><h3>${esc(b.title)}</h3><ul>${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`);
  return boxes.length ? `<div class="day-side">${boxes.join('')}</div>` : '';
}

function renderChips(day) {
  const d = driveTotals(day);
  const first = fmt(toMin(day.stops[0].start)), last = fmt(toMin(day.stops[day.stops.length - 1].end));
  return `<ul class="chips">
    <li>${ico('pin')}<b>${esc(day.city)}</b></li>
    <li>${ico('car')}<b>${esc(fmtRange(d.lo, d.hi))}</b> · ${esc(Math.round(d.mi))} mi</li>
    <li>${ico('sunset')}Sunset <b>~${esc(fmt(toMin(day.sunset)))}</b></li>
    <li>${ico('clock')}<b>${esc(first)}</b> to <b>${esc(last)}</b></li>
  </ul>`;
}

function renderDay(day, idx) {
  const items = day.stops.map((st, i) => renderStop(st, i + 1, day) + (st.leg ? renderLeg(st.leg) : '')).join('');
  return `<section class="day sec" id="${esc(day.id)}" data-region="${esc(day.region)}" data-iso="${esc(day.iso)}">
    <header class="day-head">
      <span class="day-num" aria-hidden="true">${esc(day.iso.slice(8))}</span>
      <p class="day-kick"><span class="rg-dot" aria-hidden="true"></span>${esc(day.label || `Day ${idx}`)} · ${esc(day.date)}<span class="today-flag">Today</span></p>
      <h2>${esc(day.title)}</h2>
      <p class="lede">${esc(day.summary)}</p>
      ${renderChips(day)}
      <a class="btn" href="${esc(routeUrl(day))}" target="_blank" rel="noopener">${ico('route')}Open full day route</a>
    </header>
    ${renderBar(day)}
    <div class="day-body"><ol class="tl">${items}</ol>${renderBoxes(day)}</div>
  </section>`;
}
