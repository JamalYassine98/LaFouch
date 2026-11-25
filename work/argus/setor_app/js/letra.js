// ARGUS · setor App · a letra grande do Android imitada no simulador: cada texto cresce na mesma proporção (e de novo a cada mudança da tela)
(f)=>{if(window.__argusLetra)return;window.__argusLetra=f;const base=new WeakMap();
 const aplica=()=>{for(const e of document.querySelectorAll('body *')){if(e.closest('svg'))continue;const own=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!own&&!e.matches('input,textarea,select'))continue;
  if(!base.has(e))base.set(e,parseFloat(getComputedStyle(e).fontSize));const alvo=(base.get(e)*f).toFixed(2)+'px';if(e.style.fontSize!==alvo)e.style.setProperty('font-size',alvo,'important')}};
 aplica();new MutationObserver(()=>{clearTimeout(window.__argusLT);window.__argusLT=setTimeout(aplica,30)}).observe(document.body,{childList:true,subtree:true});return 1}
