# Esboço 48 (S435) — fotos de HOJE: Peças, Inventário, Fornecedores, Lista de compras (celular, escuro, base com os aprovados)
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image
O='/home/claude/lafouch/work/s435/compras/'
SC="""()=>{let best=document.scrollingElement;for(const e of document.querySelectorAll('*')){const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+20&&e.getBoundingClientRect().height>300&&e.scrollHeight>best.scrollHeight-1)best=e}window.__sc=best;return best.scrollHeight}"""
def tira(pw,nome,prep,n=4):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(800)
  for p in (prep if isinstance(prep,list) else [prep]): pg.evaluate(p);w(1500)
  h=pg.evaluate(SC);vh=844;fot=[];y=0
  while y<h and len(fot)<n:
    pg.evaluate(f"window.__sc.scrollTop={y};window.scrollTo(0,{y})");w(350)
    pg.screenshot(path='/tmp/c48.png');fot.append(Image.open('/tmp/c48.png').copy());y+=vh-300
  b.close()
  W=sum(x.width for x in fot)+20*(len(fot)-1);im=Image.new('RGB',(W,fot[0].height),(20,20,24));x=0
  for f in fot: im.paste(f,(x,0));x+=f.width+20
  im.save(O+nome+'.jpg',quality=80);print(nome,h,len(fot))
if __name__=='__main__':
 with sync_playwright() as pw:
  tira(pw,'h0_pecas',"()=>{const g=(__LF.S.grupos||[]).find(x=>x.id=='g:pecas');__LF.S.nvP=['grp:g:pecas'];__LF.S.nvG='g:pecas';__LF.setView('grp')}",1)
  tira(pw,'h1_inventario',"__LF.setView('estoque')",3)
  tira(pw,'h2_fornecedores',"()=>{__LF.S.lotesView=true;__LF.setView('estoque')}",4)
  tira(pw,'h3_lista',"()=>{__LF.inicioGo('repo')}",4)
