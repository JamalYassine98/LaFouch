# S429 · esboço 140: escolhas (.trk) harmoniosas com o design de luxo — A contorno fino · B linha rosa
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C);comum.OUT='/home/claude/lafouch/work/s429/';T='/tmp/s429/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
OP={
 'C':('suave','.trk{background:color-mix(in srgb,var(--fg) 4%,transparent)!important;border:0!important;border-radius:12px!important;padding:3px!important}.trkTh{background:var(--panel)!important;border-radius:9px!important;box-shadow:0 1px 2px rgba(0,0,0,.18),0 0 0 1px color-mix(in srgb,var(--fg) 6%,transparent)!important}.trkB{border-radius:9px!important;font-size:14px!important;letter-spacing:.2px}.trkB.on{color:var(--fg)!important;font-weight:500!important}',
      'Depois (C): trilho quase invisível, sem contorno; a escolhida é uma placa da cor do cartão, levemente elevada; letra 14 px.'),
 'D':('fio rosa','.trk{background:transparent!important;border:1px solid var(--line)!important;border-radius:14px!important}.trkTh{background:var(--pri-tint)!important;border:1px solid var(--pri-bd)!important;border-radius:11px!important;box-sizing:border-box}.trkB.on{color:var(--fg)!important;font-weight:500!important}',
      'Depois (D): trilho em fio cinza; a escolhida com o mesmo fio rosa suave do botão principal, quase sem cor por dentro.'),
 'E':('palavras','.trk{background:transparent!important;border:0!important;padding:0!important;gap:0!important}.trkTh{display:none!important}.trkB{border-radius:0!important;font-size:15px!important;color:var(--mute)!important}.trkB+.trkB{box-shadow:inset 1px 0 0 var(--line)!important}.trkB.on{color:var(--fg)!important;font-weight:600!important}',
      'Depois (E): só as palavras, separadas por fios verticais; a escolhida fica em letra firme (sem fundo, sem marca).'),
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
        prancha('140%s-%s-%s.jpg'%(op,k,tema),'App · %s · opção %s (%s) · tema %s'%(tit,op,nm,tema),['Hoje: escolha com fundo cinza e marca cinza que desliza.',txt],*fs)
