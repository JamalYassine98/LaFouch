# Fiscal do layout: abre o site em vários aparelhos, tamanhos de letra e idiomas, passa por todas as telas e lista os problemas. Não muda nada no site.
# Uso: python3 fiscal.py <porta> <saida_dir> [rapido]
import sys,os,json,time;sys.path.insert(0,'/home/claude/gz');from base import *
PORTA=sys.argv[1];OUT=sys.argv[2];RAP=len(sys.argv)>3;os.makedirs(OUT+'/f',exist_ok=True)
AUD=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'audita.js')).read()
AP=[('celular pequeno',320,568),('celular',360,640),('iPhone SE',375,667),('iPhone',390,844),('Android grande',412,915),('iPhone Max',430,932),('celular deitado',844,390),
    ('tablet pequeno',600,960),('iPad em pé',768,1024),('iPad Air em pé',820,1180),('iPad deitado',1024,768),('iPad Air deitado',1180,820),('notebook',1366,768),('notebook grande',1536,864),('monitor',1920,1080)]
if RAP:AP=[AP[3]]
VAR=[('pt','normal')] if RAP else [('pt','normal'),('pt','grande'),('es','normal')]
DRAW="""(rs)=>{document.querySelectorAll('.__fx').forEach(e=>e.remove());rs.forEach(([x,y,w,h])=>{const d=document.createElement('div');d.className='__fx';d.style.cssText=`position:fixed;left:${x-2}px;top:${y-2}px;width:${w+4}px;height:${h+4}px;border:2px solid #ff0040;background:#ff004022;z-index:2147483647;pointer-events:none;border-radius:3px`;document.body.appendChild(d)})}"""
res=[];n=[0]
def audita(pg,ap,var,tela):
  try:iss=pg.evaluate(AUD)
  except Exception as e:iss=[{'t':'erro_fiscal','d':str(e)[:120]}]
  f=None
  if [x for x in iss if x['t'] not in ('reticencias','sob_fixo')]:
    f=f'f/{n[0]:04d}.png';n[0]+=1
    pg.evaluate(DRAW,[x['r'] for x in iss if x.get('r') and x['t'] not in ('reticencias','sob_fixo')][:40]);pg.screenshot(path=OUT+'/'+f);pg.evaluate("document.querySelectorAll('.__fx').forEach(e=>e.remove())")
  res.append({'ap':ap,'var':var,'tela':tela,'iss':iss,'foto':f})
def rola(pg,ap,var,tela,alvo=None,maxp=8):
  sel=alvo
  h=pg.evaluate(f"(()=>{{const e={('document.querySelector('+json.dumps(sel)+')') if sel else 'null'};return e?e.scrollHeight:document.documentElement.scrollHeight}})()");vh=pg.evaluate('innerHeight')
  for k in range(min(maxp,max(1,int((h-1)//vh)+1))):
    pg.evaluate(f"(()=>{{const e={('document.querySelector('+json.dumps(sel)+')') if sel else 'null'};(e||window).scrollTo(0,{k*vh})}})()");pg.wait_for_timeout(450)
    audita(pg,ap,var,f'{tela} · parte {k+1}')
def roda(p,ap,W,H,lg,tam):
  ls={'t_perm':'granted'};ls.update({'lf_lang':'es'} if lg=='es' else {});ls.update({'lf_zoom':'2'} if tam=='grande' else {})
  b,pg,errs=abre(p,lang='es-PY' if lg=='es' else 'pt-BR',W=W,H=H,perm=False,ls=ls);var=f'{lg} · letra {tam}'
  U=f'http://localhost:{PORTA}/'
  pg.goto(U);pg.wait_for_timeout(2500);rola(pg,ap,var,'Início')
  pg.evaluate('scrollTo(0,0)');pg.wait_for_timeout(300)
  try:pg.click('#mnb',force=True);pg.wait_for_timeout(800);rola(pg,ap,var,'Menu','#drw .dpn',3);pg.click('#drw .dsc',position={'x':W-8,'y':H-8},force=True);pg.wait_for_timeout(600)
  except Exception as e:res.append({'ap':ap,'var':var,'tela':'Menu','iss':[{'t':'erro_fiscal','d':str(e)[:100]}],'foto':None})
  try:pg.click('#sbtn',force=True);pg.wait_for_timeout(600);pg.keyboard.type('trans');pg.wait_for_timeout(900);audita(pg,ap,var,'Busca');pg.keyboard.press('Escape');pg.wait_for_timeout(500)
  except Exception as e:res.append({'ap':ap,'var':var,'tela':'Busca','iss':[{'t':'erro_fiscal','d':str(e)[:100]}],'foto':None})
  pg.goto(U);pg.wait_for_timeout(2000)
  try:
    pg.click('#mnb',force=True);pg.wait_for_timeout(700);pg.click('#drw a[data-mf] >> nth=1');pg.wait_for_timeout(1800);rola(pg,ap,var,'Catálogo (Leitura)',None,4)
    pg.evaluate('scrollTo(0,0)');pg.wait_for_timeout(300);pg.locator('[data-open]:visible').first.click();pg.wait_for_timeout(1800);rola(pg,ap,var,'Página do produto','#layer .scrim',4)
  except Exception as e:res.append({'ap':ap,'var':var,'tela':'Catálogo/produto','iss':[{'t':'erro_fiscal','d':str(e)[:100]}],'foto':None})
  pg.goto(U);pg.wait_for_timeout(2000)
  try:pg.click('#bagbtn',force=True);pg.wait_for_timeout(1000);audita(pg,ap,var,'Carrinho')
  except Exception as e:res.append({'ap':ap,'var':var,'tela':'Carrinho','iss':[{'t':'erro_fiscal','d':str(e)[:100]}],'foto':None})
  try:
    pg.goto(U+'?r=descubra-o-grau');pg.wait_for_timeout(2500);audita(pg,ap,var,'Consulta · entrada')
    pg.wait_for_timeout(9000);audita(pg,ap,var,'Consulta · aviso')
    pg.click('#gw [data-gz=comeca]');pg.wait_for_function("__LFGZ.Z.fase==='teste'&&__LFGZ.Z.qt>0",timeout=45000);pg.wait_for_timeout(600);audita(pg,ap,var,'Consulta · quadro')
    pg.wait_for_function("!__LFGZ.Z.falando",timeout=20000);pg.click('#gw [data-gz=nao]');pg.wait_for_function("__LFGZ.Z.g>0&&!__LFGZ.Z.troca&&!__LFGZ.Z.falando",timeout=45000);pg.wait_for_timeout(600);audita(pg,ap,var,'Consulta · lente')
  except Exception as e:res.append({'ap':ap,'var':var,'tela':'Consulta','iss':[{'t':'erro_fiscal','d':str(e)[:100]}],'foto':None})
  js=[e for e in errs if 'TUNNEL' not in e and 'XNNPACK' not in e and '404' not in e]
  if js:res.append({'ap':ap,'var':var,'tela':'(erros do navegador)','iss':[{'t':'erro_js','d':x[:150]} for x in js],'foto':None})
  b.close()
t0=time.time()
with sync_playwright() as p:
  for ap,W,H in AP:
    for lg,tam in VAR:
      if lg=='es' and ap not in ('celular pequeno','iPhone','iPad em pé','notebook'):continue
      roda(p,f'{ap} ({W}×{H})',W,H,lg,tam);print(ap,lg,tam,round(time.time()-t0),'s',flush=True)
      json.dump(res,open(OUT+'/resultado.json','w'),ensure_ascii=False)
print('fim',len(res),'telas')
