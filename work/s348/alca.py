# S348: reteste honesto — arrastar começando EXATAMENTE no centro da alça e, depois, no título. Celular (dedo) e PC (mouse).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
VIS="s=>{const e=[...document.querySelectorAll(s)].filter(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return c.display!=='none'&&c.visibility!=='hidden'&&r.height>60&&r.top<innerHeight-40}).pop();if(!e)return null;const r=e.getBoundingClientRect();const al=[...e.querySelectorAll('*')].find(x=>{const q=x.getBoundingClientRect();return q.width>=28&&q.width<=80&&q.height>=3&&q.height<=8&&q.top-r.top<30});const t=e.querySelector('.ljHd,h2,h3,.fbHdL,b');const a=al&&al.getBoundingClientRect(),tt=t&&t.getBoundingClientRect();return {alca:a?[(a.left+a.width/2)|0,(a.top+a.height/2)|0]:null,tit:tt?[(tt.left+20)|0,(tt.top+tt.height/2)|0]:null}}"
CASOS=[('Ajustes do catálogo','vendas',"()=>document.getElementById('cjAj').click()",'.ljJn'),('Lotes de atacado','clientes',"()=>document.querySelector('[data-act=ataLotes]').click()",'.ljJn'),('Novo objetivo','caixa',"()=>window.__LF.ACT.cxabre('mel')",'.cxAcao.on'),
 ('Filtros do inventário','estoque',"()=>[...document.querySelectorAll('#v-estoque button')].find(b=>/Filtros e ordem/.test(b.getAttribute('aria-label')||'')).click()",'#filtBox'),('Câmbio · Dólar','fx',"()=>document.querySelector('[data-act=fjAbre]').click()",'.fjJn')]
with sync_playwright() as pw:
    for apn in ('celular','pc'):
        for nome,tela,abre,sel in CASOS:
            out=[]
            for onde in ('alca','tit'):
                b,pg,w=ap.abre(pw,tela,True,apn)
                try:
                    pg.evaluate(abre);w(1400);v=pg.evaluate(VIS,sel)
                    if not v or not v[onde]: out.append(onde+': sem '+onde);b.close();continue
                    x,y=v[onde]
                    if apn=='celular':
                        cdp=pg.context.new_cdp_session(pg);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                        for k in range(1,9): cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y+k*40}]});w(30)
                        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                    else:
                        pg.mouse.move(x,y);pg.mouse.down()
                        for k in range(1,9): pg.mouse.move(x,y+k*40);w(30)
                        pg.mouse.up()
                    w(900);out.append(('alça' if onde=='alca' else 'título')+': '+('fecha' if not pg.evaluate(VIS,sel) else 'NÃO fecha'))
                except Exception as e: out.append(onde+' erro '+str(e)[:50])
                b.close()
            print('%-8s %-24s %s'%(apn,nome,' · '.join(out)),flush=True)
