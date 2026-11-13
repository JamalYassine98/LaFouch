# (bloco escuro: botões na cor clara do rótulo 'DESTACADO' da própria temática, se der >=4,5:1; senão branco)
# S224 · temáticas: 6 regras únicas (valem para as 8). CSS + um motor pequeno só para o ESBOÇO
# (na implementação vira CSS: variável --act por temática, .pr{color:var(--tx)}, #contabtn na lista de ícones do cabeçalho).
CSS = """
/* R5: menos enfeites e eles somem antes de chegar no texto e nos botões do Destaque */
#hdst .evfx i:nth-child(n+8){display:none!important}
#hdst .evfx{-webkit-mask-image:linear-gradient(#000 0,#000 46%,transparent 58%);mask-image:linear-gradient(#000 0,#000 46%,transparent 58%)}
"""
JS = r"""(()=>{const P=c=>(String(c).match(/[\d.]+/g)||[]).map(Number),L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])},C=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const pr=document.createElement('i');pr.style.cssText='position:absolute;left:-99px;color:var(--ac)';document.body.appendChild(pr);
 const bgs=e=>{for(let x=e;x;x=x.parentElement){const s=getComputedStyle(x);const g=((s.backgroundImage.match(/linear-gradient\((?:[^()]|\([^()]*\))*\)/g)||[]).join(' ').match(/rgba?\([^)]+\)/g)||[]).map(P).filter(c=>c.length<4||c[3]>.5);if(g.length)return g;const c=P(s.backgroundColor);if(c.length<4||c[3]>.5)return [c]}return [[255,255,255]]};
 const own=e=>[].some.call(e.childNodes,n=>n.nodeType===3&&n.textContent.trim());
 function run(){const acS=getComputedStyle(pr).color,ac=P(acS);
  /* R4: todo ícone do cabeçalho na mesma cor */
  const m=document.querySelector('#mnb'),c=document.querySelector('#contabtn');if(m&&c){const k=getComputedStyle(m.querySelector('svg')||m).color;c.style.setProperty('color',k,'important');c.querySelectorAll('svg').forEach(x=>x.style.setProperty('color',k,'important'))}
  /* R3: preço = cor de texto da temática (branco se o cartão for escuro) */
  document.querySelectorAll('#grid .pr,#layer *,#home *').forEach(e=>{if(e.__p||!own(e)||!/^\s*(Gs\.|R\$|US\$)/.test(e.textContent))return;if(getComputedStyle(e).color!=='rgb(20, 128, 63)')return;e.__p=1;const b=bgs(e);e.style.setProperty('color',Math.max(...b.map(L))<.2?'#fff':'var(--tx)','important')});
  /* R1 e R2: cor de destaque como texto só onde dá para ler (>=4,5:1); senão: claro em bloco escuro, destaque escurecido em fundo claro */
  document.querySelectorAll('a,button,span,b,i,p,div,small,strong,em,h2,h3,li').forEach(e=>{if(e.__a||!own(e)||getComputedStyle(e).color!==acS)return;const r=e.getBoundingClientRect();if(!r.width)return;const b=bgs(e);if(Math.min(...b.map(x=>C(ac,x)))>=4.5)return;e.__a=1;
   let nova;if(Math.max(...b.map(L))<.2){nova='rgb(255,255,255)';const h=e.closest('#hdst'),lb=h&&h.querySelector('.hlb');if(lb){const k=P(getComputedStyle(lb).color);if(Math.min(...b.map(x=>C(k,x)))>=4.5&&getComputedStyle(lb).color!==acS)nova='rgb('+k.slice(0,3).join(',')+')'}}else{let f=1,k=ac;while(f>.3&&Math.min(...b.map(x=>C(k,x)))<4.6){f-=.03;k=ac.slice(0,3).map(v=>v*f)}nova='rgb('+k.map(Math.round).join(',')+')'}
   const s=getComputedStyle(e);if(s.borderTopWidth!=='0px'&&s.borderTopColor===acS)e.style.setProperty('border-color',nova,'important');e.style.setProperty('color',nova,'important')})}
 run();setInterval(run,350)})()"""
