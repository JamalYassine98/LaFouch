/* Mochi com "esqueleto": cada parte se mexe sozinha (braços giram no ombro, olhos e boca trocam com transição),
   respira e flutua o tempo todo, pula em arco com antecipação e amortecimento. */
const MOCHI_SVG=`<svg viewBox="-6 24 132 110" width="100%" height="100%" fill="none" style="overflow:visible">${MD}
<ellipse class="sombra" cx="60" cy="125" rx="34" ry="5.5" fill="url(#msh)"/>
<g class="sq"><g class="resp">
 <ellipse cx="44" cy="120" rx="10" ry="5.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/><ellipse cx="76" cy="120" rx="10" ry="5.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/>
 <path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#mb)" stroke="#ecc9da" stroke-width="1.4"/>
 <path d="M28 64 C30 48 42 38 58 36" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>
 <path d="M17 66 Q60 44 103 66" stroke="#8d3a69" stroke-width="4.5" fill="none" stroke-linecap="round"/>
 <circle cx="60" cy="47" r="12" fill="url(#mir)" stroke="#8d3a69" stroke-width="3"/><circle cx="60" cy="47" r="3.2" fill="#8d3a69"/><path d="M53.5 42 q3 -3 7 -3.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
 <g class="olhos"><g class="pis"><g class="pup">
  <ellipse cx="45" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="45" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="42.6" cy="80" r="2.6" fill="#fff"/><circle cx="47.6" cy="85.6" r="1.1" fill="#fff"/>
  <ellipse cx="75" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="75" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="72.6" cy="80" r="2.6" fill="#fff"/><circle cx="77.6" cy="85.6" r="1.1" fill="#fff"/>
 </g></g></g>
 <g class="olhosF" opacity="0"><path d="M38 86 q7 -8 14 0 M68 86 q7 -8 14 0" stroke="#3a2632" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
 <g fill="url(#mlz)" stroke="#8d3a69" stroke-width="2.6"><circle cx="45" cy="83" r="13"/><circle cx="75" cy="83" r="13"/></g><path d="M58 81 q2 -2.5 4 0" stroke="#8d3a69" stroke-width="2.6" fill="none"/>
 <path d="M36 76 l4 -2.5 M66 76 l4 -2.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
 <ellipse cx="31" cy="101" rx="9" ry="5.5" fill="url(#mbl)"/><ellipse cx="89" cy="101" rx="9" ry="5.5" fill="url(#mbl)"/>
 <g class="bW"><path d="M54.5 101.5 q2.75 3 5.5 0 q2.75 3 5.5 0" stroke="#8d3a69" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>
 <g class="bO" opacity="0"><ellipse cx="60" cy="103" rx="4" ry="3.4" fill="#8d3a69"/></g>
 <g class="bF" opacity="0"><path d="M53 101 q7 8 14 0 Z" fill="#8d3a69"/><path d="M56 104 q4 3 8 0" fill="#ff8fb8"/></g>
 <g class="brE" style="transform-origin:22px 94px"><path d="M22 94 L0 94" stroke="#e8c3d6" stroke-width="12.5" stroke-linecap="round"/><path d="M22 94 L0 94" stroke="url(#mh)" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="94" r="6.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/></g>
 <g class="brD" style="transform-origin:98px 94px">
  <g class="vara" opacity="0"><path d="M120 94 l48 -20" stroke="#c9915f" stroke-width="4.5" stroke-linecap="round"/><circle cx="170" cy="73" r="5" fill="#8d3a69"/><circle cx="168.5" cy="71.5" r="1.6" fill="#fff" opacity=".8"/></g>
  <path d="M98 94 L120 94" stroke="#e8c3d6" stroke-width="12.5" stroke-linecap="round"/><path d="M98 94 L120 94" stroke="url(#mh)" stroke-width="9" stroke-linecap="round"/><circle class="mao" cx="120" cy="94" r="6.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/>
 </g>
</g></g></svg>`;
const MOCHI_CSS=`
.mochi{position:absolute;width:156px;height:165px;will-change:transform;z-index:6}
.mochi .sq{transform-origin:60px 124px;transition:transform .18s cubic-bezier(.3,1.6,.5,1)}
.mochi .resp{transform-origin:60px 124px;animation:resp 2.6s ease-in-out infinite}
@keyframes resp{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-2.5px) scale(1.012,.988)}}
.mochi .sombra{transform-origin:60px 125px;animation:somb 2.6s ease-in-out infinite}
@keyframes somb{0%,100%{transform:scale(1)}50%{transform:scale(.94)}}
.mochi .brE,.mochi .brD{transition:transform .45s cubic-bezier(.34,1.45,.55,1)}
.mochi .pup{transition:transform .35s ease}
.mochi .pis{transform-origin:60px 83px}
.mochi .pis.p{animation:pisca .16s ease-in-out}
@keyframes pisca{50%{transform:scaleY(.08)}}
.mochi .olhos,.mochi .olhosF,.mochi .bW,.mochi .bO,.mochi .bF,.mochi .vara{transition:opacity .22s ease}
`;
function Mochi(host,x,y){const el=document.createElement('div');el.className='mochi';el.innerHTML=MOCHI_SVG;host.appendChild(el);
 const q=s=>el.querySelector(s),st=document.createElement('style');st.textContent=MOCHI_CSS;document.head.appendChild(st);
 const M={el,x,y,fal:0,exp:'n'};
 M.pos=function(nx,ny){M.x=nx;M.y=ny;el.style.transform=`translate(${nx}px,${ny}px)`};M.pos(x,y);
 M.bracos=function(e,d){if(e!=null)q('.brE').style.transform=`rotate(${e}deg)`;if(d!=null)q('.brD').style.transform=`rotate(${d}deg)`};
 M.olha=function(dx,dy){q('.pup').style.transform=`translate(${(dx||0)*2.4}px,${(dy||0)*1.6}px)`};
 M.cara=function(e){M.exp=e;const f=e==='f';q('.olhos').style.opacity=f?0:1;q('.olhosF').style.opacity=f?1:0;q('.bF').style.opacity=f?1:0;q('.bW').style.opacity=(f||M.fal)?0:1};
 M.vara=function(on){q('.vara').style.opacity=on?1:0};
 M.pisca=function(){const p=q('.pis');p.classList.remove('p');void p.getBBox;requestAnimationFrame(()=>p.classList.add('p'))};
 setInterval(()=>{if(M.exp!=='f')M.pisca()},3200+Math.random()*1200);
 /* fala: a boca abre e fecha num ritmo de sílabas */
 let ft=0;M.fala=function(ms){M.fal=1;clearTimeout(ft);const bO=q('.bO'),bW=q('.bW');let k=0;const tik=()=>{if(!M.fal)return;const ab=(k++%3)!==2;bO.style.opacity=ab?1:0;bW.style.opacity=ab||M.exp==='f'?0:1;if(M.exp==='f')bO.style.opacity=0;ft=setTimeout(tik,110+Math.random()*90)};tik();
  setTimeout(()=>{M.fal=0;bO.style.opacity=0;if(M.exp!=='f')bW.style.opacity=1},ms)};
 M.amassa=function(sx,sy){q('.sq').style.transform=`scale(${sx},${sy})`};
 /* pulo em arco: antecipa (agacha), sobe esticado, aterrissa amassando e assenta */
 M.pula=function(nx,ny,dur,alt,fim){dur=dur||700;alt=alt==null?40:alt;const x0=M.x,y0=M.y;M.amassa(1.12,.86);
  setTimeout(()=>{M.amassa(.9,1.12);const t0=performance.now();const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
   const f=n=>{let t=Math.min(1,(n-t0)/dur),e=ease(t);M.pos(x0+(nx-x0)*e,y0+(ny-y0)*e-Math.sin(Math.PI*t)*alt);if(t>.45&&t<.6)M.amassa(1,1);
    if(t<1)requestAnimationFrame(f);else{M.amassa(1.14,.84);setTimeout(()=>M.amassa(.97,1.04),140);setTimeout(()=>M.amassa(1,1),280);fim&&fim()}};requestAnimationFrame(f)},150)};
 M.desliza=function(nx,ny,dur){const x0=M.x,y0=M.y,t0=performance.now();dur=dur||600;const f=n=>{let t=Math.min(1,(n-t0)/dur),e=1-Math.pow(1-t,3);M.pos(x0+(nx-x0)*e,y0+(ny-y0)*e);if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 M.mao=function(){const r=q('.mao').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
 M.mao2=function(){const r=q('.vara circle').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
 return M}
