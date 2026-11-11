var FULL="M-40 -60 L160 -60 L160 200 L-40 200 Z";
var SH='<path d="M38 77 l3.2 -2 M68 77 l3.2 -2" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>';
function heart(cx){return `M${cx} 93 C${cx-7} 88.5 ${cx-11.5} 84.5 ${cx-11.5} 79.6 C${cx-11.5} 75.8 ${cx-8.7} 73.4 ${cx-5.7} 73.4 C${cx-3.3} 73.4 ${cx-1.2} 74.9 ${cx} 77 C${cx+1.2} 74.9 ${cx+3.3} 73.4 ${cx+5.7} 73.4 C${cx+8.7} 73.4 ${cx+11.5} 75.8 ${cx+11.5} 79.6 C${cx+11.5} 84.5 ${cx+7} 88.5 ${cx} 93Z`}
function flor(x,y,r,c,c2,rot){let p='';for(let i=0;i<5;i++){const a=(rot+i*72)*Math.PI/180;p+=`<circle cx="${(x+Math.cos(a)*r*.62).toFixed(2)}" cy="${(y+Math.sin(a)*r*.62).toFixed(2)}" r="${(r*.52).toFixed(2)}" fill="${c}"/>`}return `<g>${p}<circle cx="${x}" cy="${y}" r="${(r*.34).toFixed(2)}" fill="${c2}"/><circle cx="${x-r*.1}" cy="${y-r*.1}" r="${(r*.12).toFixed(2)}" fill="#fff" opacity=".7"/></g>`}
function folha(x,y,rot){return `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="1.9" transform="rotate(${rot} ${x} ${y})" fill="#5f9e6e"/><path d="M${x-3.4} ${y} L${x+3.4} ${y}" transform="rotate(${rot} ${x} ${y})" stroke="#3f7d52" stroke-width=".5"/>`}
// Dia das Mães: coroa de flores + óculos de coração rosé
var coroa='<path d="M20 56 Q60 22 100 56" stroke="#5f9e6e" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
 folha(24,51,-50)+folha(33,42,-35)+folha(49,33.5,-15)+folha(71,33.5,15)+folha(87,42,35)+folha(96,51,50)+folha(40,36,150)+folha(80,36,30)+
 '<g fill="#fff" opacity=".95"><circle cx="28" cy="44.5" r="1.3"/><circle cx="45" cy="33" r="1.2"/><circle cx="75" cy="33" r="1.2"/><circle cx="92" cy="44.5" r="1.3"/><circle cx="54" cy="29" r="1"/><circle cx="66" cy="29" r="1"/></g>'+
 flor(23,54,6.2,'#f6b6c8','#e6a23c',10)+flor(37,40,7,'#e9739a','#f3c34f',30)+flor(60,32,8,'#f6b6c8','#e6a23c',-18)+flor(83,40,7,'#e9739a','#f3c34f',50)+flor(97,54,6.2,'#f6b6c8','#e6a23c',0)+
 flor(48,34.5,4.2,'#fbd9e3','#e6a23c',0)+flor(72,34.5,4.2,'#fbd9e3','#e6a23c',20);
var ROSE='<defs><linearGradient id="lftrs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3c7b8"/><stop offset=".5" stop-color="#c98470"/><stop offset="1" stop-color="#e9b3a2"/></linearGradient></defs>';
TEMA_M.maes={corte:FULL,tr:'',fr:'<g transform="translate(60 0) scale(.9 1) translate(-60 5)">'+coroa+'</g>',
 ocl:ROSE+`<path d="${heart(45)}" fill="url(#lfmlz)" stroke="url(#lftrs)" stroke-width="2.3" stroke-linejoin="round"/><path d="${heart(75)}" fill="url(#lfmlz)" stroke="url(#lftrs)" stroke-width="2.3" stroke-linejoin="round"/><path d="M56.3 79 Q60 75.6 63.7 79" stroke="#c98470" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M33.6 79 C26 78 21 78 16.5 79" fill="none" stroke="#c98470" stroke-width="2.4" stroke-linecap="round"/><path d="M86.4 79 C94 78 99 78 103.5 79" fill="none" stroke="#c98470" stroke-width="2.4" stroke-linecap="round"/>`+SH,
 fundo:'<g fill="#f2a7bf"><path d="M-4 70 c-2.4-2.2-4.6-4-4.6-6.2 0-1.5 1.1-2.5 2.4-2.5 1 0 1.8.6 2.2 1.4.4-.8 1.2-1.4 2.2-1.4 1.3 0 2.4 1 2.4 2.5 0 2.2-2.2 4-4.6 6.2z"/><path d="M118 40 c-1.8-1.6-3.4-3-3.4-4.6 0-1.1.8-1.9 1.8-1.9.7 0 1.3.4 1.6 1 .3-.6.9-1 1.6-1 1 0 1.8.8 1.8 1.9 0 1.6-1.6 3-3.4 4.6z"/><path d="M114 104 c-1.5-1.4-2.9-2.6-2.9-4 0-1 .7-1.6 1.5-1.6.6 0 1.1.3 1.4.9.3-.6.8-.9 1.4-.9.8 0 1.5.6 1.5 1.6 0 1.4-1.4 2.6-2.9 4z"/></g>'};
