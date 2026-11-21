(function(){
'use strict';
/* Matematikk: grafikk til vinkler, volum, vekstmønster og enkel programkode (4. trinn) */
const MT = window.MT, G = MT.G, INK = '#1f2937';

/* ---------- vinkel: deg = 0–180 (eller mer). o.rot = hvor den første armen peker (grader, 0 = mot høyre), o.label = tekst ved buen, o.mark = vis rett-vinkel-firkant ---------- */
G.angle = (deg, o) => {
  o = o || {}; const W = o.w || 170, H = o.h || 110, ox = o.ox != null ? o.ox : 70, oy = o.oy != null ? o.oy : H - 16, L = o.len || 70, c = o.c || '#2563eb', rot = o.rot || 0;
  const pt = (a, l) => [ox + l * Math.cos(-a * Math.PI / 180), oy + l * Math.sin(-a * Math.PI / 180)].map(v => Math.round(v * 10) / 10);
  const p1 = pt(rot, L), p2 = pt(rot + deg, L); let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="vinkel">`;
  if(deg === 90 || o.mark){ const a = pt(rot, 20), b = pt(rot + 90, 20), m = pt(rot + 45, 28.3); t += `<polygon points="${ox},${oy} ${a} ${m} ${b}" fill="${c}" fill-opacity=".22" stroke="${c}" stroke-width="2.5"/>`; }
  else { const a = pt(rot, 26), b = pt(rot + deg, 26); t += `<path d="M${ox},${oy} L${a} A26,26 0 ${deg > 180 ? 1 : 0} 0 ${b} Z" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2.5"/>`; }
  t += `<line x1="${ox}" y1="${oy}" x2="${p1[0]}" y2="${p1[1]}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><line x1="${ox}" y1="${oy}" x2="${p2[0]}" y2="${p2[1]}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="${ox}" cy="${oy}" r="5" fill="#dc2626"/>`;
  if(o.label){ const m = pt(rot + deg / 2, 46); t += `<text x="${m[0]}" y="${m[1] + 5}" text-anchor="middle" font-size="15" font-weight="900" fill="${c}">${o.label}</text>`; }
  return `<span class="mtg">${t}</svg></span>`;
};

/* ---------- blokk av enhetsterninger: l (bredde) × b (dybde) × h (høyde). o.bottom = fargelegg nederste lag ---------- */
G.cubes = (l, b, h, o) => {
  o = o || {}; const c = o.s || 24, dx = c * .5, dy = c * .5, W = Math.round(l * c + b * dx + 10), H = Math.round(h * c + b * dy + 10), yt = H - 5 - h * c, x0 = 4, ST = '#1e3a8a';
  const poly = (pts, f) => `<polygon points="${pts.map(p => p.map(v => Math.round(v * 10) / 10).join(',')).join(' ')}" fill="${f}" stroke="${ST}" stroke-width="1.5" stroke-linejoin="round"/>`;
  let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="blokk ${l} ganger ${b} ganger ${h}">`;
  for(let j = 0; j < h; j++) for(let i = 0; i < l; i++) t += poly([[x0 + i * c, yt + j * c], [x0 + (i + 1) * c, yt + j * c], [x0 + (i + 1) * c, yt + (j + 1) * c], [x0 + i * c, yt + (j + 1) * c]], o.bottom && j === h - 1 ? '#fdba74' : '#60a5fa');
  for(let k = 0; k < b; k++) for(let i = 0; i < l; i++){ const X = x0 + i * c + k * dx, Y = yt - k * dy; t += poly([[X, Y], [X + c, Y], [X + c + dx, Y - dy], [X + dx, Y - dy]], '#bfdbfe'); }
  for(let k = 0; k < b; k++) for(let j = 0; j < h; j++){ const X = x0 + l * c + k * dx, Y = yt + j * c - k * dy; t += poly([[X, Y], [X + dx, Y - dy], [X + dx, Y - dy + c], [X, Y + c]], o.bottom && j === h - 1 ? '#fb923c' : '#3b82f6'); }
  return `<span class="mtg">${t}</svg></span>`;
};

/* ---------- målebeger / kanne: v av max (liter eller dl), o.unit, o.every = merkestrek med tall ---------- */
G.jug = (v, max, o) => {
  o = o || {}; const W = 120, H = 190, x0 = 34, x1 = 90, top = 16, bot = H - 14, unit = o.unit || 'dl', ev = o.every || (max > 10 ? 5 : max > 5 ? 2 : 1), sy = n => bot - (bot - top) * n / max;
  let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="målebeger"><rect x="${x0}" y="${sy(v)}" width="${x1 - x0}" height="${bot - sy(v)}" fill="#7dd3fc" fill-opacity=".85"/><path d="M${x0} ${top} V${bot} H${x1} V${top}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  for(let n = 0; n <= max; n++){ const big = n % ev === 0, y = sy(n); t += `<line x1="${x0}" y1="${y}" x2="${x0 + (big ? 16 : 9)}" y2="${y}" stroke="${INK}" stroke-width="${big ? 2.5 : 1.5}"/>` + (big && n > 0 ? `<text x="${x0 - 5}" y="${y + 5}" text-anchor="end" font-size="13" font-weight="800" fill="${INK}">${n}</text>` : ''); }
  t += `<text x="${x1 + 6}" y="${top + 6}" font-size="13" font-weight="900" fill="#0369a1">${unit}</text>`;
  return `<span class="mtg">${t}</svg></span>`;
};

/* ---------- vekstmønster: fyrstikk-firkanter (n firkanter på rad = 3n + 1 pinner) ---------- */
G.sticks = (n, o) => {
  o = o || {}; const s = o.s || 28, W = n * s + 14, H = s + 14, c = o.c || '#ea580c'; let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${n} firkanter av pinner">`;
  const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  for(let i = 0; i <= n; i++) t += ln(7 + i * s, 7, 7 + i * s, 7 + s);
  for(let i = 0; i < n; i++) t += ln(7 + i * s, 7, 7 + (i + 1) * s, 7) + ln(7 + i * s, 7 + s, 7 + (i + 1) * s, 7 + s);
  return `<span class="mtg">${t}</svg></span>`;
};
/* ---------- vekstmønster: trapp av prikker (1 + 2 + … + n) ---------- */
G.stairs = (n, o) => {
  o = o || {}; const s = o.s || 22, W = n * s + 8, H = n * s + 8, c = o.c || '#2563eb'; let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="trapp med ${n} trinn">`;
  for(let i = 0; i < n; i++) for(let j = 0; j <= i; j++) t += `<circle cx="${4 + j * s + s / 2}" cy="${4 + i * s + s / 2}" r="${s * .38}" fill="${c}"/>`;
  return `<span class="mtg">${t}</svg></span>`;
};
/* ---------- vekstmønster: tårn av klosser (rad nr. k har k klosser, eller n klosser høyt) ---------- */
G.tower = (n, o) => {
  o = o || {}; const s = o.s || 22, w = o.w || 2, W = w * s + 8, H = n * s + 8, c = o.c || '#16a34a'; let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="tårn med ${n} lag">`;
  for(let i = 0; i < n; i++) for(let j = 0; j < w; j++) t += `<rect x="${4 + j * s}" y="${H - 4 - (i + 1) * s}" width="${s}" height="${s}" fill="${c}" fill-opacity=".8" stroke="#14532d" stroke-width="2"/>`;
  return `<span class="mtg">${t}</svg></span>`;
};

/* ---------- programkode: lines = ['sett x til 3', 'gjenta 4 ganger:', '  legg til 2 i x']; innrykk = to mellomrom ---------- */
G.code = (lines, o) => {
  o = o || {};
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<span class="mtg"><span class="mtcode">${lines.map((l, i) => { const ind = Math.floor((l.length - l.trimStart().length) / 2); const body = esc(l.trim()).replace(/^(gjenta|hvis|ellers|sett|skriv|legg til|ta bort|frem|snu|spør)/, '<b>$1</b>');
    return `<span class="ln${o.hl === i ? ' hl' : ''}" style="padding-left:${ind * 1.4}em"><i>${i + 1}</i>${body}</span>`; }).join('')}</span></span>`;
};
})();
