(function(){
'use strict';
/* Matematikk: mer grafikk – mønster, 2D/3D-figurer, linjal, vekt, klokke, kalender og robotrute */
const MT = window.MT, G = MT.G, INK = '#1f2937';
let uid = 0;

/* ---------- rekke av ting (mønster): tekst/emoji, {sh:'c'|'q'|'t', c} eller '?' ---------- */
G.seq = (list, o) => {
  o = o || {};
  return `<span class="mtseq">${list.map(it => it === '?' ? '<span class="sq q">?</span>' : (it && typeof it === 'object') ? `<span class="sq">${G.shapes([{s:it.sh, c:it.c, big:1}], {s:o.s || 36})}</span>` : `<span class="sq">${it}</span>`).join('')}</span>`;
};

/* ---------- plane figurer ---------- */
const reg = (n, cx, cy, R, rot) => Array.from({length:n}, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
G.polyPts = kind => ({
  triangle:[[55, 12], [100, 88], [10, 88]], square:[[22, 18], [88, 18], [88, 84], [22, 84]], rectangle:[[8, 28], [102, 28], [102, 76], [8, 76]],
  rhombus:[[55, 10], [100, 52], [55, 94], [10, 52]], pentagon:reg(5, 55, 54, 44, -90), hexagon:reg(6, 55, 52, 44, 0), octagon:reg(8, 55, 52, 44, 22.5)
})[kind];
// o.c farge, o.corners = prikker i hjørnene, o.s = størrelse (px bredde)
G.poly = (kind, o) => {
  o = o || {}; const c = o.c || '#60a5fa', w = o.s || 110; let body;
  if(kind === 'circle') body = `<circle cx="55" cy="52" r="42" fill="${c}" fill-opacity=".35" stroke="${c}" stroke-width="4"/>`;
  else if(kind === 'oval') body = `<ellipse cx="55" cy="52" rx="48" ry="30" fill="${c}" fill-opacity=".35" stroke="${c}" stroke-width="4"/>`;
  else { const p = G.polyPts(kind); body = `<polygon points="${p.map(x => x.map(v => Math.round(v * 10) / 10).join(',')).join(' ')}" fill="${c}" fill-opacity=".35" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>` + (o.corners ? p.map(x => `<circle cx="${x[0]}" cy="${x[1]}" r="6" fill="#dc2626" stroke="#fff" stroke-width="2"/>`).join('') : ''); }
  return `<span class="mtg"><svg width="${w}" height="${Math.round(w * 104 / 110)}" viewBox="0 0 110 104" role="img" aria-label="${kind}">${body}</svg></span>`;
};

/* ---------- romfigurer (enkel tegning) ---------- */
G.solid = (kind, o) => {
  o = o || {}; const w = o.s || 110, id = 'g' + (++uid), S = '#334155';
  const shade = (a, b, c) => ({top:a, front:b, side:c});
  let body = '';
  if(kind === 'cube' || kind === 'box'){
    const wd = kind === 'cube' ? 52 : 78, ht = kind === 'cube' ? 52 : 40, d = 22, x0 = 14, y0 = 100 - ht, cl = shade('#bfdbfe', '#60a5fa', '#3b82f6');
    body = `<polygon points="${x0},${y0} ${x0 + wd},${y0} ${x0 + wd},${y0 + ht} ${x0},${y0 + ht}" fill="${cl.front}" stroke="${S}" stroke-width="2.5"/><polygon points="${x0},${y0} ${x0 + d},${y0 - d} ${x0 + wd + d},${y0 - d} ${x0 + wd},${y0}" fill="${cl.top}" stroke="${S}" stroke-width="2.5"/><polygon points="${x0 + wd},${y0} ${x0 + wd + d},${y0 - d} ${x0 + wd + d},${y0 + ht - d} ${x0 + wd},${y0 + ht}" fill="${cl.side}" stroke="${S}" stroke-width="2.5"/>`;
  } else if(kind === 'sphere'){
    body = `<defs><radialGradient id="${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fef3c7"/><stop offset="1" stop-color="#f59e0b"/></radialGradient></defs><circle cx="55" cy="54" r="42" fill="url(#${id})" stroke="${S}" stroke-width="2.5"/>`;
  } else if(kind === 'cylinder'){
    body = `<path d="M18 30 v50 a37 14 0 0 0 74 0 v-50" fill="#86efac" stroke="${S}" stroke-width="2.5"/><ellipse cx="55" cy="30" rx="37" ry="14" fill="#bbf7d0" stroke="${S}" stroke-width="2.5"/>`;
  } else if(kind === 'cone'){
    body = `<path d="M55 8 L16 82 a39 14 0 0 0 78 0 Z" fill="#fca5a5" stroke="${S}" stroke-width="2.5"/><path d="M16 82 a39 14 0 0 1 78 0" fill="none" stroke="${S}" stroke-width="2" stroke-dasharray="4 3"/>`;
  } else if(kind === 'pyramid'){
    body = `<polygon points="55,8 14,84 70,96" fill="#fcd34d" stroke="${S}" stroke-width="2.5"/><polygon points="55,8 70,96 98,76" fill="#f59e0b" stroke="${S}" stroke-width="2.5"/>`;
  }
  return `<span class="mtg"><svg width="${w}" height="${Math.round(w * 104 / 110)}" viewBox="0 0 110 104" role="img" aria-label="${kind}">${body}</svg></span>`;
};

/* ---------- linjal (cm). o.obj = {from, to, c, emoji} tegnes over linjalen; o.max = antall cm ---------- */
G.ruler = (max, o) => {
  o = o || {}; const cm = 38, pad = 20, W = pad * 2 + max * cm, H = o.obj ? 104 : 70, ry = o.obj ? 46 : 8;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="linjal">`;
  if(o.obj){ const x1 = pad + o.obj.from * cm, x2 = pad + o.obj.to * cm; s += `<rect x="${x1}" y="12" width="${x2 - x1}" height="26" rx="8" fill="${o.obj.c || '#fb923c'}" stroke="${INK}" stroke-width="2.5"/>` + (o.obj.label ? `<text x="${(x1 + x2) / 2}" y="31" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">${o.obj.label}</text>` : '') + `<line x1="${x1}" y1="38" x2="${x1}" y2="${ry}" stroke="#94a3b8" stroke-dasharray="3 3"/><line x1="${x2}" y1="38" x2="${x2}" y2="${ry}" stroke="#94a3b8" stroke-dasharray="3 3"/>`; }
  s += `<rect x="${pad - 8}" y="${ry}" width="${max * cm + 16}" height="48" rx="6" fill="#fde68a" stroke="${INK}" stroke-width="2.5"/>`;
  for(let i = 0; i <= max; i++){ const x = pad + i * cm; s += `<line x1="${x}" y1="${ry}" x2="${x}" y2="${ry + 20}" stroke="${INK}" stroke-width="2.5"/><text x="${x}" y="${ry + 40}" text-anchor="middle" font-size="16" font-weight="800" fill="${INK}">${i}</text>`;
    if(i < max) s += `<line x1="${x + cm / 2}" y1="${ry}" x2="${x + cm / 2}" y2="${ry + 11}" stroke="${INK}" stroke-width="1.5"/>`; }
  s += `<text x="${W - pad + 6}" y="${ry + 15}" text-anchor="end" font-size="11" font-weight="800" fill="#92400e">cm</text></svg>`;
  return `<span class="mtg">${s}</span>`;
};

/* ---------- viserskive (kjøkkenvekt): verdi v av max, med enhet ---------- */
G.dial = (v, max, o) => {
  o = o || {}; const unit = o.unit || 'kg', c = 70, R = 60, step = o.step || 1, n = Math.round(max / step);
  let s = `<svg width="150" height="150" viewBox="0 0 140 140" role="img" aria-label="vekt"><circle cx="${c}" cy="${c}" r="66" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  for(let i = 0; i < n; i++){ const a = (i / n * 360 - 90) * Math.PI / 180, x1 = c + 58 * Math.cos(a), y1 = c + 58 * Math.sin(a), x2 = c + 50 * Math.cos(a), y2 = c + 50 * Math.sin(a), tx = c + 40 * Math.cos(a), ty = c + 40 * Math.sin(a) + 5;
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="3"/><text x="${tx}" y="${ty}" text-anchor="middle" font-size="${String(i * step).length > 2 ? 10 : 13}" font-weight="800" fill="${INK}">${i * step}</text>`; }
  const a = (v / max * 360 - 90) * Math.PI / 180;
  s += `<line x1="${c}" y1="${c}" x2="${c + 44 * Math.cos(a)}" y2="${c + 44 * Math.sin(a)}" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="5" fill="#dc2626"/><text x="${c}" y="${c + 28}" text-anchor="middle" font-size="12" font-weight="900" fill="#64748b">${unit}</text></svg>`;
  return `<span class="mtg">${s}</span>`;
};

/* ---------- klokke ---------- */
G.clock = (h, m, o) => {
  o = o || {}; const c = 70, sz = o.s || 150;
  let s = `<svg width="${sz}" height="${sz}" viewBox="0 0 140 140" role="img" aria-label="klokke"><circle cx="${c}" cy="${c}" r="66" fill="#fff" stroke="${INK}" stroke-width="4"/>`;
  for(let i = 0; i < 60; i++){ const a = (i * 6 - 90) * Math.PI / 180, big = i % 5 === 0, r1 = 62, r2 = big ? 54 : 58; s += `<line x1="${c + r1 * Math.cos(a)}" y1="${c + r1 * Math.sin(a)}" x2="${c + r2 * Math.cos(a)}" y2="${c + r2 * Math.sin(a)}" stroke="${INK}" stroke-width="${big ? 2.5 : 1}"/>`; }
  for(let i = 1; i <= 12; i++){ const a = (i * 30 - 90) * Math.PI / 180; s += `<text x="${c + 43 * Math.cos(a)}" y="${c + 43 * Math.sin(a) + 6}" text-anchor="middle" font-size="16" font-weight="900" fill="${INK}">${i}</text>`; }
  const ha = ((h % 12) + m / 60) * 30 - 90, ma = m * 6 - 90, P = a => a * Math.PI / 180;
  s += `<line x1="${c}" y1="${c}" x2="${c + 30 * Math.cos(P(ha))}" y2="${c + 30 * Math.sin(P(ha))}" stroke="#2563eb" stroke-width="7" stroke-linecap="round"/><line x1="${c}" y1="${c}" x2="${c + 46 * Math.cos(P(ma))}" y2="${c + 46 * Math.sin(P(ma))}" stroke="#ea580c" stroke-width="4.5" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="5" fill="${INK}"/></svg>`;
  return `<span class="mtg">${s}</span>`;
};
G.digi = (h, m) => `<span class="mtdigi">${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}</span>`;

/* ---------- kalender: o.days, o.start (0 = mandag), o.hl = dager som markeres, o.name ---------- */
G.cal = o => {
  const days = o.days || 30, start = o.start || 0, hl = new Set(o.hl || []), hd = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];
  let t = `<table class="mtcal">${o.name ? `<caption>${o.name}</caption>` : ''}<tr>${hd.map((x, i) => `<th class="${i > 4 ? 'we' : ''}">${x}</th>`).join('')}</tr><tr>`;
  for(let i = 0; i < start; i++) t += '<td></td>';
  for(let d = 1; d <= days; d++){ const col = (start + d - 1) % 7; t += `<td class="${col > 4 ? 'we' : ''}${hl.has(d) ? ' hl' : ''}">${d}</td>`; if(col === 6 && d < days) t += '</tr><tr>'; }
  return `<span class="mtg">${t}</tr></table></span>`;
};

/* ---------- robotrute: o.w, o.h, o.start [x,y], o.goal [x,y], o.walls [[x,y]..], o.path [[x,y]..] (tegnes som linje), o.dir 'N'|'E'|'S'|'W' ---------- */
G.robot = o => {
  const w = o.w || 5, h = o.h || 5, cs = o.cs || 44, W = w * cs + 4, H = h * cs + 4, walls = o.walls || [];
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="rutenett">`;
  for(let y = 0; y < h; y++) for(let x = 0; x < w; x++) s += `<rect x="${2 + x * cs}" y="${2 + y * cs}" width="${cs}" height="${cs}" fill="${walls.some(q => q[0] === x && q[1] === y) ? '#94a3b8' : '#fff'}" stroke="#94a3b8" stroke-width="2"/>`;
  if(o.path && o.path.length > 1) s += `<polyline points="${o.path.map(p => (2 + p[0] * cs + cs / 2) + ',' + (2 + p[1] * cs + cs / 2)).join(' ')}" fill="none" stroke="#f97316" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 8" opacity=".85"/>`;
  if(o.goal) s += `<text x="${2 + o.goal[0] * cs + cs / 2}" y="${2 + o.goal[1] * cs + cs / 2 + 11}" text-anchor="middle" font-size="${cs * .62}">⭐</text>`;
  if(o.start){ const rot = {N:-90, E:0, S:90, W:180}[o.dir || 'E'], cx = 2 + o.start[0] * cs + cs / 2, cy = 2 + o.start[1] * cs + cs / 2;
    s += `<text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="${cs * .58}">🤖</text><g transform="rotate(${rot} ${cx} ${cy})"><polygon points="${cx + cs * .46},${cy} ${cx + cs * .3},${cy - 7} ${cx + cs * .3},${cy + 7}" fill="#16a34a"/></g>`; }
  (o.marks || []).forEach(m => { const cx = 2 + m.p[0] * cs + cs / 2, cy = 2 + m.p[1] * cs + cs / 2; s += `<circle cx="${cx}" cy="${cy}" r="${cs * .3}" fill="#2563eb" stroke="#fff" stroke-width="2"/><text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="17" font-weight="900" fill="#fff">${m.t}</text>`; });
  return `<span class="mtg">${s}</svg></span>`;
};
})();
