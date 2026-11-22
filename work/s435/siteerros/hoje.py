import sys;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador')
import kit,sim,roteiro_site as RS
from playwright.sync_api import sync_playwright
kit.prep_site();kit.serve(kit.SITE,kit.PS);U='http://localhost:%d'%kit.PS
def abre(pw,w,h,mob,tela):
  b=sim.navegador(pw);c=sim.contexto(b,w,h,toque=mob,movimento=False,csp_livre=False,camera=True)
  c.add_init_script(RS.__dict__.get('INIT',"try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"))
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}")
  c.route('**cloudfunctions.net/**',lambda r:r.fulfill(status=200,content_type='application/json',body=RS.NUVEM))
  pg=c.new_page();RS.vai(pg,U,[t for t in RS.TELAS if t['nome']==tela][0]);return b,pg
if __name__=='__main__':
 with sync_playwright() as pw:
  for nome,(w,h,mob,tela) in {'a_inicio':(768,1024,True,'Início'),'a_menu':(768,1024,True,'Menu'),'d_comparar':(386,858,True,'Comparar'),'b_peca':(844,390,True,'Peça'),'c_peca':(1024,768,True,'Peça')}.items():
    b,pg=abre(pw,w,h,mob,tela)
    if nome in('b_peca','c_peca'):
      pg.evaluate("()=>{const L=document.querySelector('#layer');const e=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)&&e.offsetParent);e.forEach(x=>x.scrollTop=400)}");pg.wait_for_timeout(1200)
    pg.screenshot(path=nome+'.png');b.close();print(nome)
