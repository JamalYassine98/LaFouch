"""Prova dos selos (vira prova do porteiro quando o dono aprovar): em cada cartão com foto,
  - nada na foto encosta no DESENHO da armação (medido nos pontos da imagem), com folga mínima;
  - "Últimas N": dentro da foto, vermelho, sem fundo, alinhado com o texto do cartão;
  - nenhuma coisa da foto cobre outra; não existe selo de tema.
uso: prova_selos.py URL"""
import sys,json
from playwright.sync_api import sync_playwright
INIT="try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
JS=r"""async()=>{const z=parseFloat(getComputedStyle(document.body).zoom)||1,R=e=>e.getBoundingClientRect(),bad=[];let n=0,folga=99;
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
return {n,folga,bad:[...new Set(bad)]}}"""
tot=0
with sync_playwright() as p:
    b=p.chromium.launch()
    for nm,w,h,mob,letra in [('celular',386,858,True,0),('celular letra 1,2×',386,858,True,1),('tablet',768,1024,True,0),('PC',1440,900,False,0),('PC grande',2560,1300,False,0)]:
        for u in ['/?cliente=1','/?cliente=1&r=armazones','/?cliente=1&r=lentes-de-sol']:
            c=b.new_context(viewport={'width':w,'height':h},is_mobile=mob,has_touch=mob,reduced_motion='reduce');c.add_init_script(INIT+("document.addEventListener('DOMContentLoaded',()=>{document.documentElement.style.fontSize='120%'});" if letra else ''))
            pg=c.new_page();pg.goto(sys.argv[1]+u,wait_until='load');pg.wait_for_timeout(5500)
            pg.evaluate("async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0)}")
            r=pg.evaluate(JS);tot+=len(r['bad'])
            print(('ok   ' if not r['bad'] else 'FALHA'),nm,'·',u[-14:],'·',r['n'],'cartões com algo na foto · folga mínima até a armação',r['folga'],'px',('· '+' | '.join(r['bad'][:5])) if r['bad'] else '')
            c.close()
    b.close()
print('RESULTADO:','tudo certo' if not tot else '%d falha(s)'%tot)
