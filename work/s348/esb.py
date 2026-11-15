# S348: esboços — (1) Caixa só com o caixa (saem os blocos "Contas do mês" e "Câmbio", que têm tela própria); (2) abrir o menu do caixa não muda
# o tamanho da tela. App real, escuro e claro, celular. Nada implementado.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
src=open('/home/claude/lafouch/work/s343/esb.py').read();exec(src.split("\nCSS=")[0])
OUT='/home/claude/lafouch/work/s348/'
SO="""()=>{const v=document.getElementById('v-caixa');const l=[...v.querySelectorAll('*')].find(e=>e.children.length===0&&/^CONTAS DO MÊS$/i.test((e.textContent||'').trim()));if(!l)return 'sem bloco';let n=l;while(n.parentElement!==v)n=n.parentElement;let k=0;for(let x=n;x;){const p=x.nextElementSibling;x.remove();k++;x=p}
 const h=v.querySelector('.top h1'),c=v.querySelector('.top .crumb');if(h)h.textContent='Caixa';if(c)c.textContent='O dinheiro da loja, por moeda.';return 'tirou '+k+' blocos'}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];ach=[];alt=[]
        for prop in (0,1):
            b,pg,w=base.abre(pw,'caixa',esc)
            if prop: print('  ',pg.evaluate(SO));w(400)
            alt.append(pg.evaluate("()=>document.scrollingElement.scrollHeight"))
            pg.mouse.move(195,500);pg.mouse.wheel(0,820);w(900)
            p=T+'cx_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);ach.append(olho(pg));b.close()
        print('caixa',tema,'achados novos:',sorted(ach[1]-ach[0]) or 'nenhum','· altura da página',alt)
        prancha('28-app-caixa-so-caixa-%s.jpg'%tema,'App · Caixa, rolando para baixo · tema '+tema,['Hoje: depois dos Movimentos vêm "Contas do mês" e "Câmbio" (página de %d px).'%alt[0],'Proposta: a tela é só o caixa e acaba nos Movimentos (%d px); Despesas e Câmbio ficam nas telas deles.'%alt[1]],*fs)
        fs=[];med=[]
        for prop in (0,1):
            b,pg,w=base.abre(pw,'caixa',esc)
            if prop: pg.add_style_tag(content='html.lfTrava body{position:static!important;width:auto!important}')
            pg.evaluate("()=>document.querySelector('#v-caixa .top button').click()");w(700)
            med.append(pg.evaluate("()=>{const r=document.getElementById('v-caixa').getBoundingClientRect();return Math.round(r.width)}"))
            p=T+'cm_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print('menu',tema,'largura da tela com o menu aberto:',med)
        prancha('29-app-caixa-menu-%s.jpg'%tema,'App · Caixa com o menu aberto · tema '+tema,['Hoje: abrir o menu alarga a tela em 16 px (logo, botão e valores andam para o lado).','Proposta: nada muda de lugar nem de tamanho ao abrir o menu.'],*fs)
