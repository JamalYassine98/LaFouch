# S338: painel do site (catalogo/admin.html) no tema ESCURO — botões brancos com letra clara (print do dono 15/11 14:36).
# Abre o painel real sem entrar (mostra a casca e monta as linhas com as mesmas classes), mede contraste de tudo o que é visível
# e fotografa HOJE × PROPOSTA (proposta = definir a cor que falta: --card). Nada implementado.
import sys,os,json;sys.argv=['x'];sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s338/';SITE='/home/claude/catalogo';PORTA=8813
kit.serve(SITE,PORTA)
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
MONTA="""()=>{document.querySelectorAll('#lock,#login,#totp,#trava').forEach(e=>e.hidden=true);const sh=document.getElementById('shell');sh.hidden=false;
 const top=sh.querySelector('.top');if(!document.getElementById('pnx')){const x=document.createElement('button');x.id='pnx';x.className='pnx';x.style.display='inline-flex';x.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>Sair';top.insertBefore(x,top.firstChild);const lg=top.querySelector('.logo');if(lg)lg.style.display='none'}
 const I=p=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';
 const lin=(ic,t,s)=>'<button type="button" class="lin"><span class="lnic">'+ic+'</span><span class="lntx"><b>'+t+'</b><small>'+s+'</small></span><span class="lnch">›</span></button>';
 ['c_ord','c_att'].forEach(id=>{const c=document.getElementById(id);if(c)c.hidden=true});[...document.querySelectorAll('#v_vit section.card')].filter(c=>/Preços e estoque/.test(c.textContent)).forEach(c=>c.hidden=true);
 document.getElementById('vsub').textContent='20 produtos no ar · preços vêm do estoque';document.getElementById('dstb').innerHTML='<div class="mu sm">3 fotos em sequência</div>';
 let b=document.querySelector('.p207l.vit');if(!b){b=document.createElement('div');b.className='p207l vit';const d=document.getElementById('c_dst');d.parentNode.insertBefore(b,d.nextSibling)}
 b.innerHTML=lin(I('<path d="M3 6h18M6 12h12M10 18h4"/>'),'Ordem do catálogo','Equilibrada')+lin(I('<path d="M12 9v4M12 17h.01"/>'),'Precisa de atenção','tudo certo')+lin(I('<path d="M12 2l3 6.6 7 .8-5.2 4.8 1.5 7L12 17.7 5.7 21.2l1.5-7L2 9.4l7-.8z"/>'),'Opiniões para revisar','nada para revisar')}"""
CONTR="""()=>{const lum=c=>{const m=c.match(/[\\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2])};
 const fundo=e=>{while(e){const c=getComputedStyle(e).backgroundColor;const m=c.match(/[\\d.]+/g);if(m&&(m.length<4||+m[3]>.5))return c;e=e.parentElement}return 'rgb(18,13,21)'};const o=[];
 document.querySelectorAll('#shell *').forEach(e=>{if(!e.offsetParent)return;const t=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t)return;const cs=getComputedStyle(e);const a=lum(cs.color),b=lum(fundo(e));const r=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(r<3)o.push([t.slice(0,28),+r.toFixed(2),cs.color,fundo(e)])});return o}"""
def roda(pw,prop,todas=False):
    b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,color_scheme='dark')
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();pg.goto('http://localhost:%d/admin.html'%PORTA);pg.wait_for_timeout(1500);pg.evaluate(MONTA)
    if prop: pg.add_style_tag(content=':root{--card:var(--s1)}')
    pg.wait_for_timeout(400);p='/tmp/s330/pn_%d.png'%prop;pg.screenshot(path=p);r=pg.evaluate(CONTR)
    tot=[]
    if todas:
        for v in pg.evaluate("()=>[...document.querySelectorAll('#shell main.page')].map(m=>m.id)"):
            pg.evaluate("v=>{document.querySelectorAll('#shell main.page').forEach(m=>m.hidden=m.id!==v)}",v);pg.wait_for_timeout(150);tot+=[[v]+x for x in pg.evaluate(CONTR)]
    b.close();return p,r,tot
with sync_playwright() as pw:
    a,ra,ta=roda(pw,0,True);b,rb,tb=roda(pw,1,True)
print('HOJE ilegíveis na vitrine:',ra);print('PROPOSTA ilegíveis na vitrine:',rb)
print('todas as telas do painel — hoje:',len(ta),'· proposta:',len(tb));[print('  resta:',x) for x in tb[:12]]
json.dump({'hoje':ta,'proposta':tb},open(OUT+'contraste.json','w'),ensure_ascii=False,indent=0)
ims=[Image.open(a),Image.open(b)];w,h=ims[0].size;g=40;top=230;S=Image.new('RGB',(g+2*(w+g),top+h+g),'#f1eef0');d=ImageDraw.Draw(S)
d.text((g,34),'Painel do site · Sua vitrine · tema escuro',font=F(42,True),fill='#1d1418');d.text((g,96),'Hoje: botões brancos com letra clara (cor que nunca foi definida). Proposta: a cor certa do painel.',font=F(25),fill='#55484f')
for i,(im,r) in enumerate(zip(ims,('HOJE','PROPOSTA'))):
    x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
S.save(OUT+'16-painel-vitrine-escuro.jpg',quality=88);S.resize((S.width*2//5,S.height*2//5)).save('/tmp/s330/pn.jpg',quality=80)
