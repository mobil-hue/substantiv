(function(){
'use strict';
/* Tegninger til gange: grupper, prikkrutenett, baller, rutenett (arealmodell), oppstilling, gangetabell, tallinje */
const A = window.App, N = A.N;
const MG = A.MG = {};
const f1 = v => +v.toFixed(1);
const COL = ['#fde68a', '#bfdbfe', '#bbf7d0', '#fbcfe8', '#ddd6fe', '#fed7aa'];
const BALL = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];
const svg = (inner, w, h, cls, style) => `<svg class="${cls || 'mgsvg'}" viewBox="0 0 ${f1(w)} ${f1(h)}"${style ? ` style="${style}"` : ''} xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

/* g grupper med k ting i hver (f.eks. 4 poser med 3 epler) */
MG.groups = function(g, k, emoji, holder, o){
  o = o || {};
  const per = k > 6 ? 5 : 3;
  const one = () => `<div class="mgrp">${holder ? `<div class="mh">${holder}</div>` : ''}<div class="mi" style="grid-template-columns:repeat(${Math.min(k, per)},1fr)">${Array.from({length:k}, () => `<span>${emoji}</span>`).join('')}</div></div>`;
  return `<div class="mgroups${o.small ? ' sm' : ''}">${Array.from({length:g}, one).join('')}</div>`;
};

/* prikkrutenett: rows × cols. split = antall kolonner i første del (to farger) */
MG.dots = function(rows, cols, o){
  o = o || {};
  const s = o.s || 22, r = o.r || 8, sp = o.split ? 12 : 0, c1 = o.c1 || '#3b82f6', c2 = o.c2 || '#f97316';
  const W = cols * s + sp + 8, H = rows * s + 8; let out = '';
  for(let i = 0; i < rows; i++) for(let j = 0; j < cols; j++){
    const x = 4 + s / 2 + j * s + (o.split && j >= o.split ? sp : 0), y = 4 + s / 2 + i * s;
    const col = o.split ? (j < o.split ? c1 : c2) : (o.byRow ? [c1, c2][i % 2] : c1);
    out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${col}"/>`;
  }
  return svg(out, W, H, 'mgsvg dots', `width:${f1(W)}px`);
};

/* stolper med baller (som i gange-spillet): a baller i hver stolpe, 1..10 stolper */
MG.ballCols = function(a, hi, o){
  o = o || {};
  let h = `<div class="bcap">${a} × 1, ${a} × 2, … ${a} × 10 &nbsp;·&nbsp; ${a} <span class="no">baller</span><span class="zh">个球</span></div><div class="bcols">`;
  for(let i = 1; i <= 10; i++){
    const color = BALL[(i - 1) % BALL.length];
    h += `<div class="bcol${i === hi ? ' target' : ''}" style="animation-delay:${(i - 1) * 70}ms">` + Array.from({length:a}, () => `<span class="ball" style="background:${color}"></span>`).join('')
      + `<div class="n">${i}</div>` + (i === hi ? `<div class="s unk">?</div>` : `<div class="s">${a * i}</div>`) + `</div>`;
  }
  return `<div class="ballhint">${h}</div></div>`;
};

