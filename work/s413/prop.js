(()=>{function al(){const s=document.querySelector('#layer .scrim.pg');if(!s)return;const b=s.querySelector('.pgbar'),m=s.querySelector('.modal.pgm .big');if(!b||!m)return;
 b.style.paddingLeft='';if(innerWidth<900)return;
 const bk=b.querySelector('.pgback');const ic=(bk&&bk.querySelector('svg'))||bk;if(!ic)return;
 const z=b.getBoundingClientRect().width/b.offsetWidth||1;const pl=parseFloat(getComputedStyle(b).paddingLeft);
 const tx=new DOMMatrix(getComputedStyle(bk).transform).m41||0;const d=(m.getBoundingClientRect().left-ic.getBoundingClientRect().left)/z+tx;if(Math.abs(d)>1)b.style.paddingLeft=(pl+d)+'px'}
 new MutationObserver(()=>requestAnimationFrame(al)).observe(document.getElementById('layer')||document.body,{childList:true,subtree:true});document.addEventListener('animationend',al,true);document.addEventListener('transitionend',al,true);addEventListener('resize',al)})()
