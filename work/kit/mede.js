/* MEDE — UM jeito só de medir uma tela (plano das ferramentas, parte 2; dono 22/11).
   Uso (Playwright):  pg.evaluate(open('work/kit/mede.js').read())          → {L, sob, achados}
   L   = as peças da tela (o que é, texto, caixa, cor, fundo, letra, classe) — o comparador compara Hoje × Proposta por elas.
   sob = pares de peças de ler uma em cima da outra.
   achados = [{regra, ids:[id da peça…], d:'explicação'}] — cada regra escrita UMA vez, aqui:
     sobreposto · cortado · fora da tela · página larga · coberto (não dá para tocar) · encosta na foto · quebrou a linha · janela fora da tela
   Cada regra só está aqui porque pegou sozinha um erro real que o dono achou e um defeito plantado (work/kit/mede_prova.py).
   Não muda nada na tela (o estilo de medir sai no fim). */
()=>{

const z=parseFloat(getComputedStyle(document.body).zoom)||1,W=innerWidth;
// para ver o que está por cima de verdade, todo elemento responde ao toque durante a coleta
const st=document.createElement('style');st.textContent='*{pointer-events:auto!important}';document.head.appendChild(st);
const oculto=e=>{for(let x=e;x;x=x.parentElement){const k=getComputedStyle(x);if(k.display==='none'||k.visibility==='hidden'||+k.opacity===0)return true}return false};
const caixa=e=>{const r=e.getBoundingClientRect();return r.width>=1&&r.height>=1&&!oculto(e)?r:null};
const texto=e=>[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).filter(Boolean).join(' ').replace(/\s+/g,' ').slice(0,40);
const fixoDe=e=>{for(let x=e;x&&x!==document.body;x=x.parentElement){const p=getComputedStyle(x).position;if(p==='fixed'||p==='sticky')return x}return null};
const dentroDeSvg=e=>!!(e.parentElement&&e.parentElement.closest('svg'));
// recorte: a caixa visível de verdade (o que sai de um carrossel ou de uma caixa com rolagem não aparece)
const recorte=e=>{let L=-1e9,T=-1e9,R=1e9,B=1e9;for(let x=e.parentElement;x&&x!==document.body;x=x.parentElement){const k=getComputedStyle(x);if(k.overflowX!=='visible'||k.overflowY!=='visible'){const r=x.getBoundingClientRect();if(k.overflowX!=='visible'){L=Math.max(L,r.left);R=Math.min(R,r.right)}if(k.overflowY!=='visible'){T=Math.max(T,r.top);B=Math.min(B,r.bottom)}}}return {L,T,R,B}};
const out=[],cont={},M=new Map(),E=new Map();
for(const e of document.querySelectorAll('body *')){
  if(/^(SCRIPT|STYLE|LINK|META|BR|NOSCRIPT|TEMPLATE)$/.test(e.tagName))continue;
  const r=caixa(e);if(!r)continue;
  let p=e.parentElement,pr=null;while(p&&!(pr=caixa(p)))p=p.parentElement;
  const t=texto(e),tag=e.tagName.toLowerCase();
  const id=tag+'|'+t+'|'+(e.getAttribute('aria-label')||'')+'|'+(e.getAttribute('data-open')||e.getAttribute('data-fav')||'');
  cont[id]=(cont[id]||0)+1;
  const c=getComputedStyle(e),folha=!dentroDeSvg(e)&&(!!t||/^(IMG|SVG|CANVAS|VIDEO|INPUT|SELECT|TEXTAREA)$/i.test(e.tagName));
  let cortado=false;
  if(t&&c.overflow!=='visible'&&(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+2))cortado=true;
  if(t&&c.textOverflow==='ellipsis'&&e.scrollWidth>e.clientWidth+1)cortado=true;
  const k=recorte(e),fora=folha&&Math.min(r.right,k.R)>W+1&&k.R>W+1||folha&&Math.max(r.left,k.L)<-1&&k.L<-1;
  const o={id:id+'#'+cont[id],nome:tag+(e.id?'#'+e.id:'')+[...e.classList].slice(0,3).map(x=>'.'+x).join('')+(t?' "'+t.slice(0,30)+'"':''),
    cls:[...e.classList].sort().join(' '),
    x:(r.left-(pr?pr.left:0))/z,y:(r.top-(pr?pr.top:0))/z,w:r.width/z,h:r.height/z,
    rx:r.left+scrollX,ry:r.top+scrollY,rw:r.width,rh:r.height,
    folha,cortado,fora,cor:c.color,fundo:c.backgroundColor,letra:c.fontSize+' '+c.fontWeight};
  out.push(o);E.set(e,o);if(folha&&t)M.set(e,{o,fixo:!!fixoDe(e)})}
// sobreposição = duas coisas DE LER (com texto) se cobrindo, na mesma camada de rolagem
// (texto em cima de foto é desenho; o topo fixo passando por cima do conteúdo ao rolar é desenho;
//  um embaixo de uma janela não conta: ele nem aparece na pilha do que está desenhado ali; um dentro do outro não conta)
// tinta = onde o texto está desenhado (não a caixa inteira: um título largo ao lado do ×, ou a área de toque de 44 px de um link, não é sobreposição)
const tinta=e=>{let L=1e9,T=1e9,R=-1e9,B=-1e9;for(const n of e.childNodes){if(n.nodeType!==3||!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);for(const q of rg.getClientRects()){if(q.width<1)continue;L=Math.min(L,q.left);T=Math.min(T,q.top);R=Math.max(R,q.right);B=Math.max(B,q.bottom)}}return R>L?{left:L,top:T,right:R,bottom:B}:e.getBoundingClientRect()};
const F=[...M.keys()],sob=[];
for(let i=0;i<F.length;i++)for(let j=i+1;j<F.length;j++){const a=F[i],b=F[j];if(a.contains(b)||b.contains(a)||M.get(a).fixo!==M.get(b).fixo)continue;
  const A=tinta(a),B=tinta(b),L=Math.max(A.left,B.left),R=Math.min(A.right,B.right),T=Math.max(A.top,B.top),D=Math.min(A.bottom,B.bottom);
  if(R-L<1||D-T<1)continue;const x=(L+R)/2,y=(T+D)/2;
  const pilha=document.elementsFromPoint(Math.min(Math.max(x,0),innerWidth-1),Math.min(Math.max(y,0),innerHeight-1));
  const ia=pilha.findIndex(n=>n===a||a.contains(n)),ib=pilha.findIndex(n=>n===b||b.contains(n));
  if(!(x>=0&&y>=0&&x<innerWidth&&y<innerHeight&&ia>=0&&ib>=0))continue;
  // entre os dois, uma camada com fundo (janela, cartão por cima) esconde o de baixo: aí não é sobreposição que se vê
  const cima=ia<ib?a:b,baixo=ia<ib?b:a;let tampa=false;for(let k=Math.min(ia,ib)+1;k<Math.max(ia,ib);k++){const n=pilha[k];
    // o fundo de quem contém o de baixo é o chão dele; já o fundo de uma caixa que só contém o de cima (a janela) tampa o de baixo
    if(n.contains(baixo)||cima.contains(n)||baixo.contains(n))continue;
    const bg=getComputedStyle(n).backgroundColor,m=bg.match(/rgba?\(([^)]+)\)/),al=m?(m[1].split(',')[3]===undefined?1:+m[1].split(',')[3]):0;if(al>.5||n.tagName==='IMG'){tampa=true;break}}
  if(!tampa)sob.push([M.get(a).o.id,M.get(b).o.id])}

