import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from playwright.sync_api import sync_playwright
J=open('/home/claude/lafouch/work/kit/abas_dist.js').read()
CAS=[('clientes',["()=>__LF.setView('clientes')"]),('clientes-novo',["()=>__LF.setView('clientes')","()=>document.querySelector('[data-act=clinovo]').click()"]),
 ('clientes-ficha',["()=>__LF.setView('clientes')","()=>{const e=[...document.querySelectorAll('#v-clientes [data-act]')].find(x=>/^(cliab|cliabrir)$/.test(x.dataset.act));e&&e.click();return e&&e.dataset.act}"]),
 ('atacado-mensagens',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('msg')"]),('atacado-lojistas',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('loj')"]),
 ('atacado-lotes',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('lot')"]),('atacado-tabela',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('tab')"])]
with sync_playwright() as pw:
  for nome,ps in CAS:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in ps:
      try: print(nome,pg.evaluate(p))
      except Exception as e: print(nome,'ERR',str(e)[:60])
      w(1000)
    print(nome,'abas:',pg.evaluate(J),'olho:',sorted(comum.olho(pg))[:4])
    pg.screenshot(path='/tmp/s420/ca_%s.png'%nome);b.close()
