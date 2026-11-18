# S429 · esboço 139: escolhas (.trk) harmoniosas com o design de luxo — A contorno fino · B linha rosa
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C);comum.OUT='/home/claude/lafouch/work/s429/';T='/tmp/s429/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
OP={
 'A':('contorno fino','.trk{background:transparent!important;border:1px solid var(--line)!important;border-radius:999px!important}.trkTh{background:transparent!important;border:1px solid var(--sec-bdA)!important;border-radius:999px!important;box-sizing:border-box}.trkB{border-radius:999px!important}.trkB.on{color:var(--fg)!important;font-weight:600!important}',
      'Depois (A): sem fundo cinza; trilho em linha fina e a escolhida com contorno fino, letra mais firme — como os botões secundários.'),
 'B':('linha rosa','.trk{background:transparent!important;border:0!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;padding:0!important}.trkTh{top:auto!important;bottom:-1px!important;height:2px!important;border-radius:2px!important;background:var(--accent-fg,var(--pri))!important}.trkB{border-radius:0!important}.trkB.on{color:var(--fg)!important;font-weight:600!important}',
      'Depois (B): sem fundo nem contorno; só a linha fina embaixo e a linha rosa que desliza sob a escolhida — igual às abas.'),
}
TELAS=[('pagamento','Catálogo › Pagamento',D['catalogo-pagamento']+["()=>{const e=document.getElementById('formaChips');e&&e.scrollIntoView({block:'center'})}"]),
       ('marketing','Marketing › Post',D['marketing-post']+["()=>{const e=document.getElementById('mkVer');e&&e.scrollIntoView({block:'center'})}"])]
with sync_playwright() as pw:
  for k,tit,ps in TELAS:
    for op,(nm,css,txt) in OP.items():
      for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[];aa=[]
        for prop in (0,1):
          b,pg,w=ap.abre(pw,'inicio',esc);w(300)
          for x in ps:
            try: pg.evaluate(x)
            except Exception: pass
            w(1000)
          if prop: pg.add_style_tag(content=css);w(500)
          oo.append(olho(pg));aa.append(len(pg.evaluate(A2)));fp=T+'%s%s_%d_%d.png'%(k,op,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
        print(k,op,tema,'olho novos:',novos(oo[0],oo[1]),'alin:',aa,flush=True)
        prancha('139%s-%s-%s.jpg'%(op,k,tema),'App · %s · opção %s (%s) · tema %s'%(tit,op,nm,tema),['Hoje: escolha com fundo cinza e marca cinza que desliza.',txt],*fs)
