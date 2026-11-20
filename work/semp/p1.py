# Semp · parte 1 — tela do Semp dentro do Marketing (IDEIA, fora da fila). Hoje × Proposta, celular, escuro e claro.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
SV=lambda p:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'
MEGA=SV('<path d="M3 10v4h3l7 5V5L6 10z"></path><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"></path>')
ETQ=SV('<path d="M3 12V4h8l10 10-8 8z"></path><circle cx="7.5" cy="8.5" r="1.5"></circle>')
SAC=SV('<path d="M5 8h14l-1 12H6z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>')
TEND=SV('<path d="M3 17l5-5 4 4 8-9"></path><path d="M15 7h5v5"></path>')
LOJA=SV('<path d="M4 10h16v10H4z"></path><path d="M3 10l2-6h14l2 6"></path><path d="M10 20v-5h4v5"></path>')
JS=r"""(I)=>{const v=document.getElementById('v-mkt');const secs=[...v.querySelectorAll('.mkSec')];
const R=getComputedStyle(secs[0]).color;const sec=t=>secs.find(s=>s.textContent.trim().toUpperCase().startsWith(t));
const tira=(a,b)=>{let e=a;while(e&&e!==b){const n=e.nextElementSibling;e.remove();e=n}};
const linha=(ic,t,s,dir)=>'<div class="mkPi" style="min-height:64px;display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--line2)"><span style="width:22px;flex:none;display:flex;color:'+R+'">'+ic+'</span><button type="button" class="mkPb" style="min-width:0;flex:1;text-align:left"><b style="font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">'+s+'</small></button><span style="color:var(--mute);font-size:18px">'+(dir||'›')+'</span></div>';
const obj=sec('OBJETIVO'),cria=sec('CRIAR');
// 1) Objetivo do mês (4 chips) + Status de hoje SAEM: viram a linha "Foco do mês" e a 1ª sugestão do Semp
const h=document.createElement('div');
h.innerHTML='<div class="mkPi" style="min-height:64px;display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--line2)"><span style="width:40px;height:40px;flex:none;border-radius:50%;background:'+R.replace('rgb','rgba').replace(')',',.14)')+';color:'+R+';display:flex;align-items:center;justify-content:center;font:700 15px/1 inherit">S</span><div style="flex:1;min-width:0"><b style="font-size:16px;font-weight:500;display:block">Semp</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">foco: Mais solar · com o Guardião às 08:00</small></div><span style="color:var(--mute);font-size:18px">⌄</span></div>'+
'<div class="mkSec">O SEMP SUGERE HOJE · 3</div>'+
linha(I.mega,'Postar hoje · 20h','Óculos solar #13 · 31 vendidas em 30 dias')+
linha(I.etq,'Divulgar a oferta','Óculos de leitura #15 · Guardião liberou')+
linha(I.sac,'Comprar · tendência','Solar polarizado · até US$ 6 · 12 un.')+
'<div class="mkSec">TENDÊNCIAS DO MOMENTO</div>'+
linha(I.tend,'Solar','site · vendas · Google · subindo há 3 semanas')+
linha(I.tend,'Leitura +1,50','vendas · o grau que mais sai')+
'<div class="mkSec">DISTRIBUIDORAS</div>'+
linha(I.loja,'2 novidades nesta semana','modelo novo e preço que baixou');
obj.parentNode.insertBefore(h,obj);tira(obj,cria);
// 2) Plano da semana passa a ser feito pelo Semp: mesmo lugar, nome "Agenda da semana"
const pl=sec('PLANO');if(pl)pl.textContent=pl.textContent.replace(/plano da semana/i,'Agenda da semana');
}"""
def tira(pg,nome):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/semp_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f);return im.crop((0,0,780,min(im.height,2600)))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';ims=[]
    for fase in ('hoje','prop'):
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
      if fase=='prop': pg.evaluate(JS,dict(mega=MEGA,etq=ETQ,sac=SAC,tend=TEND,loja=LOJA));w(400)
      ims.append(tira(pg,fase+n));b.close()
    quadro('esboco_semp1_marketing_%s.jpg'%n,esc,[('HOJE · Marketing','objetivo em 4 botões · plano da semana',ims[0]),('PROPOSTA · Marketing com o Semp','o Semp decide e sugere · você toca',ims[1])])
