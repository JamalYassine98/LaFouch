# S374 · esboço 92 (dono 17/11 08:59: "as cores verde e rosa estão chocando, não concorda?").
# Em cima do 88–91. Proposta: preço no Vender em cor de texto (neutra), não verde; o rosa fica só para ação (Vender, links ›).
# Verde continua só para sinal de "ok/entrou dinheiro" (estoque, caixa), não para preço de vitrine.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s89=open('/home/claude/lafouch/work/s374/esb89.py').read();s88=open('/home/claude/lafouch/work/s374/esb88.py').read()
CSS=s88.split('CSS="""')[1].split('"""')[0]+s89.split('CSS=s88.split(\'CSS="""\')[1].split(\'"""\')[0]+"""')[1].split('"""')[0]+'#vDetail .vPar{display:none!important}#v-vendas .vbar.vsale{position:static!important}'
JS=s88.split('JS=r"""')[1].split('"""')[0];BOX=s88.split("BOX='")[1].split("'")[0]
JS2=s89.split('JS2=r"""')[1].split('"""')[0]
VERDE="""()=>{const pr=document.createElement('i');pr.style.color='var(--ok)';document.body.appendChild(pr);const ok=getComputedStyle(pr).color;pr.remove();const v=document.getElementById('v-vendas');let n=0;[...v.querySelectorAll('*')].filter(e=>e.children.length==0&&/\\$/.test(e.textContent)&&!e.closest('button.go')).forEach(e=>{if(getComputedStyle(e).color===ok){e.style.setProperty('color','var(--fg)','important');n++}});return n}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome in ('a-catalogo','b-peca'):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.setView('vendas')");w(1500)
                pg.add_style_tag(content=CSS);pg.evaluate(JS,BOX)
                if nome=='b-peca':
                    pg.click('#v-vendas .pcard:nth-of-type(3)');w(1200);pg.evaluate(JS2)
                    pg.evaluate("()=>{const e=document.getElementById('vDetail');scrollTo({top:e.getBoundingClientRect().top+scrollY+240,behavior:'instant'})}")
                else: pg.evaluate("()=>scrollTo({top:520,behavior:'instant'})")
                if prop: print('verdes',pg.evaluate(VERDE))
                w(400);oo.append(olho(pg));p=T+'v92_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]),sorted(oo[1]))
            prancha('92%s-app-vender-cores-%s.jpg'%(nome,tema),'App · Vender · %s · cores · tema %s'%('catálogo' if nome[0]=='a' else 'peça',tema),
              ['Esquerda = 88–91: preço em verde ao lado do rosa do "Vender" e dos links — duas cores fortes brigando.',
               'Proposta: preço na cor do texto (neutro, como numa vitrine de luxo); o rosa fica só para o que se toca. O verde continua só para sinal de "ok" (estoque, caixa).'],*fs)