// Dia dos Pais: chapéu fedora azul-marinho + óculos clubmaster (tartaruga + dourado)
var FED='<defs><linearGradient id="lftfd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#26354d"/><stop offset=".35" stop-color="#3c5070"/><stop offset=".7" stop-color="#2b3b55"/><stop offset="1" stop-color="#1c2739"/></linearGradient><linearGradient id="lftgo3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c3922a"/><stop offset=".5" stop-color="#f6dc8c"/><stop offset="1" stop-color="#c3922a"/></linearGradient></defs>';
TEMA_M.pais={corte:"M-40 53 L160 53 L160 200 L-40 200 Z",
 tr:'<ellipse cx="60" cy="52.5" rx="57" ry="9.5" fill="#1c2739"/><ellipse cx="60" cy="52" rx="49" ry="6.8" fill="#121a28"/>',
 fr:FED+'<path d="M3 52.5 A57 9.5 0 0 0 117 52.5 Z" fill="#26354d"/><path d="M5 53.6 Q60 66 115 53.6" stroke="#4a5f82" stroke-width="1" fill="none" opacity=".8"/>'+
  '<path d="M25 54 C24 40 25 27 30 19 C35 13.5 46 13 52 16.5 C56 18.6 64 18.6 68 16.5 C74 13 85 13.5 90 19 C95 27 96 40 95 54 Q60 60 25 54Z" fill="url(#lftfd)"/>'+
  '<path d="M52 16.5 C56 22 64 22 68 16.5" stroke="#1c2739" stroke-width="1.4" fill="none" opacity=".8"/><path d="M60 21 L60 33" stroke="#1c2739" stroke-width="1.1" opacity=".45"/>'+
  '<path d="M32 22 C35 18 40 16 45 16" stroke="#fff" stroke-width="1.8" opacity=".22" fill="none" stroke-linecap="round"/>'+
  '<path d="M25.2 44 Q60 50.5 94.8 44 L95 54 Q60 60 25 54Z" fill="#141c2a"/><path d="M25.3 45.5 Q60 52 94.7 45.5" stroke="url(#lftgo3)" stroke-width=".9" fill="none" opacity=".9"/>'+
  '<path d="M80 46.5 l3 -1.2 1.6 7.6 -3 1z" fill="#a6743d"/><path d="M83.8 45.2 q4 -1 6 1.5 l-1 6 q-2.6 -1.4 -5 .6z" fill="#8b5e31" opacity=".9"/>',
 ocl:FED+`<rect x="34.6" y="74.6" width="20.8" height="17" rx="6.5" fill="url(#lfmlz)"/><rect x="64.6" y="74.6" width="20.8" height="17" rx="6.5" fill="url(#lfmlz)"/>`+
  `<rect x="34.6" y="74.6" width="20.8" height="17" rx="6.5" fill="none" stroke="url(#lftgo3)" stroke-width="1.2"/><rect x="64.6" y="74.6" width="20.8" height="17" rx="6.5" fill="none" stroke="url(#lftgo3)" stroke-width="1.2"/>`+
  `<path d="M34.4 81 Q34 74.4 41 74.2 L49 74.2 Q55.6 74.4 55.6 79.5" stroke="#4a2c1a" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M64.4 79.5 Q64.4 74.4 71 74.2 L79 74.2 Q86 74.4 85.6 81" stroke="#4a2c1a" stroke-width="3.6" fill="none" stroke-linecap="round"/>`+
  `<path d="M37 75.4 L44 75.2 M67 75.2 L74 75.4" stroke="#8a5a36" stroke-width="1" stroke-linecap="round" opacity=".9"/><path d="M55.4 79.6 Q60 76.4 64.6 79.6" stroke="url(#lftgo3)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`+
  `<path d="M34.2 79.5 C26 78.5 21 78 16.5 79" fill="none" stroke="#4a2c1a" stroke-width="2.6" stroke-linecap="round"/><path d="M85.8 79.5 C94 78.5 99 78 103.5 79" fill="none" stroke="#4a2c1a" stroke-width="2.6" stroke-linecap="round"/>`+
  `<circle cx="35.4" cy="79.4" r="1.1" fill="#e6c36a"/><circle cx="84.6" cy="79.4" r="1.1" fill="#e6c36a"/>`+SH,
 fundo:'<g fill="#9aabc4"><path d="M-4 66 l1.6 -4.8 1.6 4.8 4.8 1.6 -4.8 1.6 -1.6 4.8 -1.6 -4.8 -4.8 -1.6z"/><path d="M115 40 l1.2 -3.6 1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2z"/></g>'};

TEMA_M.pais.fr='<g transform="translate(60 0) scale(1.12 1) translate(-60 0)">'+TEMA_M.pais.fr+'</g>';TEMA_M.pais.tr='<g transform="translate(60 0) scale(1.12 1) translate(-60 0)">'+TEMA_M.pais.tr+'</g>';
