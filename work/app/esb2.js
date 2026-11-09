(function(){
const G=[];for(let i=1;i<=16;i++)G.push('+'+(i*0.25).toFixed(2));
const chip=(g,extra='')=>`<button type="button" class="tab" style="min-height:36px;padding:6px 12px;font-weight:700;border-radius:12px;white-space:nowrap;${extra}">${g} <span style="opacity:.6;font-size:12px">▾</span></button>`;
const step=q=>`<span class="vstep cfStep" style="transform:scale(.92);transform-origin:right center"><span class="vs-b">−</span><input class="vs-n cfQI" value="${q}"><span class="vs-b">+</span></span>`;
const linha=(g,q)=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-top:1px solid color-mix(in srgb,var(--tx,#fff) 10%,transparent)">${chip(g)}${step(q)}</div>`;
const sel=(t,c)=>`<span class="selo ${c||''}">${t}</span>`;
window.__esb2Cores=function(){
  const L=document.getElementById('edCores'),rows=[...L.querySelectorAll('.cfRow')],img=rows[0].querySelector('.cfFt').outerHTML,
    nova=[...L.children].find(e=>/Cor nova/.test(e.textContent)),novaH=nova?nova.outerHTML.replace('(tire a foto)','(tire a foto e escolha os graus)'):'';
  const tart=img.replace(/stroke%3D%22%231f1f1f%22/g,'stroke%3D%22%23784b2a%22');
  const cor=(im,nome,res,custo,ls,aberto)=>`<div style="padding:4px 0 10px">
    <div style="display:flex;gap:12px;align-items:center">${im}<div style="flex:1;min-width:0"><b style="font-size:16px">${nome}</b><div class="hint" style="margin:2px 0 0">${res}</div></div><span style="opacity:.6;font-size:18px">${aberto?'⌃':'⌄'}</span></div>
    ${aberto?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 6px">${sel('refazer ›','warn')}${sel('○ fora do site')}${sel('● catálogo','ok')}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin:6px 0 8px"><span class="hint" style="margin:0">Custo de cada peça <small style="opacity:.7">(todos os graus)</small></span><span class="cfCu">US$ <input class="cfCuI" value="${custo}" style="width:64px"></span></div>
    ${ls}<button type="button" class="mini" style="margin-top:8px;width:100%;justify-content:center;border-style:dashed">+ Adicionar graus em ${nome}</button>`:''}</div>`;
  L.innerHTML=cor(img,'Preto','3 graus · 9 peças','2,50',linha('+0.75',3)+linha('+1.25',2)+linha('+2.00',4),true)
    +'<div style="height:1px;background:color-mix(in srgb,var(--tx,#fff) 12%,transparent);margin:4px 0 10px"></div>'
    +cor(tart,'Tartaruga','2 graus · 5 peças','2,50','',false)
    +'<div style="height:6px"></div>'+novaH;
};
const folha=(tit,sub,corpo,bA,bB)=>{const ov=document.createElement('div');ov.className='modal';ov.style.cssText='display:flex;align-items:flex-end;z-index:9999';
  ov.innerHTML=`<div class="modal-box" style="width:100%;max-width:520px;border-radius:22px 22px 0 0;margin:0 auto">
   <div style="width:44px;height:5px;border-radius:9px;background:var(--mu,#888);opacity:.4;margin:-4px auto 12px"></div>
   <h2 style="margin:0 0 4px;font-size:17px;font-weight:600">${tit}</h2><div class="hint" style="margin:0 0 12px">${sub}</div>${corpo}
   <div style="display:flex;gap:10px;margin-top:16px"><button class="tab" style="flex:1">${bA}</button><button class="go" style="flex:2;justify-content:center">${bB}</button></div></div>`;document.body.appendChild(ov)};
const grade=(tem,on,off)=>`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${G.map(g=>{const s=on.includes(g),t=tem[g];return `<button type="button" class="tab${s?' on':''}" style="min-height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:12px;${s?'outline:2px solid var(--ac);':''}${off===g?'opacity:.35;':''}"><b style="font-size:15px">${g}</b><small style="font-size:11px;opacity:.7">${t?t+' pç':'&nbsp;'}</small></button>`}).join('')}</div>`;
window.__esb2Add=function(){
  const tem={'+0.75':3,'+1.25':2,'+2.00':4};
  const lista=[['+1.50',6],['+2.50',6],['+3.00',6]].map(x=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0"><b>${x[0]}</b>${step(x[1])}</div>`).join('');
  folha('Adicionar graus · <b>Preto</b>','Toque em quantos graus quiser. Os que têm número já existem nesta cor.',
   grade(tem,['+1.50','+2.50','+3.00'])+`<div style="display:flex;align-items:center;justify-content:space-between;margin:14px 0 4px"><span class="hint" style="margin:0">Mesma quantidade para todos</span><span class="selo ok" style="font-weight:700">6 ✓</span></div>`+lista,
   'Cancelar','Adicionar 18 peças');
};
window.__esb2Grau=function(aba){
  const seg=`<div class="trk" style="display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:12px">${['Trocar grau','Mudar de cor','Tirar'].map((t,i)=>`<button type="button" class="trkB${i===aba?' on':''}" style="${i===aba?'background:color-mix(in srgb,var(--tx,#fff) 12%,transparent);border-radius:10px;font-weight:700':''}">${t}</button>`).join('')}</div>`;
  if(aba===1){const img=document.querySelector('#editModal .cfFt img');const s=img?img.src:'';const tart=s.replace(/stroke%3D%22%231f1f1f%22/g,'stroke%3D%22%23784b2a%22');
    const op=(src,n,txt,on)=>`<button type="button" class="tab" style="display:flex;gap:12px;align-items:center;width:100%;padding:10px;border-radius:14px;margin-bottom:8px;text-align:left;${on?'outline:2px solid var(--ac);':''}"><img src="${src}" style="width:56px;height:42px;border-radius:8px;background:#fff;object-fit:contain"><span style="flex:1"><b>${n}</b><br><small style="opacity:.7">${txt}</small></span>${on?'<b style="color:var(--ac)">✓</b>':''}</button>`;
    folha('<b>+0.75</b> · Preto (3 peças)','Para qual cor vão estas peças?',seg+op(tart,'Tartaruga','+0.75 já tem 1 peça → fica com 4',true)+`<div style="display:flex;align-items:center;justify-content:space-between;margin:6px 0"><span class="hint" style="margin:0">Quantas mudar?</span>${step(3)}</div>`,'Cancelar','Mudar 3 para Tartaruga');}
  else if(aba===2){folha('<b>+0.75</b> · Preto (3 peças)','Tirar este grau desta cor.',seg+`<div class="note n-bad" style="margin:4px 0 0"><b>Tirar as 3 peças de +0.75?</b><br>US$ 7,50 em custo. Fica registrado no histórico.</div>`,'Cancelar','Sim, tirar');}
  else {folha('<b>+0.75</b> · Preto (3 peças)','Escolha o grau certo.',seg+grade({'+0.75':3,'+1.25':2,'+2.00':4},['+1.25'],'+0.75')+`<div class="note" style="margin:12px 0 0">+1.25 já tem 2 peças nesta cor. As 3 de +0.75 se juntam: <b>+1.25 fica com 5</b>.</div>`,'Cancelar','Trocar para +1.25');}
};
})();
