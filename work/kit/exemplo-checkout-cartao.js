()=>{const L=document.querySelector('#layer');
const st=document.createElement('style');st.textContent=`
.vB{display:flex!important;align-items:center;gap:12px;text-align:left;padding:12px 14px!important;min-height:64px!important;transition:background-color .2s ease,border-color .2s ease,box-shadow .2s ease!important}
.vB.on{background:#f8edf3!important;border-color:var(--ac)!important}
.vB .tx{flex:1;min-width:0}.vB .tx b{display:block;font:600 16px/1.3 var(--body)!important}.vB .tx small{display:block;font-size:13.5px!important;line-height:1.4!important}
.vB .ic{width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex:none}.vB .ic svg{width:22px;height:22px}
.vB .pz{font:700 16px var(--body)!important;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--tx)}.vB .pz i{font-style:normal;font-size:12px;font-weight:600;color:var(--mu);margin-right:3px}
.vB .ok{flex:none;width:22px;height:22px;border-radius:50%;background:var(--ac);color:#fff;font:800 12px/22px var(--body);text-align:center;opacity:0;transform:scale(.8);transition:opacity .2s ease,transform .25s cubic-bezier(.2,1.25,.35,1)}
.vB.on .ok{opacity:1;transform:scale(1)}
@media (prefers-reduced-motion:reduce){.vB,.vB .ok{transition:none!important}}`;document.head.appendChild(st);
function pr(p){if(!p)return '';const m=p.split(' ');return '<span class="pz"><i>'+m[0]+'</i>'+m[1]+'</span>'}
function fmt(b,price){const sv=b.querySelector('svg');const ic=sv?'<span class="ic">'+sv.outerHTML+'</span>':'';const t=b.querySelector('b').outerHTML,s=b.querySelector('small')?b.querySelector('small').outerHTML:'';
 const on=b.classList.contains('on')||b.getAttribute('aria-pressed')==='true';const g=b.dataset.g||'x';b.className='cfo vB'+(on?' on':'');b.dataset.g=g;
 b.innerHTML=ic+'<span class="tx">'+t+s+'</span>'+pr(price)+'<span class="ok">✓</span>'}
const dl=[...L.querySelectorAll('button.cfo[data-ent]')].find(b=>b.dataset.ent==='delivery');
if(dl){dl.querySelector('small').textContent='Só no Paraguai. Escolha a transportadora e o frete entra no total.';
 [...L.querySelectorAll('button.cfo[data-cta=endpick]')].forEach(b=>{const sv=b.querySelector('svg');if(sv){const w=sv.closest('span,i,div');(w&&w!==b?w:sv).remove()}});
 const O=[['PedidosYa Envíos','em até 60 min','G$ 15.000'],['Bolt Envío','em até 60 min','G$ 14.000'],['Tiemsa','1 a 2 dias úteis','G$ 25.000'],['MCGroup','1 a 2 dias úteis','G$ 22.000']];
 let h='<label class="cfl">Transportadora</label>';O.forEach((o,k)=>h+='<button type="button" class="cfo tco'+(k===0?' on':'')+'" data-g="t" data-pr="'+o[2]+'"><b>'+o[0]+'</b><small>'+o[1]+'</small></button>');
 const box=document.createElement('div');box.innerHTML=h;[...L.querySelectorAll('button.cfx')].pop().after(box);
 [...document.querySelectorAll('*')].filter(e=>/^R\$ 95$/.test((e.textContent||'').trim())&&!e.children.length).forEach(e=>{e.textContent='G$ 154.000';e.id='totk'});
 const f=[...document.querySelectorAll('*')].find(e=>!e.children.length&&(e.textContent||'').trim()==='Total');if(f)f.textContent='Total com frete'}
const all=[...L.querySelectorAll('button.cfo')];if(!dl&&all.length&&!all.some(b=>b.classList.contains('on')))all[0].classList.add('on');all.forEach(b=>fmt(b,b.dataset.pr));
window.__sel=function(i){const T=[...L.querySelectorAll('button[data-g=t]')];T.forEach((b,k)=>b.classList.toggle('on',k===i));const v=[154000,153000,164000,161000][i];const t=document.getElementById('totk');if(t)t.textContent='G$ '+v.toLocaleString('de-DE')}}
