/* S87 · o Mochi vai até a bandeja, pega a lente pela haste e coloca no quadro — animação fluida (esboço) */
const E=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,EO=t=>1-Math.pow(1-t,3),EI=t=>t*t*t,cl=(x,a,b)=>Math.min(b,Math.max(a,x));
const EB=t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}; /* passa um pouquinho e volta */
function tr(k,t,ease){ease=ease||E;let i=0;while(i<k.length-2&&k[i+1][0]<=t)i++;const a=k[i],b=k[i+1];const u=cl((t-a[0])/(b[0]-a[0]||1),0,1);return a[1]+(b[1]-a[1])*ease(u)}
const lerp=(a,b,u)=>a+(b-a)*u,seg=(t,a,b)=>cl((t-a)/(b-a),0,1);
/* cena (px de um celular de 390 de largura) */
const K=.86,QX=170,QY=176,QW=200,QH=300,QM=QY+QH/2,TY=QY+QH+16,TX=QX,TW=QW,MX0=QX+14-199*K,MY0=QM-92*K;
const GR=[];for(let g=.75;g<=4.001;g+=.25)GR.push(Math.round(g*100)/100);const GI=GR.indexOf(1.5);
const miniX=i=>TX+10+i*((TW-20)/(GR.length-1)),miniY=TY+15;
const LINHAS=[['Bom dia!',16.5],['A casa é azul.',14.2],['O café está pronto.',12.4],['Ligue para a farmácia.',10.9],['O ônibus passa às oito.',9.5],['Leia a receita com calma.',8.2],['O jornal fala do tempo.',7.2],['Tome 1 comprimido ao dia.',6.3],['Agite antes de usar.',5.5]];
function ponteiro(len,op){return `<g opacity="${op}"><rect x="23" y="-3.2" width="14.7" height="6.4" rx="3" fill="#8d3a69"/><path d="M36.7 0 H${36.7+len}" stroke="#8d3a69" stroke-width="3" stroke-linecap="round"/><g transform="translate(${36.7+len} 0) scale(.75)"><rect x="-6" y="-9" width="7" height="18" rx="2.5" fill="#8d3a69"/><rect x="0" y="-8" width="17" height="16" rx="6" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><rect x="12" y="-7.5" width="20" height="6.5" rx="3.2" fill="#fff" stroke="#8d3a69" stroke-width="1.8"/><ellipse cx="7" cy="-8.5" rx="4.5" ry="3" fill="#fff" stroke="#8d3a69" stroke-width="1.6"/></g></g>`}
/* lente de prova com hastes (S68/S70), desenhada com centro (cx,cy), largura w, altura h */
function lente(cx,cy,w,h,rot,br,tag){const x=-w/2,y=-h/2,a=h*.22,sw=Math.max(2,w*.04);const bx=lerp(-w*.9,w*1.2,br);
 return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
 <path d="M${x+4} ${y+a} C ${x-w*.08} ${y+a+2} ${x-w*.12} ${y+a+8} ${x-w*.14} ${y+a+h*.08} q -2 6 3 8" stroke="url(#lzar)" stroke-width="${sw*.75}" stroke-linecap="round" fill="none"/>
 <path d="M${-x-4} ${y+a} C ${-x+w*.08} ${y+a+2} ${-x+w*.12} ${y+a+8} ${-x+w*.14} ${y+a+h*.08} q 2 6 -3 8" stroke="url(#lzar)" stroke-width="${sw*.75}" stroke-linecap="round" fill="none"/>
 <circle cx="${x+4}" cy="${y+a}" r="${sw*.55}" fill="#e7a6c7"/><circle cx="${-x-4}" cy="${y+a}" r="${sw*.55}" fill="#e7a6c7"/>
 <clipPath id="lzc${Math.round(w)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w*.32}"/></clipPath>
 <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w*.32}" fill="#ffffff" fill-opacity=".28"/>
 ${br>0&&br<1?`<g clip-path="url(#lzc${Math.round(w)})"><rect x="${bx}" y="${y-h*.2}" width="${w*.28}" height="${h*1.4}" fill="url(#lzbr)" transform="rotate(20 ${bx} ${y})"/></g>`:''}
 <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w*.32}" fill="none" stroke="url(#lzar)" stroke-width="${sw}"/>
 <path d="M${x+w*.16} ${y+h*.26} q ${w*.07} ${-h*.13} ${w*.28} ${-h*.15}" stroke="#fff" stroke-width="${sw*.6}" stroke-linecap="round" opacity=".8" fill="none"/>
 ${tag?`<g transform="translate(0 ${y-sw*.2}) scale(${tag})"><rect x="-26" y="-11" width="52" height="20" rx="7" fill="#8d3a69" stroke="#e7a6c7" stroke-width="1.5"/><text x="0" y="4" font-family="Inter,system-ui" font-size="12.5" font-weight="800" fill="#fff" text-anchor="middle">+1.50</text></g>`:''}</g>`}
const DEFS=`<defs><linearGradient id="lzar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c46a9c"/><stop offset=".45" stop-color="#8d3a69"/><stop offset=".75" stop-color="#5e2347"/><stop offset="1" stop-color="#e7a6c7"/></linearGradient>
<linearGradient id="lzbr" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="qclip"><rect x="${QX}" y="${QY}" width="${QW}" height="${QH}" rx="20"/></clipPath><filter id="qsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#8d3a69" flood-opacity=".08"/></filter></defs>`;
/* ---- linha do tempo (s) ---- */
const T_NAO=.7,T_RET=.85,T_PULA=1.15,T_CHEGA=1.6,T_PEGA=1.72,T_VOLTA=1.95,T_EM_CIMA=2.4,T_SOLTA=2.42,T_ENCAIXA=2.85,T_APONTA=3.15,DUR=4.6;
function R(t){
 /* posição do Mochi: pulo em arco até a bandeja e de volta, com antecipação e amortecimento */
 const ad_pega=18,[hxL,hyL]=[98+Math.cos(ad_pega*Math.PI/180)*25,92+Math.sin(ad_pega*Math.PI/180)*25];
 const MX1=miniX(GI)-hxL*K-4,MY1=miniY-hyL*K-6;
 let mx=MX0,my=MY0,hop=0,sx=1,sy=1,tilt=Math.sin(t*1.1)*1.4;
 const ida=seg(t,T_PULA,T_CHEGA),volta=seg(t,T_VOLTA,T_EM_CIMA);
 if(t>=T_PULA&&t<T_VOLTA){const e=E(ida);mx=lerp(MX0,MX1,e);my=lerp(MY0,MY1,e)-Math.sin(Math.PI*ida)*38}
 if(t>=T_VOLTA){const e=E(volta);mx=lerp(MX1,MX0,e);my=lerp(MY1,MY0,e)-Math.sin(Math.PI*volta)*44}
 /* squash & stretch: agacha antes, estica no ar, amassa ao pousar */
 const sq=(t0,d,amp)=>{const u=(t-t0)/d;return u>0&&u<1?Math.sin(u*Math.PI)*amp*Math.exp(-u*1.5):0};
 let s=0;s+=sq(T_PULA-.12,.14,.12);s-=sq(T_PULA+.02,ida<1?.3:.3,.08);s+=sq(T_CHEGA,.22,.14);s+=sq(T_VOLTA-.12,.14,.1);s-=sq(T_VOLTA+.02,.3,.08);s+=sq(T_EM_CIMA,.24,.13);
 sx=1+s;sy=1-s;
 if(ida>0&&ida<1)tilt+=Math.sin(ida*Math.PI)*8;if(volta>0&&volta<1)tilt-=Math.sin(volta*Math.PI)*9;
 /* braços: esquerdo dá equilíbrio no pulo; direito aponta → pega → carrega → solta → aponta */
 let ae=tr([[0,38],[T_PULA,38],[T_PULA+.2,-20],[T_CHEGA,30],[T_VOLTA,30],[T_VOLTA+.2,-25],[T_EM_CIMA,35],[DUR,38]],t);
 let ad=tr([[0,0],[T_RET,0],[T_PULA,40],[T_CHEGA-.08,ad_pega],[T_PEGA,ad_pega+4],[T_VOLTA,ad_pega],[T_EM_CIMA-.1,-25],[T_SOLTA,-55],[T_ENCAIXA,-30],[T_APONTA,0],[DUR,0]],t);
 const L=30;const face=t>=T_NAO&&t<T_PULA?{olha:1}:(t>=T_PEGA&&t<T_PEGA+.3)||(t>=T_ENCAIXA&&t<T_APONTA+.4)?{feliz:1}:{olha:1};
 const bl=((t%3.4)<.11)&&!face.feliz;const f=Object.assign({},face,bl?{pisca:1}:{});
 /* ponteiro: recolhe (3 cliques) e some; volta esticando depois do encaixe */
 const len=tr([[0,34.3],[T_NAO+.05,34.3],[T_RET+.2,0],[T_ENCAIXA,0],[T_APONTA+.25,34.3],[DUR,34.3]],t,u=>Math.floor(u*3)/3+EO((u*3)%1)/3);
 const pop=t<T_RET+.25?1:t<T_ENCAIXA?0:seg(t,T_ENCAIXA,T_ENCAIXA+.12);
 /* espelho balança com o pulo (movimento secundário) */
 const mr=Math.sin((t-T_CHEGA)*13)*Math.exp(-Math.max(0,t-T_CHEGA)*4)*(t>T_CHEGA?10:0)+Math.sin((t-T_EM_CIMA)*13)*Math.exp(-Math.max(0,t-T_EM_CIMA)*4)*(t>T_EM_CIMA?9:0);
 let m=limpa(f);m=m.replace(/(<circle cx="60" cy="47" r="12"[\s\S]*?<path d="M53.5 42[^>]*\/>)/,`<g transform="rotate(${mr.toFixed(2)} 60 58)">$1</g>`);
 const A1=bracoCamadas(-1,ae,L),A2=bracoCamadas(1,ad,L);
 const pon=`<g transform="${armT(1,ad)}">${ponteiro(len,pop.toFixed(3))}</g>`;
 const mochi=`<g transform="translate(${mx.toFixed(2)} ${my.toFixed(2)}) scale(${K})"><ellipse cx="60" cy="126" rx="${30-hop}" ry="4" fill="#8d3a69" opacity=".12"/><g transform="translate(60 124) rotate(${tilt.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)}) translate(-60 -124)">${A1.tras}${A2.tras}${m}${HASTES}${A1.frente}${A2.frente}${pon}</g></g>`;
 /* posição da mão direita na tela (para a lente acompanhar) */
 const hand=()=>{const r=(ad)*Math.PI/180,lx=98+Math.cos(r)*27,ly=92+Math.sin(r)*27;const c=Math.cos(tilt*Math.PI/180),sn=Math.sin(tilt*Math.PI/180);
  let px=(lx-60)*sx,py=(ly-124)*sy;const rx=px*c-py*sn+60,ry=px*sn+py*c+124;return [mx+rx*K,my+ry*K]};
 /* lente: fica na bandeja → sobe dourada → vai para a mão (segura pela haste) → voa crescendo e encaixa no quadro */
 const FW=QW+16,FH=QH+16,FX=QX+QW/2,FY=QM;let lz='',miniCls='';
 const sobe=seg(t,T_CHEGA-.25,T_CHEGA);
 if(t<T_PEGA){if(t>T_CHEGA-.25)miniCls='vez'}
 if(t>=T_PEGA&&t<T_SOLTA){const [hx,hy]=hand(),g=seg(t,T_PEGA,T_PEGA+.12);const w=lerp(12,30,EB(g)),h=w*1.18;
  /* a lente balança um tiquinho atrasada em relação à mão (follow-through) */
  const sw=Math.sin((t-T_PEGA)*11)*Math.exp(-(t-T_PEGA)*3)*10+(volta>0&&volta<1?Math.sin(volta*Math.PI)*-12:0);
  lz=lente(hx+w*.35,hy-h*.42,w,h,-12+sw,0,0)}
 if(t>=T_SOLTA){const u=seg(t,T_SOLTA,T_ENCAIXA),e=EO(u);const [hx,hy]=hand();const x0=hx+15,y0=hy-18;
  const cx=lerp(x0,FX,e)+Math.sin(u*Math.PI)*-18,cy=lerp(y0,FY,e)-Math.sin(u*Math.PI)*46;
  const sc=u<1?lerp(.14,1,EB(u)):1;const snap=t>T_ENCAIXA?1+Math.sin(seg(t,T_ENCAIXA,T_ENCAIXA+.22)*Math.PI)*.035:1;
  const br=seg(t,T_ENCAIXA+.05,T_ENCAIXA+.85);const tag=t>T_ENCAIXA?EB(seg(t,T_ENCAIXA,T_ENCAIXA+.25)):0;
  lz=lente(cx,cy,FW*sc*snap,FH*sc*snap,lerp(-14,0,e),br,tag)}
 /* quadro: depois do encaixe as letras ficam do tamanho que a pessoa leria com a lente */
 const mag=t>T_ENCAIXA?lerp(1,1.32,EB(seg(t,T_ENCAIXA,T_ENCAIXA+.45))):1;
 let ly=QY+28,lines='';LINHAS.forEach(([s,fz],i)=>{const hl=i===3;lines+=`${hl?`<rect x="${QX+20}" y="${ly-fz-3}" width="${s.length*fz*.48+10}" height="${fz+9}" rx="5" fill="#fdeaf3"/>`:''}<text x="${QX+24}" y="${ly}" font-family="Georgia,serif" font-size="${fz}" fill="${i<3?'#a99aa4':'#2a1f27'}">${i<3?'✓ ':''}${s}</text>`;ly+=fz*1.25+14});
 const quadro=`<rect x="${QX}" y="${QY}" width="${QW}" height="${QH}" rx="20" fill="#fff" stroke="#efe3ea" filter="url(#qsh)"/><g clip-path="url(#qclip)"><g transform="translate(${FX} ${QM-52}) scale(${mag}) translate(${-FX} ${-(QM-52)})">${lines}</g></g>`;
 const bandeja=`<rect x="${TX}" y="${TY}" width="${TW}" height="30" rx="12" fill="#7a2f5b"/>`+GR.map((g,i)=>{const isG=i===GI;let dy=0,stroke='#e7a6c7',op=1;if(isG){if(miniCls==='vez'){dy=-6*EO(sobe);stroke='#ffd34d'}if(t>=T_PEGA)op=.32}return `<circle cx="${miniX(i)}" cy="${miniY+dy}" r="6" fill="#fbe9f2" stroke="${stroke}" stroke-width="2" opacity="${op}"/>`}).join('');
 const botoes=`<rect x="12" y="610" width="366" height="52" rx="26" fill="#8d3a69"/><text x="195" y="642" font-family="Inter,system-ui" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">Consigo ler</text>
 <rect x="12.75" y="672.75" width="364.5" height="50.5" rx="25" fill="${t>T_NAO-.1&&t<T_NAO+.15?'#f6e7ef':'#fff'}" stroke="#8d3a69" stroke-width="1.5" transform="translate(195 698) scale(${t>T_NAO-.1&&t<T_NAO+.15?.97:1}) translate(-195 -698)"/><text x="195" y="704" font-family="Inter,system-ui" font-size="17" font-weight="700" fill="#8d3a69" text-anchor="middle">Não consigo</text>`;
 const fala=t<T_NAO?'Consegue ler esta?':t<T_ENCAIXA?'Vou pegar uma lente…':'Com a lente +1.50. Consegue ler?';
 const bal=`<rect x="12" y="74" width="260" height="56" rx="16" fill="#fff" stroke="#efe3ea"/><text x="26" y="108" font-family="Inter,system-ui" font-size="15" fill="#2a1f27">${fala}</text>`;
 const top=`<rect x="0" y="0" width="390" height="56" fill="#fbf6f9"/><path d="M0 56 H390" stroke="#efe3ea"/><text x="195" y="36" font-family="Georgia,serif" font-size="22" fill="#8d3a69" text-anchor="middle">LA FOUCH</text>`;
 document.getElementById('st').innerHTML=`<svg width="390" height="760" viewBox="0 0 390 760" style="background:#fbf6f9;display:block">${MD}${FZ}${DEFS}${top}${bal}${quadro}${bandeja}${botoes}${mochi}${lz}</svg>`}
