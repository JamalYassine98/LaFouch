# S349 · esboço 32: VENDA EM POUCOS TOQUES. Hoje: peça → Vender → Pedidos → Confirmar pedido → Finalizar venda (5 toques a partir do Catálogo).
# Proposta: peça → Vender → Finalizar venda (3 toques): "Vender" abre o Pagamento numa folha por cima da peça. O formulário é o REAL do app.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
from playwright.sync_api import sync_playwright
TOCA="rx=>{const b=[...document.querySelectorAll('button')].filter(e=>e.offsetParent&&new RegExp(rx).test(e.innerText.trim())).pop();if(!b)return 'sem';b.click();return b.innerText.trim().slice(0,40)}"
PEGA="""()=>{const f=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/^Finalizar venda/.test(e.innerText.trim())).pop();if(!f)return null;let c=f.parentElement;while(c&&!(/Pagamento/.test(c.innerText)&&/CLIENTE/i.test(c.innerText)))c=c.parentElement;if(!c)return null;c.querySelectorAll('input').forEach(i=>i.setAttribute('value',i.value));const k=c.cloneNode(true);[...k.querySelectorAll('*')].forEach(e=>{if(e.children.length===0&&/^Adicionado ao pedido/.test((e.textContent||'').trim()))e.remove()});
 const v=[...k.querySelectorAll('button')].find(e=>/Voltar/.test(e.getAttribute('aria-label')||e.innerText));if(v){let t=v.parentElement;(t.children.length<=3?t:v).remove()}
 [...k.querySelectorAll('*')].forEach(e=>{if(e.children.length===0&&/^Pagamento$/.test((e.textContent||'').trim())&&!/lbl/i.test(e.className))e.remove()});return k.innerHTML}"""
POE="""h=>{const bk=document.createElement('div');bk.className='ljBk';bk.style.opacity='.5';const jn=document.createElement('div');jn.className='ljJn';jn.id='esJn';jn.setAttribute('role','dialog');
 jn.innerHTML='<div class="ljPuxa" aria-hidden="true"></div><div class="ljHd"><b>Pagamento</b></div><div class="ljCorpo" style="overflow-y:auto;min-height:0">'+h+'<button type="button" class="esMais">+ Adicionar outra peça ao pedido</button></div>';
 document.body.appendChild(bk);document.body.appendChild(jn);jn.style.transform='none';jn.style.maxHeight='93vh';return jn.getBoundingClientRect().height|0}"""
CSS=".esMais{display:block;width:100%;min-height:44px;margin-top:6px;background:none;border:0;color:var(--mute);font:500 14px inherit;text-decoration:underline;text-underline-offset:3px}#esJn .ljCorpo>*:first-child{margin-top:0}"
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        b,pg,w=ap.abre(pw,'vendas',esc);pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");w(1200);o0=olho(pg)
        pg.evaluate(TOCA,'^Vender');w(1400);hoje=T+'vd_%d_h.png'%esc;pg.screenshot(path=hoje);o0|=olho(pg)
        pg.evaluate("()=>document.querySelector('[data-act=cartopen]').click()");w(1000);pg.evaluate(TOCA,'Confirmar pedido');w(1300);o0|=olho(pg)
        h=pg.evaluate(PEGA);b.close();print('  formulário real:',len(h or ''),'letras')
        b,pg,w=ap.abre(pw,'vendas',esc);pg.evaluate("()=>document.querySelector('#vRows .pcard[data-ref]').click()");w(1200)
        pg.add_style_tag(content=CSS);print('  altura da folha:',pg.evaluate(POE,h));w(700)
        p=T+'vd_%d_p.png'%esc;pg.screenshot(path=p);o1=olho(pg);b.close()
        print('venda',tema,'achados novos:',novos(o0,o1))
        prancha('32-app-venda-em-3-toques-%s.jpg'%tema,'App · depois de tocar "Vender" na peça · tema '+tema,
          ['Hoje: volta ao Catálogo com o pedido aberto; faltam 3 toques (Pedidos › Confirmar pedido › Finalizar venda). Total: 5.','Proposta: o Pagamento sobe por cima da peça, já em Dinheiro e Guarani; falta 1 toque (Finalizar venda). Total: 3.'],hoje,p)
