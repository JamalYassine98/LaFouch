# S436: confere 149cam-F/M2/X implementados (base=False): Vídeo (padrão) e Foto, deitado e em pé
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/estudio-camera');import cam as C
from playwright.sync_api import sync_playwright
J="""()=>{const o=document.getElementById('estCam');if(!o)return 'sem';const q=s=>{const e=o.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();if(!r.width)return null;return [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]};
return {modo:o.dataset.modo,tela:o.classList.contains('ecPD')?'d':'e',tag:(o.querySelector('.ecTag')||{}).textContent,frase:(o.querySelector('.ecFrase')||{}).textContent,lista:[...o.querySelectorAll('.ecLista span')].map(s=>s.className[0]+':'+s.textContent).join(' | '),
 vf:q('.ecVf'),modoB:q('.ecModo'),rec:q('#ecRec'),sh:q('#ecSh'),gal:q('.ecGal'),x:q('[data-c=x]'),recDis:(o.querySelector('#ecRec')||{}).disabled}}"""
with sync_playwright() as pw:
  for esc in (True,):
    for nome,(W,H) in (('deitado',(844,390)),('empe',(390,844))):
      b,pg=C.abre(pw,W,H,esc,base=False);C.cam(pg);pg.evaluate("()=>{const o=document.getElementById('estCam');o&&o.querySelector('[data-c=x]').click()}");pg.wait_for_timeout(400)
      pg.evaluate("()=>__LF.ACT.estAbre()");pg.wait_for_timeout(800);pg.evaluate("()=>{const b=document.querySelector('[data-e=nova]');b&&b.click()}");pg.wait_for_timeout(3000)
      print(nome,'VIDEO',json.dumps(pg.evaluate(J),ensure_ascii=False))
      pg.screenshot(path='/home/claude/lafouch/work/estudio-camera/implF_%s_video.png'%nome)
      pg.click('.ecModo');pg.wait_for_timeout(1200)
      print(nome,'FOTO',json.dumps(pg.evaluate(J),ensure_ascii=False))
      pg.screenshot(path='/home/claude/lafouch/work/estudio-camera/implF_%s_foto.png'%nome)
      b.close()
