# TITAN · explorador (ESBOCO, 24/11/2026; aprovado pelo dono 07:40 — substitui as listas de telas escritas à mão)
# Toca em TUDO sozinho a partir das 5 abas, descobre cada tela, dobra e janela, e em cada uma:
#  · mede a família (familia.py) · testa o voltar (volta ao lugar de antes e a janela fecha)
# Nunca toca em botão que apaga, vende, salva, publica ou manda (lista PERIGO).
# uso: python3 explorador.py [profundidade=2] [cenario=normal|nomes|cheio|vazio|sem_internet]
import sys,os,json,time
ARGV=sys.argv[:]  # o ap.py troca o sys.argv ao ser importado
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap,kit
from playwright.sync_api import sync_playwright
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import familia
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'relatorio');os.makedirs(OUT,exist_ok=True)
PERIGO=r"apag|exclu|remov|lixeira|desfaz|vender ·|^vender$|salvar|retirar|registrar|publicar|mandar|enviar|confirm|sair|pagar|cobrar|imprimir|ligar|desligar|baixar|restaur|voltar no tempo|zerar|limpar|copiar|compartilh|whatsapp|instagram|câmera|camera|foto|gravar|ler haste|escanear|qr|^\+$|^−$|^-$|entrar|conectar"
ESTADO=r"""()=>{const S=__LF.S;const v=document.querySelector('.view:not([hidden])');const IH=innerHeight;
 const jan=[...document.querySelectorAll('body *')].filter(e=>{const c=getComputedStyle(e);if(c.position!='fixed'||c.visibility=='hidden'||+c.opacity<0.05)return false;const r=e.getBoundingClientRect();return r.width>=300&&r.height>=120&&!e.closest('nav,.tabbar,header')});
 const jt=jan.length?(jan[jan.length-1].querySelector('h2,h3,b,strong')||{}).textContent||'janela':'';
 const h=v&&[...v.querySelectorAll('h1')].find(e=>e.getBoundingClientRect().height);
 const ab=v?[...v.querySelectorAll('[aria-expanded=true],.open,.aberto')].length:0;
 const dt=(S.view=='dash')?(S.dTab||''):'';const ts=(S.view=='dash')?(S.tiSet||''):'';
 return [S.view,dt,ts,(S.nvP||[]).join('>'),h?h.textContent.trim().slice(0,24):'',jt.trim().slice(0,24),ab].join('|')}"""
TOQUES=r"""(PER)=>{const re=new RegExp(PER,'i');const raiz=(()=>{const j=[...document.querySelectorAll('body *')].filter(e=>{const c=getComputedStyle(e);if(c.position!='fixed')return false;const r=e.getBoundingClientRect();return r.width>=300&&r.height>=120&&!e.closest('nav,.tabbar,header')}).pop();return j||document.querySelector('.view:not([hidden])')||document.body})();
 const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2&&r.bottom>0&&r.top<innerHeight+2000&&getComputedStyle(e).visibility!='hidden'};
 const out=[],vist=new Set();
 for(const e of raiz.querySelectorAll('button,[data-act],[role=button],a,summary,.ajR,[onclick]')){if(!vis(e)||e.disabled)continue;if(e.parentElement&&e.parentElement.closest('button,[data-act],[role=button],a'))continue;
  const t=(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40),a=e.getAttribute('aria-label')||'',act=e.getAttribute('data-act')||'',id=e.getAttribute('data-id')||'';
  const nome=t||a||act;if(!nome||re.test(nome)||re.test(a)||re.test(act))continue;if(e.closest('nav,.tabbar'))continue;
  const k=[t,a,act,id].join('¦');if(vist.has(k))continue;vist.add(k);out.push(k)}
 return out.slice(0,40)}"""
TOCA=r"""(k)=>{const [t,a,act,id]=k.split('¦');const els=[...document.querySelectorAll('button,[data-act],[role=button],a,summary,.ajR,[onclick]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2});
 const e=els.find(e=>((e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40)==t)&&(e.getAttribute('aria-label')||'')==a&&(e.getAttribute('data-act')||'')==act&&(e.getAttribute('data-id')||'')==id);
 if(!e)return 0;e.scrollIntoView({block:'center'});document.querySelectorAll('[data-tt]').forEach(x=>x.removeAttribute('data-tt'));e.setAttribute('data-tt','1');return 1}"""
