# S430 · esboço de TUDO o que está aprovado (base) — Hoje (app real) × Com os aprovados, 1 arquivo por tela
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
sys.path.insert(0,'/home/claude/lafouch/work/kit');import base_app
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops
comum.OUT='/home/claude/lafouch/work/s430/r/';os.makedirs(comum.OUT,exist_ok=True);T='/tmp/s430/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
EX=[('inventario',["()=>__LF.inicioGo('estoque')"]),('atacado',["()=>__LF.inicioGo('ata')"]),('despesas',["()=>__LF.inicioGo('desp')"]),('caixa',["()=>__LF.inicioGo('caixa')"]),('cambio',["()=>__LF.inicioGo('fx')"]),('clientes',["()=>__LF.inicioGo('clientes')"])]
TL=EX+list(C)
SO=os.environ.get('SO','').split()
res=[]
with sync_playwright() as pw:
  for k,ps in TL:
    if SO and k not in SO: continue
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[];aa=[]
      for base in (False,True):
        b,pg,w=ap.abre(pw,'inicio',esc,base=base);w(300)
        try: pg.evaluate(LM)
        except Exception: pass
        for x in ps:
          try: pg.evaluate(x)
          except Exception: pass
          w(1000)
        w(600)
        oo.append(olho(pg));aa.append(len(pg.evaluate(A2)));fp=T+'%s_%d_%d.png'%(k,esc,base);pg.screenshot(path=fp,full_page=False);fs.append(fp);b.close()
      d=ImageChops.difference(Image.open(fs[0]).convert('RGB'),Image.open(fs[1]).convert('RGB')).getbbox()
      nv=novos(oo[0],oo[1])
      print(k,tema,'muda' if d else 'igual','olho novos:',nv,'alin hoje/aprovado:',aa,flush=True)
      if d:
        prancha('%s-%s.jpg'%(k,tema),'App · %s · tema %s'%(k,tema),['Hoje: o app real (v561).','Com tudo o que está aprovado e ainda não implementado (base: %d itens).'%len(base_app.ITENS)],*fs)
        res.append((k,tema,nv,aa))
import json;json.dump(res,open(comum.OUT+'res.json','w'))
