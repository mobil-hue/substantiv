/* Skoleboken: felles meny og bunn, bøker og kontaktinfo. Legg til bøker i BOOKS. */
(function(){
'use strict';
const SKB = window.SKB = {
  /* kontakt: legg inn e-post eller lenke her, så vises den på Om-siden (tomt = skjult) */
  contact: '',
  /* bøker: kort beskrivelse og forsidebilde er åpent; selve innholdet krever passord */
  BOOKS: [
    {id:'voksen', href:'voksen.html', emoji:'🧑‍🏫', c1:'#0f766e', c2:'#14b8a6', title:'Norsk for voksne', sub:'Ordbok og setninger',
     desc:'De 100 og 500 vanligste ordene, hverdagsord og hverdagssetninger med uttale, eksempler og quiz.'},
    {id:'gange', href:'multiplikasjon.html', emoji:'🧮', c1:'#c2410c', c2:'#f59e0b', title:'Gange – lær og øv', sub:'Gangetabellen',
     desc:'Lær gangetabellen steg for steg med korte videoer, så øver du til du er rask og trygg.', extra:[['multiplikasjon-laerer.html', 'Lærerside']]},
    {id:'geometri', href:'geometri.html', emoji:'📐', c1:'#1d4ed8', c2:'#38bdf8', title:'Geometri', sub:'Figurer og måling',
     desc:'Figurer, vinkler og måling: forstå først, så øve på flere nivåer.', extra:[['geometri-laerer.html', 'Lærerside']]},
    {id:'gangespill', href:'gange.html', emoji:'🎯', c1:'#7c3aed', c2:'#ec4899', title:'Gangespill', sub:'Rask trening',
     desc:'Spillbasert trening av gangetabellen. Ingen poeng sendes noe sted, alt blir på din egen maskin.'}
  ]
};
const PAGES = [['index.html', 'Gratis', ''], ['boker.html', 'Bøker', '🔒'], ['matte.html', 'Matematikk', '🔒'], ['om.html', 'Om', '']];
SKB.nav = function(active){
  const el = document.createElement('header'); el.className = 'sk-nav';
  el.innerHTML = '<div class="sk-wrap"><a class="sk-logo" href="index.html" aria-label="Skoleboken, til forsiden"><i>📚</i>Skoleboken</a><nav class="sk-links" aria-label="Hovedmeny">' +
    PAGES.map(p => `<a href="${p[0]}" class="${p[0] === active ? 'on' : ''}" ${p[0] === active ? 'aria-current="page"' : ''}>${p[1]}${p[2] ? ` <span class="lk">${p[2]}</span>` : ''}</a>`).join('') + '</nav></div>';
  document.body.prepend(el);
};
SKB.foot = function(){
  const f = document.createElement('footer'); f.className = 'sk-foot';
  f.innerHTML = '<div class="sk-wrap">🧪 Et hobbyprosjekt laget med KI og uten menneskelig kvalitetskontroll, så feil kan forekomme. Ingenting sendes til oss: fremgang lagres bare i din egen nettleser. <a href="om.html">Les mer</a></div>';
  document.body.append(f);
};
SKB.init = function(active){ SKB.nav(active); SKB.foot(); };
})();
