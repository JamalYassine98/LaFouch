import sys;sys.path.insert(0,'/home/claude/gz');from base import *
lang=sys.argv[1] if len(sys.argv)>1 else 'pt-BR'; W=int(sys.argv[2]) if len(sys.argv)>2 else 390; H=int(sys.argv[3]) if len(sys.argv)>3 else 844
def espera(pg,cond,ms=20000):
  pg.wait_for_function(cond,timeout=ms)
def clica(pg,k):
  # espera ele terminar de falar e o botão existir
  espera(pg,f"!!document.querySelector('#gw [data-gz={k}]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado")
  pg.wait_for_timeout(250);pg.click(f'#gw [data-gz={k}]')
with sync_playwright() as p:
  b,pg,errs=abre(p,lang=lang,W=W,H=H,perm=False,ls=dict({'t_perm':'prompt'},**({'lf_lang':'es'} if lang.startswith('es') else {})))
  pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.wait_for_timeout(2500)
  pg.click('#gw [data-gz=comeca]')  # cedo: ele termina a frase e segue
  t0=pg.evaluate('Date.now()')
  espera(pg,"__LFGZ.Z.fase==='cam'");print('cam após',pg.evaluate('Date.now()')-t0,'ms',pg.evaluate(S))
  pg.wait_for_timeout(1500);pg.screenshot(path='/tmp/f_cam.png')
  print('getUserMedia antes de responder?',pg.evaluate('__gum'))
  clica(pg,'camsim');pg.wait_for_timeout(300);print('camw',pg.evaluate(S))
  espera(pg,"__LFGZ.Z.fase==='prep'");print('prep',pg.evaluate(S));pg.wait_for_timeout(1200);pg.screenshot(path='/tmp/f_prep.png')
  espera(pg,"__LFGZ.Z.fase==='teste'",30000);pg.wait_for_timeout(800);print('teste',pg.evaluate(S))
  print('quadro:',pg.evaluate("[...document.querySelectorAll('#gzfita .gzl span')].map(e=>e.textContent).join(' | ')"))
  for i in range(5):clica(pg,'sim')
  clica(pg,'nao')
  n=0
  while True:
    n+=1
    if n>30:break
    try:espera(pg,"(__LFGZ.Z.fase!=='teste')||(!!document.querySelector('#gw [data-gz=sim]')&&!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)",30000)
    except Exception as e:print('timeout',pg.evaluate(S));break
    if pg.evaluate("__LFGZ.Z.fase")!='teste':break
    if n==3:pg.screenshot(path='/tmp/f_lente.png')
    pg.wait_for_timeout(250);pg.click('#gw [data-gz=sim]')
  print('fim quadro',pg.evaluate(S),'última:',pg.evaluate("(document.querySelector('#gzl8 span')||{}).textContent"))
  if pg.evaluate("__LFGZ.Z.fase")=='pp':
    pg.wait_for_timeout(1000);pg.screenshot(path='/tmp/f_pp.png')
    G=pg.evaluate("__LFGZ.Z.ppG");print('G',G)
    import math
    # distância que dá o mesmo grau: add=3.33-50/d -> d=50/(3.33-G-0.1)
    d=50/(3.33-G-0.1);pg.evaluate(f"window.__dist={d}");pg.wait_for_timeout(2500)
    clica(pg,'emb')
    espera(pg,"__LFGZ.Z.fase==='res'",20000)
  pg.wait_for_timeout(2500);pg.screenshot(path='/tmp/f_res.png',full_page=False);print('res',pg.evaluate(S))
  print('ss',pg.evaluate('__ss'))
  print('audios',pg.evaluate('__al.map(a=>a.f+(a.fim?"":"(x)")).join(",")'))
  print('ERR',[e for e in errs if 'TUNNEL' not in e])
