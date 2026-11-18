# S380: prints dos textos cortados/espremidos (dono 17/11 22:31 "Quero ver quais estão cortados"), com contorno vermelho no lugar.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
PED="const its=S.items.filter(i=>i.qty>0&&!i.bulk);S.pedidos.push({id:903,num:903,sid:'s903',cli:'Maria Fernanda Benítez',tel:'0981000903',st:'sep',pg:'pago',tok:'LF-ABCD',ts:Date.now()-50*60000,itens:[{t:its[0].ref,q:1,p:250000,ref:its[0].ref}],orig:'site',cod:'AB903',pag:'pix',total:250000,ent:'loja'},{id:901,num:901,sid:'s901',cli:'Maria Fernanda Benítez',tel:'0981000901',st:'novo',pg:'pagar',ts:Date.now()-55*60000,itens:[{t:its[0].ref,q:1,p:250000,ref:its[0].ref}],orig:'site',cod:'AB901',pag:'pix',total:250000,ent:'loja'});S.syncOn=true;S.nuvem={email:'x@y.com',rt:'r',ts:Date.now()};"
C=[
 ('1','Pedidos online · lista','Nome da cliente cortado ("Maria F…") com espaço sobrando',"()=>{const L=window.__LF,S=L.S;"+PED+"S.pedF='novo';L.setView('ped')}",None,"Maria F"),
 ('2','Pedido aberto (pago, separando)','"Assumir este pedido" e "Imprimir ficha de separação" espremidos em 3 linhas',"()=>{const L=window.__LF,S=L.S;"+PED+"L.setView('ped');setTimeout(()=>L.ACT.pedab(903),500)}",None,"Imprimir ficha|Assumir este"),
 ('3','Pedido aberto (não pago)','"Marcar como pago" espremido em 3 linhas',"()=>{const L=window.__LF,S=L.S;"+PED+"L.setView('ped');setTimeout(()=>L.ACT.pedab(901),500)}",None,"Marcar como pago"),
 ('4','Peças › Filtros e ordem','"Intermediário" cortado com reticências',"()=>{const L=window.__LF;L.setView('estoque');setTimeout(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Filtros/i.test((x.getAttribute('aria-label')||'')+x.innerText)&&x.getBoundingClientRect().height);b&&b.click()},600)}",None,"Intermedi"),
 ('5','Clientes','Nome na letra de título e o selo "SITE" minúsculo',"()=>{const L=window.__LF,S=L.S;"+PED+"L.setView('clientes')}",None,"SITE"),
 ('6','Ficha da peça › Ficha 4/6','"Enviar no WhatsApp" quebra em 2 linhas',"()=>{const L=window.__LF;L.setView('estoque');setTimeout(()=>{document.querySelector('#v-estoque .pcard[data-ref]').click();setTimeout(()=>{const b=[...document.querySelectorAll('button')].find(x=>/^Ficha/.test(x.innerText.trim())&&x.getBoundingClientRect().height);b&&b.click()},900)},600)}",None,"Enviar no WhatsApp"),
 ('7','Ficha da peça › % Oferta','"TERMINA EM (OPCIONAL)" com letra menor que 11 px',"()=>{const L=window.__LF;L.setView('estoque');setTimeout(()=>{document.querySelector('#v-estoque .pcard[data-ref]').click();setTimeout(()=>{const b=[...document.querySelectorAll('button')].find(x=>/% Oferta/.test(x.innerText)&&x.getBoundingClientRect().height);b&&b.click()},900)},600)}",None,"TERMINA EM"),
 ('8','Inventário · cartões','"Código SP57765" com letra menor que 11 px',"()=>{const L=window.__LF;L.setView('estoque')}",None,"Código SP"),
]
with sync_playwright() as pw:
  for n,tela,txt,js,_,alvo in C:
    b,pg,w=ap.abre(pw,'inicio',True);w(400)
    pg.evaluate(js);w(2200)
    r=pg.evaluate("""(a)=>{const re=new RegExp(a);const els=[...document.querySelectorAll('button,small,span,b,div,label,em,i,p')].filter(e=>e.getBoundingClientRect().height>2&&re.test(e.textContent)&&![...e.children].some(c=>re.test(c.textContent)));if(!els.length)return null;
      els[0].scrollIntoView({block:'center'});return els.slice(0,3).map(e=>{const q=e.getBoundingClientRect();return [q.left,q.top,q.right,q.bottom]})}""",alvo);w(400)
    if r: r=pg.evaluate("""(a)=>{const re=new RegExp(a);const els=[...document.querySelectorAll('button,small,span,b,div,label,em,i,p')].filter(e=>e.getBoundingClientRect().height>2&&re.test(e.textContent)&&![...e.children].some(c=>re.test(c.textContent)));return els.slice(0,3).map(e=>{const q=e.getBoundingClientRect();return [q.left,q.top,q.right,q.bottom]})}""",alvo)
    fp='/tmp/s380_%s.png'%n;pg.screenshot(path=fp);b.close()
    im=Image.open(fp).convert('RGB');d=ImageDraw.Draw(im);k=im.width/390
    for x0,y0,x1,y1 in (r or []): d.rounded_rectangle([x0*k-6,y0*k-6,x1*k+6,y1*k+6],radius=12,outline='#ff3b30',width=5)
    H=150;out=Image.new('RGB',(im.width,im.height+H),'#f1eef0');out.paste(im,(0,H));dd=ImageDraw.Draw(out)
    dd.text((28,24),'%s. %s'%(n,tela),font=F(34,True),fill='#1d1418');dd.text((28,82),txt,font=F(24),fill='#55484f')
    out.thumbnail((700,1600));out.save('/home/claude/lafouch/work/s380/cortado-%s.jpg'%n,quality=85);print(n,'achou' if r else 'NÃO ACHOU',len(r or []))
