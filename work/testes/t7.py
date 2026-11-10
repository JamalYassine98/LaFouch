import sys;sys.path.insert(0,'/home/claude/gz');from base import *
from t5 import espera,clica,ate_teste
W=int(sys.argv[1]) if len(sys.argv)>1 else 390;H=int(sys.argv[2]) if len(sys.argv)>2 else 844
TOP="(()=>{const e=document.elementFromPoint(%d,%d);return (e.closest('[id]')||{}).id})()"
def sobre(pg,nome):
  res=[]
  for bt,fecha in (('#mnb','#drw .dsc'),('#sbtn','#sov .sosc'),('#bagbtn','#layer [data-close]')):
    pg.click(bt,force=True);pg.wait_for_timeout(700)
    top=pg.evaluate(TOP%(W//2,H//2));pz=pg.evaluate("(()=>{try{return document.querySelector('#gw')?1:0}catch(e){return -1}})()")
    st1=pg.evaluate("JSON.stringify({f:__LFGZ.Z.fase,ss:__ss.length})")
    pg.wait_for_timeout(1500);st2=pg.evaluate("JSON.stringify({f:__LFGZ.Z.fase,ss:__ss.length})")
    if bt=='#mnb':pg.screenshot(path=f'/tmp/h_{nome}_menu.png')
    if bt=='#mnb':pg.click(fecha,position={'x':W-20,'y':H-40},force=True)
    elif bt=='#sbtn':pg.click(fecha,position={'x':W//2,'y':H-40},force=True)
    else:pg.go_back()
    pg.wait_for_timeout(800)
    res.append(f"{bt}: topo={top} pausa={'ok' if st1==st2 else st1+'→'+st2} gw={'sim' if pg.evaluate('!!document.getElementById(\"gw\")') else 'FECHOU'} fase={pg.evaluate('__LFGZ.Z.fase')}")
  print(nome,' | '.join(res))
with sync_playwright() as p:
  b,pg,errs=abre(p,perm=False,W=W,H=H,ls={'t_perm':'prompt'})
  pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.wait_for_timeout(5500);sobre(pg,'entrada')
  espera(pg,"!!document.querySelector('#gw [data-gz=comeca]')");pg.click('#gw [data-gz=comeca]');espera(pg,"__LFGZ.Z.fase==='cam'&&!!document.querySelector('#gw [data-gz=camsim]')");sobre(pg,'camera')
  clica(pg,'camsim');ate_teste(pg);pg.wait_for_timeout(1500);sobre(pg,'teste')
  for i in range(5):clica(pg,'sim')
  clica(pg,'nao');pg.wait_for_timeout(900);sobre(pg,'lente')
  # depois de voltar, segue até o resultado
  for i in range(60):
    espera(pg,"__LFGZ.Z.fase!=='teste'||(!!document.querySelector('#gw [data-gz=sim]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)",45000)
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    pg.wait_for_timeout(200);pg.click('#gw [data-gz=sim]')
  espera(pg,"__LFGZ.Z.fase==='pp'");pg.wait_for_timeout(800);sobre(pg,'pontoprox')
  clica(pg,'nemb');espera(pg,"__LFGZ.Z.fase==='res'");pg.wait_for_timeout(1000);sobre(pg,'resultado')
  print('ERR',[e for e in errs if 'TUNNEL' not in e])
