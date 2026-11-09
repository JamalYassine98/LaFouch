/* S88 · todas as animações do Mochi com a mesma fluidez do S87 (um relógio só, curvas com antecipação, mola, esticar/amassar e atraso nas partes soltas) */
const win=(t,a,b,f)=>cl(Math.min((t-a)/f,(b-t)/f),0,1);
const DUR2=11.2;
function puffs(t,t0,cx,cy){if(t<t0||t>t0+.75)return '';const u=(t-t0)/.75;let s='';for(let i=0;i<12;i++){const a=i/12*Math.PI*2+.3,r=(10+(i%3)*5)*(.4+.9*EO(u)),d=58*EO(u);s+=`<circle cx="${(cx+Math.cos(a)*d).toFixed(1)}" cy="${(cy+Math.sin(a)*d*.8).toFixed(1)}" r="${r.toFixed(1)}" fill="#f3d6e4" opacity="${(.95*(1-u)).toFixed(3)}"/>`}return s}
function confete(t,t0){if(t<t0)return '';const u=t-t0;let s='';const C=['#8d3a69','#f3d6e4','#f2b24c','#7fc4a4'];for(let i=0;i<34;i++){const r1=rnd2(i),r2=rnd2(i*7+3),x=40+r1*310,vy=40+r2*90,y=120+vy*u+160*u*u,rot=u*(200+r2*500);if(y>720)continue;s+=`<rect x="${(x+Math.sin(u*3+i)*14).toFixed(1)}" y="${y.toFixed(1)}" width="7" height="11" rx="2" fill="${C[i%4]}" transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" opacity="${cl(1.8-u*.6,0,1).toFixed(2)}"/>`}return s}
const rnd2=k=>{const x=Math.sin(k*127.1+3.7)*43758.5453;return x-Math.floor(x)};
const spring=(t,t0,amp,freq,dec)=>t>t0?Math.sin((t-t0)*freq)*Math.exp(-(t-t0)*dec)*amp:0;
R=function(t){
 const IX=34,IY=120;let mx=IX,my=IY,sc=1,rot=0,sx=1,sy=1,tilt=Math.sin(t*1.1)*1.4,hop=0;
 /* A · entrada: nuvenzinha, ele "estoura" com mola e acena */
 const ent=seg(t,.15,.85);if(t<.15)sc=0;else if(t<.85){sc=EB(ent);rot=lerp(-25,0,EO(ent))+Math.sin(ent*Math.PI)*8}
 /* C · pula até o ponto de apontar (arco com antecipação e pouso amassado) */
 const pj=seg(t,4.05,4.6);if(t>=4.05){const e=E(pj);mx=lerp(IX,MX0,e);my=lerp(IY,MY0,e)-Math.sin(Math.PI*pj)*36;if(pj>0&&pj<1)tilt+=Math.sin(pj*Math.PI)*-7}
 const sqz=(t0,d,amp)=>{const u=(t-t0)/d;return u>0&&u<1?Math.sin(u*Math.PI)*amp*Math.exp(-u*1.5):0};
 let s=0;s+=sqz(.62,.3,.12);s+=sqz(3.92,.14,.12);s-=sqz(4.07,.3,.08);s+=sqz(4.6,.24,.14);
 /* F · comemora: dois pulinhos com esticar/amassar */
 for(const k of [8.75,9.35]){const u=seg(t,k,k+.5);if(u>0&&u<1){hop+=Math.sin(u*Math.PI)*16}s+=sqz(k-.1,.12,.12);s-=sqz(k+.02,.3,.07);s+=sqz(k+.5,.22,.12)}
 /* D · "Consigo": o corpo inclina puxando o quadro */
 const px=seg(t,5.7,6.25);tilt+=Math.sin(px*Math.PI)*-6;
 /* E · "Não consigo": inclina a cabeça pensando */
 tilt+=win(t,7.35,8.6,.35)*-7;
 sx=1+s;sy=1-s;
 /* braços (ângulos do esboço aprovado: >100 = na frente do rosto) */
 let ae=tr([[0,38],[2.3,38],[2.75,-154+360-360],[3.45,-154],[3.95,35],[7.35,35],[7.8,162],[8.4,162],[8.75,35],[8.8,-45],[10.3,-45],[10.8,38],[DUR2,38]],t);
 let ad=tr([[0,40],[.9,40],[1.1,-60],[2,-60],[2.2,40],[4.55,40],[4.75,0],[5.7,0],[5.8,14],[6.2,0],[8.75,0],[8.8,-45],[10.3,-45],[10.8,40],[DUR2,40]],t);
 ad+=win(t,1.1,2.0,.15)*Math.sin((t-1.1)*12)*22;        /* aceno */
 ae+=win(t,5.95,6.8,.15)*0;                              /* joinha: braço esquerdo sobe (abaixo) */
 if(t>5.9&&t<6.95)ae=tr([[5.9,35],[6.15,-60],[6.7,-60],[6.95,35]],t);
 ae+=win(t,7.8,8.4,.2)*Math.sin(t*3)*4;ae+=win(t,8.85,10.3,.2)*Math.sin(t*11)*9;ad-=win(t,8.85,10.3,.2)*Math.sin(t*11)*9;
 const L=30;
 let face={olha:1};if(t<2.2||(t>5.75&&t<6.9)||t>8.7)face={feliz:1};if(t>7.35&&t<8.6)face={olha:1};
 const bl=((t%3.3)<.11)&&!face.feliz;const f=Object.assign({},face,bl?{pisca:1}:{});
 /* óculos: sobem com a mão e voltam assentando com mola */
 const oc=win(t,2.62,3.5,.18),oy=-26*E(oc)+spring(t,3.5,-2.2,14,5),oo=lerp(1,.15,E(oc)),orr=-8*E(oc)+spring(t,3.5,2,13,5);
 /* espelho balança nos pousos (movimento secundário) */
 const mr=spring(t,.62,12,13,4)+spring(t,4.6,10,13,4)+spring(t,9.25,9,13,4)+spring(t,9.85,9,13,4);
 let m=limpa(f);
 m=m.replace(/(<circle cx="60" cy="47" r="12"[\s\S]*?<path d="M53.5 42[^>]*\/>)/,`<g transform="rotate(${mr.toFixed(2)} 60 58)">$1</g>`);
 m=m.replace('<g fill="url(#mlz)"',`<g opacity="${oo.toFixed(3)}" transform="translate(0 ${oy.toFixed(2)}) rotate(${orr.toFixed(2)} 60 83)"><g fill="url(#mlz)"`).replace(/(<path d="M36 76 l4 -2.5[^>]*\/>)/,`$1${HASTES}</g>`);
 if(t>7.4&&t<8.6)m=m.replace(/<path d="M54\.5 101\.5[^>]*\/>/,'<path d="M55 103 q3 -1.6 6 -.4 q2.6 1 4.4 -.6" stroke="#8d3a69" stroke-width="2.4" fill="none" stroke-linecap="round"/>');
 const A1=bracoCamadas(-1,ae,L),A2=bracoCamadas(1,ad,L);
 const len=tr([[0,0],[4.6,0],[4.95,34.3],[DUR2,34.3]],t,u=>Math.floor(u*3)/3+EO((u*3)%1)/3);
 const tq=(t>5.0&&t<5.3)?Math.abs(Math.sin((t-5)*Math.PI*2/ .15))*3:0;
 const pon=t>4.55&&t<8.75?`<g transform="${armT(1,ad)} translate(${tq.toFixed(2)} 0)">${ponteiro(len,1)}</g>`:'';
 const body=`<g transform="translate(60 124) translate(0 ${(-hop).toFixed(2)}) rotate(${(tilt+rot).toFixed(2)}) scale(${(sx*sc).toFixed(3)} ${(sy*sc).toFixed(3)}) translate(-60 -124)">${A1.tras}${A2.tras}${m}${A1.frente}${A2.frente}${pon}</g>`;
 const mochi=`<g transform="translate(${mx.toFixed(2)} ${my.toFixed(2)}) scale(${K})"><ellipse cx="60" cy="126" rx="${(30*sc-hop*.5).toFixed(1)}" ry="4" fill="#8d3a69" opacity="${(.12*sc).toFixed(3)}"/>${body}</g>`;
 /* quadro: aparece no teste; no "Consigo" sobe uma frase com mola e o ✓ estala */
 const qa=seg(t,3.9,4.4);const sob=t>5.72?EB(seg(t,5.72,6.2)):0;
 let ly=QY+28+QH/2-40-(QH/2-40)+60,lines='';const off=-sob*(14.2*1.25+14);
 LINHAS.forEach(([tx,fz],i)=>{const hl=(i===3&&sob<.5)||(i===4&&sob>=.5);const ok=i<3||(i===3&&t>5.72);const ck=i===3?EB(seg(t,5.72,5.95)):1;
  lines+=`${hl?`<rect x="${QX+20}" y="${ly-fz-3}" width="${tx.length*fz*.48+10}" height="${fz+9}" rx="5" fill="#fdeaf3"/>`:''}${ok?`<text x="${QX+8}" y="${ly}" font-family="Inter" font-size="10" fill="#2e7d4f" transform="translate(${QX+12} ${ly-4}) scale(${ck}) translate(${-(QX+12)} ${-(ly-4)})">✓</text>`:''}<text x="${QX+24}" y="${ly}" font-family="Georgia,serif" font-size="${fz}" fill="${ok?'#a99aa4':'#2a1f27'}">${tx}</text>`;ly+=fz*1.25+14});
 const quadro=`<g opacity="${qa.toFixed(3)}" transform="translate(0 ${(1-EO(qa))*14})"><rect x="${QX}" y="${QY}" width="${QW}" height="${QH}" rx="20" fill="#fff" stroke="#efe3ea" filter="url(#qsh)"/><g clip-path="url(#qclip)"><g transform="translate(0 ${(off-60).toFixed(2)})">${lines}</g></g></g>`;
 const press=(t0)=>t>t0-.08&&t<t0+.16;
 const btn=(y,txt,cheio,pr)=>`<g transform="translate(195 ${y+26}) scale(${pr?.97:1}) translate(-195 ${-(y+26)})"><rect x="12.75" y="${y}" width="364.5" height="52" rx="26" fill="${cheio?(pr?'#7a2f5b':'#8d3a69'):(pr?'#f6e7ef':'#fff')}" stroke="#8d3a69" stroke-width="1.5"/><text x="195" y="${y+32}" font-family="Inter,system-ui" font-size="17" font-weight="700" fill="${cheio?'#fff':'#8d3a69'}" text-anchor="middle">${txt}</text></g>`;
 const botoes=`<g opacity="${qa.toFixed(3)}">${btn(610,'Consigo ler',1,press(5.65))}${btn(672,'Não consigo',0,press(7.3))}</g>`;
 const fala=t<2.2?'Oi! Eu sou o Mochi.':t<4?'Faz como eu: tire os óculos…':t<5.6?'Consegue ler esta?':t<7.2?'Isso! E esta?':t<8.7?'Tudo bem, é normal.':'Pronto!';
 const cap=t<2.2?'entrada: estoura com mola e acena':t<4?'tira os óculos (eles sobem com a mão e assentam)':t<5.6?'pula para o lugar e estica o ponteiro':t<7.2?'"Consigo": puxa e o quadro sobe com mola':t<8.7?'"Não consigo": pensa, mão no queixo':'comemora: pulinhos, espelho balança, confete';
 const bal=`<rect x="12" y="66" width="300" height="44" rx="16" fill="#fff" stroke="#efe3ea"/><text x="26" y="94" font-family="Inter,system-ui" font-size="15" fill="#2a1f27">${fala}</text>`;
 const top=`<rect x="0" y="0" width="390" height="56" fill="#fbf6f9"/><path d="M0 56 H390" stroke="#efe3ea"/><text x="195" y="36" font-family="Georgia,serif" font-size="22" fill="#8d3a69" text-anchor="middle">LA FOUCH</text>`;
 const rod=`<rect x="0" y="732" width="390" height="28" fill="#2a1f27"/><text x="195" y="751" font-family="Inter" font-size="12" fill="#fff" text-anchor="middle">S88 · ${cap}</text>`;
 document.getElementById('st').innerHTML=`<svg width="390" height="760" viewBox="0 0 390 760" style="background:#fbf6f9;display:block">${MD}${FZ}${DEFS}${top}${bal}${quadro}${botoes}${puffs(t,.1,IX+60*K,IY+80*K)}${mochi}${confete(t,8.7)}${rod}</svg>`};
