# S241 · app inteiro: proposta de acabamento de designer (mesma casa do site) em cima das telas reais — celular e computador, claro e escuro.  python3 gera.py
import os, subprocess, sys, time, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
OLHO = open(A + '../kit/olho.js').read()
CSS = """
/* 1 · títulos na letra serifada do site; subtítulo mais leve */
.view h1{font-family:Fraunces,Georgia,'Times New Roman',serif!important;font-weight:500!important;letter-spacing:-.01em;font-size:28px!important;line-height:1.15!important}
.view .crumb{font-size:13.5px!important;opacity:.85;margin-top:4px}
.view h2,.view .card>b:first-child{font-family:Fraunces,Georgia,serif;font-weight:500}
/* 2 · cartões sem contorno pesado: fundo limpo, sombra quase invisível, mais respiro */
.view .card,.view .kpi,.view .hero,.view .tl,.view section.cxSaldo{border-color:transparent!important;box-shadow:0 1px 2px rgba(42,31,39,.05),0 8px 24px -18px rgba(42,31,39,.25)!important;border-radius:20px!important}
.view .card{padding-top:18px;padding-bottom:18px}
.view .guardC{border-left:0!important;border-top:2px solid #8d3a69!important;border-radius:4px 4px 20px 20px!important}
/* 3 · rótulos pequenos discretos e números com algarismos alinhados */
.view .lbl{letter-spacing:.12em!important;font-weight:600!important;opacity:.7}
.view .kpi b,.view .kpi strong,.view .hero b,.view .cxSaldo b,.view .num,.view .v{font-variant-numeric:tabular-nums;letter-spacing:-.01em}
/* 4 · um só botão principal (vinho cheio), secundário em fio fino */
.view .mini:not(.ghost),.view .btn-sc.p{background:#8d3a69!important;color:#fff!important;border-color:#8d3a69!important;border-radius:999px!important;box-shadow:none!important}
.view .mini.ghost,.view .btn-sc:not(.p){background:transparent!important;border:1px solid color-mix(in srgb,currentColor 22%,transparent)!important;border-radius:999px!important;box-shadow:none!important}
/* 5 · atalhos do Início: ícone fino em vinho, sem caixa em volta */
#v-inicio .tl .tic,#v-inicio .tl svg{color:#8d3a69}
#v-inicio .tl{background:var(--panel)!important}
/* 6 · busca e campos: fio fino, cantos iguais aos dos cartões */
.view input.in,.view .buIn,.view label.buIn{border-radius:16px!important;border-color:color-mix(in srgb,currentColor 14%,transparent)!important;box-shadow:none!important}
/* 7 · barra de baixo e menu ao lado: sem sombra, fio fino, item ativo com um ponto */
#mainnav{box-shadow:none!important;border-top:1px solid var(--line)!important}
#mainnav .mn.on{position:relative}
@media (max-width:1099px){#mainnav .mn.on::after{content:"";position:absolute;left:50%;bottom:4px;width:4px;height:4px;border-radius:4px;background:#8d3a69;transform:translateX(-50%)}}
/* 8 · Ajustes: linhas mais altas e calmas */
#v-ajustes .ajR{min-height:60px}
/* Cópias e nuvem: só o essencial — estado + 4 linhas que abrem o resto */
.nvx{display:flex;flex-direction:column;gap:12px;padding:6px 0 8px}
.nvx .st{display:flex;align-items:center;gap:12px;padding:4px 2px 10px}
.nvx .st i{width:9px;height:9px;border-radius:9px;background:#1f8f4e;flex:none;box-shadow:0 0 0 5px color-mix(in srgb,#1f8f4e 14%,transparent)}
.nvx .st b{font:500 20px Fraunces,Georgia,serif;display:block}
.nvx .st span{font:400 13px Inter,system-ui,sans-serif;opacity:.7}
.nvx .ln{display:flex;align-items:center;min-height:52px;padding:0 2px;border-top:1px solid var(--line);font:500 15px Inter,system-ui,sans-serif}
.nvx .ln .q{margin-left:auto;font:400 13.5px Inter,system-ui,sans-serif;opacity:.65;padding-right:8px}
.nvx .ln .s{opacity:.45;font-size:18px}
@media (min-width:1100px){.nvx{max-width:560px}}
"""
NUVEM = """<div class="nvx"><div class="st"><i></i><div><b>Tudo salvo</b><span>há 2 min · 3 aparelhos em dia</span></div></div>
<div class="ln">Voltar no tempo<span class="q">hoje, 21:48</span><span class="s">›</span></div>
<div class="ln">Lixeira<span class="q">2 itens</span><span class="s">›</span></div>
<div class="ln">Aparelhos<span class="q">3</span><span class="s">›</span></div>
<div class="ln">Arquivo de backup<span class="q">exportar ou importar</span><span class="s">›</span></div></div>"""
JSN = "h=>{const s=[...document.querySelectorAll('.ajS')].find(e=>/Cópias e nuvem/.test(e.textContent));const b=s.querySelector('button.ajR');let n=b.nextElementSibling;const box=document.createElement('div');box.innerHTML=h;if(n){n.innerHTML='';n.appendChild(box.firstChild)}const r=s.querySelector('.ajRes');if(r)r.textContent='Tudo salvo'}"
NOME={'inicio':'Início','estoque':'Inventário','vendas':'Catálogo','caixa':'Caixa','nuvem':'Ajustes › Cópias e nuvem','dash':'Números','desp':'Despesas'}
def folha(nome, tit, sub, pecas, vertical=False, larg=62):
    lin = textwrap.wrap(sub, larg)
    if vertical: Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    else: Wt = sum(p[2].width for p in pecas) + 40 * (len(pecas) - 1) + 80; Ht = 170 + 36 * len(lin) + max(p[2].height for p in pecas) + 40
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(36, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 86 + m * 36), ln, font=F(25), fill='#5b4a56')
    x, y = 40, 106 + 36 * len(lin)
    for rot, cor, im in pecas:
        d.text((x, y), rot, font=F(26, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5')
        if vertical: y += im.height + 70
        else: x += im.width + 40
    B.save(A + 's241_%s.jpg' % nome, quality=85); print('ok', nome, flush=True)
LOTES=[('celular_claro',390,844,'light',['inicio','estoque','vendas','caixa','nuvem','dash']),('celular_escuro',390,844,'dark',['inicio','caixa','nuvem']),('pc_claro',1366,768,'light',['inicio','estoque','caixa','nuvem']),('pc_escuro',1366,768,'dark',['inicio','estoque'])]
SUB='Mesma casa do site: títulos serifados, cartões sem contorno pesado e com mais respiro, um só botão principal em vinho, rótulos discretos, números alinhados, barra sem sombra. Nenhuma função sai do lugar.'
srv=subprocess.Popen([sys.executable,'-m','http.server','8826','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,W,H,sc,telas in LOTES:
        im={};ol={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,color_scheme=sc,is_mobile=W<700,has_touch=W<1100,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();pg.goto('http://localhost:8826/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700)
            if modo=='prop': pg.add_style_tag(content=CSS)
            for v in telas:
                pg.evaluate("v=>window.__LF.setView(v)",'ajustes' if v=='nuvem' else v);pg.wait_for_timeout(1100)
                if v=='nuvem':
                    pg.locator('button.ajR',has_text='Cópias e nuvem').click();pg.wait_for_timeout(1000)
                    if modo=='prop': pg.evaluate(JSN,NUVEM);pg.wait_for_timeout(300)
                    pg.evaluate("()=>{const b=[...document.querySelectorAll('button.ajR')].find(e=>/Cópias e nuvem/.test(e.textContent));scrollBy(0,b.getBoundingClientRect().top-(innerWidth<1100?330:120))}");pg.wait_for_timeout(400)
                ol[v,modo]={x['r']:x['n'] for x in pg.evaluate(OLHO)}
                p='/tmp/s241_%s_%s_%s.png'%(arq,v,modo);pg.screenshot(path=p);x=Image.open(p).convert('RGB');im[v,modo]=x.resize((int(x.width*900/x.height),900)) if W<1100 else x.resize((1300,int(x.height*1300/x.width)))
            c.close()
        pior=[(v,r,ol[v,'hoje'].get(r,0),ol[v,'prop'][r]) for v in telas for r in ol[v,'prop'] if ol[v,'prop'][r]>ol[v,'hoje'].get(r,0)]
        print(arq,'pioras olho:',pior)
        for v in telas: folha('%s_%s'%(arq,v),'App · %s · %s'%(NOME[v],arq.replace('_',' ').replace('pc','computador')),SUB if v!='nuvem' else 'Cópias e nuvem com o essencial: o estado e 4 linhas que abrem o resto. Nada de lista longa na tela.',[('HOJE','#b42318',im[v,'hoje']),('PROPOSTA','#1f8a4c',im[v,'prop'])],vertical=W>=1100,larg=62 if W<1100 else 100)
finally: srv.terminate()
