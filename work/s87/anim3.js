/* S91 · entrada: o Mochi se apresenta, pula para a direita do cartão do aviso e aponta cada regra com o ponteiro enquanto explica; depois chama o Começar */
const DUR3=12.2;
const winx=(t,a,b,f)=>cl(Math.min((t-a)/f,(b-t)/f),0,1);
const spr=(t,t0,amp,freq,dec)=>t>t0?Math.sin((t-t0)*freq)*Math.exp(-(t-t0)*dec)*amp:0;
R=function(t){
 const K=.86;
 /* cartão do aviso e linhas (o texto termina antes de x≈215: o ponteiro para logo depois, sem cobrir nada) */
 const CX=14,CY=236,CH=138,LY=[268,300,318,352];const CW=lerp(362,272,E(seg(t,1.95,2.6)));
 const L1='Serve só para ler de perto.',L2a='Não funciona para miopia,',L2b='astigmatismo ou multifocal.',L3='Não substitui a consulta.';
 const alvo=[LY[0]-5,(LY[1]+LY[2])/2-5,LY[3]-5];
 /* fases */
 const T_PULA=2.0,T_CHEGA=2.6,T_R1=3.0,T_R2=5.0,T_R3=7.6,T_FIM=9.7,T_BOT=10.0;
 /* posição: começa no canto de cima, pula para a direita do cartão (vira no ar para olhar para o cartão) */
 const X0=4,Y0=96,mxR=335-60*.86;let my=Y0,mx=X0,flip=1,hop=0,s=0,tilt=Math.sin(t*1.1)*1.4;
 const sqz=(t0,d,amp)=>{const u=(t-t0)/d;return u>0&&u<1?Math.sin(u*Math.PI)*amp*Math.exp(-u*1.5):0};
 const pj=seg(t,T_PULA,T_CHEGA);
 const yAlvo=t<T_R2?alvo[0]:t<T_R3?alvo[1]:alvo[2],yBot=430;
 /* desliza na vertical até a linha da vez, com mola */
 let yy=tr([[0,alvo[0]],[T_R2-.25,alvo[0]],[T_R2+.15,alvo[1]],[T_R3-.25,alvo[1]],[T_R3+.15,alvo[2]],[T_BOT,alvo[2]],[T_BOT+.4,alvo[2]+14],[DUR3,alvo[2]+14]],t)-92*K;
 yy+=spr(t,T_R2+.15,2.5,12,5)+spr(t,T_R3+.15,2.5,12,5);
 if(t<T_PULA){mx=X0;my=Y0}
 else if(t<T_CHEGA){const e=E(pj);mx=lerp(X0,mxR,e);my=lerp(Y0,alvo[0]-92*K,e)-Math.sin(Math.PI*pj)*46;flip=Math.cos(Math.PI*cl((pj-.25)/.5,0,1))}
 else{mx=mxR;my=yy;flip=-1}
 /* com flip=-1 o desenho é espelhado em torno de x=0 do grupo; ajusta para o corpo ficar no mesmo lugar */
 const ox=flip<0?0:0;
 s+=sqz(T_PULA-.14,.16,.12);s-=sqz(T_PULA+.02,.34,.08);s+=sqz(T_CHEGA,.24,.14);
 if(pj>0&&pj<1)tilt+=Math.sin(pj*Math.PI)*-8;
 const sx=1+s,sy=1-s;
 /* braços: aceno no começo; depois o direito segura o ponteiro apontando para o cartão; no fim desce para o Começar */
 let ae=tr([[0,38],[T_PULA,38],[T_PULA+.2,-25],[T_CHEGA,35],[DUR3,35]],t);
 let ad=tr([[0,40],[.5,40],[.7,-60],[1.7,-60],[1.9,40],[T_CHEGA,30],[T_CHEGA+.2,0],[T_FIM,0],[T_BOT,0],[T_BOT+.35,52],[DUR3,52]],t);
 ad+=winx(t,.7,1.7,.15)*Math.sin((t-.7)*12)*20;
 /* ponteiro estica (3 cliques) ao chegar; dá dois toquinhos em cada regra; encolhe um pouco para apontar o botão */
 const len=tr([[0,0],[T_CHEGA+.1,0],[T_R1,34.3],[T_BOT,34.3],[T_BOT+.35,8],[DUR3,8]],t,u=>Math.floor(u*3)/3+EO((u*3)%1)/3);
 let tq=0;for(const k of [T_R1+.1,T_R2+.25,T_R3+.25,T_BOT+.5]){const d=t-k;if(d>0&&d<.3)tq=Math.abs(Math.sin(d*Math.PI*2/.15))*3}
 const face=(t<1.9)||(t>T_BOT+.4)?{feliz:1}:{olha:1};
 const bl=((t%3.3)<.11)&&!face.feliz;const f=Object.assign({},face,bl?{pisca:1}:{});
 const mr=spr(t,T_CHEGA,11,13,4)+spr(t,.62,10,13,4);
 let m=limpa(f);m=m.replace(/(<circle cx="60" cy="47" r="12"[\s\S]*?<path d="M53.5 42[^>]*\/>)/,`<g transform="rotate(${mr.toFixed(2)} 60 58)">$1</g>`);
 const A1=bracoCamadas(-1,ae,30),A2=bracoCamadas(1,ad,30);
 const pon=t>T_CHEGA?`<g transform="${armT(1,ad)} translate(${tq.toFixed(2)} 0)">${ponteiro(len,1)}</g>`:'';
 /* entrada estourando (S88) */
 const ent=seg(t,.05,.75),c1=1.70158,EBk=x=>1+(c1+1)*Math.pow(x-1,3)+c1*Math.pow(x-1,2),sc=t<.05?0.001:Math.max(.001,EBk(ent)),rot=t<.75?(-25+25*EO(ent))+Math.sin(ent*Math.PI)*8:0;
 const body=`<g transform="translate(60 124) rotate(${(tilt+rot).toFixed(2)}) scale(${(sx*sc).toFixed(3)} ${(sy*sc).toFixed(3)}) translate(-60 -124)">${A1.tras}${A2.tras}${m}${A1.frente}${A2.frente}${pon}</g>`;
 /* espelho no eixo do corpo (x=60) para virar sem sair do lugar */
 const gx=flip<0||(t>=T_PULA&&t<T_CHEGA)?mx-60*K*(1-flip)*0:mx;
 const mochi=`<g transform="translate(${(mx).toFixed(2)} ${my.toFixed(2)}) scale(${K})"><g transform="translate(60 0) scale(${flip.toFixed(3)} 1) translate(-60 0)"><ellipse cx="60" cy="126" rx="30" ry="4" fill="#8d3a69" opacity=".12"/>${body}</g></g>`;
 /* cartão: a regra da vez ganha fundo rosinha; contorno rosa pulsa enquanto ele explica */
 const ativo=t>=T_R1&&t<T_FIM,hl=t<T_R1?-1:t<T_R2?0:t<T_R3?1:t<T_FIM?2:-1,pul=ativo?(.5+.5*Math.sin(t*4))*.35:0;
 const lin=(y,txt,cor,peso,i)=>`${i===hl?`<rect x="${CX+12}" y="${y-15}" width="${txt.length*6.9+12}" height="21" rx="5" fill="#fdeaf3"/>`:''}<text x="${CX+18}" y="${y}" font-family="Inter,system-ui" font-size="13.5" font-weight="${peso}" fill="${cor}">${txt}</text>`;
 let card=`<rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" rx="16" fill="#fff" stroke="${ativo?'#c46a9c':'#efe3ea'}" stroke-width="${ativo?1.6:1}"/>${ativo?`<rect x="${CX-4}" y="${CY-4}" width="${CW+8}" height="${CH+8}" rx="19" fill="none" stroke="#8d3a69" stroke-opacity="${pul.toFixed(3)}" stroke-width="4"/>`:''}`;
 card+=lin(LY[0],L1,'#2a1f27',600,0);
 if(hl===1)card+=`<rect x="${CX+12}" y="${LY[1]-15}" width="${L2b.length*6.9+12}" height="39" rx="5" fill="#fdeaf3"/>`;
 card+=`<text x="${CX+18}" y="${LY[1]}" font-family="Inter,system-ui" font-size="13.5"><tspan fill="#8d3a69" font-weight="700">Não funciona</tspan><tspan fill="#2a1f27"> para miopia,</tspan></text><text x="${CX+18}" y="${LY[2]}" font-family="Inter,system-ui" font-size="13.5" fill="#2a1f27">astigmatismo ou multifocal.</text>`;
 card+=lin(LY[3],L3,'#8a7a85',400,2);
 /* botão Começar: pulsa 2 vezes quando ele chama */
 const bp=t>T_BOT+.4&&t<T_BOT+1.8?Math.max(0,Math.sin((t-T_BOT-.4)*Math.PI/.7)):0;
 const botao=`<rect x="${14-bp*5}" y="${396-bp*5}" width="${362+bp*10}" height="${52+bp*10}" rx="${31+bp*5}" fill="#8d3a69" opacity="${(bp*.18).toFixed(3)}"/><rect x="14" y="396" width="362" height="52" rx="26" fill="#8d3a69"/><text x="195" y="428" font-family="Inter,system-ui" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">Começar</text>`;
 /* balão: em cima à direita quando ele está no canto; em cima à esquerda quando ele está ao lado do cartão */
 const fala=t<1.95?['Oi! Eu sou o Mochi. Vou te ajudar a','achar o grau do seu óculos de leitura.']:t<T_R1?['…']:t<T_FIM?['Antes, um aviso importante: este teste é só','para óculos de leitura. Não serve para miopia,','astigmatismo nem multifocal, e não substitui','o oftalmologista.']:['Quando quiser, é só tocar em Começar.'];
 const bx=t<1.95?118:12,bw=t<1.95?260:290;
 const bal=`<rect x="${bx}" y="${t<1.95?100:96}" width="${bw}" height="${18+fala.length*17}" rx="15" fill="#fff" stroke="#efe3ea"/>`+fala.map((l,i)=>`<text x="${bx+12}" y="${(t<1.95?100:96)+22+i*17}" font-family="Inter,system-ui" font-size="12.5" fill="#2a1f27">${l}</text>`).join('');
 const top=`<rect x="0" y="0" width="390" height="56" fill="#fbf6f9"/><path d="M0 56 H390" stroke="#efe3ea"/><text x="195" y="36" font-family="Georgia,serif" font-size="22" fill="#8d3a69" text-anchor="middle">LA FOUCH</text><text x="20" y="80" font-family="Inter" font-size="13" font-weight="600" fill="#8d3a69">‹ Início</text>`;
 const titulo=`<text x="14" y="${t<1.95?222:222}" font-family="Inter" font-size="10.5" font-weight="700" letter-spacing="2" fill="#8d3a69">DESCUBRA O SEU GRAU</text>`;
 const cap=t<1.95?'1 · se apresenta e acena':t<T_R1?'2 · pula para a direita do cartão e estica o ponteiro':t<T_FIM?'3 · aponta cada regra enquanto explica (sem cobrir o texto)':'4 · aponta o Começar; o botão pulsa 2 vezes';
 const rod=`<rect x="0" y="732" width="390" height="28" fill="#2a1f27"/><text x="195" y="751" font-family="Inter" font-size="11.5" fill="#fff" text-anchor="middle">S91 · ${cap}</text>`;
 document.getElementById('st').innerHTML=`<svg width="390" height="760" viewBox="0 0 390 760" style="background:#fbf6f9;display:block">${MD}${FZ}${top}${titulo}${card}${botao}${bal}${puffs(t,0,X0+60*K,Y0+80*K)}${mochi}${rod}</svg>`};
