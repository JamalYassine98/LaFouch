// ARGUS · setor SITE · nada encosta no DESENHO da armação nas fotos dos cartões (prova dos selos, aprovada pelo dono 20/11 11:40;
// vinda de work/fiscal/selos.py): folga mínima, "Últimas N" vermelho e sem fundo dentro da foto, nada cobrindo nada, nenhum selo de tema.
async()=>{const z=parseFloat(getComputedStyle(document.body).zoom)||1,R=e=>e.getBoundingClientRect(),bad=[];let n=0,folga=99;
for(const im of document.querySelectorAll('#grid .card .ph img.pf, #home .hc .hci img')){const r=R(im);if(!r.width||!im.naturalWidth)continue;const ft=im.closest('.ph,.hci'),cd=im.closest('.card,.hc');
 const ref=(cd.classList.contains('hc')?'Início ':'Catálogo ')+(cd.getAttribute('data-open')||cd.querySelector('[data-fav]').getAttribute('data-fav'));
 const c=document.createElement('canvas'),W=c.width=Math.round(r.width),H=c.height=Math.round(r.height),x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);
 const s=Math.min(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;x.drawImage(im,(W-w)/2,(H-h)/2,w,h);const d=x.getImageData(0,0,W,H).data;
 const tinta=(q)=>{const x0=Math.max(0,Math.floor(q.left-r.left)),x1=Math.min(W,Math.ceil(q.right-r.left)),y0=Math.max(0,Math.floor(q.top-r.top)),y1=Math.min(H,Math.ceil(q.bottom-r.top));
   for(let y=y0;y<y1;y++)for(let X=x0;X<x1;X++){const i=(y*W+X)*4;if(d[i]<225||d[i+1]<225||d[i+2]<225)return true}return false};
 const cresce=(q,k)=>({left:q.left-k,right:q.right+k,top:q.top-k,bottom:q.bottom+k});
 const itens=[...cd.querySelectorAll('.sel1,.hb,.hidl,.evse,.ulin,.fav,.edt')].filter(e=>R(e).width).map(e=>{let q=R(e);if(e.classList.contains('ulin')){const g=document.createRange();g.selectNodeContents(e);q=g.getBoundingClientRect()}
   if(e.classList.contains('fav')){const v=e.querySelector('svg');if(v)q=R(v)}return {e,q,nome:e.className.split(' ')[0]+' "'+e.textContent.trim().slice(0,18)+'"'}});
 if(itens.length)n++;
 for(const it of itens){if(it.q.bottom<R(ft).top||it.q.top>R(ft).bottom)continue;if(tinta(it.q))bad.push(ref+': '+it.nome+' em cima da armação');else{let k=0;while(k<12&&!tinta(cresce(it.q,(k+1)*z)))k++;folga=Math.min(folga,k);if(k<4)bad.push(ref+': '+it.nome+' a '+k+' px da armação (mínimo 4)')}}
 for(let i=0;i<itens.length;i++)for(let j=i+1;j<itens.length;j++){const a=itens[i].q,b=itens[j].q;if(a.left<b.right-.5&&b.left<a.right-.5&&a.top<b.bottom-.5&&b.top<a.bottom-.5)bad.push(ref+': '+itens[i].nome+' × '+itens[j].nome)}
 const u=cd.querySelector('.ulin');if(u&&R(u).width){const k=getComputedStyle(u),cc=k.color.match(/\d+/g).map(Number),q=R(u);
   if(!ft.contains(u)||q.top<R(ft).top-.5||q.bottom>R(ft).bottom+.5)bad.push(ref+': Últimas fora da foto');
   if(!(cc[0]>=180&&cc[1]<=120&&cc[2]<=120))bad.push(ref+': Últimas sem vermelho');if(!/rgba\(0, 0, 0, 0\)|transparent/.test(k.backgroundColor))bad.push(ref+': Últimas com fundo');
   const tx=cd.querySelector('.nm,.hn,.ref');if(tx){const wk=document.createTreeWalker(tx,4);let nd;while((nd=wk.nextNode())&&!nd.textContent.trim());if(nd){const g=document.createRange();g.setStart(nd,0);g.setEnd(nd,1);const dd=(R(u.querySelector('i')).left-g.getBoundingClientRect().left)/z;if(Math.abs(dd)>1.5)bad.push(ref+': Últimas '+dd.toFixed(1)+' px fora do texto')}}}
 if(cd.querySelector('.evse,.sel1.tm,.hb.tm'))bad.push(ref+': selo de tema')}
return {n,folga,bad:[...new Set(bad)]}}
