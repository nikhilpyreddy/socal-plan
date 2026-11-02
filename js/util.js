/* Shared helpers. Loaded first so the data files can call deepFreeze. */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = u => (/^https:\/\//.test(u) ? u : '#');
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fmt = m => {
  const h = Math.floor(m / 60) % 24, mm = m % 60, h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
const fmtDur = m => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m} min`);
const fmtRange = (lo, hi) => (lo === hi ? fmtDur(lo) : `${fmtDur(lo)}–${fmtDur(hi)}`);
const mapsUrl = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const MAX_WAYPOINTS = 9;

function deepFreeze(obj) {
  Object.values(obj).forEach(v => { if (v && typeof v === 'object') deepFreeze(v); });
  return Object.freeze(obj);
}

function routeUrl(day) {
  const qs = day.stops.map(s => s.q);
  const mid = qs.slice(1, -1).slice(0, MAX_WAYPOINTS);
  const p = new URLSearchParams({ api: '1', origin: qs[0], destination: qs[qs.length - 1], travelmode: 'driving' });
  if (mid.length) p.set('waypoints', mid.join('|'));
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

function driveTotals(day) {
  return day.stops
    .map(s => s.leg)
    .filter(l => l && l.mode === 'drive')
    .reduce((a, l) => ({ lo: a.lo + l.min[0], hi: a.hi + l.min[1], mi: a.mi + l.mi }), { lo: 0, hi: 0, mi: 0 });
}

/* Local calendar date as YYYY-MM-DD (never toISOString, which is UTC). */
function localIso(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
function checkDay(day, errors) {
  const bad = msg => errors.push(`${day.id}: ${msg}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day.iso)) bad('bad iso date');
  if (!['la', 'sd', 'transit'].includes(day.region)) bad(`unknown region ${day.region}`);
  if (!HHMM.test(day.sunset)) bad('bad sunset time');
  day.stops.forEach((s, i) => {
    const last = i === day.stops.length - 1;
    if (!HHMM.test(s.start) || !HHMM.test(s.end)) return bad(`stop ${i + 1} has a bad time`);
    if (toMin(s.start) >= toMin(s.end)) bad(`stop ${i + 1} (${s.name}) must end after it starts`);
    if (!TYPE_META[s.type]) bad(`stop ${i + 1} has unknown type ${s.type}`);
    if (!last && !s.leg) bad(`stop ${i + 1} (${s.name}) is missing its leg`);
    if (last && s.leg) bad(`last stop (${s.name}) must not have a leg`);
    if (!last && toMin(day.stops[i + 1].start) < toMin(s.start)) bad(`stop ${i + 2} starts before stop ${i + 1}`);
  });
  (day.boxes || []).forEach(b => { if (!['info', 'warn'].includes(b.kind)) bad(`unknown box kind ${b.kind}`); });
}

function validateTrip() {
  const errors = [];
  DAYS.forEach(d => checkDay(d, errors));
  const ids = [...DAYS.map(d => d.id), ...STAYS.map(s => s.id), RETURN_TRIP.id, ...CHECKLIST.map(c => c.id)];
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach(id => errors.push(`duplicate id ${id}`));
  return errors;
}
