# S374 · esboço 104 (dono 17/11 15:38, print do Histórico): "o valor está desalinhado com a flecha".
# Hoje: o valor (G$) fica na 1ª linha, junto da data, e a "›" fica no meio das duas linhas.
# Proposta: valor e "›" juntos, centralizados na altura da linha — igual às contas de Despesas (valor + "⌄" no meio).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS=".d71 .vl{grid-row:1/3;grid-column:2;align-self:center}.d71 .mt{grid-column:1/2}.d71 .mt .p104{white-space:nowrap}"
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate("()=>window.__LF.inicioGo('hist')");w(1300)
            if prop:
                pg.add_style_tag(content=CSS);pg.evaluate(r"""()=>document.querySelectorAll('.d71 .mt').forEach(m=>{const parts=[];let cur=document.createElement('span');cur.className='p104';[...m.childNodes].forEach(n=>{if(n.nodeType===3&&n.textContent.includes(' · ')){const seg=n.textContent.split(' · ');seg.forEach((t,i)=>{if(i>0){parts.push(cur);cur=document.createElement('span');cur.className='p104'}if(t)cur.appendChild(document.createTextNode(t))})}else cur.appendChild(n.cloneNode(true))});parts.push(cur);m.innerHTML='';parts.forEach((p,i)=>{if(i)m.appendChild(document.createTextNode(' · '));m.appendChild(p)})})""");w(200)
            oo.append(olho(pg));p=T+'h104_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p)
            if prop: print(pg.evaluate("()=>[...document.querySelectorAll('.d71')].slice(0,4).map(d=>{const v=d.querySelector('.vl').getBoundingClientRect(),c=d.querySelector('.ch').getBoundingClientRect();return Math.round((v.top+v.bottom)/2-(c.top+c.bottom)/2)})"))
            b.close()
        print(tema,'novos:',novos(oo[0],oo[1]))
        prancha('104c-app-historico-valor-alinhado-sem-quebrar-%s.jpg'%tema,'App · Histórico · opção A corrigida · tema %s'%tema,
          ['Hoje: o valor (G$) fica na 1ª linha, junto da data; a "›" fica no meio das duas linhas — ficam desalinhados.',
           'Proposta A corrigida: valor e "›" juntos no meio da linha; a frase de baixo só quebra ENTRE as partes ("7 vendas" · "lucro livre G$ 121.728"), nunca no meio de um valor.'],*fs)