const W2=innerWidth,H2=innerHeight,A=[];
const idDe=e=>{for(let x=e;x&&x!==document.body;x=x.parentElement){const o=E.get(x);if(o)return o.id}return ''};
const visivel=e=>{const r=caixa(e);return r&&r.bottom>0&&r.top<H2&&r.right>0&&r.left<W2?r:null};
// sobreposto / cortado / fora (as mesmas da coleta)
const nomeDe={};for(const o of out)nomeDe[o.id]=o.nome;
for(const [a,b] of sob)A.push({regra:'sobreposto',ids:[a,b],d:(nomeDe[a]||a)+' em cima de '+(nomeDe[b]||b)});
for(const o of out){if(o.cortado)A.push({regra:'cortado',ids:[o.id],d:o.nome+': o texto não cabe na caixa'});if(o.fora)A.push({regra:'fora da tela',ids:[o.id],d:o.nome+' passa da borda do aparelho'})}
// página larga
const sw=document.documentElement.scrollWidth;if(sw>W2+1)A.push({regra:'página larga',ids:[],d:'a página rola para o lado ('+sw+' px numa tela de '+W2+')'});
// janela aberta (janela de baixo, aviso, câmera…) tem de estar inteira na tela
for(const j of document.querySelectorAll('[role=dialog],[aria-modal=true],.modal,.ljJn')){const r=caixa(j);if(!r||r.height<40)continue;
  let rolaDentro=false;for(let x=j;x&&x!==document.documentElement;x=x.parentElement){const k=getComputedStyle(x);if(/auto|scroll/.test(k.overflowY)&&x.scrollHeight>x.clientHeight+2){rolaDentro=true;break}} // janela mais alta que a tela rola (ela ou a camada dela)
  if(r.left<-1||r.right>W2+1||!rolaDentro&&(r.top<-1||r.top>H2-40||r.bottom>H2+1)){A.push({regra:'janela fora da tela',ids:[idDe(j)],d:'a janela aberta não está inteira na tela ('+Math.round(r.top)+'…'+Math.round(r.bottom)+' numa altura de '+H2+')'})}}
