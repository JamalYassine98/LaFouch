import sys;sys.path.insert(0,'/home/claude/gz');from base import *
def espera(pg,cond,ms=45000):pg.wait_for_function(cond,timeout=ms)
def clica(pg,k):
  espera(pg,f"!!document.querySelector('#gw [data-gz={k}]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado");pg.wait_for_timeout(200);pg.click(f'#gw [data-gz={k}]')
def ate_teste(pg):
  espera(pg,"__LFGZ.Z.fase==='teste'",40000)
def roda(nome,ls,acao):
  with sync_playwright() as p:
    b,pg,errs=abre(p,perm=False,ls=ls)
    pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.wait_for_timeout(1500);pg.click('#gw [data-gz=comeca]')
    try:acao(pg)
    except Exception as e:print(nome,'FALHOU',str(e)[:120],pg.evaluate(S),pg.evaluate('JSON.stringify({tr:__LFGZ.Z.troca,oc:__LFGZ.Z.ocupado,fal:__LFGZ.Z.falando,bt:document.querySelector("#gzbt").innerHTML.slice(0,120)})'))
    print(nome,'ERR',[e for e in errs if 'TUNNEL' not in e]);b.close()
def sem(pg):
  clica(pg,'camnao');ate_teste(pg);print('sem câmera:',pg.evaluate(S),'gum',pg.evaluate('__gum'),'ss',pg.evaluate('__ss')[-3:])
  for i in range(9):clica(pg,'sim')
  espera(pg,"__LFGZ.Z.fase==='res'");print(' res:',pg.evaluate(S))
def negado(pg):
  ate_teste(pg);print('negado antes:',pg.evaluate(S),'gum',pg.evaluate('__gum'),'ss',pg.evaluate('__ss'))
def permitido(pg):
  ate_teste(pg);print('já permitido:',pg.evaluate(S),'ss',pg.evaluate('__ss'))
def recusou(pg):
  clica(pg,'camsim');ate_teste(pg);print('recusou na janelinha:',pg.evaluate(S),'ss',pg.evaluate('__ss'))
def escuro(pg):
  pg.evaluate("window.__lfFakeLum=20");clica(pg,'camsim');ate_teste(pg);espera(pg,"!!document.querySelector('#gw [data-gz=luzok]')");pg.wait_for_timeout(600);pg.screenshot(path='/tmp/g_luz.png');print('escuro:',pg.evaluate(S))
  clica(pg,'luzok');pg.wait_for_timeout(3000);print(' ainda escuro:',pg.evaluate(S),bool(pg.query_selector('#gw [data-gz=luzok]')))
  clica(pg,'luzseg');pg.wait_for_timeout(500);print(' seguiu:',pg.evaluate(S))
  for i in range(9):clica(pg,'sim')
  espera(pg,"__LFGZ.Z.fase==='res'");pg.wait_for_timeout(1500);print(' res nota:',pg.evaluate("(document.querySelector('#gw .gzlz')||{}).textContent"))
def melhorou(pg):
  pg.evaluate("window.__lfFakeLum=20");clica(pg,'camsim');ate_teste(pg);espera(pg,"!!document.querySelector('#gw [data-gz=luzok]')");pg.evaluate("window.__lfFakeLum=130")
  clica(pg,'luzok');pg.wait_for_timeout(2500);print('melhorou:',pg.evaluate(S),'botão sim?',bool(pg.query_selector('#gw [data-gz=sim]')))
def ppdif(pg):
  clica(pg,'camsim');ate_teste(pg)
  for i in range(9):
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    clica(pg,'sim' if i<6 else 'nao')
  for i in range(25):
    espera(pg,"__LFGZ.Z.fase!=='teste'||(!!document.querySelector('#gw [data-gz=sim]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)",30000)
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    pg.wait_for_timeout(200);pg.click('#gw [data-gz=sim]')
  espera(pg,"__LFGZ.Z.fase==='pp'");G=pg.evaluate("__LFGZ.Z.ppG");print('ppdif G',G)
  pg.evaluate("window.__dist=60");pg.wait_for_timeout(2000);clica(pg,'emb');espera(pg,"__LFGZ.Z.ppRep===1&&__LFGZ.Z.falando",45000);print(' repetiu:',pg.evaluate(S))
  pg.evaluate("window.__dist=60");clica(pg,'emb');espera(pg,"__LFGZ.Z.fase==='res'");pg.wait_for_timeout(1500);pg.screenshot(path='/tmp/g_res2.png')
  print(' res:',pg.evaluate("document.querySelector('#gw .gzrs').innerText.split(String.fromCharCode(10)).join(' / ')"))
def escuroG(pg):
  pg.evaluate("window.__lfFakeLum=20");clica(pg,'camsim');ate_teste(pg);clica(pg,'luzseg')
  for i in range(9):
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    clica(pg,'sim' if i<6 else 'nao')
  for i in range(25):
    espera(pg,"__LFGZ.Z.fase!=='teste'||(!!document.querySelector('#gw [data-gz=sim]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)",30000)
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    pg.wait_for_timeout(200);pg.click('#gw [data-gz=sim]')
  espera(pg,"__LFGZ.Z.fase==='pp'");clica(pg,'nemb');espera(pg,"__LFGZ.Z.ppRep===1&&__LFGZ.Z.falando",45000);clica(pg,'nemb')
  espera(pg,"__LFGZ.Z.fase==='res'");pg.wait_for_timeout(1500);pg.screenshot(path='/tmp/g_res3.png');print('escuroG res:',pg.evaluate("document.querySelector('#gw .gzrs').innerText.split(String.fromCharCode(10)).join(' / ')"))
def instavel(pg):
  clica(pg,'camsim');ate_teste(pg);pg.evaluate("__LFGZ.Z.fase='pp';__LFGZ.Z.ppG=1.5");
  pg.evaluate("setInterval(()=>window.__dist=20+Math.random()*15,200)")
  # força a tela de ponto próximo
  pg.evaluate("document.querySelector('#gzbt').innerHTML='<button class=gzgo data-gz=emb>x</button>'")
  pg.wait_for_timeout(500);pg.click('#gw [data-gz=emb]');pg.wait_for_timeout(2500);print('instável fala:',pg.evaluate("__LFGZ.Z.fase"),pg.evaluate('__ss')[-1])

which=sys.argv[1:] if __name__=='__main__' else ['nada']
T={'sem':({'t_perm':'prompt'},sem),'negado':({'t_perm':'denied'},negado),'permitido':({'t_perm':'granted'},permitido),'recusou':({'t_perm':'prompt','t_nega':'1'},recusou),'escuro':({'t_perm':'prompt'},escuro),'melhorou':({'t_perm':'prompt'},melhorou),'ppdif':({'t_perm':'prompt'},ppdif),'instavel':({'t_perm':'prompt'},instavel),'escuroG':({'t_perm':'prompt'},escuroG)}
for k in (which or T):
  if k in T:roda(k,*T[k])
