(function(){
'use strict';
/* Lærerinnen i hjørnet («snakkefirkant» som ved tolking). Munnen beveger seg når class «talking» er på (se css/board.css). */
const A = window.App;
A.teacherHTML = () => `<div class="teacher" aria-hidden="true"><svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 120 C10 92 32 84 60 84 C88 84 110 92 114 120 Z" fill="#3b8f84"/>
  <path d="M44 85 L60 106 L76 85 Z" fill="#fff7ea"/>
  <path d="M60 106 L60 120" stroke="#2f776d" stroke-width="2"/>
  <rect x="52" y="70" width="16" height="20" rx="6" fill="#efc09a"/>
  <g class="head">
    <circle cx="60" cy="16" r="12" fill="#c4c0b8"/>
    <rect x="52" y="24" width="16" height="5" rx="2.5" fill="#d9534f"/>
    <ellipse cx="60" cy="52" rx="32" ry="31" fill="#c4c0b8"/>
    <circle cx="36" cy="63" r="2.2" fill="#fff"/><circle cx="84" cy="63" r="2.2" fill="#fff"/>
    <ellipse cx="60" cy="55" rx="24" ry="27" fill="#f6d1ae"/>
    <path d="M35 52 C36 31 84 31 85 52 C77 41 67 37 60 37 C53 37 43 41 35 52 Z" fill="#c4c0b8"/>
    <circle cx="45" cy="65" r="5" fill="#f4a3a0" opacity=".5"/><circle cx="75" cy="65" r="5" fill="#f4a3a0" opacity=".5"/>
    <path d="M43 46 Q50 42.5 56 45.5" stroke="#8b8680" fill="none" stroke-width="2" stroke-linecap="round"/>
    <path d="M64 45.5 Q70 42.5 77 46" stroke="#8b8680" fill="none" stroke-width="2" stroke-linecap="round"/>
    <g class="eyes"><ellipse cx="50" cy="55" rx="2.8" ry="3.4" fill="#3a2a22"/><ellipse cx="70" cy="55" rx="2.8" ry="3.4" fill="#3a2a22"/>
      <circle cx="51" cy="53.8" r=".9" fill="#fff"/><circle cx="71" cy="53.8" r=".9" fill="#fff"/></g>
    <circle cx="50" cy="55" r="9" fill="none" stroke="#8a4f9e" stroke-width="1.8"/><circle cx="70" cy="55" r="9" fill="none" stroke="#8a4f9e" stroke-width="1.8"/>
    <path d="M59 54.5 L61 54.5" stroke="#8a4f9e" stroke-width="1.8"/>
    <path d="M60 59 q-2.4 6 1 7.4" stroke="#d9a47f" fill="none" stroke-width="1.6" stroke-linecap="round"/>
    <path class="m-c" d="M51 72 Q60 80 69 72" stroke="#b5483f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <g class="m-o"><ellipse cx="60" cy="74" rx="6.5" ry="5" fill="#7d2a2a"/><ellipse cx="60" cy="76.2" rx="3.6" ry="1.9" fill="#e06b6b"/></g>
  </g>
</svg></div>`;
})();
