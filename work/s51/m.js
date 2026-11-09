/* mascotes do guia (S51) — traço suave, cores da loja, olhos grandes com brilho, bochechas rosadas */
const DEFS=`<defs>
<radialGradient id="gA" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#fde8f2"/><stop offset=".6" stop-color="#f1b9d4"/><stop offset="1" stop-color="#d98bb4"/></radialGradient>
<radialGradient id="gC" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#fbeef4"/><stop offset="1" stop-color="#ecd0de"/></radialGradient>
<radialGradient id="gD" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#c98bb0"/><stop offset=".65" stop-color="#9c4b7b"/><stop offset="1" stop-color="#76325c"/></radialGradient>
<radialGradient id="sh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2a1f27" stop-opacity=".18"/><stop offset="1" stop-color="#2a1f27" stop-opacity="0"/></radialGradient>
<linearGradient id="lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#e6f0fa" stop-opacity=".25"/></linearGradient>
</defs>`;
function olho(x,y,r,o){o=o||{};const pis=o.pisca;if(pis)return `<path d="M${x-r*.7} ${y} q${r*.7} ${r*.6} ${r*1.4} 0" stroke="#3a2632" stroke-width="${r*.32}" fill="none" stroke-linecap="round"/>`;
 const lx=(o.olha||0)*r*.25;return `<ellipse cx="${x}" cy="${y}" rx="${r*.62}" ry="${r*.72}" fill="#3a2632"/><circle cx="${x+lx-r*.18}" cy="${y-r*.26}" r="${r*.24}" fill="#fff"/><circle cx="${x+lx+r*.2}" cy="${y+r*.22}" r="${r*.1}" fill="#fff"/>`}
