# S222 · WhatsApp "lingueta": nunca pela metade, nunca sumido. Com lugar livre = círculo inteiro (igual hoje);
# se cobriria algo, ou enquanto a tela rola = lingueta inteira colada na beirada, dentro da margem da página (não cobre nada).
EASE = 'cubic-bezier(.2,.8,.2,1)'
N = "html:not(.onprod):not(:has(#layer .buyrow))"
CSS = """
@media (max-width:860px){
 html body a.wa{transition:width .32s EASE,height .32s EASE,right .32s EASE,border-radius .32s EASE,box-shadow .32s EASE,opacity .2s EASE}
 /* o recolhido antigo (meio círculo, 92%) e o sumiço ao rolar deixam de valer */
 N.wamin body a.wa,N.warol body a.wa{transform:none!important;opacity:1!important;pointer-events:auto!important}
 N.wamin body a.wa svg{transform:none!important}
 html body a.wa svg{transition:width .32s EASE,height .32s EASE,transform .32s EASE}
 N.lfmin body a.wa,N.lfrol body a.wa{transform:none!important;scale:1!important;opacity:1!important;pointer-events:auto!important;right:0!important;
   width:calc(LARG / var(--z,1))!important;height:calc(ALT / var(--z,1))!important;border-radius:calc(14px / var(--z,1)) 0 0 calc(14px / var(--z,1))!important;animation:none!important;box-shadow:-2px 4px 12px rgba(0,0,0,.14)!important}
 N.lfmin body a.wa svg,N.lfrol body a.wa svg{transform:none!important;width:calc(ICO / var(--z,1))!important;height:calc(ICO / var(--z,1))!important}
}
""".replace('EASE', EASE).replace('N.', N + '.')
# JS do esboço (na implementação é 1 ajuste na função cobre() do js/lf-site.js): mede o círculo SEM animação, em 9 pontos (inclui os cantos)
JS = """(()=>{const H=document.documentElement,q=()=>document.querySelector('a.wa'),peca=()=>H.classList.contains('onprod')||!!document.querySelector('#layer .buyrow');
 function mede(){const w=q();if(!w||!matchMedia('(max-width:860px)').matches||peca()){H.classList.remove('lfmin','lfrol');return}
  const tr=w.style.transition,sv=w.querySelector('svg'),ts=sv.style.transition;w.style.transition='none';sv.style.transition='none';const era=H.classList.contains('lfmin'),rol=H.classList.contains('lfrol');H.classList.remove('lfmin','lfrol');
  const r=w.getBoundingClientRect();let hit=false;if(r.width){const pe=w.style.getPropertyValue('pointer-events'),pp=w.style.getPropertyPriority('pointer-events');w.style.setProperty('pointer-events','none','important');
   for(const fx of [.08,.5,.92])for(const fy of [.08,.5,.92]){if(hit)break;const e=document.elementFromPoint(r.left+r.width*fx,r.top+r.height*fy);if(!e||e===document.body||e===H||e.closest('a.wa'))continue;
    if(/^(BUTTON|A|IMG|INPUT|SELECT|TEXTAREA|SVG|PATH)$/i.test(e.tagName)||e.closest('button,a,input')||[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim()))hit=true}
   w.style.setProperty('pointer-events',pe,pp)}
  if(era||rol){H.classList.add(era?'lfmin':'lfrol');void w.offsetWidth}   /* volta ao que estava, sem animar */
  w.style.transition=tr;sv.style.transition=ts;void w.offsetWidth;H.classList.toggle('lfmin',hit);H.classList.remove('lfrol')}
 let t=0;document.addEventListener('scroll',()=>{if(peca())return;H.classList.add('lfrol');clearTimeout(t);t=setTimeout(mede,700)},true);
 addEventListener('resize',()=>setTimeout(mede,200));document.addEventListener('click',()=>setTimeout(mede,900),true);mede();window.__lfMede=mede})()"""
def css(W): return CSS.replace('LARG', '24px' if W < 600 else '30px').replace('ALT', '56px' if W < 600 else '64px').replace('ICO', '17px' if W < 600 else '21px')
# estado do botão: forma, quanto aparece, se está por cima de algo clicável/texto
EST = """()=>{const w=document.querySelector('a.wa');if(!w)return null;const r=w.getBoundingClientRect(),s=getComputedStyle(w),W=innerWidth,H=innerHeight,C=document.documentElement.classList;
 if(!r.width||s.display=='none')return {forma:'ausente'};
 const vis=Math.max(0,Math.min(r.right,W)-Math.max(r.left,0))*Math.max(0,Math.min(r.bottom,H)-Math.max(r.top,0))/(r.width*r.height);
 const pe=w.style.getPropertyValue('pointer-events'),pp=w.style.getPropertyPriority('pointer-events');w.style.setProperty('pointer-events','none','important');let hit=0,quem='';
 for(let i=0;i<5;i++)for(let j=0;j<5;j++){const x=Math.max(r.left,0)+(Math.min(r.right,W)-Math.max(r.left,0))*(i+.5)/5,y=r.top+r.height*(j+.5)/5,e=document.elementFromPoint(x,y);if(!e||e===document.body||e===document.documentElement||e.closest('a.wa'))continue;
  if(e.closest('button,a,input,select')||/^(IMG)$/.test(e.tagName)||[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim())){hit++;quem=quem||(e.closest('button,a')||e).textContent.trim().slice(0,20)||e.tagName}}
 w.style.setProperty('pointer-events',pe,pp);const ic=w.querySelector('svg').getBoundingClientRect();
 return {forma:(window.__lfMede?C.contains('lfmin'):C.contains('wamin'))?'min':'livre',vis:Math.round(vis*100),op:+s.opacity,cobre:hit,quem,caixa:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],icone:Math.round(Math.max(0,Math.min(ic.right,W)-Math.max(ic.left,0))/ic.width*100)}}"""
