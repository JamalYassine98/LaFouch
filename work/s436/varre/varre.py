# VARREDURA DO APP REAL (S436, 24/11 — ordem do dono: conferir TUDO o que foi implementado).
# Sem a base de aprovados (base=False), na largura do celular do dono (412) e no estado do dono:
# nuvem ligada, 5 aparelhos, cópia recente. Abre cada tela, cada linha › (um nível) e cada ⌄, mede (work/kit/mede.js) e fotografa.
# uso: python3 varre.py [e|c] [letra 1|1.15|1.3] [filtro]
import sys,os,json,re;ARGV=list(sys.argv)
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit')
import ap,mede
ap.TAM['dono']=(412,915,True,2.625)
from playwright.sync_api import sync_playwright
ESC=(ARGV[1] if len(ARGV)>1 else 'e')=='e';LETRA=float(ARGV[2]) if len(ARGV)>2 else 1;FIL=ARGV[3] if len(ARGV)>3 else ''
O='/home/claude/lafouch/work/s436/varre/%s%s/'%('e' if ESC else 'c',str(LETRA).replace('.',''));os.makedirs(O,exist_ok=True)
DONO="""()=>{const S=window.__LF.S,n=Date.now();S.nuvem=Object.assign({},S.nuvem||{},{rt:'teste',ts:n-6*60e3});S._syncAps=[1,2,3,4,5].map(i=>({ap:'Aparelho '+i,ts:n}));
 S.elog=(S.elog||[]).concat([{ts:n-36*3600e3}]);if(typeof window.__LF.letra==='function')window.__LF.letra(%s);
 document.documentElement.style.setProperty('--lf-zoom','%s');window.__LF.setView(window.__LF.S.view||'inicio');return 1}"""%(LETRA,LETRA)
TELAS=['inicio','vendas','estoque','est','comp','caixa','din','desp','fx','hoje','hist','site','ped','msg','vit','prod','mkt','tem','cup','anl','prec',
 'ti:regras','ti:ofertas','ti:atacado','ti:ferr','ti:hist','cli','ata','ajustes','notif']
PERIGO=re.compile(r'excluir|apagar|cancelar|remover|lixeira|sair|zerar|desfazer|importar|exportar|enviar|publicar|encerrar|soltar|imprimir|fechar o caixa|conferir',re.I)
LUGAR="""()=>{const v=document.querySelector('.view.on,.view.active,.view:not([hidden])');const R=[];
 for(const e of document.querySelectorAll('.view [data-act],.view summary,.view .ajS,.view button')){const r=e.getBoundingClientRect();if(!r.height||e.closest('.ljJn'))continue;
  const t=(e.innerText||'').trim().replace(/\\s+/g,' ');if(!t)continue;R.push(t.slice(0,60))}return [...new Set(R)].slice(0,40)}"""
CLK="""(t)=>{const els=[...document.querySelectorAll('.view [data-act],.view summary,.view .ajS,.view button')].filter(e=>{const r=e.getBoundingClientRect();return r.height>0&&!e.closest('.ljJn')&&(e.innerText||'').trim().replace(/\\s+/g,' ').slice(0,60)===t});if(!els.length)return 0;els[0].scrollIntoView({block:'center'});const r=els[0].getBoundingClientRect();return [r.left+Math.min(r.width/2,40),r.top+r.height/2]}"""
RES={}
import kit
BR=[None]
def abre(pw,t):
  if not BR[0]:BR[0]=kit.sim.navegador(pw)
  c=kit.sim.contexto(BR[0],412,915,toque=True,dpr=2,lingua='pt-BR',escuro=ESC,sem_trabalhador=True)
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  pg=c.new_page();pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(900)
  b=c;w=pg.wait_for_timeout;pg.evaluate(DONO);w(300)
  pg.evaluate("t=>window.__LF.inicioGo(t)",t);w(700);return b,pg,w
def medir(pg,nome):
  ach,onde=mede.percorre(pg);pg.evaluate("scrollTo(0,0)");pg.screenshot(path=O+re.sub(r'[^\w-]+','_',nome)[:80]+'.png')
  RES[nome]=sorted(set(a['regra']+': '+a['d'] for a in ach.values()) if isinstance(ach,dict) else set())
with sync_playwright() as pw:
  for t in TELAS:
    if FIL and FIL not in t:continue
    try:
      b,pg,w=abre(pw,t);medir(pg,t);itens=pg.evaluate(LUGAR);b.close()
      for it in itens:
        if PERIGO.search(it):continue
        b,pg,w=abre(pw,t)
        xy=pg.evaluate(CLK,it)
        if xy:w(300);pg.mouse.click(xy[0],xy[1]);w(900)
        if xy:medir(pg,t+' > '+it)
        b.close()
    except Exception as e:RES[t]=['ERRO '+str(e)[:200]]
json.dump(RES,open(O+'achados.json','w'),ensure_ascii=False,indent=1)
n=sum(len(v) for v in RES.values());print('telas',len(RES),'achados',n)
