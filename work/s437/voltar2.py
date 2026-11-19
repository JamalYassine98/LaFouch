exec(open('/home/claude/lafouch/work/s437/esb.py').read())
JS=r"""(rot)=>{const e=[...document.querySelectorAll('button.ibtn[aria-label=Voltar]')].find(x=>x.getBoundingClientRect().height);if(!e)return 0;const box=e.parentElement;
 const v=document.createElement('button');v.type='button';v.className='nvVsP';v.style.cssText='display:inline-flex;align-items:center;gap:6px;min-height:44px;margin:-6px 0;padding:0;background:none;border:0;color:var(--mute);font:inherit;font-size:12px;font-weight:600;letter-spacing:1.68px;text-transform:uppercase';
 v.innerHTML='<i style="font-style:normal;font-size:16px;font-weight:400;letter-spacing:0;transform:translateY(-1px)">‹</i>'+rot;v.onclick=()=>e.click();box.replaceWith(v);
 const row=v.parentElement,sib=[...row.children].find(c=>c!==v);
 const card=row.parentElement;const txt=[...card.querySelectorAll('h1,h2,h3,b,.lbl,.cxLb')].find(x=>x.getBoundingClientRect().top>v.getBoundingClientRect().bottom&&x.getBoundingClientRect().height);
 if(sib){const rg=document.createRange();rg.selectNodeContents(v);const L=[...rg.getClientRects()].filter(r=>r.width>4).pop();const sr=sib.getBoundingClientRect();const dy=(sr.top+sr.height/2)-(L.top+L.height/2);v.style.transform='translateY('+dy.toFixed(1)+'px)'}
 return 1}"""
REFP=["()=>window.__LF.setView('fx')"]
caso('voltar_peca','Peça do Catálogo',C['catalogo-peca'],'button.ibtn[aria-label=Voltar], .nvVsP',"()=>("+JS+")('Catálogo')",'Câmbio (hoje)',REFP,'.nvVs',
     '"‹" redondo + "Vender" (2º título)','"‹ CATÁLOGO" versalete 12 px (sai o "Vender")','modelo da família Voltar')
caso('voltar_ficha','Ficha do Inventário',C['inventario-ficha'],'button.ibtn[aria-label=Voltar], .nvVsP',"()=>("+JS+")('Inventário')",'Câmbio (hoje)',REFP,'.nvVs',
     '"‹" quadrado + "Catálogo do produto"','"‹ INVENTÁRIO" versalete 12 px','modelo da família Voltar')
