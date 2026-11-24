# TITAN · triagem do gabarito (ESBOCO 24/11): para cada item do base_app, aplica SÓ ele no app real e vê se muda alguma peça.
# (corrigido) Os itens dependem uns dos outros, então o teste é 'deixa um de fora': gabarito inteiro × gabarito sem o item.
# Sem diferença → o item não faz nada hoje (o app já tem, ou ficou velho). Com diferença → o item ainda faz falta no app.
import sys,os,json
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,kit,base_app
from playwright.sync_api import sync_playwright
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import compara,roteiro
EXTRA=[('Ficha','estoque',["()=>{const e=[...document.querySelectorAll('.view:not([hidden]) [data-ref]')].find(e=>e.getBoundingClientRect().height>30);e&&e.click()}"]),
 ('Câmbio','inicio',["()=>__LF.inicioGo('fx')"]),('Reservas','inicio',["()=>__LF.inicioGo('res')"]),('Histórico','inicio',["()=>__LF.inicioGo('hist')"]),
 ('Fornecedores','inicio',["()=>__LF.inicioGo('forn')"]),('Lotes','inicio',["()=>__LF.inicioGo('ata')"])]
TELAS=roteiro.TELAS+EXTRA
def abre(b,itens,v,passos):
  W,H,TQ,dpr=ap.TAM['celular'];c=kit.sim.contexto(b,W,H,toque=TQ,dpr=1,lingua='pt-BR',escuro=True,sem_trabalhador=True)
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  if itens:c.add_init_script(base_app.script(itens))
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(700)
  if v!='inicio':pg.evaluate("t=>window.__LF.setView(t)",v);pg.wait_for_timeout(500)
  for js in passos:
    try:pg.evaluate(js)
    except Exception:pass
    pg.wait_for_timeout(1000)
  P=compara.pecas(pg);c.close();return P
R={}
so=sys.argv[1].split(',') if len(sys.argv)>1 else None
with sync_playwright() as pw:
  b=kit.sim.navegador(pw)
  F0='/tmp/triagem_gab.json'
  if os.path.exists(F0):base0=json.load(open(F0))
  else:
    base0={n:abre(b,base_app.ITENS,v,p) for n,v,p in TELAS};json.dump(base0,open(F0,'w'))
  FR=os.path.join(os.path.dirname(os.path.abspath(__file__)),'relatorio','triagem.json')
  if os.path.exists(FR):R=json.load(open(FR))
  for it in base_app.ITENS:
    if so and it['id'] not in so:continue
    if it['id'] in R:continue
    onde={}
    nm=it['nome'].lower();alvo=[t for t in TELAS if t[0].lower() in nm or t[0].lower().rstrip('s') in nm]
    if not alvo:alvo=TELAS
    for n,v,p in alvo:
      D=compara.diferencas(base0[n],abre(b,[x for x in base_app.ITENS if x['id']!=it['id']],v,p))
      if D:onde[n]=len(D)
    R[it['id']]=onde;print(it['id'],'→',onde or 'nada muda',flush=True);json.dump(R,open(FR,'w'),ensure_ascii=False,indent=1)
