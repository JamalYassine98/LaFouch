import sys;sys.path.insert(0,'/home/claude/gz');from base import *
from t5 import espera,clica,ate_teste
for nome,ls in (('íris',{'t_perm':'granted'}),('sem íris (dúvida)',{'t_perm':'granted','t_semmp':'1'})):
  with sync_playwright() as p:
    b,pg,errs=abre(p,perm=False,ls=ls)
    pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.wait_for_timeout(1200);pg.click('#gw [data-gz=comeca]');ate_teste(pg)
    espera(pg,"__LFGZ.Z.qt>0",30000)
    pg.evaluate("window.__dist=46");pg.wait_for_timeout(1800);print(nome,'chip a 46 cm:',pg.evaluate("document.getElementById('gzdi').className+' '+document.getElementById('gzdi').textContent"))
    clica(pg,'sim');pg.wait_for_timeout(1500);print(' toque a 46 cm → at',pg.evaluate("__LFGZ.Z.at"),'|',pg.evaluate("document.getElementById('gzbal').textContent"))
    if pg.evaluate("__LFGZ.Z.at")==0:
      espera(pg,"!__LFGZ.Z.falando",20000);clica(pg,'sim');pg.wait_for_timeout(1500);print(' 2º toque a 46 → ',pg.evaluate("document.getElementById('gzbal').textContent"))
      pg.evaluate("window.__dist=30");pg.wait_for_timeout(1800);espera(pg,"!__LFGZ.Z.falando",20000);clica(pg,'sim');pg.wait_for_timeout(1500);print(' a 30 cm → at',pg.evaluate("__LFGZ.Z.at"))
    pg.evaluate("window.__dist=39");pg.wait_for_timeout(1800);print(' chip a 39 cm:',pg.evaluate("document.getElementById('gzdi').className+' '+document.getElementById('gzdi').textContent"))
    print(' ERR',[e for e in errs if 'TUNNEL' not in e]);b.close()
