# Esboço 38 (S435, 21/11 madrugada; achado na conferência da v586): o aviso curto (#lfToast) cobre a barra de baixo e sai sempre verde.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/aviso/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
PROP=r"""(a)=>{const [tipo,txt]=a;const n=document.getElementById('mainnav').getBoundingClientRect();const t=document.getElementById('lfToast');
 const c={ok:['--okbg','--ok'],warn:['--warnbg','--warn'],bad:['--badbg','--bad'],info:['--panel2','--fg']}[tipo];
 t.style.cssText='bottom:'+(innerHeight-n.top+8)+'px;background:var('+c[0]+');color:var('+c[1]+');border:1px solid color-mix(in srgb,var('+c[1]+') 35%,transparent);font-weight:600;font-size:15px;padding:12px 16px';t.textContent=txt}"""
def tela(pw,esc,f):
  b,pg,w=ap.abre(pw,'desp',esc,'celular',base=True);f(pg,w);w(900)
  p='/tmp/av.png';pg.screenshot(path=p);b.close();im=Image.open(p);return im.crop((0,im.height-560,780,im.height))
with sync_playwright() as pw:
  for esc in (True,False):
    q=[]
    q.append(('HOJE','"Preencha o valor" verde, tampa a barra',tela(pw,esc,lambda pg,w:pg.evaluate("()=>window.__LF.lfToast('Preencha o valor')"))))
    for tipo,txt,s in [('ok','✓ Despesa salva','certo = verde'),('warn','Preencha o valor','atenção = amarelo'),('bad','Não deu para salvar agora','erro = vermelho')]:
      def f(pg,w,tipo=tipo,txt=txt):
        pg.evaluate("()=>window.__LF.lfToast('x')");w(600);pg.evaluate(PROP,[tipo,txt])
      q.append(('PROPOSTA',s+' · acima da barra',tela(pw,esc,f)))
    g=30;W=g+len(q)*(780+g);H=560+130;S=Image.new('RGB',(W,H),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
    fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
    for i,(t,s,im) in enumerate(q):
      x=g+i*(780+g);d.text((x,20),t,font=F(32),fill=fg);d.text((x,64),s,font=F(22),fill=mu);S.paste(im,(x,110));d.rectangle([x-1,109,x+780,110+im.height],outline=(90,90,100))
    n='escuro' if esc else 'claro';S.save(O+'esboco_aviso_curto_%s.jpg'%n,quality=88);print('ok',n,S.size)
