import sys,subprocess,time,base64,json,os
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
arq=sys.argv[1];saida=sys.argv[2];opts=json.loads(sys.argv[3]) if len(sys.argv)>3 else {}
srv=subprocess.Popen(['python3','-m','http.server','8899'],cwd='/tmp/gt',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox','--enable-features=SharedArrayBuffer']);pg=b.new_page();pg.on('console',lambda m:print('  ',m.text,flush=True));pg.on('pageerror',lambda e:print('ERRO',e,flush=True))
        pg.goto('http://localhost:8899/t.html');pg.set_default_timeout(1800000)
        r=pg.evaluate("a=>window.roda(a[0],a[1])",[arq,opts]);open(saida,'wb').write(base64.b64decode(r['b64']));open(saida+'.capa.jpg','wb').write(base64.b64decode(r['capa'].split(',')[1]))
        del r['b64'];del r['capa'];print(json.dumps(r));b.close()
finally: srv.kill()
