# S169 v2: prévia do teste do Mochi (mesmo layout aprovado da v7) com o Mochi de cada temática
from playwright.sync_api import sync_playwright
TX={'pt':('Descubra o <em>grau</em> do seu óculos de leitura','Em 1 minuto, com o Mochi · grátis, pelo celular'),
    'es':('Descubrí la <em>graduación</em> de tus lentes de lectura','En 1 minuto, con Mochi · gratis, desde el celular')}
TEMAS=['natal','anonovo','maes','pais','bf','halloween']
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1200,'height':630})
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    for lg in ('pt','es'):
        h,s=TX[lg]
        for t in TEMAS:
            pg.set_content('''<html><body style="margin:0"><div style="width:1200px;height:630px;position:relative;overflow:hidden;background:linear-gradient(135deg,#f8eef3 0%,#f4e3ec 100%);font-family:Georgia,serif">
            <img src="http://localhost:8160/og_logo.png" style="position:absolute;left:60px;top:55px;width:215px">
            <div style="position:absolute;left:70px;top:235px;width:560px;font-size:62px;line-height:1.12;color:#2a1f27">'''+h.replace('<em>','<em style="color:#8d3a69">')+'''</div>
            <div style="position:absolute;left:72px;top:470px;font:500 26px Inter,system-ui,sans-serif;color:#6b5a66">'''+s+'''</div>
            <div style="position:absolute;right:40px;top:40px;width:520px;height:550px"><img src="http://localhost:8160/og_t_'''+t+'''_b.png" style="width:100%;height:100%;object-fit:contain"></div></div></body></html>''')
            pg.wait_for_timeout(400);pg.screenshot(path=f'og_mochi_{t}_{lg}.jpg',type='jpeg',quality=90)
    b.close()
