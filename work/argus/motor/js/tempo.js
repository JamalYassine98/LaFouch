// ARGUS · tempo de um toque: do toque até a tela parar de mudar (150 ms sem mudança), no máximo 15 s
(i)=>new Promise(res=>{const A=window.__argus,e=A.tocaveis()[i];if(!e)return res(-1);e.scrollIntoView({block:'center',behavior:'instant'});
 let ult=0;const t0=performance.now(),mo=new MutationObserver(()=>{ult=performance.now()});mo.observe(document.body,{childList:true,subtree:true,attributes:true,characterData:true});
 e.click();ult=performance.now();const fim=()=>{if(performance.now()-ult>=150||performance.now()-t0>15000){mo.disconnect();res(Math.round(ult-t0))}else setTimeout(fim,30)};setTimeout(fim,30)})
