(function(){
'use strict';
/* Arbeidsark for matematikkmodulene: forklaringsark + tre nivåer (A, B, C) + fasit. Samme seed gir samme ark. */
const A = window.App, MT = window.MT, out = document.getElementById('out');
const LET = 'abcdefgh';
const TIER_NAMES = ['Nivå 1 – Start', 'Nivå 2 – Videre', 'Nivå 3 – Utfordring'];
const TIER_COL = ['#16a34a', '#d97706', '#dc2626'];
const N_DEF = [16, 16, 12];

const tierRanges = m => { const L = m.nivaaer.length, a = Math.ceil(L / 3), b = Math.ceil(2 * L / 3); return [[0, a], [a, b], [b, L]]; };

function makeTier(m, t, seed, n){
  const [lo, hi] = tierRanges(m)[t], levels = m.nivaaer.slice(lo, hi), r = MT.rng(seed * 131 + m.ord * 17 + t * 7 + 3), out = [], seen = new Set();
  for(let k = 0; out.length < n && k < n * 40; k++){
    const l = levels[k % levels.length], q = l.make(r, Math.floor(k / levels.length) + (k % levels.length === 0 ? 0 : 0));
    if(!q) continue; const key = (q.stem + '|' + q.ans).replace(/\s+/g, ''); if(seen.has(key)) continue; seen.add(key); out.push(q);
  }
  return out;
}
const isWide = q => { const w = (String(q.stem).match(/width="(\d+)"/g) || []).map(x => +x.match(/\d+/)[0]); return Math.max(0, ...w) > 330 || /mtcol|mtpv|mtgrid/.test(q.stem) && Math.max(0, ...w) > 300; };
function qHTML(q, no){
  let st = String(q.stem); const col = /class="mtcol"/.test(st);
  if(col) st = st.replace(/<br>Hva er (svaret|summen)\? \{\?\}/, '');
  const hasBlank = /\{\?\}/.test(st) || (col && /class="bx"/.test(st));
  let stem = st.replace(/\{\?\}/g, '<span class="aln"></span>'), body = '';
  if(q.type === 'choice'){
    body = q.yn ? '<div class="opts"><span>○ Ja</span><span>○ Nei</span></div>' : `<div class="opts${q.opts.some(o => String(o).includes('<svg')) ? ' fig' : ''}">${q.opts.map((o, i) => `<span>${LET[i]}) ${o}</span>`).join('')}</div>`;
  } else if(!hasBlank) body = '<div class="ansl">Svar: <span class="aln"></span></div>';
  return `<div class="qi${isWide(q) ? ' wide' : ''}"><span class="qn">${no}</span><div class="qb"><div class="qs">${stem}</div>${body}</div></div>`;
}
function keyText(q){
  if(q.type === 'choice'){
    if(q.yn) return q.ans;
    const i = q.opts.findIndex(o => String(o) === String(q.ans)), txt = String(q.ans).includes('<svg') ? '' : ' ' + q.ans;
    return LET[i] + ')' + txt;
  }
  return q.key != null ? q.key : q.ans;
}
const esc = A.esc;
const head = (m, title, color) => `<div class="shead"><div class="stitle"><span class="mi">${m.ikon}</span><div><h2>${esc(m.tittel)}</h2><div class="sub" style="color:${color || '#111'}">${title}</div></div></div><div class="who">Navn: <span class="ln"></span><br>Dato: <span class="ln s"></span></div></div>`;

function build(m, seed, parts){
  let sheets = '', keys = '', no = 0;
  const T = tierRanges(m);
  if(parts.includes(0)){
    sheets += `<section class="sheet flow">${head(m, 'Forklaring – les først', '#2563eb')}<div class="goal">${m.maal.join(' · ')} · ${m.trinn.length > 1 ? m.trinn[0] + '.–' + m.trinn[m.trinn.length - 1] : m.trinn[0]}. trinn${m.bygger.length ? ' · bygger på: ' + m.bygger.map(b => MT.byId[b] ? MT.byId[b].tittel : b).join(', ') : ''}</div>
      <div class="txt">${MT.textHTML(m, {teacher:false, noRef:true})}</div>
      <h3>Tenk og forklar</h3><p>${m.refleksjon}</p><div class="wl"></div><div class="wl"></div><div class="wl"></div><div class="wl"></div></section>`;
  }
  [0, 1, 2].forEach(t => {
    if(!parts.includes(t + 1)) return;
    const qs = makeTier(m, t, seed, N_DEF[t]), lvNames = m.nivaaer.slice(T[t][0], T[t][1]).map(l => l.t).join(' · ');
    sheets += `<section class="sheet fit" data-tier="${t}" data-seed="${seed}">${head(m, TIER_NAMES[t], TIER_COL[t])}<div class="instr"><b>Øv på:</b> ${esc(lvNames)}. Skriv svaret på streken eller sett ring rundt riktig alternativ.</div><div class="qg">${qs.map((q, i) => qHTML(q, i + 1)).join('')}</div>${t === 2 ? `<div class="refl"><b>Tenk og forklar:</b> ${m.refleksjon}<div class="wl"></div><div class="wl"></div></div>` : ''}</section>`;
    sheets = sheets; keys += `<div class="kt" data-tier="${t}" data-n="${qs.length}"><h4 style="color:${TIER_COL[t]}">${TIER_NAMES[t]}</h4><div class="kg">${qs.map((q, i) => `<div class="kc" data-i="${i}"><b>${i + 1}.</b> <span class="ka">${keyText(q)}</span></div>`).join('')}</div></div>`;
  });
  return {sheets, keys};
}

/* fit: fjern spørsmål til arket ikke renner over (målt på skjermen, som har mindre plass enn utskriften) */
function fit(root){
  root.querySelectorAll('.sheet.fit').forEach(sh => {
    const qg = sh.querySelector('.qg'), tier = sh.dataset.tier;
    const bottom = () => { const last = sh.querySelector('.refl') || qg, r = last.getBoundingClientRect(); return r.bottom; };
    const limit = () => { const r = sh.getBoundingClientRect(), pb = parseFloat(getComputedStyle(sh).paddingBottom) || 0; return r.bottom - pb - 14; };
    let guard = 0;
    while(bottom() > limit() && qg.children.length > 3 && guard++ < 40) qg.removeChild(qg.lastElementChild);
    sh.dataset.n = qg.children.length;
    const kt = root.querySelector(`.kt[data-tier="${tier}"]`);
    if(kt) [...kt.querySelectorAll('.kc')].forEach((c, i) => { if(i >= qg.children.length) c.remove(); });
  });
}

function parts(t){ if(!t || t === 'all') return [0, 1, 2, 3]; return t.split(',').map(Number).filter(x => x >= 0 && x <= 3); }
function params(){ const o = {}; location.hash.replace(/^#/, '').split('&').forEach(p => { const [k, v] = p.split('='); if(k) o[k] = decodeURIComponent(v || ''); }); return o; }
function setHash(o){ history.replaceState(null, '', '#' + Object.keys(o).map(k => k + '=' + encodeURIComponent(o[k])).join('&')); }

function render(){
  const P = params(); let m = MT.byId[P.m] || MT.mods.slice().sort((a, b) => a.ord - b.ord)[0];
  let seed = +P.s; if(!seed){ seed = Math.floor(Math.random() * 1e6); P.s = seed; P.m = m.id; setHash(P); }
  const pt = parts(P.t);
  document.querySelectorAll('#parts input').forEach(c => { c.checked = pt.includes(+c.value); });
  document.getElementById('mod').value = m.id;
  const w = build(m, seed, pt);
  out.innerHTML = `<div class="sheetwrap">${w.sheets}</div><div class="keywrap"><section class="sheet key flow">${head(m, 'Fasit (for voksne)', '#6b7280')}<div class="kts">${w.keys}</div></section></div>`;
  const doFit = () => fit(out);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { doFit(); requestAnimationFrame(doFit); });
}

function init(){
  const sel = document.getElementById('mod');
  const mods = MT.mods.slice().sort((a, b) => a.ord - b.ord);
  sel.innerHTML = mods.map(m => `<option value="${m.id}">${m.ikon} ${esc(m.tittel)} (${m.trinn.length > 1 ? m.trinn[0] + '.–' + m.trinn[m.trinn.length - 1] : m.trinn[0]}. trinn)</option>`).join('');
  const upd = () => { const P = params(); P.m = sel.value; P.t = [...document.querySelectorAll('#parts input:checked')].map(c => c.value).join(',') || 'all'; if(!P.s) P.s = Math.floor(Math.random() * 1e6); setHash(P); render(); };
  sel.onchange = upd;
  document.querySelectorAll('#parts input').forEach(c => { c.onchange = upd; });
  document.getElementById('new').onclick = () => { const P = params(); P.s = Math.floor(Math.random() * 1e6); setHash(P); render(); };
  const doPrint = what => { document.body.dataset.print = what; window.print(); };
  document.getElementById('printSheets').onclick = () => doPrint('sheets');
  document.getElementById('printKeys').onclick = () => doPrint('keys');
  document.getElementById('showKey').onchange = e => document.body.classList.toggle('show-key', e.target.checked);
  window.addEventListener('hashchange', render);
  render();
}
window.MT.ark = {build, makeTier, tierRanges, fit, render};
init();
})();
