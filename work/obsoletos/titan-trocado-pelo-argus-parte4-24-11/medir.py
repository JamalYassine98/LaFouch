# TITAN · roda o medidor de família no app REAL (sem gabarito) nas telas do roteiro + janelas
import sys,os,json
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,kit
from playwright.sync_api import sync_playwright
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import familia,roteiro
CHEGOU="()=>{const e=document.getElementById('addFromNota')||[...document.querySelectorAll('button,[data-act]')].find(b=>b.getBoundingClientRect().height&&b.textContent.trim().startsWith('Chegou mercadoria'));e&&e.click()}"
PECA="()=>{const e=[...document.querySelectorAll('.view:not([hidden]) [data-ref],.view:not([hidden]) .pcCard')].find(e=>e.getBoundingClientRect().height>60);e&&e.click()}"
POWER="()=>{const b=[...document.querySelectorAll('.view:not([hidden]) button')].find(b=>{const r=b.getBoundingClientRect();return r.height&&r.top<220&&r.left>300});b&&b.click()}"
TELAS=roteiro.TELAS+[('Chegou mercadoria','estoque',[roteiro.ADD,CHEGOU]),('Peça do Catálogo','vendas',[PECA]),('Preços ⏻','inicio',["()=>__LF.inicioGo('prec')",POWER]),
 ('Histórico','inicio',["()=>__LF.inicioGo('hist')"]),('Reservas','inicio',["()=>__LF.inicioGo('res')"]),('Câmbio','inicio',["()=>__LF.inicioGo('fx')"])]
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'relatorio')
def coleta(b,v,passos,esc=True):
  W,H,TQ,dpr=ap.TAM['celular'];c=kit.sim.contexto(b,W,H,toque=TQ,dpr=1,lingua='pt-BR',escuro=esc,sem_trabalhador=True)
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(700)
  if v!='inicio':pg.evaluate("t=>window.__LF.setView(t)",v);pg.wait_for_timeout(500)
  for js in passos:
    try:pg.evaluate(js)
    except Exception:pass
    pg.wait_for_timeout(1100)
  pg.evaluate("()=>{const S=__LF.S;S.nuvem=Object.assign({},S.nuvem||{},{rt:'teste',ok:1})}")
  d=pg.evaluate(familia.COLETA);c.close();return d
if __name__=='__main__':
  with sync_playwright() as pw:
    b=kit.sim.navegador(pw);T={n:coleta(b,v,p) for n,v,p in TELAS}
  json.dump(T,open('/tmp/familia_coleta.json','w'))
  A=familia.regras(T);json.dump(A,open(os.path.join(OUT,'familia.json'),'w'),ensure_ascii=False,indent=1)
  for k,v in A.items():
    print('== %s (%d)'%(k,len(v)))
    for r,d,t in v[:12]:print('   ·',r,'|',d[:110],'|',t[:30])
