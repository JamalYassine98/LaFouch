# S330: reproduz "não consigo sair do catálogo" (Modo cliente / Modo loja). App real no simulador; só leitura.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
T='/tmp/s330/'
with sync_playwright() as pw:
    for pin in (False,True):
        b,pg,w=base.abre(pw,'vendas',True)
        pg.evaluate("()=>{localStorage.setItem('lf_modoCli','1')}");pg.evaluate("()=>{const x=document.querySelector('[data-act=mcLiga]');x&&x.click()}");w(2500)
        tem=pg.evaluate("()=>!!document.getElementById('mlWrap')")
        if pin: pg.evaluate("()=>{window.__LF.S.pinHash='x';window.__LF.S.pinSalt='y'}")
        r=pg.evaluate("()=>{const h=document.querySelector('#mlWrap .mlHot'),f=document.querySelector('#mlFr');const a=h&&h.getBoundingClientRect();let lg=null;try{const d=f.contentDocument,l=d.querySelector('.top .logo,.top .brand,.top img,.top svg');const r=l&&l.getBoundingClientRect();lg=r?[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]:null}catch(e){lg=String(e).slice(0,60)};return {zona:a?[Math.round(a.left),Math.round(a.top),Math.round(a.width),Math.round(a.height)]:null,logo_site:lg,z_catalogo:getComputedStyle(document.getElementById('mlWrap')).zIndex,z_pin:getComputedStyle(document.getElementById('lockScr')).zIndex}}") if tem else None
        print('PIN' if pin else 'sem PIN','· catálogo aberto:',tem,r)
        if tem:
            bx=r['zona'];x=bx[0]+bx[2]/2;y=bx[1]+bx[3]/2
            pg.mouse.move(x,y);pg.mouse.down();w(5400);pg.mouse.up();w(600)
            print('  depois de segurar 5 s: catálogo ainda aberto =',pg.evaluate("()=>!!document.getElementById('mlWrap')"),'· tela do PIN visível no código =',pg.evaluate("()=>!document.getElementById('lockScr').hidden"),'· o que está por cima no meio da tela =',pg.evaluate("()=>{const e=document.elementFromPoint(195,420);return e.id||e.tagName}"))
            pg.screenshot(path=T+'sair_%d.png'%pin)
        b.close()
