# S224: folhas HOJE × PROPOSTA — um arquivo por tela e por temática.  python3 gera.py i0 i1
import os, sys, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from prop import CSS, JS
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
TEMAS=[('padrao','Padrão'),('natal','Natal'),('halloween','Halloween'),('bf','Black Friday'),('anonovo-d','Ano Novo dia'),('anonovo-n','Ano Novo noite'),('maes','Mães'),('pais','Pais')]
ABRE="()=>{const c=document.querySelector('#grid .card .open');c&&c.click()}"
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(nome, tit, sub, pecas, vertical=False):
    lin = textwrap.wrap(sub, 62 if not vertical else 100)
    if vertical:
        Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    else:
        Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Ht = 170 + 36 * len(lin) + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(38, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 88 + m * 36), ln, font=F(26), fill='#5b4a56')
    x, y = 40, 108 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(27, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 70
        else: x += im.width + 40
    B.save(A + 's224_%s.jpg' % nome, quality=85); print('ok', nome, flush=True)
SUB={'inicio':'Botões do Destaque legíveis (na cor clara da própria temática), links na cor da temática escurecida só o necessário, ícones do cabeçalho iguais, menos enfeites (somem antes do texto).','catalogo':'Preço na cor de texto da temática (hoje é o mesmo verde em todas).','peca':'Preço na cor de texto da temática; link de voltar legível.'}
i0,i1=int(sys.argv[1]),int(sys.argv[2])
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for t,nome in TEMAS[i0:i1]:
        for W,H,ap in ((390,844,'celular'),(1366,768,'pc')):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,is_mobile=W<900,has_touch=W<900,locale='es-PY',service_workers='block');c.add_init_script("sessionStorage.setItem('lf_ni','1')");c.route('**/*',rota)
            for tela,url,ac in (('inicio','',None),('catalogo','?r=tienda',None),('peca','?r=tienda',ABRE)):
                if ap=='pc' and (tela!='inicio' or t not in ('natal','bf','maes')): continue
                if t=='padrao' and tela=='inicio': continue
                im={}
                for modo in ('hoje','prop'):
                    pg=c.new_page();pg.goto('http://localhost:8811/'+url);pg.wait_for_timeout(2300)
                    if t!='padrao': pg.evaluate("t=>document.documentElement.setAttribute('data-ev',t)",t)
                    if ac: pg.evaluate(ac)
                    pg.wait_for_timeout(500)
                    if modo=='prop': pg.add_style_tag(content=CSS);pg.evaluate(JS)
                    pg.wait_for_timeout(450);p='/tmp/s224_%s_%s_%s_%s.png'%(t,ap,tela,modo);pg.screenshot(path=p);x=Image.open(p).convert('RGB')
                    im[modo]=x.resize((int(x.width*900/x.height),900)) if ap=='celular' else x.resize((1100,int(x.height*1100/x.width)));pg.close()
                folha('%s_%s%s'%(tela,t,'' if ap=='celular' else '_pc'),'%s · %s · %s'%(nome,{'inicio':'Início','catalogo':'Catálogo','peca':'Peça'}[tela],'celular' if ap=='celular' else 'computador'),SUB[tela],[('HOJE','#b42318',im['hoje']),('PROPOSTA','#1f8a4c',im['prop'])],vertical=ap=='pc')
            c.close()