/* rutenett (arealmodell): aParts langs toppen, bParts langs siden. cells[r][c] = tekst i ruten */
MG.area = function(aParts, bParts, o){
  o = o || {};
  const W = 300, H = bParts.length > 1 ? 150 : 84, mx = 52, my = 32;
  const split = (parts, total, min) => { const s = parts.map(v => Math.sqrt(Math.max(1, v))), sum = s.reduce((x, y) => x + y, 0);
    let w = s.map(v => Math.max(min, total * v / sum)); const t = w.reduce((x, y) => x + y, 0); return w.map(v => v * total / t); };
  const ws = split(aParts, W, 52), hs = split(bParts, H, 44);
  let out = '', x = mx;
  const xs = ws.map(w => { const v = x; x += w; return v; });
  let y = my; const ys = hs.map(h => { const v = y; y += h; return v; });
  hs.forEach((h, r) => ws.forEach((w, c) => {
    const hi = o.hi && o.hi[0] === r && o.hi[1] === c, txt = o.cells && o.cells[r] && o.cells[r][c] != null ? o.cells[r][c] : '';
    out += `<rect x="${f1(xs[c])}" y="${f1(ys[r])}" width="${f1(w)}" height="${f1(h)}" fill="${COL[c % COL.length]}" stroke="${hi ? '#ea580c' : '#64748b'}" stroke-width="${hi ? 4 : 2}"/>`;
    if(txt !== '') out += `<text x="${f1(xs[c] + w / 2)}" y="${f1(ys[r] + h / 2 + 6)}" text-anchor="middle" font-size="17" font-weight="900" font-family="sans-serif" fill="#1f2937">${txt}</text>`;
  }));
  ws.forEach((w, c) => { out += `<text x="${f1(xs[c] + w / 2)}" y="${my - 10}" text-anchor="middle" font-size="17" font-weight="900" font-family="sans-serif" fill="#2563eb">${aParts[c]}</text>`;
    if(aParts.length > 1) out += `<line x1="${f1(xs[c] + 3)}" y1="${my - 3}" x2="${f1(xs[c] + w - 3)}" y2="${my - 3}" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>`; });
  hs.forEach((h, r) => { out += `<text x="${mx - 10}" y="${f1(ys[r] + h / 2 + 6)}" text-anchor="end" font-size="17" font-weight="900" font-family="sans-serif" fill="#dc2626">${bParts[r]}</text>`; });
  const Ht = my + H + (o.total ? 30 : 8);
  if(o.total) out += `<text x="${mx + W / 2}" y="${my + H + 24}" text-anchor="middle" font-size="18" font-weight="900" font-family="sans-serif" fill="#16a34a">${o.total}</text>`;
  return svg(out, mx + W + 10, Ht, 'mgsvg area');
};

/* oppstilling («gamlemåten») med mente. st: {res:[siffer fra høyre], carry:[mente inn i kolonne i], active:i} */
MG.column = function(a, b, st){
  st = st || {};
  const ds = String(a).split('').map(Number), L = ds.length, res = st.res || [], carry = st.carry || [];
  const cells = (fn) => { let h = ''; for(let p = 0; p <= L; p++) h += fn(p, L - p); return h; };   // p: plass fra venstre, i: siffer fra høyre
  const cls = i => i === st.active ? ' act' : '';
  let h = `<table class="mcol"><tr class="cr"><td class="sg"></td>${cells((p, i) => `<td>${i >= 1 && carry[i] ? `<span class="cy">${carry[i]}</span>` : ''}</td>`)}</tr>`;
  h += `<tr class="ar"><td class="sg"></td>${cells((p, i) => `<td class="d${cls(i)}">${i >= 0 && i < L ? ds[L - 1 - i] : ''}</td>`)}</tr>`;
  h += `<tr class="br"><td class="sg">×</td>${cells((p, i) => `<td class="d">${i === 0 ? b : ''}</td>`)}</tr>`;
  h += `<tr class="ln"><td class="sg"></td><td colspan="${L + 1}"></td></tr>`;
  h += `<tr class="rr"><td class="sg"></td>${cells((p, i) => `<td class="d res${cls(i)}">${res[i] != null ? res[i] : ''}</td>`)}</tr></table>`;
  return h;
};

/* flere delprodukter under hverandre (to-sifret multiplikator) */
MG.partials = function(rows){
  return `<table class="mpart">${rows.map(r => `<tr><td class="lb">${r.lb || ''}</td><td class="v${r.cls ? ' ' + r.cls : ''}">${r.v}</td></tr>`).join('')}</table>`;
};

/* gangetabell 1–10. o: {hiRow, hiCol, marks:{'AxB':farge}, size} */
MG.mtable = function(o){
  o = o || {}; const n = o.n || 10;
  let h = `<table class="mtab${o.small ? ' sm' : ''}"><tr><th>×</th>${Array.from({length:n}, (_, i) => `<th class="${o.hiCol === i + 1 ? 'hi' : ''}">${i + 1}</th>`).join('')}</tr>`;
  for(let r = 1; r <= n; r++){
    h += `<tr><th class="${o.hiRow === r ? 'hi' : ''}">${r}</th>`;
    for(let c = 1; c <= n; c++){
      const mk = (o.marks && (o.marks[r + 'x' + c] || o.marks[c + 'x' + r])) || '';
      const hi = o.hiRow === r || o.hiCol === c;
      h += `<td${mk ? ` style="background:${mk};font-weight:900"` : hi ? ' class="hi"' : ''}>${r * c}</td>`;
    }
    h += '</tr>';
  }
  return h + '</table>';
};

