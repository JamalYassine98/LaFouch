# S314: esboço — tela de pagar SEM "Mais opções" (menu de volta, WhatsApp flutuante, cancelar em Minha conta). Um arquivo por tela, Publicado hoje × Proposta, telas reais.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s314/';T='/tmp/s314/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
PAGAR="""()=>{const st=document.createElement('style');st.textContent='body:has(#pkok.py) .top #mnb{visibility:visible!important}body:has(#pkok.py) a.wa{z-index:10001!important}#pkok.py .tm{max-width:236px;margin-left:auto;margin-right:auto}';document.head.appendChild(st);
  document.documentElement.classList.remove('wamin');const o=document.getElementById('pkok');o.querySelector('.pyX').remove();
  const m=document.getElementById('mnb');m.setAttribute('aria-label','Voltar para Minha conta');m.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';return 'ok'}"""
# Minha conta no padrão de luxo aprovado: uma ação cheia (.pyP), contagem calma numa linha com fio, o resto em link fino na cor da tela (.pyL.s) — nada de vermelho sublinhado
CONTA="""()=>{const b=document.querySelector('[data-id=kitped1]');if(!b)return 'sem cartão';const g=getComputedStyle(b);
  const st=document.createElement('style');st.textContent='.s14P{display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;margin:0;padding:0 18px;border:0;border-radius:16px;background:#1f8f4e;color:#fff;font:600 16px Inter,system-ui,sans-serif;letter-spacing:.01em;box-shadow:0 10px 24px -14px rgba(31,143,78,.9);cursor:pointer;box-sizing:border-box}.s14L{display:flex;align-items:center;justify-content:center;min-height:48px;margin:2px auto 0;padding:0 12px;background:none;border:0;color:var(--mu);font:500 14px Inter,system-ui,sans-serif;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px;cursor:pointer}.s14T{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;gap:0 7px;margin:18px auto 16px}.s14T small{font-size:14px;color:var(--mu)}.s14T b{font-size:15px;font-weight:600;letter-spacing:.02em;font-variant-numeric:tabular-nums;color:var(--tx)}.s14T i{flex:0 0 100%;display:block;height:2px;max-width:150px;margin:10px auto 0;border-radius:2px;background:linear-gradient(90deg,#e6a64c 93%,var(--ln2) 93%)}';document.head.appendChild(st);
  const d=document.createElement('div');d.className=b.className;d.style.cssText='display:block;text-align:left;cursor:default;width:100%;box-sizing:border-box;padding:20px 20px 10px;border-radius:22px';
  const topo=document.createElement('div');topo.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px';while(b.firstChild)topo.appendChild(b.firstChild);
  const sm=topo.querySelector('small');if(sm)sm.innerHTML='14/11/2026 · PIX<br>R$&nbsp;489,93';
  const t=document.createElement('div');t.className='s14T';t.innerHTML='<small>Reservada para você por</small><b>27:51</b><i></i>';
  const p=document.createElement('button');p.type='button';p.className='s14P';p.textContent='Pagar agora';
  const c=document.createElement('button');c.type='button';c.className='s14L';c.textContent='Cancelar pedido';
  d.append(topo,t,p,c);b.replaceWith(d);return 'ok'}"""
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
    for qual,nome,tit,sub in (('pagar','1-pagar.jpg','Tela de pagar (PIX) · celular','Seta de voltar (leva a Minha conta › Pedidos) no lugar do menu; sem "Mais opções"; ajuda pelo WhatsApp flutuante.'),
                              ('conta','2-minha-conta-pedidos.jpg','Minha conta › Pedidos · pedido ainda não pago','Padrão de luxo: uma ação cheia (Pagar agora), contagem calma, "Cancelar pedido" em link fino.')):
        a,fa=tela(pw,qual,0);b,fb=tela(pw,qual,1);print(qual,'novas falhas x hoje:',sorted(fb-fa) or 'nenhuma')
        prancha(nome,tit,sub,[(a,'PUBLICADO HOJE'),(b,'PROPOSTA')])
