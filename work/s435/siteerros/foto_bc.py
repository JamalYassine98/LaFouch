from hoje import *
import mede as M
def foto(pw,w,h,y,out,css=None):
    b,pg=abre(pw,w,h,True,'Peça')
    if css: pg.add_style_tag(content=css);pg.wait_for_timeout(300)
    pg.evaluate(M.ROLAVEIS);M.vai_para(pg,2,y);pg.wait_for_timeout(900)
    info=pg.evaluate("""()=>{const q=s=>[...document.querySelectorAll(s)].filter(e=>e.offsetParent||getComputedStyle(e).position=='fixed');
      const f=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return [e.tagName,e.className,e.id,r.x|0,r.y|0,r.width|0,r.height|0,c.position,c.zIndex,c.top]};
      const a=[...document.querySelectorAll('span')].filter(e=>e.textContent.trim()=='Armações'&&e.getBoundingClientRect().width).map(e=>[f(e),f(e.parentNode),f(e.parentNode.parentNode)]);
      const t=[...document.querySelectorAll('span')].filter(e=>e.textContent.trim()=='Total'&&e.getBoundingClientRect().width).map(e=>[f(e),f(e.parentNode),f(e.parentNode.parentNode)]);
      const fav=[...document.querySelectorAll('button[aria-label=Favoritar]')].map(e=>[f(e),f(e.parentNode)]);
      const bf=[...document.querySelectorAll('div')].filter(e=>/^⚡/.test(e.textContent.trim())&&e.children.length<3).map(e=>[f(e),f(e.parentNode)]);
      return {a,t,fav:fav.slice(0,2),bf:bf.slice(0,2)}}""")
    pg.screenshot(path=out);b.close();return info
if __name__=='__main__':
  import json
  with sync_playwright() as pw:
    print(json.dumps(foto(pw,844,390,1400,'b_hoje.png'),ensure_ascii=False)[:2500])
    print(json.dumps(foto(pw,1024,768,430,'c_hoje.png'),ensure_ascii=False)[:2500])
