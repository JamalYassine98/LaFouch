# câmera falsa do Chromium: abre a gravação do giro no Estúdio e vê anel, lista, Parar (claro/escuro não muda: a câmera é sempre preta)
import sys,subprocess,time
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/work/kit');import kit
srv=subprocess.Popen(['python3','-m','http.server','8898'],cwd='/home/claude/lafouch/www',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
        for nome,vp in (('cel',(390,844)),('pc',(1366,768))):
            c=b.new_context(viewport={'width':vp[0],'height':vp[1]},service_workers='block',permissions=['camera']);pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)))
            pg.goto('http://localhost:8898/index.html#test');pg.wait_for_function('window.__LF&&window.__LF.S',timeout=30000)
            pg.evaluate("()=>{const s=document.createElement('script');s.textContent='';}")
            ok=pg.evaluate("()=>typeof window.__LF.estGiro")
            print(nome,'estGiro exposto:',ok)
            if ok!='function': continue
            pg.evaluate("()=>window.__LF.estGiro({})");pg.wait_for_selector('.estCam #egPara',timeout=15000);time.sleep(6)
            m=pg.evaluate("""()=>{const r=s=>{const e=document.querySelector(s).getBoundingClientRect();return [Math.round(e.left),Math.round(e.top),Math.round(e.width),Math.round(e.height)]};return {anel:r('.egAnel'),lista:r('.egLista'),para:r('#egPara'),tag:document.querySelector('.ecTag').textContent,gr:document.querySelector('#egGr').textContent,on:[...document.querySelectorAll('.egLista .on')].map(e=>e.textContent)}}""")
            print(nome,m);pg.screenshot(path='/tmp/gt/cam_%s.png'%nome)
            pg.click('#egPara');time.sleep(1.5);print(nome,'depois de Parar: câmera aberta?',pg.evaluate("()=>!!document.querySelector('.estCam #egPara')"),er)
            c.close()
        b.close()
finally: srv.kill()