// quebrou a linha: botão, rótulo, link curto e preço são de UMA linha (regra L4: se não couber, a letra diminui)
const linhas=e=>{const R=[];const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);for(const q of rg.getClientRects())if(q.width>1&&q.height>4)R.push(q)}R.sort((a,b)=>a.top-b.top);let L=0,fim=-1e9;for(const q of R){if(q.top>=fim-2){L++;fim=q.bottom}else fim=Math.max(fim,q.bottom)}return L};
for(const e of document.querySelectorAll('button,[role=button],.btn,label,nav a,[data-cabe] *,.price,.preco')){const r=visivel(e);if(!r)continue;
  const t=(e.innerText||'').trim();if(!t||t.length>40||t.indexOf('\n')>=0)continue;if(e.querySelector('button,a,p,div'))continue;
  if(linhas(e)>1)A.push({regra:'quebrou a linha',ids:[idDe(e)],d:'“'+t.slice(0,30)+'” quebrou em 2 linhas'})}
// encosta na foto: texto em cima da foto de uma peça só pode ficar no fundo liso dela, nunca em cima do desenho (a armação)
const tela=document.createElement('canvas'),cx2=tela.getContext('2d',{willReadFrequently:true});
const desenho=(img,q)=>{ // fração dos pontos de q (caixa na tela) que caem no desenho da foto (diferente do fundo dela)
  const nw=img.naturalWidth,nh=img.naturalHeight;if(!nw||!nh)return -1;const R=img.getBoundingClientRect(),k=getComputedStyle(img),fit=k.objectFit;
  let s=1,ox=0,oy=0,w=R.width,h=R.height;
  if(fit==='contain'||fit==='scale-down'){s=Math.min(R.width/nw,R.height/nh);w=nw*s;h=nh*s;ox=(R.width-w)/2;oy=(R.height-h)/2}
  else if(fit==='cover'){s=Math.max(R.width/nw,R.height/nh);w=nw*s;h=nh*s;ox=(R.width-w)/2;oy=(R.height-h)/2}
  else{s=R.width/nw}
  const sx=fit==='fill'||!fit?R.width/nw:s,sy=fit==='fill'||!fit?R.height/nh:s;
  tela.width=nw;tela.height=nh;try{cx2.drawImage(img,0,0);var px=cx2.getImageData(0,0,nw,nh).data}catch(_){return -1}
  const P=(x,y)=>{const i=(Math.max(0,Math.min(nh-1,y|0))*nw+Math.max(0,Math.min(nw-1,x|0)))*4;return [px[i],px[i+1],px[i+2]]};
  const f=P(2,2),dif=c=>Math.abs(c[0]-f[0])+Math.abs(c[1]-f[1])+Math.abs(c[2]-f[2]);
  let n=0,d=0;for(let y=q.top-2;y<=q.bottom+2;y+=2)for(let x=q.left-2;x<=q.right+2;x+=2){const ix=(x-R.left-ox)/sx,iy=(y-R.top-oy)/sy;if(ix<0||iy<0||ix>=nw||iy>=nh)continue;n++;if(dif(P(ix,iy))>60)d++}
  return n?d/n:-1};
