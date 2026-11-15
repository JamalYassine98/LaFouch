# S355 · esboço 45 (rápido): como ficam as telas depois de tirar as REDUNDÂNCIAS (tabela de 15/11 20:50). App real, celular, claro e escuro.
# Só tira ou move blocos que já existem. 45a Reservas · 45b Histórico · 45c Ajustes (Preço automático) · 45d Dashboard › Mês (recebe o resultado do mês).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
import comum;comum.OUT='/home/claude/lafouch/work/s355/';T='/tmp/s355/'
from playwright.sync_api import sync_playwright
ACHA="""a=>{const [rx,mira]=a;const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const l=[...v.querySelectorAll('*')].find(e=>e.offsetParent&&e.children.length<3&&new RegExp(rx).test((e.innerText||'').replace(/\\s+/g,' ').trim()));if(!l)return null;let c=l.closest('section,details,.card,.dfold')||l.parentElement;
 if(mira){c.scrollIntoView({block:'start',behavior:'instant'});scrollBy(0,-110);return 'mirou '+(c.className||c.tagName)}
 const h=c.getBoundingClientRect().height|0;const nx=c.nextElementSibling;if(c.classList.contains('dfold')&&nx&&!nx.classList.contains('dfold'))nx.remove();c.remove();return 'tirou '+h+' px'}"""
S35=open('/home/claude/lafouch/work/s349/e6_dashboard.py').read();CSS35=S35.split('CSS="""')[1].split('"""')[0];MUDA35=S35.split('MUDA="""')[1].split('"""')[0].replace('\\\\','\\')
def tela(pw,nome,titulo,sub,vai,mira,muda,esc,tema,css=''):
    fs=[];oo=[];al=[]
    for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);pg.evaluate(vai);w(2600);al.append(pg.evaluate("()=>document.scrollingElement.scrollHeight"))
        o=olho(pg);pg.evaluate('()=>scrollBy(0,500)');w(300);o|=olho(pg);pg.evaluate('()=>scrollTo(0,0)');w(200)
        if mira: print('   ',pg.evaluate(ACHA,[mira,True]));w(400);o|=olho(pg)
        if prop:
            oo.append(o)
            if css: pg.add_style_tag(content=css)
            y=pg.evaluate('()=>scrollY');print('   ',str(muda(pg))[:150]);pg.evaluate('y=>scrollTo(0,Math.min(y,document.scrollingElement.scrollHeight-innerHeight))',y);pg.evaluate("()=>{const l=document.querySelector('.esLs');if(l){l.scrollIntoView({block:'end',behavior:'instant'});scrollBy(0,90)}}");w(600);al[1]=pg.evaluate("()=>document.scrollingElement.scrollHeight")
        p=T+'%s_%d_%d.png'%(nome[:3],esc,prop);pg.screenshot(path=p);fs.append(p);oo.append(olho(pg));b.close()
    print(nome,tema,'achados novos:',novos(oo[0]|oo[1],oo[2]),'· altura',al)
    prancha('%s-%s.jpg'%(nome,tema),titulo+' · tema '+tema,[sub[0]+' (página de %d px).'%al[0],sub[1]+' (%d px).'%al[1]],*fs)
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        tela(pw,'45a-app-reservas-sem-repeticao','App · Reservas',['Hoje: depois de "Livre para você" vêm "Seu mês" com o resultado e o lucro real do mês','Proposta: Reservas fica com "Livre para você" e "Próximos 30 dias"; o resultado do mês passa para o Dashboard › Mês'],
          "()=>{const L=window.__LF;L.S.dTab='din';L.setView('dash')}",'^Seu mês',lambda pg:[pg.evaluate(ACHA,[r,False]) for r in ('^Seu mês','^Detalhes do mês','^Lucro real do mês')],esc,tema)
        tela(pw,'45b-app-historico-sem-fechamento','App · Histórico',['Hoje: o Histórico começa com "Fechamento do caixa", que também está no Dashboard do dia','Proposta: o fechamento fica só no Dashboard › Dia; o Histórico só lista os dias'],
          "()=>window.__LF.setView('hist')",'',lambda pg:pg.evaluate(ACHA,['^Fechamento do caixa',False]),esc,tema)
        tela(pw,'45c-app-ajustes-preco-automatico','App · Ajustes',['Hoje: "Preço automático" abre aqui os mesmos controles que estão em Preços','Proposta: a linha continua, mas só leva para Preços (mostra o estado e a seta)'],
          "()=>window.__LF.setView('ajustes')",'',lambda pg:pg.evaluate("()=>{const r=[...document.querySelectorAll('#v-ajustes button,#v-ajustes [data-act]')].find(e=>e.offsetParent&&/^Preço automático/.test(e.innerText.trim()));if(!r)return 'sem linha';const s=[...r.querySelectorAll('*')].filter(x=>x.children.length===0&&/Desligado|Ligado/.test(x.textContent)).pop();if(s)s.textContent='em Preços';return 'ok'}"),esc,tema)
        tela(pw,'45d-app-dashboard-mes-com-resultado','App · Dashboard › Mês',['Hoje ("Resumo"): 4 blocos de números e 5 cartões abertos; o resultado do mês fica em Reservas','Proposta (parte de baixo da tela): em Detalhes entra a linha "Resultado do mês", que saiu de Reservas; em cima ficam os 3 números do esboço 35'],
          "()=>{const L=window.__LF;L.S.dTab='hoje';L.setView('dash')}",'',lambda pg:(pg.evaluate("()=>("+MUDA35+")()"),pg.evaluate("()=>{const ls=document.querySelector('.esLs');const b=ls.firstElementChild.cloneNode(true);b.querySelector('b').textContent='Resultado do mês';const s=b.querySelector('small');if(s)s.textContent='Lucro real, o que mais e o que menos rendeu';ls.insertBefore(b,ls.firstElementChild);ls.scrollIntoView({block:'center',behavior:'instant'});return scrollY}")),esc,tema,css=CSS35)
