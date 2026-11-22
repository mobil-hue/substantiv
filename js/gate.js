/* Passordlås (enkel «dørlås», ikke sikkerhet): passordet sjekkes i nettleseren mot en hash i js/gate-config.js.
   Bruk: <script src="js/gate-config.js"></script><script src="js/gate.js" data-gate="page"></script>
   data-gate="page": hele siden låses til riktig passord er skrevet inn. Uten attributtet bare lages window.Gate. */
(function(){
'use strict';
const CFG = window.SKB_GATE || {salt:'', hash:''}, KEY = 'skb_ok';
function sha256(s){
  const K = [], H = [];
  const rr = (n, x) => (x >>> n) | (x << (32 - n));
  let pc = 0; const isP = {};
  for(let c = 2; pc < 64; c++){ if(!isP[c]){ for(let i = 0; i < 313; i += c) isP[i] = c; H[pc] = (Math.pow(c, .5) * 4294967296) | 0; K[pc++] = (Math.pow(c, 1 / 3) * 4294967296) | 0; } }
  const b = unescape(encodeURIComponent(s)); const l = b.length * 8; const w = [];
  for(let i = 0; i < b.length; i++) w[i >> 2] |= b.charCodeAt(i) << ((3 - i % 4) * 8);
  w[b.length >> 2] |= 0x80 << ((3 - b.length % 4) * 8);
  w[(((b.length + 8) >> 6) << 4) + 15] = l;
  let hh = H.slice(0, 8);
  for(let j = 0; j < w.length;){
    const x = w.slice(j, j += 16); const old = hh.slice(0);
    for(let i = 0; i < 64; i++){
      const w15 = x[i - 15], w2 = x[i - 2], a = hh[0], e = hh[4];
      const t1 = hh[7] + (rr(6, e) ^ rr(11, e) ^ rr(25, e)) + ((e & hh[5]) ^ (~e & hh[6])) + K[i] + (x[i] = i < 16 ? (x[i] | 0) : (x[i - 16] + (rr(7, w15) ^ rr(18, w15) ^ (w15 >>> 3)) + x[i - 7] + (rr(17, w2) ^ rr(19, w2) ^ (w2 >>> 10))) | 0);
      const t2 = (rr(2, a) ^ rr(13, a) ^ rr(22, a)) + ((a & hh[1]) ^ (a & hh[2]) ^ (hh[1] & hh[2]));
      hh = [(t1 + t2) | 0].concat(hh); hh[4] = (hh[4] + t1) | 0; hh.pop();
    }
    for(let i = 0; i < 8; i++) hh[i] = (hh[i] + old[i]) | 0;
  }
  return hh.map(v => ('00000000' + (v >>> 0).toString(16)).slice(-8)).join('');
}
let mem = false;
const Gate = window.Gate = {
  sha256,
  ok(){ try{ return localStorage.getItem(KEY) === CFG.hash; }catch(e){ return mem; } },
  check(pw){ if(sha256(CFG.salt + String(pw).trim()) === CFG.hash){ mem = true; try{ localStorage.setItem(KEY, CFG.hash); }catch(e){} document.documentElement.classList.remove('skb-locked'); return true; } return false; },
  lock(){ mem = false; try{ localStorage.removeItem(KEY); }catch(e){} document.documentElement.classList.add('skb-locked'); },
  /* viser passordvindu; kaller ok() når riktig passord er skrevet, no() ved avbryt */
  ask(ok, no, opt){
    opt = opt || {};
    const ov = document.createElement('div'); ov.className = 'skb-gate';
    ov.innerHTML = '<div class="skb-gate-box" role="dialog" aria-modal="true"><div class="skb-gate-ic">🔒</div><h2>' + (opt.title || 'Passord kreves') + '</h2><p>' + (opt.text || 'Dette innholdet er stengt for gjennomsyn. Skriv inn passordet for å åpne.') + '</p>' +
      '<form><input type="password" autocomplete="off" placeholder="Passord" aria-label="Passord"><div class="skb-gate-err" aria-live="polite"></div>' +
      '<div class="skb-gate-row"><button type="submit" class="skb-gate-go">🔓 Åpne</button><button type="button" class="skb-gate-cancel">' + (opt.cancel || 'Avbryt') + '</button></div></form>' +
      '<p class="skb-gate-note">Har du ikke passord? Gå til <a href="om.html#kontakt">Om</a> for å høre hvordan du kan få tilgang.</p></div>';
    const st = document.createElement('style');
    st.textContent = '.skb-gate{position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.72);display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Nunito","Segoe UI",system-ui,sans-serif}' +
      '.skb-gate.full{background:#fff8ec}.skb-gate-box{background:#fff;border-radius:22px;padding:26px 24px;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center;color:#1f2937}' +
      '.skb-gate-ic{font-size:2.6rem}.skb-gate-box h2{margin:.2em 0 .3em;font-size:1.4rem}.skb-gate-box p{margin:.3em 0 1em;color:#4b5563;font-size:1rem;line-height:1.4}' +
      '.skb-gate-box input{width:100%;padding:12px 14px;border:2px solid #d1d5db;border-radius:12px;font-size:1.1rem;text-align:center}.skb-gate-box input:focus{outline:3px solid #fdba74;border-color:#f97316}' +
      '.skb-gate-err{color:#dc2626;font-weight:700;min-height:1.4em;margin:6px 0;font-size:.95rem}.skb-gate-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
      '.skb-gate-go{background:#f97316;color:#fff;border-radius:12px;padding:11px 22px;font-weight:800;font-size:1.05rem}.skb-gate-cancel{background:#f3f4f6;border-radius:12px;padding:11px 18px;font-weight:700}' +
      '.skb-gate-box .skb-gate-note{font-size:.85rem;margin:1em 0 0;color:#6b7280}.skb-gate-box a{color:#c2410c;font-weight:700}.skb-shake{animation:skbshake .35s}@keyframes skbshake{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}';
    ov.prepend(st);
    if(opt.full) ov.classList.add('full');
    (document.body || document.documentElement).appendChild(ov);
    const inp = ov.querySelector('input'), err = ov.querySelector('.skb-gate-err'), box = ov.querySelector('.skb-gate-box');
    setTimeout(() => inp.focus(), 30);
    const close = () => ov.remove();
    ov.querySelector('form').onsubmit = e => { e.preventDefault();
      if(Gate.check(inp.value)){ close(); if(ok) ok(); }
      else { err.textContent = 'Det er feil passord. Prøv igjen.'; inp.select(); box.classList.remove('skb-shake'); void box.offsetWidth; box.classList.add('skb-shake'); } };
    ov.querySelector('.skb-gate-cancel').onclick = () => { close(); if(no) no(); };
    ov.addEventListener('keydown', e => { if(e.key === 'Escape'){ close(); if(no) no(); } });
  }
};
if(!Gate.ok()) document.documentElement.classList.add('skb-locked');
const me = document.currentScript;
if(me && me.dataset.gate === 'page' && !Gate.ok()){
  const go = () => Gate.ask(null, () => { location.href = me.dataset.back || 'index.html'; }, {full:true, title:'Passord kreves', text:'Denne delen er stengt for gjennomsyn. Skriv inn passordet for å åpne den.', cancel:'← Tilbake'});
  if(document.body) go(); else document.addEventListener('DOMContentLoaded', go);
}
})();
