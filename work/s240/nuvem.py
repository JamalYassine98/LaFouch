# S240 · app: esboço da seção "Cópias e nuvem" (Ajustes) com backup por mudança, voltar no tempo e lixeira. Desenhado na tela real, com as classes do app.
import os, subprocess, sys, time, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
CSS = """
.nvx{display:flex;flex-direction:column;gap:14px;padding:4px 0 6px}
.nvx .st{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:16px;background:color-mix(in srgb,#1f8f4e 9%,var(--panel));border:1px solid color-mix(in srgb,#1f8f4e 25%,var(--line))}
.nvx .st i{width:10px;height:10px;border-radius:9px;background:#1f8f4e;flex:none}
.nvx .st b{font:600 16px Inter,system-ui,sans-serif;display:block}
.nvx .st span{font:400 13px Inter,system-ui,sans-serif;color:var(--muted,#6b5a66)}
.nvx .lb{font:700 12px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#6b5a66);margin:6px 2px -4px}
.nvx .bx{border:1px solid var(--line);border-radius:16px;background:var(--panel);overflow:hidden}
.nvx .ln{display:flex;align-items:center;gap:12px;min-height:52px;padding:8px 14px;border-top:1px solid var(--line);font:500 15px Inter,system-ui,sans-serif}
.nvx .ln:first-child{border-top:0}
.nvx .ln small{display:block;font:400 12.5px Inter,system-ui,sans-serif;color:var(--muted,#6b5a66);margin-top:2px}
.nvx .ln .r{margin-left:auto;font:600 14px Inter,system-ui,sans-serif;color:#8d3a69;white-space:nowrap;min-height:44px;display:flex;align-items:center;padding:0 4px}
.nvx .ln .q{margin-left:auto;font:400 13px Inter,system-ui,sans-serif;color:var(--muted,#6b5a66);white-space:nowrap}
.nvx .arq{font:500 14px Inter,system-ui,sans-serif;color:var(--muted,#6b5a66);display:flex;justify-content:space-between;align-items:center;min-height:48px;padding:0 14px;border:1px dashed var(--line);border-radius:14px}
@media (min-width:1100px){.nvx{display:grid;grid-template-columns:1fr 1fr;gap:16px 22px;align-items:start}.nvx .st,.nvx .arq{grid-column:1 / -1}.nvx .col{display:flex;flex-direction:column;gap:14px}}
"""
HTML = """<div class="nvx">
 <div class="st"><i></i><div><b>Tudo salvo na nuvem</b><span>Última mudança guardada há 2 min · este celular e mais 2 aparelhos</span></div></div>
 <div class="col"><div class="lb">Voltar no tempo</div>
 <div class="bx"><div class="ln"><div>Hoje, 21:48<small>3 mudanças · preço da SL2210, 2 peças novas</small></div><span class="r">Ver ›</span></div>
  <div class="ln"><div>Hoje, 14:10<small>1 mudança · AC1050 removida</small></div><span class="r">Ver ›</span></div>
  <div class="ln"><div>Ontem<small>12 mudanças</small></div><span class="r">Ver ›</span></div>
  <div class="ln"><div>Dias anteriores<small>1 por dia no último mês · 1 por mês no último ano</small></div><span class="r">Abrir ›</span></div></div></div>
 <div class="col"><div class="lb">Lixeira · 30 dias</div>
 <div class="bx"><div class="ln"><div>Produtos<small>AC1050 · removida hoje</small></div><span class="r">Restaurar</span></div>
  <div class="ln"><div>Fotos<small>1 de 10 · some em 7 dias</small></div><span class="r">Ver ›</span></div></div>
 <div class="lb">Aparelhos</div>
 <div class="bx"><div class="ln"><div>Este celular<small>em dia</small></div><span class="q">agora</span></div>
  <div class="ln"><div>Tablet da loja<small>em dia</small></div><span class="q">há 5 min</span></div>
  <div class="ln"><div>Computador<small>2 mudanças para receber</small></div><span class="q">há 3 h</span></div></div></div>
 <div class="arq"><span>Arquivo de backup (exportar ou importar)</span><span>⌄</span></div>
</div>"""
JS = "h=>{const s=[...document.querySelectorAll('.ajS')].find(e=>/Cópias e nuvem/.test(e.textContent));const b=s.querySelector('button.ajR');let n=b.nextElementSibling;const box=document.createElement('div');box.innerHTML=h;if(n){n.innerHTML='';n.appendChild(box.firstChild)}else s.appendChild(box.firstChild);const r=s.querySelector('.ajRes');if(r)r.textContent='Tudo salvo'}"
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
    B.save(A + 's240_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8825','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,W,H,sc in (('4_nuvem_celular',390,844,'light'),('5_nuvem_celular_escuro',390,844,'dark'),('6_nuvem_pc',1366,768,'light')):
        im={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},device_scale_factor=2 if W<900 else 1,color_scheme=sc,is_mobile=W<700,has_touch=W<1100,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();pg.goto('http://localhost:8825/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700);pg.evaluate("window.__LF.setView('ajustes')");pg.wait_for_timeout(700)
            pg.locator('button.ajR',has_text='Cópias e nuvem').click();pg.wait_for_timeout(1200)
            if modo=='prop': pg.add_style_tag(content=CSS);pg.evaluate(JS,HTML);pg.wait_for_timeout(500)
            pg.locator('button.ajR',has_text='Cópias e nuvem').scroll_into_view_if_needed();pg.evaluate("()=>{const b=[...document.querySelectorAll('button.ajR')].find(e=>/Cópias e nuvem/.test(e.textContent));scrollBy(0,b.getBoundingClientRect().top-(innerWidth<1100?70:24))}");pg.wait_for_timeout(500)
            p='/tmp/s240n_%s_%s.png'%(arq,modo);pg.screenshot(path=p);x=Image.open(p).convert('RGB');im[modo]=x.resize((int(x.width*900/x.height),900)) if W<1100 else x.resize((1300,int(x.height*1300/x.width)));est=pg.evaluate("document.documentElement.scrollWidth>innerWidth+1");c.close()
        print(arq,'largura estourada na proposta:',est)
        folha(arq,'App · Ajustes › Cópias e nuvem · %s'%('celular' if W<700 else 'computador')+(' · escuro' if sc=='dark' else ''),'Estado em uma linha; voltar no tempo por mudança; lixeira de 30 dias para produtos; aparelhos; o arquivo de backup fica recolhido. (Hoje aparece desconectado; a proposta mostra conectado.)',[('HOJE','#b42318',im['hoje']),('PROPOSTA','#1f8a4c',im['prop'])],vertical=W>=1100,larg=62 if W<1100 else 100)
finally: srv.terminate()
