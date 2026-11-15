# S344: esboços — (a) Compartilhar pelo Catálogo sem "Tipo de envio" (abre em Cliente) e o envio a lojista dentro da tela Atacado › Tabela;
# (b) Ajustes do catálogo sem a chave Varejo | Atacado. App real, escuro e claro, celular. Nada implementado.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
src=open('/home/claude/lafouch/work/s343/esb2.py').read()
exec(src.split("\nUNE=")[0])
OUT='/home/claude/lafouch/work/s343/'
SHARE="()=>{const e=[...document.querySelectorAll('#v-vendas button')].filter(e=>e.offsetParent&&/ompartilh/i.test(e.getAttribute('aria-label')||''))[0];e&&e.click()}"
def abre_comp(pg,w):
    pg.evaluate(SHARE);w(600);pg.evaluate("()=>{const c=[...document.querySelectorAll('#vRows .pcard[data-ref]')].filter(e=>e.querySelector('img'))[0]||document.querySelector('#vRows .pcard[data-ref]');c.click()}");w(500)
    pg.evaluate("()=>document.querySelector('#ebBar .ebGo').click()");w(1500)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        # (a1) compartilhar pelo Catálogo
        fs=[];ach=[]
        for prop in (0,1):
            b,pg,w=base.abre(pw,'vendas',esc);abre_comp(pg,w)
            if prop: print('  tirou:',pg.evaluate("()=>{const t=document.getElementById('s185Tabs');if(!t)return 'sem abas';const l=t.previousElementSibling;if(l&&/TIPO DE ENVIO/i.test(l.textContent))l.remove();t.remove();return 'ok'}"));w(400)
            p=T+'c_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);ach.append(olho(pg))
            if not prop: print('  janela aberta:',pg.evaluate("()=>!!document.getElementById('s185Tabs')"))
            b.close()
        print('compartilhar',tema,'achados novos:',sorted(ach[1]-ach[0]) or 'nenhum')
        prancha('25-app-compartilhar-pelo-catalogo-%s.jpg'%tema,'App · Compartilhar pelo Catálogo · tema '+tema,['Hoje: a janela pergunta o tipo de envio (Cliente | Lojista).','Proposta: pelo Catálogo é sempre Cliente (varejo); a pergunta some. Lojista fica na tela Atacado.'],*fs)
        # (b) ajustes do catálogo
        fs=[];ach=[]
        for prop in (0,1):
            b,pg,w=base.abre(pw,'vendas',esc);pg.evaluate("()=>document.getElementById('cjAj').click()");w(1300)
            if prop: print('  tirou:',pg.evaluate("()=>{const t=document.getElementById('cjTP');if(!t)return 'sem chave';const col=t.parentElement,g=col.parentElement;col.remove();if(g&&g.classList.contains('cjG2'))g.style.gridTemplateColumns='1fr';const rs=document.getElementById('cjRs');if(rs)rs.textContent=rs.textContent.replace(' · Varejo','');return 'ok'}"));w(400)
            p=T+'j_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);ach.append(olho(pg));b.close()
        print('ajustes do catálogo',tema,'achados novos:',sorted(ach[1]-ach[0]) or 'nenhum')
        prancha('26-app-ajustes-do-catalogo-sem-atacado-%s.jpg'%tema,'App · Catálogo › Ajustes · tema '+tema,['Hoje: a janela tem a chave Preço: Varejo | Atacado.','Proposta: o Catálogo é só varejo; a chave sai. Atacado é pela conta/link do lojista.'],*fs)
        # (a2) Atacado › Tabela (onde fica o envio a lojista)
        b,pg,w=base.abre(pw,'vendas',esc);abre_comp(pg,w);pg.evaluate("()=>{const x=document.querySelector('#s185Tabs [data-p=loj],#s185Tabs button:nth-child(2)');x&&x.click()}");w(900)
        hoje=T+'t_h_%d.png'%esc;pg.screenshot(path=hoje);b.close()
        b,pg,w=base.abre(pw,'clientes',esc);o0=olho(pg);pg.add_style_tag(content=CSS2)
        pg.evaluate(ABAS,[['Mensagens','Lojistas','Lotes','Tabela'],3])
        cont='<section class="esC">'+R('Enviar catálogo a um lojista','Abre o Compartilhar já em Lojista (link com a conta dele)')+R('Ver a tabela de atacado','Os preços como o lojista vê')+'</section><div class="esVz">O lojista compra pelo link da conta dele, com o mínimo do atacado.</div>'
        pg.evaluate("h=>{const v=document.getElementById('v-clientes');v.innerHTML='<div class=\"top\"><div><h1>Atacado</h1><div class=\"crumb\">Lojistas, lotes e pedidos em quantidade.</div></div><button type=\"button\" class=\"pgAc\">+ Novo acesso</button></div>';v.appendChild(window.__esT);v.insertAdjacentHTML('beforeend',h);document.querySelectorAll('#mainnav .mn').forEach(x=>x.classList.remove('on'))}",cont);w(300);pg.evaluate(LINHA);w(300)
        p=T+'t_p_%d.png'%esc;pg.screenshot(path=p);o1=olho(pg);b.close()
        print('atacado tabela',tema,'achados novos:',sorted(o1-o0) or 'nenhum')
        prancha('27-app-atacado-tabela-%s.jpg'%tema,'App · enviar para lojista · tema '+tema,['Hoje: no Compartilhar do Catálogo, escolhendo "Lojista (atacado)".','Proposta: na tela Atacado, aba Tabela (dados de exemplo).'],hoje,p)
