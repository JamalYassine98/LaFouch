import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
J=r"""()=>{const e=document.querySelector('.note.n-bad');const L=[];let c=e;for(let i=0;i<4&&c;i++){const s=getComputedStyle(c);L.push(c.tagName+'.'+c.className+' bg='+s.backgroundColor+' bd='+s.borderTopWidth+' sh='+s.boxShadow+' ol='+s.outlineStyle);c=c.parentElement}const a=getComputedStyle(e,'::before'),b=getComputedStyle(e,'::after');L.push('before='+a.content+' '+a.border+' / after='+b.content+' '+b.border);return L}"""
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for p in D['caixa-movimentos']: pg.evaluate(p);w(900)
  pg.add_style_tag(content="html body div.note.n-bad{background:none!important;border:0!important;box-shadow:none!important}")
  for x in pg.evaluate(J): print(x)
  b.close()
