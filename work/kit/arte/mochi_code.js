window.__M=(function(){
/* 09/11 Mochi aprovado (S73–S86): bracinhos em gota que nascem atrás do corpo; nos gestos de rosto o braço passa para a frente
   inteiro, com união suave só na raiz (S82/S83); no "ajusta os óculos" a troca de camada acontece com o braço parado (S86).
   Óculos com hastes, brilho da cabeça corrigido, espelho de testa no centro (A), ponteiro de mãozinha com cabo vinho maior (S58 A + S70).
   Gestos S72/S74 com as animações S83–S85 (ajusta pela haste, tapinha que balança o espelho, limpeza com borrifador e flanela).
   Cada quadro é desenhado por um "esqueleto" (rig) que só troca atributos — nada de redesenhar o SVG inteiro. */
const ARMP=L=>`M0 -10 C${L*.45} -11 ${L-2} -8.5 ${L} -1 C${L+1.5} 5 ${L-4} 9 ${L-9} 8.5 C${L*.45} 8 ${L*.2} 10 0 10 Z`;
const ARMH=L=>`M${L*.35} -5 Q${L*.62} -6.5 ${L*.8} -3.5`,ARMHF=L=>`M${L*.42} -5 Q${L*.66} -6.5 ${L*.84} -3.5`;
const armT=(lado,ang)=>{const sx=lado<0?22:98,rot=lado<0?180-ang:ang;return `translate(${sx} 92) rotate(${rot.toFixed(2)})${lado<0?' scale(1 -1)':''}`};
const dentro=(lado,ang,L)=>{const sx=lado<0?22:98,r=(lado<0?180-ang:ang)*Math.PI/180,x=sx+Math.cos(r)*(L-4),y=92+Math.sin(r)*(L-4);return Math.hypot((x-60)/46,(y-80)/44)};
const tipXY=(lado,ang,L)=>{const sx=lado<0?22:98,r=(lado<0?180-ang:ang)*Math.PI/180;return [sx+Math.cos(r)*(L-5),92+Math.sin(r)*(L-5)]};
const E=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,EO=t=>1-Math.pow(1-t,3),cl=(x,a,b)=>Math.min(b,Math.max(a,x)),win=(t,a,b,f)=>cl(Math.min((t-a)/f,(b-t)/f),0,1);
function tr(k,t){let i=0;while(i<k.length-2&&k[i+1][0]<=t)i++;const a=k[i],b=k[i+1];const u=cl((t-a[0])/(b[0]-a[0]||1),0,1);return a[1]+(b[1]-a[1])*E(u)}
const rnd=k=>{const x=Math.sin(k*127.1+3.7)*43758.5453;return x-Math.floor(x)};
const ARM=(c,front)=>front?`<g class="${c}"><g class="t"><path class="s" transform="translate(2 3)" fill="#c98aab" opacity=".2" filter="url(#lfmsb)"/><path class="p" fill="url(#lfmh)" stroke="#e3b3cc" stroke-width="1.7"/><path class="h" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/></g><g clip-path="url(#lfmcc)"><rect x="-60" y="-40" width="260" height="220" fill="url(#lfmbU)" mask="url(#lfmk${c.slice(-1)})"/></g></g>`
 :`<g class="${c}"><path class="p" fill="url(#lfmh)" stroke="#e8c3d6" stroke-width="1.6"/><path class="h" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/></g>`;
const MK=l=>`<linearGradient id="lfmg${l}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="8" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="lfmk${l}" maskUnits="userSpaceOnUse" x="-60" y="-40" width="260" height="220"><g class="mk${l}"><path transform="translate(-1 0) scale(1 1.08)" fill="url(#lfmg${l})"/></g></mask>`;
const LUVA='<rect x="-6" y="-9" width="7" height="18" rx="2.5" fill="#8d3a69"/><rect x="0" y="-8" width="17" height="16" rx="6" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><rect class="dedo" x="12" y="-7.5" width="20" height="6.5" rx="3.2" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><ellipse cx="7" cy="-8.5" rx="4.5" ry="3" fill="#fff" stroke="#8d3a69" stroke-width="1.6"/>';
const HASTES='<path d="M32 81 C26 79 21 78 16.5 79" fill="none" stroke="#8d3a69" stroke-width="2.6" stroke-linecap="round"/><path d="M88 81 C94 79 99 78 103.5 79" fill="none" stroke="#8d3a69" stroke-width="2.6" stroke-linecap="round"/><circle cx="32.5" cy="81" r="1.8" fill="#e7a6c7"/><circle cx="87.5" cy="81" r="1.8" fill="#e7a6c7"/>';
var MOCHI_SVG=`<svg viewBox="-6 24 132 110" width="100%" height="100%" fill="none" style="overflow:visible"><defs>
<radialGradient id="lfmb" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff7fa"/><stop offset=".85" stop-color="#f6dfea"/><stop offset="1" stop-color="#ecc9da"/></radialGradient>
<radialGradient id="lfmbU" gradientUnits="userSpaceOnUse" cx="49" cy="55.8" r="73.6"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff7fa"/><stop offset=".85" stop-color="#f6dfea"/><stop offset="1" stop-color="#ecc9da"/></radialGradient>
<radialGradient id="lfmh" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3d6e4"/></radialGradient>
<radialGradient id="lfmsh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#5a2a46" stop-opacity=".22"/><stop offset="1" stop-color="#5a2a46" stop-opacity="0"/></radialGradient>
<radialGradient id="lfmir" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#e4ecf6"/><stop offset="1" stop-color="#b9c8da"/></radialGradient>
<linearGradient id="lfmlz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#e8f0fa" stop-opacity=".04"/></linearGradient>
<radialGradient id="lfmbl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff8fb8" stop-opacity=".75"/><stop offset="1" stop-color="#ff8fb8" stop-opacity="0"/></radialGradient>
<radialGradient id="lfmnv"><stop offset="0" stop-color="#eecfe0" stop-opacity=".95"/><stop offset=".6" stop-color="#f4dde9" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<clipPath id="lfmcc"><path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z"/></clipPath>
<clipPath id="lfmzE"><circle cx="45" cy="83" r="12"/></clipPath><clipPath id="lfmzD"><circle cx="75" cy="83" r="12"/></clipPath>
<filter id="lfmsb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
<filter id="lfmnb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.3"/></filter>
${MK('e')}${MK('d')}
</defs>
<ellipse class="sombra" cx="60" cy="125" rx="34" ry="5.5" fill="url(#lfmsh)"/>
<g class="sq"><g class="tilt"><g class="pulo"><g class="resp">
 <g class="itB"></g>
 ${ARM('aBe')}${ARM('aBd')}
 <g class="pe1"><ellipse cx="44" cy="120" rx="10" ry="5.5" fill="url(#lfmh)" stroke="#ecc9da" stroke-width="1.2"/></g><g class="pe2"><ellipse cx="76" cy="120" rx="10" ry="5.5" fill="url(#lfmh)" stroke="#ecc9da" stroke-width="1.2"/></g>
 <path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#lfmb)" stroke="#ecc9da" stroke-width="1.4"/>
 <path d="M30 62 C32 50 41 42 54 39" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>
 
 <g class="esp" style="transform-origin:60px 58px"><g class="espT"><circle cx="60" cy="47" r="12" fill="url(#lfmir)" stroke="#8d3a69" stroke-width="3"/><circle cx="60" cy="47" r="3.2" fill="#8d3a69"/><path d="M53.5 42 q3 -3 7 -3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g></g>
 <g class="olhos"><g class="pis"><g class="pup">
  <ellipse cx="45" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="45" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="42.6" cy="80" r="2.6" fill="#fff"/><circle cx="47.6" cy="85.6" r="1.1" fill="#fff"/>
  <ellipse cx="75" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="75" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="72.6" cy="80" r="2.6" fill="#fff"/><circle cx="77.6" cy="85.6" r="1.1" fill="#fff"/>
 </g></g></g>
 <g class="olhosF" opacity="0"><path d="M38 86 q7 -8 14 0 M68 86 q7 -8 14 0" stroke="#3a2632" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
 <g class="olhosZ" opacity="0"><path d="M38 84 q7 6 14 0 M68 84 q7 6 14 0" stroke="#3a2632" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>
 <g class="ocl"><g class="oclT"><g fill="url(#lfmlz)" stroke="#8d3a69" stroke-width="2.6"><circle cx="45" cy="83" r="13"/><circle cx="75" cy="83" r="13"/></g><path d="M58 81 q2 -2.5 4 0" stroke="#8d3a69" stroke-width="2.6" fill="none"/>
 <path d="M36 76 l4 -2.5 M66 76 l4 -2.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><g class="fog"></g>${HASTES}</g></g>
 <ellipse cx="31" cy="101" rx="9" ry="5.5" fill="url(#lfmbl)"/><ellipse cx="89" cy="101" rx="9" ry="5.5" fill="url(#lfmbl)"/>
 <g class="bW"><path d="M54.5 101.5 q2.75 3 5.5 0 q2.75 3 5.5 0" stroke="#8d3a69" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>
 <g class="bO" opacity="0"><ellipse cx="60" cy="103" rx="4" ry="3.4" fill="#8d3a69"/></g>
 <g class="bF" opacity="0"><path d="M53 101 q7 8 14 0 Z" fill="#8d3a69"/><path d="M56 104 q4 3 8 0" fill="#ff8fb8"/></g>
 <g class="bH" opacity="0"><path d="M55 103 q3 -1.6 6 -.4 q2.6 1 4.4 -.6" stroke="#8d3a69" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
 <g class="bY" opacity="0"><ellipse cx="60" cy="104" rx="5" ry="6.2" fill="#8d3a69"/><ellipse cx="60" cy="107" rx="3" ry="2" fill="#ff8fb8"/></g>
 ${ARM('aFe',1)}${ARM('aFd',1)}
 <g class="pon" opacity="0"><g class="ponT"><circle class="mao" cx="25" cy="0" r="6" opacity="0"/><rect x="23" y="-3.2" width="14.7" height="6.4" rx="3" fill="#8d3a69"/><path class="haste" d="M36.7 0 H71" stroke="#8d3a69" stroke-width="3" stroke-linecap="round"/><g class="luva" transform="translate(71 0) scale(.75)">${LUVA}</g></g></g>
 <g class="itF"></g>
</g></g></g></g></svg>`;;return {svg:MOCHI_SVG,ARMP,ARMH,ARMHF,armT,dentro,cl}})();