# S314: esboço — tela de pagar SEM "Mais opções" (menu de volta, WhatsApp flutuante, cancelar em Minha conta). Um arquivo por tela, Publicado hoje × Proposta, telas reais.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s314/';T='/tmp/s314/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
PAGAR="""()=>{const st=document.createElement('style');st.textContent='body:has(#pkok.py) .top :is(#mnb,#contabtn,#sbtn,#bagbtn){visibility:visible!important}body:has(#pkok.py) a.wa{z-index:10001!important}#pkok.py .tm{max-width:236px;margin-left:auto;margin-right:auto}';document.head.appendChild(st);
  document.documentElement.classList.remove('wamin');const o=document.getElementById('pkok');o.querySelector('.pyX').remove();
  const p=document.createElement('p');p.className='pyh';p.style.cssText='margin:2px auto 0;max-width:236px';p.textContent='Pode pagar depois: o pedido fica em Minha conta.';o.querySelector('#pgcl').after(p);return 'ok'}"""
CONTA="""()=>{const b=document.querySelector('[data-id=kitped1]');if(!b)return 'sem cartão';const g=getComputedStyle(b);
  const d=document.createElement('div');d.className=b.className;d.style.cssText='display:block;text-align:left;cursor:default;padding:'+g.padding+';width:100%;box-sizing:border-box';
  const topo=document.createElement('div');topo.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px';while(b.firstChild)topo.appendChild(b.firstChild);
  const ac=document.createElement('div');ac.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:4px;border-top:1px solid var(--ln)';
  ac.innerHTML='<button type="button" style="min-height:46px;padding:0 2px;background:none;border:0;color:var(--ac);font:700 14.5px Inter,system-ui,sans-serif;cursor:pointer">Pagar agora ›</button><button type="button" style="min-height:46px;padding:0 2px;background:none;border:0;color:#c0392b;font:600 14px Inter,system-ui,sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer">Cancelar pedido</button>';
  d.append(topo,ac);b.replaceWith(d);return 'ok'}"""
def olho(pg,w,sel):
    r=set()
    for rola in (0,1):
        pg.evaluate("([s,r])=>{const o=document.querySelector(s);if(o)o.scrollTop=r?o.scrollHeight:0}",[sel,rola]);w(350)
        for f in pg.evaluate(OLHO) or []: r.add((('rolado' if rola else 'parado'),f['r'],tuple(f.get('ex') or [])))
    pg.evaluate("s=>{const o=document.querySelector(s);if(o)o.scrollTop=0}",sel);w(250);return r
def tela(pw,qual,prop):
    b,pg,w=base.abre(pw,minutos=2)
    if qual=='conta':
        pg.evaluate("()=>{document.getElementById('pkok').remove();document.documentElement.classList.remove('lock')}")
        pg.evaluate("(document.querySelector('#contabtn')||{click(){}}).click()");w(900)
        pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [data-mct]')].find(b=>/Pedidos/i.test(b.innerText||''));t&&t.click()}");w(900)
    if prop: print('  inj:',pg.evaluate(PAGAR if qual=='pagar' else CONTA));w(500)
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}');w(300)
    p=T+'%s_%d.png'%(qual,prop);pg.screenshot(path=p)
    fl=olho(pg,w,'#pkok' if qual=='pagar' else '#layer .panel');b.close();return p,fl
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=86);print(' ',nome)
with sync_playwright() as pw:
    for qual,nome,tit,sub in (('pagar','1-pagar.jpg','Tela de pagar (PIX) · celular','Menu de volta, sem "Mais opções"; ajuda pelo WhatsApp flutuante; cancelar vai para Minha conta.'),
                              ('conta','2-minha-conta-pedidos.jpg','Minha conta › Pedidos · pedido ainda não pago','O pedido que espera pagamento ganha "Pagar agora" e "Cancelar pedido".')):
        a,fa=tela(pw,qual,0);b,fb=tela(pw,qual,1);print(qual,'novas falhas x hoje:',sorted(fb-fa) or 'nenhuma')
        prancha(nome,tit,sub,[(a,'PUBLICADO HOJE'),(b,'PROPOSTA')])
