()=>{const L=document.querySelector('#layer');
const st=document.createElement('style');st.textContent=`.lbl{display:inline-block;margin:4px 0 2px;font:700 12px var(--body);padding:3px 9px;border-radius:99px}.lbl.c{background:#e9f6ee;color:#14803f}.lbl.o{background:#fbe9ef;color:#b3264f}
.was{color:var(--mu);text-decoration:line-through;font-weight:500;margin-right:6px}
.capl{display:flex;align-items:center;gap:10px;border:1.5px dashed #14803f;background:#f3fbf6;border-radius:14px;padding:10px 12px;margin:6px 0 8px}.capl b{font:800 14px var(--body);letter-spacing:.04em;display:block}.capl small{display:block;color:var(--mu);font-size:12.5px}.capl u{margin-left:auto;color:var(--mu);font-size:13px}
.eco{display:flex;justify-content:space-between;font-size:14px;color:#14803f;font-weight:700;margin:0 0 4px}`;document.head.appendChild(st);
const l1=L.querySelector('.cl'),l2=l1.cloneNode(true);l1.after(l2);
l1.querySelector('.cit small').textContent='BR44140';l1.querySelector('.cit b').textContent='Armação metal gatinho preta';
l1.querySelector('.cit b').insertAdjacentHTML('afterend','<div><span class="lbl c">−10% cupom</span></div>');
l1.querySelector('.pu').innerHTML='<span class="was">Gs. 100.000</span><span>Gs. 90.000 por unidade</span>';l1.querySelector('.cis .pr').textContent='Gs. 90.000';
const src=document.querySelector('[data-open="BR44140"] img');if(src)l1.querySelector('img').src=src.src;
l2.querySelector('.cit b').insertAdjacentHTML('afterend','<div><span class="lbl o">preço de oferta · sem cupom</span></div>');
l2.querySelector('.pu').innerHTML='<span>Gs. 80.000</span> <span>por unidade</span>';l2.querySelector('.cis .pr').textContent='Gs. 80.000';
document.querySelectorAll('details.cupf').forEach(d=>{const box=document.createElement('div');box.innerHTML='<div class="capl"><span style="font-size:20px">🎟️</span><div><b>LF-8KQ2 · −10%</b><small>Cupom aplicado em 1 de 2 peças</small></div><u>remover</u></div><div class="eco"><span>Você economizou</span><span>Gs. 10.000</span></div>';d.replaceWith(box)});
document.querySelectorAll('.cs-r').forEach(r=>{const a=r.querySelectorAll('span');if(a.length==2&&/Subtotal/.test(a[0].textContent)){a[0].textContent='Subtotal · 2 itens';a[1].textContent='Gs. 180.000'}});
document.querySelectorAll('.cs-t b').forEach(b=>b.textContent='Gs. 170.000');
[...L.querySelectorAll('*')].filter(x=>!x.children.length&&/1 item/.test(x.textContent)).forEach(e=>e.textContent=e.textContent.replace('1 item','2 itens'))}
