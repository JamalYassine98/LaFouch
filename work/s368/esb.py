# S368 · esboço 51: PEDIDO no padrão de luxo (pedido do dono, 16/11 00:59: "a aba pedido não está nos padrões de luxo").
# App real, celular, claro e escuro; só muda a forma — os dados, os botões e as ações são os da própria tela. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s368/'
from playwright.sync_api import sync_playwright
CSS="""#cartCard.lx{gap:0!important}
#cartCard.lx .lxHd{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--line)}
#cartCard.lx .lxHd h2{margin:0;font-size:22px}#cartCard.lx .lxHd span{color:var(--mute);font-size:13px}
#cartCard.lx .lxIt{display:grid;grid-template-columns:64px minmax(0,1fr);gap:4px 14px;padding:16px 0;border-bottom:1px solid var(--line);align-items:center}
#cartCard.lx .lxIt img,#cartCard.lx .lxIt>span:first-child{grid-row:1/3;width:64px!important;height:64px!important;flex:none!important;border-radius:12px!important}
#cartCard.lx .lxNm{display:flex;justify-content:space-between;gap:12px;align-items:baseline;min-width:0}#cartCard.lx .lxNm b{font-weight:500;font-size:15px;min-width:0;overflow-wrap:anywhere}#cartCard.lx .lxNm i{font-style:normal;font-weight:600;font-size:15px;white-space:nowrap;font-variant-numeric:tabular-nums}
#cartCard.lx .lxAc{display:flex;justify-content:space-between;align-items:center;gap:12px}
#cartCard.lx .lxQt{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:999px;height:44px}
#cartCard.lx .lxQt button{width:44px;height:44px;min-height:44px;border:0;background:none;color:var(--fg);font:inherit;font-size:18px;border-radius:999px}#cartCard.lx .lxQt em{font-style:normal;min-width:22px;text-align:center;font-variant-numeric:tabular-nums;font-size:15px}
#cartCard.lx .lxLk{background:none;border:0;min-height:44px;min-width:44px;padding:0 2px;color:var(--mute);font:500 14px inherit;text-decoration:underline;text-underline-offset:4px;text-decoration-color:var(--line)}
#cartCard.lx .lxSg{padding:16px 0;border-bottom:1px solid var(--line)}#cartCard.lx .lxSg .lbl{margin:0 0 6px}
#cartCard.lx .lxSg b{display:block;font-weight:500;font-size:15px}#cartCard.lx .lxSg small{display:block;color:var(--mute);font-size:13px;margin-top:2px}
#cartCard.lx .lxSg .lxAc{justify-content:flex-start;gap:22px;margin-top:4px}#cartCard.lx .lxSg .lxLk.f{color:var(--accent-fg);text-decoration-color:currentColor}
#cartCard.lx .lxMais{display:block;width:100%;min-height:48px;margin:4px 0 0;background:none;border:0;color:var(--mute);font:500 14px inherit;text-decoration:underline;text-underline-offset:4px;text-decoration-color:var(--line)}
#cartCard.lx .lxTot{display:flex;flex-direction:column;align-items:center;gap:4px;padding:18px 0 22px}#cartCard.lx .lxTot span{color:var(--mute);font-size:13px}#cartCard.lx .lxTot b{font:400 40px/1.1 var(--display);letter-spacing:-.01em}
#cartCard.lx .lxEsv{display:block;margin:6px auto 0}"""
MUDA="""()=>{const C=document.getElementById('cartCard');const tx=e=>(e&&(e.innerText||e.textContent)||'').replace(/\\s+/g,' ').trim();
 const h2=C.querySelector('h2');const n=(tx(h2).match(/(\\d+) peça/)||[0,'1'])[1];
 const its=[...C.querySelectorAll('.split > .sl')].map(sl=>{const foto=sl.firstElementChild.cloneNode(true);const sp=sl.querySelector('span[style*="flex:1"]');const small=sp.querySelector('small');const preco=tx(small).split(' · ')[0];const nm=tx(sp).replace(tx(small),'').trim();const q=(nm.match(/^(\\d+)×/)||[0,'1'])[1];return {foto,nm:nm.replace(/^\\d+× /,''),preco,q}});
 const sg=C.querySelector('.cSug');let sgH='';if(sg){const b=tx(sg.querySelector('b')),sm=[...sg.querySelectorAll('small')].map(tx).filter(t=>!/^Sugestão/.test(t))[0]||'';sgH='<div class="lxSg"><div class="lbl">Sugestão para oferecer ao cliente</div><b>'+b+'</b><small>'+sm+'</small><div class="lxAc"><button type="button" class="lxLk f">Cliente aceitou</button><button type="button" class="lxLk">Dispensar</button></div></div>'}
 const tot=tx(document.getElementById('cartSub'));
 C.classList.add('lx');C.innerHTML='<div class="lxHd"><h2>Pedido</h2><span>'+n+(n==='1'?' peça':' peças')+'</span></div>'+its.map((x,i)=>'<div class="lxIt" data-i="'+i+'"><span class="lxF"></span><div class="lxNm"><b>'+x.nm+'</b><i>'+x.preco+'</i></div><div class="lxAc"><span class="lxQt" role="group" aria-label="Quantidade"><button type="button" aria-label="Menos uma peça">−</button><em>'+x.q+'</em><button type="button" aria-label="Mais uma peça">+</button></span><button type="button" class="lxLk">Tirar</button></div></div>').join('')+sgH+
  '<button type="button" class="lxMais">+ Adicionar outra peça</button><div class="lxTot"><span>Total</span><b>'+tot+'</b></div><button type="button" class="go">Confirmar pedido</button><button type="button" class="lkTx lxEsv">Esvaziar pedido</button>';
 its.forEach((x,i)=>{const s=C.querySelector('.lxIt[data-i="'+i+'"] .lxF');s.replaceWith(x.foto)});return [its.length,!!sg,tot]}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'vendas',esc)
            pg.evaluate("()=>{const L=window.__LF,S=L.S;S.exp=[];S.colchUsd=0;S.items.forEach(i=>{if(i.tipo==='solar'&&!i.bulk)i.custo=1});L.render()}");w(500)  # dados de teste: sem contas e solar barato de repor, só para a sugestão "Leve 2" aparecer nos dois lados
            pg.evaluate("()=>{const c=[...document.querySelectorAll('#vRows .pcard[data-ref]')].find(e=>/^SP|^SL/.test(e.dataset.ref))||document.querySelector('#vRows .pcard[data-ref]');c.click()}");w(1100)
            pg.evaluate("()=>document.getElementById('sCartAdd').click()");w(700);pg.evaluate("()=>document.querySelector('[data-act=cartopen]').click()");w(900)
            if prop: pg.add_style_tag(content=CSS);print('   ',pg.evaluate(MUDA));w(500)
            p=T+'ped_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);o=olho(pg);pg.evaluate('()=>scrollBy(0,400)');w(300);o|=olho(pg);oo.append(o);b.close()
        print('pedido',tema,'achados novos:',novos(oo[0],oo[1]))
        prancha('51-app-pedido-luxo-%s.jpg'%tema,'App · Pedido · tema '+tema,
          ['Hoje: botões soltos de vários formatos (− + ×, "Cliente aceitou" em caixa, "Adicionar produto" tracejado, "Esvaziar" cinza) e o total no canto.','Proposta: mesma tela e mesmas ações no padrão do Pagamento — linhas finas, quantidade num só controle, ações secundárias como texto, total em destaque e um só botão principal.'],*fs)
