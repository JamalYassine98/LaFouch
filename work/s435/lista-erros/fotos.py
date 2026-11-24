# ESBOCO 24/11 — fotos do app REAL (sem base de aprovados, nuvem "ligada" como no aparelho do dono) para a lista de erros × esboços aprovados
import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,mede as M
from playwright.sync_api import sync_playwright
from PIL import Image
NUV="()=>{const S=__LF.S;S.nuvem=Object.assign({},S.nuvem||{},{rt:'teste',u:'dono@lafouch.com',em:'dono@lafouch.com',ok:1});}"
def setor(k): return "()=>{__LF.inicioGo('prec');setTimeout(()=>{const b=document.querySelector('[data-act=tiAbre][data-id=%s]');b&&b.click()},500)}"%k
def ajlin(t): return "()=>{const r=[...document.querySelectorAll('.view:not([hidden]) button,.view:not([hidden]) [data-act]')].find(e=>e.getBoundingClientRect().height&&e.textContent.trim().startsWith('%s'));r&&r.click()}"%t
T=[x for x in [
 ('Início','inicio',None),('Preços','inicio',"()=>__LF.inicioGo('prec')"),('Regras','inicio',setor('regras')),('Ofertas','inicio',setor('ofertas')),
 ('Atacado setor','inicio',setor('atacado')),('Ferramentas','inicio',setor('ferr')),('Pedidos','inicio',"()=>__LF.inicioGo('ped')"),
 ('Ajustes','ajustes',None),('Sons e avisos','ajustes',ajlin('Sons')),('Contas ligadas','ajustes',ajlin('Contas')),('Cópias e nuvem','ajustes',ajlin('Cópias')),('Este aparelho','ajustes',ajlin('Este aparelho')),('Marca','ajustes',ajlin('Marca'))]]
if len(sys.argv)>1: T=[t for t in T if t[0] in sys.argv[1].split(',')]
R={}
with sync_playwright() as pw:
  for esc in (True,False):
    for nome,v,js in T:
      b,pg,w=ap.abre(pw,v,esc,'celular',base=False);w(700);pg.evaluate(NUV);pg.evaluate("()=>__LF.setView(__LF.S.view)");w(500)
      if js:pg.evaluate(js);w(1300)
      a,_=M.percorre(pg,None);R['%s %s'%(nome,'esc' if esc else 'cla')]=[(k[0],x.get('d','')[:100]) for k,x in a.items()]
      pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");w(300)
      f='real_%s_%s.png'%(nome.replace(' ','_'),'esc' if esc else 'cla');pg.screenshot(path=f,full_page=True);b.close()
json.dump(R,open('medidor.json','w'),ensure_ascii=False,indent=1)
for k,v in R.items():
  if v:print(k,v[:6])
print('fim',len(R))
