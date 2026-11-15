# S349 · esboço 30: tela ATACADO do app (aprovada em abas no celular, esboço 23) em TABLET e COMPUTADOR. Dados de exemplo. Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');from comum import *
import painel
from playwright.sync_api import sync_playwright
g={};exec(open('/home/claude/lafouch/work/s343/esb.py').read().split("ATACADO=")[0].split("\nCSS=")[1].join(["CSS=",""]) if False else "",g)
src=open('/home/claude/lafouch/work/s343/esb.py').read();CSS="CSS="+src.split("\nCSS=")[1].split("\nR=")[0];exec(CSS)
src2=open('/home/claude/lafouch/work/s343/esb2.py').read();exec("CSS2="+src2.split("\nCSS2=")[1].split("\nABAS=")[0]);exec("ABAS="+src2.split("\nABAS=")[1].split("\nLINHA=")[0]);exec("LINHA="+src2.split("\nLINHA=")[1].split("\ndef atacado")[0])
R=lambda t,s,n='',on=False:'<button type="button" class="esR%s"><span class="g"><b>%s</b><small>%s</small></span>%s<i>›</i></button>'%(' esOn' if on else '',t,s,('<span class="n">%s</span>'%n) if n else '')
CSS3=CSS2+""".esR.esOn b{color:var(--pri)}.es2{display:grid;grid-template-columns:380px minmax(0,1fr);gap:24px;align-items:start}
.esM{background:var(--panel2);border:1px solid var(--line);border-radius:18px;padding:22px 24px;display:flex;flex-direction:column;gap:10px}
.esM h2{margin:0;font:400 22px/1.2 var(--display);color:var(--fg)}.esM .q{color:var(--mute);font-size:13px}.esM p{margin:6px 0 4px;font-size:15px;line-height:1.55;color:var(--fg);max-width:60ch}
.esM .ln{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:14px}.esM .ln span{color:var(--mute)}
.esB1{align-self:flex-start;min-height:44px;padding:0 22px;border-radius:999px;background:none;border:1px solid var(--pri);color:var(--pri);font:600 14px inherit;margin-top:6px}"""
LISTA='<section class="esC" data-coluna="1">'+R('Óptica Sol','Quer 20 peças · há 2 h','1',True)+R('Visión Centro','Pediu orçamento de 60 armações · ontem')+'</section>'
MSG='<section class="esM" data-coluna="1"><h2>Óptica Sol</h2><div class="q">Lojista com conta ativa · há 2 h</div><p>Boa tarde. Quero 20 peças do lote Kazwini, metade no grau +1.25. Consegue enviar esta semana?</p><div class="ln"><span>Pedido</span><b>20 peças · Lote Kazwini</b></div><div class="ln"><span>Tabela</span><b>Atacado</b></div><button type="button" class="esB1">Responder</button></section>'
TOPO='<div class="top"><div><h1>Atacado</h1><div class="crumb">Lojistas, lotes e pedidos em quantidade.</div></div><button type="button" class="pgAc">+ Novo acesso</button></div>'
POE="""a=>{const [topo,corpo]=a;const v=document.getElementById('v-clientes');v.innerHTML=topo;v.appendChild(window.__esT);v.insertAdjacentHTML('beforeend',corpo);document.querySelectorAll('#mainnav .on,#sidenav .on,.sn.on,.mn.on').forEach(x=>x.classList.remove('on'))}"""
with sync_playwright() as pw:
    for apn,pc in (('pc',True),('tablet',False)):
        W,H=ap.TAM[apn][0],ap.TAM[apn][1]
        for esc,tema in ((True,'escuro'),(False,'claro')):
            b,pg,w,_=painel.abre(pw,esc,W,H);painel.vai(pg,'msg');pg.evaluate("()=>{const x=[...document.querySelectorAll('#v_msg button')].find(e=>/^Atacado$/.test(e.innerText.trim()));x&&x.click()}");w(900)
            hoje=T+'at_%s_%d_h.png'%(apn,esc);pg.screenshot(path=hoje);b.close();Image.open(hoje).resize((W,H)).save(hoje)
            b,pg,w=ap.abre(pw,'clientes',esc,apn);w(800);o0=olho(pg);pg.add_style_tag(content=CSS3)
            pg.evaluate(ABAS,[['Mensagens','Lojistas','Lotes','Tabela'],0,['1']])
            corpo=('<div class="es2">'+LISTA+MSG+'</div>') if pc else (LISTA+'<div class="esVz">Mensagens e pedidos de lojistas que chegam pelo site.</div>')
            pg.evaluate(POE,[TOPO,corpo]);w(300);pg.evaluate(LINHA);w(500)
            p=T+'at_%s_%d_p.png'%(apn,esc);pg.screenshot(path=p);o1=olho(pg);b.close()
            print('atacado',apn,tema,'achados novos:',novos(o0,o1))
            prancha('30-%s-atacado-%s.jpg'%(apn,tema),'App · %s · Atacado › Mensagens · tema %s'%('Computador' if pc else 'Tablet',tema),
              ['Hoje: o atalho Atacado abre o painel do site dentro de uma janela.','Proposta: a tela Atacado do próprio app, nas mesmas abas do celular'+('; no computador, a lista à esquerda e a mensagem aberta à direita.' if pc else '.')+' Dados de exemplo.'],hoje,p,pc=pc)
