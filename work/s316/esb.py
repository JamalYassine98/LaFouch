# S316: tela de pagar refeita por inteiro (PIX e transferência do Paraguai) + pedido em Minha conta com "Cancelar" dentro. Publicado hoje × Proposta, telas reais.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s316/';T='/tmp/s316/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read();NOVO=open(OUT+'novo.js').read()
CONTA="""()=>{const b=document.querySelector('[data-id=kitped1]');if(!b)return 'sem cartão';const g=getComputedStyle(b);
  const d=document.createElement('div');d.style.cssText='position:relative;border:'+g.border+';border-radius:'+g.borderRadius+';background:'+g.backgroundColor+';margin:'+g.margin;
  b.style.border='0';b.style.margin='0';b.style.background='none';b.style.width='100%';b.style.paddingBottom='34px';
  b.insertAdjacentHTML('beforeend','<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;margin-left:2px;margin-right:-6px;color:var(--mu)"><path d="M9 5l7 7-7 7"/></svg>');
  const tb=b.querySelector('b');if(tb)tb.style.whiteSpace='nowrap';
  b.replaceWith(d);d.appendChild(b);
  const c=document.createElement('button');c.type='button';c.textContent='Cancelar';c.style.cssText='position:absolute;right:'+g.paddingRight+';bottom:0;min-height:44px;padding:0 0 0 14px;background:none;border:0;color:var(--mu);font:500 13px Inter,system-ui,sans-serif;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;cursor:pointer';d.appendChild(c);return 'ok'}"""
def olho(pg,w,sel):
    r=set()
    for rola in (0,1):
        pg.evaluate("([s,r])=>{const o=document.querySelector(s);if(o)o.scrollTop=r?o.scrollHeight:0}",[sel,rola]);w(350)
        for f in pg.evaluate(OLHO) or []: r.add((('rolado' if rola else 'parado'),f['r'],tuple(f.get('ex') or [])))
    pg.evaluate("s=>{const o=document.querySelector(s);if(o)o.scrollTop=0}",sel);w(250);return r
def tela(pw,kw,conta,prop):
    b,pg,w=base.abre(pw,**kw)
    if conta:
        pg.evaluate("()=>{document.getElementById('pkok').remove();document.documentElement.classList.remove('lock')}")
        pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");w(900)
        pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}");w(900)
    if prop: print('  inj:',pg.evaluate(CONTA if conta else NOVO));w(600)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}');w(300)
    p=T+'t%d.png'%tela.n;tela.n+=1;pg.screenshot(path=p)
    info=pg.evaluate("()=>{const o=document.getElementById('pkok');return o?[o.scrollHeight,o.clientHeight]:null}")
    fl=olho(pg,w,'#layer .panel' if conta else '#pkok');b.close();return p,fl,info
tela.n=0
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
TELAS=[('1-pagar-pix.jpg','Tela de pagar · PIX (refeita)','A ficha da reserva: começa pela peça; o fio dourado da contagem divide o cartão; uma ação cheia.',dict(minutos=2),0),
       ('2-pagar-transferencia.jpg','Tela de pagar · Transferência Paraguai (refeita)','Mesma ficha: dados do Banco Familiar em linhas com "Copiar"; a ação cheia é enviar o comprovante.',dict(minutos=2,pag='alias'),0),
       ('3-minha-conta-pedidos.jpg','Minha conta › Pedidos · pedido ainda não pago','Tocar no pedido leva a pagar; "Cancelar" dentro do pedido, pequeno e na cor do texto.',dict(minutos=2),1)]
with sync_playwright() as pw:
    for nome,tit,sub,kw,conta in TELAS:
        a,fa,_=tela(pw,kw,conta,0);b,fb,inf=tela(pw,kw,conta,1);print(nome,'altura',inf,'novas falhas x hoje:',sorted(fb-fa) or 'nenhuma')
        prancha(nome,tit,sub,[(a,'PUBLICADO HOJE'),(b,'PROPOSTA')])
