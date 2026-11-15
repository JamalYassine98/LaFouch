# S315: esboço de TUDO (pedido do dono, 14/11 22:35): voltar no padrão do site ("‹ Minha conta", igual ao "‹ Início" da página da peça), sem "Mais opções",
# ajuda em link fino dentro da tela, pedido tocável com "›" e "Cancelar" mínimo em Minha conta. Um arquivo por tela, Publicado hoje × Proposta, telas reais.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s315/';T='/tmp/s315/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
PY="""()=>{const o=document.getElementById('pkok');if(!o)return 'sem tela';
  const top=document.querySelector('.top').getBoundingClientRect().bottom;
  const st=document.createElement('style');st.textContent='#s15b{position:fixed;left:0;right:0;z-index:10000;display:flex;align-items:center;padding:12px 16px 12px 14px;background:var(--bg);border-bottom:1px solid var(--ln);box-sizing:border-box}#s15b{zoom:calc(1/var(--z,1))}#s15b button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:10px 6px 10px 2px;background:none;border:0;border-radius:10px;color:var(--ac);font:600 16px Inter,system-ui,sans-serif;cursor:pointer}#pkok.py .tm{margin-top:10px}#pkok.py .cdx{margin-bottom:12px}#pkok.py .pgau{margin:12px auto 0}#pkok.py h2{margin-bottom:4px}#pkok .pyq .pgq svg{width:120px!important;height:120px!important}#pkok .pyc{padding:18px 20px 16px;gap:10px}';document.head.appendChild(st);
  const b=document.createElement('div');b.id='s15b';b.style.top=top+'px';b.innerHTML='<button type="button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span>Minha conta</span></button>';document.body.appendChild(b);
  o.style.paddingTop=(parseFloat(getComputedStyle(o).paddingTop)+b.getBoundingClientRect().height-6)+'px';
  const x=o.querySelector('.pyX');if(x)x.remove();
  const cl=o.querySelector('#pgcl');if(cl){const a=document.createElement('a');a.className='pyL s';a.href='#';a.textContent='Precisa de ajuda? Fale com a loja';a.style.marginTop='0';cl.after(a)}
  return 'ok'}"""
CONTA="""()=>{const b=document.querySelector('[data-id=kitped1]');if(!b)return 'sem cartão';
  b.insertAdjacentHTML('beforeend','<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;margin-left:2px;margin-right:-6px;color:var(--mu)"><path d="M9 5l7 7-7 7"/></svg>');const tb=b.querySelector('b');if(tb)tb.style.whiteSpace='nowrap';
  const d=document.createElement('div');d.style.cssText='display:flex;justify-content:flex-end;margin:-2px 0 6px';
  d.innerHTML='<button type="button" style="min-height:44px;padding:0 6px;background:none;border:0;color:var(--mu);font:500 13px Inter,system-ui,sans-serif;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;cursor:pointer">Cancelar</button>';b.after(d);return 'ok'}"""
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
    if prop: print('  inj:',pg.evaluate(CONTA if conta else PY));w(500)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}');w(300)
    p=T+'t%d.png'%tela.n;tela.n+=1;pg.screenshot(path=p)
    fl=olho(pg,w,'#layer .panel' if conta else '#pkok');b.close();return p,fl
tela.n=0
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=86);print(' ',nome)
TELAS=[('1-pagar-pix.jpg','Tela de pagar · PIX','"‹ Minha conta" no padrão do voltar do site; sem "Mais opções"; ajuda em link fino.',dict(minutos=2),0),
       ('2-pagar-transferencia.jpg','Tela de pagar · Transferência','O mesmo padrão na transferência do Banco Familiar.',dict(minutos=2,pag='alias'),0),
       ('3-reserva-encerrada.jpg','Reserva encerrada','Só ganha o voltar padrão; o resto fica como está publicado.',dict(minutos=31),0),
       ('4-comprovante-enviado.jpg','Comprovante enviado','Só ganha o voltar padrão; o resto fica como está publicado.',dict(minutos=2,comp=True),0),
       ('5-minha-conta-pedidos.jpg','Minha conta › Pedidos · pedido ainda não pago','Tocar no pedido leva a pagar (como hoje) e ganha "›"; "Cancelar" mínimo, fora da área de toque do pedido.',dict(minutos=2),1)]
with sync_playwright() as pw:
    for nome,tit,sub,kw,conta in TELAS:
        a,fa=tela(pw,kw,conta,0);b,fb=tela(pw,kw,conta,1);print(nome,'novas falhas x hoje:',sorted(fb-fa) or 'nenhuma')
        prancha(nome,tit,sub,[(a,'PUBLICADO HOJE'),(b,'PROPOSTA')])