function oculos(cx,cy,r,gap,cor){return `<g fill="url(#lens)" stroke="${cor||'#8d3a69'}" stroke-width="${r*.16}"><circle cx="${cx-gap}" cy="${cy}" r="${r}"/><circle cx="${cx+gap}" cy="${cy}" r="${r}"/></g><path d="M${cx-gap+r} ${cy-r*.15} q${gap-r} ${-r*.45} ${2*(gap-r)} 0" stroke="${cor||'#8d3a69'}" stroke-width="${r*.16}" fill="none" stroke-linecap="round"/><path d="M${cx-gap-r*.55} ${cy-r*.45} l${r*.35} ${-r*.2}" stroke="#fff" stroke-width="${r*.12}" stroke-linecap="round"/>`}
function braco(x,y,ang,len,cor,th){const a=ang*Math.PI/180,ex=x+Math.cos(a)*len,ey=y+Math.sin(a)*len;return `<path d="M${x} ${y} L${ex} ${ey}" stroke="${cor}" stroke-width="${th}" stroke-linecap="round"/><circle cx="${ex}" cy="${ey}" r="${th*.62}" fill="${cor}"/>`}
/* A · Gotinha: gota rosada, óculos redondos, golinha de jaleco */
function mA(o){o=o||{};const bl=o.bl||0;return `${DEFS}<ellipse cx="60" cy="124" rx="30" ry="5" fill="url(#sh)"/>
<g transform="translate(0 ${-bl})">
${braco(26,86,o.ae==null?130:o.ae,20,'#e7a6c7',10)}${braco(94,86,o.ad==null?50:o.ad,20,'#e7a6c7',10)}
<ellipse cx="46" cy="118" rx="9" ry="5" fill="#e7a6c7"/><ellipse cx="74" cy="118" rx="9" ry="5" fill="#e7a6c7"/>
<path d="M60 12 C88 12 102 46 102 76 C102 104 84 118 60 118 C36 118 18 104 18 76 C18 46 32 12 60 12Z" fill="url(#gA)"/>
<path d="M40 104 L60 116 L80 104 L76 118 L44 118Z" fill="#fff" opacity=".9"/><path d="M60 116 L60 106" stroke="#d98bb4" stroke-width="1.5"/>
<ellipse cx="44" cy="32" rx="10" ry="6" fill="#fff" opacity=".55" transform="rotate(-28 44 32)"/>
${olho(46,62,10,o)}${olho(74,62,10,o)}${oculos(60,62,15,14)}
<ellipse cx="34" cy="82" rx="7" ry="4" fill="#ff9cc0" opacity=".55"/><ellipse cx="86" cy="82" rx="7" ry="4" fill="#ff9cc0" opacity=".55"/>
${o.feliz?'<path d="M52 84 q8 9 16 0 Z" fill="#8d3a69"/>':'<path d="M54 85 q6 5 12 0" stroke="#8d3a69" stroke-width="3" fill="none" stroke-linecap="round"/>'}
</g>`}
/* B · Lentinho: ele é o próprio óculos */
function mB(o){o=o||{};return `${DEFS}<ellipse cx="60" cy="124" rx="34" ry="5" fill="url(#sh)"/>
<path d="M44 92 l-6 24 M76 92 l6 24" stroke="#8d3a69" stroke-width="6" stroke-linecap="round"/><ellipse cx="36" cy="117" rx="8" ry="4" fill="#8d3a69"/><ellipse cx="84" cy="117" rx="8" ry="4" fill="#8d3a69"/>
${braco(10,60,140,18,'#8d3a69',6)}${braco(110,60,40,18,'#8d3a69',6)}
<g fill="#fff8fb" stroke="#8d3a69" stroke-width="7"><rect x="10" y="38" width="46" height="50" rx="23"/><rect x="64" y="38" width="46" height="50" rx="23"/></g>
<path d="M56 56 q4 -6 8 0" stroke="#8d3a69" stroke-width="7" fill="none" stroke-linecap="round"/>
${olho(33,62,11,o)}${olho(87,62,11,o)}
<ellipse cx="22" cy="80" rx="5" ry="3" fill="#ff9cc0" opacity=".6"/><ellipse cx="98" cy="80" rx="5" ry="3" fill="#ff9cc0" opacity=".6"/>
<path d="M54 78 q6 5 12 0" stroke="#8d3a69" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M18 46 l8 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`}
/* C · Mochi doutor: bolinha creme com espelho de testa */
function mC(o){o=o||{};return `${DEFS}<ellipse cx="60" cy="124" rx="32" ry="5" fill="url(#sh)"/>
${braco(24,90,135,16,'#ecd0de',10)}${braco(96,90,45,16,'#ecd0de',10)}
<ellipse cx="60" cy="80" rx="44" ry="40" fill="url(#gC)" stroke="#ecd0de" stroke-width="1.5"/>
<path d="M22 54 q38 -22 76 0" stroke="#8d3a69" stroke-width="5" fill="none"/><circle cx="60" cy="40" r="11" fill="#e8eef6" stroke="#8d3a69" stroke-width="3"/><circle cx="60" cy="40" r="3.5" fill="#8d3a69"/><path d="M54 35 l4 -2" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
${olho(45,78,9,o)}${olho(75,78,9,o)}${oculos(60,78,14,15)}
<ellipse cx="32" cy="96" rx="7" ry="4" fill="#ff9cc0" opacity=".55"/><ellipse cx="88" cy="96" rx="7" ry="4" fill="#ff9cc0" opacity=".55"/>
<path d="M55 99 q5 4 10 0" stroke="#8d3a69" stroke-width="3" fill="none" stroke-linecap="round"/>`}
/* D · Corujinha: coruja sábia de óculos */
function mD(o){o=o||{};return `${DEFS}<ellipse cx="60" cy="124" rx="30" ry="5" fill="url(#sh)"/>
<path d="M26 26 l10 18 M94 26 l-10 18" stroke="#76325c" stroke-width="9" stroke-linecap="round"/>
<path d="M60 22 C92 22 100 52 100 78 C100 106 84 120 60 120 C36 120 20 106 20 78 C20 52 28 22 60 22Z" fill="url(#gD)"/>
<path d="M22 70 q-10 20 4 38 M98 70 q10 20 -4 38" stroke="#76325c" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="60" cy="96" rx="22" ry="18" fill="#f6dbe8"/><path d="M52 92 q4 3 8 0 q4 3 8 0 M50 100 q5 3 10 0 q5 3 10 0" stroke="#e0aac6" stroke-width="2" fill="none"/>
<circle cx="45" cy="60" r="14" fill="#fff"/><circle cx="75" cy="60" r="14" fill="#fff"/>${olho(45,60,9,o)}${olho(75,60,9,o)}${oculos(60,60,15,15,'#2a1f27')}
<path d="M56 74 l4 6 l4 -6 Z" fill="#f2b24c"/><path d="M50 118 l-4 4 M54 118 v5 M66 118 v5 M70 118 l4 4" stroke="#f2b24c" stroke-width="3" stroke-linecap="round"/>`}
function svg(fn,o,w,h){return `<svg viewBox="0 0 120 130" width="${w||120}" height="${h||130}" fill="none">${fn(o)}</svg>`}
