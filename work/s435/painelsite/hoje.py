# Estudo 47 (S435): fotos de HOJE de todo o painel do Site (família Site) — celular, escuro, base com os aprovados
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/work/s435/painelsite');import abre
from playwright.sync_api import sync_playwright
from PIL import Image
O='/home/claude/lafouch/work/s435/painelsite/'
def tira(pw,v,nome,prep=None):
  b,pg,w=abre.abre(pw);w(900)
  if prep: pg.evaluate(prep);w(4500)
  # altura total da tela que rola
  h=pg.evaluate("""()=>{let best=document.scrollingElement;for(const e of document.querySelectorAll('*')){const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+20&&e.getBoundingClientRect().height>300&&e.scrollHeight>best.scrollHeight-1)best=e}window.__sc=best;return best.scrollHeight}""")
  fr=[f for f in pg.frames if 'lafouch.com' in f.url]
  if fr:
    fr=fr[0];h=fr.evaluate("""()=>{let best=document.scrollingElement;for(const e of document.querySelectorAll('*')){const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+20&&e.offsetParent&&e.scrollHeight>best.scrollHeight-1)best=e}window.__sc=best;return best.scrollHeight}""")
  else: fr=pg
  vh=pg.viewport_size['height'];fot=[];y=0
  while y<h and len(fot)<5:
    fr.evaluate(f"window.__sc.scrollTop={y};window.scrollTo(0,{y})");w(300)
    f=f'/tmp/p47_{len(fot)}.png';pg.screenshot(path=f);fot.append(Image.open(f).copy());y+=vh-300
  b.close()
  W=sum(x.width for x in fot)+20*(len(fot)-1);im=Image.new('RGB',(W,fot[0].height),(20,20,24));x=0
  for f in fot: im.paste(f,(x,0));x+=f.width+20
  im.save(O+nome+'.jpg',quality=80);print(nome,h,len(fot))
with sync_playwright() as pw:
  for i,n in [('g:site','h0_familia'),('site','h1_resumo'),('ped','h2_pedidos'),('msg','h3_mensagens'),('vit','h4_vitrine'),('prod','h5_modelos'),('pre','h6_pre'),('cfg','h7_cfg'),('anl','h8_anl'),('tem','h9_tem')]:
    try: tira(pw,'inicio',n,prep="__LF.inicioGo('%s')"%i)
    except Exception as e: print(n,'ERRO',str(e)[:200])
