# S429 · esboço 141: "+ Receber parte em outra moeda" igual ao grupo dos "+" em texto
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C);comum.OUT='/home/claude/lafouch/work/s429/';T='/tmp/s429/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
CSS='.esTx{color:var(--fg)!important;text-decoration:none!important;font-weight:400!important;font-size:15px!important;padding-left:0!important;padding-right:0!important}'
J="()=>{const g=s=>{const e=[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(s));if(!e)return null;const c=getComputedStyle(e),r=e.getBoundingClientRect();return [c.color,c.textDecorationLine,c.fontWeight,c.fontSize,Math.round(r.left),Math.round(document.querySelector('#payB .lbl,#payB input').getBoundingClientRect().left)]};return g('+ Receber')}"
ps=D['catalogo-pagamento']+["()=>{const e=document.querySelector('.esTx');e&&e.scrollIntoView({block:'center'})}"]
with sync_playwright() as pw:
  for esc,tema in ((True,'escuro'),(False,'claro')):
    fs=[];oo=[];aa=[]
    for prop in (0,1):
      b,pg,w=ap.abre(pw,'inicio',esc);w(300)
      for x in ps:
        try: pg.evaluate(x)
        except Exception: pass
        w(1000)
      if prop: pg.add_style_tag(content=CSS);w(400)
      print(tema,prop,pg.evaluate(J))
      oo.append(olho(pg));aa.append(len(pg.evaluate(A2)));fp=T+'141_%d_%d.png'%(esc,prop);pg.screenshot(path=fp);fs.append(fp)
      if prop:
        pg.evaluate("()=>document.querySelector('.esTx').click()");w(800)
        print('  toque:',pg.evaluate("()=>document.querySelectorAll('#payB input').length"))
      b.close()
    print(tema,'olho novos:',novos(oo[0],oo[1]),'alin:',aa)
    prancha('141-app-pagamento-outra-moeda-%s.jpg'%tema,'App · Pagamento › "+ Receber parte em outra moeda" · tema %s'%tema,
      ['Hoje: cinza e sublinhado — o único do grupo dos "+" em texto assim.','Depois: igual a "+ Adicionar outra peça" e "+ Criar lote": texto branco, sem sublinhado, encostado à esquerda. Função igual (põe mais uma linha de valor ali mesmo).'],*fs)
