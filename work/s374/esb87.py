# S374 · esboço 87 (dono 17/11 08:08: "86 aprovado, quero esboços dessa ideia") — tutorial a 1 toque no Estúdio.
# Hoje: "?" › "Como fotografar" (2 toques). Proposta (em cima do 86): linha "Como fotografar ›" em rosa logo abaixo de
# "Peça nova, ainda sem cadastro ›" (as duas centralizadas); abre o mesmo tutorial. O "?" continua com os ajustes do Estúdio.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s86=open('/home/claude/lafouch/work/s374/esb86.py').read()
CSS=s86.split('CSS="""')[1].split('"""')[0]
JS=s86.split('JS=r"""')[1].split('"""')[0]
JS2=r"""()=>{const p=document.querySelector('.estLink[data-e=nova]');const b=document.createElement('button');b.type='button';b.className='estLink';b.textContent='Como fotografar ›';b.style.marginTop='-6px';p.after(b);return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.inicioGo('est')");w(1500)
            pg.add_style_tag(content=CSS);pg.evaluate(JS)
            if prop: pg.evaluate(JS2)
            w(300);oo.append(olho(pg));p=T+'e87_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
        print(tema,'novos:',novos(oo[0],oo[1]))
        prancha('87-app-estudio-tutorial-1-toque-%s.jpg'%tema,'App · Estúdio · tutorial com 1 toque · tema %s'%tema,
          ['Esquerda = 86 aprovado: o tutorial só abre pelo "?" › "Como fotografar" (2 toques).',
           'Proposta: "Como fotografar ›" em rosa logo abaixo de "Peça nova, ainda sem cadastro ›"; abre o mesmo tutorial (4 passos, "Se o app pedir", vídeo). O "?" fica com os ajustes do Estúdio.'],*fs)
