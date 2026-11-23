# Esboço 80 (S435, 22/11 23:10) — FAMÍLIA "barra de escolha" = UM desenho só (dono 22:58–23:01: "tem vários designs em vez de 1").
# Achado: a barra que o dono achou bonita (Pagamento) é o padrão 140C (aprovado 18/11 19:48: trilho quase invisível, placa escolhida
# levemente elevada, letra 14 px) — está só na BASE de esboço, NÃO implementado: o app de hoje ainda tem a barra com contorno (15 px).
# Inventário 1 (inventario_barras.jpg): 6 peças para a mesma função — .trk · .sg418 · .catbar3 · .catbar3.impSeg · .tmseg · .adSeg · chips (#sortChips/#fFaixas).
# Proposta (inventário 2): TODAS viram .trk no padrão 140C (com o arrasto do trilho, src/98z-trilho-s370.js); saem .sg418, .catbar3, .tmseg,
# .adSeg e os chips como barra. As abas (.lfAbas, Pedidos) são OUTRA família e ficam.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
VIRA=r"""s=>{document.querySelectorAll(s).forEach(e=>{e.className='trk ladosC';e.id=e.id;const bs=[...e.children].filter(b=>b.tagName=='BUTTON');bs.forEach(b=>{b.className='trkB'+(b.classList.contains('on')||b.getAttribute('aria-pressed')=='true'?' on':'');});
  if(!bs.some(b=>b.classList.contains('on'))&&bs[0])bs[0].classList.add('on');const th=document.createElement('span');th.className='trkTh';e.prepend(th);
  let f=14;const cabe=()=>bs.every(b=>b.scrollWidth<=b.clientWidth+1);while(!cabe()&&f>11){f-=.5;bs.forEach(b=>b.style.setProperty('font-size',f+'px','important'))}const o=e.querySelector('.trkB.on');th.style.cssText='width:'+o.offsetWidth+'px!important;transform:none!important;left:'+(o.offsetLeft)+'px!important'})}"""
def corte(pg,sel,pad=70):
  pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getBoundingClientRect().width);e&&e.scrollIntoView({block:'center'})}",sel);pg.wait_for_timeout(500)
  r=pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getBoundingClientRect().width);const r=e.getBoundingClientRect();return [r.y,r.height]}",sel)
  pg.screenshot(path='/tmp/b.png',clip={'x':0,'y':max(0,r[0]-pad),'width':390,'height':r[1]+pad*2});return Image.open('/tmp/b.png').convert('RGB')
def pagamento(pw,esc,base):
  b,pg,w=ap.abre(pw,'vendas',esc,'celular',base=base);w(700)
  pg.evaluate("()=>{const S=window.__LF.S;const it=S.items.filter(i=>i.tipo=='solar'&&i.qty>=3)[0];S.cart=[{it:it,qty:3,id:'c1'}];S.cartOpen=true;S.cartStep='pag';window.__LF.render()}");w(1200)
  if base: pg.evaluate("()=>{document.querySelectorAll('.trk').forEach(t=>{const th=t.querySelector('.trkTh'),o=t.querySelector('.trkB.on');if(th&&o)th.style.cssText='width:'+o.offsetWidth+'px!important;transform:none!important;left:'+o.offsetLeft+'px!important'})}");w(300)
  im=corte(pg,'#moedas',110);b.close();return im
def tema(pw,esc,base):
  b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=base);w(900)
  pg.locator('.ajS[data-k="tema"] .ajR').click();w(900)
  if base: pg.evaluate(VIRA,'.tmseg');w(400)
  im=corte(pg,'#temaCard',20);b.close();return im
def filtros(pw,esc,base):
  b,pg,w=ap.abre(pw,'estoque',esc,'celular',base=base);w(900);pg.evaluate("()=>document.getElementById('btnFilt').click()");w(700)
  if base: pg.evaluate(VIRA,'#sortChips,#fFaixas');w(400)
  im=corte(pg,'#sortChips',150);b.close();return im
def quadro(arq,linhas,esc):
  F=ImageFont.truetype('/tmp/fnt/jost-400.ttf',26);F2=ImageFont.truetype('/tmp/fnt/jost-300.ttf',20)
  W=780;H=sum(max(a.height,p.height)+70 for _,a,p in linhas)+90
  o=Image.new('RGB',(W*2+90,H),(17,20,26) if esc else (247,243,238));d=ImageDraw.Draw(o);fg=(200,200,205) if esc else (60,55,58)
  d.text((30,20),'HOJE (app de hoje)',font=F,fill=fg);d.text((W+60,20),'PROPOSTA · tudo no trilho 140C',font=F,fill=(141,58,105));y=70
  for t,a,p in linhas:
    d.text((30,y),t,font=F2,fill=fg);y+=34
    o.paste(a.resize((W,int(a.height*W/a.width))),(30,y));o.paste(p.resize((W,int(p.height*W/p.width))),(W+60,y));y+=int(max(a.height,p.height)*W/a.width)+36
  o=o.crop((0,0,o.width,y+10));o.save(arq,quality=86);print('ok',arq,o.size)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    quadro('esboco_80_familia_barras_%s.jpg'%n,[('Pagamento · Recebido em (.trk de hoje para 140C)',pagamento(pw,esc,False),pagamento(pw,esc,True)),('Ajustes · Tema (.tmseg para trilho)',tema(pw,esc,False),tema(pw,esc,True)),('Inventário › Filtros · Ordem e Faixa (chips para trilho)',filtros(pw,esc,False),filtros(pw,esc,True))],esc)
