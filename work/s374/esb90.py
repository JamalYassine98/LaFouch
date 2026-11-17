# S374 · esboço 90 (dono 17/11 08:55: "remover parecidas, não é necessária para minhas vendas, é boa no modo catálogo da loja").
# Em cima do 88 + 89. Proposta: no Vender (dono vendendo) a faixa "Parecidas" sai; no Modo cliente (iPad da loja) continua.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s89=open('/home/claude/lafouch/work/s374/esb89.py').read();exec(s89.split('with sync_playwright')[0].split("s88=open")[0])
s88=open('/home/claude/lafouch/work/s374/esb88.py').read()
CSS=s88.split('CSS="""')[1].split('"""')[0]+s89.split('CSS=s88.split(\'CSS="""\')[1].split(\'"""\')[0]+"""')[1].split('"""')[0]
JS2=s89.split('JS2=r"""')[1].split('"""')[0]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.setView('vendas')");w(1500)
            pg.click('#v-vendas .pcard:nth-of-type(2)');w(1200)
            pg.add_style_tag(content=CSS);pg.evaluate(JS2);w(200)
            if prop: pg.add_style_tag(content='#vDetail .vPar{display:none!important}')
            w(200);pg.evaluate("()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})");w(300)
            oo.append(olho(pg));p=T+'v90_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]),sorted(oo[1]))
        prancha('90-app-vender-sem-parecidas-%s.jpg'%tema,'App · Vender · fim da peça sem "Parecidas" · tema %s'%tema,
          ['Esquerda = 88 + 89: no fim da peça vem a faixa "Parecidas".',
           'Proposta: no Vender a faixa "Parecidas" sai; a peça termina em "Ficha no Inventário ›". No Modo cliente (iPad da loja) "Parecidas" continua igual.'],*fs)
