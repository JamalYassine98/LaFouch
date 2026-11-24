# ARGUS · tempo (lentidão), parte do motor: quanto o app demora para abrir e para responder a cada toque, com a loja cheia
# (dia de evento). Conta do toque até a tela parar de mudar (nenhuma mudança por 150 ms). Limites escritos só aqui.
ABRIR_MS = 3000; TOQUE_MS = 500   # simulador de PC; no celular é mais lento, então o limite aqui é apertado de propósito
MEDE = r"""(i)=>new Promise(res=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let p=e;p&&p.nodeType==1;p=p.parentElement){const c=getComputedStyle(p);if(c.display=='none'||c.visibility=='hidden'||+c.opacity==0)return false}return true};
 const L=[...document.querySelectorAll('button,a[href],[data-act],[role=button],summary,input[type=checkbox],select')].filter(e=>vis(e)&&!e.closest('nav,#mainnav,#nvBar,aside')&&!(e.parentElement&&e.parentElement.closest('button,a[href],[data-act],[role=button]')));
 const e=L[i];if(!e)return res(-1);e.scrollIntoView({block:'center',behavior:'instant'});
 let ult=0;const t0=performance.now();const mo=new MutationObserver(()=>{ult=performance.now()});mo.observe(document.body,{childList:true,subtree:true,attributes:true,characterData:true});
 e.click();ult=performance.now();const fim=()=>{if(performance.now()-ult>=150||performance.now()-t0>15000){mo.disconnect();res(Math.round(ult-t0))}else setTimeout(fim,30)};setTimeout(fim,30)})"""
