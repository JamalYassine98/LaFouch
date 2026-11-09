/* Mochi doutor (S52, caprichado) */
const MD=`<defs>
<radialGradient id="mb" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff7fa"/><stop offset=".85" stop-color="#f6dfea"/><stop offset="1" stop-color="#ecc9da"/></radialGradient>
<radialGradient id="mh" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3d6e4"/></radialGradient>
<radialGradient id="msh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5a2a46" stop-opacity=".22"/><stop offset="1" stop-color="#5a2a46" stop-opacity="0"/></radialGradient>
<radialGradient id="mir" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e4ecf6"/><stop offset="1" stop-color="#b9c8da"/></radialGradient>
<linearGradient id="mlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#e8f0fa" stop-opacity=".04"/></linearGradient>
<radialGradient id="mbl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff8fb8" stop-opacity=".75"/><stop offset="1" stop-color="#ff8fb8" stop-opacity="0"/></radialGradient>
</defs>`;
function mOlho(x,y,o){if(o.pisca)return `<path d="M${x-7} ${y+1} q7 6 14 0" stroke="#3a2632" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
 if(o.feliz)return `<path d="M${x-7} ${y+3} q7 -8 14 0" stroke="#3a2632" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
 const lx=(o.olha||0)*2.2;return `<ellipse cx="${x+lx}" cy="${y}" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="${x+lx}" cy="${y+3.5}" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="${x+lx-2.4}" cy="${y-3}" r="2.6" fill="#fff"/><circle cx="${x+lx+2.6}" cy="${y+2.6}" r="1.1" fill="#fff"/>`}
function mBraco(sx,sy,ang,item){const a=ang*Math.PI/180,L=21,ex=sx+Math.cos(a)*L,ey=sy+Math.sin(a)*L;
 let s=`<path d="M${sx} ${sy} Q${(sx+ex)/2+Math.sin(a)*3} ${(sy+ey)/2-Math.cos(a)*3} ${ex} ${ey}" stroke="#e8c3d6" stroke-width="12.5" stroke-linecap="round" fill="none"/><path d="M${sx} ${sy} Q${(sx+ex)/2+Math.sin(a)*3} ${(sy+ey)/2-Math.cos(a)*3} ${ex} ${ey}" stroke="url(#mh)" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="${ex}" cy="${ey}" r="6.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/>`;
 if(item==='vara'){const b=(ang-25)*Math.PI/180;s=`<path d="M${ex} ${ey} l${Math.cos(b)*52} ${Math.sin(b)*52}" stroke="#c9915f" stroke-width="4.5" stroke-linecap="round"/><circle cx="${ex+Math.cos(b)*54}" cy="${ey+Math.sin(b)*54}" r="5" fill="#8d3a69"/><circle cx="${ex+Math.cos(b)*54-1.5}" cy="${ey+Math.sin(b)*54-1.5}" r="1.6" fill="#fff" opacity=".8"/>`+s}
 return s}
function mochi(o){o=o||{};const bl=o.bl||0,sq=o.sq||0;
 return `${MD}<ellipse cx="60" cy="125" rx="34" ry="5.5" fill="url(#msh)"/>
<g transform="translate(60 124) scale(${1+sq*.06} ${1-sq*.08}) translate(-60 -124) translate(0 ${-bl})">
<ellipse cx="44" cy="120" rx="10" ry="5.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/><ellipse cx="76" cy="120" rx="10" ry="5.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/>
<path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#mb)" stroke="#ecc9da" stroke-width="1.4"/>
<path d="M28 64 C30 48 42 38 58 36" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>
${mBraco(22,94,o.ae==null?140:o.ae,o.ie)}${mBraco(98,94,o.ad==null?40:o.ad,o.id)}
<path d="M17 66 Q60 44 103 66" stroke="#8d3a69" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<circle cx="60" cy="47" r="12" fill="url(#mir)" stroke="#8d3a69" stroke-width="3"/><circle cx="60" cy="47" r="3.2" fill="#8d3a69"/><path d="M53.5 42 q3 -3 7 -3.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
${mOlho(45,83,o)}${mOlho(75,83,o)}
<g fill="url(#mlz)" stroke="#8d3a69" stroke-width="2.6"><circle cx="45" cy="83" r="13"/><circle cx="75" cy="83" r="13"/></g><path d="M58 81 q2 -2.5 4 0" stroke="#8d3a69" stroke-width="2.6" fill="none"/>
<path d="M36 76 l4 -2.5 M66 76 l4 -2.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="31" cy="101" rx="9" ry="5.5" fill="url(#mbl)"/><ellipse cx="89" cy="101" rx="9" ry="5.5" fill="url(#mbl)"/>
${o.feliz?'<path d="M53 101 q7 8 14 0 Z" fill="#8d3a69"/><path d="M56 104 q4 3 8 0" fill="#ff8fb8"/>':o.fala?'<ellipse cx="60" cy="103" rx="4" ry="3.2" fill="#8d3a69"/>':'<path d="M54.5 101.5 q2.75 3 5.5 0 q2.75 3 5.5 0" stroke="#8d3a69" stroke-width="2.6" fill="none" stroke-linecap="round"/>'}
</g>`}
function mSvg(o,w,h){return `<svg viewBox="0 0 120 130" width="${w||120}" height="${h||130}" fill="none" style="overflow:visible">${mochi(o)}</svg>`}
