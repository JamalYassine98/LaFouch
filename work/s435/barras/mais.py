# Esboço 80b (S435, 22/11 23:15) — mais telas no padrão 140C (dono 23:12: "como ficaria mais algumas com esse padrão que eu gostei").
# Telas REAIS: Caixa › Retirar (.sg418) · Câmbio › Registrar troca (.sg418 De/Para) · Ajustes › Impressora (.catbar3.impSeg) ·
# Clientes › novo cliente (.catbar3 Paraguaio | Estrangeiro). Hoje = app de hoje (sem base); Proposta = base aprovada + trilho 140C.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
exec(open('esboco_80.py').read().split("def corte(")[0].split("from PIL import Image,ImageDraw,ImageFont")[1])
_e=open('esboco_80.py').read();exec(_e[_e.index('def quadro('):_e.index('with sync_playwright')])
def vira(pg,sel):
  pg.evaluate(VIRA,sel);pg.wait_for_timeout(400)
def foto(pg,sel,pad=90):
  pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].filter(e=>e.getBoundingClientRect().width).pop();e&&e.scrollIntoView({block:'center'})}",sel);pg.wait_for_timeout(500)
  r=pg.evaluate("s=>{const L=[...document.querySelectorAll(s)].filter(e=>e.getBoundingClientRect().width);if(!L.length)return null;let y0=1e9,y1=0;L.forEach(e=>{const r=e.getBoundingClientRect();y0=Math.min(y0,r.top);y1=Math.max(y1,r.bottom)});return [y0,y1]}",sel)
  if not r: return None
  pg.screenshot(path='/tmp/m.png',clip={'x':0,'y':max(0,r[0]-pad),'width':390,'height':min(844,r[1]-r[0]+pad*2)});return Image.open('/tmp/m.png').convert('RGB')
def retirar(pw,esc,base):
  b,pg,w=ap.abre(pw,'caixa',esc,'celular',base=base);w(800)
  pg.evaluate("()=>{window.__LF.S.cxAcao='ret';window.__LF.render()}");w(1200)
  if base: vira(pg,'.sg418')
  im=foto(pg,'.cxAcao.on .sg418,.cxAcao.on .trk',160);b.close();return im
def troca(pw,esc,base):
  b,pg,w=ap.abre(pw,'fx',esc,'celular',base=base);w(800)
  pg.evaluate("()=>window.__LF.ACT.fjAbre('troca')");w(1200)
  if base: vira(pg,'.sg418')
  im=foto(pg,'.tr418',60);b.close();return im
def impressora(pw,esc,base):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=base);w(900)
  pg.locator('.ajS[data-k="imp"] .ajR').click();w(900)
  if base: vira(pg,'.impSeg')
  im=foto(pg,'.ajS[data-k="imp"] .impSeg,.ajS[data-k="imp"] .trk',120);b.close();return im
def cliente(pw,esc,base):
  b,pg,w=ap.abre(pw,'clientes',esc,'celular',base=base);w(900)
  pg.evaluate("()=>{const b=[...document.querySelectorAll('#v-clientes button')].find(b=>/Novo|novo|\\+/.test(b.textContent+b.getAttribute('aria-label'))&&b.getBoundingClientRect().width);b&&b.click()}");w(1000)
  if base: vira(pg,'.cliNac')
  im=foto(pg,'.cliNac,#cNac',110);b.close();return im
if __name__=='__main__':
 import sys as _s
 with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';L=[]
    for t,f in [('Caixa › Retirar · moeda (.sg418 para trilho)',retirar),('Câmbio › Registrar troca · De e Para (.sg418 para trilho)',troca),('Clientes › novo · Paraguaio | Estrangeiro (.catbar3 para trilho)',cliente)]:
      a=f(pw,esc,False);p=f(pw,esc,True);print(t,a is not None,p is not None)
      if a and p: L.append((t,a,p))
    quadro('esboco_80b_mais_barras_%s.jpg'%n,L,esc)
