# S437 — esboços das famílias da S435 no MESMO formato do modelo work/s436/esboco_voltar_* :
# 3 quadros (HOJE · tela | PROPOSTA · tela | IGUAL A: referência), recorte da parte de cima, um arquivo por tela e por tema.
import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
C=dict(C);O='/home/claude/lafouch/work/s437/';T='/tmp/s437/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read();OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
def abre(pw,esc,passos):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True)
  for p in passos:
    try: pg.evaluate(p)
    except Exception as e: print('passo',str(e)[:80])
    w(800)
  return b,pg,w
def foto(pg,ancora,nome):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.evaluate("()=>window.scrollTo(0,0)");pg.wait_for_timeout(300)
  y=pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(x=>x.getBoundingClientRect().height);if(!e)return 0;return e.getBoundingClientRect().top+window.scrollY}",ancora)
  f0=T+nome+'_full.png';pg.screenshot(path=f0,full_page=True)
  im=Image.open(f0);y0=max(0,int((y-110)*2));y0=min(y0,max(0,im.height-800))
  f=T+nome+'.png';im.crop((0,y0,780,y0+800)).save(f);return f
def quadro(arq,esc,q):  # q = [(titulo,sub,png),...]
  ims=[Image.open(p).convert('RGB').crop((0,0,780,800)) for _,_,p in q]
  g=40;W=g+len(ims)*(780+g);S=Image.new('RGB',(W,800+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,((t,s,_),im) in enumerate(zip(q,ims)):
    x=g+i*(780+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,920],outline=(90,90,100))
  S.save(O+arq,quality=90);print('ok',arq)
def caso(nome,tela_t,passos,ancora,js,ref_t,ref_passos,ref_ancora,hoje_s,prop_s,ref_s):
  res={}
  with sync_playwright() as pw:
    for esc in (True,False):
      n='escuro' if esc else 'claro';fs=[]
      for fase in ('hoje','prop'):
        b,pg,w=abre(pw,esc,passos)
        if fase=='prop': pg.evaluate(js);w(400)
        a=set((x['r'],x['ex'][0][:20]) for x in pg.evaluate(A2))
        res[fase+n]=a;fs.append(foto(pg,ancora,'%s_%s_%s'%(nome,fase,n)));b.close()
      b,pg,w=abre(pw,esc,ref_passos);fr=foto(pg,ref_ancora,'%s_ref_%s'%(nome,n));b.close()
      novos=res['prop'+n]-res['hoje'+n]
      print(nome,n,'alinhamento novo:',sorted(novos) or 'nenhum')
      quadro('esboco_%s_%s.jpg'%(nome,n),esc,[('HOJE · '+tela_t,hoje_s,fs[0]),('PROPOSTA · '+tela_t,prop_s,fs[1]),('IGUAL A: '+ref_t,ref_s,fr)])