/* plassverdi: n, og n × 10^k med sifrene flyttet mot venstre */
MG.shift10 = function(n, k, o){
  o = o || {};
  const names = ['hundre-<br>tusen', 'ti-<br>tusen', 'tusen', 'hundre', 'tier', 'ener'], m = n * Math.pow(10, k);
  const digs = v => String(v).split('');
  const row = (v, hiZero) => { const d = digs(v), pad = names.length - d.length;
    return `<tr>${names.map((_, i) => { const x = i - pad; const ch = x >= 0 ? d[x] : ''; const zero = hiZero && x >= d.length - k && x >= 0; return `<td class="${zero ? 'z' : ch ? 'v' : ''}">${ch}</td>`; }).join('')}</tr>`; };
  return `<table class="mshift"><tr>${names.map(t => `<th>${t}</th>`).join('')}</tr>${row(n, false)}<tr class="ar">${names.map(() => `<td>${k ? '⬇' : ''}</td>`).join('')}</tr>${row(m, true)}</table>`;
};

/* tallinje med hopp: hver hop er `step` lang, `hops` hopp */
MG.numline = function(step, hops, o){
  o = o || {};
  const end = step * hops, W = 330, H = 100, x0 = 20, sc = (W - 40) / end, y = 66; let out = `<line x1="${x0 - 8}" y1="${y}" x2="${W - 4}" y2="${y}" stroke="#334155" stroke-width="3"/>`;
  for(let i = 0; i <= hops; i++){
    const x = x0 + i * step * sc;
    out += `<line x1="${f1(x)}" y1="${y - 6}" x2="${f1(x)}" y2="${y + 6}" stroke="#334155" stroke-width="3"/><text x="${f1(x)}" y="${y + 24}" text-anchor="middle" font-size="14" font-weight="800" font-family="sans-serif" fill="#334155">${i * step}</text>`;
    if(i < hops){ const xn = x0 + (i + 1) * step * sc, mid = (x + xn) / 2;
      out += `<path d="M${f1(x)},${y - 4} Q${f1(mid)},${y - 44} ${f1(xn)},${y - 4}" fill="none" stroke="${BALL[i % BALL.length]}" stroke-width="3.5" stroke-linecap="round"/><text x="${f1(mid)}" y="${y - 36}" text-anchor="middle" font-size="13" font-weight="900" font-family="sans-serif" fill="${BALL[i % BALL.length]}">+${step}</text>`; }
  }
  return svg(out, W, H, 'mgsvg nline');
};

/* tallinje som viser «runde av»: a er nesten R */
MG.roundLine = function(a, R){
  const W = 300, x0 = 24, x1 = 276, sc = (x1 - x0) / (R - a + 4), xa = x0 + 2 * sc, xr = xa + (R - a) * sc;
  return `<svg class="mgsvg nline" viewBox="0 0 ${W} 90" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="60" x2="${W - 8}" y2="60" stroke="#334155" stroke-width="3"/>
    <circle cx="${f1(xa)}" cy="60" r="7" fill="#f97316"/><circle cx="${f1(xr)}" cy="60" r="7" fill="#16a34a"/>
    <text x="${f1(xa)}" y="84" text-anchor="middle" font-size="15" font-weight="900" font-family="sans-serif" fill="#f97316">${a}</text><text x="${f1(xr)}" y="84" text-anchor="middle" font-size="15" font-weight="900" font-family="sans-serif" fill="#16a34a">${R}</text>
    <path d="M${f1(xa)},52 Q${f1((xa + xr) / 2)},8 ${f1(xr)},52" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round"/><text x="${f1((xa + xr) / 2)}" y="26" text-anchor="middle" font-size="14" font-weight="900" font-family="sans-serif" fill="#2563eb">+${R - a}</text></svg>`;
};

/* store regnestykker */
MG.eq = (a, b, ans) => `<div class="mq">${N.fmt(a)} × ${N.fmt(b)} = ${ans == null ? '?' : N.fmt(ans)}</div>`;
MG.eqText = (a, b) => `<div class="mq txt"><span class="no">${N.no(a)} ganger ${N.no(b)}</span></div><div class="gloss zh">${N.zh(a)}乘以${N.zh(b)}</div>`;
})();
