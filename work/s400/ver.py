# S400 · conferência do que foi implementado contra os esboços 59a–59g e 61i (site real, celular)
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import pag,comum
from playwright.sync_api import sync_playwright
T='/tmp/s400/'
def cheia(pg,arq):
    h=pg.evaluate("()=>{const o=document.getElementById('pkok');return o?Math.max(844,o.scrollHeight+4):844}");pg.set_viewport_size({'width':390,'height':int(min(h,1500))});pg.wait_for_timeout(350);pg.screenshot(path=arq)
with sync_playwright() as pw:
    for nome,p,m in [('a_trf_abrir','alias',0.2),('b_trf_2min','alias',2.2),('c_pix_abrir','pix',0.2),('c_pix_2min','pix',2.2)]:
        b,pg,w=pag.abre(pw,p,m);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(300)
        print(nome,'| aviso:',pg.evaluate("()=>{const o=document.getElementById('pkok');return [o.querySelector('.zs').innerText,!!o.querySelector('#pxcard,.pxc'),(o.querySelector('#pgcl')||{}).hidden,(o.querySelector('#pgcl')||{innerText:''}).innerText,!!o.querySelector('.zpas'),!!o.querySelector('#pgbtn.zP')]}"),'olho:',sorted(comum.olho(pg))[:6],er[:2]);cheia(pg,T+nome+'.png');b.close()
