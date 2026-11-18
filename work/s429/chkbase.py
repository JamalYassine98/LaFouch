import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from comum import olho
from playwright.sync_api import sync_playwright
D=dict(C)
J="()=>[...document.querySelectorAll('.trk')].filter(e=>e.getBoundingClientRect().height).map(e=>{const t=e.querySelector('.trkTh'),o=e.querySelector('.trkB.on');const a=t&&t.getBoundingClientRect(),b=o&&o.getBoundingClientRect();return [e.className.slice(0,30),getComputedStyle(e).backgroundColor,a&&b?Math.round(a.left-b.left)+'/'+Math.round(a.width-b.width):'sem']})"
with sync_playwright() as pw:
  for t in ['catalogo-pagamento','clientes-novo','caixa-retirar','reservas-30dias','marketing-post']:
    for esc in (True,False):
      b,pg,w=ap.abre(pw,'inicio',esc);w(300)
      for x in D[t]:
        try: pg.evaluate(x)
        except Exception: pass
        w(900)
      w(500);r=pg.evaluate(J)
      # toque na 2a opção da 1a escolha e confere a marca
      ok=pg.evaluate("()=>{const e=[...document.querySelectorAll('.trk')].find(e=>e.getBoundingClientRect().height);if(!e)return 'nenhuma';const bs=[...e.querySelectorAll('.trkB')];const b=bs[1];b.click();return 1}");w(700)
      r2=pg.evaluate(J)
      pg.screenshot(path='/tmp/s429/base_%s_%d.png'%(t,esc))
      print(t,esc,r,'| depois do toque:',r2[:1]);b.close()
