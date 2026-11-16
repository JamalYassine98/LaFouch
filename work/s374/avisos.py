# S374: onde os avisos das Notificações se repetem nas telas (R8)
import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.argv=['x'];import ap
from playwright.sync_api import sync_playwright
TELAS=['inicio','vendas','estoque','caixa','fx','desp','hist','dash','ped','cli','ajustes']
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'notif',True);w(800)
    N=pg.evaluate("()=>[...document.querySelectorAll('#v-notif b, #v-notif strong, #v-notif .nt, #v-notif h3')].map(e=>e.innerText.trim()).filter(t=>t.length>6)")
    print('NOTIF:',N)
    for t in TELAS:
        pg.evaluate("t=>window.__LF.setView(t)",t);w(900)
        tx=pg.evaluate("t=>{const v=document.getElementById('v-'+t);return v?v.innerText:''}",t)
        hits=[n for n in N if n[:22] in tx or re.sub(r'\d+','',n)[:18] in re.sub(r'\d+','',tx)]
        print(t,'→',hits)
    b.close()
