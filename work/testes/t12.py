import sys,json;sys.path.insert(0,'/home/claude/gz');from base import *
from t5 import espera,clica,ate_teste
cen=sys.argv[1] if len(sys.argv)>1 else 'A'; W=int(sys.argv[2]) if len(sys.argv)>2 else 390; H=int(sys.argv[3]) if len(sys.argv)>3 else 844
ST="JSON.stringify((()=>{const Z=__LFGZ.Z,l=document.getElementById('gzl'+Z.at),sp=l&&l.querySelector('span'),f=document.getElementById('gzfita');return {f:Z.fase,g:Z.g,at:Z.at,slot:Z.slot,ok2:Z.ok2,ko2:Z.ko2,txt:sp&&sp.textContent,fs:l&&l.style.fontSize,larg:sp&&[sp.scrollWidth,f.clientWidth-10],linhas:sp&&Math.round(sp.getBoundingClientRect().height/parseFloat(getComputedStyle(sp).lineHeight)),bal:document.getElementById('gzbal').textContent.slice(0,60),chip:(document.getElementById('gzdi')||{}).textContent}})())"
ERRP="""(()=>{const Z=__LFGZ.Z,m=Z.m,l=document.getElementById('gzl'+Z.at),sp=l&&l.querySelector('span'),S=document.getElementById('gzstg').getBoundingClientRect(),d=m.el.querySelector('.luva .dedo').getBoundingClientRect(),R=sp.getBoundingClientRect();
 const a=(m.el.querySelector('.ponT').getAttribute('transform').match(/rotate\\(([-\\d.]+)/)||[0,0])[1]*Math.PI/180,hw=7.5*__LFGZ.L.k,cx=d.left+d.width/2+Math.cos(a)*hw,cy=d.top+d.height/2+Math.sin(a)*hw;return [Math.round(cx-(R.left-5)),Math.round(cy-(R.top+R.height*.55))]})()"""
n=[0]
def foto(pg,nome):
  pg.screenshot(path=f'/tmp/q_{cen}_{n[0]:02d}_{nome}.png');n[0]+=1
def resp(pg,k,nome=None):
  clica(pg,k);pg.wait_for_timeout(200)
  espera(pg,"__LFGZ.Z.fase!=='teste'||(!__LFGZ.Z.falando&&!__LFGZ.Z.troca&&!__LFGZ.Z.ocupado)",45000);pg.wait_for_timeout(1200)
  st=json.loads(pg.evaluate(ST));e=pg.evaluate(ERRP) if st['f']=='teste' else None
  print(k,'→',st,'erro ponta',e)
  if nome:foto(pg,nome)
  return st
with sync_playwright() as p:
  import os;LG=os.environ.get('LG','pt-BR');b,pg,errs=abre(p,lang=LG,W=W,H=H,perm=False,ls=dict({'t_perm':'granted'},**({'lf_lang':'es'} if LG.startswith('es') else {})))
  pg.goto('http://localhost:8771/?r=descubra-o-grau');pg.wait_for_timeout(1200);pg.click('#gw [data-gz=comeca]');ate_teste(pg)
  espera(pg,"__LFGZ.Z.qt>0",30000);pg.wait_for_timeout(600)
  print('início',pg.evaluate(ST),'erro ponta',pg.evaluate(ERRP));foto(pg,'inicio')
  if cen=='A':
    for i in range(5):resp(pg,'sim','sim%d'%i if i in (0,1,2) else None)
    resp(pg,'nao','lente')
  else:
    resp(pg,'nao','lente3')
  for i in range(40):
    st=json.loads(pg.evaluate(ST))
    if st['f']!='teste':break
    resp(pg,'sim','x%d'%i if i<14 else None)
  print('fase',pg.evaluate("__LFGZ.Z.fase"))
  if pg.evaluate("__LFGZ.Z.fase")=='pp':
    foto(pg,'pp')
    for i in range(3):
      if pg.evaluate("__LFGZ.Z.fase")!='pp':break
      clica(pg,'emb');pg.wait_for_timeout(2500)
    espera(pg,"__LFGZ.Z.fase==='res'",30000)
  pg.wait_for_timeout(2500);foto(pg,'res');print('res',pg.evaluate("document.querySelector('#gw .gzrs').innerText.split(String.fromCharCode(10)).join(' / ')"))
  print('ss',pg.evaluate('__ss'));print('audios',pg.evaluate('__al.map(a=>a.f).join(",")'))
  print('ERR',[e for e in errs if 'TUNNEL' not in e])
