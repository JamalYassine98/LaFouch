import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.argv=['x'];import ap
from playwright.sync_api import sync_playwright
TELAS=['inicio','vendas','estoque','caixa','fx','desp','hist','dash','ped','cli','ajustes','giro','prec','din']
JS="""t=>{const v=document.getElementById('v-'+t)||document.body;const cs=getComputedStyle(document.documentElement);
const cores=['--warnbg','--badbg','--warn','--bad'].map(k=>cs.getPropertyValue(k).trim());
const hex=c=>{const m=c.match(/\\d+/g);return m?'#'+m.slice(0,3).map(x=>(+x).toString(16).padStart(2,'0')).join(''):''};
const out=[];v.querySelectorAll('*').forEach(e=>{if(!e.offsetParent)return;const s=getComputedStyle(e);const bg=hex(s.backgroundColor),bc=hex(s.borderLeftColor||'');
 const ehAv=/aviso|alert|atn|warn|guard|grd|pend/i.test(e.className&&e.className.baseVal===undefined?e.className:'')||cores.slice(0,2).includes(bg);
 if(ehAv&&e.innerText&&e.innerText.trim().length>8&&e.getBoundingClientRect().height>30&&!out.some(o=>o.el.contains(e)))out.push({el:e,t:e.innerText.trim().replace(/\\s+/g,' ').slice(0,110),c:(e.className||'').toString().slice(0,30)})});
return out.map(o=>o.c+' | '+o.t)}"""
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'inicio',True);w(800)
    for t in TELAS:
        if t in('giro','prec','din'): pg.evaluate("t=>{const L=window.__LF;L.S.dTab=t;L.setView('dash')}",t)
        else: pg.evaluate("t=>window.__LF.setView(t)",t)
        w(900);r=pg.evaluate(JS,'dash' if t in('giro','prec','din') else t)
        print('##',t);[print('   ',x) for x in r[:8]]
    b.close()
