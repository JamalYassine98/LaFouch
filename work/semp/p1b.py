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
const L='display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)';
const linha=(ic,t,s,dir)=>'<div style="'+L+'"><span style="width:22px;flex:none;display:flex;color:'+R+'">'+ic+'</span><div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div><span style="color:var(--mute);font-size:18px">'+(dir||'›')+'</span></div>';
const dobra=(t,s)=>'<div style="'+L+'"><div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b>'+(s?'<small style="font-size:13px;color:var(--mute);display:block">'+s+'</small>':'')+'</div><span style="color:var(--mute);font-size:18px">⌄</span></div>';
const tit=t=>'<div class="mkSec" style="margin:32px 0 8px">'+t+'</div>';
// a agenda real do app (mesmos itens), só as 3 primeiras; o resto em "Ver a semana ⌄"
const ag=[...v.querySelectorAll('.mkPi')].slice(0,3).map(e=>e.outerHTML).join('');
const plano=sec('PLANO');const nAg=(plano&&plano.textContent.match(/(\d+)\s*de\s*(\d+)/i))||[0,0,6];
const dts=[...v.querySelectorAll('.mkDt')];
const topo=v.querySelector('.top');
[...v.children].forEach(e=>{if(e!==topo&&!e.contains(topo)&&!topo.contains(e)&&!e.classList.contains('nvVs'))e.remove()});
const box=document.createElement('div');box.innerHTML=
tit('O Semp sugere para hoje · 3')+
linha(I.mega,'Postar às 20h','Óculos solar #13 · 31 vendidas em 30 dias')+
linha(I.etq,'Divulgar a oferta','Óculos de leitura #15 · parado · Guardião ok')+
linha(I.sac,'Comprar a tendência','Solar polarizado · até US$ 6 · Guardião ok')+
tit('Agenda da semana · '+nAg[1]+' de '+nAg[2])+ag+dobra('Ver a semana inteira','mais 3 · datas que vêm aí: Natal em 35 d')+
tit('Tendências')+
linha(I.tend,'Solar','site · vendas · Google · subindo há 3 semanas')+
linha(I.tend,'Leitura +1,50','vendas · o grau que mais sai')+
tit('Distribuidoras')+
linha(I.loja,'2 novidades nesta semana','modelo novo e preço que baixou')+
tit('Mais')+dobra('Foco do mês','Mais solar · o Semp escolheu pelos seus números')+dobra('Criar do zero','post · story · status · carrossel · vídeo · roteiro')+dts.map(d=>dobra(d.querySelector('summary').textContent.trim())).join('');
const wrap=topo.parentNode===v?v:topo.parentNode;wrap.appendChild(box);
}"""
def tira(pg,nome):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/semp_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f);return im.crop((0,0,780,im.height))
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
    quadro('esboco_semp1b_marketing_%s.jpg'%n,esc,[('HOJE · Marketing','objetivo em 4 botões · criar · plano',ims[0]),('PROPOSTA · Marketing = escritório do Semp','ele decide e sugere · você toca',ims[1])])
