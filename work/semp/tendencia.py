# Semp · Mercado › uma tendência (dono 20/11 15:21: "ver como é o modelo e as especificações").
# Como tem foto, especificações e ação própria, vira LUGAR (tela própria, regra 16): a linha do Mercado passa de ⌄ para ›.
# Quadros: 1 Mercado (linha com ›) · 2 tela da tendência (topo) · 3 a mesma tela rolada (quem tem, Guardião, Pedir).
import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
src=open(O+'mercado.py').read()
I=eval(re.search(r'^I=dict\((.*?)\)\n',src,re.S|re.M).group(0)[2:],{'SV':lambda p:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>','dict':dict})
MERC=re.search(r'JS=r"""(.*?)"""',src,re.S).group(1)
SETA=r"""()=>{[...document.querySelectorAll('#v-mkt b')].filter(b=>/^(Solar polarizado|Solar de acetato|Leitura \+1,50)$/.test(b.textContent)).forEach(b=>{const s=b.closest('div[style*="min-height"]').lastElementChild;s.textContent='›'})}"""
TELA=r"""([foto,rolar])=>{const v=document.getElementById('v-mkt');const R=getComputedStyle(v.querySelector('.mkSec')).color;
 const top=v.querySelector('.top');top.querySelector('h1').textContent='Solar polarizado';const cr=v.querySelector('.nvVs');cr.lastChild.textContent='Mercado';
 const L='display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:48px;border-bottom:1px solid var(--line2)';
 const esp=(k,val)=>'<div style="'+L+'"><span style="font-size:15px;color:var(--mute)">'+k+'</span><span style="font-size:15px;font-weight:500;text-align:right">'+val+'</span></div>';
 const lin=(t,s)=>'<div style="min-height:56px;border-bottom:1px solid var(--line2);padding:8px 0"><b style="font-size:15px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></div>';
 const tit=t=>'<div class="mkSec" style="margin:32px 0 8px">'+t+'</div>';
 const fotos='<div style="margin-top:16px;border-radius:16px;overflow:hidden;background:#fff;height:240px;display:flex;align-items:center;justify-content:center"><img src="'+foto+'" style="max-width:90%;max-height:90%;object-fit:contain"></div>'+
  '<div style="display:flex;justify-content:center;gap:8px;margin:12px 0 0">'+[1,0,0].map(o=>'<i style="width:8px;height:8px;border-radius:50%;background:'+(o?R:'var(--line2)')+'"></i>').join('')+'</div>'+
  '<div style="font-size:13px;color:var(--mute);text-align:center;margin-top:8px">3 fotos · do catálogo da distribuidora</div>';
 const box=document.createElement('div');box.innerHTML='<div style="font-size:13px;color:var(--mute);margin:4px 0 0">tendência · subindo há 3 semanas · você não tem</div>'+fotos+
 tit('Especificações')+esp('Formato','Gatinho')+esp('Material','Acetato')+esp('Lente','Polarizada · UV400')+esp('Cores','Preto · Tartaruga · Vinho')+esp('Medidas','52-18-140')+esp('Público','Feminino')+
 tit('Por que é tendência')+lin('Site','18 buscas esta semana · +40%')+lin('Vendas','3 clientes pediram e você não tinha')+lin('Google','subindo há 3 semanas no Paraguai e no Brasil')+
 tit('Quem tem')+lin('Distribuidora do seu cadastro','US$ 4,20 por peça · caixa com 12')+
 tit('O Guardião diz')+lin('Vale comprar até US$ 6','sugestão 10 un. · cabe no caixa e na reserva de repor')+
 '<button type="button" class="go" style="width:100%;margin-top:32px">Pedir à distribuidora</button><div style="font-size:13px;color:var(--mute);text-align:center;margin-top:8px">abre o WhatsApp com a mensagem pronta em espanhol</div>';
 [...v.children].forEach(e=>{if(e!==top&&e!==cr&&!e.contains(top))e.remove()});top.after(box);
 if(rolar){const t=[...v.querySelectorAll('.mkSec')].find(x=>/por que/i.test(x.textContent));window.scrollTo(0,t.getBoundingClientRect().top+scrollY-120)}}"""
def tira(pg,nome,rolar=False):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/td_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f)
  y=int(pg.evaluate("()=>scrollY")*2) if rolar else 0;return im.crop((0,y,780,min(im.height,y+1688)))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(34),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for i,(t,s) in enumerate([('1 · Mercado','a tendência agora leva (›)'),('2 · a tendência','foto e especificações'),('3 · rolando','por quê · quem tem · Guardião · Pedir')]):
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
      ft=pg.evaluate("()=>{const i=document.querySelector('#v-mkt .mkSt img');return i?i.src:''}")
      if i==0: pg.evaluate(MERC,I);pg.evaluate(SETA)
      else: pg.evaluate(TELA,[ft,i==2])
      w(400);q.append((t,s,tira(pg,str(i)+n,i==2)));b.close()
    quadro('esboco_semp_tendencia_%s.jpg'%n,esc,q)
