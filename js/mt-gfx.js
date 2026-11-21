(function(){
'use strict';
/* Matematikk: grafikk (SVG/HTML-tekst). Fungerer på hvit bunn (øving, arbeidsark) og på tavla (video). */
const MT = window.MT = window.MT || {};
const CA = '#3b82f6', CB = '#f97316', CG = '#16a34a', CR = '#dc2626', INK = '#1f2937';
const G = MT.G = {CA, CB, CG, CR};
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
G.esc = esc;

/* ---------- tierramme: 2 × 5 ruter. a = blå prikker, b = oransje prikker, cross = så mange av de blå strykes ---------- */
G.frame = (a, b, o) => {
  o = o || {}; const s = o.s || 30, cap = 10, total = a + (b || 0), nf = Math.max(1, Math.ceil((o.frames ? o.frames * cap : total) / cap));
  let out = '';
  for(let f = 0; f < nf; f++){
    let svg = `<svg width="${5 * s + 6}" height="${2 * s + 6}" viewBox="0 0 ${5 * s + 6} ${2 * s + 6}" role="img" aria-label="tierramme"><rect x="2" y="2" width="${5 * s + 2}" height="${2 * s + 2}" rx="6" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
    for(let c = 1; c < 5; c++) svg += `<line x1="${3 + c * s}" y1="3" x2="${3 + c * s}" y2="${2 * s + 3}" stroke="#cbd5e1" stroke-width="2"/>`;
    svg += `<line x1="3" y1="${s + 3}" x2="${5 * s + 3}" y2="${s + 3}" stroke="#cbd5e1" stroke-width="2"/>`;
    for(let k = 0; k < cap; k++){
      const idx = f * cap + k; if(idx >= total) break;
      const cx = 3 + (k % 5) * s + s / 2, cy = 3 + Math.floor(k / 5) * s + s / 2, col = idx < a ? CA : CB;
      svg += `<circle cx="${cx}" cy="${cy}" r="${s * .38}" fill="${col}"/>`;
      if(o.cross && idx < a && idx >= a - o.cross) svg += `<path d="M${cx - s * .3} ${cy - s * .3}L${cx + s * .3} ${cy + s * .3}M${cx + s * .3} ${cy - s * .3}L${cx - s * .3} ${cy + s * .3}" stroke="${CR}" stroke-width="4" stroke-linecap="round"/>`;
    }
    out += svg + '</svg>';
  }
  return `<span class="mtg mtfr">${out}</span>`;
};

/* ---------- ting (emoji) i rader. n = antall, per = per rad, cross = antall som strykes, groups = grupper à n ---------- */
G.objs = (emoji, n, o) => {
  o = o || {}; const per = o.per || 5, sz = o.s || '1.9rem', cross = o.cross || 0;
  let rows = '';
  for(let i = 0; i < n; i += per){
    let r = '';
    for(let j = i; j < Math.min(n, i + per); j++) r += `<span class="o${j >= n - cross ? ' x' : ''}">${emoji}</span>`;
    rows += `<span class="r">${r}</span>`;
  }
  return `<span class="mtg"><span class="mtobj" style="--os:${sz}">${rows}</span></span>`;
};
// flere grupper side om side: [[emoji, n], ...]
G.groups = (list, o) => `<span class="mtg">${list.map(l => `<span class="mtobj grp" style="--os:${(o && o.s) || '1.7rem'}">${G.objs(l[0], l[1], {per:l[2] || 5, s:(o && o.s) || '1.7rem'}).replace(/^<span class="mtg">|<\/span>$/g, '')}</span>`).join('')}</span>`;
// spredte ting (ingen rutenett): n emojier tilfeldig plassert (seed) – øver telling uten å telle i rader
G.scatter = (emoji, n, seed, o) => {
  o = o || {}; const W = o.w || 300, H = o.h || 130, s = o.s || 34, r = MT.rng(seed * 7919 + n); const pts = [];
  let tries = 0;
  while(pts.length < n && tries < 4000){
    tries++; const x = 8 + r() * (W - s - 16), y = 8 + r() * (H - s - 16);
    if(pts.every(p => Math.hypot(p[0] - x, p[1] - y) > s * .95)) pts.push([x, y]);
  }
  return `<span class="mtg"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="14" fill="#fff" stroke="#cbd5e1" stroke-width="3"/>${pts.map(p => `<text x="${p[0]}" y="${p[1] + s * .8}" font-size="${s * .85}">${emoji}</text>`).join('')}</svg></span>`;
};

/* ---------- tiersystemet med klosser: h = hundrere (flate), t = tiere (stav), e = enere (kloss) ---------- */
G.blocks = (v, o) => {
  o = o || {}; const u = o.u || 7, h = v.h || 0, t = v.t || 0, e = v.e || 0, line = '#1e3a8a', fh = '#fecaca', ft = '#bfdbfe', fe = '#bbf7d0';
  const grid = (w, hh, fill, stroke) => { let s = `<rect x="1" y="1" width="${w * u}" height="${hh * u}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    for(let i = 1; i < w; i++) s += `<line x1="${1 + i * u}" y1="1" x2="${1 + i * u}" y2="${1 + hh * u}" stroke="${stroke}" stroke-width=".7"/>`;
    for(let j = 1; j < hh; j++) s += `<line x1="1" y1="${1 + j * u}" x2="${1 + w * u}" y2="${1 + j * u}" stroke="${stroke}" stroke-width=".7"/>`; return s; };
  let out = '';
  for(let i = 0; i < h; i++) out += `<svg width="${10 * u + 2}" height="${10 * u + 2}">${grid(10, 10, fh, '#b91c1c')}</svg>`;
  if(t){ out += '<span class="mtb">'; for(let i = 0; i < t; i++) out += `<svg width="${u + 2}" height="${10 * u + 2}">${grid(1, 10, ft, line)}</svg>`; out += '</span>'; }
  if(e){ out += '<span class="mtb" style="max-width:' + ((u + 4) * 5) + 'px">'; for(let i = 0; i < e; i++) out += `<svg width="${u + 2}" height="${u + 2}">${grid(1, 1, fe, '#15803d')}</svg>`; out += '</span>'; }
  return `<span class="mtg mtb" style="gap:${o.gap || 14}px;align-items:flex-end">${out || '<svg width="10" height="10"></svg>'}</span>`;
};

/* ---------- plasstabell: H T E ---------- */
G.pv = (v, o) => {
  o = o || {}; const cols = o.cols || (v.h != null ? ['h', 't', 'e'] : ['t', 'e']), nm = {h:'Hundrere', t:'Tiere', e:'Enere'};
  return `<table class="mtpv"><tr>${cols.map(c => `<th class="${c}">${nm[c]}</th>`).join('')}</tr><tr>${cols.map(c => `<td class="${v[c] === '?' ? 'q' : ''}">${v[c]}</td>`).join('')}</tr></table>`;
};

/* ---------- tallinje ---------- */
// from, to: heltall. o.marks [{v,label,c}] prikker, o.hops [{a,b,label,c}] hopp over linja, o.labels = hvilke tall som får tall under (default alle opp til 20, ellers hver 5./10.)
// o.hide = tall som skrives som tomme ruter, o.q = tall merket «?», o.w bredde
G.nline = (from, to, o) => {
  o = o || {}; const n = to - from, W = o.w || (n <= 12 ? 520 : n <= 20 ? 620 : 700), padl = 24, step = (W - 2 * padl) / n, y = o.hops && o.hops.length ? 84 : 52, H = y + 56;
  const labelEvery = o.every || (n <= 20 ? 1 : n <= 50 ? 5 : 10), hide = new Set(o.hide || []);
  const X = v => padl + (v - from) * step;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="tallinje"><line x1="${padl - 10}" y1="${y}" x2="${W - padl + 10}" y2="${y}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  (o.hl || []).forEach(h => { s += `<rect x="${X(h[0]) - 3}" y="${y - 12}" width="${X(h[1]) - X(h[0]) + 6}" height="24" rx="8" fill="${h[2] || '#fde68a'}" opacity=".6"/>`; });
  for(let v = from; v <= to; v++){
    const major = (v - from) % labelEvery === 0 || v === to, x = X(v);
    if(o.tick && (v - from) % o.tick !== 0 && !major) continue;
    s += `<line x1="${x}" y1="${y - (major ? 12 : 7)}" x2="${x}" y2="${y + (major ? 12 : 7)}" stroke="${INK}" stroke-width="${major ? 3 : 2}"/>`;
    if(major){
      if(hide.has(v)) s += `<rect x="${x - 15}" y="${y + 16}" width="30" height="28" rx="6" fill="#fff" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="4 3"/>`;
      else s += `<text x="${x}" y="${y + 38}" text-anchor="middle" font-size="${n > 20 ? 17 : 20}" font-weight="800" fill="${INK}" class="nl-t">${v}</text>`;
    }
  }
  (o.hops || []).forEach(h => {
    const x1 = X(h.a), x2 = X(h.b), mid = (x1 + x2) / 2, up = Math.min(54, 14 + Math.abs(x2 - x1) * .35), c = h.c || CB, dir = h.b >= h.a ? 1 : -1;
    s += `<path d="M${x1} ${y - 4} Q${mid} ${y - 4 - up * 2} ${x2} ${y - 4}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="M${x2 - 8 * dir} ${y - 17} L${x2} ${y - 4} L${x2 - 13 * dir} ${y - 6}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    if(h.label != null) s += `<text x="${mid}" y="${y - 4 - up * 1 - 6}" text-anchor="middle" font-size="18" font-weight="900" fill="${c}">${h.label}</text>`;
  });
  (o.marks || []).forEach(m => { const x = X(m.v), c = m.c || CB;
    s += `<circle cx="${x}" cy="${y}" r="10" fill="${c}" stroke="#fff" stroke-width="3"/>`;
    if(m.label != null) s += `<text x="${x}" y="${y - 20}" text-anchor="middle" font-size="22" font-weight="900" fill="${c}">${m.label}</text>`; });
  if(o.q != null){ const x = X(o.q); s += `<circle cx="${x}" cy="${y}" r="11" fill="${CB}" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y - 20}" text-anchor="middle" font-size="26" font-weight="900" fill="${CB}">?</text>`; }
  return `<span class="mtg">${s}</svg></span>`;
};

/* ---------- del–hel-stang: total øverst, delene under. q = hvilken del som er ukjent: 'w' (helhet), 0, 1 ---------- */
G.bar = (total, a, b, o) => {
  o = o || {}; const W = o.w || 300, h = 46, q = o.q, t = a + b || 1, wa = Math.max(50, Math.round((W - 8) * a / t)), wb = W - 8 - wa + (a ? 0 : 0);
  const cell = (x, y, w, txt, col, qq) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${qq ? '#fff' : col}" fill-opacity="${qq ? 1 : .22}" stroke="${qq ? '#94a3b8' : col}" stroke-width="3" ${qq ? 'stroke-dasharray="6 4"' : ''}/><text x="${x + w / 2}" y="${y + 32}" text-anchor="middle" font-size="26" font-weight="900" fill="${qq ? '#6b7280' : INK}">${qq ? '?' : txt}</text>`;
  const bw = Math.round((W - 12) / 2);
  return `<span class="mtg"><svg width="${W}" height="${h * 2 + 16}" viewBox="0 0 ${W} ${h * 2 + 16}">${cell(2, 2, W - 4, total, CG, q === 'w')}${cell(2, h + 14, bw, a, CA, q === 0)}${cell(W - 2 - bw, h + 14, bw, b, CB, q === 1)}</svg></span>`;
};

/* ---------- balansevekt: venstre og høyre verdi (for likhetstegn) ---------- */
G.balance = (l, r, lv, rv) => {
  const d = lv === rv ? 0 : lv > rv ? 1 : -1, W = 440, H = 200, cx = W / 2, th = d * 9 * Math.PI / 180, half = 150;
  const ex = [cx - half * Math.cos(th), cx + half * Math.cos(th)], ey = [40 + half * Math.sin(th), 40 - half * Math.sin(th)];
  const pan = (k, txt) => { const x = ex[k], y = ey[k], rim = y + 64;
    return `<line x1="${x}" y1="${y}" x2="${x - 44}" y2="${rim}" stroke="#64748b" stroke-width="3"/><line x1="${x}" y1="${y}" x2="${x + 44}" y2="${rim}" stroke="#64748b" stroke-width="3"/><path d="M${x - 52} ${rim} h104 q-6 24 -52 24 q-46 0 -52 -24z" fill="#e0e7ff" stroke="#4338ca" stroke-width="3"/><text x="${x}" y="${rim - 12}" text-anchor="middle" font-size="24" font-weight="900" fill="${INK}">${txt}</text>`; };
  return `<span class="mtg"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${cx - 7}" y="38" width="14" height="${H - 58}" fill="#94a3b8" rx="4"/><rect x="${cx - 40}" y="${H - 24}" width="80" height="12" rx="6" fill="#64748b"/><line x1="${ex[0]}" y1="${ey[0]}" x2="${ex[1]}" y2="${ey[1]}" stroke="#475569" stroke-width="10" stroke-linecap="round"/>${pan(0, l)}${pan(1, r)}<circle cx="${cx}" cy="40" r="10" fill="#f59e0b"/></svg></span>`;
};

/* ---------- former (til gruppering): [{s:'c'|'q'|'t', c:'#hex', big:bool}] ---------- */
G.shapes = (list, o) => {
  o = o || {}; const s = o.s || 44;
  return `<span class="mtg">${list.map(it => { const sz = it.big ? s : s * .62, c = it.c || CA, w = s + 6;
    let shp; if(it.s === 'q') shp = `<rect x="${(w - sz) / 2}" y="${(w - sz) / 2}" width="${sz}" height="${sz}" rx="4" fill="${c}"/>`;
    else if(it.s === 't') shp = `<polygon points="${w / 2},${(w - sz) / 2} ${(w + sz) / 2},${(w + sz) / 2} ${(w - sz) / 2},${(w + sz) / 2}" fill="${c}"/>`;
    else shp = `<circle cx="${w / 2}" cy="${w / 2}" r="${sz / 2}" fill="${c}"/>`;
    return `<svg width="${w}" height="${w}" viewBox="0 0 ${w} ${w}">${shp}${it.n != null ? `<text x="${w / 2}" y="${w / 2 + 7}" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">${it.n}</text>` : ''}</svg>`; }).join('')}</span>`;
};

/* ---------- oppstilling ---------- */
// op '+' eller '−'; a, b tall; o.ans = tall (vises) eller null (tom boks); o.carry = {t:'1', h:'1'} små tall over kolonnen (mente);
// o.bor = {t:{cross:true, show:'4'}, e:{show:'1'}} for veksling i subtraksjon (overstrøket siffer og nytt tall); o.hl = kolonner som lyses opp; o.noans = ikke vis svarlinje
G.col = (op, a, b, o) => {
  o = o || {}; const bs = Array.isArray(b) ? b : [b];
  let n = Math.max(String(a).length, ...bs.map(x => String(x).length), o.ans != null ? String(o.ans).length : 0, o.h ? 3 : 0);
  if(op === '+') n = Math.max(n, String(a + bs.reduce((p, x) => p + x, 0)).length);
  const dig = (v, i) => { const k = String(v).length - 1 - i; return k >= 0 ? String(v)[k] : ''; };
  const hl = new Set(o.hl || []), blank = new Set(o.blank || []), carry = o.carry || {}, bor = o.bor || {}, ord = i => ['e', 't', 'h', 'tu'][i];
  const head = [], top = [], r1 = [], rb = bs.map(() => []), r3 = [];
  for(let i = n - 1; i >= 0; i--){
    const bv = bor[ord(i)], H = hl.has(i) ? ' hl' : '';
    head.push(`<th class="${H}">${['Enere', 'Tiere', 'Hundrere', 'Tusen'][i]}</th>`);
    top.push(op === '−' ? `<td class="sm" style="color:#2563eb">${bv && bv.show != null ? bv.show : ''}</td>` : `<td class="sm">${carry[ord(i)] != null ? carry[ord(i)] : ''}</td>`);
    r1.push(`<td class="${bv && bv.cross ? 'cr' : ''}${H}">${dig(a, i)}</td>`);
    bs.forEach((x, j) => rb[j].push(`<td class="${H}">${dig(x, i)}</td>`));
    const ad = o.ans != null && !blank.has(i) ? dig(o.ans, i) : null;
    r3.push(ad == null ? '<td><span class="bx"></span></td>' : `<td class="${H}">${ad}</td>`);
  }
  const row = (cells, first) => `<tr><td class="op">${first || ''}</td>${cells.join('')}</tr>`;
  const line = `<tr class="ln"><td></td>${r1.map(() => '<td></td>').join('')}</tr>`;
  return `<span class="mtg"><table class="mtcol">${o.nohead ? '' : row(head)}${row(top)}${row(r1)}${rb.map(c => row(c, op)).join('')}${line}${o.noans ? '' : row(r3)}</table></span>`;
};

/* oppstilling som ren tekst (til mengdetrening: mange små stykker, tåler trange celler) */
G.colMini = (op, a, b, o) => {
  o = o || {}; const la = String(a).length, lb = String(b).length, ans = op === '+' ? a + b : a - b, w = Math.max(la, lb, String(ans).length) + 1;
  const pad = (v, k) => '&nbsp;'.repeat(Math.max(0, k - String(v).length)) + v;
  return `<span class="mtmini"><span class="r">${pad(a, w)}</span><span class="r">${op}${pad(b, w - 1)}</span><span class="ln"></span><span class="r bxs">${'&nbsp;'.repeat(w - String(ans).length)}${Array.from({length:String(ans).length}, () => '<i class="bx2"></i>').join('')}</span></span>`;
};

/* ---------- tallrute (hundrerutenett) 1–100: o.hl, o.hl2, o.hl3 = tall som farges; o.hide = tall som skjules; o.from/o.to; o.cols ---------- */
G.grid = (o) => {
  o = o || {}; const from = o.from == null ? 1 : o.from, to = o.to || 100, cols = o.cols || 10, cs = o.cs || 28;
  const S = k => new Set(o[k] || []);
  const h1 = S('hl'), h2 = S('hl2'), h3 = S('hl3'), hid = S('hide'), st = S('start');
  let t = `<table class="mtgrid" style="--cs:${cs}px;--fs:${cs > 30 ? '.9rem' : '.72rem'}">`;
  for(let v = from; v <= to; ){
    t += '<tr>';
    for(let c = 0; c < cols && v <= to; c++, v++) t += `<td class="${h1.has(v) ? 'hl' : h2.has(v) ? 'hl2' : h3.has(v) ? 'hl3' : ''}${st.has(v) ? ' st' : ''}${hid.has(v) ? ' hid' : ''}">${hid.has(v) ? '?' : v}</td>`;
    t += '</tr>';
  }
  return `<span class="mtg">${t}</table></span>`;
};

/* ---------- tallkort / rad med tall. list: tall eller '?'; o.c = farge; o.on = indekser som fylles ---------- */
G.chips = (list, o) => {
  o = o || {}; const on = new Set(o.on || []);
  return `<span class="mtchips">${list.map((v, i) => `<span class="mtchip ${v === '?' ? 'q' : ''} ${on.has(i) ? 'on' : ''}" style="--c:${(o.cs && o.cs[i]) || o.c || '#94a3b8'}">${v}</span>`).join('')}</span>`;
};

/* ---------- ferdig regnestykke som kort ---------- */
G.eq = (txt, c) => `<span class="mtcard" style="--c:${c || CA}">${txt}</span>`;
})();
