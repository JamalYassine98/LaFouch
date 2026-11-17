# S374 · esboço 104 (dono 17/11 15:38, print do Histórico): "o valor está desalinhado com a flecha".
# Hoje: o valor (G$) fica na 1ª linha, junto da data, e a "›" fica no meio das duas linhas.
# Proposta: valor e "›" juntos, centralizados na altura da linha — igual às contas de Despesas (valor + "⌄" no meio).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS=".d71 .ch{grid-row:1;align-self:center}"
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate("()=>window.__LF.inicioGo('hist')");w(1300)
            if prop: pg.add_style_tag(content=CSS);w(200)
            oo.append(olho(pg));p=T+'h104_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p)
            if prop: print(pg.evaluate("()=>[...document.querySelectorAll('.d71')].slice(0,4).map(d=>{const v=d.querySelector('.vl').getBoundingClientRect(),c=d.querySelector('.ch').getBoundingClientRect();return Math.round((v.top+v.bottom)/2-(c.top+c.bottom)/2)})"))
            b.close()
        print(tema,'novos:',novos(oo[0],oo[1]))
        prancha('104b-app-historico-seta-na-linha-do-valor-%s.jpg'%tema,'App · Histórico · opção B · seta na linha do valor · tema %s'%tema,
          ['Esquerda = hoje: o valor (G$) fica na 1ª linha, junto da data; a "›" fica no meio das duas linhas — ficam desalinhados.',
           'Proposta B: a "›" sobe para a linha do valor (data · valor · ›); a frase de baixo continua na largura toda, em 1 linha.'],*fs)
