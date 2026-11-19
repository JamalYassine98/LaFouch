# S436: confere o 149cam IMPLEMENTADO (base=False) deitado e em pé, escuro/claro, + Hoje×Implementado ao lado do esboço
import sys;sys.path.insert(0,'/home/claude/lafouch/work/estudio-camera');import cam as C
from playwright.sync_api import sync_playwright
J="""()=>{const o=document.getElementById('estCam');if(!o)return 'sem';const q=s=>{const e=o.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]};
const fora=(a,b)=>!a||!b||a[0]+a[2]<=b[0]||b[0]+b[2]<=a[0]||a[1]+a[3]<=b[1]||b[1]+b[3]<=a[1];
const vf=q('.ecVf'),fr=q('.ecFrase'),tag=q('.ecTag'),x=q('[data-c=x]'),sh=q('.ecSh'),gal=q('.ecGal'),man=q('.ecMan');
return {modo:o.classList.contains('ecPD')?'d':o.classList.contains('ecPE')?'e':'?',vf,fr,tag,x,sh,gal,man,avisoFora:fora(fr,vf),tagFora:o.classList.contains('ecPD')?fora(tag,vf):true,todos:[vf,fr,tag,x,sh,gal,man].every(Boolean)}}"""
with sync_playwright() as pw:
  for esc in (True,False):
    for nome,(W,H) in (('deitado',(844,390)),('empe',(390,844)),('deitado_grande',(915,412)),('empe_grande',(412,915))):
      b,pg=C.abre(pw,W,H,esc,base=False);C.cam(pg)
      r=pg.evaluate(J);print('escuro' if esc else 'claro',nome,r)
      pg.screenshot(path='/home/claude/lafouch/work/estudio-camera/impl_%s_%s.png'%(nome,'escuro' if esc else 'claro'));b.close()
  # gira o celular com a câmera aberta
  b,pg=C.abre(pw,844,390,True,base=False);C.cam(pg);pg.set_viewport_size({'width':390,'height':844});pg.wait_for_timeout(500)
  print('girou ->',pg.evaluate(J)['modo']);b.close()
