/* Inline SVG icons (24x24, decorative). Stroke icons use currentColor; FILLED ones are solid. */
const ICON_PATHS = {
  car: '<path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2zm2.1 0h9.8l-1.1-3.4a.5.5 0 0 0-.5-.3H8.7a.5.5 0 0 0-.5.3zM7 15.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm10 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z"/>',
  walk: '<path d="M13.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.3 7.3 0 0 0 19 13v-2a5 5 0 0 1-4.3-2.4l-1-1.6a2 2 0 0 0-2.5-.8L6 8.3V13h2V9.6z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sunset: '<path d="M12 9V3M7 8l-1.5-1.5M17 8l1.5-1.5M5 17a7 7 0 0 1 14 0M2 17h20M7 21h10"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h7"/>',
  out: '<path d="M7 17L17 7M8 7h9v9"/>',
  road: '<path d="M8 3L5 21M16 3l3 18M12 4v3M12 10.5v3M12 17v3"/>',
  theme: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
  park: '<circle cx="12" cy="10" r="7"/><path d="M12 3v14M5 10h14M8 21l4-4 4 4"/>',
  culture: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10l10-6 10 6z"/>',
  food: '<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v6M9 3v6M17 21V3c-2 1-4 4-4 8h4"/>',
  view: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  logistics: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
};
const FILLED_ICONS = ['car', 'walk'];

/* Returns trusted markup built only from the constants above. */
function ico(name) {
  const cls = FILLED_ICONS.includes(name) ? 'ico f' : 'ico';
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ''}</svg>`;
}
