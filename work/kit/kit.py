#!/usr/bin/env python3
"""Kit de esboço realista (12/11/2026). Abre a tela REAL do site ou do app, injeta só o que muda e fotografa.
uso:
  python3 work/kit/kit.py site <tela> <saida.png> [inject.js|inject.html] [--y N] [--es] [--ref CODIGO]
  python3 work/kit/kit.py app  <tela> <saida.png> [inject.html] [--escuro]
  python3 work/kit/kit.py revisa tela1.png tela2.png   (designer: confere centralização)
  python3 work/kit/kit.py prancha <saida.jpg> "Título" "sub" tela1.png:"Título 1":"sub 1" ...
telas do site: home catalogo produto carrinho entrega delivery pagamento conta atacado
telas do app : inicio estoque caixa clientes ped hist ajustes fx desp dash (qualquer id de setView)
inject .html no site = vira <main> abaixo do cabeçalho (classes reais do site + site-comp.css, prefixo #atx)
inject .js  no site = função JS (a)=>{...} rodada na tela real (para acrescentar cartões .cfo/.note/.cfc)
inject .html no app = tela cheia por cima do app (app-comp.css, prefixo #fx)
Sem internet: tudo vem do localhost; login e conta são de teste; nada vai para produção."""
import sys, os, json, subprocess, shutil, time, socket
from playwright.sync_api import sync_playwright
K=os.path.dirname(os.path.abspath(__file__)); RAIZ=os.path.abspath(os.path.join(K,'..','..'))
SITE_SRC=os.path.join(os.path.dirname(RAIZ),'catalogo'); SITE='/tmp/kitsite'; PS,PA=8811,8812
EXE='/opt/pw-browsers/chromium'
def serve(d,p):
    s=socket.socket()
    if s.connect_ex(('127.0.0.1',p))==0: s.close(); return
    subprocess.Popen(['python3','-m','http.server',str(p)],cwd=d,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True); time.sleep(1)
def prep_site():
    if os.path.isdir(SITE) and os.path.getmtime(SITE)>os.path.getmtime(os.path.join(SITE_SRC,'js','lf-site.js')): return
    shutil.rmtree(SITE,ignore_errors=True); shutil.copytree(SITE_SRC,SITE,ignore=shutil.ignore_patterns('.git'))
    import re; f=os.path.join(SITE,'js','lf-site.js'); s=open(f).read()
    g=lambda r: re.search(r"ref:'"+r+"'[^}]*foto:'([^']*)'",s).group(1)
    p="{ref:'KIT3C',gen:'f',nome:'Armação metal gatinho',tipo:'armacao',n:139000,cor:'#6b4a2b',raio:22,aviso:'',tag:'METAL',rosto:['quadrado','redondo'],mat:'Metal',med:[52,18,140],foto:'%s',fc:[null,'%s','%s'],cores:['#6b4a2b','#cfd6dc','#1d1d1f'],cn:['Tartaruga','Transparente','Preto'],qs:[2,3,2],lib:1,cad:9e12,cmx:20},\n"%(g('SL2275'),g('GR3350'),g('BR44140'))
    open(f,'w').write(s.replace("var P=[\n","var P=[\n    "+p,1)); os.utime(SITE,None)
CONTA=json.dumps({'nome':'Maria González','email':'maria@exemplo.com','tel':'+595 983 000 000','ends':[{'nome':'Casa','cidade':'Ciudad del Este','dep':'Alto Paraná','end':'Calle Los Lapachos 123','ref':'portão verde'}]})
AUTH=json.dumps({'uid':'kit','idToken':'kit','refresh':'kit','exp':9e15,'ev':True,'email':'maria@exemplo.com'})
def ctx(pw,lang='pt-BR',scheme='light'):
    b=pw.chromium.launch(executable_path=EXE,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,locale=lang,color_scheme=scheme,service_workers='block')
    c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') or r.request.url.startswith('http://127.') else r.abort()); return b,c
