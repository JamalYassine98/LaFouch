/* Mochi com "esqueleto": cada parte se mexe sozinha (braços giram no ombro, olhos e boca trocam com transição),
   respira e flutua o tempo todo, pula em arco com antecipação e amortecimento. */
const MOCHI_SVG=`<svg viewBox="-6 24 132 110" width="100%" height="100%" fill="none" style="overflow:visible">${MD}
<ellipse class="sombra" cx="60" cy="125" rx="34" ry="5.5" fill="url(#msh)"/>
<g class="sq"><g class="tilt"><g class="resp">
 <ellipse cx="44" cy="120" rx="10" ry="5.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/><ellipse cx="76" cy="120" rx="10" ry="5.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/>
 <path d="M60 30 C95 30 106 58 106 84 C106 108 88 122 60 122 C32 122 14 108 14 84 C14 58 25 30 60 30Z" fill="url(#mb)" stroke="#ecc9da" stroke-width="1.4"/>
 <path d="M28 64 C30 48 42 38 58 36" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>
 <path d="M17 66 Q60 44 103 66" stroke="#8d3a69" stroke-width="4.5" fill="none" stroke-linecap="round"/>
 <g class="esp" style="transform-origin:60px 58px"><circle cx="60" cy="47" r="12" fill="url(#mir)" stroke="#8d3a69" stroke-width="3"/><circle cx="60" cy="47" r="3.2" fill="#8d3a69"/><path d="M53.5 42 q3 -3 7 -3.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>
 <g class="olhos"><g class="pis"><g class="pup">
  <ellipse cx="45" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="45" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="42.6" cy="80" r="2.6" fill="#fff"/><circle cx="47.6" cy="85.6" r="1.1" fill="#fff"/>
  <ellipse cx="75" cy="83" rx="6.6" ry="7.8" fill="#3a2632"/><ellipse cx="75" cy="86.5" rx="4.6" ry="3" fill="#6b3b58" opacity=".55"/><circle cx="72.6" cy="80" r="2.6" fill="#fff"/><circle cx="77.6" cy="85.6" r="1.1" fill="#fff"/>
 </g></g></g>
 <g class="olhosF" opacity="0"><path d="M38 86 q7 -8 14 0 M68 86 q7 -8 14 0" stroke="#3a2632" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>
 <g class="ocl"><g fill="url(#mlz)" stroke="#8d3a69" stroke-width="2.6"><circle cx="45" cy="83" r="13"/><circle cx="75" cy="83" r="13"/></g><path d="M58 81 q2 -2.5 4 0" stroke="#8d3a69" stroke-width="2.6" fill="none"/>
 <path d="M36 76 l4 -2.5 M66 76 l4 -2.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>
 <ellipse cx="31" cy="101" rx="9" ry="5.5" fill="url(#mbl)"/><ellipse cx="89" cy="101" rx="9" ry="5.5" fill="url(#mbl)"/>
 <g class="bW"><path d="M54.5 101.5 q2.75 3 5.5 0 q2.75 3 5.5 0" stroke="#8d3a69" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>
 <g class="bO" opacity="0"><ellipse cx="60" cy="103" rx="4" ry="3.4" fill="#8d3a69"/></g>
 <g class="bF" opacity="0"><path d="M53 101 q7 8 14 0 Z" fill="#8d3a69"/><path d="M56 104 q4 3 8 0" fill="#ff8fb8"/></g>
 <g class="brE" style="transform-origin:22px 94px"><path d="M22 94 L0 94" stroke="#e8c3d6" stroke-width="12.5" stroke-linecap="round"/><path d="M22 94 L0 94" stroke="url(#mh)" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="94" r="6.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/></g>
 <g class="brD" style="transform-origin:98px 94px">
  <g class="vara" opacity="0"><path class="haste" d="M118 94 L124 94" stroke="#8d3a69" stroke-width="3.4" stroke-linecap="round"/><path class="haste2" d="M118 94 L124 94" stroke="#c46a9c" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>
   <g class="luva"><rect x="-6" y="-9" width="7" height="18" rx="2.5" fill="#8d3a69"/><rect x="0" y="-8" width="17" height="16" rx="6" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><rect x="12" y="-7.5" width="20" height="6.5" rx="3.2" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><ellipse cx="7" cy="-8.5" rx="4.5" ry="3" fill="#fff" stroke="#8d3a69" stroke-width="1.6"/><path d="M4 1.5 h9 M4 5 h8" stroke="#e7c3d6" stroke-width="1.4" stroke-linecap="round"/></g></g>

  <path d="M98 94 L120 94" stroke="#e8c3d6" stroke-width="12.5" stroke-linecap="round"/><path d="M98 94 L120 94" stroke="url(#mh)" stroke-width="9" stroke-linecap="round"/><circle class="mao" cx="120" cy="94" r="6.5" fill="url(#mh)" stroke="#ecc9da" stroke-width="1.2"/>
 </g>
</g></g></g></svg>`;
const MOCHI_CSS=`
.mochi{position:absolute;width:156px;height:165px;will-change:transform;z-index:6}
.mochi .sq{transform-origin:60px 124px;transition:transform .18s cubic-bezier(.3,1.6,.5,1)}
.mochi .tilt{transform-origin:60px 124px;transition:transform .5s cubic-bezier(.34,1.5,.55,1)}
.mochi .esp{transition:transform .5s cubic-bezier(.3,2.2,.5,1)}
.mochi .ocl{transition:transform .18s ease}
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
 M.vara=function(on){q('.vara').style.opacity=on?1:0;if(!on)M.estica(0,0)};
 /* ponteiro telescópico: estica com 3 "clics" (degraus com mola) */
 M.len=6;M.estica=function(L,ms){const v=q('.vara'),h=q('.haste'),h2=q('.haste2'),g=q('.luva');const ap=x=>{M.len=x;h.setAttribute('d',`M118 94 L${118+x} 94`);h2.setAttribute('d',`M120 93.2 L${116+x} 93.2`);g.setAttribute('transform',`translate(${118+x} 94)`)};
  if(!ms){ap(L);return}const a0=M.len,t0=performance.now(),st=3;const f=n=>{let t=Math.min(1,(n-t0)/ms);const k=Math.floor(t*st)/st,fr=(t*st)%1,e=k+(1/st)*(1-Math.pow(1-Math.min(1,fr*1.6),3))*(t<1?1:0)+(t>=1?1/st:0);ap(a0+(L-a0)*Math.min(1,t>=1?1:e));if(t<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 M.toca=function(){const g=q('.luva');let k=0;const tik=()=>{if(k>=4)return;const base=`translate(${118+M.len} 94)`;g.setAttribute('transform',base+(k%2?'':' translate(3 3)'));k++;setTimeout(tik,110)};tik()};
 M.inclina=function(d){q('.tilt').style.transform=`rotate(${d||0}deg)`};
 M.espelho=function(){const e=q('.esp');e.style.transform='rotate(-14deg)';setTimeout(()=>e.style.transform='rotate(9deg)',120);setTimeout(()=>e.style.transform='',260)};
 M.ajustaOculos=function(volta){M.bracos(154,null);setTimeout(()=>{q('.ocl').style.transform='translateY(-2px)';setTimeout(()=>q('.ocl').style.transform='',200)},380);setTimeout(()=>M.bracos(volta==null?-35:volta,null),700)};
 M.acena=function(n){const w=[-70,-25];for(let i=0;i<(n||4);i++)setTimeout(()=>M.bracos(null,w[i%2]),i*230);setTimeout(()=>M.bracos(null,40),(n||4)*230+60)};
 M.sim=function(){M.inclina(6);setTimeout(()=>M.inclina(-3),180);setTimeout(()=>M.inclina(0),360);M.espelho()};
 M.nao=function(){M.inclina(-10);M.olha(-1,-.6);setTimeout(()=>{M.inclina(0);M.olha(0,0)},1100)};
 /* vida própria: quando está esperando, faz uma coisa diferente de vez em quando */
 M.ocioso=false;let ot=0;const IDLE=[()=>{M.olha(-1,0);setTimeout(()=>M.olha(1,0),500);setTimeout(()=>M.olha(0,0),1000)},()=>{M.pisca();setTimeout(()=>M.pisca(),230)},()=>{M.inclina(8);setTimeout(()=>M.inclina(0),900)},()=>M.ajustaOculos(),
   ()=>{M.amassa(1.05,.95);setTimeout(()=>M.amassa(.97,1.04),160);setTimeout(()=>M.amassa(1,1),320);M.espelho()},()=>{M.olha(0,1);setTimeout(()=>M.olha(0,0),700)}];
 let ult=-1;const vida=()=>{clearTimeout(ot);ot=setTimeout(()=>{if(M.ocioso&&!M.fal){let i;do{i=Math.floor(Math.random()*IDLE.length)}while(i===ult);ult=i;IDLE[i]()}vida()},2200+Math.random()*1800)};vida();
 /* olha para onde a pessoa toca */
 M.olhaPara=function(x,y){const r=el.getBoundingClientRect(),cx=r.left+r.width*.45,cy=r.top+r.height*.5,dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)||1;M.olha(dx/d,dy/d);clearTimeout(M._ol);M._ol=setTimeout(()=>M.olha(0,0),900)};
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
 M.mao2=function(){const r=q('.luva rect:nth-child(3)').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]};
 return M}