ABAS=['Início','Vender','Peças','Dinheiro','Ajustes']
CENARIOS={
 'normal':'',
 'nomes':"()=>{const S=__LF.S;for(const m of [S.pnome,S.pnAuto])if(m)for(const k in m)m[k]=m[k]+' de acetato premium com detalhes dourados';(S.clientes||[]).forEach(c=>{c.nome='Maria Fernanda de los Ángeles González Benítez';c.name=c.nome});__LF.render&&__LF.render()}",
 'vazio':"()=>{const S=__LF.S;S.items=[];S.sales=[];if(S.clientes)S.clientes=[];__LF.render&&__LF.render()}",
 'cheio':"()=>{const S=__LF.S;const b=(S.items||[]).slice();for(let n=0;n<10;n++)b.forEach(i=>S.items.push(Object.assign(JSON.parse(JSON.stringify(i)),{id:(i.id||'x')+'_'+n,ref:(i.ref||'R')+n})));const v=(S.sales||[]).slice();for(let n=0;n<2;n++)v.forEach(s=>S.sales.push(JSON.parse(JSON.stringify(s))));__LF.render&&__LF.render()}",
}
def novo(b,cen,sem_net=False):
  W,H,TQ,dpr=ap.TAM['celular'];c=kit.sim.contexto(b,W,H,toque=TQ,dpr=1,lingua='pt-BR',escuro=True,sem_trabalhador=True)
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
  pg=c.new_page()
  if os.environ.get('TITAN_DATA'):
    import datetime;pg.clock.install(time=datetime.datetime.fromisoformat(os.environ['TITAN_DATA']+'T15:00:00-03:00'))
  pg.goto('http://localhost:%d/index.html#test'%kit.PA);pg.wait_for_function('window.__LF',timeout=10000);pg.wait_for_timeout(600)
  if CENARIOS.get(cen):
    try:pg.evaluate(CENARIOS[cen]);pg.wait_for_timeout(300)
    except Exception as e:print('cenário',cen,'falhou:',str(e)[:80])
  pg.evaluate("()=>{const L=window.__LF;window.__tt=[];if(L&&L.render&&!L.render.__t){const f=L.render;const g=function(){const t=performance.now();const r=f.apply(this,arguments);window.__tt.push(performance.now()-t);return r};g.__t=1;L.render=g}}")
  if sem_net:c.set_offline(True);pg.evaluate("()=>window.dispatchEvent(new Event('offline'))")
  return c,pg
def aba(pg,t):
  ok=pg.evaluate("(t)=>{const b=[...document.querySelectorAll('button,a')].find(e=>{const r=e.getBoundingClientRect();return r.height&&r.top>innerHeight-120&&e.textContent.trim()===t});if(!b)return 0;b.setAttribute('data-tt','1');return 1}",t)
  if ok:pg.locator('[data-tt]').first.click();pg.wait_for_timeout(700)
  return ok
def anda(pg,cam):
  for k in cam:
    if not pg.evaluate(TOCA,k):return False
    try:pg.locator('[data-tt]').first.click(timeout=2500)
    except Exception:return False
    pg.wait_for_timeout(700)
  return True
def explora(prof=2,cen='normal'):
  sem=cen=='sem_internet';cen0='normal' if sem else cen
  R={'cenario':cen,'estados':{},'voltar':[],'erros':[]};t0=time.time()
  with sync_playwright() as pw:
    b=kit.sim.navegador(pw)
    fila=[(a,[]) for a in ABAS];vistos=set()
    while fila and time.time()-t0<int(os.environ.get('TITAN_MAX','480')):
      a,cam=fila.pop(0)
      c,pg=novo(b,cen0,sem)
      try:
        aba(pg,a)
        if not anda(pg,cam):c.close();continue
        est=pg.evaluate(ESTADO)
        if est in vistos:c.close();continue
        vistos.add(est);nome=a+(' › '+' › '.join(k.split('¦')[0] or k.split('¦')[1] or k.split('¦')[2] for k in cam) if cam else '')
        R['estados'][nome]={'estado':est,'familia':pg.evaluate(familia.COLETA),'ms':round(max(pg.evaluate('window.__tt||[]') or [0]))}
        if len(cam)<prof:
          for k in pg.evaluate(TOQUES,PERIGO):fila.append((a,cam+[k]))
        # voltar: do estado atual, um voltar tem de dar o estado de antes (se veio de um toque)
        if cam:
          antes=None
          c2,p2=novo(b,cen0,sem);aba(p2,a);anda(p2,cam[:-1]);antes=p2.evaluate(ESTADO);c2.close()
          pg.evaluate("()=>{setTimeout(()=>history.back(),0)}");pg.wait_for_timeout(900)
          try:depois=pg.evaluate(ESTADO)
          except Exception:depois='SAIU DO APP'
          if depois!=antes and est!=antes:R['voltar'].append({'onde':nome,'antes':antes,'depois':depois})
      except Exception as e:R['erros'].append(str(e)[:120])
      finally:
        try:c.close()
        except Exception:pass
  A=familia.regras({k:v['familia'] for k,v in R['estados'].items()})
  R['achados']={k:v for k,v in A.items() if v}
  rot=cen+('_'+os.environ['TITAN_DATA'] if os.environ.get('TITAN_DATA') else '');R['data']=os.environ.get('TITAN_DATA','hoje')
  json.dump(R,open(os.path.join(OUT,'explorador_%s.json'%rot),'w'),ensure_ascii=False,indent=1)
  lentos=sorted(((v['ms'],k) for k,v in R['estados'].items() if v['ms']>=150),reverse=True);R['lentos']=lentos[:15]
  print('[%s] cenário %s:'%(os.environ.get('TITAN_DATA','hoje'),'%s'%'') if 0 else '',end='');print('cenário %s: %d lugares achados · %d com achados de família · %d voltar errado · %d erros de toque · %d telas lentas (≥150 ms) · %.0fs'%(cen,len(R['estados']),len(R['achados']),len(R['voltar']),len(R['erros']),len(lentos),time.time()-t0))
  return R
if __name__=='__main__':
  explora(int(ARGV[1]) if len(ARGV)>1 else 2,ARGV[2] if len(ARGV)>2 else 'normal')
