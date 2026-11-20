# Ajustes organizado (dono 20/11 15:47–15:50: "organizado e bonito"): 3 blocos com título, Marca e Instagram novos,
# estado à direita como hoje, um ícone diferente por linha (Pedidos do site deixa de repetir o globo do Site).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/semp/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
JS=r"""()=>{const g=document.getElementById('ajGrp');const L=k=>g.querySelector('.ajS[data-k="'+k+'"]');
 // Preços fecha (abre no toque, como as outras)
 const pr=L('preco');[...pr.children].forEach(c=>{if(!c.classList.contains('ajR'))c.style.display='none'});
 const R=getComputedStyle(document.querySelector('.mkSec,.lbl,h2')||document.body).color;
 const sv=p=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
 const nova=(k,t,res,ic,seta)=>{const n=L('imp').cloneNode(true);n.dataset.k=k;n.querySelector('b').textContent=t;n.querySelector('.ajRes').textContent=res;n.querySelector('.ajIc').innerHTML=sv(ic);[...n.children].forEach(c=>{if(!c.classList.contains('ajR'))c.remove()});n.querySelector('.ajCh').style.visibility='hidden';return n};
 const marca=nova('marca','Marca','LaFouch · PT e ES','<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"></path>',false);
 const ig=nova('ig','Instagram','Não conectado','<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"></path><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"></path>',false);
 // Pedidos do site: ícone próprio (sacola), o globo fica só no Site
 L('ped').querySelector('.ajIc').innerHTML=sv('<path d="M5 8h14l-1 12H6z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>');
 const tit=t=>{const d=document.createElement('div');d.textContent=t;d.style.cssText='font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-fg,'+R+');margin:32px 0 8px';return d};
 const ordem=[['Loja',[marca,L('site'),L('ped'),L('preco'),L('pauto')]],['Contas ligadas',[ig,L('bk')]],['Este aparelho',[L('imp'),L('tema'),L('seg'),L('av'),L('upd')]]];
 g.innerHTML='';ordem.forEach(([t,ls],i)=>{const h=tit(t);if(i===0)h.style.marginTop='16px';g.appendChild(h);ls.forEach(x=>g.appendChild(x))});
 const sub=document.querySelector('#v-ajustes .top .crumb, #v-ajustes .top div');}"""
def tira(pg,nome):
  pg.add_style_tag(content='#nvBar,#mainnav{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/aj_%s.png'%nome;pg.screenshot(path=f,full_page=True);return Image.open(f).crop((0,0,780,2300))
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
      b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=True)
      if fase=='prop': pg.evaluate(JS);w(400)
      q.append(tira(pg,fase+n));b.close()
    quadro('esboco_ajustes_organizado_%s.jpg'%n,esc,[('HOJE · Ajustes','10 linhas numa lista só',q[0]),('PROPOSTA · Ajustes','3 blocos · Marca e Instagram entram',q[1])])
