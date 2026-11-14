# S246 · botões principais (padrão do "+ Adicionar"): versões mais minimalistas no lugar do vinho cheio. Mesmo trecho da tela real, uma versão por faixa.
import os, subprocess, sys, time
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
s41 = open(A + '../s241/gera.py').read(); j = s41.index('CSS = """') + 9; C241 = s41[j: s41.index('"""', j)]
SEL = ".view .mini:not(.ghost),.view .btn-sc.p,.view #btnAdd,.view .gBtn"
AC = "var(--accent-fg,#8d3a69)"
V = [('HOJE (antes de tudo)', None),
     ('Aprovado antes · vinho cheio', C241 + ".view #btnAdd,.view .mini:not(.ghost){color:#fff!important;-webkit-text-fill-color:#fff}"),
     ('A · fio fino: contorno de 1 px, letra vinho, fundo vazio', C241 + SEL + "{background:transparent!important;color:" + AC + "!important;-webkit-text-fill-color:" + AC + ";border:1px solid color-mix(in srgb," + AC + " 45%,transparent)!important;border-radius:999px!important;box-shadow:none!important;font-weight:600!important}"),
     ('B · só texto: sem contorno nem fundo, letra vinho', C241 + SEL + "{background:transparent!important;color:" + AC + "!important;-webkit-text-fill-color:" + AC + ";border:0!important;box-shadow:none!important;font-weight:600!important;padding-left:6px!important;padding-right:6px!important}"),
     ('C · tinta suave: fundo vinho bem claro, sem contorno', C241 + SEL + "{background:color-mix(in srgb," + AC + " 9%,transparent)!important;color:" + AC + "!important;-webkit-text-fill-color:" + AC + ";border:0!important;border-radius:999px!important;box-shadow:none!important;font-weight:600!important}"),
     ('D · grafite: fundo neutro cheio, sem vinho', C241 + SEL + "{background:#2a1f27!important;color:#fff!important;-webkit-text-fill-color:#fff;border:0!important;border-radius:999px!important;box-shadow:none!important;font-weight:600!important}@media (prefers-color-scheme:dark){" + SEL + "{background:#f3eef2!important;color:#2a1f27!important;-webkit-text-fill-color:#2a1f27}}"),
     ('E · fio neutro: contorno cinza fino, sem vinho', C241 + SEL + "{background:transparent!important;color:var(--text,inherit)!important;-webkit-text-fill-color:currentColor;border:1px solid color-mix(in srgb,currentColor 28%,transparent)!important;border-radius:999px!important;box-shadow:none!important;font-weight:600!important}")]
srv=subprocess.Popen([sys.executable,'-m','http.server','8832','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,sc in (('claro','light'),('escuro','dark')):
        tiras={'estoque':[],'inicio':[]}
        for rot,css in V:
            c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme=sc,is_mobile=True,has_touch=True,service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();pg.goto('http://localhost:8832/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700)
            if css: pg.add_style_tag(content=css)
            pg.evaluate("window.__LF.setView('estoque')");pg.wait_for_timeout(900);pg.screenshot(path='/tmp/s246.png',clip={'x':0,'y':100,'width':390,'height':92});tiras['estoque'].append((rot,Image.open('/tmp/s246.png').convert('RGB')))
            pg.evaluate("window.__LF.setView('inicio')");pg.wait_for_timeout(900);pg.screenshot(path='/tmp/s246.png',clip={'x':0,'y':170,'width':390,'height':150});tiras['inicio'].append((rot,Image.open('/tmp/s246.png').convert('RGB')));c.close()
        for k,nome in (('estoque','Inventário · botão + Adicionar'),('inicio','Início · botões do Guardião')):
            ts=tiras[k];w=ts[0][1].width;h=sum(t[1].height+70 for t in ts)+110;B=Image.new('RGB',(w+80,h),'#ece6ea');d=ImageDraw.Draw(B);d.text((40,28),'App · %s · %s'%(nome,arq),font=F(30,1),fill='#2a1a28');y=96
            for rot,im in ts: d.text((40,y),rot,font=F(21,1),fill='#b42318' if 'HOJE' in rot or 'cheio' in rot else '#1f8a4c');B.paste(im,(40,y+34));d.rectangle((39,y+33,40+im.width,y+34+im.height),outline='#c9bcc5');y+=im.height+70
            B.save(A+'s246_%s_%s.jpg'%(k,arq),quality=88);print('ok',k,arq,flush=True)
finally: srv.terminate()
