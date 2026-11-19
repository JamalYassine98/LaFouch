import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
J="""()=>{const v=[...document.querySelectorAll('.view')].find(x=>x.offsetHeight);const h=v.querySelector('.top h1,.dHdT');const c=v.querySelector('.top .crumb,.dHdS');const r=document.createRange();r.selectNodeContents(h);const L=r.getClientRects()[0];const cs=getComputedStyle(h),cc=c?getComputedStyle(c):{};const cr=c?c.getBoundingClientRect():{};const vr=v.getBoundingClientRect();
return {v:v.id,h1:[cs.fontFamily.slice(0,20),cs.fontSize,cs.fontWeight,cs.lineHeight],htop:+(h.getBoundingClientRect().top-vr.top).toFixed(1),hbot:+(h.getBoundingClientRect().bottom-vr.top).toFixed(1),txtTop:+(L.top-vr.top).toFixed(1),crumb:c?[cc.fontSize,cc.marginTop,+(cr.top-vr.top).toFixed(1),cc.opacity]:null,logo:document.querySelector('.top.logo-top').getBoundingClientRect().bottom,logoPos:getComputedStyle(document.querySelector('.top.logo-top')).position,vtop:vr.top}}"""
with sync_playwright() as pw:
  for nm,st in [('ajustes',["()=>__LF.setView('ajustes')"]),('caixa',["()=>__LF.setView('caixa')"]),('dash',C['dash-mes']),('clientes',["()=>__LF.setView('clientes')"]),('reservas',["()=>{__LF.S.dTab='din';__LF.setView('dash')}"]),('giro',["()=>{__LF.S.dTab='giro';__LF.setView('dash')}"])]:
    b,pg,w=ap.abre(pw,'inicio',True,base=False);w(300)
    for x in st: pg.evaluate(x);w(900)
    print(nm,pg.evaluate(J));b.close()
