import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
sys.path.insert(0,'/home/claude/lafouch/work/kit');import base_app
from playwright.sync_api import sync_playwright
D=dict(C)
J="()=>{const b=[...document.querySelectorAll('button')].filter(x=>x.textContent.trim()=='Conferir'&&x.getBoundingClientRect().height);return b.map(x=>x.parentElement.className+'|'+Math.round(x.getBoundingClientRect().top))}"
with sync_playwright() as pw:
  for it in base_app.ITENS:
    b=pw.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=1)
    # usa ap sem base e injeta só este item
    b.close()
    b,pg,w=ap.abre(pw,'inicio',True,base=False);w(200)
    pg.evaluate("s=>{eval(s)}",base_app.script([it]))
    for x in D['caixa-acoes']:
      try: pg.evaluate(x)
      except Exception: pass
      w(800)
    print(it['id'],pg.evaluate(J));b.close()
