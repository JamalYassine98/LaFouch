import json
from playwright.sync_api import sync_playwright
L=json.load(open('/tmp/gzT.json'))
with sync_playwright() as p:
    b=p.chromium.launch();c=b.new_context(locale='es-PY');c.add_init_script("localStorage.setItem('lf_lang','es')")
    pg=c.new_page();pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500)
    r=pg.evaluate("L=>L.map(x=>[x,LFI.tr(x)])",L)
    import re
    falta=[x for x,y in r if x==y and re.search(r'[ãõçáéíóúâêô]|\b(você|não|seu|sua|olho|lente|tela|grau|ler|consigo|perto)\b',x,re.I)]
    print('lang',pg.evaluate("LFI.lang"),'textos',len(r),'sem tradução',len(falta))
    for x in falta: print(' -',x[:110])
    b.close()
