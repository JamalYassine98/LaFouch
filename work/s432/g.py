import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s432/';T='/tmp/s432/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read();CSS=open('luxo.css').read();JS=open('luxo.js').read()
t=os.environ['TELA'];ps=dict(C).get(t)
if t=='catalogo-peca-cor': ps=["()=>window.__LF.setView('vendas')","()=>{const e=[...document.querySelectorAll('#vRows .pcard[data-ref]')].filter(x=>x.getBoundingClientRect().height&&/solar #13/i.test(x.textContent))[0];e&&e.click();return !!e}"]
with sync_playwright() as pw:
  fs=[];oo=[];KS=[]
  for prop in (0,1):
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for x in ps:
      try: pg.evaluate(x)
      except Exception: pass
      w(900)
    if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS);w(500)
    oo.append(olho(pg));KS.append(set((x['r'],x['ex'][0]) for x in pg.evaluate(A2)));fp=T+'%s_%d.png'%(t,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
  nov=KS[1]-KS[0];no=novos(oo[0],oo[1])
  print('alin novos',sorted(nov),'olho',no)
  if nov or no!='nenhum': print('BLOQUEADO')
  else: prancha('143-%s-escuro.jpg'%t,'App · %s · padrão de luxo pela CAMADA ÚNICA (mesmas regras para todas as telas)'%t,['Hoje: app real + aprovados.','Depois: só a camada única luxo.css/luxo.js — nenhuma linha escrita para esta tela.'],*fs)