const fotos=[...document.querySelectorAll('img')].filter(i=>i.complete&&visivel(i)&&i.getBoundingClientRect().width>60);
const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.textContent.trim().length>1?1:2});let nt;
while(nt=tw.nextNode()){const e=nt.parentElement;if(!e||e.closest('script,style,svg')||oculto(e))continue;const rg=document.createRange();rg.selectNodeContents(nt);
  for(const q of rg.getClientRects()){if(q.width<2||q.height<4||q.bottom<0||q.top>H2)continue;
    for(const img of fotos){if(fixoDe(img)!==fixoDe(e))continue; // a foto e o texto na mesma camada (não a vitrine que ficou atrás da janela)
      const R0=img.getBoundingClientRect(),K=recorte(img),R={left:Math.max(R0.left,K.L),right:Math.min(R0.right,K.R),top:Math.max(R0.top,K.T),bottom:Math.min(R0.bottom,K.B)}; // só a parte da foto que aparece
      if(q.left>=R.right||q.right<=R.left||q.top>=R.bottom||q.bottom<=R.top)continue;
      // só a foto que fica embaixo do texto (o texto por cima dela na pilha)
      const pil=document.elementsFromPoint(Math.min(W2-1,Math.max(0,(q.left+q.right)/2)),Math.min(H2-1,Math.max(0,(q.top+q.bottom)/2)));
      const ii=pil.indexOf(img);if(ii<0||!(pil[0]===e||e.contains(pil[0])||pil[0].contains(e)))continue;
      if(pil.slice(1,ii).some(n=>!n.contains(e)&&!n.contains(img)&&(n.tagName==='IMG'||(()=>{const m=getComputedStyle(n).backgroundColor.match(/rgba?\(([^)]+)\)/);return m&&(m[1].split(',')[3]===undefined||+m[1].split(',')[3]>.5)})())))continue;
      const fr=desenho(img,q);
      if(fr>0.04){A.push({regra:'encosta na foto',ids:[idDe(e),idDe(img)],d:'“'+nt.textContent.trim().slice(0,24)+'” encosta no desenho da foto ('+Math.round(fr*100)+'% dos pontos)'});break}}}}
st.remove(); // daqui em diante, o toque de verdade (o que não responde ao toque não tampa)
const paradoDe=e=>{for(let x=e.parentElement;x&&x!==document.body;x=x.parentElement){const k=getComputedStyle(x);if(/auto|scroll/.test(k.overflowY)&&x.scrollHeight>x.clientHeight+2)return null;if(k.position==='fixed'||k.position==='sticky')return x}return null};
// coberto: o que se toca precisa estar por cima no ponto do toque.
// Conteúdo que rola passando por baixo de uma barra fixa é desenho; atrás de uma janela aberta é de propósito.
// Mas uma coisa FIXA (o topo, a barra de compra) tampada por OUTRA coisa fixa é falha (ex.: faixa do evento em cima do topo).
const janela=[...document.querySelectorAll('[role=dialog],[aria-modal=true],.modal,.ljJn,#layer .scrim')].filter(j=>{const r=caixa(j);return r&&r.height>40}).pop();
for(const e of document.querySelectorAll('button,a[href],[role=button],input,select,textarea,summary,[data-open]')){
  if(e.closest('[inert],[aria-hidden=true]'))continue;const r=visivel(e);if(!r||r.width<8||r.height<8)continue;if(janela&&!janela.contains(e))continue;
  if(getComputedStyle(e).pointerEvents==='none')continue; 
  const fe=paradoDe(e),cx=Math.min(W2-1,Math.max(0,r.left+r.width/2)),cy=Math.min(H2-1,Math.max(0,r.top+r.height/2));
  if(cy<0||cy>=H2)continue;const t=document.elementFromPoint(cx,cy);if(!t||t===e||e.contains(t)||t.contains(e))continue;
  const ft=fixoDe(t);if(!ft||ft.contains(e))continue;
  if(!fe)continue; // conteúdo rolando por baixo de uma barra fixa: desenho
  A.push({regra:'coberto',ids:[idDe(e),idDe(t)],d:'não dá para tocar: '+(e.getAttribute('aria-label')||e.innerText||e.tagName).trim().slice(0,30)+' está embaixo de '+(t.innerText||t.className||t.tagName).toString().trim().slice(0,30)})}
return {L:out,sob,achados:A}}
