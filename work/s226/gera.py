# S226: folhas HOJE × PROPOSTA do app (celular lado a lado; computador Hoje em cima, Proposta embaixo). python3 gera.py
import os, sys, subprocess, time, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from prop import CSS, JS
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
NOME={'inicio':'Início','estoque':'Inventário','vendas':'Catálogo','dia':'Dia','notif':'Notificações','desp':'Despesas','ped':'Pedidos online','caixa':'Caixa','dash':'Números','hist':'Histórico','clientes':'Clientes','fx':'Câmbio','ajustes':'Ajustes'}
def rota(r): return r.continue_() if r.request.url.startswith('http://localhost') else r.abort()
def folha(nome, tit, sub, pecas, vertical=False):
    lin = textwrap.wrap(sub, 60 if not vertical else 110)
    if vertical: Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    else: Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Ht = 170 + 36 * len(lin) + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(38, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 88 + m * 36), ln, font=F(26), fill='#5b4a56')
    x, y = 40, 108 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(27, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 70
        else: x += im.width + 40
    B.save(A + 's226_%s.jpg' % nome, quality=85); print('ok', nome, flush=True)
# (arquivo, aparelho, W, H, esquema, toque, telas)
LOTES=[('celular','celular 390',390,844,'light',True,['inicio','estoque','dia','notif','desp','ped']),('celular_escuro','celular 390 · escuro',390,844,'dark',True,['inicio']),('celular_pequeno','celular pequeno 320',320,568,'light',True,['inicio']),
       ('tablet','tablet 820',820,1180,'light',True,['estoque']),('pc2560','computador 2560×1440',2560,1440,'light',False,['inicio','estoque','vendas']),('pc1366','notebook 1366×768',1366,768,'light',False,['estoque']),('pc2560_escuro','computador 2560×1440 · escuro',2560,1440,'dark',False,['estoque'])]
so=sys.argv[1:] 
srv=subprocess.Popen([sys.executable,'-m','http.server','8799','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,rot,W,H,sc,toque,telas in LOTES:
        if so and arq not in so: continue
        im={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,color_scheme=sc,is_mobile=W<700,has_touch=toque,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',rota)
            pg=c.new_page();pg.goto('http://localhost:8799/index.html#test');pg.wait_for_function('window.__LF',timeout=15000);pg.wait_for_timeout(700)
            if modo=='prop': pg.add_style_tag(content=CSS);pg.evaluate(JS)
            for v in telas:
                pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1400);p='/tmp/s226_%s_%s_%s.png'%(arq,v,modo);pg.screenshot(path=p);x=Image.open(p).convert('RGB')
                im[v,modo]=x.resize((int(x.width*900/x.height),900)) if W<1100 else x.resize((1400,int(x.height*1400/x.width)))
            c.close()
        for v in telas:
            sub='Topo compacto (logo menor, mais tela), toques com 44 px ou mais, letra de 12 px ou mais, botão diz o que abre.' if W<1100 else 'Mesma lógica do site: menu ao lado com todos os destinos, logo no canto, conteúdo usa a largura; o primeiro produto aparece logo.'
            folha('%s_%s'%(arq,v),'App · %s · %s'%(NOME[v],rot),sub,[('HOJE','#b42318',im[v,'hoje']),('PROPOSTA','#1f8a4c',im[v,'prop'])],vertical=W>=1100)
finally: srv.terminate()
