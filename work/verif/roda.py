# Varre todas as telas (celular, claro/escuro) com a base aprovada: olho + alinhamento automático + abas + padrões.
import sys,json,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
V=open('/home/claude/lafouch/work/verif/verif.js').read();AB=open('/home/claude/lafouch/work/kit/abas_dist.js').read();A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
EXTRA=[('clientes',["()=>__LF.setView('clientes')"]),('clientes-novo',["()=>__LF.setView('clientes')","()=>document.querySelector('[data-act=clinovo]').click()"]),
 ('atacado-novo-acesso',["()=>__LF.inicioGo('ata')","()=>{const e=[...document.querySelectorAll('button')].find(x=>/Novo acesso/.test(x.textContent));e&&e.click()}"])]
BL=[['section,.cxSaldo,details,.fnPn',':scope>*','bloco']]
OUT='/tmp/verif/';os.makedirs(OUT,exist_ok=True);R={}
TEMAS=os.environ.get('TEMAS','escuro,claro').split(',')
with sync_playwright() as pw:
  for tema in TEMAS:
    for nome,ps in C+EXTRA:
      b,pg,w=ap.abre(pw,'inicio',tema=='escuro');w(300)
      for p in ps:
        try: pg.evaluate(p)
        except Exception: pass
        w(900)
      w(400)
      try: d=pg.evaluate(V)
      except Exception as e: d={'erro':str(e)[:200]}
      d['olho']=sorted(comum.olho(pg));d['alin']=[(x['r'],x['ex']) for x in pg.evaluate(A2)]
      try: d['abas']=pg.evaluate(AB)
      except Exception: d['abas']=[]
      pg.screenshot(path=OUT+'%s-%s.png'%(tema,nome));R['%s|%s'%(tema,nome)]=d;b.close()
      print(tema,nome,len(d.get('caixas',[])),len(d['olho']),len(d['alin']),flush=True)
json.dump(R,open(OUT+'r_%s.json'%'_'.join(TEMAS),'w'),ensure_ascii=False,indent=0)
