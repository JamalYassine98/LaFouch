import sys,subprocess,time
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
srv=subprocess.Popen(['python3','-m','http.server','8898'],cwd='/home/claude/lafouch/www',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)))
        pg.route('**/__bruto.webm',lambda r:r.fulfill(path='/tmp/gt/'+sys.argv[1],content_type='video/webm'))
        pg.goto('http://localhost:8898/index.html#test');pg.wait_for_function('window.__LF&&window.__LF.S',timeout=30000);pg.set_default_timeout(900000)
        print(pg.evaluate("""async()=>{const L=window.__LF,S=L.S;const b=await (await fetch('/__bruto.webm')).blob();S.giros={T9:{k:'T9|x',ts:1,tipo:b.type}};const t=performance.now();const r=await L.giroPrepara('T9',b);
          return {seg:Math.round((performance.now()-t)/1000),n:r.n,tipo:r.blob.type,kb:Math.round(r.blob.size/1024),guardado:S.giros.T9,toast:(document.querySelector('.toast,#toast,.lfToast')||{}).textContent||''}}"""),er)
        b.close()
finally: srv.kill()
