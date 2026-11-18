import sys,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
L=[('despesas-conta',D['despesas-conta']),('caixa-movimentos',D['caixa-movimentos']+["()=>scrollTo(0,420)"]),('atacado',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('loj')"]),('giro-parado',D['giro-parado']),('caixa-retirar',D['caixa-retirar']),('cambio-troca',D['cambio-troca']),('pendencias',D['pendencias']),('precos',D['precos'])]
with sync_playwright() as pw:
  for n,ps in L:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in ps: pg.evaluate(p);w(900)
    t=time.time();pg.evaluate("()=>1");w(500);dt=time.time()-t
    print(n,'olho',sorted(comum.olho(pg))[:3],'resp %.2fs'%dt);pg.screenshot(path='/tmp/s425/base_%s.png'%n);b.close()
