# S330: esboços do MODO LOJA (catálogo do site dentro do app, para o cliente na loja). App real + cópia do site, tema claro (o site não tem escuro).
# HOJE × PROPOSTA, um arquivo por tela. Nada implementado: o "proposta" é injetado só na foto.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s330/';T='/tmp/s330/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
CSS="""html.lojamodo #home>.htr,html.lojamodo #home>#hloj,html.lojamodo #home>.hata,html.lojamodo #home>section.hnews.hn2,html.lojamodo #home>.lfft{display:none!important}
#lojab{top:auto!important;bottom:calc(14px + env(safe-area-inset-bottom))!important;left:14px!important;right:14px!important;justify-content:center!important}
#lojab .lojk{display:none!important}
#lojap{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 18px!important;font:600 15px var(--body)!important;box-shadow:0 10px 30px rgba(122,42,89,.28)}
#lojap[data-n="0"]{display:none!important}
main{padding-bottom:84px}"""
def abre(pw,n,prop,fim=False,pin=False):
    b,pg,w=base.abre(pw,'vendas',False)
    if pin: pg.evaluate("()=>{window.__LF.S.pinHash='x';window.__LF.S.pinSalt='y'}")
    pg.evaluate("()=>{localStorage.setItem('lf_modoCli','1');const x=document.querySelector('[data-act=mcLiga]');x&&x.click()}");w(3200)
    fr=[f for f in pg.frames if 'loja.html' in f.url][0]
    fr.evaluate("n=>{document.getElementById('lojan').textContent=n}",n)
    if prop:
        fr.evaluate("a=>{const s=document.createElement('style');s.textContent=a[0];document.head.appendChild(s);const p=document.getElementById('lojap');p.dataset.n=a[1];if(a[1]>0)p.innerHTML='<span>Meu pedido · '+a[1]+' peças</span><span>Chamar um vendedor ›</span>'}",[CSS,n])
    if fim: fr.evaluate("()=>scrollTo(0,document.documentElement.scrollHeight)");w(900)
    if pin:
        if prop: pg.evaluate("()=>{document.getElementById('lockScr').style.zIndex='2147483600'}")
        pg.mouse.move(195,36);pg.mouse.down();w(5400);pg.mouse.up();w(700)
    w(400);return b,pg,fr
def foto(pw,nome,**k):
    b,pg,fr=abre(pw,**k);p=T+nome+'.png';pg.screenshot(path=p)
    ach=set()
    try: ach=set(str((f['r'],f.get('ex'))) for f in (fr.evaluate(open('/home/claude/lafouch/work/kit/olho.js').read()) or []))
    except Exception as e: print('  olho:',str(e)[:90])
    alt=fr.evaluate("()=>document.documentElement.scrollHeight");b.close();return p,ach,alt
def prancha(nome,titulo,sub,a,bb):
    ims=[Image.open(a),Image.open(bb)];w,h=ims[0].size;g=40;top=250;S=Image.new('RGB',(g+2*(w+g),top+h+g),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(42,True),fill='#1d1418')
    for i,l in enumerate(sub): d.text((g,96+i*36),l,font=F(26),fill='#55484f')
    for i,(im,r) in enumerate(zip(ims,('HOJE','PROPOSTA'))):
        x=g+i*(w+g);d.text((x,196),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
with sync_playwright() as pw:
    for nome,tit,sub,k in [x for x in (
      ('12-loja-topo.jpg','Modo loja · topo (cliente ainda sem peças)',['Hoje: a etiqueta LOJA fica em cima do logo e "Meu pedido" tapa a busca.','Proposta: topo limpo (logo + busca); sai a faixa de delivery/pagamento/retirada.'],dict(n=0)),
      ('13-loja-com-pecas.jpg','Modo loja · cliente escolheu 2 peças',['Proposta: barra embaixo, no alcance do dedo, com a ação que importa:','chamar o vendedor. Só aparece quando há peça escolhida.'],dict(n=2)),
      ('14-loja-fim.jpg','Modo loja · fim da página',['Hoje: Para lojistas, novidades por WhatsApp/e-mail, endereço, links, termos.','Proposta: a página acaba nas peças e guias. O cliente já está na loja.'],dict(n=0,fim=True)),
      ('15-loja-sair.jpg','Modo loja · sair (segurar o logo 5 s) com PIN ligado',['Hoje (reproduzido): a tela do PIN abre ATRÁS do catálogo. Não dá para sair.','Proposta: o PIN abre por cima; "Cancelar" volta ao catálogo.'],dict(n=0,pin=True))) if not os.environ.get('SO') or os.environ['SO'] in x[0]]:
        a,fa,ha=foto(pw,nome+'_h',prop=False,**k);b,fb,hb=foto(pw,nome+'_p',prop=True,**k)
        print(nome,'achados novos:',sorted(fb-fa) or 'nenhum','· altura da página',ha,'→',hb);prancha(nome,tit,sub,a,b)
