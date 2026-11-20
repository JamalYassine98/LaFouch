# Semp · setor CRIAR (Marketing › Criar) — IDEIA (dono 20/11 15:34). Hoje = 'Criar com um toque' (6 botões no Marketing) × Proposta = tela própria.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
SV=lambda p:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'
I=dict(lista=SV('<path d="M8 6h12M8 12h12M8 18h12"></path><circle cx="4" cy="6" r="1"></circle><circle cx="4" cy="12" r="1"></circle><circle cx="4" cy="18" r="1"></circle>'),post=SV('<rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M4 16l4-4 4 4 3-3 5 5"></path>'),story=SV('<circle cx="12" cy="12" r="9" stroke-dasharray="5 2.6"></circle><circle cx="12" cy="12" r="4.5"></circle>'),
 status=SV('<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.5 12z"></path><path d="M12 8.5V12l2.3 1.4"></path>'),carr=SV('<rect x="2" y="5" width="14" height="14" rx="2"></rect><path d="M19 7v10M22 9v6"></path>'),
 video=SV('<rect x="3" y="5" width="13" height="14" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path>'),rot=SV('<path d="M5 4h14v16H5z"></path><path d="M8 8h8M8 12h8M8 16h5"></path>'))
JS=r"""(I)=>{const v=document.getElementById('v-mkt');const R=getComputedStyle(v.querySelector('.mkSec')).color;
 const top=v.querySelector('.top');top.querySelector('h1').textContent='Criar';const cr=v.querySelector('.nvVs');
 const L='display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)';
 const lin=(ic,t,s)=>'<div style="'+L+'"><span style="width:22px;flex:none;display:flex;color:'+R+'">'+ic+'</span><div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div></div>';
 const box=document.createElement('div');box.innerHTML='<div style="font-size:13px;color:var(--mute);margin:4px 0 0">o Semp escolhe as peças e o texto · você pode trocar</div>'+
 '<div class="mkSec" style="margin:32px 0 8px">Formatos</div>'+
 lin(I.post,'Post','foto 4:5 para o feed · 1 peça')+lin(I.carr,'Carrossel','até 4 peças · desliza para o lado')+
 lin(I.story,'Story','em pé · some em 24 h')+lin(I.status,'Status','WhatsApp · em pé')+
 lin(I.video,'Vídeo','comercial de 15 s · roteiro do Semp')+lin(I.rot,'Roteiro','falas para você gravar · teleprompter')+lin(I.lista,'Listas do WhatsApp','números por perfil para as listas de transmissão');
 [...v.children].forEach(e=>{if(e!==top&&e!==cr&&!e.contains(top))e.remove()});top.after(box)}"""
def tira(pg,nome,y0=0):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/cr_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f);return im.crop((0,y0,780,min(im.height,y0+1500)))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
    y=pg.evaluate("()=>{const s=[...document.querySelectorAll('#v-mkt .mkSec')].find(x=>/criar/i.test(x.textContent));return Math.max(0,(s.getBoundingClientRect().top+scrollY-40)*2)}")
    q.append(tira(pg,'h'+n,int(y)));b.close()
    b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True);pg.evaluate(JS,I);w(300);q.append(tira(pg,'p'+n));b.close()
    quadro('esboco_semp_criar_%s.jpg'%n,esc,[('HOJE · Criar com um toque','6 botões dentro do Marketing',q[0]),('PROPOSTA · Marketing › Criar','6 formatos + Listas do WhatsApp',q[1])])
