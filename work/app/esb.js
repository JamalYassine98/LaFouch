window.__esbCores = function(){
  const bx=document.querySelector('#editModal .modal-box'), L=document.getElementById('edCores');
  const rows=[...L.querySelectorAll('.cfRow')]; const img=rows[0].querySelector('.cfFt').outerHTML; const nova=[...L.children].find(e=>/Cor nova/.test(e.textContent)); const novaH=nova?nova.outerHTML.replace('(tire a foto)','(tire a foto e escolha os graus)'):'';
  const linha=(g,q)=>`<div class="cfRow" style="grid-template-columns:auto 1fr auto;align-items:center;padding:8px 0;border-top:1px solid var(--ln,#2a2f36)">
     <button type="button" class="tab" style="min-height:36px;padding:6px 12px;font-weight:700;border-radius:12px;white-space:nowrap">${g} <span style="opacity:.6;font-size:12px">▾</span></button>
     <span class="cfCu">US$ <input class="cfCuI" placeholder="custo" style="width:64px"></span>
     <span class="vstep cfStep"><span class="vs-b">−</span><input class="vs-n cfQI" value="${q}"><span class="vs-b">+</span></span></div>`;
  L.innerHTML=`<div class="cfRow" style="border:0;padding-bottom:6px">${img}<div class="cfTx"><button type="button" class="cfNm"><b>Preto</b></button><span class="hint" style="margin:0">3 graus · 9 peças</span></div><span></span>
      <div class="cfSelos"><button type="button" class="selo warn">refazer ›</button><span class="selo">○ fora do site</span><span class="selo ok">● catálogo</span></div></div>
    ${linha('+0.75',3)}${linha('+1.25',2)}${linha('+2.00',4)}
    <button type="button" class="mini" style="margin-top:8px;width:100%;justify-content:center;border-style:dashed">+ Adicionar grau em Preto</button>
    <div style="height:10px"></div>
    ${novaH}`;
};
window.__esbFolha = function(modo){
  const G=[];for(let i=1;i<=16;i++)G.push('+'+(i*0.25).toFixed(2));
  const tem={'+0.75':3,'+1.25':2,'+2.00':4};
  const sel=modo==='troca'?'+1.25':'+1.50';
  const tit=modo==='troca'?'Trocar o grau · <b>+0.75</b> Preto':'Adicionar grau · <b>Preto</b>';
  const nota=modo==='troca'?`<div class="note" style="margin:12px 0 0">+1.25 já tem 2 peças nesta cor. As 3 de +0.75 se juntam: <b>+1.25 fica com 5</b>.</div>`
     :`<div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px"><span><b>Quantas peças?</b></span><span class="vstep cfStep"><span class="vs-b">−</span><input class="vs-n cfQI" value="6"><span class="vs-b">+</span></span></div>`;
  const ov=document.createElement('div'); ov.className='modal'; ov.style.cssText='display:flex;align-items:flex-end;z-index:9999';
  ov.innerHTML=`<div class="modal-box" style="width:100%;max-width:520px;border-radius:22px 22px 0 0;margin:0 auto">
   <div style="width:44px;height:5px;border-radius:9px;background:var(--mu,#888);opacity:.4;margin:-4px auto 12px"></div>
   <h2 style="margin:0 0 4px;font-size:17px;font-weight:600">${tit}</h2><div class="hint" style="margin:0 0 12px">Os graus com número já existem nesta cor.</div>
   <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${G.map(g=>{const on=g===sel,t=tem[g];return `<button type="button" class="tab${on?' on':''}" style="min-height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:12px;${on?'outline:2px solid var(--ac);':''}${modo==='troca'&&g==='+0.75'?'opacity:.35;':''}"><b style="font-size:15px">${g}</b><small style="font-size:11px;opacity:.7">${t?t+' pç':'&nbsp;'}</small></button>`}).join('')}</div>
   ${nota}
   <div style="display:flex;gap:10px;margin-top:16px"><button class="tab" style="flex:1">Cancelar</button><button class="__PRIM__" style="flex:2;justify-content:center">${modo==='troca'?'Trocar para +1.25':'Adicionar 6 peças'}</button></div></div>`;
  document.body.appendChild(ov);
};