def rolar(pg,y): pg.evaluate("y=>{[...document.querySelectorAll('*')].forEach(e=>{if(e.scrollHeight>e.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(e).overflowY))e.scrollTop=y});window.scrollTo(0,y)}",y); pg.wait_for_timeout(350)
def site(tela,out,inj=None,y=0,es=False,ref=None):
    prep_site(); serve(SITE,PS); U=f'http://localhost:{PS}/'
    with sync_playwright() as pw:
        b,c=ctx(pw,'es-PY' if es else 'pt-BR')
        logado=tela in ('entrega','delivery','pagamento','conta')
        c.add_init_script("localStorage.setItem('lf_lang',%r);"%('es' if es else 'pt')+("localStorage.setItem('lf_conta',%r);localStorage.setItem('lf_auth',%r);"%(CONTA,AUTH) if logado else "")+"try{sessionStorage.setItem('lf_ni','1')}catch(e){}"+os.environ.get('KIT_INIT',''))
        pg=c.new_page(); pg.goto(U+'?kit=1'); pg.wait_for_timeout(1800)
        def abre(ref): pg.evaluate("r=>{const e=document.querySelector('[data-open=\"'+r+'\"]');e&&e.click()}",ref); pg.wait_for_timeout(1100)
        if tela=='produto': abre(ref or 'KIT3C')
        elif tela in ('carrinho','entrega','delivery','pagamento'):
            abre('SL2210'); [e for e in pg.query_selector_all('button') if e.is_visible() and 'Comprar' in (e.inner_text() or '')][0].click(); pg.wait_for_timeout(1100)
            pg.click('text=Finalizar compra'); pg.wait_for_timeout(1100)
            if tela!='carrinho': pg.click('text=Prosseguir com o pagamento'); pg.wait_for_timeout(1100)
            if tela=='pagamento': pg.click('text=Forma de pagamento'); pg.wait_for_timeout(1300)
            if tela=='delivery': pg.evaluate("(document.querySelector('button.cfo[data-ent=delivery]')||[...document.querySelectorAll('button')].find(b=>/^Delivery/.test(b.innerText.trim()))).click()"); pg.wait_for_timeout(900)
        elif tela=='conta': pg.evaluate("(document.querySelector('[aria-label*=\"onta\"]')||{click(){}}).click()"); pg.wait_for_timeout(1100)
        elif tela=='atacado': pg.goto(U+'?r=atacado'); pg.wait_for_timeout(1600)
        elif tela=='catalogo': pg.goto(U+'?r=vitrine'); pg.wait_for_timeout(1600)
        if inj:
            t=open(inj).read()
            if inj.endswith('.js'): pg.evaluate(t)
            else:
                pg.evaluate("a=>{const s=document.createElement('style');s.textContent=a[0];document.head.appendChild(s);const t=document.querySelector('.top');[...document.body.children].forEach(e=>{if(!e.contains(t)&&!/STYLE|SCRIPT/.test(e.tagName))e.style.display='none'});const m=document.createElement('main');m.innerHTML=a[1];(t.closest('body>*')||t).after(m)}",[open(os.path.join(K,'site-comp.css')).read(),t])
            pg.wait_for_timeout(500)
        rolar(pg,y); pg.screenshot(path=out); b.close()
def app(tela,out,inj=None,escuro=False):
    serve(os.path.join(RAIZ,'www'),PA)
    with sync_playwright() as pw:
        b,c=ctx(pw,scheme='dark' if escuro else 'light'); c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")
        pg=c.new_page(); pg.goto(f'http://localhost:{PA}/index.html#test'); pg.wait_for_function('window.__LF',timeout=10000); pg.wait_for_timeout(1000)
        if tela!='inicio': pg.evaluate("t=>window.__LF.setView(t)",tela); pg.wait_for_timeout(700)
        if inj: pg.evaluate("a=>{const s=document.createElement('style');s.textContent=a[0];document.head.appendChild(s);const d=document.createElement('div');d.id='fx';d.innerHTML=a[1];document.body.appendChild(d)}",[open(os.path.join(K,'app-comp.css')).read(),open(inj).read()]); pg.wait_for_timeout(500)
        pg.screenshot(path=out); b.close()
def prancha(out,tit,sub,itens):
    from PIL import Image,ImageDraw,ImageFont
    F=lambda s,bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
    W,H,p,top=780,1688,40,150; B=Image.new('RGB',(p+(W+p)*len(itens),top+H+p),'#e9e4e8'); d=ImageDraw.Draw(B)
    d.text((p,30),tit,font=F(44,1),fill='#231a22'); d.text((p,90),sub,font=F(26),fill='#6b5d67')
    for k,it in enumerate(itens):
        f,t,s=(it.split(':')+['',''])[:3]; x=p+k*(W+p); B.paste(Image.open(f).convert('RGB').resize((W,H)),(x,top+70))
        d.text((x,top-4),t,font=F(30,1),fill='#b3261e' if t.lower().startswith('hoje') else '#8d3a69'); d.text((x,top+34),s,font=F(22),fill='#3b2f39')
    B.resize((B.width//2,B.height//2),Image.LANCZOS).save(out,quality=86)

def revisa(png,tol=0.03):
    """Revisor de design (parte 1): confere se o conteúdo está centralizado na largura. Fundo = cor do canto."""
    from PIL import Image, ImageChops
    im=Image.open(png).convert('RGB'); bg=Image.new('RGB',im.size,im.getpixel((2,im.height-3)))
    bb=ImageChops.difference(im,bg).convert('L').point(lambda v:255 if v>18 else 0).getbbox()
    if not bb: return True
    meio=(bb[0]+bb[2])/2/im.width; ok=abs(meio-0.5)<=tol
    print(('OK centralizado' if ok else 'ATENÇÃO: fora do centro (%.0f%% para %s)'%(abs(meio-0.5)*100,'a esquerda' if meio<0.5 else 'a direita'))+' · '+os.path.basename(png))
    return ok
if __name__=='__main__':
    a=sys.argv[1:]; op=lambda k:(a[a.index(k)+1] if k in a else None)
    if a[0]=='site': site(a[1],a[2],a[3] if len(a)>3 and not a[3].startswith('--') else None,int(op('--y') or 0),'--es' in a,op('--ref'))
    elif a[0]=='app': app(a[1],a[2],a[3] if len(a)>3 and not a[3].startswith('--') else None,'--escuro' in a)
    elif a[0]=='prancha': prancha(a[1],a[2],a[3],a[4:])
    elif a[0]=='revisa': [revisa(x) for x in a[1:]]
