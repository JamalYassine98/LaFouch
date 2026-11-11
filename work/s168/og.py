import sys
from playwright.sync_api import sync_playwright
T={'pt':('Descubra o <em>grau</em> do seu óculos de leitura','Em 1 minuto, com o Mochi · grátis, pelo celular'),
   'es':('Descubrí la <em>graduación</em> de tus lentes de lectura','En 1 minuto, con Mochi · gratis, desde el celular')}
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1200,'height':630})
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500)
    svg=pg.evaluate("window.__lfMochiSvg?window.__lfMochiSvg():''")
    for lg,(h,s) in T.items():
        pg.set_content('''<html><body style="margin:0"><div style="width:1200px;height:630px;position:relative;overflow:hidden;background:linear-gradient(135deg,#f8eef3 0%,#f4e3ec 100%);font-family:Georgia,serif">
        <img src="http://localhost:8160/og_logo.png" style="position:absolute;left:60px;top:55px;width:215px">
        <div style="position:absolute;left:70px;top:235px;width:560px;font-size:62px;line-height:1.12;color:#2a1f27">'''+h.replace('<em>','<em style="color:#8d3a69">')+'''</div>
        <div style="position:absolute;left:72px;top:470px;font:500 26px Inter,system-ui,sans-serif;color:#6b5a66">'''+s+'''</div>
        <div id="m" style="position:absolute;right:40px;top:40px;width:520px;height:560px">'''+svg+'''</div></div></body></html>''')
        pg.evaluate("(()=>{const s=document.querySelector('#m svg');if(s){s.setAttribute('width','100%');s.setAttribute('height','100%')}})()")
        pg.wait_for_timeout(500);pg.screenshot(path=f'og_mochi_{lg}.jpg',type='jpeg',quality=88)
    b.close()
