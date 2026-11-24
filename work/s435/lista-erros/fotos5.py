# ESBOCO 24/11 — Parte 4 (Vender e Clientes): app real v640, nuvem ligada, toques de verdade
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
src=open('fotos2.py').read();exec(src[src.index('NUV='):src.index('CAM=')])
src3=open('fotos3.py').read();exec(src3[src3.index('def aba'):src3.index('CAM=[')])
def peca(pg):
  ok=pg.evaluate("()=>{const e=[...document.querySelectorAll('.view:not([hidden]) [data-ref],.view:not([hidden]) [data-act=vdPeca],.view:not([hidden]) .pcCard')].find(e=>e.getBoundingClientRect().height>60);if(!e)return 0;e.setAttribute('data-esb4','1');return 1}")
  if ok:pg.locator('[data-esb4]').first.click()
  return ok
CAM=[('Site',[('toca','Site')]),('Pedidos',[('toca','Site'),('toca','Pedidos')]),('Marketing',[('toca','Marketing')]),('Marketing grupo',[('toca','Marketing'),('seta',0)]),('Atacado',[('toca','Atacado')]),('Atacado orçamento',[('toca','Atacado'),('primeiro',0)])]
with sync_playwright() as pw:
  for esc in (True,False):
    for nome,passos in CAM:
      b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(700);pg.evaluate(NUV);log=[]
      for k,a in passos:
        if k=='aba':aba(pg,a);r=1
        elif k=='peca':r=peca(pg)
        elif k=='go':r=pg.evaluate("(v)=>{__LF.setView(v);return 1}",a)
        elif k=='primeiro':
          r=pg.evaluate("()=>{const e=[...document.querySelectorAll('.view:not([hidden]) button,.view:not([hidden]) [data-act]')].filter(e=>e.getBoundingClientRect().height>40&&/›\\s*$/.test(e.textContent.trim()))[0];if(!e)return 0;e.setAttribute('data-esb4','1');return 1}")
          if r:pg.locator('[data-esb4]').first.click()
        elif k=='seta':
          r=pg.evaluate("()=>{const b=[...document.querySelectorAll('.view:not([hidden]) [data-act=nvVolta]')].find(e=>e.getBoundingClientRect().height);if(!b)return 0;b.setAttribute('data-esb5','1');return 1}")
          if r:pg.locator('[data-esb5]').first.click()
        else:r=toca(pg,a)
        log.append((k,a,r));w(1200)
      pg.screenshot(path='p5_%s_%s.png'%(nome.replace(' ','_'),'esc' if esc else 'cla'),full_page=True)
      if esc:print(nome,log,pg.evaluate("()=>[...document.querySelectorAll('.view:not([hidden]) button,.view:not([hidden]) [data-act]')].filter(b=>b.getBoundingClientRect().height).map(b=>b.textContent.trim().replace(/\\s+/g,' ').slice(0,30)).filter(Boolean).slice(0,14)"))
      b.close()
