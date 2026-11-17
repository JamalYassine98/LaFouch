# S374 · esboço 91 (dono 17/11 08:57: "Tirar isso de que o botão de vender te segue").
# Em cima do 88 + 89 + 90. Hoje: a barra "− 1 + · Vender" (.vbar.vsale) é sticky e fica presa em cima da barra de baixo, cobrindo a peça.
# Proposta: a barra fica no lugar dela (logo depois dos graus), rola junto com a página.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s89=open('/home/claude/lafouch/work/s374/esb89.py').read();s88=open('/home/claude/lafouch/work/s374/esb88.py').read()
CSS=s88.split('CSS="""')[1].split('"""')[0]+s89.split('CSS=s88.split(\'CSS="""\')[1].split(\'"""\')[0]+"""')[1].split('"""')[0]+'#vDetail .vPar{display:none!important}'
JS2=s89.split('JS2=r"""')[1].split('"""')[0]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.setView('vendas')");w(1500)
            pg.click('#v-vendas .pcard:nth-of-type(2)');w(1200)
            pg.add_style_tag(content=CSS);pg.evaluate(JS2)
            if prop: pg.add_style_tag(content='#v-vendas .vbar.vsale{position:static!important}')
            pg.evaluate("()=>{const e=document.getElementById('vDetail');scrollTo({top:e.getBoundingClientRect().top+scrollY-150,behavior:'instant'})}");w(400)
            oo.append(olho(pg));p=T+'v91_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]),sorted(oo[1]))
        prancha('91-app-vender-barra-fixa-%s.jpg'%tema,'App · Vender · peça · botão de vender no lugar · tema %s'%tema,
          ['Esquerda = 88 + 89 + 90: a barra "− 1 + · Vender" segue a tela e cobre a peça (nome, preço, graus).',
           'Proposta: a barra fica no lugar dela, logo depois dos graus, e rola junto com a página. Nada cobre a peça.'],*fs)
