import subprocess,sys,time,json
from prop import CSS, JS
from playwright.sync_api import sync_playwright
OLHO=open('../kit/olho.js').read()
srv=subprocess.Popen([sys.executable,'-m','http.server','8805','-d','../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for modo in ('hoje','prop'):
        c=b.new_context(viewport={'width':2560,'height':1440},service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
        pg=c.new_page();pg.goto('http://localhost:8805/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(600)
        if modo=='prop': pg.add_style_tag(content=CSS);pg.evaluate(JS)
        for v in ('inicio','caixa'):
            pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1000)
            for x in pg.evaluate(OLHO):
                if x['r'] in('fileira torta','apagado'): print(modo,v,x['r'],x['n'],json.dumps(x['ex'],ensure_ascii=False)[:300])
finally: srv.terminate()
