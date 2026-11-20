# Semp · setor MERCADO (Marketing › Mercado) — IDEIA, fora da fila (dono 20/11 15:18). Hoje = Marketing (onde não existe) × Proposta.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
SV=lambda p:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'
I=dict(tend=SV('<path d="M3 17l5-5 4 4 8-9"></path><path d="M15 7h5v5"></path>'),loja=SV('<path d="M4 10h16v10H4z"></path><path d="M3 10l2-6h14l2 6"></path><path d="M10 20v-5h4v5"></path>'),
 seta=SV('<path d="M12 5v14M6 13l6 6 6-6"></path>'),comp=SV('<path d="M4 12v7h16v-7"></path><path d="M12 3v12M7 8l5-5 5 5"></path>'))
JS=r"""(I)=>{const v=document.getElementById('v-mkt');const secs=[...v.querySelectorAll('.mkSec')];const R=getComputedStyle(secs[0]).color;
 const top=v.querySelector('.top');top.querySelector('h1').textContent='Mercado';const cr=v.querySelector('.nvVs');
 const L='display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)';
 const lin=(ic,t,s,dir,cor)=>'<div style="'+L+'"><span style="width:22px;flex:none;display:flex;color:'+R+'">'+ic+'</span><div style="min-width:0;flex:1"><b style="font-size:16px;font-weight:500;display:block">'+t+'</b><small style="font-size:13px;color:var(--mute);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></div><span style="flex:none;font-size:'+(dir.length>1?'15px;font-weight:600;color:'+R:'18px;color:var(--mute)')+'">'+dir+'</span></div>';
 const tit=t=>'<div class="mkSec" style="margin:32px 0 8px">'+t+'</div>';
 const box=document.createElement('div');box.innerHTML='<div style="font-size:13px;color:var(--mute);margin:4px 0 0">o Semp olha site, vendas e Google todo dia</div>'+
 tit('Tendências')+
 lin(I.tend,'Solar polarizado','subindo há 3 semanas · você não tem','⌄')+
 lin(I.tend,'Solar de acetato','buscas no site subindo · você tem 2 modelos','⌄')+
 lin(I.tend,'Leitura +1,50','o grau que mais sai · repor logo','⌄')+
 tit('Distribuidoras · 2 novidades')+
 lin(I.loja,'Modelo novo · solar polarizado','US$ 4,20 · o Guardião diz: vale até US$ 6','Pedir')+
 lin(I.seta,'Preço baixou · leitura +1,50','US$ 1,80 → US$ 1,50 · mesma distribuidora','Pedir')+
 tit('Ensinar o Semp')+
 lin(I.comp,'Mandar um catálogo de distribuidora','compartilhe post, lista ou link com o LaFouch','⌄');
 [...v.children].forEach(e=>{if(e!==top&&e!==cr&&!e.contains(top))e.remove()});top.after(box)}"""
def tira(pg,nome):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/me_%s.png'%nome;pg.screenshot(path=f,full_page=True);im=Image.open(f);return im.crop((0,0,780,min(im.height,1900)))
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro';q=[]
    for fase in ('hoje','prop'):
      b,pg,w=ap.abre(pw,'mkt',esc,'celular',base=True)
      if fase=='prop': pg.evaluate(JS,I);w(400)
      q.append(tira(pg,fase+n));b.close()
    quadro('esboco_semp_mercado_%s.jpg'%n,esc,[('HOJE · Marketing','não existe: tendência só no objetivo',q[0]),('PROPOSTA · Marketing › Mercado','tendências + distribuidoras',q[1])])
