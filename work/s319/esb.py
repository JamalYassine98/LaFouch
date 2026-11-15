# S319: esboço da transferência no modo AUTOMÁTICO (quando o robô do Banco Familiar estiver ligado). Publicado hoje (manual) × Proposta (automático), tela real:
# a proposta é o próprio código do site com TRF_AUTO=true numa cópia isolada.
import sys,os,re,shutil;sys.path.insert(0,'/home/claude/lafouch/work/s308');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s319/';T='/tmp/s319/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
OLHO=open('/home/claude/lafouch/work/kit/olho.js').read()
def olho(pg,w):
    r=set()
    for rola in (0,1):
        pg.evaluate("r=>{const o=document.getElementById('pkok');if(o)o.scrollTop=r?o.scrollHeight:0}",rola);w(350)
        for f in pg.evaluate(OLHO) or []: r.add((('rolado' if rola else 'parado'),f['r'],tuple(f.get('ex') or [])))
    return r
def tela(pw,nome,minutos):
    b,pg,w=base.abre(pw,minutos=minutos,pag='alias')
    pg.add_style_tag(content='*,*:before,*:after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}');w(300)
    p=T+nome+'.png';pg.screenshot(path=p);fl=olho(pg,w);b.close();return p,fl
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
K='/tmp/kitsite/js/lf-site.js'
with sync_playwright() as pw:
    import kit
    shutil.rmtree('/tmp/kitsite',ignore_errors=True);kit.prep_site()
    a,fa=tela(pw,'hoje',2)
    s=open(K,encoding='utf-8').read();assert s.count('TRF_AUTO=false')==1;A="(TRF_AUTO?'':'<div class=\"zm\">";assert s.count(A)==1
    # proposta: no automático o cartão termina com uma linha de orientação (sem botão)
    s=s.replace(A,"(TRF_AUTO?'<div class=\"zm\"><p class=\"zl m\" style=\"display:block;margin:0\">Transfira o valor exato pelo app do seu banco.</p></div>':'<div class=\"zm\">")
    open(K,'w',encoding='utf-8').write(s.replace('TRF_AUTO=false','TRF_AUTO=true'))
    b0,f0=tela(pw,'auto0',0.2);b2,f2=tela(pw,'auto2',2)
    shutil.rmtree('/tmp/kitsite',ignore_errors=True);kit.prep_site()
    print('novas falhas x hoje:',sorted((f0|f2)-fa) or 'nenhuma')
    prancha('transferencia-automatica.jpg','Transferência no modo automático','Sem botão cheio: o cliente copia valor e alias; o site espera sozinho; o comprovante vira linha depois de 1 min.',[(a,'PUBLICADO HOJE (manual)'),(b0,'PROPOSTA · ao abrir'),(b2,'PROPOSTA · depois de 1 min')])
