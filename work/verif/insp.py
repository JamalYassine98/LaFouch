import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
Q={'despesas-conta':["button","^\\+ Nova"],'caixa-movimentos':["section,div","Objetivos da loja"],'atacado-lojistas':["button,div","Novo acesso|Nenhum lojista"],
 'giro-parado':["details,section","Vitrine da semana"],'caixa-retirar':["button","^US\\$$"],'cambio-troca':["button","^US\\$$"],'pendencias':["section,div,article","^Luz"],'precos':["*","^61%$|Black Friday"]}
with sync_playwright() as pw:
  for n,(sel,rx) in Q.items():
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in D.get(n,["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('loj')"]):
      try: pg.evaluate(p)
      except Exception: pass
      w(900)
    r=pg.evaluate("""([s,rx])=>[...document.querySelectorAll(s)].filter(e=>e.getBoundingClientRect().height&&new RegExp(rx).test((e.innerText||'').trim())).slice(-2).map(e=>{const p=e.parentElement;return e.tagName+'.'+e.className+' | pai '+p.tagName+'.'+p.className+' :: '+e.outerHTML.slice(0,260)})""",[sel,rx])
    print('##',n);[print('  ',x) for x in r];b.close()
