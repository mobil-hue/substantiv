(function(){
'use strict';
/* Matematikk: grafikk til gange, areal, koordinatsystem og divisjon – tabell, prikkrutenett, arealrutenett, koordinatsystem, delt stang */
const MT = window.MT, G = MT.G, INK = '#1f2937';

/* ---------- tabell: rows = [[celle, ...], ...]. «?» blir en tom boks. o.head = første rad er overskrift ---------- */
G.tbl = (rows, o) => {
  o = o || {};
  return `<span class="mtg"><table class="mttbl">${rows.map((r, i) => `<tr>${r.map((c, j) => `<${(j === 0 || (o.head && i === 0)) ? 'th' : 'td'} class="${c === '?' ? 'q' : ''}">${c === '?' ? '<span class="bx2 w"></span>' : c}</${(j === 0 || (o.head && i === 0)) ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</table></span>`;
};

/* ---------- prikkrutenett: r rader, c kolonner. o.split = antall kolonner i første farge; o.splitR = antall rader i første farge ---------- */
G.arr = (r, c, o) => {
  o = o || {}; const s = o.s || 26, W = c * s + 8, H = r * s + 8, A = o.ca || '#3b82f6', Bc = o.cb || '#f97316';
  let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${r} rader med ${c}">`;
  for(let i = 0; i < r; i++) for(let j = 0; j < c; j++){
    const first = (o.split == null || j < o.split) && (o.splitR == null || i < o.splitR);
    t += `<circle cx="${4 + j * s + s / 2}" cy="${4 + i * s + s / 2}" r="${s * .36}" fill="${first ? A : Bc}"/>`;
  }
  if(o.split != null && o.split > 0 && o.split < c) t += `<line x1="${4 + o.split * s}" y1="0" x2="${4 + o.split * s}" y2="${H}" stroke="${INK}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  return `<span class="mtg">${t}</svg></span>`;
};

/* ---------- arealrutenett: o.cells = [[x,y], ...] eller o.w/o.h (rektangel). o.dim = skriv bredde og høyde langs kantene (i cm) ---------- */
G.areaGrid = o => {
  const cells = o.cells || Array.from({length:o.w * o.h}, (_, i) => [i % o.w, Math.floor(i / o.w)]), w = o.gw || Math.max(...cells.map(c => c[0])) + 1, h = o.gh || Math.max(...cells.map(c => c[1])) + 1, s = o.s || 30, m = o.dim ? 22 : 4;
  const W = w * s + m + 4, H = h * s + m + 4, fill = o.c || '#93c5fd'; let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="areal">`;
  cells.forEach(c => { t += `<rect x="${m + c[0] * s}" y="${m + c[1] * s}" width="${s}" height="${s}" fill="${fill}" stroke="${o.grid === false ? fill : '#1e3a8a'}" stroke-width="${o.grid === false ? 0 : 1.5}"/>`; });
  if(o.dim){ t += `<text x="${m + w * s / 2}" y="15" text-anchor="middle" font-size="15" font-weight="900" fill="${INK}">${o.dw != null ? o.dw : w} cm</text><text x="11" y="${m + h * s / 2 + 5}" text-anchor="middle" font-size="15" font-weight="900" fill="${INK}" transform="rotate(-90 11 ${m + h * s / 2})">${o.dh != null ? o.dh : h} cm</text>`; }
  return `<span class="mtg">${t}</svg></span>`;
};

/* ---------- koordinatsystem (1. kvadrant): max, o.points = [{x, y, t, c}], o.path = [[x, y], ...] (tegnes som linje), o.close = lukk figuren ---------- */
G.coord = (max, o) => {
  o = o || {}; const s = o.s || 36, m = 28, W = m + max * s + 18, H = m + max * s + 14;
  const X = x => m + x * s, Y = y => H - m - y * s + 8;
  let t = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="koordinatsystem">`;
  for(let i = 0; i <= max; i++){
    t += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(max)}" stroke="#cbd5e1" stroke-width="${i === 0 ? 0 : 1.5}"/><line x1="${X(0)}" y1="${Y(i)}" x2="${X(max)}" y2="${Y(i)}" stroke="#cbd5e1" stroke-width="${i === 0 ? 0 : 1.5}"/>`;
    t += `<text x="${X(i)}" y="${Y(0) + 18}" text-anchor="middle" font-size="14" font-weight="800" fill="${INK}">${i}</text>`;
    if(i > 0) t += `<text x="${X(0) - 10}" y="${Y(i) + 5}" text-anchor="end" font-size="14" font-weight="800" fill="${INK}">${i}</text>`;
  }
  t += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(max) + 12}" y2="${Y(0)}" stroke="${INK}" stroke-width="3"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(max) - 12}" stroke="${INK}" stroke-width="3"/><text x="${X(max) + 12}" y="${Y(0) + 18}" font-size="14" font-weight="900" fill="#2563eb">x</text><text x="${X(0) + 10}" y="${Y(max) - 14}" font-size="14" font-weight="900" fill="#dc2626">y</text>`;
  if(o.path && o.path.length > 1){ const pts = o.path.concat(o.close ? [o.path[0]] : []).map(p => X(p[0]) + ',' + Y(p[1])).join(' '); t += `<polyline points="${pts}" fill="${o.close ? 'rgba(96,165,250,.25)' : 'none'}" stroke="#2563eb" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`; }
  (o.points || []).forEach(p => { t += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="9" fill="${p.c || '#f97316'}" stroke="#fff" stroke-width="2.5"/>` + (p.t ? `<text x="${X(p.x) + 12}" y="${Y(p.y) - 9}" font-size="17" font-weight="900" fill="${p.c || '#ea580c'}">${p.t}</text>` : ''); });
  return `<span class="mtg">${t}</svg></span>`;
};

/* ---------- delt stang: total øverst, parts like deler under. o.part = tall i hver del ('?' for ukjent), o.total = '?' for ukjent ---------- */
G.partbar = (total, parts, o) => {
  o = o || {}; const W = o.w || 320, h = 42, pw = (W - 4) / parts, qp = o.part === '?', qt = o.total === '?';
  const cell = (x, y, w, txt, col, q) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${q ? '#fff' : col}" fill-opacity="${q ? 1 : .22}" stroke="${q ? '#94a3b8' : col}" stroke-width="3" ${q ? 'stroke-dasharray="6 4"' : ''}/><text x="${x + w / 2}" y="${y + 29}" text-anchor="middle" font-size="24" font-weight="900" fill="${q ? '#6b7280' : INK}">${q ? '?' : txt}</text>`;
  let t = `<svg width="${W}" height="${h * 2 + 16}" viewBox="0 0 ${W} ${h * 2 + 16}">${cell(2, 2, W - 4, total, '#16a34a', qt)}`;
  for(let i = 0; i < parts; i++) t += cell(2 + i * pw + 1, h + 14, pw - 2, o.part == null ? total / parts : o.part, '#3b82f6', qp);
  return `<span class="mtg">${t}</svg></span>`;
};
})();
