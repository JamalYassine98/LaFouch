# S364 · prova da folha única: cada folha fecha arrastando de 3 pontos da faixa de cima (esquerda, meio, direita), com dedo (celular) e mouse (PC), e com Esc.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
VIS="s=>{const e=[...document.querySelectorAll(s)].filter(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return !e.hidden&&c.display!=='none'&&c.visibility!=='hidden'&&r.height>60&&r.top<innerHeight-40}).pop();if(!e)return null;const r=e.getBoundingClientRect();return [r.left,r.top,r.width]}"
LIVRE="a=>{const [x,y]=a;const e=document.elementFromPoint(x,y);return !(e&&e.closest('button,a,input,select,textarea,label,[data-act],[role=button],[role=switch]'))}"
CASOS=[('Ajustes do catálogo','vendas',"()=>document.getElementById('cjAj').click()",'.ljJn'),('Novo objetivo (Caixa)','caixa',"()=>window.__LF.ACT.cxabre('mel')",'.cxAcao.on'),
 ('Filtros do inventário','estoque',"()=>[...document.querySelectorAll('#v-estoque button')].find(b=>/Filtros e ordem/.test(b.getAttribute('aria-label')||'')).click()",'#filtBox'),('Câmbio · Dólar','fx',"()=>document.querySelector('[data-act=fjAbre]').click()",'.fjJn'),
 ('Dashboard · Período','dash',"()=>document.querySelector('#v-dash .dHdP').click()",'.lfa-sh')]
ruim=0
with sync_playwright() as pw:
    for apn in ('celular','pc'):
        for nome,tela,abre,sel in CASOS:
            out=[]
            for onde in ('esq','meio','dir','esc'):
                b,pg,w=ap.abre(pw,tela,True,apn)
                try:
                    pg.evaluate(abre);w(1400);v=pg.evaluate(VIS,sel)
                    if not v: out.append(onde+': não abriu');ruim+=1;b.close();continue
                    if onde=='esc':
                        pg.keyboard.press('Escape')
                    else:
                        x=v[0]+{'esq':26,'meio':v[2]/2,'dir':v[2]-26}[onde];y=None
                        for yy in (v[1]+14,v[1]+30,v[1]+46,v[1]+8,v[1]+58):
                            if pg.evaluate(LIVRE,[x,yy]): y=yy;break
                        if y is None: out.append(onde+': (só botão ali)');b.close();continue
                        if apn=='celular':
                            cdp=pg.context.new_cdp_session(pg);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                            for k in range(1,9): cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y+k*40}]});w(30)
                            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                        else:
                            pg.mouse.move(x,y);pg.mouse.down()
                            for k in range(1,9): pg.mouse.move(x,y+k*40);w(30)
                            pg.mouse.up()
                    w(1000);ok=not pg.evaluate(VIS,sel);ruim+=0 if ok else 1;out.append(onde+': '+('fecha' if ok else 'NÃO FECHA'))
                except Exception as e: out.append(onde+' erro '+str(e)[:60]);ruim+=1
                b.close()
            print('%-8s %-24s %s'%(apn,nome,' · '.join(out)),flush=True)
print('FALHAS:',ruim)
