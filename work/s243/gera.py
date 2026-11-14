# S243 · correção das minhas propostas no computador: a ação da tela fica AO LADO do título (não no canto oposto). Mede a distância antes e depois.
import os, subprocess, sys, time, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
src = open(A + '../s242/gera.py').read(); i = src.index('CSS = CSS241 + """') + 18; C242 = src[i: src.index('"""', i)]
s41 = open(A + '../s241/gera.py').read(); j = s41.index('CSS = """') + 9; C241 = s41[j: s41.index('"""', j)]
CSS = C241 + C242 + """
.view #btnAdd,.view .mini:not(.ghost){color:#fff!important;-webkit-text-fill-color:#fff}
@media (min-width:1100px){
 /* regra: no computador a ação da tela mora ao lado do título */
 .view>.top{justify-content:flex-start!important;gap:20px!important;align-items:center!important}
 .view>.top>div:first-child{flex:0 1 auto!important}
 #cxIc{width:auto!important;padding:0 16px 0 12px!important;gap:8px;border-radius:999px!important;display:inline-flex!important;align-items:center}
 #cxIc::after{content:"Ações do caixa";font:600 14px Inter,system-ui,sans-serif}
}
"""
DIST = "()=>{const v=[...document.querySelectorAll('.view')].find(e=>e.getBoundingClientRect().width),t=v.querySelector('h1').getBoundingClientRect(),b=v.querySelector('.top button, .top .tabs button');if(!b)return null;const r=b.getBoundingClientRect();const g=document.createRange();g.selectNodeContents(v.querySelector('h1'));const tr=g.getBoundingClientRect();return [Math.round(r.left-tr.right),(b.getAttribute('aria-label')||b.textContent).trim().slice(0,20)]}"
def folha(nome, tit, sub, pecas, larg=100):
    lin = textwrap.wrap(sub, larg); Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(36, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 86 + m * 36), ln, font=F(25), fill='#5b4a56')
    x, y = 40, 106 + 36 * len(lin)
    for rot, cor, im in pecas: d.text((x, y), rot, font=F(26, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5'); y += im.height + 70
    B.save(A + 's243_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
NOME={'caixa':'Caixa','estoque':'Inventário','vendas':'Catálogo','clientes':'Clientes'}
srv=subprocess.Popen([sys.executable,'-m','http.server','8829','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,W,H in (('pc1366',1366,768),('pc2560',2560,1440)):
        im={};ds={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();pg.goto('http://localhost:8829/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700)
            if modo=='prop': pg.add_style_tag(content=CSS)
            for v in ('caixa','estoque','vendas','clientes'):
                pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1100);ds[v,modo]=pg.evaluate(DIST)
                if v in('caixa','estoque'):
                    p='/tmp/s243_%s_%s_%s.png'%(arq,v,modo);pg.screenshot(path=p,clip={'x':0,'y':0,'width':W,'height':int(H*.62)});x=Image.open(p).convert('RGB');im[v,modo]=x.resize((1300,int(x.height*1300/x.width)))
            c.close()
        for v in ('caixa','estoque','vendas','clientes'): print(arq,v,'distância título→ação: hoje',ds[v,'hoje'],'→ proposta',ds[v,'prop'])
        for v in ('caixa','estoque'):
            folha('%s_%s'%(arq,v),'App · %s · computador %d · ação ao lado do título'%(NOME[v],W),'Hoje o botão fica a %d px do título, no canto oposto; na proposta, a %d px. No Caixa ele ganha nome ("Ações do caixa") em vez de ser só um ícone.'%(ds[v,'hoje'][0],ds[v,'prop'][0]) if ds[v,'hoje'] else '',[('HOJE','#b42318',im[v,'hoje']),('PROPOSTA','#1f8a4c',im[v,'prop'])])
finally: srv.terminate()
