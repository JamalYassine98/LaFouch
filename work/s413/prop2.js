(()=>{const st=document.createElement('style');st.textContent=
/* B: topo nunca sai da tela com letra maior (92vw dentro do corpo com zoom passava da tela) */

/* C: Início e Catálogo na mesma linha de base */
"";
document.head.appendChild(st);
function px(el){return el.getBoundingClientRect()}
function al(){const W=innerWidth,bar=document.querySelector('.top .bar'),mn=document.querySelector('#mnb'),bg=document.querySelector('#bagbtn');if(!bar||!mn||!bg)return;
 mn.style.marginLeft='';bg.style.marginRight='';bar.style.removeProperty('width');
 if(W>=900){const bz=parseFloat(getComputedStyle(document.body).zoom)||1;const ref=document.querySelector('#hdst');const rw=ref&&ref.getBoundingClientRect().width>0?ref.getBoundingClientRect().width:Math.min(1320*bz,.92*W);bar.style.setProperty('width',(rw/bz)+'px','important')}
 const s=document.querySelector('#layer .scrim.pg'),m=s&&s.querySelector('.modal.pgm'),b=s&&s.querySelector('.pgbar');
 if(m){m.style.paddingLeft=m.style.paddingRight='';m.style.width='';m.style.maxWidth=''}const cr=b&&b.querySelector('.pgcr');if(cr)cr.style.transform='';if(b)b.style.paddingLeft='';
 /* C: Catálogo na mesma linha de base do Início */
 if(b&&cr){const bk=b.querySelector('.pgback'),zb=px(b).width/b.offsetWidth||1;if(bk){const bl=e=>{const q=document.createElement('span');q.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';e.appendChild(q);const y=px(q).top;q.remove();return y};const a=bl(bk.querySelector('span')||bk),c=bl(cr.querySelector('a,span,button')||cr);if(Math.abs(a-c)>.3)cr.style.transform='translateY('+((a-c)/zb)+'px)'}}
 if(W<900)return;
 /* A1: ☰ e carrinho com o DESENHO encostado na borda da coluna (não a caixa do botão) */
 const zt=px(bar).width/bar.offsetWidth||1,br=px(bar);
 const g1=px(mn.querySelector('svg')||mn),g2=px(bg.querySelector('svg')||bg);
 const b1=px(mn),b2=px(bg);const dl=Math.min(g1.left-br.left,b1.left-2),dr=Math.min(br.right-g2.right,W-2-b2.right);mn.style.marginLeft=(-dl/zt)+'px';bg.style.marginRight=(-dr/zt)+'px';
 if(!m||!m.querySelector('.big'))return;
 /* A2: a peça usa a mesma coluna do topo */
 m.style.setProperty('width','100%','important');m.style.setProperty('max-width','none','important');const zm=px(m).width/m.offsetWidth||1,mr=px(m);
 const pl=(br.left-mr.left)/zm,pr=(mr.right-br.right)/zm;m.style.paddingLeft=pl+'px';m.style.paddingRight=pr+'px';
 /* A3: a seta do Início na mesma linha */
 const bk=b&&b.querySelector('.pgback'),ic=bk&&(bk.querySelector('svg')||bk);if(!ic)return;
 const zb=px(b).width/b.offsetWidth||1,tx=new DOMMatrix(getComputedStyle(bk).transform).m41||0;
 b.style.paddingLeft=(parseFloat(getComputedStyle(b).paddingLeft)+(br.left-px(ic).left)/zb+tx)+'px';
}
 const go=()=>requestAnimationFrame(al);
 new MutationObserver(go).observe(document.getElementById('layer')||document.body,{childList:true,subtree:true});
 document.addEventListener('animationend',go,true);document.addEventListener('transitionend',go,true);addEventListener('resize',go);go()})()
