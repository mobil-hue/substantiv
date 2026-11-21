(function(){
'use strict';
/* Matematikk: ordhjelp. Trykk på et ord i oppgaver, forklaringer og tekster for å se hva det betyr på støttespråket.
   Ordlistene (js/i18n/mtw-<språk>.js) er små ord-for-ord-oppslag; hele setninger oversettes ikke automatisk. */
const A = window.App, app = document.getElementById('app');
if(!A || !app) return;
const WORD = /[A-Za-zÆØÅæøåéü]+(?:-[A-Za-zÆØÅæøå]+)*/g;
const SKIP = 'button,a,svg,script,style,textarea,input,select,.mtq,.mtw,.zh,.gpad,.gdisp,.sbar,.mt-tip,.mtg,.mttbl,.vctl,.mt-view,.mt-tabs,.gs-miss .rb-tt';
const dicts = () => { const W = window.MTW || {}, L = A.supLang(); return {L, d:W[L] || {}, en:W.en || {}}; };
const on = () => A.I18N && A.settings.lang !== 'no';
const lookup = w => { const {L, d, en} = dicts(), k = w.toLowerCase(); if(d[k] != null) return {t:d[k], l:L}; if(en[k] != null) return {t:en[k], l:'en'}; return null; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(root){
  if(!on() || !root || root.nodeType !== 1 && root.nodeType !== 11) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => /[A-Za-zÆØÅæøå]/.test(n.nodeValue) && n.parentElement && !n.parentElement.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT});
  const nodes = []; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => {
    const txt = n.nodeValue; let last = 0, changed = false; const frag = document.createDocumentFragment(); let m;
    WORD.lastIndex = 0;
    while((m = WORD.exec(txt))){
      if(!lookup(m[0])) continue;
      if(m.index > last) frag.append(txt.slice(last, m.index));
      const s = document.createElement('span'); s.className = 'mtw'; s.textContent = m[0]; frag.append(s); last = m.index + m[0].length; changed = true;
    }
    if(!changed) return;
    if(last < txt.length) frag.append(txt.slice(last));
    n.replaceWith(frag);
  });
}

let tip = null, tipTimer = 0;
function hide(){ if(tip){ tip.remove(); tip = null; } clearTimeout(tipTimer); }
function show(el){
  hide(); const r = lookup(el.textContent); if(!r) return;
  tip = document.createElement('div'); tip.className = 'mt-tip';
  tip.innerHTML = `<b>${esc(el.textContent)}</b> <span class="ar">→</span> <span lang="${r.l}"${A.isRtl(r.l) ? ' dir="rtl"' : ''}>${esc(r.t)}</span>`;
  document.body.append(tip);
  const b = el.getBoundingClientRect(), w = tip.offsetWidth;
  tip.style.left = Math.max(8, Math.min(window.scrollX + b.left, window.scrollX + document.documentElement.clientWidth - w - 8)) + 'px';
  tip.style.top = (window.scrollY + b.bottom + 6) + 'px';
  tipTimer = setTimeout(hide, 6000);
}
document.addEventListener('click', e => { const w = e.target.closest && e.target.closest('.mtw'); if(w){ e.preventDefault(); show(w); } else hide(); });
window.addEventListener('scroll', hide, {passive:true});

let pending = new Set(), raf = 0;
const obs = new MutationObserver(ms => {
  ms.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType === 3 && n.parentElement) pending.add(n.parentElement); else if(n.nodeType === 1 && !n.classList.contains('mtw') && !n.classList.contains('mt-tip')) pending.add(n); }));
  if(pending.size && !raf) raf = requestAnimationFrame(() => { raf = 0; const list = [...pending]; pending = new Set(); obs.disconnect(); list.forEach(n => { if(n.isConnected) wrap(n); }); obs.observe(app, {childList:true, subtree:true}); });
});
obs.observe(app, {childList:true, subtree:true});
window.addEventListener('hashchange', () => setTimeout(() => wrap(app), 60));
wrap(app);
})();
