import sys,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
BL=[['#v-estoque .fnPn','.sl,.lbl,.hint,.gBtn','aba'],['#v-estoque .detgrid>.col:last-child','.pl.pick,.lbl','graus'],['#lotView>section.card',':scope>div','compra']]
CAS=[('ficha',D['inventario-ficha'],None),('site',D['inventario-ficha']+["()=>{[...document.querySelectorAll('[data-act=fnTab]')].find(x=>x.textContent.trim()=='Site').click()}"],None),
 ('forn',D['inventario-fornecedores'],None),('add',D['inventario-novo'],None),
 ('edit',D['inventario-ficha']+["()=>{const e=[...document.querySelectorAll('[aria-label=Editar]')].find(x=>x.getBoundingClientRect().height);e&&e.click()}"],None)]
with sync_playwright() as pw:
  for nome,ps,_ in CAS:
    for base in (False,True):
      b,pg,w=ap.abre(pw,'inicio',True,base=base);w(400)
      for p in ps: pg.evaluate(p);w(1100)
      w(600);t=time.time();o=comum.olho(pg);al=comum.alin(pg,BL)
      if base: print(nome,'olho novos:',comum.novos(o0,o),'| alin:',len(al),[x['ex'] for x in al][:3]);pg.screenshot(path='/tmp/s420/base_%s.png'%nome)
      else: o0=o
      b.close()
